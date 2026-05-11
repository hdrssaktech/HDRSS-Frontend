// import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   SectionList,
//   SafeAreaView,
//   TouchableOpacity,
//   useWindowDimensions,
//   Platform,
//   StatusBar,
//   Linking,
//   TextInput,
//   Modal,
//   Pressable,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { getMembers } from "../../api/api";
// import Loader from "../../components/Alert/Loader";

// // ─────────────────────────────────────────────
// // Category config
// // ─────────────────────────────────────────────
// const CATEGORY_ORDER = [
//   { key: "state_leader",    label: "State Leaders" },
//   { key: "district_leader", label: "District Leaders" },
//   { key: "other",           label: "Other Members" },
// ];

// const SORT_OPTIONS = [
//   { key: "orderNo_asc",  label: "Order No (Low → High)", icon: "arrow-up-outline" },
//   { key: "orderNo_desc", label: "Order No (High → Low)", icon: "arrow-down-outline" },
//   { key: "name_asc",     label: "Name (A → Z)",          icon: "text-outline" },
// ];

// const FILTER_OPTIONS = [
//   { key: "all",             label: "All Members" },
//   { key: "state_leader",    label: "State Leaders" },
//   { key: "district_leader", label: "District Leaders" },
//   { key: "other",           label: "Other Members" },
// ];

// const resolveCategory = (categoryType = "") => {
//   const val = categoryType.toLowerCase().replace(/\s+/g, "_");
//   if (val.includes("state"))    return "state_leader";
//   if (val.includes("district")) return "district_leader";
//   return "other";
// };

// // ─────────────────────────────────────────────
// // Helper: group list into row pairs for tablet
// // ─────────────────────────────────────────────
// function buildRows(list, isTablet) {
//   if (!isTablet)
//     return list.map((m) => ({ id: `row_${m.id}`, items: [m] }));
//   const rows = [];
//   for (let i = 0; i < list.length; i += 2)
//     rows.push({ id: `row_${list[i].id}`, items: list.slice(i, i + 2) });
//   return rows;
// }

// // ─────────────────────────────────────────────
// // Responsive hook
// // ─────────────────────────────────────────────
// const useResponsive = () => {
//   const { width, height } = useWindowDimensions();
//   const isTablet = width >= 600;
//   return {
//     isTablet,
//     width,
//     containerPadding: isTablet ? 20 : 14,
//     cardGap: isTablet ? 14 : 10,
//     imageFlex: 0.38,
//     detailFlex: 0.54,
//     sizes: {
//       headerTitleSize:  isTablet ? 26 : 20,
//       headerIconSize:   isTablet ? 30 : 24,
//       headerTopPadding: Platform.OS === "ios" ? (isTablet ? 56 : 48) : (isTablet ? 44 : 36),
//       sectionTitleSize: isTablet ? 20 : 16,
//       nameSize:         isTablet ? 18 : 15,
//       subTextSize:      isTablet ? 15 : 13,
//       joinFontSize:     isTablet ? 19 : 15,
//       joinPadding:      isTablet ? 16 : 12,
//       joinWidth:        isTablet ? 260 : 200,
//       searchFontSize:   isTablet ? 16 : 14,
//     },
//   };
// };

// // ─────────────────────────────────────────────
// // Filter Bottom Sheet Modal
// // Defined OUTSIDE main component — stable reference
// // ─────────────────────────────────────────────
// const FilterModal = ({
//   visible,
//   onClose,
//   sortOrder,
//   setSortOrder,
//   filterType,
//   setFilterType,
//   containerPadding,
// }) => (
//   <Modal
//     visible={visible}
//     transparent
//     animationType="slide"
//     onRequestClose={onClose}
//   >
//     <Pressable style={styles.modalOverlay} onPress={onClose}>
//       <Pressable
//         style={[styles.modalSheet, { paddingHorizontal: containerPadding + 4 }]}
//         onPress={() => {}}
//       >
//         <View style={styles.modalHandle} />

//         {/* Filter */}
//         <Text style={[styles.modalSectionLabel, { marginTop: 20 }]}>Category</Text>
//         <View style={styles.filterChipsWrap}>
//           {FILTER_OPTIONS.map((opt) => (
//             <TouchableOpacity
//               key={opt.key}
//               style={[styles.filterChip, filterType === opt.key && styles.filterChipActive]}
//               onPress={() => setFilterType(opt.key)}
//               activeOpacity={0.7}
//             >
//               <Text
//                 style={[
//                   styles.filterChipText,
//                   filterType === opt.key && styles.filterChipTextActive,
//                 ]}
//               >
//                 {opt.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <TouchableOpacity style={styles.doneButton} onPress={onClose}>
//           <Text style={styles.doneButtonText}>Apply</Text>
//         </TouchableOpacity>
//       </Pressable>
//     </Pressable>
//   </Modal>
// );

// // ─────────────────────────────────────────────
// // Member Card
// // Defined OUTSIDE main component — stable reference
// // ─────────────────────────────────────────────
// const MemberCard = ({ item, responsive }) => {
//   const { sizes, isTablet, imageFlex, detailFlex, cardGap } = responsive;

//   return (
//     <View style={[styles.card, { marginBottom: cardGap }]}>
//       {/* Image (40%) */}
//       <View style={[styles.imageSection, { flex: imageFlex }]}>
//         <Image
//           source={{ uri: item.image || "https://via.placeholder.com/150" }}
//           style={styles.cardImage}
//           resizeMode="cover"
//         />
//         {item.isActive && (
//           <View style={styles.activeBadge}>
//             <View style={styles.activeDot} />
//             <Text style={styles.activeText}>Active</Text>
//           </View>
//         )}
//       </View>

//       {/* Details (50%+) */}
//       <View style={[styles.detailSection, { flex: detailFlex }]}>
//         <Text
//           style={[styles.memberName, { fontSize: sizes.nameSize }]}
//           numberOfLines={2}
//         >
//           {item.name || "—"}
//         </Text>

//         {item.designation ? (
//           <View style={styles.detailRow}>
//             <Ionicons name="briefcase-outline" size={isTablet ? 15 : 13} color="#93210A" />
//             <Text
//               style={[styles.detailText, { fontSize: sizes.subTextSize }]}
//               numberOfLines={1}
//             >
//               {item.designation}
//             </Text>
//           </View>
//         ) : null}

//         {item.wing ? (
//           <View style={styles.detailRow}>
//             <Ionicons name="flag-outline" size={isTablet ? 15 : 13} color="#93210A" />
//             <Text
//               style={[styles.detailText, { fontSize: sizes.subTextSize }]}
//               numberOfLines={1}
//             >
//               {item.wing}
//             </Text>
//           </View>
//         ) : null}

//         {item.district ? (
//           <View style={styles.detailRow}>
//             <Ionicons name="location-outline" size={isTablet ? 15 : 13} color="#93210A" />
//             <Text
//               style={[styles.detailText, { fontSize: sizes.subTextSize }]}
//               numberOfLines={1}
//             >
//               {item.district}
              
//             </Text>
//           </View>
//         ) : null}

//         {item.contactDetails ? (
//           <TouchableOpacity
//             style={styles.callRow}
//             onPress={() => Linking.openURL(`tel:${item.contactDetails}`)}
//             activeOpacity={0.7}
//           >
//             <Ionicons name="call" size={isTablet ? 14 : 12} color="#fff" />
//             <Text style={[styles.callText, { fontSize: sizes.subTextSize }]}>
//               {item.contactDetails}
              
//             </Text>
//           </TouchableOpacity>
//         ) : null}
//       </View>
//     </View>
//   );
// };

// // ─────────────────────────────────────────────
// // Section Header
// // Defined OUTSIDE main component — stable reference
// // ─────────────────────────────────────────────
// const SectionHeader = ({ title, responsive }) => (
//   <View style={styles.sectionHeader}>
//     <View style={styles.sectionAccent} />
//     <Text style={[styles.sectionTitle, { fontSize: responsive.sizes.sectionTitleSize }]}>
//       {title}
//     </Text>
//   </View>
// );

// // ─────────────────────────────────────────────
// // Main Screen
// // ─────────────────────────────────────────────
// export default function Membership() {
//   const navigation  = useNavigation();
//   const route       = useRoute();
//   const responsive  = useResponsive();
//   const { districtName } = route.params || {};

//   const [members,     setMembers]     = useState([]);
//   const [loading,     setLoading]     = useState(true);
//   const [searchQuery, setSearch]      = useState("");
//   const [sortOrder,   setSortOrder]   = useState("orderNo_asc");
//   const [filterType,  setFilter]      = useState("all");
//   const [showFilter,  setShowFilter]  = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getMembers();
//         setMembers(data);
//       } catch (e) {
//         console.error("Error fetching members:", e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // ── Processed list ──
//   const processedMembers = useMemo(() => {
//     let list = [...members];

//     // 1. Search
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       list = list.filter(
//         (m) =>
//           m.name?.toLowerCase().includes(q) ||
//           m.designation?.toLowerCase().includes(q) ||
//           m.wing?.toLowerCase().includes(q) ||
//           m.district?.toLowerCase().includes(q) ||
//           m.categoryType?.toLowerCase().includes(q)
//       );
//     }

//     // 2. Filter by category
//     if (filterType !== "all")
//       list = list.filter((m) => resolveCategory(m.categoryType) === filterType);

//     // 3. Sort
//     list.sort((a, b) => {
//       if (sortOrder === "orderNo_asc")  return (a.orderNo ?? 9999) - (b.orderNo ?? 9999);
//       if (sortOrder === "orderNo_desc") return (b.orderNo ?? 9999) - (a.orderNo ?? 9999);
//       if (sortOrder === "name_asc")     return (a.name || "").localeCompare(b.name || "");
//       return 0;
//     });

//     return list;
//   }, [members, searchQuery, sortOrder, filterType]);

//   // ── Sections ──
//   const sections = useMemo(() => {
//     if (filterType !== "all") {
//       const label = FILTER_OPTIONS.find((f) => f.key === filterType)?.label || "Members";
//       const rows  = buildRows(processedMembers, responsive.isTablet);
//       return rows.length > 0
//         ? [{ key: filterType, label, data: rows, totalCount: processedMembers.length }]
//         : [];
//     }
//     return CATEGORY_ORDER.reduce((acc, cat) => {
//       const filtered = processedMembers.filter(
//         (m) => resolveCategory(m.categoryType) === cat.key
//       );
//       if (filtered.length > 0)
//         acc.push({
//           ...cat,
//           data: buildRows(filtered, responsive.isTablet),
//           totalCount: filtered.length,
//         });
//       return acc;
//     }, []);
//   }, [processedMembers, filterType, responsive.isTablet]);

//   const hasActiveFilters =
//     filterType !== "all" ||
//     sortOrder !== "orderNo_asc" ||
//     searchQuery.trim().length > 0;

//   // ── stable callbacks ──
//   const handleClearSearch  = useCallback(() => setSearch(""), []);
//   const handleOpenFilter   = useCallback(() => setShowFilter(true), []);
//   const handleCloseFilter  = useCallback(() => setShowFilter(false), []);
//   const handleGoBack       = useCallback(() => navigation.goBack(), [navigation]);
//   const handleJoin         = useCallback(
//     () => navigation.navigate("Member1", { districtName }),
//     [navigation, districtName]
//   );

//   // ── Search + Filter bar ──
//   // useMemo keeps the SAME element reference between renders so
//   // TextInput never unmounts → keyboard stays open while typing
//   const listHeader = useMemo(
//     () => (
//       <View style={styles.searchBarContainer}>
//         <View style={styles.searchInputWrap}>
//           <Ionicons
//             name="search-outline"
//             size={18}
//             color="#aaa"
//             style={{ marginRight: 8 }}
//           />
//           <TextInput
//             style={[styles.searchInput, { fontSize: responsive.sizes.searchFontSize }]}
//             placeholder="Search name, designation, wing…"
//             placeholderTextColor="#bbb"
//             value={searchQuery}
//             onChangeText={setSearch}
//             returnKeyType="search"
//             clearButtonMode="while-editing"   // iOS built-in clear
//           />
//           {/* Android clear button */}
//           {searchQuery.length > 0 && Platform.OS === "android" && (
//             <TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//               <Ionicons name="close-circle" size={18} color="#bbb" />
//             </TouchableOpacity>
//           )}
//         </View>

//         <TouchableOpacity
//           style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
//           onPress={handleOpenFilter}
//           activeOpacity={0.8}
//         >
//           <Ionicons
//             name="options-outline"
//             size={20}
//             color={hasActiveFilters ? "#fff" : "#93210A"}
//           />
//           {hasActiveFilters && <View style={styles.filterActiveDot} />}
//         </TouchableOpacity>
//       </View>
//     ),
//     // Re-create only when these values actually change
//     [searchQuery, hasActiveFilters, responsive.sizes.searchFontSize, handleClearSearch, handleOpenFilter]
//   );

//   // ── Render helpers (stable, not components defined inside JSX) ──
//   const renderSectionHeader = useCallback(
//     ({ section }) => <SectionHeader title={section.label} responsive={responsive} />,
//     [responsive]
//   );

//   const renderItem = useCallback(
//     ({ item: row }) => (
//       <View style={styles.rowWrap}>
//         {row.items.map((member) => (
//           <View
//             key={member.id}
//             style={{
//               flex:        responsive.isTablet ? 1 : undefined,
//               width:       responsive.isTablet ? undefined : "100%",
//               marginRight: responsive.isTablet && row.items.length > 1 ? responsive.cardGap : 0,
//             }}
//           >
//             <MemberCard item={member} responsive={responsive} />
//           </View>
//         ))}
//         {/* fill empty slot on tablet if odd count */}
//         {responsive.isTablet && row.items.length === 1 && <View style={{ flex: 1 }} />}
//       </View>
//     ),
//     [responsive]
//   );

//   const listEmpty = useMemo(
//     () => (
//       <View style={styles.emptyContainer}>
//         <Ionicons name="search-outline" size={64} color="#ddd" />
//         <Text style={styles.emptyText}>No members found</Text>
//         {searchQuery.length > 0 && (
//           <TouchableOpacity style={styles.clearSearchBtn} onPress={handleClearSearch}>
//             <Text style={styles.clearSearchText}>Clear Search</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     ),
//     [searchQuery, handleClearSearch]
//   );

//   // ─────────────────────────────────────────
//   // Loading state
//   // ─────────────────────────────────────────
//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <StatusBar backgroundColor="#93210A" barStyle="light-content" />
//         {/* Static header — fine to render inline here */}
//         <View
//           style={[
//             styles.header,
//             {
//               paddingTop:        responsive.sizes.headerTopPadding,
//               paddingBottom:     responsive.isTablet ? 22 : 18,
//               paddingHorizontal: responsive.containerPadding,
//             },
//           ]}
//         >
//           <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
//             <Ionicons name="chevron-back" size={responsive.sizes.headerIconSize} color="#fff" />
//           </TouchableOpacity>
//           <View style={styles.headerCenter}>
//             <Text style={[styles.headerText, { fontSize: responsive.sizes.headerTitleSize }]}>
//               HDRSS Leaders
//             </Text>
//           </View>
//           <View style={{ width: responsive.sizes.headerIconSize + 16 }} />
//         </View>
//         <Loader />
//       </SafeAreaView>
//     );
//   }

//   // ─────────────────────────────────────────
//   // Main render
//   // ─────────────────────────────────────────
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#93210A" barStyle="light-content" />

//       {/* ── Header — rendered directly (not as a sub-component) ── */}
//       <View
//         style={[
//           styles.header,
//           {
//             paddingTop:        responsive.sizes.headerTopPadding,
//             paddingBottom:     responsive.isTablet ? 22 : 18,
//             paddingHorizontal: responsive.containerPadding,
//           },
//         ]}
//       >
//         <TouchableOpacity
//           onPress={handleGoBack}
//           style={styles.backButton}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         >
//           <Ionicons name="chevron-back" size={responsive.sizes.headerIconSize} color="#fff" />
//         </TouchableOpacity>
//         <View style={styles.headerCenter}>
//           <Text style={[styles.headerText, { fontSize: responsive.sizes.headerTitleSize }]}>
//             HDRSS Leaders
//           </Text>
//         </View>
//         <View style={{ width: responsive.sizes.headerIconSize + 16 }} />
//       </View>

//       {/* ── List ── */}
//       <SectionList
//         sections={sections}
//         keyExtractor={(row) => row.id}
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={listHeader}        // ✅ memoized element, NOT <ListHeader />
//         contentContainerStyle={[
//           styles.listContent,
//           {
//             paddingHorizontal: responsive.containerPadding,
//             paddingBottom: 110,
//           },
//         ]}
//         renderSectionHeader={renderSectionHeader}
//         renderItem={renderItem}
//         ListEmptyComponent={listEmpty}
//         stickySectionHeadersEnabled={false}
//       />

//       {/* ── Join Button ── */}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[
//             styles.joinButton,
//             {
//               width:         responsive.sizes.joinWidth,
//               paddingVertical: responsive.sizes.joinPadding,
//             },
//           ]}
//           onPress={handleJoin}
//           activeOpacity={0.85}
//         >
//           <Ionicons
//             name="person-add-outline"
//             size={responsive.sizes.joinFontSize}
//             color="#fff"
//             style={{ marginRight: 8 }}
//           />
//           <Text style={[styles.joinButtonText, { fontSize: responsive.sizes.joinFontSize }]}>
//             Join With Us
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* ── Filter Modal ── */}
//       <FilterModal
//         visible={showFilter}
//         onClose={handleCloseFilter}
//         sortOrder={sortOrder}
//         setSortOrder={setSortOrder}
//         filterType={filterType}
//         setFilterType={setFilter}
//         containerPadding={responsive.containerPadding}
//       />
//     </SafeAreaView>
//   );
// }

// // ─────────────────────────────────────────────
// // Styles
// // ─────────────────────────────────────────────
// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#f2f4f7" },

//   // ── Header ──
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#93210A",
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   backButton: {
//     padding: 8,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     borderRadius: 22,
//     width: 40,
//     height: 40,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerCenter: { flex: 1, alignItems: "center" },
//   headerText: { color: "#fff", fontWeight: "800", letterSpacing: 0.5 },
//   // ── Search Bar ──
//   searchBarContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 16,
//     marginBottom: 4,
//     gap: 10,
//   },
//   searchInputWrap: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     height: 46,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.07,
//     shadowRadius: 3,
//   },
//   searchInput: { flex: 1, color: "#222", paddingVertical: 0 },
//   filterBtn: {
//     width: 46,
//     height: 46,
//     borderRadius: 14,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.07,
//     shadowRadius: 3,
//   },
//   filterBtnActive: { backgroundColor: "#93210A" },
//   filterActiveDot: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//     backgroundColor: "#FFD700",
//     borderWidth: 1,
//     borderColor: "#93210A",
//   },

//   // ── List ──
//   listContent: { paddingTop: 4 },
//   rowWrap: { flexDirection: "row", alignItems: "flex-start" },

//   // ── Section Header ──
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   sectionAccent: {
//     width: 4,
//     height: 22,
//     borderRadius: 2,
//     backgroundColor: "#93210A",
//     marginRight: 10,
//   },
//   sectionTitle: { fontWeight: "700", color: "#1a1a1a", flex: 1, letterSpacing: 0.2 },

//   // ── Card ──
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     overflow: "hidden",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 5,
//   },
//   imageSection: { position: "relative", backgroundColor: "#f0e4e2" },
//   cardImage: { width: "100%", aspectRatio: 0.85 },
//   activeBadge: {
//     position: "absolute",
//     bottom: 6,
//     left: 6,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.55)",
//     borderRadius: 10,
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     gap: 3,
//   },
//   activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#4CAF50" },
//   activeText: { color: "#fff", fontSize: 10, fontWeight: "600" },
//   detailSection: { padding: 12, justifyContent: "center" },
//   memberName: { fontWeight: "700", color: "#111", marginBottom: 6, lineHeight: 20 },
//   detailRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
//   detailText: { color: "#555", flex: 1 },
//   callRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     backgroundColor: "#93210A",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     alignSelf: "flex-start",
//     marginTop: 6,
//   },
//   callText: { color: "#fff", fontWeight: "600" },

//   // ── Footer ──
//   footer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     alignItems: "center",
//     paddingVertical: 14,
//     backgroundColor: "rgba(255,255,255,0.97)",
//     borderTopWidth: 1,
//     borderTopColor: "rgba(0,0,0,0.08)",
//     elevation: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   joinButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#93210A",
//     borderRadius: 28,
//     elevation: 5,
//     shadowColor: "#93210A",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.35,
//     shadowRadius: 6,
//   },
//   joinButtonText: { color: "#fff", fontWeight: "700", letterSpacing: 0.3 },

//   // ── Empty ──
//   emptyContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 80,
//   },
//   emptyText: { color: "#aaa", fontSize: 16, fontWeight: "600", marginTop: 14 },
//   clearSearchBtn: {
//     marginTop: 12,
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     backgroundColor: "#93210A",
//     borderRadius: 20,
//   },
//   clearSearchText: { color: "#fff", fontWeight: "600", fontSize: 14 },

//   // ── Modal ──
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "flex-end",
//   },
//   modalSheet: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     paddingTop: 16,
//     paddingBottom: Platform.OS === "ios" ? 36 : 24,
//   },
//   modalHandle: {
//     width: 40,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: "#ddd",
//     alignSelf: "center",
//     marginBottom: 18,
//   },
//   modalSectionLabel: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#93210A",
//     textTransform: "uppercase",
//     letterSpacing: 0.8,
//     marginBottom: 10,
//   },
//   optionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 13,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     marginBottom: 6,
//     backgroundColor: "#f8f8f8",
//     gap: 12,
//   },
//   optionRowActive: {
//     backgroundColor: "rgba(147,33,10,0.08)",
//     borderWidth: 1,
//     borderColor: "rgba(147,33,10,0.2)",
//   },
//   optionLabel: { flex: 1, fontSize: 15, color: "#444", fontWeight: "500" },
//   optionLabelActive: { color: "#93210A", fontWeight: "700" },
//   filterChipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 6 },
//   filterChip: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: "#f0f0f0",
//     borderWidth: 1,
//     borderColor: "transparent",
//   },
//   filterChipActive: {
//     backgroundColor: "rgba(147,33,10,0.1)",
//     borderColor: "#93210A",
//   },
//   filterChipText: { fontSize: 13, color: "#555", fontWeight: "500" },
//   filterChipTextActive: { color: "#93210A", fontWeight: "700" },
//   doneButton: {
//     marginTop: 20,
//     backgroundColor: "#93210A",
//     borderRadius: 14,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   doneButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
// });


import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SectionList,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  StatusBar,
  Linking,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMembers } from "../../api/api";
import Loader from "../../components/Alert/Loader";

// ─────────────────────────────────────────────
// District Codes Map
// ─────────────────────────────────────────────
const districtCodes = {
  Chennai: "TN03",
  Coimbatore: "TN04",
  Cuddalore: "TN05",
  Dharmapuri: "TN06",
  Dindigul: "TN07",
  Erode: "TN08",
  Kanchipuram: "TN10",
  Kanyakumari: "TN11",
  Karur: "TN12",
  Krishnagiri: "TN13",
  Madurai: "TN14",
  Nagapattinam: "TN16",
  Namakkal: "TN17",
  Perambalur: "TN18",
  Pudukkottai: "TN19",
  Ramanathapuram: "TN20",
  Salem: "TN22",
  Sivagangai: "TN23",
  Tenkasi: "TN26",
  Thanjavur: "TN24",
  Theni: "TN27",
  Thoothukudi: "TN31",
  Tiruchirappalli: "TN32",
  Tirunelveli: "TN33",
  Tiruppur: "TN35",
  Tiruvallur: "TN28",
  Tiruvannamalai: "TN29",
  Tiruvarur: "TN30",
  Vellore: "TN36",
  Viluppuram: "TN37",
  Virudhunagar: "TN38",
  Ariyalur: "TN01",
  Kallakurichi: "TN09",
  Ranipet: "TN21",
  Tirupathur: "TN34",
  Chengalpattu: "TN02",
  Karaikkal: "TN25",
  Mayiladuthurai: "TN15",
};

// Reverse map: "TN03" → "Chennai"
const codeToDistrict = Object.fromEntries(
  Object.entries(districtCodes).map(([name, code]) => [code, name])
);

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const INITIAL_VISIBLE = 5;

const CATEGORY_ORDER = [
  { key: "state_leader", label: "State Leaders" },
  { key: "district_leader", label: "District Leaders" },
  { key: "other", label: "Other Members" },
];

const FILTER_OPTIONS = [
  { key: "all", label: "All Members" },
  { key: "state_leader", label: "State Leaders" },
  { key: "district_leader", label: "District Leaders" },
  { key: "other", label: "Other Members" },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const resolveCategory = (categoryType = "") => {
  const val = categoryType.toLowerCase().replace(/\s+/g, "_");
  if (val.includes("state")) return "state_leader";
  if (val.includes("district")) return "district_leader";
  return "other";
};

/**
 * Extracts the first 4 chars of uniqueId (e.g. "TN03") to get district name.
 * Returns null if not found.
 */
const getDistrictFromUniqueId = (uniqueId = "") => {
  const code = uniqueId?.toString().substring(0, 4).toUpperCase();
  return codeToDistrict[code] || null;
};

/**
 * Check if a member is a "town leader" based on designation keyword.
 */
const isTownLeader = (designation = "") =>
  designation.toLowerCase().includes("town");

function buildRows(list, isTablet) {
  if (!isTablet) return list.map((m) => ({ id: `row_${m.id}`, items: [m] }));
  const rows = [];
  for (let i = 0; i < list.length; i += 2)
    rows.push({ id: `row_${list[i].id}`, items: list.slice(i, i + 2) });
  return rows;
}

// ─────────────────────────────────────────────
// Responsive Hook
// ─────────────────────────────────────────────
const useResponsive = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  return {
    isTablet,
    width,
    containerPadding: isTablet ? 20 : 14,
    cardGap: isTablet ? 14 : 10,
    imageFlex: 0.38,
    detailFlex: 0.54,
    sizes: {
      headerTitleSize: isTablet ? 26 : 20,
      headerIconSize: isTablet ? 30 : 24,
      headerTopPadding:
        Platform.OS === "ios"
          ? isTablet
            ? 56
            : 48
          : isTablet
          ? 44
          : 36,
      sectionTitleSize: isTablet ? 20 : 16,
      nameSize: isTablet ? 18 : 15,
      subTextSize: isTablet ? 15 : 13,
      joinFontSize: isTablet ? 19 : 15,
      joinPadding: isTablet ? 16 : 12,
      joinWidth: isTablet ? 260 : 200,
      searchFontSize: isTablet ? 16 : 14,
    },
  };
};

// ─────────────────────────────────────────────
// Filter Modal
// ─────────────────────────────────────────────
const FilterModal = ({
  visible,
  onClose,
  filterType,
  setFilterType,
  containerPadding,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Pressable
        style={[styles.modalSheet, { paddingHorizontal: containerPadding + 4 }]}
        onPress={() => {}}
      >
        <View style={styles.modalHandle} />
        <Text style={[styles.modalSectionLabel, { marginTop: 20 }]}>
          Category
        </Text>
        <View style={styles.filterChipsWrap}>
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.filterChip,
                filterType === opt.key && styles.filterChipActive,
              ]}
              onPress={() => setFilterType(opt.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterType === opt.key && styles.filterChipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.doneButton} onPress={onClose}>
          <Text style={styles.doneButtonText}>Apply</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
);

// ─────────────────────────────────────────────
// Member Card
// ─────────────────────────────────────────────
const MemberCard = ({ item, responsive, isTown = false }) => {
  const { sizes, isTablet, imageFlex, detailFlex, cardGap } = responsive;

  return (
    <View
      style={[
        styles.card,
        { marginBottom: cardGap },
        isTown && styles.townCard,
      ]}
    >
      {isTown && (
        <View style={styles.townIndicator}>
          <Ionicons name="home" size={10} color="#fff" />
        </View>
      )}

      {/* Image */}
      <View style={[styles.imageSection, { flex: imageFlex }]}>
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/150" }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {item.isActive && (
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active</Text>
          </View>
        )}
      </View>

      {/* Details */}
      <View style={[styles.detailSection, { flex: detailFlex }]}>
        <Text
          style={[styles.memberName, { fontSize: sizes.nameSize }]}
          numberOfLines={2}
        >
          {item.name || "—"}
        </Text>

        {item.designation ? (
          <View style={styles.detailRow}>
            <Ionicons
              name="briefcase-outline"
              size={isTablet ? 15 : 13}
              color="#93210A"
            />
            <Text
              style={[styles.detailText, { fontSize: sizes.subTextSize }]}
              numberOfLines={1}
            >
              {item.designation}
            </Text>
          </View>
        ) : null}

        {item.wing ? (
          <View style={styles.detailRow}>
            <Ionicons
              name="flag-outline"
              size={isTablet ? 15 : 13}
              color="#93210A"
            />
            <Text
              style={[styles.detailText, { fontSize: sizes.subTextSize }]}
              numberOfLines={1}
            >
              {item.wing}
            </Text>
          </View>
        ) : null}

        {item.district ? (
          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={isTablet ? 15 : 13}
              color="#93210A"
            />
            <Text
              style={[styles.detailText, { fontSize: sizes.subTextSize }]}
              numberOfLines={1}
            >
              {item.district}
            </Text>
          </View>
        ) : null}

        {item.contactDetails ? (
          <TouchableOpacity
            style={styles.callRow}
            onPress={() => Linking.openURL(`tel:${item.contactDetails}`)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="call"
              size={isTablet ? 14 : 12}
              color="#fff"
            />
            <Text
              style={[styles.callText, { fontSize: sizes.subTextSize }]}
            >
              {item.contactDetails}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────
// District Section Block
// Handles district leaders + nested town leaders
// with "See All" toggle
// ─────────────────────────────────────────────
const DistrictBlock = ({ districtName, members, responsive }) => {
  const [expanded, setExpanded] = useState(false);
  

  // Sort: district leaders (non-town) first by orderNo, town leaders last by orderNo
  const districtLeaders = members
    .filter((m) => !isTownLeader(m.designation || ""))
    .sort((a, b) => (a.orderNo ?? 9999) - (b.orderNo ?? 9999));

  const townLeaders = members
    .filter((m) => isTownLeader(m.designation || ""))
    .sort((a, b) => (a.orderNo ?? 9999) - (b.orderNo ?? 9999));

  const visibleDistrict = expanded
    ? districtLeaders
    : districtLeaders.slice(0, INITIAL_VISIBLE);

  const hasMore = districtLeaders.length > INITIAL_VISIBLE;

  return (
    <View style={styles.districtBlock}>
      {/* District Name Header */}
      <View style={styles.districtHeader}>
        <View style={styles.districtIconWrap}>
          <Ionicons name="business-outline" size={14} color="#93210A" />
        </View>
        <Text
          style={[
            styles.districtName,
            { fontSize: responsive.sizes.sectionTitleSize - 2 },
          ]}
        >
          {districtName}
        </Text>
        <View style={styles.districtBadge}>
          <Text style={styles.districtBadgeText}>{members.length}</Text>
        </View>
      </View>

      {/* District Leaders */}
      {visibleDistrict.map((member) => (
        <MemberCard key={member.id} item={member} responsive={responsive} />
      ))}

      {/* See All / Show Less */}
      {hasMore && (
        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={() => setExpanded((prev) => !prev)}
          activeOpacity={0.75}
        >
          <Text style={styles.seeAllText}>
            {expanded
              ? "Show Less"
              : `See All ${districtLeaders.length} Leaders`}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={14}
            color="#93210A"
          />
        </TouchableOpacity>
      )}

      {/* Town Leaders (nested, always shown after district leaders) */}
      {townLeaders.length > 0 && (
        <View style={styles.townSection}>
          <View style={styles.townSectionHeader}>
            <Ionicons name="home-outline" size={13} color="#555" />
            <Text style={styles.townSectionLabel}>
              Town Leaders ({townLeaders.length})
            </Text>
          </View>
          <View style={styles.townLeadersList}>
            {townLeaders.map((member) => (
              <MemberCard
                key={member.id}
                item={member}
                responsive={responsive}
                isTown
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────
// Section Header
// ─────────────────────────────────────────────
const SectionHeader = ({ title, responsive }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionAccent} />
    <Text
      style={[
        styles.sectionTitle,
        { fontSize: responsive.sizes.sectionTitleSize },
      ]}
    >
      {title}
    </Text>
  </View>
);

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
export default function Membership() {
  const navigation = useNavigation();
  const route = useRoute();
  const responsive = useResponsive();
  const { districtName: routeDistrictName } = route.params || {};
  const { districtId , districtName} = route.params || {};
  console.log(districtId, districtName);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearch] = useState("");
  const [filterType, setFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [stateLeadersExpanded, setStateLeadersExpanded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMembers();
        const filterdata = districtName ? data.filter((item)=>item.district === districtName ) : data;
        setMembers(filterdata);
      } catch (e) {
        console.error("Error fetching members:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Processed list ──
  const processedMembers = useMemo(() => {
    let list = [...members];

    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.designation?.toLowerCase().includes(q) ||
          m.wing?.toLowerCase().includes(q) ||
          m.district?.toLowerCase().includes(q) ||
          m.categoryType?.toLowerCase().includes(q)
      );
    }

    if (filterType !== "all")
      list = list.filter(
        (m) => resolveCategory(m.categoryType) === filterType
      );

    list.sort(
      (a, b) => (a.orderNo ?? 9999) - (b.orderNo ?? 9999)
    );

    return list;
  }, [members, searchQuery, filterType]);

  // ── Build sections ──
  // For district_leader category → group by district (from uniqueId)
  // For others → standard category grouping
  const sections = useMemo(() => {
    const result = [];

    // ── State Leaders ──
    if (filterType === "all" || filterType === "state_leader") {
      const stateLeaders = processedMembers.filter(
        (m) => resolveCategory(m.categoryType) === "state_leader"
      );
      if (stateLeaders.length > 0) {
        const visibleStateLeaders = stateLeadersExpanded
      ? stateLeaders
      : stateLeaders.slice(0, 10);
        result.push({
          key: "state_leaders",
          label: "State Leaders",
          type: "standard",
          data: [{ id: "state_leaders_block", items: visibleStateLeaders,totalCount: stateLeaders.length,  hasMore: stateLeaders.length > 10, }],
        });
      }
    }

    // ── District Leaders (grouped by district via uniqueId) ──
    if (filterType === "all" || filterType === "district_leader") {
      const districtMembers = processedMembers.filter(
        (m) => resolveCategory(m.categoryType) === "district_leader"
      );

      if (districtMembers.length > 0) {
        // Group by district code from uniqueId
        const districtMap = {};
        const unknownDistrict = [];

        districtMembers.forEach((m) => {
          const dName = getDistrictFromUniqueId(m.uniqueId);
          if (dName) {
            if (!districtMap[dName]) districtMap[dName] = [];
            districtMap[dName].push(m);
          } else {
            unknownDistrict.push(m);
          }
        });

        // Sort districts alphabetically
        const sortedDistricts = Object.keys(districtMap).sort();

        // Build one row per district block
        const districtRows = sortedDistricts.map((dName) => ({
          id: `district_${dName}`,
          districtName: dName,
          members: districtMap[dName],
        }));

        if (unknownDistrict.length > 0) {
          districtRows.push({
            id: "district_unknown",
            districtName: "Other Districts",
            members: unknownDistrict,
          });
        }

        if (districtRows.length > 0) {
          result.push({
            key: "district_leaders",
            label: "District Leaders",
            type: "district",
            data: districtRows,
          });
        }
      }
    }

    // ── Other Members ──
    if (filterType === "all" || filterType === "other") {
      const others = processedMembers.filter(
        (m) => resolveCategory(m.categoryType) === "other"
      );
      if (others.length > 0) {
        result.push({
          key: "other_members",
          label: "Other Members",
          type: "standard",
          data: [{ id: "other_members_block", items: others }],
        });
      }
    }

    return result;
  }, [processedMembers, filterType]);

  const hasActiveFilters =
    filterType !== "all" || searchQuery.trim().length > 0;

  const handleClearSearch = useCallback(() => setSearch(""), []);
  const handleOpenFilter = useCallback(() => setShowFilter(true), []);
  const handleCloseFilter = useCallback(() => setShowFilter(false), []);
  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleJoin = useCallback(
    () => navigation.navigate("Member1", { districtName: routeDistrictName }),
    [navigation, routeDistrictName]
  );

  // ── List Header ──
  const listHeader = useMemo(
    () => (
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputWrap}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#aaa"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={[
              styles.searchInput,
              { fontSize: responsive.sizes.searchFontSize },
            ]}
            placeholder="Search name, designation, wing…"
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && Platform.OS === "android" && (
            <TouchableOpacity
              onPress={handleClearSearch}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color="#bbb" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            hasActiveFilters && styles.filterBtnActive,
          ]}
          onPress={handleOpenFilter}
          activeOpacity={0.8}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={hasActiveFilters ? "#fff" : "#93210A"}
          />
          {hasActiveFilters && <View style={styles.filterActiveDot} />}
        </TouchableOpacity>
      </View>
    ),
    [
      searchQuery,
      hasActiveFilters,
      responsive.sizes.searchFontSize,
      handleClearSearch,
      handleOpenFilter,
    ]
  );

  // ── Render Section Header ──
  const renderSectionHeader = useCallback(
    ({ section }) => (
      <SectionHeader title={section.label} responsive={responsive} />
    ),
    [responsive]
  );

  // ── Render Item ──
  // Each row is either a "district block" or a "standard members block"
  const renderItem = useCallback(
    ({ item: row, section }) => {
      if (section.type === "district") {
        // District block with grouped leaders + town leaders
        return (
          <DistrictBlock
            key={row.id}
            districtName={row.districtName}
            members={row.members}
            responsive={responsive}
          />
        );
      }

      // Standard block: render all members as cards
      return (
        <View>
          {row.items.map((member) => (
            <MemberCard
              key={member.id}
              item={member}
              responsive={responsive}
            />
          ))}
          {row.hasMore || (stateLeadersExpanded && row.totalCount > 10) ? (
      <TouchableOpacity
        style={styles.seeAllBtn}
        onPress={() => setStateLeadersExpanded((prev) => !prev)}
        activeOpacity={0.75}
      >
        <Text style={styles.seeAllText}>
          {stateLeadersExpanded
            ? "Show Less"
            : `See All ${row.totalCount} Leaders`}
        </Text>
        <Ionicons
          name={stateLeadersExpanded ? "chevron-up" : "chevron-down"}
          size={14}
          color="#93210A"
        />
      </TouchableOpacity>
    ) : null}

        </View>
      );
    },
    [responsive,stateLeadersExpanded, setStateLeadersExpanded]
  );

  const listEmpty = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color="#ddd" />
        <Text style={styles.emptyText}>No members found</Text>
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearSearchBtn}
            onPress={handleClearSearch}
          >
            <Text style={styles.clearSearchText}>Clear Search</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [searchQuery, handleClearSearch]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#93210A" barStyle="light-content" />
        <View
          style={[
            styles.header,
            {
              paddingTop: responsive.sizes.headerTopPadding,
              paddingBottom: responsive.isTablet ? 22 : 18,
              paddingHorizontal: responsive.containerPadding,
            },
          ]}
        >
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={responsive.sizes.headerIconSize}
              color="#fff"
            />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text
              style={[
                styles.headerText,
                { fontSize: responsive.sizes.headerTitleSize },
              ]}
            >
              HDRSS Leaders
            </Text>
          </View>
          <View style={{ width: responsive.sizes.headerIconSize + 16 }} />
        </View>
        <Loader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: responsive.sizes.headerTopPadding,
            paddingBottom: responsive.isTablet ? 22 : 18,
            paddingHorizontal: responsive.containerPadding,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="chevron-back"
            size={responsive.sizes.headerIconSize}
            color="#fff"
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerText,
              { fontSize: responsive.sizes.headerTitleSize },
            ]}
          >
            HDRSS Leaders
          </Text>
        </View>
        <View style={{ width: responsive.sizes.headerIconSize + 16 }} />
      </View>

      {/* List */}
      <SectionList
        sections={sections}
        keyExtractor={(row) => row.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={listHeader}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: responsive.containerPadding,
            paddingBottom: 110,
          },
        ]}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ListEmptyComponent={listEmpty}
        stickySectionHeadersEnabled={false}
      />

      {/* Footer Join Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.joinButton,
            {
              width: responsive.sizes.joinWidth,
              paddingVertical: responsive.sizes.joinPadding,
            },
          ]}
          onPress={handleJoin}
          activeOpacity={0.85}
        >
          <Ionicons
            name="person-add-outline"
            size={responsive.sizes.joinFontSize}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              styles.joinButtonText,
              { fontSize: responsive.sizes.joinFontSize },
            ]}
          >
            Join With Us
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilter}
        onClose={handleCloseFilter}
        filterType={filterType}
        setFilterType={setFilter}
        containerPadding={responsive.containerPadding}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f2f4f7" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#93210A",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 22,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerText: { color: "#fff", fontWeight: "800", letterSpacing: 0.5 },

  // Search Bar
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 4,
    gap: 10,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  searchInput: { flex: 1, color: "#222", paddingVertical: 0 },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  filterBtnActive: { backgroundColor: "#93210A" },
  filterActiveDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FFD700",
    borderWidth: 1,
    borderColor: "#93210A",
  },

  // List
  listContent: { paddingTop: 4 },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionAccent: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: "#93210A",
    marginRight: 10,
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    letterSpacing: 0.2,
  },

  // District Block
  districtBlock: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  districtHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0ece8",
    gap: 8,
  },
  districtIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#fdf1ee",
    alignItems: "center",
    justifyContent: "center",
  },
  districtName: {
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    letterSpacing: 0.2,
  },
  districtBadge: {
    backgroundColor: "#93210A",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  districtBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  // See All Button
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: "#fdf1ee",
    borderWidth: 1,
    borderColor: "rgba(147,33,10,0.15)",
  },
  seeAllText: {
    color: "#93210A",
    fontSize: 13,
    fontWeight: "700",
  },

  // Town Leaders
  townSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0ece8",
    paddingTop: 10,
  },

  townSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  townSectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  townLeadersList: {
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#e8e8e8",
  },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    marginBottom: 8,
  },
  townCard: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#f0ece8",
    elevation: 1,
  },
  townIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#93210A",
    borderBottomLeftRadius: 8,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  imageSection: { position: "relative", backgroundColor: "#f0e4e2" },
  cardImage: { width: "100%", aspectRatio: 0.85 },
  activeBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#4CAF50" },
  activeText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  detailSection: { padding: 12, justifyContent: "center" },
  memberName: { fontWeight: "700", color: "#111", marginBottom: 6, lineHeight: 20 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  detailText: { color: "#555", flex: 1 },
  callRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#93210A",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  callText: { color: "#fff", fontWeight: "600" },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#93210A",
    borderRadius: 28,
    elevation: 5,
    shadowColor: "#93210A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  joinButtonText: { color: "#fff", fontWeight: "700", letterSpacing: 0.3 },

  // Empty
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: { color: "#aaa", fontSize: 16, fontWeight: "600", marginTop: 14 },
  clearSearchBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#93210A",
    borderRadius: 20,
  },
  clearSearchText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: 18,
  },
  modalSectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#93210A",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  filterChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterChipActive: {
    backgroundColor: "rgba(147,33,10,0.1)",
    borderColor: "#93210A",
  },
  filterChipText: { fontSize: 13, color: "#555", fontWeight: "500" },
  filterChipTextActive: { color: "#93210A", fontWeight: "700" },
  doneButton: {
    marginTop: 20,
    backgroundColor: "#93210A",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});