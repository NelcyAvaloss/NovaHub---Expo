import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  Animated,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import s, { overlayStyles as o } from './CategoriaFeedScreen.styles';
import { styles as homeStyles } from './Home.styles';
import { supabase } from './supabase';

const likeIcon = require('../assets/IconoLike.png');
const likeIconActive = require('../assets/Icono_LikeActivo.png');
const dislikeIcon = require('../assets/IconoDislike.png');
const dislikeIconActive = require('../assets/Icono_DislikeActivo.png');

const ROLE_ADMIN = 'administrador';
const ROLE_STUDENT = 'estudiante';

// --- AREAS Y CATEGORIAS ---
const categoriasConAreas = {
  'Ciencia y Tecnología': ['Desarrollo Web', 'Biotecnología', 'Robótica'],
  Farmacología: ['Farmacocinética', 'Toxicología', 'Farmacodinamia'],
  Medicina: ['Salud Pública', 'Neurología', 'Medicina Interna'],
  Ingeniería: ['Civil', 'Eléctrica', 'Mecánica'],
  Educación: ['Educación Infantil', 'Pedagogía', 'Didáctica'],
};

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CategoriaFeedScreen({ navigation, route }) {
  const { categoriaId, nombre } = route.params || {};
  const flatListRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [publicaciones, setPublicaciones] = useState([]);
  const [votesMap, setVotesMap] = useState({});
  const [rolUsuario, setRolUsuario] = useState(null);

  const [menuPubId, setMenuPubId] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState('spam');
  const [reportNote, setReportNote] = useState('');

  // Filtros
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);

  // Accordion Áreas
  const [areasOpen, setAreasOpen] = useState(false);
  const caret = useRef(new Animated.Value(0)).current; // 0=cerrado, 1=abierto

  const toggleAreas = () => {
    LayoutAnimation.easeInEaseOut();
    const next = !areasOpen;
    setAreasOpen(next);
    Animated.timing(caret, {
      toValue: next ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const caretRotate = caret.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Animación botón publicar
  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
      .start(() => navigation.navigate('CrearPublicacion'));
  };

  // --- Roles (idéntico a tus pantallas) ---
  const getRolFromUser = (user) => {
    const metaRol = user?.user_metadata?.rol;
    const low = typeof metaRol === 'string' ? metaRol.toLowerCase() : null;
    if (low === ROLE_ADMIN || low === ROLE_STUDENT) return low;
    return null;
  };
  const inferRoleFromRow = (row) => {
    if (!row || typeof row !== 'object') return null;
    if (row.is_admin === true || row.admin === true) return ROLE_ADMIN;
    const candidates = [row.rol, row.role, row.tipo, row.tipo_usuario, row.perfil, row.nivel,
      row.categoria, row.rango, row.user_role].filter((v) => typeof v === 'string');
    for (const v of candidates) {
      const low = v.toLowerCase();
      if (low.includes('admin') || low === 'administrador') return ROLE_ADMIN;
      if (low === 'estudiante' || low.includes('student')) return ROLE_STUDENT;
    }
    if (typeof row.rol_id === 'number') {
      if (row.rol_id === 1) return ROLE_ADMIN;
      if (row.rol_id === 0) return ROLE_STUDENT;
    }
    return null;
  };
  const fetchRolFromUsuarios = async (user) => {
    const userId = user?.id;
    const email = user?.email?.toLowerCase?.();
    if (userId) {
      const r1 = await supabase.from('usuarios').select('*').eq('id', userId).maybeSingle();
      const v1 = inferRoleFromRow(r1.data); if (v1) return v1;
    }
    if (userId) {
      const r2 = await supabase.from('usuarios').select('*').eq('auth_id', userId).maybeSingle();
      const v2 = inferRoleFromRow(r2.data); if (v2) return v2;
    }
    if (email) {
      const r3 = await supabase.from('usuarios').select('*').ilike('email', email).maybeSingle();
      const v3 = inferRoleFromRow(r3.data); if (v3) return v3;
    }
    return null;
  };
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!user) { setRolUsuario(null); return; }
        const meta = getRolFromUser(user);
        if (meta) setRolUsuario(meta);
        else {
          const dbRol = await fetchRolFromUsuarios(user);
          setRolUsuario(dbRol || ROLE_STUDENT);
        }
      } catch {
        setRolUsuario(ROLE_STUDENT);
      }
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        const instant = getRolFromUser(session?.user);
        if (instant) setRolUsuario(instant);
        else {
          const dbRol = await fetchRolFromUsuarios(session?.user);
          setRolUsuario(dbRol || ROLE_STUDENT);
        }
      } else if (event === 'SIGNED_OUT') setRolUsuario(null);
    });
    return () => { sub?.subscription?.unsubscribe?.(); sub?.unsubscribe?.(); };
  }, []);

  // --- Feed por categoría ---
  const seedVotesFromItems = (pubs) => {
    setVotesMap((prev) => {
      const next = { ...prev };
      (pubs || []).forEach((p) => {
        if (!next[p.id]) next[p.id] = {
          likes: p.likes_count ?? p.likes ?? 0,
          dislikes: p.dislikes_count ?? p.dislikes ?? 0,
          myVote: 0,
        };
      });
      return next;
    });
  };

  const obtenerPublicacionesCategoria = async () => {
    try {
      let q = supabase
        .from('Publicaciones')
        .select('*, autor:usuarios(nombre)')
        .eq('estado_de_revision', 'publicada')
        .order('created_at', { ascending: false })
        .limit(100);

      if (nombre) q = q.eq('categoria', nombre);
      else if (categoriaId) q = q.eq('categoria_id', categoriaId);

      const { data, error } = await q;
      if (error) throw error;

      return (data || []).map((pub) => ({ ...pub, autor: pub.autor?.nombre || 'Autor' }));
    } catch (e) {
      console.log('[CategoriaFeed] obtenerPublicacionesCategoria:', e?.message);
      Alert.alert('Error', 'No se pudieron cargar las publicaciones de esta categoría.');
      return [];
    }
  };

  const cargarVotos = async (pubsParam) => {
    const source = Array.isArray(pubsParam) && pubsParam.length ? pubsParam : publicaciones;
    const pubIds = (source || []).map((p) => p.id);
    if (!pubIds.length) return;

    const { data: sessionRes } = await supabase.auth.getUser();
    const userId = sessionRes?.user?.id || null;

    const { data: totalsRows } = await supabase
      .from('votos_totales')
      .select('*')
      .in('id_publicacion', pubIds);

    let myVotesRows = [];
    if (userId) {
      const { data: myRows } = await supabase
        .from('votos')
        .select('id_publicacion, valor')
        .eq('id_usuario', userId)
        .in('id_publicacion', pubIds);
      myVotesRows = myRows || [];
    }

    const totalsMap = {};
    (totalsRows || []).forEach((r) => {
      totalsMap[r.id_publicacion] = { likes: r.likes | 0, dislikes: r.dislikes | 0 };
    });
    const myMap = {};
    (myVotesRows || []).forEach((r) => { myMap[r.id_publicacion] = r.valor | 0; });

    setVotesMap((prev) => {
      const next = { ...prev };
      pubIds.forEach((id) => {
        const base = next[id] || { likes: 0, dislikes: 0, myVote: 0 };
        const t = totalsMap[id] || { likes: base.likes, dislikes: base.dislikes };
        next[id] = { likes: t.likes, dislikes: t.dislikes, myVote: myMap[id] ?? base.myVote };
      });
      return next;
    });
  };

  const applyVote = async (pubId, type) => {
    const { data: session } = await supabase.auth.getUser();
    const userId = session?.user?.id || null;
    if (!userId) return Alert.alert('Inicia sesión', 'Debes iniciar sesión para votar.');

    setVotesMap((prev) => {
      const cur = prev[pubId] || { likes: 0, dislikes: 0, myVote: 0 };
      let { likes, dislikes, myVote } = cur;
      if (type === 'like') {
        if (myVote === 1) { likes = Math.max(0, likes - 1); myVote = 0; }
        else if (myVote === -1) { dislikes = Math.max(0, dislikes - 1); likes += 1; myVote = 1; }
        else { likes += 1; myVote = 1; }
      } else {
        if (myVote === -1) { dislikes = Math.max(0, dislikes - 1); myVote = 0; }
        else if (myVote === 1) { likes = Math.max(0, likes - 1); dislikes += 1; myVote = -1; }
        else { dislikes += 1; myVote = -1; }
      }
      return { ...prev, [pubId]: { likes, dislikes, myVote } };
    });

    try {
      const prevMyVote = votesMap[pubId]?.myVote || 0;
      const intended = type === 'like' ? (prevMyVote === 1 ? 0 : 1) : (prevMyVote === -1 ? 0 : -1);
      if (intended === 0) {
        await supabase.from('votos').delete().eq('id_usuario', userId).eq('id_publicacion', pubId);
      } else {
        await supabase
          .from('votos')
          .upsert([{ id_usuario: userId, id_publicacion: pubId, valor: intended }], {
            onConflict: 'id_usuario,id_publicacion',
          });
      }
      await cargarVotos([{ id: pubId }]);
    } catch (err) {
      console.error('Error al votar:', err);
      Alert.alert('Error', 'No se pudo registrar tu voto.');
      await cargarVotos([{ id: pubId }]);
    }
  };

  const irADetalle = useCallback(
    (pub) => navigation.navigate('DetallePublicacion', { publicacion: pub }),
    [navigation]
  );

  // Áreas disponibles para la categoría actual
  const areasDisponibles = useMemo(() => {
    const key = typeof nombre === 'string' ? nombre : '';
    return categoriasConAreas[key] || [];
  }, [nombre]);

  // Filtro local (texto + área)
  const filteredPublicaciones = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    return (publicaciones || []).filter((p) => {
      if (selectedArea && String(p?.area || '').toLowerCase() !== String(selectedArea).toLowerCase()) {
        return false;
      }
      if (!q) return true;
      const campos = [p?.titulo, p?.descripcion, p?.autor, p?.categoria, p?.area]
        .map((v) => String(v || '').toLowerCase());
      return campos.some((t) => t.includes(q));
    });
  }, [publicaciones, search, selectedArea]);

  // Carga + realtime
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      const init = async () => {
        const pubs = await obtenerPublicacionesCategoria();
        if (!alive) return;
        setPublicaciones(pubs);
        setMenuPubId(null);
        setSelectedArea(null);
        setSearch('');
        setAreasOpen(false);
        caret.setValue(0);
        seedVotesFromItems(pubs);
        await cargarVotos(pubs);

        supabase.getChannels().forEach((c) => { if (c?.topic === 'categoria-feed') supabase.removeChannel(c); });
        const ch = supabase.channel('categoria-feed');
        ch.on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'Publicaciones' },
          async ({ new: row }) => {
            if (!row?.id) return;
            if (row.estado_de_revision !== 'publicada') {
              setPublicaciones((prev) => prev.filter((p) => p.id !== row.id));
              setVotesMap((prev) => { const n = { ...prev }; delete n[row.id]; return n; });
              return;
            }
            const { data, error } = await supabase
              .from('Publicaciones').select('*, autor:usuarios(nombre)').eq('id', row.id).single();
            if (!error && data) {
              const pub = { ...data, autor: data.autor?.nombre || 'Autor' };
              const okByName = nombre ? String(pub.categoria || '').toLowerCase() === String(nombre).toLowerCase() : true;
              const okById   = categoriaId ? pub.categoria_id === categoriaId : true;
              const ok = nombre ? okByName : okById;
              if (ok) {
                setPublicaciones((prev) => {
                  const idx = prev.findIndex((p) => p.id === pub.id);
                  if (idx === -1) return [pub, ...prev];
                  const next = [...prev]; next[idx] = pub; return next;
                });
                await cargarVotos([{ id: pub.id }]);
              } else {
                setPublicaciones((prev) => prev.filter((p) => p.id !== pub.id));
              }
            }
          }
        );
        ch.subscribe();
      };
      init();

      return () => {
        alive = false;
        supabase.getChannels().forEach((c) => { if (c?.topic === 'categoria-feed') supabase.removeChannel(c); });
      };
    }, [categoriaId, nombre])
  );

  // Render de item
  const renderItem = useCallback(
    ({ item }) => {
      const colaboradores = (item?.equipo_colaborador || '')
        .split(',').map((s) => s.trim()).filter(Boolean);

      const v = votesMap[item.id] || {
        likes: item.likes_count ?? item.likes ?? 0,
        dislikes: item.dislikes_count ?? item.dislikes ?? 0,
        myVote: 0,
      };
      const { likes, dislikes, myVote } = v;

      return (
        <View style={homeStyles.publicacionContainer}>
          <View style={homeStyles.publicacionCard}>
            {/* Header */}
            <View style={homeStyles.publicacionHeader}>
              <View style={homeStyles.avatar}>
                <Text style={homeStyles.avatarLetter}>
                  {(item?.autor?.[0] || 'U').toUpperCase()}
                </Text>
              </View>

              <View style={homeStyles.headerText}>
                <Text style={homeStyles.nombreAutor} numberOfLines={1}>
                  {item.autor || 'Autor'}
                </Text>
                <Text style={homeStyles.fechaTexto}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Ahora'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => { setMenuPubId(menuPubId === item.id ? null : item.id); setReportTarget(item); }}
                style={o.kebabBtn}
                activeOpacity={0.8}
              >
                <Text style={o.kebabText}>⋮</Text>
              </TouchableOpacity>
            </View>

            {/* Menú ⋮ */}
            {menuPubId === item.id && (
              <View style={o.kebabMenu}>
                <TouchableOpacity
                  style={o.kebabItem}
                  onPress={() => { setMenuPubId(null); setReportReason('spam'); setReportNote(''); setReportModalOpen(true); }}
                >
                  <Text style={o.kebabItemText}>Reportar publicación</Text>
                </TouchableOpacity>
                <TouchableOpacity style={o.kebabItem} onPress={() => setMenuPubId(null)}>
                  <Text style={o.kebabItemText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            {!!item.titulo && <Text style={homeStyles.publicacionTitulo} numberOfLines={2}>{item.titulo}</Text>}
            {!!item.descripcion && <Text style={homeStyles.publicacionTexto} numberOfLines={3}>{item.descripcion}</Text>}
            {!!item.portadaUri && <Image source={{ uri: item.portadaUri }} style={homeStyles.publicacionImagen} />}

            <View style={homeStyles.tagsRow}>
              {!!item.categoria && <Text style={homeStyles.tagChip}>#{item.categoria}</Text>}
              {!!item.area && <Text style={homeStyles.tagChip}>#{item.area}</Text>}
            </View>

            {colaboradores.length > 0 && (
              <View style={homeStyles.collabBlock}>
                <Text style={homeStyles.collabLabel}>Colaboradores</Text>
                <View style={homeStyles.collabRow}>
                  {colaboradores.slice(0, 5).map((name, idx2) => (
                    <View key={`${name}-${idx2}`} style={homeStyles.collabPill}>
                      <Text style={homeStyles.collabPillText}>{name}</Text>
                    </View>
                  ))}
                  {colaboradores.length > 5 && (
                    <View style={homeStyles.collabPillMuted}>
                      <Text style={homeStyles.collabPillMutedText}>+{colaboradores.length - 5}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={homeStyles.publicacionFooter}>
              <View style={homeStyles.voteRow}>
                <TouchableOpacity
                  style={[homeStyles.voteBtn, myVote === 1 && homeStyles.voteBtnActive]}
                  activeOpacity={0.85}
                  onPress={() => applyVote(item.id, 'like')}
                >
                  <Image source={myVote === 1 ? likeIconActive : likeIcon} style={homeStyles.voteImage} />
                  <Text style={homeStyles.voteCount}>{likes}</Text>
                </TouchableOpacity>

                <View style={{ width: 12 }} />

                <TouchableOpacity
                  style={[homeStyles.voteBtn, myVote === -1 && homeStyles.voteBtnActiveDown]}
                  activeOpacity={0.85}
                  onPress={() => applyVote(item.id, 'dislike')}
                >
                  <Image source={myVote === -1 ? dislikeIconActive : dislikeIcon} style={homeStyles.voteImage} />
                  <Text style={homeStyles.voteCount}>{dislikes}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={homeStyles.verMasBtn} activeOpacity={0.85} onPress={() => irADetalle(item)}>
                <Text style={homeStyles.verMasText}>Ver más</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [applyVote, irADetalle, votesMap, menuPubId]
  );

  return (
    <View style={s.container}>
      {/* Header */}
      <ImageBackground source={require('../assets/FondoNovaHub.png')} style={s.headerBackground}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.title}>{nombre || 'Categoría'}</Text>
          <View style={{ width: 22 }} />
        </View>
      </ImageBackground>

      {/* Buscador */}
      <View style={s.searchContainer}>
        <View style={s.searchBar}>
          <Image source={require('../assets/IconoBusqueda.png')} style={s.searchIcon} />
          <TextInput
            placeholder="Buscar por título, descripción, autor..."
            placeholderTextColor="#999"
            style={s.searchInput}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={() => flatListRef.current?.scrollToOffset?.({ offset: 0, animated: true })}
          />
        </View>
      </View>

      {/* Áreas — DESPLEGABLE */}
      <View style={s.accWrap}>
        <TouchableOpacity onPress={toggleAreas} activeOpacity={0.8} style={s.accHeader}>
          <Text style={s.accTitle}>Áreas</Text>
          <View style={s.accRight}>
            {selectedArea ? <Text style={s.accSelected}>{selectedArea}</Text> : <Text style={s.accSelectedMuted}>Todas</Text>}
            <Animated.View style={{ transform: [{ rotate: caretRotate }] }}>
              <Ionicons name="chevron-down" size={18} color="#0f172a" />
            </Animated.View>
          </View>
        </TouchableOpacity>

        {areasOpen && (
          <View style={s.accBody}>
            <View style={s.chipsColumn}>
              {/* “Todas” */}
              <TouchableOpacity
                style={[s.areaChip, !selectedArea && s.areaChipActive]}
                activeOpacity={0.85}
                onPress={() => setSelectedArea(null)}
              >
                <Text style={[s.areaChipText, !selectedArea && s.areaChipTextActive]}>Todas</Text>
              </TouchableOpacity>

              {/* Áreas específicas (SOLO las dadas) */}
              {areasDisponibles.map((a) => {
                const active = !!selectedArea && selectedArea.toLowerCase() === a.toLowerCase();
                return (
                  <TouchableOpacity
                    key={a}
                    style={[s.areaChip, active && s.areaChipActive]}
                    activeOpacity={0.85}
                    onPress={() => setSelectedArea(active ? null : a)}
                  >
                    <Text style={[s.areaChipText, active && s.areaChipTextActive]}>{a}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>

      <Text style={s.titlePublicacion}>Publicaciones</Text>

      <View style={s.feedContainer}>
        <FlatList
          ref={flatListRef}
          data={filteredPublicaciones}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          contentContainerStyle={[homeStyles.listContent, homeStyles.listContentWithBar]}
          renderItem={renderItem}
          extraData={{ votesMap, menuPubId, search, selectedArea, areasOpen }}
          ListEmptyComponent={
            <View style={s.emptyWrap}>
              <Text style={s.emptyText}>
                {search || selectedArea ? 'Sin resultados para el filtro' : 'Aún no hay publicaciones en esta categoría'}
              </Text>
            </View>
          }
          initialNumToRender={6}
        />
      </View>

      {/* Menú inferior (Home) */}
      <View style={homeStyles.bottomNav}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
            requestAnimationFrame(() => {
              flatListRef.current?.scrollToOffset?.({ offset: 0, animated: true });
            });
          }}
        >
          <Image source={require('../assets/Nav_Home.png')} style={homeStyles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Ranking', { publicaciones, votesMap })}>
          <Image source={require('../assets/Nav_Medalla.png')} style={homeStyles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ transform: [{ scale: scaleAnim }] }}
          activeOpacity={0.9}
        >
          <Image source={require('../assets/Nav_Publicacion.png')} style={homeStyles.publicarIcono} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Usuarios', 'Próximamente…')}>
          <Image source={require('../assets/Nav_Usuario.png')} style={homeStyles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Chat', 'Próximamente…')}>
          <Image source={require('../assets/Nav_Chat.png')} style={homeStyles.navIcon} />
        </TouchableOpacity>
      </View>

      {/* Modal Reporte */}
      {reportModalOpen && (
        <View style={o.modalBackdrop}>
          <View style={o.modalSheet}>
            <Text style={o.modalTitle}>Reportar publicación</Text>
            <Text style={o.modalSub}>{reportTarget?.titulo ? `“${reportTarget.titulo}”` : 'Publicación'}</Text>

            <View style={{ marginTop: 10 }}>
              {REPORT_REASONS.map((r) => (
                <TouchableOpacity key={r.key} style={o.radioRow} onPress={() => setReportReason(r.key)} activeOpacity={0.8}>
                  <View style={[o.radioOuter, reportReason === r.key && o.radioOuterActive]}>
                    {reportReason === r.key && <View style={o.radioInner} />}
                  </View>
                  <Text style={o.radioLabel}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={reportNote}
              onChangeText={setReportNote}
              placeholder="Comentario (opcional)…"
              placeholderTextColor="#94A3B8"
              style={o.modalInput}
              multiline
            />

            <View style={o.modalActions}>
              <TouchableOpacity style={o.modalBtnGhost} onPress={() => { setReportModalOpen(false); setMenuPubId(null); }}>
                <Text style={o.modalBtnGhostText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={o.modalBtnPrimary}
                onPress={() => {
                  if (!reportTarget?.id) { setReportModalOpen(false); return; }
                  setReportModalOpen(false);
                }}
              >
                <Text style={o.modalBtnPrimaryText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
