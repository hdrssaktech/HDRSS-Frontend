// // IndraiyaPanchangam.js
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   Alert,
//   Platform,
//   useWindowDimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
// import Loader from "../../../../components/Alert/Loader";

// const API_URL = "http://192.168.1.6:5000/api/v1/panchangam/maathkaati";

// // Pink color palette
// const COLORS = {
//   primary: "#ff3b63",      // Bright pink
//   secondary: "#ff2f55",    // Darker pink
//   lightPink: "#fff0f0",    // Very light pink
//   text: "#212529",         // Dark gray
//   textLight: "#6c757d",    // Medium gray
//   white: "#ffffff",
//   cardBg: "#ffffff",
//   lightBg: "#f8f9fa",
//   shadow: "#000000",
//   govt: "#b71c1c",         // Dark red for govt holidays
//   selected: "#34c759",     // Green for selected
//   today: "#ff3b63",        // Pink for today
//   sunday: "#e11b22",       // Red for Sundays
//   border: "#e9ecef",
//   headerBg: "#8B0000",      // Pink header
// };

// const TAMIL_MONTHS = [
//   "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
//   "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்",
// ];

// const TAMIL_WEEKDAYS = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
// const TAMIL_WEEKDAYS_SHORT = ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"];

// const SLOT_LABELS = {
//   veerath_thinam: "விரத தினங்கள்",
//   subamugurtha_thinam: "சுபமுகூர்த்த தினங்கள்",
//   hindu_pandigai: "இந்து பண்டிகைகள்",
//   government_holidays: "அரசு விடுமுறை நாட்கள்",
// };

// export default function MaathaKaatiPanchangam() {
//   const navigation = useNavigation();
//   const { width, height } = useWindowDimensions();
  
//   // Device detection
//   const isTablet = width >= 600;
//   const isMobile = width < 768;
//   const isLandscape = width > height;

//   const [today, setToday] = useState(() => new Date());
//   const [month, setMonth] = useState(() => today.getMonth() + 1);
//   const [year, setYear] = useState(() => today.getFullYear());
//   const [loading, setLoading] = useState(true);
//   const [allMonths, setAllMonths] = useState([]);
//   const [monthData, setMonthData] = useState(null);
//   const [selectedDay, setSelectedDay] = useState(() => today.getDate());

//   // Responsive values
//   const getResponsiveValues = () => {
//     if (isTablet) {
//       return {
//         headerPadding: Platform.OS === 'ios' ? 60 : 50,
//         headerTitleSize: 25,
//         headerIconSize: 32,
//         topCardPadding: 20,
//         topTitleSize: 24,
//         iconBtnSize: 45,
//         weekTextSize: 24,
//         dayCellSize: isLandscape ? 65 : 75,
//         dayTextSize: 26,
//         dayIconSize: 20,
//         cardHeaderSize: 18,
//         cardBodyPadding: 20,
//         textSize: 15,
//         smallTextSize: 13,
//         contentPadding: 24,
//         gap: 20,
//         dateBoxWidth: 140,
//         borderRadius: 24,
//       };
//     } else {
//       return {
//         headerPadding: Platform.OS === 'ios' ? 50 : 40,
//         headerTitleSize: 19,
//         headerIconSize: 24,
//         topCardPadding: 14,
//         topTitleSize: 20,
//         iconBtnSize: 40,
//         weekTextSize: 15,
//         dayCellSize: 45,
//         dayTextSize: 15,
//         dayIconSize: 10,
//         cardHeaderSize: 15,
//         cardBodyPadding: 14,
//         textSize: 15,
//         smallTextSize: 13,
//         contentPadding: 12,
//         gap: 12,
//         dateBoxWidth: 100,
//         borderRadius: 16,
//       };
//     }
//   };

//   const responsive = getResponsiveValues();

//   // Update today at midnight
//   useEffect(() => {
//     const tick = () => setToday(new Date());
//     const now = new Date();
//     const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
//     const firstDelay = nextMidnight.getTime() - now.getTime();

//     const timeout = setTimeout(() => {
//       tick();
//       const interval = setInterval(tick, 60 * 1000);
//       return () => clearInterval(interval);
//     }, Math.max(1000, firstDelay));

//     return () => clearTimeout(timeout);
//   }, []);

//   // Keep selected day = today when viewing current month
//   useEffect(() => {
//     const isViewingCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
//     if (isViewingCurrentMonth) {
//       setSelectedDay(today.getDate());
//     }
//   }, [today, month, year]);

//   // Fetch API data
//   useEffect(() => {
//     let alive = true;

//     const fetchAll = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(API_URL);
//         const list = res?.data?.data || [];
//         if (!alive) return;
//         setAllMonths(list);
//       } catch (e) {
//         Alert.alert("தவறு", "காலண்டர் தரவை ஏற்ற முடியவில்லை");
//       } finally {
//         if (alive) setLoading(false);
//       }
//     };

//     fetchAll();
//     return () => { alive = false; };
//   }, []);

//   // Update month data when month/year changes
//   useEffect(() => {
//     const found = allMonths.find((x) => Number(x.month) === month && Number(x.year) === year);
//     setMonthData(found || null);

//     const isViewingCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
//     setSelectedDay(isViewingCurrentMonth ? today.getDate() : 1);
//   }, [month, year, allMonths, today]);

//   const onPrevMonth = () => {
//     setMonth((m) => {
//       if (m === 1) {
//         setYear((y) => y - 1);
//         return 12;
//       }
//       return m - 1;
//     });
//   };

//   const onNextMonth = () => {
//     setMonth((m) => {
//       if (m === 12) {
//         setYear((y) => y + 1);
//         return 1;
//       }
//       return m + 1;
//     });
//   };

//   const goToToday = () => {
//     const t = new Date();
//     setYear(t.getFullYear());
//     setMonth(t.getMonth() + 1);
//     setSelectedDay(t.getDate());
//   };

//   const goBack = () => {
//     navigation.goBack();
//   };

//   // Navigate to NaalKaati with selected date
//   const navigateToNaalKaati = (day) => {
//     const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//     navigation.navigate('NaalKaatiPanchangam', { 
//       selectedDate: dateStr,
//       fromCalendar: true 
//     });
//   };

//   // Handle date press - navigate to NaalKaati
//   const handleDatePress = (day) => {
//     setSelectedDay(day);
//     navigateToNaalKaati(day);
//   };

//   // Build maps for icons/markers
//   const maps = useMemo(() => {
//     const out = { veerath: new Map(), subam: new Map(), hindu: new Map(), govt: new Map() };

//     const add = (arr, mapObj) => {
//       if (!Array.isArray(arr)) return;
//       arr.forEach((item) => {
//         if (item && typeof item === "object") {
//           if (item.day != null) mapObj.set(Number(item.day), String(item.name || ""));
//         } else if (typeof item === "string") {
//           const parsed = parseDayFromUnknownString(item, month, year);
//           if (parsed.day) mapObj.set(parsed.day, parsed.name || "");
//         }
//       });
//     };

//     add(monthData?.veerath_thinam, out.veerath);
//     add(monthData?.subamugurtha_thinam, out.subam);
//     add(monthData?.hindu_pandigai, out.hindu);
//     add(monthData?.government_holidays, out.govt);

//     return out;
//   }, [monthData, month, year]);

//   const isViewingCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
//   const todayDay = isViewingCurrentMonth ? today.getDate() : null;

//   // Calendar cells
//   const calendarCells = useMemo(() => {
//     const daysInMonth = getDaysInMonth(year, month);
//     const startPad = getStartPad(year, month);
//     const arr = [];

//     for (let i = 0; i < startPad; i++) arr.push({ type: "empty", key: `e-${i}` });

//     for (let d = 1; d <= daysInMonth; d++) {
//       const isSelected = d === selectedDay;
//       const isToday = todayDay === d;
//       const isGovt = maps.govt.has(d);
//       const isSunday = isSundayCheck(year, month, d);

//       let icon = "";
//       if (isGovt) icon = "🏛️";
//       else if (maps.hindu.has(d)) icon = "🙏";
//       else if (maps.subam.has(d)) icon = "✨";
//       else if (maps.veerath.has(d)) icon = "🔘";

//       arr.push({
//         type: "day",
//         key: `d-${d}`,
//         day: d,
//         isSunday,
//         isSelected,
//         isToday,
//         isGovt,
//         icon,
//       });
//     }

//     while (arr.length % 7 !== 0) arr.push({ type: "empty", key: `x-${arr.length}` });

//     return arr;
//   }, [year, month, selectedDay, maps, todayDay]);

//   const virathaRows = useMemo(() => normalizeToRightRows(monthData?.veerath_thinam, month, year), [monthData, month, year]);
//   const subamRows = useMemo(() => normalizeToRightRows(monthData?.subamugurtha_thinam, month, year), [monthData, month, year]);
//   const hinduRows = useMemo(() => normalizeToRightRows(monthData?.hindu_pandigai, month, year), [monthData, month, year]);
//   const govtRows = useMemo(() => normalizeToRightRows(monthData?.government_holidays, month, year), [monthData, month, year]);

//   const monthLabel = `${TAMIL_MONTHS[month - 1]} ${year}`;

//   if (loading) {
//     return (
//      <Loader visible={true} message="தரவு ஏற்றப்படுகிறது..." />
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
     
//         <View style={[styles.header, isTablet && styles.headerTablet]}>
//          <TouchableOpacity
//         style={[styles.backButton, isTablet && styles.backButtonTablet]}
//         onPress={() => navigation.goBack()}
//       >
//         <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
//       </TouchableOpacity>
          
//           <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
//             மாதக் காட்டி
//           </Text>
          
//           <View style={{ width: responsive.iconBtnSize }} />
       
//       </View>

//       <ScrollView 
//         style={styles.screen} 
//         contentContainerStyle={[
//           styles.content,
//           { padding: responsive.contentPadding }
//         ]}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Month Selector Card */}
//         <LinearGradient 
//           colors={[COLORS.primary, COLORS.secondary]} 
//           style={[styles.topCard, { 
//             padding: responsive.topCardPadding,
//             borderRadius: responsive.borderRadius,
//           }]}
//         >
//           <View style={styles.topRow}>
//             <TouchableOpacity 
//               style={[styles.iconBtn, { width: responsive.iconBtnSize, height: responsive.iconBtnSize }]} 
//               onPress={onPrevMonth} 
//               activeOpacity={0.8}
//             >
//               <Ionicons name="chevron-back" size={responsive.headerIconSize} color="#fff" />
//             </TouchableOpacity>

//             <View style={styles.monthTitleContainer}>
//               <Text style={[styles.topBigTitle, { fontSize: responsive.topTitleSize }]}>
//                 {monthLabel}
//               </Text>
//               <TouchableOpacity 
//                 onPress={goToToday} 
//                 activeOpacity={0.8} 
//                 style={styles.todayPill}
//               >
//                 <Ionicons name="today" size={14} color="#fff" />
//                 <Text style={styles.todayPillText}>இன்று</Text>
//               </TouchableOpacity>
//             </View>   

//             <TouchableOpacity 
//               style={[styles.iconBtn, { width: responsive.iconBtnSize, height: responsive.iconBtnSize }]} 
//               onPress={onNextMonth} 
//               activeOpacity={0.8}
//             >
//               <Ionicons name="chevron-forward" size={responsive.headerIconSize} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>

//         {/* Week Days */}
//         <View style={[styles.weekRow, { 
//           paddingVertical: isTablet ? 10 : 6,
//           borderRadius: responsive.borderRadius,
//         }]}>
//           {TAMIL_WEEKDAYS_SHORT.map((d, index) => (
//             <Text 
//               key={d} 
//               style={[
//                 styles.weekText, 
//                 { fontSize: responsive.weekTextSize },
//                 index === 0 && styles.sundayText
//               ]}
//             >
//               {d}
//             </Text>
//           ))}
//         </View>

//         {/* Calendar Grid */}
//         <View style={[styles.calendarWrap, { 
//           padding: isTablet ? 12 : 6,
//           borderRadius: responsive.borderRadius,
//         }]}>
//           <FlatList
//             data={calendarCells}
//             numColumns={7}
//             keyExtractor={(item) => item.key}
//             scrollEnabled={false}
//             renderItem={({ item }) => {
//               if (item.type === "empty") {
//                 return (
//                   <View style={[
//                     styles.dayCellEmpty,
//                     isTablet && { 
//                       aspectRatio: 1, 
//                       height: undefined,
//                       margin: 4,
//                     }
//                   ]} />
//                 );
//               }

//               return (
//                 <TouchableOpacity
//                   activeOpacity={0.7}
//                   onPress={() => handleDatePress(item.day)}
//                   style={[
//                     styles.dayCell,
//                     isTablet && {
//                       aspectRatio: 1,
//                       height: undefined,
//                       margin: 4,
//                       borderRadius: 14,
//                     },
//                     item.isSelected && styles.dayCellSelected,
//                     item.isGovt && !item.isSelected && styles.dayCellGovt,
//                     item.isToday && !item.isSelected && styles.dayCellToday,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.bigDay,
//                       { fontSize: responsive.dayTextSize },
//                       item.isSunday && !item.isSelected && !item.isGovt && styles.sundayText,
//                       (item.isSelected || item.isGovt) && styles.whiteText,
//                       item.isToday && !item.isSelected && !item.isGovt && styles.todayText,
//                     ]}
//                   >
//                     {item.day}
//                   </Text>
//                   {item.icon ? (
//                     <Text style={[styles.dayIcon, { fontSize: responsive.dayIconSize }]}>
//                       {item.icon}
//                     </Text>
//                   ) : null}
//                 </TouchableOpacity>
//               );
//             }}
//           />
//         </View>

//         {!monthData && (
//           <View style={[styles.infoBox, { 
//             padding: responsive.cardBodyPadding,
//             borderRadius: responsive.borderRadius,
//           }]}>
//             <Text style={[styles.infoText, { fontSize: responsive.smallTextSize }]}>
//               இந்த மாதத்திற்கு தரவு இல்லை
//             </Text>
//           </View>
//         )}

//         {/* Data Cards - All using RightSideList for name on left and date on right */}
//         <Card 
//           headerText={SLOT_LABELS.veerath_thinam} 
//           isTablet={isTablet}
//           responsive={responsive}
//         >
//           <RightSideList 
//             rows={virathaRows} 
//             emptyText="-" 
//             isTablet={isTablet}
//             responsive={responsive}
//           />
//         </Card>

//         <Card 
//           headerText={SLOT_LABELS.subamugurtha_thinam} 
//           isTablet={isTablet}
//           responsive={responsive}
//         >
//           <RightSideList 
//             rows={subamRows} 
//             emptyText="-" 
//             isTablet={isTablet}
//             responsive={responsive}
//           />
//         </Card>

//         <Card 
//           headerText={SLOT_LABELS.hindu_pandigai} 
//           isTablet={isTablet}
//           responsive={responsive}
//         >
//           <RightSideList 
//             rows={hinduRows} 
//             emptyText="-" 
//             isTablet={isTablet}
//             responsive={responsive}
//           />
//         </Card>

//         <Card 
//           headerText={SLOT_LABELS.government_holidays} 
//           isTablet={isTablet}
//           responsive={responsive}
//         >
//           <RightSideList 
//             rows={govtRows} 
//             emptyText="-" 
//             isTablet={isTablet}
//             responsive={responsive}
//           />
//         </Card>
//       </ScrollView>
//     </View>
//   );
// }

// /* -------------------- UI Components -------------------- */

// function Card({ headerText, children, isTablet, responsive }) {
//   return (
//     <View style={[
//       styles.whiteCard,
//       isTablet && { 
//         borderRadius: responsive.borderRadius, 
//         marginBottom: 16 
//       }
//     ]}>
//       <LinearGradient
//         colors={[COLORS.primary, COLORS.secondary]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={[styles.cardHeader, { 
//           paddingVertical: responsive.cardBodyPadding,
//           borderTopLeftRadius: responsive.borderRadius,
//           borderTopRightRadius: responsive.borderRadius,
//         }]}
//       >
//         <Text style={[styles.cardHeaderText, { fontSize: responsive.cardHeaderSize }]}>
//           {headerText}
//         </Text>
//       </LinearGradient>
      
//       <View style={[styles.cardBody, { padding: responsive.cardBodyPadding }]}>
//         {children}
//       </View>
//     </View>
//   );
// }

// function RightSideList({ rows, emptyText, isTablet, responsive }) {
//   if (!rows || rows.length === 0) {
//     return (
//       <Text style={[styles.emptyText, { fontSize: responsive.textSize }]}>
//         {emptyText}
//       </Text>
//     );
//   }

//   return (
//     <View style={styles.rightListContainer}>
//       {rows.map((r, i) => (
//         <View key={i} style={styles.rowContainer}>
//           <View style={[styles.rightRow, isTablet && { paddingVertical: 10 }]}>
//             <Text 
//               style={[
//                 styles.leftName, 
//                 { fontSize: responsive.textSize },
//                 isTablet && { fontSize: responsive.textSize + 2 }
//               ]} 
//               numberOfLines={2}
//             >
//               {r.name}
//             </Text>
//             <View style={[styles.rightDateContainer, { minWidth: responsive.dateBoxWidth }]}>
//               <Text 
//                 style={[
//                   styles.rightDate, 
//                   { fontSize: responsive.smallTextSize },
//                   isTablet && { fontSize: responsive.smallTextSize + 2 }
//                 ]} 
//                 numberOfLines={1}
//               >
//                 {r.right}
//               </Text>
//             </View>
//           </View>
//           {i !== rows.length - 1 && <DashedDivider isTablet={isTablet} />}
//         </View>
//       ))}
//     </View>
//   );
// }

// function DashedDivider({ isTablet }) {
//   return (
//     <View style={[
//       styles.dashedDivider,
//       isTablet && { marginVertical: 12, borderTopWidth: 1.5 }
//     ]} />
//   );
// }

// /* -------------------- Helpers -------------------- */

// function getDaysInMonth(year, month1to12) {
//   return new Date(year, month1to12, 0).getDate();
// }

// function getStartPad(year, month1to12) {
//   return new Date(year, month1to12 - 1, 1).getDay();
// }

// function isSundayCheck(year, month1to12, day) {
//   return new Date(year, month1to12 - 1, day).getDay() === 0;
// }

// function makeRightLabel(day, month, year) {
//   const w = new Date(year, month - 1, day).getDay();
//   const weekday = TAMIL_WEEKDAYS[w] || "";
//   return `${day} ${weekday}`;
// }

// function normalizeToRightRows(arr, month, year) {
//   if (!Array.isArray(arr)) return [];

//   const temp = [];
//   arr.forEach((item) => {
//     if (item && typeof item === "object") {
//       const day = Number(item.day);
//       const name = String(item.name || "").trim();
//       if (!Number.isNaN(day) && day >= 1 && day <= 31 && name) temp.push({ name, day });
//     } else if (typeof item === "string") {
//       const parsed = parseDayFromUnknownString(item, month, year);
//       if (parsed.day) temp.push({ name: parsed.name || item, day: parsed.day });
//     }
//   });

//   const map = new Map();
//   temp.forEach(({ name, day }) => {
//     if (!map.has(name)) map.set(name, []);
//     map.get(name).push(day);
//   });

//   const rows = [];
//   map.forEach((days, name) => {
//     const unique = Array.from(new Set(days)).sort((a, b) => a - b);
//     const right = unique.map((d) => makeRightLabel(d, month, year)).join(", ");
//     rows.push({ name, right, sortDay: unique[0] || 0 });
//   });

//   rows.sort((a, b) => a.sortDay - b.sortDay);
//   return rows;
// }

// function parseDayFromUnknownString(s, month, year) {
//   const str = String(s);

//   if (str.includes(":") && !str.includes("/")) {
//     const parts = str.split(":").filter(Boolean);
//     if (parts.length === 2) {
//       const a = parts[0].trim();
//       const b = parts[1].trim();
//       const aNum = Number(a);
//       const bNum = Number(b);

//       if (!Number.isNaN(aNum) && aNum >= 1 && aNum <= 31) return { day: aNum, name: b };
//       if (!Number.isNaN(bNum) && bNum >= 1 && bNum <= 31) return { day: bNum, name: a };
//     }
//     if (parts.length >= 3) {
//       const possibleDay = Number(parts[0]);
//       const name = parts[parts.length - 1];
//       if (!Number.isNaN(possibleDay) && possibleDay >= 1 && possibleDay <= 31) {
//         return { day: possibleDay, name };
//       }
//     }
//   }

//   if (str.includes("/")) {
//     const [datePart, namePart] = str.split(":");
//     const pieces = datePart.split("/");
//     const day = Number(pieces[0]);
//     if (!Number.isNaN(day) && day >= 1 && day <= 31) {
//       return { day, name: namePart ? namePart.trim() : "" };
//     }
//   }

//   return { day: null, name: "" };
// }

// /* -------------------- Styles -------------------- */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.lightBg,
//   },
//   screen: {
//     flex: 1,
//     backgroundColor: COLORS.lightBg,
//   },
//   content: {
//     paddingBottom: 30,
//   },
//   center: {
//     alignItems: "center",
//     justifyContent: "center",
//     flex: 1,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontWeight: "700",
//     color: COLORS.text,
//   },

//   // Header styles
 
//   header: {
//    flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#93210A",
//     paddingTop:40,
//     paddingBottom:30,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },

//   headerTablet:{
//     paddingTop:45,
//     paddingBottom:28,
//     paddingHorizontal: 18,
//   },

//  backButton:{
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft:15,
    
//   },
//   backButtonTablet:{
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },

//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "800",
//     letterSpacing: 0.3,
//   },
//   headerTitleTablet: {
//     fontSize: 23,
//   },

//   // Top card styles
//   topCard: {
//     shadowColor: COLORS.shadow,
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 6,
//     marginBottom: 12,
//   },
//   topRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   iconBtn: {
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(255,255,255,0.18)",
//   },
//   monthTitleContainer: {
//     alignItems: "center",
//   },
//   topBigTitle: {
//     color: COLORS.white,
//     fontWeight: "900",
//     textAlign: "center",
//   },
//   todayPill: {
//     marginTop: 6,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 999,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.6)",
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   todayPillText: {
//     color: COLORS.white,
//     fontWeight: "800",
//     fontSize: 12,
//   },

//   // Calendar styles
//   weekRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: COLORS.white,
//     marginHorizontal: 2,
//     marginBottom: 8,
//     shadowColor: COLORS.shadow,
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   weekText: {
//     width: "13%",
//     textAlign: "center",
//     fontWeight: "900",
//     color: COLORS.text,
//   },
//   sundayText: {
//     color: COLORS.sunday,
//   },
//   calendarWrap: {
//     backgroundColor: COLORS.white,
//     overflow: "hidden",
//     marginBottom: 12,
//     shadowColor: COLORS.shadow,
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 4,
//   },
//   dayCellEmpty: {
//     flex: 1,
//     height: 48,
//     margin: 2,
//     borderRadius: 8,
//     backgroundColor: "transparent",
//   },
//   dayCell: {
//     flex: 1,
//     height: 48,
//     margin: 2,
//     borderRadius: 10,
//     backgroundColor: COLORS.white,
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   dayCellSelected: {
//     backgroundColor: COLORS.selected,
//     borderColor: COLORS.selected,
//   },
//   dayCellGovt: {
//     backgroundColor: COLORS.govt,
//     borderColor: COLORS.govt,
//   },
//   dayCellToday: {
//     borderWidth: 2,
//     borderColor: COLORS.today,
//     backgroundColor: COLORS.lightPink,
//   },
//   bigDay: {
//     fontWeight: "800",
//     color: COLORS.text,
//   },
//   whiteText: {
//     color: COLORS.white,
//   },
//   todayText: {
//     color: COLORS.today,
//     fontWeight: "900",
//   },
//   dayIcon: {
//     position: "absolute",
//     top: 2,
//     left: 4,
//   },

//   // Card styles
//   whiteCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: 16,
//     overflow: "hidden",
//     marginBottom: 12,
//     shadowColor: COLORS.shadow,
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 4,
//   },
//   cardHeader: {
//     paddingHorizontal: 12,
//     alignItems: "center",
//   },
//   cardHeaderText: {
//     color: COLORS.white,
//     textAlign: "center",
//     fontWeight: "900",
//   },
//   cardBody: {
//     alignItems: "center",
//   },

//   // List styles
//   rightListContainer: {
//     width: "100%",
//   },
//   rowContainer: {
//     width: "100%",
//   },
//   rightRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 6,
//     width: "100%",
//   },
//   leftName: {
//     flex: 1,
//     fontWeight: "700",
//     color: COLORS.text,
//     textAlign: "left",
//     paddingRight: 8,
//     lineHeight: 22,
//   },
//   rightDateContainer: {
//     backgroundColor: COLORS.lightBg,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   rightDate: {
//     fontWeight: "700",
//     color: COLORS.primary,
//     textAlign: "center",
//   },
//   emptyText: {
//     fontWeight: "600",
//     color: COLORS.text,
//     paddingVertical: 8,
//     textAlign: "center",
//     width: "100%",
//     lineHeight: 22,
//     backgroundColor: COLORS.lightBg,
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   dashedDivider: {
//     borderTopWidth: 1,
//     borderTopColor: COLORS.border,
//     borderStyle: "dashed",
//     marginVertical: 8,
//     width: "100%",
//   },
//   infoBox: {
//     backgroundColor: COLORS.white,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderStyle: "dashed",
//     alignItems: "center",
//   },
//   infoText: {
//     fontWeight: "700",
//     color: COLORS.primary,
//     textAlign: "center",
//   },
// });



// IndraiyaPanchangam.js
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../../components/Alert/Loader";

const BASE_URL = "http://192.168.1.6:5000/api/v1/panchangam/maathkaati";
// Uses:  GET /maathkaati/month/:month/year/:year
// → If DB has it → returns instantly
// → If not → Groq AI generates, saves to DB, returns
const MONTH_API = (month, year) => `${BASE_URL}/month/${month}/year/${year}`;

// Pink color palette
const COLORS = {
  primary:    "#ff3b63",
  secondary:  "#ff2f55",
  lightPink:  "#fff0f0",
  text:       "#212529",
  textLight:  "#6c757d",
  white:      "#ffffff",
  cardBg:     "#ffffff",
  lightBg:    "#f8f9fa",
  shadow:     "#000000",
  govt:       "#b71c1c",
  selected:   "#34c759",
  today:      "#ff3b63",
  sunday:     "#e11b22",
  border:     "#e9ecef",
  headerBg:   "#8B0000",
};

const TAMIL_MONTHS = [
  "ஜனவரி","பிப்ரவரி","மார்ச்","ஏப்ரல்","மே","ஜூன்",
  "ஜூலை","ஆகஸ்ட்","செப்டம்பர்","அக்டோபர்","நவம்பர்","டிசம்பர்",
];

const TAMIL_WEEKDAYS       = ["ஞாயிறு","திங்கள்","செவ்வாய்","புதன்","வியாழன்","வெள்ளி","சனி"];
const TAMIL_WEEKDAYS_SHORT = ["ஞா","தி","செ","பு","வி","வெ","ச"];

const SLOT_LABELS = {
  veerath_thinam:      "விரத தினங்கள்",
  subamugurtha_thinam: "சுபமுகூர்த்த தினங்கள்",
  hindu_pandigai:      "இந்து பண்டிகைகள்",
  government_holidays: "அரசு விடுமுறை நாட்கள்",
};

export default function MaathaKaatiPanchangam() {
  const navigation              = useNavigation();
  const { width, height }       = useWindowDimensions();
  const isTablet                = width >= 600;
  const isLandscape             = width > height;

  const [today,       setToday]       = useState(() => new Date());
  const [month,       setMonth]       = useState(() => today.getMonth() + 1);
  const [year,        setYear]        = useState(() => today.getFullYear());

  // Per-month fetch state
  const [monthData,   setMonthData]   = useState(null);
  const [fetching,    setFetching]    = useState(false);   // spinner inside calendar area
  const [initialLoad, setInitialLoad] = useState(true);   // full-screen loader on first open
  const [selectedDay, setSelectedDay] = useState(() => today.getDate());

  // Cache: avoid re-fetching months we already have
  const cache = useRef(new Map());

  /* ─── Responsive ───────────────────────────────────── */
  const responsive = useMemo(() => {
    if (isTablet) {
      return {
        headerPadding: Platform.OS === "ios" ? 60 : 50,
        headerTitleSize: 25, headerIconSize: 32,
        topCardPadding: 20, topTitleSize: 24, iconBtnSize: 45,
        weekTextSize: 24, dayCellSize: isLandscape ? 65 : 75,
        dayTextSize: 26, dayIconSize: 20, cardHeaderSize: 18,
        cardBodyPadding: 20, textSize: 15, smallTextSize: 13,
        contentPadding: 24, gap: 20, dateBoxWidth: 140, borderRadius: 24,
      };
    }
    return {
      headerPadding: Platform.OS === "ios" ? 50 : 40,
      headerTitleSize: 19, headerIconSize: 24,
      topCardPadding: 14, topTitleSize: 20, iconBtnSize: 40,
      weekTextSize: 15, dayCellSize: 45,
      dayTextSize: 15, dayIconSize: 10, cardHeaderSize: 15,
      cardBodyPadding: 14, textSize: 15, smallTextSize: 13,
      contentPadding: 12, gap: 12, dateBoxWidth: 100, borderRadius: 16,
    };
  }, [isTablet, isLandscape]);

  /* ─── Midnight tick ─────────────────────────────────── */
  useEffect(() => {
    const tick = () => setToday(new Date());
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2
    );
    const timeout = setTimeout(() => {
      tick();
      const interval = setInterval(tick, 60 * 1000);
      return () => clearInterval(interval);
    }, Math.max(1000, nextMidnight.getTime() - now.getTime()));
    return () => clearTimeout(timeout);
  }, []);

  /* ─── Keep selectedDay = today when on current month ── */
  useEffect(() => {
    if (year === today.getFullYear() && month === today.getMonth() + 1) {
      setSelectedDay(today.getDate());
    }
  }, [today, month, year]);

  /* ─── FETCH month data ──────────────────────────────────
     Called every time month/year changes.
     1. Check in-memory cache first (instant)
     2. Otherwise call  GET /maathkaati/month/:m/year/:y
        - Backend checks DB → found → returns
        - Not found → Groq AI generates → saves → returns
  ─────────────────────────────────────────────────────── */
  useEffect(() => {
    let alive = true;

    const fetchMonth = async () => {
      const key = `${year}-${month}`;

      // Already cached
      if (cache.current.has(key)) {
        setMonthData(cache.current.get(key));
        setInitialLoad(false);
        return;
      }

      try {
        initialLoad ? setInitialLoad(true) : setFetching(true);

        const res  = await axios.get(MONTH_API(month, year));
        const data = res?.data?.data || null;

        if (!alive) return;

        cache.current.set(key, data); // cache it
        setMonthData(data);
      } catch (e) {
        if (!alive) return;
        console.log("[MaathKaati] fetch error:", e?.message);
        // Don't crash — just show empty state
        cache.current.set(key, null);
        setMonthData(null);
      } finally {
        if (alive) {
          setInitialLoad(false);
          setFetching(false);
        }
      }
    };

    fetchMonth();
    return () => { alive = false; };
  }, [month, year]);

  /* ─── Navigation helpers ────────────────────────────── */
  const onPrevMonth = () => {
    setMonth((m) => {
      if (m === 1) { setYear((y) => y - 1); return 12; }
      return m - 1;
    });
  };

  const onNextMonth = () => {
    setMonth((m) => {
      if (m === 12) { setYear((y) => y + 1); return 1; }
      return m + 1;
    });
  };

  const goToToday = () => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth() + 1);
    setSelectedDay(t.getDate());
  };

  const handleDatePress = (day) => {
    setSelectedDay(day);
    const dateStr = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    navigation.navigate("NaalKaatiPanchangam", { selectedDate: dateStr, fromCalendar: true });
  };

  /* ─── Build icon maps from monthData ───────────────── */
  const maps = useMemo(() => {
    const out = {
      veerath: new Map(),
      subam:   new Map(),
      hindu:   new Map(),
      govt:    new Map(),
    };

    const addFromDate = (arr, mapObj) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        // item.date = "2026-07-05"  OR  item.day = 5
        const day = item.date
          ? parseInt(item.date.split("-")[2], 10)
          : item.day != null ? Number(item.day) : null;
        if (day) mapObj.set(day, String(item.name || ""));
      });
    };

    addFromDate(monthData?.veerath_thinam,      out.veerath);
    addFromDate(monthData?.subamugurtha_thinam,  out.subam);
    addFromDate(monthData?.hindu_pandigai,       out.hindu);
    addFromDate(monthData?.government_holidays,  out.govt);

    return out;
  }, [monthData]);

  /* ─── Calendar cells ────────────────────────────────── */
  const isViewingCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;
  const todayDay              = isViewingCurrentMonth ? today.getDate() : null;

  const calendarCells = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const startPad    = getStartPad(year, month);
    const arr         = [];

    for (let i = 0; i < startPad; i++) arr.push({ type: "empty", key: `e-${i}` });

    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected = d === selectedDay;
      const isToday    = todayDay === d;
      const isGovt     = maps.govt.has(d);
      const isSunday   = isSundayCheck(year, month, d);

      let icon = "";
      if (isGovt)              icon = "🏛️";
      else if (maps.hindu.has(d))  icon = "🙏";
      else if (maps.subam.has(d))  icon = "✨";
      else if (maps.veerath.has(d)) icon = "🔘";

      arr.push({ type:"day", key:`d-${d}`, day:d, isSunday, isSelected, isToday, isGovt, icon });
    }

    while (arr.length % 7 !== 0) arr.push({ type:"empty", key:`x-${arr.length}` });
    return arr;
  }, [year, month, selectedDay, maps, todayDay]);

  /* ─── Normalise rows for cards ──────────────────────── */
  const virathaRows = useMemo(() => normalizeDateRows(monthData?.veerath_thinam,      month, year), [monthData, month, year]);
  const subamRows   = useMemo(() => normalizeDateRows(monthData?.subamugurtha_thinam,  month, year), [monthData, month, year]);
  const hinduRows   = useMemo(() => normalizeDateRows(monthData?.hindu_pandigai,       month, year), [monthData, month, year]);
  const govtRows    = useMemo(() => normalizeDateRows(monthData?.government_holidays,  month, year), [monthData, month, year]);

  const monthLabel = `${TAMIL_MONTHS[month - 1]} ${year}`;

  /* ─── Full screen loader (first open only) ─────────── */
  if (initialLoad) {
    return <Loader visible={true} message="தரவு ஏற்றப்படுகிறது..." />;
  }

  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          மாதக் காட்டி
        </Text>
        <View style={{ width: responsive.iconBtnSize }} />
      </View>

      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { padding: responsive.contentPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Selector Card */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={[styles.topCard, { padding: responsive.topCardPadding, borderRadius: responsive.borderRadius }]}
        >
          <View style={styles.topRow}>
            <TouchableOpacity
              style={[styles.iconBtn, { width: responsive.iconBtnSize, height: responsive.iconBtnSize }]}
              onPress={onPrevMonth}
              activeOpacity={0.8}
              disabled={fetching}
            >
              <Ionicons name="chevron-back" size={responsive.headerIconSize} color="#fff" />
            </TouchableOpacity>

            <View style={styles.monthTitleContainer}>
              <Text style={[styles.topBigTitle, { fontSize: responsive.topTitleSize }]}>
                {monthLabel}
              </Text>
              <TouchableOpacity onPress={goToToday} activeOpacity={0.8} style={styles.todayPill}>
                <Ionicons name="today" size={14} color="#fff" />
                <Text style={styles.todayPillText}>இன்று</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.iconBtn, { width: responsive.iconBtnSize, height: responsive.iconBtnSize }]}
              onPress={onNextMonth}
              activeOpacity={0.8}
              disabled={fetching}
            >
              <Ionicons name="chevron-forward" size={responsive.headerIconSize} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* AI loading banner — shown while Groq generates */}
        {fetching && (
          <View style={styles.fetchingBanner}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.fetchingText}>
              {monthLabel} தரவு உருவாக்கப்படுகிறது...
            </Text>
          </View>
        )}

        {/* Week header */}
        <View style={[styles.weekRow, { paddingVertical: isTablet ? 10 : 6, borderRadius: responsive.borderRadius }]}>
          {TAMIL_WEEKDAYS_SHORT.map((d, index) => (
            <Text
              key={d}
              style={[styles.weekText, { fontSize: responsive.weekTextSize }, index === 0 && styles.sundayText]}
            >
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={[styles.calendarWrap, { padding: isTablet ? 12 : 6, borderRadius: responsive.borderRadius }]}>
          <FlatList
            data={calendarCells}
            numColumns={7}
            keyExtractor={(item) => item.key}
            scrollEnabled={false}
            renderItem={({ item }) => {
              if (item.type === "empty") {
                return (
                  <View style={[styles.dayCellEmpty, isTablet && { aspectRatio:1, height:undefined, margin:4 }]} />
                );
              }
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleDatePress(item.day)}
                  style={[
                    styles.dayCell,
                    isTablet && { aspectRatio:1, height:undefined, margin:4, borderRadius:14 },
                    item.isSelected && styles.dayCellSelected,
                    item.isGovt    && !item.isSelected && styles.dayCellGovt,
                    item.isToday   && !item.isSelected && styles.dayCellToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.bigDay,
                      { fontSize: responsive.dayTextSize },
                      item.isSunday && !item.isSelected && !item.isGovt && styles.sundayText,
                      (item.isSelected || item.isGovt) && styles.whiteText,
                      item.isToday  && !item.isSelected && !item.isGovt && styles.todayText,
                    ]}
                  >
                    {item.day}
                  </Text>
                  {item.icon ? (
                    <Text style={[styles.dayIcon, { fontSize: responsive.dayIconSize }]}>{item.icon}</Text>
                  ) : null}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* No data state — only shown when NOT fetching */}
        {!monthData && !fetching && (
          <View style={[styles.infoBox, { padding: responsive.cardBodyPadding, borderRadius: responsive.borderRadius }]}>
            <Text style={[styles.infoText, { fontSize: responsive.smallTextSize }]}>
              இந்த மாதத்திற்கு தரவு இல்லை
            </Text>
          </View>
        )}

        {/* Data Cards */}
        <Card headerText={SLOT_LABELS.veerath_thinam} isTablet={isTablet} responsive={responsive}>
          <RightSideList rows={virathaRows} emptyText="-" isTablet={isTablet} responsive={responsive} />
        </Card>

        <Card headerText={SLOT_LABELS.subamugurtha_thinam} isTablet={isTablet} responsive={responsive}>
          <RightSideList rows={subamRows} emptyText="-" isTablet={isTablet} responsive={responsive} />
        </Card>

        <Card headerText={SLOT_LABELS.hindu_pandigai} isTablet={isTablet} responsive={responsive}>
          <RightSideList rows={hinduRows} emptyText="-" isTablet={isTablet} responsive={responsive} />
        </Card>

        <Card headerText={SLOT_LABELS.government_holidays} isTablet={isTablet} responsive={responsive}>
          <RightSideList rows={govtRows} emptyText="-" isTablet={isTablet} responsive={responsive} />
        </Card>

      </ScrollView>
    </View>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════ */

function Card({ headerText, children, isTablet, responsive }) {
  return (
    <View style={[styles.whiteCard, isTablet && { borderRadius: responsive.borderRadius, marginBottom: 16 }]}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x:0, y:0 }} end={{ x:1, y:0 }}
        style={[styles.cardHeader, {
          paddingVertical: responsive.cardBodyPadding,
          borderTopLeftRadius:  responsive.borderRadius,
          borderTopRightRadius: responsive.borderRadius,
        }]}
      >
        <Text style={[styles.cardHeaderText, { fontSize: responsive.cardHeaderSize }]}>{headerText}</Text>
      </LinearGradient>
      <View style={[styles.cardBody, { padding: responsive.cardBodyPadding }]}>{children}</View>
    </View>
  );
}

function RightSideList({ rows, emptyText, isTablet, responsive }) {
  if (!rows || rows.length === 0) {
    return (
      <Text style={[styles.emptyText, { fontSize: responsive.textSize }]}>{emptyText}</Text>
    );
  }
  return (
    <View style={styles.rightListContainer}>
      {rows.map((r, i) => (
        <View key={i} style={styles.rowContainer}>
          <View style={[styles.rightRow, isTablet && { paddingVertical: 10 }]}>
            <Text
              style={[styles.leftName, { fontSize: responsive.textSize }, isTablet && { fontSize: responsive.textSize + 2 }]}
              numberOfLines={2}
            >
              {r.name}
            </Text>
            <View style={[styles.rightDateContainer, { minWidth: responsive.dateBoxWidth }]}>
              <Text
                style={[styles.rightDate, { fontSize: responsive.smallTextSize }, isTablet && { fontSize: responsive.smallTextSize + 2 }]}
                numberOfLines={1}
              >
                {r.right}
              </Text>
            </View>
          </View>
          {i !== rows.length - 1 && <DashedDivider isTablet={isTablet} />}
        </View>
      ))}
    </View>
  );
}

function DashedDivider({ isTablet }) {
  return (
    <View style={[styles.dashedDivider, isTablet && { marginVertical: 12, borderTopWidth: 1.5 }]} />
  );
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */

function getDaysInMonth(year, month1to12) {
  return new Date(year, month1to12, 0).getDate();
}

function getStartPad(year, month1to12) {
  return new Date(year, month1to12 - 1, 1).getDay();
}

function isSundayCheck(year, month1to12, day) {
  return new Date(year, month1to12 - 1, day).getDay() === 0;
}

function makeRightLabel(day, month, year) {
  const w = new Date(year, month - 1, day).getDay();
  return `${day} ${TAMIL_WEEKDAYS[w] || ""}`;
}

/* ─── Normalise rows ────────────────────────────────────────
   Handles both API shapes:
     { date: "2026-07-05", name: "...", description?: "..." }
     { day: 5, month: "ஜூலை", tamilMonth: "..." }
─────────────────────────────────────────────────────────── */
function normalizeDateRows(arr, month, year) {
  if (!Array.isArray(arr)) return [];

  const temp = [];

  arr.forEach((item) => {
    if (!item || typeof item !== "object") return;

    let day  = null;
    let name = "";

    if (item.date) {
      // Shape 1: { date: "2026-07-05", name: "ஆடி அமாவாசை" }
      const parts = item.date.split("-");
      day  = parseInt(parts[2], 10);
      name = String(item.name || "").trim();
    } else if (item.day != null) {
      // Shape 2: { day: 6, month: "ஜூலை", tamilMonth: "ஆடி / ஆவணி" }
      day  = Number(item.day);
      name = String(item.name || item.tamilMonth || "").trim();
    }

    if (day && day >= 1 && day <= 31 && name) {
      temp.push({ day, name });
    }
  });

  // Group same name → comma-separated dates
  const map = new Map();
  temp.forEach(({ name, day }) => {
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(day);
  });

  const rows = [];
  map.forEach((days, name) => {
    const unique = Array.from(new Set(days)).sort((a, b) => a - b);
    const right  = unique.map((d) => makeRightLabel(d, month, year)).join(", ");
    rows.push({ name, right, sortDay: unique[0] || 0 });
  });

  rows.sort((a, b) => a.sortDay - b.sortDay);
  return rows;
}

/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: COLORS.lightBg },
  screen:     { flex: 1, backgroundColor: COLORS.lightBg },
  content:    { paddingBottom: 30 },
  center:     { alignItems: "center", justifyContent: "center", flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40, paddingBottom: 30,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  headerTablet:      { paddingTop: 45, paddingBottom: 28, paddingHorizontal: 18 },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center", marginLeft: 15,
  },
  backButtonTablet:  { width: 50, height: 50, borderRadius: 25 },
  headerTitle:       { flex: 1, textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "800", letterSpacing: 0.3 },
  headerTitleTablet: { fontSize: 23 },

  topCard: {
    shadowColor: COLORS.shadow, shadowOpacity: 0.1, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 6, marginBottom: 12,
  },
  topRow:             { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  iconBtn:            { borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.18)" },
  monthTitleContainer:{ alignItems: "center" },
  topBigTitle:        { color: COLORS.white, fontWeight: "900", textAlign: "center" },
  todayPill: {
    marginTop: 6, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,0.6)",
    flexDirection: "row", alignItems: "center", gap: 4,
  },
  todayPillText: { color: COLORS.white, fontWeight: "800", fontSize: 12 },

  // AI fetch banner
  fetchingBanner: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, backgroundColor: "#fff8e1",
    borderRadius: 12, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: "#ffc107", borderStyle: "dashed",
  },
  fetchingText: { color: "#7a5800", fontWeight: "700", fontSize: 13 },

  weekRow: {
    flexDirection: "row", justifyContent: "space-around",
    backgroundColor: COLORS.white, marginHorizontal: 2, marginBottom: 8,
    shadowColor: COLORS.shadow, shadowOpacity: 0.05, shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  weekText:    { width: "13%", textAlign: "center", fontWeight: "900", color: COLORS.text },
  sundayText:  { color: COLORS.sunday },
  calendarWrap: {
    backgroundColor: COLORS.white, overflow: "hidden", marginBottom: 12,
    shadowColor: COLORS.shadow, shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  dayCellEmpty: { flex: 1, height: 48, margin: 2, borderRadius: 8, backgroundColor: "transparent" },
  dayCell: {
    flex: 1, height: 48, margin: 2, borderRadius: 10,
    backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center",
    position: "relative", borderWidth: 1, borderColor: COLORS.border,
  },
  dayCellSelected: { backgroundColor: COLORS.selected, borderColor: COLORS.selected },
  dayCellGovt:     { backgroundColor: COLORS.govt,     borderColor: COLORS.govt },
  dayCellToday:    { borderWidth: 2, borderColor: COLORS.today, backgroundColor: COLORS.lightPink },
  bigDay:          { fontWeight: "800", color: COLORS.text },
  whiteText:       { color: COLORS.white },
  todayText:       { color: COLORS.today, fontWeight: "900" },
  dayIcon:         { position: "absolute", top: 2, left: 4 },

  whiteCard: {
    backgroundColor: COLORS.white, borderRadius: 16, overflow: "hidden", marginBottom: 12,
    shadowColor: COLORS.shadow, shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  cardHeader:     { paddingHorizontal: 12, alignItems: "center" },
  cardHeaderText: { color: COLORS.white, textAlign: "center", fontWeight: "900" },
  cardBody:       { alignItems: "center" },

  rightListContainer: { width: "100%" },
  rowContainer:       { width: "100%" },
  rightRow:           { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6, width: "100%" },
  leftName: {
    flex: 1, fontWeight: "700", color: COLORS.text,
    textAlign: "left", paddingRight: 8, lineHeight: 22,
  },
  rightDateContainer: {
    backgroundColor: COLORS.lightBg, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.primary,
  },
  rightDate:   { fontWeight: "700", color: COLORS.primary, textAlign: "center" },
  emptyText: {
    fontWeight: "600", color: COLORS.text, paddingVertical: 8,
    textAlign: "center", width: "100%", lineHeight: 22,
    backgroundColor: COLORS.lightBg, borderRadius: 20,
    paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.primary,
  },
  dashedDivider: {
    borderTopWidth: 1, borderTopColor: COLORS.border,
    borderStyle: "dashed", marginVertical: 8, width: "100%",
  },
  infoBox: {
    backgroundColor: COLORS.white, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.primary,
    borderStyle: "dashed", alignItems: "center",
  },
  infoText: { fontWeight: "700", color: COLORS.primary, textAlign: "center" },
});