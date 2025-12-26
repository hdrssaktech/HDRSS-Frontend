// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import axios from "axios";

// export default function DistrictBusinessPage0() {
//   const route = useRoute();
//   const navigation = useNavigation();

//   const { districtId, districtName } = route.params || {};

//   const [businessList, setBusinessList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBusiness = async () => {
//       try {
//         const url = `https://hdrss-backend.onrender.com/api/business/type/district/${districtId}`;
//         console.log("🔍 FETCH =", url);

//         const res = await axios.get(url);

//         if (res.data?.resultData && Array.isArray(res.data.resultData)) {
//           setBusinessList(res.data.resultData);
//         } else {
//           setBusinessList([]);
//         }
//       } catch (err) {
//         console.log("❌ Error =", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusiness();
//   }, [districtId]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#E37714" />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
//       {/* 🔥 NEW HEADER (same as DistrictBusinessPage3) */}
//       <View style={styles.appBar}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>

//         <Text style={styles.appBarTitle}>{districtName} Business</Text>

//         <View style={{ width: 30 }} />
//       </View>

//       {/* BUSINESS LIST */}
//       <FlatList
//         data={businessList}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         contentContainerStyle={{ padding: 10 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.card}
//             onPress={() =>
//               navigation.navigate("DistrictBusinessPage1", {
//                 businessId: item.id,
//                 businessName: item.name,
//               })
//             }
//           >
//             <Image
//               source={{
//                 uri:
//                   item.imageUrl?.trim() !== ""
//                     ? item.imageUrl
//                     : "https://via.placeholder.com/200x200?text=No+Image",
//               }}
//               style={styles.image}
//             />
//             <Text style={styles.name}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   /* 🔥 SAME HEADER STYLE AS DistrictBusinessPage3 */
//   appBar: {
//     height: 90,
//     paddingTop: 40,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#93210A",
//     justifyContent: "space-between",
//   },
//   appBarTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#fff",
//   },

//   card: {
//     width: "48%",
//     backgroundColor: "#fff",
//     margin: "1%",
//     padding: 10,
//     borderRadius: 10,
//     alignItems: "center",
//     elevation: 3,
//   },

//   image: {
//     width: "100%",
//     height: 120,
//     borderRadius: 10,
//     backgroundColor: "#eee",
//   },

//   name: {
//     marginTop: 8,
//     fontSize: 16,
//     textAlign: "center",
//     fontWeight: "600",
//     color: "#222",
//   },
// });


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function DistrictBusinessPage0() {
  const route = useRoute();
  const navigation = useNavigation();

  const { districtId, districtName } = route.params || {};

  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const url = `https://hdrss-backend.onrender.com/api/business/type/district/${districtId}`;
        console.log("🔍 FETCH =", url);

        const res = await axios.get(url);

        if (res.data?.resultData && Array.isArray(res.data.resultData)) {
          setBusinessList(res.data.resultData);
        } else {
          setBusinessList([]);
        }
      } catch (err) {
        console.log("❌ Error =", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [districtId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E37714" />
        <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
          Loading Businesses...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* Header */}
      <View style={[styles.appBar, isTablet && styles.appBarTablet]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
        >
          <Ionicons name="arrow-back" size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.appBarTitle, isTablet && styles.appBarTitleTablet]}>
          {districtName} Business
        </Text>

        <View style={{ width: isTablet ? 40 : 30 }} />
      </View>

      {/* Business List */}
      <FlatList
        data={businessList}
        keyExtractor={(item) => item.id.toString()}
        numColumns={isTablet ? 3 : 2}
        contentContainerStyle={[styles.listContainer, isTablet && styles.listContainerTablet]}
        columnWrapperStyle={isTablet && styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, isTablet && styles.cardTablet]}
            onPress={() =>
              navigation.navigate("DistrictBusinessPage1", {
                businessId: item.id,
                businessName: item.name,
              })
            }
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri:
                  item.imageUrl?.trim() !== ""
                    ? item.imageUrl
                    : "https://via.placeholder.com/200x200?text=No+Image",
              }}
              style={[styles.image, isTablet && styles.imageTablet]}
              resizeMode="cover"
            />
            <Text style={[styles.name, isTablet && styles.nameTablet]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#E37714",
    fontWeight: "600",
  },
  loadingTextTablet: {
    fontSize: 16,
    marginTop: 15,
  },

  // Header - Mobile
  appBar: {
    height: 90,
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    justifyContent: "space-between",
    elevation: 6,
    shadowColor: "#93210A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  // Header - Tablet
  appBarTablet: {
    height: 100,
    paddingTop: Platform.OS === 'ios' ? 45 : 35,
    paddingHorizontal: 30,
  },

  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  backButtonTablet: {
    padding: 10,
    borderRadius: 25,
  },

  // Header Title - Mobile
  appBarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  // Header Title - Tablet
  appBarTitleTablet: {
    fontSize: 24,
  },

  // List Container - Mobile
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  // List Container - Tablet
  listContainerTablet: {
    padding: 16,
    paddingBottom: 30,
  },

  // Column Wrapper - Tablet only
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  // Card - Mobile (2 columns - 48% width)
  card: {
    width: "48%",
    backgroundColor: "#fff",
    margin: "1%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // Card - Tablet (3 columns - 32% width)
  cardTablet: {
    width: "32%",
    padding: 16,
    borderRadius: 14,
    margin: "0.66%",
  },

  // Image - Mobile
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  // Image - Tablet
  imageTablet: {
    height: 140,
    borderRadius: 12,
  },

  // Name - Mobile
  name: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#222",
    paddingHorizontal: 4,
  },
  // Name - Tablet
  nameTablet: {
    fontSize: 18,
    marginTop: 12,
  },
});