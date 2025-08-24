import React, { useState } from 'react';
import { supabase } from './supabase';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  StatusBar,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from './Registrar.styles';
import { useNavigation } from '@react-navigation/native';

export default function RegistrarScreen() {
  const [nombre, setNombre] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [universidad, setUniversidad] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);

  const navigation = useNavigation();

  const manejarRegistro = async () => {
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  if (
    !nombre.trim() ||
    !tipoUsuario.trim() ||
    !universidad.trim() ||
    !correo.trim() ||
    !contrasena.trim()
  ) {
    Alert.alert('Campos requeridos', 'Por favor completa todos los campos antes de continuar.');
    return;
  }

  if (!correoValido) {
    Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.');
    return;
  }

  // Crear usuario en supabase.auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
  email: correo,
  password: contrasena
});

if (authError) {
  Alert.alert('Error de registro', authError.message);
  return;
}

// ✅ Mostrar mensaje y redirigir al login
Alert.alert(
  'Registro exitoso',
  'Revisa tu correo para confirmar tu cuenta.',
  [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
);

const { loginData, loginError } = await supabase.auth.signInWithPassword({
  email: correo,
  password: contrasena
});

if (loginError) {
  Alert.alert('Error de inicio de sesión', loginError.message);
  return;
}

  const userId = loginData.user?.id;
  

  const { error: dbError } = await supabase
    .from('usuarios')
    .insert([
      {
        id: userId,
        nombre: nombre,
        tipo_usuario: tipoUsuario,
        universidad: universidad
      }
    ]);

  if (dbError) {
    Alert.alert('Error al guardar datos', dbError.message);
      //Alertar el id del usuario
  Alert.alert('ID de usuario', `Tu ID de usuario es: ${userId}`); 
    return;
  }


  Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada con éxito.');
  navigation.navigate('Login');
};

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={{ fontSize: 60, color: '#fff', lineHeight: 45 }}>↩</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create An{"\n"}Account</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.overlay}>
            <Text style={styles.label}>Nombre y Apellido</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre y apellido"
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Tipo de Usuario</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipoUsuario}
                onValueChange={(itemValue) => setTipoUsuario(itemValue)}
                style={styles.picker}
                dropdownIconColor="#333"
              >
                <Picker.Item label="Estudiante" value="estudiante" />
                <Picker.Item label="Docente" value="docente" />
              </Picker>
            </View>

            <Text style={styles.label}>Universidad / Institución</Text>
            <TextInput
              style={styles.input}
              placeholder="Universidad / Institución"
              placeholderTextColor="#999"
              value={universidad}
              onChangeText={setUniversidad}
            />

            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Contraseña</Text>
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

            <TouchableOpacity style={styles.primaryButton} onPress={manejarRegistro}>
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
