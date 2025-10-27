// services/AdminPublicacionesService.js
import { supabase } from "../screens/supabase";
import { obtenerNombreUsuario } from "./usuariosService";
/* =========================
   Acciones de moderación
   ========================= */

export async function obtenerNombrePublicacion(publicacionId){
    const { data, error } = await supabase
    .from('Publicaciones')
    .select('titulo')
    .eq('id', publicacionId)
    .single();
    if (error) {
        console.error("Error al obtener nombre de publicación:", error);
        return { ok: false, error };
    }
    return { ok: true, data: data?.titulo ?? "Sin título" };
}


/** Aprobar: registra decisión y setea estado_de_revision = 'publicada' */
export async function aprobarPublicacion(id) {
  const { error: decError } = await supabase
    .from("Decisiones_en_publicaciones")
    .insert([{ id_publicacion: id, accion: "aprobar" }]);
  if (decError) {
    console.error("Error al registrar decisión (aprobar):", decError);
    return false;
  }

  // 🔥 CAMBIO: usar SOLO estado_de_revision (no existe 'estado')
  const { error: updError } = await supabase
    .from("Publicaciones")
    .update({ estado_de_revision: "publicada" }) // 🔥 CAMBIO
    .eq("id", id);
  if (updError) {
    console.error("Error al actualizar publicación (aprobar):", updError);
    return false;
  }

  return true;
}

/** Rechazar: registra decisión y setea estado_de_revision = 'rechazada' */
export async function rechazarPublicacion(id) {
  const { error: decError } = await supabase
    .from("Decisiones_en_publicaciones")
    .insert([{ id_publicacion: id, accion: "rechazar" }]);
  if (decError) {
    console.error("Error al registrar decisión (rechazar):", decError);
    return false;
  }

  // 🔥 CAMBIO
  const { error: updError } = await supabase
    .from("Publicaciones")
    .update({ estado_de_revision: "rechazada" }) // 🔥 CAMBIO
    .eq("id", id);
  if (updError) {
    console.error("Error al actualizar publicación (rechazar):", updError);
    return false;
  }

  return true;
}

/** Eliminar (soft-delete): registra decisión y setea estado_de_revision = 'eliminada' */
export async function eliminarPublicacion(id) {
  const { error: decError } = await supabase
    .from("Decisiones_en_publicaciones")
    .insert([{ id_publicacion: id, accion: "eliminar" }]);
  if (decError) {
    console.error("Error al registrar decisión (eliminar):", decError);
    return false;
  }

  // 🔥 CAMBIO: soft-delete usando estado_de_revision
  const { error: updError } = await supabase
    .from("Publicaciones")
    .update({ estado_de_revision: "eliminada" }) // 🔥 CAMBIO
    .eq("id", id);
  if (updError) {
    console.error("Error al marcar como eliminada:", updError);
    return false;
  }

  return true;
}

/* =========================
   Listados
   ========================= */

/**
 * Admin: trae TODO. El estado visual sale de estado_de_revision:
 * 'publicada' | 'rechazada' | 'eliminada'
 */
export async function obtenerPublicaciones() {
  const { data, error } = await supabase
    .from("Publicaciones")
    .select(
      // 🔥 CAMBIO: quitar 'estado', traer sólo lo que existe
      "id,titulo,descripcion,created_at,categoria,area,estado_de_revision,id_autor"
    );
  if (error) {
    console.error("Error al obtener publicaciones:", error);
    return [];
  }

  const publicacionesConAutor = await Promise.all(
    (data ?? []).map(async (pub) => {
      const { ok, data: autorData } = await obtenerNombreUsuario(pub.id_autor);
      const authorName = ok ? autorData : "Desconocido";

      // 🔥 CAMBIO: estado visual directamente del enum
      const visualState = pub.estado_de_revision ?? "publicada";

      return {
        id: pub.id,
        title: pub.titulo,
        author: authorName,
        authorId: pub.id_autor,
        state: visualState,                 // 🔥 CAMBIO
        createdAt: pub.created_at,
        category: pub.categoria,
        area: pub.area,
        _estadoRevision: pub.estado_de_revision, // opcional debug
      };
    })
  );

  return publicacionesConAutor;
}

/**
 * Público: SOLO visibles (estado_de_revision = 'publicada')
 * -> Así las 'eliminada' NO aparecen en el feed público.
 */
export async function obtenerPublicacionesPublicas() {
  const { data, error } = await supabase
    .from("Publicaciones")
    .select("id,titulo,created_at,categoria,area,id_autor")
    .eq("estado_de_revision", "publicada"); // 🔥 CAMBIO
  if (error) {
    console.error("Error al obtener publicaciones públicas:", error);
    return [];
  }

  const withAuthor = await Promise.all(
    (data ?? []).map(async (pub) => {
      const { data: autorData, error: autorError } = await supabase
        .from("usuarios")
        .select("nombre")
        .eq("id", pub.id_autor)
        .single();

      const authorName = autorError ? "Desconocido" : (autorData?.nombre ?? "—");

      return {
        id: pub.id,
        title: pub.titulo,
        author: authorName,
        authorId: pub.id_autor,
        state: "publicada",
        createdAt: pub.created_at,
        category: pub.categoria,
        area: pub.area,
      };
    })
  );

  return withAuthor;
}

/* =========================
   Detalle
   ========================= */

export async function obtenerDetallePublicacion(id) {
  try {
    const { data: pub, error: errorPub } = await supabase
      .from("Publicaciones")
      .select("*")
      .eq("id", id)
      .single();
    if (errorPub || !pub) {
      console.error("Error al obtener detalle de publicación:", errorPub);
      return null;
    }

    const { count: commentsCount, error: errorComentarios } = await supabase
      .from("Comentarios")
      .select("id", { count: "exact", head: true })
      .eq("id_publicacion", id);
    if (errorComentarios) {
      console.error("Error al obtener cantidad de comentarios:", errorComentarios);
      return null;
    }

    const { count: likesCount, error: errorLikes } = await supabase
      .from("votos")
      .select("*", { count: "exact", head: true })
      .eq("id_publicacion", id)
      .eq("valor", 1);
    if (errorLikes) {
      console.error("Error al obtener likes:", errorLikes);
      return null;
    }

    const { count: dislikesCount, error: errorDislikes } = await supabase
      .from("votos")
      .select("*", { count: "exact", head: true })
      .eq("id_publicacion", id)
      .eq("valor", -1);
    if (errorDislikes) {
      console.error("Error al obtener dislikes:", errorDislikes);
      return null;
    }

    const { data: user, error: errorUsuario } = await supabase
      .from("usuarios")
      .select("nombre")
      .eq("id", pub.id_autor) // 🔥 CAMBIO
      .single();
    if (errorUsuario || !user) {
      console.error("Error al obtener usuario de la publicación:", errorUsuario);
      return null;
    }


    // 🔥 CAMBIO: estado visual directo del enum
    const visualState = pub.estado_de_revision ?? "publicada";

    return {
      id: pub.id,
      title: pub.titulo,
      author: user.nombre,
      authorId: pub.id_autor,            // 🔥 CAMBIO
      state: visualState,                // 🔥 CAMBIO
      body: pub.descripcion,
      createdAt: pub.created_at,
      category: pub.categoria,
      area: pub.area,
      tags: [],
      reports: 0,
      portadaUri: pub.portadaUri,
      comments: commentsCount,
      likes: likesCount,
      dislikes: dislikesCount,
      equipo_colaborador: pub.equipo_colaborador,
      _estadoRevision: pub.estado_de_revision, // opcional debug
    };
  } catch (err) {
    console.error("Error inesperado en obtenerDetallePublicacion:", err);
    return null;
  }
}
