// DistrictPage1.js
import React, { useEffect, useState,useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getDistricts } from "../../Controller/DistrictController/DistrictController";
import { LocationContext } from "../../context/LocationContext";

export default function DistrictPage1() {
  const navigation = useNavigation();
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [searchText, setSearchText] = useState("");

    const { locationName } = useContext(LocationContext);
    // console.log("Current Location from Context:", locationName);

  const { width: screenWidth } = Dimensions.get("window");
  const imageSize = screenWidth / 3 - 20;

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const data = await getDistricts();
        setDistricts(data);
        setFilteredDistricts(data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDistricts();
  }, []);

  // 🔍 Handle search filtering
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredDistricts(districts);
    } else {
      const filtered = districts.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDistricts(filtered);
    }
  };

  // Show either all or first 6
  const visibleDistricts = showAll
    ? filteredDistricts
    : filteredDistricts.slice(0, 6);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={styles.heading}>Districts</Text>

      {/* 🔍 Search Box */}
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#93210A" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search district..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={handleSearch}
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={() => handleSearch("")}>
          <Ionicons name="close-circle" size={20} color="#93210A" />
        </TouchableOpacity>
      )}
    </View>


      {/* 🗺️ District List */}
      <FlatList
        data={visibleDistricts.filter((item)=>
          locationName
            ? item.name.toLowerCase() === locationName.toLowerCase()
            : visibleDistricts
        )}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("DistrictPage2", { districtId: item.id })
            }
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: imageSize, height: imageSize, borderRadius: 8 }}
            />
            <Text style={styles.imageText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          filteredDistricts.length > 6 && (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowAll(!showAll)}
            >
              <Text style={styles.toggleButtonText}>
                {showAll ? "Show Less" : "Show All Districts"}
              </Text>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
    marginLeft: 10,
  },
searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 12,
  paddingHorizontal: 12,
  marginHorizontal: 10,
  marginBottom: 15,
  elevation: 4, // Android shadow
  shadowColor: "#000", // iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  height: 45,
},
searchIcon: {
  marginRight: 8,
},
  searchInput: {
  flex: 1,
  fontSize: 15,
  color: "#333",
},
  clearButton: {
    fontSize: 18,
    color: "#93210A",
    padding: 4,
    fontWeight: "bold",
  },
  card: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 5,
    elevation: 2,
  },
  imageText: { fontSize: 12, fontWeight: "bold", marginTop: 5 },
  toggleButton: {
    marginVertical: 15,
    backgroundColor: "#93210A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  toggleButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
