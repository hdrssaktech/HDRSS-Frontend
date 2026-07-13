import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getProductCategories } from "../../api/api";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 600;

const BUBBLE = isTablet ? 170 : 108;
const OUTER_RING = BUBBLE + (isTablet ? 24 : 18); // white outer circle
const ITEM_WIDTH = OUTER_RING + 24;
const CARD_GAP = isTablet ? 20 : 16;
const HOME_LIMIT = 6;

const C = {
  primary: "#8B1A1A",
  white: "#fcdb9e",
  cream: "#f5dcb7", // sandal cream, inner circle
};

/* -------------------- Category Bubble (double circle) -------------------- */

function CategoryBubble({ item, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={bubbleStyles.wrapper}
    >
      {/* Outer white circle */}
      <View style={bubbleStyles.outerRing}>
        {/* Inner sandal-cream circle */}
        <View style={bubbleStyles.innerCircle}>
          <Image
            source={{
              uri: item.image || "https://via.placeholder.com/200x200",
            }}
            style={bubbleStyles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      <Text style={bubbleStyles.label} numberOfLines={2}>
        {item.categoryName}
      </Text>
    </TouchableOpacity>
  );
}

const bubbleStyles = StyleSheet.create({
  wrapper: {
    width: ITEM_WIDTH,
    marginRight: CARD_GAP,
    alignItems: "center",
  },

  // Outer white circle — no border, just a soft shadow for depth
  outerRing: {
    width: OUTER_RING,
    height: OUTER_RING,
    borderRadius: OUTER_RING / 2,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#8B1A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  // Inner sandal-cream circle that holds the image
  innerCircle: {
    width: BUBBLE,
    height: BUBBLE,
    borderRadius: BUBBLE / 2,
    backgroundColor: C.cream,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: isTablet ? 15 : 10,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  label: {
    marginTop: isTablet ? 12 : 10,
    fontSize: isTablet ? 15 : 13,
    fontWeight: "700",
    color: C.primary,
    textAlign: "center",
    maxWidth: ITEM_WIDTH,
    lineHeight: isTablet ? 22 : 18,
  },
});

/* -------------------- Main Screen -------------------- */

export default function ProductScreen1() {
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getProductCategories();

      let catList = Array.isArray(data)
        ? data
        : data?.data ?? [];

      catList.sort((a, b) =>
        (a.categoryName || "").localeCompare(b.categoryName || "")
      );

      setCategories(catList);
    } catch (err) {
      console.log("ProductScreen1 Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const ads = [];

  categories.forEach((cat) => {
    (cat.advertisementImages || []).forEach((url) => {
      ads.push({
        image: url,
        title: cat.categoryName,
      });
    });
  });

  const homeCategories = categories.slice(0, HOME_LIMIT);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.heading}>Products</Text>

        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={() =>
            navigation.navigate("ProductScreen1fullproducts", {
              categories,
              ads,
            })
          }
        >
          <Text style={styles.seeAllText}>See All</Text>

          <Ionicons
            name="arrow-forward"
            size={isTablet ? 18 : 16}
            color={C.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Categories */}

      <FlatList
        data={homeCategories}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryBubble
            item={item}
            onPress={() =>
              navigation.navigate("ProductScreen2", {
                category: item.categoryName,
                categoryId: item.id,
              })
            }
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}
        snapToInterval={ITEM_WIDTH + CARD_GAP}
        decelerationRate="fast"
        snapToAlignment="start"
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: isTablet ? 24 : 18,
    marginBottom: isTablet ? 32 : 24,
  },

  loader: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: isTablet ? 24 : 20,
    marginBottom: isTablet ? 24 : 20,
  },

  heading: {
    fontSize: isTablet ? 24 : 19.5,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: 0.3,
  },

  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  seeAllText: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: "700",
    color: C.primary,
    marginRight: 4,
  },

  strip: {
    paddingLeft: isTablet ? 24 : 20,
    paddingRight: isTablet ? 28 : 24,
    paddingVertical: isTablet ? 10 : 6,
  },
});