// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Linking,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/Ionicons"; // ✅ for icons

// const GovernmentPage2 = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { governmentId } = route.params;
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await fetch(
//          `https://hdrss-backend.onrender.com/api/governments/services/${governmentId}`
//         );
//         const data = await response.json();
//         console.log("✅ Government Services:", data);

//         setServices(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.log("❌ Error fetching services:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, [governmentId]);

//   const openMap = (url) => {
//     if (url) Linking.openURL(url);
//   };

//   const callNumber = (number) => {
//    if (number) Linking.openURL(`tel:${number}`);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#93210A" />
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (services.length === 0) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.headerBox}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Icon name="chevron-back" size={26} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.headerText}>Services under this Government</Text>
//         </View>
//         <Text style={styles.emptyText}>
//           No services found for this government.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* ✅ Header with Back Button */}
//       <View style={styles.headerBox}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Icon name="chevron-back" size={22} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Services under this Government</Text>
//       </View>

//       <FlatList
//         data={services}
//         keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//         renderItem={({ item, index }) => {
//           const placeholderImages = [
//             "https://via.placeholder.com/150/93210A/FFFFFF?text=Service+1",
//             "https://via.placeholder.com/150/555/FFFFFF?text=Service+2",
//             "https://via.placeholder.com/150/777/FFFFFF?text=Service+3",
//           ];
//           const imageUrl = item.image || placeholderImages[index % 3];

//           return (
//             <View style={styles.card}>
//               {/* Image + Text Row */}
//               <View style={styles.row}>
//                 <Image source={{ uri: imageUrl }} style={styles.image} />
//                 <View style={styles.textContainer}>
//                   <Text style={styles.title}>
//                     {item?.name || "Unnamed Service"}
//                   </Text>
//                   <Text style={styles.localArea}>
//                     📍 {item?.localArea || "No location info"}
//                   </Text>
//                 </View>
//               </View>

//               {/* Bottom Buttons */}
//               <View style={styles.bottomRow}>
//                 <TouchableOpacity
//                   onPress={() => callNumber(item.phoneNumber)}
//                   style={styles.callButton}
//                 >
//                   <Icon name="call" size={16} color="#fff" />
//                   <Text style={styles.callText}>
//                     {item?.phoneNumber || "N/A"}
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() => openMap(item.location)}
//                   style={styles.mapButton}
//                 >
//                   <Icon name="map" size={18} color="#93210A" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           );
//         }}
//       />
//     </View>
//   );
// };

// export default GovernmentPage2;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF8F8",
//     // padding: 15,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerBox: {
//     backgroundColor: "#93210A",
//     paddingVertical: 40,
//     paddingHorizontal: 30,
//     flexDirection: "row",
//     alignItems: "center",
//     elevation: 5,
//     shadowColor: "#93210A",
//     shadowOpacity: 0.25,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   backButton: {
//     marginRight: 10,
//     marginTop: -2, // 👈 slightly raised
//     padding: 4,
//   },
//   headerText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "left",
//     flex: 1,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 12,
//     marginVertical: 8,
//     marginHorizontal: 15,
//     borderRadius: 12,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   image: {
//     width: "30%",
//     height: 80,
//     borderRadius: 10,
//     marginRight: 12,
//   },
//   textContainer: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#93210A",
//     marginBottom: 4,
//   },
//   localArea: {
//     fontSize: 13,
//     color: "#555",
//   },
//   bottomRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     paddingTop: 8,
//   },
//   callButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#93210A",
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//   },
//   callText: {
//     color: "#fff",
//     fontSize: 13,
//     fontWeight: "600",
//     marginLeft: 5,
//   },
//   mapButton: {
//     padding: 6,
//     borderRadius: 6,
//     backgroundColor: "#f5e4e1",
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 20,
//     color: "#93210A",
//   },
// });




import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const GovernmentPage2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { governmentId } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const CARD_WIDTH = isTablet ? width / 2 - 30 : width - 30;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/governments/services/${governmentId}`
        );
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("❌ Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [governmentId]);

  const openMap = (url) => {
    if (url) Linking.openURL(url);
  };

  const callNumber = (number) => {
    if (number) Linking.openURL(`tel:${number}`);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text>Loading services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={isTablet ? styles.headerTablet : styles.headerMobile}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={isTablet ? 30 : 24} color="#fff" />
        </TouchableOpacity>
        <Text
          style={isTablet ? styles.headerTextTablet : styles.headerTextMobile}
        >
          Government Services
        </Text>
      </View>

      {/* ================= LIST ================= */}
      <FlatList
        data={services}
        key={isTablet ? "tablet" : "mobile"}
        numColumns={isTablet ? 2 : 1}
        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }
        columnWrapperStyle={
          isTablet && { justifyContent: "space-between" }
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const placeholderImages = [
            "https://via.placeholder.com/300/93210A/FFFFFF?text=Service",
            "https://via.placeholder.com/300/555/FFFFFF?text=Office",
            "https://via.placeholder.com/300/777/FFFFFF?text=Help",
          ];
          const imageUrl = item.image || placeholderImages[index % 3];

          return (
            <View
              style={[
                styles.card,
                { width: CARD_WIDTH },
                isTablet && styles.cardTablet,
              ]}
            >
              {/* Image */}
              <Image
                source={{ uri: imageUrl }}
                style={isTablet ? styles.imageTablet : styles.imageMobile}
              />

              {/* Content */}
              <View style={styles.textContainer}>
                <Text
                  style={
                    isTablet ? styles.titleTablet : styles.titleMobile
                  }
                  numberOfLines={2}
                >
                  {item?.name || "Unnamed Service"}
                </Text>

                <Text style={styles.localArea}>
                  📍 {item?.localArea || "No location info"}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.bottomRow}>
                <TouchableOpacity
                  onPress={() => callNumber(item.phoneNumber)}
                  style={styles.callButton}
                >
                  <Icon name="call" size={16} color="#fff" />
                  <Text style={styles.callText}>
                    {item?.phoneNumber || "N/A"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => openMap(item.location)}
                  style={styles.mapButton}
                >
                  <Icon name="map" size={18} color="#93210A" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default GovernmentPage2;

/* =================================================
   STYLES – MOBILE & TABLET SEPARATED
================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F8",
  },

  /* ================= LOADER ================= */
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ================= HEADER ================= */

  headerMobile: {
    backgroundColor: "#93210A",
    paddingVertical: 35,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  headerTablet: {
    backgroundColor: "#93210A",
    paddingVertical: 45,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    marginRight: 12,
    bottom:-10,

  },

  headerTextMobile: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    bottom:-10,
    left:50,
  },

  headerTextTablet: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    top:10,
    left:150,
  },

  /* ================= CARD ================= */

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 14,
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  cardTablet: {
    borderRadius: 18,
    padding: 16,
  },

  /* ================= IMAGE ================= */

  imageMobile: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
  },

  imageTablet: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 14,
  },

  /* ================= TEXT ================= */

  textContainer: {
    marginBottom: 8,
  },

  titleMobile: {
    fontSize: 16,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 4,
  },

  titleTablet: {
    fontSize: 19,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 6,
  },

  localArea: {
    fontSize: 14,
    color: "#555",
  },

  /* ================= ACTIONS ================= */

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginTop: 10,
  },

  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  callText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },

  mapButton: {
    backgroundColor: "#f5e4e1",
    padding: 8,
    borderRadius: 8,
  },
});
