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
import { Video } from "expo-av";

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
  const video = storyItem.video || null;
  const gallery = Array.isArray(storyItem.gallery) ? storyItem.gallery : [];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* 🔹 Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Banner Image (with consistent old design) */}
        {bannerImage && (
          <View style={styles.bannerWrapper}>
            <Image
              source={{ uri: bannerImage }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* 🔹 Description Section */}
        {description ? (
          <View style={styles.content}>
            <Text style={styles.description}>{description}</Text>
          </View>
        ) : null}

        {/* 🔹 Main Image */}
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        ) : null}

        {/* 🔹 Video Section */}
        {video ? (
          <View style={styles.videoContainer}>
            <Text style={styles.sectionTitle}>Video</Text>
            <Video
              source={{ uri: video }}
              useNativeControls
              resizeMode="cover"
              style={styles.video}
            />
          </View>
        ) : null}

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
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.galleryImage}
                />
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

  // ✅ Header same as older page (consistent theme)
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

  // ✅ Banner Image section styled like older design
  bannerWrapper: {
    marginTop: 10,
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: 220,
    
   
  },

  // Description
  content: { padding: 16 },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    textAlign: "justify",
  },

  // Main Image
  mainImage: {
    width: width - 40,
    height: 250,
    borderRadius: 15,
    alignSelf: "center",
    marginVertical: 20,
  },

  // Video
  videoContainer: { alignItems: "center", marginVertical: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  video: {
    width: width - 40,
    height: 220,
    borderRadius: 15,
  },

  // Gallery
  galleryContainer: { marginVertical: 20 },
  galleryScroll: { paddingHorizontal: 16 },
  galleryImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 10,
  },

  // No data
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
