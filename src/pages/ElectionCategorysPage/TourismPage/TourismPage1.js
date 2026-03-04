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
import Loader from "../../../components/Alert/Loader";

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
      <Loader/>
    );
  }

  /* ===================== FIXED 2 COLUMNS ===================== */
  const numColumns = 2;

  return (
    <View style={styles.container}>
      {/* ===================== HEADER ===================== */}
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
     marginRight:55,
  },

  headerTitleTablet: {
    fontSize: 24,
    marginRight:55,
   
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

