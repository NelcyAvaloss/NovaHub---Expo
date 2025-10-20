// AdminDashboardScreen.js
// Dashboard conectado a Supabase (sin mocks):
// - KPIs (usuarios totales via servicio, publicaciones 30d, reportes abiertos, tasa aprobación)
// - Últimas publicaciones y reportes
// - Pull-to-refresh, auto-refresh al enfocar, realtime

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  SafeAreaView, View, Text, Pressable, Image, ImageBackground,
  ScrollView, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import styles from './AdminDashboardScreen.styles';

// Ajusta rutas si tu client/servicios están en otro lado
import { supabase } from '../screens/supabase';
import { contadoresUsuarios } from '../services/usuariosService';

export default function AdminDashboardScreen({ navigation }) {
  // Estado de KPIs y listas
  const [kpis, setKpis] = useState({
    newUsers: 0,          // aquí mostramos "Usuarios totales" (desde contadoresUsuarios)
    publications: 0,      // publicaciones creadas últimos 30 días
    openReports: 0,       // reportes abiertos
    approvalRate: 0       // % aprobadas (últimos 30 días)
  });
  const [lastPosts, setLastPosts] = useState([]);     // últimas publicaciones
  const [lastReports, setLastReports] = useState([]); // últimos reportes
  const [refreshing, setRefreshing] = useState(false);

  // Ventana "Últimos 30 días"
  const fromISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString();
  }, []);

  // Loader principal
  const loadDashboard = useCallback(async () => {
    try {
      // 1) Usuarios: usar el servicio probado (total/activos/bloqueados)
      const mRes = await contadoresUsuarios();
      const totals = mRes?.ok ? mRes.data : { total: 0, activos: 0, bloqueados: 0 };

      // Opcional (nuevos 30d): si querés mostrar "usuarios nuevos 30d", descomenta:
      // let newUsers30d = 0;
      // try {
      //   const { count } = await supabase
      //     .from('usuarios')
      //     .select('*', { count: 'exact', head: true })
      //     .gte('created_at', fromISO);
      //   newUsers30d = count || 0;
      // } catch {}

      // 2) Publicaciones 30d
      const { count: publications } = await supabase
        .from('Publicaciones')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', fromISO);

      // 3) Reportes abiertos
      const { count: openReports } = await supabase
        .from('Reportes')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'abierto');

      // 4) Tasa de aprobación (%) = aprobadas_30d / publicaciones_30d
      const { count: aprobadas } = await supabase
        .from('Publicaciones')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'aprobada')
        .gte('created_at', fromISO);

      const approvalRate =
        publications && publications > 0
          ? Math.round((aprobadas || 0) * 100 / publications)
          : 0;

      setKpis({
        // A) Mostrar usuarios TOTALES (recomendado si antes veías 0):
        newUsers: totals.total,
        // B) Si prefieres "Usuarios nuevos (30d)", usa: newUsers: newUsers30d,
        publications: publications || 0,
        openReports: openReports || 0,
        approvalRate
      });

      // 5) Últimas publicaciones
      const { data: postsData } = await supabase
        .from('Publicaciones')
        .select('id, titulo, autor, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setLastPosts(
        (postsData || []).map(p => ({
          id: String(p.id),
          title: p.titulo || 'Sin título',
          author: p.autor || '—',
        }))
      );

      // 6) Últimos reportes
      const { data: reportsData } = await supabase
        .from('Reportes')
        .select('id, motivo, target_id, estado, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setLastReports(
        (reportsData || []).map(r => ({
          id: String(r.id),
          reason: r.motivo || r.estado || 'Reporte',
          target: r.target_id ? String(r.target_id) : '—',
        }))
      );
    } catch (e) {
      console.warn('loadDashboard error', e);
    }
  }, [fromISO]);

  // Carga al montar
  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // Refresco al enfocar la pantalla
  useFocusEffect(useCallback(() => { loadDashboard(); }, [loadDashboard]));

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }, [loadDashboard]);

  // Realtime: si cambian tablas clave, recargo
  useEffect(() => {
    const ch = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'usuarios' }, loadDashboard)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Publicaciones' }, loadDashboard)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Reportes' }, loadDashboard)
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [loadDashboard]);

  // UI
  return (
    <SafeAreaView style={styles.container}>
      {/* Header con branding/chips */}
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

          {/* Botonera derecha */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              onPress={() => navigation.navigate('Home')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Ir a Home"
              style={{ marginRight: 12, padding: 6, borderRadius: 999 }}
            >
              <Image
                source={require('../assets/IconoAdminPanel.png')}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </Pressable>

            <Pressable style={styles.avatar} onPress={() => navigation.navigate('AdminProfile')}>
              <Ionicons name="person" size={18} color="#0F172A" />
            </Pressable>
          </View>
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

      {/* Contenido con pull-to-refresh */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* KPIs */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Resumen</Text>

          <View style={styles.kpiGrid}>
            {/* Usuarios (totales o 30d, según lo que asignaste arriba) */}
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
              {/* Cambia el label si usás "nuevos 30d" */}
              <Text style={styles.kpiLabelCenter}>Usuarios totales</Text>
              {/* <Text style={styles.kpiLabelCenter}>Usuarios nuevos (30d)</Text> */}
            </View>

            {/* Publicaciones 30d */}
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
              <Text style={styles.kpiLabelCenter}>Publicaciones</Text>
            </View>

            {/* Reportes abiertos */}
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
              <Text style={styles.kpiLabelCenter}>Reportes abiertos</Text>
            </View>
          </View>
        </View>

        {/* Listas rápidas */}
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

        {/* Acciones rápidas (si las tenías, quedan igual) */}
        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
