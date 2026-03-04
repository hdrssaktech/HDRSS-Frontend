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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { fetchAstrologyTypes } from "../../../Controller/AstrologyController/AstrologyController";
import YoutubePlayer from "react-native-youtube-iframe";

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
    if (isLargeTablet) return 220;
    if (isTablet) return 280;
    return 150;
  };
  const getVideoHeight = () => {
    if (isLargeTablet) return 280;
    if (isTablet) return 380;
    return 200;
  };

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

  // 🔹 Handle card press → Navigate to next page
  const handleCardPress = (item) => {
    navigation.navigate("AstrologyPage2", {
      astrologyType: item,
    });
  };

  // Calculate card width for responsive grid
  const cardWidth = isTablet ? (width - 96) / 4 : (width - 48) / 3; // 4 columns on tablet, 3 on mobile

  // Render advertisement item
  const renderAdItem = ({ item, index }) => (
    <View style={{ width }}>
      <Image
        source={{ uri: item }}
        style={[
          styles.topAdImage,
          { 
            width: width,
            height: getAdHeight()
          }
        ]}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔴 HEADER */}
      <View style={[
        styles.header,
        { 
          padding: responsiveSize(15, 20, 25),
          marginTop: Platform.OS === "ios" ? responsiveSize(32, 40, 48) : responsiveSize(28, 36, 44)
        }
      ]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            { 
              padding: responsiveSize(8, 10, 12),
              borderRadius: responsiveSize(20, 24, 28)
            }
          ]}
        >
          <Icon 
            name="arrow-back" 
            size={responsiveSize(22, 26, 30)} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <Text style={[
          styles.headerTitle,
          { fontSize: responsiveSize(22, 28, 32) }
        ]}>
          Astrology
        </Text>
        
        <View style={{ width: responsiveSize(40, 50, 60) }} />
      </View>

      {/* 🔹 CONTENT */}
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer,
          { 
            padding: responsiveSize(8, 15, 22),
            paddingBottom: responsiveSize(30, 40, 50)
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 📢 TOP ADVERTISEMENT - Full Width Image Carousel */}
        {!adLoading && adData.images.length > 0 && (
          <View style={[
            styles.topAdContainer,
            { 
              marginBottom: responsiveSize(20, 25, 30),
              width: '100%'
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
                const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentAdIndex(newIndex);
              }}
              scrollEventThrottle={16}
              style={{ width: '100%' }}
            />
            
            {/* Dot Indicators */}
            {adData.images.length > 1 && (
              <View style={[
                styles.dotContainer,
                { bottom: responsiveSize(15, 20, 25) }
              ]}>
                {adData.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      { 
                        backgroundColor: index === currentAdIndex ? '#93210A' : '#D3D3D3',
                        width: index === currentAdIndex ? responsiveSize(10, 12, 14) : responsiveSize(6, 8, 10),
                        height: responsiveSize(6, 8, 10),
                        borderRadius: responsiveSize(3, 4, 5),
                        marginHorizontal: responsiveSize(3, 4, 5)
                      }
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* 🔮 ASTROLOGY TYPES GRID */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size={responsiveSize("large", 50, 60)}
              color="#93210A"
            />
            <Text style={[
              styles.loaderText,
              { fontSize: responsiveSize(14, 16, 18) }
            ]}>
              Loading astrology types...
            </Text>
          </View>
        ) : astrologyData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="error-outline" size={responsiveSize(60, 80, 100)} color="#93210A" />
            <Text style={[
              styles.emptyText,
              { fontSize: responsiveSize(16, 20, 24) }
            ]}>
              No astrology data found
            </Text>
            <Text style={[
              styles.emptySubtext,
              { fontSize: responsiveSize(14, 16, 18) }
            ]}>
              Please try again later
            </Text>
          </View>
        ) : (
          <>
            <Text style={[
              styles.sectionTitle,
              { 
                fontSize: responsiveSize(18, 22, 26),
                marginBottom: responsiveSize(20, 24, 28)
              }
            ]}>
              Astrology Services
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
                        padding: responsiveSize(8, 12, 16),
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
                          width: responsiveSize(70, 90, 110),
                          height: responsiveSize(70, 90, 110),
                          borderRadius: responsiveSize(8, 12, 16),
                          marginBottom: responsiveSize(8, 10, 12)
                        }
                      ]}
                    />
                    <Text style={[
                      styles.cardText,
                      { 
                        fontSize: responsiveSize(13, 16, 18),
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

        {/* 📢 BOTTOM ADVERTISEMENT - YouTube Video */}
        {!adLoading && adData.videos.length > 0 && (
          <View style={[
            styles.videoAdContainer,
            { 
              marginTop: responsiveSize(20, 25, 30),
              width: '100%'
            }
          ]}>
            <Text style={[
              styles.videoTitle,
              { 
                fontSize: responsiveSize(16, 20, 24),
                marginBottom: responsiveSize(10, 12, 14)
              }
            ]}>
              Watch Video
            </Text>
            
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
                      borderRadius: responsiveSize(10, 14, 18),
                      marginBottom: responsiveSize(15, 20, 25)
                    }
                  ]}
                >
                  <YoutubePlayer
                    height={getVideoHeight()}
                    play={false}
                    videoId={videoId}
                    webViewStyle={{ 
                      borderRadius: responsiveSize(10, 14, 18),
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
    backgroundColor: "#fff",
  },

  /* 🔴 HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#93210A",
  },
  
  backButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerTitle: {
    color: "#fff",
    fontWeight: "700",
    textAlign: 'center',
    flex: 1,
  },

  /* 📜 CONTENT */
  scrollContainer: {
    flexGrow: 1,
  },

  /* 📢 TOP ADVERTISEMENT */
  topAdContainer: {
    alignItems: "center",
    position: 'relative',
    overflow: 'hidden',
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

  /* 🔮 LOADER */
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  
  loaderText: {
    color: "#666",
    marginTop: 15,
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

  /* 🏷️ SECTION TITLE */
  sectionTitle: {
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "center",
  },

  /* 🔳 GRID CONTAINER */
  gridContainer: {
    width: '100%',
  },
  
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* 🟧 CARD */
  card: {
    backgroundColor: "#FFF7F5",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  
  cardImage: {
    backgroundColor: '#f0f0f0',
  },
  
  cardText: {
    fontWeight: "600",
    color: "#93210A",
    textAlign: "center",
  },

  /* 🎥 VIDEO ADVERTISEMENT */
  videoAdContainer: {
    alignItems: 'center',
  },
  
  videoTitle: {
    fontWeight: "bold",
    color: "#93210A",
    alignSelf: 'flex-start',
  },
  
  videoWrapper: {
    overflow: "hidden",
    backgroundColor: '#000',
  },
});