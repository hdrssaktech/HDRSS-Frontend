import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getTownsByDistrict } from "../../../Controller/TownController/TownPageController";

export default function TownPage1() {
  const navigation = useNavigation();
  const [towns, setTowns] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const districtId = 16; // ✅ change dynamically later if needed

  useEffect(() => {
    const fetchTowns = async () => {
      const data = await getTownsByDistrict(districtId);
      setTowns(data);
      setLoading(false);
    };
    fetchTowns();
  }, []);

  const filteredTowns = towns.filter((t) =>
    t.townname.toLowerCase().includes(searchText.toLowerCase())
  );
  const displayedTowns = showAll ? filteredTowns : filteredTowns.slice(0, 6);

  const imageSize = 100;

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
      <Text style={styles.heading}>Towns</Text>

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
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Text style={styles.clearButton}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 🏙 Town Cards */}
      <FlatList
        data={displayedTowns}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("TownPage2", { town: item })}
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

      {/* 👇 See More / See Less */}
      {filteredTowns.length > 6 && (
        <TouchableOpacity
          style={styles.toggleButton1}
          onPress={() => setShowAll(!showAll)}
        >
          <Text style={styles.toggleButtonText1}>
            {showAll ? "See Less" : "See More"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  townContainer: { marginTop: 15, marginHorizontal: 10 },
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
    marginBottom: 15,
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
  card: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginVertical: 10,
  },
  imageText: { fontSize: 12, fontWeight: "bold", marginTop: 5 },
  toggleButton1: {
    alignSelf: "center",
    marginVertical: 17,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#93210A",
  },
  toggleButtonText1: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});