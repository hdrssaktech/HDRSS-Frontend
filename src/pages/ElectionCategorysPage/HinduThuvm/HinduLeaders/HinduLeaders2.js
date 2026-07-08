import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Loader from "../../../../components/Alert/Loader";

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
        activeOpacity={0.82}
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
        {/* Left side - Image */}
        <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>

        {/* Right side - Content */}
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
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

          <View style={[styles.arrowCircle, isTablet && styles.arrowCircleTablet]}>
            <Ionicons
              name="chevron-forward"
              size={isTablet ? 20 : 16}
              color="#93210A"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

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

        <View style={styles.headerSide} />
      </View>

      {/* Body */}
      <View style={styles.contentWrapper}>
        {error ? (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={52} color="#93210A" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchDetails}>
              <Text style={styles.retryText}>மீண்டும் முயற்சிக்கவும்</Text>
            </TouchableOpacity>
          </View>
        ) : details.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="people-outline" size={52} color="#ccc" />
            <Text style={styles.emptyText}>எந்த விவரங்களும் இல்லை</Text>
          </View>
        ) : (
          <FlatList
            data={details}
            key={`${numColumns}_${width}`}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#d4cea6" },
  contentWrapper: { flex: 1, backgroundColor: "#d4cea6" },

  // Header
  header: {
    backgroundColor: "#93210A",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  backBtnTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 24,
    letterSpacing: 0.4,
  },

  headerSide: { width: 44, justifyContent: "center", alignItems: "flex-start" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },

  errorText: {
    marginTop: 12,
    color: "#93210A",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyText: {
    marginTop: 12,
    color: "#888",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  retryBtn: {
    marginTop: 14,
    backgroundColor: "#93210A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: "#fff", fontWeight: "900", fontSize: 14 },

  // Card
  card: {
    backgroundColor: "#FFFDF8",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: "rgba(147,33,10,0.06)",
  },
  cardTablet: {
    padding: 16,
    borderRadius: 18,
    elevation: 4,
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  // Left side - Image Container
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a0a00",
    flexShrink: 0,
  },
  imageContainerTablet: {
    width: 100,
    height: 100,
    borderRadius: 14,
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  // Right side - Content Container
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 14,
  },
  contentContainerTablet: {
    marginLeft: 16,
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
  },

  name: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#93210A",
    marginBottom: 2,
  },
  nameTablet: { fontSize: 17, fontWeight: "900" },

  oneLine: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#666",
    lineHeight: 16,
  },
  oneLineTablet: {
    fontSize: 13,
    lineHeight: 18,
  },

  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF0EE",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    flexShrink: 0,
  },
  arrowCircleTablet: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
});