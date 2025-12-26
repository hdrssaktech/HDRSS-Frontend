// // import React, { useEffect, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   Image,
// //   TouchableOpacity,
// //   ScrollView,
// //   ActivityIndicator,
// //   StyleSheet,
// //   Linking,
// // } from "react-native";
// // import axios from "axios";
// // import Icon from "react-native-vector-icons/Ionicons";

// // export default function DistrictBusinessPage3({ route, navigation }) {
// //   const { businessDetailsId } = route.params;

// //   const [details, setDetails] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchDetails();
// //   }, []);

// //   const fetchDetails = async () => {
// //     try {
// //       const url = `https://hdrss-backend.onrender.com/api/business/details/${businessDetailsId}`;
// //       const res = await axios.get(url);
// //       setDetails(res.data.data || []);
// //     } catch (e) {
// //       console.log("❌ Error fetching:", e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const callNow = (num) => num && Linking.openURL(`tel:${num}`);
// //   const whatsappNow = (num) => num && Linking.openURL(`https://wa.me/${num}`);
// //   const openMap = (url) => url && Linking.openURL(url);

// //   if (loading) {
// //     return (
// //       <View style={styles.center}>
// //         <ActivityIndicator size="large" color="#E37714" />
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
// //       {/* HEADER */}
// //       <View style={styles.appBar}>
// //         <TouchableOpacity onPress={() => navigation.goBack()}>
// //           <Icon name="arrow-back" size={24} color="#fff" />
// //         </TouchableOpacity>
// //         <Text style={styles.appBarTitle}>Business List</Text>
// //         <View style={{ width: 30 }} />
// //       </View>

// //       {/* BUSINESS LIST */}
// //       <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
// //         {details.map((item) => (
// //           <TouchableOpacity
// //             key={item.id}
// //             activeOpacity={0.9}
// //             onPress={() =>
// //               navigation.navigate("DistrictBusinessPage4", { item })
// //             }
// //           >
// //             <View style={styles.card}>
// //               {/* IMAGE */}
// //               <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

// //               {/* TEXT + ACTIONS */}
// //               <View style={{ flex: 1, marginLeft: 14 }}>
// //                 <Text style={styles.cardTitle}>{item.name}</Text>
// //                 <Text style={styles.cardSubtitle}>{item.category}</Text>

// //                 {/* ⭐ LOCATION TEXT ADDED HERE */}
// //                 {item.location ? (
// //                   <Text style={styles.locationText}>📍 {item.location}</Text>
// //                 ) : null}

// //                 {/* CONTACT BUTTONS */}
// //                 <View style={{ flexDirection: "row", marginTop: 12 }}>
// //                   <TouchableOpacity
// //                     onPress={() => callNow(item.phoneNo)}
// //                     style={[styles.iconBtn, { backgroundColor: "#8EC9FF" }]}
// //                   >
// //                     <Icon name="call" size={18} color="#005BBB" />
// //                   </TouchableOpacity>

// //                   <TouchableOpacity
// //                     onPress={() =>
// //                       whatsappNow(item.whatsappNo || item.phoneNo)
// //                     }
// //                     style={[styles.iconBtn, { backgroundColor: "#CFFDE1" }]}
// //                   >
// //                     <Icon name="logo-whatsapp" size={18} color="#25D366" />
// //                   </TouchableOpacity>

// //                   <TouchableOpacity
// //                     onPress={() => openMap(item.mapUrl)}
// //                     style={[styles.iconBtn, { backgroundColor: "#FFD7C2" }]}
// //                   >
// //                     <Icon name="map" size={18} color="#FF5722" />
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //             </View>
// //           </TouchableOpacity>
// //         ))}
// //       </ScrollView>
// //     </View>
// //   );
// // }

// // // STYLES
// // const styles = StyleSheet.create({
// //   center: { flex: 1, justifyContent: "center", alignItems: "center" },

// //   appBar: {
// //     height: 90,
// //     paddingTop: 40,
// //     paddingHorizontal: 16,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#93210A",
// //     justifyContent: "space-between",
// //   },
// //   appBarTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },

// //   card: {
// //     flexDirection: "row",
// //     backgroundColor: "#fff",
// //     padding: 12,
// //     borderRadius: 16,
// //     marginHorizontal: 16,
// //     marginBottom: 16,
// //     elevation: 4,
// //   },

// //   cardImage: {
// //     width: 110,
// //     height: 140,
// //     borderRadius: 12,
// //     backgroundColor: "#eee",
// //   },

// //   cardTitle: { fontSize: 17, fontWeight: "700", color: "#222" },
// //   cardSubtitle: { marginTop: 4, color: "#666" },

// //   // ⭐ LOCATION STYLE
// //   locationText: {
// //     marginTop: 4,
// //     color: "#444",
// //     fontSize: 14,
// //   },

// //   iconBtn: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 12,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginRight: 10,
// //   },
// // });







import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Dimensions,
  StatusBar,
  Platform,
  FlatList,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function DistrictBusinessPage3({ route, navigation }) {
  const { businessDetailsId } = route.params;

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const url = `https://hdrss-backend.onrender.com/api/business/details/${businessDetailsId}`;
      const res = await axios.get(url);
      setDetails(res.data.data || []);
    } catch (e) {
      console.log("❌ Error fetching:", e);
    } finally {
      setLoading(false);
    }
  };

  const callNow = (num) => num && Linking.openURL(`tel:${num}`);
  const whatsappNow = (num) => num && Linking.openURL(`https://wa.me/${num}`);
  const openMap = (url) => url && Linking.openURL(url);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E37714" />
        <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
          Loading Business Details...
        </Text>
      </View>
    );
  }

  // Render item function for FlatList
  const renderBusinessItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("DistrictBusinessPage4", { item })
      }
      style={isTablet ? { width: "48%" } : { width: "100%" }}
    >
      <View style={[styles.card, isTablet && styles.cardTablet]}>
        {/* IMAGE */}
        <Image 
          source={{ uri: item.imageUrl }} 
          style={[styles.cardImage, isTablet && styles.cardImageTablet]} 
          resizeMode="cover"
        />

        {/* TEXT + ACTIONS */}
        <View style={[styles.contentContainer, isTablet && styles.contentContainerTablet]}>
          <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]}>
            {item.name}
          </Text>
          <Text style={[styles.cardSubtitle, isTablet && styles.cardSubtitleTablet]}>
            {item.category}
          </Text>

          {/* LOCATION TEXT */}
          {item.location ? (
            <Text style={[styles.locationText, isTablet && styles.locationTextTablet]}>
              📍 {item.location}
            </Text>
          ) : null}

          {/* CONTACT BUTTONS */}
          <View style={[styles.buttonContainer, isTablet && styles.buttonContainerTablet]}>
            <TouchableOpacity
              onPress={() => callNow(item.phoneNo)}
              style={[styles.iconBtn, { backgroundColor: "#8EC9FF" }, isTablet && styles.iconBtnTablet]}
            >
              <Icon name="call" size={isTablet ? 22 : 18} color="#005BBB" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                whatsappNow(item.whatsappNo || item.phoneNo)
              }
              style={[styles.iconBtn, { backgroundColor: "#CFFDE1" }, isTablet && styles.iconBtnTablet]}
            >
              <Icon name="logo-whatsapp" size={isTablet ? 22 : 18} color="#25D366" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openMap(item.mapUrl)}
              style={[styles.iconBtn, { backgroundColor: "#FFD7C2" }, isTablet && styles.iconBtnTablet]}
            >
              <Icon name="map" size={isTablet ? 22 : 18} color="#FF5722" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* HEADER */}
      <View style={[styles.appBar, isTablet && styles.appBarTablet]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
        >
          <Icon name="arrow-back" size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, isTablet && styles.appBarTitleTablet]}>
          Business List
        </Text>
        <View style={{ width: isTablet ? 40 : 30 }} />
      </View>

      {/* BUSINESS LIST - Using FlatList for 2 column layout on tablet */}
      <FlatList
        data={details}
        renderItem={renderBusinessItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={isTablet ? 2 : 1}
        contentContainerStyle={[
          styles.listContainer,
          isTablet && styles.listContainerTablet
        ]}
        columnWrapperStyle={isTablet && styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#F6F7FB",
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

  // List Container - Mobile (1 column)
  listContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  // List Container - Tablet (2 columns)
  listContainerTablet: {
    paddingVertical: 25,
    paddingHorizontal: 20,
  },

  // Column Wrapper - Tablet only (2 columns)
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },

  // Card - Mobile (1 column - full width)
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  // Card - Tablet (2 columns - 48% width each)
  cardTablet: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 0,
  },

  // Card Image - Mobile
  cardImage: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  // Card Image - Tablet
  cardImageTablet: {
    height: 160,
    borderRadius: 16,
  },

  // Content Container - Mobile
  contentContainer: {
    flex: 1,
  },
  // Content Container - Tablet
  contentContainerTablet: {
    // Same as mobile for consistency
  },

  // Card Title - Mobile
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  // Card Title - Tablet
  cardTitleTablet: {
    fontSize: 18,
  },

  // Card Subtitle - Mobile
  cardSubtitle: {
    marginBottom: 6,
    color: "#666",
    fontSize: 14,
  },
  // Card Subtitle - Tablet
  cardSubtitleTablet: {
    fontSize: 15,
  },

  // Location Text - Mobile
  locationText: {
    marginBottom: 12,
    color: "#444",
    fontSize: 14,
  },
  // Location Text - Tablet
  locationTextTablet: {
    fontSize: 15,
  },

  // Button Container - Mobile
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  // Button Container - Tablet
  buttonContainerTablet: {
    justifyContent: "center",
  },

  // Icon Button - Mobile
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  // Icon Button - Tablet
  iconBtnTablet: {
    width: 44,
    height: 44,
    borderRadius: 16,
    marginHorizontal: 8,
  },
});