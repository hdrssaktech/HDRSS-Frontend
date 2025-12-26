// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   Image,
// //   ScrollView,
// //   TouchableOpacity,
// //   Linking,
// //   StyleSheet,
// //   Dimensions
// // } from "react-native";
// // import { Ionicons, FontAwesome } from "@expo/vector-icons";
// // import { WebView } from "react-native-webview";

// // const { width } = Dimensions.get("window");

// // export default function DistrictBusinessPage4({ route, navigation }) {
// //   const item = route.params?.item || {};

// //   const [isExpanded, setIsExpanded] = useState(false);

// //   // Safe data
// //   const imageUrl = item.imageUrl || "";
// //   const bannerUrl = item.bannerUrl || "";
// //   const gallery = Array.isArray(item.gallery) ? item.gallery : [];
// //   const phone = item.phoneNo || "";
// //   const whatsapp = item.whatsappNo || "";
// //   const mapUrl = item.mapUrl || "";
// //   const description = item.description || "";
// //   const price = item.price || "";
// //   const type = item.type || "";
// //   const youtubeLink = item.videoUrl || ""; // YouTube URL

// //   // Actions
// //   const openDialer = (num) => {
// //     if (!num) return;
// //     Linking.openURL(`tel:${num}`);
// //   };

// //   const openWhatsApp = (num) => {
// //     if (!num) return;
// //     Linking.openURL(`https://wa.me/${num}`);
// //   };

// //   const openMap = (url) => {
// //     if (!url) return;
// //     Linking.openURL(url);
// //   };

// //   // Helper function to convert YouTube URL to embed URL
// // const getEmbedUrl = (url) => {
// //   if (!url) return "";
  
// //   // Extract video ID from various YouTube URL formats
// //   let videoId = "";
  
// //   // Handle youtube.com/watch?v=VIDEO_ID
// //   if (url.includes("youtube.com/watch?v=")) {
// //     videoId = url.split("v=")[1]?.split("&")[0];
// //   }
// //   // Handle youtu.be/VIDEO_ID
// //   else if (url.includes("youtu.be/")) {
// //     videoId = url.split("youtu.be/")[1]?.split("?")[0];
// //   }
// //   // Handle youtube.com/embed/VIDEO_ID
// //   else if (url.includes("youtube.com/embed/")) {
// //     return url; // Already an embed URL
// //   }
  
// //   return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
// // };

// //   return (
// //     <View style={styles.screen}>
// //       {/* Top AppBar */}
// //       <View style={styles.appBarWrapper}>
// //         <View style={styles.appBarGradient}>
// //           <TouchableOpacity
// //             style={styles.backBtn}
// //             onPress={() => navigation.goBack()}
// //           >
// //             <Ionicons name="arrow-back" size={22} color="#fff" />
// //           </TouchableOpacity>

// //           <Text style={styles.appBarTitle}>Product Details</Text>
// //           <View style={{ width: 40 }} />
// //         </View>
// //       </View>

// //       <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
// //         {/* Banner */}
// //         <View style={styles.bannerContainer}>
// //           {bannerUrl ? (
// //             <Image source={{ uri: bannerUrl }} style={styles.bannerImage} />
// //           ) : (
// //             <View
// //               style={[styles.bannerImage, { backgroundColor: "#f1f1f1" }]}
// //             />
// //           )}

// //           {/* Round product image */}
// //           <View style={styles.circleWrapper}>
// //             <View style={styles.circleBorder}>
// //               {imageUrl ? (
// //                 <Image source={{ uri: imageUrl }} style={styles.circleImage} />
// //               ) : (
// //                 <View style={[styles.circleImage, styles.emptyImage]}>
// //                   <Ionicons name="image" size={48} color="#ccc" />
// //                 </View>
// //               )}
// //             </View>
// //           </View>
// //         </View>

// //         <View style={{ height: 70 }} />

// //         {/* Product Card */}
// //         <View style={styles.cardContainer}>
// //           <View style={styles.card}>
// //             <Text style={styles.productName}>
// //               {item.name || "Product Name"}
// //             </Text>

// //             <Text style={styles.priceText}>₹{price || "0"}</Text>

// //             {/* Action Buttons */}
// //             <View style={styles.actionRow}>
// //               {/* Call */}
// //               <TouchableOpacity
// //                 onPress={() => openDialer(phone)}
// //                 style={styles.actionBtn}
// //               >
// //                 <View
// //                   style={[styles.actionIcon, { backgroundColor: "#BEE3FF" }]}
// //                 >
// //                   <FontAwesome name="phone" size={18} color="#0077CC" />
// //                 </View>
// //                 <Text style={styles.actionLabel}>Call</Text>
// //               </TouchableOpacity>

// //               {/* WhatsApp */}
// //               <TouchableOpacity
// //                 onPress={() => openWhatsApp(whatsapp || phone)}
// //                 style={styles.actionBtn}
// //               >
// //                 <View
// //                   style={[styles.actionIcon, { backgroundColor: "#E6F7EE" }]}
// //                 >
// //                   <FontAwesome name="whatsapp" size={18} color="#25D366" />
// //                 </View>
// //                 <Text style={styles.actionLabel}>WhatsApp</Text>
// //               </TouchableOpacity>

// //               {/* Map */}
// //               <TouchableOpacity
// //                 onPress={() => openMap(mapUrl)}
// //                 style={styles.actionBtn}
// //               >
// //                 <View
// //                   style={[styles.actionIcon, { backgroundColor: "#FFF1E6" }]}
// //                 >
// //                   <FontAwesome name="map-marker" size={18} color="#FF5722" />
// //                 </View>
// //                 <Text style={styles.actionLabel}>Map</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>

// //         {/* About Section */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>About</Text>

// //           <Text
// //             numberOfLines={isExpanded ? undefined : 3}
// //             style={styles.sectionText}
// //           >
// //             {description || "No description available."}
// //           </Text>

// //           {(description || "").length > 120 && (
// //             <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
// //               <Text style={styles.readMoreText}>
// //                 {isExpanded ? "Show less" : "Read more"}
// //               </Text>
// //             </TouchableOpacity>
// //           )}
// //         </View>

// //         {/* Type & Price */}
// //         <View style={[styles.section, styles.typeRow]}>
// //           <View style={styles.infoPill}>
// //             <Text style={styles.infoPillText}>Type: {type || "-"}</Text>
// //           </View>

// //           <View style={styles.infoPill}>
// //             <Text style={styles.infoPillText}>Price: ₹{price || "-"}</Text>
// //           </View>
// //         </View>

// //         {/* Inline YouTube Player */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Video</Text>

// //           {youtubeLink ? (
// //             <View style={styles.videoWrapper}>
// //               <WebView
// //                 source={{ uri: getEmbedUrl(youtubeLink) }}
// //                 style={styles.video}
// //                 javaScriptEnabled
// //                 domStorageEnabled
// //                 allowsFullscreenVideo
// //               />
// //             </View>
// //           ) : (
// //             <Text style={{ color: "#777", marginTop: 10 }}>
// //               Video is not available.
// //             </Text>
// //           )}
// //         </View>

// //         {/* Gallery */}
// //         {gallery.length > 0 && (
// //           <View style={styles.section}>
// //             <Text style={styles.sectionTitle}>Gallery</Text>

// //             <ScrollView
// //               horizontal
// //               showsHorizontalScrollIndicator={false}
// //               style={{ marginTop: 12 }}
// //             >
// //               {gallery.map((img, i) => (
// //                 <Image
// //                   key={i}
// //                   source={{ uri: img }}
// //                   style={styles.galleryImage}
// //                 />
// //               ))}
// //             </ScrollView>
// //           </View>
// //         )}
// //       </ScrollView>

// //       {/* <View style={styles.footer}>
// //         <Text style={{ color: "#666" }}>© Your App Name</Text>
// //       </View> */}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   screen: { flex: 1, backgroundColor: "#fff" },

// //   appBarWrapper: { height: 90 },
// //   appBarGradient: {
// //     flex: 1,
// //     paddingTop: 30,
// //     paddingHorizontal: 12,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     backgroundColor: "#93210A",
// //   },
// //   appBarTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
// //   backBtn: {
// //     width: 40,
// //     height: 36,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },

// //   bannerContainer: { height: 200, position: "relative" },
// //   bannerImage: { width: "100%", height: "100%", resizeMode: "cover" },
// //   circleWrapper: { position: "absolute", left: width / 2 - 60, bottom: -60 },
// //   circleBorder: {
// //     width: 120,
// //     height: 120,
// //     borderRadius: 16,
// //     borderWidth: 4,
// //     borderColor: "#fff",
// //     overflow: "hidden",
// //     backgroundColor: "#fff",
// //     elevation: 6,
// //   },
// //   circleImage: { width: "100%", height: "100%" },
// //   emptyImage: { justifyContent: "center", alignItems: "center" },

// //   cardContainer: { paddingHorizontal: 20 },
// //   card: {
// //     backgroundColor: "#fff",
// //     borderRadius: 16,
// //     padding: 16,
// //     paddingTop: 28,
// //     elevation: 4,
// //   },
// //   productName: { fontSize: 22, fontWeight: "700", textAlign: "center" },
// //   priceText: {
// //     color: "green",
// //     fontSize: 20,
// //     fontWeight: "700",
// //     textAlign: "center",
// //     marginTop: 6,
// //   },

// //   actionRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginTop: 16,
// //   },
// //   actionBtn: { alignItems: "center", flex: 1, marginHorizontal: 6 },
// //   actionIcon: {
// //     width: 52,
// //     height: 52,
// //     borderRadius: 10,
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   actionLabel: { marginTop: 8, fontSize: 12, fontWeight: "600" },

// //   section: { paddingHorizontal: 20, marginTop: 18 },
// //   sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
// //   sectionText: { fontSize: 15, lineHeight: 20, color: "#444" },
// //   readMoreText: { color: "#E53935", marginTop: 8, fontWeight: "700" },

// //   typeRow: { flexDirection: "row", justifyContent: "space-between" },
// //   infoPill: {
// //     backgroundColor: "#F6F6F6",
// //     paddingVertical: 10,
// //     paddingHorizontal: 16,
// //     borderRadius: 12,
// //   },
// //   infoPillText: { fontWeight: "700" },

// //   videoWrapper: {
// //     width: "100%",
// //     height: 220,
// //     borderRadius: 12,
// //     overflow: "hidden",
// //     backgroundColor: "#000",
// //   },
// //   video: { width: "100%", height: "100%" },

// //   galleryImage: {
// //     width: 140,
// //     height: 140,
// //     marginRight: 12,
// //     borderRadius: 12,
// //   },

// //   footer: {
// //     height: 56,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderTopWidth: 1,
// //     borderColor: "#eee",
// //   },
// // });



// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Linking,
//   StyleSheet,
//   Dimensions,
//   StatusBar,
//   Platform,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons, FontAwesome } from "@expo/vector-icons";
// import { WebView } from "react-native-webview";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// const isTablet = screenWidth >= 600;
// const isLargeTablet = screenWidth >= 1024;

// export default function DistrictBusinessPage4({ route, navigation }) {
//   const item = route.params?.item || {};

//   const [isExpanded, setIsExpanded] = useState(false);

//   // Safe data extraction with fallbacks
//   const imageUrl = item.imageUrl || "";
//   const bannerUrl = item.bannerUrl || "";
//   const gallery = Array.isArray(item.gallery) ? item.gallery : [];
//   const phone = item.phoneNo || "";
//   const whatsapp = item.whatsappNo || "";
//   const mapUrl = item.mapUrl || "";
//   const description = item.description || "";
//   const price = item.price || "";
//   const type = item.type || "";
//   const youtubeLink = item.videoUrl || "";
//   const productName = item.name || "Product Name";

//   // Action handlers
//   const openDialer = (num) => {
//     if (!num) return;
//     Linking.openURL(`tel:${num}`);
//   };

//   const openWhatsApp = (num) => {
//     if (!num) return;
//     const phoneNumber = num.replace(/\D/g, "");
//     Linking.openURL(`https://wa.me/${phoneNumber}`);
//   };

//   const openMap = (url) => {
//     if (!url) return;
//     Linking.openURL(url);
//   };

//   // YouTube URL to embed URL converter
//   const getEmbedUrl = (url) => {
//     if (!url) return "";
    
//     let videoId = "";
    
//     if (url.includes("youtube.com/watch?v=")) {
//       videoId = url.split("v=")[1]?.split("&")[0];
//     }
//     else if (url.includes("youtu.be/")) {
//       videoId = url.split("youtu.be/")[1]?.split("?")[0];
//     }
//     else if (url.includes("youtube.com/embed/")) {
//       return url;
//     }
    
//     return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
//   };

//   // Responsive dimensions
//   const responsive = {
//     // AppBar
//     appBarHeight: isTablet ? (isLargeTablet ? 100 : 90) : 80,
//     appBarPaddingTop: Platform.OS === 'ios' ? (isTablet ? 50 : 40) : 30,
//     backIconSize: isTablet ? (isLargeTablet ? 28 : 26) : 24,
//     appBarTitleSize: isTablet ? (isLargeTablet ? 24 : 22) : 20,
    
//     // Banner
//     bannerHeight: isTablet ? (isLargeTablet ? 280 : 240) : 200,
//     circleImageSize: isTablet ? (isLargeTablet ? 160 : 140) : 120,
    
//     // Text
//     productNameSize: isTablet ? (isLargeTablet ? 28 : 26) : 22,
//     priceSize: isTablet ? (isLargeTablet ? 26 : 24) : 20,
//     sectionTitleSize: isTablet ? (isLargeTablet ? 24 : 22) : 18,
//     bodyTextSize: isTablet ? (isLargeTablet ? 18 : 17) : 15,
    
//     // Icons
//     actionIconSize: isTablet ? (isLargeTablet ? 68 : 64) : 56,
//     actionIconInnerSize: isTablet ? (isLargeTablet ? 26 : 24) : 20,
    
//     // Video
//     videoHeight: isTablet ? (isLargeTablet ? 320 : 280) : 220,
    
//     // Gallery
//     galleryImageSize: isTablet ? (isLargeTablet ? 200 : 180) : 140,
//     galleryMargin: isTablet ? 16 : 12,
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
//       {/* AppBar */}
//       <View style={[styles.appBar, { height: responsive.appBarHeight }]}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//           activeOpacity={0.7}
//         >
//           <Ionicons name="arrow-back" size={responsive.backIconSize} color="#FFF" />
//         </TouchableOpacity>
        
//         <Text style={[styles.appBarTitle, { fontSize: responsive.appBarTitleSize }]}>
//           Product Details
//         </Text>
        
//         <View style={styles.rightPlaceholder} />
//       </View>

//       <ScrollView 
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Banner Section */}
//         <View style={[styles.bannerContainer, { height: responsive.bannerHeight }]}>
//           {bannerUrl ? (
//             <Image 
//               source={{ uri: bannerUrl }} 
//               style={styles.bannerImage}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={styles.placeholderBanner}>
//               <Ionicons name="images" size={isTablet ? 48 : 40} color="#CCCCCC" />
//             </View>
//           )}
          
//           {/* Circular Product Image Overlay */}
//           <View style={[
//             styles.circleImageContainer,
//             { 
//               top: responsive.bannerHeight - (responsive.circleImageSize / 2),
//               width: responsive.circleImageSize,
//               height: responsive.circleImageSize,
//               borderRadius: responsive.circleImageSize / 2,
//             }
//           ]}>
//             <View style={[
//               styles.circleImageWrapper,
//               { 
//                 width: responsive.circleImageSize - 8,
//                 height: responsive.circleImageSize - 8,
//                 borderRadius: (responsive.circleImageSize - 8) / 2,
//               }
//             ]}>
//               {imageUrl ? (
//                 <Image 
//                   source={{ uri: imageUrl }} 
//                   style={styles.circleImage}
//                   resizeMode="cover"
//                 />
//               ) : (
//                 <View style={styles.placeholderCircleImage}>
//                   <Ionicons name="image" size={isTablet ? 56 : 48} color="#CCCCCC" />
//                 </View>
//               )}
//             </View>
//           </View>
//         </View>

//         {/* Product Info Card */}
//         <View style={[styles.productCard, isTablet && styles.productCardTablet]}>
//           <View style={styles.productInfo}>
//             <Text style={[styles.productName, { fontSize: responsive.productNameSize }]}>
//               {productName}
//             </Text>
//             <Text style={[styles.productPrice, { fontSize: responsive.priceSize }]}>
//               ₹{price || "0"}
//             </Text>
//           </View>

//           {/* Action Buttons */}
//           <View style={[styles.actionButtons, isTablet && styles.actionButtonsTablet]}>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => openDialer(phone)}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
//                 <FontAwesome 
//                   name="phone" 
//                   size={responsive.actionIconInnerSize} 
//                   color="#1976D2" 
//                 />
//               </View>
//               <Text style={styles.actionLabel}>Call</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => openWhatsApp(whatsapp || phone)}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
//                 <FontAwesome 
//                   name="whatsapp" 
//                   size={responsive.actionIconInnerSize} 
//                   color="#4CAF50" 
//                 />
//               </View>
//               <Text style={styles.actionLabel}>WhatsApp</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => openMap(mapUrl)}
//               activeOpacity={0.7}
//             >
//               <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
//                 <FontAwesome 
//                   name="map-marker" 
//                   size={responsive.actionIconInnerSize} 
//                   color="#FF9800" 
//                 />
//               </View>
//               <Text style={styles.actionLabel}>Map</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* About Section */}
//         <View style={[styles.section, isTablet && styles.sectionTablet]}>
//           <Text style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}>
//             About
//           </Text>
//           <Text 
//             style={[styles.sectionText, { fontSize: responsive.bodyTextSize }]}
//             numberOfLines={isExpanded ? undefined : 3}
//           >
//             {description || "No description available."}
//           </Text>
          
//           {description.length > 100 && (
//             <TouchableOpacity 
//               onPress={() => setIsExpanded(!isExpanded)}
//               style={styles.readMoreButton}
//               activeOpacity={0.7}
//             >
//               <Text style={styles.readMoreText}>
//                 {isExpanded ? "Show Less" : "Read More"}
//               </Text>
//               <Ionicons 
//                 name={isExpanded ? "chevron-up" : "chevron-down"} 
//                 size={16} 
//                 color="#D32F2F" 
//               />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Info Cards */}
//         <View style={[styles.infoCards, isTablet && styles.infoCardsTablet]}>
//           <View style={[styles.infoCard, isTablet && styles.infoCardTablet]}>
//             <Text style={[styles.infoCardLabel, isTablet && styles.infoCardLabelTablet]}>
//               Type
//             </Text>
//             <Text style={[styles.infoCardValue, isTablet && styles.infoCardValueTablet]}>
//               {type || "Not specified"}
//             </Text>
//           </View>
          
//           <View style={[styles.infoCard, isTablet && styles.infoCardTablet]}>
//             <Text style={[styles.infoCardLabel, isTablet && styles.infoCardLabelTablet]}>
//               Price
//             </Text>
//             <Text style={[styles.infoCardValue, isTablet && styles.infoCardValueTablet]}>
//               ₹{price || "0"}
//             </Text>
//           </View>
//         </View>

//         {/* Video Section */}
//         <View style={[styles.section, isTablet && styles.sectionTablet]}>
//           <Text style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}>
//             Video
//           </Text>
          
//           {youtubeLink ? (
//             <View style={[styles.videoContainer, { height: responsive.videoHeight }]}>
//               <WebView
//                 source={{ uri: getEmbedUrl(youtubeLink) }}
//                 style={styles.videoPlayer}
//                 javaScriptEnabled={true}
//                 domStorageEnabled={true}
//                 allowsFullscreenVideo={true}
//                 startInLoadingState={true}
//                 scalesPageToFit={true}
//               />
//             </View>
//           ) : (
//             <View style={styles.noVideoContainer}>
//               <Ionicons name="videocam-off" size={isTablet ? 48 : 40} color="#9E9E9E" />
//               <Text style={[styles.noVideoText, isTablet && styles.noVideoTextTablet]}>
//                 No video available
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Gallery Section */}
//         {gallery.length > 0 && (
//           <View style={[styles.section, isTablet && styles.sectionTablet]}>
//             <Text style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}>
//               Gallery ({gallery.length})
//             </Text>
            
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.galleryScrollContent}
//             >
//               {gallery.map((imageUri, index) => (
//                 <View key={index} style={[styles.galleryItem, { marginRight: responsive.galleryMargin }]}>
//                   <Image
//                     source={{ uri: imageUri }}
//                     style={[
//                       styles.galleryImage,
//                       { 
//                         width: responsive.galleryImageSize,
//                         height: responsive.galleryImageSize 
//                       }
//                     ]}
//                     resizeMode="cover"
//                   />
//                 </View>
//               ))}
//             </ScrollView>
//           </View>
//         )}
        
//         {/* Bottom Spacing */}
//         <View style={styles.bottomSpacing} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
  
//   // AppBar Styles
//   appBar: {
//     backgroundColor: '#93210A',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   appBarTitle: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//     textAlign: 'center',
//     flex: 1,
//   },
//   rightPlaceholder: {
//     width: 40,
//   },
  
//   // Scroll View
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 30,
//   },
  
//   // Banner Section
//   bannerContainer: {
//     position: 'relative',
//     backgroundColor: '#F5F5F5',
//   },
//   bannerImage: {
//     width: '100%',
//     height: '100%',
//   },
//   placeholderBanner: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#EEEEEE',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   circleImageContainer: {
//     position: 'absolute',
//     alignSelf: 'center',
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//   },
//   circleImageWrapper: {
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//     borderWidth: 3,
//     borderColor: '#FFFFFF',
//   },
//   circleImage: {
//     width: '100%',
//     height: '100%',
//   },
//   placeholderCircleImage: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#FAFAFA',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   // Product Card
//   productCard: {
//     backgroundColor: '#FFFFFF',
//     marginTop: 70,
//     marginHorizontal: 16,
//     borderRadius: 16,
//     padding: 20,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//   },
//   productCardTablet: {
//     marginHorizontal: 32,
//     marginTop: 80,
//     padding: 28,
//     borderRadius: 20,
//   },
//   productInfo: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   productName: {
//     fontWeight: '700',
//     color: '#212121',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   productPrice: {
//     fontWeight: '700',
//     color: '#388E3C',
//     textAlign: 'center',
//   },
  
//   // Action Buttons
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 8,
//   },
//   actionButtonsTablet: {
//     paddingHorizontal: 20,
//   },
//   actionButton: {
//     alignItems: 'center',
//     flex: 1,
//     marginHorizontal: 6,
//   },
//   actionIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   actionLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#424242',
//   },
  
//   // Section Styles
//   section: {
//     marginTop: 24,
//     paddingHorizontal: 16,
//   },
//   sectionTablet: {
//     paddingHorizontal: 32,
//     marginTop: 32,
//   },
//   sectionTitle: {
//     fontWeight: '700',
//     color: '#212121',
//     marginBottom: 12,
//   },
//   sectionText: {
//     color: '#424242',
//     lineHeight: 22,
//   },
  
//   // Read More Button
//   readMoreButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//     alignSelf: 'flex-start',
//   },
//   readMoreText: {
//     color: '#D32F2F',
//     fontWeight: '600',
//     marginRight: 4,
//   },
  
//   // Info Cards
//   infoCards: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     marginTop: 20,
//   },
//   infoCardsTablet: {
//     paddingHorizontal: 32,
//     justifyContent: 'space-around',
//   },
//   infoCard: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: 6,
//     alignItems: 'center',
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//   },
//   infoCardTablet: {
//     padding: 20,
//     borderRadius: 16,
//     marginHorizontal: 10,
//   },
//   infoCardLabel: {
//     fontSize: 12,
//     color: '#757575',
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   infoCardLabelTablet: {
//     fontSize: 14,
//   },
//   infoCardValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#212121',
//   },
//   infoCardValueTablet: {
//     fontSize: 18,
//   },
  
//   // Video Section
//   videoContainer: {
//     width: '100%',
//     borderRadius: 12,
//     overflow: 'hidden',
//     backgroundColor: '#000',
//     marginTop: 8,
//   },
//   videoPlayer: {
//     flex: 1,
//   },
//   noVideoContainer: {
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     padding: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 8,
//   },
//   noVideoText: {
//     color: '#9E9E9E',
//     fontSize: 14,
//     marginTop: 12,
//     textAlign: 'center',
//   },
//   noVideoTextTablet: {
//     fontSize: 16,
//   },
  
//   // Gallery Section
//   galleryScrollContent: {
//     paddingRight: 16,
//   },
//   galleryItem: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   galleryImage: {
//     borderRadius: 12,
//   },
  
//   // Bottom Spacing
//   bottomSpacing: {
//     height: 30,
//   },
// });








import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 600;

export default function DistrictBusinessPage4({ route, navigation }) {
  const item = route.params?.item || {};

  const [isExpanded, setIsExpanded] = useState(false);

  // Safe data extraction
  const imageUrl = item.imageUrl || "";
  const bannerUrl = item.bannerUrl || "";
  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  const phone = item.phoneNo || "";
  const whatsapp = item.whatsappNo || "";
  const mapUrl = item.mapUrl || "";
  const description = item.description || "";
  const price = item.price || "";
  const type = item.type || "";
  const youtubeLink = item.videoUrl || "";

  // Actions
  const openDialer = (num) => {
    if (!num) return;
    Linking.openURL(`tel:${num}`);
  };

  const openWhatsApp = (num) => {
    if (!num) return;
    Linking.openURL(`https://wa.me/${num}`);
  };

  const openMap = (url) => {
    if (!url) return;
    Linking.openURL(url);
  };

  // YouTube URL to embed URL converter
  const getEmbedUrl = (url) => {
    if (!url) return "";
    
    let videoId = "";
    
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    }
    else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* Top AppBar */}
      <View style={[styles.appBarWrapper, isTablet && styles.appBarWrapperTablet]}>
        <View style={[styles.appBarGradient, isTablet && styles.appBarGradientTablet]}>
          <TouchableOpacity
            style={[styles.backBtn, isTablet && styles.backBtnTablet]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={isTablet ? 26 : 22} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.appBarTitle, isTablet && styles.appBarTitleTablet]}>
            Product Details
          </Text>
          <View style={{ width: isTablet ? 50 : 40 }} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Section */}
        <View style={[styles.bannerContainer, isTablet && styles.bannerContainerTablet]}>
          {bannerUrl ? (
            <Image source={{ uri: bannerUrl }} style={styles.bannerImage} />
          ) : (
            <View style={[styles.bannerImage, styles.emptyBanner]} />
          )}

          {/* Product Image Overlay */}
          <View style={[
            styles.circleWrapper, 
            isTablet && styles.circleWrapperTablet
          ]}>
            <View style={[
              styles.circleBorder, 
              isTablet && styles.circleBorderTablet
            ]}>
              {imageUrl ? (
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.circleImage} 
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.circleImage, styles.emptyImage]}>
                  <Ionicons 
                    name="image" 
                    size={isTablet ? 52 : 44} 
                    color="#ccc" 
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={{ height: isTablet ? 80 : 70 }} />

        {/* Product Card */}
        <View style={[styles.cardContainer, isTablet && styles.cardContainerTablet]}>
          <View style={[styles.card, isTablet && styles.cardTablet]}>
            <Text style={[styles.productName, isTablet && styles.productNameTablet]}>
              {item.name || "Product Name"}
            </Text>

            <Text style={[styles.priceText, isTablet && styles.priceTextTablet]}>
              ₹{price || "0"}
            </Text>

            {/* Action Buttons Row */}
            <View style={[styles.actionRow, isTablet && styles.actionRowTablet]}>
              {/* Call Button */}
              <TouchableOpacity
                onPress={() => openDialer(phone)}
                style={[styles.actionBtn, isTablet && styles.actionBtnTablet]}
              >
                <View
                  style={[
                    styles.actionIcon, 
                    isTablet && styles.actionIconTablet,
                    { backgroundColor: "#BEE3FF" }
                  ]}
                >
                  <FontAwesome 
                    name="phone" 
                    size={isTablet ? 22 : 18} 
                    color="#0077CC" 
                  />
                </View>
                <Text style={[styles.actionLabel, isTablet && styles.actionLabelTablet]}>
                  Call
                </Text>
              </TouchableOpacity>

              {/* WhatsApp Button */}
              <TouchableOpacity
                onPress={() => openWhatsApp(whatsapp || phone)}
                style={[styles.actionBtn, isTablet && styles.actionBtnTablet]}
              >
                <View
                  style={[
                    styles.actionIcon, 
                    isTablet && styles.actionIconTablet,
                    { backgroundColor: "#E6F7EE" }
                  ]}
                >
                  <FontAwesome 
                    name="whatsapp" 
                    size={isTablet ? 22 : 18} 
                    color="#25D366" 
                  />
                </View>
                <Text style={[styles.actionLabel, isTablet && styles.actionLabelTablet]}>
                  WhatsApp
                </Text>
              </TouchableOpacity>

              {/* Map Button */}
              <TouchableOpacity
                onPress={() => openMap(mapUrl)}
                style={[styles.actionBtn, isTablet && styles.actionBtnTablet]}
              >
                <View
                  style={[
                    styles.actionIcon, 
                    isTablet && styles.actionIconTablet,
                    { backgroundColor: "#FFF1E6" }
                  ]}
                >
                  <FontAwesome 
                    name="map-marker" 
                    size={isTablet ? 22 : 18} 
                    color="#FF5722" 
                  />
                </View>
                <Text style={[styles.actionLabel, isTablet && styles.actionLabelTablet]}>
                  Map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            About
          </Text>

          <Text
            numberOfLines={isExpanded ? undefined : 3}
            style={[styles.sectionText, isTablet && styles.sectionTextTablet]}
          >
            {description || "No description available."}
          </Text>

          {(description || "").length > 120 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={[styles.readMoreText, isTablet && styles.readMoreTextTablet]}>
                {isExpanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Type & Price Info Cards */}
        <View style={[styles.section, styles.typeRow, isTablet && styles.typeRowTablet]}>
          <View style={[styles.infoPill, isTablet && styles.infoPillTablet]}>
            <Text style={[styles.infoPillText, isTablet && styles.infoPillTextTablet]}>
              Type: {type || "-"}
            </Text>
          </View>

          <View style={[styles.infoPill, isTablet && styles.infoPillTablet]}>
            <Text style={[styles.infoPillText, isTablet && styles.infoPillTextTablet]}>
              Price: ₹{price || "-"}
            </Text>
          </View>
        </View>

        {/* Video Section */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Video
          </Text>

          {youtubeLink ? (
            <View style={[styles.videoWrapper, isTablet && styles.videoWrapperTablet]}>
              <WebView
                source={{ uri: getEmbedUrl(youtubeLink) }}
                style={styles.video}
                javaScriptEnabled
                domStorageEnabled
                allowsFullscreenVideo
              />
            </View>
          ) : (
            <Text style={[styles.noVideoText, isTablet && styles.noVideoTextTablet]}>
              Video is not available.
            </Text>
          )}
        </View>

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
              Gallery
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.galleryScroll, isTablet && styles.galleryScrollTablet]}
            >
              {gallery.map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: img }}
                  style={[styles.galleryImage, isTablet && styles.galleryImageTablet]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ============ MOBILE STYLES ============
  screen: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },

  // AppBar - Mobile
  appBarWrapper: { 
    height: 90 
  },
  appBarGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#93210A",
  },
  appBarTitle: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700" 
  },
  backBtn: {
    width: 40,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  // Banner - Mobile
  bannerContainer: { 
    height: 200, 
    position: "relative" 
  },
  bannerImage: { 
    width: "100%", 
    height: "100%", 
    resizeMode: "cover" 
  },
  emptyBanner: { 
    backgroundColor: "#f1f1f1" 
  },
  circleWrapper: { 
    position: "absolute", 
    left: screenWidth / 2 - 60, 
    bottom: -60 
  },
  circleBorder: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  circleImage: { 
    width: "100%", 
    height: "100%" 
  },
  emptyImage: { 
    justifyContent: "center", 
    alignItems: "center" 
  },

  // Card - Mobile
  cardContainer: { 
    paddingHorizontal: 20 
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    paddingTop: 28,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productName: { 
    fontSize: 22, 
    fontWeight: "700", 
    textAlign: "center" 
  },
  priceText: {
    color: "green",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 6,
  },

  // Action Buttons - Mobile
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionBtn: { 
    alignItems: "center", 
    flex: 1, 
    marginHorizontal: 6 
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { 
    marginTop: 8, 
    fontSize: 12, 
    fontWeight: "600" 
  },

  // Section - Mobile
  section: { 
    paddingHorizontal: 20, 
    marginTop: 18 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 8 
  },
  sectionText: { 
    fontSize: 15, 
    lineHeight: 20, 
    color: "#444" 
  },
  readMoreText: { 
    color: "#E53935", 
    marginTop: 8, 
    fontWeight: "700" 
  },

  // Type Row - Mobile
  typeRow: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  infoPill: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  infoPillText: { 
    fontWeight: "700" 
  },

  // Video - Mobile
  videoWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    marginTop: 8,
  },
  video: { 
    width: "100%", 
    height: "100%" 
  },
  noVideoText: {
    color: "#777", 
    marginTop: 10 
  },

  // Gallery - Mobile
  galleryScroll: { 
    marginTop: 12 
  },
  galleryImage: {
    width: 140,
    height: 140,
    marginRight: 12,
    borderRadius: 12,
  },

  // Scroll Content - Mobile
  scrollContent: {
    paddingBottom: 40,
  },

  // ============ TABLET STYLES ============
  
  // AppBar - Tablet
  appBarWrapperTablet: { 
    height: 100 
  },
  appBarGradientTablet: {
    paddingTop: Platform.OS === 'ios' ? 45 : 35,
    paddingHorizontal: 24,
  },
  appBarTitleTablet: { 
    fontSize: 22 
  },
  backBtnTablet: {
    width: 48,
    height: 42,
  },

  // Banner - Tablet
  bannerContainerTablet: { 
    height: 240 
  },
  circleWrapperTablet: { 
    left: screenWidth / 2 - 70, 
    bottom: -70 
  },
  circleBorderTablet: {
    width: 140,
    height: 140,
    borderRadius: 20,
    borderWidth: 5,
    elevation: 8,
  },

  // Card - Tablet
  cardContainerTablet: { 
    paddingHorizontal: 40 
  },
  cardTablet: {
    borderRadius: 20,
    padding: 24,
    paddingTop: 32,
    elevation: 6,
    shadowRadius: 8,
  },
  productNameTablet: { 
    fontSize: 26 
  },
  priceTextTablet: {
    fontSize: 24,
    marginTop: 8,
  },

  // Action Buttons - Tablet
  actionRowTablet: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  actionBtnTablet: {
    marginHorizontal: 8,
  },
  actionIconTablet: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  actionLabelTablet: { 
    marginTop: 10, 
    fontSize: 14 
  },

  // Section - Tablet
  sectionTablet: { 
    paddingHorizontal: 40, 
    marginTop: 24 
  },
  sectionTitleTablet: { 
    fontSize: 22, 
    marginBottom: 12 
  },
  sectionTextTablet: { 
    fontSize: 17, 
    lineHeight: 24 
  },
  readMoreTextTablet: { 
    fontSize: 16, 
    marginTop: 10 
  },

  // Type Row - Tablet
  typeRowTablet: {
    justifyContent: "space-around",
    paddingHorizontal: 60,
  },
  infoPillTablet: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  infoPillTextTablet: { 
    fontSize: 16 
  },

  // Video - Tablet
  videoWrapperTablet: {
    height: 300,
    borderRadius: 16,
   
  },
  noVideoTextTablet: {
    fontSize: 16,
    marginTop: 12,
  },

  // Gallery - Tablet
  galleryScrollTablet: { 
    marginTop: 16 
  },
  galleryImageTablet: {
    width: 180,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
  },

  // Scroll Content - Tablet
  scrollContentTablet: {
    paddingBottom: 50,
  },
});