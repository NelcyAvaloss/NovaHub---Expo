import { supabase } from "../screens/supabase";

export async function notificarUsuario(idUsuario,mensaje) {
    const { data, error } = await supabase
    .from('Notificaciones')
    .insert({
        id_usuario: idUsuario,
        tipo: 'usuarios',
        mensaje: mensaje
    })
    .select('*')
    .single();
    if (error) {
        console.error('Error al enviar notificación al usuario:', error);
        return null;
    }

    return data;
    
}