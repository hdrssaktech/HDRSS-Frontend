import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform, // Add Platform import here
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width > 768;

export default function TownBusinessPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { town } = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories for the selected town
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/business/category/${town.id}`
        );
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [town.id]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header Banner with Gradient Overlay */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: town.bannerImage }}
          style={styles.banner}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={styles.gradientOverlay}
        />
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Header Content */}
        <View style={styles.headerContent}>
          <Text style={styles.townName}>{town.townname}</Text>
          <Text style={styles.subtitle}>Business Categories</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#93210A" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : (
          <View style={styles.categoriesContainer}>
            <Text style={styles.categoriesTitle}>Explore Categories</Text>
            <Text style={styles.categoriesSubtitle}>
              {data.length} categories available
            </Text>
            
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                onPress={() =>
                  navigation.navigate("TownBusiness2", { subcategoryId: item.id })
                }
                activeOpacity={0.8}
              >
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.categoryImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay} />
                </View>
                
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{item.title}</Text>
                  <Text style={styles.categoryDescription}>
                    Explore businesses in this category
                  </Text>
                </View>
                
                <View style={styles.arrowContainer}>
                  <Ionicons name="chevron-forward" size={20} color="#93210A" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Categories Available</Text>
            <Text style={styles.emptyText}>
              There are no business categories for {town.townname} at the moment.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  
  // Banner Section
  bannerContainer: {
    height: isTablet ? 300 : 250,
    position: "relative",
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 50 : 40, // Now Platform is defined
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
    zIndex: 2,
  },
  headerContent: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  townName: {
    color: "#fff",
    fontSize: isTablet ? 32 : isSmallDevice ? 24 : 28,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 5,
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: isSmallDevice ? 16 : 18,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  // Content Area
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // Loading State
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },

  // Categories Section
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  categoriesTitle: {
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 5,
    textAlign: "center",
  },
  categoriesSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },

  // Category Cards
  categoryCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: "center",
  },
  categoryImageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryImage: {
    width: isTablet ? 80 : isSmallDevice ? 60 : 70,
    height: isTablet ? 80 : isSmallDevice ? 60 : 70,
    borderRadius: 12,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
  },
  categoryContent: {
    flex: 1,
    marginLeft: 16,
  },
  categoryTitle: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  arrowContainer: {
    padding: 8,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
});