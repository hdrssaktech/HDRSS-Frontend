import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
  StatusBar,
  Modal,
  ScrollView,
  Platform,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HeaderCartOrders from "./ProductScreenHeaderCartOrders";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;
const COLUMNS = isTablet ? 4 : 3;
const GAP = isTablet ? 14 : 10;
const H_PAD = isTablet ? 20 : 12;
const CARD_SIZE = (width - H_PAD * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

const AD_WIDTH = width;
const AD_HEIGHT = isTablet ? 280 : 200;

const C = {
  primary: "#9D1B00",
  primaryDark: "#9D1B00",
  primaryDeep: "#4A0D0D",
  gold: "#D4AF37",
  goldLight: "#F0D060",
  surface: "#FFFFFF",
  bg: "#F7F3F0",
  textDark: "#1A0A0A",
  textMid: "#5C3A3A",
  textLight: "#9E7070",
  border: "#EDE0DC",
};

export default function AllCategoriesScreen({ route, navigation }) {
  const { categories = [], ads = [] } = route.params || {};
  const [searchText, setSearchText] = useState("");
  const [currentAd, setCurrentAd] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const adRef = useRef(null);

  const filterOptions = ["All", ...categories.map((c) => c.categoryName)];
  const filteredProducts = categories.filter((item) => {
    const matchSearch = item.categoryName.toLowerCase().includes(searchText.toLowerCase());
    const matchFilter =
      !selectedFilter || selectedFilter === "All" ? true : item.categoryName === selectedFilter;
    return matchSearch && matchFilter;
  });

  // Auto-scrolling ad carousel — cycles through every ad returned from the CRM
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAd((prevIndex) => {
          const nextIndex = (prevIndex + 1) % ads.length;
          adRef.current?.scrollToOffset({
            offset: nextIndex * AD_WIDTH,
            animated: true,
          });
          return nextIndex;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const onRefresh = () => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => setRefreshing(false), 2000);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, { width: CARD_SIZE }]}
      onPress={() =>
        navigation.navigate("ProductScreen2", {
          category: item.categoryName,
          categoryId: item.id,
        })
      }
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/300" }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />
      <View style={styles.cardTopBar} />
      <View style={styles.cardBottom}>
        <Text style={styles.cardName} numberOfLines={2}>{item.categoryName}</Text>
        <Text style={styles.cardSub}>Browse →</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAdItem = ({ item }) => {
    const imageUrl = item.image || item.imageUrl || item.banner || "https://via.placeholder.com/800x200?text=Ad";
    return (
      <View style={styles.adSlideContainer}>
        <Image source={{ uri: imageUrl }} style={styles.adImage} resizeMode="cover" />
      </View>
    );
  };

  const renderGridItems = () => {
    if (filteredProducts.length === 0) {
      return (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <Ionicons name="search-outline" size={isTablet ? 40 : 34} color={C.primary} />
          </View>
          <Text style={styles.emptyTitle}>
            {searchText ? "No results found" : "No categories yet"}
          </Text>
          <Text style={styles.emptySub}>
            {searchText ? `Nothing matched "${searchText}"` : "Check back soon"}
          </Text>
          {searchText && (
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setSearchText("")}>
              <Text style={styles.emptyBtnText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // Create rows for the grid
    const rows = [];
    for (let i = 0; i < filteredProducts.length; i += COLUMNS) {
      rows.push(filteredProducts.slice(i, i + COLUMNS));
    }

    return rows.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={styles.row}>
        {row.map((item) => (
          <View key={item.id} style={{ width: CARD_SIZE }}>
            {renderItem({ item })}
          </View>
        ))}
        {/* Fill empty spaces in the row */}
        {row.length < COLUMNS && 
          Array(COLUMNS - row.length).fill(null).map((_, index) => (
            <View key={`empty-${index}`} style={{ width: CARD_SIZE }} />
          ))
        }
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar backgroundColor={C.primaryDeep} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={isTablet ? 26 : 22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Products</Text>
        <HeaderCartOrders navigation={navigation} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[C.primary]} tintColor={C.primary} />
        }
      >
        {/* Ad carousel */}
        {ads.length > 0 && (
          <View style={styles.adSection}>
            <FlatList
              ref={adRef}
              data={ads}
              horizontal
              pagingEnabled
              snapToInterval={AD_WIDTH}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / AD_WIDTH);
                setCurrentAd(idx);
              }}
              renderItem={renderAdItem}
              scrollEnabled={ads.length > 1}
            />
           </View>
        )}

        {/* Search and Filters */}
        <View style={styles.searchOuter}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={isTablet ? 20 : 17} color={C.primary} />
            <TextInput
              placeholder="Search categories…"
              placeholderTextColor={C.textLight}
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={isTablet ? 18 : 16} color={C.textLight} />
              </TouchableOpacity>
            )}
            <View style={styles.searchDivider} />
            <TouchableOpacity
              style={[
                styles.filterIconBtn,
                selectedFilter && selectedFilter !== "All" && styles.filterIconBtnActive,
              ]}
              onPress={() => setFilterVisible(true)}
            >
              <Ionicons
                name="options"
                size={isTablet ? 20 : 17}
                color={selectedFilter && selectedFilter !== "All" ? "#fff" : C.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {filterOptions.slice(0, 7).map((opt, i) => {
            const active = opt === (selectedFilter || "All");
            return (
              <TouchableOpacity
                key={i}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedFilter(opt === "All" ? null : opt)}
                activeOpacity={0.8}
              >
                {active && <View style={styles.chipDot} />}
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
          {filterOptions.length > 7 && (
            <TouchableOpacity style={[styles.chip, styles.chipMore]} onPress={() => setFilterVisible(true)}>
              <Ionicons name="ellipsis-horizontal" size={isTablet ? 15 : 13} color={C.primary} />
              <Text style={[styles.chipText, { color: C.primary, marginLeft: 3 }]}>More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {selectedFilter && selectedFilter !== "All" && (
          <View style={styles.activeFilterRow}>
            <TouchableOpacity onPress={() => setSelectedFilter(null)} style={styles.clearTag}>
              <Text style={styles.clearTagText}>✕  {selectedFilter}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Product Grid */}
        <View style={styles.listContent}>
          {renderGridItems()}
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <Modal visible={filterVisible} transparent animationType="slide" onRequestClose={() => setFilterVisible(false)}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setFilterVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>Filter by Category</Text>
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Ionicons name="close" size={isTablet ? 26 : 22} color={C.textMid} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
            {filterOptions.map((opt, i) => {
              const active = opt === (selectedFilter || "All");
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.filterRow, active && styles.filterRowActive]}
                  onPress={() => {
                    setSelectedFilter(opt === "All" ? null : opt);
                    setFilterVisible(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.filterLeft}>
                    <View style={[styles.radio, active && styles.radioActive]}>
                      {active && <View style={styles.radioFill} />}
                    </View>
                    <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{opt}</Text>
                  </View>
                  {active && <Ionicons name="checkmark-circle" size={isTablet ? 22 : 20} color={C.primary} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.sheetFooter}>
            <TouchableOpacity style={styles.footerClear} onPress={() => { setSelectedFilter(null); setFilterVisible(false); }}>
              <Text style={styles.footerClearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerApply} onPress={() => setFilterVisible(false)}>
              <Text style={styles.footerApplyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: C.bg 
  },

  scrollView: {
    flex: 1,
    backgroundColor: C.bg,
  },

  header: {
    backgroundColor: C.primary,
    paddingTop: Platform.OS === "ios" ? (isTablet ? 60 : 58) : (isTablet ? 50 : 46),
    paddingBottom: isTablet ? 22 : 21,
    paddingHorizontal: isTablet ? 24 : 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: isTablet ? 30 : 25,
    borderBottomRightRadius: isTablet ? 30 : 25,
    elevation: 4,
    shadowColor: "#9D1B00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },

  backBtn: {
    width: isTablet ? 44 : 38,
    height: isTablet ? 44 : 38,
    borderRadius: isTablet ? 22 : 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: isTablet ? 26 : 20,
    fontWeight: "800",
    letterSpacing: 0.4,
    textAlign: "center",
    flex: 1,
  },

  adSection: {
    position: "relative",
    backgroundColor: C.bg,
  },

  adSlideContainer: {
    width: AD_WIDTH,
    height: AD_HEIGHT,
    overflow: "hidden",
  },

  adImage: {
    width: "100%",
    height: "100%",
  },

  adDotsContainer: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 8,
  },

  adDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },

  adDotActive: {
    backgroundColor: C.gold,
    width: 20,
  },

  searchOuter: {
    paddingHorizontal: H_PAD,
    paddingTop: isTablet ? 14 : 12,
    paddingBottom: isTablet ? 10 : 8,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 16 : 13,
    height: isTablet ? 52 : 44,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    gap: isTablet ? 10 : 8,
  },

  searchInput: { 
    flex: 1, 
    fontSize: isTablet ? 16 : 14, 
    color: C.textDark, 
    paddingVertical: 0 
  },

  searchDivider: { 
    width: 1, 
    height: isTablet ? 24 : 20, 
    backgroundColor: "#E0E0E0", 
    marginHorizontal: 2 
  },

  filterIconBtn: {
    width: isTablet ? 36 : 32,
    height: isTablet ? 36 : 32,
    borderRadius: isTablet ? 10 : 8,
    backgroundColor: "#F5F0EB",
    justifyContent: "center",
    alignItems: "center",
  },

  filterIconBtnActive: { 
    backgroundColor: C.primary 
  },

  chipsRow: { 
    paddingHorizontal: H_PAD, 
    paddingBottom: isTablet ? 10 : 8, 
    paddingTop: isTablet ? 4 : 2,
    gap: isTablet ? 8 : 7, 
    flexDirection: "row" 
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: isTablet ? 16 : 13,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 24 : 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: isTablet ? 8 : 7,
  },

  chipActive: { 
    backgroundColor: C.primary, 
    borderColor: C.primary 
  },

  chipDot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: C.gold, 
    marginRight: 6 
  },

  chipText: { 
    fontSize: isTablet ? 14 : 12, 
    color: C.textMid, 
    fontWeight: "600" 
  },

  chipTextActive: { 
    color: "#fff" 
  },

  chipMore: { 
    borderColor: C.primary, 
    backgroundColor: "#FEF6F0", 
    gap: 2 
  },

  activeFilterRow: { 
    paddingHorizontal: H_PAD, 
    paddingBottom: isTablet ? 12 : 8 
  },

  clearTag: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: isTablet ? 14 : 10,
    paddingVertical: isTablet ? 6 : 4,
    borderRadius: isTablet ? 14 : 12,
  },

  clearTagText: { 
    fontSize: isTablet ? 13 : 11, 
    color: C.primary, 
    fontWeight: "700" 
  },

  listContent: { 
    paddingHorizontal: H_PAD,
    paddingTop: isTablet ? 4 : 2,
  },

  row: { 
    flexDirection: "row",
    gap: GAP,
    marginBottom: GAP,
    justifyContent: "flex-start",
  },

  card: {
    borderRadius: isTablet ? 16 : 12,
    overflow: "hidden",
    backgroundColor: "#f7f7f7",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    aspectRatio: 0.85,
  },

  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: isTablet ? 16 : 12,
  },

  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: isTablet ? 16 : 12,
  },

  cardTopBar: {
    position: "absolute",
    top: 0, 
    left: 0, 
    right: 0,
    height: isTablet ? 4 : 3,
    backgroundColor: C.gold,
    opacity: 0.9,
    borderTopLeftRadius: isTablet ? 16 : 12,
    borderTopRightRadius: isTablet ? 16 : 12,
  },

  cardBottom: {
    position: "absolute",
    bottom: 0, 
    left: 0, 
    right: 0,
    paddingHorizontal: isTablet ? 10 : 8,
    paddingVertical: isTablet ? 8 : 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderBottomLeftRadius: isTablet ? 16 : 12,
    borderBottomRightRadius: isTablet ? 16 : 12,
  },

  cardName: { 
    fontSize: isTablet ? 13 : 11, 
    fontWeight: "700", 
    color: "#fff", 
    marginBottom: 2, 
    lineHeight: isTablet ? 18 : 15 
  },

  cardSub: { 
    fontSize: isTablet ? 10 : 9, 
    color: C.goldLight, 
    fontWeight: "600", 
    letterSpacing: 0.4 
  },

  emptyWrap: { 
    alignItems: "center", 
    paddingVertical: isTablet ? 90 : 70, 
    gap: isTablet ? 12 : 10 
  },

  emptyIcon: {
    width: isTablet ? 80 : 68, 
    height: isTablet ? 80 : 68, 
    borderRadius: isTablet ? 40 : 34,
    backgroundColor: "#FAE8E8", 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 4,
  },

  emptyTitle: { 
    fontSize: isTablet ? 18 : 16, 
    fontWeight: "700", 
    color: C.textDark 
  },

  emptySub: { 
    fontSize: isTablet ? 15 : 13, 
    color: C.textLight, 
    textAlign: "center" 
  },

  emptyBtn: {
    marginTop: 8, 
    backgroundColor: C.primary,
    paddingHorizontal: isTablet ? 28 : 24, 
    paddingVertical: isTablet ? 12 : 10, 
    borderRadius: isTablet ? 24 : 22,
  },

  emptyBtnText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: isTablet ? 15 : 13 
  },

  bottomPadding: {
    height: isTablet ? 40 : 30,
  },

  backdrop: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.4)" 
  },

  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: isTablet ? 28 : 24,
    borderTopRightRadius: isTablet ? 28 : 24,
    paddingHorizontal: isTablet ? 24 : 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    paddingTop: 10,
  },

  sheetHandle: { 
    alignSelf: "center", 
    width: 40, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: "#E0E0E0", 
    marginBottom: 14 
  },

  sheetHead: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    marginBottom: 14, 
    paddingBottom: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: "#E0E0E0",
  },

  sheetTitle: { 
    fontSize: isTablet ? 19 : 17, 
    fontWeight: "700", 
    color: C.textDark 
  },

  filterRow: {
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
    paddingVertical: isTablet ? 15 : 13, 
    paddingHorizontal: isTablet ? 14 : 12,
    borderRadius: isTablet ? 12 : 10, 
    marginBottom: 3,
  },

  filterRowActive: { 
    backgroundColor: "#FEF0F0" 
  },

  filterLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: isTablet ? 14 : 12 
  },

  radio: {
    width: isTablet ? 22 : 20, 
    height: isTablet ? 22 : 20, 
    borderRadius: isTablet ? 11 : 10,
    borderWidth: 2, 
    borderColor: "#E0E0E0", 
    justifyContent: "center", 
    alignItems: "center",
  },

  radioActive: { 
    borderColor: C.primary 
  },

  radioFill: { 
    width: isTablet ? 12 : 10, 
    height: isTablet ? 12 : 10, 
    borderRadius: isTablet ? 6 : 5, 
    backgroundColor: C.primary 
  },

  filterLabel: { 
    fontSize: isTablet ? 16 : 14, 
    color: C.textMid, 
    fontWeight: "500" 
  },

  filterLabelActive: { 
    color: C.primary, 
    fontWeight: "700" 
  },

  sheetFooter: {
    flexDirection: "row", 
    gap: isTablet ? 12 : 10, 
    marginTop: isTablet ? 18 : 16,
    paddingTop: isTablet ? 16 : 14, 
    borderTopWidth: 1, 
    borderTopColor: "#E0E0E0",
  },

  footerClear: {
    flex: 1, 
    paddingVertical: isTablet ? 15 : 13, 
    backgroundColor: "#F5F5F5",
    borderRadius: isTablet ? 14 : 12, 
    alignItems: "center", 
    borderWidth: 1, 
    borderColor: "#E0E0E0",
  },

  footerClearText: { 
    color: C.textMid, 
    fontWeight: "600", 
    fontSize: isTablet ? 16 : 14 
  },

  footerApply: { 
    flex: 2, 
    paddingVertical: isTablet ? 15 : 13, 
    backgroundColor: C.primary, 
    borderRadius: isTablet ? 14 : 12, 
    alignItems: "center" 
  },

  footerApplyText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: isTablet ? 16 : 14 
  },
});