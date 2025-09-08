import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c12' },

  headerBg: { width: '100%', height: 96, resizeMode: 'cover' },
  headerBar: {
    marginTop: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  backIcon: { color: '#fff', fontSize: 20, lineHeight: 20 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },

  listContent: { padding: 12, paddingBottom: 28 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    ...Platform.select({ android: { elevation: 3 } }),
  },

  rankBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#0e0e2c',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 5,
  },
  rankText: { color: '#fff', fontWeight: '800', fontSize: 12 },

  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarLetter: { color: '#0f172a', fontWeight: '700' },
  author: { color: '#0f172a', fontWeight: '700', fontSize: 14 },
  date: { color: '#6B7280', fontSize: 12, marginTop: 2 },

  scorePill: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(14,14,44,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(14,14,44,0.16)',
  },
  scoreText: { color: '#0e0e2c', fontSize: 12, fontWeight: '800' },

  title: { color: '#111827', fontSize: 16, fontWeight: '700', marginTop: 8 },

  cover: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    marginTop: 10,
  },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    color: '#334155',
    fontSize: 12,
    overflow: 'hidden',
    marginRight: 6,
    marginBottom: 6,
  },

  collabBlock: { marginTop: 12 },
  collabLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  collabRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  collabPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF2F7',
    marginRight: 6,
    marginBottom: 6,
  },
  collabPillText: { color: '#334155', fontSize: 12, fontWeight: '600' },
  collabPillMuted: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  collabPillMutedText: { color: '#475569', fontSize: 12, fontWeight: '700' },

  footerRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  votesGroup: { flexDirection: 'row', alignItems: 'center' },
  votePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(189, 185, 181, 0.54)',
    borderWidth: 1,
    borderColor: 'rgba(150,160,180,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  votePillDown: { backgroundColor: 'rgba(189, 185, 181, 0.40)' },
  voteIcon: { width: 18, height: 18, marginRight: 6, resizeMode: 'contain' },
  voteText: { color: '#0e0e2c', fontSize: 13, fontWeight: '700' },

  readMoreBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#0e0e2c',
  },
  readMoreText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, letterSpacing: 0.2 },

  emptyBox: { paddingVertical: 48, alignItems: 'center' },
  emptyText: { color: '#aab1c1' },
});
