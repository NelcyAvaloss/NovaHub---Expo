import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Contenedor principal de la pantalla
  container: {
    flex: 1, // Ocupa toda la altura disponible
    backgroundColor: 'transparent', // Fondo transparente
  },

  // Imagen de fondo que ocupa todo el espacio
  background: {
    flex: 1, // Ocupa toda la pantalla
    width: '100%', // Ancho completo
    resizeMode: 'cover', // La imagen cubre el espacio sin distorsión
  },

  // Contenedor del scroll (para campos de entrada)
  scrollContainer: {
    flexGrow: 1, // Permite que el scroll crezca si es necesario
    justifyContent: 'flex-start', // Contenido alineado arriba
    paddingBottom: 30, // Espacio inferior
    paddingHorizontal: 20, // Márgenes laterales
  },

  // Estilo del texto de bienvenida superior
  welcome: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff', // Blanco
    textAlign: 'right', // Alineado a la derecha
    marginTop: 80, // Separación superior
    marginRight: 20, // Separación derecha
    marginBottom: 40, // Espacio con el contenido de abajo
  },

  // Contenedor blanco curvado inferior // PORQUE SE ME OLVIDA 
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Blanco semitransparente
    borderTopLeftRadius: 50, // Borde curvado izquierdo
    borderTopRightRadius: 50, // Borde curvado derecho
    paddingHorizontal: 30, // Márgenes internos laterales
    paddingTop: 40, // Espacio interno arriba
    paddingBottom: 30, // Espacio interno abajo
    shadowColor: '#000', // Color de sombra
    shadowOffset: { width: 0, height: -4 }, // Posición de la sombra
    shadowOpacity: 0.2, // Opacidad de la sombra
    shadowRadius: 8, // Difuminado de la sombra
  },

  // Título de la sección de login
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e0e2c', // Azul oscuro
    textAlign: 'center',
    marginBottom: 30,
  },

  // Etiquetas encima de los inputs
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0e0e2c', 
    marginBottom: 6,
    marginLeft: 5,
  },

  // Estilo general para campos de entrada
  input: {
    height: 50,
    backgroundColor: '#fff', // Fondo blanco
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    elevation: 2, // Sombra en Android
  },

  // Contenedor para el campo de contraseña (con icono de mostrar/ocultar)
  passwordContainer: {
    flexDirection: 'row', // Horizontal
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    paddingHorizontal: 15,
  },

  // Campo de texto dentro del contenedor de contraseña
  passwordInput: {
    flex: 1, // Ocupa todo el espacio disponible
    height: 50,
    fontSize: 16,
  },

  // Ícono o texto para alternar la visibilidad de la contraseña
  toggle: {
    fontSize: 18,
    marginLeft: 10,
  },

  // Texto de "¿Has olvidado tu contraseña?"
  forgotText: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#0e0e2c',
    fontWeight: '500',
  },

  // Botón principal de login
  primaryButton: {
    backgroundColor: '#0e0e2c', // Azul oscuro
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40, // Márgenes laterales
    elevation: 3,
  },

  // Texto del botón principal
  primaryButtonText: {
    color: '#fff', // Blanco
    fontSize: 16,
    fontWeight: 'bold',
  },


  // Botón de retroceso (↩) en la esquina superior izquierda
  backButton: {
    position: 'absolute',  // Se posiciona libremente sobre la pantalla
    top: 30,               // Distancia desde la parte superior
    left: 20,              // Distancia desde la izquierda
    zIndex: 10,            // Se asegura de estar por encima del contenido
  },


});

