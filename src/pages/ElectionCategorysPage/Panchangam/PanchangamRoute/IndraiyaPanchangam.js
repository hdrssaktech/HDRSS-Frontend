// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   SafeAreaView,
//   StatusBar,
//   Platform,
//   useWindowDimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import axios from "axios";
// import Loader from "../../../../components/Alert/Loader";

// const API_URL = "https://hdrss-backend.onrender.com/api/v1/panchangam/indray-panjagam";

// const TAMIL_WEEKDAYS = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
// const TAMIL_MONTHS = ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", 
//                       "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"];

// // Helper functions
// function pad2(n) { return String(n).padStart(2, "0"); }
// function formatDDMMYYYY(d) { return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`; }
// function toISODate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
// function weekdayTamil(d) { return TAMIL_WEEKDAYS[d.getDay()] || ""; }
// function monthTamil(d) { return TAMIL_MONTHS[d.getMonth()] || ""; }
// function addDays(d, diff) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff); }

// // Extract "தை 29" from oorai.details
// function extractThaiText(details) {
//   const s = String(details || "");
//   const m = s.match(/தை\s*([0-9]{1,2})/);
//   if (m) return `தை ${m[1]}`;
//   return "";
// }

// // Extract sunrise time from karanam
// function extractSunriseTimeFromKaranam(karanam) {
//   const s = String(karanam || "");
//   const m = s.match(/(\d{1,2}[:.]\d{2}\s*(AM|PM))/i);
//   if (m) return m[1].toUpperCase().replace(":", ".");
//   const d = s.match(/(\d{1,2}\.\d{2})/);
//   if (d) return d[1];
//   return "";
// }

// // Dashed divider component
// function DashedDivider() {
//   return <View style={styles.dashedDivider} />;
// }

// // ✅ CORRECTED Rasi Kattam configurations by weekday
// const RASI_BY_DAY = {
//   4: { // Thursday
//     top: ["", "", "", "குரு"],
//     midL: "புத\nசுக்\nராகு\nசனி",
//     midR: "கேது",
//     bot: ["", "சந்", "", ""],
//     center: "1-மக-சுக்\n15-(கும்-புத)\n24-(கும்-சுக்)",
//   },
//   0: { // Sunday
//     top: ["", "", "சூரியன்", ""],
//     midL: "மக\nசுக்",
//     midR: "சனி",
//     bot: ["சந்", "", "", "குரு"],
//     center: "2-சிம்மம்\n16-தனுசு\n25-மீனம்",
//   },
//   1: { // Monday
//     top: ["சந்", "", "", ""],
//     midL: "புத\nசுக்",
//     midR: "ராகு",
//     bot: ["", "குரு", "", "கேது"],
//     center: "3-கடகம்\n17-மகரம்\n26-மேஷம்",
//   },
//   2: { // Tuesday
//     top: ["", "செவ்வாய்", "", ""],
//     midL: "சூரியன்\nபுத",
//     midR: "சனி",
//     bot: ["", "", "குரு", "சுக்"],
//     center: "4-சிம்மம்\n18-கும்பம்\n27-ரிஷபம்",
//   },
//   3: { // Wednesday
//     top: ["", "", "புதன்", ""],
//     midL: "சந்திரன்\nசுக்",
//     midR: "கேது",
//     bot: ["ராகு", "", "", "குரு"],
//     center: "5-மிதுனம்\n19-மீனம்\n28-கடகம்",
//   },
//   5: { // Friday
//     top: ["", "சுக்கிரன்", "", ""],
//     midL: "சனி\nராகு",
//     midR: "சூரியன்",
//     bot: ["", "குரு", "", "புத"],
//     center: "6-விருச்சிகம்\n20-சிம்மம்\n29-துலாம்",
//   },
//   6: { // Saturday
//     top: ["", "", "", "சனி"],
//     midL: "குரு\nபுத",
//     midR: "சுக்கிரன்",
//     bot: ["ராகு", "", "சூரியன்", ""],
//     center: "7-மகரம்\n21-கன்னி\n30-மேஷம்",
//   },
//   default: {
//     top: ["", "", "", "குரு"],
//     midL: "புத\nசுக்",
//     midR: "கேது",
//     bot: ["", "சந்", "", ""],
//     center: "1-மக-சுக்\n15-(கும்-புத)\n24-(கும்-சுக்)",
//   },
// };

// // ✅ CORRECTED Rasi Box Component - PERFECT ALIGNMENT
// function RasiBox({ text, center, isLarge }) {
//   return (
//     <View style={[
//       styles.rasiBox,
//       center && styles.rasiCenterBox,
//     ]}>
//       {!!text && (
//         <Text style={[
//           styles.rasiText,
//           isLarge && styles.rasiLargeText
//         ]}>
//           {text}
//         </Text>
//       )}
//     </View>
//   );
// }

// // Section Header Component
// function SectionHeader({ title, compact = false }) {
//   return (
//     <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
//       <Text style={[styles.sectionHeaderText, compact && styles.sectionHeaderTextCompact]}>
//         {title}
//       </Text>
//     </View>
//   );
// }

// export default function DailyPanchangamScreen({ navigation }) {
//   const { width, height } = useWindowDimensions();
//   const isTablet = width >= 600;
//   const isLandscape = width > height;

//   const [currentDate, setCurrentDate] = useState(() => new Date());
//   const [loading, setLoading] = useState(true);
//   const [byDate, setByDate] = useState(new Map());

//   // Fetch API data
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(API_URL);
//         const list = res?.data?.data || [];
//         const map = new Map();
//         list.forEach((x) => x?.date && map.set(String(x.date), x));
//         if (alive) setByDate(map);
//       } catch (e) {
//         Alert.alert("தகவல்", "சேவையகத்திலிருந்து தரவு பெற முடியவில்லை");
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();
//     return () => { alive = false; };
//   }, []);

//   const record = useMemo(() => {
//     return byDate.get(toISODate(currentDate)) || null;
//   }, [byDate, currentDate]);

//   // Header texts
//   const headerTopTitle = `${monthTamil(currentDate)} - ${weekdayTamil(currentDate)}`;
//   const dateTitle = formatDDMMYYYY(currentDate);
  
//   const headerSubTitle = useMemo(() => {
//     const det = record?.oorai?.[0]?.details;
//     if (det && String(det).trim()) {
//       return String(det).replace(/\s+/g, " ").trim();
//     }
//     return `உத்தராயணம் - விசுவாவசு - தை ${currentDate.getDate()}`;
//   }, [record, currentDate]);

//   // Tile data
//   const thaiText = useMemo(() => {
//     const det = record?.oorai?.[0]?.details || "";
//     return extractThaiText(det);
//   }, [record]);

//   const sunriseText = useMemo(() => 
//     extractSunriseTimeFromKaranam(record?.karanam), 
//   [record]);

//   // Main 5 rows
//   const rows = useMemo(() => {
//     return [
//       { id: "tithi", iconBg: "#3fc3a8", icon: "moon-outline", title: "திதி", value: record?.tithi },
//       { id: "nat", iconBg: "#f5a623", icon: "star-outline", title: "நட்சத்திரம்", value: record?.natchathiram },
//       { id: "yog", iconBg: "#ff4f9a", icon: "flower-outline", title: "யோகம்", value: record?.naamyogam },
//       { id: "kar", iconBg: "#7b74ff", icon: "search-outline", title: "கரணம்", value: record?.karanam },
//       { id: "cha", iconBg: "#1f7ae0", icon: "sparkles-outline", title: "சந்திராஷ்டமம்", value: record?.santhiraistam },
//     ].map((x) => ({ 
//       ...x, 
//       value: (x.value && String(x.value).trim()) ? String(x.value) : "-" 
//     }));
//   }, [record]);

//   // Nalla Neram
//   const nallaNeram = useMemo(() => {
//     const morning = record?.nalla_neram?.morning;
//     const evening = record?.nalla_neram?.evening;
//     const out = [];
//     if (morning) out.push(`காலை : ${morning}`);
//     if (evening) out.push(`மாலை : ${evening}`);
//     return out.length ? out.join("\n") : "நல்ல நேரம் இல்லை";
//   }, [record]);

//   // Ketta Neram
//   const kettaNeram = useMemo(() => {
//     const arr = record?.ketta_neram;
//     if (!Array.isArray(arr) || arr.length === 0) return "கெட்ட நேரம் இல்லை";
//     return arr.join("\n");
//   }, [record]);

//   // Gowri Nalla Neram
//   const gowriNallaNeram = useMemo(() => {
//     const morning = Array.isArray(record?.gowri_nalla_neram?.morning) 
//       ? record.gowri_nalla_neram.morning 
//       : [];
//     const evening = Array.isArray(record?.gowri_nalla_neram?.evening) 
//       ? record.gowri_nalla_neram.evening 
//       : [];
    
//     const out = [];
//     if (morning.length) {
//       out.push(`காலை : ${morning.join(", ")}`);
//     }
//     if (evening.length) {
//       out.push(`மாலை : ${evening.join(", ")}`);
//     }
//     return out.length ? out.join("\n") : "கௌரி நல்ல நேரம் இல்லை";
//   }, [record]);

//   // Oorai
//   const oorai = useMemo(() => {
//     const arr = record?.oorai;
//     if (!Array.isArray(arr) || arr.length === 0) return "ஓரை தகவல் இல்லை";
    
//     return arr
//       .map((x, index) => {
//         const name = (x?.name || "").trim();
//         const details = (x?.details || "").trim();
//         if (name && details) {
//           return `${index + 1}. ${name}\n   ${details}`;
//         }
//         return name || details;
//       })
//       .filter(Boolean)
//       .join("\n\n");
//   }, [record]);

//   // Rasi kattam by weekday
//   const rasi = useMemo(() => {
//     const w = currentDate.getDay();
//     return RASI_BY_DAY[w] || RASI_BY_DAY.default;
//   }, [currentDate]);

//   // Date navigation
//   const onPrevDay = () => setCurrentDate((d) => addDays(d, -1));
//   const onNextDay = () => setCurrentDate((d) => addDays(d, 1));
//   const onToday = () => setCurrentDate(new Date());

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      
//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={[
//           styles.contentContainer,
//           isTablet && styles.contentContainerTablet,
//           isLandscape && styles.contentContainerLandscape
//         ]}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* PINK HEADER CARD */}
        

//         {/* 3 COLOR TILES */}
        

//         <DashedDivider />

//         {/* 5 MAIN ROWS */}
//         <View style={[
//           styles.infoCard,
//           isTablet && styles.infoCardTablet
//         ]}>
//           {rows.map((r, idx) => (
//             <View key={r.id}>
//               <View style={[
//                 styles.infoRow,
//                 isTablet && styles.infoRowTablet
//               ]}>
//                 <View style={[
//                   styles.infoIconBox, 
//                   { backgroundColor: r.iconBg },
//                   isTablet && styles.infoIconBoxTablet
//                 ]}>
//                   <Ionicons name={r.icon} size={isTablet ? 24 : 20} color="#fff" />
//                 </View>
//                 <Text style={[
//                   styles.infoTitle,
//                   isTablet && styles.infoTitleTablet
//                 ]}>
//                   {r.title}
//                 </Text>
//                 <Text style={[
//                   styles.infoColon,
//                   isTablet && styles.infoColonTablet
//                 ]}>
//                   :
//                 </Text>
//                 <Text style={[
//                   styles.infoValue,
//                   isTablet && styles.infoValueTablet
//                 ]}>
//                   {r.value}
//                 </Text>
//               </View>
//               {idx !== rows.length - 1 && <DashedDivider />}
//             </View>
//           ))}
//         </View>

//         {/* ✅ CORRECTED RASI KATTAM - PERFECT BOX ALIGNMENT */}
//         <View style={[
//           styles.rasiCard,
//           isTablet && styles.rasiCardTablet
//         ]}>
//           <SectionHeader title="ராசி கட்டம்" />
          
//           <View style={styles.rasiContainer}>
//             {/* Top Row - 4 Boxes */}
//             <View style={styles.rasiRow}>
//               <View style={styles.rasiBoxContainer}>
//                 <RasiBox text={rasi.top[0]} />
//               </View>
//               <View style={styles.rasiBoxContainer}>
//                 <RasiBox text={rasi.top[1]} />
//               </View>
//               <View style={styles.rasiBoxContainer}>
//                 <RasiBox text={rasi.top[2]} />
//               </View>
//               <View style={styles.rasiBoxContainer}>
//                 <RasiBox text={rasi.top[3]} />
//               </View>
//             </View>

//             {/* Middle Row - 3 Boxes */}
//             <View style={styles.rasiRow}>
//               <View style={[styles.rasiBoxContainer, styles.rasiBoxContainerFlex1]}>
//                 <RasiBox text={rasi.midL} isLarge={true} />
//               </View>
//               <View style={[styles.rasiBoxContainer, styles.rasiBoxContainerFlex2]}>
//                 <RasiBox center text={rasi.center} isLarge={true} />
//               </View>
//               <View style={[styles.rasiBoxContainer, styles.rasiBoxContainerFlex1]}>
//                 <RasiBox text={rasi.midR} />
//               </View>
//             </View>

//             {/* Bottom Row - 4 Boxes */}
//             <View style={styles.rasiRow}>
//               <View style={styles.rasiBoxContainer}>
//                 <RasiBox text={rasi.bot[0]} />
//               </View>
//               <View style={styles.rasiBoxContainer}>
//                 <RasiBox text={rasi.bot[1]} />
//               </View>
//               <View style={styles.rasiBoxContainer}>
//                 <RasiBox text={rasi.bot[2]} />
//               </View>
//               <View style={styles.rasiBoxContainer}>
//                 <RasiBox text={rasi.bot[3]} />
//               </View>
//             </View>
//           </View>
//         </View>
//         {/* OORAI */}
//         <View style={[
//           styles.contentCard,
//           isTablet && styles.contentCardTablet,
//           isLandscape && styles.contentCardLandscape
//         ]}>
//           <SectionHeader title="ஓரை" compact={true} />
//           <View style={[
//             styles.centeredContainer,
//             isTablet && styles.centeredContainerTablet
//           ]}>
//             <Text style={[
//               styles.centeredText,
//               isTablet && styles.centeredTextTablet
//             ]}>
//               {oorai}
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* ==================== RESPONSIVE STYLES ==================== */
// const styles = StyleSheet.create({
//   // Container Styles
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   contentContainer: {
//     padding: 14,
//     paddingBottom: 30,
//   },
//   contentContainerTablet: {
//     padding: 24,
//     paddingBottom: 40,
//     maxWidth: 1000,
//     alignSelf: "center",
//     width: "100%",
//   },
//   contentContainerLandscape: {
//     paddingHorizontal: 30,
//   },
//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   // Header Styles
 
//   // Loading Styles
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#666",
//   },

//   // Top Pink Card
//   topCard: {
//     backgroundColor: "#ff4f9a",
//     borderRadius: 18,
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//     marginBottom: 16,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   topCardTablet: {
//     borderRadius: 24,
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     marginBottom: 24,
//   },
//   topSmallTitle: {
//     color: "#fff",
//     fontSize: 16,
//     textAlign: "center",
//     fontWeight: "900",
//     marginBottom: 10,
//   },
//   topSmallTitleTablet: {
//     fontSize: 20,
//     marginBottom: 16,
//   },
//   topRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   iconBtn: {
//     width: 45,
//     height: 45,
//     borderRadius: 24,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   iconBtnTablet: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//   },
//   topDate: {
//     color: "#fff",
//     fontSize: 35,
//     fontWeight: "900",
//     letterSpacing: 1,
//   },
//   topDateTablet: {
//     fontSize: 48,
//   },
//   topSub: {
//     color: "#ffeaf3",
//     textAlign: "center",
//     fontSize: 13,
//     fontWeight: "900",
//     marginTop: 10,
//   },
//   topSubTablet: {
//     fontSize: 18,
//     marginTop: 16,
//   },

//   // 3 Tiles
//   tilesRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   tilesRowTablet: {
//     marginBottom: 16,
//   },
//   tilesRowLandscape: {
//     marginBottom: 12,
//   },
//   tile: {
//     width: "31.5%",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOpacity: 0.12,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   tileTablet: {
//     borderRadius: 18,
//     paddingVertical: 20,
//   },
//   tileGreen: {
//     backgroundColor: "#2fb86b",
//   },
//   tilePink: {
//     backgroundColor: "#ff3b63",
//   },
//   tileBlue: {
//     backgroundColor: "#1f7ae0",
//   },
//   tileText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "900",
//     textAlign: "center",
//     lineHeight: 22,
//   },
//   tileTextTablet: {
//     fontSize: 16,
//     lineHeight: 28,
//   },

//   // Divider
//   dashedDivider: {
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//     borderStyle: "dashed",
//     marginVertical: 10,
//   },

//   // Info Card - 5 Rows
//   infoCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   infoCardTablet: {
//     borderRadius: 24,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     marginBottom: 24,
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//   },
//   infoRowTablet: {
//     paddingVertical: 16,
//   },
//   infoIconBox: {
//     width: 27,
//     height: 27,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   infoIconBoxTablet: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     marginRight: 16,
//   },
//   infoTitle: {
//     width: 110,
//     fontSize: 14,
//     fontWeight: "900",
//     color: "#222",
//   },
//   infoTitleTablet: {
//     width: 140,
//     fontSize: 18,
//   },
//   infoColon: {
//     width: 16,
//     fontSize: 18,
//     fontWeight: "900",
//     color: "#222",
//     textAlign: "center",
//   },
//   infoColonTablet: {
//     width: 20,
//     fontSize: 22,
//   },
//   infoValue: {
//     flex: 1,
//     fontSize: 14,
//     fontWeight: "900",
//     color: "#222",
//     lineHeight: 24,
//   },
//   infoValueTablet: {
//     fontSize: 18,
//     lineHeight: 28,
//   },

//   // Rasi Kattam Styles
//   rasiCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: "hidden",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   rasiCardTablet: {
//     borderRadius: 24,
//     marginBottom: 24,
//   },
//   rasiContainer: {
//     padding: 0,
//     backgroundColor: "#fffcf0",
//   },
//   rasiRow: {
//     flexDirection: "row",
//     alignItems: "stretch",
//     marginBottom: 0,
//   },
//   rasiBoxContainer: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#f3b400",
//     marginRight: -1,
//     marginBottom: -1,
//     backgroundColor: "#fffcf0",
//   },
//   rasiBoxContainerFlex1: {
//     flex: 1,
//   },
//   rasiBoxContainerFlex2: {
//     flex: 2,
//   },
//   rasiBox: {
//     flex: 1,
//     height: 85,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 6,
//     backgroundColor: "#fffcf0",
//   },
//   rasiCenterBox: {},
//   rasiText: {
//     fontSize: 12,
//     fontWeight: "900",
//     color: "#333",
//     textAlign: "center",
//     lineHeight: 20,
//   },
//   rasiLargeText: {
//     fontSize: 12,
//     lineHeight: 22,
//   },

//   // Section Header
//   sectionHeader: {
//     backgroundColor: "#19b57f",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sectionHeaderCompact: {
//     paddingVertical: 10,
//   },
//   sectionHeaderText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "900",
//     textAlign: "center",
//   },
//   sectionHeaderTextCompact: {
//     fontSize: 16,
//   },

//   // Content Cards
//   contentCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     marginBottom: 12,
//     overflow: "hidden",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   contentCardTablet: {
//     borderRadius: 24,
//     marginBottom: 20,
//   },
//   contentCardLandscape: {
//     marginBottom: 16,
//   },

//   // Centered Content Styles
//   centeredContainer: {
//     padding: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: 100,
//   },
//   centeredContainerTablet: {
//     padding: 30,
//     minHeight: 120,
//   },
//   centeredText: {
//     fontSize: 15,
//     fontWeight: "900",
//     color: "#333",
//     textAlign: "center",
//     lineHeight: 28,
//   },
//   centeredTextTablet: {
//     fontSize: 18,
//     lineHeight: 32,
//   },
// });







import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Loader from "../../../../components/Alert/Loader";

const API_URL = "https://hdrss-backend.onrender.com/api/v1/panchangam/indray-panjagam/today";

const TAMIL_WEEKDAYS = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
const TAMIL_MONTHS = ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", 
"ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"];

// Helper functions
function pad2(n) { return String(n).padStart(2, "0"); }
function formatDDMMYYYY(d) { return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`; }
function toISODate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function weekdayTamil(d) { return TAMIL_WEEKDAYS[d.getDay()] || ""; }
function monthTamil(d) { return TAMIL_MONTHS[d.getMonth()] || ""; }
function addDays(d, diff) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff); }

// Time conversion function: Convert 24-hour format to 12-hour format with AM/PM
function convertTo12HourFormat(timeString) {
  if (!timeString || timeString === "-" || timeString === "இல்லை") return timeString || "-";
  
  // Handle time ranges like "09:00:00 - 10:30:00"
  if (timeString.includes(" - ")) {
    const times = timeString.split(" - ");
    const convertedTimes = times.map(t => convertSingleTime(t.trim()));
    return convertedTimes.join(" - ");
  }
  
  // Handle single time or comma-separated times
  if (timeString.includes(", ")) {
    const times = timeString.split(", ");
    const convertedTimes = times.map(t => convertSingleTime(t.trim()));
    return convertedTimes.join(", ");
  }
  
  // Handle single time
  return convertSingleTime(timeString);
}

function convertSingleTime(timeString) {
  if (!timeString || timeString === "-") return timeString;
  
  // Match time pattern HH:MM:SS or HH:MM
  const match = timeString.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return timeString;
  
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const seconds = match[3] ? `:${match[3]}` : "";
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  
  return `${hours}:${minutes}${seconds} ${ampm}`;
}

// Special handling for duration format like "12 மணி நேரம் 30 நிமிடங்கள்"
function formatDuration(durationString) {
  if (!durationString) return "-";
  return durationString;
}

// Dashed divider component
function DashedDivider() {
  return <View style={styles.dashedDivider} />;
}

// Section Header Component
function SectionHeader({ title, compact = false }) {
  return (
    <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
      <Text style={[styles.sectionHeaderText, compact && styles.sectionHeaderTextCompact]}>
        {title}
      </Text>
    </View>
  );
}

// Info Row Component
function InfoRow({ icon, iconBg, title, value, isTablet, convertTime = true }) {
  let displayValue = value || "-";
  
  // Convert time if needed
  if (convertTime && displayValue !== "-" && displayValue !== "இல்லை") {
    displayValue = convertTo12HourFormat(displayValue);
  }
  
  return (
    <View style={[styles.infoRow, isTablet && styles.infoRowTablet]}>
      <View style={[styles.infoIconBox, { backgroundColor: iconBg }, isTablet && styles.infoIconBoxTablet]}>
        <Ionicons name={icon} size={isTablet ? 24 : 20} color="#fff" />
      </View>
      <Text style={[styles.infoTitle, isTablet && styles.infoTitleTablet]}>
        {title}
      </Text>
      <Text style={[styles.infoColon, isTablet && styles.infoColonTablet]}>
        :
      </Text>
      <Text style={[styles.infoValue, isTablet && styles.infoValueTablet]}>
        {displayValue}
      </Text>
    </View>
  );
}

export default function DailyPanchangamScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLandscape = width > height;

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [byDate, setByDate] = useState(new Map());

  // Fetch API data
// Fetch API data
useEffect(() => {
  let alive = true;
  (async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      console.log('API Response:', res.data);
      
      // Handle single object response
      const data = res?.data?.data;
      const map = new Map();
      
      if (data && data.date) {
        // Single object - add directly to map
        map.set(String(data.date), data);
      } else if (Array.isArray(data)) {
        // Array - loop through
        data.forEach((x) => x?.date && map.set(String(x.date), x));
      }
      
      if (alive) setByDate(map);
    } catch (e) {
      console.error('API Error:', e);
      Alert.alert("தகவல்", "சேவையகத்திலிருந்து தரவு பெற முடியவில்லை");
    } finally {
      if (alive) setLoading(false);
    }
  })();
  return () => { alive = false; };
}, []);

  const record = useMemo(() => {
    return byDate.get(toISODate(currentDate)) || null;
  }, [byDate, currentDate]);

  // Header texts
  const headerTopTitle = `${monthTamil(currentDate)} - ${weekdayTamil(currentDate)}`;
  const dateTitle = formatDDMMYYYY(currentDate);

  // Date navigation
  const onPrevDay = () => setCurrentDate((d) => addDays(d, -1));
  const onNextDay = () => setCurrentDate((d) => addDays(d, 1));
  const onToday = () => setCurrentDate(new Date());

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          isTablet && styles.contentContainerTablet,
          isLandscape && styles.contentContainerLandscape
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card with Date Navigation */}
        {/* <View style={[styles.topCard, isTablet && styles.topCardTablet]}>
          <Text style={[styles.topSmallTitle, isTablet && styles.topSmallTitleTablet]}>
            {headerTopTitle}
          </Text>
          
          <View style={styles.topRow}>
            <TouchableOpacity onPress={onPrevDay} style={[styles.iconBtn, isTablet && styles.iconBtnTablet]}>
              <Ionicons name="chevron-back" size={isTablet ? 32 : 24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onToday}>
              <Text style={[styles.topDate, isTablet && styles.topDateTablet]}>
                {dateTitle}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onNextDay} style={[styles.iconBtn, isTablet && styles.iconBtnTablet]}>
              <Ionicons name="chevron-forward" size={isTablet ? 32 : 24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {record?.oorai && typeof record.oorai === 'string' && (
            <Text style={[styles.topSub, isTablet && styles.topSubTablet]}>
              {record.oorai}
            </Text>
          )}
        </View> */}

        {/* Sun & Moon Info Tiles - Times converted to 12-hour format */}
        <View style={[styles.tilesRow, isTablet && styles.tilesRowTablet, isLandscape && styles.tilesRowLandscape]}>
          <View style={[styles.tile, styles.tileGreen, isTablet && styles.tileTablet]}>
            <Text style={[styles.tileText, isTablet && styles.tileTextTablet]}>
              🌅 சூரிய உதயம்{'\n'}{record?.sunrise ? convertTo12HourFormat(record.sunrise) : '-'}
            </Text>
          </View>
          <View style={[styles.tile, styles.tilePink, isTablet && styles.tileTablet]}>
            <Text style={[styles.tileText, isTablet && styles.tileTextTablet]}>
              🌇 சூரிய அஸ்தமனம்{'\n'}{record?.sunset ? convertTo12HourFormat(record.sunset) : '-'}
            </Text>
          </View>
          <View style={[styles.tile, styles.tileBlue, isTablet && styles.tileTablet]}>
            <Text style={[styles.tileText, isTablet && styles.tileTextTablet]}>
              🌙 சந்திர உதயம்{'\n'}{record?.moonrise ? convertTo12HourFormat(record.moonrise) : '-'}
            </Text>
          </View>
        </View>

        <DashedDivider />

        {/* Main Panchangam Info */}
        <View style={[styles.infoCard, isTablet && styles.infoCardTablet]}>
          <InfoRow icon="moon-outline" iconBg="#3fc3a8" title="திதி" value={record?.tithi} isTablet={isTablet} convertTime={false} />
          <DashedDivider />
          <InfoRow icon="star-outline" iconBg="#f5a623" title="திதி நேரம்" value={record?.tithi_time} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="sparkles-outline" iconBg="#7b74ff" title="நட்சத்திரம்" value={record?.natchathiram} isTablet={isTablet} convertTime={false} />
          <DashedDivider />
          <InfoRow icon="time-outline" iconBg="#ff4f9a" title="நட்சத்திர நேரம்" value={record?.natchathiram_time} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="flower-outline" iconBg="#1f7ae0" title="யோகம்" value={record?.naamyogam} isTablet={isTablet} convertTime={false} />
          <DashedDivider />
          <InfoRow icon="time-outline" iconBg="#ff6b6b" title="யோகம் நேரம்" value={record?.yogam_time} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="search-outline" iconBg="#20c997" title="கரணம்" value={record?.karanam} isTablet={isTablet} convertTime={false} />
          <DashedDivider />
          <InfoRow icon="time-outline" iconBg="#fd7e14" title="கரணம் நேரம்" value={record?.karanam_time} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="alert-circle-outline" iconBg="#dc3545" title="சந்திராஷ்டமம்" value={record?.santhiraistam} isTablet={isTablet} convertTime={false} />
        </View>

        <DashedDivider />

        {/* Timings Section - All times converted to 12-hour format */}
        <View style={[styles.infoCard, isTablet && styles.infoCardTablet]}>
          <SectionHeader title="முகூர்த்த காலங்கள்" compact={true} />
          
          <InfoRow icon="sunny-outline" iconBg="#e67e22" title="ராகு காலம்" value={record?.raagu_kaalam} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="flame-outline" iconBg="#e74c3c" title="யமகண்டம்" value={record?.yamagandam} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="hourglass-outline" iconBg="#9b59b6" title="குளிகை" value={record?.kuligai} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="star-half-outline" iconBg="#f39c12" title="அபிஜித் முகூர்த்தம்" value={record?.abhijit_muhurtham} isTablet={isTablet} convertTime={true} />
        </View>

        <DashedDivider />

        {/* Nalla Neram & Ketta Neram - Times converted to 12-hour format */}
        <View style={[styles.infoCard, isTablet && styles.infoCardTablet]}>
          <InfoRow icon="checkmark-circle-outline" iconBg="#27ae60" title="நல்ல நேரம்" value={record?.nalla_neram} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="close-circle-outline" iconBg="#c0392b" title="கெட்ட நேரம்" value={record?.ketta_neram} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="heart-outline" iconBg="#e84393" title="கௌரி நல்ல நேரம்" value={record?.gowri_nalla_neram} isTablet={isTablet} convertTime={true} />
        </View>

        <DashedDivider />

        {/* Additional Info */}
        <View style={[styles.infoCard, isTablet && styles.infoCardTablet]}>
          <InfoRow icon="calendar-outline" iconBg="#16a085" title="பகல் நேரம்" value={record?.day_duration} isTablet={isTablet} convertTime={false} />
          <DashedDivider />
          <InfoRow icon="moon-outline" iconBg="#34495e" title="சந்திர அஸ்தமனம்" value={record?.moonset} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="trending-up-outline" iconBg="#2980b9" title="யோகம் வகை" value={record?.yogam_type} isTablet={isTablet} convertTime={false} />
          <DashedDivider />
          <InfoRow icon="warning-outline" iconBg="#8e44ad" title="முடக்கு நட்சத்திரம்" value={record?.mudakku_natchathiram} isTablet={isTablet} convertTime={false} />
          <DashedDivider />
          <InfoRow icon="remove-circle-outline" iconBg="#7f8c8d" title="திதி சூன்யம்" value={record?.tithi_soonyam} isTablet={isTablet} convertTime={false} />
          <DashedDivider />
          <InfoRow icon="time-outline" iconBg="#d35400" title="ஹோரை" value={record?.horai} isTablet={isTablet} convertTime={true} />
        </View>

        <DashedDivider />

        {/* Night Timings - Times converted to 12-hour format */}
        <View style={[styles.infoCard, isTablet && styles.infoCardTablet]}>
          <SectionHeader title="இரவு காலங்கள்" compact={true} />
          <InfoRow icon="moon-outline" iconBg="#2c3e50" title="இரவு யமகண்டம்" value={record?.night_yamagandam} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="flash-outline" iconBg="#c0392b" title="காலன்" value={record?.kaalan} isTablet={isTablet} convertTime={true} />
          <DashedDivider />
          <InfoRow icon="water-outline" iconBg="#2980b9" title="அர்த்தமிராணம்" value={record?.arthamiraanam} isTablet={isTablet} convertTime={true} />
        </View>

        <DashedDivider />

       

      </ScrollView>
    </SafeAreaView>
  );
}

/* ==================== STYLES ==================== */
const styles = StyleSheet.create({
  // Container Styles
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 14,
    paddingBottom: 30,
  },
  contentContainerTablet: {
    padding: 24,
    paddingBottom: 40,
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
  },
  contentContainerLandscape: {
    paddingHorizontal: 30,
  },

  // Top Card
  topCard: {
    backgroundColor: "#8B0000",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  topCardTablet: {
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  topSmallTitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 10,
  },
  topSmallTitleTablet: {
    fontSize: 20,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnTablet: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  topDate: {
    color: "#fff",
    fontSize: 35,
    fontWeight: "900",
    letterSpacing: 1,
  },
  topDateTablet: {
    fontSize: 48,
  },
  topSub: {
    color: "#ffeaf3",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 10,
  },
  topSubTablet: {
    fontSize: 18,
    marginTop: 16,
  },

  // 3 Tiles
  tilesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tilesRowTablet: {
    marginBottom: 16,
  },
  tilesRowLandscape: {
    marginBottom: 12,
  },
  tile: {
    width: "31.5%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  tileTablet: {
    borderRadius: 18,
    paddingVertical: 20,
  },
  tileGreen: {
    backgroundColor: "#2fb86b",
  },
  tilePink: {
    backgroundColor: "#ff3b63",
  },
  tileBlue: {
    backgroundColor: "#1f7ae0",
  },
  tileText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 22,
  },
  tileTextTablet: {
    fontSize: 16,
    lineHeight: 28,
  },

  // Divider
  dashedDivider: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderStyle: "dashed",
    marginVertical: 10,
  },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  infoCardTablet: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoRowTablet: {
    paddingVertical: 16,
  },
  infoIconBox: {
    width: 27,
    height: 27,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoIconBoxTablet: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 16,
  },
  infoTitle: {
    width: 110,
    fontSize: 14,
    fontWeight: "900",
    color: "#222",
  },
  infoTitleTablet: {
    width: 140,
    fontSize: 18,
  },
  infoColon: {
    width: 16,
    fontSize: 18,
    fontWeight: "900",
    color: "#222",
    textAlign: "center",
  },
  infoColonTablet: {
    width: 20,
    fontSize: 22,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    color: "#222",
    lineHeight: 24,
  },
  infoValueTablet: {
    fontSize: 18,
    lineHeight: 28,
  },

  // Section Header
  sectionHeader: {
    backgroundColor: "#19b57f",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  sectionHeaderCompact: {
    paddingVertical: 10,
  },
  sectionHeaderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  sectionHeaderTextCompact: {
    fontSize: 16,
  },

  // Content Cards
  contentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  contentCardTablet: {
    borderRadius: 24,
    marginBottom: 20,
  },

  // Centered Content Styles
  centeredContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  centeredContainerTablet: {
    padding: 30,
    minHeight: 120,
  },
  centeredText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#333",
    textAlign: "center",
    lineHeight: 28,
  },
  centeredTextTablet: {
    fontSize: 18,
    lineHeight: 32,
  },
});