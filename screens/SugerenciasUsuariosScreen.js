// SugerenciasUsuariosScreen.js
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles as s } from './SugerenciasUsuarios.styles';
import { styles as homeStyles } from './Home.styles';
import { supabase } from './supabase';

export default function SugerenciasUsuariosScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // ===== Helpers FLEXIBLES =====
  const getNombre = (u) =>
    u?.nombre || u?.display_name || u?.full_name || u?.username || 'Usuario';

  const getRol = (u) =>
    u?.rol || u?.tipo_usuario || u?.perfil || u?.cargo || 'Estudiante';

  const getInstitucion = (u) =>
    u?.universidad ||
    u?.institucion ||
    u?.institucion_educativa ||
    'Universidad Gerardo Barrios';

  const getAvatarUri = (u) =>
    u?.avatar_uri || u?.avatar_url || u?.foto || u?.foto_perfil || null;

  const getUserId = (u) => u?.id ?? u?.auth_id ?? u?.user_id ?? null;

  // clave única para cada usuario (para poder ocultarlo bien)
  const getUserKey = (u) => {
    const id = getUserId(u);
    if (id) return `id::${id}`;
    return `name::${getNombre(u)}`;
  };

  // ===== Cargar usuarios reales =====
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(60);

        if (error) throw error;

        const filtrados = (data || []).filter(
          (u) => !!(getUserId(u) || getNombre(u))
        );

        setUsuarios(filtrados);
      } catch (e) {
        console.log('[SugerenciasUsuarios] Error al cargar usuarios:', e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // ===== FILTRO del buscador =====
  const filteredUsuarios = useMemo(() => {
    const term = (searchText || '').trim().toLowerCase();
    if (!term) return usuarios;

    return usuarios.filter((u) => {
      const texto = [
        getNombre(u),
        getRol(u),
        getInstitucion(u),
        u?.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return texto.includes(term);
    });
  }, [usuarios, searchText]);

  // ===== Navegar al perfil del usuario (por NOMBRE) =====
  const abrirPerfilPorNombre = useCallback(
    (user) => {
      navigation.navigate('PerfilUsuario', {
        perfil: {
          nombre: getNombre(user),
          rol: getRol(user),
          universidad: getInstitucion(user),
          email: user?.email || null,
          avatarUri: getAvatarUri(user),
        },
      });
    },
    [navigation]
  );

  // ===== Ocultar usuario al tocar la X =====
  const ocultarUsuario = useCallback((user) => {
    const key = getUserKey(user);
    setUsuarios((prev) => prev.filter((u) => getUserKey(u) !== key));
  }, []);

  // ===== Render card según tu prototipo =====
  const renderUsuario = ({ item }) => {
    const nombre = getNombre(item);
    const rol = getRol(item);
    const institucion = getInstitucion(item);
    const avatarUri = getAvatarUri(item);

    return (
      <View style={s.card}>
        {/* Botón X arriba derecha: oculta este usuario de la lista */}
        <TouchableOpacity
          style={s.cardCloseWrap}
          activeOpacity={0.7}
          onPress={() => ocultarUsuario(item)}
        >
          <Text style={s.cardCloseText}>✕</Text>
        </TouchableOpacity>

        {/* Avatar */}
        <View style={s.cardTop}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={s.avatarImg} />
          ) : (
            <View style={s.avatarCircle}>
              <Text style={s.avatarInitial}>
                {(nombre?.[0] || 'U').toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* INFO */}
        <View style={s.cardBottom}>
          {/* NOMBRE CLICKEABLE → Perfil */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => abrirPerfilPorNombre(item)}
          >
            <Text
              numberOfLines={2}
              style={[s.cardName, { textAlign: 'center' }]}
            >
              {nombre}
            </Text>
          </TouchableOpacity>

          <Text numberOfLines={1} style={s.cardRole}>
            {rol}
          </Text>

          <Text numberOfLines={1} style={s.cardInstitution}>
            {institucion}
          </Text>

          {/* Botón Seguir centrado */}
          <TouchableOpacity
            style={[s.followBtn, { alignSelf: 'center' }]}
            activeOpacity={0.85}
          >
            <Text style={s.followBtnPlus}>＋</Text>
            <Text style={s.followBtnText}>Seguir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      {/* ===== HEADER  ===== */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
      >
        <View style={s.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={s.backBtn}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={s.headerTitle}>Sugerencias de usuarios</Text>

          <View style={{ width: 32 }} />
        </View>
      </ImageBackground>

      {/* ===== BUSCADOR  ===== */}
      <View style={[homeStyles.searchContainer, { marginTop: 8 }]}>
        <TouchableOpacity style={homeStyles.searchBar} activeOpacity={0.9}>
          <Image
            source={require('../assets/IconoBusqueda.png')}
            style={homeStyles.searchIcon}
          />
          <TextInput
            placeholder="Buscar usuarios..."
            placeholderTextColor="#999"
            style={homeStyles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
        </TouchableOpacity>
      </View>

      {/* ===== CONTENIDO ===== */}
      <View style={s.content}>
        {loading ? (
          <View style={s.loadingBox}>
            <ActivityIndicator size="small" color="#0f172a" />
            <Text style={s.loadingText}>Cargando sugerencias...</Text>
          </View>
        ) : filteredUsuarios.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyText}>No se encontraron usuarios.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsuarios}
            renderItem={renderUsuario}
            keyExtractor={(item, index) => String(getUserKey(item) ?? index)}
            numColumns={2}
            columnWrapperStyle={s.columnWrapper}
            contentContainerStyle={s.listContent}
          />
        )}
      </View>
    </View>
  );
}
