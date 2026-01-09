// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ImageBackground,
//   ScrollView,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
//   Platform,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import YoutubePlayer from "react-native-youtube-iframe";
// import TownPage1 from "./TownPage/TownPage1";
// import { Linking } from "react-native";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const isTablet = screenWidth >= 600;
// const isLargeTablet = screenWidth >= 1024;

// // Responsive dimensions
// const imageSize = isTablet ? screenWidth / 4 - 30 : screenWidth / 3 - 20;
// const bannerHeight = isTablet ? (isLargeTablet ? 350 : 300) : 250;
// const titleFontSize = isTablet ? (isLargeTablet ? 32 : 28) : 24;
// const descriptionFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 13;
// const sectionTitleFontSize = isTablet ? (isLargeTablet ? 26 : 24) : 20;
// const menuFontSize = isTablet ? (isLargeTablet ? 18 : 16) : 14;
// const placeNameFontSize = isTablet ? (isLargeTablet ? 20 : 18) : 16;
// const placeDescFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 13;

// export default function DistrictPage2() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { districtId } = route.params;

//   const [district, setDistrict] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showFullDescription, setShowFullDescription] = useState(false);
//   const [playing, setPlaying] = useState(false);
//   const [translatedDescription, setTranslatedDescription] = useState("");
//   const [currentLang, setCurrentLang] = useState("en");

//   const adListRef = useRef(null);
//   const adIndex = useRef(0);

//   const detectLanguage = (text) => {
//     const tamilRegex = /[\u0B80-\u0BFF]/;
//     return tamilRegex.test(text) ? "ta" : "en";
//   };

//   const translateText = async (text, targetLang) => {
//     try {
//       const chunkSize = 500;
//       const chunks = [];

//       for (let i = 0; i < text.length; i += chunkSize) {
//         chunks.push(text.slice(i, i + chunkSize));
//       }

//       let translatedFullText = "";

//       const sourceLang = detectLanguage(text);

//       if (sourceLang === targetLang) {
//         return text;
//       }

//       for (const chunk of chunks) {
//         const response = await fetch(
//           `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
//             chunk
//           )}&langpair=${sourceLang}|${targetLang}`
//         );

//         const data = await response.json();
//         translatedFullText += data.responseData.translatedText + " ";
//       }

//       return translatedFullText.trim();
//     } catch (error) {
//       console.error("Translation error:", error);
//       return text;
//     }
//   };

//   useEffect(() => {
//     const fetchDistrict = async () => {
//       try {
//         const res = await fetch(
//           `https://hdrss-backend.onrender.com/api/districts/${districtId}`
//         );
//         const data = await res.json();
//         setDistrict(data);
//       } catch (err) {
//         console.error("❌ Error fetching district details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDistrict();
//   }, [districtId]);

//   const adImages = Array.isArray(district?.advertisementImages)
//     ? district.advertisementImages
//     : district?.advertisementImages?.image || [];

//   useEffect(() => {
//     if (!adImages || adImages.length === 0) return;
//     const scrollInterval = setInterval(() => {
//       adIndex.current = (adIndex.current + 1) % adImages.length;
//       if (adListRef.current) {
//         adListRef.current.scrollToOffset({
//           offset: adIndex.current * screenWidth,
//           animated: true,
//         });
//       }
//     }, 3000);
//     return () => clearInterval(scrollInterval);
//   }, [adImages]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#93210A" />
//       </View>
//     );
//   }

//   if (!district) {
//     return (
//       <View style={styles.center}>
//         <Text>Failed to load district details.</Text>
//       </View>
//     );
//   }

//   const handleGovernmentPress = (districtId) => {
//     navigation.navigate("GovernmentPage1", { districtId });
//   };

//   const handlepartiesPress = (districtId) => {
//     navigation.navigate("Partiespage1", { districtId });
//   };

//   const tourismPlaces =
//     district.places?.filter(
//       (p) => p.category?.toLowerCase() === "tourism"
//     ) || [];
//   const templePlaces =
//     district.places?.filter(
//       (p) => p.category?.toLowerCase() === "temple"
//     ) || [];

//   const getYouTubeId = (url) => {
//     if (!url) return null;
//     const match = url.match(
//       /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^"&?/ ]{11})/
//     );
//     return match ? match[1] : null;
//   };

//   const videoUrls = Array.isArray(district.videos)
//     ? district.videos
//     : district.videoUrl
//     ? [district.videoUrl]
//     : [];

//   const videoIds = videoUrls
//     .map((url) => getYouTubeId(url))
//     .filter((id) => id !== null);

//   return (
//     <FlatList
//       data={[{}]}
//       keyExtractor={() => "content"}
//       renderItem={() => (
//         <ScrollView style={styles.container}>
//           {/* Banner */}
//           <ImageBackground
//             source={{
//               uri:
//                 typeof district.bannerImage === "string"
//                   ? district.bannerImage
//                   : district.bannerImage?.url || district.image,
//             }}
//             style={[styles.banner, { height: bannerHeight }]}
//             resizeMode="cover"
//           >
//             <TouchableOpacity
//               style={[styles.arrowButton, isTablet && styles.arrowButtonTablet]}
//               onPress={() =>
//                 navigation.canGoBack()
//                   ? navigation.goBack()
//                   : navigation.navigate("DistrictPage1")
//               }
//             >
//               <Ionicons
//                 name="chevron-back"
//                 size={isTablet ? 34 : 28}
//                 color="#fff"
//               />
//             </TouchableOpacity>

//             <View style={styles.overlay}>
//               <Text style={[styles.title, { fontSize: titleFontSize }]}>
//                 {district.name}
//               </Text>
//             </View>
//           </ImageBackground>

//           {/* Translate Button */}
//           <TouchableOpacity
//             onPress={async () => {
//               const nextLang = currentLang === "en" ? "ta" : "en";
//               setCurrentLang(nextLang);

//               const translated = await translateText(
//                 district.description,
//                 nextLang
//               );
//               setTranslatedDescription(translated);
//             }}
//             style={[
//               styles.translateButton,
//               isTablet && styles.translateButtonTablet,
//             ]}
//             activeOpacity={0.8}
//           >
//             <Ionicons
//               name="language"
//               size={isTablet ? 22 : 18}
//               color="#fff"
//               style={{ marginRight: 8 }}
//             />
//             <Text style={[styles.translateText, isTablet && styles.translateTextTablet]}>
//               {currentLang === "en" ? "Translate Tamil" : "Translate English"}
//             </Text>
//           </TouchableOpacity>

//           {/* Description */}
//           {district.description ? (
//             <View
//               style={[
//                 styles.descriptionContainer,
//                 isTablet && styles.descriptionContainerTablet,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.description,
//                   { fontSize: descriptionFontSize },
//                   isTablet && styles.descriptionTablet,
//                 ]}
//                 numberOfLines={showFullDescription ? undefined : 4}
//               >
//                 {translatedDescription ? translatedDescription : district.description}
//               </Text>

//               {(translatedDescription.length > 300 ||
//                 district.description.length > 300) && (
//                <TouchableOpacity
//   style={[styles.seeMoreContainer, isTablet && styles.seeMoreContainerTablet]}
//   onPress={() => setShowFullDescription(!showFullDescription)}
// >
//   <Text style={[styles.seeMoreText, isTablet && styles.seeMoreTextTablet]}>
//     {showFullDescription ? "See Less" : "See More"}
//   </Text>
//   <Ionicons
//     name={showFullDescription ? "chevron-up" : "chevron-forward"}
//     size={isTablet ? 22 : 16}
//     color="#93210A"
//     style={{ marginLeft: 6 }}
//   />
// </TouchableOpacity>
//               )}
//             </View>
//           ) : null}

//           {/* Advertisement */}
//           {adImages.length > 0 && (
//             <View style={styles.section}>
//               <FlatList
//                 ref={adListRef}
//                 data={adImages}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 scrollEnabled={false}
//                 keyExtractor={(_, index) => index.toString()}
//                 renderItem={({ item }) => {
//                   const imageUrl =
//                     typeof item === "string"
//                       ? item
//                       : item?.url || item?.image || "";
//                   return (
//                     <Image
//                       source={{ uri: imageUrl }}
//                       style={[styles.adImage, isTablet && styles.adImageTablet]}
//                       resizeMode="cover"
//                     />
//                   );
//                 }}
//               />
//             </View>
//           )}

//           {/* Menu Buttons
//           <View style={[styles.menuContainer, isTablet && styles.menuContainerTablet]}>
//             <TouchableOpacity
//               style={[styles.menuBox, isTablet && styles.menuBoxTablet]}
//               onPress={() => handleGovernmentPress(districtId)}
//             >
//               <Text style={[styles.menuText, isTablet && styles.menuTextTablet]}>
//                 Government
//               </Text>
//             </TouchableOpacity>
//               <TouchableOpacity
//               style={[styles.menubutton, isTablet && styles.menubuttonTablet]}
//               onPress={() =>
//                 navigation.navigate("DistrictBusinessPage0", {
//                   districtId: district.id,
//                   districtName: district.name,
//                 })
//               }
//             >
//               <Text style={[styles.menubuttonText, isTablet && styles.menubuttonTextTablet]}>
//                 Business
//               </Text>
//             </TouchableOpacity>


//             <TouchableOpacity
//               style={[styles.menuBox, isTablet && styles.menuBoxTablet]}
//               onPress={() => handlepartiesPress(districtId)}
//             >
//               <Text style={[styles.menuText, isTablet && styles.menuTextTablet]}>
//                 Parties
//               </Text>
//             </TouchableOpacity>
//           </View> */}


//           {/* Menu Buttons */}
// <View style={[styles.menuContainer, isTablet && styles.menuContainerTablet]}>
//   {/* Main Business Button - Prominent */}
//   <TouchableOpacity
//     style={[styles.mainMenuButton, isTablet && styles.mainMenuButtonTablet]}
//     onPress={() =>
//       navigation.navigate("DistrictBusinessPage0", {
//         districtId: district.id,
//         districtName: district.name,
//       })
//     }
//     activeOpacity={0.8}
//   >
//     <Text style={[styles.mainMenuText, isTablet && styles.mainMenuTextTablet]}>
//       Business
//     </Text>
//     <Text style={styles.buttonSubtitle}>Explore local businesses & opportunities</Text>
//   </TouchableOpacity>

//   {/* Secondary Buttons Container */}
//   <View style={[styles.secondaryButtonsContainer, isTablet && styles.secondaryButtonsContainerTablet]}>
//     <TouchableOpacity
//       style={[styles.secondaryButton, isTablet && styles.secondaryButtonTablet]}
//       onPress={() => handleGovernmentPress(districtId)}
//       activeOpacity={0.8}
//     >
//       <Text style={[styles.secondaryButtonText, isTablet && styles.secondaryButtonTextTablet]}>
//         Government
//       </Text>
//     </TouchableOpacity>

//     <TouchableOpacity
//       style={[styles.secondaryButton, isTablet && styles.secondaryButtonTablet]}
//       onPress={() => handlepartiesPress(districtId)}
//       activeOpacity={0.8}
//     >
//       <Text style={[styles.secondaryButtonText, isTablet && styles.secondaryButtonTextTablet]}>
//         Parties
//       </Text>
//     </TouchableOpacity>
//   </View>
// </View>

//           {/* Town */}
//           <View>
//             <TownPage1 />
//           </View>

//           {/* Extra Menu Buttons */}
//           <View style={[styles.Menucontainer, isTablet && styles.MenucontainerTablet]}>
//             <TouchableOpacity
//               style={[styles.menubutton, isTablet && styles.menubuttonTablet]}
//               onPress={() =>
//                 navigation.navigate("ComplainPage1", {
//                   districtId: district.id,
//                   districtName: district.name,
//                 })
//               }
//             >
//               <Text style={[styles.menubuttonText, isTablet && styles.menubuttonTextTablet]}>
//                 Complaint
//               </Text>
//             </TouchableOpacity>

          

            
//             <TouchableOpacity
//               style={[styles.menuBox, isTablet && styles.menuBoxTablet]}
//               onPress={() =>
//                 navigation.navigate("Member0", {
//                   districtId: district.id,
//                   districtName: district.name,
//                 })
//               }
//             >
//               <Text style={[styles.menuText, isTablet && styles.menuTextTablet]}>
//                 HDRSS
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.menubutton, isTablet && styles.menubuttonTablet]}
//               onPress={() => navigation.navigate("Galleryfull")}
//             >
//               <Text style={[styles.menubuttonText, isTablet && styles.menubuttonTextTablet]}>
//                 Gallery
//               </Text>
//             </TouchableOpacity>
//           </View>

//         {/* 🏞 Tourism */}
// {tourismPlaces.length > 0 && (
//   <View style={styles.section}>
//     <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
//       Tourism
//     </Text>
//     <FlatList
//       data={tourismPlaces.slice(0, 2)} // Always show only 2 initially
//       nestedScrollEnabled
//       keyExtractor={(item, i) => i.toString()}
//       renderItem={({ item, index }) => {
//         const isEven = index % 2 === 0;
//         return (
//           <TouchableOpacity
//             style={[
//               styles.tourismCard,
//               { flexDirection: isEven ? "row" : "row-reverse" },
//               isTablet && styles.tourismCardTablet,
//             ]}
//             onPress={() =>
//               navigation.navigate("DistrictCategorysPage2", {
//                 districtId,
//                 categoryName: "Tourism",
//                 placeId: item._id || item.id,
//               })
//             }
//           >
//             <Image
//               source={{
//                 uri:
//                   typeof item.image === "string"
//                     ? item.image
//                     : item.image?.url,
//               }}
//               style={[styles.circleImage, isTablet && styles.circleImageTablet]}
//             />
//             <View style={styles.textContainer}>
//               <Text style={[styles.placeName, isTablet && styles.placeNameTablet]}>
//                 {item.name}
//               </Text>
//               <Text style={[styles.placeDescription, isTablet && styles.placeDescriptionTablet]} numberOfLines={2}>
//                 {item.description}
//               </Text>

//               <View style={styles.iconRow}>
//                 <TouchableOpacity
//                   onPress={() => Linking.openURL(`tel:${item.phone}`)}
//                 >
//                   <Ionicons 
//                     name="call" 
//                     size={isTablet ? 24 : 20} 
//                     color="#0aa04dff" 
//                   />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() =>
//                     Linking.openURL(
//                       `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//                         item.location || ""
//                       )}`
//                     )
//                   }
//                 >
//                   <Ionicons
//                     name="location-sharp"
//                     size={isTablet ? 24 : 20}
//                     color="#ca0c0cff"
//                     style={{ marginLeft: 15 }}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </TouchableOpacity>
//         );
//       }}
//     />

//     {/* Show See More only if there are more than 2 items */}
//     {tourismPlaces.length > 2 && (
//       <TouchableOpacity
//         style={[styles.toggleButton, isTablet && styles.toggleButtonTablet]}
//         onPress={() =>
//           navigation.navigate("DistrictCategorysPage1", {
//             districtId,
//             categoryName: "Tourism",
//           })
//         }
//       >
//         <Text style={[styles.toggleButtonText, isTablet && styles.toggleButtonTextTablet]}>
//           See More
//         </Text>
//         <Ionicons 
//           name="chevron-forward" 
//           size={isTablet ? 20 : 16} 
//           color="#93210A" 
//         />
//       </TouchableOpacity>
//     )}
//   </View>
// )}

// {/* 🕌 Temples */}
// {templePlaces.length > 0 && (
//   <View style={styles.section}>
//     <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
//       Temples
//     </Text>
//     <FlatList
//       data={templePlaces.slice(0, 2)} // Always show only 2 initially
//       nestedScrollEnabled
//       keyExtractor={(item, i) => i.toString()}
//       renderItem={({ item, index }) => {
//         const isEven = index % 2 === 0;
//         return (
//           <TouchableOpacity
//             style={[
//               styles.templeCard,
//               { flexDirection: isEven ? "row" : "row-reverse" },
//               isTablet && styles.templeCardTablet,
//             ]}
//             onPress={() =>
//               navigation.navigate("DistrictCategorysPage2", {
//                 districtId,
//                 categoryName: "Temple",
//                 placeId: item._id || item.id,
//               })
//             }
//           >
//             <Image
//               source={{
//                 uri:
//                   typeof item.image === "string"
//                     ? item.image
//                     : item.image?.url,
//               }}
//               style={[styles.circleImage, isTablet && styles.circleImageTablet]}
//             />
//             <View style={styles.textContainer}>
//               <Text style={[styles.placeName, isTablet && styles.placeNameTablet]}>
//                 {item.name}
//               </Text>
//               <Text style={[styles.placeDescription, isTablet && styles.placeDescriptionTablet]} numberOfLines={2}>
//                 {item.description}
//               </Text>

//               <View style={styles.iconRow}>
//                 <TouchableOpacity
//                   onPress={() => Linking.openURL(`tel:${item.phone}`)}
//                 >
//                   <Ionicons 
//                     name="call" 
//                     size={isTablet ? 24 : 20} 
//                     color="#0aa04dff" 
//                   />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() =>
//                     Linking.openURL(
//                       `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//                         item.location || ""
//                       )}`
//                     )
//                   }
//                 >
//                   <Ionicons
//                     name="location-sharp"
//                     size={isTablet ? 24 : 20}
//                     color="#ca0c0cff"
//                     style={{ marginLeft: 15 }}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </TouchableOpacity>
//         );
//       }}
//     />

//     {/* Show See More only if there are more than 2 items */}
//     {templePlaces.length > 2 && (
//       <TouchableOpacity
//         style={[styles.toggleButton, isTablet && styles.toggleButtonTablet]}
//         onPress={() =>
//           navigation.navigate("DistrictCategorysPage1", {
//             districtId,
//             categoryName: "Temple",
//           })
//         }
//       >
//         <Text style={[styles.toggleButtonText, isTablet && styles.toggleButtonTextTablet]}>
//           See More
//         </Text>
//         <Ionicons 
//           name="chevron-forward" 
//           size={isTablet ? 20 : 16} 
//           color="#93210A" 
//         />
//       </TouchableOpacity>
//     )}
//   </View>
// )}

//           {/* Videos */}
//           <View style={styles.videoContainer}>
//             <Text style={[styles.sectionTitle1, isTablet && styles.sectionTitle1Tablet]}>
//               District Videos
//             </Text>
//             {videoIds.length > 0 ? (
//               videoIds.map((id, index) => (
//                 <View key={index} style={[styles.videoWrapper, isTablet && styles.videoWrapperTablet]}>
//                   <YoutubePlayer
//                     height={isTablet ? 350 : 180}
//                     width={isTablet ? 750 : 370}
//                     play={playing}
//                     videoId={id}
//                     onChangeState={(state) => setPlaying(state === "playing")}
//                   />
//                 </View>
//               ))
//             ) : (
//               <Text style={styles.noVideoText}>No video available</Text>
//             )}
//           </View>
//         </ScrollView>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   banner: { width: "100%", justifyContent: "flex-end" },
//   arrowButton: {
//     position: "absolute",
//     top: Platform.OS === "ios" ? 50 : 40,
//     left: 20,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     borderRadius: 30,
//     padding: 6,
//     zIndex: 999,
//     elevation: 6,
//   },
//   arrowButtonTablet: {
//     top: 60,
//     left: 30,
//     padding: 8,
//   },
//   overlay: {
//     backgroundColor: "rgba(0, 0, 0, 0.17)",
//     width: "100%",
//     height: "100%",
//     paddingVertical: 80,
//     position: "absolute",
//   },
//   titleContainer: {
//   position: "absolute",
//   bottom: 20,
//   width: "100%",
//   alignItems: "center", // 🔥 centers on tablet automatically
// },
//   title: {
//     color: "#fff",
//     fontWeight: "bold",
//     left: 90,
//     bottom: 20,
//   },
//   titleTablet: {
//   color: "#fff",
//   fontSize: 22,
//   fontWeight: "bold",
//   textAlign: "center",
// },
  
//   // Translate Button Styles
//   translateButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#93210A",
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     borderRadius: 12,
//     marginBottom: 10,
//     marginTop: 15,
//     marginLeft: 15,
//     alignSelf: "flex-start",
//     shadowColor: "#000",
//     shadowOpacity: 0.18,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   translateButtonTablet: {
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     marginLeft: 30,
//     marginTop: 20,
//     marginBottom: 15,
//   },
//   translateText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   translateTextTablet: {
//     fontSize: 16,
//   },
  
//   // Description Styles
//   descriptionContainer: {
//     margin: 15,
//   },
//   descriptionContainerTablet: {
//     marginHorizontal: 30,
//     marginVertical: 20,
//   },
//   description: {
//     lineHeight: 22,
//     color: "#333",
//     textAlign: "justify",
//   },
//   descriptionTablet: {
//     lineHeight: 29,
//     fontSize:16,
//   },
  
//  seeMoreContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     marginTop: 5,
//     marginRight: 10,
//   },
//   seeMoreContainerTablet: {
//     marginTop: 10,
//     marginRight: 20,
//   },
//   seeMoreText: {
//     color: "#93210A",
//     fontWeight: "bold",
//     fontSize: 13,
//   },
//   seeMoreTextTablet: {
//     fontSize: 18,
//   },
  
//   // Advertisement Styles
//   section: {
//     marginVertical: 10,
//     alignItems: "center",
//   },
//   adImage: {
//     width: screenWidth,
//     height: 200,
//     borderRadius: 0,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.25,
//     shadowOffset: { width: 0, height: 6 },
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   adImageTablet: {
//     height: 250,
//   },
  
//   // // Menu Container Styles
//   // menuContainer: {
//   //   flexDirection: "row",
//   //   justifyContent: "space-between",
//   //   alignItems: "center",
//   //   marginHorizontal: 10,
//   //   marginVertical: 8,
//   // },
//   // menuContainerTablet: {
//   //   marginHorizontal: 30,
//   //   marginVertical: 15,
//   // },
//   // menuBox: {
//   //   backgroundColor: "#8B0000",
//   //   paddingVertical: 12,
//   //   borderRadius: 8,
//   //   width: "32%",
//   //   alignItems: "center",
//   //   justifyContent: "center",
//   // },
//   // menuBoxTablet: {
//   //   paddingVertical: 16,
//   //   borderRadius: 12,
//   // },
//   // menuText: {
//   //   color: "white",
//   //   fontWeight: "700",
//   //   fontSize: 14,
//   // },
//   // menuTextTablet: {
//   //   fontSize: 16,
//   //   fontWeight: "800",
//   // },
  
//   // Extra Menu Container
//   Menucontainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginHorizontal: 10,
//     marginVertical: 15,
//   },
//   MenucontainerTablet: {
//     marginHorizontal: 30,
//     marginVertical: 20,
//   },
//   menubutton: {
//     backgroundColor: "#8B0000",
//     paddingVertical: 12,
//     borderRadius: 8,
//     width: "32%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   menubuttonTablet: {
//     paddingVertical: 16,
//     borderRadius: 12,
//   },
//   menubuttonText: { 
//     color: "#fff", 
//     fontSize: 14, 
//     fontWeight: "bold" 
//   },
//   menubuttonTextTablet: {
//     fontSize: 16,
//     fontWeight: "800",
//       menuText: {
//     color: "white",
//     fontWeight: "700",
//     fontSize: 14,
//   },
//   menuText: {
//     color: "white",
//     fontWeight: "700",
//     fontSize: 14,
//   },
//   menuTextTablet: {
//     fontSize: 16,
//     fontWeight: "800",
//   },
//   menuContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginHorizontal: 10,
//     marginVertical: 8,
//   },
//   menuContainerTablet: {
//     marginHorizontal: 30,
//     marginVertical: 15,
//   },
//   menuBox: {
//     backgroundColor: "#8B0000",
//     paddingVertical: 12,
//     borderRadius: 8,
//     width: "32%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   menuBoxTablet: {
//     paddingVertical: 16,
//     borderRadius: 12,
//   },
  
//   },
  
//   // Section Titles
//   section: { 
//     marginTop: 20, 
//     marginBottom: 10 
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginVertical: 10,
//     left: 140,
//   },
//   sectionTitleTablet: {
//     fontSize: 24,
//     left: 280,
//     marginVertical: 15,
//   },
  
//   sectionTitle1: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginVertical: 10,
//     left: 11,
//   },
//   sectionTitle1Tablet: {
//     fontSize: 26,
//     right: -350,
//     marginVertical: 15,
//   },
  
//   // Tourism Card - Mobile
//   tourismCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     marginVertical: 10,
//     marginHorizontal: 16,
//     padding: 14,
//     borderWidth: 2,
//     borderColor: "#8c8c8c", 
//     elevation: 25,
//     shadowColor: "#8B4513", 
//     shadowOpacity: 0.7, 
//     shadowOffset: { width: 0, height: 10 },
//     shadowRadius: 14, 
//   },
//   // Tourism Card - Tablet
//   tourismCardTablet: {
//     marginHorizontal: 30,
//     padding: 20,
//     borderRadius: 16,
//   },
  
//   // Temple Card - Mobile
//   templeCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ffffff", 
//     borderRadius: 22,
//     marginVertical: 10,
//     marginHorizontal: 16,
//     padding: 18,
//     borderWidth: 3,
//     borderColor: "#c0c0c0", 
//     elevation: 45, 
//     shadowColor: "#ffb84d", 
//     shadowOpacity: 0.9,
//     shadowOffset: { width: 0, height: 14 },
//     shadowRadius: 40,
//     shadowColor: "#ffd966", 
//     shadowOpacity: 0.8,
//     shadowOffset: { width: 0, height: 8 },
//     shadowRadius: 55,
//     transform: [{ scale: 1.03 }, { translateY: -2 }],
//   },
//   // Temple Card - Tablet
//   templeCardTablet: {
//     marginHorizontal: 30,
//     padding: 20,
//     borderRadius: 24,
//   },
  
//   // Circle Image - Mobile
//   circleImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 45,
//     backgroundColor: "#eee",
//     marginHorizontal: 5,
//   },
//   // Circle Image - Tablet
//   circleImageTablet: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginHorizontal: 10,
//   },
  
//   textContainer: { 
//     flex: 1, 
//     justifyContent: "center" 
//   },
  
//   // Place Name - Mobile
//   placeName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 4,
//   },
//   // Place Name - Tablet
//   placeNameTablet: {
//     fontSize: 18,
//     marginBottom: 6,
//   },
  
//   // Place Description - Mobile
//   placeDescription: {
//     fontSize: 13,
//     color: "#555",
//     lineHeight: 18,
//     marginBottom: 8,
//   },
//   // Place Description - Tablet
//   placeDescriptionTablet: {
//     fontSize: 15,
//     lineHeight: 22,
//     marginBottom: 10,
//   },
  
//   iconRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 4,
//   },
  
//   toggleButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     marginTop: 5,
//     marginRight: 10,
//   },
//   toggleButtonText: {
//     color: "#93210A",
//     fontWeight: "600",
//     fontSize: 14,
//     marginRight: 6,
//   },
//   toggleButtonTextTablet: {
//     fontSize: 18,
//   },
  
//   // Video Styles
//   videoContainer: {
//     padding: 15,
//     backgroundColor: "#fff",
//     alignItems: "center",

//   },
//   videoWrapper: {
//     marginVertical: 30,
//   },
//   videoWrapperTablet: {
//     marginVertical: 40,
//     marginHorizontal:800,
//   },
//   noVideoText: {
//     textAlign: "center",
//     color: "#555",
//     marginTop: 10,
  
//   },
// });




import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import TownPage1 from "./TownPage/TownPage1";
import { Linking } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

// Responsive dimensions
const imageSize = isTablet ? screenWidth / 4 - 30 : screenWidth / 3 - 20;
const bannerHeight = isTablet ? (isLargeTablet ? 350 : 300) : 250;
const titleFontSize = isTablet ? (isLargeTablet ? 32 : 28) : 24;
const descriptionFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 13;
const sectionTitleFontSize = isTablet ? (isLargeTablet ? 26 : 24) : 20;
const menuFontSize = isTablet ? (isLargeTablet ? 18 : 16) : 14;
const placeNameFontSize = isTablet ? (isLargeTablet ? 20 : 18) : 16;
const placeDescFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 13;

export default function DistrictPage2() {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId } = route.params;

  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [translatedDescription, setTranslatedDescription] = useState("");
  const [currentLang, setCurrentLang] = useState("en");

  const adListRef = useRef(null);
  const adIndex = useRef(0);
  
  // Animation ref for business button slide-in
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const detectLanguage = (text) => {
    const tamilRegex = /[\u0B80-\u0BFF]/;
    return tamilRegex.test(text) ? "ta" : "en";
  };

  const translateText = async (text, targetLang) => {
    try {
      const chunkSize = 500;
      const chunks = [];

      for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
      }

      let translatedFullText = "";

      const sourceLang = detectLanguage(text);

      if (sourceLang === targetLang) {
        return text;
      }

      for (const chunk of chunks) {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            chunk
          )}&langpair=${sourceLang}|${targetLang}`
        );

        const data = await response.json();
        translatedFullText += data.responseData.translatedText + " ";
      }

      return translatedFullText.trim();
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        const res = await fetch(
          `https://hdrss-backend.onrender.com/api/districts/${districtId}`
        );
        const data = await res.json();
        setDistrict(data);
      } catch (err) {
        console.error("❌ Error fetching district details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistrict();
  }, [districtId]);

  // Start animation when district data is loaded
  useEffect(() => {
    if (!loading && district) {
      Animated.sequence([
        // Slide in from left
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        // Fade in and scale up
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [loading, district]);

  const adImages = Array.isArray(district?.advertisementImages)
    ? district.advertisementImages
    : district?.advertisementImages?.image || [];

  useEffect(() => {
    if (!adImages || adImages.length === 0) return;
    const scrollInterval = setInterval(() => {
      adIndex.current = (adIndex.current + 1) % adImages.length;
      if (adListRef.current) {
        adListRef.current.scrollToOffset({
          offset: adIndex.current * screenWidth,
          animated: true,
        });
      }
    }, 3000);
    return () => clearInterval(scrollInterval);
  }, [adImages]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  if (!district) {
    return (
      <View style={styles.center}>
        <Text>Failed to load district details.</Text>
      </View>
    );
  }

  const handleGovernmentPress = (districtId) => {
    navigation.navigate("GovernmentPage1", { districtId });
  };

  const handlepartiesPress = (districtId) => {
    navigation.navigate("Partiespage1", { districtId });
  };

  const tourismPlaces =
    district.places?.filter(
      (p) => p.category?.toLowerCase() === "tourism"
    ) || [];
  const templePlaces =
    district.places?.filter(
      (p) => p.category?.toLowerCase() === "temple"
    ) || [];

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^"&?/ ]{11})/
    );
    return match ? match[1] : null;
  };

  const videoUrls = Array.isArray(district.videos)
    ? district.videos
    : district.videoUrl
    ? [district.videoUrl]
    : [];

  const videoIds = videoUrls
    .map((url) => getYouTubeId(url))
    .filter((id) => id !== null);

  return (
    <FlatList
      data={[{}]}
      keyExtractor={() => "content"}
      renderItem={() => (
        <ScrollView style={styles.container}>
          {/* Banner */}
          <ImageBackground
            source={{
              uri:
                typeof district.bannerImage === "string"
                  ? district.bannerImage
                  : district.bannerImage?.url || district.image,
            }}
            style={[styles.banner, { height: bannerHeight }]}
            resizeMode="cover"
          >
            <TouchableOpacity
              style={[styles.arrowButton, isTablet && styles.arrowButtonTablet]}
              onPress={() =>
                navigation.canGoBack()
                  ? navigation.goBack()
                  : navigation.navigate("DistrictPage1")
              }
            >
              <Ionicons
                name="chevron-back"
                size={isTablet ? 34 : 28}
                color="#fff"
              />
            </TouchableOpacity>

            <View style={styles.overlay}>
              <Text style={[styles.title, { fontSize: titleFontSize }]}>
                {district.name}
              </Text>
            </View>
          </ImageBackground>

          {/* Translate Button */}
          <TouchableOpacity
            onPress={async () => {
              const nextLang = currentLang === "en" ? "ta" : "en";
              setCurrentLang(nextLang);

              const translated = await translateText(
                district.description,
                nextLang
              );
              setTranslatedDescription(translated);
            }}
            style={[
              styles.translateButton,
              isTablet && styles.translateButtonTablet,
            ]}
            activeOpacity={0.8}
          >
            <Ionicons
              name="language"
              size={isTablet ? 22 : 18}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.translateText, isTablet && styles.translateTextTablet]}>
              {currentLang === "en" ? "Translate Tamil" : "Translate English"}
            </Text>
          </TouchableOpacity>

          {/* Description */}
          {district.description ? (
            <View
              style={[
                styles.descriptionContainer,
                isTablet && styles.descriptionContainerTablet,
              ]}
            >
              <Text
                style={[
                  styles.description,
                  { fontSize: descriptionFontSize },
                  isTablet && styles.descriptionTablet,
                ]}
                numberOfLines={showFullDescription ? undefined : 4}
              >
                {translatedDescription ? translatedDescription : district.description}
              </Text>

              {(translatedDescription.length > 300 ||
                district.description.length > 300) && (
                <TouchableOpacity
                  style={[styles.seeMoreContainer, isTablet && styles.seeMoreContainerTablet]}
                  onPress={() => setShowFullDescription(!showFullDescription)}
                >
                  <Text style={[styles.seeMoreText, isTablet && styles.seeMoreTextTablet]}>
                    {showFullDescription ? "See Less" : "See More"}
                  </Text>
                  <Ionicons
                    name={showFullDescription ? "chevron-up" : "chevron-forward"}
                    size={isTablet ? 22 : 16}
                    color="#93210A"
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          {/* Advertisement */}
          {adImages.length > 0 && (
            <View style={styles.section}>
              <FlatList
                ref={adListRef}
                data={adImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                  const imageUrl =
                    typeof item === "string"
                      ? item
                      : item?.url || item?.image || "";
                  return (
                    <Image
                      source={{ uri: imageUrl }}
                      style={[styles.adImage, isTablet && styles.adImageTablet]}
                      resizeMode="cover"
                    />
                  );
                }}
              />
            </View>
          )}

          {/* 🏪 ANIMATED Business Button - Slides in from left */}
          <Animated.View
            style={[
              styles.businessButtonContainer,
              {
                transform: [
                  { translateX: slideAnim },
                  { scale: scaleAnim },
                ],
                opacity: fadeAnim,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.businessButton, isTablet && styles.businessButtonTablet]}
              onPress={() =>
                navigation.navigate("DistrictBusinessPage0", {
                  districtId: district.id,
                  districtName: district.name,
                })
              }
              activeOpacity={0.85}
            >
              {/* Glowing effect behind icon */}
              <View style={styles.glowEffect} />
              
              {/* Icon with count badge */}
              <View style={styles.businessIconContainer}>
                <View style={styles.iconCircle}>
                  <Ionicons 
                    name="storefront" 
                    size={isTablet ? 30 : 24} 
                    color="#fff" 
                  />
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>100+</Text>
                </View>
              </View>
              
              {/* Text content */}
              <View style={styles.businessTextContainer}>
                <Text style={[styles.businessMainText, isTablet && styles.businessMainTextTablet]}>
                  Business Bazaar
                </Text>
                <View style={styles.businessSubContainer}>
                  <View style={styles.featureTag}>
                    {/* <Ionicons name="checkmark-circle" size={12} color="#4CAF50" /> */}
                    {/* <Text style={styles.featureText}>Verified</Text> */}
                  </View>
                  {/* <Text style={[styles.businessSubText, isTablet && styles.businessSubTextTablet]}>
                    Local Commerce Hub
                  </Text> */}
                </View>
              </View>
              
              {/* Arrow with bounce effect */}
              <Animated.View 
                style={[
                  styles.businessArrowContainer,
                  {
                    transform: [
                      {
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Ionicons 
                  name="arrow-forward-circle" 
                  size={isTablet ? 32 : 26} 
                  color="#FFD700" 
                />
                <Text style={styles.exploreText}>Explore</Text>
              </Animated.View>
              
              {/* Decorative elements */}
              <View style={styles.decorativeDot1} />
              <View style={styles.decorativeDot2} />
            </TouchableOpacity>
          </Animated.View>

          {/* 🏛️ TWO Buttons - Government & Parties */}
          <View style={[styles.twoButtonsContainer, isTablet && styles.twoButtonsContainerTablet]}>
            <TouchableOpacity
              style={[styles.govButton, isTablet && styles.govButtonTablet]}
              onPress={() => handleGovernmentPress(districtId)}
            >
              <Text style={[styles.twoButtonText, isTablet && styles.twoButtonTextTablet]}>
                Government
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.partyButton, isTablet && styles.partyButtonTablet]}
              onPress={() => handlepartiesPress(districtId)}
            >
              <Text style={[styles.twoButtonText, isTablet && styles.twoButtonTextTablet]}>
                Parties
              </Text>
            </TouchableOpacity>
          </View>

          {/* 🏘️ Town Section */}
          <View>
            <TownPage1 />
          </View>

          {/* 📋 THREE Buttons Row - Complaint, HDRSS, Gallery */}
          <View style={[styles.threeButtonsContainer, isTablet && styles.threeButtonsContainerTablet]}>
            <TouchableOpacity
              style={[styles.complaintButton, isTablet && styles.complaintButtonTablet]}
              onPress={() =>
                navigation.navigate("ComplainPage1", {
                  districtId: district.id,
                  districtName: district.name,
                })
              }
            >
              <Text style={[styles.threeButtonText, isTablet && styles.threeButtonTextTablet]}>
                Complaint
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.hdrssButton, isTablet && styles.hdrssButtonTablet]}
              onPress={() =>
                navigation.navigate("Member0", {
                  districtId: district.id,
                  districtName: district.name,
                })
              }
            >
              <Text style={[styles.threeButtonText, isTablet && styles.threeButtonTextTablet]}>
                HDRSS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.galleryButton, isTablet && styles.galleryButtonTablet]}
              onPress={() => navigation.navigate("Galleryfull")}
            >
              <Text style={[styles.threeButtonText, isTablet && styles.threeButtonTextTablet]}>
                Gallery
              </Text>
            </TouchableOpacity>
          </View>

          {/* 🏞 Tourism */}
          {tourismPlaces.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                Tourism
              </Text>
              <FlatList
                data={tourismPlaces.slice(0, 2)} // Always show only 2 initially
                nestedScrollEnabled
                keyExtractor={(item, i) => i.toString()}
                renderItem={({ item, index }) => {
                  const isEven = index % 2 === 0;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.tourismCard,
                        { flexDirection: isEven ? "row" : "row-reverse" },
                        isTablet && styles.tourismCardTablet,
                      ]}
                      onPress={() =>
                        navigation.navigate("DistrictCategorysPage2", {
                          districtId,
                          categoryName: "Tourism",
                          placeId: item._id || item.id,
                        })
                      }
                    >
                      <Image
                        source={{
                          uri:
                            typeof item.image === "string"
                              ? item.image
                              : item.image?.url,
                        }}
                        style={[styles.circleImage, isTablet && styles.circleImageTablet]}
                      />
                      <View style={styles.textContainer}>
                        <Text style={[styles.placeName, isTablet && styles.placeNameTablet]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.placeDescription, isTablet && styles.placeDescriptionTablet]} numberOfLines={2}>
                          {item.description}
                        </Text>

                        <View style={styles.iconRow}>
                          <TouchableOpacity
                            onPress={() => Linking.openURL(`tel:${item.phone}`)}
                          >
                            <Ionicons 
                              name="call" 
                              size={isTablet ? 24 : 20} 
                              color="#0aa04dff" 
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  item.location || ""
                                )}`
                              )
                            }
                          >
                            <Ionicons
                              name="location-sharp"
                              size={isTablet ? 24 : 20}
                              color="#ca0c0cff"
                              style={{ marginLeft: 15 }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />

              {/* Show See More only if there are more than 2 items */}
              {tourismPlaces.length > 2 && (
                <TouchableOpacity
                  style={[styles.toggleButton, isTablet && styles.toggleButtonTablet]}
                  onPress={() =>
                    navigation.navigate("DistrictCategorysPage1", {
                      districtId,
                      categoryName: "Tourism",
                    })
                  }
                >
                  <Text style={[styles.toggleButtonText, isTablet && styles.toggleButtonTextTablet]}>
                    See More
                  </Text>
                  <Ionicons 
                    name="chevron-forward" 
                    size={isTablet ? 20 : 16} 
                    color="#93210A" 
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* 🕌 Temples */}
          {templePlaces.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                Temples
              </Text>
              <FlatList
                data={templePlaces.slice(0, 2)} // Always show only 2 initially
                nestedScrollEnabled
                keyExtractor={(item, i) => i.toString()}
                renderItem={({ item, index }) => {
                  const isEven = index % 2 === 0;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.templeCard,
                        { flexDirection: isEven ? "row" : "row-reverse" },
                        isTablet && styles.templeCardTablet,
                      ]}
                      onPress={() =>
                        navigation.navigate("DistrictCategorysPage2", {
                          districtId,
                          categoryName: "Temple",
                          placeId: item._id || item.id,
                        })
                      }
                    >
                      <Image
                        source={{
                          uri:
                            typeof item.image === "string"
                              ? item.image
                              : item.image?.url,
                        }}
                        style={[styles.circleImage, isTablet && styles.circleImageTablet]}
                      />
                      <View style={styles.textContainer}>
                        <Text style={[styles.placeName, isTablet && styles.placeNameTablet]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.placeDescription, isTablet && styles.placeDescriptionTablet]} numberOfLines={2}>
                          {item.description}
                        </Text>

                        <View style={styles.iconRow}>
                          <TouchableOpacity
                            onPress={() => Linking.openURL(`tel:${item.phone}`)}
                          >
                            <Ionicons 
                              name="call" 
                              size={isTablet ? 24 : 20} 
                              color="#0aa04dff" 
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  item.location || ""
                                )}`
                              )
                            }
                          >
                            <Ionicons
                              name="location-sharp"
                              size={isTablet ? 24 : 20}
                              color="#ca0c0cff"
                              style={{ marginLeft: 15 }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />

              {/* Show See More only if there are more than 2 items */}
              {templePlaces.length > 2 && (
                <TouchableOpacity
                  style={[styles.toggleButton, isTablet && styles.toggleButtonTablet]}
                  onPress={() =>
                    navigation.navigate("DistrictCategorysPage1", {
                      districtId,
                      categoryName: "Temple",
                    })
                  }
                >
                  <Text style={[styles.toggleButtonText, isTablet && styles.toggleButtonTextTablet]}>
                    See More
                  </Text>
                  <Ionicons 
                    name="chevron-forward" 
                    size={isTablet ? 20 : 16} 
                    color="#93210A" 
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Videos */}
          <View style={styles.videoContainer}>
            <Text style={[styles.sectionTitle1, isTablet && styles.sectionTitle1Tablet]}>
              District Videos
            </Text>
            {videoIds.length > 0 ? (
              videoIds.map((id, index) => (
                <View key={index} style={[styles.videoWrapper, isTablet && styles.videoWrapperTablet]}>
                  <YoutubePlayer
                    height={isTablet ? 350 : 210}
                    width={isTablet ? 750 : 370}
                    play={playing}
                    videoId={id}
                    onChangeState={(state) => setPlaying(state === "playing")}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.noVideoText}>No video available</Text>
            )}
          </View>
        </ScrollView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  banner: { width: "100%", justifyContent: "flex-end" },
  arrowButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
    padding: 6,
    zIndex: 999,
    elevation: 6,
  },
  arrowButtonTablet: {
    top: 60,
    left: 30,
    padding: 8,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.17)",
    width: "100%",
    height: "100%",
    paddingVertical: 80,
    position: "absolute",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    left: 90,
    bottom: 20,
  },
  
  // Translate Button Styles
  translateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    marginTop: 15,
    marginLeft: 15,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  translateButtonTablet: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginLeft: 30,
    marginTop: 20,
    marginBottom: 15,
  },
  translateText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  translateTextTablet: {
    fontSize: 16,
  },
  
  // Description Styles
  descriptionContainer: {
    margin: 15,
  },
  descriptionContainerTablet: {
    marginHorizontal: 30,
    marginVertical: 20,
  },
  description: {
    lineHeight: 22,
    color: "#333",
    textAlign: "justify",
  },
  descriptionTablet: {
    lineHeight: 29,
    fontSize: 16,
  },
  
  seeMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 5,
    marginRight: 10,
  },
  seeMoreContainerTablet: {
    marginTop: 10,
    marginRight: 20,
  },
  seeMoreText: {
    color: "#93210A",
    fontWeight: "bold",
    fontSize: 13,
  },
  seeMoreTextTablet: {
    fontSize: 18,
  },
  
  // Advertisement Styles
  section: {
    marginVertical: 10,
    alignItems: "center",
  },
  adImage: {
    width: screenWidth,
    height: 200,
    borderRadius: 0,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 10,
  },
  adImageTablet: {
    height: 250,
  },
  
  // 🏪 ANIMATED Business Button Container
  businessButtonContainer: {
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  
  // 🏪 Business Button - Premium Design
  businessButton: {
    backgroundColor: "#8B0000", // Changed to match your theme (dark red)
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    elevation: 12,
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    position: "relative",
  },
  businessButtonTablet: {
    paddingVertical: 26,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  
  // Glow effect
  glowEffect: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    blurRadius: 20,
  },
  
  // Icon container with count badge
  businessIconContainer: {
    position: "relative",
    marginRight: 15,
  },
  
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  
  countBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFD700",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  
  countText: {
    color: "#8B0000",
    fontSize: 10,
    fontWeight: "bold",
  },
  
  // Text container
  businessTextContainer: {
    flex: 1,
  },
  
  businessMainText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  businessMainTextTablet: {
    fontSize: 22,
  },
  
  businessSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  
  featureTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  
  featureText: {
    color: "#fff",
    fontSize: 11,
    marginLeft: 4,
    fontWeight: "600",
  },
  
  businessSubText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
  businessSubTextTablet: {
    fontSize: 15,
  },
  
  // Arrow container
  businessArrowContainer: {
    alignItems: "center",
    marginLeft: 10,
  },
  
  exploreText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  
  // Decorative elements
  decorativeDot1: {
    position: "absolute",
    top: 15,
    right: 70,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  
  decorativeDot2: {
    position: "absolute",
    bottom: 15,
    right: 100,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 215, 0, 0.4)",
  },
  
  // 🏛️ TWO Buttons Container - Government & Parties
  twoButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
  },
  twoButtonsContainerTablet: {
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  
  govButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 14,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  govButtonTablet: {
    paddingVertical: 18,
    borderRadius: 12,
  },
  
  partyButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 14,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  partyButtonTablet: {
    paddingVertical: 18,
    borderRadius: 12,
  },
  
  twoButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  twoButtonTextTablet: {
    fontSize: 18,
    fontWeight: "800",
  },
  
  // 📋 THREE Buttons Row - Complaint, HDRSS, Gallery
  threeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  threeButtonsContainerTablet: {
    marginHorizontal: 30,
    marginTop: 15,
    marginBottom: 25,
  },
  
  complaintButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 14,
    borderRadius: 8,
    width: "32%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  complaintButtonTablet: {
    paddingVertical: 18,
    borderRadius: 12,
  },
  
  hdrssButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 14,
    borderRadius: 8,
    width: "32%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  hdrssButtonTablet: {
    paddingVertical: 18,
    borderRadius: 12,
  },
  
  galleryButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 14,
    borderRadius: 8,
    width: "32%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  galleryButtonTablet: {
    paddingVertical: 18,
    borderRadius: 12,
  },
  
  threeButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  threeButtonTextTablet: {
    fontSize: 16,
    fontWeight: "800",
  },
  
  // Section Titles
  section: { 
    marginTop: 20, 
    marginBottom: 10 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 10,
    left: 140,
  },
  sectionTitleTablet: {
    fontSize: 24,
    left: 280,
    marginVertical: 15,
  },
  
  sectionTitle1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 10,
    left: 11,
  },
  sectionTitle1Tablet: {
    fontSize: 26,
    right: -350,
    marginVertical: 15,
  },
  
  // Tourism Card - Mobile
  tourismCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: "#8c8c8c", 
    elevation: 25,
    shadowColor: "#8B4513", 
    shadowOpacity: 0.7, 
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 14, 
  },
  // Tourism Card - Tablet
  tourismCardTablet: {
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 16,
  },
  
  // Temple Card - Mobile
  templeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff", 
    borderRadius: 22,
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 18,
    borderWidth: 3,
    borderColor: "#c0c0c0", 
    elevation: 45, 
    shadowColor: "#ffb84d", 
    shadowOpacity: 0.9,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 40,
    shadowColor: "#ffd966", 
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 55,
    transform: [{ scale: 1.03 }, { translateY: -2 }],
  },
  // Temple Card - Tablet
  templeCardTablet: {
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 24,
  },
  
  // Circle Image - Mobile
  circleImage: {
    width: 100,
    height: 100,
    borderRadius: 45,
    backgroundColor: "#eee",
    marginHorizontal: 5,
  },
  // Circle Image - Tablet
  circleImageTablet: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginHorizontal: 10,
  },
  
  textContainer: { 
    flex: 1, 
    justifyContent: "center" 
  },
  
  // Place Name - Mobile
  placeName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  // Place Name - Tablet
  placeNameTablet: {
    fontSize: 18,
    marginBottom: 6,
  },
  
  // Place Description - Mobile
  placeDescription: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    marginBottom: 8,
  },
  placeDescriptionTablet: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 5,
    marginRight: 10,
  },
  toggleButtonText: {
    color: "#93210A",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 6,
  },
  toggleButtonTextTablet: {
    fontSize: 18,
  },
  
  // Video Styles
  videoContainer: {
    padding: 15,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  videoWrapper: {
    marginVertical: 30,
  },
  videoWrapperTablet: {
    marginVertical: 40,
    marginHorizontal: 800,
  },
  noVideoText: {
    textAlign: "center",
    color: "#555",
    marginTop: 10,
  },
});