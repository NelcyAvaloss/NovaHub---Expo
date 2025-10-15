import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* ===== Base == */
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 16 },

  /* ==== Header ===== */
  headerBg: { height: 170, position: 'relative' },
  headerBgImage: { resizeMode: 'cover' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,6,23,0.35)' },

  headerContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  headerSub: { color: '#E5E7EB', marginTop: 4, fontWeight: '600' },

  headerChipsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  headerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerChipPrimary: { backgroundColor: '#4F46E5', borderColor: '#4338CA' },
  headerChipIcon: { marginRight: 6 },
  headerChipText: { color: '#1E293B', fontWeight: '700', fontSize: 12 },
  headerChipTextPrimary: { color: '#EEF2FF' },

  /* ===== Métricas ===== */
  metricsRow: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricLabel: { color: '#64748B', fontWeight: '700', fontSize: 12 },
  metricValue: { color: '#0F172A', fontWeight: '900', fontSize: 18, marginTop: 2 },
  metricOk: { color: '#065F46' },
  metricDanger: { color: '#991B1B' },
  metricInfo: { color: '#1E3A8A' },

  /* ===== Tabs ===== */
  tabsRow: {
    marginTop: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  tabActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  tabText: { color: '#334155', fontWeight: '800', fontSize: 12 },
  tabTextActive: { color: '#3730A3' },

  /* ===== Buscador + botón filtros ===== */
  searchRow: {
    marginTop: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchIcon: { marginRight: 2 },
  input: {
    flex: 1,
    color: '#0F172A',
    fontWeight: '700',
    paddingVertical: 0,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  btnGhost: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  btnGhostText: { color: '#3730A3', fontWeight: '900' },

  /* ===== Resultados ===== */
  resultsText: {
    marginHorizontal: 16,
    marginTop: 8,
    color: '#64748B',
    fontWeight: '700',
  },

  /* ===== Tarjeta de usuario ===== */
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  // banda vertical por estado
  stateBand: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  bandGreen: { backgroundColor: '#34D399' },
  bandRed: { backgroundColor: '#F87171' },

  cardBody: { padding: 12 },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#3730A3', fontWeight: '900' },

  cardTitleWrap: { flex: 1, minWidth: 0 },
  title: { color: '#0F172A', fontWeight: '900' },
  sub: { color: '#64748B', fontSize: 12, marginTop: 2 },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeGreen: { backgroundColor: '#D1FAE5', borderColor: '#A7F3D0' },
  badgeRed: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  badgeTextDark: { color: '#065F46', fontWeight: '800', fontSize: 12 },
  badgeTextDanger: { color: '#991B1B', fontWeight: '800', fontSize: 12 },

  
  dotGreen: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  dotRed: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },

  /* Meta (rol) */
  metaRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaPillText: { color: '#3730A3', fontWeight: '800', fontSize: 12 },

  /* Acciones */
  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipPrimary: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  chipDanger: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  chipText: { color: '#334155', fontWeight: '800', fontSize: 12 },
  chipTextPrimary: { color: '#3730A3', fontWeight: '900', fontSize: 12 },
  chipTextDanger: { color: '#991B1B', fontWeight: '900', fontSize: 12 },

  /* Vacío */
  emptyBox: {
    marginTop: 20,
    marginHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { color: '#94A3B8', fontWeight: '700' },
});
