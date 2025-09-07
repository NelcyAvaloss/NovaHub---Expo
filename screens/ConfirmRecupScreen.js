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
  Alert,
  ActivityIndicator,
} from "react-native";
import styles from "./ConfirmRecup.styles";

export default function ConfirmRecupScreen({ navigation, route }) {
  // const { email } = route?.params || {};

  const [code, setCode] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [focus, setFocus] = useState({ c: false, p1: false, p2: false });
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);

  const codeRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);

  const MIN_PASS = 6;

  const codeRegex = /^\d{6}$/; // Codigo de exactamente 6 dígitos
  const codeOk = codeRegex.test(code);
  const passMatch = pass1.length > 0 && pass1 === pass2;
  const passOk = pass1.length >= MIN_PASS && passMatch;
  const disabled = loading || !(codeOk && passOk);

  // Reemplaza esta función por tu llamada real al backend
  const verifyRecoveryCode = async (codeValue) => {
    //Prueba de que la insercion del codigo de recuperacion funcione con sus alertas.
    await new Promise((r) => setTimeout(r, 700));
    return codeValue === "";
  };

  // Reemplaza esto por la llamada real de cambio de contraseña
  const changePassword = async (newPassword) => {
    await new Promise((r) => setTimeout(r, 700));
    return true;
  };

  const handleConfirm = async () => {
    // Validación rápida en cliente
    if (!codeRegex.test(code)) {
      Alert.alert("Código inválido", "El código debe tener exactamente 6 dígitos.");
      return;
    }
    if (pass1.length < MIN_PASS) {
      Alert.alert(
        "Contraseña corta",
        `La contraseña debe tener al menos ${MIN_PASS} caracteres.`
      );
      return;
    }
    if (pass1 !== pass2) {
      Alert.alert("No coinciden", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const valid = await verifyRecoveryCode(code);
      if (!valid) {
        Alert.alert(
          "Código incorrecto",
          "El código de verificación es incorrecto o ha expirado. Verifica e inténtalo de nuevo."
        );
        return;
      }

      const changed = await changePassword(pass1);
      if (!changed) {
        Alert.alert(
          "Error",
          "No se pudo cambiar la contraseña en este momento. Intenta nuevamente."
        );
        return;
      }

      Alert.alert(
        "¡Éxito!",
        "Tu contraseña se cambió con éxito.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );
    } catch (e) {
      Alert.alert("Error", "Ocurrió un problema inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
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
        <View style={styles.overlay} pointerEvents="none" />

        <TouchableOpacity
          onPress={() => navigation.navigate("Recuperacion")}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backIcon}>↩</Text>
        </TouchableOpacity>

        <View style={styles.header} pointerEvents="none">
          <Image
            source={require("../assets/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, { textAlign: "center" }]}>
            Recuperación de contraseña
          </Text>

          {/* Código de verificación (6 dígitos) */}
          <Pressable
            onPress={() => codeRef.current?.focus()}
            style={[
              styles.inputWrapper,
              focus.c && styles.inputWrapperFocused,
            ]}
          >
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>🧾</Text>
            </View>
            <TextInput
              ref={codeRef}
              style={styles.input}
              placeholder="Código de verificación"
              placeholderTextColor="#AAB1C1"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={(t) => setCode(t.replace(/\D/g, ""))} // Aqui solo pedira números
              onFocus={() => setFocus((s) => ({ ...s, c: true }))}
              onBlur={() => setFocus((s) => ({ ...s, c: false }))}
              returnKeyType="next"
              onSubmitEditing={() => p1Ref.current?.focus()}
            />
          </Pressable>

          {/* Nueva contraseña */}
          <Pressable
            onPress={() => p1Ref.current?.focus()}
            style={[
              styles.inputWrapper,
              focus.p1 && styles.inputWrapperFocused,
            ]}
          >
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>🔒</Text>
            </View>
            <TextInput
              ref={p1Ref}
              style={styles.input}
              placeholder="Nueva contraseña"
              placeholderTextColor="#AAB1C1"
              secureTextEntry={!show1}
              autoCapitalize="none"
              autoCorrect={false}
              value={pass1}
              onChangeText={setPass1}
              onFocus={() => setFocus((s) => ({ ...s, p1: true }))}
              onBlur={() => setFocus((s) => ({ ...s, p1: false }))}
              returnKeyType="next"
              onSubmitEditing={() => p2Ref.current?.focus()}
              textContentType="newPassword"
            />
            <Pressable
              onPress={() => setShow1((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.eyeBox}
            >
              <Text style={styles.eyeText}>{show1 ? "🙈" : "👁️"}</Text>
            </Pressable>
          </Pressable>

          {/* Confirmar contraseña */}
          <Pressable
            onPress={() => p2Ref.current?.focus()}
            style={[
              styles.inputWrapper,
              focus.p2 && styles.inputWrapperFocused,
            ]}
          >
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>🔒</Text>
            </View>
            <TextInput
              ref={p2Ref}
              style={styles.input}
              placeholder="Confirma la contraseña"
              placeholderTextColor="#AAB1C1"
              secureTextEntry={!show2}
              autoCapitalize="none"
              autoCorrect={false}
              value={pass2}
              onChangeText={setPass2}
              onFocus={() => setFocus((s) => ({ ...s, p2: true }))}
              onBlur={() => setFocus((s) => ({ ...s, p2: false }))}
              returnKeyType="done"
              onSubmitEditing={handleConfirm}
              textContentType="newPassword"
            />
            <Pressable
              onPress={() => setShow2((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.eyeBox}
            >
              <Text style={styles.eyeText}>{show2 ? "🙈" : "👁️"}</Text>
            </Pressable>
          </Pressable>

          {/* Hints */}
          <View style={styles.hintsBox}>
            {!codeOk && code.length > 0 && (
              <Text style={styles.hintText}>
                Ingresa un código de 6 dígitos.
              </Text>
            )}
            {pass1.length > 0 && pass1.length < MIN_PASS && (
              <Text style={styles.hintText}>
                La contraseña debe tener al menos {MIN_PASS} caracteres.
              </Text>
            )}
            {pass2.length > 0 && !passMatch && (
              <Text style={styles.hintText}>Las contraseñas no coinciden.</Text>
            )}
          </View>

          {/* BOTÓN CONFIRMAR */}
          <Pressable
            onPress={handleConfirm}
            disabled={disabled}
            android_ripple={{ color: "rgba(255,255,255,0.15)" }}
            style={({ pressed }) => [
              styles.primaryBtn,
              disabled && styles.primaryBtnDisabled,
              pressed && !disabled && styles.pressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text
                style={[
                  styles.primaryBtnText,
                  disabled && styles.primaryBtnTextDisabled,
                ]}
              >
                Confirmar
              </Text>
            )}
          </Pressable>

          {/* Link volver al login*/}
          <View style={styles.loginRow}>
            <Pressable onPress={() => navigation.navigate("Login")}>
              {({ pressed }) => (
                <Text
                  style={[styles.loginLink, pressed && styles.loginLinkPressed]}
                >
                  Volver al inicio de sesión
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
