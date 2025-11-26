// screens/AdminCrearAlertaScreen.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* Base */
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // FONDO BLANCO
  },

  /* Header con Fondo NovaHub */
  headerWrapper: {
    height: 80,
    width: '100%',
    marginBottom: 18,
  },
  headerBg: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  headerBgImage: {
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.45)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },

  /* Scroll */
  content: {
    paddingHorizontal: 16,
  },

  /* CARD PRINCIPAL – gris claro */
  card: {
    backgroundColor: '#F3F4F6', // GRIS CLARO
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB', // BORDE SUAVE
    padding: 14,
    marginBottom: 16,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },

  cardHeaderTextWrap: {
    flex: 1,
  },
  cardTitle: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#475569',
    fontSize: 12,
    marginTop: 2,
  },

  /* FIELDS */
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#1E293B',
    marginBottom: 4,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  inputMultiline: {
    minHeight: 90,
  },

  /* Estado */
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  successText: {
    fontSize: 12,
    color: '#16A34A',
    marginTop: 4,
  },

  /* Botones */
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F1F5F9',
  },
  secondaryButtonPressed: {
    opacity: 0.85,
  },
  secondaryButtonIcon: {
    marginRight: 6,
  },
  secondaryButtonText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#4F46E5',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonPressed: {
    opacity: 0.9,
  },
  saveButtonIcon: {
    marginRight: 6,
  },
  saveButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* PREVIEW */
  previewCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  previewIcon: {
    marginRight: 6,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },

  previewBody: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  previewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  previewMessage: {
    fontSize: 12,
    color: '#475569',
  },
});
