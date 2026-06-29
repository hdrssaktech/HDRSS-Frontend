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
import { LinearGradient } from "expo-linear-gradient";

const C = {
  primary:     "#93210A",
  primaryDark: "#301913",
  gold:        "#D4AF37",
  bg:          "#d4cea6",
  white:       "#FFFFFF",
  text:        "#1a0a00",
  textSub:     "#5a3a2a",
  border:      "rgba(48,25,19,0.3)",  // ← brown border
  card:        "#ede8d5",
};

const VaasthuPage3 = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;

  const [playing,       setPlaying]       = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showFullDesc,  setShowFullDesc]  = useState(false);

  const getYoutubeId = (url) => {
    if (!url) return null;
    const reg =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(reg);
    return match ? match[1] : null;
  };

  const videoId     = getYoutubeId(item.video);
  const screenWidth = Dimensions.get("window").width;
  const videoHeight = isTablet
    ? Math.min(screenWidth * 0.56, 400)
    : screenWidth * 0.5625;

  const contentPad = isTablet ? 28 : 16;

  // ── Section Header (no left line, just plain title) ──────────
  const SectionHeader = ({ label }) => (
    <View style={s.sectionHeader}>
      <Text style={[s.sectionTitle, isTablet && s.sectionTitleTablet]}>
        {label}
      </Text>
    </View>
  );

  // ── Text Block ───────────────────────────────────────────────
  const TextBlock = ({ text, expanded, onToggle }) => {
    if (!text) return null;
    return (
      <View style={s.textCard}>
        <View style={s.textCardStrip} />
        <Text
          style={[s.bodyText, isTablet && s.bodyTextTablet]}
          numberOfLines={expanded ? undefined : 6}
        >
          {text}
        </Text>
        <TouchableOpacity
          style={s.readMoreBtn}
          onPress={onToggle}
          activeOpacity={0.8}
        >
          <Text style={[s.readMoreText, isTablet && s.readMoreTextTablet]}>
            {expanded ? "Show Less" : "Read More"}
          </Text>
          <View style={s.readMoreChevron}>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={12}
              color={C.white}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={s.screen}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* ── HEADER ── */}
      <View style={[s.header, isTablet && s.headerTablet]}>
        <TouchableOpacity
          style={[s.backBtn, isTablet && s.backBtnTablet]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color={C.white} />
        </TouchableOpacity>

        <Text
          style={[s.headerTitle, isTablet && s.headerTitleTablet]}
          numberOfLines={1}
        >
          {item.title}
        </Text>

        <View style={[s.headerSpacer, isTablet && s.headerSpacerTablet]} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={s.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
      >

        {/* ── BANNER ── */}
        <View style={s.bannerWrap}>
          <Image
            source={{ uri: item.bannerImage }}
            style={[s.banner, { height: isTablet ? 320 : 220 }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(48,25,19,0.55)", "rgba(48,25,19,0.92)"]}
            locations={[0.35, 0.72, 1]}
            style={s.bannerGradient}
          />
          <View style={[s.bannerTitleWrap, { paddingHorizontal: contentPad }]}>
            <View style={s.bannerGoldLine} />
            <Text
              style={[s.bannerTitle, isTablet && s.bannerTitleTablet]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </View>
        </View>

        {/* ── CONTENT ── */}
        <View style={[s.content, { paddingHorizontal: contentPad }]}>

          {/* ── ABOUT ── */}
          {!!item.about && (
            <View style={s.section}>
              <SectionHeader label="About" />
              <TextBlock
                text={item.about}
                expanded={showFullAbout}
                onToggle={() => setShowFullAbout((v) => !v)}
              />
            </View>
          )}

          {/* ── VIDEO ── */}
          {!!videoId && (
            <View style={s.section}>
              <SectionHeader label="Video" />
              <View style={s.videoCard}>
                <LinearGradient
                  colors={[C.gold, "#b8940f"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={s.videoTopBar}
                />
                <View style={[s.videoInner, { height: videoHeight }]}>
                  <YoutubePlayer
                    height={videoHeight}
                    width={width - contentPad * 2}
                    videoId={videoId}
                    play={playing}
                    onChangeState={(state) => {
                      if (state === "ended") setPlaying(false);
                    }}
                    initialPlayerParams={{
                      playsInline: true,
                      controls: true,
                      modestbranding: true,
                      rel: false,
                    }}
                  />
                </View>
              </View>
            </View>
          )}

          {/* ── GALLERY (no badges) ── */}
          {!!item.gallery && item.gallery.length > 0 && (
            <View style={s.section}>
              <SectionHeader label="Gallery" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.galleryScroll}
              >
                {item.gallery.map((img, i) => (
                  <View key={i} style={s.galleryItemWrap}>
                    <Image
                      source={{ uri: img }}
                      style={[
                        s.galleryImage,
                        isTablet && s.galleryImageTablet,
                      ]}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(48,25,19,0.4)"]}
                      style={s.galleryOverlay}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── DESCRIPTION ── */}
          {!!item.description && (
            <View style={s.section}>
              <SectionHeader label="Description" />
              <TextBlock
                text={item.description}
                expanded={showFullDesc}
                onToggle={() => setShowFullDesc((v) => !v)}
              />
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
};

export default VaasthuPage3;

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },

  /* ── HEADER ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: "#301913",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerTablet: {
    paddingTop: 56,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnTablet:      { width: 50, height: 50, borderRadius: 25 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: C.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginHorizontal: 8,
  },
  headerTitleTablet:  { fontSize: 24 },
  headerSpacer:       { width: 40 },
  headerSpacerTablet: { width: 50 },

  /* ── BANNER ── */
  bannerWrap:  { width: "100%", position: "relative" },
  banner:      { width: "100%" },
  bannerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "65%",
  },
  bannerTitleWrap: {
    position: "absolute",
    bottom: 18,
    left: 0,
    right: 0,
  },
  bannerGoldLine: {
    width: 36,
    height: 3,
    backgroundColor: C.gold,
    borderRadius: 2,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: C.white,
    letterSpacing: 0.3,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerTitleTablet: { fontSize: 28 },

  /* ── CONTENT ── */
  content: { paddingTop: 20 },
  section: { marginBottom: 24 },

  /* ── SECTION HEADER (plain title only, no left line) ── */
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#301913",
    letterSpacing: 0.4,
  },
  sectionTitleTablet: { fontSize: 21 },

  /* ── TEXT CARD (brown border) ── */
  textCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#301913",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(48,25,19,0.3)",  // ← brown
  },
  textCardStrip: {
    height: 4,
    backgroundColor: C.gold,
    width: "100%",
    marginBottom: 14,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 25,
    color: C.text,
    textAlign: "justify",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  bodyTextTablet: { fontSize: 17, lineHeight: 29 },
  readMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 6,
    margin: 14,
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#93210A",
    borderRadius: 20,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.white,
    letterSpacing: 0.4,
  },
  readMoreTextTablet: { fontSize: 14 },
  readMoreChevron: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── VIDEO CARD (brown border) ── */
  videoCard: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(48,25,19,0.5)",  // ← brown
  },
  videoTopBar: { height: 5, width: "100%" },
  videoInner:  { width: "100%", backgroundColor: "#000" },

  /* ── GALLERY (no badge, brown border) ── */
  galleryScroll: { paddingVertical: 4, paddingRight: 4 },
  galleryItemWrap: {
    marginRight: 14,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(48,25,19,0.4)",  // ← brown
    elevation: 4,
    shadowColor: "#301913",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: "relative",
  },
  galleryImage: {
    width: 160,
    height: 120,
    backgroundColor: "#d4cea6",
  },
  galleryImageTablet: {
    width: 220,
    height: 165,
  },
  galleryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },

 
});