// screens/HomeScreen.js
import React, { useRef, useCallback, useEffect, useState } from 'react';
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
  StyleSheet,
} from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { styles } from './Home.styles';
import { supabase } from './supabase';

const likeIcon = require('../assets/IconoLike.png');
const likeIconActive = require('../assets/Icono_LikeActivo.png');
const dislikeIcon = require('../assets/IconoDislike.png');
const dislikeIconActive = require('../assets/Icono_DislikeActivo.png');

const ROLE_ADMIN = 'administrador';
const ROLE_STUDENT = 'estudiante';

export default function HomeScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);
  const isFocused = useIsFocused();

  const [publicaciones, setPublicaciones] = useState([]);
  const [votesMap, setVotesMap] = useState({});
  const [rolUsuario, setRolUsuario] = useState(null);

  const [menuPubId, setMenuPubId] = useState(null);
  const REPORT_REASONS = [
    { key: 'spam',               label: 'Spam' },
    { key: 'agresion',           label: 'Agresión' },
    { key: 'nsfw',               label: 'NSFW (contenido sensible)' },
    { key: 'contenido_enganoso', label: 'Contenido engañoso' },
    { key: 'sin_clasificar',     label: 'Reporte sin clasificar' },
  ];
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState('spam');
  const [reportNote, setReportNote] = useState('');

  // canal supabase por foco
  const homeChRef = useRef(null);

  // ===== Utils rol =====
  const getRolFromUser = (user) => {
    const metaRol = user?.user_metadata?.rol;
    const low = typeof metaRol === 'string' ? metaRol.toLowerCase() : null;
    if (low === ROLE_ADMIN || low === ROLE_STUDENT) return low;
    return null;
  };

  const inferRoleFromRow = (row) => {
    if (!row || typeof row !== 'object') return null;
    if (row.is_admin === true || row.admin === true) return ROLE_ADMIN;
    const candidates = [
      row.rol, row.role, row.tipo, row.tipo_usuario, row.perfil, row.nivel,
      row.categoria, row.rango, row.user_role,
    ].filter((v) => typeof v === 'string');

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
      const q1 = await supabase.from('usuarios').select('*').eq('id', userId).maybeSingle();
      if (q1.error) console.log('[Home] usuarios.id error:', q1.error.message);
      const r1 = inferRoleFromRow(q1.data);
      if (r1) return r1;
    }
    if (userId) {
      const q2 = await supabase.from('usuarios').select('*').eq('auth_id', userId).maybeSingle();
      if (q2.error) console.log('[Home] usuarios.auth_id error:', q2.error.message);
      const r2 = inferRoleFromRow(q2.data);
      if (r2) return r2;
    }
    if (email) {
      const q3 = await supabase.from('usuarios').select('*').ilike('email', email).maybeSingle();
      if (q3.error) console.log('[Home] usuarios.email error:', q3.error.message);
      const r3 = inferRoleFromRow(q3.data);
      if (r3) return r3;
    }
    return null;
  };

  const fetchRol = async (why = '') => {
    try {
      const { data: sessionRes, error: sessionErr } = await supabase.auth.getUser();
      if (sessionErr) console.log('[Home] getUser error:', sessionErr.message);
      const user = sessionRes?.user;
      if (!user) { setRolUsuario(null); return; }
      const meta = getRolFromUser(user);
      if (meta) { setRolUsuario(meta); return; }
      const dbRol = await fetchRolFromUsuarios(user);
      if (dbRol) { setRolUsuario(dbRol); return; }
      setRolUsuario(ROLE_STUDENT);
    } catch (e) {
      console.log('[Home] exception fetchRol:', e, { why });
      setRolUsuario(ROLE_STUDENT);
    }
  };

  // ===== auth / foco =====
  useEffect(() => {
    fetchRol('mount');
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        const instant = getRolFromUser(session?.user);
        if (instant) setRolUsuario(instant);
        else await fetchRol('auth_change_no_meta');
      } else if (event === 'SIGNED_OUT') {
        setRolUsuario(null);
      }
    });
    return () => {
      sub?.subscription?.unsubscribe?.();
      sub?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchRol('focus');
      const t1 = setTimeout(() => fetchRol('focus+400ms'), 400);
      const t2 = setTimeout(() => fetchRol('focus+1200ms'), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isFocused]);

  // ---------- publicaciones + votos (ATADO AL FOCO) ----------
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const init = async () => {
        // 1) cargar feed inicial
        const pubs = await obtenerPublicaciones(); // SOLO “publicada”
        if (!isActive) return;
        setPublicaciones(pubs || []);
        seedVotesFromItems(pubs || []);
        await cargarVotos(pubs || []);

        // 2) matar canales viejos por topic
        const TOPIC = 'home-publicaciones';
        supabase.getChannels().forEach((ch) => {
          if (ch?.topic === TOPIC) supabase.removeChannel(ch);
        });

        // 3) canal fresco
        homeChRef.current = supabase.channel('home-publicaciones');
        homeChRef.current.on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'Publicaciones' },
          async (payload) => {
            const row = payload.new;
            if (!row?.id) return;
            const st = row.estado_de_revision;

            if (st !== 'publicada') {
              setPublicaciones(prev => prev.filter(p => p.id !== row.id));
              setVotesMap(prev => { const n = { ...prev }; delete n[row.id]; return n; });
              return;
            }

            try {
              const { data, error } = await supabase
                .from('Publicaciones')
                .select('*, autor:usuarios(nombre)')
                .eq('id', row.id)
                .eq('estado_de_revision', 'publicada')
                .single();

              if (!error && data) {
                const pub = { ...data, autor: data.autor?.nombre || 'Autor' };
                setPublicaciones(prev => {
                  const idx = prev.findIndex(p => p.id === pub.id);
                  if (idx === -1) return [pub, ...prev];
                  const next = [...prev]; next[idx] = pub; return next;
                });
                await cargarVotos([{ id: pub.id }]);
              }
            } catch {}
          }
        );
        homeChRef.current.subscribe();
      };

      init();

      return () => {
        isActive = false;
        if (homeChRef.current) {
          supabase.removeChannel(homeChRef.current);
          homeChRef.current = null;
        }
      };
    }, [])
  );

  // ===== helpers =====
  const seedVotesFromItems = (pubs) => {
    setVotesMap((prev) => {
      const next = { ...prev };
      pubs.forEach((p) => {
        const id = p.id;
        if (!next[id]) {
          next[id] = {
            likes: p.likes_count ?? p.likes ?? 0,
            dislikes: p.dislikes_count ?? p.dislikes ?? 0,
            myVote: 0,
          };
        }
      });
      return next;
    });
  };

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1, friction: 3, tension: 40, useNativeDriver: true,
    }).start(() => navigation.navigate('CrearPublicacion'));
  }, [navigation, scaleAnim]);

  const irADetalle = useCallback(
    (pub) => navigation.navigate('DetallePublicacion', { publicacion: pub }),
    [navigation]
  );

  // ======= Navegar al perfil del autor al tocar el NOMBRE =======
  const getAuthorIdFromItem = (item) => {
    return (
      item?.id_usuario ??
      item?.usuario_id ??
      item?.user_id ??
      item?.autor_id ??
      item?.author_id ??
      null
    );
  };

  const openPerfilAutor = useCallback((item) => {
    const perfil = {
      id: getAuthorIdFromItem(item),
      nombre: item?.autor || 'Autor',
      email: null,
      avatarUri: null,
    };
    navigation.navigate('PerfilUsuario', { perfil });
  }, [navigation]);

  // SOLO publicaciones “publicada”
  const obtenerPublicaciones = async () => {
    const { data, error } = await supabase
      .from('Publicaciones')
      .select('*, autor:usuarios(nombre)')
      .eq('estado_de_revision', 'publicada')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error al obtener publicaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las publicaciones.');
      return [];
    }

    return (data || []).map((pub) => ({
      ...pub,
      autor: pub.autor?.nombre || 'Autor',
    }));
  };

  const cargarVotos = async (pubsParam) => {
    const source = Array.isArray(pubsParam) && pubsParam.length ? pubsParam : publicaciones;
    const pubIds = (source || []).map((p) => p.id);
    if (!pubIds.length) return;

    const { data: sessionRes } = await supabase.auth.getUser();
    const userId = sessionRes?.user?.id || null;

    const { data: totalsRows, error: eTotals } = await supabase
      .from('votos_totales')
      .select('*')
      .in('id_publicacion', pubIds);
    if (eTotals) { console.error('Error totals:', eTotals); return; }

    let myVotesRows = [];
    if (userId) {
      const { data: myRows, error: eMy } = await supabase
        .from('votos')
        .select('id_publicacion, valor')
        .eq('id_usuario', userId)
        .in('id_publicacion', pubIds);
      if (eMy) console.error('Error myVotes:', eMy);
      myVotesRows = myRows || [];
    }

    const totalsMap = {};
    (totalsRows || []).forEach((r) => {
      totalsMap[r.id_publicacion] = { likes: r.likes | 0, dislikes: r.dislikes | 0 };
    });

    const myMap = {};
    (myVotesRows || []).forEach((r) => {
      myMap[r.id_publicacion] = r.valor | 0;
    });

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
    if (!userId) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para votar.');
      return;
    }

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

  const reportarPublicacion = async (pubId, motivo, nota) => {
    try {
      const { data: s } = await supabase.auth.getUser();
      const uid = s?.user?.id || null;

      const { error } = await supabase
        .from('Decisiones_en_publicaciones')
        .insert([{
          id_publicacion: pubId,
          accion: 'reporte',
          motivo,
          nota: nota || null,
          id_usuario: uid,
        }]);

      if (error) throw error;

      setReportModalOpen(false);
      setReportNote('');
      setReportReason('spam');
      setMenuPubId(null);
      Alert.alert('Gracias', 'Tu reporte fue enviado.');
    } catch (e) {
      console.log('reportarPublicacion error:', e);
      Alert.alert('Error', 'No se pudo enviar el reporte.');
    }
  };

  const renderItem = useCallback(
    ({ item }) => {
      const colaboradores = (item?.equipo_colaborador || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const v = votesMap[item.id] || {
        likes: item.likes_count ?? item.likes ?? 0,
        dislikes: item.dislikes_count ?? item.dislikes ?? 0,
        myVote: 0,
      };
      const { likes, dislikes, myVote } = v;

      return (
        <View style={styles.publicacionContainer}>
          <View style={styles.publicacionCard}>
            {/* Header */}
            <View style={styles.publicacionHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>
                  {(item?.autor?.[0] || 'N').toUpperCase()}
                </Text>
              </View>

              <View style={styles.headerText}>
                {/* NOMBRE TOCABLE -> navega a PerfilUsuario */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => openPerfilAutor(item)}
                >
                  <Text style={styles.nombreAutor} numberOfLines={1}>
                    {item.autor || 'Autor'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.fechaTexto}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Ahora'}
                </Text>
              </View>

              {/* 3 puntos */}
              <TouchableOpacity
                onPress={() => {
                  setMenuPubId(menuPubId === item.id ? null : item.id);
                  setReportTarget(item);
                }}
                style={localStyles.kebabBtn}
                activeOpacity={0.8}
              >
                <Text style={localStyles.kebabText}>⋮</Text>
              </TouchableOpacity>
            </View>

            {menuPubId === item.id && (
              <View style={localStyles.kebabMenu}>
                <TouchableOpacity
                  style={localStyles.kebabItem}
                  onPress={() => {
                    setMenuPubId(null);
                    setReportReason('spam');
                    setReportNote('');
                    setReportModalOpen(true);
                  }}
                >
                  <Text style={localStyles.kebabItemText}>Reportar publicación</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={localStyles.kebabItem}
                  onPress={() => setMenuPubId(null)}
                >
                  <Text style={localStyles.kebabItemText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            {!!item.titulo && (
              <Text style={styles.publicacionTitulo} numberOfLines={2}>{item.titulo}</Text>
            )}
            {!!item.descripcion && (
              <Text style={styles.publicacionTexto} numberOfLines={3}>{item.descripcion}</Text>
            )}
            {!!item.portadaUri && (
              <Image source={{ uri: item.portadaUri }} style={styles.publicacionImagen} />
            )}

            <View style={styles.tagsRow}>
              {!!item.categoria && <Text style={styles.tagChip}>#{item.categoria}</Text>}
              {!!item.area && <Text style={styles.tagChip}>#{item.area}</Text>}
            </View>

            {colaboradores.length > 0 && (
              <View style={styles.collabBlock}>
                <Text style={styles.collabLabel}>Colaboradores</Text>
                <View style={styles.collabRow}>
                  {colaboradores.slice(0, 5).map((name, idx2) => (
                    <View key={`${name}-${idx2}`} style={styles.collabPill}>
                      <Text style={styles.collabPillText}>{name}</Text>
                    </View>
                  ))}
                  {colaboradores.length > 5 && (
                    <View style={styles.collabPillMuted}>
                      <Text style={styles.collabPillMutedText}>+{colaboradores.length - 5}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.publicacionFooter}>
              <View style={styles.voteRow}>
                <TouchableOpacity
                  style={[styles.voteBtn, myVote === 1 && styles.voteBtnActive]}
                  activeOpacity={0.85}
                  onPress={() => applyVote(item.id, 'like')}
                >
                  <Image source={myVote === 1 ? likeIconActive : likeIcon} style={styles.voteImage} />
                  <Text style={styles.voteCount}>{likes}</Text>
                </TouchableOpacity>

                <View style={{ width: 12 }} />

                <TouchableOpacity
                  style={[styles.voteBtn, myVote === -1 && styles.voteBtnActiveDown]}
                  activeOpacity={0.85}
                  onPress={() => applyVote(item.id, 'dislike')}
                >
                  <Image source={myVote === -1 ? dislikeIconActive : dislikeIcon} style={styles.voteImage} />
                  <Text style={styles.voteCount}>{dislikes}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.verMasBtn}
                activeOpacity={0.85}
                onPress={() => irADetalle(item)}
              >
                <Text style={styles.verMasText}>Ver más</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [applyVote, irADetalle, votesMap, menuPubId, openPerfilAutor]
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/FondoNovaHub.png')} style={styles.headerBackground}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')} activeOpacity={0.8}>
            <Image source={require('../assets/IconoUsuario.png')} style={styles.profileIcon} />
          </TouchableOpacity>

          <Text style={styles.title}>NovaHub</Text>

          {rolUsuario == null ? (
            <View style={[styles.icon, { width: 24, height: 24 }]} />
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (rolUsuario === ROLE_ADMIN) {
                  navigation.navigate('AdminPanel', { screen: 'AdminDashboard' });
                } else {
                  Alert.alert('Notificaciones', 'Próximamente…');
                }
              }}
              activeOpacity={0.8}
              style={{ alignItems: 'center' }}
            >
              <Image
                key={rolUsuario}
                source={
                  rolUsuario === ROLE_ADMIN
                    ? require('../assets/IconoAdminPanel.png')
                    : require('../assets/IconoNotificacion.png')
                }
                style={styles.icon}
              />
              {rolUsuario === ROLE_ADMIN && (
                <Text style={localStyles.headerIconLabel}>Administrador</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.9}>
          <Image source={require('../assets/IconoBusqueda.png')} style={styles.searchIcon} />
          <TextInput placeholder="Buscar" placeholderTextColor="#999" style={styles.searchInput} />
        </TouchableOpacity>
      </View>

      <Text style={styles.titlePublicacion}>Publicaciones</Text>

      <View style={styles.feedContainer}>
        <FlatList
          ref={flatListRef}
          data={publicaciones}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          extraData={{ votesMap, menuPubId }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Text style={{ color: '#6B7280' }}>Aún no hay publicaciones</Text>
            </View>
          }
          initialNumToRender={6}
        />
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
            requestAnimationFrame(() => {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            });
          }}
        >
          <Image source={require('../assets/Nav_Home.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Ranking', { publicaciones, votesMap })}>
          <Image source={require('../assets/Nav_Medalla.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPressIn={() => Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }).start()}
          onPressOut={() =>
            Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
              .start(() => navigation.navigate('CrearPublicacion'))
          }
          style={{ transform: [{ scale: scaleAnim }] }}
          activeOpacity={0.9}
        >
          <Image source={require('../assets/Nav_Publicacion.png')} style={styles.publicarIcono} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/Nav_Usuario.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/Nav_Chat.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>

      {/* Modal Reporte */}
      {reportModalOpen && (
        <View style={localStyles.modalBackdrop}>
          <View style={localStyles.modalSheet}>
            <Text style={localStyles.modalTitle}>Reportar publicación</Text>
            <Text style={localStyles.modalSub}>
              {reportTarget?.titulo ? `“${reportTarget.titulo}”` : 'Publicación'}
            </Text>

            <View style={{ marginTop: 10 }}>
              {REPORT_REASONS.map((r) => (
                <TouchableOpacity
                  key={r.key}
                  style={localStyles.radioRow}
                  onPress={() => setReportReason(r.key)}
                  activeOpacity={0.8}
                >
                  <View style={[localStyles.radioOuter, reportReason === r.key && localStyles.radioOuterActive]}>
                    {reportReason === r.key && <View style={localStyles.radioInner} />}
                  </View>
                  <Text style={localStyles.radioLabel}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={reportNote}
              onChangeText={setReportNote}
              placeholder="Comentario (opcional)…"
              placeholderTextColor="#94A3B8"
              style={localStyles.modalInput}
              multiline
            />

            <View style={localStyles.modalActions}>
              <TouchableOpacity
                style={localStyles.modalBtnGhost}
                onPress={() => { setReportModalOpen(false); setMenuPubId(null); }}
              >
                <Text style={localStyles.modalBtnGhostText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={localStyles.modalBtnPrimary}
                onPress={() => {
                  if (!reportTarget?.id) { setReportModalOpen(false); return; }
                  reportarPublicacion(reportTarget.id, reportReason, reportNote);
                }}
              >
                <Text style={localStyles.modalBtnPrimaryText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerIconLabel: { color: '#fff', fontSize: 10, marginTop: 4 },
  kebabBtn: { marginLeft: 'auto', padding: 6 },
  kebabText: { fontSize: 22, color: '#64748B', lineHeight: 18 },
  kebabMenu: {
    position: 'absolute',
    top: -10,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    zIndex: 20,
  },
  kebabItem: { paddingHorizontal: 14, paddingVertical: 10 },
  kebabItemText: { color: '#0f172a', fontSize: 14 },
  modalBackdrop: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  modalSheet: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  modalSub: { marginTop: 4, fontSize: 13, color: '#64748B' },
  modalInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#0f172a',
  },
  modalActions: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  modalBtnGhost: { paddingHorizontal: 14, paddingVertical: 10 },
  modalBtnGhostText: { color: '#334155', fontWeight: '600' },
  modalBtnPrimary: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#0e0e2c' },
  modalBtnPrimaryText: { color: '#fff', fontWeight: '700' },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  radioOuter: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#CBD5E1',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  radioOuterActive: { borderColor: '#0e0e2c' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0e0e2c' },
  radioLabel: { color: '#0f172a', fontSize: 14 },
});
