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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../../components/Alert/Loader";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isTablet = SCREEN_WIDTH >= 600;
const numColumns = isTablet ? 3 : 2;
const H_PADDING = isTablet ? 20 : 14;
const GAP = isTablet ? 16 : 12;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;
const CARD_HEIGHT = CARD_WIDTH * 1.18;
const MAROON = "#8B0000";
const ALL = "அனைத்தும்";

const HinduLeaders1 = () => {
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
      const res = await axios.get(
        "https://hdrss-backend.onrender.com/api/hindu-leaders/category"
      );
      setCategories(res.data || []);
      setError(null);
    } catch (e) {
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

  const renderState = (icon, text, btnText, onPress) => (
    <View style={styles.stateWrap}>
      <Ionicons name={icon} size={52} color={MAROON} />
      <Text style={styles.stateText}>{text}</Text>
      {!!btnText && (
        <TouchableOpacity style={styles.retryBtn} onPress={onPress}>
          <Text style={styles.retryText}>{btnText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const CategoryCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("HinduLeaders2", {
          categoryId: item.id,
          categoryName: item.name,
        })
      }
      style={[
        styles.card,
        { width: CARD_WIDTH, height: CARD_HEIGHT },
        isTablet && styles.cardTablet,
      ]}
    >
      <View style={[styles.imageWrap, { height: CARD_HEIGHT * 0.72 }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <View style={[styles.bottom, { height: CARD_HEIGHT * 0.28 }]}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.title, isTablet && styles.titleTablet]}
        >
          {item.name}
        </Text>
        <View style={styles.chevCircle}>
          <Ionicons name="arrow-forward" size={isTablet ? 16 : 14} color={MAROON} />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={MAROON} barStyle="light-content" />
      <View style={styles.container}>

        {/* HEADER — original unchanged */}
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
            style={[styles.backBtn, isTablet && styles.backBtnTablet]}
          >
            <Ionicons name="chevron-back" size={isTablet ? 26 : 22} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
            இந்து தலைவர்கள்
          </Text>
          <View style={{ width: isTablet ? 44 : 38 }} />
        </View>

        {/* FILTER TRIGGER */}
        {!error && (
          <View style={styles.filterTriggerWrapper}>
            <TouchableOpacity
              style={styles.filterTrigger}
              onPress={() => { setModalSearch(""); setModalVisible(true); }}
              activeOpacity={0.8}
            >
              <Ionicons name="funnel-outline" size={16} color={MAROON} />
              <Text style={styles.filterTriggerText} numberOfLines={1}>
                {activeFilter}
              </Text>
              <Ionicons name="chevron-down" size={16} color={MAROON} />
            </TouchableOpacity>

            {activeFilter !== ALL && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => setActiveFilter(ALL)}
                activeOpacity={0.8}
              >
                <Ionicons name="close-circle" size={18} color={MAROON} />
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
              <Ionicons name="search" size={17} color={MAROON} />
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
                      <Ionicons name="checkmark-circle" size={20} color={MAROON} />
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

        {/* CONTENT — original logic unchanged */}
        {error ? (
          renderState("alert-circle-outline", error, "மீண்டும் முயற்சிக்கவும்", fetchCategories)
        ) : !categories.length ? (
          renderState("folder-open-outline", "பகுப்புகள் கிடைக்கவில்லை", null, null)
        ) : (
          <FlatList
            data={filteredCategories}
            key={`${numColumns}`}
            keyExtractor={(item) => String(item.id)}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: H_PADDING,
              paddingTop: 14,
              paddingBottom: 24,
            }}
            columnWrapperStyle={
              numColumns > 1
                ? { justifyContent: "space-between", marginBottom: GAP }
                : undefined
            }
            renderItem={({ item }) => <CategoryCard item={item} />}
            ListEmptyComponent={
              <View style={styles.stateWrap}>
                <Ionicons name="folder-open-outline" size={52} color="#ccc" />
                <Text style={[styles.stateText, { color: "#888" }]}>
                  எதுவும் கிடைக்கவில்லை
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HinduLeaders1;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  /* HEADER — original unchanged */
  header: {
    backgroundColor: MAROON,
    paddingVertical: 27,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  headerTablet: {
    paddingVertical: 16, paddingHorizontal: 22,
    borderBottomLeftRadius: 22, borderBottomRightRadius: 22,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center", marginTop: 18,
  },
  backBtnTablet: { width: 44, height: 44, borderRadius: 22 },
  headerTitle: {
    flex: 1, textAlign: "center", color: "#FFFFFF",
    fontSize: 17, fontWeight: "900", letterSpacing: 0.3, marginTop: 18,
  },
  headerTitleTablet: { fontSize: 18 },

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
    borderWidth: 1.5, borderColor: "rgba(139,0,0,0.2)", gap: 8,
  },
  filterTriggerText: { flex: 1, fontSize: 13, fontWeight: "700", color: MAROON },
  clearBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8,
    backgroundColor: "#FFF0EE", borderWidth: 1.5,
    borderColor: "rgba(139,0,0,0.2)",
  },
  clearBtnText: { fontSize: 12, fontWeight: "700", color: MAROON },

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
    gap: 8, borderWidth: 1, borderColor: "rgba(139,0,0,0.15)",
  },
  modalSearchInput: { flex: 1, fontSize: 14, color: "#1A1A1A", padding: 0, fontWeight: "500" },
  modalList: { paddingHorizontal: 16, paddingBottom: 30 },
  modalItem: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 10, marginBottom: 4, backgroundColor: "#fff",
  },
  modalItemActive: { backgroundColor: "rgba(139,0,0,0.06)" },
  modalItemText: { fontSize: 14, color: "#333", fontWeight: "500", flex: 1 },
  modalItemTextActive: { color: MAROON, fontWeight: "800" },
  modalEmpty: { alignItems: "center", paddingTop: 40 },
  modalEmptyText: { fontSize: 14, color: "#aaa", fontWeight: "600" },

  /* STATES — original unchanged */
  stateWrap: { flex: 1, justifyContent: "center", alignItems: "center", padding: 22 },
  stateText: { marginTop: 10, textAlign: "center", color: "#444", fontSize: 15, fontWeight: "700", lineHeight: 20 },
  retryBtn: { marginTop: 14, backgroundColor: MAROON, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "#fff", fontWeight: "900" },

  /* CARD — original unchanged */
  card: {
    borderRadius: 14, backgroundColor: "#FFFFFF",
    overflow: "hidden", borderWidth: 1, borderColor: "#F0F0F0",
    elevation: 2, shadowColor: "#000",
    shadowOpacity: 0.08, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTablet: { borderRadius: 18, elevation: 3, shadowOpacity: 0.1, shadowRadius: 8 },
  imageWrap: { width: "100%", backgroundColor: "#F7F7F7" },
  image: { width: "100%", height: "100%" },
  bottom: {
    paddingHorizontal: 10, paddingVertical: 8,
    flexDirection: "row", alignItems: "center",
    gap: 8, backgroundColor: "#FFFFFF",
  },
  title: { flex: 1, fontSize: 12.5, fontWeight: "800", color: MAROON, lineHeight: 18 },
  titleTablet: { fontSize: 14, lineHeight: 18 },
  chevCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "#FFF2F2",
    alignItems: "center", justifyContent: "center",
  },
});