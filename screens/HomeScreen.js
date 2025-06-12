import React, { useRef, useContext } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  Animated,
  Alert,
  Linking,
} from 'react-native';
import { PublicacionContext } from '../contexts/PublicacionContext';
import { styles } from './Home.styles';
import * as IntentLauncher from 'expo-intent-launcher';

export default function HomeScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { publicaciones } = useContext(PublicacionContext);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('CrearPublicacion');
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/FondoNovaHub.png')} style={styles.headerBackground}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Image source={require('../assets/IconoUsuario.png')} style={styles.profileIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>NovaHub</Text>
          <TouchableOpacity>
            <Image source={require('../assets/IconoNotificacion.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchBar}>
          <Image source={require('../assets/IconoBusqueda.png')} style={styles.searchIcon} />
          <TextInput placeholder="Buscar" placeholderTextColor="#999" style={styles.searchInput} />
        </TouchableOpacity>
      </View>

      <Text style={styles.titlePublicacion}>Publicaciones</Text>

      <FlatList
        data={publicaciones}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.portadaUri }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardSubtitle}>Autor: {item.autor}</Text>
            <Text style={styles.cardSubtitle}>Categoría: {item.categoria} - {item.area}</Text>

            {item.pdfUri && (
              <TouchableOpacity
                style={styles.verPdfButton}
                onPress={async () => {
                  try {
                    console.log('Abriendo PDF:', item.pdfUri); // 🪵 log para depuración
                    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                      data: item.pdfUri,
                      flags: 1,
                      type: 'application/pdf',
                    });
                  } catch (error) {
                    Alert.alert('Nota:', 'Esta opcion se habilitara proximamente');
                    console.log('Error abriendo PDF:', error);
                  }
                }}
              >
                <Text style={styles.verPdfText}>Ver Mas</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Image source={require('../assets/Nav_Home.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/Nav_Medalla.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('CrearPublicacion')}>
          <Image source={require('../assets/Nav_Publicacion.png')} style={styles.publicarIcono} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/Nav_Usuario.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/Nav_Chat.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
