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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchTourismByType } from "../../../Controller/TourismController/TourismController";

export default function TourismPage2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { typeId, typeName } = route.params;

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const data = await fetchTourismByType(typeId);
        setPlaces(data);
      } catch (error) {
        console.error("Error loading tourism places:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, [typeId]);

  if (loading)
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{typeName}</Text>
      </View>

      {/* List */}
      <FlatList
        data={places}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("TourismPage3", { id: item.id })}
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
              <Text style={styles.title}>{item.title}</Text>
              {item.phone && (
                <Text style={styles.phone}>📞 {item.phone}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 15 }}
      />
    </SafeAreaView>
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
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    overflow: "hidden",
  },
  image: { width: "100%", height: 160 },
  info: { padding: 10 },
  name: { fontSize: 18, fontWeight: "bold", color: "#333" },
  title: { fontSize: 14, color: "#666", marginVertical: 4 },
  phone: { fontSize: 14, color: "#2E8B57", fontWeight: "bold" },
});
