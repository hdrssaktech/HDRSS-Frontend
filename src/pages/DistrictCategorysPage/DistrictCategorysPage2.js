// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   TouchableOpacity,
//   Linking,
//   Dimensions,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { getPlaceDetails } from "../../api/api.js";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// export default function DistrictCategorysPage2() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { districtId, categoryName, placeId } = route.params;
//   const [place, setPlace] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const { width } = Dimensions.get("window");

//   useEffect(() => {
//     const fetchPlace = async () => {
//       try {
//         const data = await getPlaceDetails(districtId, categoryName, placeId);
//         setPlace(data);
//       } catch (error) {
//         console.error("Error fetching place details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPlace();
//   }, [districtId, categoryName, placeId]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#93210A" />
//       </View>
//     );
//   }

//   if (!place) {
//     return (
//       <View style={styles.center}>
//         <Text>No details found</Text>
//       </View>
//     );
//   }

//   const openPhone = () => {
//     Linking.openURL(`tel:${place.phone}`);
//   };

//   const openWhatsApp = () => {
//     Linking.openURL(`https://wa.me/${place.whatsapp.replace(/\D/g, "")}`);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* Image Banner with Back Arrow */}
//       <View style={{ position: "relative" }}>
//         <Image source={{ uri: place.image }} style={[styles.image, { width }]} />

//         {/* Back Button */}
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={28} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Name & Category */}
//       <View style={styles.header}>
//         <Text style={styles.title}>{place.name}</Text>
//         <View style={styles.categoryBadge}>
//           <Text style={styles.categoryText}>{categoryName.toUpperCase()}</Text>
//         </View>
//       </View>

//       {/* Contact & Location Buttons */}
//       <View style={styles.buttonRow}>
//         {place.phone && (
//           <TouchableOpacity style={styles.button} onPress={openPhone}>
//             <MaterialIcons name="call" size={20} color="#fff" />
//             <Text style={styles.buttonText}>Call</Text>
//           </TouchableOpacity>
//         )}
//         {place.whatsapp && (
//           <TouchableOpacity
//             style={[styles.button, styles.whatsappButton]}
//             onPress={openWhatsApp}
//           >
//             <Ionicons name="logo-whatsapp" size={20} color="#fff" />
//             <Text style={styles.buttonText}>WhatsApp</Text>
//           </TouchableOpacity>
//         )}
//         {place.location && (
//           <TouchableOpacity
//             style={[styles.button, styles.locationButton]}
//             onPress={() => Linking.openURL(place.location)}
//           >
//             <Ionicons name="location-sharp" size={20} color="#fff" />
//             <Text style={styles.buttonText}>Location</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Description */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>About</Text>
//         <Text style={styles.description}>{place.description}</Text>
//       </View>

//       {/* Gallery */}
//       {place.gallery && place.gallery.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Gallery</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {place.gallery.map((img, index) => (
//               <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
//             ))}
//           </ScrollView>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   image: {
//     height: 250,
//     resizeMode: "cover",
//   },
//   backButton: {
//     position: "absolute",
//     top: 40,
//     left: 15,
   
//     borderRadius: 20,
//     padding: 5,
//   },
//   header: {
//     padding: 15,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderColor: "#ddd",
//   },
//   title: {
//     fontSize: 29,
//     fontWeight: "bold",
//     color: "#93210A",
//   },
//   categoryBadge: {
//     marginTop: 5,
//     alignSelf: "flex-start",
//     backgroundColor: "#ffd700",
//     borderRadius: 20,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//   },
//   categoryText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   section: {
//     backgroundColor: "#fff",
//     marginTop: 10,
//     padding: 15,
//     borderRadius: 10,
//     marginHorizontal: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 16,
//     color: "#555",
//     lineHeight: 22,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingVertical: 15,
//   },
//   button: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#93210A",
//     padding: 12,
//     borderRadius: 8,
//   },
//   whatsappButton: {
//     backgroundColor: "#25D366",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     marginLeft: 5,
//     fontWeight: "bold",
//   },
//   galleryImage: {
//     width: 200,
//     height: 150,
//     borderRadius: 10,
//     marginRight: 10,
//   },
// });













import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getPlaceDetails } from "../../api/api.js";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function DistrictCategorysPage2() {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId, categoryName, placeId } = route.params;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  const { width } = Dimensions.get("window");

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        console.log("🧭 Fetching place details for:", { districtId, categoryName, placeId });
        const data = await getPlaceDetails(districtId, categoryName, placeId);

        if (data) {
          console.log("✅ Place details fetched successfully:", data.name);
          setPlace(data);
        } else {
          console.warn("⚠️ No place details found");
          setPlace(null);
        }
      } catch (error) {
        console.error("❌ Error fetching place details:", error);
        setPlace(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [districtId, categoryName, placeId]);

  // 📞 Open phone dialer
  const openPhone = () => {
    if (place?.phone) {
      Linking.openURL(`tel:${place.phone}`).catch(() =>
        Alert.alert("Error", "Unable to open phone app.")
      );
    }
  };

  // 💬 Open WhatsApp chat
  const openWhatsApp = () => {
    if (place?.whatsapp) {
      const number = place.whatsapp.replace(/\D/g, "");
      Linking.openURL(`https://wa.me/${number}`).catch(() =>
        Alert.alert("Error", "Unable to open WhatsApp.")
      );
    }
  };

  // 📍 Open map or location link
  const openLocation = () => {
    if (place?.location) {
      Linking.openURL(place.location).catch(() =>
        Alert.alert("Error", "Unable to open location.")
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#93210A", fontSize: 18 }}>No details found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 🖼️ Banner Image + Back Button */}
      <View style={{ position: "relative" }}>
        <Image
          source={{
            uri:
              place.image ||
              "https://via.placeholder.com/600x400.png?text=No+Image+Available",
          }}
          style={[styles.image, { width }]}
        />

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 🏷️ Title + Category */}
      <View style={styles.header}>
        <Text style={styles.title}>{place.name || "Unnamed Place"}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {categoryName ? categoryName.toUpperCase() : "CATEGORY"}
          </Text>
        </View>
      </View>

      {/* ☎️ Contact Buttons */}
      <View style={styles.buttonRow}>
        {place.phone && (
          <TouchableOpacity style={styles.button} onPress={openPhone}>
            <MaterialIcons name="call" size={20} color="#fff" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
        )}

        {place.whatsapp && (
          <TouchableOpacity
            style={[styles.button, styles.whatsappButton]}
            onPress={openWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        )}

        {place.location && (
          <TouchableOpacity
            style={[styles.button, styles.locationButton]}
            onPress={openLocation}
          >
            <Ionicons name="location-sharp" size={20} color="#fff" />
            <Text style={styles.buttonText}>Location</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 📝 About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          {place.description || "No description available for this place."}
        </Text>
      </View>

      {/* 🖼️ Gallery Section */}
      {place.gallery && Array.isArray(place.gallery) && place.gallery.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {place.gallery.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.galleryImage}
                onError={(e) => console.warn("Image load error:", e.nativeEvent.error)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 250,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 5,
  },
  header: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
  },
  categoryBadge: {
    marginTop: 5,
    alignSelf: "flex-start",
    backgroundColor: "#ffd700",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: "#555",
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    padding: 12,
    borderRadius: 8,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  locationButton: {
    backgroundColor: "#007BFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "bold",
  },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
});
