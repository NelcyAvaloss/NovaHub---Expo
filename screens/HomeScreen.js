import React, { useRef, useContext, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  Animated,
} from 'react-native';
import { styles } from './Home.styles';
import { supabase } from './supabase';

export default function HomeScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [publicaciones, setPublicaciones] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const pubs = await obtenerPublicaciones();
      setPublicaciones(pubs || []);
    };
    fetchData();
  }, []);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('CrearPublicacion');
    });
  }, [navigation, scaleAnim]);

  const irADetalle = useCallback(
    (pub) => navigation.navigate('DetallePublicacion', { publicacion: pub }),
    [navigation]
  );
  const obtenerPublicaciones = async () => {
    const { data, error } = await supabase
      .from('Publicaciones')
      .select('*, autor:usuarios(nombre)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error al obtener publicaciones:', error);
      return [];
    }

      const publicaciones = data?.map(pub => ({
        ...pub,
        autor: pub.autor?.nombre || 'Autor',
      }));

    console.log('Publicaciones obtenidas:', publicaciones);
    return publicaciones;
  };

  const renderItem = useCallback(
    ({ item }) => {
      // 👥 Parsear colaboradores desde "equipo_colaborador"
      const colaboradores = (item?.equipo_colaborador || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      return (
        <View style={styles.publicacionContainer}>
          <View style={styles.publicacionCard}>
            {/* Header tipo Facebook */}
            <View style={styles.publicacionHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarLetter}>
                  {(item?.autor[0] || 'N').toUpperCase()}
                </Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.nombreAutor} numberOfLines={1}>
                  {item.autor || 'Autor'}
                </Text>
                <Text style={styles.fechaTexto}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Ahora'}
                </Text>
              </View>
            </View>

            {/* Título / texto */}
            {!!item.titulo && (
              <Text style={styles.publicacionTitulo} numberOfLines={2}>
                {item.titulo}
              </Text>
            )}
            {!!item.descripcion && (
              <Text style={styles.publicacionTexto} numberOfLines={3}>
                {item.descripcion}
              </Text>
            )}

            {/* Imagen */}
            {!!item.portadaUri && (
              <Image source={{ uri: item.portadaUri }} style={styles.publicacionImagen} />
            )}

            {/* Chips/meta */}
            <View style={styles.tagsRow}>
              {!!item.categoria && <Text style={styles.tagChip}>#{item.categoria}</Text>}
              {!!item.area && <Text style={styles.tagChip}>#{item.area}</Text>}
            </View>

            {/* 👥 Colaboradores */}
            {colaboradores.length > 0 && (
              <View style={styles.collabBlock}>
                <Text style={styles.collabLabel}>Colaboradores</Text>
                <View style={styles.collabRow}>
                  {colaboradores.slice(0, 5).map((name, idx) => (
                    <View key={`${name}-${idx}`} style={styles.collabPill}>
                      <Text style={styles.collabPillText}>{name}</Text>
                    </View>
                  ))}
                  {colaboradores.length > 5 && (
                    <View style={styles.collabPillMuted}>
                      <Text style={styles.collabPillMutedText}>
                        +{colaboradores.length - 5}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Footer / acciones */}
            <View style={styles.publicacionFooter}>
              <TouchableOpacity
                style={styles.verMasBtn}
                activeOpacity={0.85}
                onPress={() => irADetalle(item)}
              >
                <Text style={styles.verMasText}>Ver más</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [irADetalle]
  );

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
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.9}>
          <Image source={require('../assets/IconoBusqueda.png')} style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.titlePublicacion}>Publicaciones</Text>

      {/* Feed */}
      <View style={styles.feedContainer}>
        <FlatList
          data={publicaciones}
          keyExtractor={(item, i) => String(item?.id ?? i)}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Text style={{ color: '#6B7280' }}>Aún no hay publicaciones</Text>
            </View>
          }
          initialNumToRender={6}
        />
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Image source={require('../assets/Nav_Home.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={require('../assets/Nav_Medalla.png')} style={styles.navIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ transform: [{ scale: scaleAnim }] }}
          activeOpacity={0.9}
        >
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
