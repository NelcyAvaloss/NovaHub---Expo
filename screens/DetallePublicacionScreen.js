import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as IntentLauncher from 'expo-intent-launcher';
import styles from './DetallePublicacion.styles';

export default function DetallePublicacionScreen({ route, navigation }) {
  const publicacion = route?.params?.publicacion;
  const [mostrarDoc, setMostrarDoc] = useState(false);
  const [falloWebViewLocal, setFalloWebViewLocal] = useState(false);

  // Campos esperados: portadaUri, pdfUri, titulo, autor, descripcion, categoria, area, equipo_colaborador
  const {
    portadaUri,
    pdfUri,
    titulo,
    autor,
    descripcion,
    categoria,
    area,
    equipo_colaborador,
  } = publicacion || {};

  const isRemote = useMemo(() => /^https?:\/\//i.test(pdfUri || ''), [pdfUri]);
  const isPDF = useMemo(() => (pdfUri || '').toLowerCase().endsWith('.pdf'), [pdfUri]);

  // 👥 Parse de colaboradores (cadena separada por comas -> array)
  const colaboradores = useMemo(() => {
    return (equipo_colaborador || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }, [equipo_colaborador]);

  // Fuente para WebView
  const webSource = useMemo(() => {
    if (!pdfUri) return null;
    if (isRemote) {
      if (isPDF) {
        const viewer = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(pdfUri)}`;
        return { uri: viewer };
      }
      return { uri: pdfUri };
    }
    // Local (file://)
    return { uri: pdfUri }; // Intento directo; si falla, ofrecemos abrir con visor del sistema
  }, [pdfUri, isRemote, isPDF]);

  const abrirConVisorDelSistema = useCallback(async () => {
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: pdfUri,
        flags: 1,
        type: 'application/pdf',
      });
    } catch (err) {
      Alert.alert('No se pudo abrir el documento', 'Intenta nuevamente o verifica que haya un visor de PDF instalado.');
    }
  }, [pdfUri]);

  if (!publicacion) {
    return (
      <View style={[styles.flex, styles.center]}>
        <Text style={styles.errorText}>Publicación no encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Botón volver */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
        <Text style={styles.backIcon}>↩</Text>
      </TouchableOpacity>

      {!mostrarDoc ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Portada */}
          {!!portadaUri && (
            <Image source={{ uri: portadaUri }} style={styles.portada} resizeMode="cover" />
          )}

          {/* Info */}
          {!!titulo && <Text style={styles.titulo}>{titulo}</Text>}
          {!!autor && <Text style={styles.autor}>por {autor}</Text>}

          <View style={styles.chipsRow}>
            {!!categoria && <Text style={styles.chip}>#{categoria}</Text>}
            {!!area && <Text style={styles.chip}>#{area}</Text>}
          </View>

          {/* 👥 Colaboradores (chips) */}
          {colaboradores.length > 0 && (
            <View style={styles.collabBlock}>
              <Text style={styles.collabLabel}>Colaboradores</Text>
              <View style={styles.collabRow}>
                {colaboradores.slice(0, 8).map((name, idx) => (
                  <View key={`${name}-${idx}`} style={styles.collabPill}>
                    <Text style={styles.collabPillText}>{name}</Text>
                  </View>
                ))}
                {colaboradores.length > 8 && (
                  <View style={styles.collabPillMuted}>
                    <Text style={styles.collabPillMutedText}>+{colaboradores.length - 8}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {!!descripcion && <Text style={styles.descripcion}>{descripcion}</Text>}

          {/* Ver documento */}
          {!!pdfUri && (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setMostrarDoc(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Ver documento</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <View style={styles.viewerWrap}>
          {/* INTENTO 1: WebView */}
          {!!webSource && !falloWebViewLocal && (
            <WebView
              source={webSource}
              originWhitelist={['*']}
              startInLoadingState
              allowsInlineMediaPlayback
              allowingReadAccessToURL={isRemote ? undefined : pdfUri} // iOS local
              onError={() => {
                if (!isRemote) setFalloWebViewLocal(true);
              }}
              style={styles.webview}
            />
          )}

          {/* FALLBACK para PDF LOCAL si el WebView no lo carga */}
          {!isRemote && (!!pdfUri) && falloWebViewLocal && (
            <View style={[styles.flex, styles.center, styles.fallback]}>
              <Text style={styles.fallbackText}>
                No se pudo mostrar el PDF local dentro de la app en este dispositivo.
              </Text>
              <TouchableOpacity style={styles.secondaryBtn} onPress={abrirConVisorDelSistema} activeOpacity={0.85}>
                <Text style={styles.secondaryBtnText}>Abrir con visor del sistema</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Cerrar visor */}
          <TouchableOpacity style={styles.closeViewerBtn} onPress={() => setMostrarDoc(false)} activeOpacity={0.85}>
            <Text style={styles.closeViewerText}>Cerrar documento</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
