import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

const { width } = Dimensions.get("window");

export default function StoryPage2({ route, navigation }) {
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
    storyItem.video || "https://www.youtube.com/watch?v=sjQw5YBPj3Y"; // ✅ default video
  const gallery = Array.isArray(storyItem.gallery) ? storyItem.gallery : [];

  // ✅ Extract YouTube video ID
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Banner Image */}
        {bannerImage && (
          <Image source={{ uri: bannerImage }} style={styles.bannerImage} resizeMode="cover" />
        )}

        {/* 🔹 Description */}
        {description ? (
          <View style={styles.content}>
            <Text style={styles.description}>{description}</Text>
          </View>
        ) : null}

        {/* 🔹 Main Image */}
        {image ? (
          <Image source={{ uri: image }} style={styles.mainImage} resizeMode="cover" />
        ) : null}

        {/* 🎥 Video Section with Title */}
        {videoId && (
          <View style={styles.videoSection}>
            <Text style={styles.videoTitle}>Video</Text>
            <View style={styles.fullVideoWrapper}>
              <YoutubePlayer height={230} width={width} play={false} videoId={videoId} />
            </View>
          </View>
        )}

        {/* 🔹 Gallery Section */}
        {gallery.length > 0 && (
          <View style={styles.galleryContainer}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryScroll}
            >
              {gallery.map((img, index) => (
                <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  backButton: { marginBottom: 4, marginRight: 8 },
  headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 22,
    flexShrink: 1,
  },

  bannerImage: {
    width: width,
    height: 180,
  },

  content: { padding: 16 },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    textAlign: "justify",
  },

  mainImage: {
    width: width - 40,
    height: 210,
    borderRadius: 15,
    alignSelf: "center",
    marginVertical: 20,
  },

  /* 🔹 Video Styles */
  videoSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "left",
    marginLeft: 16,
    marginBottom: 10,
  },
  fullVideoWrapper: {
    width: width,
    alignSelf: "center",
    backgroundColor: "#000",
    marginVertical: 10,
  },

  /* 🔹 Gallery Styles */
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
    marginLeft: 20,
  },

  galleryContainer: { marginVertical: 20 },
  galleryScroll: { paddingHorizontal: 16 },
  galleryImage: {
    width: 170,
    height: 140,
    borderRadius: 12,
    marginRight: 10,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});