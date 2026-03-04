// import React, { useEffect, useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   StatusBar,
//   SafeAreaView,
//   Dimensions,
//   FlatList,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";

// const HinduLeaders1 = () => {
//   const navigation = useNavigation();
//   const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));
//   const { width, height } = windowDimensions;

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isTablet, setIsTablet] = useState(false);

//   // Update dimensions on screen resize
//   useEffect(() => {
//     const subscription = Dimensions.addEventListener("change", ({ window }) => {
//       setWindowDimensions(window);
//     });
//     return () => subscription?.remove();
//   }, []);

//   // Check for tablet
//   useEffect(() => {
//     const isTabletSize = width >= 600 || (width > height && width >= 600);
//     setIsTablet(isTabletSize);
//   }, [width, height]);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         "https://hdrss-backend.onrender.com/api/hindu-leaders/category"
//       );
//       setCategories(res.data || []);
//       setError(null);
//     } catch (e) {
//       console.error("API Error:", e);
//       setError("பகுப்புகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Responsive columns: Mobile 2-3, Tablet 3-4
//   const numColumns = useMemo(() => {
//     if (width >= 1024) return 4; // Large tablets and desktops
//     if (width >= 600) return 4;  // Tablets
//     if (width >= 480) return 3;  // Medium phones
//     return 2;                    // Small phones
//   }, [width]);

//   // Responsive spacing
//   const H_PADDING = useMemo(() => {
//     if (width >= 1024) return 32;
//     if (width >= 600) return 24;
//     if (width >= 480) return 20;
//     return 16;
//   }, [width]);

//   const GAP = useMemo(() => {
//     if (width >= 1024) return 24;
//     if (width >= 600) return 20;
//     if (width >= 480) return 16;
//     return 12;
//   }, [width]);

//   // Calculate card width
//   const cardWidth = useMemo(() => {
//     const totalGap = GAP * (numColumns - 1);
//     const availableWidth = width - (H_PADDING * 2);
//     return (availableWidth - totalGap) / numColumns;
//   }, [width, numColumns, H_PADDING, GAP]);

//   const renderHeader = () => (
//     <View style={[styles.header, isTablet && styles.headerTablet]}>
//       <TouchableOpacity
//         style={[styles.backButton, isTablet && styles.backButtonTablet]}
//         onPress={() => navigation.goBack()}
//         activeOpacity={0.85}
//       >
//         <Ionicons 
//           name="chevron-back" 
//           size={isTablet ? 30 : 24} 
//           color="#fff" 
//         />
//       </TouchableOpacity>

//       <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
//         இந்து தலைவர்கள்
//       </Text>
      
//       <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
//     </View>
//   );

//   const CategoryCard = ({ item }) => (
//     <TouchableOpacity
//       activeOpacity={0.9}
//       onPress={() =>
//         navigation.navigate("HinduLeaders2", {
//           categoryId: item.id,
//           categoryName: item.name,
//         })
//       }
//       style={[
//         styles.card, 
//         isTablet && styles.cardTablet,
//         // { 
//         //   width: cardWidth,
//         //   marginBottom: GAP 
//         // }
//       ]}
//     >
//       <View style={[
//         styles.imageBox, 
//         isTablet && styles.imageBoxTablet,
//       ]}>
//         <Image 
//           source={{ uri: item.image }} 
//           style={styles.image} 
//           resizeMode="cover"
//         />
//       </View>

//       <View style={styles.textContainer}>
//         <Text 
//           style={[
//             styles.cardTitle, 
//             isTablet && styles.cardTitleTablet
//           ]} 
//           numberOfLines={2}
//         >
//           {item.name}
//         </Text>
        
//         <View style={styles.arrowContainer}>
//           <Ionicons 
//             name="arrow-forward" 
//             size={isTablet ? 18 : 16} 
//             color="#8B0000" 
//           />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
//           <ActivityIndicator 
//             size={isTablet ? "large" : "large"} 
//             color="#8B0000" 
//           />
//           <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
//             ஏற்றுகிறது...
//           </Text>
//         </View>
//       );
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
//             onPress={fetchCategories}
//           >
//             <Text style={[styles.retryButtonText, isTablet && styles.retryButtonTextTablet]}>
//               மீண்டும் முயற்சிக்கவும்
//             </Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }

//     if (!categories.length) {
//       return (
//         <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
//           <Ionicons 
//             name="folder-open-outline" 
//             size={isTablet ? 60 : 50} 
//             color="#bbb" 
//           />
//           <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
//             பகுப்புகள் கிடைக்கவில்லை
//           </Text>
//         </View>
//       );
//     }

//     return (
//       <FlatList
//         data={categories}
//         key={`${numColumns}_${width}`}
//         keyExtractor={(item) => String(item.id)}
//         numColumns={numColumns}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingHorizontal: H_PADDING,
//           paddingTop: isTablet ? 24 : 16,
//           paddingBottom: isTablet ? 40 : 30,
//         }}
//         renderItem={({ item }) => <CategoryCard item={item} />}
//       />
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      
//       <View style={styles.whiteBackground}>
//         {renderHeader()}
//         {renderContent()}
//       </View> 
//     </SafeAreaView>
//   );
// };

// export default HinduLeaders1;

// const styles = StyleSheet.create({
//   safe: { 
//     flex: 1, 
//     backgroundColor: "#FFFFFF",
//   },
//   whiteBackground: { 
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },

//   // Header
//   header: {
//     backgroundColor: "#8B0000",
//     padding: 32,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
    
//   headerTablet: {
//      paddingHorizontal: 24,
//      paddingVertical: 26,
 
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     padding: 4,
//     right: 13,
//     top: 10,
//   },
//   backButtonTablet: {
//     width: 50,
//     height: 50,
//   },
//   headerTitle: {  
//     color: "#fff",
//     fontSize: 17,
//     fontWeight: "800",
//     textAlign: "center",
//     flex: 1,
//     paddingHorizontal: 10,
//     top: 10,
//   },
//   headerTitleTablet: {
//     fontSize: 21,
//     letterSpacing: 0.5,
//   },
//   headerSpacer: {
//     width: 40,
//   },
//   headerSpacerTablet: {
//     width: 50,
//   },

//   // States
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
//   loadingText: {
//     marginTop: 12,
//     color: "#8B0000",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   loadingTextTablet: {
//     fontSize: 18,
//     marginTop: 16,
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
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
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

//   // Card
//   card: {
//    backgroundColor: "#FFFFFF",  
//   borderRadius: 16,                     
//   overflow: "hidden",

//   width: 130,      // 👈 card width
//   height: 170,     // 👈 card height

//   elevation: 3,
//   shadowColor: "#000",
//   shadowOffset: { width: 0, height: 4 },
//   shadowOpacity: 0.1,
//   shadowRadius: 6,

//   borderWidth: 1,
//   borderColor: "rgba(255, 255, 255, 0.9)",
//   marginHorizontal: 0,
//   },
//   cardTablet: {
//     borderRadius: 20,
//     elevation: 5,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//      width: 170,      // 👈 card width
//   height: 220,     // 👈 card height
//   },
//   imageBox: {
//     width: "100%",
//     aspectRatio: 1,
//     overflow: "hidden",
//     backgroundColor: "#f5f5f5",
//   },
//   imageBoxTablet: {
//     aspectRatio: 1,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   textContainer: {
//     padding: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#FFFFFF",
//   },
//   cardTitle: {
//     flex: 1,
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#8B0000",
//     lineHeight: 18,
//     paddingRight: 8,
//   },
//   cardTitleTablet: {
//     fontSize: 15,
//     lineHeight: 20,
//     fontWeight: "900",
//   },
//   arrowContainer: {
//     paddingLeft: 4,
//   },
// });



import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const HinduLeaders1 = () => {
  const navigation = useNavigation();

  const [windowDimensions, setWindowDimensions] = useState(
    Dimensions.get("window")
  );
  const { width } = windowDimensions;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    setIsTablet(width >= 600);
  }, [width]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://hdrss-backend.onrender.com/api/hindu-leaders/category"
      );
      setCategories(res.data || []);
      setError(null);
    } catch (e) {
      setError("பகுப்புகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setLoading(false);
    }
  };

  const numColumns = useMemo(() => (isTablet ? 3 : 2), [isTablet]);

  const H_PADDING = useMemo(() => (isTablet ? 20 : 14), [isTablet]);
  const GAP = useMemo(() => (isTablet ? 16 : 12), [isTablet]);

  const cardWidth = useMemo(() => {
    const totalGap = GAP * (numColumns - 1);
    const availableWidth = width - H_PADDING * 2;
    return (availableWidth - totalGap) / numColumns;
  }, [width, numColumns, H_PADDING, GAP]);

  const cardHeight = useMemo(() => cardWidth * 1.18, [cardWidth]);

  const Header = () => (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
        style={[styles.backBtn, isTablet && styles.backBtnTablet]}
      >
        <Ionicons name="chevron-back" size={isTablet ? 26 : 22} color="#fff" />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
        இந்து தலைவர்கள்
      </Text>

      <View style={{ width: isTablet ? 44 : 38 }} />
    </View>
  );

  const CategoryCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("HinduLeaders2", {
          categoryId: item.id,
          categoryName: item.name,
        })
      }
      style={[
        styles.card,
        { width: cardWidth, height: cardHeight },
        isTablet && styles.cardTablet,
      ]}
    >
      <View style={[styles.imageWrap, { height: cardHeight * 0.72 }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>

      <View style={[styles.bottom, { height: cardHeight * 0.28 }]}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.title, isTablet && styles.titleTablet]}
        >
          {item.name}
        </Text>

        <View style={styles.chevCircle}>
          <Ionicons
            name="arrow-forward"
            size={isTablet ? 16 : 14}
            color="#8B0000"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderState = (icon, text, btnText, onPress) => (
    <View style={styles.stateWrap}>
      <Ionicons name={icon} size={52} color="#8B0000" />
      <Text style={styles.stateText}>{text}</Text>
      {!!btnText && (
        <TouchableOpacity style={styles.retryBtn} onPress={onPress}>
          <Text style={styles.retryText}>{btnText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="large" color="#8B0000" />
          <Text style={styles.stateText}>ஏற்றுகிறது...</Text>
        </View>
      );
    }

    if (error) {
      return renderState(
        "alert-circle-outline",
        error,
        "மீண்டும் முயற்சிக்கவும்",
        fetchCategories
      );
    }

    if (!categories.length) {
      return renderState(
        "folder-open-outline",
        "பகுப்புகள் கிடைக்கவில்லை",
        null,
        null
      );
    }

    return (
      <FlatList
        data={categories}
        key={`${numColumns}_${width}`}
        keyExtractor={(item) => String(item.id)}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: H_PADDING,
          paddingTop: 14,
          paddingBottom: 24,
        }}
        columnWrapperStyle={
          numColumns > 1
            ? { justifyContent: "space-between", marginBottom: GAP }
            : undefined
        }
        renderItem={({ item }) => <CategoryCard item={item} />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <View style={styles.container}>
        <Header />
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default HinduLeaders1;

const MAROON = "#8B0000";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  /* ✅ Header neat */
  header: {
    backgroundColor: MAROON,
    paddingVertical: 27,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    // borderBottomLeftRadius: 18,
    // borderBottomRightRadius: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  headerTablet: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    // borderBottomLeftRadius: 22,
    // borderBottomRightRadius: 22,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginTop:18,
  },
  backBtnTablet: { width: 44, height: 44, borderRadius: 22 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.3,
    marginTop:18,
  },
  headerTitleTablet: { fontSize: 18 },

  /* ✅ States neat */
  stateWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
  stateText: {
    marginTop: 10,
    textAlign: "center",
    color: "#444",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 14,
    backgroundColor: MAROON,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: "#fff", fontWeight: "900" },

  /* ✅ Card neat */
  card: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTablet: {
    borderRadius: 18,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  imageWrap: {
    width: "100%",
    backgroundColor: "#F7F7F7",
  },
  image: { width: "100%", height: "100%" },

  bottom: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  title: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: "800",
    color: MAROON,
    lineHeight: 18,
    includeFontPadding: false,
  },
  titleTablet: { fontSize: 14, lineHeight: 18 },

  chevCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
});
