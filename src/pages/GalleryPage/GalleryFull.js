import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { fetchGalleryList } from "../../Controller/GalleryController/GalleryController";
import Loader from "../../components/Alert/Loader";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;
const numColumns = isTablet ? 3 : 2;

export default function GalleryFull() {
  const navigation = useNavigation();
  const route = useRoute();
  const { districtId } = route.params || {};

  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTitle, setActiveTitle] = useState("All");

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchGalleryList(districtId);
      setGalleryList(data || []);
      setLoading(false);
    };
    loadData();
  }, []);

  // Unique titles for filter chips
  const titles = ["All", ...new Set(galleryList.map((item) => item.title).filter(Boolean))];

  // Apply both filters
  const filteredList = galleryList.filter((item) => {
    const matchesTitle = activeTitle === "All" || item.title === activeTitle;
    const matchesSearch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTitle && matchesSearch;
  });

  if (loading) return <Loader />;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, isTablet && styles.cardTablet]}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("GalleryPage2", {
          title: item.title,
          mainImage: { uri: item.thumbnail },
          description: item.description,
          images: item.images,
          videoLink: item.videoLink,
        })
      }
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={[styles.image, isTablet && styles.imageTablet]}
        resizeMode="cover"
      />
      <View style={styles.titleBox}>
        <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />

      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Gallery
        </Text>
        <View style={[styles.headerRightSpace, isTablet && styles.headerRightSpaceTablet]} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchWrapper, isTablet && styles.searchWrapperTablet]}>
        <View style={[styles.searchBar, isTablet && styles.searchBarTablet]}>
          <Ionicons name="search" size={isTablet ? 20 : 18} color="#8B0000" />
          <TextInput
            style={[styles.searchInput, isTablet && styles.searchInputTablet]}
            placeholder="Search by title..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={isTablet ? 20 : 18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      {titles.length > 1 && (
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterBar}
          >
            {titles.map((t) => {
              const active = activeTitle === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setActiveTitle(t)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Grid List */}
      <FlatList
        data={filteredList}
        key={numColumns}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.listContainer,
          isTablet && styles.listContainerTablet,
          filteredList.length === 0 && styles.emptyListContainer,
        ]}
        columnWrapperStyle={numColumns > 1 ? styles.row : null}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Ionicons name="images-outline" size={56} color="#ccc" />
            <Text style={styles.noDataText}>
              {searchQuery.trim() ? `No results for "${searchQuery}"` : "No gallery found"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F2F2F2" },

  /* Header */
  header: {
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 12 : 40,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerTablet: {
    paddingHorizontal: 26,
    paddingTop: Platform.OS === "ios" ? 16 : 48,
    paddingBottom: 22,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  backButton: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center", justifyContent: "center",
  },
  backButtonTablet: { width: 52, height: 52, borderRadius: 26 },
  headerTitle: {
    flex: 1, textAlign: "center", color: "#fff",
    fontSize: 22, fontWeight: "800", letterSpacing: 0.3,
  },
  headerTitleTablet: { fontSize: 28 },
  headerRightSpace: { width: 42 },
  headerRightSpaceTablet: { width: 52 },

  /* Search Bar */
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  searchWrapperTablet: { paddingHorizontal: 26, paddingVertical: 14 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(139,0,0,0.15)",
  },
  searchBarTablet: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  searchInput: {
    flex: 1, fontSize: 14, color: "#1A1A1A",
    padding: 0, fontWeight: "500",
  },
  searchInputTablet: { fontSize: 16 },

  /* Filter Chips */
  filterWrapper: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFF0EE",
    borderWidth: 1.5,
    borderColor: "rgba(139,0,0,0.2)",
  },
  chipActive: { backgroundColor: "#8B0000", borderColor: "#8B0000" },
  chipText: { fontSize: 13, fontWeight: "700", color: "#8B0000" },
  chipTextActive: { color: "#fff" },

  /* List */
  listContainer: { padding: 14, paddingBottom: 24 },
  listContainerTablet: { padding: 22, paddingBottom: 30 },
  row: { justifyContent: "space-between", marginBottom: 16 },

  /* Card */
  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 18,
    padding: 10,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  cardTablet: { width: "31.5%", borderRadius: 20, padding: 12, marginBottom: 18 },
  image: { width: "100%", height: 150, borderRadius: 16, backgroundColor: "#EEE" },
  imageTablet: { height: 190, borderRadius: 18 },
  titleBox: { paddingTop: 10, paddingHorizontal: 2, paddingBottom: 4 },
  title: { fontSize: 13, fontWeight: "800", color: "#2B2B2B" },
  titleTablet: { fontSize: 18 },

  /* Empty */
  noDataContainer: {
    flex: 1, justifyContent: "center",
    alignItems: "center", marginTop: 60, gap: 12,
  },
  noDataText: { fontSize: 15, color: "#888", fontWeight: "600", textAlign: "center" },
  emptyListContainer: { flexGrow: 1, justifyContent: "center" },
});