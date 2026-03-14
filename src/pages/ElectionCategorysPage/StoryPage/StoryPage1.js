import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchStories } from "../../../Controller/StoriesController/StoriesController";
import Loader from "../../../components/Alert/Loader";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ALL = "அனைத்தும்";

export default function StoryPage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const numColumns = 2;

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  const gap = isTablet ? 20 : 16;
  const padding = 16;
  const CARD_WIDTH = (width - padding * 2 - gap * (numColumns - 1)) / numColumns;

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

  // Unique titles for modal list
  const filterOptions = [ALL, ...new Set(stories.map((s) => s.title).filter(Boolean))];

  // Modal list filtered by search
  const modalOptions = filterOptions.filter((opt) =>
    opt.toLowerCase().includes(modalSearch.toLowerCase())
  );

  // Main grid filtered by selected title
  const filteredStories =
    activeFilter === ALL
      ? stories
      : stories.filter((item) => item.title === activeFilter);

  const handleSelect = (option) => {
    setActiveFilter(option);
    setModalVisible(false);
    setModalSearch("");
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* HEADER */}
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
        <View style={styles.headerSide} />
      </View>

      {/* FILTER TRIGGER */}
      <View style={styles.filterTriggerWrapper}>
        <TouchableOpacity
          style={styles.filterTrigger}
          onPress={() => { setModalSearch(""); setModalVisible(true); }}
          activeOpacity={0.8}
        >
          <Ionicons name="funnel-outline" size={16} color="#93210A" />
          <Text style={styles.filterTriggerText} numberOfLines={1}>
            {activeFilter}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#93210A" />
        </TouchableOpacity>

        {activeFilter !== ALL && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setActiveFilter(ALL)}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle" size={18} color="#93210A" />
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FILTER MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>வகையைத் தேர்ந்தெடுக்கவும்</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalSearchBar}>
            <Ionicons name="search" size={17} color="#93210A" />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="தேடுக..."
              placeholderTextColor="#aaa"
              value={modalSearch}
              onChangeText={setModalSearch}
              autoCorrect={false}
            />
            {modalSearch.length > 0 && (
              <TouchableOpacity onPress={() => setModalSearch("")} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={17} color="#aaa" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={modalOptions}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.modalList}
            renderItem={({ item }) => {
              const selected = activeFilter === item;
              return (
                <TouchableOpacity
                  style={[styles.modalItem, selected && styles.modalItemActive]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.modalItemText, selected && styles.modalItemTextActive]}>
                    {item}
                  </Text>
                  {selected && (
                    <Ionicons name="checkmark-circle" size={20} color="#93210A" />
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.modalEmpty}>
                <Text style={styles.modalEmptyText}>எதுவும் கிடைக்கவில்லை</Text>
              </View>
            }
          />
        </View>
      </Modal>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isTablet && styles.scrollContainerTablet,
          filteredStories.length === 0 && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {stories.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="book-outline" size={isTablet ? 80 : 60} color="#ccc" />
            <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
              No stories available
            </Text>
          </View>
        ) : filteredStories.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="search-outline" size={isTablet ? 70 : 50} color="#ccc" />
            <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
              எதுவும் கிடைக்கவில்லை
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredStories.map((story, index) => {
              const isLastInRow = (index + 1) % numColumns === 0;
              return (
                <TouchableOpacity
                  key={story.id || index}
                  style={[
                    styles.card,
                    {
                      width: CARD_WIDTH,
                      marginRight: !isLastInRow ? gap : 0,
                      marginBottom: gap,
                    },
                    isTablet && styles.cardTablet,
                  ]}
                  onPress={() => navigation.navigate("StoryPage2", { storyItem: story })}
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  /* HEADER — original unchanged */
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
  headerTablet: { paddingTop: 45, paddingBottom: 28, paddingHorizontal: 18 },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center", marginLeft: 15,
  },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25 },
  headerTitle: {
    flex: 1, textAlign: "center", color: "#fff",
    fontSize: 20, fontWeight: "800", letterSpacing: 0.3,
  },
  headerTitleTablet: { fontSize: 26 },
  headerSide: { width: 55 },

  /* FILTER TRIGGER */
  filterTriggerWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", paddingHorizontal: 16,
    paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)", gap: 10,
    elevation: 2, shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3,
  },
  filterTrigger: {
    flex: 1, flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFF0EE", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 9,
    borderWidth: 1.5, borderColor: "rgba(147,33,10,0.2)", gap: 8,
  },
  filterTriggerText: { flex: 1, fontSize: 13, fontWeight: "700", color: "#93210A" },
  clearBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8,
    backgroundColor: "#FFF0EE", borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.2)",
  },
  clearBtnText: { fontSize: 12, fontWeight: "700", color: "#93210A" },

  /* MODAL */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  modalSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: SCREEN_HEIGHT * 0.65, backgroundColor: "#fff",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    overflow: "hidden", elevation: 20, shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15, shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.07)",
  },
  modalTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A1A" },
  modalCloseBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "#F5F5F5",
    alignItems: "center", justifyContent: "center",
  },
  modalSearchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F5F5F5", borderRadius: 12,
    marginHorizontal: 16, marginVertical: 12,
    paddingHorizontal: 12, paddingVertical: 10,
    gap: 8, borderWidth: 1, borderColor: "rgba(147,33,10,0.15)",
  },
  modalSearchInput: { flex: 1, fontSize: 14, color: "#1A1A1A", padding: 0, fontWeight: "500" },
  modalList: { paddingHorizontal: 16, paddingBottom: 30 },
  modalItem: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 10, marginBottom: 4, backgroundColor: "#fff",
  },
  modalItemActive: { backgroundColor: "rgba(147,33,10,0.06)" },
  modalItemText: { fontSize: 14, color: "#333", fontWeight: "500", flex: 1 },
  modalItemTextActive: { color: "#93210A", fontWeight: "800" },
  modalEmpty: { alignItems: "center", paddingTop: 40 },
  modalEmptyText: { fontSize: 14, color: "#aaa", fontWeight: "600" },

  /* SCROLL — original unchanged */
  scrollContainer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },
  scrollContainerTablet: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 40 },

  /* GRID — original unchanged */
  grid: { flexDirection: "row", flexWrap: "wrap" },

  /* CARD — original unchanged */
  card: {
    backgroundColor: "#fff", borderRadius: 12, overflow: "hidden",
    elevation: 3, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
    borderWidth: 1, borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 16, elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 6,
  },
  image: { width: "100%", height: 120, backgroundColor: "#f5f5f5" },
  imageTablet: { height: 160 },
  bottomRow: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#fff" },
  bottomRowTablet: { paddingHorizontal: 16, paddingVertical: 14 },
  title: { fontSize: 14, fontWeight: "600", color: "#333", textAlign: "center", lineHeight: 20 },
  titleTablet: { fontSize: 18, lineHeight: 24 },

  /* EMPTY */
  center: {
    flex: 1, justifyContent: "center",
    alignItems: "center", padding: 40, minHeight: 300,
  },
  emptyText: { marginTop: 15, color: "#666", fontSize: 16, textAlign: "center" },
  emptyTextTablet: { fontSize: 18, marginTop: 20 },
});

