import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchStories } from "../../../Controller/StoriesController/StoriesController";
import { TextInput } from "react-native";

export default function StoryPage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredStories, setFilteredStories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);


  // 🔹 Responsive card size
  const CARD_SIZE = isTablet
    ? (width - 64) / 2// 3 cards in tablet
    : (width - 48) / 2; // 2 cards in mobile

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await fetchStories();
        setStories(data);
        setFilteredStories(data);
      } catch (error) {
        console.error("Error loading stories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);
  const handleSearch = (text) => {
    setSearchText(text);
    setShowSuggestions(true);

    const filtered = stories.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredStories(filtered);
  };
    const handleSelectStory = (title) => {
    setSearchText(title);
    setShowSuggestions(false);

    const filtered = stories.filter(
      (item) => item.title === title
    );
    setFilteredStories(filtered);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔹 HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <Ionicons
          name="chevron-back"
          size={isTablet ? 32 : 26}
          color="#fff"
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        />
        <Text style={[styles.title, isTablet && styles.titleTablet]}>
          Stories
        </Text>
      </View>

      <View style={styles.searchWrapper}>
  <View style={styles.searchContainer}>
    <Ionicons name="search" size={20} color="#999" />
    <TextInput
      placeholder="Search stories..."
      value={searchText}
      onChangeText={handleSearch}
      onFocus={() => {
        setShowSuggestions(true);
        setFilteredStories(stories); // show all titles on click
      }}
      style={styles.searchInput}
      placeholderTextColor="#999"
    />
  </View>

  {/* 🔽 Suggestions */}
  {showSuggestions && filteredStories.length > 0 && (
    <View style={styles.suggestionBox}>
      {filteredStories.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionItem}
          onPress={() => handleSelectStory(item.title)}
        >
          <Text style={styles.suggestionText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>



      {/* 🔹 CONTENT */}
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
            {filteredStories.map((story, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  {
                    width: CARD_SIZE,
                    height: CARD_SIZE,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("StoryPage2", {
                    storyItem: story,
                  })
                }
              >
                <Image source={{ uri: story.image }} style={styles.image} />
                <Text
                  style={[
                    styles.cardText,
                    isTablet && styles.cardTextTablet,
                  ]}
                >
                  {story.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* 🔹 HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  headerTablet: {
    paddingVertical: 35,
    paddingHorizontal: 24,
    marginTop:-28,
  },
  backIcon: {
    marginRight: 10,
  },
searchWrapper: {
  marginHorizontal: 16,
  marginTop: 15,
  zIndex: 10,
},

searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#f5f5f5",
  borderRadius: 12,
  paddingHorizontal: 12,
  height: 45,
},

searchInput: {
  flex: 1,
  marginLeft: 8,
  fontSize: 14,
  color: "#333",
},

suggestionBox: {
  backgroundColor: "#fff",
  borderRadius: 10,
  marginTop: 6,
  maxHeight: 200,
  elevation: 4,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
},

suggestionItem: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},

suggestionText: {
  fontSize: 14,
  color: "#333",
},


 title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 22, marginLeft: 65,
    padding:8,
   

  },

  titleTablet: {
    fontSize: 28,
    padding:8,
    left:125,
  },

  /* 🔹 CONTENT */
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 25,
    paddingBottom: 50,
  },

  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    marginBottom: 30,
    overflow: "hidden",
    alignItems: "center",
    padding:10
  },

  image: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
  },

  cardText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    paddingTop: 6,
    paddingHorizontal: 6,
  },
  cardTextTablet: {
    fontSize: 16,
  },

  emptyText: {
    fontSize: 16,
    color: "#93210A",
    textAlign: "center",
    marginTop: 40,
  },
});
