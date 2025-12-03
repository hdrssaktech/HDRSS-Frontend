// src/components/Gallery/GalleryFull.js
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
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchGalleryList } from "../../Controller/GalleryController/GalleryController";

export default function GalleryFull() {
  const navigation = useNavigation();
  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchGalleryList();
      setGalleryList(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Chevron Navigation */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // ✅ goes back to previous screen
          style={styles.backBtn}
        >
          <Icon name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Gallery</Text>
        <View style={{ width: 30 }} /> {/* Spacer */}
      </View>

      {/* Gallery List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {galleryList.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("GalleryPage2", {
                title: item.title,
                mainImage: { uri: item.thumbnail },
                description: item.description,
                images: item.images,
                videoLink: item.videoLink,
              })
            }
          >
            <Image source={{ uri: item.thumbnail }} style={styles.galleryimage} />
            <View style={styles.textBox}>
              <Text style={styles.imageLabel}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  header: {
    backgroundColor: "#93210A",
    paddingTop: 50,
  padding: 25,
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  flexDirection: "row",
  },
 backBtn: {
  position: "absolute",
  left: 15,    // keep back button on left
},
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
    // marginRight: 178, // ✅ keeps title centered even with chevron
  },
  scrollContainer: { padding: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 3,
  },
  galleryimage: { width: "100%", height: 200, resizeMode: "cover" },
  textBox: { padding: 12 },
  imageLabel: { fontSize: 20, fontWeight: "700", color: "#93210A" },
});