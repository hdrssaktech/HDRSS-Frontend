



import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getTownsByDistrict } from "../../../Controller/TownController/TownPageController";
import { LocationContext } from "../../../context/LocationContext";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function TownPage1() {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId, districtName } = route.params || {};

  const [towns, setTowns] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTown, setSelectedTown] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { TownName } = useContext(LocationContext);

  useEffect(() => {
    const fetchTowns = async () => {
      if (!districtId) return;
      const data = await getTownsByDistrict(districtId);
      setTowns(data);
      setLoading(false);
    };
    fetchTowns();

    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setShowDropdown(false)
    );
    return () => hideSub.remove();
  }, [districtId]);

  // Filter towns
  const filteredTowns = towns.filter((t) =>
    t.townname.toLowerCase().includes(searchText.toLowerCase())
  );

  const finalTownList =
    searchText.trim() !== ""
      ? filteredTowns // user searched → show filtered
      : towns; // default full list

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: selectedTown ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [selectedTown]);

  // When a town is selected from dropdown
  const handleSelectTown = (item) => {
    setSearchText(item.townname);
    setSelectedTown(item);
    setTimeout(() => setShowDropdown(false), 100);
    Keyboard.dismiss();
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
          Loading towns...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.townContainer, isTablet && styles.townContainerTablet]}>
      <Text style={[styles.heading, isTablet && styles.headingTablet]}>
        {districtName ? `${districtName} - Towns` : "Towns"}
      </Text>
      
      {/* Search Bar */}
      <View style={[styles.searchContainer, isTablet && styles.searchContainerTablet]}>
        <Ionicons
          name="search"
          size={isTablet ? 24 : 20}
          color="#93210A"
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, isTablet && styles.searchInputTablet]}
          placeholder="Search town..."
          placeholderTextColor="#888"
          value={searchText}
          onFocus={() => setShowDropdown(true)}
          onChangeText={(text) => {
            setSearchText(text);
            setSelectedTown(null);
            setShowDropdown(true);
          }}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchText("");
              setSelectedTown(null);
              setShowDropdown(false);
            }}
          >
            <Text style={[styles.clearButton, isTablet && styles.clearButtonTablet]}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dropdown */}
      {showDropdown && (
        <View style={[styles.dropdownContainer, isTablet && styles.dropdownContainerTablet]}>
          <ScrollView
            style={styles.dropdownScroll}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {filteredTowns.length > 0 ? (
              filteredTowns.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dropdownItem, isTablet && styles.dropdownItemTablet]}
                  onPress={() => handleSelectTown(item)}
                >
                  <Text style={[styles.dropdownText, isTablet && styles.dropdownTextTablet]}>
                    {item.townname}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={[styles.noTownText, isTablet && styles.noTownTextTablet]}>
                No town found
              </Text>
            )}
          </ScrollView>
        </View>
      )}

      {/* Selected Town */}
      {selectedTown ? (
        <Animated.View
          style={[styles.centeredTownContainer, { opacity: fadeAnim }]}
        >
          <View style={[styles.selectedTownCard, isTablet && styles.selectedTownCardTablet]}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("TownPage2", { 
                  town: selectedTown, 
                  DistrictId: districtId, 
                  DistrictName: districtName 
                })
              }
            >
              <Image
                source={{ uri: selectedTown.image }}
                style={[styles.selectedTownImage, isTablet && styles.selectedTownImageTablet]}
              />
              <Text style={[styles.selectedTownName, isTablet && styles.selectedTownNameTablet]}>
                {selectedTown.townname}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Clear Selection */}
          <TouchableOpacity
            style={[styles.clearSelectionButton, isTablet && styles.clearSelectionButtonTablet]}
            onPress={() => {
              setSelectedTown(null);
              setSearchText("");
              setShowDropdown(false);
            }}
          >
            <Text style={[styles.clearSelectionText, isTablet && styles.clearSelectionTextTablet]}>
              ×
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <>
          {/* Horizontal Scroll List for Towns */}
          <FlatList
            data={finalTownList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[
              styles.horizontalList, 
              isTablet && styles.horizontalListTablet
            ]}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.card, isTablet && styles.cardTablet]}
                onPress={() => navigation.navigate("TownPage2", { 
                  town: item, 
                  townId: item.id 
                })}
              >
                <Image
                  source={{ uri: item.image }}
                  style={[
                    styles.cardImage,
                    isTablet && styles.cardImageTablet
                  ]}
                />
                <Text style={[styles.imageText, isTablet && styles.imageTextTablet]}>
                  {item.townname}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container Styles
  townContainer: { 
    marginTop: 15, 
    marginHorizontal: 10, 
    flex: 1 
  },
  townContainerTablet: {
    marginTop: 25,
    marginHorizontal: 30,
  },

  // Heading
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 10,
    textAlign: "center",
  },
  headingTablet: {
    fontSize: 26,
    marginVertical: 15,
  },

  // Loading
  centerContent: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  loadingTextTablet: {
    fontSize: 16,
    marginTop: 15,
  },

  // Search Container
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    marginBottom: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    height: 45,
    marginVertical: 17,
  },
  searchContainerTablet: {
    height: 55,
    marginHorizontal: 20,
    marginVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  searchIcon: { 
    marginRight: 8 
  },
  searchInput: { 
    flex: 1, 
    fontSize: 15, 
    color: "#333" 
  },
  searchInputTablet: {
    fontSize: 18,
  },
  clearButton: {
    fontSize: 18,
    color: "#93210A",
    padding: 4,
    fontWeight: "bold",
  },
  clearButtonTablet: {
    fontSize: 22,
    padding: 6,
  },

  // Dropdown
  dropdownContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 15,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "#ddd",
    zIndex: 3,
    maxHeight: 180,
  },
  dropdownContainerTablet: {
    marginHorizontal: 20,
    borderRadius: 12,
    maxHeight: 220,
  },
  dropdownScroll: { 
    borderRadius: 10 
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  dropdownItemTablet: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dropdownText: { 
    fontSize: 15, 
    color: "#333" 
  },
  dropdownTextTablet: {
    fontSize: 17,
  },
  noTownText: {
    textAlign: "center",
    padding: 10,
    color: "#666",
    fontSize: 14,
  },
  noTownTextTablet: {
    padding: 15,
    fontSize: 16,
  },

  // Centered Selected Town
  centeredTownContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  selectedTownCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 5,
    padding: 20,
    alignItems: "center",
  },
  selectedTownCardTablet: {
    padding: 30,
    borderRadius: 16,
  },
  selectedTownImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },
  selectedTownImageTablet: {
    width: 250,
    height: 250,
    borderRadius: 16,
  },
  selectedTownName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginTop: 12,
  },
  selectedTownNameTablet: {
    fontSize: 24,
    marginTop: 16,
  },
  clearSelectionButton: {
    marginTop: 25,
    backgroundColor: "#93210A",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  clearSelectionButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 30,
  },
  clearSelectionText: { 
    color: "#fff", 
    fontSize: 20, 
    fontWeight: "bold" 
  },
  clearSelectionTextTablet: {
    fontSize: 24,
  },

  // Horizontal List
  horizontalList: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  horizontalListTablet: {
    paddingVertical: 15,
    paddingLeft: 20,
  },
  card: {
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    padding: 8,
    width: 120,
  },
  cardTablet: {
    marginRight: 15,
    padding: 12,
    borderRadius: 12,
    width: 160,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  cardImageTablet: {
    width: 140,
    height: 140,
    borderRadius: 10,
  },
  imageText: { 
    fontSize: 12, 
    fontWeight: "bold", 
    marginTop: 5,
    textAlign: "center",
  },
  imageTextTablet: {
    fontSize: 16,
    marginTop: 8,
  },
});