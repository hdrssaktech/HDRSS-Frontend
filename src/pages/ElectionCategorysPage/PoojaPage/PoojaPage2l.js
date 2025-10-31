import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { fetchPoojaById } from "../../../Controller/PoojaController/PoojaController";

export default function PoojaPage2({ route, navigation }) {
  const { id } = route.params;
  const [pooja, setPooja] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pooja.title}</Text>
      </View>

      <ScrollView>
        <Image source={{ uri: pooja.bannerimg }} style={styles.bannerImage} />
        <View style={styles.card}>
          <Image source={{ uri: pooja.image }} style={styles.templeImage} />
          <View style={styles.details}>
            <Text style={styles.label}>Pooja Type:</Text>
            <Text style={styles.value}>{pooja.poojatype}</Text>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{pooja.datee}</Text>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{pooja.category}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.about}>{pooja.about}</Text>

        {/* ✅ YouTube Video */}
        {pooja.videos && pooja.videos.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Video</Text>
            <View style={styles.videoContainer}>
              <WebView
                source={{ uri: pooja.videos[0] }}
                style={{ height: 220 }}
                javaScriptEnabled
                domStorageEnabled
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
  templeImage: { width: "100%", height: 250 },
  details: { padding: 15 },
  label: { fontWeight: "bold", fontSize: 14, color: "#000", marginTop: 6 },
  value: { fontSize: 14, color: "#444" },
  sectionTitle: {
    fontSize: 20,
    color: "maroon",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  about: { padding: 10, textAlign: "justify", lineHeight: 22 },
  videoContainer: {
    margin: 10,
    height: 220,
    borderRadius: 10,
    overflow: "hidden",
  },
});

