import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchTourismTypes } from "../../../Controller/TourismController/TourismController";
import Loader from "../../../components/Alert/Loader";

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

export default function TourismPage1() {
  const navigation = useNavigation();
  const { width }  = useWindowDimensions();
  const isTablet   = width >= 600;

  const [types,   setTypes]   = useState([]);
  const [loading, setLoading] = useState(true);

  const numColumns     = 2;
  const HORIZONTAL_PAD = isTablet ? 32 : 16;
  const GAP            = isTablet ? 16 : 10;
  const cardWidth      = Math.floor(
    (width - HORIZONTAL_PAD * 2 - GAP * (numColumns - 1)) / numColumns
  );

  const footerFontSize = isTablet ? 12 : 11;
  const arrowSize      = isTablet ? 20 : 16;

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchTourismTypes();
        setTypes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading types:", e);
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  if (loading) return <Loader />;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          width:        cardWidth,
          borderRadius: isTablet ? 12 : 10,
        },
      ]}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("TourismPage2", {
          typeId:   item.id,
          typeName: item.name,
        })
      }
    >
      {/* Image */}
      <View style={[styles.imageWrap, { aspectRatio: 1.2 }]}>
        <Image
          source={{
            uri: item.image ||
              "https://cdn-icons-png.flaticon.com/512/201/201623.png",
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
      </View>

      {/* Footer — NO paddingVertical on wrapper, padding moved to Text and arrowDot */}
      <View
        style={[
          styles.cardFooter,
          { paddingHorizontal: isTablet ? 10 : 8 },
        ]}
      >
        <Text
          style={[
            styles.cardText,
            {
              fontSize:      footerFontSize,
              lineHeight:    footerFontSize + 4,
              // vertical padding ON the text so it expands the dark bg exactly
              paddingTop:    isTablet ? 8 : 6,
              paddingBottom: isTablet ? 8 : 6,
            },
          ]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        <View
          style={[
            styles.arrowDot,
            {
              width:        arrowSize,
              height:       arrowSize,
              borderRadius: arrowSize / 2,
            },
          ]}
        >
          <Ionicons
            name="chevron-forward"
            size={isTablet ? 12 : 10}
            color={C.dark}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      {/* ── HEADER ── */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backBtn, isTablet && styles.backBtnTablet]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color={C.white} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
          numberOfLines={1}
        >
          சுற்றுலா இடங்கள்
        </Text>
        <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
      </View>

      {/* ── GRID ── */}
      <FlatList
        data={types}
        key="grid-2"
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          types.length === 0 && { flexGrow: 1 },
          {
            paddingHorizontal: HORIZONTAL_PAD,
            paddingTop:        isTablet ? 20 : 14,
            paddingBottom:     isTablet ? 40 : 32,
          },
        ]}
        columnWrapperStyle={{
          gap:            GAP,
          marginBottom:   GAP,
          justifyContent: "flex-start",
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIconWrap, isTablet && styles.emptyIconWrapTablet]}>
              <Ionicons
                name="map-outline"
                size={isTablet ? 52 : 40}
                color={C.primary}
              />
            </View>
            <Text style={[styles.emptyTitle, isTablet && styles.emptyTitleTablet]}>
              இடங்கள் எதுவும் இல்லை
            </Text>
            <Text style={[styles.emptySub, isTablet && styles.emptySubTablet]}>
              பின்னர் மீண்டும் பார்க்கவும்
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  /* ── HEADER ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerTablet: {
    paddingTop: 56,
    paddingBottom: 30,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnTablet:      { width: 50, height: 50, borderRadius: 25 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: C.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginHorizontal: 8,
  },
  headerTitleTablet:  { fontSize: 24 },
  headerSpacer:       { width: 40 },
  headerSpacerTablet: { width: 50 },

  /* ── CARD ── */
  card: {
    backgroundColor: C.dark, // KEY: card bg = dark so no color leak ever
    overflow: "hidden",
    elevation: 4,
    shadowColor: C.dark,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: C.border,
  },
  imageWrap: {
    width: "100%",
    backgroundColor: "#c8c2a0",
    position: "relative",
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "35%",
    backgroundColor: "rgba(48,25,19,0.18)",
  },

  /* ── CARD FOOTER ──
     No paddingVertical here at all.
     Padding is on the Text itself so the dark bg fills exactly the text height.
     Card bg is also C.dark so even if there is any sub-pixel gap it stays dark. */
  cardFooter: {
    backgroundColor: C.dark,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardText: {
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

  /* ── EMPTY STATE ── */
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(147,33,10,0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconWrapTablet: { width: 100, height: 100, borderRadius: 50 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.dark,
  },
  emptyTitleTablet:  { fontSize: 20 },
  emptySub: {
    fontSize: 13,
    color: "#7a6a5a",
    fontWeight: "500",
  },
  emptySubTablet: { fontSize: 15 },
});