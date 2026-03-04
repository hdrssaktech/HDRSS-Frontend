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
import Loader from "../../../../components/Alert/Loader";

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
    const isTabletSize = width >= 600;
    setIsTablet(isTabletSize);
  }, [width]);

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

  // Responsive columns: Mobile 2 columns, Tablet 3 columns
  const numColumns = useMemo(() => {
    return isTablet ? 3 : 2;
  }, [isTablet]);

  // Responsive spacing
  const H_PADDING = useMemo(() => {
    return isTablet ? 24 : 16;
  }, [isTablet]);

  const GAP = useMemo(() => {
    return isTablet ? 20 : 12;
  }, [isTablet]);

  // Calculate card width for perfect grid
  const cardWidth = useMemo(() => {
    const totalGap = GAP * (numColumns - 1);
    const availableWidth = width - (H_PADDING * 2);
    return (availableWidth - totalGap) / numColumns;
  }, [width, numColumns, H_PADDING, GAP]);

  // Card height based on width (maintaining aspect ratio)
  const cardHeight = useMemo(() => {
    return cardWidth * 1.2; // Slightly taller than wide for better text area
  }, [cardWidth]);

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

  const CategoryCard = ({ item, index }) => {
    // Calculate margin based on position in grid
    const isFirstInRow = index % numColumns === 0;
    const isLastInRow = index % numColumns === numColumns - 1;

    return (
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
          { 
            width: cardWidth,
            height: cardHeight,
            marginRight: !isLastInRow ? GAP : 0,
            marginBottom: GAP,
          }
        ]}
      >
        <View style={[
          styles.imageBox,
          { height: cardHeight * 0.7 } // Image takes 70% of card height
        ]}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.image} 
            resizeMode="cover"
          />
        </View>

        <View style={[
          styles.textContainer,
          { height: cardHeight * 0.3 } // Text area takes 30% of card height
        ]}>
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
  };

  const renderContent = () => {
    if (loading) {
      return <Loader />;
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
        renderItem={({ item, index }) => <CategoryCard item={item} index={index} />}
        ListFooterComponent={<View style={{ height: 20 }} />}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop:40,
    paddingBottom:30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
   paddingTop:45,
    paddingBottom:28,
    paddingHorizontal: 18,
  },
  backButton: {
   width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 22,
   
  },
  headerSpacer: {
    width: 36,
  },
  headerSpacerTablet: {
    width: 44,
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
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 16,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  imageBox: {
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    lineHeight: 18,
    paddingRight: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardTitleTablet: {
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },
  arrowContainer: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});