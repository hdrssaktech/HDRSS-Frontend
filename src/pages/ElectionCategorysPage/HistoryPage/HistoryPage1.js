// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   useWindowDimensions,
//   SafeAreaView,
//   StatusBar,
//   Modal,
//   TextInput,
//   Dimensions,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { fetchHistoryTypes } from "../../../Controller/HistoryController/HistoryController";
// import Loader from "../../../components/Alert/Loader";

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// const ALL = "அனைத்தும்";

// export default function HistoryPage1() {
//   const navigation = useNavigation();
//   const { width } = useWindowDimensions();
//   const isTablet = width >= 600;
//   const numColumns = isTablet ? 3 : 2;

//   const [types, setTypes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState(ALL);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalSearch, setModalSearch] = useState("");

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await fetchHistoryTypes();
//         setTypes(Array.isArray(data) ? data.filter((item) => item.category === "history") : []);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   // Unique names for modal list
//   const filterOptions = [ALL, ...new Set(types.map((c) => c.name).filter(Boolean))];

//   // Modal list filtered by search
//   const modalOptions = filterOptions.filter((opt) =>
//     opt.toLowerCase().includes(modalSearch.toLowerCase())
//   );

//   // Main grid filtered by selected name
//   const filteredTypes =
//     activeFilter === ALL
//       ? types
//       : types.filter((item) => item.name === activeFilter);

//   const handleSelect = (option) => {
//     setActiveFilter(option);
//     setModalVisible(false);
//     setModalSearch("");
//   };

//   if (loading) return <Loader />;

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       activeOpacity={0.85}
//       style={[styles.card, isTablet && styles.cardTablet]}
//       onPress={() =>
//         navigation.navigate("HistoryPage2", {
//           id: item.id,
//           name: item.name,
//         })
//       }
//     >
//       <View style={styles.imageWrap}>
//         <Image source={{ uri: item.image }} style={styles.image} />
//       </View>
//       <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={2}>
//         {item.name}
//       </Text>
//       <View style={styles.arrowCircle}>
//         <Ionicons name="chevron-forward" size={16} color="#fff" />
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor="#93210A" />

//       {/* HEADER */}
//       <View style={[styles.header, isTablet && styles.headerTablet]}>
//         <TouchableOpacity
//           style={[styles.backButton, isTablet && styles.backButtonTablet]}
//           onPress={() => navigation.goBack()}
//         >
//           <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
//           History
//         </Text>
//         <View style={styles.headerSide} />
//       </View>

//       {/* FILTER TRIGGER */}
//       <View style={styles.filterTriggerWrapper}>
//         <TouchableOpacity
//           style={styles.filterTrigger}
//           onPress={() => { setModalSearch(""); setModalVisible(true); }}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="funnel-outline" size={16} color="#93210A" />
//           <Text style={styles.filterTriggerText} numberOfLines={1}>
//             {activeFilter}
//           </Text>
//           <Ionicons name="chevron-down" size={16} color="#93210A" />
//         </TouchableOpacity>

//         {activeFilter !== ALL && (
//           <TouchableOpacity
//             style={styles.clearBtn}
//             onPress={() => setActiveFilter(ALL)}
//             activeOpacity={0.8}
//           >
//             <Ionicons name="close-circle" size={18} color="#93210A" />
//             <Text style={styles.clearBtnText}>Clear</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* FILTER MODAL */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setModalVisible(false)}
//         />
//         <View style={styles.modalSheet}>

//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>வகையைத் தேர்ந்தெடுக்கவும்</Text>
//             <TouchableOpacity
//               onPress={() => setModalVisible(false)}
//               style={styles.modalCloseBtn}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="close" size={22} color="#333" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.modalSearchBar}>
//             <Ionicons name="search" size={17} color="#93210A" />
//             <TextInput
//               style={styles.modalSearchInput}
//               placeholder="தேடுக..."
//               placeholderTextColor="#aaa"
//               value={modalSearch}
//               onChangeText={setModalSearch}
//               autoCorrect={false}
//             />
//             {modalSearch.length > 0 && (
//               <TouchableOpacity onPress={() => setModalSearch("")} activeOpacity={0.7}>
//                 <Ionicons name="close-circle" size={17} color="#aaa" />
//               </TouchableOpacity>
//             )}
//           </View>

//           <FlatList
//             data={modalOptions}
//             keyExtractor={(item) => item}
//             showsVerticalScrollIndicator={false}
//             keyboardShouldPersistTaps="handled"
//             contentContainerStyle={styles.modalList}
//             renderItem={({ item }) => {
//               const selected = activeFilter === item;
//               return (
//                 <TouchableOpacity
//                   style={[styles.modalItem, selected && styles.modalItemActive]}
//                   onPress={() => handleSelect(item)}
//                   activeOpacity={0.75}
//                 >
//                   <Text style={[styles.modalItemText, selected && styles.modalItemTextActive]}>
//                     {item}
//                   </Text>
//                   {selected && (
//                     <Ionicons name="checkmark-circle" size={20} color="#93210A" />
//                   )}
//                 </TouchableOpacity>
//               );
//             }}
//             ListEmptyComponent={
//               <View style={styles.modalEmpty}>
//                 <Text style={styles.modalEmptyText}>எதுவும் கிடைக்கவில்லை</Text>
//               </View>
//             }
//           />
//         </View>
//       </Modal>

//       {/* GRID */}
//       <FlatList
//         data={filteredTypes}
//         key={numColumns}
//         numColumns={numColumns}
//         renderItem={renderItem}
//         keyExtractor={(item, idx) => String(item?.id ?? idx)}
//         contentContainerStyle={[
//           styles.listContainer,
//           filteredTypes.length === 0 && styles.emptyContent,
//         ]}
//         columnWrapperStyle={numColumns > 1 ? styles.row : null}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.center}>
//             <Ionicons name="folder-open-outline" size={56} color="#ccc" />
//             <Text style={styles.emptyText}>எதுவும் கிடைக்கவில்லை</Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#fff" },

//   /* HEADER — your original unchanged */
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#93210A",
//     paddingTop: 40,
//     paddingBottom: 30,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   headerTablet: {
//     paddingTop: 60,
//     paddingBottom: 28,
//     paddingHorizontal: 18,
//   },
//   headerSide: { width: 44, justifyContent: "center", alignItems: "flex-start" },
//   headerTitle: {
//     flex: 1, textAlign: "center", color: "#fff",
//     fontSize: 20, fontWeight: "800", letterSpacing: 0.5,
//   },
//   headerTitleTablet: { fontSize: 28 },
//   backButton: {
//     width: 40, height: 40, borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     alignItems: "center", justifyContent: "center",
//     marginLeft: 15,
//   },
//   backButtonTablet: { width: 50, height: 50, borderRadius: 25 },

//   /* FILTER TRIGGER */
//   filterTriggerWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.06)",
//     gap: 10,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//   },
//   filterTrigger: {
//     flex: 1, flexDirection: "row", alignItems: "center",
//     backgroundColor: "#FFF0EE", borderRadius: 10,
//     paddingHorizontal: 12, paddingVertical: 9,
//     borderWidth: 1.5, borderColor: "rgba(147,33,10,0.2)", gap: 8,
//   },
//   filterTriggerText: { flex: 1, fontSize: 13, fontWeight: "700", color: "#93210A" },
//   clearBtn: {
//     flexDirection: "row", alignItems: "center", gap: 4,
//     paddingHorizontal: 10, paddingVertical: 8,
//     borderRadius: 8, backgroundColor: "#FFF0EE",
//     borderWidth: 1.5, borderColor: "rgba(147,33,10,0.2)",
//   },
//   clearBtnText: { fontSize: 12, fontWeight: "700", color: "#93210A" },

//   /* MODAL */
//   modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
//   modalSheet: {
//     position: "absolute", bottom: 0, left: 0, right: 0,
//     height: SCREEN_HEIGHT * 0.65,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 24, borderTopRightRadius: 24,
//     overflow: "hidden", elevation: 20,
//     shadowColor: "#000", shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.15, shadowRadius: 12,
//   },
//   modalHeader: {
//     flexDirection: "row", alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20, paddingVertical: 16,
//     borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.07)",
//   },
//   modalTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A1A" },
//   modalCloseBtn: {
//     width: 34, height: 34, borderRadius: 17,
//     backgroundColor: "#F5F5F5",
//     alignItems: "center", justifyContent: "center",
//   },
//   modalSearchBar: {
//     flexDirection: "row", alignItems: "center",
//     backgroundColor: "#F5F5F5", borderRadius: 12,
//     marginHorizontal: 16, marginVertical: 12,
//     paddingHorizontal: 12, paddingVertical: 10,
//     gap: 8, borderWidth: 1, borderColor: "rgba(147,33,10,0.15)",
//   },
//   modalSearchInput: { flex: 1, fontSize: 14, color: "#1A1A1A", padding: 0, fontWeight: "500" },
//   modalList: { paddingHorizontal: 16, paddingBottom: 30 },
//   modalItem: {
//     flexDirection: "row", alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 14, paddingHorizontal: 12,
//     borderRadius: 10, marginBottom: 4, backgroundColor: "#fff",
//   },
//   modalItemActive: { backgroundColor: "rgba(147,33,10,0.06)" },
//   modalItemText: { fontSize: 14, color: "#333", fontWeight: "500", flex: 1 },
//   modalItemTextActive: { color: "#93210A", fontWeight: "800" },
//   modalEmpty: { alignItems: "center", paddingTop: 40 },
//   modalEmptyText: { fontSize: 14, color: "#aaa", fontWeight: "600" },

//   /* LIST — your original unchanged */
//   listContainer: { padding: 12, paddingBottom: 28 },
//   emptyContent: { flexGrow: 1 },
//   row: { justifyContent: "space-between" },

//   /* CARD — your original unchanged */
//   card: {
//     width: "48%", backgroundColor: "#fff",
//     borderRadius: 16, padding: 10, marginBottom: 14,
//     elevation: 4, shadowColor: "#000",
//     shadowOpacity: 0.08, shadowRadius: 8,
//     shadowOffset: { width: 0, height: 5 }, overflow: "hidden",
//   },
//   cardTablet: { width: "31.5%", padding: 12, borderRadius: 18 },
//   imageWrap: {
//     width: "100%", aspectRatio: 1.1,
//     borderRadius: 14, overflow: "hidden", backgroundColor: "#f3f3f3",
//   },
//   image: { width: "100%", height: "100%" },
//   title: {
//     marginTop: 10, fontSize: 12.5, fontWeight: "700",
//     color: "#111", lineHeight: 18, paddingRight: 30,
//   },
//   titleTablet: { fontSize: 16, lineHeight: 22 },
//   arrowCircle: {
//     position: "absolute", right: 10, bottom: 10,
//     width: 20, height: 20, borderRadius: 13,
//     backgroundColor: "#93210A",
//     alignItems: "center", justifyContent: "center",
//   },

//   /* EMPTY */
//   center: {
//     flex: 1, justifyContent: "center",
//     alignItems: "center", paddingTop: 80, gap: 12,
//   },
//   emptyText: { fontSize: 15, color: "#888", fontWeight: "600" },
// });




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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.82}
      style={[styles.card, { width: cardWidth, borderRadius: isTablet ? 12 : 10 }]}
      onPress={() =>
        navigation.navigate("HistoryPage2", {
          id: item.id,
          name: item.name,
        })
      }
    >
      <View style={[styles.imageContainer, { aspectRatio: 0.85 }]}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View
        style={[
          styles.cardFooter,
          {
            paddingHorizontal: isTablet ? 8 : 6,
            paddingVertical: isTablet ? 7 : 5,
            minHeight: isTablet ? 40 : 34,
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { fontSize: footerFontSize, lineHeight: footerFontSize + 4 },
          ]}
          numberOfLines={2}
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
              No history found for this filter
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
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "#1a0a00",
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  cardFooter: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
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