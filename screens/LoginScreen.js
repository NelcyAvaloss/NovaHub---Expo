import React, { useState, useRef } from 'react';
import { supabase } from './supabase';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { styles } from './Login.styles';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);

  const navigation = useNavigation();

  // 👉 refs para controlar el scroll cuando se enfoca el password
  const scrollRef = useRef(null);

  const manejarLogin = async () => {
    if (!usuario.trim() || !contrasena.trim()) {
      Alert.alert('Campos requeridos', 'Por favor completa ambos campos antes de continuar.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: usuario,
      password: contrasena,
    });

    console.log('Data:', data);
    console.log('Error:', error);

    if (error) {
      Alert.alert('Error al iniciar sesión', error.message);
      return;
    }

    Alert.alert('Login exitoso', 'Bienvenido!');
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
          <Text style={{ fontSize: 50, color: '#fff', lineHeight: 45 }}>↩</Text>
        </TouchableOpacity>

        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome{"\n"}Back!</Text>

          <View style={styles.overlay}>
            {/* ⬇️ Hace que el layout se acomode con el teclado */}
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
              keyboardVerticalOffset={0}
            >
              {/* ⬇️ Permite desplazarse cuando el teclado aparece */}
              <ScrollView
                ref={scrollRef}
                contentContainerStyle={{ paddingBottom: 60 }}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.loginTitle}>User Login</Text>

                <Text style={styles.label}>Correo de usuario</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Correo de usuario"
                  placeholderTextColor="#999"
                  value={usuario}
                  onChangeText={setUsuario}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
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
                    returnKeyType="done"
                    // ⬇️ Al enfocar, baja el scroll para que quede visible
                    onFocus={() => {
                      setTimeout(() => {
                        scrollRef.current?.scrollToEnd({ animated: true });
                      }, 100);
                    }}
                  />
                  <TouchableOpacity onPress={() => setVerContrasena(!verContrasena)}>
                    <Text style={styles.toggle}>{verContrasena ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Recuperacion')}>
                  <Text style={styles.forgotText}>¿Has olvidado tu contraseña?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryButton} onPress={manejarLogin}>
                  <Text style={styles.primaryButtonText}>Login</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
