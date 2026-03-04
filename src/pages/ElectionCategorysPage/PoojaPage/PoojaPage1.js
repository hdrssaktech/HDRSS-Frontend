import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllPoojas } from "../../../Controller/PoojaController/PoojaController";

export default function PoojaPage1({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  // Always use 2 columns for both mobile and tablet
  const numColumns = 2;

  return (
    <View style={styles.screen}>
      {/* 🔹 Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={isTablet ? 34 : 30}
            color="#fff"
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
        >
          Pooja
        </Text>
      </View>

      {/* 🔹 Pooja Grid */}
      <FlatList
        data={poojas}
        key={numColumns}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          isTablet && styles.containerTablet,
        ]}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.card,
              isTablet && styles.cardTablet,
              index % 2 === 0 ? styles.leftCard : styles.rightCard,
            ]}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("Poojacategory", { id: item.id })
            }
          >
            <Image
              source={{ uri: item.bannerimg }}
              style={[styles.image, isTablet && styles.imageTablet]}
              resizeMode="cover"
            />

            <View
              style={[
                styles.bottomRow,
                isTablet && styles.bottomRowTablet,
              ]}
            >
              <Text
                style={[styles.title, isTablet && styles.titleTablet]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  /* 🔹 Screen */
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  /* 🔹 Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 31,
    backgroundColor: "#93210A",
  },
  headerTablet: {
    paddingVertical: 35,
    paddingHorizontal: 24,
    marginTop: -3,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 22,
    marginLeft: 65,
    padding: 8,
  },
  headerTitleTablet: {
    fontSize: 28,
    padding: 8,
    left: 125,
  },

  /* 🔹 Grid Container */
  container: {
    padding: 10,
    paddingBottom: 30,
  },
  containerTablet: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  /* 🔹 Card */
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 16,
    margin: 10,
    marginBottom: 20,
  },
  leftCard: {
    marginLeft: 10,
    marginRight: 5,
  },
  rightCard: {
    marginLeft: 5,
    marginRight: 10,
  },

  /* 🔹 Image */
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#f5f5f5",
  },
  imageTablet: {
    height: 160,
  },

  /* 🔹 Bottom Row */
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  bottomRowTablet: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  /* 🔹 Title */
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
    textAlign: "center",
  },
  titleTablet: {
    fontSize: 18,
  },
});


