import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerBackground: {
  // tu fondo actual
},

headerContent: {
  height: 85,            
  justifyContent: 'center',
},

backButton: {
  position: 'absolute',
  left: 14,
  zIndex: 2,
  padding: 10,
  marginTop: 20,
},

headerTitle: {
  position: 'absolute',
  left: 0,
  right: 0,
  textAlign: 'center',
  fontSize: 20,
  color: '#fff',
  fontWeight: 'bold',
  paddingHorizontal: 56, // evita que el texto pase debajo del botón
  marginTop: 20,
},


  inputGroup: {
    padding: 20,
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginTop: 20,
  },

  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
  },

  inputButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
  },

  inputLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
  },

  placeholderBox: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },

  

  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },

  optionButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    fontWeight: 'bold',
    color: '#333',
  },

  buttonGroup: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
  },

headerActions: {
  marginTop: 30,
},


});


