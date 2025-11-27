import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },

  /* HEADER */
  headerBg: {
    width: '100%',
    height: 96,            
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    paddingBottom: 12,     
  },
  headerBar: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.4)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  /* CONTENIDO (bajo el buscador) */
  content: {
    flex: 1,
    backgroundColor: '#E5E7EB', // gris claro como en el prototipo
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  /* CARD DE USUARIO (como prototipo) */
  card: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    ...Platform.select({ android: { elevation: 3 } }),
  },

  cardCloseWrap: {
    position: 'absolute',
    top: 6,
    right: 8,
    zIndex: 5,
  },
  cardCloseText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '700',
  },

  cardTop: {
    paddingTop: 18,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },

  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0e7490',
  },
  avatarInitial: {
    color: '#E5F3FF',
    fontSize: 26,
    fontWeight: '900',
  },

  cardBottom: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#E5EBF5',
  },
  cardName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',   // ← nombre centrado
  },
  cardRole: {
    marginTop: 2,
    fontSize: 11,
    color: '#4B5563',
    textAlign: 'center',
  },
  cardInstitution: {
    marginTop: 2,
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },

  followBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',   // ← botón “Seguir” centrado
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#0e0e2c',
  },
  followBtnPlus: {
    color: '#FFFFFF',
    fontWeight: '900',
    marginRight: 4,
    fontSize: 13,
  },
  followBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },

  /* ESTADOS */
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#111827',
    fontSize: 13,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#4B5563',
    fontSize: 13,
    textAlign: 'center',
  },
});
