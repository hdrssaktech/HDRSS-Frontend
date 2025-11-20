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

export default function TownBusinessPage3() {
  const route = useRoute();
  const navigation = useNavigation();

  const { subcategoryItemId } = route.params;
  console.log("Subcategory Item ID:", subcategoryItemId);

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch businesses using the API
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/business/by-subcategory/${subcategoryItemId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setBusinesses(result);
        console.log("Fetched businesses:", result);
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
            onPress={() => window.location.reload()}
          >
            <Text style={[styles.retryButtonText, styles.secondaryButtonText]}>Retry</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Businesses</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Bar */}
        {/* <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{businesses.length}</Text>
            <Text style={styles.statLabel}>Total Businesses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {businesses.filter(b => b.contact).length}
            </Text>
            <Text style={styles.statLabel}>With Contact</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {businesses.filter(b => b.address).length}
            </Text>
            <Text style={styles.statLabel}>With Address</Text>
          </View>
        </View> */}

        {/* Business List/Grid */}
        {isTablet ? (
          // Tablet Grid Layout
          <View style={styles.gridContainer}>
            {businesses.map((business) => (
              <TouchableOpacity
                key={business.id}
                style={styles.gridCard}
                onPress={() => navigation.navigate("TownBusiness4", { 
                  businessData: business
                })}
                activeOpacity={0.8}
              >
                <View style={styles.gridImageContainer}>
                  <Image 
                    source={{ uri: business.image }} 
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.gridGradient}
                  />
                  <View style={styles.gridBadge}>
                    <Ionicons name="business" size={14} color="#fff" />
                  </View>
                </View>
                
                <View style={styles.gridContent}>
                  <Text style={styles.gridName} numberOfLines={2}>
                    {business.title}
                  </Text>
                  <Text style={styles.gridDescription} numberOfLines={2}>
                    {business.description || "No description available"}
                  </Text>
                  
                  <View style={styles.gridContactInfo}>
                    {business.contact && (
                      <View style={styles.contactItem}>
                        <Ionicons name="call" size={14} color="#93210A" />
                        <Text style={styles.contactText} numberOfLines={1}>
                          {business.contact}
                        </Text>
                      </View>
                    )}
                    
                    {business.address && (
                      <View style={styles.contactItem}>
                        <Ionicons name="location" size={14} color="#93210A" />
                        <Text style={styles.contactText} numberOfLines={1}>
                          {business.address}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.gridArrow}>
                  <Ionicons name="chevron-forward" size={18} color="#93210A" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Phone List Layout
          <View style={styles.listContainer}>
            {businesses.map((business) => (
              <TouchableOpacity
                key={business.id}
                style={styles.listCard}
                onPress={() => navigation.navigate("TownBusiness4", { 
                  businessData: business
                })}
                activeOpacity={0.8}
              >
                <View style={styles.listImageContainer}>
                  <Image 
                    source={{ uri: business.image }} 
                    style={styles.listImage}
                    resizeMode="cover"
                  />
                  <View style={styles.listImageOverlay} />
                </View>
                
                <View style={styles.listContent}>
                  <Text style={styles.listName} numberOfLines={2}>
                    {business.title}
                  </Text>
                  <Text style={styles.listDescription} numberOfLines={2}>
                    {business.description || "No description available"}
                  </Text>
                  
                  <View style={styles.listContactInfo}>
                    {business.contact && (
                      <View style={styles.contactItem}>
                        <Ionicons name="call" size={14} color="#93210A" />
                        <Text style={styles.contactText} numberOfLines={1}>
                          {business.phone}
                        </Text>
                      </View>
                    )}
                    
                    {business.address && (
                      <View style={styles.contactItem}>
                        <Ionicons name="location" size={14} color="#93210A" />
                        <Text style={styles.contactText} numberOfLines={1}>
                          {business.address}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.listArrow}>
                  <Ionicons name="chevron-forward" size={18} color="#93210A" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
    flex: 1,
  },
  statNumber: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 25,
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
    borderRadius: 10,
    padding: 5,
  },
  gridContent: {
    padding: 16,
  },
  gridName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 6,
    lineHeight: 20,
  },
  gridDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 12,
  },
  gridContactInfo: {
    gap: 6,
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
    width: isSmallDevice ? 80 : 90,
    height: isSmallDevice ? 80 : 90,
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
  listName: {
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
    marginBottom: 8,
  },
  listContactInfo: {
    gap: 4,
  },
  listArrow: {
    padding: 8,
  },

  // Contact Item (Shared)
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contactText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
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