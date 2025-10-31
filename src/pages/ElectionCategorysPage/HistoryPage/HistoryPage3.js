import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";

const { width } = Dimensions.get("window");

export default function HistoryPage3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.title}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Banner */}
        <Image source={{ uri: data.bannerImage }} style={styles.banner} />

        {/* Title & Description */}
        <View style={styles.section}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>

        {/* 🎥 Video Section */}
        {data.video && data.video.trim() !== "" ? (
          <View style={styles.section}>
            <Text style={styles.label}>Video</Text>
            <Video
              source={{ uri: data.video }}
              useNativeControls
              resizeMode="contain"
              style={styles.video}
              shouldPlay={false}
            />
          </View>
        ) : (
          <Text style={styles.noVideo}>🎥 No video available</Text>
        )}

        {/* 🖼️ Horizontal Gallery */}
        {data.gallery && data.gallery.length > 0 && (
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
    width: "90%",
    height: 200,
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 10,
  },

  section: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#333",
    textAlign: "justify",
  },

  label: {
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 4,
  },

  video: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    backgroundColor: "#000",
  },

  galleryImage: {
    width: width * 0.6,
    height: 140,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#93210A",
  },

  noVideo: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginVertical: 10,
  },
});
