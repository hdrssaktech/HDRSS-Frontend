import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchHistoryTypes } from "../../../Controller/HistoryController/HistoryController";

export default function HistoryPage1() {
  const navigation = useNavigation();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchHistoryTypes();
      setTypes(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ElectionPage")} style={styles.backButton}>
        <Ionicons name="chevron-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
       
      </View>

      {types.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => navigation.navigate("HistoryPage2", { id: item.id, name: item.name })}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.title}>{item.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#93210A" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {  flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginTop: 32, },
  backButton: { marginBottom: 4 },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: 22 },
  headerText: { color: "#fff", fontSize: 13, marginTop: 8 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 12,
    padding: 12,
    borderRadius: 10,
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  title: { fontSize: 16, fontWeight: "600", color: "#000" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});
