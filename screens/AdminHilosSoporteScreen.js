import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './AdminHilosSoporteScreen.styles';

export default function AdminHilosSoporteScreen({ route }) {
  const tipo = route?.params?.tipo === 'moderador' ? 'moderador' : 'usuario';
  const preId = route?.params?.preId ?? null;
  const preName = route?.params?.preName ?? (tipo === 'usuario' ? 'Usuario' : 'Moderador');

  // ===== MOCK de conversaciones (reemplaza con tu backend) =====
  const seedConvs = useMemo(
    () => ({
      usuario: {
        user_1: [
          { id: 'm1', from: 'usuario', text: 'Hola, no puedo iniciar sesión 😓', ts: '2025-10-11 08:15' },
          { id: 'm2', from: 'admin',   text: '¡Hola Carlos! ¿Te aparece algún error?', ts: '2025-10-11 08:16' },
          { id: 'm3', from: 'usuario', text: 'Dice credenciales inválidas.', ts: '2025-10-11 08:18' },
        ],
        user_2: [
          { id: 'm1', from: 'usuario', text: 'No me sube la imagen al post.', ts: '2025-10-12 14:22' },
          { id: 'm2', from: 'admin',   text: '¿Qué tipo de archivo intentas subir?', ts: '2025-10-12 14:25' },
        ],
      },
      moderador: {
        m1: [
          { id: 'm1', from: 'moderador', text: 'Necesito autorización para remover la p9.', ts: '2025-10-12 09:33' },
          { id: 'm2', from: 'admin',     text: 'OK, compárteme el reporte y procedemos.', ts: '2025-10-12 09:35' },
        ],
        m2: [
          { id: 'm1', from: 'moderador', text: 'Consulta sobre política NSFW.', ts: '2025-10-12 16:04' },
          { id: 'm2', from: 'admin',     text: 'Te mando el doc actualizado 👍', ts: '2025-10-12 16:10' },
        ],
      },
    }),
    []
  );

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!preId) return;
    const conv = seedConvs?.[tipo]?.[preId] ?? [];
    setMessages(conv);
  }, [preId, tipo, seedConvs]);

  const scrollToEnd = (animated = false) =>
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated }));

  // ===== Listeners del teclado: arreglan el retorno del input a su lugar =====
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const subShow = Keyboard.addListener(showEvt, () => {
      scrollToEnd(true);
    });
    const subHide = Keyboard.addListener(hideEvt, () => {
      // Forzamos a perder el foco para que KeyboardAvoidingView re-calibre la altura
      inputRef.current?.blur?.();
      // Pequeño retraso para asegurar el re-layout y bajar el input bar
      requestAnimationFrame(() => scrollToEnd(false));
    });

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  const sendMessage = () => {
    const txt = input.trim();
    if (!txt) return;
    const ts = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setMessages(prev => [...prev, { id: `local-${Date.now()}`, from: 'admin', text: txt, ts }]);
    setInput('');
    scrollToEnd(true);
  };

  const renderItem = ({ item }) => {
    const isAdmin = item.from === 'admin';
    const isMod = item.from === 'moderador';

    return (
      <View style={[s.msgRow, isAdmin ? s.rowRight : s.rowLeft]}>
        {!isAdmin && (
          <View style={[s.avatar, isMod ? s.avatarMod : s.avatarUser]}>
            <Ionicons name={isMod ? 'shield-checkmark' : 'person'} size={14} color="#fff" />
          </View>
        )}

        <View style={[s.bubble, isAdmin ? s.bubbleAdmin : s.bubblePeer]}>
          <Text style={[s.msgText, isAdmin && { color: '#fff' }]}>{item.text}</Text>
          <Text style={[s.msgMeta, isAdmin && { color: '#E0E7FF' }]}>{item.ts}</Text>
        </View>

        {isAdmin && (
          <View style={[s.avatar, s.avatarAdmin]}>
            <Ionicons name="person-circle" size={16} color="#fff" />
          </View>
        )}
      </View>
    );
  };

  const titleIcon = tipo === 'usuario' ? 'person' : 'shield-checkmark';
  const roleText = tipo === 'usuario' ? 'Chat con usuario' : 'Chat con moderador';

  return (
    <SafeAreaView style={s.screen}>
      {/* ===== Header Fondo NovaHub (solo estilos) ===== */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
        imageStyle={s.headerBgImage}
      >
        <View style={s.headerOverlay} />

        <View style={s.headerTopRow}>
          <View style={s.rightGhost} />

          <View style={s.brandRow}>
            <View style={s.logoDot} />
            <Text style={s.brandText}>NovaHub</Text>
          </View>

          <View style={s.rightGhost} />
        </View>

        <View style={s.headerMain}>
          <Text style={s.headerTitle}>Soporte</Text>
          <View style={s.chipsRow} />
        </View>
      </ImageBackground>

      {/* Tarjeta flotante del destinatario */}
      <View style={s.participantCard}>
        <View style={[s.partAvatar, tipo === 'usuario' ? s.partUserBg : s.partModBg]}>
          <Ionicons name={titleIcon} size={16} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.partName} numberOfLines={1}>{preName}</Text>
          <Text style={s.partRole} numberOfLines={1}>{roleText}</Text>
        </View>
        <View style={s.partRight}>
          <Ionicons name="shield-half" size={16} color="#4F46E5" />
        </View>
      </View>

      {/* ===== Chat ===== */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // Offset suave para evitar que quede “colgado” al cerrar
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 0 })}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          style={{ flex: 1 }}
          contentContainerStyle={[s.chatList, { paddingBottom: 8 }]}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollToEnd(false)}
          onLayout={() => scrollToEnd(false)}
        />

        {/* Input */}
        <View style={s.inputBar}>
          <View style={s.inputWrap}>
            <Ionicons name="create-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              placeholder="Escribe un mensaje…"
              placeholderTextColor="#94A3B8"
              style={s.textInput}
              multiline
              onFocus={() => setTimeout(() => scrollToEnd(true), 80)}
              onBlur={() => {
                // Garantiza que el input bar vuelva a su lugar
                requestAnimationFrame(() => scrollToEnd(false));
              }}
            />
          </View>

          <Pressable style={[s.btn, s.btnPrimary]} onPress={sendMessage}>
            <Ionicons name="send" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={s.btnPrimaryText}>Enviar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
