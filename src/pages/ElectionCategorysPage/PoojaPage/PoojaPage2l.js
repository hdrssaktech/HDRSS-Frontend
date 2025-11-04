import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { fetchPoojaById } from "../../../Controller/PoojaController/PoojaController";

export default function PoojaPage2({ route, navigation }) {
  const { id } = route.params;
  const [pooja, setPooja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const loadPooja = async () => {
      try {
        const data = await fetchPoojaById(id);
        setPooja(data);
      } catch (error) {
        console.error("Error loading pooja details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPooja();
  }, [id]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="maroon" />
      </View>
    );
  }

  if (!pooja) {
    return (
      <View style={styles.loader}>
        <Text>Unable to load pooja details.</Text>
      </View>
    );
  }

  const videoUrl =
    pooja.videos && pooja.videos.length > 0 ? pooja.videos[0] : null;
  const youtubeVideoId = getYouTubeVideoId(videoUrl);

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pooja.title}</Text>
      </View>

      <ScrollView>
        <Image source={{ uri: pooja.bannerimg }} style={styles.bannerImage} />

        {/* 🔹 Card Section */}
        <View style={styles.card}>
          <Image source={{ uri: pooja.image }} style={styles.templeImage} />

          {/* 🔹 Aligned Details Section */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Pooja Type</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{pooja.poojatype}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{pooja.datee}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{pooja.category}</Text>
            </View>
          </View>
        </View>

        {/* 🔹 About Section */}
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.about}>{pooja.about}</Text>

        {/* 🎥 Video Section */}
        {youtubeVideoId && (
          <>
            <Text style={styles.sectionTitle}>Video</Text>
            <View style={[styles.videoContainer, { width: screenWidth }]}>
              <YoutubePlayer
                height={230}
                width={screenWidth}
                play={playing}
                videoId={youtubeVideoId}
                onChangeState={onStateChange}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 31,
    backgroundColor: "#93210A",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },

  bannerImage: { width: "100%", height: 230, resizeMode: "cover" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    margin: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  templeImage: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  // ✅ Perfectly aligned details section
  details: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7a1b0c",
    width: 110, // ensures consistent alignment
    textAlign: "left",
  },
  colon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7a1b0c",
    width: 10,
    textAlign: "center",
  },
  value: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "left",
  },

  sectionTitle: {
    fontSize: 20,
    color: "#93210A",
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 8,
  },

  about: {
    paddingHorizontal: 16,
    textAlign: "justify",
    lineHeight: 22,
    color: "#333",
  },

  videoContainer: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 0,
    overflow: "hidden",
  },
});