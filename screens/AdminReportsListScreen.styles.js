import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },

  /* Header */
  headerBg: { height: 170, position: 'relative', justifyContent: 'flex-end' },
  headerBgImage: { resizeMode: 'cover' }, 
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,6,23,0.35)' },
  headerContent: { paddingHorizontal: 16, paddingBottom: 14 },
  headerTitle: { color: '#EEF2FF', fontSize: 22, fontWeight: '700' },
  headerSub: { color: '#E5E7EB', fontSize: 13, marginTop: 2 },
  headerChipsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  headerChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999, backgroundColor: '#FFFFFF',
    
  },
  headerChipPrimary: { backgroundColor: '#4F46E5' },
  headerChipIcon: { marginRight: 6 },
  headerChipText: { color: '#0F172A', fontSize: 12, fontWeight: '600' },
  headerChipTextPrimary: { color: '#EEF2FF' },

  /* Scroll container */
  scroll: { paddingHorizontal: 16, paddingTop: 14 },

  /* Toolbar */
  toolbarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 10, height: 42,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  searchIcon: { marginRight: 6 },
  input: { flex: 1, color: '#0F172A', fontSize: 14 },
  btn: {
    height: 42, paddingHorizontal: 12, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center',
  },
  btnGhost: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  btnGhostText: { color: '#3730A3', fontWeight: '700', fontSize: 13 },
  iconFilledWrap: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' },

  /* Tabs */
  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tabBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#E5E7EB' },
  tabBtnActive: { backgroundColor: '#4F46E5' },
  tabBtnText: { fontSize: 12, color: '#0F172A', fontWeight: '700' },
  tabBtnTextActive: { color: '#FFFFFF' },

  /* KPI layout: 3 arriba, 2 centrados abajo */
  metricsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 12,
  },
  metricsBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: { fontSize: 12, color: '#64748B' },
  metricValue: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 2 },

  /* Lista */
  listSection: { marginTop: 12, gap: 10 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  cardChanged: { borderColor: '#4F46E5', shadowColor: '#4F46E5', shadowOpacity: 0.18, shadowRadius: 8, elevation: 2 },

  stateBand: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderTopLeftRadius: 14, borderBottomLeftRadius: 14 },
  bandIndigo: { backgroundColor: '#4F46E5' },
  bandPurple: { backgroundColor: '#7C3AED' },

  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconTarget: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cardLeft: { flex: 1 },
  title: { fontSize: 14, color: '#0F172A', fontWeight: '800' },
  sub: { fontSize: 12, color: '#475569', marginTop: 2 },

  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  badgeGreen: { backgroundColor: '#D1FAE5' },
  badgeYellow: { backgroundColor: '#FEF3C7' },
  badgeBlue: { backgroundColor: '#DBEAFE' },

  badgeTextDark: { color: '#065F46', fontSize: 12, fontWeight: '800' },
  badgeTextWarn: { color: '#92400E', fontSize: 12, fontWeight: '800' },
  badgeTextInfo: { color: '#1E3A8A', fontSize: 12, fontWeight: '800' },

  rowBetween: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F1F5F9', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6,
  },
  categoryPillText: { fontSize: 12, color: '#0F172A', fontWeight: '600' },

  chipRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  chipAction: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  chipPrimary: { backgroundColor: '#4F46E5' },
  chipText: { color: '#334155', fontSize: 12, fontWeight: '700' },
  chipTextPrimary: { color: '#EEF2FF', fontSize: 12, fontWeight: '800' },

  emptyBox: {
    marginTop: 12, padding: 20, borderRadius: 14, backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 6,
  },
  emptyText: { fontSize: 13, color: '#64748B' },

  /* Modal base */
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(2,6,23,0.4)', justifyContent: 'center', padding: 16 },
  modalSheet: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  modalClose: { padding: 6 },

  modalSearchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 10, height: 40,
    borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8,
  },
  modalSearchIcon: { marginRight: 6 },
  modalInput: { flex: 1, color: '#0F172A', fontSize: 14 },

  modalList: { paddingVertical: 6 },
  modalItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingHorizontal: 8, borderRadius: 10,
  },
  modalItemActive: { backgroundColor: '#EEF2FF' },
  modalItemText: { fontSize: 14, color: '#0F172A' },
  modalItemTextActive: { color: '#3730A3', fontWeight: '800' },

  modalSection: { marginTop: 8 },
  modalSectionTitle: { fontSize: 13, color: '#475569', marginBottom: 6, fontWeight: '700' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  switchIconWrap: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  switchLabel: { fontSize: 13, color: '#0F172A', fontWeight: '600' },

  rangeRow: { flexDirection: 'row', gap: 8 },
  rangePill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#E5E7EB' },
  rangePillActive: { backgroundColor: '#4F46E5' },
  rangePillText: { fontSize: 12, color: '#0F172A', fontWeight: '700' },
  rangePillTextActive: { color: '#FFFFFF' },

  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 },

  /* Botones principales */
  btnPrimary: { backgroundColor: '#4F46E5' },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
});
