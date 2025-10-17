import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* Base */
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 22 },

  /* Header */
  headerBg: { height: 170, position: 'relative', justifyContent: 'flex-end' },
  headerBgImage: { resizeMode: 'cover' },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,6,23,0.35)' },
  headerContent: { paddingHorizontal: 16, paddingTop: 40, paddingBottom: 16 },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  headerSub: { color: '#E5E7EB', marginTop: 2, fontWeight: '700' },
  headerChipsRow: { flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center' },

  /* Chips / Badges */
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

  /* Cards */
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

  /* Usuario */
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#C7D2FE',
  },
  avatarLetter: { color: '#3730A3', fontWeight: '900' },
  userName: { color: '#0F172A', fontWeight: '900' },
  userHandle: { color: '#64748B', fontWeight: '700' },
  badgeMini: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0',
  },
  badgeMiniText: { color: '#334155', fontWeight: '800' },

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

  btnDanger: { backgroundColor: '#EF4444', borderColor: '#DC2626' },
  btnDangerText: { color: '#FFFFFF', fontWeight: '900' },
});
