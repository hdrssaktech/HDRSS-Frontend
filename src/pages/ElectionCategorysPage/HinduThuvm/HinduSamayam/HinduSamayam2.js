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

export default function HinduSamayam2({ route, navigation }) {
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

      const url = `https://hdrss-backend.onrender.com/api/hindu-samayam/category/${categoryId}`;
      const res = await axios.get(url);

      // ✅ IMPORTANT: correct key name is HindusamayamDetails
      const list = res.data?.HindusamayamDetails ?? [];
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
          navigation.navigate("HinduSamayam3", {
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

          {/* ✅ day */}
          {!!item.day && (
            <Text style={[styles.dayText, isTablet && styles.dayTextTablet]}>
              காலம்: {item.day}
            </Text>
          )}

          {/* ✅ importantIntention */}
          {!!item.importantIntention && (
            <Text
              style={[styles.intentText, isTablet && styles.intentTextTablet]}
              numberOfLines={2}
            >
              {item.importantIntention}
            </Text>
          )}
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
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />

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

      {/* BANNER */}
              <View style={[styles.bannerWrap, isTablet && styles.bannerWrapTablet]}>
                <Image source={{ uri: bannerUri }} style={styles.banner} resizeMode="cover" />
                <View style={styles.bannerOverlay} />
                
                {/* {categoryName && (
                  <View style={[styles.categoryChip, isTablet && styles.categoryChipTablet]}>
                    <Text style={[styles.categoryChipText, isTablet && styles.categoryChipTextTablet]}>
                      {categoryName}
                    </Text>
                  </View>
                )} */}
              </View>

      {/* Body */}
      {loading ? (
        <Loader/>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: "#8B0000", textAlign: "center", fontWeight: "700" }}>
            {error}
          </Text>
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
  container: { flex: 1, backgroundColor: "#FFFFFF" },

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
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
     fontSize: 22,
  },

  center: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

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

  name: { 
    fontSize: 15, 
    fontWeight: "900", 
    color: "#111",
    marginBottom: 4,
  },
  nameTablet: { 
    fontSize: 16, 
    fontWeight: "900",
    marginBottom: 6,
  },

  dayText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8B0000",
    marginBottom: 4,
  },
  dayTextTablet: {
    fontSize: 13,
    marginBottom: 6,
  },

  intentText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#555",
    lineHeight: 16,
  },
  intentTextTablet: {
    fontSize: 13,
    lineHeight: 18,
  },
});