// src/components/Gallery/GalleryInformation.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { Video } from "expo-av";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function GalleryInformation() {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, mainImage, description, images = [], videoLink } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () =>
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  const handlePrev = () =>
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));

  // ✅ Extract YouTube ID if it’s a YouTube link
  const extractYouTubeId = (url) => {
    const match = url?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const videoId = extractYouTubeId(videoLink);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Gallery</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.mainTitle}>{title}</Text>
          <Image source={mainImage} style={styles.mainImage} />
          <Text style={styles.info}>{description}</Text>
        </View>

        {images.length > 0 && (
          <View style={styles.imageRow}>
            <TouchableOpacity onPress={handlePrev}>
              <Icon name="chevron-left" size={40} color="#93210A" />
            </TouchableOpacity>
            <Image
              source={{ uri: images[currentIndex]?.url }}
              style={styles.sliderImage}
              resizeMode="cover"
            />
            <TouchableOpacity onPress={handleNext}>
              <Icon name="chevron-right" size={40} color="#93210A" />
            </TouchableOpacity>
          </View>
        )}

        {/* ✅ Show video after gallery (no title) */}
        {videoLink && (
          <View style={{ alignItems: "center", marginVertical: 20 }}>
            {videoId ? (
              <YoutubePlayer height={220} width={350} play={false} videoId={videoId} />
            ) : (
              <Video
                source={{ uri: videoLink }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={false}
                useNativeControls
                style={{ width: 350, height: 220, borderRadius: 10 }}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
header: {
  backgroundColor: "#93210A",
  padding: 40,
  alignItems: "center",
  justifyContent: "center",
 
  position: "relative",
  flexDirection: "column",
},

backButton: {
  position: "absolute",
  left: 15,    // keep back button on left
},

title: {
  fontSize: 22,
  fontWeight: "bold",
  color: "white",
},

  section: { padding: 15 },
  mainTitle: { marginTop: 15, fontSize: 24, fontWeight: "600", color: "#93210A" },
  mainImage: {
    width: "90%",
    height: 220,
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 10,
  },
  info: { marginTop: 35, fontSize: 16, color: "#333", lineHeight: 20, textAlign: "justify" },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  sliderImage: { width: 250, height: 200, borderRadius: 10, marginHorizontal: 10 },
});