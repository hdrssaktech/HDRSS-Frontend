import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Loader from "../../../components/Alert/Loader";

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

export default function DistrictBusinessPage0() {
  const route = useRoute();
  const navigation = useNavigation();

  const { districtId, districtName } = route.params || {};

  const [businessList, setBusinessList] = useState([]);
  const [advertisementImages, setAdvertisementImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adLoading, setAdLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  
  // Refs for auto-scroll
  const flatListRef = useRef(null);
  const scrollInterval = useRef(null);

  // Fetch Business List
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const url = `https://hdrss-backend.onrender.com/api/business/type/district/${districtId}`;
        const res = await axios.get(url);

        if (res.data?.resultData && Array.isArray(res.data.resultData)) {
          
        const sortedBusiness = res.data.resultData.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );

          setBusinessList(sortedBusiness);
        } else {
          setBusinessList([]);
        }
      } catch (err) {
        console.log("❌ Error =", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [districtId]);

  // Fetch Advertisement Images using new API
  useEffect(() => {
    const fetchAdvertisement = async () => {
      try {
        const url = `https://hdrss-backend.onrender.com/api/district-business-ads/filter?districtId=${districtId}&pageLevel=1&entityId=${districtId}`;


        const res = await axios.get(url);


        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const firstAd = res.data[0];
          if (firstAd.adImages && Array.isArray(firstAd.adImages) && firstAd.adImages.length > 0) {
            // Filter out any empty/null image URLs
            const validImages = firstAd.adImages.filter(img => img && img.trim() !== "");
            
            if (validImages.length > 0) {
              setAdvertisementImages(validImages);
     
            } else {
              // If no valid images, show 2 default images
              setAdvertisementImages(getDefaultAdImages());

            }
          } else {
            // If no adImages array or empty array, show 2 default images
            setAdvertisementImages(getDefaultAdImages());
         
          }
        } else {
          // If no data or empty array in response, show 2 default images
          setAdvertisementImages(getDefaultAdImages());
          
        }
      } catch (err) {
        console.log("❌ Error fetching district advertisement:", err);
        // On error, show 2 default images
        setAdvertisementImages(getDefaultAdImages());
      } finally {
        setAdLoading(false);
      }
    };

    if (districtId) {
      fetchAdvertisement();
    } else {
      // If no districtId, still show 2 default ads
      setAdvertisementImages(getDefaultAdImages());
      setAdLoading(false);
    }
  }, [districtId]);

  // Handle image load error
  const handleImageError = (index) => {
   
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
          </View> */}
        {/* )} */}
      </View>
    );
  };

  if (loading) {
    return (
    <Loader />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* Header - Fixed at top */}
      <View style={[styles.appBar, isTablet && styles.appBarTablet]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
        >
          <Ionicons name="arrow-back" size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.appBarTitle, isTablet && styles.appBarTitleTablet]}>
          {districtName} Business
        </Text>

        <View style={{ width: isTablet ? 40 : 30 }} />
      </View>

      {/* ScrollView for content below header */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Advertisement Banner - Always show (with at least 2 default images) */}
        {renderAdvertisement()}

        {/* Business List */}
        <FlatList
          data={businessList}
          keyExtractor={(item) => item.id.toString()}
          numColumns={isTablet ? 3 : 2}
          contentContainerStyle={[
            styles.listContainer, 
            isTablet && styles.listContainerTablet,
            { paddingTop: advertisementImages.length > 0 ? 10 : 16 }
          ]}
          columnWrapperStyle={isTablet && styles.columnWrapper}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, isTablet && styles.cardTablet]}
              onPress={() =>
                navigation.navigate("DistrictBusinessPage1", {
                  businessId: item.id,
                  businessName: item.name,
                  districtId: districtId,
                })
              }
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri:
                    item.imageUrl?.trim() !== ""
                      ? item.imageUrl
                      : "https://via.placeholder.com/200x200?text=No+Image",
                }}
                style={[styles.image, isTablet && styles.imageTablet]}
                resizeMode="cover"
              />
              <Text style={[styles.name, isTablet && styles.nameTablet]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={60} color="#ccc" />
              <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
                No businesses found
              </Text>
            </View>
          }
          scrollEnabled={false} // Disable scrolling for nested FlatList
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },

  // Header - Mobile (Fixed at top)
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
    zIndex: 1000, // Ensure header stays on top
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingBottom: 12,
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

  // List Container - Mobile
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  // List Container - Tablet
  listContainerTablet: {
    padding: 16,
    paddingBottom: 30,
  },

  // Column Wrapper - Tablet only
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  // Card - Mobile (Simple Design)
  card: {
    width: "48%",
    backgroundColor: "#fff",
    margin: "1%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  // Card - Tablet (Simple Design)
  cardTablet: {
    width: "32%",
    padding: 16,
    borderRadius: 14,
    margin: "0.66%",
  },

  // Image - Mobile
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  // Image - Tablet
  imageTablet: {
    height: 140,
    borderRadius: 10,
  },

  // Name - Mobile
  name: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#222",
    paddingHorizontal: 4,
  },
  // Name - Tablet
  nameTablet: {
    fontSize: 18,
    marginTop: 12,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  emptyTextTablet: {
    fontSize: 18,
    marginTop: 20,
  }, 
});


