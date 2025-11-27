import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Animated, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s, { ls, reportStyles as rs } from './PerfilUsuarioScreen.styles';
import { styles as homeStyles } from './Home.styles';
import { supabase } from './supabase';

// Iconos usados en Home (para votos)
const likeIcon = require('../assets/IconoLike.png');
const likeIconActive = require('../assets/Icono_LikeActivo.png');
const dislikeIcon = require('../assets/IconoDislike.png');
const dislikeIconActive = require('../assets/Icono_DislikeActivo.png');

export default function PerfilUsuarioScreen({ navigation, route }) {
  // Espera: { perfil: { id, nombre, email, avatarUri?, github?, rol?, universidad? } }
  const perfil = route?.params?.perfil || {
    id: null,
    nombre: 'Maria Hernandez',
    email: 'Maria_Hernandez@gmail.com',
    avatarUri: null,
    github: 'Maria Hernandez',
    rol: 'Estudiante',
    universidad: 'Universidad Gerardo Barrios',
  };

  // ===== Estado general =====
  const [activeTab, setActiveTab] = useState('pubs'); // 'pubs' | 'followers' | 'following'

  // Publicaciones
  const [publicaciones, setPublicaciones] = useState([]);
  const [votesMap, setVotesMap] = useState({});
  const [menuPubId, setMenuPubId] = useState(null);

  // ====== Reportes (idéntico a Home) ======
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

  // Seguidores / Seguidos
  const [seguidores, setSeguidores] = useState([]);  // [{id,nombre,email,avatarUri}]
  const [seguidos, setSeguidos] = useState([]);      // [{id,nombre,email,avatarUri}]
  const [loadedFollowers, setLoadedFollowers] = useState(false);
  const [loadedFollowing, setLoadedFollowing] = useState(false);

  // ====== Refs y animación para el menú flotante  ======
  const flatListRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => navigation.navigate('CrearPublicacion'));
  }, [navigation, scaleAnim]);

  // ========= Carga PUBLICACIONES =========
  useEffect(() => {
    const fetchByAuthor = async () => {
      try {
        let query = supabase
          .from('Publicaciones')
          .select('*, autor:usuarios(nombre)')
          .order('created_at', { ascending: false })
          .limit(100);

        if (perfil?.id) {
          
          query = query.eq('id_usuario', perfil.id);
        }

        const { data, error } = await query;
        if (error) throw error;

        let rows = (data || []).map((pub) => ({
          ...pub,
          autor: pub.autor?.nombre || pub.autor || 'Autor',
        }));

        if (!perfil?.id && perfil?.nombre) {
          rows = rows.filter(
            (r) => (r.autor || '').toLowerCase() === perfil.nombre.toLowerCase()
          );
        }

        setPublicaciones(rows);

        const seed = {};
        rows.forEach((p) => {
          seed[p.id] = {
            likes: p.likes_count ?? p.likes ?? 0,
            dislikes: p.dislikes_count ?? p.dislikes ?? 0,
            myVote: 0,
          };
        });
        setVotesMap(seed);
        await cargarVotos(rows);
      } catch (e) {
        console.log('[Perfil] fetchByAuthor error:', e);
        Alert.alert('Error', 'No se pudieron cargar las publicaciones del perfil.');
      }
    };
    fetchByAuthor();
  }, [perfil?.id, perfil?.nombre]);

  const cargarVotos = async (pubsParam) => {
    const pubIds = (pubsParam || publicaciones || []).map((p) => p.id);
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
        await supabase.from('votos').upsert(
          [{ id_usuario: userId, id_publicacion: pubId, valor: intended }],
          { onConflict: 'id_usuario,id_publicacion' },
        );
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

  // ========= Carga SEGUIDORES / SEGUIDOS =========
  const fetchUserRowsByIds = async (ids) => {
    if (!ids?.length) return [];
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, avatar_uri')
      .in('id', ids);
    if (error) return [];
    return (data || []).map((u) => ({
      id: u.id,
      nombre: u.nombre || 'Usuario',
      email: u.email || '',
      avatarUri: u.avatar_uri || null,
    }));
  };

  const tryFetchFollowers = async (userId) => {
    if (!userId) return [];
    const candidates = [
      { table: 'seguidores', follower: 'id_seguidor', followed: 'id_usuario' },
      { table: 'follows', follower: 'follower_id', followed: 'following_id' },
      { table: 'followers', follower: 'follower_id', followed: 'user_id' },
      { table: 'rel_seguidores', follower: 'seguidor_id', followed: 'seguido_id' },
    ];
    for (const c of candidates) {
      const { data, error } = await supabase
        .from(c.table)
        .select(`${c.follower}`)
        .eq(c.followed, userId);
      if (!error && Array.isArray(data)) {
        const ids = data.map((r) => r[c.follower]).filter(Boolean);
        return await fetchUserRowsByIds(ids);
      }
    }
    return [];
  };

  const tryFetchFollowing = async (userId) => {
    if (!userId) return [];
    const candidates = [
      { table: 'seguidores', follower: 'id_seguidor', followed: 'id_usuario' },
      { table: 'follows', follower: 'follower_id', followed: 'following_id' },
      { table: 'followers', follower: 'follower_id', followed: 'user_id' },
      { table: 'rel_seguidores', follower: 'seguidor_id', followed: 'seguido_id' },
    ];
    for (const c of candidates) {
      const { data, error } = await supabase
        .from(c.table)
        .select(`${c.followed}`)
        .eq(c.follower, userId);
      if (!error && Array.isArray(data)) {
        const ids = data.map((r) => r[c.followed]).filter(Boolean);
        return await fetchUserRowsByIds(ids);
      }
    }
    return [];
  };

  const loadFollowersIfNeeded = async () => {
    if (loadedFollowers) return;
    const rows = await tryFetchFollowers(perfil?.id);
    setSeguidores(rows);
    setLoadedFollowers(true);
  };

  const loadFollowingIfNeeded = async () => {
    if (loadedFollowing) return;
    const rows = await tryFetchFollowing(perfil?.id);
    setSeguidos(rows);
    setLoadedFollowing(true);
  };

  // ========= Tarjeta de publicación (con menú ⋮ de reportes) =========
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
                  {(item?.autor?.[0] || perfil?.nombre?.[0] || 'U').toUpperCase()}
                </Text>
              </View>

              <View style={homeStyles.headerText}>
                <Text style={homeStyles.nombreAutor} numberOfLines={1}>
                  {item.autor || perfil.nombre}
                </Text>
                <Text style={homeStyles.fechaTexto}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Ahora'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setMenuPubId(menuPubId === item.id ? null : item.id);
                  setReportTarget(item);
                }}
                style={ls.kebabBtn}
                activeOpacity={0.8}
              >
                <Text style={ls.kebabText}>⋮</Text>
              </TouchableOpacity>
            </View>

            {/* Menú ⋮ con Reportar/Cancelar */}
            {menuPubId === item.id && (
              <View style={ls.kebabMenu}>
                <TouchableOpacity
                  style={ls.kebabItem}
                  onPress={() => {
                    setMenuPubId(null);
                    setReportReason('spam');
                    setReportNote('');
                    setReportModalOpen(true);
                  }}
                >
                  <Text style={ls.kebabItemText}>Reportar publicación</Text>
                </TouchableOpacity>

                <TouchableOpacity style={ls.kebabItem} onPress={() => setMenuPubId(null)}>
                  <Text style={ls.kebabItemText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Contenido */}
            {!!item.titulo && (
              <Text style={homeStyles.publicacionTitulo} numberOfLines={2}>{item.titulo}</Text>
            )}
            {!!item.descripcion && (
              <Text style={homeStyles.publicacionTexto} numberOfLines={3}>{item.descripcion}</Text>
            )}
            {!!item.portadaUri && (
              <Image source={{ uri: item.portadaUri }} style={homeStyles.publicacionImagen} />
            )}

            {/* Tags */}
            <View style={homeStyles.tagsRow}>
              {!!item.categoria && <Text style={homeStyles.tagChip}>#{item.categoria}</Text>}
              {!!item.area && <Text style={homeStyles.tagChip}>#{item.area}</Text>}
            </View>

            {/* Colaboradores */}
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

            {/* Footer votos */}
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

              <TouchableOpacity
                style={homeStyles.verMasBtn}
                activeOpacity={0.85}
                onPress={() => irADetalle(item)}
              >
                <Text style={homeStyles.verMasText}>Ver más</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [votesMap, menuPubId]
  );

  // ======= Render fila de usuario (seguidores/seguidos) =======
  const renderPerson = ({ item }) => (
    <View style={s.personRow}>
      <Image
        source={item.avatarUri ? { uri: item.avatarUri } : require('../assets/IconoUsuario.png')}
        style={s.personAvatar}
      />
      <View style={s.personInfo}>
        <Text style={s.personName} numberOfLines={1}>{item.nombre || 'Usuario'}</Text>
        {!!item.email && <Text style={s.personEmail} numberOfLines={1}>{item.email}</Text>}
      </View>
      <TouchableOpacity style={s.personBtn} activeOpacity={0.85}>
        <Text style={s.personBtnText}>Ver perfil</Text>
      </TouchableOpacity>
    </View>
  );

  // ======= Contenido según pestaña =======
  const content = useMemo(() => {
    if (activeTab === 'followers') {
      return (
        <FlatList
          data={seguidores}
          keyExtractor={(it, i) => String(it?.id ?? i)}
          renderItem={renderPerson}
          contentContainerStyle={s.listContentPeople}
          ListEmptyComponent={
            <View style={s.emptyBox}><Text style={s.emptyText}>Sin seguidores</Text></View>
          }
        />
      );
    }
    if (activeTab === 'following') {
      return (
        <FlatList
          data={seguidos}
          keyExtractor={(it, i) => String(it?.id ?? i)}
          renderItem={renderPerson}
          contentContainerStyle={s.listContentPeople}
          ListEmptyComponent={
            <View style={s.emptyBox}><Text style={s.emptyText}>No sigue a nadie</Text></View>
          }
        />
      );
    }
    
    return (
      <FlatList
        ref={flatListRef}
        data={publicaciones}
        keyExtractor={(item, i) => String(item?.id ?? i)}
        renderItem={renderItem}
        contentContainerStyle={homeStyles.listContent}
        ListEmptyComponent={
          <View style={s.emptyBox}><Text style={s.emptyText}>El autor aún no tiene publicaciones</Text></View>
        }
      />
    );
  }, [activeTab, publicaciones, seguidores, seguidos, votesMap, menuPubId]);

  return (
    <SafeAreaView style={s.screen}>
      {/* PORTADA con back y avatar */}
      <View style={s.headerWrap}>
        <ImageBackground
          source={require('../assets/FondoNovaHub.png')}
          style={s.headerBg}
          imageStyle={s.headerBgImage}
        >
          <View style={s.headerOverlay} />

          <View style={s.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}  activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={22} color="#E2E8F0" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={s.headerBottomCut} />
        <View style={s.avatarWrap}>
          {perfil?.avatarUri
            ? <Image source={{ uri: perfil.avatarUri }} style={s.avatarImg} />
            : <Image source={require('../assets/IconoUsuario.png')} style={s.avatarImg} />}
        </View>
      </View>

      {/* INFO DEL PERFIL */}
      <View style={s.profileInfo}>
        <Text style={s.userName} numberOfLines={1}>{perfil?.nombre || 'Usuario'}</Text>
        <Text style={s.userRole}>{perfil?.rol || 'Estudiante'}</Text>
        <Text style={s.userUni}>{perfil?.universidad || 'Universidad Gerardo Barrios'}</Text>

        <View style={s.contactRow}>
          <Ionicons name="logo-github" size={16} color="#0f172a" />
          <Text style={s.contactText}>GitHub: {perfil?.github || 'usuario'}</Text>
          <Ionicons name="mail-outline" size={16} color="#0f172a" style={{ marginLeft: 12 }} />
          <Text style={s.contactText}>{perfil?.email || 'correo@example.com'}</Text>
        </View>

        <View style={s.actionRow}>
          <TouchableOpacity style={[s.actionBtn, s.msgBtn]} activeOpacity={0.9}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#F8FAFC" />
            <Text style={s.actionBtnText}>Mensajes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, s.followBtn]} activeOpacity={0.9}>
            <Ionicons name="add" size={16} color="#F8FAFC" />
            <Text style={s.actionBtnText}>Seguir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PESTAÑAS */}
      <View style={s.tabsRow}>
        <TouchableOpacity
          style={[s.tabBtn, activeTab === 'pubs' ? s.tabBtnActive : null]}
          activeOpacity={0.85}
          onPress={() => setActiveTab('pubs')}
        >
          <Text style={[s.tabText, activeTab === 'pubs' ? s.tabTextActive : null]}>Publicaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.tabBtn, activeTab === 'followers' ? s.tabBtnActive : null]}
          activeOpacity={0.85}
          onPress={async () => {
            setActiveTab('followers');
            await loadFollowersIfNeeded();
          }}
        >
          <Text style={[s.tabText, activeTab === 'followers' ? s.tabTextActive : null]}>Seguidores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.tabBtn, activeTab === 'following' ? s.tabBtnActive : null]}
          activeOpacity={0.85}
          onPress={async () => {
            setActiveTab('following');
            await loadFollowingIfNeeded();
          }}
        >
          <Text style={[s.tabText, activeTab === 'following' ? s.tabTextActive : null]}>Seguidos</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENIDO SEGÚN PESTAÑA */}
      {content}

          {/* ====== MENÚ FLOTANTE INFERIOR (copiado de Home) ====== */}
      <View style={homeStyles.bottomNav}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
            requestAnimationFrame(() => {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            });
          }}
        >
          <Image source={require('../assets/Nav_Home.png')} style={homeStyles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Ranking', { publicaciones, votesMap })}>
          <Image source={require('../assets/Nav_Medalla.png')} style={homeStyles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPressIn={() =>
            Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }).start()
          }
          onPressOut={() =>
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 3,
              tension: 40,
              useNativeDriver: true,
            }).start(() => navigation.navigate('CrearPublicacion'))
          }
          style={{ transform: [{ scale: scaleAnim }] }}
          activeOpacity={0.9}
        >
          <Image source={require('../assets/Nav_Publicacion.png')} style={homeStyles.publicarIcono} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SugerenciasUsuarios')}
        >
          <Image
            source={require('../assets/Nav_Usuario.png')}
            style={homeStyles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Mensajes')}
        >
          <Image
            source={require('../assets/Nav_Mensaje.png')}
            style={homeStyles.navIcon}
          />
        </TouchableOpacity>
      </View>


      {/* ===== Modal Reporte ===== */}
      {reportModalOpen && (
        <View style={rs.modalBackdrop}>
          <View style={rs.modalSheet}>
            <Text style={rs.modalTitle}>Reportar publicación</Text>
            <Text style={rs.modalSub}>
              {reportTarget?.titulo ? `“${reportTarget.titulo}”` : 'Publicación'}
            </Text>

            {/* Radios motivo */}
            <View style={{ marginTop: 10 }}>
              {REPORT_REASONS.map((r) => (
                <TouchableOpacity
                  key={r.key}
                  style={rs.radioRow}
                  onPress={() => setReportReason(r.key)}
                  activeOpacity={0.8}
                >
                  <View style={[rs.radioOuter, reportReason === r.key && rs.radioOuterActive]}>
                    {reportReason === r.key && <View style={rs.radioInner} />}
                  </View>
                  <Text style={rs.radioLabel}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Nota opcional */}
            <TextInput
              value={reportNote}
              onChangeText={setReportNote}
              placeholder="Comentario (opcional)…"
              placeholderTextColor="#94A3B8"
              style={rs.modalInput}
              multiline
            />

            {/* Acciones */}
            <View style={rs.modalActions}>
              <TouchableOpacity
                style={rs.modalBtnGhost}
                onPress={() => { setReportModalOpen(false); setMenuPubId(null); }}
              >
                <Text style={rs.modalBtnGhostText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={rs.modalBtnPrimary}
                onPress={() => {
                  if (!reportTarget?.id) { setReportModalOpen(false); return; }
                 
                  reportarPublicacion(reportTarget.id, reportReason, reportNote);
                }}
              >
                <Text style={rs.modalBtnPrimaryText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
