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
import { useNavigation } from "@react-navigation/native";
import { fetchTourismTypes } from "../../../Controller/TourismController/TourismController";

export default function TourismPage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  /* ===================== STATES ===================== */
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===================== API CALL ===================== */
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchTourismTypes();
        setTypes(data);
      } catch (error) {
        console.error("Error loading types:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  /* ===================== LOADER ===================== */
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  /* ===================== FIXED 2 COLUMNS ===================== */
  const numColumns = 2;

  return (
    <View style={styles.container}>
      {/* ===================== HEADER ===================== */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={isTablet ? 34 : 28}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
        >
          Tourist Places
        </Text>
      </View>

      {/* ===================== GRID ===================== */}
      <FlatList
        data={types}
        key={numColumns}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          isTablet && styles.listTablet,
        ]}
        columnWrapperStyle={styles.row}   // ✅ spacing between columns
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              isTablet && styles.cardTablet,
            ]}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("TourismPage2", {
                typeId: item.id,
                typeName: item.name,
              })
            }
          >
            {/* ===================== IMAGE ===================== */}
            <Image
              source={{
                uri:
                  item.image ||
                  "https://cdn-icons-png.flaticon.com/512/201/201623.png",
              }}
              style={[
                styles.image,
                isTablet && styles.imageTablet,
              ]}
            />

            {/* ===================== TEXT ===================== */}
            <View
              style={[
                styles.textBox,
                isTablet && styles.textBoxTablet,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  isTablet && styles.textTablet,
                ]}
              >
                {item.name} {/* ✅ full text shown */}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  /* ===================== HEADER ===================== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
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

  /* ===================== GRID ===================== */
  list: {
    padding: 15,
    paddingBottom: 30,
  },
  listTablet: {
    paddingHorizontal: 28,
    paddingTop: 24,
  },

  row: {
    justifyContent: "space-between",
  },

  /* ===================== CARD ===================== */
  card: {
    flex: 1,
    marginBottom: 15,
    marginHorizontal: 8,
    marginVertical:8,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    overflow: "hidden",
  },
  cardTablet: {
    marginBottom: 24,
    borderRadius: 16,
  },

  /* ===================== IMAGE ===================== */
  image: {
    width: "100%",
    height: 100,
  },
  imageTablet: {
    height: 220,
  },

  /* ===================== TEXT ===================== */
  textBox: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    alignItems: "center",
  },
  textBoxTablet: {
    paddingVertical: 16,
  },

  text: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  textTablet: {
    fontSize: 15,
  },
});

