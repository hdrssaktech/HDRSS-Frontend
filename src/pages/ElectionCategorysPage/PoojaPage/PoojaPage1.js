import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Modal,
  TextInput,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllPoojas } from "../../../Controller/PoojaController/PoojaController";
import Loader from "../../../components/Alert/Loader";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ALL = "அனைத்தும்";

export default function PoojaPage1({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  
  // 3 columns on mobile, 4 columns on tablet
  const numColumns = isTablet ? 4 : 3;
  const GAP = isTablet ? 10 : 8;
  const HORIZONTAL_PADDING = isTablet ? 20 : 12;

  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  useEffect(() => {
    const loadPoojas = async () => {
      try {
        const data = await fetchAllPoojas();
        setPoojas(data);
      } catch (error) {
        console.error("Error loading poojas:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPoojas();
  }, []);

  // Unique titles for modal list
  const filterOptions = [ALL, ...new Set(poojas.map((p) => p.title).filter(Boolean))];

  // Modal list filtered by search
  const modalOptions = filterOptions.filter((opt) =>
    opt.toLowerCase().includes(modalSearch.toLowerCase())
  );

  // Main grid filtered by selected title
  const filteredPoojas =
    activeFilter === ALL
      ? poojas
      : poojas.filter((item) => item.title === activeFilter);

  const handleSelect = (option) => {
    setActiveFilter(option);
    setModalVisible(false);
    setModalSearch("");
  };

  if (loading) return <Loader />;

  // Precise card width calculation
  const cardWidth = Math.floor(
    (width - HORIZONTAL_PADDING * 2 - GAP * (numColumns - 1)) / numColumns
  );

  // Footer height is now FIXED so it never shrinks/shifts for single-line text
  const footerHeight = isTablet ? 40 : 34;
  const footerFontSize = isTablet ? 11 : 10;
  const arrowSize = isTablet ? 18 : 16;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.82}
      style={[
        styles.card,
        {
          width: cardWidth,
          borderRadius: isTablet ? 12 : 10,
        },
      ]}
      onPress={() => {
        if (item && item.id) {
          navigation.navigate("Poojacategory", { id: item.id });
        } else {
          console.warn("Item id is missing", item);
        }
      }}
    >
      {/* Image fills a fixed aspect ratio box */}
      <View style={[styles.imageContainer, { aspectRatio: 0.85 }]}>
        <Image
          source={{ uri: item.bannerimg }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Footer — fixed height, no white peeking on single-line titles */}
      <View
        style={[
          styles.cardFooter,
          {
            paddingHorizontal: isTablet ? 8 : 6,
            height: footerHeight,
            borderBottomLeftRadius: isTablet ? 12 : 10,
            borderBottomRightRadius: isTablet ? 12 : 10,
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            {
              fontSize: footerFontSize,
              lineHeight: footerFontSize + 4,
            },
          ]}
          numberOfLines={2}
          includeFontPadding={false}
          textAlignVertical="center"
        >
          {item.title || "Untitled"}
        </Text>
        <View
          style={[
            styles.arrowDot,
            {
              width: arrowSize,
              height: arrowSize,
              borderRadius: arrowSize / 2,
            },
          ]}
        >
          <Ionicons
            name="chevron-forward"
            size={isTablet ? 11 : 10}
            color="#87584d"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      {/* HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          பூஜை
        </Text>
        <View style={styles.headerSide} />
      </View>

      {/* FILTER BAR */}
      {poojas.length > 5 && (
        <View
          style={[
            styles.filterBar,
            {
              paddingHorizontal: isTablet ? 20 : 12,
              paddingVertical: isTablet ? 12 : 10,
              gap: isTablet ? 12 : 8,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.filterPill,
              activeFilter !== ALL && styles.filterPillActive,
              {
                paddingHorizontal: isTablet ? 14 : 12,
                paddingVertical: isTablet ? 9 : 8,
                maxWidth: isTablet ? "40%" : "55%",
                borderRadius: isTablet ? 24 : 20,
              },
            ]}
            onPress={() => {
              setModalSearch("");
              setModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="funnel"
              size={isTablet ? 15 : 13}
              color={activeFilter !== ALL ? "#fff" : "#93210A"}
            />
            <Text
              style={[
                styles.filterPillText,
                activeFilter !== ALL && styles.filterPillTextActive,
                { fontSize: isTablet ? 13 : 12 },
              ]}
              numberOfLines={1}
            >
              {activeFilter}
            </Text>
            <Ionicons
              name="chevron-down"
              size={isTablet ? 15 : 13}
              color={activeFilter !== ALL ? "#fff" : "#93210A"}
            />
          </TouchableOpacity>

          {activeFilter !== ALL && (
            <TouchableOpacity
              style={[
                styles.clearPill,
                {
                  width: isTablet ? 34 : 28,
                  height: isTablet ? 34 : 28,
                  borderRadius: isTablet ? 17 : 14,
                },
              ]}
              onPress={() => setActiveFilter(ALL)}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={isTablet ? 15 : 13} color="#93210A" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* FILTER MODAL */}
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
        <View
          style={[
            styles.modalSheet,
            {
              height: isTablet ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.68,
              borderTopLeftRadius: isTablet ? 36 : 28,
              borderTopRightRadius: isTablet ? 36 : 28,
            },
          ]}
        >
          <View
            style={[
              styles.modalHandle,
              {
                width: isTablet ? 50 : 40,
                height: isTablet ? 5 : 4,
                marginTop: isTablet ? 16 : 12,
              },
            ]}
          />

          <View
            style={[
              styles.modalHeader,
              {
                paddingHorizontal: isTablet ? 28 : 20,
                paddingTop: isTablet ? 20 : 14,
                paddingBottom: isTablet ? 16 : 12,
              },
            ]}
          >
            <View>
              <Text style={[styles.modalTitle, { fontSize: isTablet ? 18 : 15 }]}>
                வகையைத் தேர்ந்தெடுக்கவும்
              </Text>
              <Text style={[styles.modalSubtitle, { fontSize: isTablet ? 13 : 11 }]}>
                Filter by category
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[
                styles.modalCloseBtn,
                {
                  width: isTablet ? 40 : 32,
                  height: isTablet ? 40 : 32,
                  borderRadius: isTablet ? 20 : 16,
                },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={isTablet ? 22 : 18} color="#93210A" />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.modalSearchBar,
              {
                marginHorizontal: isTablet ? 24 : 16,
                marginVertical: isTablet ? 14 : 10,
                paddingHorizontal: isTablet ? 16 : 12,
                paddingVertical: isTablet ? 12 : 10,
                borderRadius: isTablet ? 18 : 14,
              },
            ]}
          >
            <Ionicons name="search-outline" size={isTablet ? 20 : 16} color="#93210A" />
            <TextInput
              style={[styles.modalSearchInput, { fontSize: isTablet ? 15 : 13 }]}
              placeholder="தேடுக..."
              placeholderTextColor="#bbb"
              value={modalSearch}
              onChangeText={setModalSearch}
              autoCorrect={false}
            />
            {modalSearch.length > 0 && (
              <TouchableOpacity onPress={() => setModalSearch("")}>
                <Ionicons name="close-circle" size={isTablet ? 20 : 16} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={modalOptions}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.modalList,
              {
                paddingHorizontal: isTablet ? 20 : 12,
                paddingBottom: isTablet ? 48 : 36,
                paddingTop: isTablet ? 8 : 4,
              },
            ]}
            numColumns={isTablet ? 4 : 2}
            key={isTablet ? "tablet-modal-grid" : "phone-modal-grid"}
            columnWrapperStyle={[
              styles.modalRow,
              {
                gap: isTablet ? 10 : 8,
                marginBottom: isTablet ? 10 : 8,
              },
            ]}
            renderItem={({ item }) => {
              const selected = activeFilter === item;
              return (
                <TouchableOpacity
                  style={[
                    styles.modalChip,
                    selected && styles.modalChipActive,
                    {
                      paddingVertical: isTablet ? 12 : 12,
                      paddingHorizontal: isTablet ? 10 : 12,
                      borderRadius: isTablet ? 12 : 12,
                      minHeight: isTablet ? 50 : 48,
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.75}
                >
                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={isTablet ? 16 : 14}
                      color="#93210A"
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.modalChipText,
                      selected && styles.modalChipTextActive,
                      { fontSize: isTablet ? 13 : 13 },
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
                <Ionicons name="search-outline" size={isTablet ? 44 : 36} color="#eee" />
                <Text style={[styles.modalEmptyText, { fontSize: isTablet ? 16 : 14 }]}>
                  எதுவும் கிடைக்கவில்லை
                </Text>
              </View>
            }
          />
        </View>
      </Modal>

      {/* POOJA GRID */}
      <FlatList
        data={filteredPoojas}
        key={`grid-${numColumns}`}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
        contentContainerStyle={[
          styles.listContainer,
          filteredPoojas.length === 0 && styles.emptyContent,
          {
            paddingHorizontal: HORIZONTAL_PADDING,
            paddingTop: isTablet ? 16 : 12,
            paddingBottom: isTablet ? 40 : 32,
          },
        ]}
        columnWrapperStyle={{
          gap: GAP,
          marginBottom: GAP,
          justifyContent: "flex-start",
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.center}>
            <View
              style={[
                styles.emptyIconWrap,
                {
                  width: isTablet ? 100 : 80,
                  height: isTablet ? 100 : 80,
                  borderRadius: isTablet ? 50 : 40,
                },
              ]}
            >
              <Ionicons
                name="folder-open-outline"
                size={isTablet ? 50 : 40}
                color="#93210A"
              />
            </View>
            <Text style={[styles.emptyTitle, { fontSize: isTablet ? 20 : 16 }]}>
              எதுவும் கிடைக்கவில்லை
            </Text>
            <Text style={[styles.emptySubtitle, { fontSize: isTablet ? 14 : 12 }]}>
              No poojas found for this filter
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#d4cea6" },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerSide: { width: 44, justifyContent: "center", alignItems: "flex-start" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: { fontSize: 24 },
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

  /* FILTER BAR */
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(147,33,10,0.08)",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF0EE",
    borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.2)",
  },
  filterPillActive: {
    backgroundColor: "#93210A",
    borderColor: "#93210A",
  },
  filterPillText: {
    fontWeight: "700",
    color: "#93210A",
    flex: 1,
  },
  filterPillTextActive: { color: "#fff" },
  clearPill: {
    backgroundColor: "#FFF0EE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.2)",
  },

  /* MODAL */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  modalSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  modalHandle: {
    borderRadius: 2,
    backgroundColor: "#E0D8D7",
    alignSelf: "center",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F5EFEE",
  },
  modalTitle: { fontWeight: "800", color: "#1A1A1A" },
  modalSubtitle: { color: "#999", fontWeight: "500", marginTop: 2 },
  modalCloseBtn: {
    backgroundColor: "#FFF0EE",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4F3",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.12)",
  },
  modalSearchInput: {
    flex: 1,
    color: "#1A1A1A",
    padding: 0,
    fontWeight: "500",
  },
  modalList: { paddingBottom: 36 },
  modalRow: { gap: 8, marginBottom: 8 },
  modalChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4F3",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  modalChipActive: {
    backgroundColor: "#FFF0EE",
    borderColor: "#93210A",
  },
  modalChipText: { flex: 1, color: "#444", fontWeight: "500" },
  modalChipTextActive: { color: "#93210A", fontWeight: "800" },
  modalEmpty: { alignItems: "center", paddingTop: 50, gap: 10 },
  modalEmptyText: { color: "#bbb", fontWeight: "600" },

  /* GRID */
  listContainer: { paddingBottom: 32 },
  emptyContent: { flexGrow: 1 },

  /* CARD */
  card: {
    backgroundColor: "#FFFDF8",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "#1a0a00",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#301913",
    gap: 4,
  },
  cardTitle: {
    flex: 1,
    flexShrink: 1,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  arrowDot: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  /* EMPTY STATE */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyIconWrap: {
    backgroundColor: "#FFF0EE",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { color: "#555", fontWeight: "800" },
  emptySubtitle: { color: "#aaa", fontWeight: "500" },
});