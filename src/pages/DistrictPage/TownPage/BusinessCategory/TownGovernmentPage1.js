// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   Dimensions,
//   Platform,
//   StatusBar,
//   SafeAreaView,
// } from "react-native";
// import axios from "axios";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// const { width, height } = Dimensions.get('window');

// export default function TownGovernmentPage1() {
//   const route = useRoute();
//   const { townId } = route.params;
//   const navigation = useNavigation();

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const API = axios.create({
//     baseURL: "https://hdrss-backend.onrender.com/api",
//   });

//   // Helper function to get proper image URL
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
    
//     // If it's already a full URL (starts with http)
//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }
    
//     // If it's just a filename, you might want to use a placeholder
//     // or construct a proper URL. For now, we'll return null to use a fallback
//     return null;
//   };

//   // Fallback image component
//   const renderImage = (item) => {
//     const imageUrl = getImageUrl(item.image);
    
//     if (imageUrl) {
//       return (
//         <Image
//           source={{ uri: imageUrl }}
//           style={styles.cardImage}
//           resizeMode="cover"
//         />
//       );
//     } else {
//       // Fallback to a placeholder or icon
//       return (
//         <View style={styles.imagePlaceholder}>
//           <Ionicons name="business" size={40} color="#93210A" />
//         </View>
//       );
//     }
//   };

//   const getGovernmentDetails = async () => {
//     try {
//       const res = await API.get(`/town-government/${townId}`);
//       setData(res.data.data); // your array
//       console.log("API Response:", res.data);
//     } catch (err) {
//       console.error("API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getGovernmentDetails();
//   }, [townId]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#93210A" />
//       </View>
//     );
//   }

//   // Calculate grid items - 2 columns
//   const numColumns = 2;
//   const cardWidth = (width - 40) / numColumns; // 20 padding on each side

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() =>
//         navigation.navigate("TownGovernmentPage2", {
//           townGovernmentId: item.id,
//         })
//       }
//       style={[styles.card, { width: cardWidth }]}
//       activeOpacity={0.7}
//     >
//       {/* Render image with proper handling */}
//       {renderImage(item)}
      
//       <View style={styles.cardContent}>
//         <Text style={styles.cardTitle} numberOfLines={2}>{item.title || "Untitled"}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//           activeOpacity={0.7}
//         >
//           <Ionicons name="chevron-back" size={28} color="#fff" />
//         </TouchableOpacity>

//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.headerTitle}>Town Government</Text>
//           {data.length > 0 && (
//             <Text style={styles.headerSubtitle}>{data.length} department(s)</Text>
//           )}
//         </View>

//         <View style={styles.headerRightPlaceholder} />
//       </View>

//       {/* CONTENT */}
//       <View style={styles.container}>
//         {data.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Ionicons name="business-outline" size={80} color="#93210A" />
//             <Text style={styles.emptyText}>No government departments found</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={data}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderItem}
//             numColumns={numColumns}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.gridContainer}
//             columnWrapperStyle={styles.columnWrapper}
//             ListHeaderComponent={
//               <Text style={styles.resultsText}>Government Departments</Text>
//             }
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#93210A",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     backgroundColor: "#93210A",
//     paddingHorizontal: 20,
//     paddingBottom: 15,
//     paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   backButton: {
//     padding: 5,
//     marginRight: 10,
//   },
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#fff",
//     textAlign: 'center',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: "rgba(255, 255, 255, 0.9)",
//     marginTop: 2,
//   },
//   headerRightPlaceholder: {
//     width: 38,
//   },
//   gridContainer: {
//     paddingHorizontal: 10,
//     paddingTop: 20,
//     paddingBottom: 30,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   resultsText: {
//     fontSize: 18,
//     color: "#93210A",
//     fontWeight: '600',
//     marginBottom: 20,
//     textAlign: 'center',
//     marginHorizontal: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     overflow: "hidden",
//     marginHorizontal: 5,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardImage: {
//     width: '100%',
//     height: (width - 40) / 2 * 0.8,
//   },
//   imagePlaceholder: {
//     width: '100%',
//     height: (width - 40) / 2 * 0.8,
//     backgroundColor: '#FFE4E1',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cardContent: {
//     padding: 12,
//     alignItems: 'center',
//     minHeight: 60,
//     justifyContent: 'center',
//   },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: "bold",
//     color: "#93210A",
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 30,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#93210A",
//     marginTop: 20,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
// });

// // Calculate dimensions
// const cardWidth = (Dimensions.get('window').width - 40) / 2;
// const cardImageHeight = cardWidth * 0.8;




import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function TownGovernmentPage1() {
  const route = useRoute();
  const { townId } = route.params;
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = axios.create({
    baseURL: "https://hdrss-backend.onrender.com/api",
  });

  // Helper function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL (starts with http)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's just a filename, you might want to use a placeholder
    // or construct a proper URL. For now, we'll return null to use a fallback
    return null;
  };

  // Fallback image component
  const renderImage = (item) => {
    const imageUrl = getImageUrl(item.image);
    
    if (imageUrl) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.cardImage, 
            isTablet && styles.cardImageTablet,
            { height: (screenWidth - (isTablet ? 80 : 40)) / (isTablet ? 3 : 2) * 0.8 }
          ]}
          resizeMode="cover"
        />
      );
    } else {
      // Fallback to a placeholder or icon
      return (
        <View style={[styles.imagePlaceholder, isTablet && styles.imagePlaceholderTablet]}>
          <Ionicons name="business" size={isTablet ? 50 : 40} color="#93210A" />
        </View>
      );
    }
  };

  const getGovernmentDetails = async () => {
    try {
      const res = await API.get(`/town-government/${townId}`);
      setData(res.data.data); // your array
      console.log("API Response:", res.data);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGovernmentDetails();
  }, [townId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
          Loading departments...
        </Text>
      </View>
    );
  }

  // Calculate grid items - 2 columns for mobile, 3 for tablet
  const numColumns = isTablet ? 3 : 2;
  const cardWidth = (screenWidth - (isTablet ? 80 : 40)) / numColumns;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("TownGovernmentPage2", {
          townGovernmentId: item.id,
        })
      }
      style={[
        styles.card, 
        isTablet && styles.cardTablet,
        { width: cardWidth }
      ]}
      activeOpacity={0.7}
    >
      {/* Render image with proper handling */}
      {renderImage(item)}
      
      <View style={[styles.cardContent, isTablet && styles.cardContentTablet]}>
        <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]} 
              numberOfLines={isTablet ? 3 : 2}>
          {item.title || "Untitled"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="chevron-back" 
            size={isTablet ? 32 : 28} 
            color="#fff" 
          />
        </TouchableOpacity>

        <View style={[styles.headerTitleContainer, isTablet && styles.headerTitleContainerTablet]}>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
            Town Government
          </Text>
          {/* {data.length > 0 && (
            // <Text style={[styles.headerSubtitle, isTablet && styles.headerSubtitleTablet]}>
            //   {data.length} department(s)
            // </Text>
          )} */}
        </View>

        <View style={[styles.headerRightPlaceholder, isTablet && styles.headerRightPlaceholderTablet]} />
      </View>

      {/* CONTENT */}
      <View style={styles.container}>
        {data.length === 0 ? (
          <View style={[styles.emptyContainer, isTablet && styles.emptyContainerTablet]}>
            <Ionicons 
              name="business-outline" 
              size={isTablet ? 100 : 80} 
              color="#93210A" 
            />
            <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
              No government departments found
            </Text>
            <Text style={[styles.emptySubtext, isTablet && styles.emptySubtextTablet]}>
              Please check back later or contact support
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.gridContainer, 
              isTablet && styles.gridContainerTablet
            ]}
            columnWrapperStyle={isTablet ? null : styles.columnWrapper}
            ListHeaderComponent={
              <Text style={[styles.resultsText, isTablet && styles.resultsTextTablet]}>
                Government Departments 
              </Text>
            }
          />
        )}
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
    backgroundColor: "#f5f5f5",
  },
  
  // ============ LOADING STYLES ============
  // Mobile Loading
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#93210A",
  },
  
  // Tablet Loading
  loadingTextTablet: {
    fontSize: 18,
    marginTop: 20,
  },
  
  // ============ HEADER ============
  // Mobile Header
  header: {
    backgroundColor: "#93210A",
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
  },
  headerRightPlaceholder: {
    width: 38,
  },
  
  // Tablet Header
  headerTablet: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight + 15,
  },
  backButtonTablet: {
    padding: 8,
    marginRight: 15,
  },
  headerTitleTablet: {
    fontSize: 28,
  },
  headerSubtitleTablet: {
    fontSize: 16,
    marginTop: 4,
  },
  headerRightPlaceholderTablet: {
    width: 46,
  },
  
  // ============ GRID CONTAINER ============
  // Mobile Grid
  gridContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  // Tablet Grid
  gridContainerTablet: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  
  // ============ RESULTS TEXT ============
  // Mobile Results
  resultsText: {
    fontSize: 18,
    color: "#93210A",
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  
  // Tablet Results
  resultsTextTablet: {
    fontSize: 24,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  
  // ============ CARD STYLES ============
  // Mobile Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Tablet Card
  cardTablet: {
    borderRadius: 16,
    marginHorizontal: 10,
    marginBottom: 25,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  
  // ============ CARD IMAGE ============
  // Mobile Card Image
  cardImage: {
    width: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    backgroundColor: '#FFE4E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Tablet Card Image
  cardImageTablet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  imagePlaceholderTablet: {
    backgroundColor: '#FFD8D3',
  },
  
  // ============ CARD CONTENT ============
  // Mobile Card Content
  cardContent: {
    padding: 12,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  
  // Tablet Card Content
  cardContentTablet: {
    padding: 16,
    minHeight: 80,
  },
  
  // ============ CARD TITLE ============
  // Mobile Card Title
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#93210A",
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20,
  },
  
  // Tablet Card Title
  cardTitleTablet: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 6,
  },
  
  // ============ EMPTY STATE ============
  // Mobile Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    color: "#93210A",
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    textAlign: 'center',
  },
  
  // Tablet Empty State
  emptyContainerTablet: {
    paddingHorizontal: 50,
  },
  emptyTextTablet: {
    fontSize: 24,
    marginTop: 25,
  },
  emptySubtextTablet: {
    fontSize: 16,
    marginTop: 15,
  },
});