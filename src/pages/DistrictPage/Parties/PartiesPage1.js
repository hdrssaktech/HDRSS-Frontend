import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const PartiesPage1 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId } = route.params;

  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        console.log("📍 District ID received:", districtId);

        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/party/district/${districtId}`
        );
        const data = await response.json();
        console.log("✅ Parties API Response:", data);

        if (Array.isArray(data)) {
          setParties(data);
        } else if (data && typeof data === "object" && !data.message) {
          setParties([data]);
        } else {
          setParties([]);
        }
      } catch (error) {
        console.log("❌ Error fetching parties:", error);
        setParties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, [districtId]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={styles.loadingText}>Loading parties...</Text>
      </View>
    );
  }

  if (parties.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No parties found for this district.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎉 Parties in this District</Text>

      <FlatList
        data={parties}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Partiespage2", { party: item })}
          >
            <Image
              source={{
                uri:
                  item.image ||
                  "https://via.placeholder.com/400x250/93210A/FFFFFF?text=No+Image",
              }}
              style={styles.image}
            />
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title || "Unnamed Party"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default PartiesPage1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF7F7",
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F8",
  },
  loadingText: {
    color: "#93210A",
    marginTop: 8,
    fontWeight: "500",
  },
  header: {
    fontSize: 22,
    backgroundColor:"#93210A",
    padding:20,
    fontWeight: "800",
    marginTop:30,
    color: "white",
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: width - 30,
    height: 200,
    borderRadius: 16,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  textContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#93210A",
    fontSize: 16,
    fontWeight: "500",
  },
});
