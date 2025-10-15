import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* Base */
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 16 },

  /* Header */
  headerBg: { height: 170, position: 'relative' },
  headerBgImage: { resizeMode: 'cover' },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.35)',
  },

  headerTopRow: {
    paddingHorizontal: 16,
    paddingTop: 40, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoDot: { width: 10, height: 10, borderRadius: 6, backgroundColor: '#4338CA' },
  brandText: { color: '#E5E7EB', fontWeight: '800', letterSpacing: 0.4 },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  headerContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },

  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipPrimary: { backgroundColor: '#4338CA', borderColor: '#4338CA' },
  chipIcon: { marginRight: 6 },
  chipText: { color: '#1E293B', fontWeight: '700', fontSize: 12 },
  chipTextPrimary: { color: '#EEF2FF' },

  /* Cards de sección */
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeading: { color: '#0F172A', fontWeight: '800', fontSize: 16, marginBottom: 6 },

  /* KPIs – grid 2 por fila */
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },

  /* Tarjeta simple y estable */
  kpiCardSimple: {
    flexBasis: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },

  /* Badge arriba-derecha/ Porcentaje del resumen*/
  kpiDeltaAbsolute: {
    position: 'absolute',
    right: 5,
    top: 8,
  },

  /* Icono */
  kpiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiIconIndigo:  { backgroundColor: '#E0E7FF', borderWidth: 1, borderColor: '#C7D2FE' },
  kpiIconSky:     { backgroundColor: '#E0F2FE', borderWidth: 1, borderColor: '#BAE6FD' },
  kpiIconAmber:   { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A' },
  kpiIconEmerald: { backgroundColor: '#D1FAE5', borderWidth: 1, borderColor: '#A7F3D0' },

  /* Valor y label */
  kpiValueBig: { color: '#0F172A', fontSize: 28, fontWeight: '900', lineHeight: 30 },
  kpiLabelCenter: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
  },

  /* Badge estilos */
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deltaUp: { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#A7F3D0' },
  deltaDown: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' },
  deltaTextUp: { color: '#166534', fontWeight: '800', fontSize: 11 },
  deltaTextDown: { color: '#991B1B', fontWeight: '800', fontSize: 11 },

  /* Doble columna (en móvil apilado) */
  doubleCol: { gap: 12, marginTop: 8, marginHorizontal: 16 },

  /* Headers de secciones con link */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { color: '#4F46E5', fontWeight: '800' },

  /* Filas de lista */
  rowItem: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowItemBorder: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },

  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  dotWarning: { backgroundColor: '#F59E0B' },

  rowTextWrap: { flex: 1 },
  rowTitle: { color: '#0F172A', fontWeight: '800' },
  rowSub: { color: '#64748B', fontSize: 12, marginTop: 2 },

  /* CTA buttons */
  ctaRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginVertical: 14 },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
  },
  btnIcon: { marginRight: 2 },
  btnPrimary: { backgroundColor: '#1B1F3B', borderColor: '#4338CA' },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: '900' },
  btnGhost: { backgroundColor: '#EEF2FF', borderColor: 'rgba(199, 210, 254, 1)' },
  btnGhostText: { color: '#1B1F3B', fontWeight: '900' },
});
