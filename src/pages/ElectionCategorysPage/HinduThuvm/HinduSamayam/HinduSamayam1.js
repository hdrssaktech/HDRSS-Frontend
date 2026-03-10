import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../../components/Alert/Loader";

const HinduSamayam1 = () => {
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
        "https://hdrss-backend.onrender.com/api/hindu-samayam/category"
      );
      const sortedData = [...(res.data || [])].sort((a, b) => 
      (a.orderNo ?? Infinity) - (b.orderNo ?? Infinity)
    );
      setCategories(sortedData || []);
      setError(null);
    } catch (e) {
      console.error("API Error:", e);
      setError("பகுப்புகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  };
  // Responsive columns: Mobile 2, Tablet 3
  const numColumns = width < 600 ? 2 : 3;

  // Responsive spacing - REDUCED PADDING
  const H_PADDING = useMemo(() => {
    if (width >= 1024) return 24;
    if (width >= 600) return 20;
    if (width >= 480) return 16;
    return 12;
  }, [width]);

  const GAP = useMemo(() => {
    if (width >= 1024) return 16;
    if (width >= 600) return 14;
    if (width >= 480) return 12;
    return 10;
  }, [width]);

  // Calculate card width - SMALLER CARDS
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
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
        இந்து சமயம்
      </Text>
      
      <View style={styles.headerSpacer} />
    </View>
  );

  const CategoryCard = ({ item, cardWidth }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("HinduSamayam2", {
          categoryId: item.id,
          categoryName: item.name,
        })
      }
      style={[
        styles.card,
        {
          width: cardWidth,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.image} 
          resizeMode="cover"
        />
      </View>

      <View style={styles.textContainer}>
        <Text 
          style={[styles.cardTitle, isTablet && styles.cardTitleTablet]} 
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="#8B0000" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
            <Text style={styles.retryButtonText}>மீண்டும் முயற்சிக்கவும்</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!categories.length) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="folder-open-outline" size={50} color="#999" />
          <Text style={styles.emptyText}>பகுப்புகள் கிடைக்கவில்லை</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={categories}
        key={`grid-${numColumns}`}
        keyExtractor={(item) => String(item.id)}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: H_PADDING,
          paddingTop: isTablet ? 16 : 12,
          paddingBottom: isTablet ? 20 : 16,
        }}
        columnWrapperStyle={numColumns > 1 ? {
          justifyContent: 'space-between',
          marginBottom: GAP,
        } : undefined}
        renderItem={({ item }) => (
          <CategoryCard item={item} cardWidth={cardWidth} />
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <View style={styles.container}>
        {renderHeader()}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default HinduSamayam1;

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#8B0000",
  },
  container: { 
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  // Header - FIXED POSITIONING
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
    paddingHorizontal: 18
  },
  
  backButton:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  backButtonTablet:{
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

  // States
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  errorText: {
    marginTop: 12,
    color: "#8B0000",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 22,
    maxWidth: 280,
  },
  emptyText: {
    marginTop: 12,
    color: "#666",
    fontSize: 15,
    fontWeight: "500",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#8B0000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // Card - SMALLER SIZE
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#FAFAFA",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    padding: 8, // Reduced padding
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    minHeight: 48, // Reduced height
  },
  cardTitle: {
    fontSize: 12, // Smaller font
    fontWeight: "500",
    color: "#333333",
    lineHeight: 16,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  cardTitleTablet: {
    fontSize: 14, // Smaller for tablet too
    lineHeight: 18,
    fontWeight: "500",
  },
});