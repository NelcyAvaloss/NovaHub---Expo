import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminReportCommentDetallScreen.styles';

const initialFrom = (name = '') => (name.trim()[0] || '?').toUpperCase();

export default function AdminCommentReportDetallScreen({ route, navigation }) {
  const incoming = route?.params?.report;

  const fallback = {
    id: 'r6',
    reason: 'Lenguaje ofensivo',
    state: 'abierto',
    targetType: 'comentario',
    targetId: 'c12',
    reporter: 'Luis',
    createdAt: '2025-10-12 14:05',
    category: 'Lenguaje ofensivo',
    comment: {
      id: 'c12',
      authorId: 'u77',
      authorName: 'María López',
      authorUsername: '@marial',
      createdAt: '2025-10-12 12:57',
      text:
        'Este es el texto del comentario reportado. Muestra una vista previa para evaluar y decidir.',
      postId: 'p7',
      postTitle: 'Avances de investigación',
    },
  };

  const [report, setReport] = useState(
    incoming?.targetType === 'comentario' ? incoming : fallback
  );

  const badge = useMemo(() => {
    if (report.state === 'resuelto')
      return { box: s.badgeGreen, text: s.badgeTextDark, icon: 'checkmark-circle' };
    if (report.state === 'pendiente')
      return { box: s.badgeYellow, text: s.badgeTextWarn, icon: 'time' };
    if (report.state === 'sin_resolver')
      return { box: s.badgeBlue, text: s.badgeTextInfo, icon: 'help-circle' };
    return { box: s.badgeBlue, text: s.badgeTextInfo, icon: 'alert-circle' };
  }, [report.state]);

  const toggleResolver = () => {
    setReport(prev => {
      const next =
        prev.state === 'resuelto'
          ? { ...prev, state: 'sin_resolver' }
          : { ...prev, state: 'resuelto' };
      Alert.alert(
        next.state === 'resuelto' ? 'Resuelto' : 'Sin resolver',
        `Reporte ${prev.id} marcado como "${next.state.replace('_',' ')}".`
      );
      return next;
    });
  };

  const verContexto = () => {
    navigation.navigate('AdminHilosSoporte', {
      postId: report.comment?.postId,
      commentId: report.comment?.id,
      from: 'report',
    });
  };

  const eliminarComentario = () => {
    Alert.alert(
      'Eliminar comentario',
      `¿Eliminar el comentario ${report.comment?.id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => Alert.alert('Eliminado', 'Comentario eliminado.') },
      ]
    );
  };

  const bloquearUsuario = () => {
    Alert.alert(
      'Bloquear usuario',
      `¿Bloquear a ${report.comment?.authorName} (${report.comment?.authorUsername})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Bloquear', style: 'destructive', onPress: () => Alert.alert('Bloqueado', 'Usuario bloqueado.') },
      ]
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      {/* Header */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Reporte de comentario</Text>
          <Text style={s.headerSub}>#{report.id}</Text>

          <View style={s.headerChipsRow}>
            <View style={[s.badge, badge.box]}>
              <Ionicons name={badge.icon} size={14} color="#1E293B" />
              <Text style={badge.text}>{report.state.replace('_', ' ')}</Text>
            </View>
            <View style={[s.chip, s.chipPrimary]}>
              <Ionicons name="pricetag" size={14} color="#EEF2FF" style={s.chipIcon} />
              <Text style={s.chipTextPrimary}>{report.category || 'Sin categoría'}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* Info del reporte */}
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>Información del reporte</Text>
            <View style={s.linkRow}>
              <Ionicons name="time" size={14} color="#4F46E5" />
              <Text style={s.linkText}>{report.createdAt}</Text>
            </View>
          </View>

          <View style={s.rowItem}>
            <Text style={s.label}>Objetivo</Text>
            <Text style={s.value}>Comentario · {report.targetId}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Razón</Text>
            <Text style={[s.value, s.valueMultiline]} numberOfLines={3}>{report.reason}</Text>
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>Reportado por</Text>
            <Text style={s.value}>{report.reporter}</Text>
          </View>
        </View>

        {/* Vista previa del comentario */}
        <View style={s.card}>
          <View style={s.cardHeaderRow}>
            <Text style={s.cardTitle}>Vista previa del comentario</Text>
            {!!report.comment?.postTitle && (
              <View style={s.linkRow}>
                <Ionicons name="document-text" size={14} color="#4F46E5" />
                <Text style={s.linkText} numberOfLines={1}>{report.comment.postTitle}</Text>
              </View>
            )}
          </View>

          <View style={s.pubCard}>
            <View style={s.pubHeader}>
              <View style={s.avatar}>
                <Text style={s.avatarLetter}>{initialFrom(report.comment?.authorName)}</Text>
              </View>
              <View style={s.headerText}>
                <Text style={s.autor}>
                  {report.comment?.authorName || 'Usuario'}
                  {!!report.comment?.authorUsername && (
                    <Text style={{ color: '#64748B', fontWeight: '700' }}> {report.comment.authorUsername}</Text>
                  )}
                </Text>
                <Text style={s.fecha}>{report.comment?.createdAt}</Text>
              </View>
            </View>

            <Text style={s.pubTexto} selectable>
              {report.comment?.text}
            </Text>

            <View style={s.tagsRow}>
              <Text style={s.tagChip}>Comentario · {report.comment?.id}</Text>
              {!!report.comment?.postId && <Text style={s.tagChip}>Post · {report.comment.postId}</Text>}
              {!!report.category && <Text style={s.tagChip}>Categoría · {report.category}</Text>}
              <Text style={s.tagChip}>Razón · {report.reason}</Text>
            </View>
          </View>
        </View>

        {/* Acciones */}
        <View style={s.actionsRow}>
          <Pressable style={[s.btn, s.btnGhost]} onPress={verContexto}>
            <Ionicons name="eye" size={16} color="#3730A3" />
            <Text style={s.btnGhostText}>Ver en contexto</Text>
          </Pressable>
          <Pressable style={[s.btn, s.btnGhost]} onPress={bloquearUsuario}>
            <Ionicons name="ban" size={16} color="#3730A3" />
            <Text style={s.btnGhostText}>Bloquear usuario</Text>
          </Pressable>
        </View>

        <View style={s.actionsRow}>
          <Pressable style={[s.btn, s.btnGhost]} onPress={eliminarComentario}>
            <Ionicons name="trash" size={16} color="#3730A3" />
            <Text style={s.btnGhostText}>Eliminar comentario</Text>
          </Pressable>
          <Pressable style={[s.btn, s.btnPrimary]} onPress={toggleResolver}>
            <Ionicons name={report.state === 'resuelto' ? 'help-circle' : 'checkmark-circle'} size={16} color="#FFFFFF" />
            <Text style={s.btnPrimaryText}>
              {report.state === 'resuelto' ? 'Marcar sin resolver' : 'Marcar como resuelto'}
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
