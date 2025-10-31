import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function TownPage2() {
  const route = useRoute();
  const navigation = useNavigation();
  const { town } = route.params;
  const [showMore, setShowMore] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    if (town.add && town.add.length > 1) {
      let index = 0;
      const timer = setInterval(() => {
        index = (index + 1) % town.add.length;
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [town.add]);

  if (!town) {
    return (
      <View style={styles.center}>
        <Text>No town data available.</Text>
      </View>
    );
  }

  const aboutText = showMore
    ? town.about
    : town.about?.slice(0, 180) + (town.about?.length > 180 ? "..." : "");

  return (
    <ScrollView style={styles.container}>
      {/* 🏙 Banner */}
      <View style={styles.bannerContainer}>
        {town.bannerImage && (
          <Image source={{ uri: town.bannerImage }} style={styles.bannerImage} />
        )}
        <View style={styles.overlay} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.bannerTitle}>{town.title || town.townname}</Text>
      </View>

      {/* 📝 About */}
      {town.about && (
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>{aboutText}</Text>
          {town.about?.length > 180 && (
            <TouchableOpacity onPress={() => setShowMore(!showMore)}>
              <Text style={styles.showMore}>
                {showMore ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 🖼 Add / Gallery */}
      {town.add && town.add.length > 0 && (
        <View style={styles.galleryContainer}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={town.add}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.smallImage} />
            )}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
          />
        </View>
      )}

      {/* 🌄 Famous Places */}
      {town.famousPlaces && town.famousPlaces.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Famous Places</Text>
          {town.famousPlaces.map((place, index) => (
            <View
              key={index}
              style={[
                styles.placeBox,
                styles.altRow,
                { flexDirection: index % 2 === 0 ? "row" : "row-reverse" },
              ]}
            >
              <Image source={{ uri: place.image }} style={styles.circleImage} />
              <View style={styles.altTextContainer}>
                <Text style={styles.altDescription}>{place.description}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 🚗 Tourist Spots */}
      {town.tourist && town.tourist.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tourist Spots</Text>
          {town.tourist.map((spot, index) => (
            <View
              key={index}
              style={[
                styles.placeBox,
                styles.altRow,
                { flexDirection: index % 2 === 0 ? "row" : "row-reverse" },
              ]}
            >
              <Image source={{ uri: spot.image }} style={styles.circleImage} />
              <View style={styles.altTextContainer}>
                <Text style={styles.altName}>{spot.name}</Text>
                <Text style={styles.altDistance}>{spot.distance}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 🎥 Videos */}
      {town.videos && town.videos.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Videos</Text>
          {town.videos.map((vid, index) => {
            const videoId = extractYouTubeId(vid.videoUrl);
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            return (
              <View key={index} style={styles.videoContainer}>
                <WebView
                  source={{ uri: embedUrl }}
                  style={styles.video}
                  javaScriptEnabled
                  domStorageEnabled
                />
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

// ✅ Helper: Extract YouTube ID
function extractYouTubeId(url) {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },

  /* Banner */
  bannerContainer: { position: "relative" },
  bannerImage: {
    width: "100%",
    height: 250,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 5,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
    left: 75,
    bottom: 200,
  },

  /* About */
  aboutContainer: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  aboutText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    textAlign: "justify",
  },
  showMore: {
    color: "#93210A",
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 5,
  },

  /* Gallery */
  galleryContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  smallImage: {
    width: width - 60,
    height: 200,
    borderRadius: 0,
    marginRight: 10,
  },

  /* Sections */
  sectionContainer: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 10,
    left: 100,
  },

  /* Famous & Tourist */
  altRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  placeBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    marginVertical: 1,
  },
  circleImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#eee",
    marginHorizontal: 5,
  },
  altTextContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  altDescription: {
    fontSize: 15,
    color: "#333",
    textAlign: "justify",
  },
  altName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#93210A",
  },
  altDistance: {
    color: "#555",
    fontSize: 14,
    marginTop: 5,
  },

  /* Video */
  videoContainer: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});