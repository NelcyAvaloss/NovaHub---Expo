import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminModeradoresScreen.styles';

export default function AdminModeradoresScreen({ navigation }) {
  const BTN_HEIGHT = 44; // altura uniforme de botones
  const BTN_GAP = 12;    // separación entre filas de botones

  // ====== Estado principal ======
  const [moderadores, setModeradores] = useState([
    {
      id: 'm1',
      nombre: 'Ana Martínez',
      email: 'ana@novahub.com',
      telefono: '+503 7000 0001',
      estado: 'activo',
      ubicacion: 'San Miguel, SV',
      turno: 'Diurno',
      disponibilidad: 'Disponible',
      desde: '2024-01-15',
      ultimaActividad: '2025-10-10T14:22:00Z',
      bio: 'Especialista en revisión de contenido y prevención de abuso.',
      stats: { resueltos: 128, pendientes: 5, tasa: 91, ttaMin: 18 },
    },
    {
      id: 'm2',
      nombre: 'Luis Pineda',
      email: 'luis@novahub.com',
      telefono: '+503 7000 0002',
      estado: 'inactivo',
      ubicacion: 'San Salvador, SV',
      turno: 'Nocturno',
      disponibilidad: 'Fuera de turno',
      desde: '2023-08-02',
      ultimaActividad: '2025-09-28T21:05:00Z',
      bio: 'Enfoque en cumplimiento legal y gestión de reportes complejos.',
      stats: { resueltos: 92, pendientes: 0, tasa: 88, ttaMin: 24 },
    },
    {
      id: 'm3',
      nombre: 'María López',
      email: 'maria@novahub.com',
      telefono: '+503 7000 0003',
      estado: 'activo',
      ubicacion: 'Santa Ana, SV',
      turno: 'Mixto',
      disponibilidad: 'Disponible',
      desde: '2024-04-09',
      ultimaActividad: '2025-10-15T09:40:00Z',
      bio: 'Soporte al usuario y coordinación con el equipo de contenido.',
      stats: { resueltos: 64, pendientes: 12, tasa: 83, ttaMin: 31 },
    },
  ]);

  // ====== Búsqueda / filtros ======
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState('todos'); // 'todos' | 'activo' | 'inactivo'

  const dataFiltrada = useMemo(() => {
    const base = filtro === 'todos' ? moderadores : moderadores.filter(m => m.estado === filtro);
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(
      (m) =>
        m.nombre.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.telefono || '').toLowerCase().includes(q) ||
        (m.ubicacion || '').toLowerCase().includes(q)
    );
  }, [moderadores, query, filtro]);

  // ====== Modal: Agregar moderador ======
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ubicacion: '',
    turno: 'Diurno',
    bio: '',
  });

  const resetAddForm = () => setAddForm({
    nombre: '',
    email: '',
    telefono: '',
    ubicacion: '',
    turno: 'Diurno',
    bio: '',
  });

  const onAddModerator = () => {
    const { nombre, email } = addForm;
    if (!nombre.trim() || !email.trim()) {
      Alert.alert('Campos requeridos', 'Nombre y correo son obligatorios.');
      return;
    }
    const id = `m${Date.now()}`;
    const nuevo = {
      id,
      nombre: addForm.nombre.trim(),
      email: addForm.email.trim(),
      telefono: addForm.telefono.trim() || '',
      estado: 'activo',
      ubicacion: addForm.ubicacion.trim() || '',
      turno: addForm.turno || 'Diurno',
      disponibilidad: 'Disponible',
      desde: new Date().toISOString().slice(0,10),
      ultimaActividad: new Date().toISOString(),
      bio: addForm.bio.trim() || '',
      stats: { resueltos: 0, pendientes: 0, tasa: 100, ttaMin: 0 },
    };
    setModeradores(prev => [nuevo, ...prev]);
    setShowAdd(false);
    resetAddForm();
  };

  // ====== Modal: Editar moderador ======
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ubicacion: '',
    turno: '',
    bio: '',
  });

  const openEdit = (mod) => {
    setEditId(mod.id);
    setEditForm({
      nombre: mod.nombre || '',
      email: mod.email || '',
      telefono: mod.telefono || '',
      ubicacion: mod.ubicacion || '',
      turno: mod.turno || 'Diurno',
      bio: mod.bio || '',
    });
    setShowEdit(true);
  };

  const onSaveEdit = () => {
    const { nombre, email } = editForm;
    if (!nombre.trim() || !email.trim()) {
      Alert.alert('Campos requeridos', 'Nombre y correo son obligatorios.');
      return;
    }
    setModeradores(prev =>
      prev.map(m => m.id === editId
        ? {
            ...m,
            nombre: editForm.nombre.trim(),
            email: editForm.email.trim(),
            telefono: (editForm.telefono || '').trim(),
            ubicacion: (editForm.ubicacion || '').trim(),
            turno: editForm.turno || 'Diurno',
            bio: (editForm.bio || '').trim(),
          }
        : m
      )
    );
    setShowEdit(false);
    setEditId(null);
  };

  // ====== Acciones por moderador ======
  const toggleEstado = (id) => {
    setModeradores(prev =>
      prev.map(m => m.id === id
        ? {
            ...m,
            estado: m.estado === 'activo' ? 'inactivo' : 'activo',
            disponibilidad: m.estado === 'activo' ? 'Fuera de turno' : 'Disponible',
          }
        : m
      )
    );
  };

  const eliminarModerador = (id) => {
    const m = moderadores.find(x => x.id === id);
    Alert.alert(
      'Eliminar moderador',
      `¿Seguro que deseas eliminar a ${m?.nombre || 'este moderador'}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setModeradores(prev => prev.filter(x => x.id !== id));
          }
        }
      ]
    );
  };

  // ====== Render de ítem ======
  const renderItem = ({ item }) => {
    const activo = item.estado === 'activo';
    return (
      <View style={s.card}>
        {/* Header */}
        <View style={s.cardHeader}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{(item.nombre?.[0] || 'M').toUpperCase()}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={s.name} numberOfLines={1}>{item.nombre}</Text>
            <Text style={s.email} numberOfLines={1}>{item.email}</Text>
          </View>

          <View style={[s.estadoPill, activo ? s.estadoActivo : s.estadoInactivo]}>
            <View style={[s.estadoDot, activo ? s.dotOk : s.dotWarn]} />
            <Text style={[s.estadoText, activo ? s.estadoTextOk : s.estadoTextWarn]}>
              {item.estado}
            </Text>
          </View>
        </View>

        {/* Bio corta */}
        {!!item.bio && <Text style={s.bioText}>{item.bio}</Text>}

        {/* Información general */}
        <View style={s.infoGrid}>
          <InfoRow icon="call-outline" label="Teléfono" value={item.telefono || '—'} />
          <InfoRow icon="location-outline" label="Ubicación" value={item.ubicacion || '—'} />
          <InfoRow icon="sunny-outline" label="Turno" value={item.turno || '—'} />
          <InfoRow
            icon="pulse-outline"
            label="Disponibilidad"
            value={item.disponibilidad || (activo ? 'Disponible' : 'No disponible')}
            color={activo ? '#16A34A' : '#DC2626'}
          />
          <InfoRow icon="calendar-outline" label="Desde" value={new Date(item.desde).toLocaleDateString()} />
          <InfoRow icon="time-outline" label="Última actividad" value={new Date(item.ultimaActividad).toLocaleString()} />
        </View>

        {/* Métricas */}
        <View style={s.metricsRow}>
          <KpiBox color="#3730A3" label="Resueltos" value={item.stats.resueltos} />
          <KpiBox color="#F59E0B" label="Pendientes" value={item.stats.pendientes} />
          <KpiBox color="#10B981" label="Aprobación" value={`${item.stats.tasa}%`} />
          <KpiBox color="#0284C7" label="T. medio" value={`${item.stats.ttaMin}m`} />
        </View>

        {/* Acciones: 2 arriba / 3 abajo (estables) */}
        <View style={{ gap: BTN_GAP }}>
          {/* Fila superior (2) */}
          <View style={[s.actionsRow, { justifyContent: 'space-between' }]}>
            <Pressable
              style={[s.btn, s.btnGhost, { height: BTN_HEIGHT, width: '49%' }]}
              onPress={() => Alert.alert('Perfil', `Abrir perfil de ${item.nombre} (WIP)`)}
            >
              <Ionicons name="person-circle" size={16} color="#3730A3" style={s.btnIcon} />
              <Text style={s.btnGhostText} numberOfLines={1}>Ver perfil</Text>
            </Pressable>

            <Pressable
              style={[s.btn, s.btnPrimary, { height: BTN_HEIGHT, width: '49%' }]}
              onPress={() => navigation.navigate('AdminSoporte', { moderadorId: item.id })}
            >
              <Ionicons name="chatbubble-ellipses" size={16} color="#fff" style={s.btnIcon} />
              <Text style={s.btnPrimaryText} numberOfLines={1}>Mensaje</Text>
            </Pressable>
          </View>

          {/* Fila inferior (3) */}
          <View style={[s.actionsRow, { justifyContent: 'space-between' }]}>
            <Pressable
              style={[s.btn, s.btnGhost, { height: BTN_HEIGHT, width: '36%' }]}
              onPress={() => toggleEstado(item.id)}
            >
              <Ionicons
                name={item.estado === 'activo' ? 'pause-circle' : 'play-circle'}
                size={16}
                color="#3730A3"
                style={s.btnIcon}
              />
              <Text style={s.btnGhostText} numberOfLines={1}>
                {item.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}
              </Text>
            </Pressable>

            <Pressable
              style={[s.btn, s.btnGhost, { height: BTN_HEIGHT, width: '26%' }]}
              onPress={() => openEdit(item)}
            >
              <Ionicons name="pencil" size={16} color="#3730A3" style={s.btnIcon} />
              <Text style={s.btnGhostText} numberOfLines={1}>Editar</Text>
            </Pressable>

            <Pressable
              style={[s.btn, { height: BTN_HEIGHT, width: '30%', backgroundColor: '#DC2626', borderColor: '#DC2626' }]}
              onPress={() => eliminarModerador(item.id)}
            >
              <Ionicons name="trash" size={16} color="#fff" style={s.btnIcon} />
              <Text style={[s.btnPrimaryText, { color: '#fff' }]} numberOfLines={1}>Eliminar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  // ====== UI ======
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={s.headerTitle}>Moderadores</Text>
              <Text style={s.headerSub}>Gestión del equipo de moderación</Text>
            </View>

            {/* Botón: Agregar moderador */}
            <Pressable
              style={[s.headerChip, s.headerChipPrimary, { flexDirection: 'row', alignItems: 'center' }]}
              onPress={() => setShowAdd(true)}
            >
              <Ionicons name="person-add" size={14} color="#EEF2FF" style={s.headerChipIcon} />
              <Text style={[s.headerChipText, s.headerChipTextPrimary]}>Agregar</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      {/* ===== Búsqueda + filtros ===== */}
      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <Ionicons name="search" size={16} color="#64748B" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por nombre, email, teléfono o ubicación…"
            placeholderTextColor="#94A3B8"
            style={s.searchInput}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        <View style={s.filtersRow}>
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'activo', label: 'Activos' },
            { key: 'inactivo', label: 'Inactivos' },
          ].map((f) => {
            const active = filtro === f.key;
            return (
              <Pressable
                key={f.key}
                style={[s.filterChip, active && s.filterChipActive]}
                onPress={() => setFiltro(f.key)}
              >
                <Text style={[s.filterChipText, active && s.filterChipTextActive]}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ===== Lista ===== */}
      <FlatList
        data={dataFiltrada}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.listContent}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Ionicons name="file-tray" size={22} color="#94A3B8" />
            <Text style={s.emptyText}>No hay moderadores que coincidan</Text>
          </View>
        }
      />

      {/* ===== Modal Agregar moderador ===== */}
      <Modal
        visible={showAdd}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAdd(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '700', fontSize: 16, color: '#0F172A' }}>Agregar moderador</Text>
              <Pressable onPress={() => setShowAdd(false)}>
                <Ionicons name="close" size={18} color="#0F172A" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <View style={{ gap: 10 }}>
                <Input label="Nombre" value={addForm.nombre} onChangeText={(v) => setAddForm(p => ({ ...p, nombre: v }))} />
                <Input label="Email" value={addForm.email} keyboardType="email-address" onChangeText={(v) => setAddForm(p => ({ ...p, email: v }))} />
                <Input label="Teléfono" value={addForm.telefono} keyboardType="phone-pad" onChangeText={(v) => setAddForm(p => ({ ...p, telefono: v }))} />
                <Input label="Ubicación" value={addForm.ubicacion} onChangeText={(v) => setAddForm(p => ({ ...p, ubicacion: v }))} />
                <Input label="Turno" value={addForm.turno} onChangeText={(v) => setAddForm(p => ({ ...p, turno: v }))} />
                <Input label="Bio" value={addForm.bio} onChangeText={(v) => setAddForm(p => ({ ...p, bio: v }))} multiline />
              </View>
            </ScrollView>

            <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Pressable style={[s.btn, s.btnGhost]} onPress={() => { setShowAdd(false); }}>
                <Text style={s.btnGhostText}>Cancelar</Text>
              </Pressable>
              <Pressable style={[s.btn, s.btnPrimary]} onPress={onAddModerator}>
                <Text style={s.btnPrimaryText}>Agregar</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ===== Modal Editar moderador ===== */}
      <Modal
        visible={showEdit}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEdit(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: '700', fontSize: 16, color: '#0F172A' }}>Editar moderador</Text>
              <Pressable onPress={() => setShowEdit(false)}>
                <Ionicons name="close" size={18} color="#0F172A" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <View style={{ gap: 10 }}>
                <Input label="Nombre" value={editForm.nombre} onChangeText={(v) => setEditForm(p => ({ ...p, nombre: v }))} />
                <Input label="Email" value={editForm.email} keyboardType="email-address" onChangeText={(v) => setEditForm(p => ({ ...p, email: v }))} />
                <Input label="Teléfono" value={editForm.telefono} keyboardType="phone-pad" onChangeText={(v) => setEditForm(p => ({ ...p, telefono: v }))} />
                <Input label="Ubicación" value={editForm.ubicacion} onChangeText={(v) => setEditForm(p => ({ ...p, ubicacion: v }))} />
                <Input label="Turno" value={editForm.turno} onChangeText={(v) => setEditForm(p => ({ ...p, turno: v }))} />
                <Input label="Bio" value={editForm.bio} onChangeText={(v) => setEditForm(p => ({ ...p, bio: v }))} multiline />
              </View>
            </ScrollView>

            <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <Pressable style={[s.btn, s.btnGhost]} onPress={() => setShowEdit(false)}>
                <Text style={s.btnGhostText}>Cancelar</Text>
              </Pressable>
              <Pressable style={[s.btn, s.btnPrimary]} onPress={onSaveEdit}>
                <Text style={s.btnPrimaryText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

/* ====== Subcomponentes ====== */
function InfoRow({ icon, label, value, color }) {
  return (
    <View style={s.infoRow}>
      <Ionicons name={icon} size={16} color="#334155" />
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={[s.infoValue, color ? { color } : null]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function KpiBox({ color, label, value }) {
  return (
    <View style={[s.kpi, { borderColor: color + '33', backgroundColor: color + '12' }]}>
      <Text style={[s.kpiValue, { color }]} numberOfLines={1}>{value}</Text>
      <Text style={s.kpiLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

function Input({ label, multiline = false, ...props }) {
  return (
    <View>
      <Text style={{ color: '#334155', fontSize: 12, marginBottom: 4 }}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor="#94A3B8"
        style={{
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: multiline ? 10 : 8,
          minHeight: multiline ? 80 : undefined,
          color: '#0F172A',
        }}
      />
    </View>
  );
}
