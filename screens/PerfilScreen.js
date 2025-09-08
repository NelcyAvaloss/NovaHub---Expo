import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { styles as s } from './Perfil.styles.js';

import { supabase } from './supabase';

export default function PerfilScreen({ navigation }) {
  const [userName, setUserName] = useState('Usuario');

  // Obtener usuario actual al cargar la pantalla
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error obteniendo usuario:', error);
        return;
      }
      const user = data?.user;
      if (user) {
        setUserName(user.user_metadata?.nombre || user.email);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, salir',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={s.container}>
      {/* Header */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        resizeMode="cover"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backBtn}
          activeOpacity={0.8}
        >
          <Text style={s.backIcon}>↩</Text>
        </TouchableOpacity>

        <View style={s.headerBar}>
          <Text style={s.headerTitle}>Perfil</Text>
        </View>

        <View style={s.diagonalCut} />
      </ImageBackground>

      {/* Avatar + nombre dinámico */}
      <View style={s.profileBlock}>
        <View style={s.avatarWrap}>
          <Image
            source={require('../assets/IconoUsuario.png')}
            style={s.avatar}
          />
          <View style={s.statusDot} />
        </View>
        <Text style={s.name}>{userName}</Text>
      </View>

      {/* Menú */}
      <View style={s.menu}>
        <TouchableOpacity style={s.menuItem} activeOpacity={0.85}>
          <Text style={s.menuItemText}>Editar Perfil</Text>
          <Text style={s.menuItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.menuItem} activeOpacity={0.85}>
          <Text style={s.menuItemText}>Temas</Text>
          <Text style={s.menuItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.menuItem} activeOpacity={0.85}>
          <Text style={s.menuItemText}>Seguridad</Text>
          <Text style={s.menuItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.menuItem} activeOpacity={0.85}>
          <Text style={s.menuItemText}>Centro de Ayuda</Text>
          <Text style={s.menuItemArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity 
        style={s.logoutBtn} 
        activeOpacity={0.9}
        onPress={handleLogout}
      >
        <Text style={s.logoutText}>Cerrar Sesión</Text>
        <Text style={s.logoutIcon}>⇨</Text>
      </TouchableOpacity>
    </View>
  );
}
