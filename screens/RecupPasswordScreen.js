import React, { useRef, useState } from "react";
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
import { supabase } from "./supabase";

export default function RecupPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const disabled = email.trim().length === 0;

  const handleSendLink = async () => {
    const  {error} = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false}
    });

    if (error) {
      Alert.alert("Error", error.message);
      console.log(error);
      return;
    }
    
    navigation.navigate("ConfirmRecup", { email });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../assets/FondoNovaHub.png")}
        style={styles.bg}
        resizeMode="cover"
        pointerEvents="box-none"
      >
        {/* overlay decorativo sin eventos */}
        <View style={styles.overlay} pointerEvents="none" />

        {/* Botón volver */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>

        {/* Header totalmente inerte */}
        <View style={styles.header} pointerEvents="none">
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
          <Pressable
            onPress={() => inputRef.current?.focus()}
            style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}
          >
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>✉️</Text>
            </View>
            <TextInput
              ref={inputRef}
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
              blurOnSubmit={false}
              textContentType="emailAddress"
            />
          </Pressable>

          {/* BOTÓN */}
          <Pressable
            onPress={handleSendLink}
            disabled={disabled}
            android_ripple={{ color: "rgba(255,255,255,0.15)" }}
            style={({ pressed }) => [
              styles.primaryBtn,
              disabled && styles.primaryBtnDisabled,
              pressed && !disabled && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.primaryBtnText,
                disabled && styles.primaryBtnTextDisabled,
              ]}
            >
              Enviar enlace
            </Text>
          </Pressable>

          {/* Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginHint}>¿Ya recordaste tu contraseña?</Text>
            <Pressable onPress={() => navigation.navigate("Login")}>
              {({ pressed }) => (
                <Text
                  style={[styles.loginLink, pressed && styles.loginLinkPressed]}
                >
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
