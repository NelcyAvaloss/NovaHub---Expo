import React from 'react';
import { SafeAreaView, View, Text, Pressable, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './AdminDashboardScreen.styles';

export default function AdminDashboardScreen({ navigation }) {
  // MOCK 
  const kpis = {
    newUsers: 8,
    publications: 21,
    openReports: 3,
    approvalRate: 89, // %
  };

  const lastPosts = [
    { id: 'p1', title: 'Investigación Nuevas Tecnologías', author: 'María' },
    { id: 'p2', title: 'Tips de productividad', author: 'Geovanny' },
  ];

  const lastReports = [
    { id: 'r1', reason: 'Spam', target: 'p2' },
    { id: 'r2', reason: 'Agresión', target: 'u3' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== Header ===== */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={styles.headerBg}
        imageStyle={styles.headerBgImage}
      >
        <View style={styles.headerOverlay} />

        <View style={styles.headerTopRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoDot} />
            <Text style={styles.brandText}>NovaHub</Text>
          </View>

          <Pressable style={styles.avatar} onPress={() => navigation.navigate('AdminProfile')}>
            <Ionicons name="person" size={18} color="#0F172A" />
          </Pressable>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.chipsRow}>
            <View style={[styles.chip, styles.chipPrimary]}>
              <Ionicons name="calendar-outline" size={14} color="#EEF2FF" style={styles.chipIcon} />
              <Text style={[styles.chipText, styles.chipTextPrimary]}>Últimos 30 días</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="time-outline" size={14} color="#1E293B" style={styles.chipIcon} />
              <Text style={styles.chipText}>Actualizado ahora</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* ===== Contenido scrollable (debajo del header) ===== */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* RESUMEN (KPIs) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Resumen</Text>

          <View style={styles.kpiGrid}>
            {/* KPI: Usuarios nuevos */}
            <View style={styles.kpiCardSimple}>
              <View style={styles.kpiDeltaAbsolute}>
                <View style={[styles.deltaBadge, styles.deltaUp]}>
                  <Ionicons name="arrow-up" size={12} color="#166534" />
                  <Text style={styles.deltaTextUp}>+12%</Text>
                </View>
              </View>

              <View style={[styles.kpiIconWrap, styles.kpiIconIndigo]}>
                <Ionicons name="person-add" size={20} color="#4338CA" />
              </View>

              <Text style={styles.kpiValueBig}>{kpis.newUsers}</Text>
              <Text style={styles.kpiLabelCenter} numberOfLines={2}>Usuarios nuevos</Text>
            </View>

            {/* KPI: Publicaciones */}
            <View style={styles.kpiCardSimple}>
              <View style={styles.kpiDeltaAbsolute}>
                <View style={[styles.deltaBadge, styles.deltaUp]}>
                  <Ionicons name="arrow-up" size={12} color="#166534" />
                  <Text style={styles.deltaTextUp}>+5%</Text>
                </View>
              </View>

              <View style={[styles.kpiIconWrap, styles.kpiIconSky]}>
                <Ionicons name="document-text" size={20} color="#0369A1" />
              </View>

              <Text style={styles.kpiValueBig}>{kpis.publications}</Text>
              <Text style={styles.kpiLabelCenter} numberOfLines={2}>Publicaciones</Text>
            </View>

            {/* KPI: Reportes abiertos */}
            <View style={styles.kpiCardSimple}>
              <View style={styles.kpiDeltaAbsolute}>
                <View style={[styles.deltaBadge, styles.deltaDown]}>
                  <Ionicons name="arrow-down" size={12} color="#991B1B" />
                  <Text style={styles.deltaTextDown}>-3%</Text>
                </View>
              </View>

              <View style={[styles.kpiIconWrap, styles.kpiIconAmber]}>
                <Ionicons name="alert-circle" size={20} color="#92400E" />
              </View>

              <Text style={styles.kpiValueBig}>{kpis.openReports}</Text>
              <Text style={styles.kpiLabelCenter} numberOfLines={2}>Reportes abiertos</Text>
            </View>

            {/* KPI: Tasa de aprobación */}
            <View style={styles.kpiCardSimple}>
              <View style={styles.kpiDeltaAbsolute}>
                <View style={[styles.deltaBadge, styles.deltaUp]}>
                  <Ionicons name="arrow-up" size={12} color="#166534" />
                  <Text style={styles.deltaTextUp}>+2%</Text>
                </View>
              </View>

              <View style={[styles.kpiIconWrap, styles.kpiIconEmerald]}>
                <Ionicons name="checkmark-done" size={20} color="#065F46" />
              </View>

              <Text style={styles.kpiValueBig}>{kpis.approvalRate}%</Text>
              <Text style={styles.kpiLabelCenter} numberOfLines={2}>Tasa de aprobación</Text>
            </View>
          </View>
        </View>

        {/* Contenido: Listas rápidas */}
        <View style={styles.doubleCol}>
          {/* Últimas publicaciones */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Últimas publicaciones</Text>
              <Pressable style={styles.linkRow} onPress={() => navigation.navigate('AdminPublications')}>
                <Text style={styles.linkText}>Ver todo</Text>
                <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
              </Pressable>
            </View>

            {lastPosts.map((it, idx) => (
              <Pressable
                key={it.id}
                style={[styles.rowItem, idx !== 0 && styles.rowItemBorder]}
                onPress={() => navigation.navigate('AdminPublicationDetall', { pubId: it.id })}
              >
                <View style={styles.rowLeft}>
                  <View style={styles.dot} />
                  <View style={styles.rowTextWrap}>
                    <Text numberOfLines={1} style={styles.rowTitle}>{it.title}</Text>
                    <Text style={styles.rowSub}>por {it.author}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>

            {/* Últimos reportes */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Últimos reportes</Text>
              <Pressable style={styles.linkRow} onPress={() => navigation.navigate('AdminReports')}>
                <Text style={styles.linkText}>Ver todo</Text>
                <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
              </Pressable>
            </View>

            {lastReports.map((it, idx) => (
              <Pressable
                key={it.id}
                style={[styles.rowItem, idx !== 0 && styles.rowItemBorder]}
                onPress={() => navigation.navigate('AdminReportDetall', { reportId: it.id })}
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.dot, styles.dotWarning]} />
                  <View style={styles.rowTextWrap}>
                    <Text numberOfLines={1} style={styles.rowTitle}>Reporte {it.id}</Text>
                    <Text style={styles.rowSub}>{it.reason}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Acciones rápidas */}
        <View style={styles.ctaRow}>
          <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => navigation.navigate('AdminUsers')}>
            <Ionicons name="people" size={16} color="#FFFFFF" style={styles.btnIcon} />
            <Text style={styles.btnPrimaryText}>Ver usuarios</Text>
          </Pressable>

          <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => navigation.navigate('AdminModeradores')}>
            <Ionicons name="shield-checkmark" size={16} color="#3730A3" style={styles.btnIcon} />
            <Text style={styles.btnGhostText}>Ir a Moderación</Text>
          </Pressable>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
