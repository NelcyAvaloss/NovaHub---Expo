import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ImageBackground,
  Alert,
  Modal,
  Switch,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminReportsListScreen.styles';

const TABS = [
  { key: 'todos',         label: 'Todos' },
  { key: 'abierto',       label: 'Abiertos' },
  { key: 'pendiente',     label: 'Pendientes' },
  { key: 'resuelto',      label: 'Resueltos' },
  { key: 'sin_resolver',  label: 'Sin resolver' },
];

const REPORT_CATEGORIES = [
  'Spam',
  'Lenguaje ofensivo',
  'Acoso/Agresión',
  'NSFW',
  'Contenido engañoso',
  'Seguridad',
  'Privacidad',
  'Otro',
];

const INITIAL = [
  { id: 'r1', reason: 'Spam',               state: 'abierto',   targetType: 'publicacion', targetId: 'p2', reporter: 'Alice',  createdAt: '2025-10-10 09:10', category: 'Spam' },
  { id: 'r2', reason: 'Agresión',           state: 'pendiente', targetType: 'usuario',     targetId: 'u3', reporter: 'Bob',    createdAt: '2025-10-11 08:02', category: 'Acoso/Agresión' },
  { id: 'r3', reason: 'NSFW',               state: 'resuelto',  targetType: 'publicacion', targetId: 'p1', reporter: 'María',  createdAt: '2025-10-09 17:40', category: 'NSFW' },
  { id: 'r4', reason: 'Contenido engañoso', state: 'abierto',   targetType: 'publicacion', targetId: 'p7', reporter: 'Carlos', createdAt: '2025-10-12 12:33', category: 'Contenido engañoso' },
  { id: 'r5', reason: 'Reporte sin clasificar', state: 'pendiente', targetType: 'publicacion', targetId: 'p9', reporter: 'Eva', createdAt: '2025-10-12 13:22', category: null },
];

export default function AdminReportsListScreen({ navigation }) {
  const [reports, setReports] = React.useState(INITIAL);

  const [q, setQ] = React.useState('');
  const [tab, setTab] = React.useState('todos');

  // para resaltar la tarjeta que cambió de estado
  const [lastChangedId, setLastChangedId] = React.useState(null);
  React.useEffect(() => {
    if (!lastChangedId) return;
    const t = setTimeout(() => setLastChangedId(null), 900);
    return () => clearTimeout(t);
  }, [lastChangedId]);

  // Filtros generales
  const [showFilters, setShowFilters] = React.useState(false);
  const [onlyUsers, setOnlyUsers] = React.useState(false);
  const [onlyPosts, setOnlyPosts] = React.useState(false);
  const [range, setRange] = React.useState('30d');

  // Filtro GLOBAL por categoría (no edita reportes)
  const [catModal, setCatModal] = React.useState(false);
  const [catQuery, setCatQuery] = React.useState('');
  const [selectedCat, setSelectedCat] = React.useState('todas'); // 'todas' | 'none' | categoría

  // KPIs
  const counts = React.useMemo(() => ({
    total:        reports.length,
    abierto:      reports.filter(r => r.state === 'abierto').length,
    pendiente:    reports.filter(r => r.state === 'pendiente').length,
    resuelto:     reports.filter(r => r.state === 'resuelto').length,
    sin_resolver: reports.filter(r => r.state === 'sin_resolver').length,
  }), [reports]);

  // Lista filtrada
  const filtered = React.useMemo(() => {
    const base = reports
      .filter(r => (tab === 'todos' ? true : r.state === tab))
      .filter(r => {
        if (onlyUsers && r.targetType !== 'usuario') return false;
        if (onlyPosts && r.targetType !== 'publicacion') return false;
        return true;
      })
      .filter(r => {
        if (selectedCat === 'todas') return true;
        if (selectedCat === 'none') return r.category == null;
        return r.category === selectedCat;
      })
      .filter(r => {
        const text = `${r.id} ${r.reason} ${r.targetId} ${r.reporter} ${r.category ?? ''}`.toLowerCase();
        return text.includes(q.toLowerCase().trim());
      });

    return base;
  }, [q, tab, onlyUsers, onlyPosts, range, selectedCat, reports]);

  const badge = (st) => {
    if (st === 'resuelto')       return { box: s.badgeGreen,  text: s.badgeTextDark, icon: 'checkmark-circle' };
    if (st === 'pendiente')      return { box: s.badgeYellow, text: s.badgeTextWarn, icon: 'time' };
    if (st === 'abierto')        return { box: s.badgeBlue,   text: s.badgeTextInfo, icon: 'alert-circle' };
    if (st === 'sin_resolver')   return { box: s.badgeBlue,   text: s.badgeTextInfo, icon: 'help-circle' };
    return { box: s.badgeBlue, text: s.badgeTextInfo, icon: 'information-circle' };
  };

  // ===== Acciones =====
  const resolver = (id) => {
    setReports(prev => prev.map(r => {
      if (r.id !== id) return r;
      if (r.state === 'resuelto') {
        setLastChangedId(id);
        Alert.alert('Sin resolver', `Reporte ${id} cambiado a "sin resolver".`);
        return { ...r, state: 'sin_resolver' };
      }
      setLastChangedId(id);
      Alert.alert('Resolver', `Reporte ${id} marcado como resuelto.`);
      return { ...r, state: 'resuelto' };
    }));
  };

  const marcarSinResolver = (id) => {
    setReports(prev => prev.map(r => (r.id === id ? { ...r, state: 'sin_resolver' } : r)));
    setLastChangedId(id);
    Alert.alert('Sin resolver', `Reporte ${id} marcado como "sin resolver".`);
  };

  const openReport = (id) => {
    setReports(prev =>
      prev.map(r => (r.id === id && r.state === 'pendiente' ? { ...r, state: 'abierto' } : r))
    );
    setLastChangedId(id);
    navigation.navigate('AdminReportDetall', { reportId: id });
  };

  // ===== Estilo dinámico para los chips de acción =====
  // kind: 'resolve' - 'unresolve'
  const chipPalette = (state, kind) => {
    const active =
      (kind === 'resolve'   && state === 'resuelto') ||
      (kind === 'unresolve' && state === 'sin_resolver');

    return {
      wrap: [s.chipAction, active && s.chipPrimary],
      textStyle: active ? s.chipTextPrimary : s.chipText,
      iconColor: active ? '#EEF2FF' : '#334155',
    };
  };

  // ===== Modal: filtro global por categoría =====
  const renderCategoryModal = () => {
    const list = REPORT_CATEGORIES.filter(c =>
      c.toLowerCase().includes(catQuery.trim().toLowerCase())
    );

    return (
      <Modal
        transparent
        visible={catModal}
        animationType="fade"
        onRequestClose={() => setCatModal(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Filtrar por categoría</Text>
              <Pressable onPress={() => setCatModal(false)} style={s.modalClose}>
                <Ionicons name="close" size={18} color="#0F172A" />
              </Pressable>
            </View>

            <View style={s.modalSearchWrap}>
              <Ionicons name="search" size={16} color="#64748B" style={s.modalSearchIcon} />
              <TextInput
                value={catQuery}
                onChangeText={setCatQuery}
                placeholder="Buscar categoría…"
                placeholderTextColor="#94A3B8"
                style={s.modalInput}
              />
            </View>

            {/* Todas */}
            <Pressable
              style={[s.modalItem, selectedCat === 'todas' && s.modalItemActive]}
              onPress={() => { setSelectedCat('todas'); setCatModal(false); }}
            >
              <Ionicons
                name={selectedCat === 'todas' ? 'radio-button-on' : 'radio-button-off'}
                size={14}
                color={selectedCat === 'todas' ? '#4F46E5' : '#94A3B8'}
              />
              <Text style={[s.modalItemText, selectedCat === 'todas' && s.modalItemTextActive]}>
                Todas las categorías
              </Text>
            </Pressable>

            {/* Sin categoría */}
            <Pressable
              style={[s.modalItem, selectedCat === 'none' && s.modalItemActive]}
              onPress={() => { setSelectedCat('none'); setCatModal(false); }}
            >
              <Ionicons
                name={selectedCat === 'none' ? 'radio-button-on' : 'radio-button-off'}
                size={14}
                color={selectedCat === 'none' ? '#4F46E5' : '#94A3B8'}
              />
              <Text style={[s.modalItemText, selectedCat === 'none' && s.modalItemTextActive]}>
                Sin categoría
              </Text>
            </Pressable>

            <FlatList
              data={list}
              keyExtractor={(it) => it}
              contentContainerStyle={s.modalList}
              renderItem={({ item }) => (
                <Pressable
                  style={[s.modalItem, selectedCat === item && s.modalItemActive]}
                  onPress={() => { setSelectedCat(item); setCatModal(false); }}
                >
                  <Ionicons
                    name={selectedCat === item ? 'radio-button-on' : 'radio-button-off'}
                    size={14}
                    color={selectedCat === item ? '#4F46E5' : '#94A3B8'}
                  />
                  <Text style={[s.modalItemText, selectedCat === item && s.modalItemTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      {/* Header  */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Reportes</Text>
          <Text style={s.headerSub}>Revisa y resuelve incidencias</Text>

          <View style={s.headerChipsRow}>
            <View style={[s.headerChip, s.headerChipPrimary]}>
              <Ionicons name="calendar-outline" size={14} color="#EEF2FF" style={s.headerChipIcon} />
              <Text style={[s.headerChipText, s.headerChipTextPrimary]}>
                {range === '30d' ? 'Últimos 30 días' : range === '7d' ? 'Últimos 7 días' : 'Todo'}
              </Text>
            </View>

            <Pressable
              style={s.headerChip}
              onPress={() => setCatModal(true)}
              android_ripple={{ color: '#E2E8F0' }}
            >
              <Ionicons name="pricetag" size={14} color="#1E293B" style={s.headerChipIcon} />
              <Text style={s.headerChipText}>
                {selectedCat === 'todas' ? 'Todas las categorías'
                  : selectedCat === 'none' ? 'Sin categoría'
                  : selectedCat}
              </Text>
              <Ionicons name="chevron-down" size={14} color="#1E293B" style={{ marginLeft: 4 }} />
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* Toolbar */}
        <View style={s.toolbarRow}>
          <View style={s.searchWrap}>
            <Ionicons name="search" size={16} color="#64748B" style={s.searchIcon} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Buscar por razón, #ID, usuario o publicación…"
              placeholderTextColor="#94A3B8"
              style={s.input}
            />
          </View>

          <Pressable style={[s.btn, s.btnGhost]} onPress={() => setShowFilters(true)}>
            <View style={s.iconFilledWrap}>
              <Ionicons name="funnel" size={14} color="#EEF2FF" />
            </View>
            <Text style={s.btnGhostText}>Filtros</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={s.tabsRow}>
          {TABS.map(t => {
            const count =
              t.key === 'todos'         ? counts.total :
              t.key === 'abierto'       ? counts.abierto :
              t.key === 'pendiente'     ? counts.pendiente :
              t.key === 'resuelto'      ? counts.resuelto :
              counts.sin_resolver;
            return (
              <Pressable
                key={t.key}
                onPress={() => setTab(t.key)}
                style={[s.tabBtn, tab === t.key && s.tabBtnActive]}
              >
                <Text style={[s.tabBtnText, tab === t.key && s.tabBtnTextActive]}>
                  {t.label} · {count}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* KPIs: 3 arriba, 2 centrados abajo */}
        <View style={s.metricsTopRow}>
          <View style={s.metricCard}><Text style={s.metricLabel}>Total</Text><Text style={s.metricValue}>{counts.total}</Text></View>
          <View style={s.metricCard}><Text style={s.metricLabel}>Abiertos</Text><Text style={s.metricValue}>{counts.abierto}</Text></View>
          <View style={s.metricCard}><Text style={s.metricLabel}>Pendientes</Text><Text style={s.metricValue}>{counts.pendiente}</Text></View>
        </View>
        <View style={s.metricsBottomRow}>
          <View style={s.metricCard}><Text style={s.metricLabel}>Resueltos</Text><Text style={s.metricValue}>{counts.resuelto}</Text></View>
          <View style={s.metricCard}><Text style={s.metricLabel}>Sin resolver</Text><Text style={s.metricValue}>{counts.sin_resolver}</Text></View>
        </View>

        {/* Lista */}
        <View style={s.listSection}>
          {filtered.map(r => {
            const b = badge(r.state);
            const isUser = r.targetType === 'usuario';
            const changed = lastChangedId === r.id;

            // paletas dinámicas para cada botón según el estado del reporte
            const pr = chipPalette(r.state, 'resolve');
            const pu = chipPalette(r.state, 'unresolve');

            return (
              <Pressable
                key={r.id}
                style={[s.card, changed && s.cardChanged]}
                onPress={() => openReport(r.id)}
              >
                <View style={[s.stateBand, isUser ? s.bandPurple : s.bandIndigo]} />

                <View style={s.cardRow}>
                  <View style={s.iconTarget}>
                    <Ionicons name={isUser ? 'person' : 'document-text'} size={16} color="#3730A3" />
                  </View>

                  <View style={s.cardLeft}>
                    <Text style={s.title} numberOfLines={1}>
                      Reporte {r.id} · {r.reason}
                    </Text>
                    <Text style={s.sub} numberOfLines={1}>
                      {isUser ? 'Usuario' : 'Publicación'}: {r.targetId} · por {r.reporter} · {r.createdAt}
                    </Text>
                  </View>

                  <View style={[s.badge, b.box]}>
                    <Ionicons
                      name={b.icon}
                      size={14}
                      color={
                        r.state === 'resuelto'      ? '#065F46' :
                        r.state === 'pendiente'     ? '#92400E' :
                        '#1E3A8A'
                      }
                    />
                    <Text style={b.text}>{r.state.replace('_', ' ')}</Text>
                  </View>
                </View>

                {/* Categoría (solo lectura) */}
                <View style={s.rowBetween}>
                  <View style={s.categoryPill}>
                    <Ionicons name="pricetag" size={12} color="#3730A3" />
                    <Text style={s.categoryPillText}>{r.category ?? 'Sin categoría'}</Text>
                  </View>
                </View>

                {/* Acciones rápidas (SIN botón Cerrar) con sombreado dinámico */}
                <View style={s.chipRow}>
                  <Pressable style={pr.wrap} onPress={() => resolver(r.id)}>
                    <Ionicons name="checkmark-circle" size={14} color={pr.iconColor} />
                    <Text style={pr.textStyle}>Resolver</Text>
                  </Pressable>

                  <Pressable style={pu.wrap} onPress={() => marcarSinResolver(r.id)}>
                    <Ionicons name="help-circle" size={14} color={pu.iconColor} />
                    <Text style={pu.textStyle}>Sin resolver</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })}

          {filtered.length === 0 && (
            <View style={s.emptyBox}>
              <Ionicons name="file-tray" size={20} color="#94A3B8" />
              <Text style={s.emptyText}>Sin resultados</Text>
            </View>
          )}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Modal: filtro global por categoría */}
      {renderCategoryModal()}

      {/* Modal de Filtros generales */}
      <Modal visible={showFilters} transparent animationType="fade" onRequestClose={() => setShowFilters(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Filtros</Text>
              <Pressable onPress={() => setShowFilters(false)} style={s.modalClose}>
                <Ionicons name="close" size={18} color="#0F172A" />
              </Pressable>
            </View>

            <View style={s.modalSection}>
              <Text style={s.modalSectionTitle}>Tipo de objetivo</Text>
              <View style={s.switchRow}>
                <View style={s.switchLabelRow}>
                  <View style={s.switchIconWrap}><Ionicons name="document-text" size={14} color="#3730A3" /></View>
                  <Text style={s.switchLabel}>Solo publicaciones</Text>
                </View>
                <Switch value={onlyPosts} onValueChange={v => { setOnlyPosts(v); if (v) setOnlyUsers(false); }} />
              </View>
              <View style={[s.switchRow, { marginTop: 8 }]}>
                <View style={s.switchLabelRow}>
                  <View style={s.switchIconWrap}><Ionicons name="person" size={14} color="#3730A3" /></View>
                  <Text style={s.switchLabel}>Solo usuarios</Text>
                </View>
                <Switch value={onlyUsers} onValueChange={v => { setOnlyUsers(v); if (v) setOnlyPosts(false); }} />
              </View>
            </View>

            <View style={s.modalSection}>
              <Text style={s.modalSectionTitle}>Rango</Text>
              <View style={s.rangeRow}>
                {[{ k: '7d', label: '7 días' }, { k: '30d', label: '30 días' }, { k: 'all', label: 'Todo' }].map(opt => (
                  <Pressable key={opt.k} style={[s.rangePill, range === opt.k && s.rangePillActive]} onPress={() => setRange(opt.k)}>
                    <Text style={[s.rangePillText, range === opt.k && s.rangePillTextActive]}>{opt.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={s.modalFooter}>
              <Pressable
                style={[s.btn, s.btnGhost]}
                onPress={() => { setOnlyPosts(false); setOnlyUsers(false); setRange('30d'); }}
              >
                <Text style={s.btnGhostText}>Restablecer</Text>
              </Pressable>
              <Pressable style={[s.btn, s.btnPrimary]} onPress={() => setShowFilters(false)}>
                <Text style={s.btnPrimaryText}>Aplicar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
