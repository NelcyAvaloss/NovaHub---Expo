import React, { useState, useCallback, useMemo, useEffect } from 'react';
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

const MS_24H = 24 * 60 * 60 * 1000; // 24 horas

export default function AdminCrearAlertaScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // alerta que ya está guardada en la BD (si hay)
  const [currentAlert, setCurrentAlert] = useState(null);

  const tieneContenido = useMemo(
    () => titulo.trim().length > 0 || mensaje.trim().length > 0,
    [titulo, mensaje]
  );

  // Cargar alerta actual y aplicar expiración de 24h
  const fetchCurrentAlert = useCallback(async () => {
    try {
      setErrorMsg('');

      const { data, error } = await supabase
        .from('Alertas')
        .select('*')
        .order('actualizado_en', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error al obtener alerta actual:', error);
        return;
      }

      if (!data || data.length === 0) {
        setCurrentAlert(null);
        return;
      }

      const alerta = data[0];

      // si título/descripcion ya están vacíos, consideramos que no hay alerta
      if (!alerta.titulo && !alerta.descripcion) {
        setCurrentAlert(null);
        return;
      }

      const fechaRaw =
        alerta.actualizado_en ||
        alerta.updated_at ||
        alerta.created_at ||
        null;

      if (fechaRaw) {
        const msFecha = new Date(fechaRaw).getTime();
        const diff = Date.now() - msFecha;

        // Si ya pasaron más de 24 horas, "limpiar" la alerta (solo titulo/descripcion)
        if (diff > MS_24H) {
          try {
            await supabase
              .from('Alertas')
              .update({
                // 👇 cadenas vacías (NOT NULL no se queja)
                titulo: '',
                descripcion: '',
                // NO tocamos actualizado_en
              })
              .eq('id', alerta.id);
          } catch (e) {
            console.error('Error al limpiar alerta expirada:', e);
          }
          setCurrentAlert(null);
          return;
        }
      }

      setCurrentAlert(alerta);
    } catch (e) {
      console.error('Error en fetchCurrentAlert:', e);
    }
  }, []);

  useEffect(() => {
    fetchCurrentAlert();
  }, [fetchCurrentAlert]);

  const handleGuardar = useCallback(async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!titulo.trim() || !mensaje.trim()) {
      setErrorMsg('Completa el título y el mensaje de la alerta.');
      return;
    }

    try {
      setLoading(true);
      console.log('Guardando alerta...', {
        titulo: titulo.trim(),
        mensaje: mensaje.trim(),
      });

      const { data, error } = await supabase
        .from('Alertas')
        .update({
          titulo: titulo.trim(),
          descripcion: mensaje.trim(),
          actualizado_en: new Date().toISOString(), // punto de partida para las 24h
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
      setSuccessMsg('Alerta lista.');

      // actualizar alerta actual en esta pantalla
      const alerta = data && data.length ? data[0] : null;
      setCurrentAlert(alerta || null);

      // limpiar inputs
      setTitulo('');
      setMensaje('');

      // avisar a Home para que se refresque
      navigation.navigate('Home', { alerta });

    } catch (e) {
      console.error('Error inesperado al guardar alerta:', e);
      setErrorMsg('Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  }, [titulo, mensaje, navigation]);

  const handleEliminarAlerta = useCallback(async () => {
    if (!currentAlert?.id) return;

    try {
      setErrorMsg('');
      setSuccessMsg('');
      setLoading(true);

      const { error } = await supabase
        .from('Alertas')
        .update({
          // 👇 en vez de null, cadenas vacías
          titulo: '',
          descripcion: '',
          // opcional: podrías poner actualizado_en: new Date().toISOString()
        })
        .eq('id', currentAlert.id);

      if (error) {
        console.error('Error al eliminar alerta:', error);
        setErrorMsg('No se pudo eliminar la alerta. Intenta nuevamente.');
        setLoading(false);
        return;
      }

      setCurrentAlert(null);
      setSuccessMsg('Alerta eliminada correctamente.');

      // también notificar a Home para que deje de mostrarla
      navigation.navigate('Home', { alerta: null });
    } catch (e) {
      console.error('Error inesperado al eliminar alerta:', e);
      setErrorMsg('Ocurrió un error inesperado al eliminar la alerta.');
    } finally {
      setLoading(false);
    }
  }, [currentAlert, navigation]);

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

        {/* === ALERTA ACTIVA (debajo del contenedor de alerta global) === */}
        {currentAlert && (currentAlert.titulo || currentAlert.descripcion) && (
          <View
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 16,
              backgroundColor: '#FEF3C7',
              borderWidth: 1,
              borderColor: '#FBBF24',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="alert-circle" size={20} color="#B45309" />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#92400E',
                }}
              >
                Alerta activa
              </Text>
            </View>

            {currentAlert.titulo ? (
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: '#78350F',
                  marginBottom: 4,
                }}
              >
                {currentAlert.titulo}
              </Text>
            ) : null}

            {currentAlert.descripcion ? (
              <Text
                style={{
                  fontSize: 14,
                  color: '#92400E',
                  marginBottom: 12,
                }}
              >
                {currentAlert.descripcion}
              </Text>
            ) : null}

            <Pressable
              onPress={handleEliminarAlerta}
              disabled={loading}
              style={({ pressed }) => ({
                marginTop: 4,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: pressed ? '#DC2626' : '#EF4444',
                opacity: loading ? 0.7 : 1,
              })}
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color="#FEF2F2"
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#FEF2F2',
                }}
              >
                Eliminar alerta
              </Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
