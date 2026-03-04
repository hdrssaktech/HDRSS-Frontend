import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getPlaceDetails } from "../../api/api.js";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import Loader from "../../components/Alert/Loader.js";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function DistrictCategorysPage2() {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId, categoryName, placeId } = route.params;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const data = await getPlaceDetails(districtId, categoryName, placeId);
        if (data) {
          setPlace(data);
        } else {
          console.warn("⚠️ No place details found");
          setPlace(null);
        }
      } catch (error) {
        console.error("❌ Error fetching place details:", error);
        setPlace(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [districtId, categoryName, placeId]);

  // 📞 Open phone dialer
  const openPhone = () => {
    if (place?.phone) {
      Linking.openURL(`tel:${place.phone}`).catch(() =>
        Alert.alert("Error", "Unable to open phone app.")
      );
    }
  };

  // 💬 Open WhatsApp chat
  const openWhatsApp = () => {
    if (place?.whatsapp) {
      const number = place.whatsapp.replace(/\D/g, "");
      Linking.openURL(`https://wa.me/${number}`).catch(() =>
        Alert.alert("Error", "Unable to open WhatsApp.")
      );
    }
  };

  // 📍 Open map or location link
  const openLocation = () => {
    if (place?.location) {
      Linking.openURL(place.location).catch(() =>
        Alert.alert("Error", "Unable to open location.")
      );
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    ];
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  if (loading) {
    return <Loader />;
  }

  if (!place) {
    return (
      <View style={styles.center}>
        <Text style={[styles.noDataText, isTablet && styles.noDataTextTablet]}>
          No details found
        </Text>
      </View>
    );
  }

  const youtubeId = place.video ? getYouTubeId(place.video) : null;

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* 📢 FIXED ADVERTISEMENT BANNER at TOP of screen */}
      {place.advertisment && Array.isArray(place.advertisment) && place.advertisment.length > 0 && (
        <View style={[styles.adBanner, isTablet && styles.adBannerTablet]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            style={styles.adScroll}
          >
            {place.advertisment.map((img, index) => (
              <View key={index} style={[styles.adSlide, { width: screenWidth }]}>
                <Image
                  source={{ uri: img }}
                  style={styles.adBannerImage}
                  onError={(e) => console.warn("Ad image load error:", e.nativeEvent.error)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 🖼️ BACK BUTTON - Fixed position over advertisement */}
      <TouchableOpacity 
        style={[styles.backButton, isTablet && styles.backButtonTablet]} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 32 : 28} color="#fff" />
      </TouchableOpacity>

      {/* 🏷️ Title + Category - Comes AFTER advertisement */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <Text style={[styles.title, isTablet && styles.titleTablet]}>
          {place.name || "Unnamed Place"}
        </Text>
        <View style={[styles.categoryBadge, isTablet && styles.categoryBadgeTablet]}>
          <Text style={[styles.categoryText, isTablet && styles.categoryTextTablet]}>
            {categoryName ? categoryName.toUpperCase() : "CATEGORY"}
          </Text>
        </View>
      </View>

      {/* ☎️ Contact Buttons - Comes BEFORE main image */}
      <View style={[styles.buttonRow, isTablet && styles.buttonRowTablet]}>
        {place.phone && (
          <TouchableOpacity 
            style={[styles.button, isTablet && styles.buttonTablet]} 
            onPress={openPhone}
          >
            <MaterialIcons name="call" size={isTablet ? 24 : 20} color="#fff" />
            <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>Call</Text>
          </TouchableOpacity>
        )}

        {place.whatsapp && (
          <TouchableOpacity
            style={[styles.button, styles.whatsappButton, isTablet && styles.buttonTablet]}
            onPress={openWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={isTablet ? 24 : 20} color="#fff" />
            <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>WhatsApp</Text>
          </TouchableOpacity>
        )}

        {place.location && (
          <TouchableOpacity
            style={[styles.button, styles.locationButton, isTablet && styles.buttonTablet]}
            onPress={openLocation}
          >
            <Ionicons name="navigate" size={isTablet ? 24 : 20} color="#fff" />
            <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>Navigate</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 🖼️ MAIN IMAGE - Shows AFTER contact buttons */}
      <View style={[styles.imageWrapper, isTablet && styles.imageWrapperTablet]}>
        <Image
          source={{
            uri: place.image || "https://via.placeholder.com/600x400.png?text=No+Image+Available",
          }}
          style={[styles.image, isTablet && styles.imageTablet, { width: screenWidth }]}
        />
        
        {/* Location Info on Image */}
        {place.location && (
          <View style={[styles.imageLocation, isTablet && styles.imageLocationTablet]}>
            <Ionicons name="location" size={isTablet ? 20 : 18} color="#fff" />
            <Text style={[styles.imageLocationText, isTablet && styles.imageLocationTextTablet]}>
              {place.location}
            </Text>
          </View>
        )}
      </View>

      {/* 📝 About Section */}
      <View style={[styles.section, isTablet && styles.sectionTablet]}>
        <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>About</Text>
        <Text style={[styles.description, isTablet && styles.descriptionTablet]} numberOfLines={show ? undefined : 4}>
          {place.description || "No description available for this place."}
        </Text>
        <TouchableOpacity onPress={() => setShow(!show)}>
          <View>
            <Text style={[styles.readMoreText, isTablet && styles.readMoreTextTablet]}>
              {show ? 'Read Less...' : 'Read More...'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 🖼️ Gallery Section */}
      {place.gallery && Array.isArray(place.gallery) && place.gallery.length > 0 && (
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Visiting Places
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryScrollContent}
          >
            {place.gallery.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={[styles.galleryImage, isTablet && styles.galleryImageTablet]}
                onError={(e) => console.warn("Image load error:", e.nativeEvent.error)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* 📺 Video Section - At the bottom */}
      {place.video && youtubeId && (
        <View style={[styles.section, styles.videoSection, isTablet && styles.sectionTablet]}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>Video</Text>
          <View style={[styles.videoContainer, isTablet && styles.videoContainerTablet]}>
            <YoutubePlayer
              height={isTablet ? (isLargeTablet ? 450 : 380) : 200}
              width={screenWidth - (isTablet ? 60 : 40)}
              play={playing}
              videoId={youtubeId}
              onChangeState={(event) => {
                if (event === "ended") {
                  setPlaying(false);
                }
              }}
              webViewStyle={{ opacity: 0.99 }}
            />
          </View>
        </View>
      )}

      {/* Footer Space */}
      <View style={[styles.footer, isTablet && styles.footerTablet]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "#93210A",
    fontSize: 18,
  },
  noDataTextTablet: {
    fontSize: 22,
  },
  
  // Fixed Advertisement Banner at TOP
  adBanner: {
    height: 180,
    backgroundColor: "#fff",
    width: '100%',
  },
  adBannerTablet: {
    height: 250,
  },
  adScroll: {
    flex: 1,
  },
  adSlide: {
    height: 180,
    position: 'relative',
  },
  adBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  // Fixed Back Button
  backButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 8,
    zIndex: 100,
  },
  backButtonTablet: {
    top: Platform.OS === 'ios' ? 60 : 50,
    left: 20,
    padding: 10,
    borderRadius: 30,
  },
  
  // Header Styles
  header: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerTablet: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
  },
  titleTablet: {
    fontSize: 26,
  },
  categoryBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#ffd700",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  categoryBadgeTablet: {
    marginTop: 10,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  categoryTextTablet: {
    fontSize: 14,
  },
  
  // Contact Buttons - BEFORE image
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  buttonRowTablet: {
    paddingVertical: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 90,
    justifyContent: "center",
  },
  buttonTablet: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 120,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  locationButton: {
    backgroundColor: "#007BFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "bold",
  },
  buttonTextTablet: {
    fontSize: 18,
    marginLeft: 8,
  },
  
  // Main Image - AFTER contact buttons
  imageWrapper: {
    position: "relative",
  },
  imageWrapperTablet: {
    marginTop: 5,
  },
  image: {
    height: 250,
    resizeMode: "cover",
  },
  imageTablet: {
    height: 350,
  },
  imageLocation: {
    position: "absolute",
    bottom: 15,
    left: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageLocationTablet: {
    bottom: 20,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
  },
  imageLocationText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "600",
  },
  imageLocationTextTablet: {
    fontSize: 16,
    marginLeft: 6,
  },
  
  // Section Styles
  section: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTablet: {
    marginTop: 15,
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
  },
  sectionTitleTablet: {
    fontSize: 22,
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  descriptionTablet: {
    fontSize: 16,
    lineHeight: 26,
  },
  readMoreText: {
    color: '#93210A',
    fontSize: 15,
    textAlign: 'right',
    marginTop: 8,
  },
  readMoreTextTablet: {
    fontSize: 17,
    marginTop: 10,
  },
  
  // Gallery Styles
  galleryScrollContent: {
    paddingRight: 10,
  },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  galleryImageTablet: {
    width: 280,
    height: 200,
    borderRadius: 15,
    marginRight: 15,
  },
  
  // Video Styles
  videoSection: {
    paddingBottom: 15,
  },
  videoContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  videoContainerTablet: {
    borderRadius: 15,
    marginTop: 15,
  },
  
  // Footer
  footer: {
    height: 30,
  },
  footerTablet: {
    height: 40,
  },
});