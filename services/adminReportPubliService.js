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

async function mapearReporte(reporte){
    const nombreUsuario = await obtenerNombreUsuario(reporte.reportado_por);
    return {
        id: reporte.id,
        reason: reporte.razón,
        category: reporte.razón,
        state: reporte.estado,
        targetType: reporte.tipo_objetivo,
        targetId: "A",//reporte.id_objetivo,
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
    return await Promise.all(data.map(mapearReporte));

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
    });
    if (error) {
        console.error('Error al actualizar estado del reporte:', error);
        return null;
    }
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