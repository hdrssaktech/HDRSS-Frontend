import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import Loader from "../../../components/Alert/Loader";

const VaasthuPage3 = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;

  const [videoLoading, setVideoLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  /* 🔹 ABOUT STATE */
  const [showFullAbout, setShowFullAbout] = useState(false);

  /* 🔹 DESCRIPTION STATE */
  const [showFullDescription, setShowFullDescription] = useState(false);

  /* ================= YOUTUBE ================= */
  const getYoutubeId = (url) => {
    if (!url) return null;
    const reg =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(reg);
    return match ? match[1] : null;
  };

  const videoId = getYoutubeId(item.video);
  const screenWidth = Dimensions.get("window").width;
  const videoHeight = isTablet
    ? Math.min(screenWidth * 0.56, 400)
    : Math.min(screenWidth * 0.56, 240);

  /* ================= HEADER ================= */
  const renderHeader = () => (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} numberOfLines={1}>
        {item.title}
      </Text>

      <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
    </View>
  );

  /* ================= ABOUT ================= */
  const renderAboutSection = () => {
    if (!item.about) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
          About
        </Text>

        <View style={styles.textCard}>
          <Text
            style={[styles.sectionText, isTablet && styles.sectionTextTablet]}
            numberOfLines={showFullAbout ? undefined : 10}
          >
            {item.about}
          </Text>

          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={() => setShowFullAbout(!showFullAbout)}
          >
            <Text style={[styles.readMoreText, isTablet && styles.readMoreTextTablet]}>
              {showFullAbout ? "Show Less" : "Read More"}
            </Text>
            <Ionicons
              name={showFullAbout ? "chevron-up" : "chevron-down"}
              size={isTablet ? 18 : 16}
              color="#8B1A1A"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ================= DESCRIPTION ================= */
  const renderDescriptionSection = () => {
    if (!item.description) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
          Description
        </Text>

        <View style={styles.textCard}>
          <Text
            style={[styles.sectionText, isTablet && styles.sectionTextTablet]}
            numberOfLines={showFullDescription ? undefined : 10}
          >
            {item.description}
          </Text>

          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={() => setShowFullDescription(!showFullDescription)}
          >
            <Text style={[styles.readMoreText, isTablet && styles.readMoreTextTablet]}>
              {showFullDescription ? "Show Less" : "Read More"}
            </Text>
            <Ionicons
              name={showFullDescription ? "chevron-up" : "chevron-down"}
              size={isTablet ? 18 : 16}
              color="#8B1A1A"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /* ================= VIDEO ================= */
  const renderVideoSection = () => {
    if (!videoId) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
          Video
        </Text>

        <View style={[styles.videoCard, { height: videoHeight }]}>
          <YoutubePlayer
            height={videoHeight}
            width={screenWidth - (isTablet ? 72 : 32)}
            videoId={videoId}
            play={playing}
            onReady={() => setVideoLoading(false)}
          />
        </View>
      </View>
    );
  };

  /* ================= GALLERY ================= */
  const renderGallery = () => {
    if (!item.gallery || item.gallery.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
          Gallery
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.gallery.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img }}
              style={[
                styles.galleryImage,
                isTablet && styles.galleryImageTablet,
              ]}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />

      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: item.bannerImage }}
          style={[styles.banner, isTablet && styles.bannerTablet]}
        />

        <View style={[styles.contentContainer, isTablet && styles.contentContainerTablet]}>
          {renderAboutSection()}
          {item.video && renderVideoSection()}
          {renderGallery()}
          {renderDescriptionSection()}
        </View>
      </ScrollView>
    </View>
  );
};

export default VaasthuPage3;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  /* Header - Exactly like PoojaPage1 */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B1A1A",
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTablet: {
    paddingTop: 45,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
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
    marginHorizontal: 8,
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

  /* Banner Image */
  banner: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  bannerTablet: {
    height: 300,
  },

  /* Content Container */
  contentContainer: {
    padding: 16,
  },
  contentContainerTablet: {
    padding: 24,
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },

  /* Section Container */
  sectionContainer: {
    marginBottom: 24,
  },

  /* Section Title - Like PoojaPage1 section headers */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B1A1A",
    marginBottom: 12,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#8B1A1A",
  },
  sectionTitleTablet: {
    fontSize: 22,
    marginBottom: 16,
    paddingLeft: 12,
  },

  /* Text Card - Like PoojaPage1 content cards */
  textCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  /* Section Text */
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#444",
    textAlign: "justify",
  },
  sectionTextTablet: {
    fontSize: 17,
    lineHeight: 28,
  },

  /* Read More Button */
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  readMoreText: {
    color: "#8B1A1A",
    fontSize: 14,
    fontWeight: "700",
  },
  readMoreTextTablet: {
    fontSize: 16,
  },

  /* Video Section */
  videoCard: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  /* Gallery */
  galleryImage: {
    width: 180,
    height: 135,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  galleryImageTablet: {
    width: 240,
    height: 180,
    borderRadius: 12,
    marginRight: 16,
  },
});