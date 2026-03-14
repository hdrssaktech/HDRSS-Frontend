import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Loader from "../../../components/Alert/Loader";

const { width, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isTablet = width >= 600;
const ALL = "அனைத்தும்";

export default function PoojaCategory() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

  useEffect(() => {
    fetchPoojaCategory();
  }, []);

  const fetchPoojaCategory = async () => {
    try {
      const response = await fetch(
        `https://hdrss-backend.onrender.com/api/pooja/poojacategory/${id}`
      );
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetails = (item) => {
    navigation.navigate("PoojaDetails", { poojaItem: item });
  };

  // Unique titles for modal list
  const filterOptions = [ALL, ...new Set((data || []).map((d) => d.title).filter(Boolean))];

  // Modal list filtered by search
  const modalOptions = filterOptions.filter((opt) =>
    opt.toLowerCase().includes(modalSearch.toLowerCase())
  );

  // Main list filtered by selected title
  const filteredData =
    activeFilter === ALL
      ? data || []
      : (data || []).filter((item) => item.title === activeFilter);

  const handleSelect = (option) => {
    setActiveFilter(option);
    setModalVisible(false);
    setModalSearch("");
  };

  if (loading) return <Loader />;

  if (!data || data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No Data Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* HEADER — original unchanged */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Pooja Services
        </Text>
        <View style={[styles.headerRightPlaceholder, isTablet && styles.headerRightPlaceholderTablet]} />
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

      {/* CONTENT — original unchanged */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
          filteredData.length === 0 && { flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredData.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="folder-open-outline" size={56} color="#ccc" />
            <Text style={styles.noDataText}>எதுவும் கிடைக்கவில்லை</Text>
          </View>
        ) : (
          filteredData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, isTablet && styles.cardTablet]}
              onPress={() => navigateToDetails(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardContent, isTablet && styles.cardContentTablet]}>

                {/* Image Section */}
                <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}>
                  <Image
                    source={{ uri: item.image || item.bannerimg }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>

                {/* Details Section */}
                <View style={[styles.detailsContainer, isTablet && styles.detailsContainerTablet]}>
                  <Text
                    style={[styles.title, isTablet && styles.titleTablet]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  <View style={styles.iconsContainer}>
                    {item.Phone && (
                      <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                        <View style={[styles.iconCircle, styles.phoneIcon, isTablet && styles.iconCircleTablet]}>
                          <Icon name="phone" size={isTablet ? 22 : 18} color="white" />
                        </View>
                      </TouchableOpacity>
                    )}
                    {item.whatshapp && (
                      <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                        <View style={[styles.iconCircle, styles.whatsappIcon, isTablet && styles.iconCircleTablet]}>
                          <Ionicons name="logo-whatsapp" size={isTablet ? 22 : 18} color="white" />
                        </View>
                      </TouchableOpacity>
                    )}
                    {item.location && (
                      <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                        <View style={[styles.iconCircle, styles.locationIcon, isTablet && styles.iconCircleTablet]}>
                          <Icon name="location-on" size={isTablet ? 22 : 18} color="white" />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>

                  {item.description && (
                    <View style={styles.moreContainer}>
                      <Text style={[styles.moreText, isTablet && styles.moreTextTablet]}>
                        View Details
                      </Text>
                      <Icon name="arrow-forward" size={isTablet ? 20 : 16} color="#93210A" />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa", gap: 12 },
  noDataText: { fontSize: 16, color: "#666" },

  /* HEADER — original unchanged */
  header: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40, paddingBottom: 30,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  headerTablet: { paddingTop: 45, paddingBottom: 28, paddingHorizontal: 18 },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center", marginLeft: 15,
  },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25 },
  headerTitle: {
    flex: 1, textAlign: "center", color: "#fff",
    fontSize: 20, fontWeight: "800", letterSpacing: 0.3,
  },
  headerTitleTablet: { fontSize: 24 },
  headerRightPlaceholder: { width: 34 },
  headerRightPlaceholderTablet: { width: 44 },

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

  /* SCROLL — original unchanged */
  scrollView: { flex: 1 },
  scrollContent: { padding: 15, paddingBottom: 30 },
  scrollContentTablet: {
    padding: 20, paddingBottom: 40,
    flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between",
  },

  /* CARD — original unchanged */
  card: {
    backgroundColor: "white", borderRadius: 16, marginBottom: 15,
    elevation: 3, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6,
    overflow: "hidden", borderWidth: 1, borderColor: "#f0f0f0",
  },
  cardTablet: {
    width: width >= 1024 ? "49%" : "100%",
    marginBottom: 20, borderRadius: 20,
  },
  cardContent: { flexDirection: "row", height: 140 },
  cardContentTablet: { height: 180 },
  imageContainer: { width: "40%", padding: 10 },
  imageContainerTablet: { width: "35%", padding: 15 },
  image: { width: "100%", height: "100%", borderRadius: 12, backgroundColor: "#f0f0f0" },
  detailsContainer: { width: "60%", padding: 12, justifyContent: "space-between" },
  detailsContainerTablet: { width: "65%", padding: 16 },
  title: { fontSize: 15, fontWeight: "bold", color: "#333", marginBottom: 6, lineHeight: 20 },
  titleTablet: { fontSize: 18, marginBottom: 10, lineHeight: 24 },
  iconsContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 10 },
  iconButton: { padding: 2 },
  iconCircle: {
    width: 34, height: 34, borderRadius: 17,
    justifyContent: "center", alignItems: "center",
    elevation: 3, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 3,
  },
  iconCircleTablet: { width: 44, height: 44, borderRadius: 22 },
  phoneIcon: { backgroundColor: "#93210A" },
  whatsappIcon: { backgroundColor: "#25D366" },
  locationIcon: { backgroundColor: "#93210A" },
  moreContainer: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8, borderTopWidth: 1, borderTopColor: "#f0f0f0",
  },
  moreText: { fontSize: 12, color: "#93210A", fontWeight: "600" },
  moreTextTablet: { fontSize: 14 },
});