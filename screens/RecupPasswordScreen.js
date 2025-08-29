import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity, 
} from "react-native";
import styles from "./RecupPassword.styles";

export default function RecupPasswordScreen({ navigation }) { //recibe navigation
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const disabled = email.trim().length === 0;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../assets/FondoNovaHub.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* overlay debajo de todo */}
        <View style={styles.overlay} />

        {/* Botón volver → Login  */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>

        {/* Header con logo y marca */}
        <View style={styles.header}>
          <Image
            source={require("../assets/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Tarjeta principal */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { textAlign: "center" }]}>
            Recuperación de contraseña
          </Text>
          <Text style={[styles.cardSubtitle, { textAlign: "center" }]}>
            Ingresa el correo asociado a tu cuenta
          </Text>

          {/* INPUT */}
          <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>✉️</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              placeholderTextColor="#AAB1C1"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              returnKeyType="done"
            />
          </View>

          {/* BOTÓN */}
          <Pressable
            onPress={() => {}}
            disabled={disabled}
            android_ripple={{ color: "rgba(255,255,255,0.15)" }}
            style={({ pressed }) => [
              styles.primaryBtn,
              disabled && styles.primaryBtnDisabled,
              pressed && !disabled && styles.pressed,
            ]}
          >
            <Text style={[styles.primaryBtnText, disabled && styles.primaryBtnTextDisabled]}>
              Enviar enlace
            </Text>
          </Pressable>

          {/* Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginHint}>¿Ya recordaste tu contraseña?</Text>
            <Pressable onPress={() => {}}>
              {({ pressed }) => (
                <Text style={[styles.loginLink, pressed && styles.loginLinkPressed]}>
                  Iniciar sesión
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
