import React,{useState} from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

const FamousPlaceDetails = ({ route }) => {
  const { place } = route.params;
  const navigation = useNavigation();
  const [expant,setExpanded] = useState(false);
  // Responsive dimensions
  const bannerHeight = isTablet ? (isLargeTablet ? 350 : 320) : 260;
  const titleFontSize = isTablet ? (isLargeTablet ? 28 : 26) : 22;
  const cardTitleFontSize = isTablet ? (isLargeTablet ? 22 : 20) : 18;
  const cardTextFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 14;
  const actionBtnFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 14;
  const galleryImageWidth = isTablet ? (isLargeTablet ? 180 : 160) : 140;
  const galleryImageHeight = isTablet ? (isLargeTablet ? 140 : 120) : 100;
  const videoHeight = isTablet ? (isLargeTablet ? 250 : 350) : 200;

  // readmore condition
  const longtext = (place.description?.split(" ").length || 0) > 10;

  const extractYouTubeId = (url) => {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Banner Image + Back Arrow */}
      <View>
        <Image 
          source={{ uri: place.image }} 
          style={[styles.bannerImage, { height: bannerHeight }]} 
        />

        <TouchableOpacity
          style={[styles.backBtn, isTablet && styles.backBtnTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back" 
            size={isTablet ? 28 : 24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {/* 🏷 Title */}
      <Text style={[styles.title, { fontSize: titleFontSize }]}>
        {place.title || "Famous Place"}
      </Text>

      {/* 📞 Action Buttons */}
      <View style={[styles.actionRow, isTablet && styles.actionRowTablet]}>
        {place.phone && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#8B1E0F" }, isTablet && styles.actionBtnTablet]}
            onPress={() => Linking.openURL(`tel:${place.phone}`)}
          >
            <Ionicons 
              name="call" 
              size={isTablet ? 24 : 20} 
              color="#fff" 
            />
            <Text style={[styles.actionText, { fontSize: actionBtnFontSize }]}>
              Call
            </Text>
          </TouchableOpacity>
        )}

        {place.whatsapp && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#25D366" }, isTablet && styles.actionBtnTablet]}
            onPress={() =>
              Linking.openURL(`https://wa.me/${place.whatsapp}`)
            }
          >
            <Ionicons 
              name="logo-whatsapp" 
              size={isTablet ? 24 : 20} 
              color="#fff" 
            />
            <Text style={[styles.actionText, { fontSize: actionBtnFontSize }]}>
              WhatsApp
            </Text>
          </TouchableOpacity>
        )}

        {place.location && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#1E88E5" }, isTablet && styles.actionBtnTablet]}
            onPress={() => Linking.openURL(place.location)}
          >
            <Ionicons 
              name="location" 
              size={isTablet ? 24 : 20} 
              color="#fff" 
            />
            <Text style={[styles.actionText, { fontSize: actionBtnFontSize }]}>
              Location
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ℹ️ About */}
      {place.description && (
        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={[styles.cardTitle, { fontSize: cardTitleFontSize }]}>
            About
          </Text>

          <Text
            style={[styles.cardText, { fontSize: cardTextFontSize }]}
            numberOfLines={expant ? undefined : 5}
          >
            {place.description}
          </Text>

          {longtext && (
            <Text
              style={styles.readMoreText}
              onPress={() => setExpanded(!expant)}
            >
              {expant ? "Read less" : "Read more"}
            </Text>
          )}
        </View>
      )}


      {/* 🖼 Gallery */}
      {place.gallery && place.gallery.length > 0 && (
        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={[styles.cardTitle, { fontSize: cardTitleFontSize }]}>
            Gallery
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryContainer}
          >
            {place.gallery.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={[
                  styles.galleryImage,
                  isTablet && styles.galleryImageTablet,
                  { 
                    width: galleryImageWidth, 
                    height: galleryImageHeight 
                  }
                ]}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* 🎥 Video */}
      {place.video && (
      <View style={[styles.card, isTablet && styles.cardTablet]}>
        <Text style={[styles.cardTitle, { fontSize: cardTitleFontSize }]}>
          Video
        </Text>

        <View style={[styles.videoContainer, { height: videoHeight }]}>
          <YoutubePlayer
            height={videoHeight}
            play={false}
            videoId={extractYouTubeId(place.video)}
            webViewProps={{
              allowsFullscreenVideo: true,
            }}
          />
        </View>
      </View>
    )}

    </ScrollView>
  );
};

export default FamousPlaceDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  bannerImage: {
    width: "100%",
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 20,
  },
  backBtnTablet: {
    top: 50,
    left: 25,
    padding: 10,
    borderRadius: 25,
  },
  title: {
    fontWeight: "bold",
    marginTop: 12,
    marginHorizontal: 16,
    color: "#8B1E0F",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    marginHorizontal: 12,
  },
  actionRowTablet: {
    marginVertical: 20,
    marginHorizontal: 30,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionBtnTablet: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
  readMoreText: {
  marginTop: 6,
  color: "#93210A",
  fontWeight: "600",
  textAlign: "right",
},
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    elevation: 3,
  },
  cardTablet: {
    marginHorizontal: 30,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#8B1E0F",
    marginBottom: 6,
  },
  cardText: {
    lineHeight: 22,
    color: "#555",
  },
  galleryContainer: {
    paddingRight: 10,
  },
  galleryImage: {
    borderRadius: 8,
    marginRight: 10,
    marginTop: 8,
  },
  galleryImageTablet: {
    borderRadius: 10,
    marginRight: 12,
  },
  videoContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
});