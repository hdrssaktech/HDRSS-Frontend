import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getCharities } from "../../Controller/CharityController/CharityController";

export default function CharityPage1() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharities = async () => {
      try {
        const result = await getCharities();
        setData(result);
      } catch (err) {
        console.error("❌ Error loading charities:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCharities();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={26}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Charities</Text>
      </View>

      {/* List */}
      <ScrollView style={styles.scrollContainer}>
        {data.length === 0 ? (
          <Text style={styles.noData}>No charities available.</Text>
        ) : (
          data.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.heading}>"{item.heading}"</Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate("CharitiesPage2", { charity: item })
                  }
                >
                  <Text style={styles.buttonText}>View More</Text>
                </TouchableOpacity>
              </View>

              {item.bannerImage ? (
                <Image source={{ uri: item.bannerImage }} style={styles.image} />
              ) : null}
            </View>
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
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
  },
  scrollContainer: { padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  textContainer: { flex: 1, paddingRight: 10 },
  title: { fontSize: 16, fontWeight: "bold", color: "#000" },
  heading: { fontSize: 13, color: "#555", marginBottom: 10 },
  button: {
    backgroundColor: "#971A01",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  image: { width: 70, height: 70, borderRadius: 35 },
  noData: { textAlign: "center", marginTop: 50, color: "#777", fontSize: 16 },
});