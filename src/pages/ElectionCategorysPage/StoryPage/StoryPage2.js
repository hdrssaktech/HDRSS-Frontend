
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

export default function StoryPage2({ route, navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const { storyItem } = route.params || {};

  if (!storyItem) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#93210A" }}>No story details found.</Text>
      </View>
    );
  }

  const title = String(storyItem.title || "");
  const description = String(storyItem.description || "");
  const bannerImage = storyItem.bannerImage || null;
  const image = storyItem.image || null;
  const video =
    storyItem.video || "https://www.youtube.com/watch?v=sjQw5YBPj3Y";
  const gallery = Array.isArray(storyItem.gallery) ? storyItem.gallery : [];

  // 🔹 Extract YouTube ID
  const getYouTubeId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(video);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* 🔹 Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={isTablet ? 32 : 26} color="#fff" />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Image - First Element */}
        {image && (
          <Image
            source={{ uri: image }}
            style={[
              styles.mainImage,
              isTablet && styles.mainImageTablet,
            ]}
          />
        )}

        {/* 🔹 Description - Second Element */}
        {description && (
          <View style={styles.content}>
            <Text
              style={[
                styles.description,
                isTablet && styles.descriptionTablet,
              ]}
            >
              {description}
            </Text>
          </View>
        )}

        {/* 🎥 Video Section - Third Element */}
        {videoId && (
          <View style={styles.videoSection}>
            <Text
              style={[
                styles.videoTitle,
                isTablet && styles.videoTitleTablet,
              ]}
            >
              Video
            </Text>
            <YoutubePlayer
              height={isTablet ? 365 : 230}
              width={width}
              play={false}
              videoId={videoId}
            />
          </View>
        )}

        {/* 🔹 Gallery - Fourth Element */}
        {gallery.length > 0 && (
          <View style={styles.galleryContainer}>
            <Text
              style={[
                styles.sectionTitle,
                isTablet && styles.sectionTitleTablet,
              ]}
            >
              Gallery
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {gallery.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={[
                    styles.galleryImage,
                    isTablet && styles.galleryImageTablet,
                  ]}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  /* 🔹 Header */
  rection: "row",
    alignItemsheader: {
    flexDi: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  headerTablet: {
    paddingVertical: 35,
    paddingHorizontal: 24,
    marginTop: -3,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginLeft: 37,
    padding: 8,
  },
  headerTitleTablet: {
    fontSize: 28,
    padding: 8,
    left: 125,
  },

  /* 🔹 Main Image */
  mainImage: {
    width: "90%",
    height: 210,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  mainImageTablet: {
    height: 300,
  },

  /* 🔹 Content */
  content: { 
    padding: 16,
    paddingTop: 0 
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    textAlign: "justify",
  },
  descriptionTablet: {
    fontSize: 18,
    lineHeight: 26,
  },

  /* 🔹 Video */
  videoSection: {
    marginVertical: 20,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginLeft: 16,
    marginBottom: 10,
  },
  videoTitleTablet: {
    fontSize: 24,
  },

  /* 🔹 Gallery */
  galleryContainer: {
    marginVertical: 20,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
  },
  sectionTitleTablet: {
    fontSize: 24,
  },
  galleryImage: {
    width: 170,
    height: 140,
    borderRadius: 12,
    marginRight: 10,
  },
  galleryImageTablet: {
    width: 240,
    height: 180,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});