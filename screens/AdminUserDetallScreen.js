import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ScrollView,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import s from './AdminUserDetallScreen.styles';

export default function AdminUserDetallScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const { userId } = route.params || {};
  const initial = {
    id: userId ?? 'u0',
    name: 'Geovanny Ruíz',
    email: 'geovanny@novahub.app',
    role: 'user',
    status: 'activo',
    joinedAt: '2025-05-03',
    lastSeen: '2025-10-10 09:15',
  };

  const [user, setUser] = React.useState(initial);

  const initials = React.useMemo(
    () => user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
    [user.name]
  );

  const statusBadge = user.status === 'activo'
    ? { wrap: s.badgeGreen, text: s.badgeTextDark, icon: 'checkmark-circle' }
    : { wrap: s.badgeRed,   text: s.badgeTextDanger, icon: 'close-circle' };

  const toggleStatus = () => {
    const next = user.status === 'activo' ? 'bloqueado' : 'activo';
    setUser(u => ({ ...u, status: next }));
    Alert.alert('Estado actualizado', `El usuario ahora está ${next}.`);
  };

  const deleteProfile = () => {
    Alert.alert(
      'Eliminar perfil',
      `¿Seguro que deseas eliminar el perfil de ${user.name}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Perfil eliminado', `Se eliminó el perfil de ${user.name}.`);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const resetPassword = () => {
    Alert.alert('Restablecer contraseña', `Se envió un enlace a ${user.email}.`);
  };

  const sendMessage = () => {
    Alert.alert('Mensaje', `Abrir redacción para enviar notificación a ${user.name}.`);
  };

  const activity = [
    { id: 'a1', icon: 'log-in',   text: 'Inicio de sesión',           when: 'hace 2 h' },
    { id: 'a2', icon: 'document', text: 'Publicó “Guía básica”',      when: 'hace 1 d' },
    { id: 'a3', icon: 'chatbox',  text: 'Comentó en una publicación', when: 'hace 3 d' },
  ];

  const handleSave = () => {
    Alert.alert('Guardado', 'Los cambios se han guardado.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.screen}>
      {/* ===== Header con FondoNovaHub ===== */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />

        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Usuario</Text>
          <Text style={s.headerSub}>#{user.id}</Text>

          <View style={s.headerRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>

            <View style={s.headerTextBlock}>
              <Text style={s.name} numberOfLines={1}>{user.name}</Text>
              <Text style={s.email} numberOfLines={1}>{user.email}</Text>
            </View>

            <View style={[s.badge, statusBadge.wrap]}>
              <Ionicons
                name={statusBadge.icon}
                size={14}
                color={user.status === 'activo' ? '#065F46' : '#991B1B'}
              />
              <Text style={statusBadge.text}>{user.status}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* ===== Contenido con scroll  ===== */}
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: Math.max(insets.bottom, 16) + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Franja informativa  */}
        <View style={s.infoCard}>
          <View style={s.infoItem}>
            <View style={s.infoIconWrap}>
              <Ionicons name="calendar" size={14} color="#3730A3" />
            </View>
            <View style={s.infoTextWrap}>
              <Text style={s.infoLabel}>Miembro desde</Text>
              <Text style={s.infoValue}>{user.joinedAt}</Text>
            </View>
          </View>

          <View style={s.dividerV} />

          <View style={s.infoItem}>
            <View style={s.infoIconWrap}>
              <Ionicons name="time" size={14} color="#3730A3" />
            </View>
            <View style={s.infoTextWrap}>
              <Text style={s.infoLabel}>Última vez</Text>
              <Text style={s.infoValue}>{user.lastSeen}</Text>
            </View>
          </View>
        </View>

        {/* Información general */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Información general</Text>

          <View style={s.rowItem}>
            <Text style={s.label}>Nombre</Text>
            <Text style={s.value} numberOfLines={1}>{user.name}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Email</Text>
            <Text style={s.value} numberOfLines={1}>{user.email}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Rol</Text>
            <Text style={s.value}>{user.role.toUpperCase()}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Estado</Text>
            <Text style={s.value}>{user.status}</Text>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Acciones rápidas</Text>

          <View style={s.quickGrid}>
            <Pressable style={[s.quickTile]} onPress={sendMessage}>
              <View style={[s.quickIconWrap, s.quickIconIndigo]}>
                <Ionicons name="mail" size={16} color="#3730A3" />
              </View>
              <View style={s.quickTextCol}>
                <Text style={s.quickTitle}>Enviar mensaje</Text>
                <Text style={s.quickSub}>Notificar al usuario</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </Pressable>

            <Pressable style={[s.quickTile]} onPress={resetPassword}>
              <View style={[s.quickIconWrap, s.quickIconSky]}>
                <Ionicons name="key" size={16} color="#0369A1" />
              </View>
              <View style={s.quickTextCol}>
                <Text style={s.quickTitle}>Resetear contraseña</Text>
                <Text style={s.quickSub}>Enviaremos un enlace</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        {/* Controles administrativos */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Controles administrativos</Text>

          <View style={s.actionsRow}>
            <Pressable
              style={[s.btn, s.btnPrimaryOutline, user.status === 'activo' && s.btnDangerOutline]}
              onPress={toggleStatus}
            >
              <Ionicons
                name={user.status === 'activo' ? 'lock-closed' : 'lock-open'}
                size={16}
                color={user.status === 'activo' ? '#B91C1C' : '#3730A3'}
              />
              <Text style={user.status === 'activo' ? s.btnDangerText : s.btnPrimaryOutlineText}>
                {user.status === 'activo' ? 'Deshabilitar' : 'Activar'}
              </Text>
            </Pressable>

            <Pressable style={[s.btn, s.btnDanger]} onPress={deleteProfile}>
              <Ionicons name="trash" size={16} color="#FFFFFF" />
              <Text style={s.btnDangerTextSolid}>Eliminar perfil</Text>
            </Pressable>
          </View>
        </View>

        {/* Actividad reciente */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Actividad reciente</Text>
          {activity.map((a, idx) => (
            <View key={a.id} style={[s.rowItem, idx !== 0 && s.rowItemBorder]}>
              <View style={s.rowLeft}>
                <View style={s.iconWrap}>
                  <Ionicons name={a.icon} size={14} color="#3730A3" />
                </View>
                <Text style={s.rowTitle}>{a.text}</Text>
              </View>
              <Text style={s.rowWhen}>{a.when}</Text>
            </View>
          ))}
        </View>

        {/* Footer acciones */}
        <View style={s.footerRow}>
          <Pressable style={[s.btn, s.btnPrimary]} onPress={handleSave}>
            <Ionicons name="save" size={16} color="#FFFFFF" />
            <Text style={s.btnPrimaryText}>Guardar</Text>
          </Pressable>
          <Pressable style={[s.btn, s.btnGhost]} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color="#3730A3" />
            <Text style={s.btnGhostText}>Volver</Text>
          </Pressable>
        </View>

        <View style={{ height: Math.max(insets.bottom, 16) }} />
      </ScrollView>
    </SafeAreaView>
  );
}
