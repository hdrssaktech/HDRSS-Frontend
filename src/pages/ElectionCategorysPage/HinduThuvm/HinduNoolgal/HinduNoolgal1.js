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
import { useNavigation, useRoute } from "@react-navigation/native";
import Loader from "../../../../components/Alert/Loader";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isTablet = SCREEN_WIDTH >= 600;
const numColumns = isTablet ? 3 : 2;
const H_PADDING = isTablet ? 24 : 16;
const GAP = isTablet ? 20 : 12;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

const ALL = "அனைத்தும்";

const HinduNoolgal1 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const categoryTypes = route.params.categoryType;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        "https://hdrss-backend.onrender.com/api/hindu-noolgal/category"
      );
      const filteredData = res.data.filter((item)=>categoryTypes=="இந்து நூல்கள்"?item.category=="HinduNoolgal":item.category=="Noolgal");
      setCategories(filteredData || []);
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

  if (loading) return <Loader />;

  const renderItem = ({ item, index }) => {
    const isLastInRow = index % numColumns === numColumns - 1;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate("HinduNoolgal2", {
            categoryId: item.id,
            categoryName: item.name,
          })
        }
        style={[
          styles.card,
          isTablet && styles.cardTablet,
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            marginRight: !isLastInRow ? GAP : 0,
            marginBottom: GAP,
          },
        ]}
      >
        <View style={[styles.imageBox, { height: CARD_HEIGHT * 0.7 }]}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        </View>
        <View style={[styles.textContainer, { height: CARD_HEIGHT * 0.3 }]}>
          <Text
            style={[styles.cardTitle, isTablet && styles.cardTitleTablet]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {item.name}
          </Text>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={isTablet ? 18 : 16} color="#8B0000" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      <View style={styles.container}>

        {/* HEADER */}
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <TouchableOpacity
            style={[styles.backButton, isTablet && styles.backButtonTablet]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={isTablet ? 30 : 24} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
            {categoryTypes}
          </Text>
          <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
        </View>

        {/* FILTER TRIGGER */}
        {!error && (
          <View style={styles.filterTriggerWrapper}>
            <TouchableOpacity
              style={styles.filterTrigger}
              onPress={() => { setModalSearch(""); setModalVisible(true); }}
              activeOpacity={0.8}
            >
              <Ionicons name="funnel-outline" size={16} color="#93210A" />
              <Text style={styles.filterTriggerText} numberOfLines={1}>
                {activeFilter}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#93210A" />
            </TouchableOpacity>

            {activeFilter !== ALL && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => setActiveFilter(ALL)}
                activeOpacity={0.8}
              >
                <Ionicons name="close-circle" size={18} color="#93210A" />
                <Text style={styles.clearBtnText}>Clear</Text>
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
          <View style={styles.modalSheet}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>வகையைத் தேர்ந்தெடுக்கவும்</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchBar}>
              <Ionicons name="search" size={17} color="#93210A" />
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
                      <Ionicons name="checkmark-circle" size={20} color="#93210A" />
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

        {/* ERROR STATE */}
        {error ? (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={isTablet ? 60 : 50} color="#8B0000" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchCategories}>
              <Text style={styles.retryText}>மீண்டும் முயற்சிக்கவும்</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredCategories}
            key={`${numColumns}`}
            keyExtractor={(item) => String(item.id)}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContent,
              filteredCategories.length === 0 && styles.emptyContent,
            ]}
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.center}>
                <Ionicons name="folder-open-outline" size={56} color="#ccc" />
                <Text style={styles.emptyText}>பகுப்புகள் கிடைக்கவில்லை</Text>
              </View>
            }
            ListFooterComponent={<View style={{ height: 20 }} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HinduNoolgal1;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },

  /* HEADER — original unchanged */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: Platform.OS === "ios" ? 12 : 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: { paddingTop: Platform.OS === "ios" ? 16 : 45, paddingBottom: 28, paddingHorizontal: 18 },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center", marginLeft: 15,
  },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25 },
  headerTitle: {
    flex: 1, textAlign: "center", color: "#fff",
    fontSize: 18, fontWeight: "800", letterSpacing: 0.3,
  },
  headerTitleTablet: { fontSize: 22 },
  headerSpacer: { width: 36 },
  headerSpacerTablet: { width: 44 },

  /* FILTER TRIGGER */
  filterTriggerWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", paddingHorizontal: 16,
    paddingVertical: 10, borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)", gap: 10,
    elevation: 2, shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3,
  },
  filterTrigger: {
    flex: 1, flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFF0EE", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 9,
    borderWidth: 1.5, borderColor: "rgba(147,33,10,0.2)", gap: 8,
  },
  filterTriggerText: { flex: 1, fontSize: 13, fontWeight: "700", color: "#93210A" },
  clearBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8,
    backgroundColor: "#FFF0EE", borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.2)",
  },
  clearBtnText: { fontSize: 12, fontWeight: "700", color: "#93210A" },

  /* MODAL */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  modalSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: SCREEN_HEIGHT * 0.65, backgroundColor: "#fff",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    overflow: "hidden", elevation: 20, shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15, shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.07)",
  },
  modalTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A1A" },
  modalCloseBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "#F5F5F5",
    alignItems: "center", justifyContent: "center",
  },
  modalSearchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F5F5F5", borderRadius: 12,
    marginHorizontal: 16, marginVertical: 12,
    paddingHorizontal: 12, paddingVertical: 10,
    gap: 8, borderWidth: 1, borderColor: "rgba(147,33,10,0.15)",
  },
  modalSearchInput: { flex: 1, fontSize: 14, color: "#1A1A1A", padding: 0, fontWeight: "500" },
  modalList: { paddingHorizontal: 16, paddingBottom: 30 },
  modalItem: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 10, marginBottom: 4, backgroundColor: "#fff",
  },
  modalItemActive: { backgroundColor: "rgba(147,33,10,0.06)" },
  modalItemText: { fontSize: 14, color: "#333", fontWeight: "500", flex: 1 },
  modalItemTextActive: { color: "#93210A", fontWeight: "800" },
  modalEmpty: { alignItems: "center", paddingTop: 40 },
  modalEmptyText: { fontSize: 14, color: "#aaa", fontWeight: "600" },

  /* LIST */
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: isTablet ? 24 : 16,
    paddingBottom: isTablet ? 40 : 30,
  },
  emptyContent: { flexGrow: 1 },

  /* CARD — original unchanged */
  card: {
    backgroundColor: "#fff", borderRadius: 12, overflow: "hidden",
    elevation: 3, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
    borderWidth: 1, borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 16, elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8,
  },
  imageBox: { width: "100%", backgroundColor: "#f5f5f5" },
  image: { width: "100%", height: "100%" },
  textContainer: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 8,
  },
  cardTitle: {
    flex: 1, fontSize: 13, fontWeight: "700",
    color: "#333", lineHeight: 18, paddingRight: 4,
  },
  cardTitleTablet: { fontSize: 15, fontWeight: "800", lineHeight: 20 },
  arrowContainer: { width: 20, alignItems: "center", justifyContent: "center" },

  /* STATES */
  center: {
    flex: 1, justifyContent: "center",
    alignItems: "center", paddingTop: 80, gap: 12, paddingHorizontal: 32,
  },
  errorText: {
    color: "#8B0000", fontSize: 16, textAlign: "center",
    fontWeight: "700", lineHeight: 22, paddingHorizontal: 20,
  },
  emptyText: { color: "#777", fontSize: 16, fontWeight: "600" },
  retryBtn: {
    marginTop: 8, backgroundColor: "#8B0000",
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 25, elevation: 2,
  },
  retryText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});