import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminReportUserDetallScreen.styles';

// Inicial de avatar
const initialFrom = (name = '') => (name.trim()[0] || '?').toUpperCase();

export default function AdminUserReportDetailScreen({ route, navigation }) {
  // Espera: route.params.report (targetType === 'usuario')
  const incoming = route?.params?.report;

  // fallback por si entras directo en dev
  const fallback = {
    id: 'r2',
    reason: 'Acoso / agresión',
    state: 'pendiente',
    targetType: 'usuario',
    targetId: 'u3',
    reporter: 'Bob',
    createdAt: '2025-10-11 08:02',
    category: 'Acoso/Agresión',
    user: {
      id: 'u3',
      name: 'Juan Pérez',
      username: '@juanp',
      role: 'Usuario',
      joinedAt: '2025-01-15',
      status: 'Activo',
      strikes: 1,
    },
  };

  const [report, setReport] = useState(
    incoming?.targetType === 'usuario' ? incoming : fallback
  );

  const badge = useMemo(() => {
    if (report.state === 'resuelto')
      return { box: s.badgeGreen, text: s.badgeTextDark, icon: 'checkmark-circle' };
    if (report.state === 'pendiente')
      return { box: s.badgeYellow, text: s.badgeTextWarn, icon: 'time' };
    if (report.state === 'sin_resolver')
      return { box: s.badgeBlue, text: s.badgeTextInfo, icon: 'help-circle' };
    return { box: s.badgeBlue, text: s.badgeTextInfo, icon: 'alert-circle' }; // abierto u otros
  }, [report.state]);

  const toggleResolver = () => {
    setReport(prev => {
      const next =
        prev.state === 'resuelto'
          ? { ...prev, state: 'sin_resolver' }
          : { ...prev, state: 'resuelto' };
      Alert.alert(
        next.state === 'resuelto' ? 'Resuelto' : 'Sin resolver',
        `Reporte ${prev.id} marcado como "${next.state.replace('_',' ')}".`
      );
      return next;
    });
  };

  // Acciones sobre el usuario
  const advertir = () => {
    Alert.alert('Advertencia enviada', `Se advirtió a ${report.user?.username}.`);
  };
  const silenciar24h = () => {
    Alert.alert('Silenciado', `${report.user?.username} silenciado por 24h.`);
  };
  const suspender7d = () => {
    Alert.alert('Suspendido', `${report.user?.username} suspendido por 7 días.`);
  };
  const bloquear = () => {
    Alert.alert(
      'Bloquear usuario',
      `¿Bloquear a ${report.user?.name} (${report.user?.username})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Bloquear', style: 'destructive', onPress: () => Alert.alert('Bloqueado', 'El usuario fue bloqueado.') },
      ]
    );
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
          <Text style={s.headerTitle}>Reporte de usuario</Text>
          <Text style={s.headerSub}>#{report.id}</Text>

          <View style={s.headerChipsRow}>
            <View style={[s.badge, badge.box]}>
              <Ionicons name={badge.icon} size={14} color="#1E293B" />
              <Text style={badge.text}>{report.state.replace('_', ' ')}</Text>
            </View>
            <View style={[s.chip, s.chipPrimary]}>
              <Ionicons name="pricetag" size={14} color="#EEF2FF" style={s.chipIcon} />
              <Text style={s.chipTextPrimary}>{report.category || 'Sin categoría'}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* Info del reporte */}
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>Información del reporte</Text>
            <View style={s.linkRow}>
              <Ionicons name="time" size={14} color="#4F46E5" />
              <Text style={s.linkText}>{report.createdAt}</Text>
            </View>
          </View>

          <View style={s.rowItem}>
            <Text style={s.label}>Objetivo</Text>
            <Text style={s.value}>Usuario · {report.targetId}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Razón</Text>
            <Text style={[s.value, s.valueMultiline]} numberOfLines={3}>{report.reason}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Reportado por</Text>
            <Text style={s.value}>{report.reporter}</Text>
          </View>
        </View>

        {/* Usuario reportado */}
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>Usuario reportado</Text>
          </View>

          <View style={s.userRow}>
            <View style={s.avatar}>
              <Text style={s.avatarLetter}>{initialFrom(report.user?.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.userName}>{report.user?.name}</Text>
              <Text style={s.userHandle}>{report.user?.username}</Text>
            </View>
            <View style={s.badgeMini}>
              <Text style={s.badgeMiniText}>{report.user?.status || '—'}</Text>
            </View>
          </View>

          <View style={s.rowItem}>
            <Text style={s.label}>Rol</Text>
            <Text style={s.value}>{report.user?.role || '—'}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Miembro desde</Text>
            <Text style={s.value}>{report.user?.joinedAt || '—'}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Strikes</Text>
            <Text style={s.value}>{String(report.user?.strikes ?? '0')}</Text>
          </View>
        </View>

        {/* Acciones */}
        <View style={s.actionsRow}>
          <Pressable style={[s.btn, s.btnGhost]} onPress={advertir}>
            <Ionicons name="mail" size={16} color="#3730A3" />
            <Text style={s.btnGhostText}>Advertir</Text>
          </Pressable>
          <Pressable style={[s.btn, s.btnGhost]} onPress={silenciar24h}>
            <Ionicons name="volume-mute" size={16} color="#3730A3" />
            <Text style={s.btnGhostText}>Silenciar 24h</Text>
          </Pressable>
        </View>

        <View style={s.actionsRow}>
          <Pressable style={[s.btn, s.btnGhost]} onPress={suspender7d}>
            <Ionicons name="calendar" size={16} color="#3730A3" />
            <Text style={s.btnGhostText}>Suspender 7d</Text>
          </Pressable>
          <Pressable style={[s.btn, s.btnPrimary]} onPress={toggleResolver}>
            <Ionicons name={report.state === 'resuelto' ? 'help-circle' : 'checkmark-circle'} size={16} color="#FFFFFF" />
            <Text style={s.btnPrimaryText}>
              {report.state === 'resuelto' ? 'Marcar sin resolver' : 'Marcar como resuelto'}
            </Text>
          </Pressable>
        </View>

        <View style={s.actionsRow}>
          <Pressable style={[s.btn, s.btnDanger]} onPress={bloquear}>
            <Ionicons name="ban" size={16} color="#FFFFFF" />
            <Text style={s.btnDangerText}>Bloquear usuario</Text>
          </Pressable>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
