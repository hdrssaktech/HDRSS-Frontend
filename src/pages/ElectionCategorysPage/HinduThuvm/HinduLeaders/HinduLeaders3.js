import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

/* ✅ Extract YouTube ID (watch / short / embed) */
const getYouTubeId = (url) => {
  if (!url || typeof url !== "string") return "";

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
  );
  return match?.[1] || "";
};

export default function HinduLeaders3({ route, navigation }) {
  const { leader } = route.params;
  const { width, height } = useWindowDimensions();

  // ✅ Check for tablet
  const isTablet = useMemo(() => {
    return width >= 600 || (width > height && width >= 600);
  }, [width, height]);

  const gallery = useMemo(() => {
    if (!leader?.gallery) return [];
    return Array.isArray(leader.gallery) ? leader.gallery : [];
  }, [leader]);

  const bannerUri = leader?.bannerImage || leader?.image;

  // ✅ Youtube ID (react-native-youtube-iframe)
  const youtubeId = useMemo(() => getYouTubeId(leader?.video), [leader?.video]);
  const [playing, setPlaying] = useState(false);

  // ✅ ReadMore like your HistoryPage3 (length check)
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [lifeExpanded, setLifeExpanded] = useState(false);

  const aboutIsLong = (leader?.about?.length || 0) > 200;
  const lifeIsLong = (leader?.lifePath?.length || 0) > 200;

  const onStateChange = useCallback((state) => {
    if (state === "ended") setPlaying(false);
  }, []);

  // ✅ Responsive padding
  const CONTENT_PADDING = isTablet ? 24 : 16;
  const SECTION_PADDING = isTablet ? 18 : 14;
  
  // ✅ Responsive avatar size
  const avatarSize = isTablet ? 130 : 105;
  
  // ✅ Responsive font sizes
  const nameFontSize = isTablet ? 26 : 20;
  const sectionTitleFontSize = isTablet ? 17 : 15;
  const sectionTextFontSize = isTablet ? 15 : 14;

  return (
    <SafeAreaView style={[styles.safe, isTablet && styles.safeTablet]}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />

      {/* HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.headerBtn, isTablet && styles.headerBtnTablet]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="chevron-back" 
            size={isTablet ? 30 : 26} 
            color="#fff" 
          />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} numberOfLines={1}>
            {leader?.name || "Details"}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, isTablet && styles.scrollTablet]}
      >
        {/* BANNER */}
        <View style={[styles.bannerWrap, isTablet && styles.bannerWrapTablet]}>
          <Image source={{ uri: bannerUri }} style={styles.banner} resizeMode="cover" />
          <View style={styles.bannerOverlay} />
        </View>

        {/* CENTER PROFILE */}
        <View style={[styles.centerProfile, isTablet && styles.centerProfileTablet]}>
          <View style={[styles.avatarShadow, isTablet && styles.avatarShadowTablet]}>
            <Image 
              source={{ uri: leader?.image }} 
              style={[styles.avatar, { width: avatarSize, height: avatarSize }]} 
            />
          </View>

          <Text style={[styles.name, { fontSize: nameFontSize }, isTablet && styles.nameTablet]}>
            {leader?.name}
          </Text>

          {!!leader?.whoIs && (
            <Text style={[styles.whoIs, isTablet && styles.whoIsTablet]}>
              {leader?.whoIs}
            </Text>
          )}

          {!!leader?.oneLineIdentity && (
            <Text style={[styles.oneLine, isTablet && styles.oneLineTablet]} numberOfLines={3}>
              {leader?.oneLineIdentity}
            </Text>
          )}
        </View>

        {/* DETAILS CARD */}
        <View style={[
          styles.detailsCard, 
          isTablet && styles.detailsCardTablet,
          { marginHorizontal: CONTENT_PADDING }
        ]}>
          <View style={[styles.cardTopLine, isTablet && styles.cardTopLineTablet]} />

          {/* About */}
          {!!leader?.about && (
            <View style={[
              styles.sectionCard, 
              isTablet && styles.sectionCardTablet,
              { padding: SECTION_PADDING }
            ]}>
              <View style={styles.sectionHead}>
                <View style={[styles.iconPill, isTablet && styles.iconPillTablet]}>
                  <Ionicons 
                    name="information-circle-outline" 
                    size={isTablet ? 22 : 18} 
                    color="#8B0000" 
                  />
                </View>
                <Text style={[
                  styles.sectionTitle, 
                  { fontSize: sectionTitleFontSize },
                  isTablet && styles.sectionTitleTablet
                ]}>
                  பற்றி
                </Text>
              </View>

              <Text
                style={[
                  styles.sectionText, 
                  { fontSize: sectionTextFontSize },
                  isTablet && styles.sectionTextTablet
                ]}
                numberOfLines={aboutExpanded ? undefined : 6}
              >
                {leader.about}
              </Text>

              {aboutIsLong && (
                <TouchableOpacity
                  onPress={() => setAboutExpanded((p) => !p)}
                  activeOpacity={0.7}
                  style={styles.readMoreContainer}
                >
                  <Text style={[styles.readMore, isTablet && styles.readMoreTablet]}>
                    {aboutExpanded ? "Read Less" : "Read More"}
                  </Text>
                  <Ionicons
                    name={aboutExpanded ? "chevron-up" : "chevron-forward"}
                    size={isTablet ? 18 : 16}
                    color="#8B0000"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Life Path */}
          {!!leader?.lifePath && (
            <View style={[
              styles.sectionCard, 
              isTablet && styles.sectionCardTablet,
              { padding: SECTION_PADDING }
            ]}>
              <View style={styles.sectionHead}>
                <View style={[styles.iconPill, isTablet && styles.iconPillTablet]}>
                  <MaterialIcons 
                    name="history-edu" 
                    size={isTablet ? 22 : 18} 
                    color="#8B0000" 
                  />
                </View>
                <Text style={[
                  styles.sectionTitle, 
                  { fontSize: sectionTitleFontSize },
                  isTablet && styles.sectionTitleTablet
                ]}>
                  வாழ்க்கை பயணம்
                </Text>
              </View>

              <Text
                style={[
                  styles.sectionText, 
                  { fontSize: sectionTextFontSize },
                  isTablet && styles.sectionTextTablet
                ]}
                numberOfLines={lifeExpanded ? undefined : 6}
              >
                {leader.lifePath}
              </Text>

              {lifeIsLong && (
                <TouchableOpacity
                  onPress={() => setLifeExpanded((p) => !p)}
                  activeOpacity={0.7}
                  style={styles.readMoreContainer}
                >
                  <Text style={[styles.readMore, isTablet && styles.readMoreTablet]}>
                    {lifeExpanded ? "Read Less" : "Read More"}
                  </Text>
                  <Ionicons
                    name={lifeExpanded ? "chevron-up" : "chevron-forward"}
                    size={isTablet ? 18 : 16}
                    color="#8B0000"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <View style={[
              styles.sectionCard, 
              isTablet && styles.sectionCardTablet,
              { padding: SECTION_PADDING }
            ]}>
              <View style={styles.sectionHead}>
                <View style={[styles.iconPill, isTablet && styles.iconPillTablet]}>
                  <Ionicons 
                    name="images-outline" 
                    size={isTablet ? 22 : 18} 
                    color="#8B0000" 
                  />
                </View>
                <Text style={[
                  styles.sectionTitle, 
                  { fontSize: sectionTitleFontSize },
                  isTablet && styles.sectionTitleTablet
                ]}>
                  புகைப்பட கேலரி
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.galleryRow, isTablet && styles.galleryRowTablet]}
              >
                {gallery.map((imgUrl, idx) => (
                  <Image
                    key={`${imgUrl}-${idx}`}
                    source={{ uri: imgUrl }}
                    style={[
                      styles.galleryImg, 
                      isTablet && styles.galleryImgTablet,
                      { marginRight: isTablet ? 16 : 12 }
                    ]}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* VIDEO */}
          {youtubeId ? (
            <View style={[
              styles.sectionCard, 
              styles.videoCard,
              isTablet && styles.sectionCardTablet,
              { padding: SECTION_PADDING }
            ]}>
              <View style={styles.sectionHead}>
                <View style={[styles.iconPill, styles.youtubePill, isTablet && styles.iconPillTablet]}>
                  <Ionicons 
                    name="logo-youtube" 
                    size={isTablet ? 22 : 18} 
                    color="#fff" 
                  />
                </View>
                <Text style={[
                  styles.sectionTitle, 
                  { fontSize: sectionTitleFontSize },
                  isTablet && styles.sectionTitleTablet
                ]}>
                  காணொளி
                </Text>
              </View>

              <View style={styles.videoBox}>
                <YoutubePlayer
                  height={Math.round((width - CONTENT_PADDING * 2) * 0.56)} // 16:9
                  width={width - CONTENT_PADDING * 2}
                  play={playing}
                  videoId={youtubeId}
                  onChangeState={onStateChange}
                />
              </View>
            </View>
          ) : null}
        </View>

        <View style={{ height: isTablet ? 40 : 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F5F2" },
  safeTablet: { backgroundColor: "#FFFFFF" },

  // Header
  header: {
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: Platform.OS === "ios" ? 10 : 40,
    paddingBottom: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerTablet: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 15 : 45,
    paddingBottom: 15,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtnTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitleWrap: { flex: 1, alignItems: "center", paddingHorizontal: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900", marginRight: 50 },
  headerTitleTablet: { fontSize: 24, fontWeight: "900" },

  scroll: { paddingBottom: 10 },
  scrollTablet: { paddingBottom: 20 },

  // Banner
  bannerWrap: { height: 230, width: "100%", position: "relative" },
  bannerWrapTablet: { height: 280 },
  banner: { width: "100%", height: "90%" },
  bannerOverlay: { position: "absolute", height: 100 },

  // Center Profile
  centerProfile: {
    marginTop: -90,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  centerProfileTablet: {
    marginTop: -110,
    paddingHorizontal: 24,
  },
  avatarShadow: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 4,
    elevation: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
  },
  avatarShadowTablet: {
    borderRadius: 28,
    padding: 6,
    elevation: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  avatar: { borderRadius: 18 },

  name: {
    marginTop: 10,
    fontWeight: "900",
    color: "#1a1a1a",
    textAlign: "center",
  },
  nameTablet: { marginTop: 14 },
  whoIs: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    color: "#8B0000",
    textAlign: "center",
  },
  whoIsTablet: { fontSize: 16, marginTop: 6 },
  oneLine: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
    lineHeight: 18,
  },
  oneLineTablet: { fontSize: 15, lineHeight: 20, marginTop: 8 },

  // Details Card
  detailsCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
  },
  detailsCardTablet: {
    borderRadius: 24,
    padding: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  cardTopLine: {
    height: 4,
    borderRadius: 99,
    backgroundColor: "#8B0000",
    width: 64,
    alignSelf: "center",
    marginBottom: 12,
    opacity: 0.9,
  },
  cardTopLineTablet: {
    height: 5,
    width: 80,
    marginBottom: 16,
  },

  // Section Card
  sectionCard: {
    backgroundColor: "#FAF7F5",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1E6E2",
  },
  sectionCardTablet: {
    borderRadius: 18,
    marginBottom: 16,
  },
  sectionHead: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconPill: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(139,0,0,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconPillTablet: {
    width: 36,
    height: 36,
    borderRadius: 12,
    marginRight: 12,
  },
  youtubePill: { backgroundColor: "#8B0000" },

  sectionTitle: { fontWeight: "900", color: "#1a1a1a" },
  sectionTitleTablet: { fontWeight: "900" },
  sectionText: {
    fontWeight: "500",
    color: "#444",
    lineHeight: 22,
    textAlign: "justify",
  },
  sectionTextTablet: { lineHeight: 24 },

  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 6,
    alignSelf: "flex-end",
  },
  readMore: {
    color: "#8B0000",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
  },
  readMoreTablet: { fontSize: 14 },

  // Gallery
  galleryRow: { paddingRight: 8 },
  galleryRowTablet: { paddingRight: 12 },
  galleryImg: {
    width: 150,
    height: 110,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
  },
  galleryImgTablet: {
    width: 180,
    height: 130,
    borderRadius: 16,
  },

  videoCard: { paddingBottom: 12 },
  videoBox: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
  },
});