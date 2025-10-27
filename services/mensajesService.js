import { supabase } from "../screens/supabase";
import { obtenerNombreUsuario } from "./usuariosService";
import {obtenerNombrePublicacion} from "./AdminPublicacionesService";

const tabla_tipo={
        'Comentario':'Comentarios',
        'Respuesta':'Respuestas',
        'SubRespuesta':'Sub_Respuestas'
    };
export async function obtenerDetalleMensaje(id, tipoMensaje) {

    const { data, error } = await supabase
    .from(tabla_tipo[tipoMensaje])
    .select('*')
    .eq('id', id)
    .single();

    //Añadir nombre de autor 
    if (data) {
      const { ok, data: nombreAutor } = await obtenerNombreUsuario(data.id_usuario);
        if (ok) {
            data.nombreAutor = nombreAutor;
        } else {
            data.nombreAutor = "Sin nombre";
        }
    }
    //Añadir título de publicación si es comentario
    if (data && tipoMensaje === 'Comentario') {
      const { ok, data: tituloPublicacion } = await obtenerNombrePublicacion(data.id_publicacion);
        if (ok) {
            data.tituloPublicacion = tituloPublicacion;
        } else {
            data.tituloPublicacion = "Sin título";
        }
    }
    if (error) {
        console.error('Error al obtener detalle del mensaje:', error);
        return { ok: false, error };
    }
    console.log('Detalle del mensaje:', data); 

    return { ok: true, data };
    
}

export async function actualizarEstadoMensaje(id, tipoMensaje, accion) {
    const { error } = await supabase
    .from("Decisiones_en_mensajes")
    .insert({ id_mensaje: id, tipo_mensaje: tipoMensaje, accion: accion });
    if (error) {
        console.error('Error al actualizar estado del mensaje:', error);
        return { ok: false, error };
    }
    return { ok: true };
}
