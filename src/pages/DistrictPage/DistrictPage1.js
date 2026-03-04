import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getDistricts } from "../../Controller/DistrictController/DistrictController";
import { LocationContext } from "../../context/LocationContext";

export default function DistrictPage1() {
  const navigation = useNavigation();
  const { locationName } = useContext(LocationContext);

  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { width } = useWindowDimensions();

  // ✅ Tablet detection (works for Android & iPad)
  const isTablet = width >= 600;

  // ✅ Columns
  const numColumns = isTablet ? 4 : 3;
  const imageSize = width / numColumns - 20;

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const data = await getDistricts();
        setDistricts(data);
        setFilteredDistricts(data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDistricts();
  }, []);

  // 🔍 Search filter
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

  // Show more items on tablet
  const visibleDistricts = showAll
    ? filteredDistricts
    : filteredDistricts.slice(0, isTablet ? 8 : 6);

  if (loading) {
    return (
      <View style={styles.center}>
       
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, isTablet && styles.headingTablet]}>
        Districts
      </Text>

      {/* 🔍 Search Box */}
      <View
        style={[
          styles.searchContainer,
          isTablet && styles.searchContainerTablet,
        ]}
      >
        <Ionicons name="search" size={22} color="#93210A" />
        <TextInput
          style={[styles.searchInput, isTablet && styles.searchInputTablet]}
          placeholder="Search district..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={22} color="#93210A" />
          </TouchableOpacity>
        )}
      </View>

      {/* 🗺️ District Grid */}
      <FlatList
        data={visibleDistricts.filter((item) =>
          locationName
            ? item.name.toLowerCase() === locationName.toLowerCase()
            : true
        )}
        key={numColumns}                 // 🔥 REQUIRED
        numColumns={numColumns}          // 🔥 4 on tablet
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              isTablet && styles.cardTablet,
            ]}
            onPress={() =>
              navigation.navigate("DistrictPage2", { districtId: item.id })
            }
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: 15,
              }}
            />
            <Text
              style={[
                styles.imageText,
                isTablet && styles.imageTextTablet,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          filteredDistricts.length > (isTablet ? 8 : 6) && (
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isTablet && styles.toggleButtonTablet,
              ]}
              onPress={() => setShowAll(!showAll)}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  isTablet && styles.toggleButtonTextTablet,
                ]}
              >
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
  container: {
    flex: 1,
    padding: 10,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADING */
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
    marginLeft: 10,
  },

  headingTablet: {
    fontSize: 28,
    marginBottom: 15,
  },

  /* SEARCH */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    marginBottom: 15,
    elevation: 4,
    height: 45,
  },

  searchContainerTablet: {
    height: 55,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
    color: "#333",
  },

  searchInputTablet: {
    fontSize: 18,
  },

  /* CARD */
  card: {
   flex: 1,
    alignItems: "center",
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
    elevation: 2,
  },

  cardTablet: {
    margin: 10,
    padding: 5,
    borderRadius: 14,
    
  },

  imageText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 6,
  },

  imageTextTablet: {
    fontSize: 16,
  },

  /* BUTTON */
  toggleButton: {
    marginVertical: 15,
    backgroundColor: "#93210A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },

  toggleButtonTablet: {
    paddingVertical: 16,
    paddingHorizontal: 30,
  },

  toggleButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },

  toggleButtonTextTablet: {
    fontSize: 18,
  },
});