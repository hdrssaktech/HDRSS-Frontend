import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getPlacesByCategory } from "../../api/api.js";
import Loader from "../../components/Alert/Loader.js";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const numColumns = isTablet ? 3 : 2;

export default function DistrictCategorysPage1() {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId, categoryName, foodType } = route.params;

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPlacesByCategory(districtId, categoryName, foodType);
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching category places:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [districtId, categoryName, foodType]);

  const filteredPlaces = places.filter((item) =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerTitle = foodType ? `${foodType} ${categoryName}s` : `${categoryName}s`;

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
          numberOfLines={1}
        >
          {headerTitle}
        </Text>
        <View style={{ width: isTablet ? 50 : 40 }} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchWrapper, isTablet && styles.searchWrapperTablet]}>
        <View style={[styles.searchBar, isTablet && styles.searchBarTablet]}>
          <Ionicons name="search" size={isTablet ? 20 : 18} color="#93210A" />
          <TextInput
            style={[styles.searchInput, isTablet && styles.searchInputTablet]}
            placeholder="Search by name..."
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

      {/* Grid List */}
      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
        numColumns={numColumns}
        key={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        contentContainerStyle={[
          styles.listContainer,
          isTablet && styles.listContainerTablet,
          filteredPlaces.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("DistrictCategorysPage2", {
                districtId,
                categoryName,
                placeId: item._id || item.id,
              })
            }
            style={[
              styles.cardWrapper,
              {
                width: isTablet
                  ? (screenWidth - 72) / 3
                  : (screenWidth - 48) / 2,
              },
              index % numColumns !== numColumns - 1 && styles.cardMarginRight,
            ]}
            activeOpacity={0.9}
          >
            <View style={[styles.card, isTablet && styles.cardTablet]}>
              <Image
                source={{ uri: item.image }}
                style={[styles.image, isTablet && styles.imageTablet]}
                resizeMode="cover"
              />
              <View style={styles.textContainer}>
                <Text
                  style={[styles.name, isTablet && styles.nameTablet]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                {item.location && (
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={11} color="#93210A" />
                    <Text
                      style={[styles.location, isTablet && styles.locationTablet]}
                      numberOfLines={1}
                    >
                      {item.location}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={56} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? `No results for "${searchQuery}"`
                : `No ${headerTitle} found`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F2F2F2" },

  /* Header */
  header: {
    backgroundColor: "#93210A",
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
    fontSize: 20, fontWeight: "800",
    letterSpacing: 0.3, textTransform: "capitalize",
    paddingHorizontal: 8,
  },
  headerTitleTablet: { fontSize: 26 },

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
    borderColor: "rgba(147,33,10,0.15)",
  },
  searchBarTablet: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  searchInput: {
    flex: 1, fontSize: 14, color: "#1A1A1A",
    padding: 0, fontWeight: "500",
  },
  searchInputTablet: { fontSize: 16 },

  /* List */
  listContainer: { padding: 14, paddingBottom: 30 },
  listContainerTablet: { padding: 22, paddingBottom: 40 },
  emptyListContainer: { flexGrow: 1 },
  row: { justifyContent: "space-between" },

  /* Card */
  cardWrapper: { marginBottom: 16 },
  cardMarginRight: { marginRight: 0 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  cardTablet: { borderRadius: 20, padding: 12 },
  image: {
    width: "100%", height: 150,
    borderRadius: 14, backgroundColor: "#EEE",
  },
  imageTablet: { height: 180, borderRadius: 16 },

  /* Card Text */
  textContainer: { marginTop: 8, paddingHorizontal: 2 },
  name: {
    fontSize: 13, fontWeight: "800",
    color: "#2B2B2B", marginBottom: 4,
  },
  nameTablet: { fontSize: 16 },
  locationRow: {
    flexDirection: "row", alignItems: "center", gap: 3,
  },
  location: { fontSize: 11, color: "#777", flex: 1 },
  locationTablet: { fontSize: 13 },

  /* Empty */
  emptyContainer: {
    flex: 1, justifyContent: "center",
    alignItems: "center", marginTop: 60, gap: 12,
  },
  emptyText: {
    fontSize: 15, color: "#888",
    fontWeight: "600", textAlign: "center",
  },
});