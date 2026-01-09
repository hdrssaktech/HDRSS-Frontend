import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  FlatList,
  Linking,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

// 2 Default ad images
const DEFAULT_AD_IMAGES = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop", // Business meeting
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop", // Office workspace
];

// Get default images (always returns both)
const getDefaultAdImages = () => [...DEFAULT_AD_IMAGES];

export default function DistrictBusinessPage3({ route, navigation }) {
  const { businessDetailsId, districtId = 16 } = route.params || {};

  const [details, setDetails] = useState([]);
  const [advertisementImages, setAdvertisementImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adLoading, setAdLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  
  // Refs for auto-scroll
  const flatListRef = useRef(null);
  const scrollInterval = useRef(null);

  useEffect(() => {
    fetchDetails();
    fetchAdvertisement();
  }, []);

  const fetchDetails = async () => {
    try {
      const url = `https://hdrss-backend.onrender.com/api/business/details/${businessDetailsId}`;
      const res = await axios.get(url);
      setDetails(res.data.data || []);
    } catch (e) {
      console.log("❌ Error fetching:", e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Advertisement Images using new API - pageLevel 4, entityId is businessDetailsId
  const fetchAdvertisement = async () => {
    try {
      const url = `https://hdrss-backend.onrender.com/api/district-business-ads/filter?districtId=${districtId}&pageLevel=4&entityId=${businessDetailsId}`;
      console.log("🔍 FETCHING DISTRICT ADVERTISEMENT for Page 3 =", url);

      const res = await axios.get(url);

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const firstAd = res.data[0];
        if (firstAd.adImages && Array.isArray(firstAd.adImages) && firstAd.adImages.length > 0) {
          // Filter out any empty/null image URLs
          const validImages = firstAd.adImages.filter(img => img && img.trim() !== "");
          
          if (validImages.length > 0) {
            setAdvertisementImages(validImages);
            console.log("✅ District advertisement images loaded for Page 3:", validImages.length);
          } else {
            // If no valid images, show 2 default images
            setAdvertisementImages(getDefaultAdImages());
            console.log("⚠️ No valid advertisement images found, showing 2 default images");
          }
        } else {
          // If no adImages array or empty array, show 2 default images
          setAdvertisementImages(getDefaultAdImages());
          console.log("⚠️ No advertisement images array found, showing 2 default images");
        }
      } else {
        // If no data or empty array in response, show 2 default images
        setAdvertisementImages(getDefaultAdImages());
        console.log("⚠️ No advertisement data found for this entity on Page 3, showing 2 default images");
      }
    } catch (err) {
      console.log("❌ Error fetching advertisement for Page 3:", err);
      // On error, show 2 default images
      setAdvertisementImages(getDefaultAdImages());
    } finally {
      setAdLoading(false);
    }
  };

  const callNow = (num) => num && Linking.openURL(`tel:${num}`);
  const whatsappNow = (num) => num && Linking.openURL(`https://wa.me/${num}`);
  const openMap = (url) => url && Linking.openURL(url);

  // Handle image load error
  const handleImageError = (index) => {
    console.log(`❌ Image ${index} failed to load, switching to default`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
    
    // Replace the failed image with a default image
    if (advertisementImages[index]) {
      const newImages = [...advertisementImages];
      // Use one of the default images based on index
      const defaultIndex = index % DEFAULT_AD_IMAGES.length;
      newImages[index] = DEFAULT_AD_IMAGES[defaultIndex];
      setAdvertisementImages(newImages);
    }
  };

  // Auto-scroll functionality for ads (always auto-scroll since we have at least 2 images)
  useEffect(() => {
    if (advertisementImages.length > 0 && flatListRef.current) {
      // Clear any existing interval
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }

      // Set up new interval for auto-scroll
      scrollInterval.current = setInterval(() => {
        setCurrentAdIndex((prevIndex) => {
          let nextIndex = prevIndex + 1;
          
          // If reached the end, go back to start
          if (nextIndex >= advertisementImages.length) {
            nextIndex = 0;
          }
          
          // Scroll to the next ad
          if (flatListRef.current) {
            try {
              flatListRef.current.scrollToOffset({
                offset: nextIndex * screenWidth,
                animated: true,
              });
            } catch (error) {
              console.log("Scroll error:", error);
            }
          }
          
          return nextIndex;
        });
      }, 3000); // Change ad every 3 seconds

      // Clean up interval on unmount
      return () => {
        if (scrollInterval.current) {
          clearInterval(scrollInterval.current);
        }
      };
    }
  }, [advertisementImages.length]);

  // Handle manual scroll
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    if (newIndex !== currentAdIndex) {
      setCurrentAdIndex(newIndex);
    }
  };

  // Handle scroll end
  const handleMomentumScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentAdIndex(newIndex);
  };

  // Render Advertisement Banner
  const renderAdvertisement = () => {
    if (adLoading) {
      return (
        <View style={[styles.adContainer, isTablet && styles.adContainerTablet]}>
          <ActivityIndicator size="small" color="#E37714" />
          <Text style={[styles.adLoadingText, isTablet && styles.adLoadingTextTablet]}>
            Loading Ads...
          </Text>
        </View>
      );
    }

    // Always show advertisement banner (with at least 2 default images)
    return (
      <View style={[styles.adContainer, isTablet && styles.adContainerTablet]}>
        <FlatList
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          data={advertisementImages}
          keyExtractor={(item, index) => `${index}-${item.substring(0, 20)}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.adItem, isTablet && styles.adItemTablet]}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: item }}
                style={[styles.adImage, isTablet && styles.adImageTablet]}
                resizeMode="cover"
                onError={() => handleImageError(index)}
              />
            </TouchableOpacity>
          )}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          initialScrollIndex={0}
          snapToInterval={screenWidth}
          snapToAlignment="center"
          decelerationRate="fast"
        />

        {/* Pagination Dots - Always show since we have at least 2 images
        {advertisementImages.length > 0 && (
          <View style={styles.paginationContainer}>
            {advertisementImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentAdIndex ? styles.paginationDotActive : styles.paginationDotInactive
                ]}
              />
            ))}
          </View>
        )} */}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E37714" />
        <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
          Loading Business Details...
        </Text>
      </View>
    );
  }

  // Render item function for FlatList
  const renderBusinessItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("DistrictBusinessPage4", { item })
      }
      style={isTablet ? { width: "48%" } : { width: "100%" }}
    >
      <View style={[styles.card, isTablet && styles.cardTablet]}>
        {/* IMAGE */}
        <Image 
          source={{ uri: item.imageUrl }} 
          style={[styles.cardImage, isTablet && styles.cardImageTablet]} 
          resizeMode="cover"
        />

        {/* TEXT + ACTIONS */}
        <View style={[styles.contentContainer, isTablet && styles.contentContainerTablet]}>
          <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]}>
            {item.name}
          </Text>
          <Text style={[styles.cardSubtitle, isTablet && styles.cardSubtitleTablet]}>
            {item.category}
          </Text>

          {/* LOCATION TEXT */}
          {item.location ? (
            <Text style={[styles.locationText, isTablet && styles.locationTextTablet]}>
              📍 {item.location}
            </Text>
          ) : null}

          {/* CONTACT BUTTONS */}
          <View style={[styles.buttonContainer, isTablet && styles.buttonContainerTablet]}>
            <TouchableOpacity
              onPress={() => callNow(item.phoneNo)}
              style={[styles.iconBtn, { backgroundColor: "#8EC9FF" }, isTablet && styles.iconBtnTablet]}
            >
              <Icon name="call" size={isTablet ? 22 : 18} color="#005BBB" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                whatsappNow(item.whatsappNo || item.phoneNo)
              }
              style={[styles.iconBtn, { backgroundColor: "#CFFDE1" }, isTablet && styles.iconBtnTablet]}
            >
              <Icon name="logo-whatsapp" size={isTablet ? 22 : 18} color="#25D366" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openMap(item.mapUrl)}
              style={[styles.iconBtn, { backgroundColor: "#FFD7C2" }, isTablet && styles.iconBtnTablet]}
            >
              <Icon name="map" size={isTablet ? 22 : 18} color="#FF5722" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* HEADER */}
      <View style={[styles.appBar, isTablet && styles.appBarTablet]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
        >
          <Icon name="arrow-back" size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, isTablet && styles.appBarTitleTablet]}>
          Business List
        </Text>
        <View style={{ width: isTablet ? 40 : 30 }} />
      </View>

      {/* ADVERTISEMENT BANNER - Always show (with at least 2 default images) */}
      {renderAdvertisement()}

      {/* BUSINESS LIST - Using FlatList for 2 column layout on tablet */}
      <FlatList
        data={details}
        renderItem={renderBusinessItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={isTablet ? 2 : 1}
        contentContainerStyle={[
          styles.listContainer,
          isTablet && styles.listContainerTablet,
          { paddingTop: advertisementImages.length > 0 ? 10 : 16 }
        ]}
        columnWrapperStyle={isTablet && styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#F6F7FB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#E37714",
    fontWeight: "600",
  },
  loadingTextTablet: {
    fontSize: 16,
    marginTop: 15,
  },

  // Header - Mobile
  appBar: {
    height: 90,
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    justifyContent: "space-between",
    elevation: 6,
    shadowColor: "#93210A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  // Header - Tablet
  appBarTablet: {
    height: 100,
    paddingTop: Platform.OS === 'ios' ? 45 : 35,
    paddingHorizontal: 30,
  },

  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  backButtonTablet: {
    padding: 10,
    borderRadius: 25,
  },

  // Header Title - Mobile
  appBarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  // Header Title - Tablet
  appBarTitleTablet: {
    fontSize: 24,
  },

  // Advertisement Container - Full Edge
  adContainer: {
    backgroundColor: "#f5f5f5",
    height: 200,
    width: screenWidth,
    overflow: "hidden",
  },
  // Advertisement Container - Tablet
  adContainerTablet: {
    height: 250,
  },

  adLoadingText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  adLoadingTextTablet: {
    fontSize: 14,
  },

  // Ad Item - Full width
  adItem: {
    width: screenWidth,
    height: 200,
  },
  // Ad Item - Tablet
  adItemTablet: {
    height: 250,
  },

  // Ad Image - Full width
  adImage: {
    width: screenWidth,
    height: "100%",
  },
  // Ad Image - Tablet
  adImageTablet: {
    width: screenWidth,
    height: "100%",
  },

  // Pagination Dots
  paginationContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: "#E37714",
    width: 16,
  },
  paginationDotInactive: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  // List Container - Mobile (1 column)
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  // List Container - Tablet (2 columns)
  listContainerTablet: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  // Column Wrapper - Tablet only (2 columns)
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },

  // Card - Mobile (1 column - full width)
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  // Card - Tablet (2 columns - 48% width each)
  cardTablet: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 0,
  },

  // Card Image - Mobile
  cardImage: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  // Card Image - Tablet
  cardImageTablet: {
    height: 160,
    borderRadius: 16,
  },

  // Content Container - Mobile
  contentContainer: {
    flex: 1,
  },
  // Content Container - Tablet
  contentContainerTablet: {
    // Same as mobile for consistency
  },

  // Card Title - Mobile
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  // Card Title - Tablet
  cardTitleTablet: {
    fontSize: 18,
  },

  // Card Subtitle - Mobile
  cardSubtitle: {
    marginBottom: 6,
    color: "#666",
    fontSize: 14,
  },
  // Card Subtitle - Tablet
  cardSubtitleTablet: {
    fontSize: 15,
  },

  // Location Text - Mobile
  locationText: {
    marginBottom: 12,
    color: "#444",
    fontSize: 14,
  },
  // Location Text - Tablet
  locationTextTablet: {
    fontSize: 15,
  },

  // Button Container - Mobile
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  // Button Container - Tablet
  buttonContainerTablet: {
    justifyContent: "center",
  },

  // Icon Button - Mobile
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  // Icon Button - Tablet
  iconBtnTablet: {
    width: 44,
    height: 44,
    borderRadius: 16,
    marginHorizontal: 8,
  },
});