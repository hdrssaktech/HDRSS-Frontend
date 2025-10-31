import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchTourismTypes } from "../../../Controller/TourismController/TourismController";

export default function TourismPage1() {
  const navigation = useNavigation();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchTourismTypes();
        setTypes(data);
      } catch (error) {
        console.error("Error loading types:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  if (loading)
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Tourist Places</Text>
      </View>

      {/* Body */}
      <ScrollView style={{ padding: 15 }}>
        {types.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("TourismPage2", {
                typeId: item.id,
                typeName: item.name,
              })
            }
          >
            <Image
              source={{
                uri:
                  item.image ||
                  "https://cdn-icons-png.flaticon.com/512/201/201623.png",
              }}
              style={styles.image}
            />
            <View style={styles.textBox}>
              <Text style={styles.text}>{item.name}</Text>
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
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    overflow: "hidden",
  },
  image: { width: "100%", height: 150, borderRadius: 10 },
  textBox: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    alignItems: "center",
  },
  text: { fontSize: 16, fontWeight: "bold", color: "#333" },
  container: { flex: 1, backgroundColor: "#fff" },
});
