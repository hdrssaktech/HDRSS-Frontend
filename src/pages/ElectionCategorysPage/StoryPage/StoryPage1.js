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
  TextInput,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchStories } from "../../../Controller/StoriesController/StoriesController";
import Loader from "../../../components/Alert/Loader";

export default function StoryPage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredStories, setFilteredStories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Always use 2 columns for both mobile and tablet like PoojaPage1
  const numColumns = 2;
  
  // Calculate card width for perfect grid
  const cardWidth = () => {
    const padding = 16; // horizontal padding from scrollContainer
    const gap = isTablet ? 20 : 16;
    const totalGap = gap * (numColumns - 1);
    const availableWidth = width - (padding * 2);
    return (availableWidth - totalGap) / numColumns;
  };

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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={isTablet ? 80 : 60} color="#ccc" />
      <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
        No stories available
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchWrapper}>
      <View style={[styles.searchContainer, isTablet && styles.searchContainerTablet]}>
        <Ionicons name="search" size={isTablet ? 22 : 20} color="#999" />
        <TextInput
          placeholder="Search stories..."
          value={searchText}
          onChangeText={handleSearch}
          onFocus={() => {
            setShowSuggestions(true);
            setFilteredStories(stories);
          }}
          style={[styles.searchInput, isTablet && styles.searchInputTablet]}
          placeholderTextColor="#999"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close" size={isTablet ? 22 : 20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Suggestions */}
      {showSuggestions && filteredStories.length > 0 && (
        <View style={[styles.suggestionBox, isTablet && styles.suggestionBoxTablet]}>
          {filteredStories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleSelectStory(item.title)}
            >
              <Text style={[styles.suggestionText, isTablet && styles.suggestionTextTablet]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* Header - Exactly like PoojaPage1 */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Stories
        </Text>
      </View>

      {/* Search Bar */}
      {renderSearchBar()}

      {/* Content */}
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer, 
          isTablet && styles.scrollContainerTablet,
          stories.length === 0 && { flex: 1 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {stories.length === 0 ? (
          renderEmptyState()
        ) : filteredStories.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={isTablet ? 70 : 50} color="#ccc" />
            <Text style={[styles.noResultsText, isTablet && styles.noResultsTextTablet]}>
              No stories match "{searchText}"
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredStories.map((story, index) => {
              const isLastInRow = (index + 1) % numColumns === 0;
              const gap = isTablet ? 11 : 16;
              
              return (
                <TouchableOpacity
                  key={story.id || index}
                  style={[
                    styles.card,
                    {
                      width: cardWidth(),
                      marginRight: !isLastInRow ? gap : 0,
                      marginBottom: gap,
                    },
                    isTablet && styles.cardTablet,
                  ]}
                  onPress={() =>
                    navigation.navigate("StoryPage2", {
                      storyItem: story,
                    })
                  }
                  activeOpacity={0.85}
                >
                  <Image 
                    source={{ uri: story.image }} 
                    style={[styles.image, isTablet && styles.imageTablet]} 
                    resizeMode="cover"
                  />
                  
                  <View style={[styles.bottomRow, isTablet && styles.bottomRowTablet]}>
                    <Text
                      style={[styles.title, isTablet && styles.titleTablet]}
                      numberOfLines={2}
                    >
                      {story.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* Header - Exactly like PoojaPage1 */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTablet: {
    paddingTop: 45,
    paddingBottom: 28,
    paddingHorizontal: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginRight: 70,
  },
  headerTitleTablet: {
    fontSize: 26,
    marginRight: 70,
  },

  /* Search Bar */
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
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  searchContainerTablet: {
    height: 55,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  searchInputTablet: {
    fontSize: 16,
  },
  suggestionBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 6,
    maxHeight: 200,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  suggestionBoxTablet: {
    borderRadius: 16,
    maxHeight: 250,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
  },
  suggestionTextTablet: {
    fontSize: 16,
  },

  /* Scroll Container */
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  scrollContainerTablet: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },

  /* Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  /* Card - Exactly like PoojaPage1 */
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  /* Image */
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#f5f5f5",
  },
  imageTablet: {
    height: 160,
  },

  /* Bottom Row - Exactly like PoojaPage1 */
  bottomRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  bottomRowTablet: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  /* Title - Exactly like PoojaPage1 */
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    lineHeight: 20,
  },
  titleTablet: {
    fontSize: 18,
    lineHeight: 24,
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 300,
  },
  emptyText: {
    marginTop: 15,
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  emptyTextTablet: {
    fontSize: 18,
    marginTop: 20,
  },

  /* No Results */
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 300,
  },
  noResultsText: {
    marginTop: 15,
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  noResultsTextTablet: {
    fontSize: 18,
    marginTop: 20,
  },
});