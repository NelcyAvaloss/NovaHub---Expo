// screens/AdminSoporteScreen.jsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminSoporteScreen.styles';

const TABS = [
  { key: 'todos', label: 'Todos' },
  { key: 'abierto', label: 'Abiertos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'resuelto', label: 'Resueltos' },
];

const APARTADOS = [
  { key: 'usuarios', label: 'Usuarios', icon: 'people' },
  { key: 'moderadores', label: 'Moderadores', icon: 'shield-checkmark' },
];

// Opciones de prioridad para el filtro
const PRIOS = [
  { key: 'todas', label: 'Todas' },
  { key: 'alta', label: 'Alta' },
  { key: 'media', label: 'Media' },
  { key: 'baja', label: 'Baja' },
];

export default function AdminSoporteScreen({ navigation, route }) {
  // ---- MOCK DATA (reemplaza con tu fetch a Supabase) ----
  const [userMsgs] = useState([
    { id: 'u1', asunto: 'No puedo iniciar sesión', usuario: 'Carlos Ruiz', usuarioId: 'user_1', createdAt: '2025-10-11 08:15', estado: 'abierto',   prioridad: 'alta'  },
    { id: 'u2', asunto: 'Error al subir imagen',    usuario: 'Karla Gómez', usuarioId: 'user_2', createdAt: '2025-10-12 14:22', estado: 'pendiente', prioridad: 'media' },
    { id: 'u3', asunto: 'Cómo cambiar mi correo',   usuario: 'Mario López', usuarioId: 'user_3', createdAt: '2025-10-12 19:40', estado: 'resuelto',  prioridad: 'baja'  },
  ]);

  const [modMsgs] = useState([
    { id: 'm1', asunto: 'Escalar reporte #r5',       moderador: 'Ana Martínez',  moderadorId: 'm1', createdAt: '2025-10-12 09:33', estado: 'abierto',   prioridad: 'alta'  },
    { id: 'm2', asunto: 'Duda sobre política NSFW',  moderador: 'Luis Pineda',   moderadorId: 'm2', createdAt: '2025-10-12 16:04', estado: 'pendiente', prioridad: 'media' },
    { id: 'm3', asunto: 'Cierre de caso r3',         moderador: 'María López',   moderadorId: 'm3', createdAt: '2025-10-13 11:10', estado: 'resuelto',  prioridad: 'baja'  },
  ]);

  // Si llegamos desde Moderadores, abrir el apartado moderadores y prefiltrar
  const [apartado, setApartado] = useState('usuarios'); // 'usuarios' | 'moderadores'
  useEffect(() => {
    const pre = route?.params?.moderadorId;
    if (!pre) return;
    setApartado('moderadores');
    setQModeradores(String(pre)); // aplica al buscador de moderadores
  }, [route?.params?.moderadorId]);

  // ===== BUSQUEDA / FILTROS: Usuarios =====
  const [qUsuarios, setQUsuarios] = useState('');
  const [tabUsuarios, setTabUsuarios] = useState('todos');
  const [prioUsuarios, setPrioUsuarios] = useState('todas'); // NUEVO: filtro por prioridad

  const filteredUsers = useMemo(() => {
    const t = tabUsuarios;
    return userMsgs
      .filter(m => (t === 'todos' ? true : m.estado === t))
      .filter(m => (prioUsuarios === 'todas' ? true : m.prioridad === prioUsuarios))
      .filter(m => {
        const text = `${m.asunto} ${m.usuario} ${m.id} ${m.prioridad} ${m.usuarioId}`.toLowerCase();
        return text.includes(qUsuarios.trim().toLowerCase());
      });
  }, [userMsgs, qUsuarios, tabUsuarios, prioUsuarios]);

  const countsUsers = useMemo(() => ({
    total: userMsgs.length,
    abierto: userMsgs.filter(m => m.estado === 'abierto').length,
    pendiente: userMsgs.filter(m => m.estado === 'pendiente').length,
    resuelto: userMsgs.filter(m => m.estado === 'resuelto').length,
  }), [userMsgs]);

  // ===== BUSQUEDA / FILTROS: Moderadores (tickets) =====
  const [qModeradores, setQModeradores] = useState('');
  const [tabModeradores, setTabModeradores] = useState('todos');
  const [prioModeradores, setPrioModeradores] = useState('todas'); // NUEVO: filtro por prioridad

  const filteredMods = useMemo(() => {
    const t = tabModeradores;
    return modMsgs
      .filter(m => (t === 'todos' ? true : m.estado === t))
      .filter(m => (prioModeradores === 'todas' ? true : m.prioridad === prioModeradores))
      .filter(m => {
        const text = `${m.asunto} ${m.moderador} ${m.id} ${m.prioridad} ${m.moderadorId}`.toLowerCase();
        return text.includes(qModeradores.trim().toLowerCase());
      });
  }, [modMsgs, qModeradores, tabModeradores, prioModeradores]);

  const countsMods = useMemo(() => ({
    total: modMsgs.length,
    abierto: modMsgs.filter(m => m.estado === 'abierto').length,
    pendiente: modMsgs.filter(m => m.estado === 'pendiente').length,
    resuelto: modMsgs.filter(m => m.estado === 'resuelto').length,
  }), [modMsgs]);

  // ---- helpers UI ----
  const badge = (estado) => {
    if (estado === 'resuelto')  return { box: s.badgeGreen,  text: s.badgeTextDark, icon: 'checkmark-circle' };
    if (estado === 'pendiente') return { box: s.badgeYellow, text: s.badgeTextWarn, icon: 'time' };
    if (estado === 'abierto')   return { box: s.badgeBlue,   text: s.badgeTextInfo, icon: 'alert-circle' };
    return { box: s.badgeBlue, text: s.badgeTextInfo, icon: 'information-circle' };
  };

  const priorityPill = (p) => {
    if (p === 'alta')  return [s.prioPill, s.prioHigh];
    if (p === 'media') return [s.prioPill, s.prioMid];
    return [s.prioPill, s.prioLow];
  };

  // ===== Render items =====
  const renderUserItem = ({ item }) => {
    const b = badge(item.estado);
    return (
      <Pressable style={s.card}>
        <View style={s.cardRow}>
          <View style={s.iconTarget}>
            <Ionicons name="person" size={16} color="#3730A3" />
          </View>

          <View style={s.cardLeft}>
            <Text style={s.title} numberOfLines={1}>{item.asunto}</Text>
            <Text style={s.sub} numberOfLines={1}>{item.usuario} · {item.createdAt}</Text>
          </View>

          <View style={[s.badge, b.box]}>
            <Ionicons
              name={b.icon}
              size={14}
              color={item.estado === 'resuelto' ? '#065F46' : item.estado === 'pendiente' ? '#92400E' : '#1E3A8A'}
            />
            <Text style={b.text}>{item.estado}</Text>
          </View>
        </View>

        <View style={s.rowBetween}>
          <View style={priorityPill(item.prioridad)}>
            <Ionicons name="flame" size={12} color="#111827" />
            <Text style={s.prioText}>{item.prioridad}</Text>
          </View>

          {/* Navega a la lista de hilos, apartado USUARIOS */}
          <Pressable
            style={s.linkRow}
            onPress={() =>
              navigation.navigate('AdminHilosSoporte', {
                apartado: 'usuarios',
                preId: item.usuarioId, // prefiltro por usuario
                priority: item.prioridad,
              })
            }
          >
            <Text style={s.linkText}>Abrir hilo</Text>
            <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const renderModItem = ({ item }) => {
    const b = badge(item.estado);
    return (
      <Pressable style={s.card}>
        <View style={s.cardRow}>
          <View style={[s.iconTarget, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="shield-checkmark" size={16} color="#4F46E5" />
          </View>

          <View style={s.cardLeft}>
            <Text style={s.title} numberOfLines={1}>{item.asunto}</Text>
            <Text style={s.sub} numberOfLines={1}>{item.moderador} · {item.createdAt}</Text>
          </View>

          <View style={[s.badge, b.box]}>
            <Ionicons
              name={b.icon}
              size={14}
              color={item.estado === 'resuelto' ? '#065F46' : item.estado === 'pendiente' ? '#92400E' : '#1E3A8A'}
            />
            <Text style={b.text}>{item.estado}</Text>
          </View>
        </View>

        <View style={s.rowBetween}>
          <View style={priorityPill(item.prioridad)}>
            <Ionicons name="flame" size={12} color="#111827" />
            <Text style={s.prioText}>{item.prioridad}</Text>
          </View>

          {/* Navega a la lista de hilos, apartado MODERADORES */}
          <Pressable
            style={s.linkRow}
            onPress={() =>
              navigation.navigate('AdminHilosSoporte', {
                apartado: 'moderadores',
                preId: item.moderadorId, // prefiltro por moderador
                priority: item.prioridad,
              })
            }
          >
            <Text style={s.linkText}>Abrir hilo</Text>
            <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const tabCount = (kind, key) => {
    const c = kind === 'user' ? countsUsers : countsMods;
    if (key === 'todos') return c.total;
    return c[key] ?? 0;
  };

  return (
    <SafeAreaView style={s.screen}>
      {/* ===== Header ===== */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Soporte</Text>
          <Text style={s.headerSub}>Centro de ayuda</Text>

          <View style={s.headerChipsRow}>
            <View style={[s.headerChip, s.headerChipPrimary]}>
              <Ionicons name="life-buoy" size={14} color="#EEF2FF" style={s.headerChipIcon} />
              <Text style={[s.headerChipText, s.headerChipTextPrimary]}>Admin</Text>
            </View>
            <View style={s.headerChip}>
              <Ionicons name="time-outline" size={14} color="#1E293B" style={s.headerChipIcon} />
              <Text style={s.headerChipText}>Actualizado ahora</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* ===== Selector de apartado ===== */}
      <View style={s.apartadoRow}>
        {APARTADOS.map(a => {
          const active = apartado === a.key;
          return (
            <Pressable
              key={a.key}
              style={[s.apartadoBtn, active && s.apartadoBtnActive]}
              onPress={() => setApartado(a.key)}
            >
              <Ionicons
                name={a.icon}
                size={14}
                color={active ? '#EEF2FF' : '#1E293B'}
                style={{ marginRight: 6 }}
              />
              <Text style={[s.apartadoText, active && s.apartadoTextActive]}>{a.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* ===== Contenido scrollable ===== */}
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: 16 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ==== Apartado: Usuarios ==== */}
        {apartado === 'usuarios' && (
          <View style={s.section}>
            <View style={s.sectionHeaderRow}>
              <Text style={s.sectionTitle}>Mensajes de usuarios</Text>
            </View>

            {/* Toolbar de usuarios: búsqueda + tabs estado */}
            <View style={s.toolbarRow}>
              <View style={s.searchBar}>
                <Ionicons name="search" size={16} color="#64748B" />
                <TextInput
                  value={qUsuarios}
                  onChangeText={setQUsuarios}
                  placeholder="Buscar por asunto, usuario, #ID…"
                  placeholderTextColor="#94A3B8"
                  style={s.searchInput}
                />
                {qUsuarios.length > 0 && (
                  <Pressable onPress={() => setQUsuarios('')} hitSlop={10}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </Pressable>
                )}
              </View>

              <View style={s.tabsRow}>
                {TABS.map(t => (
                  <Pressable
                    key={t.key}
                    onPress={() => setTabUsuarios(t.key)}
                    style={[s.tabBtn, tabUsuarios === t.key && s.tabBtnActive]}
                  >
                    <Text style={[s.tabBtnText, tabUsuarios === t.key && s.tabBtnTextActive]}>
                      {t.label} · {tabCount('user', t.key)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* NUEVO: Filtro de prioridad (Usuarios) */}
            <View style={s.tabsRow} >
              {PRIOS.map(p => {
                const active = prioUsuarios === p.key;
                return (
                  <Pressable
                    key={p.key}
                    onPress={() => setPrioUsuarios(p.key)}
                    style={[s.tabBtn, active && s.tabBtnActive]}
                  >
                    <Text style={[s.tabBtnText, active && s.tabBtnTextActive]}>{p.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <FlatList
              data={filteredUsers}
              keyExtractor={(it) => it.id}
              renderItem={renderUserItem}
              contentContainerStyle={s.listContent}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={s.emptyBox}>
                  <Ionicons name="mail-open" size={20} color="#94A3B8" />
                  <Text style={s.emptyText}>Sin mensajes</Text>
                </View>
              }
            />
          </View>
        )}

        {/* ==== Apartado: Moderadores (tickets) ==== */}
        {apartado === 'moderadores' && (
          <View style={s.section}>
            <View style={s.sectionHeaderRow}>
              <Text style={s.sectionTitle}>Mensajes de moderadores</Text>
            </View>

            {/* Toolbar de moderadores: búsqueda + tabs estado */}
            <View style={s.toolbarRow}>
              <View style={s.searchBar}>
                <Ionicons name="search" size={16} color="#64748B" />
                <TextInput
                  value={qModeradores}
                  onChangeText={setQModeradores}
                  placeholder="Buscar por asunto, moderador, #ID…"
                  placeholderTextColor="#94A3B8"
                  style={s.searchInput}
                />
                {qModeradores.length > 0 && (
                  <Pressable onPress={() => setQModeradores('')} hitSlop={10}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </Pressable>
                )}
              </View>

              <View style={s.tabsRow}>
                {TABS.map(t => (
                  <Pressable
                    key={t.key}
                    onPress={() => setTabModeradores(t.key)}
                    style={[s.tabBtn, tabModeradores === t.key && s.tabBtnActive]}
                  >
                    <Text style={[s.tabBtnText, tabModeradores === t.key && s.tabBtnTextActive]}>
                      {t.label} · {tabCount('mod', t.key)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* NUEVO: Filtro de prioridad (Moderadores) */}
            <View style={s.tabsRow}>
              {PRIOS.map(p => {
                const active = prioModeradores === p.key;
                return (
                  <Pressable
                    key={p.key}
                    onPress={() => setPrioModeradores(p.key)}
                    style={[s.tabBtn, active && s.tabBtnActive]}
                  >
                    <Text style={[s.tabBtnText, active && s.tabBtnTextActive]}>{p.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <FlatList
              data={filteredMods}
              keyExtractor={(it) => it.id}
              renderItem={renderModItem}
              contentContainerStyle={s.listContent}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={s.emptyBox}>
                  <Ionicons name="chatbubbles" size={20} color="#94A3B8" />
                  <Text style={s.emptyText}>Sin mensajes</Text>
                </View>
              }
            />
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
