import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import { WebView } from "react-native-webview";
import { fetchTourismById } from "../../../Controller/TourismController/TourismController";

const { width } = Dimensions.get("window");

export default function TourismPage3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoId = url.split("v=")[1] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

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

  const isYouTube = data?.video?.includes("youtube");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data?.name || "Tourism Details"}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Banner */}
        <Image
          source={{
            uri:
              data?.bannerImage ||
              "https://cdn-icons-png.flaticon.com/512/190/190411.png",
          }}
          style={styles.banner}
        />

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.title}>{data?.title}</Text>

          {data?.session && (
            <Text style={styles.infoText}>
              🕒 <Text style={styles.infoLabel}>Session:</Text> {data.session}
            </Text>
          )}

          {data?.phone && (
            <Text style={styles.infoText}>
              📞 <Text style={styles.infoLabel}>Phone:</Text> {data.phone}
            </Text>
          )}

          {data?.contact && (
            <Text style={styles.infoText}>
              📧 <Text style={styles.infoLabel}>Contact:</Text> {data.contact}
            </Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.description}>
            {data?.description || "No description available."}
          </Text>
        </View>

        {/* Video Section */}
        {data?.video ? (
          <View style={styles.section}>
            <Text style={styles.label}>Video</Text>
            {isYouTube ? (
              <WebView
                source={{ uri: getYouTubeEmbedUrl(data.video) }}
                style={styles.video}
                allowsFullscreenVideo
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
        ) : (
          <Text style={[styles.section, styles.noVideo]}>
            🎥 No video available
          </Text>
        )}

        {/* Gallery */}
        {data?.gallery?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.gallery.map((img, index) => (
                <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
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
    width: "90%",
    height: 200,
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
  },
  section: { marginHorizontal: 20, marginTop: 10 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 6,
  },
  infoText: { fontSize: 14, color: "#333", marginBottom: 4 },
  infoLabel: { fontWeight: "bold", color: "#93210A" },
  description: { fontSize: 14, color: "#333", textAlign: "justify" },
  label: { fontWeight: "bold", color: "#93210A", marginBottom: 4 },
  video: {
    width: "100%",
    height: 220,
    borderRadius: 10,
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
