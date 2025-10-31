import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { fetchAstrologyTypes } from "../../../Controller/AstrologyController/AstrologyController"; // ✅ Controller import

export default function AstrologyPage1() {
  const navigation = useNavigation();
  const [astrologyData, setAstrologyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔮 Fetch Astrology Data
  useEffect(() => {
    const loadAstrologyData = async () => {
      try {
        const data = await fetchAstrologyTypes();
        setAstrologyData(data);
      } catch (error) {
        console.error("Error loading astrology data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAstrologyData();
  }, []);

  // 🔹 Handle card press
  const handleCardPress = (item) => {
    if (item.name === "Planetary Predictions") {
      navigation.navigate("AstrologyPage2", { astrologyType: item });
    } else {
      alert(`You clicked ${item.name}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Astrology</Text>
      </View>

      {/* 🔹 Astrology Types Section */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Astrology Types</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#93210A" style={{ marginTop: 40 }} />
        ) : astrologyData.length === 0 ? (
          <Text style={styles.emptyText}>No astrology data found.</Text>
        ) : (
          <View style={styles.grid}>
            {astrologyData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => handleCardPress(item)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <Text style={styles.cardText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
  },

  scrollContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: "#FFF7F5",
    borderRadius: 15,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#93210A",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#93210A",
    textAlign: "center",
    marginTop: 40,
  },
});