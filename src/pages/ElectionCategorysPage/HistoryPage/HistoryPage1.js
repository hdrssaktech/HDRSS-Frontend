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
import { useNavigation } from "@react-navigation/native";
import { fetchHistoryTypes } from "../../../Controller/HistoryController/HistoryController";
import Loader from "../../../components/Alert/Loader";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ALL = "அனைத்தும்";

export default function HistoryPage1() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const numColumns = isTablet ? 4 : 3;

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  const GAP = isTablet ? 10 : 8;
  const HORIZONTAL_PADDING = isTablet ? 20 : 12;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHistoryTypes();
        setTypes(
          Array.isArray(data)
            ? data.filter((item) => item.category === "history")
            : []
        );
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
    activeFilter === ALL
      ? types
      : types.filter((item) => item.name === activeFilter);

  const handleSelect = (option) => {
    setActiveFilter(option);
    setModalVisible(false);
    setModalSearch("");
  };

  if (loading) return <Loader />;

  const cardWidth = Math.floor(
    (width - HORIZONTAL_PADDING * 2 - GAP * (numColumns - 1)) / numColumns
  );

  const footerFontSize = isTablet ? 11 : 10;
  const arrowSize = isTablet ? 18 : 16;
  const footerHeight = isTablet ? 44 : 38; // fixed height so it never shifts

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.82}
      style={[
        styles.card,
        {
          width: cardWidth,
          borderRadius: isTablet ? 12 : 10,
          backgroundColor: "#FFFDF8",
        },
      ]}
      onPress={() =>
        navigation.navigate("HistoryPage2", {
          id: item.id,
          name: item.name,
        })
      }
    >
      {/* Square image (1:1 aspect ratio) */}
      <View style={[styles.imageContainer, { aspectRatio: 1 }]}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons
              name="image-outline"
              size={isTablet ? 32 : 26}
              color="#ddd"
            />
          </View>
        )}
      </View>

      {/* Footer — fixed height, always centered, no white peeking on single-line names */}
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
            { fontSize: footerFontSize, lineHeight: footerFontSize + 4 },
          ]}
          numberOfLines={2}
          includeFontPadding={false}
          textAlignVertical="center"
        >
          {item.name}
        </Text>
        <View
          style={[
            styles.arrowDot,
            { width: arrowSize, height: arrowSize, borderRadius: arrowSize / 2 },
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
          வரலாறு
        </Text>
        <View style={styles.headerSide} />
      </View>

      {/* FILTER BAR */}
      {types.length > 0 && (
        <View
          style={[
            styles.filterBar,
            {
              paddingHorizontal: isTablet ? 20 : 12,
              paddingVertical: isTablet ? 12 : 10,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.filterPill,
              activeFilter !== ALL && styles.filterPillActive,
              {
                paddingHorizontal: isTablet ? 16 : 14,
                paddingVertical: isTablet ? 10 : 9,
                borderRadius: isTablet ? 26 : 22,
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
                  width: isTablet ? 34 : 30,
                  height: isTablet ? 34 : 30,
                  borderRadius: isTablet ? 17 : 15,
                  marginLeft: isTablet ? 10 : 8,
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
                ராசியைத் தேர்ந்தெடுக்கவும்
              </Text>
              <Text style={[styles.modalSubtitle, { fontSize: isTablet ? 13 : 11 }]}>
                Select Zodiac Sign
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
              autoCapitalize="none"
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
              { gap: isTablet ? 10 : 8, marginBottom: isTablet ? 10 : 8 },
            ]}
            renderItem={({ item }) => {
              const selected = activeFilter === item;
              return (
                <TouchableOpacity
                  style={[
                    styles.modalChip,
                    selected && styles.modalChipActive,
                    {
                      paddingVertical: 12,
                      paddingHorizontal: isTablet ? 10 : 12,
                      borderRadius: 12,
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
                      { fontSize: 13 },
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

      {/* GRID */}
      <FlatList
        data={filteredTypes}
        key={`grid-${numColumns}`}
        numColumns={numColumns}
        renderItem={renderItem}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
        contentContainerStyle={[
          styles.listContainer,
          filteredTypes.length === 0 && styles.emptyContent,
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
                name="time-outline"
                size={isTablet ? 50 : 40}
                color="#93210A"
              />
            </View>
            <Text style={[styles.emptyTitle, { fontSize: isTablet ? 20 : 16 }]}>
              எதுவும் கிடைக்கவில்லை
            </Text>
            <Text style={[styles.emptySubtitle, { fontSize: isTablet ? 14 : 12 }]}>
              No zodiac signs found for this filter
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
  headerSide: { width: 44 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 19,
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
    maxWidth: 160,
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
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    backgroundColor: "#FFFDF8",
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "#F3EFE6",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3EFE6",
  },
  cardFooter: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#301913",
    gap: 4,
  },
  cardTitle: {
    flex: 1,
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