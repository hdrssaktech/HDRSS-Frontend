// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Dimensions,
//   StatusBar,
//   Platform,
//   SafeAreaView,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from "@expo/vector-icons";

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// const isTablet = screenWidth >= 600;
// const isLargeTablet = screenWidth >= 1024;

// export default function TownBusinessPage() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { town } = route.params;

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch categories for the selected town
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           `https://hdrss-backend.onrender.com/api/tb/business/category/${town.id}`
//         );
//         const json = await response.json();
//         console.log("API RESPONSEs:", json);
//         setData(json || []);
//       } catch (error) {
//         console.log("Fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [town.id]);

//   // Grid layout calculation for mobile and tablet
//   const getGridColumns = () => {
//     if (isLargeTablet) return 4; // 4 columns on large tablets
//     if (isTablet) return 3; // 3 columns on tablets
//     return 2; // 2 columns on mobile
//   };

//   const gridColumns = getGridColumns();

//   // Calculate card width dynamically
//   const getCardWidth = () => {
//     const containerPadding = isTablet ? 48 : 32; // More padding on tablet
//     const totalGap = (gridColumns - 1) * (isTablet ? 16 : 12); // Larger gap on tablet
//     return (screenWidth - containerPadding - totalGap) / gridColumns;
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
//       <View style={styles.container}>
//         {/* Enhanced Header Banner */}
//         <View style={[
//           styles.bannerContainer,
//           { 
//             height: isLargeTablet ? 400 : 
//                    isTablet ? 320 : 
//                    280 
//           }
//         ]}>
//           <Image
//             source={{ uri: town.bannerImage }}
//             style={styles.banner}
//             resizeMode="cover"
//           />
//           <LinearGradient
//             colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
//             locations={[0, 0.6, 1]}
//             style={styles.gradientOverlay}
//           />
          
//           {/* Back Button */}
//           <TouchableOpacity
//             style={[
//               styles.backButton,
//               isTablet && styles.backButtonTablet
//             ]}
//             onPress={() => navigation.goBack()}
//             activeOpacity={0.7}
//           >
//             <Ionicons 
//               name="chevron-back" 
//               size={isTablet ? 32 : 28} 
//               color="#fff" 
//             />
//           </TouchableOpacity>

//           {/* Enhanced Header Content */}
//           <View style={[
//             styles.headerContent,
//             isTablet && styles.headerContentTablet
//           ]}>
//             <View style={[
//               styles.titleContainer,
//               isTablet && styles.titleContainerTablet
//             ]}>
//               <Text style={[
//                 styles.townName,
//                 isTablet && styles.townNameTablet
//               ]}>
//                 {town.townname}
//               </Text>
//               <View style={[
//                 styles.divider,
//                 isTablet && styles.dividerTablet
//               ]} />
//               <Text style={[
//                 styles.subtitle,
//                 isTablet && styles.subtitleTablet
//               ]}>
//                 Discover Local Businesses
//               </Text>
//             </View>
            
//             {/* Stats Bar */}
//             <View style={[
//               styles.statsContainer,
//               isTablet && styles.statsContainerTablet
//             ]}>
//               <View style={styles.statItem}>
//                 <Text style={[
//                   styles.statNumber,
//                   isTablet && styles.statNumberTablet
//                 ]}>
//                   {data.length}
//                 </Text>
//                 <Text style={[
//                   styles.statLabel,
//                   isTablet && styles.statLabelTablet
//                 ]}>
//                   Categories
//                 </Text>
//               </View>
//               <View style={[
//                 styles.statDivider,
//                 isTablet && styles.statDividerTablet
//               ]} />
//               <View style={styles.statItem}>
//                 <Text style={[
//                   styles.statNumber,
//                   isTablet && styles.statNumberTablet
//                 ]}>
//                   50+
//                 </Text>
//                 <Text style={[
//                   styles.statLabel,
//                   isTablet && styles.statLabelTablet
//                 ]}>
//                   Businesses
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Enhanced Content */}
//         <ScrollView 
//           style={styles.content}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={[
//             styles.scrollContent,
//             isTablet && styles.scrollContentTablet
//           ]}
//         >
//           {loading ? (
//             <View style={[
//               styles.loadingContainer,
//               isTablet && styles.loadingContainerTablet
//             ]}>
//               <ActivityIndicator size={isTablet ? "large" : "large"} color="#93210A" />
//               <Text style={[
//                 styles.loadingText,
//                 isTablet && styles.loadingTextTablet
//               ]}>
//                 Loading categories...
//               </Text>
//             </View>
//           ) : data.length > 0 ? (
//             <View style={styles.categoriesContainer}>
//               {/* Enhanced Header */}
//               <View style={[
//                 styles.sectionHeader,
//                 isTablet && styles.sectionHeaderTablet
//               ]}>
//                 <View>
//                   <Text style={[
//                     styles.categoriesTitle,
//                     isTablet && styles.categoriesTitleTablet
//                   ]}>
//                     Explore Categories
//                   </Text>
//                   <Text style={[
//                     styles.categoriesSubtitle,
//                     isTablet && styles.categoriesSubtitleTablet
//                   ]}>
//                     Find the best local businesses in {town.townname}
//                   </Text>
//                 </View>
//               </View>

//               {/* Enhanced Grid Layout */}
//               <View style={[
//                 styles.categoriesGrid,
//                 { 
//                   gap: isLargeTablet ? 20 : 
//                        isTablet ? 16 : 12 
//                 }
//               ]}>
//                 {data.map((item, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={[
//                       styles.categoryCard,
//                       isTablet && styles.categoryCardTablet,
//                       isLargeTablet && styles.categoryCardLargeTablet,
//                       { 
//                         width: getCardWidth(),
//                         height: isLargeTablet ? 220 :
//                                isTablet ? 230 :
//                                170
//                       }
//                     ]}
//                     onPress={() =>
//                       navigation.navigate("TownBusiness2", { subcategoryId: item.id })
//                     }
//                     activeOpacity={0.9}
//                   >
//                     {/* Image Container */}
//                     <View style={[
//                       styles.categoryImageContainer,
//                       {
//                         height: isLargeTablet ? 140 :
//                                isTablet ? 120 :
//                                90
//                       }
//                     ]}>
//                       <Image
//                         source={{ uri: item.image }}
//                         style={styles.categoryImage}
//                         resizeMode="cover"
//                       />
//                       <LinearGradient
//                         colors={['transparent', 'rgba(0,0,0,0.5)']}
//                         style={styles.cardGradient}
//                       />
                      
//                       {/* Category Badge */}
//                       <View style={[
//                         styles.categoryBadge,
//                         isTablet && styles.categoryBadgeTablet
//                       ]}>
//                         <Ionicons 
//                           name="business" 
//                           size={isTablet ? 14 : 10} 
//                           color="#fff" 
//                         />
//                       </View>
//                     </View>
                    
//                     {/* Content */}
//                     <View style={[
//                       styles.categoryContent,
//                       isTablet && styles.categoryContentTablet,
//                       {
//                         padding: isLargeTablet ? 16 :
//                                 isTablet ? 12 : 8
//                       }
//                     ]}>
//                       <Text 
//                         style={[
//                           styles.categoryTitle,
//                           isTablet && styles.categoryTitleTablet,
//                           isLargeTablet && styles.categoryTitleLargeTablet
//                         ]}
//                         numberOfLines={2}
//                       >
//                         {item.title}
//                       </Text>
//                       <Text 
//                         style={[
//                           styles.categoryDescription,
//                           isTablet && styles.categoryDescriptionTablet,
//                           isLargeTablet && styles.categoryDescriptionLargeTablet
//                         ]}
//                         numberOfLines={2}
//                       >
//                         {item.description || "Explore local businesses"}
//                       </Text>
                      
//                       {/* Footer */}
//                       <View style={[
//                         styles.cardFooter,
//                         isTablet && styles.cardFooterTablet
//                       ]}>
//                         <View style={[
//                           styles.exploreButton,
//                           isTablet && styles.exploreButtonTablet
//                         ]}>
//                           <Text style={[
//                             styles.exploreText,
//                             isTablet && styles.exploreTextTablet
//                           ]}>
//                             Explore
//                           </Text>
//                           <Ionicons 
//                             name="arrow-forward" 
//                             size={isTablet ? 14 : 12} 
//                             color="#93210A" 
//                           />
//                         </View>
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           ) : (
//             // Enhanced Empty State
//             <View style={[
//               styles.emptyContainer,
//               isTablet && styles.emptyContainerTablet
//             ]}>
//               <View style={[
//                 styles.emptyIllustration,
//                 isTablet && styles.emptyIllustrationTablet
//               ]}>
//                 <Ionicons 
//                   name="business-outline" 
//                   size={isTablet ? 140 : 120} 
//                   color="#e0e0e0" 
//                 />
//                 <View style={[
//                   styles.emptyBadge,
//                   isTablet && styles.emptyBadgeTablet
//                 ]}>
//                   <Ionicons 
//                     name="alert-circle" 
//                     size={isTablet ? 28 : 24} 
//                     color="#93210A" 
//                   />
//                 </View>
//               </View>
//               <Text style={[
//                 styles.emptyTitle,
//                 isTablet && styles.emptyTitleTablet
//               ]}>
//                 No Categories Available
//               </Text>
//               <Text style={[
//                 styles.emptyText,
//                 isTablet && styles.emptyTextTablet
//               ]}>
//                 We're working on bringing business categories to {town.townname}. 
//                 Check back soon for updates!
//               </Text>
//               <TouchableOpacity style={[
//                 styles.retryButton,
//                 isTablet && styles.retryButtonTablet
//               ]}>
//                 <Text style={[
//                   styles.retryText,
//                   isTablet && styles.retryTextTablet
//                 ]}>
//                   Notify Me
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   // ============ BASE STYLES ============
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#93210A",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
  
//   // ============ BANNER SECTION ============
//   // Mobile Banner
//   bannerContainer: {
//     position: "relative",
//     overflow: "hidden",
//   },
//   banner: {
//     width: "100%",
//     height: "100%",
//   },
//   gradientOverlay: {
//     ...StyleSheet.absoluteFillObject,
//   },
  
//   // ============ BACK BUTTON ============
//   // Mobile Back Button
//   backButton: {
//     position: "absolute",
//     top: Platform.OS === 'ios' ? 60 : 40,
//     left: 20,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     borderRadius: 12,
//     padding: 10,
//     zIndex: 2,
//   },
  
//   // Tablet Back Button
//   backButtonTablet: {
//     top: 50,
//     left: 30,
//     padding: 12,
//     borderRadius: 16,
//   },
  
//   // ============ HEADER CONTENT ============
//   // Mobile Header Content
//   headerContent: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 24,
//     paddingTop: 40,
//   },
  
//   // Tablet Header Content
//   headerContentTablet: {
//     padding: 32,
//     paddingTop: 50,
//   },
  
//   // ============ TITLE CONTAINER ============
//   // Mobile Title Container
//   titleContainer: {
//     marginBottom: 20,
//   },
  
//   // Tablet Title Container
//   titleContainerTablet: {
//     marginBottom: 25,
//   },
  
//   // ============ TOWN NAME ============
//   // Mobile Town Name
//   townName: {
//     color: "#fff",
//     fontSize: 32,
//     fontWeight: "800",
//     textShadowColor: "rgba(0,0,0,0.8)",
//     textShadowOffset: { width: 1, height: 2 },
//     textShadowRadius: 10,
//     marginBottom: 12,
//     letterSpacing: -0.5,
//     left:58,
//   },
  
//   // Tablet Town Name
//   townNameTablet: {
//     fontSize: 42,
//   },
  
//   // ============ DIVIDER ============
//   // Mobile Divider
//   divider: {
//     width: 60,
//     height: 4,
//     backgroundColor: "#93210A",
//     borderRadius: 2,
//     marginBottom: 12,
//   },
  
//   // Tablet Divider
//   dividerTablet: {
//     width: 80,
//     height: 5,
//   },
  
//   // ============ SUBTITLE ============
//   // Mobile Subtitle
//   subtitle: {
//     color: "rgba(255,255,255,0.95)",
//     fontSize: 16,
//     fontWeight: "500",
//     textShadowColor: "rgba(0,0,0,0.5)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 4,
//     letterSpacing: 0.5,
//   },
  
//   // Tablet Subtitle
//   subtitleTablet: {
//     fontSize: 20,
//   },
  
//   // ============ STATS CONTAINER ============
//   // Mobile Stats Container
//   statsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.15)",
//     borderRadius: 16,
//     padding: 16,
//   },
  
//   // Tablet Stats Container
//   statsContainerTablet: {
//     borderRadius: 20,
//     padding: 20,
//   },
  
//   // ============ STAT ITEM ============
//   statItem: {
//     flex: 1,
//     alignItems: "center",
//   },
  
//   // ============ STAT NUMBER ============
//   // Mobile Stat Number
//   statNumber: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
  
//   // Tablet Stat Number
//   statNumberTablet: {
//     fontSize: 24,
//   },
  
//   // ============ STAT LABEL ============
//   // Mobile Stat Label
//   statLabel: {
//     color: "rgba(255,255,255,0.8)",
//     fontSize: 12,
//     fontWeight: "500",
//   },
  
//   // Tablet Stat Label
//   statLabelTablet: {
//     fontSize: 14,
//   },
  
//   // ============ STAT DIVIDER ============
//   // Mobile Stat Divider
//   statDivider: {
//     width: 1,
//     height: 30,
//     backgroundColor: "rgba(255,255,255,0.3)",
//     marginHorizontal: 20,
//   },
  
//   // Tablet Stat Divider
//   statDividerTablet: {
//     height: 40,
//     marginHorizontal: 25,
//   },
  
//   // ============ CONTENT AREA ============
//   // Mobile Content
//   content: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 30,
//   },
  
//   // Tablet Content
//   scrollContentTablet: {
//     paddingBottom: 40,
//   },
  
//   // ============ LOADING STATE ============
//   // Mobile Loading
//   loadingContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 80,
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: "#666",
//     fontWeight: "500",
//   },
  
//   // Tablet Loading
//   loadingContainerTablet: {
//     paddingVertical: 120,
//   },
//   loadingTextTablet: {
//     fontSize: 18,
//     marginTop: 25,
//   },
  
//   // ============ CATEGORIES CONTAINER ============
//   // Mobile Categories Container
//   categoriesContainer: {
//     padding: 16,
//   },
  
//   // ============ SECTION HEADER ============
//   // Mobile Section Header
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 24,
//     paddingHorizontal: 8,
//   },
  
//   // Tablet Section Header
//   sectionHeaderTablet: {
//     marginBottom: 32,
//     paddingHorizontal: 12,
//   },
  
//   // ============ CATEGORIES TITLE ============
//   // Mobile Categories Title
//   categoriesTitle: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#1a1a1a",
//     marginBottom: 8,
//     letterSpacing: -0.5,
//   },
  
//   // Tablet Categories Title
//   categoriesTitleTablet: {
//     fontSize: 36,
//     marginBottom: 10,
//   },
  
//   // ============ CATEGORIES SUBTITLE ============
//   // Mobile Categories Subtitle
//   categoriesSubtitle: {
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 22,
//   },
  
//   // Tablet Categories Subtitle
//   categoriesSubtitleTablet: {
//     fontSize: 18,
//     lineHeight: 24,
//   },
  
//   // ============ CATEGORIES GRID ============
//   // Mobile Categories Grid
//   categoriesGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "flex-start",
//   },
  
//   // ============ CATEGORY CARD ============
//   // Mobile Category Card
//   categoryCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     overflow: "hidden",
//     elevation: 6,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     marginBottom: 12,
//   },
  
//   // Tablet Category Card
//   categoryCardTablet: {
//     borderRadius: 20,
//     elevation: 8,
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//   },
  
//   // Large Tablet Category Card
//   categoryCardLargeTablet: {
//     borderRadius: 24,
//   },
  
//   // ============ CATEGORY IMAGE CONTAINER ============
//   categoryImageContainer: {
//     position: "relative",
//     overflow: "hidden",
//   },
//   categoryImage: {
//     width: "100%",
//     height: "100%",
//   },
//   cardGradient: {
//     ...StyleSheet.absoluteFillObject,
//   },
  
//   // ============ CATEGORY BADGE ============
//   // Mobile Category Badge
//   categoryBadge: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     backgroundColor: "rgba(147, 33, 10, 0.9)",
//     borderRadius: 8,
//     padding: 4,
//   },
  
//   // Tablet Category Badge
//   categoryBadgeTablet: {
//     borderRadius: 10,
//     padding: 6,
//   },
  
//   // ============ CATEGORY CONTENT ============
//   // Mobile Category Content
//   categoryContent: {
//     flex: 1,
//     justifyContent: "space-between",
//   },
  
//   // Tablet Category Content
//   categoryContentTablet: {
//     padding: 12,
//   },
  
//   // ============ CATEGORY TITLE ============
//   // Mobile Category Title
//   categoryTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#1a1a1a",
//     marginBottom: 4,
//     lineHeight: 18,
//   },
  
//   // Tablet Category Title
//   categoryTitleTablet: {
//     fontSize: 16,
//     lineHeight: 20,
//   },
  
//   // Large Tablet Category Title
//   categoryTitleLargeTablet: {
//     fontSize: 18,
//     lineHeight: 22,
//   },
  
//   // ============ CATEGORY DESCRIPTION ============
//   // Mobile Category Description
//   categoryDescription: {
//     fontSize: 12,
//     color: "#666",
//     lineHeight: 16,
//     marginBottom: 8,
//   },
  
//   // Tablet Category Description
//   categoryDescriptionTablet: {
//     fontSize: 13,
//     lineHeight: 18,
//   },
  
//   // Large Tablet Category Description
//   categoryDescriptionLargeTablet: {
//     fontSize: 14,
//     lineHeight: 20,
//   },
  
//   // ============ CARD FOOTER ============
//   // Mobile Card Footer
//   cardFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
  
//   // Tablet Card Footer
//   cardFooterTablet: {
//     marginTop: 8,
//   },
  
//   // ============ EXPLORE BUTTON ============
//   // Mobile Explore Button
//   exploreButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(147, 33, 10, 0.1)",
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
  
//   // Tablet Explore Button
//   exploreButtonTablet: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
  
//   // ============ EXPLORE TEXT ============
//   // Mobile Explore Text
//   exploreText: {
//     color: "#93210A",
//     fontSize: 12,
//     fontWeight: "600",
//     marginRight: 4,
//   },
  
//   // Tablet Explore Text
//   exploreTextTablet: {
//     fontSize: 14,
//     marginRight: 6,
//   },
  
//   // ============ EMPTY STATE ============
//   // Mobile Empty State
//   emptyContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 100,
//     paddingHorizontal: 32,
//   },
//   emptyIllustration: {
//     position: "relative",
//     marginBottom: 32,
//   },
//   emptyBadge: {
//     position: "absolute",
//     bottom: -5,
//     right: -5,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 8,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#666",
//     marginBottom: 12,
//     textAlign: "center",
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#888",
//     textAlign: "center",
//     lineHeight: 24,
//     marginBottom: 32,
//   },
//   retryButton: {
//     backgroundColor: "#93210A",
//     borderRadius: 12,
//     paddingHorizontal: 32,
//     paddingVertical: 12,
//   },
//   retryText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
  
//   // Tablet Empty State
//   emptyContainerTablet: {
//     paddingVertical: 150,
//     paddingHorizontal: 50,
//   },
//   emptyIllustrationTablet: {
//     marginBottom: 40,
//   },
//   emptyBadgeTablet: {
//     borderRadius: 18,
//     padding: 10,
//   },
//   emptyTitleTablet: {
//     fontSize: 32,
//     marginBottom: 16,
//   },
//   emptyTextTablet: {
//     fontSize: 18,
//     lineHeight: 28,
//     marginBottom: 40,
//   },
//   retryButtonTablet: {
//     borderRadius: 16,
//     paddingHorizontal: 40,
//     paddingVertical: 16,
//   },
//   retryTextTablet: {
//     fontSize: 18,
//   },
// });



import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
  SafeAreaView,
  FlatList,
  Animated,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from 'react-native-youtube-iframe';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

// Default image URL
const DEFAULT_IMAGE = 'https://via.placeholder.com/400x300/93210A/ffffff?text=No+Image';

export default function TownBusinessPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { town } = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adsData, setAdsData] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  
  // Advertisement carousel refs
  const flatListRef = useRef(null);
  const adIndex = useRef(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Fetch advertisement data
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/town-business-ads/filter?townId=${town.id}&pageLevel=1&entityId=${town.id}`
        );
        const json = await response.json();
        
        if (json.success && json.data && json.data.length > 0) {
          const ads = json.data[0];
          // Combine adImages and adVideos into a single array
          const adItems = [];
          
          if (ads.adImages && ads.adImages.length > 0) {
            ads.adImages.forEach((image, index) => {
              adItems.push({
                id: `image-${index}`,
                type: 'image',
                url: image || DEFAULT_IMAGE,
              });
            });
          }
          
          // if (ads.adVideos && ads.adVideos.length > 0) {
          //   ads.adVideos.forEach((video, index) => {
          //     if (video) {
          //       adItems.push({
          //         id: `video-${index}`,
          //         type: 'video',
          //         url: video,
          //       });
          //     }
          //   });
          // }
          
          setAdsData(adItems);
        }
      } catch (error) {
        console.log("Ads fetch error:", error);
      } finally {
        setAdsLoading(false);
      }
    };

    fetchAds();
  }, [town.id]);

  // Auto-scroll functionality for ads
  useEffect(() => {
    if (adsData.length <= 1) return;

    const scrollInterval = setInterval(() => {
      if (adIndex.current >= adsData.length - 1) {
        adIndex.current = 0;
      } else {
        adIndex.current += 1;
      }

      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: adIndex.current,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, [adsData]);

  // Fetch categories for the selected town
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/tb/business/category/${town.id}`
        );
        const json = await response.json();
        setData(json || []);
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [town.id]);

  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^"&?/ ]{11})/
    );
    return match ? match[1] : null;
  };

  // Check if image URL is valid
  const isValidImageUrl = (url) => {
    return url && (url.startsWith('http://') || url.startsWith('https://')) && url !== DEFAULT_IMAGE;
  };

  // Grid layout calculation for mobile and tablet
  const getGridColumns = () => {
    if (isLargeTablet) return 4;
    if (isTablet) return 3;
    return 2;
  };

  const gridColumns = getGridColumns();

  // Calculate card width dynamically
  const getCardWidth = () => {
    const containerPadding = isTablet ? 48 : 32;
    const totalGap = (gridColumns - 1) * (isTablet ? 16 : 12);
    return (screenWidth - containerPadding - totalGap) / gridColumns;
  };

  // Render advertisement item
  const renderAdItem = ({ item, index }) => {
    if (item.type === 'image') {
      return (
        <View style={[
          styles.adItemContainer,
          { width: screenWidth }
        ]}>
          <Image
            source={{ 
              uri: isValidImageUrl(item.url) ? item.url : DEFAULT_IMAGE 
            }}
            style={styles.adImage}
            resizeMode="cover"
            onError={() => {
              // If image fails to load, it will show the default image
              console.log(`Image failed to load: ${item.url}`);
            }}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
            style={styles.adGradient}
          />
        </View>
      );
    } else {
      const videoId = getYouTubeId(item.url);
      return (
        <View style={[
          styles.adItemContainer,
          { width: screenWidth }
        ]}>
          {videoId && (
            <YoutubePlayer
              height={isLargeTablet ? 400 : isTablet ? 350 : 250}
              width={screenWidth}
              play={playing}
              videoId={videoId}
              onChangeState={(state) => setPlaying(state === "playing")}
            />
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
            style={styles.adGradient}
          />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={styles.container}>
        {/* Enhanced Header Banner with Ads */}
        <View style={[
          styles.bannerContainer,
          { 
            height: isLargeTablet ? 400 : 
                   isTablet ? 320 : 
                   240 
          }
        ]}>
          {adsLoading ? (
            <View style={styles.adsLoadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : adsData.length > 0 ? (
            <>
              <Animated.FlatList
                ref={flatListRef}
                data={adsData}
                renderItem={renderAdItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(event) => {
                  const newIndex = Math.floor(
                    event.nativeEvent.contentOffset.x / screenWidth
                  );
                  adIndex.current = newIndex;
                }}
                scrollEventThrottle={16}
              />
            </>
          ) : (
            // Fallback to original banner if no ads
            <>
              <Image
                source={{ 
                  uri: town.bannerImage && town.bannerImage !== '' 
                    ? town.bannerImage 
                    : DEFAULT_IMAGE 
                }}
                style={styles.banner}
                resizeMode="cover"
                onError={() => {
                  console.log("Town banner image failed to load");
                }}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
                locations={[0, 0.6, 1]}
                style={styles.gradientOverlay}
              />
            </>
          )}
          
          {/* Back Button */}
          <TouchableOpacity
            style={[
              styles.backButton,
              isTablet && styles.backButtonTablet
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="chevron-back" 
              size={isTablet ? 32 : 28} 
              color="#fff" 
            />
          </TouchableOpacity>

          {/* Enhanced Header Content - REMOVED "Discover Local Businesses" */}
          <View style={[
            styles.headerContent,
            isTablet && styles.headerContentTablet
          ]}>
            <View style={[
              styles.titleContainer,
              isTablet && styles.titleContainerTablet
            ]}>
              <Text style={[
                styles.townName,
                isTablet && styles.townNameTablet
              ]}>
                {town.townname}
              </Text>
              {/* REMOVED Divider and Subtitle */}
            </View>
            
            {/* REMOVED Stats Bar */}
          </View>
        </View>

        {/* Enhanced Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && styles.scrollContentTablet
          ]}
        >
          {loading ? (
            <View style={[
              styles.loadingContainer,
              isTablet && styles.loadingContainerTablet
            ]}>
              <ActivityIndicator size={isTablet ? "large" : "large"} color="#93210A" />
              <Text style={[
                styles.loadingText,
                isTablet && styles.loadingTextTablet
              ]}>
                Loading categories...
              </Text>
            </View>
          ) : data.length > 0 ? (
            <View style={styles.categoriesContainer}>
              {/* Enhanced Header */}
              <View style={[
                styles.sectionHeader,
                isTablet && styles.sectionHeaderTablet
              ]}>
                <View>
                  {/* REMOVED "Explore Categories" subtitle */}
                  <Text style={[
                    styles.categoriesSubtitle,
                    isTablet && styles.categoriesSubtitleTablet
                  ]}>
                    Find the best local businesses in {town.townname}
                  </Text>
                </View>
              </View>

              {/* Enhanced Grid Layout */}
              <View style={[
                styles.categoriesGrid,
                { 
                  gap: isLargeTablet ? 20 : 
                       isTablet ? 16 : 12 
                }
              ]}>
                {data.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryCard,
                      isTablet && styles.categoryCardTablet,
                      isLargeTablet && styles.categoryCardLargeTablet,
                      { 
                        width: getCardWidth(),
                        height: isLargeTablet ? 220 :
                               isTablet ? 230 :
                               170
                      }
                    ]}
                    onPress={() =>
                      navigation.navigate("TownBusiness2", { subcategoryId:item.id,townId :town.id})
                    }
                    activeOpacity={0.9}
                  >
                    {/* Image Container */}
                    <View style={[
                      styles.categoryImageContainer,
                      {
                        height: isLargeTablet ? 140 :
                               isTablet ? 120 :
                               90
                      }
                    ]}>
                      <Image
                        source={{ 
                          uri: isValidImageUrl(item.image) 
                            ? item.image 
                            : DEFAULT_IMAGE 
                        }}
                        style={styles.categoryImage}
                        resizeMode="cover"
                        onError={() => {
                          console.log(`Category image failed to load: ${item.image}`);
                          // You can set state here to track failed images if needed
                        }}
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                        style={styles.cardGradient}
                      />
                      
                      {/* Category Badge */}
                      <View style={[
                        styles.categoryBadge,
                        isTablet && styles.categoryBadgeTablet
                      ]}>
                        <Ionicons 
                          name="business" 
                          size={isTablet ? 14 : 10} 
                          color="#fff" 
                        />
                      </View>
                    </View>
                    
                    {/* Content */}
                    <View style={[
                      styles.categoryContent,
                      isTablet && styles.categoryContentTablet,
                      {
                        padding: isLargeTablet ? 16 :
                                isTablet ? 12 : 8
                      }
                    ]}>
                      <Text 
                        style={[
                          styles.categoryTitle,
                          isTablet && styles.categoryTitleTablet,
                          isLargeTablet && styles.categoryTitleLargeTablet
                        ]}
                        numberOfLines={2}
                      >
                        {item.title || "Business Category"}
                      </Text>
                      <Text 
                        style={[
                          styles.categoryDescription,
                          isTablet && styles.categoryDescriptionTablet,
                          isLargeTablet && styles.categoryDescriptionLargeTablet
                        ]}
                        numberOfLines={2}
                      >
                        {item.description || "Explore local businesses"}
                      </Text>
                      
                      {/* Footer */}
                      <View style={[
                        styles.cardFooter,
                        isTablet && styles.cardFooterTablet
                      ]}>
                        <View style={[
                          styles.exploreButton,
                          isTablet && styles.exploreButtonTablet
                        ]}>
                          <Text style={[
                            styles.exploreText,
                            isTablet && styles.exploreTextTablet
                          ]}>
                            Explore
                          </Text>
                          <Ionicons 
                            name="arrow-forward" 
                            size={isTablet ? 14 : 12} 
                            color="#93210A" 
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            // Enhanced Empty State
            <View style={[
              styles.emptyContainer,
              isTablet && styles.emptyContainerTablet
            ]}>
              <View style={[
                styles.emptyIllustration,
                isTablet && styles.emptyIllustrationTablet
              ]}>
                <Ionicons 
                  name="business-outline" 
                  size={isTablet ? 140 : 120} 
                  color="#e0e0e0" 
                />
                <View style={[
                  styles.emptyBadge,
                  isTablet && styles.emptyBadgeTablet
                ]}>
                  <Ionicons 
                    name="alert-circle" 
                    size={isTablet ? 28 : 24} 
                    color="#93210A" 
                  />
                </View>
              </View>
              <Text style={[
                styles.emptyTitle,
                isTablet && styles.emptyTitleTablet
              ]}>
                No Categories Available
              </Text>
              <Text style={[
                styles.emptyText,
                isTablet && styles.emptyTextTablet
              ]}>
                We're working on bringing business categories to {town.townname}. 
                Check back soon for updates!
              </Text>
              <TouchableOpacity 
                style={[
                  styles.retryButton,
                  isTablet && styles.retryButtonTablet
                ]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[
                  styles.retryText,
                  isTablet && styles.retryTextTablet
                ]}>
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ============ BASE STYLES ============
  safeArea: {
    flex: 1,
    backgroundColor: "#93210A",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  
  // ============ BANNER SECTION ============
  bannerContainer: {
    position: "relative",
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  
  // ============ ADS STYLES ============
  adItemContainer: {
    height: '100%',
    position: 'relative',
  },
  adImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#93210A',
  },
  adGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  adsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  
  // ============ BACK BUTTON ============
  backButton: {
    position: "absolute",
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 10,
    zIndex: 2,
  },
  backButtonTablet: {
    top: 50,
    left: 30,
    padding: 12,
    borderRadius: 16,
  },
  
  // ============ HEADER CONTENT ============
  headerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 40,
  },
  headerContentTablet: {
    padding: 32,
    paddingTop: 50,
  },
  
  // ============ TITLE CONTAINER ============
  titleContainer: {
    marginBottom: 20,
  },
  titleContainerTablet: {
    marginBottom: 25,
  },
  
  // ============ TOWN NAME ============
  townName: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 10,
    letterSpacing: -0.5,
    textAlign: 'center',
    bottom:100,
  },
  townNameTablet: {
    fontSize: 40,
     bottom:150,
  },
  
  // ============ CONTENT AREA ============
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  scrollContentTablet: {
    paddingBottom: 40,
  },
  
  // ============ LOADING STATE ============
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  loadingContainerTablet: {
    paddingVertical: 120,
  },
  loadingTextTablet: {
    fontSize: 18,
    marginTop: 25,
  },
  
  // ============ CATEGORIES CONTAINER ============
  categoriesContainer: {
    padding: 16,
  },
  
  // ============ SECTION HEADER ============
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  sectionHeaderTablet: {
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  
  // ============ CATEGORIES SUBTITLE ============
  categoriesSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    fontWeight: '600',
  },
  categoriesSubtitleTablet: {
    fontSize: 18,
    lineHeight: 24,
  },
  
  // ============ CATEGORIES GRID ============
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  
  // ============ CATEGORY CARD ============
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 12,
  },
  categoryCardTablet: {
    borderRadius: 20,
    elevation: 8,
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  categoryCardLargeTablet: {
    borderRadius: 24,
  },
  
  // ============ CATEGORY IMAGE CONTAINER ============
  categoryImageContainer: {
    position: "relative",
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    backgroundColor: '#93210A',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  
  // ============ CATEGORY BADGE ============
  categoryBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(147, 33, 10, 0.9)",
    borderRadius: 8,
    padding: 4,
  },
  categoryBadgeTablet: {
    borderRadius: 10,
    padding: 6,
  },
  
  // ============ CATEGORY CONTENT ============
  categoryContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  categoryContentTablet: {
    padding: 12,
  },
  
  // ============ CATEGORY TITLE ============
  categoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
    lineHeight: 18,
  },
  categoryTitleTablet: {
    fontSize: 16,
    lineHeight: 20,
  },
  categoryTitleLargeTablet: {
    fontSize: 18,
    lineHeight: 22,
  },
  
  // ============ CATEGORY DESCRIPTION ============
  categoryDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    marginBottom: 8,
  },
  categoryDescriptionTablet: {
    fontSize: 13,
    lineHeight: 18,
  },
  categoryDescriptionLargeTablet: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // ============ CARD FOOTER ============
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardFooterTablet: {
    marginTop: 8,
  },
  
  // ============ EXPLORE BUTTON ============
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(147, 33, 10, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  exploreButtonTablet: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  // ============ EXPLORE TEXT ============
  exploreText: {
    color: "#93210A",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  exploreTextTablet: {
    fontSize: 14,
    marginRight: 6,
  },
  
  // ============ EMPTY STATE ============
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  emptyIllustration: {
    position: "relative",
    marginBottom: 32,
  },
  emptyBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: "#93210A",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainerTablet: {
    paddingVertical: 150,
    paddingHorizontal: 50,
  },
  emptyIllustrationTablet: {
    marginBottom: 40,
  },
  emptyBadgeTablet: {
    borderRadius: 18,
    padding: 10,
  },
  emptyTitleTablet: {
    fontSize: 32,
    marginBottom: 16,
  },
  emptyTextTablet: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 40,
  },
  retryButtonTablet: {
    borderRadius: 16,
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  retryTextTablet: {
    fontSize: 18,
  },
});