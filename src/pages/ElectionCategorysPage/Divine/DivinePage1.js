import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchHistoryTypes } from "../../../Controller/HistoryController/HistoryController";
import Loader from "../../../components/Alert/Loader";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ALL = "அனைத்தும்";

export default function DivinePage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const route = useRoute();
  const { name } = route.params || {};

  const isTablet = width >= 600;
  const numColumns = isTablet ? 4 : 3;

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHistoryTypes();
        const sloganData = Array.isArray(data)
          ? data.filter((item) => item.category === "divine")
          : [];
        setTypes(sloganData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filterOptions = [ALL, ...new Set(types.map((c) => c.name).filter(Boolean))];
  const modalOptions = filterOptions.filter((opt) =>
    opt.toLowerCase().includes(modalSearch.toLowerCase())
  );
  const filteredTypes =
    activeFilter === ALL ? types : types.filter((item) => item.name === activeFilter);

  const handleSelect = (option) => {
    setActiveFilter(option);
    setModalVisible(false);
    setModalSearch("");
  };

  if (loading) return <Loader />;

  const HORIZONTAL_PADDING = 12;
  const GAP = 8;
  const cardWidth =
    (width - HORIZONTAL_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.82}
      style={[styles.card, { width: cardWidth }]}
      onPress={() =>
        navigation.navigate("DivinePage2", {
          id: item.id,
          name: item.name,
          category: item.category,
        })
      }
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>

      {/* Full-width dark title bar */}
      <View style={styles.cardFooter}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.arrowDot}>
          <Ionicons name="chevron-forward" size={10} color="#87584d" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      {/* ── HEADER ── */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          {name || "Divine"}
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
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>வகையைத் தேர்ந்தெடுக்கவும்</Text>
              <Text style={styles.modalSubtitle}>Filter by category</Text>
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
            numColumns={2}
            key="modal-grid"
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

      {/* ── GRID ── */}
      <FlatList
        data={filteredTypes}
        key={`grid-${numColumns}`}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
        contentContainerStyle={[
          styles.listContainer,
          filteredTypes.length === 0 && styles.emptyContent,
        ]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* safe bg → #d4cea6 */
  safe: { flex: 1, backgroundColor: "#d4cea6" },

  /* ── HEADER ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 18 },
  headerSide: { width: 44, justifyContent: "center", alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: { fontSize: 22 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25 },

  /* ── FILTER BAR bg → rgba(255,255,255,0.5) */
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
    height: SCREEN_HEIGHT * 0.68,
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

  /* ── GRID ── */
  listContainer: { padding: 12, paddingBottom: 32 },
  emptyContent: { flexGrow: 1 },
  row: { gap: 8, marginBottom: 8 },

  /* ── CARD ── */
  card: {
    backgroundColor: "#FFFDF8",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    flexDirection: "column",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 0.85,
    backgroundColor: "#1a0a00",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  cardFooter: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#301913",
    paddingHorizontal: 8,
    paddingVertical: 7,
    gap: 4,
    minHeight: 32,
    flexGrow: 1,
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

  /* ── EMPTY STATE ── */
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
  },
  emptyTitle: { fontSize: 16, color: "#555", fontWeight: "800" },
  emptySubtitle: { fontSize: 12, color: "#aaa", fontWeight: "500" },
});