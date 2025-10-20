import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  headerRow: {
    paddingTop: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  arrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  // Carrusel
  carouselContent: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    backgroundColor: '#000', // por si tarda la imagen
  },
  cardImage: {
    width: '100%',
    height: 160,
    justifyContent: 'flex-end',
  },
  cardImageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,6,23,0.35)', // overlay oscuro 
  },
  cardTitle: {
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

  
cardImage: {
  width: '100%',
  height: 160,
  overflow: 'hidden',
  borderTopLeftRadius: 18,
  borderTopRightRadius: 18,
  position: 'relative',
},
cardImageStyle: {
  ...StyleSheet.absoluteFillObject,
},

});
