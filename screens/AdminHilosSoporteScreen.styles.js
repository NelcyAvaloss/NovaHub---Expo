import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* ===== Header Fondo NovaHub (ajustado) ===== */
  headerBg: { height: 170, position: 'relative', width: '100%' },
  headerBgImage: { resizeMode: 'cover' },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.35)',
  },

  headerTopRow: {
    paddingHorizontal: 16,
    paddingTop: 40,           // sube el bloque superior (marca NovaHub)
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#4F46E5',
  },
  brandText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  rightGhost: { width: 32 },

  headerMain: {
    paddingHorizontal: 16,
    paddingTop: 8,            // acerca el título arriba
    paddingBottom: 40,        // deja espacio para la tarjeta flotante
  },
  headerTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  chipsRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipPrimary: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  chipIcon: { marginRight: 2 },
  chipText: { color: '#1E293B', fontSize: 12, fontWeight: '600' },
  chipTextPrimary: { color: '#EEF2FF' },

  /* ===== Tarjeta flotante del destinatario ===== */
  participantCard: {
    marginHorizontal: 16,
    marginTop: -48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  partAvatar: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  partUserBg: { backgroundColor: '#60A5FA' },
  partModBg: { backgroundColor: '#818CF8' },
  partName: { color: '#0F172A', fontWeight: '800', fontSize: 14 },
  partRole: { color: '#64748B', fontSize: 12, marginTop: 2 },
  partRight: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center', justifyContent: 'center',
  },

  /* ===== Chat list ===== */
  chatList: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    gap: 8,
  },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },

  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarUser: { backgroundColor: '#60A5FA' },
  avatarMod: { backgroundColor: '#818CF8' },
  avatarAdmin: { backgroundColor: '#4F46E5' },

  bubble: {
    maxWidth: '74%',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  bubblePeer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  bubbleAdmin: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  msgText: {
    color: '#0F172A',
    fontSize: 14,
  },
  msgMeta: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 4,
  },

  /* ===== Input bar ===== */
  inputBar: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    maxHeight: 120,
  },

  /* ===== Buttons ===== */
  btn: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
