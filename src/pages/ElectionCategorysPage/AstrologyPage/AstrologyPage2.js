// src/pages/Astrology/AstrologyPage2.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { fetchAstrologyByType } from "../../../Controller/AstrologyController/AstrologyController";

export default function AstrologyPage2({ route }) {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const astrologyType = route.params.astrologyType;
  const typeId = astrologyType.id;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchAstrologyByType(typeId);
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [typeId]);

  const numColumns = isTablet ? 3 : 2;

  return (
    <View style={styles.container}>
      {/* 🔴 HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            isTablet && styles.headerTitleTablet,
          ]}
        >
          {astrologyType.name}
        </Text>
      </View>

      {/* 🔹 CONTENT */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#93210A"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={data}
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={[
            styles.list,
            isTablet && styles.listTablet,
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                isTablet && styles.cardTablet,
              ]}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("AstrologyPage3", {
                  astrologyItem: item,
                })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={[
                  styles.image,
                  isTablet && styles.imageTablet,
                ]}
              />

              <Text
                style={[
                  styles.name,
                  isTablet && styles.nameTablet,
                ]}
              >
                {item.name}
              </Text>

              <Text
                style={[
                  styles.title,
                  isTablet && styles.titleTablet,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  /* 🔹 CONTAINER */
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* 🔴 HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },

  headerTablet: {
    paddingVertical: 35,
    paddingHorizontal: 25,
    marginTop: -3,
  },

  headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20, marginLeft: 30,
    padding:8,
   

  },

  headerTitleTablet: {
    fontSize: 28,
    padding:8,
    left:125,
  },

  /* 📜 LIST */
  list: {
    padding: 12,
    paddingBottom: 30,
  },

  listTablet: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  /* 🟧 CARD */
  card: {
    flex: 1,
    backgroundColor: "#FFF7F5",
    borderRadius: 14,
    padding: 12,
    margin: 6,
    alignItems: "center",
    elevation: 3,
  },

  cardTablet: {
    padding: 18,
    margin: 10,
    borderRadius: 18,
  },

  /* 🖼️ IMAGE */
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },

  imageTablet: {
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
  },

  /* 🏷️ NAME */
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "center",
    marginBottom: 4,
  },

  nameTablet: {
    fontSize: 20,
  },

  /* 📝 TITLE */
  title: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
  },

  titleTablet: {
    fontSize: 16,
    lineHeight: 22,
  },
});
