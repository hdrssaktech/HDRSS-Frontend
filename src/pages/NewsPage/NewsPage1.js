// screens/NewsPage1.js

import React, { useEffect, useState, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { fetchNews } from "../../Controller/NewsController/NewsController";
import Loader from "../../components/Alert/Loader";

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

/* 🔹 Category Pill */
const CategoryPill = ({ label, active, onPress, styles }) => (
  <TouchableOpacity
    style={[styles.pill, active && styles.pillActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.pillText, active && styles.pillTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

/* 🔹 Card Component */
const ListCard = ({ item, index, onPress, styles }) => (
  <TouchableOpacity style={styles.listCardRow1} onPress={onPress} activeOpacity={0.85}>
    {item.image ? (
      <Image source={{ uri: item.image }} style={styles.listCardImage1} />
    ) : (
      <View style={[styles.listCardImage1, styles.imagePlaceholder]}>
        <Ionicons name="newspaper-outline" size={30} color="#ccc" />
      </View>
    )}
    <View style={styles.listCardContent1}>
      <View style={styles.badgeRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {index === 0 ? "TOP" : capitalize(item.type)}
          </Text>
        </View>
      </View>
      <Text style={styles.listCardTitle1} numberOfLines={3}>
        {item.title}
      </Text>
      {/* Small category tag */}
      {item.categories && item.categories.length > 0 && (
        <View style={styles.categoryTagContainer}>
          {item.categories.slice(0, 2).map((cat, idx) => (
            <View key={idx} style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{capitalize(cat)}</Text>
            </View>
          ))}
          {item.categories.length > 2 && (
            <Text style={styles.moreCategories}>+{item.categories.length - 2}</Text>
          )}
        </View>
      )}
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await fetchNews();
      console.log("Total news fetched:", data.length);

      // Sort by orderNo
      const sortedNews = data.sort((a, b) => {
        const orderA = a.orderNo ?? Infinity;
        const orderB = b.orderNo ?? Infinity;
        return orderA - orderB;
      });

      setNews(sortedNews);
      console.log("News set:", sortedNews.length);
      
    } catch (error) {
      console.log("Error loading news:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
  };

  /* 🔹 Build category tabs dynamically from news data */
  const categories = useMemo(() => {
    const categorySet = new Set();

    news.forEach((item) => {
      const cats = item.categories || [item.type];
      cats.forEach((cat) => {
        if (cat && cat.trim() !== "") {
          categorySet.add(cat.toLowerCase());
        }
      });
    });

    const uniqueCategories = Array.from(categorySet);
    console.log("Categories found:", uniqueCategories);

    return ["All", ...uniqueCategories.sort()];
  }, [news]);

  /* 🔹 Filter list based on selected category */
  const filteredNews = useMemo(() => {
    if (selectedCategory === "All") {
      return news;
    }

    const filtered = news.filter((item) => {
      const cats = item.categories || [item.type];
      return cats.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase());
    });

    return filtered;
  }, [news, selectedCategory]);

  return (
    <SafeAreaView style={styles.mainContainer1}>
      <StatusBar barStyle="light-content" />

      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={isTablet ? 26 : 22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle1}>News</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      {/* 🔹 Category Tabs */}
      {!loading && categories.length > 1 && (
        <LinearGradient
          colors={["#FBEEDB", "#F1DDB0"]}
          style={styles.categoryWrapper}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                label={capitalize(cat)}
                active={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
                styles={styles}
              />
            ))}
          </ScrollView>
        </LinearGradient>
      )}

      {/* 🔹 Loader or News List */}
      {loading ? (
        <Loader />
      ) : (
        <ScrollView
          style={styles.listBackground}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredNews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="newspaper-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No news available</Text>
              <Text style={styles.emptySubText}>Pull down to refresh</Text>
            </View>
          ) : (
            <>
              {filteredNews.map((item, index) => (
                <ListCard
                  key={item.id}
                  item={item}
                  index={index}
                  styles={styles}
                  onPress={() =>
                    navigation.navigate("Newspage2", { news: item })
                  }
                />
              ))}
              <View style={styles.bottomPadding} />
            </>
          )}
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
      backgroundColor: "#FBEEDB",
    },

    /* 🔹 Header */
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: isTablet ? 23 : 18,
      paddingHorizontal: 16,
      paddingTop: 49,
      backgroundColor: "#93210A",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 4,
    },

    backBtn: {
      width: isTablet ? 40 : 36,
      height: isTablet ? 40 : 36,
      borderRadius: isTablet ? 20 : 18,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },

    rightPlaceholder: {
      width: isTablet ? 40 : 36,
      height: isTablet ? 40 : 36,
    },

    headerTitle1: {
      color: "white",
      fontWeight: "bold",
      fontSize: isTablet ? 26 : 20,
      textAlign: "center",
      flex: 1,
    },

    /* 🔹 Category Tabs */
    categoryWrapper: {
      paddingVertical: isTablet ? 14 : 10,
      borderBottomWidth: 2,
      borderBottomColor: "#D4AF37",
      backgroundColor: "#FBEEDB",
    },

    categoryScrollContent: {
      paddingHorizontal: isTablet ? 24 : 14,
      alignItems: "center",
    },

    pill: {
      paddingVertical: isTablet ? 10 : 7,
      paddingHorizontal: isTablet ? 22 : 16,
      borderRadius: 20,
      backgroundColor: "#fff",
      borderWidth: 1.2,
      borderColor: "#D4AF37",
      marginRight: 10,
    },

    pillActive: {
      backgroundColor: "#93210A",
      borderColor: "#93210A",
      elevation: 3,
      shadowColor: "#93210A",
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },

    pillText: {
      fontSize: isTablet ? 16 : 11,
      fontWeight: "600",
      color: "#93210A",
    },

    pillTextActive: {
      color: "#fff",
    },

    listBackground: {
      flex: 1,
      backgroundColor: "#FBEEDB",
    },

    listContentContainer: {
      flexGrow: 1,
      paddingBottom: 20,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 100,
    },

    emptyText: {
      textAlign: "center",
      color: "#888",
      marginTop: 20,
      fontSize: isTablet ? 18 : 14,
      fontWeight: "600",
    },

    emptySubText: {
      textAlign: "center",
      color: "#aaa",
      marginTop: 8,
      fontSize: isTablet ? 14 : 12,
    },

    /* 🔹 News Card */
    listCardRow1: {
      flexDirection: "row",
      backgroundColor: "#FFFDF7",
      borderRadius: 16,
      marginHorizontal: isTablet ? 30 : 13,
      marginTop: isTablet ? 30 : 20,
      padding: isTablet ? 16 : 10,
      elevation: 3,
      shadowColor: "#301913",
      shadowOpacity: 0.12,
      shadowRadius: 6,
      borderLeftWidth: 5,
      borderLeftColor: "#93210A",
    },

    listCardImage1: {
      width: isTablet ? 140 : 130,
      height: isTablet ? 140 : 115,
      borderRadius: 12,
      marginRight: 16,
    },

    imagePlaceholder: {
      backgroundColor: "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
    },

    listCardContent1: {
      flex: 1,
      justifyContent: "center",
    },

    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      flexWrap: "wrap",
    },

    typeBadge: {
      backgroundColor: "#93210A",
      paddingHorizontal: isTablet ? 12 : 9,
      paddingVertical: isTablet ? 4 : 2,
      borderRadius: 6,
      marginRight: 8,
    },

    typeBadgeText: {
      fontSize: isTablet ? 13 : 9,
      color: "#fff",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    listCardTitle1: {
      fontSize: isTablet ? 18 : 12,
      fontWeight: "bold",
      color: "#222",
      lineHeight: isTablet ? 26 : 19,
      marginBottom: 6,
    },

    /* Category Tags - Small */
    categoryTagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: 4,
    },

    categoryTag: {
      backgroundColor: '#f0e6d8',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      marginRight: 5,
      marginBottom: 3,
      borderWidth: 0.5,
      borderColor: '#d4c4b0',
    },

    categoryTagText: {
      fontSize: isTablet ? 11 : 9,
      color: '#6b4c3b',
      fontWeight: '500',
    },

    moreCategories: {
      fontSize: isTablet ? 11 : 9,
      color: '#999',
      fontWeight: '500',
      marginLeft: 2,
    },

    bottomPadding: {
      height: 40,
    },
  });