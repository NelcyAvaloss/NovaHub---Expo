import React, { useMemo, useRef, useEffect } from 'react';
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

// Íconos locales solo para mostrar contadores
const likeIcon = require('../assets/IconoLike.png');
const dislikeIcon = require('../assets/IconoDislike.png');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RankingScreen({ navigation, route }) {
  const anim = useRef(new Animated.Value(0)).current;

  // ✅ Trae lo que le pases desde Home. NO hay llamadas a BD aquí.
  const publicaciones = route?.params?.publicaciones ?? [];
  const votesMap = route?.params?.votesMap ?? {};

  // Animación suave del header
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [anim]);

  // Mezcla info + votos y ordena por score (likes - dislikes), luego por fecha desc si empatan
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
      .map(s => s.trim())
      .filter(Boolean);

    return (
      <View style={s.card}>
        {/* Insignia de posición */}
        <View style={s.rankBadge}>
          <Text style={s.rankText}>{index + 1}</Text>
        </View>

        {/* Header */}
        <View style={s.headerRow}>
          <View style={s.avatar}>
            <Text style={s.avatarLetter}>{(item?.autor?.[0] || 'N').toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={s.author}>{item.autor || 'Autor'}</Text>
            <Text style={s.date}>
              {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Ahora'}
            </Text>
          </View>

          <View style={s.scorePill}>
            <Text style={s.scoreText}>Score {item._score}</Text>
          </View>
        </View>

        {/* Título */}
        {!!item.titulo && <Text style={s.title} numberOfLines={2}>{item.titulo}</Text>}

        {/* Portada (opcional) */}
        {!!item.portadaUri && <Image source={{ uri: item.portadaUri }} style={s.cover} />}

        {/* Chips */}
        <View style={s.tagsRow}>
          {!!item.categoria && <Text style={s.tagChip}>#{item.categoria}</Text>}
          {!!item.area && <Text style={s.tagChip}>#{item.area}</Text>}
        </View>

        {/* Colaboradores */}
        {colaboradores.length > 0 && (
          <View style={s.collabBlock}>
            <Text style={s.collabLabel}>Colaboradores</Text>
            <View style={s.collabRow}>
              {colaboradores.slice(0, 5).map((name, idx) => (
                <View key={`${name}-${idx}`} style={s.collabPill}>
                  <Text style={s.collabPillText}>{name}</Text>
                </View>
              ))}
              {colaboradores.length > 5 && (
                <View style={s.collabPillMuted}>
                  <Text style={s.collabPillMutedText}>+{colaboradores.length - 5}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Footer: contadores (solo visual) + Ver más */}
        <View style={s.footerRow}>
          <View style={s.votesGroup}>
            <View style={s.votePill}>
              <Image source={likeIcon} style={s.voteIcon} />
              <Text style={s.voteText}>{item._likes}</Text>
            </View>
            <View style={{ width: 10 }} />
            <View style={[s.votePill, s.votePillDown]}>
              <Image source={dislikeIcon} style={s.voteIcon} />
              <Text style={s.voteText}>{item._dislikes}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={s.readMoreBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('DetallePublicacion', { publicacion: item })}
          >
            <Text style={s.readMoreText}>Ver más</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      {/* Header */}
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

      {/* Lista ranking */}
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
        initialNumToRender={8}
      />
    </View>
  );
}
