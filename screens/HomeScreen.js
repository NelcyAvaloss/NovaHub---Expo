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
import { useIsFocused } from '@react-navigation/native';
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
  const [rolUsuario, setRolUsuario] = useState(null); // 'administrador' | 'estudiante' | null

  // ===== Utilidades de rol =====
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
      row.rol,
      row.role,
      row.tipo,
      row.tipo_usuario,
      row.perfil,
      row.nivel,
      row.categoria,
      row.rango,
      row.user_role,
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
      if (r1) {
        console.log('[Home] rol via usuarios.id = uid:', r1, q1.data);
        return r1;
      }
    }
    if (userId) {
      const q2 = await supabase.from('usuarios').select('*').eq('auth_id', userId).maybeSingle();
      if (q2.error) console.log('[Home] usuarios.auth_id error:', q2.error.message);
      const r2 = inferRoleFromRow(q2.data);
      if (r2) {
        console.log('[Home] rol via usuarios.auth_id = uid:', r2, q2.data);
        return r2;
      }
    }
    if (email) {
      const q3 = await supabase.from('usuarios').select('*').ilike('email', email).maybeSingle();
      if (q3.error) console.log('[Home] usuarios.email error:', q3.error.message);
      const r3 = inferRoleFromRow(q3.data);
      if (r3) {
        console.log('[Home] rol via usuarios.email:', r3, q3.data);
        return r3;
      }
    }
    return null;
  };

  const fetchRol = async (why = '') => {
    try {
      const { data: sessionRes, error: sessionErr } = await supabase.auth.getUser();
      if (sessionErr) console.log('[Home] getUser error:', sessionErr.message);

      const user = sessionRes?.user;
      if (!user) {
        console.log('[Home] fetchRol: sin usuario', { why });
        setRolUsuario(null);
        return;
      }

      const meta = getRolFromUser(user);
      if (meta) {
        console.log('[Home] rol via metadata:', meta, { why });
        setRolUsuario(meta);
        return;
      }

      const dbRol = await fetchRolFromUsuarios(user);
      if (dbRol) {
        setRolUsuario(dbRol);
        return;
      }

      console.log('[Home] rol fallback -> estudiante', { why });
      setRolUsuario(ROLE_STUDENT);
    } catch (e) {
      console.log('[Home] exception fetchRol:', e, { why });
      setRolUsuario(ROLE_STUDENT);
    }
  };

  // ===== Escuchar cambios de sesión y foco =====
  useEffect(() => {
    fetchRol('mount');

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Home] onAuthStateChange:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        const instant = getRolFromUser(session?.user);
        if (instant) {
          console.log('[Home] rol inmediato:', instant);
          setRolUsuario(instant);
        } else {
          await fetchRol('auth_change_no_meta');
        }
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
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isFocused]);

  // ---------- publicaciones + votos ----------
  useEffect(() => {
    const fetchAll = async () => {
      const pubs = await obtenerPublicaciones();
      setPublicaciones(pubs || []);
      seedVotesFromItems(pubs || []);
      await cargarVotos(pubs || []);
    };
    fetchAll();
  }, []);

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
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('CrearPublicacion');
    });
  }, [navigation, scaleAnim]);

  const irADetalle = useCallback(
    (pub) => navigation.navigate('DetallePublicacion', { publicacion: pub }),
    [navigation]
  );

  const obtenerPublicaciones = async () => {
    const { data, error } = await supabase
      .from('Publicaciones')
      .select('*, autor:usuarios(nombre)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error al obtener publicaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las publicaciones.');
      return [];
    }

    const pubs = (data || []).map((pub) => ({
      ...pub,
      autor: pub.autor?.nombre || 'Autor',
    }));

    return pubs;
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
    if (eTotals) {
      console.error('Error totals:', eTotals);
      return;
    }

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
        next[id] = {
          likes: t.likes,
          dislikes: t.dislikes,
          myVote: myMap[id] ?? base.myVote,
        };
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
        if (myVote === 1) {
          likes = Math.max(0, likes - 1);
          myVote = 0;
        } else if (myVote === -1) {
          dislikes = Math.max(0, dislikes - 1);
          likes += 1;
          myVote = 1;
        } else {
          likes += 1;
          myVote = 1;
        }
      } else {
        if (myVote === -1) {
          dislikes = Math.max(0, dislikes - 1);
          myVote = 0;
        } else if (myVote === 1) {
          likes = Math.max(0, likes - 1);
          dislikes += 1;
          myVote = -1;
        } else {
          dislikes += 1;
          myVote = -1;
        }
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
            <View style={styles.publicacionHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>
                  {(item?.autor?.[0] || 'N').toUpperCase()}
                </Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.nombreAutor} numberOfLines={1}>
                  {item.autor || 'Autor'}
                </Text>
                <Text style={styles.fechaTexto}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Ahora'}
                </Text>
              </View>
            </View>

            {!!item.titulo && (
              <Text style={styles.publicacionTitulo} numberOfLines={2}>
                {item.titulo}
              </Text>
            )}
            {!!item.descripcion && (
              <Text style={styles.publicacionTexto} numberOfLines={3}>
                {item.descripcion}
              </Text>
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
                  <Image
                    source={myVote === 1 ? likeIconActive : likeIcon}
                    style={styles.voteImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.voteCount}>{likes}</Text>
                </TouchableOpacity>

                <View style={{ width: 12 }} />

                <TouchableOpacity
                  style={[styles.voteBtn, myVote === -1 && styles.voteBtnActiveDown]}
                  activeOpacity={0.85}
                  onPress={() => applyVote(item.id, 'dislike')}
                >
                  <Image
                    source={myVote === -1 ? dislikeIconActive : dislikeIcon}
                    style={styles.voteImage}
                    resizeMode="contain"
                  />
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
    [applyVote, irADetalle, votesMap]
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/FondoNovaHub.png')} style={styles.headerBackground}>
        <View style={styles.header}>
          {/* Perfil */}
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')} activeOpacity={0.8}>
            <Image source={require('../assets/IconoUsuario.png')} style={styles.profileIcon} />
          </TouchableOpacity>

          {/* Título */}
          <Text style={styles.title}>NovaHub</Text>

          {/* Icono derecha + etiqueta abajo cuando es admin */}
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
              style={{ alignItems: 'center' }} // centramos icono + texto
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
          extraData={votesMap}
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
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
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
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerIconLabel: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
  },
});
