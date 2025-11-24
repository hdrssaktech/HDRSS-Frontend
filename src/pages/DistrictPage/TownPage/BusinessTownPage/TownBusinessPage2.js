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

export default function TownBusinessPage3() {
  const route = useRoute();
  const navigation = useNavigation();
  const { subcategoryItemId } = route.params;

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screenInfo, setScreenInfo] = useState({
    width: 375,
    height: 667,
    isSmallDevice: false,
    isTablet: false
  });

  // Initialize dimensions safely
  useEffect(() => {
    const updateDimensions = () => {
      try {
        const window = Dimensions.get("window");
        const isSmallDevice = window.width < 375;
        const isTablet = window.width > 768;
        
        setScreenInfo({
          width: window.width,
          height: window.height,
          isSmallDevice,
          isTablet
        });
      } catch (error) {
        console.log("Error getting dimensions, using defaults");
        setScreenInfo({
          width: 375,
          height: 667,
          isSmallDevice: false,
          isTablet: false
        });
      }
    };

    updateDimensions();

    const subscription = Dimensions.addEventListener('change', updateDimensions);

    return () => {
       subscription?.remove?.(); // Safe removal
    };
  }, []);

  // Fetch businesses using the API
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/tb/business/by-subcategory/${subcategoryItemId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setBusinesses(result);
      } catch (error) {
        console.log("Error fetching businesses:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (subcategoryItemId) {
      fetchBusinesses();
    }
  }, [subcategoryItemId]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    const fetchBusinesses = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/business/by-subcategory/${subcategoryItemId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setBusinesses(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={styles.loadingText}>Loading businesses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
        <Text style={styles.errorTitle}>Unable to Load Businesses</Text>
        <Text style={styles.errorText}>{error}</Text>
        <View style={styles.errorButtons}>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.retryButton, styles.secondaryButton]}
            onPress={handleRetry}
          >
            <Text style={[styles.retryButtonText, styles.secondaryButtonText]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* Header with #93210A color */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={[
          styles.headerTitle,
          screenInfo.isSmallDevice && styles.smallHeaderTitle
        ]}>
          Businesses
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Business List - New Design */}
        <View style={styles.listContainer}>
          {businesses.map((business, index) => (
            <TouchableOpacity
              key={business.id || index}
              style={styles.businessCard}
              onPress={() => navigation.navigate("TownBusiness4", { 
                businessData: business
              })}
              activeOpacity={0.8}
            >
              {/* Image on Left */}
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: business.image }} 
                  style={styles.businessImage}
                  resizeMode="cover"
                  onError={() => console.log("Image failed to load")}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.1)']}
                  style={styles.imageGradient}
                />
              </View>
              
              {/* Content on Right */}
              <View style={styles.contentContainer}>
                {/* Title */}
                <View style={styles.titleContainer}>
                  <Text style={styles.businessTitle} numberOfLines={2}>
                    {business.title || 'Untitled Business'}
                  </Text>
                </View>
                
                {/* Icons Row */}
                <View style={styles.iconsContainer}>
                  {/* Phone Icon */}
                  {business.phone && (
                    <View style={[styles.iconWrapper, styles.phoneIcon]}>
                      <Ionicons name="call" size={18} color="#fff" />
                    </View>
                  )}
                  
                  {/* Location Icon */}
                  {business.location && (
                    <View style={[styles.iconWrapper, styles.locationIcon]}>
                      <Ionicons name="location" size={18} color="#fff" />
                    </View>
                  )}
                  
                  {/* WhatsApp Icon */}
                  {business.whatsapp && (
                    <View style={[styles.iconWrapper, styles.whatsappIcon]}>
                      <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                    </View>
                  )}
                </View>
              </View>
              
              {/* Arrow Indicator */}
              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={20} color="#93210A" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {businesses.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No Businesses Found</Text>
            <Text style={styles.emptyText}>
              There are no businesses available in this category at the moment.
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.emptyButtonText}>Browse Other Categories</Text>
            </TouchableOpacity>
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
  
  // Header with #93210A color
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    backgroundColor: "#93210A",
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  smallHeaderTitle: {
    fontSize: 18,
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
    paddingTop: 16,
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
  errorButtons: {
    flexDirection: "row",
    gap: 12,
  },
  retryButton: {
    backgroundColor: "#93210A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#93210A",
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  secondaryButtonText: {
    color: "#93210A",
  },

  // Business Card Design
  listContainer: {
    paddingHorizontal: 16,
  },
  businessCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: "center",
    minHeight: 120,
    borderLeftWidth: 4,
    borderLeftColor: "#93210A",
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
  },
  businessImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleContainer: {
    marginBottom: 12,
  },
  businessTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    lineHeight: 20,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  phoneIcon: {
    backgroundColor: "#93210A",
  },
  locationIcon: {
    backgroundColor: "#2E8B57",
  },
  whatsappIcon: {
    backgroundColor: "#25D366",
  },
  arrowContainer: {
    padding: 8,
    marginLeft: 8,
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
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: "#93210A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});