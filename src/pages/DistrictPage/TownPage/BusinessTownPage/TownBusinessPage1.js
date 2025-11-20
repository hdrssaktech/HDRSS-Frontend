import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width > 768;

export default function TownBusinessPage1() {
  const route = useRoute();
  const navigation = useNavigation();

  const { subcategoryId } = route.params;
  console.log("Subcategory ID:", subcategoryId);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the subcategory API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/business/subcategory/${subcategoryId}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        console.log("Fetched data:", result);
      } catch (error) {
        console.log("Error fetching subcategory:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subcategoryId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={styles.loadingText}>Loading subcategories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Categories</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Bar */}
      

        {/* Grid Layout for Tablets, List for Phones */}
        {isTablet ? (
          // Tablet Grid Layout
          <View style={styles.gridContainer}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridCard}
                onPress={() =>
                  navigation.navigate("TownBusiness3", { 
                    subcategoryItemId: item.id
                  })
                }
                activeOpacity={0.8}
              >
                <View style={styles.gridImageContainer}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.gridGradient}
                  />
                  <View style={styles.gridBadge}>
                    <Ionicons name="business" size={16} color="#fff" />
                  </View>
                </View>
                
                <View style={styles.gridContent}>
                  <Text style={styles.gridTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.gridSubtitle}>
                    Explore businesses
                  </Text>
                </View>
                
                <View style={styles.gridArrow}>
                  <Ionicons name="chevron-forward" size={20} color="#93210A" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Phone List Layout
          <View style={styles.listContainer}>
            {data.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.listCard}
                onPress={() =>
                  navigation.navigate("TownBusiness3", { 
                    subcategoryItemId: item.id
                  })
                }
                activeOpacity={0.8}
              >
                <View style={styles.listImageContainer}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.listImage}
                    resizeMode="cover"
                  />
                  <View style={styles.listImageOverlay} />
                </View>
                
                <View style={styles.listContent}>
                  <Text style={styles.listTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.listDescription} numberOfLines={2}>
                    Discover various businesses in this category
                  </Text>
                </View>
                
                <View style={styles.listArrow}>
                  <Ionicons name="chevron-forward" size={20} color="#93210A" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {data.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Subcategories Found</Text>
            <Text style={styles.emptyText}>
              There are no business subcategories available at the moment.
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
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  headerPlaceholder: {
    width: 28,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: "#93210A",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Stats Bar
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e0e0e0",
  },

  // Tablet Grid Layout
  gridContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: (width - 48) / 2, // 2 columns with padding
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  gridImageContainer: {
    position: "relative",
    height: 140,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  gridBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(147, 33, 10, 0.9)",
    borderRadius: 12,
    padding: 6,
  },
  gridContent: {
    padding: 16,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
    lineHeight: 20,
  },
  gridSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  gridArrow: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },

  // Phone List Layout
  listContainer: {
    paddingHorizontal: 16,
  },
  listCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  listImageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  listImage: {
    width: isSmallDevice ? 70 : 80,
    height: isSmallDevice ? 70 : 80,
    borderRadius: 12,
  },
  listImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
  },
  listContent: {
    flex: 1,
    marginLeft: 16,
  },
  listTitle: {
    fontSize: isSmallDevice ? 16 : 17,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
    lineHeight: 20,
  },
  listDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  listArrow: {
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