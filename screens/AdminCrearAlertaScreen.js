
import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './AdminCrearAlertaScreen.styles';
import { supabase } from "../screens/supabase";

export default function AdminCrearAlertaScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const tieneContenido = useMemo(
    () => titulo.trim().length > 0 || mensaje.trim().length > 0,
    [titulo, mensaje]
  );

  /** FRONT SOLAMENTE – SIN SUPABASE */
  const handleGuardar = useCallback(async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!titulo.trim() || !mensaje.trim()) {
      setErrorMsg('Completa el título y el mensaje de la alerta.');
      return;
    }

    setLoading(true);
    console.log('Guardando alerta...', { titulo: titulo.trim(), mensaje: mensaje.trim() });

        const { data, error } = await supabase
      .from('Alertas')
      .update({
        titulo: titulo.trim(),
        descripcion: mensaje.trim(),
        actualizado_en: new Date().toISOString(),
      })
      .eq('id', 4)
      .select('*');
    if (error) {
      console.error('Error al crear alerta:', error);
      setErrorMsg('Error al crear la alerta. Intenta nuevamente.');
      setLoading(false);
      return;
    }
    console.log('Alerta creada con éxito:', data);
    setSuccessMsg('Alerta creada con éxito.');
      setSuccessMsg('Alerta lista.');

      // Enviar alerta a Home
      navigation.navigate('Home');

      setTitulo('');
      setMensaje('');
      setLoading(false);

  }, [titulo, mensaje]);

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <ImageBackground
          source={require('../assets/FondoNovaHub.png')}
          style={styles.headerBg}
          imageStyle={styles.headerBgImage}
        >
          <View style={styles.headerOverlay} />

          <View style={styles.headerRow}>
            {/* Botón atrás */}
            <Pressable
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={22} color="#EEF2FF" />
            </Pressable>

            <Text style={styles.headerTitle}>Crear alerta</Text>

            <View style={{ width: 34 }} />
          </View>
        </ImageBackground>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card principal */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="megaphone-outline" size={24} color="#1E293B" />
            </View>

            <View style={styles.cardHeaderTextWrap}>
              <Text style={styles.cardTitle}>Nueva alerta global</Text>
              <Text style={styles.cardSubtitle}>
                Envía un aviso visible para todos los usuarios.
              </Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Título de la alerta</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ej: Mantenimiento programado"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mensaje</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={mensaje}
              onChangeText={setMensaje}
              placeholder="Ej: El sistema estará en mantenimiento el viernes."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}

          <View style={styles.actionsRow}>

            {/* Limpiar */}
            <Pressable
              onPress={() => {
                setTitulo('');
                setMensaje('');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              disabled={loading}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color="#475569"
                style={styles.secondaryButtonIcon}
              />
              <Text style={styles.secondaryButtonText}>Limpiar</Text>
            </Pressable>

            {/* Publicar */}
            <Pressable
              onPress={handleGuardar}
              disabled={loading}
              style={({ pressed }) => [
                styles.saveButton,
                loading && styles.saveButtonDisabled,
                pressed && !loading && styles.saveButtonPressed,
              ]}
            >
              <Ionicons
                name="send-outline"
                size={18}
                color="#FFFFFF"
                style={styles.saveButtonIcon}
              />
              <Text style={styles.saveButtonText}>
                {loading ? 'Publicando...' : 'Publicar alerta'}
              </Text>
            </Pressable>

          </View>
        </View>

        
        

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
