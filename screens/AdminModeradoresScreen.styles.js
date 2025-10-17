import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },

  /* Header */
  headerBg: { width: '100%', height: 160, justifyContent: 'flex-end' },
  headerBgImage: { resizeMode: 'cover' },
  headerOverlay: {
    ...Platform.select({
      ios: { backgroundColor: 'rgba(0,0,0,0.15)' },
      android: { backgroundColor: 'rgba(0,0,0,0.15)' },
    }),
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: 0.2 },
  headerSub: { color: '#E5E7EB', marginTop: 4 },

  headerChipsRow: { flexDirection: 'row', marginTop: 10 },
  headerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },
  headerChipPrimary: { backgroundColor: '#4F46E5' },
  headerChipIcon: { marginRight: 6 },
  headerChipText: { color: '#1E293B', fontSize: 12, fontWeight: '600' },
  headerChipTextPrimary: { color: '#EEF2FF' },

  /* Search + Filters */
  searchWrap: { paddingHorizontal: 16, marginTop: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 42,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  searchInput: { marginLeft: 8, flex: 1, color: '#0F172A' },
  filtersRow: { flexDirection: 'row', marginTop: 10 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: '#0E0E2C' },
  filterChipText: { color: '#111827', fontSize: 12, fontWeight: '700' },
  filterChipTextActive: { color: '#fff' },

  /* List */
  listContent: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 24 },
  emptyWrap: { alignItems: 'center', marginTop: 24 },
  emptyText: { color: '#6B7280', marginTop: 6 },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    ...Platform.select({ android: { elevation: 2 } }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#0f172a', fontWeight: '800' },
  name: { color: '#0f172a', fontWeight: '800' },
  email: { color: '#6B7280', fontSize: 12 },

  /* Estado */
  estadoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  estadoActivo: { backgroundColor: 'rgba(16,185,129,0.14)' },
  estadoInactivo: { backgroundColor: 'rgba(251,146,60,0.16)' },
  estadoText: { fontSize: 12, fontWeight: '800' },
  estadoTextOk: { color: '#065F46' },
  estadoTextWarn: { color: '#92400E' },
  estadoDot: { width: 8, height: 8, borderRadius: 999, marginRight: 6 },
  dotOk: { backgroundColor: '#10B981' },
  dotWarn: { backgroundColor: '#F59E0B' },

  /* Bio */
  bioText: { color: '#475569', marginTop: 8 },

  /* Info grid */
  infoGrid: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  infoLabel: {
    width: 110,
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  infoValue: { color: '#0F172A', flexShrink: 1 },
  valueOk: { color: '#065F46', fontWeight: '700' },
  valueWarn: { color: '#92400E', fontWeight: '700' },

  /* KPIs */
  metricsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  kpi: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  kpiValue: { color: '#0F172A', fontSize: 16, fontWeight: '800' },
  kpiLabel: { color: '#64748B', fontSize: 11, marginTop: 2, fontWeight: '700' },
  kpiIndigo: {},
  kpiAmber: {},
  kpiEmerald: {},
  kpiSky: {},

  /* Acciones */
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },

  /* Botones */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  btnIcon: { marginRight: 6 },
  btnPrimary: { backgroundColor: '#0E0E2C' },
  btnPrimaryText: { color: '#fff', fontWeight: '800' },
  btnGhost: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: 'rgba(79,70,229,0.35)',
  },
  btnGhostText: { color: '#3730A3', fontWeight: '800' },
});
