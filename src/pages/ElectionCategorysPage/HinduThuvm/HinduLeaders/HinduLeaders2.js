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

export default function HinduLeadersDetailsList({ route, navigation }) {
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

  // ✅ tablet = 3 columns, mobile = 1 column
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

      const url = `https://hdrss-backend.onrender.com/api/hindu-leaders/category/${categoryId}`;
      const res = await axios.get(url);

      const list = res.data?.HinduLeadersDetails ?? [];
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
          navigation.navigate("HinduLeaders3", {
            leader: item,
            categoryName: categoryName,
          })
        }
      >
        <Image
          source={{ uri: item.image }}
          style={[styles.cardImage, isTablet && styles.cardImageTablet]}
        />

        <View style={{ flex: 1 }}>
          <Text style={[styles.name, isTablet && styles.nameTablet]}>
            {item.name}
          </Text>

          <Text
            style={[styles.oneLine, isTablet && styles.oneLineTablet]}
            numberOfLines={2}
          >
            {item.oneLineIdentity}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={isTablet ? 24 : 20}
          color="#444"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backBtn, isTablet && styles.backBtnTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          {categoryName || "Details"}
        </Text>

        <View style={{ width: isTablet ? 50 : 40 }} />
      </View>

      {/* Body */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>Loading...</Text>
        </View>
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
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  // Header (mobile)
  header: {
    backgroundColor: "#93210A",
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTablet: {
    paddingHorizontal: 24,
    paddingVertical: 26,
  },

  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop:20,
  },
  backBtnTablet: {
    width: 50,
    height: 50,
    marginTop:2,
  },

  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    paddingHorizontal: 10,
     marginTop:20,
  },
  headerTitleTablet: {
    fontSize: 21,
    letterSpacing: 0.4,
    

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
  },
  cardImageTablet: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 16,
  },

  name: { fontSize: 15, fontWeight: "800", color: "#111" },
  nameTablet: { fontSize: 15, fontWeight: "900" },

  oneLine: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 19,
  },
  oneLineTablet: {
    fontSize: 12,
    marginBottom: 16,
  },
});
