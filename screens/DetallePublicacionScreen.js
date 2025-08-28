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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Pdf from 'react-native-pdf';
import { WebView } from 'react-native-webview';
import * as IntentLauncher from 'expo-intent-launcher';
import styles from './DetallePublicacion.styles';

export default function DetallePublicacionScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  const publicacion = route?.params?.publicacion;

  const [mostrarDoc, setMostrarDoc] = useState(false);
  const [pdfFailed, setPdfFailed] = useState(false);
  const [falloWebViewLocal, setFalloWebViewLocal] = useState(false);

  //  Comentarios (local)
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Responder a un comentario (primer nivel)
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const replyInputRef = useRef(null);

  //  Responder a una respuesta (segundo nivel)
  //    { commentId, replyId } -> apunta a la respuesta a la que queremos responder
  const [replyToChild, setReplyToChild] = useState(null);
  const [childReplyText, setChildReplyText] = useState('');
  const childReplyInputRef = useRef(null);

  //  Altura dinámica del teclado para padding inferior (evita franja blanca)
  const [kbPadding, setKbPadding] = useState(0);
  useEffect(() => {
    const onShow = Keyboard.addListener('keyboardDidShow', e =>
      setKbPadding(e.endCoordinates?.height ?? 0)
    );
    const onHide = Keyboard.addListener('keyboardDidHide', () => setKbPadding(0));
    return () => { onShow.remove(); onHide.remove(); };
  }, []);

  // Campos esperados
  const {
    portadaUri,
    pdfUri,
    titulo,
    autor,
    descripcion,
    categoria,
    area,
    equipo_colaborador,
  } = publicacion || {};

  const isRemote = useMemo(() => /^https?:\/\//i.test(pdfUri || ''), [pdfUri]);
  const isPDF = useMemo(() => (pdfUri || '').toLowerCase().endsWith('.pdf'), [pdfUri]);

  // 👥 Colaboradores
  const colaboradores = useMemo(() => {
    return (equipo_colaborador || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }, [equipo_colaborador]);

  // Fuente para WebView (solo no-PDF o fallback remoto)
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

  //  Agregar comentario
  const handleAddComment = useCallback(() => {
    const text = newComment.trim();
    if (!text) return;
    const nuevo = {
      id: Date.now(),
      author: 'Tú',
      text,
      date: new Date().toISOString(),
      replies: [],          // primer nivel
    };
    setComments(prev => [nuevo, ...prev]);
    setNewComment('');
  }, [newComment]);

  //  Iniciar respuesta (primer nivel)
  const startReply = useCallback((commentId) => {
    setReplyTo(commentId);
    setReplyText('');
    setReplyToChild(null);           // cierra editor de segundo nivel si estaba abierto
    setChildReplyText('');
    setTimeout(() => {
      replyInputRef.current?.focus();
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  //  Enviar respuesta (primer nivel)
  const handleSendReply = useCallback(() => {
    const text = replyText.trim();
    if (!text || !replyTo) return;
    setComments(prev =>
      prev.map(c =>
        c.id === replyTo
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `${c.id}-${Date.now()}`,
                  author: 'Tú',
                  text,
                  date: new Date().toISOString(),
                  childReplies: [],  // segundo nivel
                },
              ],
            }
          : c
      )
    );
    setReplyText('');
    setReplyTo(null);
  }, [replyText, replyTo]);

  //  Iniciar respuesta a una respuesta (segundo nivel)
  const startReplyToReply = useCallback((commentId, replyId) => {
    setReplyTo(null);                 // cierra editor de primer nivel
    setReplyText('');
    setReplyToChild({ commentId, replyId });
    setChildReplyText('');
    setTimeout(() => {
      childReplyInputRef.current?.focus();
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  //  Enviar respuesta a la respuesta (segundo nivel)
  const handleSendChildReply = useCallback(() => {
    const text = childReplyText.trim();
    if (!text || !replyToChild) return;
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
                      id: `${r.id}-${Date.now()}`,
                      author: 'Tú',
                      text,
                      date: new Date().toISOString(),
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
  }, [childReplyText, replyToChild]);

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
            keyboardDismissMode="none"
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
                      </View>

                      <View style={styles.commentBubble}>
                        <Text style={styles.commentBody}>{c.text}</Text>
                      </View>

                      <View style={styles.commentActionsRow}>
                        <TouchableOpacity onPress={() => startReply(c.id)} activeOpacity={0.7}>
                          <Text style={styles.replyBtnText}>Responder</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Primer nivel de respuestas */}
                      {c.replies?.length > 0 && (
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
                                </View>

                                <View style={styles.replyBubble}>
                                  <Text style={styles.commentBody}>{r.text}</Text>
                                </View>

                                {/* Acción: Responder a la respuesta (segundo nivel) */}
                                <View style={styles.commentActionsRow}>
                                  <TouchableOpacity
                                    onPress={() => startReplyToReply(c.id, r.id)}
                                    activeOpacity={0.7}
                                  >
                                    <Text style={styles.replyBtnText}>Responder</Text>
                                  </TouchableOpacity>
                                </View>

                                {/* SEGUNDO NIVEL (childReplies) */}
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
                                          </View>
                                          <View style={styles.replyBubble}>
                                            <Text style={styles.commentBody}>{cr.text}</Text>
                                          </View>
                                          {/* Sin botón "Responder" en el último nivel */}
                                        </View>
                                      </View>
                                    ))}
                                  </View>
                                )}

                                {/* Caja de respuesta para segundo nivel (solo visible cuando aplica) */}
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
    </KeyboardAvoidingView>
  );
}
