import React from 'react';
import {
  SafeAreaView, View, Text, TextInput, Pressable, ScrollView, ImageBackground, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import s from './AdminUsersListScreen.styles';

import {
  obtenerUsuarios,
  contadoresUsuarios,
  actualizarEstadoUsuario,
  eliminarUsuario,
} from '../services/usuariosService';

const STATUS_TABS = ['todos', 'activo', 'bloqueado'];

export default function AdminUsersListScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const [users, setUsers] = React.useState([]);
  const [metrics, setMetrics] = React.useState({ total: 0, activos: 0, bloqueados: 0 });

  const [q, setQ] = React.useState('');
  const [statusTab, setStatusTab] = React.useState('todos');

  const load = React.useCallback(async () => {
    setLoading(true);
    const [uRes, mRes] = await Promise.all([obtenerUsuarios(), contadoresUsuarios()]);
    setLoading(false);

    if (uRes.ok) setUsers(uRes.data); else console.error(uRes.error);
    if (mRes.ok) setMetrics(mRes.data); else console.error(mRes.error);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = React.useMemo(() => {
    const text = q.trim().toLowerCase();
    return users.filter(u => {
      const passText = !text || u.name.toLowerCase().includes(text) || u.email.toLowerCase().includes(text);
      const passStatus = statusTab === 'todos' || u.status === statusTab;
      return passText && passStatus;
    });
  }, [users, q, statusTab]);

  const badgeForStatus = (status) =>
    status === 'activo'
      ? { wrap: s.badgeGreen, text: s.badgeTextDark, band: s.bandGreen, dot: s.dotGreen }
      : { wrap: s.badgeRed, text: s.badgeTextDanger, band: s.bandRed, dot: s.dotRed };

  // Acciones -----------------------------------------------------------------
  const toggleStatus = async (id, current) => {
    const next = current === 'activo' ? 'bloqueado' : 'activo';

    // Optimistic UI
    const prev = users;
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, status: next } : u)));
    const res = await actualizarEstadoUsuario(id, next);
    if (!res.ok) {
      setUsers(prev); // revertir si falla
      Alert.alert('Error', res.error?.message || 'No se pudo actualizar el estado');
      return;
    }
    // refresca contadores
    const mr = await contadoresUsuarios();
    if (mr.ok) setMetrics(mr.data);
  };

  const disableUser = async (id) => {
    await toggleStatus(id, 'activo');
  };

  const deleteUser = (id) => {
    const u = users.find(x => x.id === id);
    Alert.alert(
      'Eliminar perfil',
      `¿Seguro que deseas eliminar el perfil de ${u?.name || 'este usuario'}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const prev = users;
            setUsers(prev.filter(x => x.id !== id));
            const res = await eliminarUsuario(id);
            if (!res.ok) {
              setUsers(prev); // revertir
              Alert.alert('Error', res.error?.message || 'No se pudo eliminar');
              return;
            }
            const mr = await contadoresUsuarios();
            if (mr.ok) setMetrics(mr.data);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      {/* HEADER */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Usuarios</Text>
          <Text style={s.headerSub}>Gestiona cuentas y estados</Text>

          <View style={s.headerChipsRow}>
            <View style={[s.headerChip, s.headerChipPrimary]}>
              <Ionicons name="people" size={14} color="#EEF2FF" style={s.headerChipIcon} />
              <Text style={[s.headerChipText, s.headerChipTextPrimary]}>Directorio</Text>
            </View>
            <View style={s.headerChip}>
              <Ionicons name="shield-checkmark" size={14} color="#1E293B" style={s.headerChipIcon} />
              <Text style={s.headerChipText}>Control de acceso</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: Math.max(insets.bottom, 16) + 32 }]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          // si usas RefreshControl nativo:
          // <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          null
        }
      >
        {/* Métricas rápidas */}
        <View style={s.metricsRow}>
          <View style={s.metricCard}>
            <Text style={s.metricLabel}>Total</Text>
            <Text style={s.metricValue}>{metrics.total}</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricLabel}>Activos</Text>
            <Text style={[s.metricValue, s.metricOk]}>{metrics.activos}</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricLabel}>Bloqueados</Text>
            <Text style={[s.metricValue, s.metricDanger]}>{metrics.bloqueados}</Text>
          </View>
        </View>

        {/* Cargando lista */}
        {loading && (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: '#64748B' }}>Cargando usuarios…</Text>
          </View>
        )}

        {/* Tabs por estado */}
        <View style={s.tabsRow}>
          {STATUS_TABS.map(k => (
            <Pressable key={k} style={[s.tab, statusTab === k && s.tabActive]} onPress={() => setStatusTab(k)}>
              <Text style={[s.tabText, statusTab === k && s.tabTextActive]}>
                {k === 'todos' ? 'Todos los estados' : k.charAt(0).toUpperCase() + k.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Buscador + botón filtros */}
        <View style={s.searchRow}>
          <View style={s.searchWrap}>
            <Ionicons name="search" size={16} color="#94A3B8" style={s.searchIcon} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Buscar por nombre o email…"
              placeholderTextColor="#94A3B8"
              style={s.input}
            />
          </View>
          <Pressable style={[s.btn, s.btnGhost]} onPress={onRefresh}>
            <Ionicons name="refresh" size={16} color="#3730A3" />
            <Text style={s.btnGhostText}>Recargar</Text>
          </Pressable>
        </View>

        {/* Contador */}
        <Text style={s.resultsText}>
          {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
        </Text>

        {/* Lista */}
        {!loading && filtered.map(u => {
          const b = badgeForStatus(u.status);
          const initials = u.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();

          return (
            <Pressable
              key={u.id}
              style={s.card}
              onPress={() => navigation.navigate('AdminUserDetall', { userId: u.id })}
            >
              <View style={[s.stateBand, b.band]} />

              <View style={s.cardBody}>
                <View style={s.cardHeaderRow}>
                  <View style={s.avatarWrap}><Text style={s.avatarText}>{initials}</Text></View>

                  <View style={s.cardTitleWrap}>
                    <Text style={s.title} numberOfLines={1}>{u.name}</Text>
                    <Text style={s.sub} numberOfLines={1}>{u.email}</Text>
                  </View>

                  <View style={[s.badge, b.wrap]}><Text style={b.text}>{u.status}</Text></View>
                </View>

                <View style={s.metaRow}>
                  <View style={s.metaPill}>
                    <Ionicons name="key" size={12} color="#3730A3" />
                    <Text style={s.metaPillText}>{u.role.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={s.actionsRow}>
                  <Pressable
                    style={s.chip}
                    onPress={(e) => { e.stopPropagation(); toggleStatus(u.id, u.status); }}
                  >
                    <Ionicons name={u.status === 'activo' ? 'lock-closed' : 'lock-open'} size={14} color="#334155" />
                    <Text style={s.chipText}>{u.status === 'activo' ? 'Deshabilitar' : 'Activar'}</Text>
                  </Pressable>

                  <Pressable
                    style={[s.chip, s.chipDanger || { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5', borderWidth: 1 }]}
                    onPress={(e) => { e.stopPropagation(); deleteUser(u.id); }}
                  >
                    <Ionicons name="trash" size={14} color="#991B1B" />
                    <Text style={s.chipTextDanger || { color: '#991B1B', fontWeight: '900', fontSize: 12 }}>
                      Eliminar
                    </Text>
                  </Pressable>

                  <View style={{ flex: 1 }} />
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </View>
              </View>
            </Pressable>
          );
        })}

        {!loading && filtered.length === 0 && (
          <View style={s.emptyBox}>
            <Ionicons name="people-circle" size={20} color="#94A3B8" />
            <Text style={s.emptyText}>Sin resultados</Text>
          </View>
        )}

        <View style={{ height: Math.max(insets.bottom, 16) + 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
