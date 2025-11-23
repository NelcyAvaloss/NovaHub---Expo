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
  Easing,
  Alert,
  Dimensions,
  Pressable,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { styles } from './Home.styles';
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';

const likeIcon = require('../assets/IconoLike.png');
const likeIconActive = require('../assets/Icono_LikeActivo.png');
const dislikeIcon = require('../assets/IconoDislike.png');
const dislikeIconActive = require('../assets/Icono_DislikeActivo.png');

const ROLE_ADMIN = 'administrador';
const ROLE_STUDENT = 'estudiante';

/* ==== Config carrusel categorías (inline) ==== */
const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.round(width * 0.30);
const SPACING = 22;
const ITEM_SIZE = CARD_WIDTH + SPACING;
const SIDE_PADDING = (width - CARD_WIDTH) / 2;
const CARD_RADIUS = 18;

const CARD_HEIGHT = 160;
const CATS_TOP_OPEN = 2;
const TARGET_HEIGHT = CARD_HEIGHT + CATS_TOP_OPEN;

const CATS_DATA = [
  { id: 'cat1', nombre: 'Ciencia y Tecnología', img: require('../assets/categorias/ciencia_tecnologia.jpg') },
  { id: 'cat2', nombre: 'Farmacología',         img: require('../assets/categorias/farmacologia.jpg') },
  { id: 'cat3', nombre: 'Medicina',             img: require('../assets/categorias/medicina.jpg') },
  { id: 'cat4', nombre: 'Ingeniería',           img: require('../assets/categorias/ingenieria.png') },
  { id: 'cat5', nombre: 'Educación',            img: require('../assets/categorias/educacion.jpg') },
];
const LOOPS = 7;
const TOTAL = CATS_DATA.length * LOOPS;
const START_INDEX = Math.floor(TOTAL / 2);
/* ============================================= */

export default function HomeScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null);
  const isFocused = useIsFocused();

  const [publicaciones, setPublicaciones] = useState([]);
  const [votesMap, setVotesMap] = useState({});
  const [rolUsuario, setRolUsuario] = useState(null);
  const [menuPubId, setMenuPubId] = useState(null);

  // === Toggle carrusel (entre header y buscador) con LayoutAnimation ===
  const [catsOpen, setCatsOpen] = useState(false);
  const [catsHeight, setCatsHeight] = useState(0);
  const catsOpacity = useRef(new Animated.Value(0)).current;

  // Habilitar LayoutAnimation en Android
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleCats = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const willOpen = !catsOpen;
    setCatsOpen(willOpen);
    setCatsHeight(willOpen ? TARGET_HEIGHT : 0);
    Animated.timing(catsOpacity, {
      toValue: willOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [catsOpen, catsOpacity]);

  // ====== Carrusel refs y animaciones ======
  const LOOP_DATA = useMemo(
    () => Array.from({ length: LOOPS }).flatMap((_, i) =>
      CATS_DATA.map((item) => ({ ...item, _key: `${item.id}-${i}` }))
    ),
    []
  );
  const catsListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(START_INDEX * ITEM_SIZE)).current;
  const offsetRef = useRef(START_INDEX * ITEM_SIZE);
  const [currentIndex, setCurrentIndex] = useState(START_INDEX);
  const autoplayRef = useRef(null);
  const auto = useRef(new Animated.Value(offsetRef.current)).current;
  const autoAnimRef = useRef(null);

  const indexFromOffset = (x) => Math.round(x / ITEM_SIZE);
  const offsetFromIndex = (i) => i * ITEM_SIZE;

  const recenterIfNeeded = () => {
    const idx = indexFromOffset(offsetRef.current);
    if (idx <= CATS_DATA.length) {
      const newIndex = idx + CATS_DATA.length * Math.floor(LOOPS / 2);
      catsListRef.current?.scrollToOffset({ offset: offsetFromIndex(newIndex), animated: false });
      setCurrentIndex(newIndex);
      offsetRef.current = offsetFromIndex(newIndex);
    } else if (idx >= TOTAL - CATS_DATA.length) {
      const newIndex = idx - CATS_DATA.length * Math.floor(LOOPS / 2);
      catsListRef.current?.scrollToOffset({ offset: offsetFromIndex(newIndex), animated: false });
      setCurrentIndex(newIndex);
      offsetRef.current = offsetFromIndex(newIndex);
    }
  };

  const autoScrollToIndex = (nextIndex, duration = 900) => {
    if (autoAnimRef.current) auto.stopAnimation();
    auto.setValue(offsetRef.current);

    const listenerId = auto.addListener(({ value }) => {
      offsetRef.current = value;
      catsListRef.current?.scrollToOffset({ offset: value, animated: false });
    });

    autoAnimRef.current = Animated.timing(auto, {
      toValue: offsetFromIndex(nextIndex),
      duration,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    });

    autoAnimRef.current.start(({ finished }) => {
      auto.removeListener(listenerId);
      if (finished) {
        setCurrentIndex(nextIndex);
        recenterIfNeeded();
      }
    });
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      const base = indexFromOffset(offsetRef.current);
      autoScrollToIndex(base + 1, 900);
    }, 3600);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = null;
    if (autoAnimRef.current) {
      auto.stopAnimation();
      autoAnimRef.current = null;
    }
  };

  // Autoplay siempre activo
  useEffect(() => {
    requestAnimationFrame(() => {
      catsListRef.current?.scrollToOffset({ offset: offsetRef.current, animated: false });
      startAutoplay();
    });
    return stopAutoplay;
  }, []);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (e) => {
        offsetRef.current = e.nativeEvent.contentOffset.x;
      },
    }
  );

  const onScrollBeginDrag = () => {
    stopAutoplay();
  };

  const onMomentumScrollEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = indexFromOffset(x);
    setCurrentIndex(idx);
    offsetRef.current = x;
    recenterIfNeeded();
    setTimeout(startAutoplay, 300);
  };

  const REPORT_REASONS = [
    { key: 'Spam', label: 'Spam' },
    { key: 'Acoso/Agresion', label: 'Agresión' },
    { key: 'NSFW', label: 'NSFW (contenido sensible)' },
    { key: 'Contenido engañoso', label: 'Contenido engañoso' },
    { key: 'Lenguaje ofensivo', label: 'Lenguaje ofensivo' },
    { key: 'Seguridad', label: 'Problema de seguridad' },
    { key: 'Privacidad', label: 'Problema de privacidad' },
    { key: 'Sin clasificar', label: 'Reporte sin clasificar' },
  ];
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState('Spam');
  const [reportNote, setReportNote] = useState('');

  const homeChRef = useRef(null);

  /* ===== Utils rol ===== */
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
      const r1 = inferRoleFromRow(q1.data);
      if (r1) return r1;
    }
    if (userId) {
      const q2 = await supabase.from('usuarios').select('*').eq('auth_id', userId).maybeSingle();
      const r2 = inferRoleFromRow(q2.data);
      if (r2) return r2;
    }
    if (email) {
      const q3 = await supabase.from('usuarios').select('*').ilike('email', email).maybeSingle();
      const r3 = inferRoleFromRow(q3.data);
      if (r3) return r3;
    }
    return null;
  };

  const fetchRol = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user || null;
      if (error || !user) { setRolUsuario(null); return; }

      const meta = getRolFromUser(user);
      if (meta) { setRolUsuario(meta); return; }
      const dbRol = await fetchRolFromUsuarios(user);
      if (dbRol) { setRolUsuario(dbRol); return; }
      setRolUsuario(ROLE_STUDENT);
    } catch {
      setRolUsuario(null);
    }
  };

  /* ===== auth / foco ===== */
  useEffect(() => {
    fetchRol();
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        const instant = getRolFromUser(session?.user);
        if (instant) setRolUsuario(instant);
        else await fetchRol();
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
      fetchRol();
      const t1 = setTimeout(() => fetchRol(), 400);
      const t2 = setTimeout(() => fetchRol(), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isFocused]);

  // ---------- publicaciones + votos ----------
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const init = async () => {
        const pubs = await obtenerPublicaciones();
        if (!isActive) return;
        setPublicaciones(pubs || []);
        seedVotesFromItems(pubs || []);
        await cargarVotos(pubs || []);

        const TOPIC = 'home-publicaciones';
        supabase.getChannels().forEach((ch) => {
          if (ch?.topic === TOPIC) supabase.removeChannel(ch);
        });

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

  const irADetalle = useCallback(
    (pub) => navigation.navigate('DetallePublicacion', { publicacion: pub }),
    [navigation]
  );

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

  const obtenerPublicaciones = async () => {
    const { data, error } = await supabase
      .from('Publicaciones')
      .select('*, autor:usuarios(nombre)')
      .eq('estado_de_revision', 'publicada')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
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

  // Helper para crear notificaciones (reutilizable también para mensajes/comentarios)
  const crearNotificacion = async ({
    receptorId,
    emisorId,
    tipo,
    titulo,
    mensaje,
    publicacionId = null,
    comentarioId = null,
  }) => {
    try {
      if (!receptorId || !emisorId || receptorId === emisorId) return;

      // IMPORTANTE: nombre de tabla en minúsculas
      const { error } = await supabase.from('notificaciones').insert([
        {
          id_usuario_receptor: receptorId,
          id_usuario_emisor: emisorId,
          tipo,
          titulo,
          mensaje,
          id_publicacion: publicacionId,
          id_comentario: comentarioId,
          leida: false,
        },
      ]);

      if (error) {
        console.log('Error creando notificación:', error);
      }
    } catch (e) {
      console.log('Error creando notificación (catch):', e);
    }
  };

  const applyVote = async (pubId, type) => {
    const { data: session } = await supabase.auth.getUser();
    const userId = session?.user?.id || null;
    if (!userId) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para votar.');
      return;
    }

    // Actualización optimista local (no se toca)
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
      const intended = type === 'like'
        ? (prevMyVote === 1 ? 0 : 1)
        : (prevMyVote === -1 ? 0 : -1);

      if (intended === 0) {
        await supabase
          .from('votos')
          .delete()
          .eq('id_usuario', userId)
          .eq('id_publicacion', pubId);
      } else {
        await supabase
          .from('votos')
          .upsert(
            [{ id_usuario: userId, id_publicacion: pubId, valor: intended }],
            { onConflict: 'id_usuario,id_publicacion' }
          );
      }

      // Si el voto final es un LIKE, creamos notificación al autor
      if (type === 'like' && intended === 1) {
        const pub = publicaciones.find((p) => p.id === pubId);
        const receptorId = pub ? getAuthorIdFromItem(pub) : null;

        await crearNotificacion({
          receptorId,
          emisorId: userId,
          tipo: 'like_publicacion',
          titulo: 'Nuevo like en tu publicación',
          mensaje: `A alguien le gustó tu publicación "${pub?.titulo || 'en NovaHub'}".`,
          publicacionId: pubId,
        });
      }

      await cargarVotos([{ id: pubId }]);
    } catch (err) {
      Alert.alert('Error', 'No se pudo registrar tu voto.');
      await cargarVotos([{ id: pubId }]);
    }
  };

  const reportarPublicacion = async (pubId, motivo, nota) => {
    try {
      const { data: s } = await supabase.auth.getUser();
      const uid = s?.user?.id || null;

      const { error } = await supabase
        .from('Reportes')
        .insert([{
          id_objetivo: pubId,
          tipo_objetivo: 'publicacion',
          razón: motivo,
          detalles: nota || null,
        }]);

      if (error) throw error;

      setReportModalOpen(false);
      setReportNote('');
      setReportReason('Spam');
      setMenuPubId(null);
      Alert.alert('Gracias', 'Tu reporte fue enviado.');
    } catch (e) {
      console.error('Error reportando publicación:', e);
      Alert.alert('Error', 'No se pudo enviar el reporte.');
    }
  };

  // === gap dinámico bajo el icono (cerrado perfecto / abierto compacto) ===
  const gapBelowIcon = catsOpen ? 4 : 14;

  const renderItem = useCallback(
    ({ item, index }) => {
      const inputRange = [
        (index - 1) * ITEM_SIZE,
        index * ITEM_SIZE,
        (index + 1) * ITEM_SIZE,
      ];
      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.92, 1, 0.92],
        extrapolate: 'clamp',
      });
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.75, 1, 0.75],
        extrapolate: 'clamp',
      });
      const glowOpacity = scrollX.interpolate({
        inputRange,
        outputRange: [0, 0.35, 0],
        extrapolate: 'clamp',
      });
      const glowScale = scrollX.interpolate({
        inputRange,
        outputRange: [1, 1.02, 1],
        extrapolate: 'clamp',
      });
      const ringOpacity = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
      });
      const ringScale = scrollX.interpolate({
        inputRange,
        outputRange: [0.98, 1.02, 0.98],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View style={{ transform: [{ scale }], opacity, marginHorizontal: SPACING / 2 }}>
          <Pressable
            onPress={() =>
              navigation.navigate('CategoriaFeed', {
                categoriaId: item.id,
                nombre: item.nombre,
              })
            }
            style={[styles.catsCard, { width: CARD_WIDTH, overflow: 'hidden', borderRadius: CARD_RADIUS }]}
          >
            <ImageBackground
              source={item.img}
              style={[styles.catsCardImage, { height: CARD_HEIGHT }]}
              imageStyle={styles.catsCardImageStyle}
            >
              <View style={styles.catsOverlay} />
              <Text style={styles.catsCardTitle}>{item.nombre}</Text>
            </ImageBackground>

            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: CARD_RADIUS,
                borderColor: 'rgba(34, 211, 238, 0.45)',
                borderWidth: 10,
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
                zIndex: 10,
              }}
            />

            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: CARD_RADIUS,
                borderColor: '#22D3EE',
                borderWidth: 3,
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
                zIndex: 11,
              }}
            />
          </Pressable>
        </Animated.View>
      );
    },
    [navigation, scrollX]
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
                  navigation.navigate('Notificaciones');  
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
                <Text style={styles.headerIconLabel}>Administrador</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>

      {/* ==== ÍCONO-IMAGEN ENTRE HEADER Y BUSCADOR ==== */}
      <View style={[styles.midIconWrap, { marginBottom: catsOpen ? 2 : -8 }]}>
        <TouchableOpacity
          style={styles.midIconBtn}
          activeOpacity={0.9}
          onPress={toggleCats}
        >
          <View style={styles.midIconImageBox}>
            <Image
              source={require('../assets/IconoCategorias.png')}
              style={styles.midIconImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.midIconText}>Categorías</Text>
          <Ionicons
            name={catsOpen ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#0f172a"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>

      {/* ==== CARRUSEL DESPLEGABLE ==== */}
      <Animated.View
        style={[
          styles.catsWrap,
          {
            height: catsHeight,
            opacity: catsOpacity,
            paddingTop: catsOpen ? CATS_TOP_OPEN : 8,
            paddingBottom: 0,
            marginBottom: 0,
          },
        ]}
        pointerEvents={catsOpen ? 'auto' : 'none'}
      >
        <Animated.FlatList
          ref={catsListRef}
          data={LOOP_DATA}
          keyExtractor={(it) => it._key}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          snapToInterval={ITEM_SIZE}
          snapToAlignment="center"
          decelerationRate="fast"
          disableIntervalMomentum
          contentContainerStyle={{ paddingHorizontal: SIDE_PADDING, paddingTop: 0, paddingBottom: 0 }}
          initialScrollIndex={START_INDEX}
          getItemLayout={(_, index) => ({
            length: ITEM_SIZE,
            offset: ITEM_SIZE * index,
            index,
          })}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={9}
          removeClippedSubviews
          onScroll={onScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={onScrollBeginDrag}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={renderItem}
        />
      </Animated.View>

      {/* ==== BUSCADOR ==== */}
      <View style={[styles.searchContainer, { marginTop: gapBelowIcon }]}>
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
          renderItem={({ item }) => {
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
                      <TouchableOpacity activeOpacity={0.85} onPress={() => openPerfilAutor(item)}>
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
                      style={styles.kebabBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.kebabText}>⋮</Text>
                    </TouchableOpacity>
                  </View>

                  {menuPubId === item.id && (
                    <View style={styles.kebabMenu}>
                      <TouchableOpacity
                        style={styles.kebabItem}
                        onPress={() => {
                          setMenuPubId(null);
                          setReportReason('Spam');
                          setReportNote('');
                          setReportModalOpen(true);
                        }}
                      >
                        <Text style={styles.kebabItemText}>Reportar publicación</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.kebabItem}
                        onPress={() => setMenuPubId(null)}
                      >
                        <Text style={styles.kebabItemText}>Cancelar</Text>
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
          }}
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
            Animated
              .spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
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
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Reportar publicación</Text>
            <Text style={styles.modalSub}>
              {reportTarget?.titulo ? `“${reportTarget.titulo}”` : 'Publicación'}
            </Text>

            <View style={{ marginTop: 10 }}>
              {REPORT_REASONS.map((r) => (
                <TouchableOpacity
                  key={r.key}
                  style={styles.radioRow}
                  onPress={() => setReportReason(r.key)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioOuter, reportReason === r.key && styles.radioOuterActive]}>
                    {reportReason === r.key && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={reportNote}
              onChangeText={setReportNote}
              placeholder="Comentario (opcional)…"
              placeholderTextColor="#94A3B8"
              style={styles.modalInput}
              multiline
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnGhost}
                onPress={() => { setReportModalOpen(false); setMenuPubId(null); }}
              >
                <Text style={styles.modalBtnGhostText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={() => {
                  if (!reportTarget?.id) { setReportModalOpen(false); return; }
                  reportarPublicacion(reportTarget.id, reportReason, reportNote);
                }}
              >
                <Text style={styles.modalBtnPrimaryText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
