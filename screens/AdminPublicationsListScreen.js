import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ImageBackground,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminPublicationsListScreen.styles';
import { obtenerPublicaciones,aprobarPublicacion, rechazarPublicacion, eliminarPublicacion } from '../services/AdminPublicacionesService';

// MOCK inicial (sin "pendiente")
const INITIAL = [
  { id: 'p1', title: 'Guía de onboarding para estudiantes nuevos de Ingeniería de Sistemas', author: 'María',   state: 'publicada',  createdAt: '2025-10-01', category: 'Ingeniería', area: 'Programación I' },
  { id: 'p2', title: 'Tips de productividad que realmente funcionan en parciales y laboratorios', author: 'Geo',  state: 'publicada', createdAt: '2025-10-10', category: 'Ingeniería', area: 'UX Básico' },
  { id: 'p3', title: 'Normas de comunidad y convivencia académica',   author: 'Alice', state: 'rechazada', createdAt: '2025-10-07', category: 'Derecho',    area: 'Ética' },
  { id: 'p4', title: 'Eventos internos 2025 de la facultad', author: 'Bruno', state: 'publicada', createdAt: '2025-10-12', category: 'Admin',      area: 'Comunidad' },
  { id: 'p5', title: 'Política de uso de espacios y laboratorios',       author: 'Sara',  state: 'publicada',  createdAt: '2025-09-25', category: 'Admin',      area: 'Reglamento' },
];

// Tabs de estado (ya sin “pendiente”)
const STATES = ['todas', 'publicada', 'rechazada'];

export default function AdminPublicationsListScreen({ navigation }) {
  const [items, setItems] = React.useState(INITIAL);
React.useEffect(() => {
  async function fetchData() {
    // Cargar publicaciones reales desde Supabase
    console.log('Cargando publicaciones desde Supabase...');
    const data = await obtenerPublicaciones();
    console.log('Publicaciones cargadas:', data);
    setItems(data);
  }
  fetchData();
}, []);


  // UI state
  const [q, setQ] = React.useState('');
  const [tab, setTab] = React.useState('todas');

  // Filtros por categoría / área (con selects modales)
  const [cat, setCat] = React.useState('todas');
  const [ar, setAr] = React.useState('todas');

  const [catModal, setCatModal] = React.useState(false);
  const [arModal, setArModal] = React.useState(false);
  const [catQuery, setCatQuery] = React.useState('');
  const [arQuery, setArQuery] = React.useState('');

  // Selección múltiple
  const [selectMode, setSelectMode] = React.useState(false);
  const [selected, setSelected] = React.useState(new Set());

  // ---- Opciones dinámicas (globales) ----
  const categories = React.useMemo(
    () => ['todas', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))],
    [items]
  );

  // Mapa categoría -> Set(áreas) para restringir el selector de áreas
  const categoryAreas = React.useMemo(() => {
    const map = {};
    items.forEach(i => {
      if (!i.category || !i.area) return;
      if (!map[i.category]) map[i.category] = new Set();
      map[i.category].add(i.area);
    });
    return map;
  }, [items]);

  // Áreas visibles según la categoría seleccionada
  const areaOptions = React.useMemo(() => {
    if (cat === 'todas') {
      // si no hay categoría filtrada, mostrar todas las áreas disponibles
      const allAreas = Array.from(new Set(items.map(i => i.area).filter(Boolean)));
      return ['todas', ...allAreas];
    }
    const set = categoryAreas[cat] || new Set();
    return ['todas', ...Array.from(set)];
  }, [cat, categoryAreas, items]);

  // Métricas
  const metrics = React.useMemo(() => ({
    total: items.length,
    publicadas: items.filter(d => d.state === 'publicada').length,
    rechazadas: items.filter(d => d.state === 'rechazada').length,
  }), [items]);

  // Filtro combinado
  const filtered = React.useMemo(() => {
    const text = q.toLowerCase().trim();
    return items
      .filter(x => (tab === 'todas' ? true : x.state === tab))
      .filter(x => (cat === 'todas' ? true : x.category === cat))
      .filter(x => (ar === 'todas' ? true : x.area === ar))
      .filter(x => !text || `${x.title} ${x.author}`.toLowerCase().includes(text));
  }, [items, q, tab, cat, ar]);

  // Badges por estado (solo 2 estados)
  const badge = (st) =>
    st === 'publicada'
      ? { box: s.badgeGreen, text: s.badgeTextDark, band: s.bandGreen, dot: s.dotGreen, icon: 'checkmark-circle' }
      : { box: s.badgeRed, text: s.badgeTextDanger, band: s.bandRed, dot: s.dotRed, icon: 'close-circle' };

  // ===== Acciones =====
  const republish = async (id) => {
    if (await aprobarPublicacion(id)) {
      setItems(prev => prev.map(p => (p.id === id ? { ...p, state: 'publicada' } : p)));
    }
  }
  const reject    = async (id) => {
    if (await rechazarPublicacion(id)) {
      setItems(prev => prev.map(p => (p.id === id ? { ...p, state: 'rechazada' } : p)));
    }
  };
  const remove    = async (id) => {
    if (await eliminarPublicacion(id)) {
    setItems(prev => prev.filter(p => p.id !== id));
    }
  }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());

  const republishSelected = () => {
    setItems(prev => prev.map(p => (selected.has(p.id) ? { ...p, state: 'publicada' } : p)));
    clearSelection();
  };
  const rejectSelected = () => {
    setItems(prev => prev.map(p => (selected.has(p.id) ? { ...p, state: 'rechazada' } : p)));
    clearSelection();
  };
  const removeSelected = () => {
    setItems(prev => prev.filter(p => !selected.has(p.id)));
    clearSelection();
  };

  // ====== Modal genérico (Categoría / Área) ======
  const renderPickerModal = (visible, setVisible, title, data, query, setQuery, onSelect) => {
    const list = data.filter(opt =>
      opt.toLowerCase().includes(query.trim().toLowerCase())
    );
    const current = title === 'Categoría' ? cat : ar;

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{title}</Text>
              <Pressable onPress={() => setVisible(false)}>
                <Ionicons name="close" size={18} color="#0F172A" />
              </Pressable>
            </View>

            <View style={s.modalSearchWrap}>
              <Ionicons name="search" size={16} color="#64748B" style={s.modalSearchIcon} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar…"
                placeholderTextColor="#94A3B8"
                style={s.modalInput}
              />
            </View>

            <FlatList
              data={list}
              keyExtractor={(item) => item}
              contentContainerStyle={s.modalList}
              renderItem={({ item }) => (
                <Pressable
                  style={[s.modalItem, current === item && s.modalItemActive]}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Ionicons
                    name={current === item ? 'radio-button-on' : 'radio-button-off'}
                    size={14}
                    color={current === item ? '#4F46E5' : '#94A3B8'}
                  />
                  <Text style={[s.modalItemText, current === item && s.modalItemTextActive]}>
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
      {/* ===== Header ===== */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Publicaciones</Text>
          <Text style={s.headerSub}>Publicación libre · Gestión y moderación</Text>

          <View style={s.headerChipsRow}>
            <View style={[s.headerChip, s.headerChipPrimary]}>
              <Ionicons name="calendar-outline" size={14} color="#EEF2FF" style={s.headerChipIcon} />
              <Text style={[s.headerChipText, s.headerChipTextPrimary]}>Últimos 30 días</Text>
            </View>
            <View style={s.headerChip}>
              <Ionicons name="shield-checkmark" size={14} color="#1E293B" style={s.headerChipIcon} />
              <Text style={s.headerChipText}>Moderación activa</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* ===== KPIs ===== */}
        <View style={s.metricsRow}>
          <View style={s.metricCard}>
            <Text style={s.metricLabel}>Total</Text>
            <Text style={s.metricValue}>{metrics.total}</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricLabel}>Publicadas</Text>
            <Text style={[s.metricValue, s.metricOk]}>{metrics.publicadas}</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricLabel}>Rechazadas</Text>
            <Text style={[s.metricValue, s.metricDanger]}>{metrics.rechazadas}</Text>
          </View>
        </View>

        {/* ===== Tabs estado ===== */}
        <View style={s.tabsRow}>
          {STATES.map(key => (
            <Pressable
              key={key}
              style={[s.tab, tab === key && s.tabActive]}
              onPress={() => setTab(key)}
            >
              <Text style={[s.tabText, tab === key && s.tabTextActive]}>
                {key === 'todas' ? 'Todas' : key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ===== Filtros categoría / área (botones → modal) ===== */}
        <View style={s.filtersRow}>
          <Pressable
            style={s.dropdown}
            onPress={() => {
              setCatQuery('');
              setCatModal(true);
            }}
          >
            <Ionicons name="pricetag" size={16} color="#4F46E5" />
            <Text style={s.dropdownText}>{cat === 'todas' ? 'Todas las categorías' : cat}</Text>
            <Ionicons name="chevron-down" size={16} color="#4F46E5" />
          </Pressable>

          <Pressable
            style={s.dropdown}
            onPress={() => {
              setArQuery('');
              setArModal(true);
            }}
          >
            <Ionicons name="grid" size={16} color="#4F46E5" />
            <Text style={s.dropdownText}>{ar === 'todas' ? 'Todas las áreas' : ar}</Text>
            <Ionicons name="chevron-down" size={16} color="#4F46E5" />
          </Pressable>
        </View>

        {/* Modales Selectores (Área usa areaOptions dependientes de la categoría) */}
        {renderPickerModal(
          catModal,
          setCatModal,
          'Categoría',
          categories,
          catQuery,
          setCatQuery,
          (val) => {
            setCat(val);
            // Si se cambia de categoría, reinicia el área a "todas"
            setAr('todas');
            setArQuery('');
          }
        )}
        {renderPickerModal(
          arModal,
          setArModal,
          'Área',
          areaOptions,  // ÁREAS FILTRADAS POR CATEGORÍA
          arQuery,
          setArQuery,
          setAr
        )}

        {/* ===== Buscador + modo selección ===== */}
        <View style={s.toolbarRow}>
          <View style={s.searchWrap}>
            <Ionicons name="search" size={16} color="#94A3B8" style={s.searchIcon} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Buscar por título o autor…"
              placeholderTextColor="#94A3B8"
              style={s.input}
            />
          </View>

          <Pressable
            style={[s.btn, selectMode ? s.btnPrimary : s.btnGhost]}
            onPress={() => {
              setSelectMode(m => !m);
              clearSelection();
            }}
          >
            <Ionicons name="checkbox" size={16} color={selectMode ? '#FFFFFF' : '#3730A3'} />
            <Text style={selectMode ? s.btnPrimaryText : s.btnGhostText}>
              {selectMode ? 'Salir' : 'Seleccionar'}
            </Text>
          </Pressable>
        </View>

        {/* ===== Acciones masivas ===== */}
        {selectMode && selected.size > 0 && (
          <View style={s.bulkBar}>
            <Text style={s.bulkText}>{selected.size} seleccionadas</Text>
            <View style={s.bulkActions}>
              <Pressable style={[s.chipAction, s.chipPrimary]} onPress={republishSelected}>
                <Ionicons name="refresh" size={14} color="#EEF2FF" />
                <Text style={s.chipTextPrimary}>Re-publicar</Text>
              </Pressable>
              <Pressable style={s.chipAction} onPress={rejectSelected}>
                <Ionicons name="close-circle" size={14} color="#334155" />
                <Text style={s.chipText}>Rechazar</Text>
              </Pressable>
              <Pressable style={s.chipAction} onPress={removeSelected}>
                <Ionicons name="trash" size={14} color="#DC2626" />
                <Text style={[s.chipText, { color: '#DC2626' }]}>Borrar</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ===== Contador ===== */}
        <Text style={s.resultsText}>
          {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
        </Text>

        {/* ===== Lista ===== */}
        {filtered.map(p => {
          const b = badge(p.state);
          const isChecked = selected.has(p.id);
          return (
            <Pressable
              key={p.id}
              style={[s.card, selectMode && isChecked && s.cardSelected]}
              onPress={() => {
                if (selectMode) toggleSelect(p.id);
                else navigation.navigate('AdminPublicationDetall', { pubId: p.id });
              }}
              onLongPress={() => {
                if (!selectMode) setSelectMode(true);
                toggleSelect(p.id);
              }}
            >
              <View style={[s.stateBand, b.band]} />

              <View style={s.cardBody}>
                {/* Título COMPLETO (sin truncar) + badge */}
                <View style={s.cardHeaderRow}>
                  <View style={s.cardTitleWrap}>
                    {selectMode ? (
                      <Ionicons
                        name={isChecked ? 'checkbox' : 'square-outline'}
                        size={18}
                        color={isChecked ? '#4F46E5' : '#94A3B8'}
                        style={{ marginRight: 6 }}
                      />
                    ) : (
                      <View style={[s.dot, b.dot]} />
                    )}
                    <Text style={s.title}>{p.title}</Text>
                  </View>

                  <View style={[s.badge, b.box]}>
                    <Ionicons
                      name={b.icon}
                      size={14}
                      color={p.state === 'publicada' ? '#065F46' : '#991B1B'}
                    />
                    <Text style={b.text}>{p.state}</Text>
                  </View>
                </View>

                <Text style={s.sub} numberOfLines={1}>
                  por {p.author} · {p.createdAt}
                </Text>

                <View style={s.metaRow}>
                  {!!p.category && <Text style={s.metaChip}>#{p.category}</Text>}
                  {!!p.area && <Text style={s.metaChip}>#{p.area}</Text>}
                </View>

                {/* Acciones rápidas (modo normal) */}
                {!selectMode && (
                  <View style={s.actionsRow}>
                    {p.state === 'publicada' ? (
                      <Pressable style={s.chip} onPress={() => reject(p.id)}>
                        <Ionicons name="eye-off" size={14} color="#334155" />
                        <Text style={s.chipText}>Rechazar (ocultar)</Text>
                      </Pressable>
                    ) : (
                      <Pressable style={[s.chip, s.chipPrimary]} onPress={() => republish(p.id)}>
                        <Ionicons name="refresh" size={14} color="#EEF2FF" />
                        <Text style={s.chipTextPrimary}>Re-publicar</Text>
                      </Pressable>
                    )}
                    <Pressable style={s.chip} onPress={() => remove(p.id)}>
                      <Ionicons name="trash" size={14} color="#DC2626" />
                      <Text style={[s.chipText, { color: '#DC2626' }]}>Borrar</Text>
                    </Pressable>

                    <View style={{ flex: 1 }} />
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </View>
                )}
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

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
