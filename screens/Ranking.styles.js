// screens/Ranking.styles.js
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c12' },

  /* Header */
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
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  backIcon: { color: '#fff', fontSize: 40, lineHeight: 30 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },

  listContent: { padding: 12, paddingBottom: 28 },

  /* Card compacta y horizontal  */
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    ...Platform.select({ android: { elevation: 4 } }),
  },

  /* Medalla */
  rankBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    zIndex: 3,
  },
  rankText: { fontWeight: '900', fontSize: 13 },

  /* Fila principal */
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  /* Mini portada (thumbnail) */
 
thumb: {
  width: 110,
  height: 100,
  borderRadius: 12,
  backgroundColor: '#1a1d2e',
  alignSelf: 'flex-end',   
  marginTop: 10,           
},


  /* Bloque de info a la derecha */
  infoBlock: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
  },

  /* Header autor + score */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarLetter: { color: '#0f172a', fontWeight: '700' },
  author: { color: '#E8EEFF', fontWeight: '800', fontSize: 13 },
  date: { color: '#B8C3D9', fontSize: 11, marginTop: 1 },

  scoreChip: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scoreChipText: { color: '#fff', fontWeight: '800', fontSize: 12 },

  /* Título compacto */
  title: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Tags en una línea si caben */
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    color: '#DCE5FF',
    fontSize: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    marginRight: 6,
    marginTop: 4,
  },

  /* Footer: métricas + CTA */
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'space-between',
  },
  votesGroup: { flexDirection: 'row', alignItems: 'center' },
  votePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  votePillDown: { backgroundColor: 'rgba(255,255,255,0.08)' },
  voteIcon: { width: 16, height: 16, marginRight: 6, resizeMode: 'contain' },
  voteText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  readMoreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#0e0e2c',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  readMoreText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12, letterSpacing: 0.2 },

  /* Colaboradores compactos en una línea múltiple si hace falta */
  collabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  collabPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    marginRight: 6,
    marginTop: 6,
  },
  collabPillText: { color: '#DDE6FF', fontSize: 11, fontWeight: '600' },
  collabPillMuted: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 6,
  },
  collabPillMutedText: { color: '#C9D3EA', fontSize: 11, fontWeight: '700' },

  /* Vacío */
  emptyBox: { paddingVertical: 48, alignItems: 'center' },
  emptyText: { color: '#aab1c1' },


  rankImage: {
  width: 60,
  height: 60,
},

});
