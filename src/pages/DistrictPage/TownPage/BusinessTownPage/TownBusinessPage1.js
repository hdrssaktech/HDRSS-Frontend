// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Dimensions,
//   StatusBar,
//   Platform,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from "@expo/vector-icons";

// export default function TownBusinessPage1() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { subcategoryId } = route.params;

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [screenInfo, setScreenInfo] = useState({
//     width: 375,
//     height: 667,
//     isSmallDevice: false,
//     isTablet: false,
//     isLargeTablet: false
//   });

//   // Initialize dimensions safely
//   useEffect(() => {
//     const updateDimensions = () => {
//       try {
//         const window = Dimensions.get("window");
//         const isSmallDevice = window.width < 375;
//         const isTablet = window.width >= 768;
//         const isLargeTablet = window.width >= 1024;
        
//         setScreenInfo({
//           width: window.width,
//           height: window.height,
//           isSmallDevice,
//           isTablet,
//           isLargeTablet
//         });
//       } catch (error) {
//         console.log("Error getting dimensions, using defaults");
//         setScreenInfo({
//           width: 375,
//           height: 667,
//           isSmallDevice: false,
//           isTablet: false,
//           isLargeTablet: false
//         });
//       }
//     };

//     updateDimensions();

//     const subscription = Dimensions.addEventListener('change', updateDimensions);

//     return () => {
//       subscription?.remove?.(); // Safe removal
//     };
//   }, []);

//   // Fetch the subcategory API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch(
//           `https://hdrss-backend.onrender.com/api/tb/business/subcategory/${subcategoryId}`
//         );
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch: ${response.status}`);
//         }
        
//         const result = await response.json();
//         setData(result);
//       } catch (error) {
//         console.log("Error fetching subcategory:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [subcategoryId]);

//   // Grid layout calculation for responsive design
//   const getGridColumns = () => {
//     if (screenInfo.isLargeTablet) return 3;
//     if (screenInfo.isTablet) return 2;
//     return 2; // 2 columns on most phones
//   };

//   const gridColumns = getGridColumns();

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#93210A" />
//         <Text style={styles.loadingText}>Loading subcategories...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
//         <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.retryButtonText}>Go Back</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.retryButton, styles.retrySecondary]}
//           onPress={() => window.location.reload()}
//         >
//           <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
//       {/* Enhanced Header with #93210A color */}
//       <View style={[
//         styles.header,
//         screenInfo.isTablet && styles.tabletHeader,
//         screenInfo.isLargeTablet && styles.largeTabletHeader
//       ]}>
//         <LinearGradient
//           colors={['#93210A', '#B32A0C']}
//           style={styles.headerGradient}
//         >
//           {/* Back Button */}
//           <TouchableOpacity
//             style={[
//               styles.backButton,
//               screenInfo.isTablet && styles.tabletBackButton
//             ]}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons 
//               name="chevron-back" 
//               size={screenInfo.isTablet ? 32 : 28} 
//               color="#fff" 
//             />
//           </TouchableOpacity>

//           {/* Header Title */}
//           <View style={styles.headerTitleContainer}>
//             <Text style={[
//               styles.headerTitle,
//               screenInfo.isLargeTablet && styles.largeTabletHeaderTitle,
//               screenInfo.isTablet && styles.tabletHeaderTitle,
//               screenInfo.isSmallDevice && styles.smallHeaderTitle
//             ]}>
//               Business Subcategories
//             </Text>
//             {/* <Text style={[
//               styles.headerSubtitle,
//               screenInfo.isTablet && styles.tabletHeaderSubtitle,
//               screenInfo.isSmallDevice && styles.smallHeaderSubtitle
//             ]}>
//               Explore business opportunities
//             </Text> */}
//           </View>

//           {/* Stats in Header */}
//           {/* {data.length > 0 && (
//             <View style={[
//               styles.headerStats,
//               screenInfo.isTablet && styles.tabletHeaderStats
//             ]}>
//               <View style={styles.headerStatItem}>
//                 <Text style={styles.headerStatNumber}>{data.length}</Text>
//                 <Text style={styles.headerStatLabel}>Categories</Text>
//               </View>
//               <View style={styles.headerStatDivider} />
//               <View style={styles.headerStatItem}>
//                 <Text style={styles.headerStatNumber}>
//                   {data.reduce((acc, item) => acc + (item.businessCount || 0), 0)}
//                 </Text>
//                 <Text style={styles.headerStatLabel}>Businesses</Text>
//               </View>
//             </View>
//           )} */}

//           {/* Placeholder for alignment */}
//           <View style={styles.headerPlaceholder} />
//         </LinearGradient>
//       </View>

//       <ScrollView 
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Enhanced Grid Layout for All Devices */}
//         {data.length > 0 ? (
//           <View style={styles.categoriesContainer}>
//             {/* Section Header */}
//             <View style={styles.sectionHeader}>
//               <View>
//                 <Text style={[
//                   styles.categoriesTitle,
//                   screenInfo.isTablet && styles.tabletCategoriesTitle,
//                   screenInfo.isSmallDevice && styles.smallCategoriesTitle
//                 ]}>
//                   Available Subcategories
//                 </Text>
//                 <Text style={[
//                   styles.categoriesSubtitle,
//                   screenInfo.isTablet && styles.tabletCategoriesSubtitle
//                 ]}>
//                   Choose a category to explore businesses
//                 </Text>
//               </View>
//               {/* <View style={styles.counterBadge}>
//                 <Text style={styles.counterText}>{data.length}</Text>
//               </View> */}
//             </View>

//             {/* Responsive Grid Layout */}
//             <View style={[
//               styles.categoriesGrid,
//               { 
//                 gap: screenInfo.isLargeTablet ? 16 : 
//                      screenInfo.isTablet ? 14 : 12 
//               }
//             ]}>
//               {data.map((item, index) => (
//                 <TouchableOpacity
//                   key={item.id || index}
//                   style={[
//                     styles.categoryCard,
//                     { 
//                       width: `${100/gridColumns - 2}%`,
//                       height: screenInfo.isLargeTablet ? 200 :
//                              screenInfo.isTablet ? 180 :
//                              screenInfo.isSmallDevice ? 150 : 170
//                     },
//                     screenInfo.isLargeTablet && styles.largeTabletCategoryCard,
//                     screenInfo.isTablet && styles.tabletCategoryCard
//                   ]}
//                   onPress={() =>
//                     navigation.navigate("TownBusiness3", { 
//                       subcategoryItemId: item.id
//                     })
//                   }
//                   activeOpacity={0.9}
//                 >
//                   {/* Image Container */}
//                   <View style={[
//                     styles.categoryImageContainer,
//                     {
//                       height: screenInfo.isLargeTablet ? 120 :
//                              screenInfo.isTablet ? 100 :
//                              screenInfo.isSmallDevice ? 80 : 90
//                     }
//                   ]}>
//                     <Image
//                       source={{ uri: item.image }} 
//                       style={styles.categoryImage}
//                       resizeMode="cover"
//                       onError={() => console.log("Image failed to load:", item.image)}
//                     />
//                     <LinearGradient
//                       colors={['transparent', 'rgba(0,0,0,0.5)']}
//                       style={styles.cardGradient}
//                     />
                    
//                     {/* Category Badge */}
//                     <View style={styles.categoryBadge}>
//                       <Ionicons name="business" size={
//                         screenInfo.isLargeTablet ? 14 :
//                         screenInfo.isTablet ? 12 : 10
//                       } color="#fff" />
//                     </View>
//                   </View>
                  
//                   {/* Content */}
//                   <View style={[
//                     styles.categoryContent,
//                     {
//                       padding: screenInfo.isLargeTablet ? 12 :
//                               screenInfo.isTablet ? 10 : 8
//                     }
//                   ]}>
//                     <Text 
//                       style={[
//                         styles.categoryTitle,
//                         screenInfo.isLargeTablet && styles.largeTabletCategoryTitle,
//                         screenInfo.isTablet && styles.tabletCategoryTitle,
//                         screenInfo.isSmallDevice && styles.smallCategoryTitle
//                       ]}
//                       numberOfLines={2}
//                     >
//                       {item.title || 'Untitled Category'}
//                     </Text>
//                     <Text 
//                       style={[
//                         styles.categoryDescription,
//                         screenInfo.isLargeTablet && styles.largeTabletCategoryDescription,
//                         screenInfo.isTablet && styles.tabletCategoryDescription,
//                         screenInfo.isSmallDevice && styles.smallCategoryDescription
//                       ]}
//                       numberOfLines={2}
//                     >
//                       {item.businessCount ? `${item.businessCount} businesses` : 'Explore businesses'}
//                     </Text>
                    
//                     {/* Footer */}
//                     <View style={styles.cardFooter}>
//                       <View style={[
//                         styles.exploreButton,
//                         screenInfo.isSmallDevice && styles.smallExploreButton
//                       ]}>
//                         <Text style={[
//                           styles.exploreText,
//                           screenInfo.isSmallDevice && styles.smallExploreText
//                         ]}>
//                           Explore
//                         </Text>
//                         <Ionicons 
//                           name="arrow-forward" 
//                           size={
//                             screenInfo.isLargeTablet ? 14 :
//                             screenInfo.isTablet ? 13 : 12
//                           } 
//                           color="#93210A" 
//                         />
//                       </View>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         ) : (
//           // Empty State
//           <View style={styles.emptyContainer}>
//             <View style={styles.emptyIllustration}>
//               <Ionicons name="folder-open-outline" size={120} color="#e0e0e0" />
//               <View style={styles.emptyBadge}>
//                 <Ionicons name="alert-circle" size={24} color="#93210A" />
//               </View>
//             </View>
//             <Text style={styles.emptyTitle}>No Subcategories Found</Text>
//             <Text style={styles.emptyText}>
//               There are no business subcategories available at the moment.
//             </Text>
//             <TouchableOpacity 
//               style={styles.retryButton}
//               onPress={() => navigation.goBack()}
//             >
//               <Text style={styles.retryButtonText}>Go Back</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
  
//   // Enhanced Header with #93210A
//   header: {
//     height: 140,
//     overflow: "hidden",
//   },
//   tabletHeader: {
//     height: 160,
//   },
//   largeTabletHeader: {
//     height: 180,
//   },
//   headerGradient: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "flex-end",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     paddingTop: Platform.OS === 'ios' ? 50 : 40,
//   },
//   backButton: {
//     padding: 10,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     borderRadius: 12,
//     marginRight: 15,
//   },
//   tabletBackButton: {
//     padding: 12,
//     borderRadius: 16,
//   },
//   headerTitleContainer: {
//     flex: 1,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 24,
//     fontWeight: "800",
//     textShadowColor: "rgba(0,0,0,0.3)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 5,
//     marginBottom: 4,
//   },
//   largeTabletHeaderTitle: {
//     fontSize: 28,
//   },
//   tabletHeaderTitle: {
//     fontSize: 26,
//   },
//   smallHeaderTitle: {
//     fontSize: 22,
//   },
//   headerSubtitle: {
//     color: "rgba(255,255,255,0.9)",
//     fontSize: 14,
//     fontWeight: "500",
//     textShadowColor: "rgba(0,0,0,0.3)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   tabletHeaderSubtitle: {
//     fontSize: 16,
//   },
//   smallHeaderSubtitle: {
//     fontSize: 13,
//   },
//   headerStats: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.15)",
//     borderRadius: 16,
//     padding: 12,
//     marginLeft: 15,
//   },
//   tabletHeaderStats: {
//     padding: 14,
//   },
//   headerStatItem: {
//     alignItems: "center",
//     paddingHorizontal: 8,
//   },
//   headerStatNumber: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 2,
//   },
//   headerStatLabel: {
//     color: "rgba(255,255,255,0.8)",
//     fontSize: 10,
//     fontWeight: "500",
//   },
//   headerStatDivider: {
//     width: 1,
//     height: 25,
//     backgroundColor: "rgba(255,255,255,0.3)",
//   },
//   headerPlaceholder: {
//     width: 40,
//   },

//   // Scroll View
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 30,
//   },

//   // Loading State
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f8f9fa",
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: "#666",
//     fontWeight: "500",
//   },

//   // Error State
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f8f9fa",
//     paddingHorizontal: 40,
//   },
//   errorTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//     marginTop: 20,
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   errorText: {
//     fontSize: 15,
//     color: "#666",
//     textAlign: "center",
//     lineHeight: 22,
//     marginBottom: 30,
//   },
//   retryButton: {
//     backgroundColor: "#93210A",
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 25,
//     marginVertical: 5,
//   },
//   retrySecondary: {
//     backgroundColor: "#666",
//   },
//   retryButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },

//   // Enhanced Categories Section
//   categoriesContainer: {
//     padding: 16,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 24,
//     paddingHorizontal: 8,
//   },
//   categoriesTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#1a1a1a",
//     marginBottom: 8,
//     letterSpacing: -0.5,
//   },
//   tabletCategoriesTitle: {
//     fontSize: 28,
//   },
//   smallCategoriesTitle: {
//     fontSize: 22,
//   },
//   categoriesSubtitle: {
//     fontSize: 14,
//     color: "#666",
//     lineHeight: 20,
//   },
//   tabletCategoriesSubtitle: {
//     fontSize: 16,
//   },
//   counterBadge: {
//     backgroundColor: "#93210A",
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   counterText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },

//   // Enhanced Grid Layout
//   categoriesGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },

//   // Enhanced Category Cards
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
//   tabletCategoryCard: {
//     borderRadius: 18,
//   },
//   largeTabletCategoryCard: {
//     borderRadius: 20,
//   },
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
//   categoryBadge: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     backgroundColor: "rgba(147, 33, 10, 0.9)",
//     borderRadius: 8,
//     padding: 4,
//   },
//   categoryContent: {
//     flex: 1,
//     justifyContent: "space-between",
//   },
//   categoryTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#1a1a1a",
//     marginBottom: 4,
//     lineHeight: 18,
//   },
//   largeTabletCategoryTitle: {
//     fontSize: 16,
//     lineHeight: 20,
//   },
//   tabletCategoryTitle: {
//     fontSize: 15,
//     lineHeight: 19,
//   },
//   smallCategoryTitle: {
//     fontSize: 13,
//     lineHeight: 16,
//   },
//   categoryDescription: {
//     fontSize: 12,
//     color: "#666",
//     lineHeight: 16,
//     marginBottom: 8,
//   },
//   largeTabletCategoryDescription: {
//     fontSize: 13,
//     lineHeight: 17,
//   },
//   tabletCategoryDescription: {
//     fontSize: 12,
//     lineHeight: 16,
//   },
//   smallCategoryDescription: {
//     fontSize: 11,
//     lineHeight: 14,
//   },
//   cardFooter: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   exploreButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(147, 33, 10, 0.1)",
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   smallExploreButton: {
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//   },
//   exploreText: {
//     color: "#93210A",
//     fontSize: 12,
//     fontWeight: "600",
//     marginRight: 4,
//   },
//   smallExploreText: {
//     fontSize: 11,
//     marginRight: 3,
//   },

//   // Enhanced Empty State
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
// });


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

export default function TownBusinessPage1() {
  const route = useRoute();
  const navigation = useNavigation();
  const { subcategoryId } = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch(
      `https://hdrss-backend.onrender.com/api/tb/business/subcategory/${subcategoryId}`
    )
      .then((res) => res.json())
      .then(setData)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={styles.loaderText}>Loading businesses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      {/* ================= HEADER ================= */}
      <LinearGradient
        colors={["#93210A", "#B32A0C"]}
        style={isTablet ? styles.headerTablet : styles.headerMobile}
      >
        <TouchableOpacity
          style={isTablet ? styles.backTablet : styles.backMobile}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={isTablet ? styles.headerTitleTablet : styles.headerTitleMobile}
        >
          Business Categories
        </Text>

        <Text
          style={
            isTablet
              ? styles.headerSubtitleTablet
              : styles.headerSubtitleMobile
          }
        >
          Choose a category to explore
        </Text>
      </LinearGradient>

      {/* ================= GRID ================= */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={isTablet ? styles.gridTablet : styles.gridMobile}>
          {data.map((item, index) => (
            <TouchableOpacity
              key={item.id || index}
              activeOpacity={0.85}
              style={isTablet ? styles.cardTablet : styles.cardMobile}
              onPress={() =>
                navigation.navigate("TownBusiness3", {
                  subcategoryItemId: item.id,
                })
              }
            >
              {/* IMAGE */}
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              {/* BODY */}
              <View
                style={isTablet ? styles.cardBodyTablet : styles.cardBodyMobile}
              >
                <Text
                  numberOfLines={2}
                  style={
                    isTablet
                      ? styles.cardTitleTablet
                      : styles.cardTitleMobile
                  }
                >
                  {item.title}
                </Text>

                <Text
                  style={isTablet ? styles.cardSubTablet : styles.cardSubMobile}
                >
                  {item.businessCount
                    ? `${item.businessCount} businesses`
                    : "Explore businesses"}
                </Text>

                <View style={styles.exploreRow}>
                  <Text style={styles.exploreText}>Explore</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={14}
                    color="#93210A"
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ================================================= */
/* ===================== STYLES ==================== */
/* ================================================= */

const styles = StyleSheet.create({
  /* ================= COMMON ================= */
  container: {
    flex: 1,
    backgroundColor: "#F6F7F9",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loaderText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },

  cardImage: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
  },

  exploreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  exploreText: {
    color: "#93210A",
    fontWeight: "700",
    marginRight: 6,
    fontSize: 13,
  },

  /* ================= MOBILE ================= */
  headerMobile: {
    paddingTop: Platform.OS === "ios" ? 55 : 45,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },

  backMobile: {
    position: "absolute",
    left: 16,
    top: Platform.OS === "ios" ? 55 : 45,
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 12,
  },

  headerTitleMobile: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
  },

  headerSubtitleMobile: {
    color: "#f1f1f1",
    textAlign: "center",
    fontSize: 13,
    marginTop: 6,
  },

  gridMobile: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardMobile: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },

  cardBodyMobile: {
    padding: 10,
  },

  cardTitleMobile: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },

  cardSubMobile: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },

  /* ================= TABLET ================= */
  headerTablet: {
    paddingTop: 65,
    paddingBottom: 40,
    paddingHorizontal: 60,
  },

  backTablet: {
    position: "absolute",
    left: 40,
    top: 65,
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 10,
    borderRadius: 14,
  },

  headerTitleTablet: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  headerSubtitleTablet: {
    color: "#f1f1f1",
    textAlign: "center",
    fontSize: 15,
    marginTop: 8,
  },

  gridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardTablet: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 6,
  },

  cardBodyTablet: {
    padding: 14,
  },

  cardTitleTablet: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },

  cardSubTablet: {
    fontSize: 13,
    color: "#555",
    marginTop: 6,
  },
});

