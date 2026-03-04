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
  TextInput,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "../../../../components/Alert/Loader";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >=600;
const isLargeTablet = screenWidth >= 800;

// Responsive size helper
const responsiveSize = (mobile, tablet, largeTablet) => {
  if (isLargeTablet) return largeTablet || tablet;
  return isTablet ? tablet : mobile;
};

// Advertisement heights based on screen size
const getAdHeight = () => {
  if (isLargeTablet) return 240;
  if (isTablet) return 200;
  return 160;
};

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


  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const [data, setData] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adsLoading, setAdsLoading] = useState(true);

  
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

  // Search filter function
  const filterData = (query) => {
    if (!query.trim()) {
      setFilteredData(data);
      return;
    }

    const lowerCaseQuery = query.toLowerCase().trim();

    const filtered = data.filter(item =>
      item.title &&
      item.title.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredData(filtered);
  };

  // Handle search input change
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    filterData(text);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredData(data);
  };

  /* ================= IMPROVED ADS FETCHING ================= */
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const testResponse = await fetch(
          `https://hdrss-backend.onrender.com/api/town-business-ads/filter?townId=${townId}&pageLevel=3&entityId=${subcategoryItemId}}`
        );
        
        const json = await testResponse.json();
        
        // Process the response based on actual structure
        const processedAds = [];
        
        if (json.success && json.data) {
          // Case 1: json.data is an array
          if (Array.isArray(json.data)) {
            json.data.forEach((adItem, index) => {
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
        
        if (processedAds.length > 0) {
          setAdsData(processedAds);
        } else {
          await testWithSampleImages();
        }
        
      } catch (error) {
        await testWithSampleImages();
      } finally {
        setAdsLoading(false);
      }
    };

    const testWithSampleImages = async () => {
      try {
        const testUrl = `https://hdrss-backend.onrender.com/api/town-business-ads`;
        
        const testRes = await fetch(testUrl);
        const testData = await testRes.json();
        
        if (testData && testData.length > 0) {
          const testAds = [];
          testData.forEach((item, index) => {
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
            setAdsData(testAds);
            return;
          }
        }
      } catch (testError) {
        console.log('❌ Test fetch error:', testError.message);
      }
      
      const defaultAds = getDefaultAdImages().map((img, index) => ({
        id: `default-${index}-${Date.now()}`,
        type: 'image',
        url: img,
        source: 'default'
      }));
      setAdsData(defaultAds);
    };

    if (townId && entityId) {
      fetchAds();
    } else {
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
          gallery: item.gallery || '',
          videos: item.videos || '',
          description: item.description || '',
          email: item.email || '',
        }));
        
        setData(processedData);
        setFilteredData(processedData);
      })
      .catch(error => {
        console.log("❌ Businesses fetch error:", error.message);
        setData([]);
        setFilteredData([]);
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
              item.url = DEFAULT_AD_IMAGES[index % DEFAULT_AD_IMAGES.length];
            }}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
            style={styles.adGradient}
          />
        </View>
      );
    } else {
      return (
        <View style={[
          styles.adItemContainer,
          { width: screenWidth }
        ]}>
          <View style={styles.videoPlaceholder}>
            <Ionicons name="play-circle" size={responsiveSize(50, 60, 70)} color="#93210A" />
            <Text style={styles.videoText}>Video Ad</Text>
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
     <Loader/>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      {/* ================= HEADER ================= */}
      <LinearGradient
        colors={["#93210A", "#B32A0C"]}
        style={[
          styles.header,
          { 
            paddingTop: Platform.OS === "ios" ? responsiveSize(55, 65, 70) : responsiveSize(45, 55, 60),
            paddingBottom: responsiveSize(20, 25, 30),
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            { 
              top: Platform.OS === "ios" ? responsiveSize(55, 65, 70) : responsiveSize(45, 55, 60),
              left: responsiveSize(16, 25, 30),
              padding: responsiveSize(8, 10, 12),
              borderRadius: responsiveSize(10, 12, 14)
            }
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={responsiveSize(24, 28, 32)} color="#fff" />
        </TouchableOpacity>

        <Text style={[
          styles.headerTitle,
          { fontSize: responsiveSize(20, 26, 30) }
        ]}>
          {categoryName}
        </Text>
        
        {isTablet && (
          <Text style={[
            styles.headerSubtitle,
            { fontSize: responsiveSize(14, 16, 18) }
          ]}>
            Find local businesses and services
          </Text>
        )}
      </LinearGradient>

      {/* ================= ADVERTISEMENT BANNER ================= */}
      <View style={[
        styles.adsContainer,
        { 
          height: getAdHeight(),
          borderRadius: responsiveSize(0, 0, 0),
          overflow: 'hidden',
        }
      ]}>
        {adsLoading ? (
          <View style={styles.adsLoadingContainer}>
            <ActivityIndicator size={responsiveSize("large", 50, 60)} color="#93210A" />
            <Text style={[
              styles.adsLoadingText,
              { fontSize: responsiveSize(14, 16, 18) }
            ]}>
              Loading ads...
            </Text>
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
                        width: i === adIndex.current ? responsiveSize(10, 12, 14) : responsiveSize(6, 8, 10),
                        height: responsiveSize(6, 8, 10),
                        borderRadius: responsiveSize(3, 4, 5),
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

      {/* ================= SEARCH BAR ================= */}
      <View style={[
        styles.searchContainer,
        { 
          paddingHorizontal: responsiveSize(16, 25, 30),
          paddingVertical: responsiveSize(15, 20, 25),
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        }
      ]}>
        <View style={[
          styles.searchBar,
          { 
            height: responsiveSize(48, 56, 62),
            borderRadius: responsiveSize(12, 14, 16),
            paddingHorizontal: responsiveSize(15, 18, 20)
          }
        ]}>
          <Ionicons 
            name="search" 
            size={responsiveSize(20, 24, 26)} 
            color="#666" 
            style={styles.searchIcon} 
          />
          <TextInput
            style={[
              styles.searchInput,
              { fontSize: responsiveSize(15, 17, 19) }
            ]}
            placeholder="Search businesses by name..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearchChange}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={responsiveSize(20, 24, 26)} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ================= BUSINESS COUNT ================= */}
      {searchQuery.length > 0 && (
        <View style={[
          styles.resultsContainer,
          { 
            paddingHorizontal: responsiveSize(16, 25, 30),
            paddingVertical: responsiveSize(10, 12, 14),
          }
        ]}>
          <Text style={[
            styles.resultsCount,
            { fontSize: responsiveSize(14, 16, 18) }
          ]}>
            {filteredData.length} business{filteredData.length !== 1 ? 'es' : ''} found for "{searchQuery}"
          </Text>
        </View>
      )}

      {/* ================= BUSINESS CARDS ================= */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { 
            padding: responsiveSize(16, 25, 30),
            paddingTop: responsiveSize(20, 25, 30)
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredData.length > 0 ? (
          <View style={styles.cardsContainer}>
            {filteredData.map((item, index) => (
              <TouchableOpacity
                key={item.id || index}
                activeOpacity={0.85}
                style={[
                  styles.card,
                  { 
                    borderRadius: responsiveSize(16, 20, 24),
                    padding: responsiveSize(15, 20, 25),
                    marginBottom: responsiveSize(20, 25, 30),
                    minHeight: responsiveSize(140, 160, 180)
                  }
                ]}
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
                {/* Card with 40% Image and 60% Content */}
                <View style={styles.cardInner}>
                  
                  {/* Left Side: Image (40%) */}
                  <View style={[
                    styles.cardImageContainer,
                    { 
                      width: '40%',
                      marginRight: responsiveSize(15, 20, 25)
                    }
                  ]}>
                    <Image
                      source={{ uri: getSafeImageUrl(item.image) }}
                      style={[
                        styles.cardImage,
                        { 
                          borderRadius: responsiveSize(12, 14, 16),
                          height: '100%'
                        }
                      ]}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.2)']}
                      style={styles.cardImageOverlay}
                    />
                  </View>

                  {/* Right Side: Content (60%) */}
                  <View style={[
                    styles.cardContent,
                    { width: '60%' }
                  ]}>
                    {/* Title Only - No Description */}
                    <Text numberOfLines={2} style={[
                      styles.cardTitle,
                      { 
                        fontSize: responsiveSize(16, 20, 22),
                        lineHeight: responsiveSize(22, 26, 28),
                        marginBottom: responsiveSize(12, 16, 20)
                      }
                    ]}>
                      {item.title}
                    </Text>

                    {/* Contact Information - Icons Only */}
                    <View style={styles.contactInfo}>
                      {/* Phone */}
                      {item.phone && (
                        <View style={[
                          styles.contactRow,
                          { marginBottom: responsiveSize(10, 12, 14) }
                        ]}>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleCall(item.phone);
                            }}
                            style={[
                              styles.contactIconButton,
                              { 
                                padding: responsiveSize(10, 12, 14),
                                borderRadius: responsiveSize(10, 12, 14),
                              }
                            ]}
                          >
                            <Ionicons 
                              name="call" 
                              size={responsiveSize(18, 22, 24)} 
                              color="#fff" 
                            />
                          </TouchableOpacity>
      
                        </View>
                      )}

                      {/* Location */}
                      {item.location && (
                        <View style={[
                          styles.contactRow,
                          { marginBottom: responsiveSize(10, 12, 14) }
                        ]}>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleLocation(item.location);
                            }}
                            style={[
                              styles.contactIconButton,
                              styles.locationButton,
                              { 
                                padding: responsiveSize(10, 12, 14),
                                borderRadius: responsiveSize(10, 12, 14),
                              }
                            ]}
                          >
                            <Ionicons 
                              name="location" 
                              size={responsiveSize(18, 22, 24)} 
                              color="#fff" 
                            />
                          </TouchableOpacity>
                         
                        </View>
                      )}

                      {/* WhatsApp */}
                      {item.whatsapp && (
                        <View style={styles.contactRow}>
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleWhatsapp(item.whatsapp);
                            }}
                            style={[
                              styles.contactIconButton,
                              styles.whatsappButton,
                              { 
                                padding: responsiveSize(10, 12, 14),
                                borderRadius: responsiveSize(10, 12, 14),
                              }
                            ]}
                          >
                            <Ionicons 
                              name="logo-whatsapp" 
                              size={responsiveSize(18, 22, 24)} 
                              color="#fff" 
                            />
                          </TouchableOpacity>
                        
                        </View>
                      )}
                    </View>

                    {/* View Details Button */}
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        navigation.navigate("TownBusiness4", {
                          businessId: item.id,
                          businessData: item,
                          entityId: entityId,
                          townId: townId,
                          categoryName: categoryName,
                        });
                      }}
                      style={[
                        styles.detailsButton,
                        { 
                          marginTop: responsiveSize(12, 16, 20),
                          paddingHorizontal: responsiveSize(12, 16, 20),
                          paddingVertical: responsiveSize(10, 12, 14),
                          borderRadius: responsiveSize(10, 12, 14),
                        }
                      ]}
                    >
                      <Text style={[
                        styles.detailsText,
                        { fontSize: responsiveSize(14, 16, 18) }
                      ]}>
                        View Details
                      </Text>
                      <Ionicons 
                        name="chevron-forward" 
                        size={responsiveSize(16, 18, 20)} 
                        color="#93210A" 
                        style={{ marginLeft: 8 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={[
            styles.noDataContainer,
            { 
              paddingVertical: responsiveSize(60, 80, 100),
              paddingHorizontal: responsiveSize(20, 40, 60),
              borderRadius: responsiveSize(16, 20, 24),
              marginTop: responsiveSize(20, 30, 40),
            }
          ]}>
            <Ionicons 
              name="search-outline" 
              size={responsiveSize(60, 80, 100)} 
              color="#ccc" 
            />
            <Text style={[
              styles.noDataText,
              { fontSize: responsiveSize(18, 22, 24) }
            ]}>
              {searchQuery.length > 0 ? 'No businesses found' : 'No businesses available'}
            </Text>
            <Text style={[
              styles.noDataSubtext,
              { 
                fontSize: responsiveSize(14, 16, 18),
                marginTop: responsiveSize(8, 12, 16),
                marginBottom: responsiveSize(24, 30, 36),
                lineHeight: responsiveSize(20, 22, 24)
              }
            ]}>
              {searchQuery.length > 0 
                ? 'Try a different search term' 
                : 'Check back later for new listings'}
            </Text>
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={clearSearch} 
                style={[
                  styles.clearSearchButton,
                  { 
                    paddingHorizontal: responsiveSize(20, 25, 30),
                    paddingVertical: responsiveSize(10, 12, 14),
                    borderRadius: responsiveSize(8, 10, 12)
                  }
                ]}
              >
                <Text style={[
                  styles.clearSearchText,
                  { fontSize: responsiveSize(14, 16, 18) }
                ]}>
                  Clear Search
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================================================= */
/* ======================= STYLES ================== */
/* ================================================= */

const styles = StyleSheet.create({
  /* ================= BASE CONTAINERS ================= */
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  /* ================= HEADER STYLES ================= */
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 15,
  },

  backButton: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.2)",
    left: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
    textAlign: "center",
    fontWeight: '500',
  },

  /* ================= ADVERTISEMENT STYLES ================= */
  adsContainer: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: '#fff',
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
  
  adsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  
  adsLoadingText: {
    marginTop: 10,
    color: "#666",
  },

  paginationContainer: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    alignSelf: 'center',
    zIndex: 2,
  },
  
  paginationDot: {
    backgroundColor: 'rgba(147, 33, 10, 0.9)',
    marginHorizontal: 4,
  },

  noAdsContainer: {
    flex: 1,
    position: 'relative',
  },

  /* ================= SEARCH BAR STYLES ================= */
  searchContainer: {
    backgroundColor: '#fff',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderWidth: 1,
    borderColor: '#E4E6EB',
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: '#1C1E21',
    paddingVertical: 0,
  },

  clearButton: {
    padding: 4,
  },

  /* ================= RESULTS COUNT ================= */
  resultsContainer: {
    backgroundColor: '#FFF9F5',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5D9',
  },

  resultsCount: {
    color: '#93210A',
    fontWeight: '600',
  },

  /* ================= CONTENT AREA ================= */
  content: {
    flexGrow: 1,
  },

  /* ================= CARD DESIGN ================= */
  cardsContainer: {
    flexDirection: 'column',
  },

  card: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },

  cardInner: {
    flexDirection: 'row',
    flex: 1,
  },

  cardImageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },

  cardImage: {
    width: '100%',
    backgroundColor: '#f0f0f0',
  },

  cardImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  cardContent: {
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontWeight: '700',
    color: '#1C1E21',
  },

  /* ================= CONTACT INFO ================= */
  contactInfo: {
    flexDirection: 'row',
    gap: 10,
  },

  contactIconButton: {
    backgroundColor: '#93210A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationButton: {
    backgroundColor: '#2E8B57',
  },

  whatsappButton: {
    backgroundColor: '#25D366',
  },

  contactText: {
    color: '#4B5563',
    fontWeight: '500',
  },

  /* ================= DETAILS BUTTON ================= */
  detailsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#93210A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailsText: {
    color: '#93210A',
    fontWeight: '600',
  },

  /* ================= NO DATA STYLES ================= */
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  noDataText: {
    fontWeight: "600",
    color: "#4B5563",
    textAlign: "center",
  },

  noDataSubtext: {
    color: "#6B7280",
    textAlign: "center",
  },

  clearSearchButton: {
    backgroundColor: '#93210A',
  },

  clearSearchText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* ================= LOADER STYLES ================= */
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
  },

  loaderText: {
    color: "#666",
  },
});