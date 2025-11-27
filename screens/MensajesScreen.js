import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import { styles as s } from './Mensajes.styles';

export default function MensajesScreen({ navigation }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={s.container}>
      {/* HEADER */}
      <ImageBackground
        source={require('../assets/FondoNovaHub.png')}
        style={s.headerBg}
      >
        <Animated.View
          style={[
            s.headerBar,
            {
              opacity: anim,
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={s.backBtn}
            activeOpacity={0.8}
          >
            <Text style={s.backIcon}>↩</Text>
          </TouchableOpacity>

          <Text style={s.headerTitle}>Mensajes</Text>

          <View style={{ width: 36 }} />
        </Animated.View>
      </ImageBackground>

      {/* CONTENIDO */}
      <View style={s.content}>
        <Text style={s.devText}>En Desarrollo</Text>
      </View>
    </View>
  );
}
