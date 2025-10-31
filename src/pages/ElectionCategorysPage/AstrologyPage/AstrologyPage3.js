// src/pages/Astrology/AstrologyPage3.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function AstrologyPage3({ route }) {
  const navigation = useNavigation();
  const { astrologyItem } = route.params;

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{astrologyItem.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 🔹 Main Image */}
        <Image source={{ uri: astrologyItem.image }} style={styles.mainImage} />

        {/* 🔹 Title */}
        <Text style={styles.title}>{astrologyItem.title}</Text>

        {/* 🔹 Description */}
        <Text style={styles.description}>{astrologyItem.description}</Text>

        {/* 🔹 Video Section */}
        {astrologyItem.video ? (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: astrologyItem.video }}
              rate={1.0}
              volume={1.0}
              resizeMode="contain"
              shouldPlay={false}
              useNativeControls
              style={styles.video}
            />
          </View>
        ) : null}

        {/* 🔹 Gallery Section */}
        {astrologyItem.gallery && astrologyItem.gallery.length > 0 && (
          <View style={styles.galleryContainer}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {astrologyItem.gallery.map((img, idx) => (
                <Image key={idx} source={{ uri: img }} style={styles.galleryImage} />
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
  },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  mainImage: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    textAlign: "justify",
    marginBottom: 20,
  },
  videoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  video: {
    width: width * 0.9,
    height: 200,
    borderRadius: 10,
  },
  galleryContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
  },
  galleryImage: {
    width: 160,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
});