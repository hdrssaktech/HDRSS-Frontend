import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchTourismByType } from "../../../Controller/TourismController/TourismController";
import Loader from "../../../components/Alert/Loader";
import { useLanguage } from "../../../context/LanguageContext";
import { t, getLocalizedField, sortByDirection, DIRECTION_LABELS } from "../../../utils/localization";

const C = {
  primary: "#93210A",
  dark:    "#301913",
  gold:    "#D4AF37",
  bg:      "#d4cea6",
  card:    "#ede8d5",
  white:   "#FFFFFF",
  text:    "#1a0a00",
  border:  "rgba(48,25,19,0.25)",
};

export default function TourismPage2() {
  const navigation = useNavigation();
  const route      = useRoute();
  const { typeId, typeName, typeObj } = route.params;
  const { language } = useLanguage();

  const displayedTypeName = typeObj
    ? getLocalizedField(typeObj, "name", language)
    : typeName;

  const { width }      = useWindowDimensions();
  const isTablet       = width >= 600;
  const isLargeTablet  = width >= 1024;

  const [places,         setPlaces]         = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchText,     setSearchText]     = useState("");
  const [loading,        setLoading]        = useState(true);

  const numColumns     = isLargeTablet ? 3 : isTablet ? 3 : 2;
  const HORIZONTAL_PAD = isTablet ? 32 : 16;
  const GAP            = isTablet ? 16 : 10;

  const cardWidth = useMemo(
    () =>
      Math.floor(
        (width - HORIZONTAL_PAD * 2 - GAP * (numColumns - 1)) / numColumns
      ),
    [width, numColumns, HORIZONTAL_PAD, GAP]
  );

  const footerFontSize = isTablet ? 15 : 13;
  const dotSize        = isTablet ? 26 : 22;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTourismByType(typeId);
        const sorted = sortByDirection(Array.isArray(data) ? data : []);
        setPlaces(sorted);
        setFilteredPlaces(sorted);
      } catch (e) {
        console.error("Error loading places:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [typeId]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredPlaces(places);
      return;
    }
    const lower = text.toLowerCase();
    setFilteredPlaces(
      places.filter((p) =>
        getLocalizedField(p, "name", language).toLowerCase().includes(lower) ||
        getLocalizedField(p, "title", language).toLowerCase().includes(lower)
      )
    );
  };

  if (loading) return <Loader />;

  const renderItem = ({ item }) => {
    const dirKey   = (item.direction || "").toLowerCase().trim();
    const dirLabel = DIRECTION_LABELS[dirKey]?.[language];

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            width:        cardWidth,
            borderRadius: isTablet ? 12 : 10,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("TourismPage3", { id: item.id })}
      >
        <View style={[styles.imageWrap, { aspectRatio: 1.2 }]}>
          <Image
            source={{
              uri:
                item.bannerImage ||
                item.image ||
                "https://cdn-icons-png.flaticon.com/512/201/201623.png",
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          <View style={styles.pinWrap}>
            <Ionicons name="location" size={isTablet ? 16 : 13} color={C.gold} />
          </View>

          {dirLabel ? (
            <View style={styles.directionTag}>
              <Text style={styles.directionTagText}>{dirLabel}</Text>
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.cardFooter,
            { paddingHorizontal: isTablet ? 12 : 10 },
          ]}
        >
          <Text
            style={[
              styles.cardText,
              {
                fontSize:      footerFontSize,
                lineHeight:    footerFontSize + 6,
                paddingTop:    isTablet ? 12 : 10,
                paddingBottom: isTablet ? 12 : 10,
              },
            ]}
            numberOfLines={2}
          >
            {getLocalizedField(item, "name", language) || getLocalizedField(item, "title", language)}
          </Text>

          <TouchableOpacity
            style={[
              styles.infoDot,
              {
                width:        dotSize,
                height:       dotSize,
                borderRadius: dotSize / 2,
              },
            ]}
            onPress={(e) => {
              e.stopPropagation && e.stopPropagation();
              navigation.navigate("TourismPlaces", { id: item.id });
            }}
            activeOpacity={0.75}
          >
            <Ionicons
              name="information-circle"
              size={isTablet ? 24 : 20}
              color={C.dark}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backBtn, isTablet && styles.backBtnTablet]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="chevron-back"
            size={isTablet ? 30 : 26}
            color={C.white}
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
          numberOfLines={3}
        >
          {displayedTypeName}
        </Text>
        <View
          style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]}
        />
      </View>

      <View
        style={[
          styles.searchWrap,
          isTablet && styles.searchWrapTablet,
        ]}
      >
        <Ionicons
          name="search"
          size={isTablet ? 20 : 17}
          color={C.primary}
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder={t("searchPlaceholder", language)}
          value={searchText}
          onChangeText={handleSearch}
          style={[styles.searchInput, isTablet && styles.searchInputTablet]}
          placeholderTextColor="rgba(48,25,19,0.45)"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={isTablet ? 20 : 17} color={C.primary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredPlaces}
        key={`grid-${numColumns}`}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          filteredPlaces.length === 0 && { flexGrow: 1 },
          {
            paddingHorizontal: HORIZONTAL_PAD,
            paddingTop:        isTablet ? 20 : 14,
            paddingBottom:     isTablet ? 40 : 32,
          },
        ]}
        columnWrapperStyle={
          numColumns > 1
            ? {
                gap:            GAP,
                marginBottom:   GAP,
                justifyContent: "flex-start",
              }
            : undefined
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View
              style={[
                styles.emptyIconWrap,
                isTablet && styles.emptyIconWrapTablet,
              ]}
            >
              <Ionicons
                name="location-outline"
                size={isTablet ? 52 : 40}
                color={C.primary}
              />
            </View>
            <Text
              style={[styles.emptyTitle, isTablet && styles.emptyTitleTablet]}
            >
              {t("noPlaces", language)}
            </Text>
            <Text
              style={[styles.emptySub, isTablet && styles.emptySubTablet]}
            >
              {t("checkLater", language)}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection:           "row",
    alignItems:              "center",
    backgroundColor:         C.primary,
    paddingTop:              40,
    paddingBottom:           30,
    paddingHorizontal:       14,
    borderBottomLeftRadius:  20,
    borderBottomRightRadius: 20,
    elevation:               6,
    shadowColor:             C.dark,
    shadowOffset:            { width: 0, height: 3 },
    shadowOpacity:           0.3,
    shadowRadius:            6,
  },
  headerTablet: {
    paddingTop:              56,
    paddingBottom:           30,
    paddingHorizontal:       22,
    borderBottomLeftRadius:  28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  backBtnTablet:      { width: 50, height: 50, borderRadius: 25 },
  headerTitle: {
    flex:             1,
    textAlign:        "center",
    color:            C.white,
    fontSize:         15,
    fontWeight:       "800",
    letterSpacing:    0.3,
    marginHorizontal: 8,
  },
  headerTitleTablet:  { fontSize: 24 },
  headerSpacer:       { width: 40 },
  headerSpacerTablet: { width: 50 },
  searchWrap: {
    flexDirection:   "row",
    alignItems:      "center",
    backgroundColor: C.card,
    marginHorizontal: 16,
    marginTop:        14,
    marginBottom:     4,
    paddingHorizontal: 14,
    paddingVertical:   2,
    borderRadius:      12,
    borderWidth:       1.5,
    borderColor:       C.border,
    elevation:         2,
    shadowColor:       C.dark,
    shadowOffset:      { width: 0, height: 1 },
    shadowOpacity:     0.1,
    shadowRadius:      3,
  },
  searchWrapTablet: {
    marginHorizontal: 32,
    marginTop:        20,
    borderRadius:     14,
  },
  searchInput: {
    flex:          1,
    paddingVertical: 10,
    fontSize:      14,
    color:         C.text,
    fontWeight:    "600",
  },
  searchInputTablet: { paddingVertical: 13, fontSize: 16 },
  card: {
    backgroundColor: C.dark,
    overflow:        "hidden",
    elevation:       4,
    shadowColor:     C.dark,
    shadowOpacity:   0.12,
    shadowRadius:    6,
    shadowOffset:    { width: 0, height: 3 },
    borderWidth:     1,
    borderColor:     C.border,
  },
  imageWrap: {
    width:           "100%",
    backgroundColor: "#c8c2a0",
    position:        "relative",
    overflow:        "hidden",
  },
  image: { width: "100%", height: "100%" },
  imageOverlay: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    height:          "35%",
    backgroundColor: "rgba(48,25,19,0.18)",
  },
  pinWrap: {
    position:  "absolute",
    top:       8,
    right:     8,
  },
  directionTag: {
    position:          "absolute",
    top:               8,
    left:              8,
    backgroundColor:   "rgba(212,175,55,0.9)",
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      8,
  },
  directionTagText: {
    fontSize:   10,
    fontWeight: "800",
    color:      C.dark,
  },
  cardFooter: {
    backgroundColor: C.dark,
    flexDirection:   "row",
    alignItems:      "center",
    gap:             4,
  },
  cardText: {
    flex:       1,
    flexShrink: 1,
    fontWeight: "700",
    color:      C.white,
    textAlign:  "center",
  },
  infoDot: {
    backgroundColor: C.gold,
    alignItems:      "center",
    justifyContent:  "center",
    flexShrink:      0,
  },
  empty: {
    flex:          1,
    alignItems:    "center",
    justifyContent: "center",
    paddingTop:    80,
    gap:           12,
  },
  emptyIconWrap: {
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: "rgba(147,33,10,0.1)",
    borderWidth:     1.5,
    borderColor:     "rgba(147,33,10,0.2)",
    alignItems:      "center",
    justifyContent:  "center",
  },
  emptyIconWrapTablet: { width: 100, height: 100, borderRadius: 50 },
  emptyTitle: {
    fontSize:   16,
    fontWeight: "800",
    color:      C.dark,
  },
  emptyTitleTablet: { fontSize: 20 },
  emptySub: {
    fontSize:   13,
    color:      "#7a6a5a",
    fontWeight: "500",
  },
  emptySubTablet: { fontSize: 15 },
});