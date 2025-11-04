import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";
import { fetchTourismById } from "../../../Controller/TourismController/TourismController";

const { width } = Dimensions.get("window");

export default function TourismPage3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const loadTourismDetails = async () => {
      try {
        const result = await fetchTourismById(id);
        setData(result);
      } catch (error) {
        console.error("Error fetching tourism details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTourismDetails();
  }, [id]);

  // ✅ Extract YouTube Video ID
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

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );

  if (!data)
    return (
      <View style={styles.center}>
        <Text>No data found for this tourism place.</Text>
      </View>
    );

  const youtubeVideoId = getYouTubeVideoId(data?.video);

  // ✅ Open WhatsApp chat
  const openWhatsApp = (number) => {
    if (!number) return;
    const phone = number.replace(/[^0-9]/g, "");
    const url = `https://wa.me/${phone}`;
    Linking.openURL(url).catch(() =>
      alert("Unable to open WhatsApp. Please check the number.")
    );
  };

  // ✅ Open phone dialer
  const openPhoneDialer = (number) => {
    if (!number) return;
    const phone = number.replace(/[^0-9]/g, "");
     Linking.openURL(`tel:${phone}`).catch(() =>
      alert("Unable to open dialer. Please check the number.")
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data?.name || "Tourism Details"}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* 🔹 Full-width Banner Image */}
        <Image
          source={{
            uri:
              data?.bannerImage ||
              "https://cdn-icons-png.flaticon.com/512/190/190411.png",
          }}
          style={styles.banner}
        />

        {/* 🔹 Basic Info */}
        <View style={styles.section}>
          <Text style={styles.title}>{data?.title}</Text>

          {/* 🗓 Session */}
          {data?.session && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#E67E22" />
              <Text style={styles.infoValue}>{data.session}</Text>
            </View>
          )}

          {/* ☎ Phone */}
          {data?.phone && (
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => openPhoneDialer(data.phone)}
              activeOpacity={0.7}
            >
              <Ionicons name="call-sharp" size={20} color="#2980B9" />
              <Text style={[styles.infoValue, { color: "#000" }]}>
                {data.phone}
              </Text>
            </TouchableOpacity>
          )}

          {/* 💬 WhatsApp Contact */}
          {data?.contact && (
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => openWhatsApp(data.contact)}
              activeOpacity={0.7}
            >
              <FontAwesome name="whatsapp" size={22} color="#25D366" />
              <Text style={[styles.infoValue, { color: "#000" }]}>
                {data.contact}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 🔹 Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.description}>
            {data?.description || "No description available."}
          </Text>
        </View>

        {/* 🔹 Full-Width Video Section */}
        {data?.video ? (
          <>
            <Text style={[styles.label, { marginHorizontal: 20 }]}>Video</Text>
            <View style={styles.videoContainer}>
              {youtubeVideoId ? (
                <YoutubePlayer
                  height={230}
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
                  style={styles.video}
                />
              )}
            </View>
          </>
        ) : (
          <Text style={[styles.section, styles.noVideo]}>
            🎥 No video available
          </Text>
        )}

        {/* 🔹 Gallery */}
        {data?.gallery?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.gallery.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.galleryImage}
                />
              ))}
            </ScrollView>
          </View>
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
    marginTop: 32,
    backgroundColor: "#93210A",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    flexShrink: 1,
  },

  banner: {
    width: width,
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },

  section: { marginHorizontal: 20, marginTop: 10 },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
  },

  // ✅ Modern info row style
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },

  infoValue: {
    fontSize: 15,
    color: "#333",
    marginLeft: 10,
    fontWeight: "500",
  },

  description: { 
    fontSize: 14, 
    color: "#333", 
    textAlign: "justify",
    marginBottom: 15,
  },

 label: {
  fontWeight: "bold",
  color: "#93210A",
  marginBottom: 10,
  fontSize: 17, // 🔹 Increased from default (~13–14)
},


  videoContainer: {
    width: width,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  video: {
    width: "100%",
    height: 230,
    backgroundColor: "#000",
  },

  noVideo: { fontSize: 14, color: "#999", textAlign: "center", marginTop: 5 },

  galleryImage: {
    width: width * 0.6,
    height: 140,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#93210A",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});