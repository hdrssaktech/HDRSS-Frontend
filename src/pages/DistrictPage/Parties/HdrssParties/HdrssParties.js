// import React from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Image,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";

// export default function HdrssParties() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { districtId } = route.params || {};
//   console.log("District ID in HdrssParties:", districtId);
//   const cards = [
//     {
//       id: 1,
//       title: "HDRSS Members",
//       image: require("../../../../../assets/idcard/logo_hdrss-1.png"), // add image
//       screen: "Member", // your next screen
//     },
//     {
//       id: 2,
//       title: "Member Events",
//       image: require("../../../../../assets/idcard/logo_hdrss-1.png"), // add image`
//       screen: "HDRSSMemberevents", // your next screen
//     },
//   ];

//   const renderCard = (item) => (
//     <TouchableOpacity
//       key={item.id}
//       style={styles.card}
//       activeOpacity={0.85}
//       onPress={() => navigation.navigate(item.screen,{districtId})}
//     >
//       <View style={styles.imageContainer}>
//         <Image source={item.image} style={styles.image} resizeMode="cover" />
//       </View>

//       <View style={styles.bottom}>
//         <Text style={styles.title}>{item.title}</Text>

//         <View style={styles.arrowCircle}>
//           <Ionicons name="arrow-forward" size={18} color="#8B0000" />
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar backgroundColor="#8B0000" barStyle="light-content" />

//       <View style={styles.container}>
//         <Text style={styles.header}>HDRSS</Text>

//         <View style={styles.cardContainer}>
//           {cards.map(renderCard)}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: "#8B0000" },

//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 16,
//   },

//   header: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: "#8B0000",
//     marginBottom: 20,
//     textAlign: "center",
//   },

//   cardContainer: {
//     gap: 20,
//   },

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     overflow: "hidden",
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: "rgba(139,0,0,0.15)",
//   },

//   imageContainer: {
//     height: 170,
//     backgroundColor: "#f2f2f2",
//   },

//   image: {
//     width: "100%",
//     height: "100%",
//   },

//   bottom: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//   },

//   title: {
//     fontSize: 16,
//     fontWeight: "800",
//     color: "#8B0000",
//   },

//   arrowCircle: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: "rgba(139,0,0,0.1)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });


import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;
const cardWidth = isTablet ? (width - 80) / 3 : (width - 48) / 2;

export default function HdrssParties() {
  const navigation = useNavigation();
  const route = useRoute();
  const { districtId,districtName } = route.params || {};
  // console.log("District ID in HdrssParties:", districtId);
  console.log("District Name in HdrssParties:", districtName);

  const cards = [
    {
      id: 1,
      title: "HDRSS Members",
      image: require("../../../../../assets/Header/sun.jpg"),
      screen: "Member",
    },
    {
      id: 2,
      title: "Member Events",
      image: require("../../../../../assets/Header/sun.jpg"),
      screen: "HDRSSMemberevents",
    },
  ];

  const renderCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, { width: cardWidth }]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate(item.screen, { districtId,districtName })}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
        <Ionicons name="chevron-back" size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>HDRSS</Text>
          <View style={styles.headerUnderline} />
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Cards Container */}
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardContainer}>
          {cards.map(renderCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#f8f9fa",
  },

  // Header Styles
  headerContainer: {
    backgroundColor: "#8B0000",
    paddingTop: isTablet ? 24 : 5,
    paddingBottom: isTablet ? 20 : 30,
    paddingHorizontal: isTablet ? 24 : 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: isTablet ?  30: 23,
    borderBottomRightRadius: isTablet ?  30: 23,
  },

  backButton: {
    width: isTablet ? 50 : 40,
    height: isTablet ? 50: 40,
    borderRadius: isTablet ? 22 : 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: isTablet ? 20 : 30,

  },

 headerTitle: {
    fontSize: isTablet ? 26 : 21,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1.5,
    marginTop: isTablet ? 20 : 30,

  },

   placeholder: {
    width: isTablet ? 44 : 40,
  },

  // Container Styles
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  scrollContent: {
    padding: isTablet ? 24 : 16,
  },

  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: isTablet ? "flex-start" : "space-between",
    gap: isTablet ? 20 : 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: isTablet ? 18 : 16,
    marginBottom: isTablet ? 20 : 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  imageContainer: {
    height: isTablet ? 140 : 150,
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  cardContent: {
    paddingVertical: isTablet ? 14 : 12,
    paddingHorizontal: isTablet ? 14 : 12,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    fontSize: isTablet ? 16 : 14,
    fontWeight: "700",
    color: "#8B0000",
    textAlign: "center",
  },
});