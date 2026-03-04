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
import Loader from "../../../components/Alert/Loader";

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
      <Loader/>
    );
  }

  // Always use 2 columns for both mobile and tablet
  const numColumns = 2;

  return (
    <View style={styles.screen}>
      {/* 🔹 Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
       <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
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
    backgroundColor: "#93210A",
    paddingTop:40,
    paddingBottom:30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingTop:45,
    paddingBottom:28,
    paddingHorizontal: 18,
  },
  headerTitle: {
     flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
     marginRight:70,
  },
  headerTitleTablet: {
    fontSize: 26,
    marginRight:70,
    
  },

  backButton:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  backButtonTablet:{
    width: 50,
    height: 50,
    borderRadius: 25,
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


