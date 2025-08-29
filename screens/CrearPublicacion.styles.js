// CrearPublicacion.styles.js
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

  headerContent: {
    marginTop: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  backButton: {
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    top: 12,
    alignSelf: 'center'
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
});


