import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  Image,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminProfileScreen.styles';

//    Imagenes de Avatars
const avatarOptions = [
  require('../assets/LogoNovaHub.png'),
  require('../assets/LogoNovaHub.png'),
  require('../assets/LogoNovaHub.png'),
  require('../assets/LogoNovaHub.png'),
  require('../assets/LogoNovaHub.png'),
  require('../assets/LogoNovaHub.png'),
];

export default function AdminProfileScreen() {
  
  const me = {
    name: 'Admin Nova',
    email: 'admin@novahub.app',
    role: 'admin',
    lastLogin: '2025-10-12 21:05',
    org: 'NovaHub',
  };

  // Estado local
  const [twoFA, setTwoFA] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = React.useState(false);
  const [avatarSrc, setAvatarSrc] = React.useState(avatarOptions[0]); // avatar por defecto

  const changePassword = () =>
    Alert.alert('Cambiar contraseña', 'Abrir flujo de cambio de contraseña (mock).');

  const signOut = () => Alert.alert('Cerrar sesión', 'Sesión cerrada (mock).');

  const regenerateApi = () =>
    Alert.alert('Token regenerado', 'Se generó un nuevo token API (mock).');

  const manageSessions = () =>
    Alert.alert('Sesiones activas', 'Mostrar/invalidar sesiones (mock).');

  const onPickAvatar = (imgModule) => {
    setAvatarSrc(imgModule);
    setAvatarPickerOpen(false);
    
    
  };

  return (
    <SafeAreaView style={s.screen}>
      {/* Header */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Perfil</Text>
          <Text style={s.headerSub}>Información de la cuenta</Text>

          {/* Chips / estado */}
          <View style={s.chipsRow}>
            <View style={[s.chip, s.chipPrimary]}>
              <Ionicons name="shield-checkmark" size={14} color="#EEF2FF" style={s.chipIcon} />
              <Text style={[s.chipText, s.chipTextPrimary]}>Rol: {me.role}</Text>
            </View>
          </View>

          {/* Avatar + botón editar */}
          <View style={s.avatarWrap}>
            <Image source={avatarSrc} style={s.avatarImg} />
            <Pressable
              style={s.avatarEditBtn}
              onPress={() => setAvatarPickerOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Cambiar avatar"
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* Card: Identidad */}
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <View style={s.cardHeaderLeft}>
              <View style={[s.iconWrap, s.iconIndigo]}>
                <Ionicons name="person" size={16} color="#4338CA" />
              </View>
              <Text style={s.cardTitle}>Tu perfil</Text>
            </View>
            <Pressable
              style={s.editBtn}
              onPress={() => Alert.alert('Editar', 'Editar perfil (mock).')}
            >
              <Ionicons name="create-outline" size={16} color="#4F46E5" />
              <Text style={s.editTxt}>Editar</Text>
            </Pressable>
          </View>

          <View style={s.rowStatic}>
            <Text style={s.rowTitle}>Nombre</Text>
            <Text style={s.kvValue}>{me.name}</Text>
          </View>
          <View style={s.rowStatic}>
            <Text style={s.rowTitle}>Email</Text>
            <Text style={s.kvValue}>{me.email}</Text>
          </View>
          <View style={s.rowStatic}>
            <Text style={s.rowTitle}>Organización</Text>
            <Text style={s.kvValue}>{me.org}</Text>
          </View>
        </View>

        {/* Card: Seguridad */}
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <View style={s.cardHeaderLeft}>
              <View style={[s.iconWrap, s.iconEmerald]}>
                <Ionicons name="lock-closed" size={16} color="#065F46" />
              </View>
              <Text style={s.cardTitle}>Seguridad</Text>
            </View>
          </View>

          <Pressable style={[s.row, s.rowPressable]} onPress={() => setTwoFA((v) => !v)}>
            <View style={s.rowLeft}>
              <Text style={s.rowTitle}>Autenticación en dos pasos (2FA)</Text>
              <Text style={s.rowSub}>Requiere código adicional al iniciar sesión</Text>
            </View>
            <View style={[s.badge, twoFA ? s.badgeGreen : s.badgeGray]}>
              <Ionicons
                name={twoFA ? 'checkmark-circle' : 'remove-circle'}
                size={14}
                color={twoFA ? '#065F46' : '#475569'}
              />
              <Text style={twoFA ? s.badgeTextDark : s.badgeTextMuted}>
                {twoFA ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </Pressable>

          <Pressable style={[s.row, s.rowPressable]} onPress={changePassword}>
            <View style={s.rowLeft}>
              <Text style={s.rowTitle}>Cambiar contraseña</Text>
              <Text style={s.rowSub}>Actualiza tu contraseña periódicamente</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>

          <Pressable style={[s.row, s.rowPressable]} onPress={manageSessions}>
            <View style={s.rowLeft}>
              <Text style={s.rowTitle}>Sesiones activas</Text>
              <Text style={s.rowSub}>Revisa y cierra sesiones en otros dispositivos</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Card: API & desarrollo */}
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <View style={s.cardHeaderLeft}>
              <View style={[s.iconWrap, s.iconSky]}>
                <Ionicons name="code-slash" size={16} color="#0369A1" />
              </View>
              <Text style={s.cardTitle}>API & Desarrollo</Text>
            </View>
          </View>

          <Pressable style={[s.row, s.rowPressable]} onPress={regenerateApi}>
            <View style={s.rowLeft}>
              <Text style={s.rowTitle}>Regenerar token API</Text>
              <Text style={s.rowSub}>Invalida el token anterior y crea uno nuevo</Text>
            </View>
            <Ionicons name="refresh" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Zona de peligro */}
        <View style={s.dangerCard}>
          <Pressable style={[s.btn, s.btnDanger]} onPress={signOut}>
            <Ionicons name="log-out" size={16} color="#FFFFFF" style={s.btnIcon} />
            <Text style={s.btnDangerText}>Cerrar sesión</Text>
          </Pressable>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Modal: Selector de Avatar */}
      <Modal
        visible={avatarPickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setAvatarPickerOpen(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Elige tu avatar</Text>
              <Pressable onPress={() => setAvatarPickerOpen(false)} style={s.modalCloseBtn}>
                <Ionicons name="close" size={20} color="#0F172A" />
              </Pressable>
            </View>

            <FlatList
              data={avatarOptions}
              keyExtractor={(item, idx) => `avatar-${idx}`}
              numColumns={3}
              columnWrapperStyle={s.gridRow}
              contentContainerStyle={s.gridContent}
              renderItem={({ item }) => (
                <Pressable style={s.avatarCell} onPress={() => onPickAvatar(item)}>
                  <Image source={item} style={s.avatarOptionImg} />
                </Pressable>
              )}
            />

            <Text style={s.modalHint}>
              Sube tus imágenes a <Text style={s.mono}>/assets/avatars/</Text> y agrégalas al arreglo{' '}
              <Text style={s.mono}>avatarOptions</Text>.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
