import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchHistoryByTypeId } from "../../../Controller/HistoryController/HistoryController";

const { width } = Dimensions.get("window");
const cardWidth = (width - 40) / 2;

export default function HistoryPage2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id, name } = route.params;
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchHistoryByTypeId(id);
      setHistoryItems(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("HistoryPage3", { data: item })}
    >
      <Image source={{ uri: item.bannerImage }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.phone}>{item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
      </View>

      {/* List */}
      <FlatList
        data={historyItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginTop: 32,
  },
  backButton: { marginRight: 10 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  listContainer: { padding: 10 },
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 8,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  image: { width: "100%", height: 120, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  phone: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginTop: 2,
  },
});
