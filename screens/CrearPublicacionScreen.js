import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { styles } from './CrearPublicacion.styles';

export default function CrearPublicacionScreen({ navigation }) {
  const [portadaUri, setPortadaUri] = useState(null);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarAreas, setMostrarAreas] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [areaSeleccionada, setAreaSeleccionada] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [equipo, setEquipo] = useState('');

  const categoriasConAreas = {
    'Ciencia y Tecnología': ['Desarrollo Web', 'Biotecnología', 'Robótica'],
    Farmacología: ['Farmacocinética', 'Toxicología', 'Farmacodinamia'],
    Medicina: ['Salud Pública', 'Neurología', 'Medicina Interna'],
    Ingeniería: ['Civil', 'Eléctrica', 'Mecánica'],
    Educación: ['Educación Infantil', 'Pedagogía', 'Didáctica'],
  };

  const categorias = Object.keys(categoriasConAreas);
  const areasDisponibles = categoriaSeleccionada ? categoriasConAreas[categoriaSeleccionada] : [];

  const seleccionarPortada = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a las imágenes');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPortadaUri(result.assets[0].uri);
    }
  };

  const seleccionarPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) return;

      const file = result.assets[0];
      setPdfFile({
        uri: file.uri,
        fileName: file.name,
        type: file.mimeType || 'application/pdf',
      });

      Alert.alert('PDF seleccionado', file.name);
    } catch (error) {
      console.error('Error al seleccionar PDF:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const subirPDF = async () => {
    if (!titulo || !descripcion || !pdfFile) {
      Alert.alert('Campos incompletos', 'Completa título, descripción y selecciona un PDF');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', {
      uri: pdfFile.uri,
      name: pdfFile.fileName,
      type: pdfFile.type,
    });

    try {
      const response = await fetch('https://TU_BACKEND.com/api/subir', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const resultado = await response.json();
      Alert.alert('Éxito', 'PDF subido correctamente');
      console.log(resultado);
    } catch (error) {
      console.error('Error al subir PDF:', error);
      Alert.alert('Error', 'No se pudo subir el PDF');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <ImageBackground source={require('../assets/FondoNovaHub.png')} style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
            <Text style={{ fontSize: 50, color: '#fff', lineHeight: 42 }}>↩</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nueva Publicación</Text>


        </View>
      </ImageBackground>

      <View style={styles.headerActions}>
  <TouchableOpacity
    style={styles.inputButton}
    onPress={() => {
      // Limpiar todos los campos
      setTitulo('');
      setAutor('');
      setDescripcion('');
      setEquipo('');
      setCategoriaSeleccionada('');
      setAreaSeleccionada('');
      setPortadaUri(null);
      setPdfFile(null);
      setMostrarCategorias(false);
      setMostrarAreas(false);
    }}
  >
    <Text style={styles.inputLabel}>Eliminar edición</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.inputButton}
    onPress={() => {
      // Ir a la vista Home (puedes cambiarlo por otra si luego tienes pantalla de vista previa)
      navigation.navigate('Home');
    }}
  >
    <Text style={styles.inputLabel}>Publicar</Text>
  </TouchableOpacity>
</View>


      <View style={styles.inputGroup}>
        <Text style={styles.sectionTitle}>Título</Text>
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Título" />

        <Text style={styles.sectionTitle}>Autor</Text>
        <TextInput style={styles.input} value={autor} onChangeText={setAutor} placeholder="Autor" />

        <Text style={styles.sectionTitle}>Portada</Text>
        <TouchableOpacity style={styles.inputButton} onPress={seleccionarPortada}>
          <Text style={styles.inputLabel}>Seleccionar Portada</Text>
        </TouchableOpacity>

        <View style={styles.placeholderBox}>
          {portadaUri ? (
            <Image source={{ uri: portadaUri }} style={styles.imagePreview} resizeMode="cover" />
          ) : (
            <Text style={{ color: '#999' }}>No hay imagen seleccionada</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <TextInput
          style={styles.input}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Descripción"
        />

        <Text style={styles.sectionTitle}>Equipo Colaborador</Text>
        <TextInput
          style={styles.input}
          value={equipo}
          onChangeText={setEquipo}
          placeholder="Colaboradores"
        />

        <Text style={styles.sectionTitle}>Categoría y Área</Text>
        <View style={styles.rowButtons}>
          <TouchableOpacity style={styles.optionButton} onPress={() => setMostrarCategorias(!mostrarCategorias)}>
            <Text style={styles.buttonText}>{categoriaSeleccionada || 'Categoría'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setMostrarAreas(!mostrarAreas)}
            disabled={!categoriaSeleccionada}
          >
            <Text style={styles.buttonText}>{areaSeleccionada || 'Área'}</Text>
          </TouchableOpacity>
        </View>

        {mostrarCategorias &&
          categorias.map((cat, i) => (
            <TouchableOpacity
              key={i}
              style={styles.optionButton}
              onPress={() => {
                setCategoriaSeleccionada(cat);
                setAreaSeleccionada('');
                setMostrarCategorias(false);
              }}
            >
              <Text style={styles.buttonText}>{cat}</Text>
            </TouchableOpacity>
          ))}

        {mostrarAreas &&
          areasDisponibles.map((area, i) => (
            <TouchableOpacity
              key={i}
              style={styles.optionButton}
              onPress={() => {
                setAreaSeleccionada(area);
                setMostrarAreas(false);
              }}
            >
              <Text style={styles.buttonText}>{area}</Text>
            </TouchableOpacity>
          ))}

        <Text style={styles.sectionTitle}>Archivo PDF</Text>
        {!pdfFile && (
          <TouchableOpacity onPress={seleccionarPDF} style={styles.optionButton}>
            <Text style={styles.buttonText}>Seleccionar PDF</Text>
          </TouchableOpacity>
        )}

        {pdfFile && (
          <View style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: 'bold' }}>{pdfFile.fileName}</Text>
            <TouchableOpacity onPress={() => setPdfFile(null)} style={styles.optionButton}>
              <Text style={styles.buttonText}>Eliminar PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={subirPDF} style={[styles.optionButton, { backgroundColor: 'green' }]}>
              <Text style={[styles.buttonText, { color: 'white' }]}>Subir PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}