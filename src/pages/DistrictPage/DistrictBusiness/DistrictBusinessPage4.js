import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

export default function DistrictBusinessPage4({ route, navigation }) {
  const item = route.params?.item || {};

  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [videoError, setVideoError] = useState(false);

  const {
    imageUrl = "",
    bannerUrl = "",
    gallery = [],
    phoneNo = "",
    whatsappNo = "",
    mapUrl = "",
    description = "",
    videoUrl = "",
  } = item;

  /* ------------------ YOUTUBE ID EXTRACT ------------------ */
  useEffect(() => {
    if (!videoUrl) return;

    const match = videoUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/
    );

    if (match?.[1]) {
      setVideoId(match[1]);
      setVideoError(false);
    } else {
      setVideoError(true);
    }
  }, [videoUrl]);

  /* ------------------ ACTIONS ------------------ */
  const callNow = () => phoneNo && Linking.openURL(`tel:${phoneNo}`);
  const whatsappNow = () =>
    whatsappNo && Linking.openURL(`https://wa.me/${whatsappNo}`);
  const openMap = () => mapUrl && Linking.openURL(mapUrl);
  const openYoutube = () => videoUrl && Linking.openURL(videoUrl);

  const onStateChange = useCallback((state) => {
    if (state === "ended") setPlaying(false);
  }, []);

  /* ------------------ VIDEO RENDER ------------------ */
  const renderVideo = () => {
    if (!videoUrl)
      return <Text style={styles.noVideo}>Video not available</Text>;

    if (videoError || !videoId)
      return (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={36} color="#ff5252" />
          <Text style={styles.noVideo}>Unable to load video</Text>
          <TouchableOpacity onPress={openYoutube} style={styles.youtubeBtn}>
            <Ionicons name="logo-youtube" size={18} color="#ff0000" />
            <Text style={styles.youtubeText}>Open in YouTube</Text>
          </TouchableOpacity>
        </View>
      );

    return (
      <View style={styles.videoBox}>
        <YoutubePlayer
          height={isTablet ? 300 : 220}
          width={width - 40}
          videoId={videoId}
          play={playing}
          onChangeState={onStateChange}
          webViewProps={{
            androidLayerType: "hardware",
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER */}
        <Image source={{ uri: bannerUrl }} style={styles.banner} />

        {/* IMAGE */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: imageUrl }} style={styles.logo} />
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>

          {/* ACTIONS */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={callNow} style={styles.actionBtn}>
              <FontAwesome name="phone" size={18} color="#0077cc" />
              <Text>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={whatsappNow} style={styles.actionBtn}>
              <FontAwesome name="whatsapp" size={18} color="#25D366" />
              <Text>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openMap} style={styles.actionBtn}>
              <FontAwesome name="map-marker" size={18} color="#ff5722" />
              <Text>Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text numberOfLines={expanded ? undefined : 3} style={styles.text}>
            {description}
          </Text>
          {description.length > 120 && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
              <Text style={styles.readMore}>
                {expanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* VIDEO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video</Text>
          {renderVideo()}
        </View>

        {/* GALLERY */}
        {gallery.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {gallery.map((img, i) => (
                <Image key={i} source={{ uri: img }} style={styles.gallery} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 90,
    backgroundColor: "#93210A",
    paddingTop: Platform.OS === "ios" ? 40 : 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  banner: { width: "100%", height: 200 },
  imageWrap: { alignItems: "center", marginTop: -60 },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#fff",
  },

  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4,
  },
  name: { fontSize: 22, fontWeight: "700", textAlign: "center" },

  actions: { flexDirection: "row", marginTop: 16 },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },

  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  text: { fontSize: 15, color: "#555" },
  readMore: { color: "#e53935", marginTop: 6, fontWeight: "700" },

  videoBox: {
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  noVideo: { color: "#777", marginTop: 10 },

  errorBox: {
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff5f5",
  },
  youtubeBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  youtubeText: { color: "#ff0000", marginLeft: 6 },

  gallery: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 12,
  },
});
