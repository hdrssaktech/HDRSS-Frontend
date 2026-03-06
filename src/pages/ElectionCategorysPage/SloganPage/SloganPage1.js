import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchHistoryTypes } from "../../../Controller/HistoryController/HistoryController";
import Loader from "../../../components/Alert/Loader";

export default function SloganPage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const route = useRoute();
  const { name } = route.params || {};
  console.log("Received name:", name);
  const isTablet = width >= 600;
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // columns: mobile = 2, tablet = 3
  const numColumns = isTablet ? 3 : 2;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHistoryTypes();
        const sloganData = Array.isArray(data)
        ? data.filter(item => item.category === "slogan")
        : [];
        setTypes(sloganData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
     <Loader/>
    );
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.card, isTablet && styles.cardTablet]}
        onPress={() =>
          navigation.navigate("SloganPage2", {
            id: item.id,
            name: item.name,
            category: item.category,
          })
        }
      >
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>

        <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.arrowCircle}>
          <Ionicons name="chevron-forward" size={16} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      {/* HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>

        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          {name || "Slogan"}
        </Text>

        {/* spacer to keep center */}
        <View style={styles.headerSide} />
      </View>

      {/* GRID */}
      <FlatList
        data={types}
        key={numColumns} // important when switching columns
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={numColumns > 1 ? styles.row : null}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* LOADER */
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  /* HEADER */
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
    paddingTop:60,
    paddingBottom:28,
    paddingHorizontal: 18,
  },
  headerSide: {
    width: 44, // keeps title centered
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  headerTitleTablet: {
    fontSize: 28,
    
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

  /* LIST */
  listContainer: {
    padding: 12,
    paddingBottom: 28,
  },

  row: {
    justifyContent: "space-between",
  },

  /* CARD */
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 14,
    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    overflow: "hidden",
  },

  cardTablet: {
    width: "31.5%",
    padding: 12,
    borderRadius: 18,
  },

  imageWrap: {
    width: "100%",
    aspectRatio: 1.1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f3f3f3",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  title: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    lineHeight: 18,
    paddingRight: 30,
  },

  titleTablet: {
    fontSize: 16,
    lineHeight: 22,
  },

  /* small arrow badge */
  arrowCircle: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 20,
    height: 20,
    borderRadius: 13,
    backgroundColor: "#93210A",
    alignItems: "center",
    justifyContent: "center",
  },
});
