import { supabase } from "../screens/supabase";
import * as Notifications from 'expo-notifications';



export async function notificarUsuario(idUsuario,titulo,mensaje) {
    const { data, error } = await supabase
    .from('Notificaciones')
    .insert({
        id_usuario: idUsuario,
        tipo: 'usuarios',
        titulo: titulo,
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

export async function registrarseParaNotificaciones() {
    console.log('Iniciando registro para notificaciones...');
    //Verificar permisos
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'No se concedió el permiso para notificaciones.');
            console.log('Permiso para notificaciones no concedido');
            return null;
        }
        console.log('Permiso para notificaciones concedido');
        finalStatus = status;
    }
    if(finalStatus !== 'granted'){
        return null;
    }
    //Obtener token
    console.log('Obteniendo token de notificaciones...');
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    if(!token){
        console.log('No se pudo obtener el token de notificaciones');
        return null;
    }
    console.log('Token de notificaciones obtenido:', token);

    //Guardar token en Supabase 
    await supabase.from('Tokens_Notificaciones').upsert({
        token: token
    },{ onConflict: 'token' });

    return token;
    
}
    