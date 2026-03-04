import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../../components/Alert/Loader";

const HinduLeaders1 = () => {
  const navigation = useNavigation();

  const [windowDimensions, setWindowDimensions] = useState(
    Dimensions.get("window")
  );
  const { width } = windowDimensions;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    setIsTablet(width >= 600);
  }, [width]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://hdrss-backend.onrender.com/api/hindu-leaders/category"
      );
      setCategories(res.data || []);
      setError(null);
    } catch (e) {
      setError("பகுப்புகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  };

  const numColumns = useMemo(() => (isTablet ? 3 : 2), [isTablet]);

  const H_PADDING = useMemo(() => (isTablet ? 20 : 14), [isTablet]);
  const GAP = useMemo(() => (isTablet ? 16 : 12), [isTablet]);

  const cardWidth = useMemo(() => {
    const totalGap = GAP * (numColumns - 1);
    const availableWidth = width - H_PADDING * 2;
    return (availableWidth - totalGap) / numColumns;
  }, [width, numColumns, H_PADDING, GAP]);

  const cardHeight = useMemo(() => cardWidth * 1.18, [cardWidth]);

  const Header = () => (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
        style={[styles.backBtn, isTablet && styles.backBtnTablet]}
      >
        <Ionicons name="chevron-back" size={isTablet ? 26 : 22} color="#fff" />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
        இந்து தலைவர்கள்
      </Text>

      <View style={{ width: isTablet ? 44 : 38 }} />
    </View>
  );

  const CategoryCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("HinduLeaders2", {
          categoryId: item.id,
          categoryName: item.name,
        })
      }
      style={[
        styles.card,
        { width: cardWidth, height: cardHeight },
        isTablet && styles.cardTablet,
      ]}
    >
      <View style={[styles.imageWrap, { height: cardHeight * 0.72 }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>

      <View style={[styles.bottom, { height: cardHeight * 0.28 }]}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.title, isTablet && styles.titleTablet]}
        >
          {item.name}
        </Text>

        <View style={styles.chevCircle}>
          <Ionicons
            name="arrow-forward"
            size={isTablet ? 16 : 14}
            color="#8B0000"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderState = (icon, text, btnText, onPress) => (
    <View style={styles.stateWrap}>
      <Ionicons name={icon} size={52} color="#8B0000" />
      <Text style={styles.stateText}>{text}</Text>
      {!!btnText && (
        <TouchableOpacity style={styles.retryBtn} onPress={onPress}>
          <Text style={styles.retryText}>{btnText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
       <Loader/>
      );
    }

    if (error) {
      return renderState(
        "alert-circle-outline",
        error,
        "மீண்டும் முயற்சிக்கவும்",
        fetchCategories
      );
    }

    if (!categories.length) {
      return renderState(
        "folder-open-outline",
        "பகுப்புகள் கிடைக்கவில்லை",
        null,
        null
      );
    }

    return (
      <FlatList
        data={categories}
        key={`${numColumns}_${width}`}
        keyExtractor={(item) => String(item.id)}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: H_PADDING,
          paddingTop: 14,
          paddingBottom: 24,
        }}
        columnWrapperStyle={
          numColumns > 1
            ? { justifyContent: "space-between", marginBottom: GAP }
            : undefined
        }
        renderItem={({ item }) => <CategoryCard item={item} />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <View style={styles.container}>
        <Header />
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default HinduLeaders1;

const MAROON = "#8B0000";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  /* ✅ Header neat */
  header: {
    backgroundColor: MAROON,
    paddingVertical: 27,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    // borderBottomLeftRadius: 18,
    // borderBottomRightRadius: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  headerTablet: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    // borderBottomLeftRadius: 22,
    // borderBottomRightRadius: 22,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginTop:18,
  },
  backBtnTablet: { width: 44, height: 44, borderRadius: 22 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.3,
    marginTop:18,
  },
  headerTitleTablet: { fontSize: 18 },

  /* ✅ States neat */
  stateWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
  stateText: {
    marginTop: 10,
    textAlign: "center",
    color: "#444",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 14,
    backgroundColor: MAROON,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: "#fff", fontWeight: "900" },

  /* ✅ Card neat */
  card: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTablet: {
    borderRadius: 18,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  imageWrap: {
    width: "100%",
    backgroundColor: "#F7F7F7",
  },
  image: { width: "100%", height: "100%" },

  bottom: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  title: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: "800",
    color: MAROON,
    lineHeight: 18,
    includeFontPadding: false,
  },
  titleTablet: { fontSize: 14, lineHeight: 18 },

  chevCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
});
