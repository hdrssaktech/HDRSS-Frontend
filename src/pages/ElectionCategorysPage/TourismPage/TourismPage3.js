import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  useWindowDimensions,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";
import { fetchTourismById } from "../../../Controller/TourismController/TourismController";
import Loader from "../../../components/Alert/Loader";

export default function TourismPage3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false); // ✅ Read More state

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchTourismById(id);
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>No data found</Text>
      </View>
    );
  }

  const youtubeVideoId = getYouTubeVideoId(data?.video);

  const openWhatsApp = (number) => {
    const phone = number?.replace(/[^0-9]/g, "");
    if (phone) Linking.openURL(`https://wa.me/${phone}`);
  };

  const openPhone = (number) => {
    const phone = number?.replace(/[^0-9]/g, "");
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
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
          {data.name}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER */}
        <Image
          source={{ uri: data.bannerImage }}
          style={[styles.banner, isTablet && styles.bannerTablet]}
        />

        {/* INFO */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <Text style={[styles.mainTitle, isTablet && styles.mainTitleTablet]}>
            {data.title}
          </Text>

          {data.session && (
            <View style={[styles.infoRow, isTablet && styles.infoRowTablet]}>
              <Ionicons name="calendar-outline" size={22} color="#E67E22" />
              <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>
                {data.session}
              </Text>
            </View>
          )}

          {data.phone && (
            <TouchableOpacity
              style={[styles.infoRow, isTablet && styles.infoRowTablet]}
              onPress={() => openPhone(data.phone)}
            >
              <Ionicons name="call" size={22} color="#2980B9" />
              <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>
                {data.phone}
              </Text>
            </TouchableOpacity>
          )}

          {data.contact && (
            <TouchableOpacity
              style={[styles.infoRow, isTablet && styles.infoRowTablet]}
              onPress={() => openWhatsApp(data.contact)}
            >
              <FontAwesome name="whatsapp" size={24} color="#25D366" />
              <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>
                {data.contact}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* DESCRIPTION */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <Text style={[styles.label, isTablet && styles.labelTablet]}>
            Description
          </Text>

          <Text
            style={[
              styles.description,
              isTablet && styles.descriptionTablet,
            ]}
            numberOfLines={expanded ? undefined : 8}
          >
            {data.description}
          </Text>

          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMoreText}>
              {expanded ? "Read Less" : "Read More"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* VIDEO */}
        {data.video && (
          <>
            <Text
              style={[
                styles.label,
                styles.videoLabel,
                isTablet && styles.videoLabelTablet,
              ]}
            >
              Video
            </Text>

            <View style={styles.videoWrapper}>
              {youtubeVideoId ? (
                <YoutubePlayer
                  height={isTablet ? 420 : 260}
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
                  style={[
                    styles.video,
                    isTablet && styles.videoTablet,
                  ]}
                />
              )}
            </View>
          </>
        )}

        {/* GALLERY */}
        {data.gallery?.length > 0 && (
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>
              Visiting Places
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.gallery.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={[
                    styles.galleryImage,
                    isTablet && styles.galleryImageTablet,
                  ]}
                />
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

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

  headerTitle: {
     flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
     marginRight:70,
  },
  headerTitleTablet: {
    fontSize: 24,
    marginRight:55,
    
  },

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

  banner: { width: "100%", height: 160 },
  bannerTablet: { height: 340 },

  section: { marginHorizontal: 20, marginTop: 18 },
  sectionTablet: { marginHorizontal: 48, marginTop: 26 },

  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 14,
  },
  mainTitleTablet: { fontSize: 28, right: 30 },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },

  infoText: {
    fontSize: 15,
    marginLeft: 10,
    color: "#333",
    fontWeight: "500",
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#444",
    textAlign: "justify",
    lineHeight: 21,
  },

  readMoreText: {
    color: "#93210A",
    fontWeight: "600",
    marginTop: 6,
    fontSize: 14,
    marginLeft:230,
  },

  videoLabel: { marginLeft: 20, marginTop: 26 },

  videoWrapper: { width: "100%", backgroundColor: "#000" },

  video: { width: "100%", height: 200 },

  galleryImage: {
    width: 220,
    height: 140,
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#93210A",
  },
});
