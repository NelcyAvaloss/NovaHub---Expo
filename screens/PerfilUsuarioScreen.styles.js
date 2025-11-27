import { StyleSheet, StatusBar } from 'react-native';

const STATUSBAR = StatusBar.currentHeight || 0;

const s = StyleSheet.create({
  screen: { 
    flex: 1,
    backgroundColor: '#F8FAFC', // pantalla normal
  },

  // HEADER pegado TOTAL arriba
  headerWrap: { 
    width: '100%',
    backgroundColor: '#000', // se oculta bajo el fondo
  },

  headerBg: {
    width: '100%',
    height: 125,
    paddingTop: STATUSBAR, // ⬅️ esto elimina la franja blanca
    justifyContent: 'flex-start',
  },

  headerBgImage: { resizeMode: 'cover' },

  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 10, 30, 0.28)',
  },

  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10, 
  },

  backBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  headerBottomCut: {
    height: 28,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: -1,
  },

  avatarWrap: {
    position: 'absolute',
    left: 0, right: 0,
    bottom: -25,
    alignItems: 'center',
    zIndex: 20,
  },

  avatarImg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#F8FAFC',
    backgroundColor: '#fff',
  },

  profileInfo: {
    paddingTop: 25,
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  userName: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  userRole: { marginTop: 2, fontSize: 13, color: '#6B7280' },
  userUni:  { marginTop: 2, fontSize: 13, color: '#6B7280' },

  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  contactText: { color: '#0f172a' },

  actionRow: { marginTop: 12, flexDirection: 'row', gap: 10 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  msgBtn: { backgroundColor: '#1F3A56' },
  followBtn: { backgroundColor: '#1F3A56' },
  actionBtnText: { color: '#F8FAFC', fontWeight: '700' },

  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 14,
    marginBottom: 6,
  },
  tabBtn: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#CBD5E1' },
  tabText: { color: '#334155', fontWeight: '600' },
  tabTextActive: { color: '#0f172a' },

  listContentPeople: { paddingHorizontal: 12, paddingBottom: 24 },

  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  personAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff' },
  personInfo: { flex: 1, marginLeft: 10 },
  personName: { color: '#0f172a', fontWeight: '700' },
  personEmail: { color: '#6B7280', marginTop: 2, fontSize: 12 },
  personBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1F3A56',
  },
  personBtnText: { color: '#F8FAFC', fontWeight: '700', fontSize: 12 },

  emptyBox: { alignItems: 'center', marginTop: 24 },
  emptyText: { color: '#6B7280' },
});

export const ls = StyleSheet.create({
  kebabBtn: { marginLeft: 'auto', padding: 6 },
  kebabText: { fontSize: 22, color: '#64748B', lineHeight: 18 },
  kebabMenu: {
    position: 'absolute',
    top: -10,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    zIndex: 20,
  },
  kebabItem: { paddingHorizontal: 14, paddingVertical: 10 },
  kebabItemText: { color: '#0f172a', fontSize: 14 },
});

export const reportStyles = StyleSheet.create({
  modalBackdrop: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  },
  modalSheet: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  modalSub: { marginTop: 4, fontSize: 13, color: '#64748B' },
  modalInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#0f172a',
  },
  modalActions: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  modalBtnGhost: { paddingHorizontal: 14, paddingVertical: 10 },
  modalBtnGhostText: { color: '#334155', fontWeight: '600' },
  modalBtnPrimary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#0e0e2c',
  },
  modalBtnPrimaryText: { color: '#fff', fontWeight: '700' },

  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  radioOuter: {
    width: 18, height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioOuterActive: { borderColor: '#0e0e2c' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0e0e2c' },
  radioLabel: { color: '#0f172a', fontSize: 14 },
});

export default s;
