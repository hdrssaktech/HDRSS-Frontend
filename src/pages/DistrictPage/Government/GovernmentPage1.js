import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const GovernmentPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const CARD_WIDTH = isTablet
    ? width / 3 - 28
    : width / 2 - 22;

  const [governments, setGovernments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGovernments = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/governments/district/${districtId}`
        );
        const data = await response.json();

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
      <LinearGradient
        colors={["#FBE9E7", "#FFF8F8"]}
        style={styles.loaderContainer}
      >
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={styles.loadingText}>
          Fetching Government Data...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#FFF8F8", "#FCEEEE"]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F8" />

      {/* ================= HEADER ================= */}
      <View style={styles.headerBox}>
        <TouchableOpacity
       
  style={isTablet ? styles.backButtonTablet : styles.backButtonMobile}
  onPress={() => navigation.goBack()}
>
  <Ionicons
    name="chevron-back"
    size={isTablet ? 32 : 26}
    color="#fff"
  />
</TouchableOpacity>

        <View style={styles.headerTextBox}>
          <Text
            style={[
              styles.headerTitle,
              isTablet && styles.headerTitleTablet,
            ]}
          >
            Governments
          </Text>
          <Text style={styles.headerSubtitle}>
            Select a government to explore available services
          </Text>
        </View>
      </View>

      {/* ================= GRID ================= */}
      <FlatList
        data={governments}
        key={isTablet ? "tablet" : "mobile"}
        numColumns={isTablet ? 3 : 2}
        keyExtractor={(item, index) =>
          item?._id ? item._id.toString() : index.toString()
        }
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: isTablet ? 20 : 10,
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.card,
              { width: CARD_WIDTH },
              isTablet && styles.cardTablet,
            ]}
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
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                />
              ) : (
                <Ionicons name="business" size={48} color="#fff" />
              )}
            </LinearGradient>

            <View style={styles.cardContent}>
              <Text
                style={[
                  styles.title,
                  isTablet && styles.titleTablet,
                ]}
                numberOfLines={2}
              >
                {item?.title || "Untitled Government"}
              </Text>

              <View style={styles.iconRow}>
                <Ionicons
                  name="chevron-forward-circle"
                  size={18}
                  color="#93210A"
                />
                <Text style={styles.moreText}>
                  View Services
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

export default GovernmentPage;

/* ===================================================
   STYLES – MOBILE & TABLET CLEAN
=================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* ================= LOADER ================= */
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

  /* ================= HEADER ================= */
  headerBox: {
    backgroundColor: "#93210A",
    paddingVertical: 40,
    marginBottom: 18,
    elevation: 6,
    shadowColor: "#93210A",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  backButton: {
    marginRight: 10,
    marginTop: 10,
  },

  headerTextBox: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    letterSpacing: 1,
  },

  headerTitleTablet: {
    fontSize: 26,
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#fce4e4",
    textAlign: "center",
    marginTop: 4,
  },

  /* ================= CARD ================= */
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
    overflow: "hidden",
  },

  cardTablet: {
    borderRadius: 22,
  },

  imageContainer: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  cardContent: {
    padding: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 6,
  },

  titleTablet: {
    fontSize: 17,
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  moreText: {
    color: "#93210A",
    fontSize: 13,
    marginLeft: 4,
    fontWeight: "600",
  },
});
