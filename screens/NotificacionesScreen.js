import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './NotificacionesScreen.styles';
import { supabase } from './supabase';

export default function NotificacionesScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [noUser, setNoUser] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setNoUser(false);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.log('No hay usuario autenticado o error:', userError);
        setNoUser(true);
        setNotifications([]);
        return;
      }

      const user = userData.user;

      const { data, error } = await supabase
        .from('Notificaciones') 
        .select('id, titulo, mensaje, tipo, leida, fecha')
        .eq('id_usuario', user.id)
        .order('fecha', { ascending: false });

      if (error) {
        console.log('Error cargando notificaciones:', error);
        setNotifications([]);
        return;
      }

      setNotifications(data || []);
    } catch (e) {
      console.log('Error inesperado cargando notificaciones:', e);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  const subscribeToNotificationChanges = useCallback(async() => {
    const currentUserId = await supabase.auth.getUser().then(res => res.data.user?.id);
    if (!currentUserId) return null;
    const subscription = supabase
      .channel('notificaciones-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Notificaciones', filter: `id_usuario=eq.${currentUserId}` }, payload => {
        console.log('Cambio en notificaciones recibido:', payload);
        fetchNotifications();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    subscribeToNotificationChanges();
    fetchNotifications();
  }, [fetchNotifications, subscribeToNotificationChanges]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notification) => {
    if (!notification?.id || notification.leida) return;

    try {
      const { error } = await supabase
        .from('Notificaciones')
        .update({ leida: true })
        .eq('id', notification.id);

      if (error) {
        console.log('Error marcando como leída:', error);
        return;
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, leida: true } : n
        )
      );
    } catch (e) {
      console.log('Error inesperado al marcar como leída:', e);
    }
  };

  const renderItem = ({ item }) => {
    const isUnread = !item.leida;
    const fecha = item.fecha
      ? new Date(item.fecha).toLocaleString()
      : '';

    return (
      <TouchableOpacity
        style={[s.card, isUnread && s.cardUnread]}
        onPress={() => markAsRead(item)}
        activeOpacity={0.8}
      >
        <View style={s.iconContainer}>
          <Ionicons
            name={isUnread ? 'notifications' : 'notifications-outline'}
            size={26}
            style={s.icon}
          />
          {isUnread && <View style={s.unreadDot} />}
        </View>

        <View style={s.textContainer}>
          <Text style={s.title} numberOfLines={1}>
            {item.titulo || 'Notificación'}
          </Text>
          <Text style={s.message} numberOfLines={2}>
            {item.mensaje || 'Sin contenido'}
          </Text>
          {!!fecha && <Text style={s.time}>{fecha}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={s.loadingText}>Cargando notificaciones...</Text>
      </View>
    );
  }

  if (noUser) {
    return (
      <View style={s.container}>
        <View style={s.header}>
          <Text style={s.headerTitle}>Notificaciones</Text>
          <Ionicons name="notifications" size={24} style={s.headerIcon} />
        </View>

        <View style={s.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={40} style={s.emptyIcon} />
          <Text style={s.emptyText}>Inicia sesión para ver tus notificaciones</Text>
          <Text style={s.emptySubText}>
            Aquí aparecerán las interacciones con tus publicaciones.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Notificaciones</Text>
        <Ionicons name="notifications" size={24} style={s.headerIcon} />
      </View>

      {notifications.length === 0 ? (
        <View style={s.emptyContainer}>
          <Ionicons name="sparkles-outline" size={40} style={s.emptyIcon} />
          <Text style={s.emptyText}>No tienes notificaciones por ahora</Text>
          <Text style={s.emptySubText}>
            Cuando alguien interactúe con tus publicaciones, aparecerá aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={s.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
