import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },

  wrapper: {
    flex: 1,
    backgroundColor: '#0c111b',
    paddingTop: 48,
    paddingHorizontal: 16,
  },

  // Boton de regresar a home
  backButton: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 35,
    height: 55,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backIcon: { fontSize: 44, lineHeight: 30, color: '#fff' },

  scrollContent: {
    paddingTop: 40,  // deja espacio bajo el back
    paddingBottom: 24,
  },

  portada: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: '#1a2233',
  },

  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EAF2FF',
    marginBottom: 4,
  },

  autor: {
    fontSize: 14,
    color: '#B8C3D9',
    marginBottom: 12,
  },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  chip: {
    backgroundColor: 'rgba(108,165,255,0.18)',
    color: '#6CA5FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    marginRight: 8,
    marginBottom: 8,
  },

  descripcion: {
    color: '#CDD8EE',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },

  /* 👥 Colaboradores */
  collabBlock: {
    marginTop: 4,
    marginBottom: 14,
  },
  collabLabel: {
    color: '#A9B5CC',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  collabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  collabPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginRight: 8,
    marginBottom: 8,
  },
  collabPillText: {
    color: '#EAF2FF',
    fontSize: 12,
    fontWeight: '600',
  },
  collabPillMuted: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginRight: 8,
    marginBottom: 8,
  },
  collabPillMutedText: {
    color: '#B8C3D9',
    fontSize: 12,
    fontWeight: '700',
  },

  primaryBtn: {
    backgroundColor: '#2F80ED',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },

  // Visor
  viewerWrap: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#0c111b',
  },

  // Fallback si WebView local falla
  fallback: {
    paddingHorizontal: 16,
  },
  fallbackText: {
    color: '#CDD8EE',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#444',
    borderRadius: 10,
  },
  secondaryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Cerrar visor
  closeViewerBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1a2233',
  },
  closeViewerText: {
    color: '#EAF2FF',
    fontWeight: '600',
  },

  errorText: {
    color: '#EAF2FF',
    fontSize: 16,
  },
});
