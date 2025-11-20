import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width > 768;

export default function TownPage2() {
  const route = useRoute();
  const navigation = useNavigation();
  const { town } = route.params;
  const [showMore, setShowMore] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    if (town.add && town.add.length > 1) {
      let index = 0;
      const timer = setInterval(() => {
        index = (index + 1) % town.add.length;
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [town.add]);

  if (!town) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No town data available.</Text>
      </View>
    );
  }

  const aboutText = showMore
    ? town.about
    : town.about?.slice(0, 180) + (town.about?.length > 180 ? "..." : "");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* 🏙 Header Banner with Gradient Overlay */}
      <View style={styles.bannerContainer}>
        {town.bannerImage && (
          <Image 
            source={{ uri: town.bannerImage }} 
            style={styles.bannerImage} 
            resizeMode="cover"
          />
        )}
        <View style={styles.gradientOverlay} />
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.bannerTitle}>{town.title || town.townname}</Text>
          <View style={styles.titleUnderline} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Business Button */}
        <TouchableOpacity
          style={styles.businessButton}
          onPress={() => navigation.navigate("TownBusiness1", { town })}
        >
          <Ionicons name="business" size={20} color="#fff" />
          <Text style={styles.businessButtonText}>Explore Businesses</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>

        {/* 📝 About Section */}
        {town.about && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color="#93210A" />
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.aboutText}>{aboutText}</Text>
            {town.about?.length > 180 && (
              <TouchableOpacity
                onPress={() => setShowMore(!showMore)}
                style={styles.showMoreButton}
              >
                <Text style={styles.showMoreText}>
                  {showMore ? "Show Less" : "Read More"}
                </Text>
                <Ionicons
                  name={showMore ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#93210A"
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 🖼 Gallery / Ads Carousel */}
        {town.add && town.add.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="images" size={24} color="#93210A" />
              <Text style={styles.sectionTitle}>Gallery</Text>
            </View>
            <FlatList
              ref={flatListRef}
              horizontal
              data={town.add}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.galleryItem}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.galleryImage} 
                    resizeMode="cover"
                  />
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={width - 40}
              decelerationRate="fast"
            />
            {town.add.length > 1 && (
              <View style={styles.carouselDots}>
                {town.add.map((_, index) => {
                  const dotSize = scrollX.interpolate({
                    inputRange: [
                      (index - 1) * width,
                      index * width,
                      (index + 1) * width,
                    ],
                    outputRange: [8, 12, 8],
                    extrapolate: 'clamp',
                  });
                  return (
                    <Animated.View
                      key={index}
                      style={[
                        styles.dot,
                        { width: dotSize, height: dotSize },
                      ]}
                    />
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* 🌄 Famous Places */}
        {town.famousPlaces && town.famousPlaces.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={24} color="#93210A" />
              <Text style={styles.sectionTitle}>Famous Places</Text>
            </View>
            {town.famousPlaces.map((place, index) => (
              <View
                key={index}
                style={[
                  styles.placeCard,
                  index % 2 === 0 ? styles.cardLeft : styles.cardRight,
                ]}
              >
                <Image 
                  source={{ uri: place.image }} 
                  style={styles.placeImage} 
                  resizeMode="cover"
                />
                <View style={styles.placeContent}>
                  <Text style={styles.placeDescription}>{place.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 🚗 Tourist Spots */}
        {town.tourist && town.tourist.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="car" size={24} color="#93210A" />
              <Text style={styles.sectionTitle}>Tourist Spots</Text>
            </View>
            {town.tourist.map((spot, index) => (
              <View
                key={index}
                style={[
                  styles.placeCard,
                  index % 2 === 0 ? styles.cardLeft : styles.cardRight,
                ]}
              >
                <Image 
                  source={{ uri: spot.image }} 
                  style={styles.placeImage} 
                  resizeMode="cover"
                />
                <View style={styles.placeContent}>
                  <Text style={styles.spotName}>{spot.name}</Text>
                  <View style={styles.distanceBadge}>
                    <Ionicons name="location" size={12} color="#93210A" />
                    <Text style={styles.spotDistance}>{spot.distance}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 🎥 Videos */}
        {town.videos && town.videos.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="videocam" size={24} color="#93210A" />
              <Text style={styles.sectionTitle}>Videos</Text>
            </View>
            {town.videos.map((vid, index) => {
              const videoId = extractYouTubeId(vid.videoUrl);
              const embedUrl = `https://www.youtube.com/embed/${videoId}`;
              return (
                <View key={index} style={styles.videoCard}>
                  <WebView
                    source={{ uri: embedUrl }}
                    style={styles.videoPlayer}
                    javaScriptEnabled
                    domStorageEnabled
                    startInLoadingState
                    renderLoading={() => (
                      <View style={styles.videoLoading}>
                        <ActivityIndicator size="large" color="#93210A" />
                      </View>
                    )}
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

// ✅ Helper: Extract YouTube ID
function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  
  // Banner Section
  bannerContainer: {
    height: isTablet ? 350 : 280,
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 2,
  },
  titleContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: isTablet ? 32 : isSmallDevice ? 22 : 28,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: "#fff",
    borderRadius: 2,
  },

  // Business Button
  businessButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#93210A",
    margin: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  businessButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: isSmallDevice ? 16 : 18,
    marginHorizontal: 12,
  },

  // Section Cards
  sectionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: "bold",
    color: "#93210A",
    marginLeft: 8,
  },

  // About Section
  aboutText: {
    fontSize: isSmallDevice ? 14 : 16,
    color: "#555",
    lineHeight: 24,
    textAlign: "left",
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f8f0ee",
    borderRadius: 20,
  },
  showMoreText: {
    color: "#93210A",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 4,
  },

  // Gallery Section
  galleryItem: {
    width: width - 40,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  galleryImage: {
    width: "100%",
    height: isTablet ? 200 : 160,
    borderRadius: 12,
  },
  carouselDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#93210A",
    marginHorizontal: 4,
  },

  // Places & Tourist Spots
  placeCard: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  cardLeft: {
    flexDirection: "row",
  },
  cardRight: {
    flexDirection: "row-reverse",
  },
  placeImage: {
    width: isTablet ? 120 : 80,
    height: isTablet ? 120 : 80,
    borderRadius: 12,
  },
  placeContent: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  placeDescription: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#555",
    lineHeight: 20,
  },
  spotName: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f0ee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  spotDistance: {
    fontSize: 12,
    color: "#93210A",
    fontWeight: "500",
    marginLeft: 4,
  },

  // Video Section
  videoCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#000",
  },
  videoPlayer: {
    width: "100%",
    height: isTablet ? 220 : 200,
  },
  videoLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  // Utility Styles
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});