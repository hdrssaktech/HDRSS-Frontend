import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllPoojas } from "../../../Controller/PoojaController/PoojaController";

export default function PoojaPage1({ navigation }) {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPoojas = async () => {
      try {
        const data = await fetchAllPoojas();
        setPoojas(data);
      } catch (error) {
        console.error("Error loading poojas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPoojas();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pooja</Text>
      </View>

      {/* Pooja List */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {poojas.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate("PoojaPage2", { id: item.id })}
          >
            <Image source={{ uri: item.bannerimg }} style={styles.image} resizeMode="cover" />
            <View style={styles.bottomRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Ionicons name="play" size={20} color="maroon" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 31,
    backgroundColor: "#93210A",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 150,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
