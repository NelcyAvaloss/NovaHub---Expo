import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Base
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 16 },

  // Header con fondo
  headerBg: { height: 180, position: 'relative' },
  headerBgImage: { resizeMode: 'cover' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,6,23,0.35)' },
  headerContent: { flex: 1, paddingHorizontal: 16, paddingTop: 36, justifyContent: 'flex-end', paddingBottom: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  headerSub: { color: '#E5E7EB', marginTop: 4 },

  headerChipsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  headerChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F1F5F9', borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#E2E8F0',
  },
  headerChipPrimary: { backgroundColor: '#4F46E5', borderColor: '#4338CA' },
  headerChipIcon: { marginRight: 6 },
  headerChipText: { color: '#1E293B', fontWeight: '700', fontSize: 12 },
  headerChipTextPrimary: { color: '#EEF2FF' },

  // Métricas
  metricsRow: { flexDirection: 'row', gap: 10, marginTop: 12, marginHorizontal: 16 },
  metricCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12,
    borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  metricLabel: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  metricValue: { color: '#0F172A', fontSize: 18, fontWeight: '900', marginTop: 2 },
  metricOk: { color: '#065F46' },
  metricDanger: { color: '#991B1B' },

  // Tabs
  tabsRow: { flexDirection: 'row', gap: 8, marginTop: 10, marginHorizontal: 16 },
  tab: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#E5E7EB',
  },
  tabActive: { backgroundColor: '#4F46E5' },
  tabText: { fontWeight: '800', color: '#334155' },
  tabTextActive: { color: '#EEF2FF' },

  // Filtros (dropdowns)
  filtersRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 10 },
  dropdown: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', borderWidth: 1,
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 10,
    gap: 8,
  },
  dropdownText: { color: '#3730A3', fontWeight: '800', flex: 1, marginLeft: 6 },

  // Toolbar (buscador + seleccionar)
  toolbarRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginTop: 10 },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8,
  },
  searchIcon: { marginRight: 6 },
  input: { flex: 1, color: '#0F172A', paddingVertical: 2 },

  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1,
  },
  btnPrimary: { backgroundColor: '#4F46E5', borderColor: '#4338CA' },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: '900' },
  btnGhost: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  btnGhostText: { color: '#3730A3', fontWeight: '900' },

  // Bulk bar
  bulkBar: {
    marginHorizontal: 16, marginTop: 12, backgroundColor: '#F8FAFC',
    borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 10,
  },
  bulkText: { color: '#0F172A', fontWeight: '800', marginBottom: 8 },
  bulkActions: { flexDirection: 'row', gap: 8 },
  chipAction: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8,
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0',
  },
  chipPrimary: { backgroundColor: '#4F46E5', borderColor: '#4338CA' },
  chipText: { color: '#334155', fontWeight: '800', fontSize: 12 },
  chipTextPrimary: { color: '#EEF2FF', fontWeight: '900', fontSize: 12 },

  // Contador
  resultsText: { marginHorizontal: 16, marginTop: 10, color: '#64748B', fontWeight: '700' },

  // Cards de lista
  card: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 12,
    borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  cardSelected: { borderColor: '#4F46E5', borderWidth: 2 },
  stateBand: { position: 'absolute', left: 0, width: 4, height: '100%', backgroundColor: '#E2E8F0' },

  bandGreen: { backgroundColor: '#22C55E' },
  bandRed: { backgroundColor: '#EF4444' },

  cardBody: { padding: 12 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  cardTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#94A3B8' },
  dotGreen: { backgroundColor: '#22C55E' },
  dotRed: { backgroundColor: '#EF4444' },

  // Título COMPLETO (sin truncar)
  title: { color: '#0F172A', fontWeight: '900', fontSize: 16, lineHeight: 22, flexShrink: 1 },
  sub: { color: '#64748B', marginTop: 2 },

  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1,
  },
  badgeGreen: { backgroundColor: '#DCFCE7', borderColor: '#A7F3D0' },
  badgeRed: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  badgeTextDark: { color: '#065F46', fontWeight: '800', fontSize: 11 },
  badgeTextDanger: { color: '#991B1B', fontWeight: '800', fontSize: 11 },

  metaRow: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  metaChip: {
    backgroundColor: '#EEF2FF', color: '#3730A3', fontWeight: '800',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: '#C7D2FE',
    overflow: 'hidden',
  },

  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8,
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0',
  },
  chipText: { color: '#334155', fontWeight: '800', fontSize: 12 },

  // Modales selectores
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(15,23,42,0.35)', justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingHorizontal: 14, paddingTop: 10, paddingBottom: 16,
    borderTopWidth: 1, borderColor: '#E5E7EB',
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  modalTitle: { fontWeight: '900', color: '#0F172A', fontSize: 16 },
  modalSearchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8,
  },
  modalSearchIcon: { marginRight: 6 },
  modalInput: { flex: 1, color: '#0F172A' },
  modalList: { paddingBottom: 8 },
  modalItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingHorizontal: 6, borderRadius: 10,
  },
  modalItemActive: { backgroundColor: '#EEF2FF' },
  modalItemText: { color: '#0F172A', fontWeight: '700' },
  modalItemTextActive: { color: '#3730A3' },
});
