// TourismPlacesList.js - First Page
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  TextInput,
  FlatList,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import Loader from "../../../components/Alert/Loader";

// Brand Colors
const C = {
  primary: "#93210A",
  dark: "#301913",
  gold: "#D4AF37",
  bg: "#d4cea6",
  card: "#ede8d5",
  white: "#FFFFFF",
  text: "#1a0a00",
  textMid: "#5a3a2a",
  border: "rgba(48,25,19,0.25)",
  shadow: "#301913",
};

const CAT_META = {
  All: { icon: "apps", lib: "MaterialIcons", color: C.primary },
  Hotel: { icon: "bed", lib: "FontAwesome5", color: "#1565C0" },
  Restaurant: { icon: "utensils", lib: "FontAwesome5", color: "#E65100" },
  Shopping: { icon: "shopping-bag", lib: "FontAwesome5", color: "#6A1B9A" },
  "Hill Station": { icon: "mountain", lib: "FontAwesome5", color: "#2E7D32" },
  Other: { icon: "ellipsis-h", lib: "FontAwesome5", color: C.textMid },
};

const IMAGE_BASE_URL = "https://hdrss-backend.onrender.com/";
const CATEGORIES = ["All", "Hotel", "Restaurant", "Shopping", "Hill Station", "Other"];

function CategoryPill({ label, active, onPress, isTablet }) {
  const meta = CAT_META[label] || CAT_META.Other;
  const sz = isTablet ? 13 : 11;
  const Icon = () =>
    meta.lib === "MaterialIcons"
      ? <MaterialIcons name={meta.icon} size={sz} color={active ? C.dark : C.textMid} />
      : <FontAwesome5 name={meta.icon} size={sz - 1} color={active ? C.dark : C.textMid} />;

  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive, isTablet && styles.pillTablet]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon />
      <Text style={[styles.pillText, active && styles.pillTextActive, isTablet && styles.pillTextTablet]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function PlaceCard({ item, onPress, cardWidth, isTablet }) {
  const meta = CAT_META[item.category] || CAT_META.Other;
  const imgUri = item.image
    ? item.image.startsWith("http") ? item.image : IMAGE_BASE_URL + item.image
    : "https://cdn-icons-png.flaticon.com/512/2659/2659360.png";

  const imgH = isTablet ? 120 : 85;
  const footerFS = isTablet ? 12 : 10;
  const arrowSize = isTablet ? 20 : 16;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.87}
    >
      {/* Image Section */}
      <View style={styles.imgWrap}>
        <Image
          source={{ uri: imgUri }}
          style={{ width: "100%", height: imgH }}
          resizeMode="cover"
        />
        <View style={styles.imgFade} />
        <View style={styles.goldStripe} />
        {item.category && (
          <View style={[styles.catBadge, { backgroundColor: meta.color }]}>
            <Text style={styles.catBadgeText}>{item.category}</Text>
          </View>
        )}
      </View>

      {/* Footer - Title and Arrow Only */}
      <View style={[styles.cardFooter, { paddingHorizontal: isTablet ? 9 : 7 }]}>
        <Text
          style={[
            styles.cardFooterText,
            {
              fontSize: footerFS,
              lineHeight: footerFS + 4,
              paddingTop: isTablet ? 8 : 6,
              paddingBottom: isTablet ? 8 : 6,
            },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <View
          style={[
            styles.arrowDot,
            { width: arrowSize, height: arrowSize, borderRadius: arrowSize / 2 },
          ]}
        >
          <Ionicons name="chevron-forward" size={isTablet ? 11 : 9} color={C.dark} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function TourismPlacesList() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600 && width < 1024;
  const isLargeTablet = width >= 1024;

  const numColumns = (isTablet || isLargeTablet) ? 4 : 3;
  const HP = isLargeTablet ? 20 : isTablet ? 16 : 10;
  const GAP = isLargeTablet ? 12 : isTablet ? 10 : 8;

  const cardW = () => {
    const available = width - HP * 2;
    return (available - GAP * (numColumns - 1)) / numColumns;
  };

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://hdrss-backend.onrender.com/api/tourism/tourismplaces/${id}`);
        const result = await res.json();
        setData(result.data || []);
        setFilteredData(result.data || []);
      } catch (e) { console.log("Error:", e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    let f = [...data];
    if (selectedCategory !== "All")
      f = f.filter(i => i.category?.toLowerCase() === selectedCategory.toLowerCase());
    if (searchQuery.trim())
      f = f.filter(i =>
        i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    setFilteredData(f);
  }, [selectedCategory, searchQuery, data]);

  if (loading) return <Loader />;

  const resultLabel = filteredData.length === 0
    ? "No places found"
    : `${filteredData.length} place${filteredData.length !== 1 ? "s" : ""}`;

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 28 : 24} color={C.white} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[styles.headerTitle, isTablet && { fontSize: 22 }]}>
            Tourism Places
          </Text>
         
        </View>

        <View style={[styles.backBtn, { backgroundColor: "transparent" }]} />
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { marginHorizontal: HP }]}>
        <Ionicons name="search" size={16} color={C.textMid} />
        <TextInput
          style={[styles.searchInput, isTablet && { fontSize: 15 }]}
          placeholder="Search places, locations…"
          placeholderTextColor="rgba(90,58,42,0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={16} color={C.textMid} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <View style={{ marginTop: 10, marginBottom: 12, paddingHorizontal: HP }}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i}
          ItemSeparatorComponent={() => <View style={{ width: 7 }} />}
          renderItem={({ item }) => (
            <CategoryPill
              label={item}
              active={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              isTablet={isTablet || isLargeTablet}
            />
          )}
        />
      </View>

      {/* Grid */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        key={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingHorizontal: HP, paddingBottom: 36 },
          filteredData.length === 0 && { flex: 1 },
        ]}
        columnWrapperStyle={{ gap: GAP, marginBottom: GAP }}
        ListEmptyComponent={() => (
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="map-outline" size={isTablet ? 48 : 40} color={C.primary} />
            </View>
            <Text style={[styles.emptyTitle, isTablet && { fontSize: 18 }]}>
              No places found
            </Text>
            <Text style={styles.emptySub}>Try a different category or search</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <PlaceCard
            item={item}
            cardWidth={cardW()}
            isTablet={isTablet || isLargeTablet}
            onPress={() => navigation.navigate("TourismPlaceDetails", { place: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    paddingTop: (StatusBar.currentHeight || 24) + 10,
    paddingBottom: 20,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 6,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerTablet: {
    paddingTop: (StatusBar.currentHeight || 24) + 18,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 14,
    borderWidth: 1,
    borderColor: C.border,
    gap: 8,
    elevation: 2,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: C.text,
    fontWeight: "500",
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    elevation: 1,
  },
  pillActive: { backgroundColor: C.gold, borderColor: C.gold },
  pillTablet: { paddingHorizontal: 13, paddingVertical: 8 },
  pillText: { fontSize: 11, fontWeight: "600", color: C.textMid },
  pillTextActive: { color: C.dark },
  pillTextTablet: { fontSize: 13 },

  card: {
    backgroundColor: C.dark,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: C.border,
  },

  imgWrap: {
    width: "100%",
    backgroundColor: "#c8c2a0",
    overflow: "hidden",
    position: "relative",
  },
  imgFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "35%",
    backgroundColor: "rgba(48,25,19,0.18)",
  },
  goldStripe: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: C.gold,
  },
  catBadge: {
    position: "absolute",
    top: 5,
    left: 5,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  catBadgeText: {
    color: C.white,
    fontSize: 7,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  cardFooter: {
    backgroundColor: C.dark,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: "rgba(212,175,55,0.2)",
  },
  cardFooterText: {
    flex: 1,
    flexShrink: 1,
    fontWeight: "700",
    color: C.white,
    
  },
  arrowDot: {
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(147,33,10,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.2)",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.dark,
  },
  emptySub: {
    fontSize: 12,
    color: C.textMid,
    textAlign: "center",
    paddingHorizontal: 30,
  },
});