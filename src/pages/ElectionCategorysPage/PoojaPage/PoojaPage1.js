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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchAllPoojas } from "../../../Controller/PoojaController/PoojaController";
import Loader from "../../../components/Alert/Loader";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const ALL = "அனைத்தும்";

export default function PoojaPage1({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const numColumns = 2;

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

  return (
    <View style={styles.screen}>

      {/* HEADER — original unchanged */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Pooja
        </Text>
        <View style={styles.headerSide} />
      </View>

      {/* FILTER TRIGGER */}
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

      {/* POOJA GRID — original unchanged */}
      <FlatList
        data={filteredPoojas}
        key={numColumns}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          isTablet && styles.containerTablet,
          filteredPoojas.length === 0 && styles.emptyContent,
        ]}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.card,
              isTablet && styles.cardTablet,
              index % 2 === 0 ? styles.leftCard : styles.rightCard,
            ]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Poojacategory", { id: item.id })}
          >
            <Image
              source={{ uri: item.bannerimg }}
              style={[styles.image, isTablet && styles.imageTablet]}
              resizeMode="cover"
            />
            <View style={[styles.bottomRow, isTablet && styles.bottomRowTablet]}>
              <Text
                style={[styles.title, isTablet && styles.titleTablet]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="folder-open-outline" size={56} color="#ccc" />
            <Text style={styles.emptyText}>எதுவும் கிடைக்கவில்லை</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  /* HEADER — original unchanged */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: { paddingTop: 45, paddingBottom: 28, paddingHorizontal: 18 },
  headerTitle: {
    flex: 1, textAlign: "center", color: "#fff",
    fontSize: 20, fontWeight: "800", letterSpacing: 0.3,
  },
  headerTitleTablet: { fontSize: 26 },
  headerSide: { width: 55 },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center", marginLeft: 15,
  },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25 },

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

  /* GRID — original unchanged */
  container: { padding: 10, paddingBottom: 30 },
  containerTablet: { paddingHorizontal: 20, paddingTop: 24 },
  emptyContent: { flexGrow: 1 },

  /* CARD — original unchanged */
  card: {
    flex: 1, backgroundColor: "#fff", margin: 6,
    borderRadius: 12, overflow: "hidden", elevation: 3,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
    marginBottom: 12, borderWidth: 1, borderColor: "#f0f0f0",
  },
  cardTablet: { borderRadius: 16, margin: 10, marginBottom: 20 },
  leftCard: { marginLeft: 10, marginRight: 5 },
  rightCard: { marginLeft: 5, marginRight: 10 },
  image: { width: "100%", height: 120, backgroundColor: "#f5f5f5" },
  imageTablet: { height: 160 },
  bottomRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 12,
    paddingVertical: 10, backgroundColor: "#fff",
  },
  bottomRowTablet: { paddingHorizontal: 16, paddingVertical: 14 },
  title: { fontSize: 14, fontWeight: "600", color: "#333", flex: 1, marginRight: 8, textAlign: "center" },
  titleTablet: { fontSize: 18 },

  /* EMPTY */
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: "#888", fontWeight: "600" },
});