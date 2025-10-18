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
    console.log('Rechazando publicación con id:', id);
    const { data, error } = await supabase
        .from('Decisiones_en_publicaciones')
        .insert([{ id_publicacion: id, accion: 'rechazar' }]);
        if (error) {
            console.error('Error al rechazar publicación:', error);
            return false;
        }
        return true;
}

export async function eliminarPublicacion(id) {
   console.log('Eliminando publicación con id:', id);
    const { data, error } = await supabase
        .from('Decisiones_en_publicaciones')
        .insert([{ id_publicacion: id, accion: 'eliminar' }]);
        if (error) {
            console.error('Error al eliminar publicación:', error);
            return false;
        }
        console.log('Publicación eliminada con éxito:', data);
        return true;
}


// ...existing code...
export async function obtenerDetallePublicacion(id) {
    try {
        //Data de la publicación
        console.log('A');
        const { data: pub, error: errorPub } = await supabase
            .from('Publicaciones')
            .select('*')
            .eq('id', id)
            .single();
        if (errorPub || !pub) {
            console.error('Error al obtener detalle de publicación:', errorPub);
            return null;
        }

        //Cantidad de comentarios (solo count)
        const { count: commentsCount, error: errorComentarios } = await supabase
            .from('Comentarios')
            .select('id', { count: 'exact', head: true })
            .eq('id_publicacion', id);
        if (errorComentarios) {
            console.error('Error al obtener cantidad de comentarios:', errorComentarios);
            return null;
        }

        //Cantidad de likes y dislikes (valor = 1 o -1) usando head para solo count
        const { count: likesCount, error: errorLikes } = await supabase
            .from('votos')
            .select('*', { count: 'exact', head: true })
            .eq('id_publicacion', id)
            .eq('valor', 1);
        if (errorLikes) {
            console.error('Error al obtener cantidad de likes:', errorLikes);
            return null;
        }

        const { count: dislikesCount, error: errorDislikes } = await supabase
            .from('votos')
            .select('*', { count: 'exact', head: true })
            .eq('id_publicacion', id)
            .eq('valor', -1);
        if (errorDislikes) {
            console.error('Error al obtener cantidad de dislikes:', errorDislikes);
            return null;
        }

        //Cantidad de reportes (De momento no se usa)
        const reports = 0;
        //portada
        console.log('B');

        //Usuario que publicó (se obtiene a partir del id de usuario en la publicación)
        const { data: user, error: errorUsuario } = await supabase
                .from('usuarios')
                .select('nombre')
                .eq('id', pub.id_autor)
                .single();
        console.log('C');

        if (errorUsuario || !user) {
            console.error('Error al obtener usuario de la publicación:', errorUsuario);
            return null;
        }
        return {
            id: pub.id,
            title: pub.titulo,
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
            comments: commentsCount,
            likes: likesCount,
            dislikes: dislikesCount,
            equipo_colaborador: pub.equipo_colaborador,
        };
    } catch (err) {
        console.error('Error inesperado en obtenerDetallePublicacion:', err);
        return null;
    }
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
                .from('usuarios')
                .select('nombre')
                .eq('id', publicacion.id_autor)
                .single();
            if (autorError) {
                console.error('Error al obtener nombre del autor:', autorError);
                return { ...publicacion, nombreAutor: 'Desconocido' };
            }
            return { 
                id: publicacion.id,
                title: publicacion.titulo,
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

