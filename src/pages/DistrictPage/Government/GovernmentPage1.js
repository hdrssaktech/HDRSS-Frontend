import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 22;

const GovernmentPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId } = route.params;
  const [governments, setGovernments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGovernments = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/governments/district/${districtId}`
        );
        const data = await response.json();
        console.log("✅ API Response:", data);

        if (Array.isArray(data)) {
          setGovernments(data);
        } else if (Array.isArray(data.data)) {
          setGovernments(data.data);
        } else {
          setGovernments([]);
        }
      } catch (error) {
        console.log("❌ Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGovernments();
  }, [districtId]);

  if (loading) {
    return (
      <LinearGradient colors={["#FBE9E7", "#FFF8F8"]} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={styles.loadingText}>Fetching Government Data...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#FFF8F8", "#FCEEEE"]} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F8" />

      {/* Header Section */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Governments</Text>
        <Text style={styles.headerSubtitle}>
          Select a government to explore available services
        </Text>
      </View>

      {/* Grid Section */}
      <FlatList
        data={governments}
        keyExtractor={(item, index) =>
          item?._id ? item._id.toString() : index.toString()
        }
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.card}
            onPress={() =>
              navigation.navigate("GovernmentPage2", {
                governmentId: item.id,
              })
            }
          >
            <LinearGradient
              colors={["#93210A", "#B33A1A"]}
              style={styles.imageContainer}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
              ) : (
                <Ionicons name="business" size={48} color="#fff" />
              )}
            </LinearGradient>

            <View style={styles.cardContent}>
              <Text style={styles.title} numberOfLines={2}>
                {item?.title || "Untitled Government"}
              </Text>
              <View style={styles.iconRow}>
                <Ionicons name="chevron-forward-circle" size={18} color="#93210A" />
                <Text style={styles.moreText}>View Services</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

export default GovernmentPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 15,
    marginTop:30
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#93210A",
    fontWeight: "600",
    marginTop: 10,
    fontSize: 16,
  },
  headerBox: {
    backgroundColor: "#93210A",
    paddingVertical: 20,
    borderRadius: 15,
    marginBottom: 18,
    elevation: 6,
    shadowColor: "#93210A",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fce4e4",
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 16,
    width: CARD_WIDTH,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    overflow: "hidden",
  },
  imageContainer: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 6,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  moreText: {
    color: "#93210A",
    fontSize: 13,
    marginLeft: 4,
    fontWeight: "600",
  },
});
