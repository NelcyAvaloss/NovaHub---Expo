import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },

  /* Header */
  headerBg: { width: '100%', height: 160, justifyContent: 'flex-end' },
  headerBgImage: { resizeMode: 'cover', opacity: 0.9 },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2,6,23,0.35)' },
  headerContent: { paddingHorizontal: 16, paddingBottom: 14 },
  headerTitle: { color: '#EEF2FF', fontSize: 22, fontWeight: '700' },
  headerSub: { color: '#E5E7EB', fontSize: 13, marginTop: 2 },

  headerChipsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  headerChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999, backgroundColor: '#FFFFFF',
  },
  headerChipPrimary: { backgroundColor: '#4F46E5' },
  headerChipIcon: { marginRight: 6 },
  headerChipText: { color: '#0F172A', fontSize: 12, fontWeight: '600' },
  headerChipTextPrimary: { color: '#EEF2FF' },

  /* Scroll */
  scroll: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
});
