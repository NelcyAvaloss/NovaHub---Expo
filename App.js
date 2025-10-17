// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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

/* --------- ADMIN (tabs + detall) --------- */
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


const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();






/** En DEV arranca en el panel, en PROD en Bienvenido 
 const INITIAL_ROUTE = __DEV__ ? 'AdminPanel' : 'Bienvenido';*/

/*  RUTA OFICIAL A LA PUBLICA, SALIR DE MODO DESARROLLADOR */
 const INITIAL_ROUTE = 'Login'; 





/* --------- Tabs del Panel de Administración --------- */
function AdminTabs() {
  /** En DEV abre el tab de Usuarios; en PROD el Dashboard */
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
  return (
    <PublicacionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootStack.Navigator initialRouteName={INITIAL_ROUTE} screenOptions={{ headerShown: false }}>
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
