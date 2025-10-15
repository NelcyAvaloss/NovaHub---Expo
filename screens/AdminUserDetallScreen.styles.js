import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* ===== Base ===== */
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },

  /* ===== Header ===== */
  headerBg: { height: 180, position: 'relative' },
  headerBgImage: { resizeMode: 'cover' },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.35)',
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 36,
    justifyContent: 'flex-end',
    paddingBottom: 14,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: 0.3 },
  headerSub: { color: '#E5E7EB', fontSize: 12, marginTop: 2 },

  /* Header row: avatar + nombre + estado */
  headerRow: {
    marginTop: 12,
    backgroundColor: 'rgba(248,250,252,0.92)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#3730A3', fontWeight: '900' },
  headerTextBlock: { flex: 1, minWidth: 0 },
  name: { color: '#0F172A', fontWeight: '900' },
  email: { color: '#475569', fontSize: 12, marginTop: 2 },

  /* Badges de estado */
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  badgeGreen: { backgroundColor: '#DCFCE7', borderColor: '#A7F3D0' },
  badgeRed: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  badgeTextDark: { color: '#065F46', fontWeight: '800', fontSize: 12 },
  badgeTextDanger: { color: '#991B1B', fontWeight: '800', fontSize: 12 },

  /* ===== Franja informativa (dentro del Scroll) ===== */
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrap: { flex: 1, minWidth: 0 },
  infoLabel: { color: '#64748B', fontSize: 11, fontWeight: '700' },
  infoValue: { color: '#0F172A', fontWeight: '900', marginTop: 2 },
  dividerV: { width: 1, height: 30, backgroundColor: '#E2E8F0', marginHorizontal: 12 },

  /* ===== Cards genéricos ===== */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { color: '#0F172A', fontWeight: '900', marginBottom: 10, fontSize: 16 },

  /* Filas de datos */
  rowItem: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowItemBorder: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  label: { color: '#64748B', fontSize: 12, fontWeight: '700' },
  value: { color: '#0F172A', fontWeight: '800', marginLeft: 12, flex: 1, textAlign: 'right' },

  /* ===== Acciones rápidas  ===== */
  quickGrid: { gap: 10 },
  quickTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  quickIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  quickIconIndigo: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  quickIconSky: { backgroundColor: '#E0F2FE', borderColor: '#BAE6FD' },
  quickTextCol: { flex: 1, minWidth: 0 },
  quickTitle: { color: '#0F172A', fontWeight: '900' },
  quickSub: { color: '#64748B', fontSize: 12, marginTop: 2 },

  /* ===== Botones y filas de acciones ===== */
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 4,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },

  // Primario sólido
  btnPrimary: { backgroundColor: '#4F46E5', borderColor: '#4338CA' },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: '900' },

  // Primario contorno
  btnPrimaryOutline: { backgroundColor: '#FFFFFF', borderColor: '#4338CA' },
  btnPrimaryOutlineText: { color: '#3730A3', fontWeight: '900' },

  // Secundario/ghost
  btnGhost: { backgroundColor: '#EEF2FF', borderColor: 'rgba(199, 210, 254, 1)' },
  btnGhostText: { color: '#3730A3', fontWeight: '900' },

  // Peligro contorno / sólido
  btnDangerOutline: { backgroundColor: '#FFF1F2', borderColor: '#FCA5A5' },
  btnDangerText: { color: '#B91C1C', fontWeight: '900' },
  btnDanger: { backgroundColor: '#EF4444', borderColor: '#DC2626' },
  btnDangerTextSolid: { color: '#FFFFFF', fontWeight: '900' },

  /* ===== Actividad reciente ===== */
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { color: '#0F172A', fontWeight: '800', flex: 1 },
  rowWhen: { color: '#64748B', fontSize: 12, marginLeft: 8 },
});
