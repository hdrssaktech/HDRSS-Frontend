import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  Easing,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Line, Path } from "react-native-svg";
import Loader from "../../../components/Alert/Loader";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/* ── Faint rotating Vaasthu yantra watermark ── */
const YantraWatermark = ({ size }) => {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 90000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const r = size / 2;
  const spokes = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.watermarkWrap,
        { width: size, height: size, transform: [{ rotate }] },
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={r} cy={r} r={r - 1} stroke="#301913" strokeWidth={1} fill="none" opacity={0.3} />
        <Circle cx={r} cy={r} r={r * 0.62} stroke="#93210A" strokeWidth={1} fill="none" opacity={0.22} />
        <Circle cx={r} cy={r} r={r * 0.18} stroke="#93210A" strokeWidth={1.2} fill="none" opacity={0.35} />
        {spokes.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = r + (r - 4) * Math.cos(rad);
          const y2 = r + (r - 4) * Math.sin(rad);
          return (
            <Line
              key={deg}
              x1={r}
              y1={r}
              x2={x2}
              y2={y2}
              stroke="#93210A"
              strokeWidth={1}
              opacity={0.16}
            />
          );
        })}
        <Path
          d={`M ${r} ${r - 10} L ${r + 10} ${r} L ${r} ${r + 10} L ${r - 10} ${r} Z`}
          stroke="#93210A"
          strokeWidth={1.2}
          fill="none"
          opacity={0.32}
        />
      </Svg>
    </Animated.View>
  );
};

const VaasthuPage2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, categoryTitle } = route.params || {};

  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  
  // 3 columns on mobile, 4 columns on tablet
  const numColumns = isTablet ? 4 : 3;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("அனைத்தும்");

  const ALL = "அனைத்தும்";

  const fetchData = () => {
    if (!categoryId) {
      setError("Invalid category ID");
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    axios
      .get(`https://hdrss-backend.onrender.com/api/vastu/details/category/${categoryId}`)
      .then((res) => {
        setItems(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load items. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  if (loading) {
    return <Loader />;
  }

  const HORIZONTAL_PADDING = 12;
  const GAP = 10;
  const cardWidth = (width - HORIZONTAL_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;
  const watermarkSize = Math.max(width, height) * 0.95;

  // Filter options
  const filterOptions = [ALL, ...new Set(items.map((c) => c.title).filter(Boolean))];
  const modalOptions = filterOptions.filter((opt) =>
    opt.toLowerCase().includes(modalSearch.toLowerCase())
  );
  const filteredItems =
    activeFilter === ALL ? items : items.filter((item) => item.title === activeFilter);

  const handleSelect = (option) => {
    setActiveFilter(option);
    setModalVisible(false);
    setModalSearch("");
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.82}
      style={[styles.card, { width: cardWidth }]}
      onPress={() =>
        navigation.navigate("VaasthuPage3", { item })
      }
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.directionBadge}>
          <Text style={styles.directionText}>{index + 1}</Text>
        </View>
        <View style={styles.imageOverlay} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.arrowDot}>
          <Ionicons name="chevron-forward" size={10} color="#301913" />
        </View>
      </View>

      <View style={styles.cardAccentLine} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.center}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="images-outline" size={40} color="#93210A" />
      </View>
      <Text style={styles.emptyTitle}>No items available</Text>
      <Text style={styles.emptySubtitle}>Check back later</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={fetchData} activeOpacity={0.8}>
        <Ionicons name="refresh" size={16} color="#fff" />
        <Text style={styles.retryBtnText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.center}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="alert-circle-outline" size={40} color="#93210A" />
      </View>
      <Text style={styles.emptyTitle}>Something went wrong</Text>
      <Text style={styles.emptySubtitle}>{error}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={fetchData} activeOpacity={0.8}>
        <Ionicons name="refresh" size={16} color="#fff" />
        <Text style={styles.retryBtnText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* Ambient rotating yantra */}
      <View style={styles.watermarkLayer}>
        <YantraWatermark size={watermarkSize} />
      </View>

      {/* HEADER — with back button */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          {categoryTitle || "வாஸ்து பொருட்கள்"}
        </Text>

        <View style={styles.headerSide} />
      </View>

      {/* ── FILTER BAR ── */}
      {filterOptions.length > 1 && (
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              activeFilter !== ALL && styles.filterPillActive,
            ]}
            onPress={() => {
              setModalSearch("");
              setModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="funnel"
              size={13}
              color={activeFilter !== ALL ? "#fff" : "#93210A"}
            />
            <Text
              style={[
                styles.filterPillText,
                activeFilter !== ALL && styles.filterPillTextActive,
              ]}
              numberOfLines={1}
            >
              {activeFilter}
            </Text>
            <Ionicons
              name="chevron-down"
              size={13}
              color={activeFilter !== ALL ? "#fff" : "#93210A"}
            />
          </TouchableOpacity>

          {activeFilter !== ALL && (
            <TouchableOpacity
              style={styles.clearPill}
              onPress={() => setActiveFilter(ALL)}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={13} color="#93210A" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* ── FILTER MODAL ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />
        <View style={[styles.modalSheet, { height: SCREEN_HEIGHT * 0.68 }]}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>பொருளைத் தேர்ந்தெடுக்கவும்</Text>
              <Text style={styles.modalSubtitle}>Filter by item</Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color="#93210A" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalSearchBar}>
            <Ionicons name="search-outline" size={16} color="#93210A" />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="தேடுக..."
              placeholderTextColor="#bbb"
              value={modalSearch}
              onChangeText={setModalSearch}
              autoCorrect={false}
            />
            {modalSearch.length > 0 && (
              <TouchableOpacity onPress={() => setModalSearch("")}>
                <Ionicons name="close-circle" size={16} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={modalOptions}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.modalList}
            numColumns={isTablet ? 4 : 2}
            key={isTablet ? "tablet-modal-grid" : "phone-modal-grid"}
            columnWrapperStyle={styles.modalRow}
            renderItem={({ item }) => {
              const selected = activeFilter === item;
              return (
                <TouchableOpacity
                  style={[styles.modalChip, selected && styles.modalChipActive]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.75}
                >
                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#93210A"
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.modalChipText,
                      selected && styles.modalChipTextActive,
                    ]}
                    numberOfLines={2}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.modalEmpty}>
                <Ionicons name="search-outline" size={36} color="#eee" />
                <Text style={styles.modalEmptyText}>எதுவும் கிடைக்கவில்லை</Text>
              </View>
            }
          />
        </View>
      </Modal>

      {/* COMPASS STRIP - SMALL & LIGHT */}
      <View style={styles.compassStrip}>
        {["N", "NE", "E", "SE", "S", "SW", "W", "NW"].map((dir, i) => (
          <View key={i} style={styles.compassItem}>
            <Text style={styles.compassLabel}>{dir}</Text>
          </View>
        ))}
      </View>

      {/* CONTENT */}
      {error ? (
        renderErrorState()
      ) : items.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredItems}
          key={`grid-${numColumns}`}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContainer,
            filteredItems.length === 0 && styles.emptyContent,
          ]}
          columnWrapperStyle={styles.row}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={styles.center}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="sparkles-outline" size={40} color="#93210A" />
              </View>
              <Text style={styles.emptyTitle}>எதுவும் கிடைக்கவில்லை</Text>
              <Text style={styles.emptySubtitle}>No items found for this filter</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default VaasthuPage2;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#d4cea6" },

  /* Watermark layer */
  watermarkLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  watermarkWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#93210A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  headerTablet: {
    paddingTop: 56,
    paddingBottom: 22,
    paddingHorizontal: 18,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  headerTitleTablet: { fontSize: 22 },
  headerSide: { width: 55 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  /* ── FILTER BAR ── */
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(147,33,10,0.08)",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderRadius: 20,
    maxWidth: "55%",
    backgroundColor: "#FFF0EE",
    borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.2)",
  },
  filterPillActive: {
    backgroundColor: "#93210A",
    borderColor: "#93210A",
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#93210A",
    flex: 1,
  },
  filterPillTextActive: { color: "#fff" },
  clearPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF0EE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.2)",
  },

  /* ── MODAL ── */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  modalSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0D8D7",
    alignSelf: "center",
    marginTop: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5EFEE",
  },
  modalTitle: { fontSize: 15, fontWeight: "800", color: "#1A1A1A" },
  modalSubtitle: { fontSize: 11, color: "#999", fontWeight: "500", marginTop: 2 },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF0EE",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4F3",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.12)",
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13,
    color: "#1A1A1A",
    padding: 0,
    fontWeight: "500",
  },
  modalList: { paddingHorizontal: 12, paddingBottom: 36, paddingTop: 4 },
  modalRow: { gap: 8, marginBottom: 8 },
  modalChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4F3",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    minHeight: 48,
  },
  modalChipActive: {
    backgroundColor: "#FFF0EE",
    borderColor: "#93210A",
  },
  modalChipText: { flex: 1, fontSize: 13, color: "#444", fontWeight: "500" },
  modalChipTextActive: { color: "#93210A", fontWeight: "800" },
  modalEmpty: { alignItems: "center", paddingTop: 50, gap: 10 },
  modalEmptyText: { fontSize: 14, color: "#bbb", fontWeight: "600" },

  /* COMPASS STRIP */
  compassStrip: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.4)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(147,33,10,0.06)",
    shadowColor: "#93210A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  compassItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 2,
  },
  compassLabel: {
    fontSize: 8,
    fontWeight: "600",
    color: "#93210A",
    letterSpacing: 0.3,
    opacity: 0.5,
  },

  /* Grid */
  listContainer: { padding: 12, paddingBottom: 36 },
  emptyContent: { flexGrow: 1 },
  row: { gap: 10, marginBottom: 10 },

  /* Card */
  card: {
    backgroundColor: "#FFFDF8",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 0.85,
    backgroundColor: "#1a0a00",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: "rgba(48,25,19,0.18)",
  },
  directionBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(48,25,19,0.88)",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  directionText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#FFD700",
    letterSpacing: 0.5,
  },

  /* ── FOOTER ── */
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#301913",
    paddingHorizontal: 8,
    paddingVertical: 7,
    gap: 4,
    width: "100%",
    height: 46,
  },
  cardTitle: {
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 15,
  },
  arrowDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardAccentLine: {
    height: 2,
    backgroundColor: "#301913",
    opacity: 0.18,
  },

  /* Empty / Error */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF0EE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.15)",
  },
  emptyTitle: {
    fontSize: 16,
    color: "#555",
    fontWeight: "800",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  retryBtn: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#93210A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});