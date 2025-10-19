import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import s from './CarruselCategoriasScreen.styles';

const { width } = Dimensions.get('window');

const CARD_WIDTH = Math.round(width * 0.30);
const SPACING = 22;
const ITEM_SIZE = CARD_WIDTH + SPACING;
const SIDE_PADDING = (width - CARD_WIDTH) / 2;
const CARD_RADIUS = 18;

const DATA = [
  { id: 'cat1', nombre: 'Ciencia y Tecnología', img: require('../assets/categorias/ciencia_tecnologia.jpg') },
  { id: 'cat2', nombre: 'Farmacología',         img: require('../assets/categorias/farmacologia.jpg') },
  { id: 'cat3', nombre: 'Medicina',             img: require('../assets/categorias/medicina.jpg') },
  { id: 'cat4', nombre: 'Ingeniería',           img: require('../assets/categorias/ingenieria.png') },
  { id: 'cat5', nombre: 'Educación',            img: require('../assets/categorias/educacion.jpg') },
];

const LOOPS = 7;
const TOTAL = DATA.length * LOOPS;
const START_INDEX = Math.floor(TOTAL / 2);

export default function CarruselCategoriasScreen({ navigation, route }) {
  const onSelect = route?.params?.onSelect;

  const LOOP_DATA = useMemo(
    () => Array.from({ length: LOOPS }).flatMap((_, i) =>
      DATA.map((item) => ({ ...item, _key: `${item.id}-${i}` }))
    ),
    []
  );

  const listRef = useRef(null);

  const scrollX = useRef(new Animated.Value(START_INDEX * ITEM_SIZE)).current;

  const offsetRef = useRef(START_INDEX * ITEM_SIZE);
  const [currentIndex, setCurrentIndex] = useState(START_INDEX);

  const autoplayRef = useRef(null);
  const auto = useRef(new Animated.Value(offsetRef.current)).current;
  const autoAnimRef = useRef(null);

  const indexFromOffset = (x) => Math.round(x / ITEM_SIZE);
  const offsetFromIndex = (i) => i * ITEM_SIZE;

  const animateToIndex = (nextIndex) => {
    listRef.current?.scrollToOffset({
      offset: offsetFromIndex(nextIndex),
      animated: true,
    });
    setCurrentIndex(nextIndex);
  };
  const goLeft  = () => animateToIndex(currentIndex - 1);
  const goRight = () => animateToIndex(currentIndex + 1);

  const autoScrollToIndex = (nextIndex, duration = 900) => {
    if (autoAnimRef.current) auto.stopAnimation();
    auto.setValue(offsetRef.current);

    const listenerId = auto.addListener(({ value }) => {
      offsetRef.current = value;
      listRef.current?.scrollToOffset({ offset: value, animated: false });
    });

    autoAnimRef.current = Animated.timing(auto, {
      toValue: offsetFromIndex(nextIndex),
      duration,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    });

    autoAnimRef.current.start(({ finished }) => {
      auto.removeListener(listenerId);
      if (finished) setCurrentIndex(nextIndex);
    });
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      const base = indexFromOffset(offsetRef.current);
      autoScrollToIndex(base + 1, 900);
    }, 3600);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = null;
    if (autoAnimRef.current) {
      auto.stopAnimation();
      autoAnimRef.current = null;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: offsetRef.current, animated: false });
      startAutoplay();
    }, 0);
    return stopAutoplay;
  }, []);

  const recenterIfNeeded = () => {
    const idx = indexFromOffset(offsetRef.current);
    if (idx <= DATA.length) {
      const newIndex = idx + DATA.length * Math.floor(LOOPS / 2);
      listRef.current?.scrollToOffset({ offset: offsetFromIndex(newIndex), animated: false });
      setCurrentIndex(newIndex);
      offsetRef.current = offsetFromIndex(newIndex);
    } else if (idx >= TOTAL - DATA.length) {
      const newIndex = idx - DATA.length * Math.floor(LOOPS / 2);
      listRef.current?.scrollToOffset({ offset: offsetFromIndex(newIndex), animated: false });
      setCurrentIndex(newIndex);
      offsetRef.current = offsetFromIndex(newIndex);
    }
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (e) => {
        offsetRef.current = e.nativeEvent.contentOffset.x;
      },
    }
  );

  const onScrollBeginDrag = () => {
    stopAutoplay();
  };

  const onMomentumScrollEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = indexFromOffset(x);
    setCurrentIndex(idx);
    offsetRef.current = x;
    recenterIfNeeded();
    setTimeout(startAutoplay, 300);
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
      (index + 1) * ITEM_SIZE,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.75, 1, 0.75],
      extrapolate: 'clamp',
    });

    const glowOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 0.35, 0],
      extrapolate: 'clamp',
    });
    const glowScale = scrollX.interpolate({
      inputRange,
      outputRange: [1, 1.02, 1],
      extrapolate: 'clamp',
    });

    const ringOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });
    const ringScale = scrollX.interpolate({
      inputRange,
      outputRange: [0.98, 1.02, 0.98],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{ transform: [{ scale }], opacity, marginHorizontal: SPACING / 2 }}>
        <Pressable
          onPress={() =>
            typeof onSelect === 'function'
              ? onSelect(item)
              : navigation?.navigate('CategoriaFeed', {
                  categoriaId: item.id,
                  nombre: item.nombre,
                })
          }
          style={[s.card, { width: CARD_WIDTH, overflow: 'hidden', borderRadius: CARD_RADIUS }]}
        >
          <ImageBackground source={item.img} style={s.cardImage} imageStyle={s.cardImageStyle}>
            <View style={s.overlay} />
            <Text style={s.cardTitle}>{item.nombre}</Text>
          </ImageBackground>

          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: CARD_RADIUS,
              borderColor: 'rgba(34, 211, 238, 0.45)',
              borderWidth: 10,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
              zIndex: 10,
            }}
          />

          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: CARD_RADIUS,
              borderColor: '#22D3EE',
              borderWidth: 3,
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
              zIndex: 11,
            }}
          />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={s.screen}>
      <View style={s.headerRow}>
        <Pressable onPress={goLeft} style={s.arrowBtn}>
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </Pressable>
        <Text style={s.headerTitle}>Categorías</Text>
        <Pressable onPress={goRight} style={s.arrowBtn}>
          <Ionicons name="chevron-forward" size={22} color="#0F172A" />
        </Pressable>
      </View>

      <Animated.FlatList
        ref={listRef}
        data={LOOP_DATA}
        keyExtractor={(it) => it._key}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        snapToInterval={ITEM_SIZE}
        snapToAlignment="center"
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
        initialScrollIndex={START_INDEX}
        getItemLayout={(_, index) => ({
          length: ITEM_SIZE,
          offset: ITEM_SIZE * index,
          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={9}
        removeClippedSubviews
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={renderItem}
      />
    </View>
  );
}
