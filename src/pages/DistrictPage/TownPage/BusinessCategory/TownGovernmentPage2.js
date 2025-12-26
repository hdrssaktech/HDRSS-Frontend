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
//   Linking,
// } from "react-native";
// import axios from "axios";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// const { width, height } = Dimensions.get('window');

// export default function TownGovernmentPage2() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { townGovernmentId } = route.params;  
//   console.log("Received ID:", townGovernmentId);

//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const API = axios.create({
//     baseURL: "https://hdrss-backend.onrender.com/api",
//   });

//   const loadServices = async () => {
//     try {
//       const res = await API.get(`/town-government-services/${townGovernmentId}`);

//       console.log("FULL API RESPONSE:", res.data);

//       // FIX: Handle all API formats safely
//       const items =
//         res.data?.data ||          // { success:true, data:[...] }
//         res.data?.services ||      // alternate name
//         (Array.isArray(res.data) ? res.data : []) // direct array
      
//       setServices(items);
//     } catch (err) {
//       console.error("Service API Error:", err);
//       setServices([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadServices();
//   }, [townGovernmentId]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#93210A" />
//       </View>
//     );
//   }

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       {/* IMAGE ON LEFT */}
//       <Image 
//         source={{ uri: item.image }} 
//         style={styles.cardImage} 
//         resizeMode="cover"
//       />

//       {/* CONTENT ON RIGHT */}
//       <View style={styles.cardContent}>
//         {/* NAME */}
//         <Text style={styles.cardTitle} numberOfLines={2}>{item.name || "Service"}</Text>

//         {/* LOCAL AREA */}
//         {item.localarea && (
//           <View style={styles.infoRow}>
//             <Ionicons name="business" size={18} color="#93210A" style={styles.icon} />
//             <Text style={styles.infoText} numberOfLines={2}>{item.localarea}</Text>
//           </View>
//         )}

//         {/* LOCATION */}
//         {item.location && (
//           <TouchableOpacity 
//             style={styles.infoRow}
//             onPress={() => {
//               const encodedLocation = encodeURIComponent(item.location);
//               Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
//             }}
//             activeOpacity={0.7}
//           >
//             <Ionicons name="location" size={18} color="#93210A" style={styles.icon} />
//             <Text style={styles.infoText} numberOfLines={2}>{item.location}</Text>
//           </TouchableOpacity>
//         )}

//         {/* PHONE NUMBER */}
//         {item.phonenumber && (
//           <TouchableOpacity 
//             style={styles.infoRow}
//             onPress={() => Linking.openURL(`tel:${item.phonenumber}`)}
//             activeOpacity={0.7}
//           >
//             <Ionicons name="call" size={18} color="#93210A" style={styles.icon} />
//             <Text style={styles.infoText}>{item.phonenumber}</Text>
//           </TouchableOpacity>
//         )}

//         {/* ADDITIONAL INFO IF AVAILABLE */}
//         {item.description && (
//           <View style={styles.infoRow}>
//             <Ionicons name="information-circle" size={18} color="#93210A" style={styles.icon} />
//             <Text style={styles.infoText} numberOfLines={2}>{item.description}</Text>
//           </View>
//         )}
//       </View>
//     </View>
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
//           <Text style={styles.headerTitle}>Government Services</Text>
//           {services.length > 0 && (
//             <Text style={styles.headerSubtitle}>{services.length} service(s)</Text>
//           )}
//         </View>

//         <View style={styles.headerRightPlaceholder} />
//       </View>

//       {/* CONTENT */}
//       <View style={styles.container}>
//         {services.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Ionicons name="document-text-outline" size={80} color="#93210A" />
//             <Text style={styles.emptyText}>No services available</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={services}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderItem}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.listContainer}
//             ListHeaderComponent={
//               <Text style={styles.resultsText}>Available Services</Text>
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
//   listContainer: {
//     paddingHorizontal: 15,
//     paddingTop: 20,
//     paddingBottom: 30,
//   },
//   resultsText: {
//     fontSize: 18,
//     color: "#93210A",
//     fontWeight: '600',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   card: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 15,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     minHeight: 140,
//   },
//   cardImage: {
//     width: width * 0.35,
//     height: '100%',
//     minHeight: 140,
//   },
//   cardContent: {
//     flex: 1,
//     padding: 15,
//     justifyContent: 'center',
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginBottom: 10,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   icon: {
//     marginRight: 10,
//     marginTop: 2,
//     width: 20,
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 14,
//     color: "#333",
//     lineHeight: 20,
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
  Linking,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function TownGovernmentPage2() {
  const route = useRoute();
  const navigation = useNavigation();
  const { townGovernmentId } = route.params;  
  console.log("Received ID:", townGovernmentId);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = axios.create({
    baseURL: "https://hdrss-backend.onrender.com/api",
  });

  const loadServices = async () => {
    try {
      const res = await API.get(`/town-government-services/${townGovernmentId}`);
      console.log("FULL API RESPONSE:", res.data);

      // FIX: Handle all API formats safely
      const items =
        res.data?.data ||          // { success:true, data:[...] }
        res.data?.services ||      // alternate name
        (Array.isArray(res.data) ? res.data : []) // direct array
      
      setServices(items);
    } catch (err) {
      console.error("Service API Error:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [townGovernmentId]);

  if (loading) {
    return (
      <View style={[styles.center, isTablet && styles.centerTablet]}>
        <ActivityIndicator size={isTablet ? "large" : "large"} color="#93210A" />
        <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
          Loading services...
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={[styles.card, isTablet && styles.cardTablet]}>
      {/* IMAGE ON LEFT */}
      <Image 
        source={{ uri: item.image }} 
        style={[
          styles.cardImage, 
          isTablet && styles.cardImageTablet,
          { 
            width: isTablet ? screenWidth * 0.25 : screenWidth * 0.35,
            height: isTablet ? 180 : 140 
          }
        ]} 
        resizeMode="cover"
      />

      {/* CONTENT ON RIGHT */}
      <View style={[styles.cardContent, isTablet && styles.cardContentTablet]}>
        {/* NAME */}
        <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]} 
              numberOfLines={2}>
          {item.name || "Service"}
        </Text>

        {/* LOCAL AREA */}
        {item.localarea && (
          <View style={[styles.infoRow, isTablet && styles.infoRowTablet]}>
            <Ionicons 
              name="business" 
              size={isTablet ? 22 : 18} 
              color="#93210A" 
              style={[styles.icon, isTablet && styles.iconTablet]} 
            />
            <Text style={[styles.infoText, isTablet && styles.infoTextTablet]} 
                  numberOfLines={2}>
              {item.localarea}
            </Text>
          </View>
        )}

        {/* LOCATION */}
        {item.location && (
          <TouchableOpacity 
            style={[styles.infoRow, isTablet && styles.infoRowTablet]}
            onPress={() => {
              const encodedLocation = encodeURIComponent(item.location);
              Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
            }}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="location" 
              size={isTablet ? 22 : 18} 
              color="#93210A" 
              style={[styles.icon, isTablet && styles.iconTablet]} 
            />
            <Text style={[styles.infoText, isTablet && styles.infoTextTablet]} 
                  numberOfLines={2}>
              {item.location}
            </Text>
          </TouchableOpacity>
        )}

        {/* PHONE NUMBER */}
        {item.phonenumber && (
          <TouchableOpacity 
            style={[styles.infoRow, isTablet && styles.infoRowTablet]}
            onPress={() => Linking.openURL(`tel:${item.phonenumber}`)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="call" 
              size={isTablet ? 22 : 18} 
              color="#93210A" 
              style={[styles.icon, isTablet && styles.iconTablet]} 
            />
            <Text style={[styles.infoText, isTablet && styles.infoTextTablet]}>
              {item.phonenumber}
            </Text>
          </TouchableOpacity>
        )}

        {/* ADDITIONAL INFO IF AVAILABLE */}
        {item.description && (
          <View style={[styles.infoRow, isTablet && styles.infoRowTablet]}>
            <Ionicons 
              name="information-circle" 
              size={isTablet ? 22 : 18} 
              color="#93210A" 
              style={[styles.icon, isTablet && styles.iconTablet]} 
            />
            <Text style={[styles.infoText, isTablet && styles.infoTextTablet]} 
                  numberOfLines={isTablet ? 3 : 2}>
              {item.description}
            </Text>
          </View>
        )}
      </View>
    </View>
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
            Government Services
          </Text>
          {services.length > 0 && (
            <Text style={[styles.headerSubtitle, isTablet && styles.headerSubtitleTablet]}>
              {services.length} service(s)
            </Text>
          )}
        </View>

        <View style={[styles.headerRightPlaceholder, isTablet && styles.headerRightPlaceholderTablet]} />
      </View>

      {/* CONTENT */}
      <View style={styles.container}>
        {services.length === 0 ? (
          <View style={[styles.emptyContainer, isTablet && styles.emptyContainerTablet]}>
            <Ionicons 
              name="document-text-outline" 
              size={isTablet ? 100 : 80} 
              color="#93210A" 
            />
            <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
              No services available
            </Text>
            <Text style={[styles.emptySubtext, isTablet && styles.emptySubtextTablet]}>
              Services will be updated soon
            </Text>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContainer, 
              isTablet && styles.listContainerTablet
            ]}
            ListHeaderComponent={
              <Text style={[styles.resultsText, isTablet && styles.resultsTextTablet]}>
                Available Services ({services.length})
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
  centerTablet: {
    paddingHorizontal: 40,
  },
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
  
  // ============ LIST CONTAINER ============
  // Mobile List Container
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 30,
  },
  
  // Tablet List Container
  listContainerTablet: {
    paddingHorizontal: 30,
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
  },
  
  // Tablet Results
  resultsTextTablet: {
    fontSize: 24,
    marginBottom: 30,
  },
  
  // ============ CARD STYLES ============
  // Mobile Card
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 140,
  },
  
  // Tablet Card
  cardTablet: {
    borderRadius: 16,
    marginBottom: 25,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    minHeight: 180,
  },
  
  // ============ CARD IMAGE ============
  // Mobile Card Image
  cardImage: {
    height: '100%',
  },
  
  // Tablet Card Image
  cardImageTablet: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  
  // ============ CARD CONTENT ============
  // Mobile Card Content
  cardContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  
  // Tablet Card Content
  cardContentTablet: {
    padding: 20,
    justifyContent: 'space-around',
  },
  
  // ============ CARD TITLE ============
  // Mobile Card Title
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
  },
  
  // Tablet Card Title
  cardTitleTablet: {
    fontSize: 22,
    marginBottom: 12,
  },
  
  // ============ INFO ROW ============
  // Mobile Info Row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  // Tablet Info Row
  infoRowTablet: {
    marginBottom: 10,
  },
  
  // ============ ICON ============
  // Mobile Icon
  icon: {
    marginRight: 10,
    marginTop: 2,
    width: 20,
  },
  
  // Tablet Icon
  iconTablet: {
    marginRight: 12,
    marginTop: 3,
    width: 24,
  },
  
  // ============ INFO TEXT ============
  // Mobile Info Text
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  
  // Tablet Info Text
  infoTextTablet: {
    fontSize: 16,
    lineHeight: 22,
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