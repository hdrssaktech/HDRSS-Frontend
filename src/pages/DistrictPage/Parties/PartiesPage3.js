// import React, { useEffect, useState, useMemo } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Platform,
//   SafeAreaView,
//   StatusBar,
//   Linking,
//   useWindowDimensions,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import Loader from "../../../components/Alert/Loader";

// const PartiesPage3 = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   // Accept both partyTitle/partyId from PartiesPage1 or item from PartiesPage2
//   const { partyTitle, partyId,partyName, item: passedItem } = route.params || {};
//   console.log(partyName)
//   const { width, height } = useWindowDimensions();
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Tablet check with proper dimensions
//   const isTablet = useMemo(() => {
//     return width >= 600 || (width > height && width >= 600);
//   }, [width, height]);

//   // ✅ Responsive square image size
//   const imageSize = useMemo(() => {
//     return isTablet ? 140 : 100;
//   }, [isTablet]);

//   useEffect(() => {
//     // If we have a passed item directly, use it
//     if (passedItem) {
//       setList([passedItem]);
//       setLoading(false);
//       return;
//     }

//     // Otherwise fetch based on partyId and partyTitle
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const res = await fetch(
//           `https://hdrss-backend.onrender.com/api/party/category/${partyId}`
//         );
        
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
        
//         const data = await res.json();

//         // Filter by title
//         const filtered = data.filter(item => item.title === partyTitle).sort((a,b)=>a.orderNo - b.orderNo);
//         setList(filtered);
//       } catch (err) {
//         console.error("API error:", err);
//         setError("Failed to load data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (partyId && partyTitle) {
//       fetchData();
//     } else {
//       setError("Missing required parameters");
//       setLoading(false);
//     }
//   }, [partyId, partyTitle, passedItem]);

//   const handleCall = (phoneNumber) => {
//     if (phoneNumber) {
//       Linking.openURL(`tel:${phoneNumber}`);
//     }
//   };

//   const handleLocationPress = (location) => {
//     if (location) {
//       const encodedLocation = encodeURIComponent(location);
//       Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
//     }
//   };

//   const renderHeader = () => {
//     // Get the title from passedItem if available, otherwise from partyTitle
//     const headerTitle = passedItem?.title || partyTitle || "Details";
    
//     return (
//       <View style={[styles.header, isTablet && styles.headerTablet]}>
//         <TouchableOpacity
//           style={[styles.backButton, isTablet && styles.backButtonTablet]}
//           onPress={() => navigation.goBack()}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
//         </TouchableOpacity>

//         <View style={styles.headerTitleWrap}>
//           <Text 
//             style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} 
//             numberOfLines={1}
//           >
//             {headerTitle}
//           </Text>
//         </View>
        
//         <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
//       </View>
//     );
//   };

//   const renderContent = () => {
//     if (loading) {
//       return <Loader />;
//     }

//     if (error) {
//       return (
//         <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
//           <Ionicons 
//             name="alert-circle-outline" 
//             size={isTablet ? 60 : 50} 
//             color="#8B0000" 
//           />
//           <Text style={[styles.errorText, isTablet && styles.errorTextTablet]}>
//             {error}
//           </Text>
//           <TouchableOpacity 
//             style={[styles.retryButton, isTablet && styles.retryButtonTablet]}
//             onPress={() => {
//               setError(null);
//               setLoading(true);
//             }}
//           >
//             <Text style={[styles.retryButtonText, isTablet && styles.retryButtonTextTablet]}>
//               Retry
//             </Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }

//     if (list.length === 0) {
//       return (
//         <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
//           <Ionicons 
//             name="people-outline" 
//             size={isTablet ? 60 : 50} 
//             color="#bbb" 
//           />
//           <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
//             No items found
//           </Text>
//         </View>
//       );
//     }

//     return (
//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={[
//           styles.scrollViewContent, 
//           isTablet && styles.scrollViewContentTablet
//         ]}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={[styles.listContainer, isTablet && styles.listContainerTablet]}>
//           {list.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               activeOpacity={0.85}
//               onPress={() => navigation.navigate("Partiespage4", { item: item })}
//               style={[styles.cardWrapper, isTablet && styles.cardWrapperTablet]}
//             >
//               <View style={[styles.card, isTablet && styles.cardTablet]}>
//                 {/* Square Image Box */}
//                 <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
//                   <Image
//                     source={{
//                       uri: item.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                     }}
//                     style={styles.image}
//                     resizeMode="cover"
//                   />
//                 </View>
                
//                 {/* Content Container */}
//                 <View style={[styles.contentContainer, isTablet && styles.contentContainerTablet]}>
//                   {/* Name and Role Section */}
//                   <View style={styles.textSection}>
//                     <Text 
//                       style={[styles.name, isTablet && styles.nameTablet]} 
//                       numberOfLines={2}
//                       ellipsizeMode="tail"
//                     >
//                       {item.name || "Unnamed"}
//                     </Text>
                    
//                     <Text style={[styles.role, isTablet && styles.roleTablet]} numberOfLines={1}>
//                       {item.designation || item.title || "State President"}
//                     </Text>
//                   </View>
                  
//                   {/* Buttons Row */}
//                   <View style={[styles.buttonsRow, isTablet && styles.buttonsRowTablet]}>
//                     {item.phoneNumber && (
//                       <TouchableOpacity
//                         style={[styles.callButton, isTablet && styles.callButtonTablet]}
//                         activeOpacity={0.7}
//                         onPress={(e) => {
//                           e.stopPropagation();
//                           handleCall(item.phoneNumber);
//                         }}
//                       >
//                         <Ionicons name="call" size={isTablet ? 18 : 16} color="#fff" />
//                         <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>
//                           Call
//                         </Text>
//                       </TouchableOpacity>
//                     )}
                    
//                     {item.location && (
//                       <TouchableOpacity
//                         style={[styles.directionsButton, isTablet && styles.directionsButtonTablet]}
//                         activeOpacity={0.7}
//                         onPress={(e) => {
//                           e.stopPropagation();
//                           handleLocationPress(item.location);
//                         }}
//                       >
//                         <Ionicons name="navigate" size={isTablet ? 18 : 16} color="#8B0000" />
//                         <Text style={[styles.directionsButtonText, isTablet && styles.directionsButtonTextTablet]}>
//                           Directions
//                         </Text>
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
//       <View style={styles.container}>
//         {renderHeader()}
//         {renderContent()}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safe: { 
//     flex: 1, 
//     backgroundColor: "#8B0000",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },

//   // Header
//   header: {
//     backgroundColor: "#8B0000",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === "ios" ? 10 : 40,
//     paddingBottom: 12,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   headerTablet: {
//     paddingHorizontal: 32,
//     paddingTop: Platform.OS === "ios" ? 15 : 45,
//     paddingBottom: 15,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.15)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   backButtonTablet: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   headerTitleWrap: {
//     flex: 1,
//     alignItems: "center",
//     paddingHorizontal: 10,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "900",
//     textAlign: "center",
//   },
//   headerTitleTablet: {
//     fontSize: 24,
//   },
//   headerSpacer: {
//     width: 40,
//   },
//   headerSpacerTablet: {
//     width: 50,
//   },

//   // Center States
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#FFFFFF",
//   },
//   centerContainerTablet: {
//     padding: 40,
//   },
//   errorText: {
//     marginTop: 14,
//     color: "#8B0000",
//     fontSize: 16,
//     textAlign: "center",
//     fontWeight: "700",
//     lineHeight: 22,
//     paddingHorizontal: 20,
//   },
//   errorTextTablet: {
//     fontSize: 18,
//     lineHeight: 26,
//     marginTop: 20,
//     maxWidth: 500,
//   },
//   emptyText: {
//     marginTop: 12,
//     color: "#777",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   emptyTextTablet: {
//     fontSize: 18,
//     marginTop: 16,
//   },
//   retryButton: {
//     marginTop: 20,
//     backgroundColor: "#8B0000",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//     elevation: 3,
//   },
//   retryButtonTablet: {
//     paddingHorizontal: 32,
//     paddingVertical: 16,
//     borderRadius: 10,
//     marginTop: 24,
//   },
//   retryButtonText: {
//     color: "#fff",
//     fontWeight: "800",
//     fontSize: 15,
//   },
//   retryButtonTextTablet: {
//     fontSize: 17,
//   },

//   // Scroll View
//   scrollView: {
//     flex: 1,
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   scrollViewContentTablet: {
//     paddingBottom: 30,
//   },

//   // List Container
//   listContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   listContainerTablet: {
//     paddingHorizontal: 32,
//     paddingTop: 20,
//   },

//   // Card Wrapper
//   cardWrapper: {
//     marginBottom: 12,
//   },
//   cardWrapperTablet: {
//     marginBottom: 16,
//   },

//   // Card
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     flexDirection: "row",
//     padding: 12,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: "rgba(139, 0, 0, 0.1)",
//   },
//   cardTablet: {
//     borderRadius: 18,
//     padding: 16,
//     elevation: 5,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//   },

//   // Square Image Box
//   imageContainer: {
//     borderRadius: 12,
//     overflow: "hidden",
//     backgroundColor: "#f5f5f5",
//     marginRight: 12,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },

//   // Content Container
//   contentContainer: {
//     flex: 1,
//     justifyContent: "space-between",
//   },
//   contentContainerTablet: {
//     paddingVertical: 2,
//   },

//   // Text Section
//   textSection: {
//     marginBottom: 8,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: "#8B0000",
//     lineHeight: 22,
//     marginBottom: 4,
//   },
//   nameTablet: {
//     fontSize: 18,
//     fontWeight: "900",
//     lineHeight: 24,
//     marginBottom: 6,
//   },
//   role: {
//     fontSize: 13,
//     color: "#666",
//     fontWeight: "500",
//     lineHeight: 18,
//   },
//   roleTablet: {
//     fontSize: 15,
//     lineHeight: 20,
//   },

//   // Buttons Row
//   buttonsRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 4,
//   },
//   buttonsRowTablet: {
//     gap: 12,
//     marginTop: 6,
//   },

//   // Call Button
//   callButton: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "#8B0000",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 6,
//     minHeight: 36,
//   },
//   callButtonTablet: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     minHeight: 44,
//     borderRadius: 10,
//     gap: 8,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "700",
//   },
//   buttonTextTablet: {
//     fontSize: 15,
//   },

//   // Directions Button
//   directionsButton: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "rgba(139, 0, 0, 0.05)",
//     borderWidth: 1,
//     borderColor: "#8B0000",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 6,
//     minHeight: 36,
//   },
//   directionsButtonTablet: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     minHeight: 44,
//     borderRadius: 10,
//     gap: 8,
//   },
//   directionsButtonText: {
//     color: "#8B0000",
//     fontSize: 13,
//     fontWeight: "700",
//   },
//   directionsButtonTextTablet: {
//     fontSize: 15,
//   },
// });

// export default PartiesPage3;



import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Linking,
  useWindowDimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../../components/Alert/Loader";

const PartiesPage3 = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // ✅ from Page1: partyId, partyName, partyImage
  // ✅ from Page2 (optional): partyTitle
  const { partyId, partyName, partyTitle } = route.params || {};

  const { width, height } = useWindowDimensions();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isTablet = useMemo(() => width >= 600 || (width > height && width >= 600), [width, height]);
  const imageSize = useMemo(() => (isTablet ? 140 : 100), [isTablet]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`https://hdrss-backend.onrender.com/api/party/category/${partyId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const filtered = data
          .filter((item) => !partyTitle || item.title === partyTitle)
          .sort((a, b) => (a?.orderNo ?? 0) - (b?.orderNo ?? 0));

        setList(filtered);
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }}, [partyId, partyTitle]);

  useEffect(() => {
    if (!partyId) {
      setError("Missing partyId");
      setLoading(false);
      return;
    }
    fetchData();
  }, [partyId, fetchData]);

  const handleCall = (phoneNumber) => {
    if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleLocationPress = (location) => {
    if (!location) return;
    const encodedLocation = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
  };

  const renderHeader = () => {
    const headerTitle = partyTitle || partyName || "Party";
    return (
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} numberOfLines={1}>
            {headerTitle}
          </Text>
        </View>

        <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
      </View>
    );
  };

  const renderContent = () => {
    if (loading) return <Loader />;

    if (error) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <Ionicons name="alert-circle-outline" size={isTablet ? 60 : 50} color="#8B0000" />
          <Text style={[styles.errorText, isTablet && styles.errorTextTablet]}>{error}</Text>

          <TouchableOpacity
            style={[styles.retryButton, isTablet && styles.retryButtonTablet]}
            onPress={fetchData} // ✅ real retry
          >
            <Text style={[styles.retryButtonText, isTablet && styles.retryButtonTextTablet]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (list.length === 0) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <Ionicons name="people-outline" size={isTablet ? 60 : 50} color="#bbb" />
          <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
            No items found
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          isTablet && styles.scrollViewContentTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.listContainer, isTablet && styles.listContainerTablet]}>
          {list.map((item, index) => (
            <TouchableOpacity
              key={item?.id?.toString?.() || `item-${index}`}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Partiespage4", { item })}
              style={[styles.cardWrapper, isTablet && styles.cardWrapperTablet]}
            >
              <View style={[styles.card, isTablet && styles.cardTablet]}>
                <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
                  <Image
                    source={{ uri: item.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>

                <View style={[styles.contentContainer, isTablet && styles.contentContainerTablet]}>
                  <View style={styles.textSection}>
                    <Text style={[styles.name, isTablet && styles.nameTablet]} numberOfLines={2}>
                      {item.name || "Unnamed"}
                    </Text>

                    {/* ✅ You are NOT showing category page, but showing role text is OK.
                        If you want to HIDE role also, comment this line. */}
                    <Text style={[styles.role, isTablet && styles.roleTablet]} numberOfLines={1}>
                      {item.designation || item.title || "Leader"}
                    </Text>
                  </View>

                  <View style={[styles.buttonsRow, isTablet && styles.buttonsRowTablet]}>
                    {!!item.phoneNumber && (
                      <TouchableOpacity
                        style={[styles.callButton, isTablet && styles.callButtonTablet]}
                        activeOpacity={0.7}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleCall(item.phoneNumber);
                        }}
                      >
                        <Ionicons name="call" size={isTablet ? 18 : 16} color="#fff" />
                        <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>
                          Call
                        </Text>
                      </TouchableOpacity>
                    )}

                    {!!item.location && (
                      <TouchableOpacity
                        style={[styles.directionsButton, isTablet && styles.directionsButtonTablet]}
                        activeOpacity={0.7}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleLocationPress(item.location);
                        }}
                      >
                        <Ionicons name="navigate" size={isTablet ? 18 : 16} color="#8B0000" />
                        <Text
                          style={[
                            styles.directionsButtonText,
                            isTablet && styles.directionsButtonTextTablet,
                          ]}
                        >
                          Directions
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <View style={styles.container}>
        {renderHeader()}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#8B0000" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 40,
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTablet: {
    paddingHorizontal: 32,
    paddingTop: Platform.OS === "ios" ? 15 : 45,
    paddingBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25 },
  headerTitleWrap: { flex: 1, alignItems: "center", paddingHorizontal: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900", textAlign: "center" },
  headerTitleTablet: { fontSize: 24 },
  headerSpacer: { width: 40 },
  headerSpacerTablet: { width: 50 },

  centerContainer: {
    flex: 1, justifyContent: "center", alignItems: "center",
    padding: 20, backgroundColor: "#FFFFFF",
  },
  centerContainerTablet: { padding: 40 },
  errorText: {
    marginTop: 14, color: "#8B0000", fontSize: 16,
    textAlign: "center", fontWeight: "700", lineHeight: 22, paddingHorizontal: 20,
  },
  errorTextTablet: { fontSize: 18, lineHeight: 26, marginTop: 20, maxWidth: 500 },
  emptyText: { marginTop: 12, color: "#777", fontSize: 16, fontWeight: "600" },
  emptyTextTablet: { fontSize: 18, marginTop: 16 },

  retryButton: {
    marginTop: 20, backgroundColor: "#8B0000",
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, elevation: 3,
  },
  retryButtonTablet: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 10, marginTop: 24 },
  retryButtonText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  retryButtonTextTablet: { fontSize: 17 },

  scrollView: { flex: 1 },
  scrollViewContent: { flexGrow: 1, paddingBottom: 20 },
  scrollViewContentTablet: { paddingBottom: 30 },

  listContainer: { paddingHorizontal: 16, paddingTop: 16 },
  listContainerTablet: { paddingHorizontal: 32, paddingTop: 20 },

  cardWrapper: { marginBottom: 12 },
  cardWrapperTablet: { marginBottom: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(139, 0, 0, 0.1)",
  },
  cardTablet: {
    borderRadius: 18,
    padding: 16,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    marginRight: 12,
  },
  image: { width: "100%", height: "100%" },

  contentContainer: { flex: 1, justifyContent: "space-between" },
  contentContainerTablet: { paddingVertical: 2 },

  textSection: { marginBottom: 8 },
  name: { fontSize: 16, fontWeight: "800", color: "#8B0000", lineHeight: 22, marginBottom: 4 },
  nameTablet: { fontSize: 18, fontWeight: "900", lineHeight: 24, marginBottom: 6 },
  role: { fontSize: 13, color: "#666", fontWeight: "500", lineHeight: 18 },
  roleTablet: { fontSize: 15, lineHeight: 20 },

  buttonsRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  buttonsRowTablet: { gap: 12, marginTop: 6 },

  callButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#8B0000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    minHeight: 36,
  },
  callButtonTablet: { paddingVertical: 10, paddingHorizontal: 16, minHeight: 44, borderRadius: 10, gap: 8 },
  buttonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  buttonTextTablet: { fontSize: 15 },

  directionsButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(139, 0, 0, 0.05)",
    borderWidth: 1,
    borderColor: "#8B0000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    minHeight: 36,
  },
  directionsButtonTablet: { paddingVertical: 10, paddingHorizontal: 16, minHeight: 44, borderRadius: 10, gap: 8 },
  directionsButtonText: { color: "#8B0000", fontSize: 13, fontWeight: "700" },
  directionsButtonTextTablet: { fontSize: 15 },
});

export default PartiesPage3;