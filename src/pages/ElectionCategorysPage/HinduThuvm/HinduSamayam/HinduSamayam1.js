import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  FlatList,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../../components/Alert/Loader";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isTablet = SCREEN_WIDTH >= 600;
const numColumns = isTablet ? 3 : 2;
const H_PADDING = isTablet ? 20 : 12;
const GAP = isTablet ? 14 : 10;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

const ALL = "அனைத்தும்";

const HinduSamayam1 = () => {
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        "https://hdrss-backend.onrender.com/api/hindu-samayam/category"
      );
      const sorted = [...(res.data || [])].sort(
        (a, b) => (a.orderNo ?? Infinity) - (b.orderNo ?? Infinity)
      );
      setCategories(sorted);
    } catch (e) {
      console.error("API Error:", e);
      setError("பகுப்புகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  };

  // Unique names for modal list
  const filterOptions = [ALL, ...new Set(categories.map((c) => c.name).filter(Boolean))];

  // Modal list filtered by search
  const modalOptions = filterOptions.filter((opt) =>
    opt.toLowerCase().includes(modalSearch.toLowerCase())
  );

  // Main grid filtered by selected name
  const filteredCategories =
    activeFilter === ALL
      ? categories
      : categories.filter((item) => item.name === activeFilter);

  const handleSelect = (option) => {
    setActiveFilter(option);
    setModalVisible(false);
    setModalSearch("");
  };

  const openModal = () => {
    setModalSearch("");
    setModalVisible(true);
  };

  /* ── Header ── */
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>இந்து அமைப்புகள்</Text>
      <View style={{ width: isTablet ? 50 : 42 }} />
    </View>
  );

  /* ── Filter Trigger Bar ── */
  const renderFilterTrigger = () => (
    <View style={styles.filterTriggerWrapper}>
      <TouchableOpacity
        style={styles.filterTrigger}
        onPress={openModal}
        activeOpacity={0.8}
      >
        <Ionicons name="funnel-outline" size={16} color="#8B0000" />
        <Text style={styles.filterTriggerText} numberOfLines={1}>
          {activeFilter}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#8B0000" />
      </TouchableOpacity>

      {/* Show clear button when a filter is active */}
      {activeFilter !== ALL && (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => setActiveFilter(ALL)}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle" size={18} color="#8B0000" />
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  /* ── Filter Modal ── */
  const renderModal = () => (
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
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>பகுப்பு தேர்ந்தெடுக்கவும்</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.modalCloseBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Modal Search */}
        <View style={styles.modalSearchBar}>
          <Ionicons name="search" size={17} color="#8B0000" />
          <TextInput
            style={styles.modalSearchInput}
            placeholder="தேடுக..."
            placeholderTextColor="#aaa"
            value={modalSearch}
            onChangeText={setModalSearch}
            autoCorrect={false}
          />
          {modalSearch.length > 0 && (
            <TouchableOpacity onPress={() => setModalSearch("")} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={17} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {/* Options List */}
        <FlatList
          data={modalOptions}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.modalList}
          renderItem={({ item }) => {
            const selected = activeFilter === item;
            return (
              <TouchableOpacity
                style={[styles.modalItem, selected && styles.modalItemActive]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.75}
              >
                <Text style={[styles.modalItemText, selected && styles.modalItemTextActive]}>
                  {item}
                </Text>
                {selected && (
                  <Ionicons name="checkmark-circle" size={20} color="#8B0000" />
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.modalEmpty}>
              <Text style={styles.modalEmptyText}>எதுவும் கிடைக்கவில்லை</Text>
            </View>
          }
        />
      </View>
    </Modal>
  );

  /* ── Card ── */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("HinduSamayam2", {
          categoryId: item.id,
          categoryName: item.name,
        })
      }
      style={styles.card}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.nameBox}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <View style={styles.container}>

        {renderHeader()}
        {!error && renderFilterTrigger()}
        {renderModal()}

        {error ? (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={50} color="#8B0000" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchCategories}>
              <Text style={styles.retryText}>மீண்டும் முயற்சிக்கவும்</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredCategories}
            key={`grid-${numColumns}`}
            keyExtractor={(item) => String(item.id)}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              filteredCategories.length === 0 && styles.emptyContent,
            ]}
            columnWrapperStyle={styles.row}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.center}>
                <Ionicons name="folder-open-outline" size={56} color="#ccc" />
                <Text style={styles.emptyText}>பகுப்புகள் கிடைக்கவில்லை</Text>
              </View>
            }
            ListFooterComponent={<View style={{ height: 24 }} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HinduSamayam1;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#8B0000" },
  container: { flex: 1, backgroundColor: "#F2F2F2" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B0000",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 12 : 40,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  backButton: {
    width: isTablet ? 50 : 42,
    height: isTablet ? 50 : 42,
    borderRadius: isTablet ? 25 : 21,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: isTablet ? 24 : 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  /* Filter Trigger Bar */
  filterTriggerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    gap: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  filterTrigger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0EE",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: "rgba(139,0,0,0.2)",
    gap: 8,
  },
  filterTriggerText: {
    flex: 1,
    fontSize: isTablet ? 14 : 13,
    fontWeight: "700",
    color: "#8B0000",
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFF0EE",
    borderWidth: 1.5,
    borderColor: "rgba(139,0,0,0.2)",
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8B0000",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.65,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.07)",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(139,0,0,0.15)",
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A1A",
    padding: 0,
    fontWeight: "500",
  },
  modalList: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    backgroundColor: "#fff",
  },
  modalItemActive: {
    backgroundColor: "rgba(139,0,0,0.06)",
  },
  modalItemText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  modalItemTextActive: {
    color: "#8B0000",
    fontWeight: "800",
  },
  modalEmpty: {
    alignItems: "center",
    paddingTop: 40,
  },
  modalEmptyText: {
    fontSize: 14,
    color: "#aaa",
    fontWeight: "600",
  },

  /* List */
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 16,
    paddingBottom: 16,
  },
  emptyContent: { flexGrow: 1 },
  row: {
    justifyContent: "space-between",
    marginBottom: GAP,
  },

  /* Card */
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
  },
  nameBox: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  cardTitle: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: "700",
    color: "#2B2B2B",
    textAlign: "center",
    lineHeight: 17,
  },

  /* States */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 32,
  },
  errorText: {
    color: "#8B0000",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 15,
    color: "#888",
    fontWeight: "600",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: "#8B0000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
  },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
