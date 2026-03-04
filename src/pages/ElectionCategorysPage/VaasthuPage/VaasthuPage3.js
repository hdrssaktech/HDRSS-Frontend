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
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

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
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={isTablet ? 30 : 24} color="#fff" />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
        {item.title}
      </Text>

      <View style={{ width: 30 }} />
    </View>
  );

  /* ================= ABOUT ================= */
  const renderAboutSection = () => {
    if (!item.about) return null;

    return (
      <View style={styles.aboutSection}>
        <Text style={[styles.section, isTablet && styles.sectionTablet]}>
          About
        </Text>

        <Text
          style={[styles.aboutText, isTablet && styles.aboutTextTablet]}
          numberOfLines={showFullAbout ? undefined : 10}
        >
          {item.about}
        </Text>

        <TouchableOpacity
          style={styles.readMoreButtonRight}
          onPress={() => setShowFullAbout(!showFullAbout)}
        >
          <Text style={styles.readMoreText}>
            {showFullAbout ? "Show Less" : "Read More"}
          </Text>
          <Ionicons
            name={showFullAbout ? "chevron-up" : "chevron-down"}
            size={16}
            color="#8B1A1A"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /* ================= DESCRIPTION ================= */
  const renderDescriptionSection = () => {
    if (!item.description) return null;

    return (
      <View style={styles.descriptionSection}>
        <Text style={[styles.section, isTablet && styles.sectionTablet]}>
          Description
        </Text>

        <Text
          style={[
            styles.description,
            isTablet && styles.descriptionTablet,
          ]}
          numberOfLines={showFullDescription ? undefined : 10}
        >
          {item.description}
        </Text>

        <TouchableOpacity
          style={styles.readMoreButtonRight}
          onPress={() => setShowFullDescription(!showFullDescription)}
        >
          <Text style={styles.readMoreText}>
            {showFullDescription ? "Show Less" : "Read More"}
          </Text>
          <Ionicons
            name={showFullDescription ? "chevron-up" : "chevron-down"}
            size={16}
            color="#8B1A1A"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /* ================= VIDEO ================= */
  const renderVideoSection = () => {
    if (!videoId) return null;

    return (
      <View style={styles.videoSection}>
        <Text style={[styles.section, isTablet && styles.sectionTablet]}>
          Video
        </Text>

        {videoLoading && (
          <View style={[styles.videoLoader, { height: videoHeight }]}>
            <ActivityIndicator size="large" color="#8B1A1A" />
            <Text style={styles.videoLoadingText}>Loading video...</Text>
          </View>
        )}

        <View style={[styles.videoContainer, { height: videoHeight }]}>
          <YoutubePlayer
            height={videoHeight}
            width={screenWidth - 32}
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
      <View style={styles.gallerySection}>
        <Text style={[styles.section, isTablet && styles.sectionTablet]}>
          Gallery
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.gallery.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img }}
              style={[
                styles.galleryImage,
                isTablet && styles.tabletGalleryImage,
              ]}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />

      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: item.bannerImage }}
          style={[styles.banner, isTablet && styles.bannerTablet]}
        />

        <View style={[styles.content, isTablet && styles.contentTablet]}>
          {renderAboutSection()}
          {item.video && renderVideoSection()}
          {renderGallery()}
          {renderDescriptionSection()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VaasthuPage3;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: "#8B1A1A",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTablet: {
    paddingVertical: 46,
    paddingHorizontal: 24,
    marginTop: -27,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerTitleTablet: { fontSize: 24 },

  banner: { width: "100%", height: 220 },
  bannerTablet: { height: 320 },

  content: { padding: 16 },
  contentTablet: {
    maxWidth: 900,
    alignSelf: "center",
    padding: 24,
    width: "100%",
  },

  section: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8B1A1A",
    marginBottom: 10,
  },
  sectionTablet: { fontSize: 22 },

  aboutSection: { marginBottom: 20 },
  aboutText: { fontSize: 15, lineHeight: 24, color: "#444", textAlign: "justify" },
  aboutTextTablet: { fontSize: 17, lineHeight: 28 },

  descriptionSection: { marginTop: 25 },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#444",
    textAlign: "justify",
  },
  descriptionTablet: {
    fontSize: 17,
    lineHeight: 28,
  },

  readMoreButtonRight: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  readMoreText: {
    color: "#8B1A1A",
    fontSize: 14,
    fontWeight: "700",
  },

  videoSection: { marginVertical: 20 },
  videoContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    marginTop: 10,
  },
  videoLoader: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
  },
  videoLoadingText: {
    marginTop: 10,
    color: "#8B1A1A",
    fontSize: 16,
  },

  gallerySection: { marginVertical: 20 },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  tabletGalleryImage: {
    width: 280,
    height: 200,
    borderRadius: 12,
  },
});


