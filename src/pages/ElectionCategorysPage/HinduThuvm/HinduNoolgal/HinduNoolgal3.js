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
import Hyperlink from 'react-native-hyperlink';

/* ✅ Extract YouTube ID (watch / short / embed) */
const getYouTubeId = (url) => {
  if (!url || typeof url !== "string") return "";

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
  );
  return match?.[1] || "";
};

export default function HinduNoolgal3({ route, navigation }) {
  const { nool, categoryName } = route.params || {};
  const { width, height } = useWindowDimensions();

  // ✅ Check for tablet
  const isTablet = useMemo(() => {
    return width >= 600 || (width > height && width >= 600);
  }, [width, height]);

  const gallery = useMemo(() => {
    if (!nool?.gallery) return [];
    return Array.isArray(nool.gallery) ? nool.gallery : [];
  }, [nool]);

  const bannerUri = nool?.bannerImage || gallery?.[0] || nool?.image;

  // ✅ Youtube ID (react-native-youtube-iframe)
  const youtubeId = useMemo(() => getYouTubeId(nool?.video), [nool?.video]);
  const [playing, setPlaying] = useState(false);

  // ✅ ReadMore states
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [athikaramExpanded, setAthikaramExpanded] = useState(false);
  const [meaningExpanded, setMeaningExpanded] = useState(false);
  const [padalExpanded, setPadalExpanded] = useState(false);

  const aboutIsLong = (nool?.about?.length || 0) > 200;
  const athikaramIsLong = (nool?.athikaram?.length || 0) > 200;
  const meaningIsLong = (nool?.meaningOfLife?.length || 0) > 200;
  const padalIsLong = (nool?.padal?.length || 0) > 200;

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
            {nool?.noolname || "நூல் விவரம்"}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, isTablet && styles.scrollTablet]}
      >
        {/* BANNER */}
        <View style={[styles.bannerWrap, isTablet && styles.bannerWrapTablet]}>
          {bannerUri ? (
            <Image source={{ uri: bannerUri }} style={styles.banner} resizeMode="cover" />
          ) : (
            <View style={[styles.banner, { backgroundColor: "#ddd" }]} />
          )}
          <View style={styles.bannerOverlay} />
          
          {/* {categoryName && (
            <View style={[styles.categoryChip, isTablet && styles.categoryChipTablet]}>
              <Text style={[styles.categoryChipText, isTablet && styles.categoryChipTextTablet]}>
                {categoryName}
              </Text>
            </View>
          )} */}
        </View>

        {/* CENTER PROFILE */}
        <View style={[styles.centerProfile, isTablet && styles.centerProfileTablet]}>
          <View style={[styles.avatarShadow, isTablet && styles.avatarShadowTablet]}>
            <Image 
              source={{ uri: nool?.image || bannerUri }} 
              style={[styles.avatar, { width: avatarSize, height: avatarSize }]} 
            />
          </View>

          <Text style={[styles.name, { fontSize: nameFontSize }, isTablet && styles.nameTablet]}>
            {nool?.noolname || "நூல்"}
          </Text>

          {!!nool?.author && (
            <Text style={[styles.whoIs, isTablet && styles.whoIsTablet]}>
              ஆசிரியர்: {nool.author}
            </Text>
          )}

          {!!nool?.birth && (
            <Text style={[styles.oneLine, isTablet && styles.oneLineTablet]} numberOfLines={3}>
              காலம்: {nool.birth}
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
          {!!nool?.about && (
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
                {nool.about}
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

          {/* Athikaram */}
          {!!nool?.athikaram && (
            <View style={[
              styles.sectionCard, 
              isTablet && styles.sectionCardTablet,
              { padding: SECTION_PADDING }
            ]}>
              <View style={styles.sectionHead}>
                <View style={[styles.iconPill, isTablet && styles.iconPillTablet]}>
                  <MaterialIcons 
                    name="menu-book" 
                    size={isTablet ? 22 : 18} 
                    color="#8B0000" 
                  />
                </View>
                <Text style={[
                  styles.sectionTitle, 
                  { fontSize: sectionTitleFontSize },
                  isTablet && styles.sectionTitleTablet
                ]}>
                  அதிகாரம்
                </Text>
              </View>

              <Text
                style={[
                  styles.sectionText, 
                  { fontSize: sectionTextFontSize },
                  isTablet && styles.sectionTextTablet
                ]}
                numberOfLines={athikaramExpanded ? undefined : 6}
              >
                {nool.athikaram}
              </Text>

              {athikaramIsLong && (
                <TouchableOpacity
                  onPress={() => setAthikaramExpanded((p) => !p)}
                  activeOpacity={0.7}
                  style={styles.readMoreContainer}
                >
                  <Text style={[styles.readMore, isTablet && styles.readMoreTablet]}>
                    {athikaramExpanded ? "Read Less" : "Read More"}
                  </Text>
                  <Ionicons
                    name={athikaramExpanded ? "chevron-up" : "chevron-forward"}
                    size={isTablet ? 18 : 16}
                    color="#8B0000"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Meaning of Life */}
          {!!nool?.meaningOfLife && (
            <View style={[
              styles.sectionCard, 
              isTablet && styles.sectionCardTablet,
              { padding: SECTION_PADDING }
            ]}>
              <View style={styles.sectionHead}>
                <View style={[styles.iconPill, isTablet && styles.iconPillTablet]}>
                  <MaterialIcons 
                    name="emoji-objects" 
                    size={isTablet ? 22 : 18} 
                    color="#8B0000" 
                  />
                </View>
                <Text style={[
                  styles.sectionTitle, 
                  { fontSize: sectionTitleFontSize },
                  isTablet && styles.sectionTitleTablet
                ]}>
                  வாழ்க்கை அர்த்தம்
                </Text>
              </View>

              <Text
                style={[
                  styles.sectionText, 
                  { fontSize: sectionTextFontSize },
                  isTablet && styles.sectionTextTablet
                ]}
                numberOfLines={meaningExpanded ? undefined : 6}
              >
                {nool.meaningOfLife}
              </Text>

              {meaningIsLong && (
                <TouchableOpacity
                  onPress={() => setMeaningExpanded((p) => !p)}
                  activeOpacity={0.7}
                  style={styles.readMoreContainer}
                >
                  <Text style={[styles.readMore, isTablet && styles.readMoreTablet]}>
                    {meaningExpanded ? "Read Less" : "Read More"}
                  </Text>
                  <Ionicons
                    name={meaningExpanded ? "chevron-up" : "chevron-forward"}
                    size={isTablet ? 18 : 16}
                    color="#8B0000"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Padal (Quote) */}
          {!!nool?.padal && (
            <View style={[
              styles.sectionCard, 
              isTablet && styles.sectionCardTablet,
              { padding: SECTION_PADDING }
            ]}>
              <View style={styles.sectionHead}>
                <View style={[styles.iconPill, isTablet && styles.iconPillTablet]}>
                  <MaterialIcons 
                    name="format-quote" 
                    size={isTablet ? 22 : 18} 
                    color="#8B0000" 
                  />
                </View>
                <Text style={[
                  styles.sectionTitle, 
                  { fontSize: sectionTitleFontSize },
                  isTablet && styles.sectionTitleTablet
                ]}>
                  பாடல்
                </Text>
              </View>

              <View style={[styles.quoteBox, isTablet && styles.quoteBoxTablet]}>
                <Ionicons 
                  name="musical-note" 
                  size={isTablet ? 22 : 18} 
                  color="#8B0000" 
                  style={[styles.quoteIcon, isTablet && styles.quoteIconTablet]} 
                />
               <Hyperlink 
                linkDefault={true} 
                linkStyle={{ color: '#8B0000', textDecorationLine: 'underline' }}
              >
                <Text
                  style={[styles.quoteText, isTablet && styles.quoteTextTablet]}
                  numberOfLines={padalExpanded ? undefined : 6}
                >
                  {nool.padal}
                </Text>
              </Hyperlink>
              </View>

              {padalIsLong && (
                <TouchableOpacity
                  onPress={() => setPadalExpanded((p) => !p)}
                  activeOpacity={0.7}
                  style={styles.readMoreContainer}
                >
                  <Text style={[styles.readMore, isTablet && styles.readMoreTablet]}>
                    {padalExpanded ? "Read Less" : "Read More"}
                  </Text>
                  <Ionicons
                    name={padalExpanded ? "chevron-up" : "chevron-forward"}
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
                  height={Math.round((width - CONTENT_PADDING * 2) * 0.50)} // 16:9
                  width={width - CONTENT_PADDING * 6}
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
   flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop:40,
    paddingBottom:30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
   paddingTop:45,
    paddingBottom:28,
    paddingHorizontal: 18,
  },
  headerBtn: {
     width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  headerBtnTablet: {
     width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitleWrap: { flex: 1, alignItems: "center" },
  headerTitle: {
     flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginRight:30, 
  },
  headerTitleTablet: { fontSize: 22 },

  scroll: { paddingBottom: 10 },
  scrollTablet: { paddingBottom: 20 },

  // Banner
  bannerWrap: { height: 230, width: "100%", position: "relative" },
  bannerWrapTablet: { height: 350 },
  banner: { width: "100%", height: "100%" },
  bannerOverlay: { position: "absolute", height: 100 },
  categoryChip: {
    position: "absolute",
    bottom: 12,
    left: 16,
    backgroundColor: "rgba(139, 0, 0, 0.85)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryChipTablet: {
    bottom: 16,
    left: 24,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
  },
  categoryChipText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  categoryChipTextTablet: { fontSize: 14, fontWeight: "800" },

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

  // Quote Box
  quoteBox: {
    backgroundColor: "rgba(139, 0, 0, 0.05)",
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#8B0000",
  },
  quoteBoxTablet: {
    borderRadius: 16,
    padding: 16,
  },
  quoteIcon: { marginBottom: 6 },
  quoteIconTablet: { marginBottom: 8 },
  quoteText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    lineHeight: 22,
    fontStyle: "italic",
    textAlign: "justify",
  },
  quoteTextTablet: {
    fontSize: 15,
    lineHeight: 24,
  },

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
    borderRadius:5,
    overflow: "hidden",
    backgroundColor: "#000",
  },
});