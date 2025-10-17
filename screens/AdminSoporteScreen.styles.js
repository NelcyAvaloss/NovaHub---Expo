import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },

  /* ===== Header ===== */
  headerBg: { width: '100%', height: 150, resizeMode: 'cover' },
  headerBgImage: { opacity: 0.9 },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,11,47,0.45)',
  },
  headerContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#E5E7EB', marginTop: 6, fontSize: 13 },

  headerChipsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  headerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerChipPrimary: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  headerChipIcon: { marginRight: 6 },
  headerChipText: { color: '#1E293B', fontSize: 12, fontWeight: '600' },
  headerChipTextPrimary: { color: '#EEF2FF' },

  /* ===== Selector de apartado ===== */
  apartadoRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  apartadoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  apartadoBtnActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  apartadoText: {
    color: '#1E293B',
    fontWeight: '700',
    fontSize: 12,
  },
  apartadoTextActive: {
    color: '#EEF2FF',
  },

  /* ===== Scroll container ===== */
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },

  /* ===== Section wrapper ===== */
  section: { paddingTop: 4 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, color: '#0F172A', fontWeight: '800' },

  /* ===== Toolbar (search + tabs) ===== */
  toolbarRow: { marginTop: 6 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#0F172A',
    fontSize: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
  },
  tabBtnActive: {
    backgroundColor: '#4F46E5',
  },
  tabBtnText: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#EEF2FF',
  },

  /* ===== Lists / Cards ===== */
  listContent: { paddingVertical: 10 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTarget: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardLeft: { flex: 1 },
  title: { color: '#111827', fontWeight: '800', fontSize: 14 },
  sub: { color: '#64748B', fontSize: 12, marginTop: 2 },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  linkRow: { flexDirection: 'row', alignItems: 'center' },
  linkText: { color: '#4F46E5', fontWeight: '700', fontSize: 13, marginRight: 4 },

  /* Badges estado */
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    gap: 6,
  },
  badgeGreen: { backgroundColor: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.35)' },
  badgeBlue:  { backgroundColor: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.35)' },
  badgeYellow:{ backgroundColor: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.35)' },

  badgeTextDark: { color: '#065F46', fontWeight: '700', fontSize: 12 },
  badgeTextInfo: { color: '#1E3A8A', fontWeight: '700', fontSize: 12 },
  badgeTextWarn: { color: '#92400E', fontWeight: '700', fontSize: 12 },

  /* Prioridad */
  prioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  prioHigh: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' },
  prioMid:  { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FCD34D' },
  prioLow:  { backgroundColor: '#E0F2FE', borderWidth: 1, borderColor: '#93C5FD' },
  prioText: { color: '#111827', fontWeight: '700', fontSize: 12 },

  /* Chats */
  unreadPill: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  previewText: { color: '#475569', fontSize: 12, flex: 1, marginRight: 10 },

  /* Empty */
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  emptyText: { color: '#94A3B8', fontWeight: '600' },
});
