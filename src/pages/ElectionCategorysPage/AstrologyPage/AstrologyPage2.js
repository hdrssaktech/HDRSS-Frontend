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
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { fetchAstrologyByType } from "../../../Controller/AstrologyController/AstrologyController";
import YoutubePlayer from "react-native-youtube-iframe";
import Loader from "../../../components/Alert/Loader";

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

  // Horizontal padding used by the FlatList's contentContainerStyle - needed
  // so we can negate it and make the ad image / video bleed edge-to-edge
  const listPadding = responsiveSize(16, 24, 32);

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

  // Calculate columns based on screen size - 3 on mobile, 4 on tablet & large tablet
  const numColumns = isTablet ? 4 : 3;

  // ---- CARD SIZE (SQUARE: width === height) ----
  const cardGap = isTablet ? 12 : 8;
  const cardWidth = Math.floor(
    (width - listPadding * 2 - cardGap * (numColumns - 1)) / numColumns
  );
  const cardHeight = cardWidth; // square card

  // ---- IMAGE SIZE (SQUARE, takes up most of the card) ----
  const imageSize = Math.floor(cardWidth * 0.55);

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
          }
        ]}
        resizeMode="cover"
      />
    </View>
  );

  // Render item for FlatList - image centered in card, name + title below
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          width: cardWidth,
          height: cardHeight,
          padding: responsiveSize(8, 10, 12),
          borderRadius: responsiveSize(16, 18, 20)
        }
      ]}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("AstrologyPage3", {
          astrologyItem: item,
        })
      }
    >
      {/* IMAGE AREA - takes remaining space and centers the circle inside it */}
      <View style={styles.imageArea}>
        <View style={[
          styles.imageWrapper,
          {
            width: imageSize,
            height: imageSize,
            borderRadius: imageSize / 2,
          }
        ]}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* TEXT AREA - pinned at the bottom of the card */}
      <View style={styles.textArea}>
        <Text style={[
          styles.name,
          { fontSize: responsiveSize(12, 14, 16) }
        ]} numberOfLines={1}>
          {item.name}
        </Text>

        <Text style={[
          styles.title,
          { 
            fontSize: responsiveSize(9, 11, 13),
            lineHeight: responsiveSize(12, 14, 16),
            marginTop: responsiveSize(2, 3, 4)
          }
        ]} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // List header component for advertisements
  const ListHeader = () => (
    <>
      {/* 📢 TOP ADVERTISEMENT - Horizontal Scroll Images */}
      {!adLoading && adData.images.length > 0 && (
        <View style={[
          styles.topAdContainer,
          { 
            marginBottom: responsiveSize(20, 25, 30),
            marginHorizontal: -listPadding,
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
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentAdIndex(newIndex);
            }}
            scrollEventThrottle={16}
            style={{ width: '100%' }}
          />
        </View>
      )}
    </>
  );

  // List footer component for video - edge-to-edge, no title
  const ListFooter = () => (
    <>
      {/* 📢 BOTTOM ADVERTISEMENT - YouTube Video (edge-to-edge, no title) */}
      {!adLoading && adData.videos.length > 0 && (
        <View style={[
          styles.videoAdContainer,
          { 
            marginTop: responsiveSize(30, 35, 40),
            marginHorizontal: -listPadding,
            width: width,
          }
        ]}>
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
    </>
  );

  // Header component - shows the category name passed via route params
  const Header = () => (
    <View style={[
      styles.header,
      isTablet && styles.headerTablet,
      isLargeTablet && styles.headerLargeTablet
    ]}>
      <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>
      
      <Text 
        style={[
          styles.headerTitle,
          isTablet && styles.headerTitleTablet
        ]}
        numberOfLines={1}
      >
        {astrologyType.name}
      </Text>
      
      <View style={[
        styles.headerSpacer,
        isTablet && styles.headerSpacerTablet
      ]} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔴 HEADER */}
      <Header />

      {/* 🔹 CONTENT */}
      {loading ? (
        <Loader/>
      ) : data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle" size={responsiveSize(60, 80, 100)} color="#93210A" />
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
              paddingHorizontal: listPadding,
              paddingBottom: responsiveSize(30, 40, 50)
            }
          ]}
          columnWrapperStyle={[
            styles.columnWrapper,
            { marginBottom: responsiveSize(10, 14, 16) }
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
    backgroundColor: "#d4cea6",
  },

  /* 🔴 HEADER */
  header: {
   flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop:40,
    paddingBottom:30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
   paddingTop:45,
    paddingBottom:28,
    paddingHorizontal: 18,
  },
  headerLargeTablet: {
    paddingTop: Platform.OS === "ios" ? 70 : 60,
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
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
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 22,
  },

  headerSpacer: {
    width: 40,
  },
  headerSpacerTablet: {
    width: 50,
  },

  /* 📜 LIST CONTENT */
  listContent: {
    flexGrow: 1,
  },

  /* COLUMN WRAPPER */
  columnWrapper: {
    justifyContent: "flex-start",
    gap: 8,
  },

  /* 📢 TOP ADVERTISEMENT */
  topAdContainer: {
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

  /* 🟧 CARD - clean square tile, column layout */
  card: {
    backgroundColor: "#FFFDF8",
    flexDirection: "column",
    shadowColor: "#93210A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#EADFC4",
  },

  /* Image area fills remaining space above the text and centers the circle inside it */
  imageArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Circular image frame with gold ring */
  imageWrapper: {
    overflow: 'hidden',
    backgroundColor: '#f5f0e6',
    borderWidth: 2,
    borderColor: "#D4AF37",
  },

  /* 🖼️ IMAGE - fills its wrapper exactly */
  image: {
    width: "105%",
    height: "105%",
  },

  /* Text area pinned at the bottom of the card */
  textArea: {
    alignItems: "center",
    justifyContent: "flex-end",
  },

  /* 🏷️ NAME (raasi name, shown first, prominent) */
  name: {
    fontWeight: "800",
    color: "#93210A",
    textAlign: "center",
  },

  /* 📝 TITLE (shown below name, subtle) */
  title: {
    color: "#8a7a5c",
    fontWeight: "500",
    textAlign: "center",
  },

  /* 🎥 VIDEO ADVERTISEMENT */
  videoAdContainer: {
    alignItems: 'center',
  },
  
  videoWrapper: {
    overflow: "hidden",
    backgroundColor: '#000',
  },
});