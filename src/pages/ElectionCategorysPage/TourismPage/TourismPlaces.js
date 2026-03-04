import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

const IMAGE_BASE_URL = "https://hdrss-backend.onrender.com/";

export default function TourismPlacesList() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const categories = [
    "All",
    "Hotel",
    "Restaurant",
    "Shopping",
    "Hill Station",
    "Other",
  ];

  useEffect(() => {
    fetchTourismPlaces();
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedCategory, searchQuery, data]);

  const fetchTourismPlaces = async () => {
    try {
      const response = await fetch(
        `https://hdrss-backend.onrender.com/api/tourism/tourismplaces/${id}`
      );
      const result = await response.json();
      setData(result.data || []);
      setFilteredData(result.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...data];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      );
    }

    setFilteredData(filtered);
  };

  /* ================= ACTIONS ================= */

  const openPhone = (phone) => Linking.openURL(`tel:${phone}`);

  const openWhatsApp = (whatsapp) =>
    Linking.openURL(`https://wa.me/${whatsapp.replace(/\D/g, "")}`);

  const openMap = (location) =>
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location
      )}`
    );

  // ✅ FIXED: Navigation to details page
  const handleCardPress = (item) => {
    navigation.navigate("TourismPlaceDetails", {
      place: item,
    });
  };

  /* ================= UI ================= */

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategoryItem,
      ]}
      onPress={() => {
        setSelectedCategory(item);
        setModalVisible(false);
      }}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () =>
    !modalVisible && (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={50} color="#999" />
        <Text style={styles.emptyText}>No places found</Text>
      </View>
    );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.heading, isMobile && styles.mobileHeading]}>
          Tourism Places
        </Text>

        <View style={{ width: 26 }} />
      </View>

      {/* SEARCH + FILTER */}
      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search places..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="filter-list" size={22} color="#fff" />
          <Text style={styles.filterButtonText}>
            {selectedCategory === "All" ? "Category" : selectedCategory}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      {!modalVisible && (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={[
            styles.listContent,
            filteredData.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { width: "48%" }]}
              onPress={() => handleCardPress(item)} // ✅ FIXED
            >
              <Image
                source={{
                  uri: item.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : IMAGE_BASE_URL + item.image
                    : "https://cdn-icons-png.flaticon.com/512/2659/2659360.png",
                }}
                style={styles.cardImage}
              />

              <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>

                {item.category && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {item.category}
                    </Text>
                  </View>
                )}

                {/* ICON ROW */}
                <View style={styles.iconRow}>
                  {item.phone && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        openPhone(item.phone);
                      }}
                    >
                      <FontAwesome name="phone" size={20} color="#93210A" />
                    </TouchableOpacity>
                  )}

                  {item.location && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        openMap(item.location);
                      }}
                    >
                      <FontAwesome5
                        name="map-marker-alt"
                        size={20}
                        color="#2346a5"
                      />
                    </TouchableOpacity>
                  )}

                  {item.whatsapp && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        openWhatsApp(item.whatsapp);
                      }}
                    >
                      <FontAwesome
                        name="whatsapp"
                        size={20}
                        color="#25D366"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* CATEGORY MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    padding: 15,
    marginTop: 30,
  },

  heading: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },

  mobileHeading: { fontSize: 18 },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  filterSection: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  searchInput: { flex: 1 },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  filterButtonText: { color: "#fff", marginLeft: 5 },

  listContent: { padding: 15 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    overflow: "hidden",
  },

  cardImage: { width: "100%", height: 110 },

  cardContent: { padding: 10 },

  title: { fontSize: 15, fontWeight: "600" },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#eef2ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginVertical: 6,
  },

  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2346a5",
  },

  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 10,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#777",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    marginTop:200,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  modalTitle: { fontSize: 18, fontWeight: "bold" },

  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    
    borderBottomColor: "#eee",
  },

  selectedCategoryItem: { backgroundColor: "#f9f9f9" },

  categoryText: { fontSize: 16 },

  selectedCategoryText: {
    color: "#93210A",
    fontWeight: "600",
  },
});

