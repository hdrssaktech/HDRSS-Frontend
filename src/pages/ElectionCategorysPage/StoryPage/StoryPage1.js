import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchStories } from "../../../Controller/StoriesController/StoriesController";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 48) / 2; // spacing calculation

export default function StoryPage1() {
  const navigation = useNavigation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await fetchStories();
        setStories(data);
      } catch (error) {
        console.error("Error loading stories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={26}
          color="#fff"
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        />
        <Text style={styles.title}>Stories</Text>
      </View>

      {/* 🔹 Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#93210A"
            style={{ marginTop: 50 }}
          />
        ) : stories.length === 0 ? (
          <Text style={styles.emptyText}>No stories available.</Text>
        ) : (
          <View style={styles.cardRow}>
            {stories.map((story, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  // ⬇ Extra space for bottom cards
                  index >= stories.length - 2 && { marginBottom: 60 },
                ]}
                onPress={() =>
                  navigation.navigate("StoryPage2", { storyItem: story })
                }
              >
                <Image source={{ uri: story.image }} style={styles.image} />
                <Text style={styles.cardText}>{story.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* --- Styles --- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  backIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 25, // ⬅ added extra top padding to push cards a bit lower
    paddingBottom: 50,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 30,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    marginBottom: 30, // ⬅ increased bottom space for all cards
    overflow: "hidden",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
    borderRadius: 18,
  },
  cardText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    paddingTop: 5,
  },
  emptyText: {
    fontSize: 16,
    color: "#93210A",
    textAlign: "center",
    marginTop: 40,
  },
});