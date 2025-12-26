// import React from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Linking,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";

// const TouristSpotDetails = ({ route }) => {
//   const { spot } = route.params;
//   const navigation = useNavigation();

//   return (
//     <ScrollView style={styles.container}>
//       {/* Banner */}
//       <View>
//         <Image source={{ uri: spot.image }} style={styles.bannerImage} />

//         {/* Back Arrow */}
//         <TouchableOpacity
//           style={styles.backBtn}
//           onPress={() => navigation.goBack()}
//         >
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Title */}
//       <Text style={styles.title}>{spot.name}</Text>

//       {/* Distance */}
//       {spot.distance && (
//         <View style={styles.distanceRow}>
//           <Ionicons name="location" size={14} color="#93210A" />
//           <Text style={styles.distanceText}>{spot.distance}</Text>
//         </View>
//       )}

//       {/* Action Buttons */}
//       <View style={styles.actionRow}>
//         {spot.phone && (
//           <TouchableOpacity
//             style={styles.actionBtn}
//             onPress={() => Linking.openURL(`tel:${spot.phone}`)}
//           >
//             <Ionicons name="call" size={18} color="#fff" />
//             <Text style={styles.actionText}>Call</Text>
//           </TouchableOpacity>
//         )}

//         {spot.whatsapp && (
//           <TouchableOpacity
//             style={[styles.actionBtn, { backgroundColor: "#25D366" }]}
//             onPress={() =>
//               Linking.openURL(`https://wa.me/${spot.whatsapp}`)
//             }
//           >
//             <Ionicons name="logo-whatsapp" size={18} color="#fff" />
//             <Text style={styles.actionText}>WhatsApp</Text>
//           </TouchableOpacity>
//         )}

//         {spot.location && (
//           <TouchableOpacity
//             style={[styles.actionBtn, { backgroundColor: "#1E88E5" }]}
//             onPress={() => Linking.openURL(spot.location)}
//           >
//             <Ionicons name="location" size={18} color="#fff" />
//             <Text style={styles.actionText}>Map</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* About */}
//       {spot.description && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>About</Text>
//           <Text style={styles.cardText}>{spot.description}</Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// export default TouristSpotDetails;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#F5F5F5",
//   },
//   bannerImage: {
//     width: "100%",
//     height: 260,
//   },
//   backBtn: {
//     position: "absolute",
//     top: 40,
//     left: 16,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     padding: 8,
//     borderRadius: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#93210A",
//     margin: 16,
//   },
//   distanceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginLeft: 16,
//   },
//   distanceText: {
//     marginLeft: 6,
//     color: "#555",
//   },
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginVertical: 16,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#93210A",
//     padding: 10,
//     borderRadius: 8,
//   },
//   actionText: {
//     color: "#fff",
//     marginLeft: 6,
//   },
//   card: {
//     backgroundColor: "#fff",
//     margin: 16,
//     padding: 14,
//     borderRadius: 10,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginBottom: 6,
//   },
//   cardText: {
//     fontSize: 14,
//     lineHeight: 22,
//     color: "#555",
//   },
// });








import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

const TouristSpotDetails = ({ route }) => {
  const { spot } = route.params;
  const navigation = useNavigation();

  // Responsive dimensions
  const bannerHeight = isTablet ? (isLargeTablet ? 350 : 320) : 260;
  const titleFontSize = isTablet ? (isLargeTablet ? 28 : 26) : 22;
  const cardTitleFontSize = isTablet ? (isLargeTablet ? 22 : 20) : 18;
  const cardTextFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 14;
  const actionBtnFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 14;
  const distanceFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 14;
  const iconSize = isTablet ? 20 : 18;

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View>
        <Image 
          source={{ uri: spot.image }} 
          style={[styles.bannerImage, { height: bannerHeight }]} 
        />

        {/* Back Arrow */}
        <TouchableOpacity
          style={[styles.backBtn, isTablet && styles.backBtnTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back" 
            size={isTablet ? 28 : 24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={[styles.title, { fontSize: titleFontSize }]}>
        {spot.name}
      </Text>

      {/* Distance */}
      {spot.distance && (
        <View style={[styles.distanceRow, isTablet && styles.distanceRowTablet]}>
          <Ionicons 
            name="location" 
            size={isTablet ? 18 : 14} 
            color="#93210A" 
          />
          <Text style={[styles.distanceText, { fontSize: distanceFontSize }]}>
            {spot.distance}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={[styles.actionRow, isTablet && styles.actionRowTablet]}>
        {spot.phone && (
          <TouchableOpacity
            style={[styles.actionBtn, isTablet && styles.actionBtnTablet]}
            onPress={() => Linking.openURL(`tel:${spot.phone}`)}
          >
            <Ionicons 
              name="call" 
              size={iconSize} 
              color="#fff" 
            />
            <Text style={[styles.actionText, { fontSize: actionBtnFontSize }]}>
              Call
            </Text>
          </TouchableOpacity>
        )}

        {spot.whatsapp && (
          <TouchableOpacity
            style={[
              styles.actionBtn, 
              { backgroundColor: "#25D366" }, 
              isTablet && styles.actionBtnTablet
            ]}
            onPress={() =>
              Linking.openURL(`https://wa.me/${spot.whatsapp}`)
            }
          >
            <Ionicons 
              name="logo-whatsapp" 
              size={iconSize} 
              color="#fff" 
            />
            <Text style={[styles.actionText, { fontSize: actionBtnFontSize }]}>
              WhatsApp
            </Text>
          </TouchableOpacity>
        )}

        {spot.location && (
          <TouchableOpacity
            style={[
              styles.actionBtn, 
              { backgroundColor: "#1E88E5" }, 
              isTablet && styles.actionBtnTablet
            ]}
            onPress={() => Linking.openURL(spot.location)}
          >
            <Ionicons 
              name="location" 
              size={iconSize} 
              color="#fff" 
            />
            <Text style={[styles.actionText, { fontSize: actionBtnFontSize }]}>
              Map
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* About */}
      {spot.description && (
        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={[styles.cardTitle, { fontSize: cardTitleFontSize }]}>
            About
          </Text>
          <Text style={[styles.cardText, { fontSize: cardTextFontSize }]}>
            {spot.description}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default TouristSpotDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  bannerImage: {
    width: "100%",
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 20,
  },
  backBtnTablet: {
    top: 50,
    left: 25,
    padding: 10,
    borderRadius: 25,
  },
  title: {
    fontWeight: "bold",
    color: "#93210A",
    margin: 16,
  },
  titleTablet: {
    marginHorizontal: 30,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginTop: -8,
    marginBottom: 8,
  },
  distanceRowTablet: {
    marginLeft: 30,
    marginTop: -10,
    marginBottom: 10,
  },
  distanceText: {
    marginLeft: 6,
    color: "#555",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    marginHorizontal: 16,
  },
  actionRowTablet: {
    marginVertical: 20,
    marginHorizontal: 30,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: "center",
  },
  actionBtnTablet: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
  },
  actionText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTablet: {
    marginHorizontal: 30,
    marginBottom: 25,
    padding: 22,
    borderRadius: 16,
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 8,
  },
  cardText: {
    lineHeight: 24,
    color: "#555",
    textAlign: "justify",
  },
  cardTextTablet: {
    lineHeight: 28,
  },
});