import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { styles } from './Bienvenido.styles';
import { useNavigation } from '@react-navigation/native';

export default function BienvenidoScreen() {
  const navigation = useNavigation(); // ✅ Sin tipado porque el uso de JS puro

  return (
    <ImageBackground
      source={require('../assets/FondoNovaHub.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/LogoNovaHub.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Registrar')}
        >
          <Text style={styles.buttonText}>REGISTRARSE</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
