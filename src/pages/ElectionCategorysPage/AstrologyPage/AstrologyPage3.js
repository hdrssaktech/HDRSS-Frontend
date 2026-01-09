// src/pages/Astrology/AstrologyPage3.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation } from "@react-navigation/native";

export default function AstrologyPage3({ route }) {
  const navigation = useNavigation();
  const { astrologyItem } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const getYouTubeId = (url) =>
    url?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];

  return (
    <View style={styles.container}>
      {/* 🔴 HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            isTablet && styles.headerTitleTablet,
          ]}
        >
          {astrologyItem.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 🖼️ MAIN IMAGE */}
        <Image
          source={{ uri: astrologyItem.image }}
          style={[
            styles.mainImage,
            isTablet && styles.mainImageTablet,
          ]}
        />

        {/* 🏷️ TITLE */}
        <Text style={[styles.title, isTablet && styles.titleTablet]}>
          {astrologyItem.title}
        </Text>

        {/* 📄 DESCRIPTION */}
        <Text
          style={[
            styles.description,
            isTablet && styles.descriptionTablet,
          ]}
        >
          {astrologyItem.description}
        </Text>

        {/* 🎥 VIDEO */}
        {astrologyItem.video && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                isTablet && styles.sectionTitleTablet,
              ]}
            >
              Video
            </Text>

            <View
              style={[
                styles.videoWrapper,
                isTablet && styles.videoWrapperTablet,
              ]}
            >
              <YoutubePlayer
                height={isTablet ? 340 : 220}
                width={width - 32}
                videoId={getYouTubeId(astrologyItem.video)}
              />
            </View>
          </View>
        )}

        {/* 🖼️ GALLERY */}
        {astrologyItem.gallery?.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                isTablet && styles.sectionTitleTablet,
              ]}
            >
              Gallery
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {astrologyItem.gallery.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={[
                    styles.galleryImg,
                    isTablet && styles.galleryImgTablet,
                  ]}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  /* 🔹 CONTAINER */
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* 🔴 HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },

  headerTablet: {
    paddingVertical: 35,
    paddingHorizontal: 25,
    marginTop: -3,
  },

   headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20, marginLeft: 33,
    padding:8,
   

  },

  headerTitleTablet: {
    fontSize: 28,
    padding:8,
    left:125,
  },

  /* 📜 CONTENT */
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  /* 🖼️ IMAGE */
  mainImage: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    marginBottom: 20,
  },

  mainImageTablet: {
    height: 340,
  },

  /* 🏷️ TITLE */
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 12,
  },

  titleTablet: {
    fontSize: 24,
  },

  /* 📄 DESCRIPTION */
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "justify",
    marginBottom: 28,
  },

  descriptionTablet: {
    fontSize: 18,
    lineHeight: 30,
  },

  /* 📦 SECTION */
  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 12,
  },

  sectionTitleTablet: {
    fontSize: 26,
  },

  /* 🎥 VIDEO */
  videoWrapper: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  videoWrapperTablet: {
    borderRadius: 22,
  },

  /* 🖼️ GALLERY */
  galleryImg: {
    width: 200,
    height: 150,
    borderRadius: 14,
    marginRight: 12,
  },

  galleryImgTablet: {
    width: 260,
    height: 190,
  },
});
