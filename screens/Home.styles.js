import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  header: {
    marginTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileIcon: {
    width: 38,
    height: 38,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
  },

titlePublicacion: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '5e5b5b',
  textAlign: 'left',
  marginLeft: 20,
  marginTop: 20,
},



  searchContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#0e0e2c',
    borderRadius: 15,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0e0e2c',
    paddingVertical: 5,
    borderRadius: 30,
    marginHorizontal: 4,
    top: -1,
  },
  navIcon: {
    width: 40,
    height: 40,
  },

  // 🟡 Estilos añadidos para el botón de publicación animado
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
  publicarIcono: {
    width: 40,
    height: 40,
  
  },


  cardImage: {
  width: '100%',
  height: 200,
  borderRadius: 10,
  marginBottom: 10,
},


verPdfButton: {
  backgroundColor: '#4F9DDE',
  padding: 8,
  borderRadius: 6,
  alignItems: 'center',
  marginTop: 8,
},
verPdfText: {
  color: '#fff',
  fontWeight: 'bold',
},





});
