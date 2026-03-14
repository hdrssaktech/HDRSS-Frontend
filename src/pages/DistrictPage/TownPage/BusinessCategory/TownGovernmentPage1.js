import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../../../components/Alert/Loader";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function TownGovernmentPage1() {
  const route = useRoute();
  const { townId } = route.params;
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = axios.create({
    baseURL: "https://hdrss-backend.onrender.com/api",
  });

  // ✅ SAME as your district page logic (responsive columns)
  const numColumns = isLargeTablet ? 4 : isTablet ? 3 : 2;

  const CARD_WIDTH = () => {
    const padding = isTablet ? 20 : 10;
    const gap = isTablet ? 20 : 12;
    const totalGap = gap * (numColumns - 1);
    const availableWidth = screenWidth - padding * 2;
    return (availableWidth - totalGap) / numColumns;
  };

  const getGovernmentDetails = async () => {
    try {
      const res = await API.get(`/town-government/${townId}`);
      setData(res.data?.data || []);
    } catch (err) {
      console.error("API Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGovernmentDetails();
  }, [townId]);

  if (loading) return <Loader />;

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="business-outline" size={isTablet ? 80 : 60} color="#93210A" />
      <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
        No government departments found
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={["#FFF8F8", "#FCEEEE"]} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      {/* ✅ HEADER (same as District GovernmentPage) */}
      <View style={[styles.headerBox, isTablet && styles.headerBoxTablet]}>
        <TouchableOpacity
          style={[
            styles.backButton,
            isTablet && styles.backButtonTablet,
            {
              width: isTablet ? 50 : 40,
              height: isTablet ? 50 : 40,
              borderRadius: isTablet ? 25 : 20,
            },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTextBox}>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
            Town Governments
          </Text>
        </View>
      </View>

      {/* ✅ GRID (same as District GovernmentPage) */}
      {data.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={data}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
          columnWrapperStyle={
            numColumns > 1
              ? {
                  justifyContent: "space-between",
                  paddingHorizontal: isTablet ? 20 : 10,
                  marginBottom: isTablet ? 20 : 12,
                }
              : null
          }
          contentContainerStyle={[
            styles.listContainer,
            {
              paddingHorizontal: isTablet ? 20 : 10,
              paddingTop: isTablet ? 20 : 10,
              paddingBottom: isTablet ? 30 : 20,
            },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isLastInRow = (index + 1) % numColumns === 0;
            const gap = isTablet ? 20 : 12;

            return (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.card,
                  {
                    width: CARD_WIDTH(),
                    marginRight: !isLastInRow ? gap : 0,
                  },
                  isTablet && styles.cardTablet,
                ]}
                onPress={() =>
                  navigation.navigate("TownGovernmentPage2", {
                    townGovernmentId: item.id,
                  })
                }
              >
                {/* ✅ Image top with same red gradient */}
                <LinearGradient
                  colors={["#93210A", "#B33A1A"]}
                  style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}
                >
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                  ) : (
                    <Ionicons name="business" size={isTablet ? 64 : 48} color="#fff" />
                  )}
                </LinearGradient>

                {/* ✅ Title + View Services row */}
                <View style={[styles.cardContent, isTablet && styles.cardContentTablet]}>
                  <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={2}>
                    {item?.title || "Untitled Government"}
                  </Text>

                  <View style={styles.iconRow}>
                    <Ionicons
                      name="chevron-forward-circle"
                      size={isTablet ? 20 : 18}
                      color="#93210A"
                    />
                    <Text style={[styles.moreText, isTablet && styles.moreTextTablet]}>
                      View Services
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </LinearGradient>
  );
}

/* ✅ Styles copied from District GovernmentPage design */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* EMPTY */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: "#93210A",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyTextTablet: {
    fontSize: 18,
    marginTop: 20,
  },

  /* HEADER */
  headerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerBoxTablet: {
    paddingTop: 45,
    paddingBottom: 28,
    paddingHorizontal: 18,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  headerTextBox: {
    flex: 1,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginRight: 55,
  },
  headerTitleTablet: {
    fontSize: 26,
  },

  /* LIST */
  listContainer: {
    flexGrow: 1,
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 20,
    marginBottom: 16,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6,
  },

  imageContainer: {
    height: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainerTablet: {
    height: 160,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  cardContent: {
    padding: 12,
  },
  cardContentTablet: {
    padding: 16,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 6,
    lineHeight: 20,
  },
  titleTablet: {
    fontSize: 18,
    marginBottom: 8,
    lineHeight: 24,
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  moreText: {
    color: "#93210A",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "600",
  },
  moreTextTablet: {
    fontSize: 14,
    marginLeft: 6,
  },
});