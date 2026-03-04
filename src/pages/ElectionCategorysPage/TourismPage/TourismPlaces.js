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
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import Loader from "../../../components/Alert/Loader";

const IMAGE_BASE_URL = "https://hdrss-backend.onrender.com/";

export default function TourismPlacesList() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const { width, height } = useWindowDimensions();
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isLargeTablet = width >= 1024;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Responsive size helper
  const responsiveSize = (mobile, tablet, largeTablet) => {
    if (isLargeTablet) return largeTablet || tablet;
    if (isTablet) return tablet;
    return mobile;
  };

  // Responsive columns: 2 on mobile, 3 on tablet, 4 on large tablet
  const numColumns = isLargeTablet ? 4 : (isTablet ? 3 : 2);

  // Calculate card width based on screen size
  const cardWidth = () => {
    const padding = responsiveSize(15, 20, 25);
    const gap = responsiveSize(10, 15, 20);
    const totalGap = gap * (numColumns - 1);
    const availableWidth = width - (padding * 2);
    return (availableWidth - totalGap) / numColumns;
  };

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

  // Navigation to details page
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
      <View style={[
        styles.emptyContainer,
        { marginTop: responsiveSize(40, 60, 80) }
      ]}>
        <Ionicons 
          name="search-outline" 
          size={responsiveSize(50, 70, 90)} 
          color="#999" 
        />
        <Text style={[
          styles.emptyText,
          { fontSize: responsiveSize(16, 18, 20) }
        ]}>
          No places found
        </Text>
      </View>
    );

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      
      {/* HEADER */}
      <View style={[
        styles.header,
        isTablet && styles.headerTablet,
        isLargeTablet && styles.headerLargeTablet
      ]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            isTablet && styles.backButtonTablet
          ]}
        >
          <Ionicons 
            name="chevron-back" 
            size={responsiveSize(24, 28, 32)} 
            color="#fff" 
          />
        </TouchableOpacity>

        <Text style={[
          styles.heading,
          isMobile && styles.mobileHeading,
          isTablet && styles.headingTablet,
          isLargeTablet && styles.headingLargeTablet
        ]}>
          Tourism Places
        </Text>

        <View style={[
          styles.headerSpacer,
          isTablet && styles.headerSpacerTablet
        ]} />
      </View>

      {/* SEARCH + FILTER */}
      <View style={[
        styles.filterSection,
        isTablet && styles.filterSectionTablet
      ]}>
        <View style={[
          styles.searchContainer,
          isTablet && styles.searchContainerTablet
        ]}>
          <Ionicons 
            name="search" 
            size={responsiveSize(18, 20, 22)} 
            color="#666" 
          />
          <TextInput
            style={[
              styles.searchInput,
              isTablet && styles.searchInputTablet
            ]}
            placeholder="Search places..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons 
                name="close" 
                size={responsiveSize(18, 20, 22)} 
                color="#666" 
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            isTablet && styles.filterButtonTablet
          ]}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons 
            name="filter-list" 
            size={responsiveSize(20, 22, 24)} 
            color="#fff" 
          />
          <Text style={[
            styles.filterButtonText,
            isTablet && styles.filterButtonTextTablet
          ]}>
            {selectedCategory === "All" ? "Category" : selectedCategory}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      {!modalVisible && (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          key={numColumns}
          columnWrapperStyle={numColumns > 1 ? {
            justifyContent: "space-between",
            marginBottom: responsiveSize(12, 16, 20)
          } : undefined}
          contentContainerStyle={[
            styles.listContent,
            { paddingHorizontal: responsiveSize(15, 20, 25) },
            filteredData.length === 0 && { flex: 1 },
          ]}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { width: cardWidth() },
                isTablet && styles.cardTablet
              ]}
              onPress={() => handleCardPress(item)}
              activeOpacity={0.85}
            >
              <Image
                source={{
                  uri: item.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : IMAGE_BASE_URL + item.image
                    : "https://cdn-icons-png.flaticon.com/512/2659/2659360.png",
                }}
                style={[
                  styles.cardImage,
                  isTablet && styles.cardImageTablet
                ]}
              />

              <View style={[
                styles.cardContent,
                isTablet && styles.cardContentTablet
              ]}>
                <Text style={[
                  styles.title,
                  isTablet && styles.titleTablet
                ]} numberOfLines={2}>
                  {item.title}
                </Text>

                {item.category && (
                  <View style={[
                    styles.categoryBadge,
                    isTablet && styles.categoryBadgeTablet
                  ]}>
                    <Text style={[
                      styles.categoryBadgeText,
                      isTablet && styles.categoryBadgeTextTablet
                    ]}>
                      {item.category}
                    </Text>
                  </View>
                )}

                {/* ICON ROW */}
                <View style={[
                  styles.iconRow,
                  isTablet && styles.iconRowTablet
                ]}>
                  {item.phone && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        openPhone(item.phone);
                      }}
                    >
                      <FontAwesome 
                        name="phone" 
                        size={responsiveSize(18, 20, 22)} 
                        color="#93210A" 
                      />
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
                        size={responsiveSize(18, 20, 22)}
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
                        size={responsiveSize(18, 20, 22)}
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
          <View style={[
            styles.modalContent,
            { 
              marginTop: responsiveSize(200, 300, 400),
              padding: responsiveSize(20, 24, 28)
            }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[
                styles.modalTitle,
                { fontSize: responsiveSize(18, 20, 22) }
              ]}>
                Select Category
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons 
                  name="close" 
                  size={responsiveSize(22, 24, 26)} 
                  color="#333" 
                />
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
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#93210A",
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTablet: {
    paddingTop: StatusBar.currentHeight + 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerLargeTablet: {
    paddingTop: StatusBar.currentHeight + 25,
    paddingBottom: 24,
    paddingHorizontal: 32,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonTablet: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  heading: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  mobileHeading: { 
    fontSize: 18 
  },
  headingTablet: {
    fontSize: 24,
  },
  headingLargeTablet: {
    fontSize: 28,
  },
  headerSpacer: {
    width: 34,
  },
  headerSpacerTablet: {
    width: 44,
  },

  // Filter Section
  filterSection: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
  },
  filterSectionTablet: {
    padding: 20,
    gap: 15,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  searchContainerTablet: {
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  searchInput: { 
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  searchInputTablet: {
    paddingVertical: 12,
    fontSize: 16,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingHorizontal: 14,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButtonTablet: {
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  filterButtonText: { 
    color: "#fff", 
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "600",
  },
  filterButtonTextTablet: {
    fontSize: 15,
    marginLeft: 8,
  },

  // List Styles
  listContent: { 
    paddingBottom: 30 
  },

  // Card Styles
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
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
  cardImage: { 
    width: "100%", 
    height: 110,
    backgroundColor: "#f0f0f0",
  },
  cardImageTablet: {
    height: 140,
  },
  cardContent: { 
    padding: 10 
  },
  cardContentTablet: {
    padding: 14,
  },
  title: { 
    fontSize: 14, 
    fontWeight: "600",
    color: "#333",
    lineHeight: 18,
  },
  titleTablet: {
    fontSize: 16,
    lineHeight: 20,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#eef2ff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginVertical: 6,
  },
  categoryBadgeTablet: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginVertical: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2346a5",
  },
  categoryBadgeTextTablet: {
    fontSize: 12,
  },

  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 5,
  },
  iconRowTablet: {
    marginTop: 12,
    paddingHorizontal: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    marginTop: 12,
    color: "#777",
    textAlign: "center",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  modalTitle: { 
    fontWeight: "bold",
    color: "#333",
  },

  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  selectedCategoryItem: { 
    backgroundColor: "#f9f9f9" 
  },

  categoryText: { 
    fontSize: 16,
    color: "#333",
  },

  selectedCategoryText: {
    color: "#93210A",
    fontWeight: "600",
  },
});