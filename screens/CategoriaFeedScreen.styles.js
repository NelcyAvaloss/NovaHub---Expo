import { StyleSheet } from 'react-native';

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerBackground: { width: '100%', height: 90, justifyContent: 'flex-end' },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },

  searchContainer: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 8, backgroundColor: '#fff' },
  searchBar: {
    minHeight: 40,
    borderRadius: 16,
    backgroundColor: '#EEF2F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: { width: 18, height: 18, marginRight: 6, resizeMode: 'contain' },
  searchInput: { flex: 1, color: '#0f172a', padding: 0, margin: 0 },

  // ---- Accordion Áreas ----
  accWrap: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  accHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accTitle: { color: '#0f172a', fontWeight: '700' },
  accRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  accSelected: { color: '#0f172a', fontSize: 12, marginRight: 4 },
  accSelectedMuted: { color: '#64748B', fontSize: 12, marginRight: 4 },
  accBody: { paddingHorizontal: 12, paddingBottom: 10 },

  // Chips en COLUMNA 
  chipsColumn: {
    flexDirection: 'column',
    gap: 8,
  },
  areaChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  areaChipActive: { backgroundColor: '#E0F2FE', borderColor: '#0EA5E9' },
  areaChipText: { color: '#0f172a', fontWeight: '600' },
  areaChipTextActive: { color: '#0f172a' },

  titlePublicacion: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a'
  },

  feedContainer: { flex: 1 },

  // Vacío
  emptyWrap: { alignItems: 'center', marginTop: 24 },
  emptyText: { color: '#6B7280' },
});

export const overlayStyles = StyleSheet.create({
  kebabBtn: { marginLeft: 'auto', padding: 6 },
  kebabText: { fontSize: 22, color: '#64748B', lineHeight: 18 },
  kebabMenu: {
    position: 'absolute',
    top: -10, right: 8,
    backgroundColor: '#fff',
    borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 8 },
    elevation: 3, zIndex: 20,
  },
  kebabItem: { paddingHorizontal: 14, paddingVertical: 10 },
  kebabItemText: { color: '#0f172a', fontSize: 14 },

  modalBackdrop: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center', justifyContent: 'center', zIndex: 30,
  },
  modalSheet: { width: '88%', backgroundColor: '#fff', borderRadius: 14, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  modalSub: { marginTop: 4, fontSize: 13, color: '#64748B' },
  modalInput: {
    marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 10, padding: 10, minHeight: 80, textAlignVertical: 'top', color: '#0f172a',
  },
  modalActions: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  modalBtnGhost: { paddingHorizontal: 14, paddingVertical: 10 },
  modalBtnGhostText: { color: '#334155', fontWeight: '600' },
  modalBtnPrimary: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#0e0e2c' },
  modalBtnPrimaryText: { color: '#fff', fontWeight: '700' },

  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  radioOuter: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#CBD5E1',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  radioOuterActive: { borderColor: '#0e0e2c' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0e0e2c' },
  radioLabel: { color: '#0f172a', fontSize: 14 },
});

export default s;
