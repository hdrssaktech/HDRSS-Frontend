

// src/screens/DistrictCategorysPage1.js
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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getPlacesByCategory } from "../../api/api.js";
import Loader from "../../components/Alert/Loader.js";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 600;

// Responsive columns
const numColumns = isTablet ? 3 : 2;

export default function DistrictCategorysPage1() {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId, categoryName, foodType } = route.params;
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPlacesByCategory(districtId, categoryName, foodType);
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
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* 🔙 Fixed Header */}
      <View style={[styles.headerContainer, isTablet && styles.headerContainerTablet]}>
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, isTablet && styles.backButtonTablet]}>
            <Ionicons name="chevron-back" size={isTablet ? 28 : 24} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
            {foodType ? `${foodType} ${categoryName}s` : `${categoryName}s`}
          </Text>
          <View style={{ width: isTablet ? 44 : 40 }} />
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
            numColumns={numColumns}
            key={numColumns} // Important: forces re-render when columns change
            columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
            contentContainerStyle={[
              styles.listContainer,
              isTablet && styles.listContainerTablet
            ]}
            showsVerticalScrollIndicator={false}
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
                      ? (screenWidth - 72) / 3  // Tablet: 3 columns with spacing
                      : (screenWidth - 48) / 2   // Mobile: 2 columns with spacing
                  },
                  // Remove margin right for last item in row
                  index % numColumns !== numColumns - 1 && styles.cardMarginRight,
                ]}
              >
                <View style={[styles.card, isTablet && styles.cardTablet]}>
                  <Image source={{ uri: item.image }} style={[styles.image, isTablet && styles.imageTablet]} />
                  <View style={styles.textContainer}>
                    <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    {item.location && (
                      <Text style={[styles.location, isTablet && styles.locationTablet]} numberOfLines={1}>
                        {item.location}
                      </Text>
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
  safeArea: { 
    flex: 1, 
    backgroundColor: "#f9f9f9" 
  },

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
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
  },
  headerContainerTablet: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingTop: Platform.OS === 'ios' ? 25 : 25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  headerTablet: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonTablet: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    textTransform: "capitalize",
    flex: 1,
  },
  headerTitleTablet: {
    fontSize: 24,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  
  // List Container
  listContainer: {
    paddingBottom: 30,
  },
  listContainerTablet: {
    paddingBottom: 40,
  },
  
  // Row for columns
  row: { 
    justifyContent: "space-between" 
  },
  
  // Card Wrapper
  cardWrapper: {
    marginBottom: 16,
  },
  cardMarginRight: {
    marginRight: 16,
  },
  
  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTablet: {
    borderRadius: 16,
    padding: 12,
  },
  
  // Image
  image: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    resizeMode: "cover",
  },
  imageTablet: {
    height: 180,
    borderRadius: 14,
  },
  
  // Text Container
  textContainer: { 
    marginTop: 8 
  },
  
  // Title
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  titleTablet: {
    fontSize: 16,
  },
  
  // Location
  location: { 
    fontSize: 12, 
    color: "#777", 
    marginTop: 3 
  },
  locationTablet: { 
    fontSize: 13, 
    marginTop: 4 
  },
  
  // No Data
  noDataText: {
    textAlign: "center",
    marginTop: 60,
    color: "#888",
    fontSize: isTablet ? 18 : 16,
  },
});