import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinearGradient } from "expo-linear-gradient";

export default function DivinePage3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [playerError, setPlayerError] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const getYoutubeId = (url) => {
    if (!url) return null;
    if (/^[\w-]{11}$/.test(url)) return url;

    const patterns = [
      /youtu\.be\/([\w-]{11})/i,
      /youtube\.com\/watch\?v=([\w-]{11})/i,
      /youtube\.com\/embed\/([\w-]{11})/i,
      /youtube\.com\/shorts\/([\w-]{11})/i,
      /youtube\.com\/v\/([\w-]{11})/i,
    ];

    for (const p of patterns) {
      const m = url.match(p);
      if (m?.[1]) return m[1];
    }

    const vMatch = url.match(/[?&]v=([\w-]{11})/i);
    return vMatch?.[1] || null;
  };

  const videoId = useMemo(() => getYoutubeId(data?.video), [data?.video]);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const onError = useCallback((e) => {
    console.log("Player error:", e);
    setPlayerError(e);
    setPlaying(false);
  }, []);

  const onReady = useCallback(() => {
    setPlayerError(null);
  }, []);

  const fullText = useMemo(() => {
    return (data?.description || "").trim();
  }, [data?.description]);

  const paragraphs = useMemo(() => {
    if (!fullText) return [];

    if (isExpanded) {
      const byBlankLine = fullText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (byBlankLine.length > 1) return byBlankLine;

      return fullText
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);
    } else {
      const previewText =
        fullText.length > 150 ? fullText.substring(0, 150) + "..." : fullText;
      return [previewText];
    }
  }, [fullText, isExpanded]);

  useEffect(() => {
    setShowReadMore(fullText.length > 150);
  }, [fullText]);

  const galleryImages = useMemo(() => {
    return Array.isArray(data?.gallery) ? data.gallery : [];
  }, [data?.gallery]);

  const getGalleryCaption = (index) => {
    if (Array.isArray(data?.galleryTitles) && data.galleryTitles[index]) {
      return data.galleryTitles[index];
    }
    return `Image ${String(index + 1).padStart(2, "0")}`;
  };

  const renderGalleryItem = ({ item, index }) => (
    <TouchableOpacity style={styles.galleryItem} activeOpacity={0.8}>
      <Image
        source={{ uri: item }}
        style={[styles.galleryImage, isTablet && styles.galleryImageTablet]}
        resizeMode="cover"
      />
      <Text style={styles.galleryItemCaption} numberOfLines={1}>
        {getGalleryCaption(index)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#8B3A2F" />

      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
          numberOfLines={1}
        >
          {data?.title || "History"}
        </Text>

        <View style={styles.headerSide} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Image */}
        {!!data?.bannerImage && (
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: data.bannerImage }}
              style={[styles.banner, { height: isTablet ? 450 : 280 }]}
              resizeMode="cover"
            />
            <LinearGradient
              colors={[
                "transparent",
                "rgba(139, 58, 47, 0.3)",
                "rgba(109, 46, 38, 0.7)",
              ]}
              style={styles.bannerGradient}
            />
            <View style={styles.omSymbolContainer}>
              <Text style={styles.omSymbol}>🕉️</Text>
            </View>
          </View>
        )}

        {/* Title Card */}
        <View style={[styles.titleCard, isTablet && styles.titleCardTablet]}>
          <View style={styles.titleDecoration}>
            <View style={styles.titleLineLeft} />
            <Ionicons name="leaf" size={24} color="#DAA520" />
            <View style={styles.titleLineRight} />
          </View>

          <Text style={[styles.title, isTablet && styles.titleTablet]}>
            {data?.title}
          </Text>

          {data?.subtitle ? (
            <Text style={[styles.subtitle, isTablet && styles.subtitleTablet]}>
              {data?.subtitle}
            </Text>
          ) : null}
        </View>

        {/* Video Section */}
        <View style={[styles.videoSection, isTablet && styles.videoSectionTablet]}>
          <View style={styles.videoHeader}>
            <LinearGradient
              colors={["#DAA520", "#B8860B"]}
              style={styles.videoHeaderIcon}
            >
              <Ionicons name="videocam" size={20} color="#fff" />
            </LinearGradient>
            <Text style={styles.videoHeaderText}>Video</Text>
          </View>

          {videoId ? (
            <View style={styles.videoContainer}>
              <YoutubePlayer
                ref={playerRef}
                height={(width - (isTablet ? 80 : 32)) * 0.5625}
                width={width - (isTablet ? 80 : 32)}
                play={playing}
                videoId={videoId}
                onChangeState={onStateChange}
                onError={onError}
                onReady={onReady}
                initialPlayerParams={{
                  playsInline: true,
                  controls: true,
                  modestbranding: true,
                  rel: false,
                  showinfo: 1,
                }}
              />
            </View>
          ) : (
            <View style={styles.noVideoContainer}>
              <Ionicons name="videocam-outline" size={36} color="#8B3A2F" />
              <Text style={styles.noVideoText}>No video available</Text>
            </View>
          )}

          {playerError && (
            <Text style={styles.errorText}>
              Unable to play video. Please try again.
            </Text>
          )}
        </View>

        {/* Description */}
        {fullText.length > 0 && (
          <View
            style={[
              styles.descriptionSection,
              isTablet && styles.descriptionSectionTablet,
            ]}
          >
            <View style={styles.descriptionHeader}>
              <View style={styles.descriptionLine} />
              <Text style={styles.descriptionTitle}>Lines</Text>
              <View style={styles.descriptionLine} />
            </View>

            {paragraphs.map((paragraph, index) => (
              <Text
                key={`p-${index}`}
                style={[styles.description, isTablet && styles.descTablet]}
              >
                {paragraph}
              </Text>
            ))}

            {showReadMore && (
              <TouchableOpacity
                style={styles.readMoreButton}
                onPress={() => setIsExpanded(!isExpanded)}
              >
                <Text style={styles.readMoreText}>
                  {isExpanded ? "Read Less" : "Read More"}
                </Text>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#8B3A2F"
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <View style={[styles.gallerySection, isTablet && styles.gallerySectionTablet]}>
            <View style={styles.galleryHeader}>
              <View style={styles.galleryLine} />
              <Text style={[styles.galleryTitle, isTablet && styles.galleryTitleTablet]}>
                Gallery
              </Text>
              <View style={styles.galleryLine} />
            </View>

            <FlatList
              data={galleryImages}
              renderItem={renderGalleryItem}
              keyExtractor={(item, index) => `gallery-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryList}
            />
          </View>
        )}

        <View style={styles.bottomPadding}>
          <Text style={styles.omFooter}>ॐ</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FDF5E6",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerSide: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  headerTitleTablet: {
    fontSize: 22,
  },

  bannerContainer: {
    width: "100%",
    backgroundColor: "#000",
    position: "relative",
  },
  banner: {
    width: "100%",
  },
  bannerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  omSymbolContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255,215,0,0.2)",
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  omSymbol: {
    fontSize: 24,
    color: "#FFD700",
  },

  titleCard: {
    backgroundColor: "#FFF8E7",
    marginHorizontal: 16,
    marginTop: -30,
    padding: 16,
    borderRadius: 15,
    shadowColor: "#8B3A2F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DAA520",
  },
  titleCardTablet: {
    marginHorizontal: 40,
    marginTop: -40,
    padding: 30,
  },
  titleDecoration: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  titleLineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: "#DAA520",
    marginRight: 10,
  },
  titleLineRight: {
    flex: 1,
    height: 1,
    backgroundColor: "#DAA520",
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8B3A2F",
    marginBottom: 8,
    textAlign: "center",
  },
  titleTablet: {
    fontSize: 36,
  },
  subtitle: {
    fontSize: 16,
    color: "#B8860B",
    textAlign: "center",
    fontStyle: "italic",
  },
  subtitleTablet: {
    fontSize: 18,
  },

  videoSection: {
    marginHorizontal: 16,
    marginBottom: 25,
  },
  videoSectionTablet: {
    marginHorizontal: 40,
    marginBottom: 35,
  },
  videoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  videoHeaderIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  videoHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B3A2F",
  },
  videoContainer: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  noVideoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    borderRadius: 15,
    backgroundColor: "#FFF8E7",
    borderWidth: 1,
    borderColor: "#DAA520",
  },
  noVideoText: {
    marginTop: 10,
    fontSize: 15,
    color: "#8B3A2F",
    fontWeight: "600",
  },
  errorText: {
    marginTop: 10,
    color: "#FF6B6B",
    fontSize: 14,
    textAlign: "center",
  },

  descriptionSection: {
    marginHorizontal: 16,
    marginBottom: 25,
    backgroundColor: "#FFF8E7",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#DAA520",
  },
  descriptionSectionTablet: {
    marginHorizontal: 40,
    marginBottom: 35,
    padding: 30,
  },
  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  descriptionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DAA520",
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8B3A2F",
    marginHorizontal: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4A1F1A",
    marginBottom: 16,
    textAlign: "justify",
  },
  descTablet: {
    fontSize: 18,
    lineHeight: 28,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#FDF5E6",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DAA520",
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B3A2F",
    marginRight: 4,
  },

  gallerySection: {
    marginHorizontal: 16,
    marginBottom: 25,
  },
  gallerySectionTablet: {
    marginHorizontal: 40,
    marginBottom: 35,
  },
  galleryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  galleryLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DAA520",
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#8B3A2F",
    marginHorizontal: 15,
  },
  galleryTitleTablet: {
    fontSize: 24,
  },
  galleryList: {
    paddingRight: 16,
  },
  galleryItem: {
    marginRight: 16,
    width: 150,
  },
  galleryImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#DAA520",
  },
  galleryImageTablet: {
    width: 200,
    height: 200,
  },
  galleryItemCaption: {
    marginTop: 8,
    fontSize: 14,
    color: "#8B3A2F",
    fontWeight: "500",
    textAlign: "center",
  },

  bottomPadding: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  omFooter: {
    fontSize: 30,
    color: "#DAA520",
    opacity: 0.5,
  },
});