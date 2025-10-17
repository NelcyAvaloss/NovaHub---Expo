import { supabase } from "../screens/supabase";

// intenta varios alias por si tu esquema no usa "email"
function pickEmail(row) {
  return (
    row.email ??
    row.correo ??
    row.correo_electronico ??
    row.mail ??
    row.email_address ??
    "" // fallback
  );
}

function pickRole(row) {
  return row.rol ?? row.role ?? "user";
}

function pickStatus(row) {
  return row.estado ?? row.status ?? "activo";
}



function mapUsuario(row) {
  return {
    id: row.id,
    name: row.nombre ?? row.name ?? "Sin nombre",
    email: pickEmail(row),
    role: pickRole(row),
    status: pickStatus(row),
    joinedAt: row.created_at ?? row.creado_el ?? null,
    lastSeen: row.ultima_vez ?? row.last_seen ?? row.ultimo_login ?? null,
  };
}

export async function obtenerUsuarios() {
  // ⚠️ usamos '*' para no fallar por nombres de columnas distintos
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener usuarios:", error);
    return { ok: false, error };
  }

  // Log (1 sola vez) para que veas qué columnas vienen
  if ((data?.length ?? 0) > 0) {
    const sample = data[0];
    // console.log("usuarios sample keys:", Object.keys(sample)); // descomenta si quieres ver en consola
  }

  return { ok: true, data: (data ?? []).map(mapUsuario) };
}

export async function contadoresUsuarios() {
  const totalQ = supabase.from("usuarios").select("*", { count: "exact", head: true });
  const activosQ = supabase.from("usuarios").select("*", { count: "exact", head: true }).eq("estado", "activo");
  const bloqueadosQ = supabase.from("usuarios").select("*", { count: "exact", head: true }).eq("estado", "bloqueado");

  const [{ count: total, error: e1 }, { count: activos, error: e2 }, { count: bloqueados, error: e3 }] =
    await Promise.all([totalQ, activosQ, bloqueadosQ]);

  if (e1 || e2 || e3) return { ok: false, error: e1 || e2 || e3 };
  return { ok: true, data: { total: total ?? 0, activos: activos ?? 0, bloqueados: bloqueados ?? 0 } };
}

export async function obtenerUsuarioPorId(id) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { ok: false, error };
  return { ok: true, data: mapUsuario(data) };
}

export async function actualizarEstadoUsuario(id, nextEstado) {
  const { error } = await supabase
    .from("usuarios")
    .update({ estado: nextEstado })
    .eq("id", id);

  if (error) return { ok: false, error };
  return { ok: true };
}

export async function eliminarUsuario(id) {
  const { error } = await supabase.from("usuarios").delete().eq("id", id);
  if (error) return { ok: false, error };
  return { ok: true };
}
