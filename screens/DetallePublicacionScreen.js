import React, { useMemo, useState, useCallback, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import * as IntentLauncher from 'expo-intent-launcher';
import styles from './DetallePublicacion.styles';

export default function DetallePublicacionScreen({ route, navigation }) {
  const publicacion = route?.params?.publicacion;
  const [mostrarDoc, setMostrarDoc] = useState(false);
  const [falloWebViewLocal, setFalloWebViewLocal] = useState(false);

  // 💬 Estado de comentarios (local)
  const [comments, setComments] = useState([
    // Ejemplo inicial (puedes borrar este objeto)
    // { id: 1, author: 'Ana', text: '¡Excelente trabajo!', date: new Date().toISOString(), replies: [
    //   { id: '1-1', author: 'Luis', text: 'Totalmente de acuerdo', date: new Date().toISOString() }
    // ] }
  ]);
  const [newComment, setNewComment] = useState('');

  // Responder a un comentario
  const [replyTo, setReplyTo] = useState(null);  // id del comentario al que respondes
  const [replyText, setReplyText] = useState('');
  const replyInputRef = useRef(null);

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

  // WebView source
  const webSource = useMemo(() => {
    if (!pdfUri) return null;
    if (isRemote) {
      if (isPDF) {
        const viewer = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(pdfUri)}`;
        return { uri: viewer };
      }
      return { uri: pdfUri };
    }
    return { uri: pdfUri };
  }, [pdfUri, isRemote, isPDF]);

  const abrirConVisorDelSistema = useCallback(async () => {
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: pdfUri,
        flags: 1,
        type: 'application/pdf',
      });
    } catch (err) {
      Alert.alert('No se pudo abrir el documento', 'Intenta nuevamente o verifica que haya un visor de PDF instalado.');
    }
  }, [pdfUri]);

  // 💬 Agregar comentario
  const handleAddComment = useCallback(() => {
    const text = newComment.trim();
    if (!text) return;
    const nuevo = {
      id: Date.now(),
      author: 'Tú',
      text,
      date: new Date().toISOString(),
      replies: [],
    };
    setComments(prev => [nuevo, ...prev]);
    setNewComment('');
  }, [newComment]);

  // 💬 Iniciar respuesta
  const startReply = useCallback((commentId) => {
    setReplyTo(commentId);
    setReplyText('');
    setTimeout(() => replyInputRef.current?.focus(), 50);
  }, []);

  // 💬 Enviar respuesta
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
                { id: `${c.id}-${Date.now()}`, author: 'Tú', text, date: new Date().toISOString() },
              ],
            }
          : c
      )
    );
    setReplyText('');
    setReplyTo(null);
  }, [replyText, replyTo]);

  if (!publicacion) {
    return (
      <View style={[styles.flex, styles.center]}>
        <Text style={styles.errorText}>Publicación no encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Botón volver */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
        <Text style={styles.backIcon}>↩</Text>
      </TouchableOpacity>

      {!mostrarDoc ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Portada */}
          {!!portadaUri && <Image source={{ uri: portadaUri }} style={styles.portada} resizeMode="cover" />}

          {/* Info */}
          {!!titulo && <Text style={styles.titulo}>{titulo}</Text>}
          {!!autor && <Text style={styles.autor}>por {autor}</Text>}

          <View style={styles.chipsRow}>
            {!!categoria && <Text style={styles.chip}>#{categoria}</Text>}
            {!!area && <Text style={styles.chip}>#{area}</Text>}
          </View>

          {/* 👥 Colaboradores */}
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
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setMostrarDoc(true)} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Ver documento</Text>
            </TouchableOpacity>
          )}

          {/* ====================== */}
          {/* 💬 SECCIÓN COMENTARIOS */}
          {/* ====================== */}
          <View style={styles.commentSection}>
            <Text style={styles.commentTitle}>Comentarios ({comments.length})</Text>

            {/* Input: nuevo comentario */}
            <View style={styles.commentInputRow}>
              <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarTxt}>T</Text>
              </View>
              <TextInput
                style={styles.commentTextInput}
                placeholder="Escribe un comentario…"
                placeholderTextColor="#93a4bf"
                value={newComment}
                onChangeText={setNewComment}
                multiline
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
                      <Text style={styles.commentDate}>
                        • {new Date(c.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.commentBubble}>
                      <Text style={styles.commentBody}>{c.text}</Text>
                    </View>
                    <View style={styles.commentActionsRow}>
                      <TouchableOpacity onPress={() => startReply(c.id)} activeOpacity={0.7}>
                        <Text style={styles.replyBtnText}>Responder</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Respuestas */}
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
                                <Text style={styles.commentDate}>
                                  • {new Date(r.date).toLocaleDateString()}
                                </Text>
                              </View>
                              <View style={styles.replyBubble}>
                                <Text style={styles.commentBody}>{r.text}</Text>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Caja de respuesta activa para este comentario */}
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
          {!!webSource && !falloWebViewLocal && (
            <WebView
              source={webSource}
              originWhitelist={['*']}
              startInLoadingState
              allowsInlineMediaPlayback
              allowingReadAccessToURL={isRemote ? undefined : pdfUri}
              onError={() => { if (!isRemote) setFalloWebViewLocal(true); }}
              style={styles.webview}
            />
          )}

          {!isRemote && (!!pdfUri) && falloWebViewLocal && (
            <View style={[styles.flex, styles.center, styles.fallback]}>
              <Text style={styles.fallbackText}>
                No se pudo mostrar el PDF local dentro de la app en este dispositivo.
              </Text>
              <TouchableOpacity style={styles.secondaryBtn} onPress={abrirConVisorDelSistema} activeOpacity={0.85}>
                <Text style={styles.secondaryBtnText}>Abrir con visor del sistema</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.closeViewerBtn} onPress={() => setMostrarDoc(false)} activeOpacity={0.85}>
            <Text style={styles.closeViewerText}>Cerrar documento</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
