// src/components/Gallery/Gallery.js
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
import { fetchGalleryList } from "../../Controller/GalleryController/GalleryController";

export default function Gallery() {
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
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <View style={{ marginTop: 15 }}>
      <Text style={styles.gallerytext}>Gallery</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {galleryList.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.imageContainer}
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
            <Text style={styles.imageLabel}>{item.title}</Text>
            <Image source={{ uri: item.thumbnail }} style={styles.galleryimage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gallerytext: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 8,
    color: "#93210A",
  },
  scrollContainer: {
    paddingHorizontal: 12,
  },
  imageContainer: {
    alignItems: "center",
    marginRight: 12,
  },
  imageLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: "#444",
  },
  galleryimage: {
    width: 200,
    height: 160,
    borderRadius: 10,
  },
});