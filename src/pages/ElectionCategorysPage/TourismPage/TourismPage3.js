import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
  StatusBar,
  SafeAreaView,
  Modal,
  Animated,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";
import { fetchTourismById } from "../../../Controller/TourismController/TourismController";
import Loader from "../../../components/Alert/Loader";
import { useLanguage } from "../../../context/LanguageContext";
import { t, getLocalizedField, sortByDirection, DIRECTION_LABELS } from "../../../utils/localization";

const C = {
  primary: "#93210A",
  dark:    "#301913",
  gold:    "#D4AF37",
  bg:      "#d4cea6",
  card:    "#ede8d5",
  white:   "#FFFFFF",
  text:    "#1a0a00",
  border:  "rgba(48,25,19,0.25)",
};

function ZoomModal({ visible, imageUri, onClose }) {
  const { width, height } = useWindowDimensions();
  const scale = React.useRef(new Animated.Value(1)).current;
  const [currentScale, setCurrentScale] = useState(1);

  const zoomIn = () => {
    const next = Math.min(currentScale + 0.5, 3);
    setCurrentScale(next);
    Animated.spring(scale, { toValue: next, useNativeDriver: true }).start();
  };

  const zoomOut = () => {
    const next = Math.max(currentScale - 0.5, 1);
    setCurrentScale(next);
    Animated.spring(scale, { toValue: next, useNativeDriver: true }).start();
  };

  const handleClose = () => {
    scale.setValue(1);
    setCurrentScale(1);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={zm.overlay}>
        <TouchableOpacity style={zm.closeBtn} onPress={handleClose} activeOpacity={0.85}>
          <Ionicons name="close" size={22} color={C.white} />
        </TouchableOpacity>

        <Animated.Image
          source={{ uri: imageUri }}
          style={[
            zm.image,
            { width: width - 32, height: height * 0.55 },
            { transform: [{ scale }] },
          ]}
          resizeMode="contain"
        />

        <View style={zm.zoomRow}>
          <TouchableOpacity
            style={[zm.zoomBtn, currentScale <= 1 && zm.zoomBtnDisabled]}
            onPress={zoomOut}
            activeOpacity={0.8}
            disabled={currentScale <= 1}
          >
            <Ionicons name="remove" size={22} color={C.white} />
          </TouchableOpacity>

          <View style={zm.scaleLabel}>
            <Text style={zm.scaleLabelText}>{currentScale.toFixed(1)}×</Text>
          </View>

          <TouchableOpacity
            style={[zm.zoomBtn, currentScale >= 3 && zm.zoomBtnDisabled]}
            onPress={zoomIn}
            activeOpacity={0.8}
            disabled={currentScale >= 3}
          >
            <Ionicons name="add" size={22} color={C.white} />
          </TouchableOpacity>
        </View>

        <Text style={zm.hint}>Tap + / − to zoom</Text>
      </View>
    </Modal>
  );
}

const zm = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: "rgba(0,0,0,0.92)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  closeBtn: {
    position:        "absolute",
    top:             52,
    right:           18,
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems:      "center",
    justifyContent:  "center",
    zIndex:          10,
  },
  image: { borderRadius: 12 },
  zoomRow: {
    flexDirection:  "row",
    alignItems:     "center",
    marginTop:      28,
    gap:            20,
  },
  zoomBtn: {
    width:           54,
    height:          54,
    borderRadius:    27,
    backgroundColor: C.primary,
    alignItems:      "center",
    justifyContent:  "center",
    elevation:       6,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.4,
    shadowRadius:    5,
    borderWidth:     2,
    borderColor:     C.gold,
  },
  zoomBtnDisabled: {
    backgroundColor: "rgba(147,33,10,0.35)",
    borderColor:     "rgba(212,175,55,0.35)",
  },
  scaleLabel: {
    width:           54,
    height:          54,
    borderRadius:    27,
    backgroundColor: "rgba(212,175,55,0.18)",
    borderWidth:     1.5,
    borderColor:     C.gold,
    alignItems:      "center",
    justifyContent:  "center",
  },
  scaleLabelText: {
    color:      C.gold,
    fontSize:   14,
    fontWeight: "800",
  },
  hint: {
    marginTop:  12,
    color:      "rgba(255,255,255,0.45)",
    fontSize:   12,
    fontWeight: "500",
  },
});

export default function TourismPage3() {
  const navigation = useNavigation();
  const route      = useRoute();
  const { id }     = route.params;
  const { language } = useLanguage();

  const { width } = useWindowDimensions();
  const isTablet  = width >= 600;

  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [playing,     setPlaying]     = useState(false);
  const [expanded,    setExpanded]    = useState(false);

  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomUri,     setZoomUri]     = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchTourismById(id);
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:.*v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") setPlaying(false);
  }, []);

  const openWhatsApp = (number) => {
    const phone = number?.replace(/[^0-9]/g, "");
    if (phone) Linking.openURL(`https://wa.me/${phone}`);
  };

  const openPhone = (number) => {
    const phone = number?.replace(/[^0-9]/g, "");
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const openZoom = (uri) => {
    setZoomUri(uri);
    setZoomVisible(true);
  };

  if (loading) return <Loader />;

  if (!data) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Ionicons name="location-outline" size={48} color={C.primary} />
          <Text style={styles.noDataText}>{t("noData", language)}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const youtubeVideoId = getYouTubeVideoId(data?.video);
  const HP = isTablet ? 32 : 16;

  const localizedName        = getLocalizedField(data, "name", language);
  const localizedTitle       = getLocalizedField(data, "title", language);
  const localizedDescription = getLocalizedField(data, "description", language);
  const localizedSession     = getLocalizedField(data, "session", language) || data.session;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      <ZoomModal
        visible={zoomVisible}
        imageUri={zoomUri}
        onClose={() => setZoomVisible(false)}
      />

      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backBtn, isTablet && styles.backBtnTablet]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color={C.white} />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
          numberOfLines={1}
        >
          {localizedName}
        </Text>

        <View style={[styles.backBtn, isTablet && styles.backBtnTablet, { backgroundColor: "transparent" }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image
            source={{ uri: data.bannerImage }}
            style={[styles.banner, isTablet && styles.bannerTablet]}
            resizeMode="cover"
          />
          <View style={styles.bannerFade} />
          <View style={styles.bannerPin}>
            <Ionicons name="location" size={isTablet ? 16 : 13} color={C.gold} />
          </View>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              marginHorizontal: HP,
              borderRadius:     isTablet ? 16 : 12,
            },
          ]}
        >
          <View style={styles.infoLeft}>
            <View style={styles.infoTitleRow}>
              <View style={styles.goldBar} />
              <Text
                style={[styles.infoTitle, isTablet && styles.infoTitleTablet]}
                numberOfLines={2}
              >
                {localizedTitle}
              </Text>
            </View>

            {localizedSession && (
              <View style={styles.detailRow}>
                <View style={[styles.detailIconWrap, { backgroundColor: "rgba(230,126,34,0.15)" }]}>
                  <Ionicons name="calendar-outline" size={isTablet ? 15 : 13} color="#E67E22" />
                </View>
                <Text
                  style={[styles.detailText, isTablet && styles.detailTextTablet]}
                  numberOfLines={1}
                >
                  {localizedSession}
                </Text>
              </View>
            )}

            {data.phone && (
              <TouchableOpacity
                style={styles.detailRow}
                onPress={() => openPhone(data.phone)}
                activeOpacity={0.75}
              >
                <View style={[styles.detailIconWrap, { backgroundColor: "rgba(41,128,185,0.15)" }]}>
                  <Ionicons name="call" size={isTablet ? 15 : 13} color="#2980B9" />
                </View>
                <Text
                  style={[styles.detailText, styles.detailLink, isTablet && styles.detailTextTablet]}
                  numberOfLines={1}
                >
                  {data.phone}
                </Text>
              </TouchableOpacity>
            )}

            {data.contact && (
              <TouchableOpacity
                style={styles.detailRow}
                onPress={() => openWhatsApp(data.contact)}
                activeOpacity={0.75}
              >
                <View style={[styles.detailIconWrap, { backgroundColor: "rgba(37,211,102,0.15)" }]}>
                  <FontAwesome name="whatsapp" size={isTablet ? 15 : 13} color="#25D366" />
                </View>
                <Text
                  style={[styles.detailText, styles.detailLink, isTablet && styles.detailTextTablet]}
                  numberOfLines={1}
                >
                  {data.contact}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoRight}>
            <TouchableOpacity
              style={[styles.tourBtn, isTablet && styles.tourBtnTablet]}
              onPress={() => navigation.navigate("TourismPlaces", { id })}
              activeOpacity={0.85}
            >
              <View style={[styles.tourBtnIcon, isTablet && styles.tourBtnIconTablet]}>
                <Ionicons
                  name="information-circle"
                  size={isTablet ? 20 : 17}
                  color={C.dark}
                />
              </View>
              <Text style={[styles.tourBtnText, isTablet && styles.tourBtnTextTablet]}>
                {t("clickHere", language)}
              </Text>
              <Text style={[styles.tourBtnSub, isTablet && styles.tourBtnSubTablet]}>
                {t("moreInfo", language)}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={isTablet ? 14 : 12}
                color={C.white}
                style={{ marginTop: 4 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { marginHorizontal: HP }]}>
          <View style={styles.secHeadRow}>
            <Text style={[styles.secHeading, isTablet && styles.secHeadingTablet]}>
              {t("description", language)}
            </Text>
            <View style={styles.secHeadLine} />
          </View>

          <View style={styles.descCard}>
            <Text
              style={[styles.descText, isTablet && styles.descTextTablet]}
              numberOfLines={expanded ? undefined : 6}
            >
              {localizedDescription}
            </Text>

            <TouchableOpacity
              style={styles.readMoreBtn}
              onPress={() => setExpanded(!expanded)}
              activeOpacity={0.8}
            >
              <Text style={[styles.readMoreText, isTablet && styles.readMoreTextTablet]}>
                {expanded ? t("readLess", language) : t("readMore", language)}
              </Text>
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={isTablet ? 15 : 13}
                color={C.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {data.gallery?.length > 0 && (
          <View style={[styles.section, { marginHorizontal: HP }]}>
            <View style={styles.secHeadRow}>
              <Text style={[styles.secHeading, isTablet && styles.secHeadingTablet]}>
                {t("gallery", language)}
              </Text>
              <View style={styles.secHeadLine} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.gallery.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.88}
                  onPress={() => openZoom(img)}
                  style={[
                    styles.galleryCard,
                    isTablet && styles.galleryCardTablet,
                    index === 0 && { marginLeft: 0 },
                  ]}
                >
                  <Image
                    source={{ uri: img }}
                    style={[styles.galleryImg, isTablet && styles.galleryImgTablet]}
                    resizeMode="cover"
                  />
                  <View style={styles.galleryAccent} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {data.video && (
          <View style={[styles.section, { marginHorizontal: 0 }]}>
            <View style={[styles.secHeadRow, { marginHorizontal: HP }]}>
              <Text style={[styles.secHeading, isTablet && styles.secHeadingTablet]}>
                {t("video", language)}
              </Text>
              <View style={styles.secHeadLine} />
            </View>

            <View style={styles.videoEdge}>
              {youtubeVideoId ? (
                <YoutubePlayer
                  height={isTablet ? 380 : 230}
                  width={width}
                  play={playing}
                  videoId={youtubeVideoId}
                  onChangeState={onStateChange}
                />
              ) : (
                <Video
                  source={{ uri: data.video }}
                  useNativeControls
                  resizeMode="contain"
                  style={[styles.video, isTablet && styles.videoTablet]}
                />
              )}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: C.bg },
  center:     { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  noDataText: { fontSize: 16, fontWeight: "700", color: C.dark, marginTop: 8 },
  header: {
    flexDirection:           "row",
    alignItems:              "center",
    backgroundColor:         C.primary,
    paddingTop:              40,
    paddingBottom:           22,
    paddingHorizontal:       14,
    borderBottomLeftRadius:  20,
    borderBottomRightRadius: 20,
    elevation:               6,
    shadowColor:             C.dark,
    shadowOffset:            { width: 0, height: 3 },
    shadowOpacity:           0.3,
    shadowRadius:            6,
  },
  headerTablet: {
    paddingTop:              56,
    paddingBottom:           26,
    paddingHorizontal:       22,
    borderBottomLeftRadius:  28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  backBtnTablet: { width: 50, height: 50, borderRadius: 25 },
  headerTitle: {
    flex:             1,
    textAlign:        "center",
    color:            C.white,
    fontSize:         18,
    fontWeight:       "800",
    letterSpacing:    0.3,
    marginHorizontal: 8,
  },
  headerTitleTablet: { fontSize: 22 },
  banner:       { width: "100%", height: 210 },
  bannerTablet: { height: 340 },
  bannerFade: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    height:          70,
    backgroundColor: "rgba(48,25,19,0.35)",
  },
  bannerPin: {
    position:        "absolute",
    top:             10,
    right:           12,
    backgroundColor: "rgba(48,25,19,0.6)",
    borderRadius:    20,
    padding:         6,
  },
  infoCard: {
    flexDirection:   "row",
    backgroundColor: C.card,
    marginTop:       14,
    borderWidth:     1,
    borderColor:     C.border,
    elevation:       4,
    shadowColor:     C.dark,
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.12,
    shadowRadius:    5,
    overflow:        "hidden",
  },
  infoLeft: {
    flex:              1,
    paddingHorizontal: 12,
    paddingVertical:   14,
    gap:               8,
  },
  infoTitleRow: {
    flexDirection: "row",
    alignItems:    "flex-start",
    gap:           8,
    marginBottom:  2,
  },
  goldBar: {
    width:           3,
    borderRadius:    2,
    backgroundColor: C.gold,
    marginTop:       2,
    alignSelf:       "stretch",
  },
  infoTitle: {
    flex:       1,
    fontSize:   14,
    fontWeight: "800",
    color:      C.dark,
    lineHeight: 20,
  },
  infoTitleTablet: { fontSize: 18, lineHeight: 25 },
  detailRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
  },
  detailIconWrap: {
    width:          28,
    height:         28,
    borderRadius:   14,
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  detailText: {
    flex:       1,
    fontSize:   12,
    fontWeight: "600",
    color:      C.text,
  },
  detailTextTablet: { fontSize: 14 },
  detailLink: { color: C.primary },
  infoRight: {
    justifyContent:    "center",
    alignItems:        "center",
    backgroundColor:   C.dark,
    paddingHorizontal: 12,
    paddingVertical:   14,
  },
  tourBtn: {
    alignItems:     "center",
    justifyContent: "center",
    gap:            3,
  },
  tourBtnTablet: { gap: 5 },
  tourBtnIcon: {
    width:           38,
    height:          38,
    borderRadius:    19,
    backgroundColor: C.gold,
    alignItems:      "center",
    justifyContent:  "center",
    marginBottom:    2,
  },
  tourBtnIconTablet: { width: 48, height: 48, borderRadius: 24 },
  tourBtnText: {
    fontSize:      11,
    fontWeight:    "800",
    color:         C.white,
    letterSpacing: 0.4,
  },
  tourBtnTextTablet: { fontSize: 13 },
  tourBtnSub: {
    fontSize:      10,
    fontWeight:    "600",
    color:         C.gold,
    letterSpacing: 0.3,
  },
  tourBtnSubTablet: { fontSize: 12 },
  section: { marginTop: 22 },
  secHeadRow: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           8,
    marginBottom:  12,
  },
  secHeading: {
    fontSize:      15,
    fontWeight:    "800",
    color:         C.primary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  secHeadingTablet: { fontSize: 18 },
  secHeadLine: {
    flex:            1,
    height:          1.5,
    backgroundColor: C.border,
    borderRadius:    1,
  },
  descCard: {
    backgroundColor: C.card,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     C.border,
    overflow:        "hidden",
    elevation:       2,
    shadowColor:     C.dark,
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.08,
    shadowRadius:    3,
  },
  descText: {
    fontSize:  14,
    color:     C.text,
    lineHeight: 23,
    padding:   14,
    textAlign: "justify",
  },
  descTextTablet: { fontSize: 16, lineHeight: 27, padding: 20 },
  readMoreBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    justifyContent:  "center",
    backgroundColor: C.primary,
    paddingVertical: 10,
    gap:             6,
  },
  readMoreText: {
    color:         C.white,
    fontSize:      13,
    fontWeight:    "700",
    letterSpacing: 0.3,
  },
  readMoreTextTablet: { fontSize: 15 },
  galleryCard: {
    marginRight:  12,
    borderRadius: 12,
    overflow:     "hidden",
    borderWidth:  1,
    borderColor:  C.border,
    elevation:    3,
    shadowColor:  C.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  galleryCardTablet: { marginRight: 16 },
  galleryImg: {
    width:  160,
    height: 160,
  },
  galleryImgTablet: { width: 220, height: 220 },
  galleryAccent: {
    height:          3,
    backgroundColor: C.gold,
  },
  videoEdge: {
    width:             "100%",
    backgroundColor:   C.dark,
    borderTopWidth:    2,
    borderBottomWidth: 2,
    borderColor:       C.gold,
  },
  video:       { width: "100%", height: 230 },
  videoTablet: { height: 380 },
});