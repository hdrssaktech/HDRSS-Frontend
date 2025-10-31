// src/pages/Astrology/AstrologyPage2.js
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
import { fetchAstrologyByType } from "../../../Controller/AstrologyController/AstrologyController";

export default function AstrologyPage2({ route }) {
  const navigation = useNavigation();
  const [astrologyData, setAstrologyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const typeId = route?.params?.typeId || 1;

  useEffect(() => {
    const loadAstrologyDetails = async () => {
      try {
        const data = await fetchAstrologyByType(typeId);
        setAstrologyData(data);
      } catch (error) {
        console.error("Error loading astrology data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAstrologyDetails();
  }, [typeId]);

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Astrology Details</Text>
      </View>

      {/* 🔹 Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#93210A" style={{ marginTop: 50 }} />
        ) : astrologyData.length === 0 ? (
          <Text style={styles.emptyText}>No astrology data found.</Text>
        ) : (
          astrologyData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate("AstrologyPage3", { astrologyItem: item })}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          ))
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
  scrollContainer: { padding: 16 },
  card: {
    backgroundColor: "#FFF7F5",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
    elevation: 3,
    marginBottom: 20,
  },
  image: {
    width: 220,
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#93210A",
    textAlign: "center",
    marginTop: 40,
  },
});