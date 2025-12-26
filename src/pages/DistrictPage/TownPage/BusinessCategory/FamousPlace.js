// import React from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Linking,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { WebView } from "react-native-webview";

// const FamousPlaceDetails = ({ route }) => {
//   const { place } = route.params;
//   const navigation = useNavigation();

//   return (
//     <ScrollView style={styles.container}>
//       {/* 🔙 Banner Image + Back Arrow */}
//       <View>
//         <Image source={{ uri: place.image }} style={styles.bannerImage} />

//         <TouchableOpacity
//           style={styles.backBtn}
//           onPress={() => navigation.goBack()}
//         >
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* 🏷 Title */}
//       <Text style={styles.title}>
//         {place.title || "Famous Place"}
//       </Text>

//       {/* 📌 Category
//       <View style={styles.badge}>
//         <Text style={styles.badgeText}>TEMPLE</Text>
//       </View> */}

//       {/* 📞 Action Buttons */}
//       <View style={styles.actionRow}>
//         {place.phone && (
//           <TouchableOpacity
//             style={[styles.actionBtn, { backgroundColor: "#8B1E0F" }]}
//             onPress={() => Linking.openURL(`tel:${place.phone}`)}
//           >
//             <Ionicons name="call" size={20} color="#fff" />
//             <Text style={styles.actionText}>Call</Text>
//           </TouchableOpacity>
//         )}

//         {place.whatsapp && (
//           <TouchableOpacity
//             style={[styles.actionBtn, { backgroundColor: "#25D366" }]}
//             onPress={() =>
//               Linking.openURL(`https://wa.me/${place.whatsapp}`)
//             }
//           >
//             <Ionicons name="logo-whatsapp" size={20} color="#fff" />
//             <Text style={styles.actionText}>WhatsApp</Text>
//           </TouchableOpacity>
//         )}

//         {place.location && (
//           <TouchableOpacity
//             style={[styles.actionBtn, { backgroundColor: "#1E88E5" }]}
//             onPress={() => Linking.openURL(place.location)}
//           >
//             <Ionicons name="location" size={20} color="#fff" />
//             <Text style={styles.actionText}>Location</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* ℹ️ About */}
//       {place.description && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>About</Text>
//           <Text style={styles.cardText}>{place.description}</Text>
//         </View>
//       )}

//       {/* 🖼 Gallery */}
//       {place.gallery && place.gallery.length > 0 && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Gallery</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {place.gallery.map((img, index) => (
//               <Image
//                 key={index}
//                 source={{ uri: img }}
//                 style={styles.galleryImage}
//               />
//             ))}
//           </ScrollView>
//         </View>
//       )}

//       {/* 🎥 Video */}
//       {place.video && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Video</Text>
//           <View style={styles.videoContainer}>
//             <WebView
//               source={{ uri: place.video }}
//               allowsFullscreenVideo
//             />
//           </View>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// export default FamousPlaceDetails;

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
//     marginTop: 12,
//     marginHorizontal: 16,
//     color: "#8B1E0F",
//   },
//   badge: {
//     backgroundColor: "#F5C400",
//     alignSelf: "flex-start",
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 20,
//     marginLeft: 16,
//     marginTop: 6,
//   },
//   badgeText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   actionRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginVertical: 16,
//     marginHorizontal: 12,
//   },
//   actionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   actionText: {
//     color: "#fff",
//     marginLeft: 6,
//     fontWeight: "600",
//   },
//   card: {
//     backgroundColor: "#fff",
//     marginHorizontal: 16,
//     marginBottom: 16,
//     padding: 14,
//     borderRadius: 10,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#8B1E0F",
//     marginBottom: 6,
//   },
//   cardText: {
//     fontSize: 14,
//     lineHeight: 22,
//     color: "#555",
//   },
//   galleryImage: {
//     width: 140,
//     height: 100,
//     borderRadius: 8,
//     marginRight: 10,
//     marginTop: 8,
//   },
//   videoContainer: {
//     height: 200,
//     borderRadius: 10,
//     overflow: "hidden",
//   },
// });





import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

const FamousPlaceDetails = ({ route }) => {
  const { place } = route.params;
  const navigation = useNavigation();

  // Responsive dimensions
  const bannerHeight = isTablet ? (isLargeTablet ? 350 : 320) : 260;
  const titleFontSize = isTablet ? (isLargeTablet ? 28 : 26) : 22;
  const cardTitleFontSize = isTablet ? (isLargeTablet ? 22 : 20) : 18;
  const cardTextFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 14;
  const actionBtnFontSize = isTablet ? (isLargeTablet ? 16 : 15) : 14;
  const galleryImageWidth = isTablet ? (isLargeTablet ? 180 : 160) : 140;
  const galleryImageHeight = isTablet ? (isLargeTablet ? 140 : 120) : 100;
  const videoHeight = isTablet ? (isLargeTablet ? 250 : 220) : 200;

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Banner Image + Back Arrow */}
      <View>
        <Image 
          source={{ uri: place.image }} 
          style={[styles.bannerImage, { height: bannerHeight }]} 
        />

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

      {/* 🏷 Title */}
      <Text style={[styles.title, { fontSize: titleFontSize }]}>
        {place.title || "Famous Place"}
      </Text>

      {/* 📞 Action Buttons */}
      <View style={[styles.actionRow, isTablet && styles.actionRowTablet]}>
        {place.phone && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#8B1E0F" }, isTablet && styles.actionBtnTablet]}
            onPress={() => Linking.openURL(`tel:${place.phone}`)}
          >
            <Ionicons 
              name="call" 
              size={isTablet ? 24 : 20} 
              color="#fff" 
            />
            <Text style={[styles.actionText, { fontSize: actionBtnFontSize }]}>
              Call
            </Text>
          </TouchableOpacity>
        )}

        {place.whatsapp && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#25D366" }, isTablet && styles.actionBtnTablet]}
            onPress={() =>
              Linking.openURL(`https://wa.me/${place.whatsapp}`)
            }
          >
            <Ionicons 
              name="logo-whatsapp" 
              size={isTablet ? 24 : 20} 
              color="#fff" 
            />
            <Text style={[styles.actionText, { fontSize: actionBtnFontSize }]}>
              WhatsApp
            </Text>
          </TouchableOpacity>
        )}

        {place.location && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#1E88E5" }, isTablet && styles.actionBtnTablet]}
            onPress={() => Linking.openURL(place.location)}
          >
            <Ionicons 
              name="location" 
              size={isTablet ? 24 : 20} 
              color="#fff" 
            />
            <Text style={[styles.actionText, { fontSize: actionBtnFontSize }]}>
              Location
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ℹ️ About */}
      {place.description && (
        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={[styles.cardTitle, { fontSize: cardTitleFontSize }]}>
            About
          </Text>
          <Text style={[styles.cardText, { fontSize: cardTextFontSize }]}>
            {place.description}
          </Text>
        </View>
      )}

      {/* 🖼 Gallery */}
      {place.gallery && place.gallery.length > 0 && (
        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={[styles.cardTitle, { fontSize: cardTitleFontSize }]}>
            Gallery
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryContainer}
          >
            {place.gallery.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={[
                  styles.galleryImage,
                  isTablet && styles.galleryImageTablet,
                  { 
                    width: galleryImageWidth, 
                    height: galleryImageHeight 
                  }
                ]}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* 🎥 Video */}
      {place.video && (
        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={[styles.cardTitle, { fontSize: cardTitleFontSize }]}>
            Video
          </Text>
          <View style={[styles.videoContainer, { height: videoHeight }]}>
            <WebView
              source={{ uri: place.video }}
              allowsFullscreenVideo
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default FamousPlaceDetails;

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
    marginTop: 12,
    marginHorizontal: 16,
    color: "#8B1E0F",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    marginHorizontal: 12,
  },
  actionRowTablet: {
    marginVertical: 20,
    marginHorizontal: 30,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionBtnTablet: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    elevation: 3,
  },
  cardTablet: {
    marginHorizontal: 30,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#8B1E0F",
    marginBottom: 6,
  },
  cardText: {
    lineHeight: 22,
    color: "#555",
  },
  galleryContainer: {
    paddingRight: 10,
  },
  galleryImage: {
    borderRadius: 8,
    marginRight: 10,
    marginTop: 8,
  },
  galleryImageTablet: {
    borderRadius: 10,
    marginRight: 12,
  },
  videoContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
});