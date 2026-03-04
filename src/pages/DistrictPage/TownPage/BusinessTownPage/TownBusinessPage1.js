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
  SafeAreaView,
  FlatList,
  Animated,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from 'react-native-youtube-iframe';
import Loader from "../../../../components/Alert/Loader";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

// Default image URL
const DEFAULT_IMAGE = 'https://via.placeholder.com/400x300/93210A/ffffff?text=Business+Category';

export default function TownBusinessPage1() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Safely get parameters with fallback
  const subcategoryId = route.params?.subcategoryId || 13;
  const townId = route.params?.townId ||1;
  const townName = route.params?.townName || "Town";
  const entityId = route.params?.entityId || subcategoryId;


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adsData, setAdsData] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  
  // Advertisement carousel refs
  const flatListRef = useRef(null);
  const adIndex = useRef(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Check if image URL is valid
  const isValidImageUrl = (url) => {
    if (!url || url === 'null' || url === 'undefined' || url === '') {
      return false;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    return true;
  };

  // Get safe image URL
  const getSafeImageUrl = (url) => {
    return isValidImageUrl(url) ? url : DEFAULT_IMAGE;
  };

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^"&?/ ]{11})/
    );
    return match ? match[1] : null;
  };

  // ================= FETCH ADS (PageLevel 2) =================
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const townIdParam = entityId || subcategoryId;
        const entityIdParam = entityId || subcategoryId;
        
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/town-business-ads/filter?townId=${townId}&pageLevel=2&entityId=${subcategoryId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        
        if (json.success && json.data && json.data.length > 0) {
          const ads = json.data[0];
          const adItems = [];
          
          if (ads.adImages && ads.adImages.length > 0) {
            ads.adImages.forEach((image, index) => {
              adItems.push({
                id: `image-${index}`,
                type: 'image',
                url: getSafeImageUrl(image),
              });
            });
          }
          
          if (ads.adVideos && ads.adVideos.length > 0) {
            ads.adVideos.forEach((video, index) => {
              if (video) {
                adItems.push({
                  id: `video-${index}`,
                  type: 'video',
                  url: video,
                });
              }
            });
          }
          
          setAdsData(adItems);
        }
      } catch (error) {
        console.log("Ads fetch error:", error.message);
      } finally {
        setAdsLoading(false);
      }
    };

    fetchAds();
  }, [subcategoryId, entityId]);

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

  // ================= FETCH SUBCATEGORIES =================
  useEffect(() => {
    fetch(
      `https://hdrss-backend.onrender.com/api/tb/business/subcategory/${subcategoryId}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(jsonData => {
        const dataArray = Array.isArray(jsonData) ? jsonData : [];
        setData(dataArray);
      })
      .catch(error => {
        console.log("Fetch error:", error.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [subcategoryId]);

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
            onError={() => {
              console.log(`Ad image failed to load: ${item.url}`);
            }}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
            style={styles.adGradient}
          />
        </View>
      );
    } else {
      const videoId = getYouTubeId(item.url);
      return (
        <View style={[
          styles.adItemContainer,
          { width: screenWidth }
        ]}>
          {videoId && (
            <YoutubePlayer
              height={isLargeTablet ? 200 : isTablet ? 180 : 160}
              width={screenWidth}
              play={playing}
              videoId={videoId}
              onChangeState={(state) => setPlaying(state === "playing")}
            />
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
            style={styles.adGradient}
          />
        </View>
      );
    }
  };

  // ================= LOADER =================
  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      <View style={styles.container}>
        {/* ================= HEADER FIRST ================= */}
        <View style={[
          styles.headerContainer,
          isTablet && styles.headerContainerTablet
        ]}>
          <LinearGradient
            colors={["#93210A", "#B32A0C"]}
            style={styles.headerGradient}
          >
            {/* Back Button */}
            <TouchableOpacity
              style={isTablet ? styles.backTablet : styles.backMobile}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={isTablet ? 28 : 24} color="#fff" />
            </TouchableOpacity>

            <Text style={[
              styles.headerTitle,
              isTablet && styles.headerTitleTablet
            ]}>
              Business Categories
            </Text>
          </LinearGradient>
        </View>

        {/* ================= ADS BELOW HEADER ================= */}
        <View style={[
          styles.adsContainer,
          { 
            height: isLargeTablet ? 400 : 
                   isTablet ? 300 : 
                   200 
          }
        ]}>
          {adsLoading ? (
            <View style={styles.adsLoadingContainer}>
              <ActivityIndicator size="large" color="#93210A" />
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
              <Ionicons name="images-outline" size={40} color="#ccc" />
              <Text style={styles.noAdsText}>No advertisements available</Text>
            </View>
          )}
        </View>

        {/* ================= GRID CONTENT ================= */}
        <ScrollView 
          style={styles.contentScroll}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <Text style={[
              styles.sectionSubtitle,
              isTablet && styles.sectionSubtitleTablet
            ]}>
              Explore local businesses in {townName}
            </Text>
          </View>

          <View style={isTablet ? styles.gridTablet : styles.gridMobile}>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TouchableOpacity
                  key={item.id || index}
                  activeOpacity={0.85}
                  style={isTablet ? styles.cardTablet : styles.cardMobile}
                  onPress={() =>
                    navigation.navigate("TownBusiness3", {
                      subcategoryItemId: item.id,
                      categoryName: item.title,
                      entityId: subcategoryId,
                      townId:townId
                    })
                  }
                >
                  {/* IMAGE with default fallback */}
                  <Image 
                    source={{ 
                      uri: getSafeImageUrl(item.image)
                    }} 
                    style={styles.cardImage}
                    onError={(e) => {
                      console.log(`Category image failed to load: ${item.image}`, e.nativeEvent.error);
                    }}
                  />

                  {/* BODY */}
                  <View
                    style={isTablet ? styles.cardBodyTablet : styles.cardBodyMobile}
                  >
                    <Text
                      numberOfLines={2}
                      style={
                        isTablet
                          ? styles.cardTitleTablet
                          : styles.cardTitleMobile
                      }
                    >
                      {item.title || "Business Category"}
                    </Text>
                    <View style={styles.exploreRow}>
                      <Text style={styles.exploreText}>View Businesses</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={isTablet ? 16 : 14}
                        color="#93210A"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              // No data available
              <View style={styles.noDataContainer}>
                <Ionicons name="business-outline" size={60} color="#ccc" />
                <Text style={styles.noDataText}>
                  No business categories available
                </Text>
                <Text style={styles.noDataSubtext}>
                  Check back later for new business listings
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ================================================= */
/* ===================== STYLES ==================== */
/* ================================================= */

const styles = StyleSheet.create({
  /* ================= BASE STYLES ================= */
  safeArea: {
    flex: 1,
   
  },
  
  container: {
    flex: 1,
    backgroundColor: "#F6F7F9",
  },

  /* ================= HEADER STYLES (FIRST) ================= */
  headerContainer: {
    height: 80,
    
  },
  
  headerContainerTablet: {
    height: 90,
  },
  
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  
  headerTitleTablet: {
    fontSize: 24,
  },

  /* ================= BACK BUTTON STYLES ================= */
  backMobile: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 12,
    marginTop:5,
    position: 'absolute',
    left: 16,
    zIndex: 2,
  },

  backTablet: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 10,
    marginTop:8,
    borderRadius: 14,
    position: 'absolute',
    left: 20,
    zIndex: 2,
  },

  /* ================= ADS STYLES (BELOW HEADER) ================= */
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
  },
  
  adImage: {
    width: '100%',
    height: '100%',
  },
  
  adGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  
  adsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  
  noAdsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },

  /* ================= CONTENT STYLES ================= */
  contentScroll: {
    flex: 1,
  },
  
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  /* ================= SECTION HEADER ================= */
  sectionHeader: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  
  sectionTitleTablet: {
    fontSize: 26,
  },
  
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  
  sectionSubtitleTablet: {
    fontSize: 16,
  },

  /* ================= LOADER STYLES ================= */
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#fff',
  },

  loaderText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },

  /* ================= GRID & CARD STYLES ================= */
  gridMobile: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    minHeight: 200,
  },

  gridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: isLargeTablet ? "flex-start" : "space-between",
    gap: isLargeTablet ? 16 : 0,
    minHeight: 300,
  },

  cardMobile: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardTablet: {
    width: isLargeTablet ? "23%" : "30%",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  cardImage: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
    backgroundColor: '#f0f0f0',
  },

  cardBodyMobile: {
    padding: 12,
  },

  cardBodyTablet: {
    padding: 16,
  },

  cardTitleMobile: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    lineHeight: 18,
    minHeight: 36,
  },

  cardTitleTablet: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    lineHeight: 22,
    minHeight: 44,
  },

  cardSubMobile: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    lineHeight: 16,
    minHeight: 32,
  },

  cardSubTablet: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
    lineHeight: 18,
    minHeight: 36,
  },

  exploreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginTop:2,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  exploreText: {
    color: "#93210A",
    fontWeight: "700",
    fontSize: 12,
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

  retryButton: {
    backgroundColor: "#93210A",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});