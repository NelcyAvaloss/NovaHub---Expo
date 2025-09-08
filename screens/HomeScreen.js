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
} from 'react-native';
import { styles } from './Home.styles';
import { supabase } from './supabase';


const likeIcon = require('../assets/IconoLike.png');
const likeIconActive = require('../assets/Icono_LikeActivo.png');
const dislikeIcon = require('../assets/IconoDislike.png');
const dislikeIconActive = require('../assets/Icono_DislikeActivo.png');

export default function HomeScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef(null); 

  const [publicaciones, setPublicaciones] = useState([]);
  // votesMap[pubId] = { likes, dislikes, myVote }
  const [votesMap, setVotesMap] = useState({});

  // ---------- Fetch inicial ----------
  useEffect(() => {
    const fetchAll = async () => {
      const pubs = await obtenerPublicaciones();
      setPublicaciones(pubs || []);
      // Seed inicial de votos desde los campos que ya vengan del backend
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

  // ---------- Navegación FAB ----------
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

  // ---------- Supabase: publicaciones ----------
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

  // ---------- Supabase: votos agregados + mi voto ----------
  const cargarVotos = async (pubsParam) => {
  const source = Array.isArray(pubsParam) && pubsParam.length ? pubsParam : publicaciones;
  const pubIds = (source || []).map(p => p.id);
  if (!pubIds.length) return;

  // user actual para saber "mi voto"
  const { data: sessionRes } = await supabase.auth.getUser();
  const userId = sessionRes?.user?.id || null;

  // Lee los totales desde la VISTA (no uses .group())
  const { data: totalsRows, error: eTotals } = await supabase
    .from('votos_totales')
    .select('*')
    .in('id_publicacion', pubIds);
  if (eTotals) {
    console.error('Error totals:', eTotals);
    return;
  }

  // Lee mis votos (si hay usuario)
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

  // maps
  const totalsMap = {};
  (totalsRows || []).forEach(r => {
    totalsMap[r.id_publicacion] = { likes: r.likes|0, dislikes: r.dislikes|0 };
  });

  const myMap = {};
  (myVotesRows || []).forEach(r => {
    myMap[r.id_publicacion] = r.valor|0;
  });

  // merge al estado
  setVotesMap(prev => {
    const next = { ...prev };
    pubIds.forEach(id => {
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


  // ---------- Acción de votar (like/dislike) SIN reordenar ----------
  const applyVote = async (pubId, type) => {
  const { data: session } = await supabase.auth.getUser();
  const userId = session?.user?.id || null;
  if (!userId) {
    Alert.alert('Inicia sesión', 'Debes iniciar sesión para votar.');
    return;
  }

  // UI optimista
  setVotesMap(prev => {
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
    // decide el voto que queda
    const prevMyVote = votesMap[pubId]?.myVote || 0;
    const intended = type === 'like'
      ? (prevMyVote === 1 ? 0 : 1)
      : (prevMyVote === -1 ? 0 : -1);

    if (intended === 0) {
      await supabase.from('votos')
        .delete()
        .eq('id_usuario', userId)
        .eq('id_publicacion', pubId);
    } else {
      await supabase.from('votos')
        .upsert(
          [{ id_usuario: userId, id_publicacion: pubId, valor: intended }],
          { onConflict: 'id_usuario,id_publicacion' } // requiere índice único
        );
    }

    // refresca SOLO esa publicación desde la BD (totales reales)
    await cargarVotos([{ id: pubId }]);
  } catch (err) {
    console.error('Error al votar:', err);
    Alert.alert('Error', 'No se pudo registrar tu voto.');
    await cargarVotos([{ id: pubId }]);
  }
};


  // ---------- Render item (sin score ni reordenamiento) ----------
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
                <Text style={styles.nombreAutor} numberOfLines={1}>
                  {item.autor || 'Autor'}
                </Text>
                <Text style={styles.fechaTexto}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Ahora'}
                </Text>
              </View>
            </View>

            {/* Título / texto */}
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

            {/* Imagen */}
            {!!item.portadaUri && (
              <Image source={{ uri: item.portadaUri }} style={styles.publicacionImagen} />
            )}

            {/* Chips/meta */}
            <View style={styles.tagsRow}>
              {!!item.categoria && <Text style={styles.tagChip}>#{item.categoria}</Text>}
              {!!item.area && <Text style={styles.tagChip}>#{item.area}</Text>}
            </View>

            {/* Colaboradores */}
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
                      <Text style={styles.collabPillMutedText}>
                        +{colaboradores.length - 5}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Footer / acciones */}
            <View style={styles.publicacionFooter}>
              {/* Like / Dislike con IMÁGENES */}
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

              {/* Ver más */}
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
          <TouchableOpacity onPress={() => navigation.navigate('Perfil')} activeOpacity={0.8}>
            <Image source={require('../assets/IconoUsuario.png')} style={styles.profileIcon} />
          </TouchableOpacity>

          <Text style={styles.title}>NovaHub</Text>
          <TouchableOpacity>
            <Image source={require('../assets/IconoNotificacion.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.9}>
          <Image source={require('../assets/IconoBusqueda.png')} style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.titlePublicacion}>Publicaciones</Text>

      {/* Feed en el MISMO ORDEN original */}
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

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {/* HOME: navegar y scrollear al encabezado */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
            // asegurar el scroll al top
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
