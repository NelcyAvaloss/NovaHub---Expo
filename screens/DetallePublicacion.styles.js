import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },

  wrapper: {
    flex: 1,
    backgroundColor: '#0c111b',
    paddingTop: 48,
    paddingHorizontal: 16,
  },

  // Boton de regresar a home
  backButton: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 35,
    height: 55,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backIcon: { fontSize: 44, lineHeight: 30, color: '#fff' },

  scrollContent: {
    paddingTop: 40,  // deja espacio bajo el back
    paddingBottom: 24,
  },

  portada: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: '#1a2233',
  },

  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EAF2FF',
    marginBottom: 4,
  },

  autor: {
    fontSize: 14,
    color: '#B8C3D9',
    marginBottom: 12,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  chip: {
    backgroundColor: 'rgba(108,165,255,0.18)',
    color: '#6CA5FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    marginRight: 8,
    marginBottom: 8,
  },

  descripcion: {
    color: '#CDD8EE',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },

  /* 👥 Colaboradores */
  collabBlock: {
    marginTop: 4,
    marginBottom: 14,
  },
  collabLabel: {
    color: '#A9B5CC',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  collabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  collabPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginRight: 8,
    marginBottom: 8,
  },
  collabPillText: {
    color: '#EAF2FF',
    fontSize: 12,
    fontWeight: '600',
  },
  collabPillMuted: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginRight: 8,
    marginBottom: 8,
  },
  collabPillMutedText: {
    color: '#B8C3D9',
    fontSize: 12,
    fontWeight: '700',
  },

  primaryBtn: {
    backgroundColor: '#2F80ED',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },

  // Visor
  viewerWrap: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#0c111b',
  },

  // Fallback si WebView local falla
  fallback: {
    paddingHorizontal: 16,
  },
  fallbackText: {
    color: '#CDD8EE',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#444',
    borderRadius: 10,
  },
  secondaryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Cerrar visor
  closeViewerBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1a2233',
  },
  closeViewerText: {
    color: '#EAF2FF',
    fontWeight: '600',
  },

  errorText: {
    color: '#EAF2FF',
    fontSize: 16,
  },

  /* =========================
     💬 Comentarios y respuestas
     ========================= */
  commentSection: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  commentTitle: {
    color: '#EAF2FF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  // input nuevo comentario
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  commentAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#1a2233',
    alignItems: 'center', justifyContent: 'center',
  },
  commentAvatarSm: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#1a2233',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  commentAvatarTxt: { color: '#EAF2FF', fontWeight: '700' },
  commentTextInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#EAF2FF',
    fontSize: 14,
  },
  commentSendBtn: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2F80ED',
  },
  commentSendBtnDisabled: { opacity: 0.5 },
  commentSendBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },

  // item comentario
  commentItem: { marginBottom: 14 },
  commentHeaderRow: { flexDirection: 'row', alignItems: 'flex-start' },
  commentMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  commentAuthor: { color: '#EAF2FF', fontWeight: '700', marginRight: 6, fontSize: 13 },
  commentDate: { color: '#92A0B5', fontSize: 11 },
  commentBubble: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  commentBody: { color: '#CDD8EE', fontSize: 14, lineHeight: 20 },

  commentActionsRow: { flexDirection: 'row', marginTop: 6 },
  replyBtnText: { color: '#6CA5FF', fontSize: 12, fontWeight: '700' },

  // respuestas
  replyList: { marginTop: 8, paddingLeft: 38 },
  replyItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  replyAvatar: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#1a2233',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  replyAuthor: { color: '#EAF2FF', fontWeight: '700', marginRight: 6, fontSize: 13 },
  replyBubble: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  // caja de respuesta
  replyBox: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 10,
  },
  replyTextInput: {
    minHeight: 40, maxHeight: 120,
    paddingHorizontal: 10, paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#EAF2FF',
    fontSize: 14,
  },
  replyActionsRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  replySendBtn: {
    paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 8, backgroundColor: '#2F80ED',
  },
  replySendBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },
  cancelReplyText: { color: '#B8C3D9', fontWeight: '600', fontSize: 12 },
});
