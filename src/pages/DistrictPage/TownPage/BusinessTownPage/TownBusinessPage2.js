import React, { useEffect, useState, useRef } from "react";
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
  Linking,
  FlatList,
  Animated,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

// 2 Default ad images
const DEFAULT_AD_IMAGES = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
];

// Default business image
const DEFAULT_BUSINESS_IMAGE = 'https://via.placeholder.com/400x300/93210A/ffffff?text=Business';

// Get default ad images
const getDefaultAdImages = () => [...DEFAULT_AD_IMAGES];

// Extract YouTube video ID
const getYouTubeId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/embed\/([^"&?\/\s]{11})/,
    /youtube\.com\/v\/([^"&?\/\s]{11})/,
    /youtube\.com\/watch\?v=([^"&?\/\s]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

export default function TownBusinessPage3() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Get all parameters from route
  const { subcategoryItemId, entityId, townId, categoryName } = route.params;
  const [businesses, setBusinesses] = useState([]);

  console.log('📱 Page 3 Params:', {
    subcategoryItemId,
    entityId,
    townId,
    categoryName
  });
  console.log(subcategoryItemId)

  const [data, setData] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adsLoading, setAdsLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  
  // Advertisement carousel refs
  const flatListRef = useRef(null);
  const adIndex = useRef(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Check if image URL is valid
  const isValidImageUrl = (url) => {
    if (!url || url === 'null' || url === 'undefined' || url === '' || url === 'N/A') {
      return false;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    return true;
  };

  // Get safe image URL
  const getSafeImageUrl = (url) => {
    return isValidImageUrl(url) ? url : DEFAULT_BUSINESS_IMAGE;
  };

  /* ================= IMPROVED ADS FETCHING ================= */
  useEffect(() => {
    const fetchAds = async () => {
      try {
        console.log(`🔍 FETCHING ADS for Page 3:`, {
          townId,
          pageLevel: 3,
          entityId
        });
        
        // Test the API endpoint first to see the actual response
        const testResponse = await fetch(
          `https://hdrss-backend.onrender.com/api/town-business-ads/filter?townId=${townId}&pageLevel=3&entityId=17}`
        );
        
        console.log('📊 API Response status:', testResponse.status);
        console.log('📊 API Response headers:', testResponse.headers);
        
        const json = await testResponse.json();
        console.log('📊 FULL API RESPONSE:', JSON.stringify(json, null, 2));
        
        // Process the response based on actual structure
        const processedAds = [];
        
        if (json.success && json.data) {
          // Case 1: json.data is an array
          if (Array.isArray(json.data)) {
            json.data.forEach((adItem, index) => {
              console.log('📊 Processing ad item:', adItem);
              
              // Try different field names for images
              const possibleImageFields = [
                'adImages', 'images', 'imageUrls', 'bannerImages', 
                'adBanners', 'banners', 'image'
              ];
              
              possibleImageFields.forEach(field => {
                if (Array.isArray(adItem[field])) {
                  adItem[field].forEach((img, imgIndex) => {
                    if (isValidImageUrl(img)) {
                      processedAds.push({
                        id: `img-${index}-${imgIndex}-${Date.now()}`,
                        type: 'image',
                        url: img,
                        source: `array-field-${field}`
                      });
                    }
                  });
                } else if (isValidImageUrl(adItem[field])) {
                  // Single image field
                  processedAds.push({
                    id: `img-${index}-single-${Date.now()}`,
                    type: 'image',
                    url: adItem[field],
                    source: `single-field-${field}`
                  });
                }
              });
              
              // Try video fields
              const possibleVideoFields = ['adVideos', 'videos', 'videoUrls', 'video'];
              possibleVideoFields.forEach(field => {
                if (Array.isArray(adItem[field])) {
                  adItem[field].forEach((video, vidIndex) => {
                    if (video) {
                      const videoId = getYouTubeId(video);
                      if (videoId) {
                        processedAds.push({
                          id: `vid-${index}-${vidIndex}-${Date.now()}`,
                          type: 'video',
                          url: video,
                          videoId,
                          source: `video-field-${field}`
                        });
                      }
                    }
                  });
                } else if (adItem[field]) {
                  const videoId = getYouTubeId(adItem[field]);
                  if (videoId) {
                    processedAds.push({
                      id: `vid-${index}-single-${Date.now()}`,
                      type: 'video',
                      url: adItem[field],
                      videoId,
                      source: `single-video-field-${field}`
                    });
                  }
                }
              });
            });
          } 
          // Case 2: json.data is a single object
          else if (typeof json.data === 'object') {
            const adItem = json.data;
            console.log('📊 Processing single ad object:', adItem);
            
            // Check for images in the object
            const imageFields = Object.keys(adItem).filter(key => 
              key.toLowerCase().includes('image') || 
              key.toLowerCase().includes('banner')
            );
            
            imageFields.forEach(field => {
              const value = adItem[field];
              if (Array.isArray(value)) {
                value.forEach((img, imgIndex) => {
                  if (isValidImageUrl(img)) {
                    processedAds.push({
                      id: `obj-img-${field}-${imgIndex}-${Date.now()}`,
                      type: 'image',
                      url: img,
                      source: `object-array-${field}`
                    });
                  }
                });
              } else if (isValidImageUrl(value)) {
                processedAds.push({
                  id: `obj-img-${field}-${Date.now()}`,
                  type: 'image',
                  url: value,
                  source: `object-single-${field}`
                });
              }
            });
            
            // Check for videos
            const videoFields = Object.keys(adItem).filter(key => 
              key.toLowerCase().includes('video')
            );
            
            videoFields.forEach(field => {
              const value = adItem[field];
              if (Array.isArray(value)) {
                value.forEach((video, vidIndex) => {
                  if (video) {
                    const videoId = getYouTubeId(video);
                    if (videoId) {
                      processedAds.push({
                        id: `obj-vid-${field}-${vidIndex}-${Date.now()}`,
                        type: 'video',
                        url: video,
                        videoId,
                        source: `object-video-array-${field}`
                      });
                    }
                  }
                });
              } else if (value) {
                const videoId = getYouTubeId(value);
                if (videoId) {
                  processedAds.push({
                    id: `obj-vid-${field}-${Date.now()}`,
                    type: 'video',
                    url: value,
                    videoId,
                    source: `object-single-video-${field}`
                  });
                }
              }
            });
          }
        } 
        // Case 3: json is directly an array
        else if (Array.isArray(json)) {
          console.log('📊 Response is directly an array:', json);
          json.forEach((adItem, index) => {
            // Look for any string that might be an image URL
            Object.keys(adItem).forEach(key => {
              const value = adItem[key];
              if (typeof value === 'string' && isValidImageUrl(value)) {
                processedAds.push({
                  id: `direct-img-${index}-${key}-${Date.now()}`,
                  type: 'image',
                  url: value,
                  source: `direct-${key}`
                });
              }
            });
          });
        }
        
        console.log(`📊 Processed ${processedAds.length} ads from API`);
        
        if (processedAds.length > 0) {
          console.log('✅ Successfully loaded ads:', processedAds);
          setAdsData(processedAds);
        } else {
          console.log('⚠️ No ads found in API response, checking for manual test');
          // Manual test with sample ad images
          await testWithSampleImages();
        }
        
      } catch (error) {
        console.log("❌ Ads fetch error:", error.message);
        await testWithSampleImages();
      } finally {
        setAdsLoading(false);
      }
    };

    // Function to test with sample images
    const testWithSampleImages = async () => {
      console.log('🔄 Testing with sample ad images...');
      
      // Try a different approach - directly test if the API returns any data
      try {
        // Try a simpler fetch to see what's available
        const testUrl = `https://hdrss-backend.onrender.com/api/town-business-ads`;
        console.log('🔄 Testing URL:', testUrl);
        
        const testRes = await fetch(testUrl);
        const testData = await testRes.json();
        console.log('📊 Test API response:', testData);
        
        // If we still get no ads, use defaults
        if (testData && testData.length > 0) {
          const testAds = [];
          testData.forEach((item, index) => {
            // Try to extract any image URLs
            Object.keys(item).forEach(key => {
              const value = item[key];
              if (typeof value === 'string' && isValidImageUrl(value)) {
                testAds.push({
                  id: `test-${index}-${key}-${Date.now()}`,
                  type: 'image',
                  url: value,
                  source: `test-${key}`
                });
              }
            });
          });
          
          if (testAds.length > 0) {
            console.log(`✅ Found ${testAds.length} test ads`);
            setAdsData(testAds);
            return;
          }
        }
      } catch (testError) {
        console.log('❌ Test fetch error:', testError.message);
      }
      
      // Final fallback to default images
      console.log('⚠️ Using default ad images');
      const defaultAds = getDefaultAdImages().map((img, index) => ({
        id: `default-${index}-${Date.now()}`,
        type: 'image',
        url: img,
        source: 'default'
      }));
      setAdsData(defaultAds);
    };

    // Only fetch ads if we have valid parameters
    if (townId && entityId) {
      fetchAds();
    } else {
      console.log('⚠️ Missing parameters for ads fetch:', { townId, entityId });
      setAdsLoading(false);
      setAdsData(getDefaultAdImages().map((img, index) => ({
        id: `default-${index}-${Date.now()}`,
        type: 'image',
        url: img,
        source: 'default-missing-params'
      })));
    }
  }, [townId, entityId]);

  /* ================= FETCH BUSINESSES ================= */
  useEffect(() => {
    console.log(`🔍 FETCHING BUSINESSES for ID: ${subcategoryItemId}`);
    
    fetch(
      `https://hdrss-backend.onrender.com/api/tb/business/by-subcategory/${subcategoryItemId}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(jsonData => {
        console.log('📊 Businesses response:', jsonData);
        
        let dataArray = [];
        if (Array.isArray(jsonData)) {
          dataArray = jsonData;
        } else if (jsonData && Array.isArray(jsonData.data)) {
          dataArray = jsonData.data;
        }
        
        const processedData = dataArray.map((item, index) => ({
          id: item.id || `item-${index}`,
          title: item.title || item.name || `Business ${index + 1}`,
          phone: item.phone || '',
          whatsapp: item.whatsapp || '',
          location: item.location || '',
          image: getSafeImageUrl(item.image || item.imageUrl || ''),
          description: item.description || '',
          email: item.email || '',
        }));
        
        setData(processedData);
        console.log(`✅ Loaded ${processedData.length} businesses`);
      })
      .catch(error => {
        console.log("❌ Businesses fetch error:", error.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [subcategoryItemId]);

  // Auto-scroll functionality for ads
  useEffect(() => {
    if (adsData.length <= 1) return;

    const scrollInterval = setInterval(() => {
      if (adIndex.current >= adsData.length - 1) {
        adIndex.current = 0;
      } else {
        adIndex.current += 1;
      }

      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: adIndex.current,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, [adsData]);

  /* ================= ACTIONS ================= */
  const handleCall = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleLocation = (location) => {
    if (location) {
      const url = Platform.select({
        ios: `maps:0,0?q=${encodeURIComponent(location)}`,
        android: `geo:0,0?q=${encodeURIComponent(location)}`,
      });
      Linking.openURL(url);
    }
  };

  const handleWhatsapp = (phone) => {
    if (phone) {
      Linking.openURL(`https://wa.me/${phone}`);
    }
  };

  // Render advertisement item
  const renderAdItem = ({ item, index }) => {
    console.log(`🖼️ Rendering ad ${index}:`, item);
    
    if (item.type === 'image') {
      return (
        <View style={[
          styles.adItemContainer,
          { width: screenWidth }
        ]}>
          <Image
            source={{ uri: item.url }}
            style={styles.adImage}
            resizeMode="cover"
            onError={(e) => {
              console.log(`❌ Ad image failed to load: ${item.url}`, e.nativeEvent.error);
              // Fallback to default if image fails
              item.url = DEFAULT_AD_IMAGES[index % DEFAULT_AD_IMAGES.length];
            }}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
            style={styles.adGradient}
          />
          {/* Debug info overlay - can remove in production */}
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>Source: {item.source}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[
          styles.adItemContainer,
          { width: screenWidth }
        ]}>
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play-circle" size={50} color="#93210A" />
            <Text style={styles.videoText}>Video Ad</Text>
            <Text style={styles.videoSubtext}>{item.source}</Text>
          </View>
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
            style={styles.adGradient}
          />
        </View>
      );
    }
  };

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <View style={isTablet ? styles.loaderTablet : styles.loaderMobile}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={isTablet ? styles.loaderTextTablet : styles.loaderTextMobile}>
          Loading businesses...
        </Text>
      </View>
    );
  }

  return (
    <View style={isTablet ? styles.containerTablet : styles.containerMobile}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      {/* ================= HEADER ================= */}
      <LinearGradient
        colors={["#93210A", "#B32A0C"]}
        style={isTablet ? styles.headerTablet : styles.headerMobile}
      >
        <TouchableOpacity
          style={isTablet ? styles.backTablet : styles.backMobile}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={isTablet ? styles.headerTitleTablet : styles.headerTitleMobile}
        >
          {categoryName}
        </Text>
      </LinearGradient>

      {/* ================= ADVERTISEMENT BANNER ================= */}
      <View style={[
        styles.adsContainer,
        { 
          height: isLargeTablet ? 200 : 
                 isTablet ? 180 : 
                 160 
        }
      ]}>
        {adsLoading ? (
          <View style={styles.adsLoadingContainer}>
            <ActivityIndicator size="large" color="#93210A" />
            <Text style={styles.adsLoadingText}>Loading ads...</Text>
          </View>
        ) : adsData.length > 0 ? (
          <>
            <Animated.FlatList
              ref={flatListRef}
              data={adsData}
              renderItem={renderAdItem}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.floor(
                  event.nativeEvent.contentOffset.x / screenWidth
                );
                adIndex.current = newIndex;
              }}
              scrollEventThrottle={16}
            />
            
            {/* Pagination Dots */}
            {adsData.length > 1 && (
              <View style={styles.paginationContainer}>
                {adsData.map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.paginationDot,
                      { 
                        opacity: i === adIndex.current ? 1 : 0.5,
                        width: i === adIndex.current ? 10 : 6,
                      }
                    ]} 
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.noAdsContainer}>
            <Image
              source={{ uri: DEFAULT_AD_IMAGES[0] }}
              style={styles.defaultAdImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
              style={styles.adGradient}
            />
          </View>
        )}
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView
        contentContainerStyle={[
          isTablet ? styles.contentTablet : styles.contentMobile,
          { paddingTop: 10 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={isTablet ? styles.gridTablet : styles.listMobile}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <TouchableOpacity
                key={item.id || index}
                activeOpacity={0.85}
                style={isTablet ? styles.cardTablet : styles.cardMobile}
                onPress={() =>
                  navigation.navigate("TownBusiness4", {
                    businessId: item.id,
                    businessData: item,
                    entityId: entityId,
                    townId: townId,
                    categoryName: categoryName,
                  })
                }
              >
                <Image
                  source={{ uri: getSafeImageUrl(item.image) }}
                  style={isTablet ? styles.imageTablet : styles.imageMobile}
                  onError={(e) => {
                    console.log(`❌ Business image failed to load: ${item.image}`, e.nativeEvent.error);
                  }}
                />

                <Text
                  numberOfLines={2}
                  style={isTablet ? styles.titleTablet : styles.titleMobile}
                >
                  {item.title}
                </Text>

                <View
                  style={isTablet ? styles.iconRowTablet : styles.iconRowMobile}
                >
                  {item.phone && (
                    <TouchableOpacity
                      onPress={() => handleCall(item.phone)}
                      style={
                        isTablet
                          ? styles.phoneIconTablet
                          : styles.phoneIconMobile
                      }
                    >
                      <Ionicons name="call" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}

                  {item.location && (
                    <TouchableOpacity
                      onPress={() => handleLocation(item.location)}
                      style={
                        isTablet
                          ? styles.locationIconTablet
                          : styles.locationIconMobile
                      }
                    >
                      <Ionicons name="location" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}

                  {item.whatsapp && (
                    <TouchableOpacity
                      onPress={() => handleWhatsapp(item.whatsapp)}
                      style={
                        isTablet
                          ? styles.whatsappIconTablet
                          : styles.whatsappIconMobile
                      }
                    >
                      <Ionicons name="logo-whatsapp" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="business-outline" size={60} color="#ccc" />
              <Text style={styles.noDataText}>
                No businesses available
              </Text>
              <Text style={styles.noDataSubtext}>
                Check back later for new listings
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ================================================= */
/* ======================= STYLES ================== */
/* ================================================= */

const styles = StyleSheet.create({
  /* ================= MOBILE ================= */
  containerMobile: {
    flex: 1,
    backgroundColor: "#F6F7F9",
  },

  headerMobile: {
    paddingTop: Platform.OS === "ios" ? 55 : 45,
    paddingBottom: 20,
    alignItems: "center",
  },

  backMobile: {
    position: "absolute",
    left: 16,
    top: Platform.OS === "ios" ? 55 : 45,
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 12,
  },

  headerTitleMobile: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  contentMobile: {
    padding: 16,
    paddingBottom: 30,
  },

  listMobile: {
    flexDirection: "column",
  },

  cardMobile: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  imageMobile: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },

  titleMobile: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: '#333',
  },

  iconRowMobile: {
    flexDirection: "row",
    gap: 10,
  },

  phoneIconMobile: {
    backgroundColor: "#93210A",
    padding: 8,
    borderRadius: 10,
  },

  locationIconMobile: {
    backgroundColor: "#2E8B57",
    padding: 8,
    borderRadius: 10,
  },

  whatsappIconMobile: {
    backgroundColor: "#25D366",
    padding: 8,
    borderRadius: 10,
  },

  loaderMobile: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
  },

  loaderTextMobile: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },

  /* ================= TABLET ================= */
  containerTablet: {
    flex: 1,
    backgroundColor: "#F2F3F5",
  },

  headerTablet: {
    paddingTop: 65,
    paddingBottom: 30,
    alignItems: "center",
  },

  backTablet: {
    position: "absolute",
    left: 40,
    top: 65,
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 10,
    borderRadius: 14,
  },

  headerTitleTablet: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
  },

  contentTablet: {
    padding: 30,
    paddingBottom: 40,
  },

  gridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardTablet: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  imageTablet: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },

  titleTablet: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 12,
    color: '#333',
  },

  iconRowTablet: {
    flexDirection: "row",
    gap: 14,
  },

  phoneIconTablet: {
    backgroundColor: "#93210A",
    padding: 10,
    borderRadius: 12,
  },

  locationIconTablet: {
    backgroundColor: "#2E8B57",
    padding: 10,
    borderRadius: 12,
  },

  whatsappIconTablet: {
    backgroundColor: "#25D366",
    padding: 10,
    borderRadius: 12,
  },

  loaderTablet: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
  },

  loaderTextTablet: {
    fontSize: 16,
    marginTop: 12,
    color: "#666",
  },

  /* ================= ADVERTISEMENT STYLES ================= */
  adsContainer: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  adItemContainer: {
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  adImage: {
    width: '100%',
    height: '100%',
  },
  
  defaultAdImage: {
    width: '100%',
    height: '100%',
  },
  
  adGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  videoText: {
    marginTop: 10,
    color: '#93210A',
    fontWeight: '600',
  },
  
  videoSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  
  adsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  
  adsLoadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },

  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    zIndex: 2,
  },
  
  paginationDot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(147, 33, 10, 0.9)',
    marginHorizontal: 4,
  },

  noAdsContainer: {
    flex: 1,
    position: 'relative',
  },

  /* ================= DEBUG STYLES ================= */
  debugInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  
  debugText: {
    color: 'white',
    fontSize: 10,
  },

  /* ================= NO DATA STYLES ================= */
  noDataContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 20,
  },

  noDataText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },

  noDataSubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
});