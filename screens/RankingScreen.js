import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Platform,
  UIManager,
} from 'react-native';
import { styles as s } from './Ranking.styles';

// Íconos locales
const likeIcon = require('../assets/IconoLike.png');
const dislikeIcon = require('../assets/IconoDislike.png');

// Imágenes para los 3 primeros lugares
const primerLugarImg = require('../assets/PrimerLugar.png');
const segundoLugarImg = require('../assets/SegundoLugar.png');
const tercerLugarImg = require('../assets/TercerLugar.png');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Paleta de colores top 3
const rankPalette = [
  { border: '#F6C646', text: '#F6C646' }, // Oro
  { border: '#C0C9D6', text: '#C0C9D6' }, // Plata
  { border: '#E08B5A', text: '#E08B5A' }, // Bronce
];

export default function RankingScreen({ navigation, route }) {
  const anim = useRef(new Animated.Value(0)).current;

  const publicaciones = route?.params?.publicaciones ?? [];
  const votesMap = route?.params?.votesMap ?? {};

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [anim]);

  // ===== Helpers para perfil de autor =====
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

  const openPerfilAutor = useCallback(
    (item) => {
      const perfil = {
        id: getAuthorIdFromItem(item),
        nombre: item?.autor || 'Autor',
        email: null,
        avatarUri: null,
      };
      navigation.navigate('PerfilUsuario', { perfil });
    },
    [navigation]
  );

  // ===== Ordenar publicaciones =====
  const data = useMemo(() => {
    const merged = (publicaciones || []).map((p, i) => {
      const v = votesMap?.[p.id] || {
        likes: p?.likes_count ?? p?.likes ?? 0,
        dislikes: p?.dislikes_count ?? p?.dislikes ?? 0,
      };
      const score = (v.likes || 0) - (v.dislikes || 0);
      return {
        ...p,
        _likes: v.likes || 0,
        _dislikes: v.dislikes || 0,
        _score: score,
        _key: String(p.id ?? i),
      };
    });

    return merged.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      const ta = a?.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b?.created_at ? new Date(b.created_at).getTime() : 0;
      if (tb !== ta) return tb - ta;
      return b._key.localeCompare(a._key);
    });
  }, [publicaciones, votesMap]);

  const renderItem = ({ item, index }) => {
    const colaboradores = (item?.equipo_colaborador || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const getBadgeImage = () => {
      if (index === 0) return primerLugarImg;
      if (index === 1) return segundoLugarImg;
      if (index === 2) return tercerLugarImg;
      return null;
    };

    const palette =
      index < 3
        ? rankPalette[index]
        : { border: 'rgba(255,255,255,0.08)', text: '#EAF2FF' };

    const starNumber = index + 1;

    return (
      <View
        style={[
          s.card,
          { 
            borderColor: palette.border,
            backgroundColor: '#F4F4F5'   // ← GRIS CLARITO PARA LAS TARJETAS
          }
        ]}
      >
        <View style={s.rankBadge}>
          {index < 3 ? (
            <Image source={getBadgeImage()} style={s.rankImage} resizeMode="contain" />
          ) : (
            <Text style={s.rankText}>{index + 1}</Text>
          )}
        </View>

        <View style={s.rowWrap}>
          {/* Portada */}
          {item.portadaUri ? (
            <Image source={{ uri: item.portadaUri }} style={s.thumb} />
          ) : (
            <View style={[s.thumb, { backgroundColor: '#0d1120' }]} />
          )}

          {/* Info */}
          <View style={s.infoBlock}>
            <View style={s.headerRow}>
              <View style={s.avatar}>
                <Text style={s.avatarLetter}>{(item?.autor?.[0] || 'N').toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity activeOpacity={0.85} onPress={() => openPerfilAutor(item)}>
                  <Text numberOfLines={1} style={s.author}>
                    {item.autor || 'Autor'}
                  </Text>
                </TouchableOpacity>
                <Text style={s.date}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Ahora'}
                </Text>
              </View>

              <View style={[s.scoreChip, { backgroundColor: palette.border }]}>
                <Text style={[s.scoreChipText, { color: '#1B1B1B' }]}>
                  ★ {starNumber}
                </Text>
              </View>
            </View>

            {!!item.titulo && (
              <Text numberOfLines={2} style={s.title}>
                {item.titulo}
              </Text>
            )}

            <View style={s.tagsRow}>
              {!!item.categoria && <Text style={s.tagChip}>#{item.categoria}</Text>}
              {!!item.area && <Text style={s.tagChip}>#{item.area}</Text>}
            </View>

            {colaboradores.length > 0 && (
              <View style={s.collabRow}>
                {colaboradores.slice(0, 4).map((name, idx) => (
                  <View key={`${name}-${idx}`} style={s.collabPill}>
                    <Text style={s.collabPillText}>{name}</Text>
                  </View>
                ))}
                {colaboradores.length > 4 && (
                  <View style={s.collabPillMuted}>
                    <Text style={s.collabPillMutedText}>+{colaboradores.length - 4}</Text>
                  </View>
                )}
              </View>
            )}

            <View style={s.footerRow}>
              <View style={s.votesGroup}>
                <View style={s.votePill}>
                  <Image source={likeIcon} style={s.voteIcon} />
                  <Text style={[s.voteText, { color: index >= 3 ? '#000' : palette.text }]}>{item._likes}</Text>
                </View>
                <View style={{ width: 8 }} />
                <View style={[s.votePill, s.votePillDown]}>
                  <Image source={dislikeIcon} style={s.voteIcon} />
                  <Text style={[s.voteText, { color: index >= 3 ? '#000' : palette.text }]}>{item._dislikes}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={s.readMoreBtn}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('DetallePublicacion', { publicacion: item })
                }
              >
                <Text style={s.readMoreText}>Ver más</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[s.container, { backgroundColor: '#FFFFFF' }]}> 
      {/*  FONDO BLANCO */}

      <ImageBackground source={require('../assets/FondoNovaHub.png')} style={s.headerBg}>
        <Animated.View
          style={[
            s.headerBar,
            {
              opacity: anim,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
            },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.8}>
            <Text style={s.backIcon}>↩</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Ranking</Text>
          <View style={{ width: 36 }} />
        </Animated.View>
      </ImageBackground>

      <FlatList
        data={data}
        keyExtractor={(item) => String(item._key)}
        renderItem={renderItem}
        contentContainerStyle={s.listContent}
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyText}>No hay publicaciones para rankear.</Text>
          </View>
        }
        initialNumToRender={10}
      />
    </View>
  );
}
