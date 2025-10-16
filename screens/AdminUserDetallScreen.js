import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ScrollView,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import s from './AdminUserDetallScreen.styles';

// ⬇️ IMPORTA DEL SERVICE (incluye actividad real)
import {
  obtenerUsuarioPorId,
  actualizarEstadoUsuario,
  eliminarUsuario,
  obtenerActividadUsuario,
} from '../services/usuariosService';

// helpers
const initialsOf = (name = '') =>
  name.trim().split(/\s+/).map(n => n[0]?.toUpperCase() || '').slice(0, 2).join('') || 'U';

const fmt = (v) => (v == null || v === '' ? '—' : String(v));

const niceDate = (d) => {
  if (!d) return '—';
  try {
    const dd = new Date(d);
    if (Number.isNaN(dd.getTime())) return String(d);
    return dd.toLocaleString();
  } catch {
    return String(d);
  }
};

export default function AdminUserDetallScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { userId } = route.params || {};

  // estado real
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [activity, setActivity] = React.useState([]); // actividad real

  // carga inicial
  const load = React.useCallback(async () => {
    if (!userId) {
      Alert.alert('Error', 'Falta el parámetro userId');
      navigation.goBack();
      return;
    }

    setLoading(true);
    const res = await obtenerUsuarioPorId(userId);
    setLoading(false);

    if (!res.ok) {
      console.log('obtenerUsuarioPorId error:', res.error);
      Alert.alert('Error', res.error?.message || 'No se pudo cargar el usuario');
      navigation.goBack();
      return;
    }
    setUser(res.data);

    // actividad reciente (publicó / comentó)
    const a = await obtenerActividadUsuario(userId, 5);
    if (a?.ok) setActivity(a.data);
  }, [userId, navigation]);

  React.useEffect(() => { load(); }, [load]);

  // acciones
  const toggleStatus = async () => {
    if (!user) return;
    const next = user.status === 'activo' ? 'bloqueado' : 'activo';
    const prev = user;
    setBusy(true);
    setUser(u => ({ ...u, status: next })); // optimistic
    const r = await actualizarEstadoUsuario(user.id, next);
    setBusy(false);
    if (!r.ok) {
      setUser(prev);
      Alert.alert('Error', r.error?.message || 'No se pudo actualizar el estado');
      return;
    }
    Alert.alert('Estado actualizado', `El usuario ahora está ${next}.`);
  };

  const deleteProfile = () => {
    if (!user) return;
    Alert.alert(
      'Eliminar perfil',
      `¿Seguro que deseas eliminar el perfil de ${user.name || 'este usuario'}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            const res = await eliminarUsuario(user.id); // hard o soft según RLS
            setBusy(false);
            if (!res.ok) {
              Alert.alert('Error', res.error?.message || 'No se pudo eliminar');
              return;
            }
            Alert.alert(res.hard ? 'Eliminado' : 'Archivado',
              res.hard ? 'Usuario eliminado definitivamente.' : 'Marcado como eliminado.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  // loading / vacío
  if (loading) {
    return (
      <SafeAreaView style={s.screen}>
        <ActivityIndicator style={{ marginTop: 24 }} />
      </SafeAreaView>
    );
  }
  if (!user) {
    return (
      <SafeAreaView style={s.screen}>
        <Text style={{ padding: 16 }}>No se encontró el usuario.</Text>
        <Pressable style={[s.btn, s.btnGhost]} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={16} color="#3730A3" />
          <Text style={s.btnGhostText}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // mismas variables que tu UI original
  const initials = initialsOf(user.name);
  const statusBadge = user.status === 'activo'
    ? { wrap: s.badgeGreen, text: s.badgeTextDark, icon: 'checkmark-circle', color: '#065F46' }
    : { wrap: s.badgeRed, text: s.badgeTextDanger, icon: 'close-circle', color: '#991B1B' };

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
          <Text style={s.headerSub}>#{fmt(user.id)}</Text>

          <View style={s.headerRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>

            <View style={s.headerTextBlock}>
              <Text style={s.name} numberOfLines={1}>{fmt(user.name)}</Text>
              <Text style={s.email} numberOfLines={1}>{fmt(user.email)}</Text>
            </View>

            <View style={[s.badge, statusBadge.wrap]}>
              <Ionicons name={statusBadge.icon} size={14} color={statusBadge.color} />
              <Text style={statusBadge.text}>{fmt(user.status)}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* ===== Contenido con scroll ===== */}
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: Math.max(insets.bottom, 16) + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Franja informativa */}
        <View style={s.infoCard}>
          <View style={s.infoItem}>
            <View style={s.infoIconWrap}>
              <Ionicons name="calendar" size={14} color="#3730A3" />
            </View>
            <View style={s.infoTextWrap}>
              <Text style={s.infoLabel}>Miembro desde</Text>
              <Text style={s.infoValue}>{(user.joinedAt || '—')?.slice(0, 10)}</Text>
            </View>
          </View>

          <View style={s.dividerV} />

          <View style={s.infoItem}>
            <View style={s.infoIconWrap}>
              <Ionicons name="time" size={14} color="#3730A3" />
            </View>
            <View style={s.infoTextWrap}>
              <Text style={s.infoLabel}>Última vez</Text>
              <Text style={s.infoValue}>{niceDate(user.lastSeen)}</Text>
            </View>
          </View>
        </View>

        {/* Información general */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Información general</Text>

          <View style={s.rowItem}>
            <Text style={s.label}>Nombre</Text>
            <Text style={s.value} numberOfLines={1}>{fmt(user.name)}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Email</Text>
            <Text style={s.value} numberOfLines={1}>{fmt(user.email)}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Rol</Text>
            <Text style={s.value}>{(user.role || 'user').toUpperCase()}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Estado</Text>
            <Text style={s.value}>{fmt(user.status)}</Text>
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Acciones rápidas</Text>

          <View style={s.quickGrid}>
            <Pressable style={[s.quickTile]} onPress={() => Alert.alert('Mensaje', `Abrir redacción para ${user.name}`)}>
              <View style={[s.quickIconWrap, s.quickIconIndigo]}>
                <Ionicons name="mail" size={16} color="#3730A3" />
              </View>
              <View style={s.quickTextCol}>
                <Text style={s.quickTitle}>Enviar mensaje</Text>
                <Text style={s.quickSub}>Notificar al usuario</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </Pressable>

            <Pressable style={[s.quickTile]} onPress={() => Alert.alert('Reset', `Enlace a ${user.email}`)}>
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
              disabled={busy}
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

            <Pressable style={[s.btn, s.btnDanger]} onPress={deleteProfile} disabled={busy}>
              <Ionicons name="trash" size={16} color="#FFFFFF" />
              <Text style={s.btnDangerTextSolid}>Eliminar perfil</Text>
            </Pressable>
          </View>
        </View>

        {/* Actividad reciente */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Actividad reciente</Text>
          {activity.length === 0 ? (
            <View style={s.rowItem}>
              <Text style={s.rowTitle}>Sin actividad</Text>
            </View>
          ) : (
            activity.map((a, idx) => (
              <View key={a.id} style={[s.rowItem, idx !== 0 && s.rowItemBorder]}>
                <View style={s.rowLeft}>
                  <View style={s.iconWrap}>
                    <Ionicons name={a.icon || 'document'} size={14} color="#3730A3" />
                  </View>
                  <Text style={s.rowTitle}>{a.text}</Text>
                </View>
                <Text style={s.rowWhen}>{niceDate(a.at)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Footer acciones */}
        <View style={s.footerRow}>
          <Pressable style={[s.btn, s.btnPrimary]} onPress={() => Alert.alert('OK', 'Nada que guardar por ahora')}>
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
