import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminPublicationDetallScreen.styles';
import  {aprobarPublicacion, rechazarPublicacion, eliminarPublicacion, obtenerDetallePublicacion } from '../services/AdminPublicacionesService';

// Íconos like/dislike (mismos que Home)
const likeIcon = require('../assets/IconoLike.png');
const likeIconActive = require('../assets/Icono_LikeActivo.png');
const dislikeIcon = require('../assets/IconoDislike.png');
const dislikeIconActive = require('../assets/Icono_DislikeActivo.png');

export default function AdminPublicationDetallScreen({ route, navigation }) {
  const { pubId } = route.params || {};

  // ===== MOCK PUBLICACIÓN ( se ajusta al fetch real) =====
  const [pub, setPub] = React.useState({
    id: pubId ?? 'p0',
    title:
      'Guía de onboarding para estudiantes de Ingeniería de Sistemas — primeros pasos, recursos y buenas prácticas',
    author: 'María López',
    authorId: 'u1',
    state: 'publicada', // publicada | rechazada
    body:
      'Contenido de ejemplo… Bienvenida/o a NovaHub. Aquí encontrarás recursos, normas y buenas prácticas para publicar. ' +
      'Recuerda incluir fuentes y dar crédito a tus colaboradores. Esta guía resume los pasos clave para empezar.',
    createdAt: '2025-09-30',
    category: 'Ingeniería de Sistemas',
    area: 'Programación I',
    tags: ['onboarding', 'primeros pasos'],
    reports: 3,
    previewUri: null,
    likes: 23,
    dislikes: 4,
    comments: 6,
    equipo_colaborador: 'Ana, Jorge, Leo, Daniela',
  });

  const [history, setHistory] = React.useState([
    { id: 'h1', action: 'Creada', by: 'María López', at: '2025-09-30 10:22' },
    { id: 'h2', action: 'Publicada', by: 'Sistema', at: '2025-09-30 10:23' },
  ]);
  React.useEffect(() => {
    async function fetchData() {
      const data = await obtenerDetallePublicacion(pubId);
      console.log('Detalles de publicación obtenidos:', data);
      setPub(data);
    }
    console.log('Obteniendo detalles de publicación para ID:', pubId);
    fetchData();
  }, []);

  const [myVote, setMyVote] = React.useState(0);
  const [likeCount, setLikeCount] = React.useState(pub.likes || 0);
  const [dislikeCount, setDislikeCount] = React.useState(pub.dislikes || 0);

  const authorInitials = React.useMemo(
    () => pub.author.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
    [pub.author]
  );

  const badge = React.useMemo(() => {
    return pub.state === 'publicada'
      ? { wrap: s.badgeGreen, text: s.badgeTextDark, icon: 'checkmark-circle', iconColor: '#065F46' }
      : { wrap: s.badgeRed, text: s.badgeTextDanger, icon: 'eye-off', iconColor: '#991B1B' };
  }, [pub.state]);

  const pushHistory = (action, by = 'Admin') => {
    setHistory(h => [
      { id: `h${h.length + 1}`, action, by, at: new Date().toISOString().slice(0, 16).replace('T', ' ') },
      ...h,
    ]);
  };

  // ===== Acciones =====
  const republish = async () => {
    if (pub.state === 'publicada') return;
    if (await aprobarPublicacion(pub.id)) {
      setPub(p => ({ ...p, state: 'publicada' }));
      pushHistory('Re-publicada');
      Alert.alert('Listo', 'La publicación ha sido re-publicada.');
    }
  };

  const hide = async () => {
    if (pub.state === 'rechazada') return;
    if (await rechazarPublicacion(pub.id)) {
      setPub(p => ({ ...p, state: 'rechazada' }));
      pushHistory('Ocultada (rechazada)');
      Alert.alert('Oculta', 'La publicación fue ocultada al público.');
    }
  };

  const remove = async () => {
    Alert.alert(
      'Borrar publicación',
      '¿Seguro que deseas borrar esta publicación? Esta acción es definitiva.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            if (await eliminarPublicacion(pub.id)) {
              pushHistory('Borrada definitivamente');
              Alert.alert('Eliminada', 'La publicación fue eliminada.');
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  const colaboradores = React.useMemo(
    () => (pub.equipo_colaborador || '').split(',').map(s => s.trim()).filter(Boolean),
    [pub.equipo_colaborador]
  );

  // ===== Votos (mock visual) =====
  const onLike = () => {
    setMyVote(prev => {
      if (prev === 1) { setLikeCount(c => Math.max(0, c - 1)); return 0; }
      if (prev === -1) { setDislikeCount(c => Math.max(0, c - 1)); setLikeCount(c => c + 1); return 1; }
      setLikeCount(c => c + 1); return 1;
    });
  };
  const onDislike = () => {
    setMyVote(prev => {
      if (prev === -1) { setDislikeCount(c => Math.max(0, c - 1)); return 0; }
      if (prev === 1) { setLikeCount(c => Math.max(0, c - 1)); setDislikeCount(c => c + 1); return -1; }
      setDislikeCount(c => c + 1); return -1;
    });
  };

  return (
    <SafeAreaView style={s.screen}>
      {/* ===== HEADER ===== */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        {/* Fila superior: título a la izquierda, SOLO estado a la derecha */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 14 }}>
          <Text style={s.headerTitle}>Publicación</Text>
          <View style={[s.badge, badge.wrap]}>
            <Ionicons name={badge.icon} size={14} color={badge.iconColor} style={{ marginRight: 4 }} />
            <Text style={badge.text}>{pub.state}</Text>
          </View>
        </View>

        {/* Fila inferior: ID debajo, alineado a la izquierda */}
        <View style={[s.headerContent, { paddingTop: 4 }]}>
          <Text style={s.headerSub}>#{pub.id}</Text>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* ===== Meta (reportes) ===== */}
        <View style={s.metaCard}>
          <View style={s.statusRow}>
            <View style={s.reportPill}>
              <Ionicons name="flag" size={12} color="#92400E" />
              <Text style={s.reportPillText}>{pub.reports} reporte{pub.reports === 1 ? '' : 's'}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Pressable style={s.btnInline} onPress={() => navigation.navigate('AdminReports', { pubId: pub.id })}>
              <Ionicons name="open-outline" size={16} color="#64748B" />
              <Text style={s.btnInlineText}>Ver reportes</Text>
            </Pressable>
          </View>
        </View>

        {/* ===== Vista previa ===== */}
        <View style={s.postCard}>
          {/* Encabezado de la publicación */}
          <View style={s.postHeaderRow}>
            <View style={s.postAvatar}>
              <Text style={s.postAvatarText}>{authorInitials}</Text>
            </View>
            <View style={s.postHeaderTextWrap}>
              {/* Título completo sin truncar */}
              <Text style={s.postTitle}>{pub.title}</Text>
              <Text style={s.postMeta} numberOfLines={1}>por {pub.author} · {pub.createdAt}</Text>
            </View>
          </View>

          {!!pub.previewUri && <Image source={{ uri: pub.previewUri }} style={s.postImage} />}

          {/* Chips categoría / área */}
          <View style={s.postChipsRow}>
            {!!pub.category && (
              <View style={s.postChip}>
                <Ionicons name="school-outline" size={12} color="#3730A3" />
                <Text style={s.postChipText}>{pub.category}</Text>
              </View>
            )}
            {!!pub.area && (
              <View style={s.postChip}>
                <Ionicons name="grid-outline" size={12} color="#3730A3" />
                <Text style={s.postChipText}>{pub.area}</Text>
              </View>
            )}
            {!!pub.tags?.length &&
              pub.tags.map(t => (
                <View key={t} style={s.postChip}>
                  <Ionicons name="pricetag-outline" size={12} color="#3730A3" />
                  <Text style={s.postChipText}>{t}</Text>
                </View>
              ))}
          </View>

          <Text style={s.postExcerpt} numberOfLines={4}>{pub.body}</Text>

          {/* Colaboradores */}
          {colaboradores.length > 0 && (
            <View style={s.collabBlock}>
              <Text style={s.collabLabel}>Colaboradores</Text>
              <View style={s.collabRow}>
                {colaboradores.slice(0, 5).map((name, idx2) => (
                  <View key={`${name}-${idx2}`} style={s.collabPill}>
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

          {/* Votos + ver original */}
          <View style={s.postFooterRow}>
            <View style={s.voteRow}>
              <TouchableOpacity
                style={[s.voteBtn, myVote === 1 && s.voteBtnActive]}
                activeOpacity={0.85}
                onPress={onLike}
              >
                <Image source={myVote === 1 ? likeIconActive : likeIcon} style={s.voteImage} resizeMode="contain" />
                <Text style={s.voteCount}>{likeCount}</Text>
              </TouchableOpacity>

              <View style={{ width: 12 }} />

              <TouchableOpacity
                style={[s.voteBtn, myVote === -1 && s.voteBtnActiveDown]}
                activeOpacity={0.85}
                onPress={onDislike}
              >
                <Image source={myVote === -1 ? dislikeIconActive : dislikeIcon} style={s.voteImage} resizeMode="contain" />
                <Text style={s.voteCount}>{dislikeCount}</Text>
              </TouchableOpacity>
            </View>

            <Pressable style={s.btnInline} onPress={() => navigation.navigate('DetallePublicacion', { id: pub.id })}>
              <Ionicons name="open-outline" size={16} color="#64748B" />
              <Text style={s.btnInlineText}>Ver publicación original</Text>
            </Pressable>
          </View>
        </View>

        {/* ===== Contenido completo ===== */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Contenido</Text>
          <Text style={s.bodyText}>{pub.body}</Text>
        </View>

        {/* ===== Acciones de administración ===== */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Acciones</Text>

          <View style={s.actionsRow}>
            {pub.state === 'publicada' ? (
              <Pressable style={[s.btn, s.btnDanger]} onPress={hide}>
                <Ionicons name="eye-off" size={16} color="#FFFFFF" />
                <Text style={s.btnDangerText}>Ocultar (rechazar)</Text>
              </Pressable>
            ) : (
              <Pressable style={[s.btn, s.btnPrimary]} onPress={republish}>
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text style={s.btnPrimaryText}>Re-publicar</Text>
              </Pressable>
            )}

            <Pressable style={[s.btn, s.btnGhost]} onPress={remove}>
              <Ionicons name="trash" size={16} color="#B91C1C" />
              <Text style={s.btnGhostTextDanger}>Borrar</Text>
            </Pressable>
          </View>

          <View style={s.secondaryRow}>
            <Pressable style={[s.chip, s.chipSoft]} onPress={() => navigation.navigate('AdminReports', { pubId: pub.id })}>
              <Ionicons name="alert-circle" size={14} color="#92400E" />
              <Text style={s.chipSoftText}>Ver reportes</Text>
            </Pressable>
            <Pressable style={s.chip} onPress={() => navigation.navigate('AdminUserDetall', { userId: pub.authorId })}>
              <Ionicons name="person" size={14} color="#334155" />
              <Text style={s.chipText}>Ver autor</Text>
            </Pressable>
          </View>
        </View>

        {/* ===== Historial ===== */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Historial</Text>
          {history.map((h, idx) => (
            <View key={h.id} style={[s.rowItem, idx !== 0 && s.rowItemBorder]}>
              <View style={s.rowLeft}>
                <View style={s.iconWrap}>
                  <Ionicons name="time" size={14} color="#3730A3" />
                </View>
                <Text style={s.rowTitle}>{h.action}</Text>
              </View>
              <Text style={s.rowMeta}>{h.by} · {h.at}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
