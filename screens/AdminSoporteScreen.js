import React from 'react';
import { SafeAreaView, View, Text, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminSoporteScreen.styles';

export default function AdminSoporteScreen() {
  return (
    <SafeAreaView style={s.screen}>
      {/* Header */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Soporte</Text>
          <Text style={s.headerSub}>Centro de ayuda y herramientas</Text>

          <View style={s.headerChipsRow}>
            <View style={[s.headerChip, s.headerChipPrimary]}>
              <Ionicons name="life-buoy" size={14} color="#EEF2FF" style={s.headerChipIcon} />
              <Text style={[s.headerChipText, s.headerChipTextPrimary]}>Admin</Text>
            </View>
            <View style={s.headerChip}>
              <Ionicons name="time-outline" size={14} color="#1E293B" style={s.headerChipIcon} />
              <Text style={s.headerChipText}>Actualizado ahora</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Cuerpo: solo el aviso */}
      <ScrollView contentContainerStyle={[s.scroll, { flexGrow: 1 }]}>
        <View
          style={{
            flex: 1,
            minHeight: 280,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Text style={{ fontSize: 16, color: '#0F172A', fontWeight: '800', marginBottom: 6 }}>
            Disponible próximamente dijo Jesús
          </Text>
          <Text style={{ fontSize: 13, color: '#475569', textAlign: 'center' }}>
            Aguanten :) Yo ya no quiero
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
