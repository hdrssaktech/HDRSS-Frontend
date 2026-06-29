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
import Hyperlink from 'react-native-hyperlink';

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
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      {/* HEADER */}
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
        {/* BANNER */}
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

        {/* DESCRIPTION + IMAGES */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          {mixedBlocks.map((block) => {
            if (block.type === "text") {
              return (
                <View key={block.key} style={styles.textBlock}>
                  <Hyperlink 
                    linkDefault={true} 
                    linkStyle={{ color: '#93210A', textDecorationLine: 'underline' }}
                  >
                    <Text style={[styles.description, isTablet && styles.descTablet]}>{block.value}</Text>
                  </Hyperlink>
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
                    <Ionicons name="image-outline" size={16} color="#93210A" />
                    <Text style={styles.captionText}>{block.caption}</Text>
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

        {/* VIDEO - FULL WIDTH WITH TAMIL */}
        <View style={styles.videoSection}>
          <View style={styles.videoHeader}>
            <View style={styles.videoLine} />
            <View style={styles.videoTitleContainer}>
              
              <Text style={[styles.blockTitle, isTablet && styles.blockTitleTablet]}>
                வரலாற்று காணொளி
              </Text>
            
            </View>
            <View style={styles.videoLine} />
          </View>

          {videoId ? (
            <View style={styles.videoContainer}>
              <View style={styles.videoFrame}>
                <YoutubePlayer
                  ref={playerRef}
                  height={(width * 9) / 16} // 16:9 aspect ratio for full width
                  width={width}
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
                {!playing && (
                  <TouchableOpacity
                    style={styles.videoPlayOverlay}
                    onPress={() => setPlaying(true)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.videoPlayButton}>
                      <Ionicons name="play" size={isTablet ? 50 : 40} color="#fff" />
                    </View>
                    <Text style={styles.videoPlayText}>காணொளியை இயக்கவும்</Text>
                  </TouchableOpacity>
                )}
              </View>

              {playerError ? (
                <View style={styles.videoErrorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#93210A" />
                  <Text style={styles.videoErrorText}>
                    காணொளி இயக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.noVideoContainer}>
              <Ionicons name="videocam-off-outline" size={50} color="#93210A" />
              <Text style={styles.noVideo}>காணொளி கிடைக்கவில்லை</Text>
              <Text style={styles.noVideoSubtext}>No video available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const BORDER = "#93210A";
const PAPER = "#d4cea6";
const VINTAGE = "rgba(147, 33, 10, 0.03)";

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#d4cea6" 
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
    paddingHorizontal: 18,
  },
  headerSide: { 
    width: 44, 
    justifyContent: "center", 
    alignItems: "flex-start" 
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  headerTitleTablet: { fontSize: 22 },

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

  scrollBody: { 
    paddingBottom: 34, 
    backgroundColor: "#d4cea6" 
  },

  bannerContainer: {
    position: "relative",
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: BORDER,
  },
  banner: { width: "100%" },
  bannerOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: VINTAGE 
  },

  section: { 
    marginHorizontal: 16, 
    marginTop: 8 
  },
  sectionTablet: { 
    marginHorizontal: 40 
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  titleLine: { 
    flex: 1, 
    height: 2, 
    backgroundColor: BORDER, 
    opacity: 0.3 
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: BORDER,
    marginHorizontal: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  titleTablet: { 
    fontSize: 23, 
    marginHorizontal: 20 
  },

  textBlock: { 
    marginBottom: 15, 
    paddingHorizontal: 5,
    backgroundColor: "rgba(255,255,255,0.4)",
    padding: 12,
    borderRadius: 8,
  },
  description: {
    fontSize: 14,
    color: "#4A2C1A",
    textAlign: "justify",
    lineHeight: 21,
    fontFamily: "System",
    fontWeight: "400",
  },
  descTablet: { 
    fontSize: 17, 
    lineHeight: 26 
  },

  galleryCard: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
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
  galleryCardTablet: { 
    width: "80%", 
    padding: 20 
  },

  vintagePaper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.3)",
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
  borderPattern: { 
    flex: 1, 
    backgroundColor: BORDER, 
    opacity: 0.2 
  },

  imageWrapper: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
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
  galleryImage: { 
    width: "100%", 
    height: 210 
  },
  galleryImageTablet: { 
    height: 280 
  },
  vintageOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: "rgba(147, 33, 10, 0.02)" 
  },

  captionContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  captionLine: { 
    flex: 1, 
    height: 1, 
    backgroundColor: BORDER, 
    opacity: 0.2 
  },
  captionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#C4A484",
  },
  captionText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#4A2C1A",
    fontWeight: "600",
  },

  /* VIDEO SECTION - FULL WIDTH */
  videoSection: { 
    marginTop: 20,
    marginHorizontal: 0,
  },
  videoHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  videoLine: { 
    flex: 1, 
    height: 2, 
    backgroundColor: BORDER, 
    opacity: 0.2 
  },
  videoTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 15,
  },
  blockTitle: { 
    fontSize: 16, 
    fontWeight: "800", 
    color: BORDER, 
    letterSpacing: 0.5,
  },
  blockTitleTablet: { 
    fontSize: 22, 
  },

  videoContainer: {
    backgroundColor: "#000",
    position: "relative",
  },
  videoFrame: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    position: "relative",
  },
  videoPlayOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoPlayButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(147, 33, 10, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  videoPlayText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  videoErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    marginTop: 8,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  videoErrorText: {
    color: "#93210A",
    fontSize: 13,
    fontStyle: "italic",
  },

  noVideoContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#C4A484",
    borderStyle: "dashed",
    marginHorizontal: 16,
  },
  noVideo: { 
    marginTop: 12, 
    color: "#93210A", 
    fontSize: 18, 
    fontWeight: "700",
  },
  noVideoSubtext: {
    marginTop: 4,
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
});