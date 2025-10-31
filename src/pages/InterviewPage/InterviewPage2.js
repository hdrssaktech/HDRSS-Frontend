import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Sample Video Data (with YouTube IDs)
const VIDEO_DATA = [
  {
    id: "1",
    videoId: "6cT4SV2xhRg", // YouTube Video ID
    category: "Political Videos - Debate Highlights",
  },
  {
    id: "2",
    videoId: "6cT4SV2xhRg",
    category: "Political Videos - Election Analysis",
  },
  {
    id: "3",
    videoId: "6cT4SV2xhRg",
    category: "Political Videos - Public Speech",
  },
];

export default function InterviewPage2({ navigation }) {
  const renderItem = ({ item }) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("VideoPlayer", { videoId: item.videoId })} >
        <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
       
        {/* Bottom Label */}
        <View style={styles.bottomLabel}>
          <Text style={styles.category}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Political Videos</Text>
      </View>

      {/* Video List */}
      <FlatList
        data={VIDEO_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 32,
    backgroundColor: '#93210A',
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  card: {
    margin: 18,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  channel: {
    color: "#eee",
    fontSize: 12,
  },
  bottomLabel: {
    padding: 10,
    alignItems: "center",
  },
  category: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8B4513",
  },
});
