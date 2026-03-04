import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { fetchAstrologyByType } from "../../../Controller/AstrologyController/AstrologyController";
import YoutubePlayer from "react-native-youtube-iframe";

export default function AstrologyPage2({ route }) {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;

  const astrologyType = route.params.astrologyType;
  const typeId = astrologyType.id;

  const [data, setData] = useState([]);
  const [adData, setAdData] = useState({ images: [], videos: [] });
  const [loading, setLoading] = useState(true);
  const [adLoading, setAdLoading] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  
  // Advertisement carousel refs
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Responsive size helper
  const responsiveSize = (mobile, tablet, largeTablet) => {
    if (isLargeTablet) return largeTablet || tablet;
    return isTablet ? tablet : mobile;
  };

  // Get advertisement height based on screen size
  const getAdHeight = () => {
    if (isLargeTablet) return 200;
    if (isTablet) return 300;
    return 180;
  };

  // Get video height based on screen size
  const getVideoHeight = () => {
    if (isLargeTablet) return 250;
    if (isTablet) return 380;
    return 220;
  };

  // Fetch astrology data and advertisement data
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Fetch astrology data
        const res = await fetchAstrologyByType(typeId);
        setData(res);

        // Fetch advertisement data
        const adResponse = await fetch("https://hdrss-backend.onrender.com/api/add/Astrology2");
        const adJson = await adResponse.json();
        setAdData({
          images: adJson.images || [],
          videos: adJson.videos || []
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setAdLoading(false);
      }
    };
    loadAllData();
  }, [typeId]);

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

  // Calculate columns based on screen size
  const numColumns = isTablet ? 4 : 3;

  // Calculate card width for responsive grid
  const cardWidth = isTablet ? (width - 96) / 4 : (width - 48) / 3;

  // Render advertisement item
  const renderAdItem = ({ item, index }) => (
    <View style={{ width }}>
      <Image
        source={{ uri: item }}
        style={[
          styles.topAdImage,
          { 
            width: width,
            height: getAdHeight(),
            marginTop: responsiveSize(8, 10, 12)
          }
        ]}
        resizeMode="cover"
      />
    </View>
  );

  // Render item for FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          width: cardWidth,
          padding: responsiveSize(10, 12, 14),
          borderRadius: responsiveSize(12, 14, 16)
        }
      ]}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("AstrologyPage3", {
          astrologyItem: item,
        })
      }
    >
      <Image
        source={{ uri: item.image }}
        style={[
          styles.image,
          { 
            borderRadius: responsiveSize(10, 12, 14),
            marginBottom: responsiveSize(8, 10, 12)
          }
        ]}
      />
      <Text style={[
        styles.name,
        { 
          fontSize: responsiveSize(13, 15, 17),
          marginBottom: responsiveSize(4, 6, 8)
        }
      ]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[
        styles.title,
        { 
          fontSize: responsiveSize(11, 13, 15),
          lineHeight: responsiveSize(14, 16, 18)
        }
      ]} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  // List header component for advertisements
  const ListHeader = () => (
    <>
      {/* 📢 TOP ADVERTISEMENT - Horizontal Scroll Images */}
      {!adLoading && adData.images.length > 0 && (
        <View style={[
          styles.topAdContainer,
          { marginBottom: responsiveSize(20, 25, 30) }
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
      
      <Text style={[
        styles.sectionTitle,
        { 
          fontSize: responsiveSize(18, 22, 26),
          marginBottom: responsiveSize(20, 24, 28)
        }
      ]}>
        {astrologyType.name}
      </Text>
    </>
  );

  // List footer component for video
  const ListFooter = () => (
    <>
      {/* 📢 BOTTOM ADVERTISEMENT - YouTube Video */}
      {!adLoading && adData.videos.length > 0 && (
        <View style={[
          styles.videoAdContainer,
          { 
            marginTop: responsiveSize(30, 35, 40),
            marginBottom: responsiveSize(20, 25, 30)
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
    </>
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
          { fontSize: responsiveSize(20, 24, 28) }
        ]}>
          Astrology
        </Text>
        
        <View style={{ width: responsiveSize(40, 50, 60) }} />
      </View>

      {/* 🔹 CONTENT */}
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
            Loading astrology details...
          </Text>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="error-outline" size={responsiveSize(60, 80, 100)} color="#93210A" />
          <Text style={[
            styles.emptyText,
            { fontSize: responsiveSize(16, 20, 24) }
          ]}>
            No data found for {astrologyType.name}
          </Text>
          <Text style={[
            styles.emptySubtext,
            { fontSize: responsiveSize(14, 16, 18) }
          ]}>
            Please try again later
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          numColumns={numColumns}
          key={numColumns}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          contentContainerStyle={[
            styles.listContent,
            { 
              paddingHorizontal: responsiveSize(16, 24, 32),
              paddingBottom: responsiveSize(30, 40, 50)
            }
          ]}
          columnWrapperStyle={[
            styles.columnWrapper,
            { marginBottom: responsiveSize(12, 16, 20) }
          ]}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
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

  /* 📜 LIST CONTENT */
  listContent: {
    flexGrow: 1,
  },

  /* COLUMN WRAPPER */
  columnWrapper: {
    justifyContent: "space-between",
  },

  /* 🏷️ SECTION TITLE */
  sectionTitle: {
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "center",
  },

  /* 📢 TOP ADVERTISEMENT */
  topAdContainer: {
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
    flex: 1,
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

  /* 🖼️ IMAGE */
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
  },

  /* 🏷️ NAME */
  name: {
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "center",
  },

  /* 📝 TITLE */
  title: {
    color: "#444",
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