import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getPlaceDetails } from "../../api/api.js";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

export default function DistrictCategorysPage2() {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId, categoryName, placeId } = route.params;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const[show,Setshow] = useState(false);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isTablet = screenWidth >= 600;

  const { width } = Dimensions.get("window");

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
    
    // Handle different YouTube URL formats
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
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#93210A", fontSize: 18 }}>No details found</Text>
      </View>
    );
  }

  const youtubeId = place.video ? getYouTubeId(place.video) : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 📢 FIXED ADVERTISEMENT BANNER at TOP of screen */}
      {place.advertisment && Array.isArray(place.advertisment) && place.advertisment.length > 0 && (
        <View style={styles.adBanner}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            style={styles.adScroll}
          >
            {place.advertisment.map((img, index) => (
              <View key={index} style={styles.adSlide}>
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 🏷️ Title + Category - Comes AFTER advertisement */}
      <View style={styles.header}>
        <Text style={styles.title}>{place.name || "Unnamed Place"}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {categoryName ? categoryName.toUpperCase() : "CATEGORY"}
          </Text>
        </View>
      </View>

      {/* ☎️ Contact Buttons - Comes BEFORE main image */}
      <View style={styles.buttonRow}>
        {place.phone && (
          <TouchableOpacity style={styles.button} onPress={openPhone}>
            <MaterialIcons name="call" size={20} color="#fff" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
        )}

        {place.whatsapp && (
          <TouchableOpacity
            style={[styles.button, styles.whatsappButton]}
            onPress={openWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        )}

        {place.location && (
          <TouchableOpacity
            style={[styles.button, styles.locationButton]}
            onPress={openLocation}
          >
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.buttonText}>Navigate</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 🖼️ MAIN IMAGE - Shows AFTER contact buttons */}
      <View style={{ position: "relative", marginTop: 10 }}>
        <Image
          source={{
            uri: place.image || "https://via.placeholder.com/600x400.png?text=No+Image+Available",
          }}
          style={[styles.image, { width }]}
        />
        
        {/* Location Info on Image */}
        {place.location && (
          <View style={styles.imageLocation}>
            <Ionicons name="location" size={18} color="#fff" />
            <Text style={styles.imageLocationText}>{place.location}</Text>
          </View>
        )}
      </View>

      {/* 📝 About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description} numberOfLines={show ? undefined:4} >
          {place.description || "No description available for this place."}
        </Text>
        <TouchableOpacity onPress={()=>Setshow(!show)}>
          <View>
          <Text style={{color:'#93210A',fontSize:15,textAlign:'right'}} >{show ? 'Read Less...' : 'Read More...'}</Text>
        </View>
        </TouchableOpacity>
      
      </View>

      {/* 🖼️ Gallery Section */}
      {place.gallery && Array.isArray(place.gallery) && place.gallery.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visiting Places</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryScrollContent}
          >
            {place.gallery.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.galleryImage}
                onError={(e) => console.warn("Image load error:", e.nativeEvent.error)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* 📺 Video Section - At the bottom */}
      {place.video && youtubeId && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video</Text>
          <View style={styles.videoContainer}>
            <YoutubePlayer
              height={isTablet ? 380 : 200}
              width={width - 50} // Account for padding
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
      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Fixed Advertisement Banner at TOP
  adBanner: {
    height: 180,
    backgroundColor: "#fff",
    width: '100%',
  },
  adScroll: {
    flex: 1,
  },
  adSlide: {
    width: Dimensions.get('window').width,
    height: 200,
    position: 'relative',
  },
  adBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  adBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(147, 33, 10, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
  },
  adBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  
  // Fixed Back Button
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
    zIndex: 100,
  },
  
  // Header Styles
  header: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
  },
  categoryBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#ffd700",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  locationButton: {
    backgroundColor: "#007BFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  
  // Main Image - AFTER contact buttons
  image: {
    height: 250,
    resizeMode: "cover",
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
  imageLocationText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "600",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
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
  
  // Video Styles
  videoContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  
  // Footer
  footer: {
    height: 30,
  },
});