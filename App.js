// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas
import BienvenidoScreen from './screens/BienvenidoScreen';
import RegistrarScreen from './screens/RegistrarScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CrearPublicacionScreen from './screens/CrearPublicacionScreen';
import RecupPasswordScreen from './screens/RecupPasswordScreen';
import DetallePublicacionScreen from './screens/DetallePublicacionScreen';

// Contexto (si lo usas)
import { PublicacionProvider } from './contexts/PublicacionContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PublicacionProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Bienvenido"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Recuperacion" component={RecupPasswordScreen} />
          <Stack.Screen name="Bienvenido" component={BienvenidoScreen} />
          <Stack.Screen name="Registrar" component={RegistrarScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CrearPublicacion" component={CrearPublicacionScreen}/>
          <Stack.Screen name="DetallePublicacion" component={DetallePublicacionScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </PublicacionProvider>
  );
}
 