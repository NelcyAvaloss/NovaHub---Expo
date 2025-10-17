// screens/DetallePublicacionScreen.js
import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import { WebView } from 'react-native-webview';
import * as IntentLauncher from 'expo-intent-launcher';

import styles, { reportModalStyles as rstyles } from './DetallePublicacion.styles';
import { supabase } from './supabase';

// 🔔 servicio de reportes
import {
  crearReporte,
  REPORT_REASONS,
  misReportesParaTargets,
} from '../services/reportpubli.service';

export default function DetallePublicacionScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  const publicacion = route?.params?.publicacion || {};
  const {
    id,
    portadaUri,
    pdfUri,
    titulo,
    autor,
    descripcion,
    categoria,
    area,
    equipo_colaborador,
  } = publicacion;

  const [mostrarDoc, setMostrarDoc] = useState(false);
  const [pdfFailed, setPdfFailed] = useState(false);
  const [falloWebViewLocal, setFalloWebViewLocal] = useState(false);

  // 💬 Comentarios locales
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Responder a un comentario (primer nivel)
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const replyInputRef = useRef(null);

  // Responder a una respuesta (segundo nivel)
  const [replyToChild, setReplyToChild] = useState(null); // { commentId, replyId }
  const [childReplyText, setChildReplyText] = useState('');
  const childReplyInputRef = useRef(null);

  const [usuarioActual, setUsuarioActual] = useState(null);

  // 👀 IDs reportados por mí (para desactivar botón y mostrar badge)
  const [reportedMap, setReportedMap] = useState({
    comment: {},
    reply: {},
    subreply: {},
  });

  // Altura dinámica del teclado
  const [kbPadding, setKbPadding] = useState(0);
  useEffect(() => {
    const onShow = Keyboard.addListener('keyboardDidShow', e =>
      setKbPadding(e.endCoordinates?.height ?? 0)
    );
    const onHide = Keyboard.addListener('keyboardDidHide', () => setKbPadding(0));

    obtenerComentarios();

    // Realtime: Comentarios
    const comentarioSub = supabase
      .channel('Comentarios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Comentarios' }, () => {
        obtenerComentarios();
      })
      .subscribe();

    // Realtime: Respuestas
    const respuestaSub = supabase
      .channel('Respuestas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Respuestas' }, () => {
        obtenerComentarios();
      })
      .subscribe();

    // Realtime: Sub_Respuestas
    const subRespuestaSub = supabase
      .channel('Sub_Respuestas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Sub_Respuestas' }, () => {
        obtenerComentarios();
      })
      .subscribe();

    return () => {
      onShow.remove();
      onHide.remove();
      supabase.removeChannel(comentarioSub);
      supabase.removeChannel(respuestaSub);
      supabase.removeChannel(subRespuestaSub);
    };
  }, []);

  const isRemote = useMemo(() => /^https?:\/\//i.test(pdfUri || ''), [pdfUri]);
  const isPDF = useMemo(() => (pdfUri || '').toLowerCase().endsWith('.pdf'), [pdfUri]);
  const colaboradores = useMemo(() => (equipo_colaborador || '')
    .split(',').map(s => s.trim()).filter(Boolean), [equipo_colaborador]);

  const webSource = useMemo(() => {
    if (!pdfUri) return null;
    if (isPDF && isRemote) {
      const viewer = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(pdfUri)}`;
      return { uri: viewer };
    }
    if (!isPDF) return { uri: pdfUri };
    return null;
  }, [pdfUri, isPDF, isRemote]);

  const abrirConVisorDelSistema = useCallback(async () => {
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: pdfUri,
        flags: 1,
        type: 'application/pdf',
      });
    } catch {
      Alert.alert('No se pudo abrir el documento', 'Instala un visor de PDF o inténtalo de nuevo.');
    }
  }, [pdfUri]);

  // ===== Helpers de usuario =====
  const obtenerUsuarioActual = async () => {
    const { data } = await supabase.auth.getUser();
    return { id: data?.user?.id, nombre: data?.user?.user_metadata?.full_name };
  };

  // ===== Fetch Comentarios + mapa de reportados =====
  const obtenerComentarios = async () => {
    try {
      const { data, error } = await supabase
        .from('Comentarios')
        .select(`
          id,
          contenido,
          created_at,
          usuario:usuarios ( nombre, id ),
          respuestas:Respuestas (
            id,
            contenido,
            created_at,
            usuario:usuarios ( nombre, id ),
            sub_respuestas:Sub_Respuestas (
              id,
              contenido,
              created_at,
              usuario:usuarios ( nombre, id)
            )
          )
        `)
        .eq('id_publicacion', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const usuario = await obtenerUsuarioActual();
      setUsuarioActual(usuario);

      // Transformar para UI
      const comentariosFormateados = (data || []).map(c => ({
        id: c.id,
        text: c.contenido,
        date: c.created_at,
        author: c.usuario.id === usuario.id ? 'Tú' : c.usuario.nombre,
        replies: (c.respuestas || []).map(r => ({
          id: r.id,
          text: r.contenido,
          date: r.created_at,
          author: r.usuario.id === usuario.id ? 'Tú' : r.usuario.nombre,
          childReplies: (r.sub_respuestas || []).map(sr => ({
            id: sr.id,
            text: sr.contenido,
            date: sr.created_at,
            author: sr.usuario.id === usuario.id ? 'Tú' : sr.usuario.nombre,
          })),
        })),
      }));

      setComments(comentariosFormateados);

      // ====== cargar "ya reportados por mí" para mostrar badge/deshabilitar
      const commentIds = comentariosFormateados.map(c => c.id);
      const replyIds = comentariosFormateados.flatMap(c => c.replies?.map(r => r.id) || []);
      const subreplyIds = comentariosFormateados.flatMap(c =>
        c.replies?.flatMap(r => r.childReplies?.map(cr => cr.id) || []) || []
      );

      const sets = await misReportesParaTargets({ commentIds, replyIds, subreplyIds });
      setReportedMap({
        comment: setToObj(sets.comment),
        reply: setToObj(sets.reply),
        subreply: setToObj(sets.subreply),
      });
    } catch (e) {
      console.error('Error al obtener comentarios:', e);
    }
  };

  const setToObj = (set) => {
    const obj = {};
    if (!set || typeof set.forEach !== 'function') return obj;
    set.forEach(v => { obj[String(v)] = true; });
    return obj;
  };

  // ===== Crear comentario
  const handleAddComment = useCallback(async () => {
    const text = newComment.trim();
    if (!text) return;
    try {
      const usuario = await obtenerUsuarioActual();
      if (!usuario?.id) {
        Alert.alert('Inicia sesión', 'Debes iniciar sesión para comentar.');
        return;
      }
      const { data, error } = await supabase.from('Comentarios').insert([{
        id_publicacion: id,
        id_usuario: usuario.id,
        contenido: text,
      }]).select(`id, contenido, created_at, usuario:usuarios ( nombre )`);
      if (error) throw error;

      const nuevo = {
        id: data[0].id,
        text: data[0].contenido,
        date: data[0].created_at,
        author: data[0].usuario?.nombre || 'Tú',
        replies: [],
      };
      setComments(prev => [nuevo, ...prev]);
      setNewComment('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el comentario.');
      console.error('Error al agregar comentario:', error);
    }
  }, [newComment, id]);

  // ===== Responder (primer nivel)
  const startReply = useCallback((commentId) => {
    setReplyTo(commentId);
    setReplyText('');
    setReplyToChild(null);
    setChildReplyText('');
    setTimeout(() => {
      replyInputRef.current?.focus();
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  const handleSendReply = useCallback(async () => {
    const text = replyText.trim();
    if (!text || !replyTo) return;
    try {
      const usuario = await obtenerUsuarioActual();
      if (!usuario?.id) {
        Alert.alert('Inicia sesión', 'Debes iniciar sesión para responder.');
        return;
      }
      const { data, error } = await supabase.from('Respuestas').insert([{
        id_comentario: replyTo,
        id_usuario: usuario.id,
        contenido: text,
      }]).select(`id, contenido, created_at, usuario:usuarios ( nombre )`);
      if (error) throw error;

      setComments(prev =>
        prev.map(c =>
          c.id === replyTo
            ? {
                ...c,
                replies: [
                  ...c.replies,
                  {
                    id: data[0].id,
                    text: data[0].contenido,
                    date: data[0].created_at,
                    author: data[0].usuario?.nombre || 'Tú',
                    childReplies: [],
                  },
                ],
              }
            : c
        )
      );
      setReplyText('');
      setReplyTo(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la respuesta.');
      console.error('Error al agregar respuesta:', error);
    }
  }, [replyText, replyTo]);

  // ===== Responder a respuesta (segundo nivel)
  const startReplyToReply = useCallback((commentId, replyId) => {
    setReplyTo(null);
    setReplyText('');
    setReplyToChild({ commentId, replyId });
    setChildReplyText('');
    setTimeout(() => {
      childReplyInputRef.current?.focus();
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  const handleSendChildReply = useCallback(async () => {
    const text = childReplyText.trim();
    if (!text || !replyToChild) return;
    try {
      const usuario = await obtenerUsuarioActual();
      if (!usuario?.id) {
        Alert.alert('Inicia sesión', 'Debes iniciar sesión para responder.');
        return;
      }
      const { data, error } = await supabase.from('Sub_Respuestas').insert([{
        id_respuesta: replyToChild.replyId,
        id_usuario: usuario.id,
        contenido: text,
      }]).select(`id, contenido, created_at, usuario:usuarios ( nombre )`);
      if (error) throw error;

      setComments(prev =>
        prev.map(c => {
          if (c.id !== replyToChild.commentId) return c;
          return {
            ...c,
            replies: c.replies.map(r =>
              r.id === replyToChild.replyId
                ? {
                    ...r,
                    childReplies: [
                      ...(r.childReplies || []),
                      {
                        id: data[0].id,
                        author: data[0].usuario?.nombre || 'Tú',
                        text: data[0].contenido,
                        date: data[0].created_at,
                      },
                    ],
                  }
                : r
            ),
          };
        })
      );
      setChildReplyText('');
      setReplyToChild(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la respuesta.');
      console.error('Error al agregar respuesta a la respuesta:', error);
    }
  }, [childReplyText, replyToChild]);

  // ==========================
  //      Reportes (UI)
  // ==========================
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportNote, setReportNote] = useState('');
  const [sendingReport, setSendingReport] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); // { type: 'comment'|'reply'|'subreply', id: string }

  const openReport = (type, targetId) => {
    setReportTarget({ type, id: String(targetId) });
    setReportReason(REPORT_REASONS[0]);
    setReportNote('');
    setReportOpen(true);
  };

  const submitReport = async () => {
    if (!reportTarget) return;
    try {
      if (sendingReport) return;
      setSendingReport(true);

      const res = await crearReporte({
        target: reportTarget.type,
        targetId: reportTarget.id,
        postId: id,
        reason: reportReason,
        details: reportNote,
      });

      if (!res.ok) {
        if (res.code === 'ALREADY_REPORTED') {
          Alert.alert('Ya reportaste', 'Ya enviaste un reporte de este contenido.');
        } else if (res.code === 'RATE_LIMIT') {
          Alert.alert('Muy rápido', 'Estás reportando muy seguido. Intenta en 1 minuto.');
        } else if (res.code === 'NO_AUTH') {
          Alert.alert('Inicia sesión', 'Necesitas iniciar sesión para reportar.');
        } else {
          Alert.alert('Error', res.error || 'No se pudo enviar el reporte.');
        }
        return;
      }

      // Actualiza badge local
      setReportedMap(prev => {
        const out = { ...prev };
        out[reportTarget.type] = { ...out[reportTarget.type], [reportTarget.id]: true };
        return out;
      });

      setReportOpen(false);
      setReportTarget(null);
      setReportReason(REPORT_REASONS[0]);
      setReportNote('');
      Alert.alert('Gracias', 'Tu reporte fue enviado.');
    } catch (e) {
      Alert.alert('Error', 'No se pudo enviar el reporte.');
    } finally {
      setSendingReport(false);
    }
  };

  // ==========================
  //        RENDER
  // ==========================
  if (!publicacion) {
    return (
      <View style={[styles.flex, styles.center, { backgroundColor: '#0c111b' }]}>
        <Text style={styles.errorText}>Publicación no encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: '#0c111b' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
    >
      <View style={styles.wrapper}>
        {/* Volver */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>

        {!mostrarDoc ? (
          <ScrollView
            ref={scrollRef}
            style={{ backgroundColor: '#0c111b' }}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom, 16) + kbPadding + 16 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            overScrollMode="never"
          >
            {/* Portada */}
            {!!portadaUri && (
              <Image source={{ uri: portadaUri }} style={styles.portada} resizeMode="cover" />
            )}

            {/* Info */}
            {!!titulo && <Text style={styles.titulo}>{titulo}</Text>}
            {!!autor && <Text style={styles.autor}>por {autor}</Text>}

            <View style={styles.chipsRow}>
              {!!categoria && <Text style={styles.chip}>#{categoria}</Text>}
              {!!area && <Text style={styles.chip}>#{area}</Text>}
            </View>

            {/* Colaboradores */}
            {colaboradores.length > 0 && (
              <View style={styles.collabBlock}>
                <Text style={styles.collabLabel}>Colaboradores</Text>
                <View style={styles.collabRow}>
                  {colaboradores.slice(0, 8).map((name, idx) => (
                    <View key={`${name}-${idx}`} style={styles.collabPill}>
                      <Text style={styles.collabPillText}>{name}</Text>
                    </View>
                  ))}
                  {colaboradores.length > 8 && (
                    <View style={styles.collabPillMuted}>
                      <Text style={styles.collabPillMutedText}>+{colaboradores.length - 8}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {!!descripcion && <Text style={styles.descripcion}>{descripcion}</Text>}

            {/* Ver documento */}
            {!!pdfUri && (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => { setPdfFailed(false); setFalloWebViewLocal(false); setMostrarDoc(true); }}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Ver documento</Text>
              </TouchableOpacity>
            )}

            {/* ====================== */}
            {/*     COMENTARIOS        */}
            {/* ====================== */}
            <View style={styles.commentSection}>
              <Text style={styles.commentTitle}>Comentarios ({comments.length})</Text>

              {/* Nuevo comentario */}
              <View style={styles.commentInputRow}>
                <View style={styles.commentAvatar}><Text style={styles.commentAvatarTxt}>T</Text></View>
                <TextInput
                  style={styles.commentTextInput}
                  placeholder="Escribe un comentario…"
                  placeholderTextColor="#93a4bf"
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                  onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
                />
                <TouchableOpacity
                  style={[styles.commentSendBtn, !newComment.trim() && styles.commentSendBtnDisabled]}
                  onPress={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Text style={styles.commentSendBtnTxt}>Publicar</Text>
                </TouchableOpacity>
              </View>

              {/* Lista de comentarios */}
              {comments.map((c) => (
                <View key={c.id} style={styles.commentItem}>
                  <View style={styles.commentHeaderRow}>
                    <View style={styles.commentAvatarSm}>
                      <Text style={styles.commentAvatarTxt}>{(c.author?.[0] || 'U').toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.commentMetaRow}>
                        <Text style={styles.commentAuthor}>{c.author || 'Usuario'}</Text>
                        <Text style={styles.commentDate}>• {new Date(c.date).toLocaleDateString()}</Text>
                        {reportedMap.comment[String(c.id)] && (
                          <View style={styles.reportedChip}>
                            <Text style={styles.reportedChipText}>Reportado</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.commentBubble}>
                        <Text style={styles.commentBody}>{c.text}</Text>
                      </View>

                      <View style={styles.commentActionsRow}>
                        <TouchableOpacity onPress={() => startReply(c.id)} activeOpacity={0.7}>
                          <Text style={styles.replyBtnText}>Responder</Text>
                        </TouchableOpacity>

                        <View style={{ width: 16 }} />

                        <TouchableOpacity
                          onPress={() => openReport('comment', c.id)}
                          activeOpacity={reportedMap.comment[String(c.id)] ? 1 : 0.7}
                          disabled={!!reportedMap.comment[String(c.id)]}
                        >
                          <Text style={[styles.reportBtnText, reportedMap.comment[String(c.id)] && { opacity: 0.6 }]}>
                            Reportar
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Primer nivel de respuestas */}
                      {!!c.replies?.length && (
                        <View style={styles.replyList}>
                          {c.replies.map((r) => (
                            <View key={r.id} style={styles.replyItem}>
                              <View style={styles.replyAvatar}>
                                <Text style={styles.commentAvatarTxt}>
                                  {(r.author?.[0] || 'U').toUpperCase()}
                                </Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <View style={styles.commentMetaRow}>
                                  <Text style={styles.replyAuthor}>{r.author || 'Usuario'}</Text>
                                  <Text style={styles.commentDate}>• {new Date(r.date).toLocaleDateString()}</Text>
                                  {reportedMap.reply[String(r.id)] && (
                                    <View style={styles.reportedChip}>
                                      <Text style={styles.reportedChipText}>Reportado</Text>
                                    </View>
                                  )}
                                </View>

                                <View style={styles.replyBubble}>
                                  <Text style={styles.commentBody}>{r.text}</Text>
                                </View>

                                {/* Acciones */}
                                <View style={styles.commentActionsRow}>
                                  <TouchableOpacity onPress={() => startReplyToReply(c.id, r.id)} activeOpacity={0.7}>
                                    <Text style={styles.replyBtnText}>Responder</Text>
                                  </TouchableOpacity>

                                  <View style={{ width: 16 }} />

                                  <TouchableOpacity
                                    onPress={() => openReport('reply', r.id)}
                                    activeOpacity={reportedMap.reply[String(r.id)] ? 1 : 0.7}
                                    disabled={!!reportedMap.reply[String(r.id)]}
                                  >
                                    <Text style={[styles.reportBtnText, reportedMap.reply[String(r.id)] && { opacity: 0.6 }]}>
                                      Reportar
                                    </Text>
                                  </TouchableOpacity>
                                </View>

                                {/* Sub-respuestas */}
                                {!!r.childReplies?.length && (
                                  <View style={styles.replyList}>
                                    {r.childReplies.map(cr => (
                                      <View key={cr.id} style={styles.replyItem}>
                                        <View style={styles.replyAvatar}>
                                          <Text style={styles.commentAvatarTxt}>
                                            {(cr.author?.[0] || 'U').toUpperCase()}
                                          </Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                          <View style={styles.commentMetaRow}>
                                            <Text style={styles.replyAuthor}>{cr.author || 'Usuario'}</Text>
                                            <Text style={styles.commentDate}>• {new Date(cr.date).toLocaleDateString()}</Text>
                                            {reportedMap.subreply[String(cr.id)] && (
                                              <View style={styles.reportedChip}>
                                                <Text style={styles.reportedChipText}>Reportado</Text>
                                              </View>
                                            )}
                                          </View>
                                          <View style={styles.replyBubble}>
                                            <Text style={styles.commentBody}>{cr.text}</Text>
                                          </View>

                                          <View style={[styles.commentActionsRow, { marginTop: 4 }]}>
                                            <TouchableOpacity
                                              onPress={() => openReport('subreply', cr.id)}
                                              activeOpacity={reportedMap.subreply[String(cr.id)] ? 1 : 0.7}
                                              disabled={!!reportedMap.subreply[String(cr.id)]}
                                            >
                                              <Text style={[styles.reportBtnText, reportedMap.subreply[String(cr.id)] && { opacity: 0.6 }]}>
                                                Reportar
                                              </Text>
                                            </TouchableOpacity>
                                          </View>
                                        </View>
                                      </View>
                                    ))}
                                  </View>
                                )}

                                {/* Caja de respuesta (segundo nivel) */}
                                {replyToChild &&
                                  replyToChild.commentId === c.id &&
                                  replyToChild.replyId === r.id && (
                                    <View style={styles.replyBox}>
                                      <TextInput
                                        ref={childReplyInputRef}
                                        style={styles.replyTextInput}
                                        placeholder="Escribe una respuesta…"
                                        placeholderTextColor="#93a4bf"
                                        value={childReplyText}
                                        onChangeText={setChildReplyText}
                                        multiline
                                        onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
                                      />
                                      <View style={styles.replyActionsRow}>
                                        <TouchableOpacity
                                          style={[styles.replySendBtn, !childReplyText.trim() && styles.commentSendBtnDisabled]}
                                          onPress={handleSendChildReply}
                                          disabled={!childReplyText.trim()}
                                        >
                                          <Text style={styles.replySendBtnTxt}>Responder</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { setReplyToChild(null); setChildReplyText(''); }}>
                                          <Text style={styles.cancelReplyText}>Cancelar</Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  )}
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Caja de respuesta activa (primer nivel) */}
                      {replyTo === c.id && (
                        <View style={styles.replyBox}>
                          <TextInput
                            ref={replyInputRef}
                            style={styles.replyTextInput}
                            placeholder="Escribe una respuesta…"
                            placeholderTextColor="#93a4bf"
                            value={replyText}
                            onChangeText={setReplyText}
                            multiline
                            onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
                          />
                          <View style={styles.replyActionsRow}>
                            <TouchableOpacity
                              style={[styles.replySendBtn, !replyText.trim() && styles.commentSendBtnDisabled]}
                              onPress={handleSendReply}
                              disabled={!replyText.trim()}
                            >
                              <Text style={styles.replySendBtnTxt}>Responder</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setReplyTo(null); setReplyText(''); }}>
                              <Text style={styles.cancelReplyText}>Cancelar</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.viewerWrap}>
            {/* 1) Visor PDF nativo */}
            {isPDF && !!pdfUri && !pdfFailed && (
              <Pdf
                source={isRemote ? { uri: pdfUri, cache: true } : { uri: pdfUri }}
                trustAllCerts={false}
                onLoadComplete={(pages) => console.log(`PDF cargado: ${pages} páginas`)}
                onError={() => setPdfFailed(true)}
                style={styles.webview}
              />
            )}

            {/* 2) WebView (no-PDF o fallback) */}
            {!!webSource && (!isPDF || pdfFailed) && !falloWebViewLocal && (
              <WebView
                source={webSource}
                originWhitelist={['*']}
                startInLoadingState
                allowsInlineMediaPlayback
                allowingReadAccessToURL={isRemote ? undefined : pdfUri}
                onError={() => setFalloWebViewLocal(true)}
                style={styles.webview}
              />
            )}

            {/* 3) Fallback local → visor del sistema */}
            {isPDF && !isRemote && !!pdfUri && (pdfFailed || falloWebViewLocal) && (
              <View style={[styles.flex, styles.center, styles.fallback]}>
                <Text style={styles.fallbackText}>No se pudo mostrar el PDF local dentro de la app.</Text>
                <TouchableOpacity style={styles.secondaryBtn} onPress={abrirConVisorDelSistema} activeOpacity={0.85}>
                  <Text style={styles.secondaryBtnText}>Abrir con visor del sistema</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeViewerBtn}
              onPress={() => { setMostrarDoc(false); setPdfFailed(false); setFalloWebViewLocal(false); }}
              activeOpacity={0.85}
            >
              <Text style={styles.closeViewerText}>Cerrar documento</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ===== Modal Reporte ===== */}
      {reportOpen && (
        <View style={rstyles.modalBackdrop}>
          <View style={rstyles.modalSheet}>
            <Text style={rstyles.modalTitle}>
              Reportar {reportTarget?.type === 'comment' ? 'comentario' : reportTarget?.type === 'reply' ? 'respuesta' : 'sub-respuesta'}
            </Text>
            <Text style={rstyles.modalSub}>Selecciona un motivo</Text>

            <View style={{ marginTop: 10 }}>
              {REPORT_REASONS.map((key) => (
  <TouchableOpacity
    key={key}
    style={rstyles.radioRow}
    onPress={() => setReportReason(key)}
    activeOpacity={0.8}
  >
    <View style={[rstyles.radioOuter, reportReason === key && rstyles.radioOuterActive]}>
      {reportReason === key && <View style={rstyles.radioInner} />}
    </View>
    <Text style={rstyles.radioLabel}>
      {key === 'spam' ? 'Spam'
        : key === 'agresion' ? 'Agresión'
        : key === 'nsfw' ? 'NSFW (contenido sensible)'
        : key === 'contenido_enganoso' ? 'Contenido engañoso'
        : 'Reporte sin clasificar'}
    </Text>
  </TouchableOpacity>
))}

            </View>

            <TextInput
              value={reportNote}
              onChangeText={setReportNote}
              placeholder="Comentario (opcional)…"
              placeholderTextColor="#94A3B8"
              style={rstyles.modalInput}
              multiline
            />

            <View style={rstyles.modalActions}>
              <TouchableOpacity
                style={rstyles.modalBtnGhost}
                onPress={() => { setReportOpen(false); setReportTarget(null); }}
              >
                <Text style={rstyles.modalBtnGhostText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[rstyles.modalBtnPrimary, (!reportTarget || sendingReport) && { opacity: 0.6 }]}
                onPress={submitReport}
                disabled={!reportTarget || sendingReport}
              >
                <Text style={rstyles.modalBtnPrimaryText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
