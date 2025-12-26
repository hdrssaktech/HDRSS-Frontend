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
  ActivityIndicator
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function TownPage2() {
  const route = useRoute();
  const navigation = useNavigation();
  const { town, townId, DistrictName, DistrictId } = route.params;
  const [showMore, setShowMore] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  console.log(townId);

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

  const handleGovernmentPress = (townId) => {
    navigation.navigate("TownGovernmentPage1", { townId });
  };
  const handlePartiesPress = () => {
    navigation.navigate('TownPartiesCategory', { 'townId':townId });
  };

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

  // Responsive dimensions
  const ITEM_WIDTH = isTablet ? screenWidth - 80 : screenWidth - 40;
  const GALLERY_HEIGHT = isTablet ? (isLargeTablet ? 280 : 240) : 160;
  const bannerHeight = isTablet ? (isLargeTablet ? 400 : 350) : 280;
  const titleFontSize = isTablet ? (isLargeTablet ? 36 : 32) : 28;
  const sectionTitleFontSize = isTablet ? (isLargeTablet ? 26 : 24) : 20;
  const aboutFontSize = isTablet ? (isLargeTablet ? 18 : 16) : 14;
  const menuFontSize = isTablet ? (isLargeTablet ? 19 : 17) : 14;
  const placeImageSize = isTablet ? (isLargeTablet ? 140 : 120) : 80;
  const placeNameFontSize = isTablet ? (isLargeTablet ? 20 : 18) : 16;
  const placeDescFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 14;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Banner Section */}
      <View style={[styles.bannerContainer, { height: bannerHeight }]}>
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
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons 
            name="chevron-back" 
            size={isTablet ? 32 : 28} 
            color="#fff" 
          />
        </TouchableOpacity>

        {/* Title */}
        <View style={[styles.titleContainer, isTablet && styles.titleContainerTablet]}>
          <Text style={[styles.bannerTitle, { fontSize: titleFontSize }]}>
            {town.title || town.townname}
          </Text>
          <View style={[styles.titleUnderline, isTablet && styles.titleUnderlineTablet]} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Business Button */}
        <TouchableOpacity
          style={[styles.businessButton, isTablet && styles.businessButtonTablet]}
          onPress={() => navigation.navigate("TownBusiness1", { town })}
        >
          <Ionicons 
            name="business" 
            size={isTablet ? 24 : 20} 
            color="#fff" 
          />
          <Text style={[
            styles.businessButtonText, 
            isTablet && styles.businessButtonTextTablet
          ]}>
            Explore Businesses
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={isTablet ? 22 : 18} 
            color="#fff" 
          />
        </TouchableOpacity>

        {/* Grid Menu */}
        <View style={[styles.gridContainer, isTablet && styles.gridContainerTablet]}>
          <TouchableOpacity
            style={[styles.menuBox, isTablet && styles.menuBoxTablet]}
            onPress={() => handleGovernmentPress(townId)}
          >
            <Text style={[styles.menuText, { fontSize: menuFontSize }]}>
              Government
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuBox, isTablet && styles.menuBoxTablet]}
            onPress={() => handlePartiesPress(townId)}
          >
            <Text style={[styles.menuText, { fontSize: menuFontSize }]}>
              Parties
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuBox, isTablet && styles.menuBoxTablet]}
            onPress={() =>
              navigation.navigate("ComplainPage1", {
                DistrictId: DistrictId,
                DistrictName: DistrictName,
              })
            }
          >
            <Text style={[styles.menuText, { fontSize: menuFontSize }]}>
              Complaint
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuBox, isTablet && styles.menuBoxTablet]}
            onPress={() =>
              navigation.navigate("Member0", {
                DistrictId: DistrictId,
                DistrictName: DistrictName,
              })
            }
          >
            <Text style={[styles.menuText, { fontSize: menuFontSize }]}>
              HDRSS
            </Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        {town.about && (
          <View style={[styles.sectionCard, isTablet && styles.sectionCardTablet]}>
            <View style={styles.sectionHeader}>
              <Ionicons 
                name="information-circle" 
                size={isTablet ? 28 : 24} 
                color="#93210A" 
              />
              <Text style={[styles.sectionTitle, { fontSize: sectionTitleFontSize }]}>
                About
              </Text>
            </View>
            <Text style={[styles.aboutText, { fontSize: aboutFontSize }]}>
              {aboutText}
            </Text>
            {town.about?.length > 180 && (
              <TouchableOpacity
                onPress={() => setShowMore(!showMore)}
                style={[styles.showMoreButton, isTablet && styles.showMoreButtonTablet]}
              >
                <Text style={[styles.showMoreText, isTablet && styles.showMoreTextTablet]}>
                  {showMore ? "Show Less" : "Read More"}
                </Text>
                <Ionicons
                  name={showMore ? "chevron-up" : "chevron-down"}
                  size={isTablet ? 20 : 16}
                  color="#93210A"
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Famous Places */}
        {town.famousPlaces && town.famousPlaces.length > 0 && (
          <View style={[styles.sectionCard, isTablet && styles.sectionCardTablet]}>
            <View style={styles.sectionHeader}>
              <Ionicons 
                name="star" 
                size={isTablet ? 28 : 24} 
                color="#93210A" 
              />
              <Text style={[styles.sectionTitle, { fontSize: sectionTitleFontSize }]}>
                Famous Places
              </Text>
            </View>

            {town.famousPlaces.map((place, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.placeCard,
                  isTablet && styles.placeCardTablet,
                  index % 2 === 0 ? styles.cardLeft : styles.cardRight,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("FamousPlace", { place })
                }
              >
                <Image
                  source={{ uri: place.image }}
                  style={[
                    styles.placeImage, 
                    isTablet && styles.placeImageTablet,
                    { width: placeImageSize, height: placeImageSize }
                  ]}
                  resizeMode="cover"
                />

                <View style={[styles.placeContent, isTablet && styles.placeContentTablet]}>
                  <Text
                    style={[
                      styles.placeDescription, 
                      { fontSize: placeDescFontSize },
                      isTablet && styles.placeDescriptionTablet
                    ]}
                    numberOfLines={2}
                  >
                    {place.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tourist Spots */}
        {town.tourist && town.tourist.length > 0 && (
          <View style={[styles.sectionCard, isTablet && styles.sectionCardTablet]}>
            <View style={styles.sectionHeader}>
              <Ionicons 
                name="car" 
                size={isTablet ? 28 : 24} 
                color="#93210A" 
              />
              <Text style={[styles.sectionTitle, { fontSize: sectionTitleFontSize }]}>
                Tourist Spots
              </Text>
            </View>

            {town.tourist.map((spot, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("TouristPlace", { spot })
                }
              >
                <View
                  style={[
                    styles.placeCard,
                    isTablet && styles.placeCardTablet,
                    index % 2 === 0 ? styles.cardLeft : styles.cardRight,
                  ]}
                >
                  <Image
                    source={{ uri: spot.image }}
                    style={[
                      styles.placeImage, 
                      isTablet && styles.placeImageTablet,
                      { width: placeImageSize, height: placeImageSize }
                    ]}
                    resizeMode="cover"
                  />

                  <View style={[styles.placeContent, isTablet && styles.placeContentTablet]}>
                    <Text style={[
                      styles.spotName, 
                      { fontSize: placeNameFontSize },
                      isTablet && styles.spotNameTablet
                    ]}>
                      {spot.name}
                    </Text>

                    <View style={[styles.distanceBadge, isTablet && styles.distanceBadgeTablet]}>
                      <Ionicons 
                        name="location" 
                        size={isTablet ? 14 : 12} 
                        color="#93210A" 
                      />
                      <Text style={[styles.spotDistance, isTablet && styles.spotDistanceTablet]}>
                        {spot.distance}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Gallery */}
        {town.add?.length > 0 && (
          <View style={[styles.sectionCard, isTablet && styles.sectionCardTablet]}>
            <View style={styles.sectionHeader}>
              <Ionicons 
                name="images" 
                size={isTablet ? 28 : 24} 
                color="#93210A" 
              />
              <Text style={[styles.sectionTitle, { fontSize: sectionTitleFontSize }]}>
                Gallery
              </Text>
            </View>

            <Animated.FlatList
              ref={flatListRef}
              horizontal
              data={town.add}
              keyExtractor={(_, i) => i.toString()}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              contentContainerStyle={[
                styles.galleryListContainer,
                isTablet && styles.galleryListContainerTablet
              ]}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              renderItem={({ item }) =>
                item?.image ? (
                  <View
                    style={[
                      styles.galleryItem,
                      { width: ITEM_WIDTH, height: GALLERY_HEIGHT },
                    ]}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                  </View>
                ) : null
              }
            />

            {/* Dots */}
            {town.add.length > 1 && (
              <View style={styles.carouselDots}>
                {town.add.map((_, index) => {
                  const size = scrollX.interpolate({
                    inputRange: [
                      (index - 1) * ITEM_WIDTH,
                      index * ITEM_WIDTH,
                      (index + 1) * ITEM_WIDTH,
                    ],
                    outputRange: [8, 12, 8],
                    extrapolate: "clamp",
                  });
                  return (
                    <Animated.View
                      key={index}
                      style={[styles.dot, { width: size, height: size }]}
                    />
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Videos */}
        {town.videos?.length > 0 && (
          <View style={[styles.sectionCard, isTablet && styles.sectionCardTablet]}>
            <Text style={[styles.sectionTitle, { fontSize: sectionTitleFontSize }]}>
              Videos
            </Text>

            {town.videos.map((vid, index) => {
              const videoId = extractYouTubeId(vid.videoUrl);
              if (!videoId) return null;

              return (
                <View 
                  key={index} 
                  style={[
                    styles.videoContainer, 
                    isTablet && styles.videoContainerTablet
                  ]}
                >
                  <WebView
                    source={{
                      html: `
                        <!DOCTYPE html>
                        <html>
                          <body style="margin:0;padding:0;">
                            <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/${videoId}"
                              frameborder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen>
                            </iframe>
                          </body>
                        </html>
                      `,
                    }}
                    javaScriptEnabled
                    domStorageEnabled
                    allowsFullscreenVideo
                    originWhitelist={["*"]}
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

/* YouTube ID Extractor */
function extractYouTubeId(url) {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // Banner Section
  bannerContainer: {
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    flex: 1,
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
  backButtonTablet: {
    top: 60,
    left: 30,
    padding: 10,
    borderRadius: 25,
  },
  titleContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  titleContainerTablet: {
    bottom: 40,
    left: 40,
    right: 40,
  },
  bannerTitle: {
    color: "#fff",
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
  titleUnderlineTablet: {
    width: 80,
    height: 5,
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
  businessButtonTablet: {
    marginHorizontal: 40,
    marginVertical: 25,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  businessButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginHorizontal: 12,
    fontSize: 18,
  },
  businessButtonTextTablet: {
    fontSize: 22,
    marginHorizontal: 16,
  },

  // Grid Menu
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  gridContainerTablet: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  menuBox: {
    width: "48%",
    backgroundColor: "#93210A",
    paddingVertical: 15,
    marginBottom: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  menuBoxTablet: {
    paddingVertical: 20,
    marginBottom: 16,
    borderRadius: 12,
  },
  menuText: {
    color: "#fff",
    fontWeight: "bold",
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
  sectionCardTablet: {
    marginHorizontal: 40,
    marginBottom: 25,
    borderRadius: 20,
    padding: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#93210A",
    marginLeft: 8,
  },

  // About Section
  aboutText: {
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
  showMoreButtonTablet: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  showMoreText: {
    color: "#93210A",
    fontWeight: "600",
    marginRight: 4,
  },
  showMoreTextTablet: {
    fontSize: 16,
  },

  // Gallery Section
  galleryListContainer: {
    paddingHorizontal: 20,
  },
  galleryListContainerTablet: {
    paddingHorizontal: 30,
  },
  galleryItem: {
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
  },
  galleryImage: { 
    width: "100%", 
    height: "100%" 
  },
  carouselDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    backgroundColor: "#93210A",
    borderRadius: 6,
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
  placeCardTablet: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardLeft: {
    flexDirection: "row",
  },
  cardRight: {
    flexDirection: "row-reverse",
  },
  placeImage: {
    borderRadius: 12,
  },
  placeImageTablet: {
    borderRadius: 16,
  },
  placeContent: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  placeContentTablet: {
    paddingHorizontal: 16,
  },
  placeDescription: {
    color: "#555",
    lineHeight: 20,
  },
  placeDescriptionTablet: {
    lineHeight: 24,
  },
  spotName: {
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  spotNameTablet: {
    marginBottom: 8,
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
  distanceBadgeTablet: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  spotDistance: {
    color: "#93210A",
    fontWeight: "500",
    marginLeft: 4,
  },
  spotDistanceTablet: {
    fontSize: 14,
  },

  // Video Section
  videoContainer: {
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  videoContainerTablet: {
    height: 280,
    marginBottom: 20,
    borderRadius: 12,
  },
});