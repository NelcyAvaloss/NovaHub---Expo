import React, { useState } from 'react';
import { supabase } from './supabase';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
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
      password: contrasena,
      options: {
        data: {
          nombre: nombre,
          tipo_usuario: tipoUsuario,
          universidad: universidad,
        },
      },
    });

    if (authError) {
      console.error('Error al crear usuario en auth:', authError.message);
      Alert.alert('Error', 'Hubo un error en el registro. Por favor intenta nuevamente.');
      return;
    }

    // Solo si NO hubo error:
    Alert.alert(
      'Registro exitoso',
      'Revisa tu correo para confirmar tu cuenta. Luego inicia sesión.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
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
          <Text style={{ fontSize: 50, color: '#fff', lineHeight: 45 }}>↩</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create An{'\n'}Account</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.overlay}>
            {/* Nombre */}
            <Text style={styles.label}>Nombre y Apellido</Text>
            <TextInput
              style={[styles.input, { color: '#333' }]} 
              placeholder="Nombre y apellido"
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
              returnKeyType="next"
            />

            {/* Tipo de Usuario */}
            <Text style={styles.label}>Tipo de Usuario</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipoUsuario}
                onValueChange={(itemValue) => setTipoUsuario(itemValue)}
                style={[styles.picker, { color: '#333' }]}
                itemStyle={{ color: '#333' }} // iOS
                dropdownIconColor="#333"
                mode="dropdown"
              >
                <Picker.Item label="Selecciona un tipo..." value="" enabled={false} color="#999" />
                <Picker.Item label="Estudiante" value="estudiante" color="#999" />
                <Picker.Item label="Docente" value="docente" color="#999" />
              </Picker>
            </View>

            {/* Universidad */}
            <Text style={styles.label}>Universidad / Institución</Text>
            <TextInput
              style={[styles.input, { color: '#333' }]}
              placeholder="Universidad / Institución"
              placeholderTextColor="#999"
              value={universidad}
              onChangeText={setUniversidad}
              returnKeyType="next"
            />

            {/* Correo */}
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={[styles.input, { color: '#333' }]}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              returnKeyType="next"
            />

            {/* Contraseña */}
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, { color: '#333' }]}
                placeholder="***********"
                placeholderTextColor="#999"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry={!verContrasena}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                returnKeyType="done"
              />
              <TouchableOpacity onPress={() => setVerContrasena(!verContrasena)}>
                <Text style={styles.toggle}>{verContrasena ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Botón principal */}
            <TouchableOpacity style={styles.primaryButton} onPress={manejarRegistro}>
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
