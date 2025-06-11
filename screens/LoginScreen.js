import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert, // ← ✅ Importante para mostrar el mensaje de error
} from 'react-native';
import { styles } from './Login.styles';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);

  const navigation = useNavigation();

  // ✅ Función con validación
  const manejarLogin = () => {
    if (!usuario.trim() || !contrasena.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa ambos campos antes de continuar.');
      return;
    }
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <TouchableOpacity onPress={() => navigation.navigate('Bienvenido')} style={styles.backButton}>
          <Text style={{ fontSize: 60, color: '#fff', lineHeight: 45 }}>↩</Text>
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome{"\n"}Back!</Text>

          <View style={styles.overlay}>
            <Text style={styles.loginTitle}>User Login</Text>

            <Text style={styles.label}>Nombre de Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor="#999"
              value={usuario}
              onChangeText={setUsuario}
            />

            <Text style={styles.label}>Insertar Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="***********"
                placeholderTextColor="#999"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry={!verContrasena}
              />
              <TouchableOpacity onPress={() => setVerContrasena(!verContrasena)}>
                <Text style={styles.toggle}>{verContrasena ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Botón decorativo por ahora; funcionalidad se implementará más adelante */}
            <TouchableOpacity>
              <Text style={styles.forgotText}>¿Has olvidado tu contraseña?</Text>
            </TouchableOpacity>

            {/* ✅ Botón con validación */}
            <TouchableOpacity style={styles.primaryButton} onPress={manejarLogin}>
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

