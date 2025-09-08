import React, { useState, useContext, useEffect } from 'react';
import { PublicacionContext } from '../contexts/PublicacionContext';
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
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
  const [autor, setAutor] = useState(''); // se llena desde Supabase
  const [descripcion, setDescripcion] = useState('');
  const [equipo, setEquipo] = useState('');

  const { agregarPublicacion } = useContext(PublicacionContext);

  const categoriasConAreas = {
    'Ciencia y Tecnología': ['Desarrollo Web', 'Biotecnología', 'Robótica'],
    Farmacología: ['Farmacocinética', 'Toxicología', 'Farmacodinamia'],
    Medicina: ['Salud Pública', 'Neurología', 'Medicina Interna'],
    Ingeniería: ['Civil', 'Eléctrica', 'Mecánica'],
    Educación: ['Educación Infantil', 'Pedagogía', 'Didáctica'],
  };
  const categorias = Object.keys(categoriasConAreas);
  const areasDisponibles = categoriaSeleccionada ? categoriasConAreas[categoriaSeleccionada] : [];

  // Cargar nombre del usuario desde user_metadata.nombre
  useEffect(() => {
    let unsub = null;

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        const nom = data.user.user_metadata?.nombre ?? '';
        if (nom) setAutor(nom);
      }
    };

    loadUser();

    unsub = supabase.auth.onAuthStateChange((_event, session) => {
      const nom = session?.user?.user_metadata?.nombre ?? '';
      if (nom) setAutor(nom);
      else setAutor('');
    }).data.subscription;

    return () => {
      if (unsub) unsub.unsubscribe();
    };
  }, []);

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
      const destinationPath = FileSystem.documentDirectory + file.name;
      await FileSystem.copyAsync({ from: file.uri, to: destinationPath });

      setPdfFile({
        uri: destinationPath,
        fileName: file.name,
        type: file.mimeType || 'application/pdf',
      });

      Alert.alert('PDF seleccionado', file.name);
    } catch (error) {
      console.error('Error al seleccionar PDF:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

    const guardarPublicacion = async () => {

    if (!titulo || !autor || !descripcion || !categoriaSeleccionada || !areaSeleccionada || !pdfFile || !portadaUri) {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos');
      return;
    }
    try{
      const idAutor = await obtenerIdUsuario();
      if (!idAutor) throw new Error("Usuario no autenticado");
      const urlPortada = await subirPortada(portadaUri);
      const urlPDF = await subirPDF(pdfFile.uri);
      //Obtiene el id del usuario actual en supabase

    const nueva = {
      id: Date.now(),
      titulo,
      id_autor: idAutor,
      descripcion,
      equipo_colaborador: equipo,
      categoria: categoriaSeleccionada,
      area: areaSeleccionada,
      portadaUri: urlPortada,
      pdfUri: urlPDF,
    };

    //Subirla a supabase
    const { data, error } = await supabase.from('Publicaciones').insert([nueva]);

    if (error) {
      Alert.alert('Error al guardar publicación', error.message);
      return;
    }
    Alert.alert('Éxito', 'Publicación guardada correctamente');
    navigation.navigate('Home');
  }
  catch(error){
    console.error("Error al guardar publicación:", error);
    return;
  }

  };
    const obtenerIdUsuario = async () => {
    const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error obteniendo usuario:", error.message);
      } else if (data.user) {
        return data.user.id;
      }
  }
  const subirPortada = async (uriPortada) => {
    try {
      // Subir a supabase, al bucket 'portadas'
      console.log("Iniciando subida de portada...");
    const nombreArchivo = `portadas/${Date.now()}.jpeg`;

    // Leer el archivo como base64
    const base64 = await FileSystem.readAsStringAsync(uriPortada, { encoding: FileSystem.EncodingType.Base64 });
    // Convertir base64 a array de bytes
    const byteArray = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    // Subir a supabase
    const { data, error } = await supabase.storage
      .from('portadas')
      .upload(nombreArchivo, byteArray, {
        cacheControl: '3600',
        contentType: 'image/jpeg',
        upsert: false,
      });

        if(error) throw error;

        console.log("Portada subida:", data);
        const {data: publicUrlData} = await supabase.storage.from('portadas').getPublicUrl(nombreArchivo);
        console.log("URL pública de la portada:", publicUrlData);
        return publicUrlData.publicUrl;
    } catch (error) {
      Alert.alert('Error al subir portada', error.message);
    }

  };
  
  const subirPDF = async (pdfUri) => {
  try {
    const nombreArchivo = `pdfs/${Date.now()}.pdf`;

    // Leer el archivo PDF como base64
    const base64 = await FileSystem.readAsStringAsync(pdfUri, { encoding: FileSystem.EncodingType.Base64 });
    // Convertir base64 a array de bytes
    const byteArray = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    // Subir a Supabase
    const { data, error } = await supabase.storage
      .from('documentos')
      .upload(nombreArchivo, byteArray, {
        cacheControl: '3600',
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) throw error;
    console.log('PDF subido:', data);
    const { data: publicUrlData } = await supabase.storage.from('documentos').getPublicUrl(nombreArchivo);
    console.log('URL pública del PDF:', publicUrlData);
    return publicUrlData.publicUrl;
    } catch (error) {
    Alert.alert('Error al subir PDF', error.message);
  }
};

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <ImageBackground source={require('../assets/FondoNovaHub.png')} style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
            <Text style={{ fontSize: 40, color: '#fff', lineHeight: 40 }}>↩</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nueva Publicación</Text>
        </View>
      </ImageBackground>

      <View style={styles.inputGroup}>

         {/* Autor: solo lectura */}
        <Text style={styles.sectionTitle}>Autor</Text>
        <TextInput
          style={[styles.input, { color: '#6B7280', opacity: 0.9 }]}
          value={autor}
          editable={false}
          selectTextOnFocus={false}
          placeholder="(se completa automáticamente)"
          placeholderTextColor="#8c8c8dff"
        />

        <Text style={styles.sectionTitle}>Título</Text>
        <TextInput
          style={[styles.input, { color: '#6B7280' }]}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título"
          placeholderTextColor="#8c8c8dff"
          cursorColor="#6B7280"
          selectionColor="#6B7280"
        />
   

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
          style={[styles.input, { color: '#6B7280' }]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Descripción"
          placeholderTextColor="#8c8c8dff"
          cursorColor="#6B7280"
          selectionColor="#6B7280"
        />

        <Text style={styles.sectionTitle}>Equipo Colaborador</Text>
        <TextInput
          style={[styles.input, { color: '#6B7280' }]}
          value={equipo}
          onChangeText={setEquipo}
          placeholder="Colaboradores"
          placeholderTextColor="#8c8c8dff"
          cursorColor="#6B7280"
          selectionColor="#6B7280"
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
          </View>
        )}

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => {
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

          <TouchableOpacity style={styles.inputButton} onPress={guardarPublicacion}>
            <Text style={styles.inputLabel}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
