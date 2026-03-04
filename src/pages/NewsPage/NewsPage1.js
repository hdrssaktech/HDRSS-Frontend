import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,  
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchNews } from "../../Controller/NewsController/NewsController";

import Loader from "../../components/Alert/Loader";

/* 🔹 Card Component */
const ListCard = ({ item, onPress, styles }) => (
  <TouchableOpacity style={styles.listCardRow1} onPress={onPress}>
    <Image source={{ uri: item.image }} style={styles.listCardImage1} />
    <View style={styles.listCardContent1}>
      <Text style={styles.listCardCategory}>{item.type}</Text>
      <Text style={styles.listCardTitle1} numberOfLines={2}>
        {item.title}
      </Text>
      {/* Optional: Display order number for debugging */}
      {/* <Text style={{ fontSize: 10, color: '#999', marginTop: 4 }}>Order: {item.orderno}</Text> */}
    </View>
  </TouchableOpacity>
);

export default function NewsPage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const styles = getStyles(isTablet);

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchNews();
      
      // Sort the data by orderno in ascending order
      const sortedData = data.sort((a, b) => {
        const orderA = a.orderNo ?? Infinity;
        const orderB = b.orderNo ?? Infinity;
        return orderA - orderB;
      });
      
      setNews(sortedData);
      setLoading(false);
     
    };
    loadNews();
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer1}>
      <StatusBar barStyle="light-content" />

      {/* 🔹 Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={isTablet ? 30 : 24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle1}>Latest News</Text>
      </View>

      {/* 🔹 Loader */}
      {loading ? (
        <Loader/>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {news.map((item) => (
            <ListCard
              key={item.id}
              item={item}
              styles={styles}
              onPress={() =>
                navigation.navigate("Newspage2", { news: item })
              }
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const getStyles = (isTablet) =>
  StyleSheet.create({
    mainContainer1: {
      flex: 1,
      backgroundColor: "#f4f4f4",
    },

    /* 🔹 Header */
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: isTablet ? 23 : 18,
      paddingHorizontal: 16,
      paddingTop: 49,
      backgroundColor: "#93210A",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 4,
    },

    headerTitle1: {
      color: "white",
      fontWeight: "bold",
      fontSize: isTablet ? 26 : 20,
      marginLeft: 20,
      left: isTablet ? 200 : 55,
    },
    /* 🔹 News Card */
    listCardRow1: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 14,
      marginHorizontal: isTablet ? 30 : 13,
      marginTop: isTablet ? 30 : 25,
      padding: isTablet ? 16 : 10,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },

    listCardImage1: {
      width: isTablet ? 140 : 100,
      height: isTablet ? 140 : 100,
      borderRadius: 12,
      marginRight: 16,
    },

    listCardContent1: {
      flex: 1,
      justifyContent: "center",
    },

    listCardCategory: {
      fontSize: isTablet ? 16 : 12,
      color: "#93210A",
      fontWeight: "600",
      marginBottom: 6,
    },

    listCardTitle1: {
      fontSize: isTablet ? 18 : 12,
      fontWeight: "bold",
      color: "#222",
      lineHeight: isTablet ? 26 : 18,
    },
  });