import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  useWindowDimensions,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchTourismByType } from "../../../Controller/TourismController/TourismController";

export default function TourismPage2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { typeId, typeName } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===================== API ===================== */
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const data = await fetchTourismByType(typeId);
        setPlaces(data);
        setFilteredPlaces(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, [typeId]);

  /* ===================== SEARCH ===================== */
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredPlaces(places);
      return;
    }
    setFilteredPlaces(
      places.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ===================== HEADER ===================== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{typeName}</Text>
      </View>

      {/* ===================== SEARCH ===================== */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#777" />
        <TextInput
          placeholder="Search places..."
          value={searchText}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {/* ===================== GRID ===================== */}
      <FlatList
        data={filteredPlaces}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListEmptyComponent={
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>No places found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("TourismPage3", { id: item.id })
            }
          >
            <Image
              source={{
                uri:
                  item.bannerImage ||
                  "https://cdn-icons-png.flaticon.com/512/2659/2659360.png",
              }}
              style={styles.image}
            />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>

              {/* ===================== BUTTONS ===================== */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.visitButton}
                  onPress={() =>
                    navigation.navigate("TourismPlaces", { id: item.id })
                  }
                >
                  <Ionicons name="location-outline" size={16} color="#fff" />
                  <Text style={styles.btnText}>Visit</Text>
                </TouchableOpacity>

                {item.phone && (
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => Linking.openURL(`tel:${item.phone}`)}
                  >
                    <Ionicons name="call-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  headerTitle: {
    color: "#fff",
    fontSize:14,
    fontWeight: "700",
    marginLeft: 15,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 28,
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 15,
    marginLeft: 8,
  },

  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    marginVertical: 6,
    width: "48%",
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    height: 120,
    width: "100%",
  },

  info: {
    padding: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  title: {
    fontSize: 13,
    color: "#666",
    marginVertical: 2,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  visitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E88E5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  callButton: {
    backgroundColor: "#93210A",
    padding: 8,
    borderRadius: 50,
  },
  btnText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 5,
    fontWeight: "600",
  },

  notFound: {
    alignItems: "center",
    marginTop: 40,
  },
  notFoundText: {
    color: "#999",
    fontSize: 16,
  },
});
