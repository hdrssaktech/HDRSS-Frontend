import React, { useMemo, useRef, useState, useCallback } from "react";
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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function HistoryPage3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [playerError, setPlayerError] = useState(null);

  const getYoutubeId = (url) => {
    if (!url) return null;

    // direct 11-char id support
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

    // fallback for URLs with v= and other params
    const vMatch = url.match(/[?&]v=([\w-]{11})/i);
    return vMatch?.[1] || null;
  };

  const videoId = useMemo(() => getYoutubeId(data?.video), [data?.video]);

  const onStateChange = useCallback((state) => {
    if (state === "ended") setPlaying(false);
    if (state === "playing") setPlayerError(null);
  }, []);

  const onError = useCallback((e) => {
    setPlayerError(e);
    setPlaying(false);
  }, []);

  // ✅ Split description into paragraphs (by blank lines OR new lines)
  const paragraphs = useMemo(() => {
    const text = (data?.description || "").trim();
    if (!text) return [];
    const byBlankLines = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (byBlankLines.length >= 2) return byBlankLines;
    return text
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
  }, [data?.description]);

  const getGalleryCaption = (index) => {
    if (Array.isArray(data?.galleryTitles) && data.galleryTitles[index]) {
      return data.galleryTitles[index];
    }
    return `Image ${String(index + 1).padStart(2, "0")}`;
  };

  const mixedBlocks = useMemo(() => {
    const imgs = Array.isArray(data?.gallery) ? data.gallery : [];
    const blocks = [];
    let imgIndex = 0;

    for (let i = 0; i < paragraphs.length; i++) {
      blocks.push({ type: "text", value: paragraphs[i], key: `t-${i}` });

      const shouldInsertImage = (i + 1) % 2 === 0 && imgIndex < imgs.length;
      if (shouldInsertImage) {
        blocks.push({
          type: "image",
          value: imgs[imgIndex],
          caption: getGalleryCaption(imgIndex),
          key: `img-${imgIndex}`,
        });
        imgIndex += 1;
      }
    }
    while (imgIndex < imgs.length) {
      blocks.push({
        type: "image",
        value: imgs[imgIndex],
        caption: getGalleryCaption(imgIndex),
        key: `img-${imgIndex}`,
      });
      imgIndex += 1;
    }

    return blocks;
  }, [paragraphs, data?.gallery]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#8B3A2F" />

      {/* 🔴 HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>

        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} numberOfLines={1}>
          {data?.title || "History"}
        </Text>

        <View style={styles.headerSide} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* 🖼 BANNER */}
        {!!data?.bannerImage && (
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: data.bannerImage }}
              style={[styles.banner, { height: isTablet ? 500 : 285 }]}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay} />
          </View>
        )}

        {/* TITLE */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <View style={styles.titleContainer}>
            <View style={styles.titleLine} />
            <Text style={[styles.title, isTablet && styles.titleTablet]}>{data?.title}</Text>
            <View style={styles.titleLine} />
          </View>
        </View>

        {/* ✅ DESCRIPTION + IMAGES */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          {mixedBlocks.map((block) => {
            if (block.type === "text") {
              return (
                <View key={block.key} style={styles.textBlock}>
                  <Text style={[styles.description, isTablet && styles.descTablet]}>{block.value}</Text>
                </View>
              );
            }

            return (
              <View key={block.key} style={[styles.galleryCard, isTablet && styles.galleryCardTablet]}>
                <View style={styles.vintagePaper} />
                <View style={styles.topBorder}>
                  <View style={styles.borderPattern} />
                </View>

                <View style={styles.imageWrapper}>
                  <View style={styles.imageFrame}>
                    <Image
                      source={{ uri: block.value }}
                      style={[styles.galleryImage, isTablet && styles.galleryImageTablet]}
                      resizeMode="cover"
                    />
                    <View style={styles.vintageOverlay} />
                  </View>
                </View>

                <View style={styles.captionContainer}>
                  <View style={styles.captionLine} />
                  <View style={styles.captionWrapper}>
                    <Ionicons name="image-outline" size={16} color="#8B3A2F" />
                  </View>
                  <View style={styles.captionLine} />
                </View>

                <View style={styles.bottomBorder}>
                  <View style={styles.borderPattern} />
                </View>
              </View>
            );
          })}
        </View>

        {/* 🎥 VIDEO */}
        <View style={[styles.section, isTablet && styles.sectionTablet, styles.videoSection]}>
          <View style={styles.videoHeader}>
            <View style={styles.videoLine} />
            <Text style={[styles.blockTitle, isTablet && styles.blockTitleTablet]}>Historical Video</Text>
            <View style={styles.videoLine} />
          </View>

          {videoId ? (
            <View style={styles.videoContainer}>
              <View style={styles.videoFrame}>
                <YoutubePlayer
                  ref={playerRef}
                  height={(width * 18) / 30} // Increased height (changed from /16 to /14)
                  width={width - 40}
                  play={playing}
                  videoId={videoId}
                  onChangeState={onStateChange}
                  onError={onError}
                  onReady={() => setPlayerError(null)}
                  initialPlayerParams={{
                    playsInline: true,
                    controls: true,
                    modestbranding: true,
                    rel: false,
                    preventFullScreen: false,
                  }}
                  webViewProps={{
                    allowsInlineMediaPlayback: true,
                    mediaPlaybackRequiresUserAction: true,
                    androidLayerType: Platform.OS === "android" ? "hardware" : undefined,
                  }}
                />
                <View pointerEvents="none" style={styles.vintageOverlay} />
              </View>

              {playerError ? (
                <Text style={{ marginTop: 10, color: "#8B3A2F", fontStyle: "italic", textAlign: "center" }}>
                  Video not playable (maybe restricted). Try another video.
                </Text>
              ) : null}
            </View>
          ) : (
            <View style={styles.noVideoContainer}>
              <Ionicons name="videocam-outline" size={40} color="#8B3A2F" />
              <Text style={styles.noVideo}>No video available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const BORDER = "#8B3A2F";
const PAPER = "#FDF5E6";
const VINTAGE = "rgba(139, 58, 47, 0.03)";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PAPER },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop:40,
    paddingBottom:30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: { paddingTop: 60, paddingBottom: 30},
  headerSide: { width: 44, justifyContent: "center", alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  headerTitleTablet: { fontSize: 22 },

   backButton:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  backButtonTablet:{
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  scrollBody: { paddingBottom: 34, backgroundColor: PAPER },

  bannerContainer: {
    position: "relative",
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: BORDER,
  },
  banner: { width: "100%" },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: VINTAGE },

  section: { marginHorizontal: 16, marginTop: 8 },
  sectionTablet: { marginHorizontal: 40 },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  titleLine: { flex: 1, height: 2, backgroundColor: BORDER, opacity: 0.3 },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: BORDER,
    marginHorizontal: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  titleTablet: { fontSize: 23, marginHorizontal: 20 },

  textBlock: { marginBottom: 15, paddingHorizontal: 5 },
  description: {
    fontSize: 14,
    color: "#4A2C1A",
    textAlign: "justify",
    lineHeight: 21,
    fontFamily: "System",
    fontWeight: "400",
  },
  descTablet: { fontSize: 17, lineHeight: 26 },

  galleryCard: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#F5E6D3",
    borderRadius: 8,
    padding: 15,
    position: "relative",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#C4A484",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  galleryCardTablet: { width: "80%", padding: 20 },

  vintagePaper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F5E6D3",
    borderRadius: 8,
    opacity: 0.5,
  },

  topBorder: {
    position: "absolute",
    top: -1,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  bottomBorder: {
    position: "absolute",
    bottom: -1,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  borderPattern: { flex: 1, backgroundColor: BORDER, opacity: 0.2 },

  imageWrapper: {
    padding: 8,
    backgroundColor: "#E8D5B5",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#C4A484",
  },
  imageFrame: {
    borderWidth: 2,
    borderColor: "#B89B7A",
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  galleryImage: { width: "100%", height: 210 },
  galleryImageTablet: { height: 280 },
  vintageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(139, 58, 47, 0.02)" },

  captionContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  captionLine: { flex: 1, height: 1, backgroundColor: BORDER, opacity: 0.2 },
  captionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#E8D5B5",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#C4A484",
  },

  videoSection: { marginTop: 25 },
  videoHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  videoLine: { flex: 1, height: 2, backgroundColor: BORDER, opacity: 0.2 },
  blockTitle: { fontSize: 18, fontWeight: "800", color: BORDER, marginHorizontal: 15, letterSpacing: 1 },
  blockTitleTablet: { fontSize: 22, marginHorizontal: 20 },
 
  videoFrame: {
    overflow: "hidden",
    position: "relative",
    marginLeft:-12
  },
  noVideoContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#F5E6D3",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C4A484",
    borderStyle: "dashed",
  },
  noVideo: { marginTop: 10, color: "#8B3A2F", fontStyle: "italic", fontSize: 16 },
});