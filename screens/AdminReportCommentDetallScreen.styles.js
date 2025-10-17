import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 22 },

  headerBg: { height: 170, position: 'relative', justifyContent: 'flex-end' },
  headerBgImage: { resizeMode: 'cover' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,6,23,0.35)' },
  headerContent: { paddingHorizontal: 16, paddingTop: 40, paddingBottom: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  headerSub: { color: '#E5E7EB', marginTop: 2, fontWeight: '700' },
  headerChipsRow: { flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center' },

  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F1F5F9', borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#E2E8F0',
  },
  chipPrimary: { backgroundColor: '#4F46E5', borderColor: '#4338CA' },
  chipIcon: { marginRight: 6 },
  chipTextPrimary: { color: '#EEF2FF', fontWeight: '800', fontSize: 12 },

  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1,
  },
  badgeGreen: { backgroundColor: '#D1FAE5', borderColor: '#A7F3D0' },
  badgeYellow: { backgroundColor: '#FEF9C3', borderColor: '#FDE68A' },
  badgeBlue: { backgroundColor: '#DBEAFE', borderColor: '#BFDBFE' },
  badgeTextDark: { color: '#065F46', fontWeight: '800' },
  badgeTextWarn: { color: '#92400E', fontWeight: '800' },
  badgeTextInfo: { color: '#1E3A8A', fontWeight: '800' },

  card: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 12, padding: 14,
    borderRadius: 14, borderWidth: 1, borderColor: '#F1F5F9',
    shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { color: '#4F46E5', fontWeight: '800', maxWidth: 200 },
  cardTitle: { color: '#0F172A', fontWeight: '900', fontSize: 16, marginBottom: 8 },

  rowItem: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  label: { color: '#64748B', fontWeight: '700', width: 120 },
  value: { color: '#0F172A', fontWeight: '800', flex: 1, textAlign: 'right' },
  valueMultiline: { textAlign: 'left', lineHeight: 20 },

  // “mini publicación” para comentario
  pubCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  pubHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF2FF',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#C7D2FE',
  },
  avatarLetter: { color: '#3730A3', fontWeight: '900' },
  headerText: { flex: 1 },
  autor: { color: '#0F172A', fontWeight: '800' },
  fecha: { color: '#94A3B8', fontSize: 12 },
  pubTexto: { color: '#334155', marginTop: 8, lineHeight: 20 },
  tagsRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  tagChip: {
    backgroundColor: '#EEF2FF', color: '#3730A3',
    borderColor: '#C7D2FE', borderWidth: 1, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 4, fontWeight: '800', overflow: 'hidden',
  },

  /* Acciones */
  actionsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginTop: 14 },
  btn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 12, paddingVertical: 12, borderWidth: 1,
  },
  btnPrimary: { backgroundColor: '#4F46E5', borderColor: '#4338CA' },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: '900' },
  btnGhost: { backgroundColor: '#EEF2FF', borderColor: 'rgba(199, 210, 254, 1)' },
  btnGhostText: { color: '#3730A3', fontWeight: '900' },
});
