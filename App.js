import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from "expo-notifications"
import * as Device from 'expo-device';
import { supabase } from './screens/supabase';

import { PublicacionProvider } from './contexts/PublicacionContext';

/* --------- PÚBLICO / USUARIO --------- */
import BienvenidoScreen from './screens/BienvenidoScreen';
import RegistrarScreen from './screens/RegistrarScreen';
import LoginScreen from './screens/LoginScreen';
import PerfilScreen from './screens/PerfilScreen';
import HomeScreen from './screens/HomeScreen';
import CrearPublicacionScreen from './screens/CrearPublicacionScreen';
import RecupPasswordScreen from './screens/RecupPasswordScreen';
import ConfirmRecupScreen from './screens/ConfirmRecupScreen';
import DetallePublicacionScreen from './screens/DetallePublicacionScreen';
import RankingScreen from './screens/RankingScreen';
import PerfilUsuarioScreen from './screens/PerfilUsuarioScreen';

/* --------- ADMIN (tabs + detalle) --------- */
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminUsersListScreen from './screens/AdminUsersListScreen';
import AdminUserDetallScreen from './screens/AdminUserDetallScreen';
import AdminPublicationsListScreen from './screens/AdminPublicationsListScreen';
import AdminPublicationDetallScreen from './screens/AdminPublicationDetallScreen';
import AdminSoporteScreen from './screens/AdminSoporteScreen';
import AdminProfileScreen from './screens/AdminProfileScreen';

/* Reportes */
import AdminReportsListScreen from './screens/AdminReportsListScreen';
import AdminReportCommentDetallScreen from './screens/AdminReportCommentDetallScreen';
import AdminReportUserDetallScreen from './screens/AdminReportUserDetallScreen';
import AdminReportPublicDetallScreen from './screens/AdminReportPublicDetallScreen';

/* Extras */
import AdminModeradoresScreen from './screens/AdminModeradoresScreen';
import AdminHilosSoporteScreen from './screens/AdminHilosSoporteScreen';
import CarruselCategoriasScreen from './screens/CarruselCategoriasScreen';
import CategoriaFeedScreen from './screens/CategoriaFeedScreen';
import NotificacionesScreen from './screens/NotificacionesScreen';
async function registerForPush() {
  if (!Device.isDevice) return;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  console.log("Registrado para notificaciones push, obteniendo token...");
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Token de notificaciones push:", token);
  
  const { data, error } =
  //Insertar el token en supabase, si ya existe un registro con ese token, no hacer nada
  await supabase.from('Tokens_Notificaciones').upsert(
    {
      token: token,
    },
    { onConflict: 'token' }
  ).select();
  if (error) {
    console.error("Error al guardar el token en Supabase:", error);
  } else {
    console.log("Token guardado en Supabase:", data);
  }

}

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/** RUTA INICIAL **/
// Opción fija:
const INITIAL_ROUTE = 'Bienvenido';

// Opción condicional MODO DESARROLLO:
// const INITIAL_ROUTE = __DEV__ ? 'PerfilUsuario' : 'Bienvenido';

/* --------- Tabs del Panel de Administración --------- */
function AdminTabs() {
  // Tab inicial del panel 
  const ADMIN_INITIAL_TAB = 'AdminDashboard';

  return (
    <Tab.Navigator
      initialRouteName={ADMIN_INITIAL_TAB}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminUsers"
        component={AdminUsersListScreen}
        options={{
          title: 'Usuarios',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminPublications"
        component={AdminPublicationsListScreen}
        options={{
          title: 'Publicaciones',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminReports"
        component={AdminReportsListScreen}
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminSoporteTab"
        component={AdminSoporteScreen}
        options={{
          title: 'Soporte',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="life-buoy" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" color={color} size={size} />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    const {data:listener} = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('Usuario firmado:', session.user);
        await registerForPush();
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        console.log('Usuario ya firmado:', session.user);
        await registerForPush();
      }
    });
  }, []);
  return (
    <PublicacionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootStack.Navigator
            initialRouteName={INITIAL_ROUTE}
            screenOptions={{ headerShown: false }}
          >
            {/* --------- Público / Usuario --------- */}
            <RootStack.Screen name="Bienvenido" component={BienvenidoScreen} />
            <RootStack.Screen name="Registrar" component={RegistrarScreen} />
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen
              name="Perfil"
              component={PerfilScreen}
              options={{
                animation: 'slide_from_left',
                gestureEnabled: true,
                fullScreenGestureEnabled: true,
              }}
            />
            <RootStack.Screen name="Recuperacion" component={RecupPasswordScreen} />
            <RootStack.Screen name="ConfirmRecup" component={ConfirmRecupScreen} />
            <RootStack.Screen name="Home" component={HomeScreen} />
            <RootStack.Screen name="CrearPublicacion" component={CrearPublicacionScreen} />
            <RootStack.Screen name="DetallePublicacion" component={DetallePublicacionScreen} />
            <RootStack.Screen name="Ranking" component={RankingScreen} />
            <RootStack.Screen name="PerfilUsuario" component={PerfilUsuarioScreen} />
            <RootStack.Screen name="CarruselCategorias" component={CarruselCategoriasScreen} />
            <RootStack.Screen name="CategoriaFeed" component={CategoriaFeedScreen} />

            {/* NOTIFICACIONES, COMO ROOTSTACK.SCREEN */}
            <RootStack.Screen
              name="Notificaciones"
              component={NotificacionesScreen}
              options={{ headerShown: false }}
            />

            {/* --------- Panel de Administración (tabs) --------- */}
            <RootStack.Screen name="AdminPanel" component={AdminTabs} />

            {/* --------- Rutas push (Detall + extras) --------- */}
            <RootStack.Screen name="AdminUserDetall" component={AdminUserDetallScreen} />
            <RootStack.Screen name="AdminPublicationDetall" component={AdminPublicationDetallScreen} />
            <RootStack.Screen name="AdminSoporte" component={AdminSoporteScreen} />
            <RootStack.Screen name="AdminHilosSoporte" component={AdminHilosSoporteScreen} />
            <RootStack.Screen name="AdminReportPublicDetall" component={AdminReportPublicDetallScreen} />
            <RootStack.Screen name="AdminReportCommentDetall" component={AdminReportCommentDetallScreen} />
            <RootStack.Screen name="AdminReportUserDetall" component={AdminReportUserDetallScreen} />
            <RootStack.Screen name="AdminModeradores" component={AdminModeradoresScreen} />
          </RootStack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </PublicacionProvider>
  );
}
