import { supabase } from "../screens/supabase";

export async function aprobarPublicacion(id) {
    // Inserta un registro en Decisiones_en_publicaciones con accion 'aprobar', 
    const { data, error } = await supabase
        .from('Decisiones_en_publicaciones')
        .insert([{ id_publicacion: id, accion: 'aprobar' }]);
        if (error) {
            console.error('Error al aprobar publicación:', error);
            return false;
        }
        return true;
}

export async function rechazarPublicacion(id) {
    // Inserta un registro en Decisiones_en_publicaciones con accion 'rechazar'
    const { data, error } = await supabase
        .from('Decisiones_en_publicaciones')
        .insert([{ id_publicacion: id, accion: 'rechazar' }]);
        if (error) {
            console.error('Error al rechazar publicación:', error);
            return false;
        }
        return true;
}

export async function obtenerDetallePublicacion(id) {
    //Data de la publicación
    const { pub, error: errorPub } = await supabase
        .from('Publicaciones')
        .select('*')
        .eq('id', id)
        .single();
    if (errorPub) {
        console.error('Error al obtener detalle de publicación:', error);
        return null;
    }

    //Cantidad de comentarios
    const { comments, error: errorComentarios } = await supabase
        .from('Comentarios')
        .select('id', { count: 'exact' })
        .eq('id_publicacion', id);
    if (errorComentarios) {
        console.error('Error al obtener cantidad de comentarios:', errorComentarios);
        return null;
    }

    //Cantidad de likes y dislikes (Es like si el campo valor es 1 y dislike si es -1)
    const { likes, error: errorLikes } = await supabase
  .from('votos')
  .select('*', { count: 'exact', head: true })
  .eq('id_publicacion', id)
  .eq('valor', 1);
    if (errorLikes) {
        console.error('Error al obtener cantidad de likes:', errorLikes);
        return null;
    }

    const { dislikes, error: errorDislikes } = await supabase
        .from('votos')
        .select('*', { count: 'exact', head: true })
        .eq('id_publicacion', id)
        .eq('valor', -1);
    if (errorDislikes) {
        console.error('Error al obtener cantidad de dislikes:', errorDislikes);
        return null;
    }

    //Cantidad de reportes (De momento no se usa)
    const reports =0;
    //portada

    //Usuario que publicó (se obtiene a partir del id de usuario en la publicación)
    const { user, error: errorUsuario } = await supabase
        .from('Usuarios')
        .select('nombre')
        .eq('id', pub.id_usuario)
        .single();
    if (errorUsuario) {
        console.error('Error al obtener usuario de la publicación:', errorUsuario);
        return null;
    }
    return {
        id: pub.id,
        tittle: pub.titulo,
        author: user.nombre,
        authorId: pub.id_usuario,
        state: pub.estado_revision,
        body: pub.descripcion,
        createdAt: pub.created_at,
        category: pub.categoria,
        area: pub.area,
        tags: [],
        reports: reports,
        previewUri: null,
        comments: comments,
        likes: likes,
        dislikes: dislikes,
        equipo_colaborador: pub.equipo_colaborador,
    };
}

export async function obtenerPublicaciones() {
    const { data, error } = await supabase
        .from('Publicaciones')
        .select('*');
    console.log(data);
    if (error) {
        console.error('Error al obtener publicaciones:', error);
        return [];
    }   
    // Obtener el nombre del autor para cada publicación
    const publicacionesConAutor = await Promise.all(
        data.map(async (publicacion) => {
            const { data: autorData, error: autorError } = await supabase
                .from('Usuarios')
                .select('nombre')
                .eq('id', publicacion.id_autor)
                .single();
            if (autorError) {
                console.error('Error al obtener nombre del autor:', autorError);
                return { ...publicacion, nombreAutor: 'Desconocido' };
            }
            return { 
                id: publicacion.id,
                tittle: publicacion.titulo,
                author: autorData.nombre,
                authorId: publicacion.id_autor,
                state: publicacion.estado_de_revision,
                createdAt: publicacion.created_at,
                category: publicacion.categoria,
                area: publicacion.area,
             };
        })
    );

    return publicacionesConAutor;
}

