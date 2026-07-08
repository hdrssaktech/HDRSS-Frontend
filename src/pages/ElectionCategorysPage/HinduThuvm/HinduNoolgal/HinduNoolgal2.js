import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Loader from "../../../../components/Alert/Loader";

export default function HinduNoolgal2({ route, navigation }) {
  const { categoryId, categoryName } = route.params;

  const [windowDimensions, setWindowDimensions] = useState(
    Dimensions.get("window")
  );
  const { width, height } = windowDimensions;

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ update on resize / rotate
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // ✅ tablet check
  const isTablet = useMemo(() => {
    return width >= 600 || (width > height && width >= 600);
  }, [width, height]);

  // ✅ tablet = 2 columns, mobile = 1 column
  const numColumns = isTablet ? 2 : 1;

  // spacing
  const LIST_PADDING = isTablet ? 24 : 16;
  const GAP = isTablet ? 18 : 16;

  // card width
  const cardWidth = useMemo(() => {
    if (numColumns === 1) return width - LIST_PADDING * 2;
    const available = width - LIST_PADDING * 2;
    const totalGaps = GAP * (numColumns - 1);
    return (available - totalGaps) / numColumns;
  }, [width, numColumns, LIST_PADDING, GAP]);

  useEffect(() => {
    fetchDetails();
  }, [categoryId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const url = `https://hdrss-backend.onrender.com/api/hindu-noolgal/category/${categoryId}`;
      const res = await axios.get(url);

      // ✅ IMPORTANT FIX: correct array name
      const list = res.data?.HinduNoolgalDetails ?? [];
      setDetails(list);
    } catch (e) {
      console.log("API ERROR:", e?.response?.data || e.message);
      setError("Details load ஆகவில்லை. API / network check பண்ணுங்க.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => {
    const isLastInRow = (index + 1) % numColumns === 0;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.card,
          isTablet && styles.cardTablet,
          {
            width: cardWidth,
            marginRight: numColumns === 1 || isLastInRow ? 0 : GAP,
          },
        ]}
        onPress={() =>
          navigation.navigate("HinduNoolgal3", {
            nool: item,
            categoryName: categoryName,
          })
        }
      >
        {/* Book Image */}
        <Image
          source={{ uri: item.image || item.gallery?.[0] }}
          style={[styles.cardImage, isTablet && styles.cardImageTablet]}
        />

        <View style={{ flex: 1 }}>
          {/* Book Name */}
          <Text style={[styles.name, isTablet && styles.nameTablet]}>
            {item.noolname}
          </Text>

          {/* Author */}
          {!!item.author && (
            <Text
              style={[styles.author, isTablet && styles.authorTablet]}
              numberOfLines={1}
            >
              ஆசிரியர்: {item.author}
            </Text>
          )}

          {/* Birth/Time Period */}
          {!!item.birth && (
            <Text
              style={[styles.birth, isTablet && styles.birthTablet]}
              numberOfLines={1}
            >
              காலம்: {item.birth}
            </Text>
          )}

          {/* One line description if available */}
          {!!item.oneLineIdentity && (
            <Text
              style={[styles.oneLine, isTablet && styles.oneLineTablet]}
              numberOfLines={2}
            >
              {item.oneLineIdentity}
            </Text>
          )}
        </View>

        {/* <Ionicons
          name="chevron-forward"
          size={isTablet ? 24 : 20}
          color="#444"
        /> */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
     

      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backBtn, isTablet && styles.backBtnTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          {categoryName || "நூல்கள்"}
        </Text>

        <View style={{ width: isTablet ? 50 : 40 }} />
      </View>

      {/* Body */}
      {loading ? (
        <Loader/>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={details}
          key={`${numColumns}_${width}`} // ✅ important
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: LIST_PADDING,
            paddingBottom: isTablet ? 40 : 30,
          }}
          ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d4cea6" },

  // Header (mobile)
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

  backBtn: {
     width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  backBtnTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  headerTitle: {
      flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 22,
    
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Card (mobile)
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  cardTablet: {
    padding: 14,
    borderRadius: 18,
    elevation: 3,
  },

  cardImage: {
    width: 74,
    height: 74,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: "#f0f0f0",
  },
  cardImageTablet: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 16,
  },

  name: { 
    fontSize: 15, 
    fontWeight: "800", 
    color: "#111",
    marginBottom: 4,
  },
  nameTablet: { 
    fontSize: 16, 
    fontWeight: "900",
    marginBottom: 6,
  },

  author: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    marginBottom: 2,
  },
  authorTablet: {
    fontSize: 13,
    marginBottom: 3,
  },

  birth: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8B0000",
    marginBottom: 8,
  },
  birthTablet: {
    fontSize: 12,
    marginBottom: 10,
  },

  oneLine: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    lineHeight: 16,
  },
  oneLineTablet: {
    fontSize: 13,
    lineHeight: 18,
  },
});