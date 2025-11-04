import React, { useEffect, useState, useRef } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getTownsByDistrict } from "../../../Controller/TownController/TownPageController";

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

  // 🟢 Filter towns
  const filteredTowns = towns.filter((t) =>
    t.townname.toLowerCase().includes(searchText.toLowerCase())
  );

  const displayedTowns =
    searchText.length > 0 ? filteredTowns : towns; // No "See More" logic

  const imageSize = 100;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: selectedTown ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [selectedTown]);

  // ✅ When a town is selected from dropdown
  const handleSelectTown = (item) => {
    setSearchText(item.townname);
    setSelectedTown(item);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text>Loading towns...</Text>
      </View>
    );
  }

  return (
    <View style={styles.townContainer}>
      <Text style={styles.heading}>
        {districtName ? `${districtName} - Towns` : "Towns"}
      </Text>

      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#93210A"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
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
            <Text style={styles.clearButton}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 🟢 Dropdown */}
      {showDropdown && (
        <View style={styles.dropdownContainer}>
          <ScrollView
            style={styles.dropdownScroll}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {filteredTowns.length > 0 ? (
              filteredTowns.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectTown(item)}
                >
                  <Text style={styles.dropdownText}>{item.townname}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  padding: 10,
                  color: "#666",
                }}
              >
                No town found
              </Text>
            )}
          </ScrollView>
        </View>
      )}

      {/* 🏙 Selected Town */}
      {selectedTown ? (
        <Animated.View
          style={[styles.centeredTownContainer, { opacity: fadeAnim }]}
        >
          <View style={styles.selectedTownCard}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("TownPage2", { town: selectedTown })
              }
            >
              <Image
                source={{ uri: selectedTown.image }}
                style={styles.selectedTownImage}
              />
              <Text style={styles.selectedTownName}>
                {selectedTown.townname}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ❌ Clear */}
          <TouchableOpacity
            style={styles.clearSelectionButton}
            onPress={() => {
              setSelectedTown(null);
              setSearchText("");
              setShowDropdown(false);
            }}
          >
            <Text style={styles.clearSelectionText}>×</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <>
          {/* 🏙 Horizontal Scroll List */}
          <FlatList
            data={displayedTowns}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("TownPage2", { town: item })
                }
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: imageSize,
                    height: imageSize,
                    borderRadius: 8,
                  }}
                />
                <Text style={styles.imageText}>{item.townname}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
}

// 🧾 Styles
const styles = StyleSheet.create({
  townContainer: { marginTop: 15, marginHorizontal: 10, flex: 1 },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 10,
    textAlign: "center",
  },
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
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: "#333" },
  clearButton: {
    fontSize: 18,
    color: "#93210A",
    padding: 4,
    fontWeight: "bold",
  },
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
  dropdownScroll: { borderRadius: 10 },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  dropdownText: { fontSize: 15, color: "#333" },
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
  selectedTownImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
  },
  selectedTownName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginTop: 12,
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
  clearSelectionText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  horizontalList: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  card: {
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    padding: 8,
  },
  imageText: { fontSize: 12, fontWeight: "bold", marginTop: 5 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
});