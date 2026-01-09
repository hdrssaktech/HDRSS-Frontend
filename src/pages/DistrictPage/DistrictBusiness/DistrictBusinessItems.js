import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

export default function DistrictBusinessItems() {
  const route = useRoute();
  const navigation = useNavigation();
  const { businessId, phoneNumber, location, businessName } = route.params || {};
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;
  const numColumns = isTablet ? 3 : 2;
  const cardWidth = (width - 48) / numColumns;

  // Format sizes into array
  const formatSizes = (sizeString) => {
    if (!sizeString) return [];
    const sizes = sizeString.replace(/\s+/g, '').split(',');
    return sizes.filter(size => size.length > 0);
  };

  // Make a phone call
  const handleCall = () => {
    if (!phoneNumber) return;
    
    // Clean the phone number (remove any non-numeric characters)
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Check if the phone number has a country code
    let phoneToCall = cleanPhoneNumber;
    if (!cleanPhoneNumber.startsWith('+') && !cleanPhoneNumber.startsWith('0')) {
      // Add default country code for India if not present
      phoneToCall = `+91${cleanPhoneNumber}`;
    }
    
    const phoneUrl = `tel:${phoneToCall}`;
    
    // Check if the device can open the URL
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert(
            "Error",
            "Unable to make phone call on this device",
            [{ text: "OK" }]
          );
        }
      })
      .catch((err) => {
        console.error("Error opening phone app:", err);
        Alert.alert(
          "Error",
          "Unable to make phone call",
          [{ text: "OK" }]
        );
      });
  };

  // Open location in maps
  const handleOpenMap = () => {
    if (!location) return;
    
    // Encode the location for URL
    const encodedLocation = encodeURIComponent(location);
    
    // Try different map apps
    const urls = {
      googleMaps: `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
      appleMaps: `http://maps.apple.com/?q=${encodedLocation}`,
      fallback: `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
    };
    
    // Determine which map to use based on platform
    const url = Platform.OS === 'ios' ? urls.appleMaps : urls.googleMaps;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to Google Maps web version
          return Linking.openURL(urls.fallback);
        }
      })
      .catch((err) => {
        console.error("Error opening maps:", err);
        Alert.alert(
          "Error",
          "Unable to open maps application",
          [{ text: "OK" }]
        );
      });
  };

  // Show confirmation dialog for phone call
  const confirmCall = () => {
    if (!phoneNumber) return;
    
    Alert.alert(
      "Call Business",
      `Do you want to call ${businessName || 'this business'} at ${phoneNumber}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Call",
          style: "default",
          onPress: handleCall
        }
      ]
    );
  };

  // Render size chips
  const renderSizeChips = (sizeString) => {
    const sizes = formatSizes(sizeString);
    
    if (sizes.length === 0) {
      return (
        <View style={styles.sizeContainer}>
          <Text style={styles.noSizeText}>No size info</Text>
        </View>
      );
    }

    const displaySizes = isTablet ? sizes : sizes.slice(0, 3);
    const hasMoreSizes = sizes.length > displaySizes.length;

    return (
      <View style={styles.sizeContainer}>
        <View style={styles.sizeRow}>
          {displaySizes.map((size, index) => (
            <View key={index} style={styles.sizeChip}>
              <Text style={styles.sizeText}>{size}</Text>
            </View>
          ))}
          {hasMoreSizes && (
            <View style={styles.moreSizeChip}>
              <Text style={styles.moreSizeText}>+{sizes.length - displaySizes.length}</Text>
            </View>
          )}
        </View>
        {hasMoreSizes && !isTablet && (
          <Text style={styles.additionalSizesText}>
            +{sizes.length - displaySizes.length} more sizes
          </Text>
        )}
      </View>
    );
  };

  // =========================
  // FETCH PRODUCTS
  // =========================
  
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `https://hdrss-backend.onrender.com/api/business/product/${businessId}`
      );
      setProducts(res.data?.data || []);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) fetchProducts();
  }, [businessId]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#93210A" />
          <Text style={styles.loadingText}>Loading Products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // RENDER PRODUCT
  // =========================
  const renderItem = ({ item, index }) => {
    const sizes = formatSizes(item.size);
    const hasMultipleSizes = sizes.length > 1;
    
    return (
      <TouchableOpacity 
        style={[styles.productCard, { width: cardWidth }]}
        activeOpacity={0.9}
      >
        {/* Product Image with Badge */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.image || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center",
            }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {index === 0 && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          {/* Product Name */}
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          
          {/* Category */}
          {item.category && (
            <Text style={styles.category} numberOfLines={1}>
              {item.category}
            </Text>
          )}

          {/* Size Display */}
          {item.size && (
            <View style={styles.sizeSection}>
              <View style={styles.sizeHeader}>
                <Text style={styles.sizeLabel}>
                  Size{hasMultipleSizes ? 's' : ''}:
                </Text>
                {hasMultipleSizes && (
                  <Text style={styles.sizeCount}>
                    {sizes.length} sizes
                  </Text>
                )}
              </View>
              {renderSizeChips(item.size)}
            </View>
          )}

          {/* Price */}
          {item.price && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{item.price}</Text>
              {item.originalPrice && (
                <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // =========================
  // HEADER COMPONENT
  // =========================
  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        {/* Back Button with Business Name */}
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          
          {businessName && (
            <View style={styles.businessNameContainer}>
              <Text style={styles.businessNameText} numberOfLines={1}>
                {businessName}
              </Text>
              {(phoneNumber || location) && (
                <View style={styles.businessInfoRow}>
                  {phoneNumber && (
                    <View style={styles.businessInfoItem}>
                      <Feather name="phone" size={12} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.businessInfoText} numberOfLines={1}>
                        {phoneNumber}
                      </Text>
                    </View>
                  )}
                  {location && (
                    <View style={styles.businessInfoItem}>
                      <MaterialIcons name="location-on" size={12} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.businessInfoText} numberOfLines={1}>
                        {location}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Page Title */}
        <Text style={styles.pageTitle}>Our Products</Text>

        {/* Contact Icons Row */}
        <View style={styles.contactRow}>
          {phoneNumber && (
            <TouchableOpacity 
              style={styles.contactButton}
              activeOpacity={0.7}
              onPress={confirmCall}
            >
              <View style={styles.iconCircle}>
                <Feather name="phone" size={20} color="#93210A" />
              </View>
              <Text style={styles.contactLabel}>Call</Text>
              <Text style={styles.contactNumber}>{phoneNumber}</Text>
            </TouchableOpacity>
          )}
          
          {location && (
            <TouchableOpacity 
              style={styles.contactButton}
              activeOpacity={0.7}
              onPress={handleOpenMap}
            >
              <View style={styles.iconCircle}>
                <MaterialIcons name="location-on" size={20} color="#93210A" />
              </View>
              <Text style={styles.contactLabel}>Location</Text>
              <Text style={styles.contactAddress} numberOfLines={1}>
                View on Map
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  // =========================
  // MAIN UI
  // =========================
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="bag-handle-outline" size={80} color="#d1d5db" />
            </View>
            <Text style={styles.emptyTitle}>No Products Yet</Text>
            <Text style={styles.emptySubtitle}>
              This business hasn't added any products
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {products.map((item, index) => (
              <View 
                key={item.id ? item.id.toString() : index.toString()} 
                style={[
                  styles.gridItem,
                  index % numColumns !== 0 && styles.gridItemMargin
                ]}
              >
                {renderItem({ item, index })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// =========================
// STYLES
// =========================
const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const numColumns = isTablet ? 3 : 2;
const cardWidth = (width - 48) / numColumns;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  
  // Header Styles
  headerContainer: {
    backgroundColor: "#93210A",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginBottom: 8,
  },
  
  header: {
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop:30
  },
  
  businessNameContainer: {
    flex: 1,
  },
  
  businessNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  
  businessInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  businessInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  businessInfoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    flexShrink: 1,
  },
  
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  contactButton: {
    alignItems: 'center',
    maxWidth: 120,
  },
  
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  contactLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'white',
    marginBottom: 2,
  },
  
  contactNumber: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  
  contactAddress: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    maxWidth: 100,
  },
  
  // Product Card Styles
  productCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  
  imageContainer: {
    position: 'relative',
  },
  
  productImage: {
    width: "100%",
    height: isTablet ? 140 : 150,
    backgroundColor: '#f8f9fa',
  },
  
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#93210A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  
  featuredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  
  productInfo: {
    padding: 12,
    paddingTop: 10,
  },
  
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 20,
    marginBottom: 4,
  },
  
  category: {
    fontSize: 12,
    color: "#666",
    fontWeight: '500',
    marginBottom: 8,
  },
  
  // Size Styles
  sizeSection: {
    marginBottom: 8,
  },
  
  sizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  sizeLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: '500',
  },
  
  sizeCount: {
    fontSize: 11,
    color: "#93210A",
    fontWeight: '600',
    backgroundColor: 'rgba(147, 33, 10, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  sizeContainer: {
    marginBottom: 4,
  },
  
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  
  sizeChip: {
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e6e9',
    minWidth: 32,
    alignItems: 'center',
  },
  
  sizeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d3748',
  },
  
  moreSizeChip: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  
  moreSizeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4a5568',
  },
  
  additionalSizesText: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  
  noSizeText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#93210A",
    marginRight: 6,
  },
  
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  
  // Grid Layout
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  
  gridItem: {
    width: cardWidth,
    marginBottom: 16,
  },
  
  gridItemMargin: {
    marginLeft: 16,
  },
  
  // Scroll View
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: "#374151",
    marginBottom: 8,
    textAlign: 'center',
  },
  
  emptySubtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  
  loadingText: {
    marginTop: 16,
    color: "#4b5563",
    fontSize: 16,
    fontWeight: '500',
  },
});