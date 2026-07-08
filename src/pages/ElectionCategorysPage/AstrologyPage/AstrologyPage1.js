import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Platform,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { fetchAstrologyTypes } from "../../../Controller/AstrologyController/AstrologyController";
import YoutubePlayer from "react-native-youtube-iframe";
import Loader from "../../../components/Alert/Loader";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AstrologyPage1() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;

  const [astrologyData, setAstrologyData] = useState([]);
  const [adData, setAdData] = useState({ images: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [adLoading, setAdLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  
  // Advertisement carousel refs
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const responsiveSize = (mobile, tablet, largeTablet) => {
    if (isLargeTablet) return largeTablet || tablet;
    return isTablet ? tablet : mobile;
  };

  const getAdHeight = () => {
    if (isLargeTablet) return 250;
    if (isTablet) return 200;
    return 150;
  };
  
  const getVideoHeight = () => {
    if (isLargeTablet) return 320;
    if (isTablet) return 280;
    return 200;
  };

  // Padding used by the ScrollView's contentContainerStyle - needed so we can
  // negate it and make the ad image / video bleed edge-to-edge
  const scrollPadding = responsiveSize(8, 15, 22);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Fetch astrology data
        const astrologyData = await fetchAstrologyTypes();
        setAstrologyData(astrologyData);

        // Fetch advertisement data
        const adResponse = await fetch("https://hdrss-backend.onrender.com/api/add/Astrology1");
        const adJson = await adResponse.json();
        setAdData({
          images: adJson.images || [],
          videos: adJson.videos || []
        });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
        setAdLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Auto-scroll advertisements
  useEffect(() => {
    if (adData.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % adData.images.length;
        
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [adData.images.length]);

  // Extract YouTube ID
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Handle card press → Navigate to next page
  const handleCardPress = (item) => {
    navigation.navigate("AstrologyPage2", {
      astrologyType: item,
    });
  };

  // Calculate card width for responsive grid
  const getCardWidth = () => {
    const padding = isTablet ? 32 : 16;
    const gap = isTablet ? 16 : 12;
    const columns = isTablet ? 4 : 3;
    return Math.floor((width - padding - (gap * (columns - 1))) / columns);
  };

  const cardWidth = getCardWidth();

  // Render advertisement item
  const renderAdItem = ({ item, index }) => (
    <View style={{ width: SCREEN_WIDTH }}>
      <Image
        source={{ uri: item }}
        style={[
          styles.topAdImage,
          { 
            width: SCREEN_WIDTH,
            height: getAdHeight()
          }
        ]}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          ஜோதிடம்
        </Text>
        
        <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
      </View>

      {/* CONTENT */}
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer,
          { 
            padding: scrollPadding,
            paddingBottom: responsiveSize(30, 40, 50)
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP ADVERTISEMENT - Full Width Image Carousel (edge-to-edge) */}
        {!adLoading && adData.images.length > 0 && (
          <View style={[
            styles.topAdContainer,
            { 
              marginBottom: responsiveSize(20, 25, 30),
              marginHorizontal: -scrollPadding,
              width: width,
            }
          ]}>
            <Animated.FlatList
              ref={flatListRef}
              data={adData.images}
              renderItem={renderAdItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setCurrentAdIndex(newIndex);
              }}
              scrollEventThrottle={16}
              style={{ width: '100%' }}
            />
            
            {/* Dot Indicators */}
            {adData.images.length > 1 && (
              <View style={[
                styles.dotContainer,
                { bottom: responsiveSize(8, 12, 15) }
              ]}>
                {adData.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      { 
                        backgroundColor: index === currentAdIndex ? '#93210A' : 'rgba(255,255,255,0.6)',
                        width: index === currentAdIndex ? responsiveSize(20, 24, 28) : responsiveSize(8, 10, 12),
                        height: responsiveSize(4, 5, 6),
                        borderRadius: responsiveSize(2, 3, 4),
                        marginHorizontal: responsiveSize(3, 4, 5)
                      }
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ASTROLOGY TYPES GRID */}
        {loading ? (
          <Loader/>
        ) : astrologyData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle" size={responsiveSize(60, 80, 100)} color="#93210A" />
            <Text style={[
              styles.emptyText,
              { fontSize: responsiveSize(16, 20, 24) }
            ]}>
              ஜோதிட தகவல்கள் இல்லை
            </Text>
            <Text style={[
              styles.emptySubtext,
              { fontSize: responsiveSize(14, 16, 18) }
            ]}>
              பிறகு முயற்சிக்கவும்
            </Text>
          </View>
        ) : (
          <>
            <Text style={[
              styles.sectionTitle,
              { 
                fontSize: responsiveSize(17, 24, 28),
                marginBottom: responsiveSize(20, 24, 28)
              }
            ]}>
              ஜோதிட சேவைகள்
            </Text>
            
            <View style={[
              styles.gridContainer,
              { marginBottom: responsiveSize(30, 35, 40) }
            ]}>
              <View style={styles.grid}>
                {astrologyData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.card,
                      { 
                        width: cardWidth,
                        padding: responsiveSize(10, 14, 18),
                        marginBottom: responsiveSize(12, 16, 20),
                        borderRadius: responsiveSize(12, 16, 20)
                      }
                    ]}
                    onPress={() => handleCardPress(item)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={[
                        styles.cardImage,
                        { 
                          width: responsiveSize(80, 90, 110),
                          height: responsiveSize(80, 90, 110),
                          borderRadius: responsiveSize(10, 14, 18),
                          marginBottom: responsiveSize(8, 10, 12)
                        }
                      ]}
                    />
                    <Text style={[
                      styles.cardText,
                      { 
                        fontSize: responsiveSize(10, 16, 18),
                        lineHeight: responsiveSize(16, 20, 22)
                      }
                    ]} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* BOTTOM ADVERTISEMENT - YouTube Video (edge-to-edge, no title) */}
        {!adLoading && adData.videos.length > 0 && (
          <View
            style={[
              styles.videoAdContainer,
              {
                marginTop: responsiveSize(20, 25, 30),
                marginHorizontal: -scrollPadding,
                width: width,
              }
            ]}
          >
            {adData.videos.map((videoUrl, index) => {
              const videoId = extractYouTubeId(videoUrl);
              if (!videoId) return null;
              
              return (
                <View 
                  key={index} 
                  style={[
                    styles.videoWrapper,
                    { 
                      width: '100%',
                      marginBottom: responsiveSize(15, 20, 25)
                    }
                  ]}
                >
                  <YoutubePlayer
                    height={getVideoHeight()}
                    play={false}
                    videoId={videoId}
                    webViewStyle={{ 
                      overflow: 'hidden'
                    }}
                  />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d4cea6",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  
  headerSpacer: {
    width: 40,
  },
  headerSpacerTablet: {
    width: 50,
  },

  /* CONTENT */
  scrollContainer: {
    flexGrow: 1,
  },

  /* TOP ADVERTISEMENT */
  topAdContainer: {
    alignItems: "center",
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  
  topAdImage: {
    alignSelf: 'center',
  },
  
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    alignSelf: 'center',
  },

  dot: {
    backgroundColor: '#D3D3D3',
  },

  /* EMPTY STATE */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  
  emptyText: {
    color: "#93210A",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
  },
  
  emptySubtext: {
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },

  /* SECTION TITLE */
  sectionTitle: {
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "center",
  },

  /* GRID CONTAINER */
  gridContainer: {
    width: '100%',
  },
  
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFDF8",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(147,33,10,0.1)",
  },
  
  cardImage: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: "#93210A",
  },
  
  cardText: {
    fontWeight: "700",
    color: "#301913",
    textAlign: "center",
  },

  /* VIDEO ADVERTISEMENT */
  videoAdContainer: {
    alignItems: 'center',
  },
  
  videoWrapper: {
    overflow: "hidden",
    backgroundColor: '#000',
  },
});