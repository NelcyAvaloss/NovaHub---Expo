import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminReportPublicDetallScreen.styles';

const likeIcon = require('../assets/IconoLike.png');
const dislikeIcon = require('../assets/IconoDislike.png');

export default function AdminReportDetallScreen({ route, navigation }) {
  const { reportId } = route.params || {};

  const baseReport = {
    id: reportId || 'r1',
    reason: 'Spam',
    state: 'abierto',
    notes: 'El contenido parece promocional repetitivo.',
    targetType: 'publicacion',
    targetId: 'p2',
    reporter: 'Alice',
    createdAt: '2025-10-12 12:33',
  };

  // Estado vivo del reporte
  const [reportState, setReportState] = React.useState(baseReport.state);

  const targetPublication =
    baseReport.targetType === 'publicacion'
      ? {
          id: 'p2',
          titulo: 'Guía rápida para nuevos estudiantes',
          descripcion:
            'Pasos iniciales, recursos clave y consejos de la comunidad para empezar con buen pie.',
          autor: 'María',
          created_at: '2025-10-11',
          portadaUri: null,
          categoria: 'Ingeniería de Sistemas',
          area: 'Programación',
          colaboradores: ['Carlos', 'Ana', 'Luis'],
          likes_count: 23,
          dislikes_count: 2,
        }
      : null;

  const notifyTo =
    baseReport.targetType === 'publicacion'
      ? targetPublication?.autor || 'Autor'
      : `Usuario ${baseReport.targetId}`;

  const [message, setMessage] = React.useState('');
  const [includeLink, setIncludeLink] = React.useState(true);

  // Teclado / scroll
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e) => setKeyboardHeight(e.endCoordinates?.height ?? 0);
    const onHide = () => setKeyboardHeight(0);

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);
    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  const handleFocusEditor = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  };

  const TEMPLATES = [
    'Tu contenido fue revisado por el equipo de moderación.',
    'Detectamos posibles infracciones a las normas de la comunidad.',
    'Gracias por colaborar; hemos tomado acciones sobre el contenido reportado.',
  ];

  const badge = (st) => {
    if (st === 'resuelto')     return { box: s.badgeGreen,  text: s.badgeTextDark,  icon: 'checkmark-circle', color: '#065F46' };
    if (st === 'pendiente')    return { box: s.badgeYellow, text: s.badgeTextWarn,  icon: 'time',             color: '#92400E' };
    if (st === 'sin_resolver') return { box: s.badgeBlue,   text: s.badgeTextInfo,  icon: 'help-circle',      color: '#1E3A8A' };
    return { box: s.badgeBlue, text: s.badgeTextInfo, icon: 'alert-circle', color: '#1E3A8A' }; // abierto u otros
  };

  const b = badge(reportState);

  const goToTarget = () => {
    if (baseReport.targetType === 'publicacion') {
      navigation.navigate('AdminPublicationDetall', { pubId: baseReport.targetId });
    } else {
      navigation.navigate('AdminUserDetall', { userId: baseReport.targetId });
    }
  };

  const onPickTemplate = (t) => {
    setMessage((prev) => (prev ? prev + '\n\n' + t : t));
    handleFocusEditor();
  };

  const sendNotification = () => {
    if (!message.trim()) {
      Alert.alert('Mensaje vacío', 'Escribe un mensaje para enviar la notificación.');
      return;
    }
    const payload = {
      to: notifyTo,
      reportId: baseReport.id,
      body: message.trim(),
      link: includeLink ? `novahub://report/${baseReport.id}` : null,
      createdAt: new Date().toISOString(),
    };
    Alert.alert(
      'Notificación enviada',
      `Se notificó a ${notifyTo}.\n\nResumen:\n- Reporte: #${payload.reportId}\n- Enlace: ${
        payload.link ? 'Sí' : 'No'
      }`
    );
    setMessage('');
  };

  // ---- Toggle resolver <-> sin_resolver; si no es ninguno, pasa a resuelto
  const onToggleResolve = () => {
    setReportState((prev) => {
      if (prev === 'resuelto') {
        Alert.alert('Sin resolver', `El reporte #${baseReport.id} cambió a "sin resolver".`);
        return 'sin_resolver';
      }
      if (prev === 'sin_resolver' || prev === 'abierto' || prev === 'pendiente') {
        Alert.alert('Resuelto', `El reporte #${baseReport.id} fue marcado como resuelto.`);
        return 'resuelto';
      }
      // fallback
      return 'resuelto';
    });
  };

  // Cerrar: volver a la lista
  const onClose = () => {
    navigation.navigate('AdminReports'); //  ruta solicitada
  };

  return (
    <SafeAreaView style={s.screen}>
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Reporte de publicacion</Text>
          <Text style={s.headerSub}>#{baseReport.id}</Text>

          <View style={s.headerChipsRow}>
            <View style={[s.badge, b.box]}>
              <Ionicons name={b.icon} size={14} color={b.color} />
              <Text style={b.text}>{reportState.replace('_', ' ')}</Text>
            </View>
            <View style={[s.chip, s.chipPrimary]}>
              <Ionicons name="calendar-outline" size={14} color="#EEF2FF" style={s.chipIcon} />
              <Text style={[s.chipText, s.chipTextPrimary]}>Últimos 30 días</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[s.scroll, { paddingBottom: 24 + keyboardHeight }]}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {/* Resumen */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Resumen</Text>

            <View style={s.rowItem}>
              <Text style={s.label}>Razón</Text>
              <Text style={s.value}>{baseReport.reason}</Text>
            </View>
            <View style={s.rowItem}>
              <Text style={s.label}>Estado</Text>
              <Text style={s.value}>{reportState.replace('_', ' ')}</Text>
            </View>
            <View style={s.rowItem}>
              <Text style={s.label}>Target</Text>
              <Text style={s.value}>
                {baseReport.targetType === 'publicacion' ? 'Publicación' : 'Usuario'} · {baseReport.targetId}
              </Text>
            </View>
            <View style={s.rowItem}>
              <Text style={s.label}>Reportado por</Text>
              <Text style={s.value}>{baseReport.reporter}</Text>
            </View>
            <View style={s.rowItem}>
              <Text style={s.label}>Fecha</Text>
              <Text style={s.value}>{baseReport.createdAt}</Text>
            </View>

            {!!baseReport.notes && (
              <View style={[s.rowItem, { alignItems: 'flex-start' }]}>
                <Text style={s.label}>Notas</Text>
                <Text style={[s.value, s.valueMultiline]}>{baseReport.notes}</Text>
              </View>
            )}
          </View>

          {/* Vista previa */}
          {targetPublication && (
            <View style={s.card}>
              <View style={s.cardHeaderRow}>
                <Text style={s.cardTitle}>Vista previa de la publicación</Text>
                <Pressable style={s.linkRow} onPress={goToTarget}>
                  <Text style={s.linkText}>Ver original</Text>
                  <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
                </Pressable>
              </View>

              <View style={s.pubCard}>
                <View style={s.pubHeader}>
                  <View style={s.avatar}>
                    <Text style={s.avatarLetter}>
                      {(targetPublication.autor?.[0] || 'N').toUpperCase()}
                    </Text>
                  </View>
                  <View style={s.headerText}>
                    <Text style={s.autor} numberOfLines={1}>
                      {targetPublication.autor}
                    </Text>
                    <Text style={s.fecha}>
                      {targetPublication.created_at
                        ? new Date(targetPublication.created_at).toLocaleDateString()
                        : 'Ahora'}
                    </Text>
                  </View>
                </View>

                {!!targetPublication.titulo && (
                  <Text style={s.pubTitulo} numberOfLines={2}>
                    {targetPublication.titulo}
                  </Text>
                )}
                {!!targetPublication.descripcion && (
                  <Text style={s.pubTexto} numberOfLines={3}>
                    {targetPublication.descripcion}
                  </Text>
                )}

                {!!targetPublication.portadaUri && (
                  <Image source={{ uri: targetPublication.portadaUri }} style={s.pubImagen} />
                )}

                <View style={s.tagsRow}>
                  {!!targetPublication.categoria && (
                    <Text style={s.tagChip}>#{targetPublication.categoria}</Text>
                  )}
                  {!!targetPublication.area && (
                    <Text style={s.tagChip}>#{targetPublication.area}</Text>
                  )}
                </View>

                {Array.isArray(targetPublication.colaboradores) &&
                  targetPublication.colaboradores.length > 0 && (
                    <View style={s.collabBlock}>
                      <Text style={s.collabLabel}>Colaboradores</Text>
                      <View style={s.collabRow}>
                        {targetPublication.colaboradores.slice(0, 5).map((name, idx) => (
                          <View key={`${name}-${idx}`} style={s.collabPill}>
                            <Text style={s.collabPillText}>{name}</Text>
                          </View>
                        ))}
                        {targetPublication.colaboradores.length > 5 && (
                          <View style={s.collabPillMuted}>
                            <Text style={s.collabPillMutedText}>
                              +{targetPublication.colaboradores.length - 5}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                <View style={s.pubFooter}>
                  <View style={s.voteRow}>
                    <View style={[s.voteBtn]}>
                      <Image source={likeIcon} style={s.voteImage} resizeMode="contain" />
                      <Text style={s.voteCount}>{targetPublication.likes_count || 0}</Text>
                    </View>
                    <View style={{ width: 12 }} />
                    <View style={[s.voteBtn]}>
                      <Image source={dislikeIcon} style={s.voteImage} resizeMode="contain" />
                      <Text style={s.voteCount}>{targetPublication.dislikes_count || 0}</Text>
                    </View>
                  </View>

                  <Pressable style={s.verMasBtn} onPress={goToTarget}>
                    <Text style={s.verMasText}>Ver original</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {/* Notificar al usuario */}
          <View style={s.notifyCard}>
            <Text style={s.cardTitle}>Notificar al usuario</Text>

            <View style={s.toRow}>
              <Text style={s.toLabel}>Para</Text>
              <View style={s.toPill}>
                <Ionicons name="person-circle" size={14} color="#3730A3" />
                <Text style={s.toText}>{notifyTo}</Text>
              </View>
            </View>

            <View style={s.templatesRow}>
              {TEMPLATES.map((t) => (
                <Pressable key={t} style={s.templateChip} onPress={() => onPickTemplate(t)}>
                  <Ionicons name="add" size={12} color="#3730A3" />
                  <Text style={s.templateText} numberOfLines={1}>
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Escribe el mensaje para el usuario…"
              placeholderTextColor="#94A3B8"
              multiline
              style={s.notifyInput}
              maxLength={800}
              onFocus={handleFocusEditor}
            />

            <View style={s.countRow}>
         
              <Text style={s.countText}>{message.length}/800</Text>
            </View>

            <Pressable
              style={[s.sendBtn, !message.trim() && s.sendBtnDisabled]}
              onPress={sendNotification}
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={14} color="#FFFFFF" />
              <Text style={s.sendBtnText}>Enviar notificación</Text>
            </Pressable>
          </View>

          {/* Acciones del reporte */}
          <View style={s.actionsRow}>
            <Pressable style={[s.btn, s.btnPrimary]} onPress={onToggleResolve}>
              <Ionicons name={reportState === 'resuelto' ? 'checkmark-circle' : 'help-circle'} size={16} color="#FFFFFF" />
              <Text style={s.btnPrimaryText}>
                {reportState === 'resuelto'
                  ? 'Resuelto'
                  : reportState === 'no resuelto'
                  ? 'Sin resolver'
                  : 'Resolver'}
              </Text>
            </Pressable>

            <Pressable style={[s.btn, s.btnGhost]} onPress={onClose}>
              <Ionicons name="close-circle" size={16} color="#3730A3" />
              <Text style={s.btnGhostText}>Cerrar</Text>
            </Pressable>
          </View>

          <View style={{ height: 8 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
