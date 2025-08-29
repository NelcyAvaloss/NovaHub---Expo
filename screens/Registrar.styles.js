import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Contenedor base que hace crecer el contenido y centra elementos
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Imagen de fondo que ocupa toda la pantalla
  background: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },

  // Contenedor del ScrollView que define la altura y el espaciado interno
  scrollContainer: {
    flexGrow: 1,
    minHeight: '100%', // asegura que ocupe toda la pantalla verticalmente
    justifyContent: 'flex-start',
    paddingBottom: 30,
    paddingHorizontal: 20,
  },

  // Contenedor translúcido blanco donde se colocan los campos
  overlay: {
    flex: 1, // Hace que el contenedor crezca 
    paddingHorizontal: 30, // Aplica espacio a la izquierda y derecha 
    paddingTop: 36, // Espacio interno superior, separa el contenido del borde superior del contenedor
    paddingBottom: 30, // Espacio interno inferior
    backgroundColor: 'rgba(255, 255, 255, 0.54)', // blanco con transparencia
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  // Título principal "Create an Account" 
  title: {
  fontSize: 30,                 // Tamaño del texto grande para destacar
  fontWeight: 'bold',          // Letra en negrita
  color: '#fff',               // Color blanco
  textAlign: 'right',          // Alinea el texto hacia la derecha dentro del componente Text
  alignSelf: 'flex-end',       // Posiciona el componente Text hacia el extremo derecho del contenedor
  marginRight: 30,             // Separación desde el borde derecho
  marginTop: 95,              // Espacio desde la parte superior
  marginBottom: 60,            // Espacio debajo del título
},

  // Campos de entrada de texto
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    elevation: 2,
  },

  // Contenedor del dropdown (Picker)
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },

  // Estilo del selector
  picker: {
    height: 50,
    width: '100%',
  },

  // Contenedor del campo contraseña con ícono
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    paddingHorizontal: 15,
  },

  // Campo de texto de la contraseña
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },

  // Texto para alternar visibilidad de contraseña
  toggle: {
    fontSize: 18,
    marginLeft: 10,
  },

  // Botón principal (Create Account)
  primaryButton: {
    backgroundColor: '#0e0e2c',
    borderRadius: 25,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 38, 
  },

  // Texto del botón principal
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Etiquetas para cada campo
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0e0e2c',
    alignSelf: 'flex-start',
    marginBottom: 6,
    marginLeft: 10,
  },

  // Botón de retroceso (↩) en la esquina superior izquierda
  backButton: {
    position: 'absolute',  // Se posiciona libremente sobre la pantalla
    top: 30,               // Distancia desde la parte superior
    left: 20,              // Distancia desde la izquierda
    zIndex: 10,            // Se asegura de estar por encima del contenido
  },
});
