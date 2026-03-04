import React, { useEffect, useState, useMemo } from "react";
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

const HinduNoolgal1 = () => {
  const navigation = useNavigation();
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));
  const { width, height } = windowDimensions;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTablet, setIsTablet] = useState(false);

  // Update dimensions on screen resize
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Check for tablet
  useEffect(() => {
    const isTabletSize = width >= 768 || (width > height && width >= 600);
    setIsTablet(isTabletSize);
  }, [width, height]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://hdrss-backend.onrender.com/api/hindu-noolgal/category"
      );
      setCategories(res.data || []);
      setError(null);
    } catch (e) {
      console.error("API Error:", e);
      setError("பகுப்புகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Responsive columns: Mobile 2-3, Tablet 3-4
  const numColumns = useMemo(() => {
    if (width >= 1024) return 4; // Large tablets and desktops
    if (width >= 600) return 4;  // Tablets
    if (width >= 480) return 3;  // Medium phones
    return 2;                    // Small phones
  }, [width]);

  // Responsive spacing
  const H_PADDING = useMemo(() => {
    if (width >= 1024) return 32;
    if (width >= 600) return 24;
    if (width >= 480) return 20;
    return 16;
  }, [width]);

  const GAP = useMemo(() => {
    if (width >= 1024) return 24;
    if (width >= 600) return 20;
    if (width >= 480) return 16;
    return 12;
  }, [width]);

  // Calculate card width
  const cardWidth = useMemo(() => {
    const totalGap = GAP * (numColumns - 1);
    const availableWidth = width - (H_PADDING * 2);
    return (availableWidth - totalGap) / numColumns;
  }, [width, numColumns, H_PADDING, GAP]);

  const renderHeader = () => (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
      >
        <Ionicons 
          name="chevron-back" 
          size={isTablet ? 30 : 24} 
          color="#fff" 
        />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
        இந்து நூல்கள்
      </Text>
      
      <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
    </View>
  );

  const CategoryCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("HinduNoolgal2", {
          categoryId: item.id,
          categoryName: item.name,
        })
      }
      style={[
        styles.card, 
        isTablet && styles.cardTablet,
        // { 
        //   width: cardWidth,
        //   marginBottom: GAP 
        // }
      ]}
    >
      <View style={[
        styles.imageBox, 
        isTablet && styles.imageBoxTablet,
      ]}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.image} 
          resizeMode="cover"
        />
      </View>

      <View style={styles.textContainer}>
        <Text 
          style={[
            styles.cardTitle, 
            isTablet && styles.cardTitleTablet
          ]} 
          numberOfLines={2}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.8}
        >
          {item.name}
        </Text>
        
        <View style={styles.arrowContainer}>
          <Ionicons 
            name="arrow-forward" 
            size={isTablet ? 18 : 16} 
            color="#8B0000" 
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <ActivityIndicator 
            size={isTablet ? "large" : "large"} 
            color="#8B0000" 
          />
          <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
            ஏற்றுகிறது...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <Ionicons 
            name="alert-circle-outline" 
            size={isTablet ? 60 : 50} 
            color="#8B0000" 
          />
          <Text style={[styles.errorText, isTablet && styles.errorTextTablet]}>
            {error}
          </Text>

          <TouchableOpacity 
            style={[styles.retryButton, isTablet && styles.retryButtonTablet]} 
            onPress={fetchCategories}
          >
            <Text style={[styles.retryButtonText, isTablet && styles.retryButtonTextTablet]}>
              மீண்டும் முயற்சிக்கவும்
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!categories.length) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <Ionicons 
            name="folder-open-outline" 
            size={isTablet ? 60 : 50} 
            color="#bbb" 
          />
          <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
            பகுப்புகள் கிடைக்கவில்லை
          </Text>
        </View>
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
          paddingTop: isTablet ? 24 : 16,
          paddingBottom: isTablet ? 40 : 30,
        }}
        renderItem={({ item }) => <CategoryCard item={item} />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      
      <View style={styles.whiteBackground}>
        {renderHeader()}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default HinduNoolgal1;

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#FFFFFF",
  },
  whiteBackground: { 
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    backgroundColor: "#8B0000",
    padding: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
    
  headerTablet: {
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    padding: 4,
    right:13,
    top:10,
  },
  backButtonTablet: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    flex: 1,
    paddingHorizontal: 10,
    top:10,
  },
  headerTitleTablet: {
    fontSize: 22,
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 40,
  },
  headerSpacerTablet: {
    width: 50,
  },

  // States
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  centerContainerTablet: {
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#8B0000",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingTextTablet: {
    fontSize: 18,
    marginTop: 16,
  },
  errorText: {
    marginTop: 14,
    color: "#8B0000",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  errorTextTablet: {
    fontSize: 18,
    lineHeight: 26,
    marginTop: 20,
    maxWidth: 500,
  },
  emptyText: {
    marginTop: 12,
    color: "#777",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyTextTablet: {
    fontSize: 18,
    marginTop: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#8B0000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  retryButtonTablet: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 24,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  retryButtonTextTablet: {
    fontSize: 17,
  },

  // Card
  card: {
   backgroundColor: "#FFFFFF",
  borderRadius: 16,
  overflow: "hidden",

  width: 150,      // 👈 card width
  height: 185,     // 👈 card height

  elevation: 3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 6,

  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.9)",
  marginHorizontal: 0,
  },
  cardTablet: {
    borderRadius: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  imageBox: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  imageBoxTablet: {
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: "#8B0000",
    lineHeight: 18,
    paddingRight: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardTitleTablet: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
  },
  arrowContainer: {
    paddingLeft: 2,
  },
});