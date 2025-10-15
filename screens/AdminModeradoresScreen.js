import React from 'react';
import { SafeAreaView, View, Text, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminModeradoresScreen.styles';

export default function AdminModeradoresScreen() {
  return (
    <SafeAreaView style={s.screen}>
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Moderadores</Text>
          <Text style={s.headerSub}>Gestión del equipo de moderación</Text>

          <View style={s.headerChipsRow}>
            <View style={[s.headerChip, s.headerChipPrimary]}>
              <Ionicons name="shield-checkmark" size={14} color="#EEF2FF" style={s.headerChipIcon} />
              <Text style={[s.headerChipText, s.headerChipTextPrimary]}>Panel</Text>
            </View>
            <View style={s.headerChip}>
              <Ionicons name="time-outline" size={14} color="#1E293B" style={s.headerChipIcon} />
              <Text style={s.headerChipText}>Actualizado ahora</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* (Sin contenido; solo header) */}
      <View style={{ height: 16 }} />
    </SafeAreaView>
  );
}
