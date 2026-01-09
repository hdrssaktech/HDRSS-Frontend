
// src/screens/DistrictCategorysPage1.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getPlacesByCategory } from "../../api/api.js";

export default function DistrictCategorysPage1() {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId, categoryName, foodType } = route.params;
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const { width: screenWidth } = Dimensions.get("window");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPlacesByCategory(districtId, categoryName, foodType);
        console.log("✅ Loaded places:", data);
        setPlaces(data);
      } catch (error) {
        console.error("❌ Error fetching category places:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [districtId, categoryName, foodType]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🔙 Fixed Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {foodType ? `${foodType} ${categoryName}s` : `${categoryName}s`}
          </Text>
        </View>
      </View>

      {/* 🔽 Content Section */}
      <View style={styles.content}>
        {places.length === 0 ? (
          <Text style={styles.noDataText}>No {foodType} places found.</Text>
        ) : (
          <FlatList
            data={places}
            keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{ paddingBottom: 30 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("DistrictCategorysPage2", {
                    districtId,
                    categoryName,
                    placeId: item._id || item.id,
                  })
                }
              >
                <View style={[styles.card, { width: screenWidth / 2 - 20 }]}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.name}</Text>
                    {item.location && (
                      <Text style={styles.location}>{item.location}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // 🔝 Sticky Header
  headerContainer: {
    backgroundColor: "#93210A",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical:35,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  backButton: {
    borderRadius: 30,
    padding: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginRight: 49, // balances title position visually
    textTransform: "capitalize",
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  row: { justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    resizeMode: "cover",
  },
  textContainer: { marginTop: 8 },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  location: { fontSize: 12, color: "#777", marginTop: 3 },
  noDataText: {
    textAlign: "center",
    marginTop: 60,
    color: "#888",
    fontSize: 16,
  },
});
