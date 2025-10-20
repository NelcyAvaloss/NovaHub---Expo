import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  /* ======== LAYOUT GENERAL ======== */
  container: { flex: 1, backgroundColor: '#fff' },

  /* ======== HEADER ======== */
  headerBackground: { width: '100%', height: 112, resizeMode: 'cover' }, // ↑ un pelín más alto
  header: {
    paddingTop: Platform.select({ ios: 48, android: 36 }),
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileIcon: { width: 38, height: 38, borderRadius: 19 },
  icon: { width: 24, height: 24 },
  title: {
    fontSize: 21,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  headerIconLabel: { color: '#fff', fontSize: 10, marginTop: 4 },

  /* ======== ICONO ENTRE HEADER Y BUSCADOR ======== */
  midIconWrap: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 4, // ↓ más pegado al carrusel/buscador
    alignItems: 'center',
  },
  midIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    ...Platform.select({ android: { elevation: 2 } }),
  },
  midIconImageBox: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  midIconImage: { width: '100%', height: '100%' },
  midIconText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  /* ======== BUSCADOR ======== */
  searchContainer: {
    marginTop: 3,
    paddingHorizontal: 25,
    paddingVertical: 5,
    backgroundColor: '#0e0e2c',
    borderRadius: 18,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  searchIcon: { width: 18, height: 18, marginRight: 8, opacity: 0.9 },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },

  /* ======== SECCIÓN PUBLICACIONES ======== */
  titlePublicacion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b1f2a',
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  feedContainer: { flex: 1, paddingHorizontal: 12 },
  listContent: { paddingTop: 8, paddingBottom: 100 },

  publicacionContainer: { marginBottom: 14, paddingHorizontal: 2 },

  publicacionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    ...Platform.select({ android: { elevation: 3 } }),
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },

  publicacionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
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
  headerText: { flexShrink: 1 },
  nombreAutor: { color: '#0f172a', fontWeight: '700', fontSize: 14 },
  fechaTexto: { color: '#6B7280', fontSize: 12, marginTop: 2 },

  publicacionTitulo: { color: '#111827', fontSize: 16, fontWeight: '700', marginTop: 4 },
  publicacionTexto: { color: '#374151', fontSize: 14, lineHeight: 20, marginTop: 4 },

  publicacionImagen: {
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

  /* 👥 Colaboradores */
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

  /* Footer / acciones */
  publicacionFooter: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  verMasBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#0e0e2c',
  },
  verMasText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, letterSpacing: 0.2 },

  /* ======== CONTENIDO GENÉRICO / BOTTOM NAV ======== */
  content: { flex: 1, backgroundColor: '#fff', padding: 20 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0e0e2c',
    paddingVertical: 2,
    borderRadius: 30,
    marginHorizontal: 2,
    top: -4,
  },
  navIcon: { width: 35, height: 35 },
  publicarBoton: {
    backgroundColor: '#4F9DDE',
    borderRadius: 50,
    padding: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  publicarIcono: { width: 40, height: 40 },

  /* --- VOTOS / RANKING --- */
  voteRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(178, 181, 185, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(150,160,180,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  voteBtnActive: { borderColor: '#58a6ff', backgroundColor: 'rgba(88,166,255,0.12)' },
  voteBtnActiveDown: { borderColor: '#ff9f80', backgroundColor: 'rgba(255,159,128,0.12)' },
  voteImage: { width: 18, height: 18, marginRight: 6 },
  voteCount: { color: '#373738ff', fontSize: 13, fontWeight: '700' },

  scorePill: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(150,160,180,0.25)',
  },
  scorePillText: { color: '#EAF2FF', fontSize: 12, fontWeight: '700' },

  /* ======== KEBAB MENU (3 puntos) ======== */
  kebabBtn: { marginLeft: 'auto', padding: 6, borderRadius: 8 },
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
    ...Platform.select({ android: { elevation: 3 } }),
    zIndex: 20,
  },
  kebabItem: { paddingHorizontal: 14, paddingVertical: 10 },
  kebabItemText: { color: '#0f172a', fontSize: 14, fontWeight: '600' },

  /* ======== MODAL ======== */
  modalBackdrop: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
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
  modalBtnPrimary: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#0e0e2c' },
  modalBtnPrimaryText: { color: '#fff', fontWeight: '700' },

  /* ======== RADIOS ======== */
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  radioOuter: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#CBD5E1',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  radioOuterActive: { borderColor: '#0e0e2c' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0e0e2c' },
  radioLabel: { color: '#0f172a', fontSize: 14 },

  /* ============================================================================================================================ */
  /* ESTILOS DEL CARRUSEL DE CATEGORÍAS (entre header y buscador) */
  /* ============================================================================================================================ */

  // Contenedor animado (height/opacity) del carrusel — compactado
  catsWrap: {
    overflow: 'hidden',
    paddingTop: 4,   
    paddingBottom: 2, 
    marginBottom: 0, // sin espacio extra con el buscador
  },

 

  // Padding interno del carrusel — compacto
  carouselContent: {
    paddingVertical: 6,
    alignItems: 'center',
  },

  // Tarjeta del carrusel
  catsCard: {
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({ android: { elevation: 5 } }),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    backgroundColor: '#000',
  },

  // Imagen de la tarjeta (más baja para compactar)
  catsCardImage: {
    width: '100%',
    height: 150, 
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: 'relative',
  },
  catsCardImageStyle: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },

  catsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.35)',
  },

  catsCardTitle: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    textAlign: 'center',
    color: '#F8FAFC',
    fontWeight: '800',
    fontSize: 15,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
