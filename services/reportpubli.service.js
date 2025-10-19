// services/reportpubli.service.js
// Reportes de usuario -> tabla public."Reportes"

import { supabase } from "../screens/supabase";

// Ajusta estos valores al enum de tu BD si difieren
export const REPORT_REASONS = [
  "spam",
  "agresion",
  "nsfw",
  "contenido_enganoso",
  "sin_clasificar",
];

// Mapea nuestros tipos a tu enum objetivos_reporte
const TARGET_MAP = {
  post: "publicacion",
  comment: "comentario",
  reply: "respuesta",
  subreply: "subrespuesta",
};

// Estado inicial del reporte (enum estados_reporte)
const DEFAULT_REPORT_STATE = "abierto";

/* ===================== helpers ===================== */
async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) return null;
  return data.user.id;
}

function normalizeReason(reason) {
  const r = String(reason || "").toLowerCase();
  return REPORT_REASONS.includes(r) ? r : null;
}

function normalizeTarget(target) {
  const key = String(target || "").toLowerCase();
  return TARGET_MAP[key] || null;
}

/* ===================== API ===================== */

/**
 * Crea un reporte en public."Reportes"
 * @param {{
 *   target: 'post'|'comment'|'reply'|'subreply',
 *   targetId: string|number,
 *   reason: string,              // uno de REPORT_REASONS
 *   details?: string             // notas opcionales
 * }} params
 */
export async function crearReporte(params = {}) {
  const reporterId = await getCurrentUserId();
  if (!reporterId) return { ok: false, code: "NO_AUTH", error: "NO_AUTH" };

  const reason = normalizeReason(params.reason);
  if (!reason) return { ok: false, code: "BAD_REASON", error: "MOTIVO_INVALIDO" };

  const tipo = normalizeTarget(params.target);
  if (!tipo) return { ok: false, code: "BAD_TARGET", error: "TARGET_INVALIDO" };

  const id_objetivo = String(params.targetId || "").trim();
  if (!id_objetivo) return { ok: false, code: "BAD_TARGET_ID", error: "TARGET_ID_REQUERIDO" };

  // 1) Evita duplicado: ya reporté este objetivo
  const { count: ya, error: qErr } = await supabase
    .from("Reportes")
    .select("id", { count: "exact", head: true })
    .eq("reportado_por", reporterId)
    .eq("tipo_objetivo", tipo)
    .eq("id_objetivo", id_objetivo);

  if (!qErr && (ya ?? 0) > 0) {
    return { ok: false, code: "ALREADY_REPORTED", error: "YA_REPORTADO" };
  }

  // 2) Insert
  const { data, error } = await supabase
    .from("Reportes")
    .insert({
      razón: reason,
      tipo_objetivo: tipo,
      id_objetivo,
      reportado_por: reporterId,
      estado: DEFAULT_REPORT_STATE,     // 'abierto'
      notas: (params.details || "").trim() || null,
      // fecha: se recomienda DEFAULT now() en la BD
    })
    .select("*")
    .single();

  if (error) {
    const msg = (error.message || "").toLowerCase();
    // devoluciones coherentes con UI
    if (msg.includes("duplicate") || error.code === "23505") {
      return { ok: false, code: "ALREADY_REPORTED", error: "YA_REPORTADO" };
    }
    if (error.code === "42501") {
      return { ok: false, code: "RLS_DENIED", error: "SIN_PERMISOS" };
    }
    return { ok: false, code: error.code || "UNKNOWN", error: error.message || "ERROR_DESCONOCIDO" };
  }

  return { ok: true, data };
}

/**
 * Devuelve si YO ya reporté ese target (para deshabilitar botón/mostrar badge)
 */
export async function yaReportadoPorMi({ target, targetId }) {
  const reporterId = await getCurrentUserId();
  if (!reporterId) return false;

  const tipo = normalizeTarget(target);
  if (!tipo) return false;

  const { count, error } = await supabase
    .from("Reportes")
    .select("id", { count: "exact", head: true })
    .eq("reportado_por", reporterId)
    .eq("tipo_objetivo", tipo)
    .eq("id_objetivo", String(targetId));

  if (error) return false;
  return (count ?? 0) > 0;
}

/**
 * Para pintar “Reportado” en listas: retorna sets por tipo
 */
export async function misReportesParaTargets({ postIds = [], commentIds = [], replyIds = [], subreplyIds = [] }) {
  const reporterId = await getCurrentUserId();
  const empty = { post: new Set(), comment: new Set(), reply: new Set(), subreply: new Set() };
  if (!reporterId) return empty;

  const batches = [];
  if (postIds?.length) batches.push({ tipo: "publicacion", ids: postIds, key: "post" });
  if (commentIds?.length) batches.push({ tipo: "comentario", ids: commentIds, key: "comment" });
  if (replyIds?.length) batches.push({ tipo: "respuesta", ids: replyIds, key: "reply" });
  if (subreplyIds?.length) batches.push({ tipo: "subrespuesta", ids: subreplyIds, key: "subreply" });

  const out = { ...empty };
  await Promise.all(
    batches.map(async (b) => {
      const { data, error } = await supabase
        .from("Reportes")
        .select("id_objetivo")
        .eq("reportado_por", reporterId)
        .eq("tipo_objetivo", b.tipo)
        .in("id_objetivo", b.ids.map(String));
      if (!error && Array.isArray(data)) {
        data.forEach(r => out[b.key].add(String(r.id_objetivo)));
      }
    })
  );

  return out;
}
