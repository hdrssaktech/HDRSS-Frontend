import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Animated,
  PanResponder,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getProductCategories } from "../../api/api";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;
const BUBBLE = isTablet ? 130 : 108;
const ITEM_WIDTH = BUBBLE + 24;
const CARD_GAP = isTablet ? 20 : 16;
const HOME_LIMIT = 6;
const SCROLL_DURATION = 14000;

const C = { primary: "#8B1A1A", gold: "#D4AF37", cream: "#FDF5E6" };

/* ─── Bubble ─────────────────────────────────────────────────── */
function CategoryBubble({ item, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      style={bS.wrapper}
    >
      <View style={bS.ring}>
        <View style={bS.circle}>
          <Image
            source={{ uri: item.image || "https://via.placeholder.com/200x200" }}
            style={bS.image}
            resizeMode="contain"
          />
        </View>
      </View>
      <Text style={bS.label} numberOfLines={2}>
        {item.categoryName}
      </Text>
    </TouchableOpacity>
  );
}

const bS = StyleSheet.create({
  wrapper: { 
    width: ITEM_WIDTH, 
    marginRight: CARD_GAP, 
    alignItems: "center" 
  },
  ring: {
    width: BUBBLE + 6, 
    height: BUBBLE + 6,
    borderRadius: (BUBBLE + 6) / 2,
    borderWidth: isTablet ? 3 : 2.5, 
    borderColor: C.gold,
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  circle: {
    width: BUBBLE, 
    height: BUBBLE,
    borderRadius: BUBBLE / 2,
    backgroundColor: C.cream,
    alignItems: "center", 
    justifyContent: "center",
    overflow: "hidden", 
    padding: isTablet ? 15 : 10,
  },
  image: { width: "100%", height: "100%" },
  label: {
    marginTop: isTablet ? 12 : 10, 
    fontSize: isTablet ? 15 : 13, 
    fontWeight: "700",
    color: C.primary, 
    textAlign: "center",
    maxWidth: ITEM_WIDTH, 
    lineHeight: isTablet ? 22 : 18,
  },
});

/* ─── Main ───────────────────────────────────────────────────── */
export default function ProductScreen1() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const translateX = useRef(new Animated.Value(0)).current;
  const animRef = useRef(null);
  const currentX = useRef(0);
  const isPaused = useRef(false);
  const isFirstLoad = useRef(true);
  const totalDistanceRef = useRef(0);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    translateX.setValue(0);
    currentX.current = 0;
    isFirstLoad.current = true;
    startLoop(0);
    return () => animRef.current?.stop();
  }, [categories]);

  useEffect(() => {
    const id = translateX.addListener(({ value }) => { 
      currentX.current = value; 
    });
    return () => translateX.removeListener(id);
  }, []);

  const loadData = async () => {
    try {
      const data = await getProductCategories();
      let catList = Array.isArray(data) ? data : data?.data ?? [];
      catList = catList.sort((a, b) => {
        const nameA = a.categoryName?.toLowerCase() || '';
        const nameB = b.categoryName?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      });
      setCategories(catList);
    } catch (e) {
      console.log("ProductScreen1 load error:", e);
    } finally {
      setLoading(false);
    }
  };

  const stripWidth = () =>
    Math.min(categories.length, HOME_LIMIT) * (ITEM_WIDTH + CARD_GAP);

  const startLoop = (fromX) => {
    animRef.current?.stop();
    const totalDistance = stripWidth() - screenWidth + CARD_GAP;
    totalDistanceRef.current = totalDistance;
    if (totalDistance <= 0) return;

    const remainingDistance = totalDistance - Math.abs(fromX);
    if (remainingDistance <= 0) {
      translateX.setValue(0);
      currentX.current = 0;
      startLoop(0);
      return;
    }

    const fraction = remainingDistance / totalDistance;
    const duration = SCROLL_DURATION * fraction;

    translateX.setValue(fromX);

    animRef.current = Animated.timing(translateX, {
      toValue: -totalDistance,
      duration: duration,
      useNativeDriver: true,
    });

    animRef.current.start(({ finished }) => {
      if (finished && !isPaused.current) {
        translateX.setValue(0);
        currentX.current = 0;
        startLoop(0);
      }
    });
  };

  const pause = () => {
    if (isPaused.current) return;
    isPaused.current = true;
    animRef.current?.stop();
    currentX.current = translateX._value || 0;
  };

  const resume = () => {
    if (!isPaused.current) return;
    isPaused.current = false;
    startLoop(currentX.current);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: () => pause(),
      onPanResponderRelease: () => resume(),
      onPanResponderTerminate: () => resume(),
    })
  ).current;

  const ads = [];
  categories.forEach((cat) => {
    (cat.advertisementImages || []).forEach((url) => {
      ads.push({ image: url, title: cat.categoryName });
    });
  });

  const homeCategories = categories.slice(0, HOME_LIMIT);

  if (loading) {
    return (
      <View style={s.loader}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.titleRow}>
          <Text style={s.heading}>Products</Text>
        </View>
        <TouchableOpacity
          style={s.seeAllBtn}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("ProductScreen1fullproducts", { categories, ads })
          }
        >
          <Text style={s.seeAllText}>See All</Text>
          <Ionicons name="arrow-forward" size={isTablet ? 18 : 16} color={C.primary} />
        </TouchableOpacity>
      </View>

      {/* Clipping container */}
      <View style={s.clipBox} {...pan.panHandlers}>
        <Animated.View
          style={[s.strip, { transform: [{ translateX }] }]}
        >
          {homeCategories.map((item) => (
            <CategoryBubble
              key={item.id.toString()}
              item={item}
              onPress={() => {
                pause();
                navigation.navigate("ProductScreen2", {
                  category: item.categoryName,
                  categoryId: item.id,
                });
                setTimeout(() => {
                  resume();
                }, 1000);
              }}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: isTablet ? 24 : 18, marginBottom: isTablet ? 32 : 24 },
  loader: { height: 220, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: isTablet ? 24 : 20,
    marginBottom: isTablet ? 24 : 20,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: isTablet ? 12 : 10 },
  heading: { 
    fontSize: isTablet ? 24 : 20, 
    fontWeight: "800", 
    color: C.primary, 
    letterSpacing: 0.3 
  },

  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: isTablet ? 6 : 4 },
  seeAllText: { 
    fontSize: isTablet ? 15 : 13, 
    fontWeight: "700", 
    color: C.primary 
  },

  clipBox: {
    overflow: "hidden",
    paddingVertical: isTablet ? 10 : 6,
  },
  strip: {
    flexDirection: "row",
    paddingLeft: isTablet ? 24 : 20,
    paddingRight: isTablet ? 28 : 24,
  },
});