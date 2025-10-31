import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av"; // ✅ Correct import for normal videos
import YoutubePlayer from "react-native-youtube-iframe";

export default function CharitiesPage2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { charity } = route.params;

  // ✅ Fixed GPay URL — you forgot to use backticks
  const openGPay = () => {
    const upiId = "9876543210@upi";
    const name = "ManagerName";
    const amount = "50";
    const url = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

    Linking.openURL(url).catch(() => {
      alert("Please install a UPI payment app to proceed.");
    });
  };

  // ✅ Extract YouTube ID if applicable
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={26}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText} numberOfLines={1}>
          {charity?.name || "Charity Details"}
        </Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        {charity?.bannerImage && (
          <Image source={{ uri: charity.bannerImage }} style={styles.banner} />
        )}

        {/* Details */}
        <View style={styles.content}>
          {charity?.heading && (
            <Text style={styles.heading}>{charity.heading}</Text>
          )}
          {charity?.description && (
            <Text style={styles.description}>{charity.description}</Text>
          )}

          {/* Gallery */}
          {charity?.galleryImages?.length > 0 && (
            <>
              <Text style={styles.subTitle}>Gallery</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {charity.galleryImages.map((img, i) => (
                  <Image key={i} source={{ uri: img }} style={styles.galleryImg} />
                ))}
              </ScrollView>
            </>
          )}

          {/* ✅ Video Section */}
          {charity?.videos?.length > 0 && (
            <View style={{ marginTop: 25, alignItems: "center" }}>
              <Text style={styles.videoTitle}>Videos</Text>
              {charity.videos.map((videoUrl, index) => {
                const youtubeId = extractYouTubeId(videoUrl);
                return (
                  <View key={index} style={{ marginBottom: 20 }}>
                    {youtubeId ? (
                      <YoutubePlayer
                        height={220}
                        width={350}
                        play={false}
                        videoId={youtubeId}
                      />
                    ) : (
                      <Video
                        source={{ uri: videoUrl }}
                        style={styles.video}
                        useNativeControls
                        resizeMode="cover"
                        isLooping
                      />
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Payment Button */}
          <TouchableOpacity style={styles.payButton} onPress={openGPay}>
            <Text style={styles.payButtonText}>Pay ₹50 via GPay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 40,
    zIndex: 10,
    elevation: 5,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    flexShrink: 1,
  },
  scrollContent: { paddingTop: 100, paddingBottom: 20 },
  banner: { width: "100%", height: 200, resizeMode: "cover" },
  content: { padding: 15 },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#93210A",
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 17,
    textAlign: "justify",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 17,
    color: "#93210A",
  },
  galleryImg: {
    width: 120,
    height: 120,
    marginRight: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: 15,
  },
  video: {
    width: 350,
    height: 220,
    borderRadius: 10,
    backgroundColor: "#000",
    marginVertical: 8,
  },
  payButton: {
    backgroundColor: "#00BFA5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
