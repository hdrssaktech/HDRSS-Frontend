import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function StoryPage2({ route, navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const [showFullDescription, setShowFullDescription] = useState(false);

  const DESCRIPTION_MAX_LENGTH = 300;

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const { storyItem } = route.params || {};

  if (!storyItem) {
    return (
      <View style={styles.centered}>
        <Ionicons name="book-outline" size={48} color="#93210A" />
        <Text style={styles.noDataText}>No story details found.</Text>
      </View>
    );
  }

  const title       = String(storyItem.title || "");
  const description = String(storyItem.description || "");
  const image       = storyItem.image || null;
  const video       = storyItem.video || "https://www.youtube.com/watch?v=sjQw5YBPj3Y";
  const gallery     = Array.isArray(storyItem.gallery) ? storyItem.gallery : [];

  const getYouTubeId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  };
  const videoId = getYouTubeId(video);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── FULL-EDGE BANNER IMAGE ── */}
        <View style={styles.bannerWrapper}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={[styles.bannerImage, isTablet && styles.bannerImageTablet]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.bannerPlaceholder, isTablet && styles.bannerImageTablet]} />
          )}

          {/* Dark gradient overlay from top (for back button) */}
          <View style={styles.bannerTopGrad} />

          {/* Dark gradient overlay from bottom (for title) */}
          <View style={styles.bannerBottomGrad} />

          {/* Back button — floats over banner */}
          <TouchableOpacity
            style={[styles.backButton, isTablet && styles.backButtonTablet,
              { top: isTablet ? 52 : 44 }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={isTablet ? 28 : 24} color="#fff" />
          </TouchableOpacity>

          {/* Title over banner bottom */}
          <View style={styles.bannerTitleRow}>
            <Text
              style={[styles.bannerTitle, isTablet && styles.bannerTitleTablet]}
              numberOfLines={2}
            >
              {title}
            </Text>
          </View>
        </View>

        {/* ── DESCRIPTION ── */}
        {description ? (
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            {/* Section label */}
            <View style={styles.sectionLabelRow}>
              
              <Text style={[styles.sectionLabel, isTablet && styles.sectionLabelTablet]}>
                கதை விவரம்
              </Text>
            </View>

            <Text style={[styles.description, isTablet && styles.descriptionTablet]}>
              {showFullDescription
                ? description
                : truncateText(description, DESCRIPTION_MAX_LENGTH)}
            </Text>

            {description.length > DESCRIPTION_MAX_LENGTH && (
              <TouchableOpacity
                style={styles.readMoreBtn}
                onPress={() => setShowFullDescription(!showFullDescription)}
                activeOpacity={0.75}
              >
                <Text style={styles.readMoreText}>
                  {showFullDescription ? "மறை ▲" : "மேலும் படிக்க ▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {/* ── GALLERY — horizontal scroll ── */}
        {gallery.length > 0 && (
          <View style={styles.gallerySection}>
            <View style={[styles.sectionLabelRow,
              { paddingHorizontal: isTablet ? 24 : 16 }]}>
             
              <Text style={[styles.sectionLabel, isTablet && styles.sectionLabelTablet]}>
                படத்தொகுப்பு
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.galleryStrip,
                { paddingHorizontal: isTablet ? 24 : 16 },
              ]}
            >
              {gallery.map((img, index) => (
                <View key={index} style={[
                  styles.galleryCard,
                  isTablet && styles.galleryCardTablet,
                ]}>
                  <Image
                    source={{ uri: img }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                  {/* subtle index */}
                  <View style={styles.galleryIndexBadge}>
                  
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── VIDEO — full edge ── */}
        {videoId && (
          <View style={styles.videoSection}>
            <View style={[styles.sectionLabelRow,
              { paddingHorizontal: isTablet ? 24 : 16, marginBottom: 14 }]}>
             
              <Text style={[styles.sectionLabel, isTablet && styles.sectionLabelTablet]}>
                காணொளி
              </Text>
            </View>

            {/* Full-width video */}
            <View style={styles.videoWrapper}>
              <YoutubePlayer
                height={isTablet ? 360 : 220}
                width={width}
                play={false}
                videoId={videoId}
              />
            </View>

          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d4cea6" },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#d4cea6",
  },
  noDataText: { color: "#93210A", fontSize: 16, fontWeight: "600" },

  /* ── BANNER ── */
  bannerWrapper: {
    width: "100%",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: 330,
  },
  bannerImageTablet: {
    height: 500,
  },
  bannerPlaceholder: {
    width: "100%",
    height: 380,
    backgroundColor: "#301913",
  },

  /* top fade — keeps back button readable */
  bannerTopGrad: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    backgroundColor: "transparent",
    // simulate gradient with multiple layers via opacity
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    // React Native doesn't support linear-gradient natively without expo-linear-gradient.
    // We replicate with a semi-transparent dark layer:
    background: "linear-gradient(to bottom, rgba(48,25,19,0.72), transparent)",
  },

  /* bottom fade — title area */
  bannerBottomGrad: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(30,10,5,0.65)",
    // fades upward; we fake with a single semi-dark block
  },

  backButton: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(48,25,19,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25, left: 20 },

  bannerTitleRow: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  bannerTitleTablet: { fontSize: 30 },

  /* ── SECTION ── */
  section: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    elevation: 3,
    shadowColor: "#301913",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
  },
  sectionTablet: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 22,
  },

  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#93210A",
    letterSpacing: 0.2,
  },
  sectionLabelTablet: { fontSize: 19 },

  /* ── DESCRIPTION ── */
  description: {
    fontSize: 15,
    lineHeight: 25,
    color: "#3D2B1F",
    textAlign: "justify",
  },
  descriptionTablet: { fontSize: 17, lineHeight: 29 },

  readMoreBtn: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 14,
    backgroundColor: "#FFF0EE",
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: "rgba(147,33,10,0.25)",
  },
  readMoreText: {
    color: "#93210A",
    fontSize: 12,
    fontWeight: "700",
  },

  /* ── GALLERY ── */
  gallerySection: {
    marginTop: 24,
  },
  galleryCount: {
    fontSize: 11,
    color: "#93210A",
    fontWeight: "700",
    backgroundColor: "#FFF0EE",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(147,33,10,0.15)",
    overflow: "hidden",
  },
  galleryStrip: {
    gap: 12,
    paddingBottom: 6,
    paddingTop: 2,
  },
  galleryCard: {
    width: 160,
    height: 120,
    borderRadius: 14,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#301913",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    backgroundColor: "#301913",
    position: "relative",
  },
  galleryCardTablet: {
    width: 220,
    height: 160,
    borderRadius: 18,
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  galleryIndexBadge: {
    position: "absolute",
    bottom: 7,
    right: 8,
    backgroundColor: "rgba(48,25,19,0.7)",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryIndexText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },

  /* ── VIDEO ── */
  videoSection: {
    marginTop: 28,
  },
  videoWrapper: {
    width: "100%",
    backgroundColor: "#1a0a00",
    overflow: "hidden",
  },
  
});