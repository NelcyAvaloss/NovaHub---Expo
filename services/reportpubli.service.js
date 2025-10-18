// services/reportes.servicio.js
// Servicio centralizado para crear y consultar reportes en NovaHub
// Target válido: 'post' | 'comment' | 'reply' | 'subreply'

import { supabase } from "../screens/supabase";

/** Motivos válidos (deben calzar con tu enum report_reason en Supabase) */
export const REPORT_REASONS = [
  'spam',
  'agresion',
  'nsfw',
  'contenido_enganoso',
  'sin_clasificar',
];


/** Helper: usuario actual */
async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) return null;
  return data.user.id;
}

/** Valida reason contra el enum local */
function normalizeReason(reason) {
  const r = String(reason || "").toLowerCase();
  return REPORT_REASONS.includes(r) ? r : null;
}

/** Construye el payload para la tabla reports según target */
function buildPayload({ target, targetId, postId, reason, details, reporterId }) {
  const base = {
    reporter_id: reporterId,
    reason,
    details: details?.trim() || null,
    // Enlazamos siempre el post como contexto (si lo tienes a mano)
    post_id: postId || null,
  };

  switch (target) {
    case "post":
      return { ...base, comment_id: null, reply_id: null, subreply_id: null, post_id: targetId };
    case "comment":
      return { ...base, comment_id: targetId, reply_id: null, subreply_id: null };
    case "reply":
      return { ...base, comment_id: null, reply_id: targetId, subreply_id: null };
    case "subreply":
      return { ...base, comment_id: null, reply_id: null, subreply_id: targetId };
    default:
      return null;
  }
}

/**
 * Crea un reporte.
 * @param {Object} params
 * @param {'post'|'comment'|'reply'|'subreply'} params.target
 * @param {string} params.targetId - id del post/comentario/respuesta/sub-respuesta
 * @param {string} [params.postId] - id del post (contexto; recomendado)
 * @param {string} params.reason - uno de REPORT_REASONS
 * @param {string} [params.details] - nota opcional
 * @returns {Promise<{ok:boolean, data?:any, error?:string, code?:string}>}
 */
export async function crearReporte(params) {
  try {
    const reporterId = await getCurrentUserId();
    if (!reporterId) {
      return { ok: false, error: "NO_AUTH", code: "NO_AUTH" };
    }

    const reason = normalizeReason(params?.reason);
    if (!reason) {
      return { ok: false, error: "MOTIVO_INVALIDO", code: "BAD_REASON" };
    }

    const payload = buildPayload({
      target: params?.target,
      targetId: params?.targetId,
      postId: params?.postId,
      reason,
      details: params?.details,
      reporterId,
    });

    if (!payload) {
      return { ok: false, error: "TARGET_INVALIDO", code: "BAD_TARGET" };
    }

    const { data, error } = await supabase.from("reports").insert(payload).select("*").single();

    if (error) {
      // Manejo fino de errores típicos (unique/rate-limit/RLS)
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("duplicate key") || msg.includes("unique") || error.code === "23505") {
        return { ok: false, error: "YA_REPORTADO", code: "ALREADY_REPORTED" };
      }
      if (msg.includes("too many reports")) {
        return { ok: false, error: "RATE_LIMIT", code: "RATE_LIMIT" };
      }
      if (error.code === "42501") {
        return { ok: false, error: "SIN_PERMISOS", code: "RLS_DENIED" };
      }
      return { ok: false, error: msg || "ERROR_DESCONOCIDO", code: error.code || "UNKNOWN" };
    }

    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

/**
 * Verifica si el usuario actual ya reportó un target.
 * Devuelve true/false (útil para deshabilitar el botón "Reportar").
 */
export async function yaReportadoPorMi({ target, targetId }) {
  const reporterId = await getCurrentUserId();
  if (!reporterId) return false;

  let query = supabase.from("reports").select("id", { count: "exact", head: true }).eq("reporter_id", reporterId);

  switch (target) {
    case "post":
      query = query.eq("post_id", targetId);
      break;
    case "comment":
      query = query.eq("comment_id", targetId);
      break;
    case "reply":
      query = query.eq("reply_id", targetId);
      break;
    case "subreply":
      query = query.eq("subreply_id", targetId);
      break;
    default:
      return false;
  }

  const { count, error } = await query;
  if (error) return false;
  return (count ?? 0) > 0;
}

/**
 * Obtiene mis reportes para un set de IDs (para pintar badges en la UI).
 * Cualquiera de los arrays puede venir vacío o undefined.
 * Retorna un mapa { post: Set<string>, comment: Set<string>, reply: Set<string>, subreply: Set<string> }
 */
export async function misReportesParaTargets({ postIds = [], commentIds = [], replyIds = [], subreplyIds = [] }) {
  const reporterId = await getCurrentUserId();
  if (!reporterId) return { post: new Set(), comment: new Set(), reply: new Set(), subreply: new Set() };

  let query = supabase.from("reports").select("post_id, comment_id, reply_id, subreply_id").eq("reporter_id", reporterId);

  // Filtra solo lo visible para ahorrar tráfico (opcional)
  const filters = [];
  if (postIds.length) filters.push({ col: "post_id", ids: postIds });
  if (commentIds.length) filters.push({ col: "comment_id", ids: commentIds });
  if (replyIds.length) filters.push({ col: "reply_id", ids: replyIds });
  if (subreplyIds.length) filters.push({ col: "subreply_id", ids: subreplyIds });

  // Supabase no permite múltiples .in() condicionales encadenados con OR simple,
  // así que si viene más de un grupo, hacemos varias consultas y unimos resultados.
  if (filters.length <= 1) {
    if (filters.length === 1) {
      const { col, ids } = filters[0];
      query = query.in(col, ids);
    }
    const { data, error } = await query;
    if (error) return { post: new Set(), comment: new Set(), reply: new Set(), subreply: new Set() };
    return foldReportRows(data);
  } else {
    const results = await Promise.all(
      filters.map(f => supabase
        .from("reports")
        .select("post_id, comment_id, reply_id, subreply_id")
        .eq("reporter_id", reporterId)
        .in(f.col, f.ids)
      )
    );

    const merged = [];
    for (const r of results) {
      if (!r.error && Array.isArray(r.data)) merged.push(...r.data);
    }
    return foldReportRows(merged);
  }
}

/** Compacta filas en sets por tipo de target */
function foldReportRows(rows = []) {
  const out = { post: new Set(), comment: new Set(), reply: new Set(), subreply: new Set() };
  rows.forEach(r => {
    if (r.post_id) out.post.add(String(r.post_id));
    if (r.comment_id) out.comment.add(String(r.comment_id));
    if (r.reply_id) out.reply.add(String(r.reply_id));
    if (r.subreply_id) out.subreply.add(String(r.subreply_id));
  });
  return out;
}

//prueba de commit
