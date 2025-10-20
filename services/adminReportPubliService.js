import { supabase } from "../screens/supabase";

const motivosDeReporte = [
  "Spam",
  "Lenguaje ofensivo",
  "Acoso/Agresión",
  "NSFW",
  "Contenido engañoso",
  "Seguridad",
  "Privacidad",
  "Otro",
];
async function obtenerNombreUsuario(userId){
    const { data, error } = await supabase
    .from('usuarios')
    .select('nombre')
    .eq('id', userId)
    .single();
    if (error) {
        console.error('Error al obtener nombre de usuario:', error);
        return null;
    }
    return data.nombre;
}
async function obtenerNombreObjetivo(tipoObjetivo, objetivoId){
        const tabla_tipo={
            'publicacion':'Publicaciones',
            'comentario':'Comentarios',
            'respuesta':'Respuestas',
            'sub respuesta':'Sub_Respuestas',
            'usuario':'usuarios'
        };
        const campo_tipo={
            'publicacion':'titulo',
            'comentario':'contenido',
            'respuesta':'contenido',
            'sub respuesta':'contenido',
            'usuario':'nombre'
        };

        const { data, error } = await supabase
        .from(tabla_tipo[tipoObjetivo])
        .select(campo_tipo[tipoObjetivo])
        .eq('id', objetivoId)
        .single();
        if (error) {
            console.log('Error al obtener nombre del objetivo:', error);
            return null;
        }
        return data[campo_tipo[tipoObjetivo]];
}

async function mapearReporte(reporte){
    const nombreUsuario = await obtenerNombreUsuario(reporte.reportado_por);
    const targetId = await obtenerNombreObjetivo(reporte.tipo_objetivo, reporte.id_objetivo);
    // Si no hay targetId, se debe eliminar de la lista
    if (!targetId) return null;
    return {
        id: reporte.id,
        reason: reporte.razón,
        category: reporte.razón,
        state: reporte.estado,
        targetType: reporte.tipo_objetivo,
        targetId: targetId,
        reporter: nombreUsuario,
        details: reporte.detalles,
        createdAt: reporte.fecha
    };
}


export async function obtenerReportes(){
    //Se obtienen todos los reportes que no tengan estado 'eliminado'
    const { data, error } = await supabase
    .from('Reportes')
    .select('*')
    .not('estado', 'eq', 'eliminado');

    if (error) {
        console.error('Error al obtener reportes:', error);
        return [];
    }
    return Promise.all(data.map(async (reporte) => await mapearReporte(reporte))).then(mappedReports => mappedReports.filter(report => report !== null));

}

export async function actualizarEstadoReporte(reporteId, accion){
    try{
    console.log(`Actualizando estado del reporte ${reporteId} con acción: ${accion}`);
    const idUsuarioActual = await getCurrentUserId();
    const { data, error } = await supabase
    .from('Decisiones_en_reportes')
    .insert({
        id_reporte: reporteId,
        id_administrador: idUsuarioActual,
        accion: accion
    })
    .select('*')
    .single();
    if (error) {
        console.error('Error al actualizar estado del reporte:', error);
        return null;
    }
    console.log('Estado del reporte actualizado:', data);
    return data;
    } catch (error) {
    console.error('Error inesperado al actualizar estado del reporte:', error);
    return null;
    }
}
// Helper: usuario actual
async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}