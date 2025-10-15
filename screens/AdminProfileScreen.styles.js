// AdminProfileScreen.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* ====== LAYOUT GENERAL ====== */
  screen: { flex: 1, backgroundColor: '#FFFFFF' },

  /* ====== HEADER  ====== */
  headerBg: {
    width: '100%',
    height: 170,
    justifyContent: 'flex-end',
    position: 'relative', 
  },
  headerBgImage: { resizeMode: 'cover' },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.35)',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 48,
  },
  headerTitle: { color: '#F8FAFC', fontSize: 28, fontWeight: '700', letterSpacing: 0.3 },
  headerSub: { color: '#E2E8F0', fontSize: 13, marginTop: 4 },

  /* Chips de estado */
  chipsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  chipPrimary: { backgroundColor: 'rgba(79,70,229,0.18)', borderWidth: 1, borderColor: 'rgba(79,70,229,0.35)' },
  chipIcon: { marginRight: 2 },
  chipText: { fontSize: 12 },
  chipTextPrimary: { color: '#EEF2FF', fontWeight: '600' },

  /* ====== AVATAR EN LA DERECHA ====== */
  // Colocado sobre el header, pegado a la derecha.
  avatarWrap: {
    position: 'absolute',
    right: 16,
    bottom: 16,          
    width: 92,
    height: 92,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    backgroundColor: '#0F172A',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  
    resizeMode: 'cover',
  },
  avatarEditBtn: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  /* ====== SCROLL / CONTENIDO ====== */
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16, 
    paddingBottom: 24,
  },

  /* ====== CARDS ====== */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },

  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconIndigo: { backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE' },
  iconEmerald: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0' },
  iconSky: { backgroundColor: '#E0F2FE', borderWidth: 1, borderColor: '#BAE6FD' },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(79,70,229,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(79,70,229,0.35)',
  },
  editTxt: { color: '#4F46E5', fontWeight: '700', fontSize: 12 },

  /* Filas estáticas (k/v) */
  rowStatic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  rowTitle: { color: '#334155', fontSize: 13, fontWeight: '600' },
  kvValue: { color: '#0F172A', fontSize: 13, fontWeight: '700' },

  /* Filas presionables */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  rowPressable: { },
  rowLeft: { flex: 1, paddingRight: 12 },
  rowSub: { color: '#64748B', fontSize: 12, marginTop: 2 },

  /* Badges */
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeGreen: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  badgeGray: { backgroundColor: '#E2E8F0', borderColor: '#94A3B8' },
  badgeTextDark: { color: '#065F46', fontWeight: '700', fontSize: 12 },
  badgeTextMuted: { color: '#475569', fontWeight: '700', fontSize: 12 },

  /* Zona de peligro */
  dangerCard: { paddingVertical: 6, marginTop: 6, marginBottom: 8 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnDanger: { backgroundColor: '#EF4444' },
  btnIcon: { marginRight: 6 },
  btnDangerText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14, letterSpacing: 0.3 },

  /* ====== MODAL AVATAR PICKER ====== */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
  },

  gridRow: { justifyContent: 'space-between' },
  gridContent: { paddingVertical: 8, gap: 12 },
  avatarCell: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  avatarOptionImg: { width: '92%', height: '92%', resizeMode: 'contain' },

  modalHint: { color: '#475569', fontSize: 12, marginTop: 4 },
  mono: { fontFamily: 'monospace' },
});
