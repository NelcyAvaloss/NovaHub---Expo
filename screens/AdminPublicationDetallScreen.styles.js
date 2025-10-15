import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* Base */
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 16 },

  /* ===== HEADER ===== */
  headerBg: { height: 160, justifyContent: 'flex-end' },
  headerBgImage: { resizeMode: 'cover' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,0.28)' },

  appbar: {
    position: 'absolute',
    top: 42,
    left: 16,
    right: 16,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(248,250,252,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  appbarBtn: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  appbarBrand: { color: '#0F172A', fontWeight: '900', letterSpacing: 0.6 },

  headerContent: { paddingHorizontal: 16, paddingBottom: 14 },
  headerTitle: { color: '#FFFFFF', fontWeight: '900', fontSize: 20, letterSpacing: 0.3 },
  headerMetaRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerId: { color: '#E5E7EB', fontWeight: '700' },

  /* ===== Badges ===== */
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1,
  },
  badgeGreen: { backgroundColor: '#D1FAE5', borderColor: '#A7F3D0' },
  badgeRed:   { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  badgeTextDark: { color: '#065F46', fontWeight: '800', fontSize: 12 },
  badgeTextDanger: { color: '#991B1B', fontWeight: '800', fontSize: 12 },

  /* ===== Meta card (reportes) ===== */
  metaCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16, marginTop: 12,
    padding: 12, borderRadius: 14,
    borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  reportPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FEF3C7', borderColor: '#FDE68A', borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  reportPillText: { color: '#92400E', fontWeight: '800', fontSize: 12 },

  btnInline: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 8 },
  btnInlineText: { color: '#64748B', fontWeight: '800' },

  /* ===== Vista previa (NO modificada en layout) ===== */
  postCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16, marginTop: 12,
    padding: 14, borderRadius: 14,
    borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  postHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  postAvatar: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#C7D2FE',
  },
  postAvatarText: { color: '#3730A3', fontWeight: '900' },
  postHeaderTextWrap: { flex: 1, minWidth: 0 },
  postTitle: { color: '#0F172A', fontWeight: '900' }, // se mantiene como lo tenías
  postMeta: { color: '#64748B', fontSize: 12, marginTop: 2 },

  postImage: { width: '100%', height: 180, borderRadius: 12 },

  postChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  postChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  postChipText: { color: '#3730A3', fontWeight: '800', fontSize: 12 },

  postExcerpt: { color: '#334155', marginTop: 10, lineHeight: 20 },

  collabBlock: { marginTop: 10 },
  collabLabel: { color: '#0F172A', fontWeight: '800', marginBottom: 6 },
  collabRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  collabPill: {
    backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  collabPillText: { color: '#3730A3', fontWeight: '800', fontSize: 12 },
  collabPillMuted: {
    backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  collabPillMutedText: { color: '#475569', fontWeight: '800', fontSize: 12 },

  postFooterRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  /* Votos (igual a Home) */
  voteRow: { flexDirection: 'row', alignItems: 'center' },
  voteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999,
  },
  voteBtnActive: { backgroundColor: '#E0E7FF', borderColor: '#C7D2FE' },
  voteBtnActiveDown: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  voteImage: { width: 18, height: 18 },
  voteCount: { color: '#0F172A', fontWeight: '800' },

  /* Card genérica */
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16, marginTop: 12,
    padding: 14, borderRadius: 14,
    borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { color: '#0F172A', fontWeight: '900', fontSize: 16, marginBottom: 8 },
  bodyText: { color: '#334155', lineHeight: 22 },

  /* Acciones */
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  secondaryRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },

  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1,
  },
  btnPrimary: { backgroundColor: '#4F46E5', borderColor: '#4338CA' },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: '900' },

  btnDanger: { backgroundColor: '#DC2626', borderColor: '#B91C1C' },
  btnDangerText: { color: '#FFFFFF', fontWeight: '900' },

  btnGhost: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  btnGhostTextDanger: { color: '#B91C1C', fontWeight: '900' },

  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  chipSoft: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  chipSoftText: { color: '#92400E', fontWeight: '800', fontSize: 12 },
  chipText: { color: '#334155', fontWeight: '800', fontSize: 12 },

  /* Historial */
  rowItem: { paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowItemBorder: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  iconWrap: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#C7D2FE',
  },
  rowTitle: { color: '#0F172A', fontWeight: '800' },
  rowMeta: { color: '#64748B', fontSize: 12 },
});
