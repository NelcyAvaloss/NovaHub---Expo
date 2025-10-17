// DetallePublicacion.styles.js
import { StyleSheet } from 'react-native';

/** 🎨 Paleta base (oscuro) */
const colors = {
  bg: '#0c111b',
  card: '#1a2233',
  text: '#EAF2FF',
  textMuted: '#B8C3D9',
  textSubtle: '#92A0B5',
  textBody: '#CDD8EE',
  primary: '#2F80ED',
  primarySoft: 'rgba(108,165,255,0.18)',
  primaryText: '#6CA5FF',
  border: 'rgba(255,255,255,0.06)',
  bubble: 'rgba(255,255,255,0.06)',
  bubbleReply: 'rgba(255,255,255,0.05)',
  danger: '#ef4444',
};

export default StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },

  wrapper: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 48,
    paddingHorizontal: 16,
  },

  // ← back
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
    paddingTop: 40, // espacio bajo el back
    paddingBottom: 24,
  },

  portada: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: colors.card,
  },

  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  autor: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 12,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  chip: {
    backgroundColor: colors.primarySoft,
    color: colors.primaryText,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    marginRight: 8,
    marginBottom: 8,
  },

  descripcion: {
    color: colors.textBody,
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
    color: colors.text,
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
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },

  /* Botón primario */
  primaryBtn: {
    backgroundColor: colors.primary,
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

  /* Visor */
  viewerWrap: { flex: 1 },
  webview: { flex: 1, backgroundColor: colors.bg },

  /* Fallback WebView */
  fallback: { paddingHorizontal: 16 },
  fallbackText: {
    color: colors.textBody,
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
  secondaryBtnText: { color: '#fff', fontWeight: '600' },

  /* Cerrar visor */
  closeViewerBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  closeViewerText: { color: colors.text, fontWeight: '600' },

  errorText: { color: colors.text, fontSize: 16 },

  /* =========================
     💬 Comentarios y respuestas
     ========================= */
  commentSection: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  commentTitle: {
    color: colors.text,
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
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
  },
  commentAvatarSm: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  commentAvatarTxt: { color: colors.text, fontWeight: '700' },
  commentTextInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: colors.text,
    fontSize: 14,
  },
  commentSendBtn: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  commentSendBtnDisabled: { opacity: 0.5 },
  commentSendBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },

  // item comentario
  commentItem: { marginBottom: 14 },
  commentHeaderRow: { flexDirection: 'row', alignItems: 'flex-start' },
  commentMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  commentAuthor: { color: colors.text, fontWeight: '700', marginRight: 6, fontSize: 13 },
  commentDate: { color: colors.textSubtle, fontSize: 11 },

  commentBubble: {
    backgroundColor: colors.bubble,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  commentBody: { color: colors.textBody, fontSize: 14, lineHeight: 20 },

  commentActionsRow: { flexDirection: 'row', marginTop: 6 },
  replyBtnText: { color: colors.primaryText, fontSize: 12, fontWeight: '700' },
  reportBtnText: { color: colors.danger, fontSize: 12, fontWeight: '700' },

  // chip “Reportado”
  reportedChip: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  reportedChipText: { color: colors.danger, fontWeight: '700', fontSize: 10 },

  // respuestas
  replyList: { marginTop: 8, paddingLeft: 38 },
  replyItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  replyAvatar: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  replyAuthor: { color: colors.text, fontWeight: '700', marginRight: 6, fontSize: 13 },
  replyBubble: {
    backgroundColor: colors.bubbleReply,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  // caja de respuesta
  replyBox: {
    marginTop: 8,
    backgroundColor: colors.bubbleReply,
    borderRadius: 10,
    padding: 10,
  },
  replyTextInput: {
    minHeight: 40, maxHeight: 120,
    paddingHorizontal: 10, paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: colors.text,
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
    borderRadius: 8, backgroundColor: colors.primary,
  },
  replySendBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },
  cancelReplyText: { color: colors.textMuted, fontWeight: '600', fontSize: 12 },
});

/* =============================
   🧩 Estilos del Modal de Reporte
   ============================= */
export const reportModalStyles = StyleSheet.create({
  modalBackdrop: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modalSheet: {
    width: '88%',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  modalSub: { marginTop: 4, fontSize: 13, color: '#94A3B8' },
  modalInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    color: colors.text,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  modalActions: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  modalBtnGhost: { paddingHorizontal: 14, paddingVertical: 10 },
  modalBtnGhostText: { color: colors.textMuted, fontWeight: '600' },
  modalBtnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  modalBtnPrimaryText: { color: '#fff', fontWeight: '700' },

  // Radios
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  radioOuter: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#475569',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  radioOuterActive: { borderColor: colors.primary },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  radioLabel: { color: colors.text, fontSize: 14 },
});
