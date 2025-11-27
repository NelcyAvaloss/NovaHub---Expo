import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0c12' }, // El fondo real lo estás sobreescribiendo en la screen

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
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  listContent: { padding: 12, paddingBottom: 28 },

  /* Card compacta y horizontal  */
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)', // un borde gris suave
    backgroundColor: 'rgba(248,250,252,0.96)', // igual la screen la sobreescribe a gris clarito
    overflow: 'hidden',
    marginBottom: 12,

    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    ...Platform.select({ android: { elevation: 2 } }),
  },

  /* Medalla */
  rankBadge: {
    position: 'absolute',
    top: 12,
    left: 8,
    width: 60,
    height: 60,
    borderRadius: 12,
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontWeight: '900',
    fontSize: 13,
    color: '#111827', // número de posición legible
  },

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

  // Nombre del autor más oscuro y limpio
  author: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
  },

  // Fecha en gris suave
  date: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 1,
  },

  scoreChip: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.6)',
  },
  scoreChipText: {
    color: '#111827',
    fontWeight: '800',
    fontSize: 12,
  },

  /* Título compacto */
  title: {
    color: '#111827',
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
    backgroundColor: 'rgba(226,232,240,0.8)',
    color: '#1F2937',
    fontSize: 11,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.8)',
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
    backgroundColor: 'rgba(226,232,240,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  votePillDown: {
    backgroundColor: 'rgba(226,232,240,0.7)',
  },
  voteIcon: { width: 16, height: 16, marginRight: 6, resizeMode: 'contain' },

  // Contador de likes/dislikes en gris oscuro
  voteText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '800',
  },

  readMoreBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#0e0e2c',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.14)',
  },
  readMoreText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.2,
  },

  /* Colaboradores compactos */
  collabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  collabPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(226,232,240,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.9)',
    marginRight: 6,
    marginTop: 6,
  },
  collabPillText: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '600',
  },
  collabPillMuted: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(209,213,219,0.8)',
    marginTop: 6,
  },
  collabPillMutedText: {
    color: '#4B5563',
    fontSize: 11,
    fontWeight: '700',
  },

  /* Vacío */
  emptyBox: { paddingVertical: 48, alignItems: 'center' },
  emptyText: {
    color: '#6B7280',
    fontSize: 13,
  },

  rankImage: {
    width: 56,
    height: 56,
  },
});
