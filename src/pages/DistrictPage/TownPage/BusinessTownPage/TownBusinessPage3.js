// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Linking,
//   Modal,
//   Dimensions,
//   StatusBar,
//   Platform
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from 'expo-linear-gradient';

// const { width: screenWidth } = Dimensions.get('window');

// export default function TownBusinessPage4() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { businessData } = route.params;
  
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [imageError, setImageError] = useState(false);

//   console.log("Business Data:", businessData);

//   // Function to handle phone call
//   const handleCall = (phoneNumber) => {
//     if (phoneNumber) {
//       Linking.openURL(`tel:${phoneNumber}`).catch(err => {
//         console.log('Error making phone call:', err);
//       });
//     }
//   };

//   // Function to handle WhatsApp
//   const handleWhatsApp = (whatsappNumber) => {
//     if (whatsappNumber) {
//       const cleanedNumber = whatsappNumber.replace(/[\s+\-()]|^\+|^0/g, '');
//       Linking.openURL(`https://wa.me/${cleanedNumber}`).catch(err => {
//         console.log('Error opening WhatsApp:', err);
//       });
//     }
//   };

//   // Function to handle location/map
//   const handleOpenMap = (address) => {
//     if (address) {
//       const encodedAddress = encodeURIComponent(address);
//       Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`).catch(err => {
//         console.log('Error opening map:', err);
//       });
//     }
//   };

//   // Function to open YouTube video
//   const handleOpenVideo = (videoUrl) => {
//     if (videoUrl) {
//       Linking.openURL(videoUrl).catch(err => {
//         console.log('Error opening video:', err);
//       });
//     }
//   };

//   // Function to open image in modal
//   const openImageModal = (imageUri) => {
//     setSelectedImage(imageUri);
//     setModalVisible(true);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
//       {/* Header with Back Button */}
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Ionicons name="chevron-back" size={28} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Business Details</Text>
//         <View style={styles.headerPlaceholder} />
//       </View>

//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Hero Section with Main Image */}
//         <View style={styles.heroContainer}>
//           <TouchableOpacity onPress={() => openImageModal(businessData.image)} activeOpacity={0.9}>
//             <Image 
//               source={{ uri: businessData.image }} 
//               style={styles.mainImage}
//               onError={() => setImageError(true)}
//             />
//             <LinearGradient
//               colors={['transparent', 'rgba(0,0,0,0.3)']}
//               style={styles.imageGradient}
//             />
//           </TouchableOpacity>
          
//           {/* Business Title Overlay */}
//           <View style={styles.titleOverlay}>
//             <Text style={styles.businessTitle}>{businessData.title}</Text>
//             <View style={styles.ratingContainer}>
//               <Ionicons name="star" size={16} color="#FFD700" />
//               <Text style={styles.ratingText}>4.8 • Business</Text>
//             </View>
//           </View>
//         </View>

//         {/* Description Card */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Ionicons name="information-circle" size={24} color="#93210A" />
//             <Text style={styles.cardTitle}>About</Text>
//           </View>
//           <Text style={styles.businessDescription}>
//             {businessData.description || "No description available for this business."}
//           </Text>
//         </View>

//         {/* Quick Action Cards */}
//         <View style={styles.actionsGrid}>
//           <TouchableOpacity 
//             style={[styles.actionCard, !businessData.phone && styles.disabledCard]}
//             onPress={() => handleCall(businessData.phone)}
//             disabled={!businessData.phone}
//           >
//             <View style={[styles.actionIcon, styles.phoneIcon]}>
//               <Ionicons name="call" size={24} color="#fff" />
//             </View>
//             <Text style={styles.actionCardTitle}>Call</Text>
//             <Text style={styles.actionCardSubtitle}>
//               {businessData.phone || "Not available"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.actionCard, !businessData.whatsapp && styles.disabledCard]}
//             onPress={() => handleWhatsApp(businessData.whatsapp)}
//             disabled={!businessData.whatsapp}
//           >
//             <View style={[styles.actionIcon, styles.whatsappIcon]}>
//               <Ionicons name="logo-whatsapp" size={24} color="#fff" />
//             </View>
//             <Text style={styles.actionCardTitle}>WhatsApp</Text>
//             <Text style={styles.actionCardSubtitle}>
//               {businessData.whatsapp ? "Message us" : "Not available"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.actionCard, !businessData.location && styles.disabledCard]}
//             onPress={() => handleOpenMap(businessData.location)}
//             disabled={!businessData.location}
//           >
//             <View style={[styles.actionIcon, styles.mapIcon]}>
//               <Ionicons name="location" size={24} color="#fff" />
//             </View>
//             <Text style={styles.actionCardTitle}>Location</Text>
//             <Text style={styles.actionCardSubtitle}>
//               {businessData.location ? "Get directions" : "Not available"}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Gallery Section */}
//         {businessData.gallery && businessData.gallery.length > 0 && (
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Ionicons name="images" size={24} color="#93210A" />
//               <Text style={styles.cardTitle}>Photo Gallery</Text>
//             </View>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryContainer}>
//               {businessData.gallery.map((imageUri, index) => (
//                 <TouchableOpacity 
//                   key={`gallery-${index}`}
//                   onPress={() => openImageModal(imageUri)}
//                   style={styles.galleryItem}
//                 >
//                   <Image source={{ uri: imageUri }} style={styles.galleryImage} />
//                   <LinearGradient
//                     colors={['transparent', 'rgba(0,0,0,0.3)']}
//                     style={styles.galleryGradient}
//                   />
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}

//     {/* Videos Section */}
// {businessData.videos && businessData.videos.length > 0 && (
//   <View style={styles.card}>
//     <View style={styles.cardHeader}>
//       <Ionicons name="play-circle" size={24} color="#93210A" />
//       <Text style={styles.cardTitle}>Videos</Text>
//       <Text style={styles.videoCount}>{businessData.videos.length} video{businessData.videos.length > 1 ? 's' : ''}</Text>
//     </View>
    
//     <ScrollView 
//       horizontal 
//       showsHorizontalScrollIndicator={false} 
//       style={styles.videosScrollContainer}
//       contentContainerStyle={styles.videosScrollContent}
//     >
//       {businessData.videos.map((videoUrl, index) => (
//         <TouchableOpacity 
//           key={`video-${index}`}
//           style={styles.videoCard}
//           onPress={() => handleOpenVideo(videoUrl)}
//         >
//           {/* Video Thumbnail */}
//           <View style={styles.videoThumbnail}>
//             <Ionicons name="play-circle" size={32} color="#fff" />
//             <LinearGradient
//               colors={['transparent', 'rgba(0,0,0,0.6)']}
//               style={styles.videoThumbnailGradient}
//             />
//             <View style={styles.videoBadge}>
//               <Text style={styles.videoBadgeText}>Video {index + 1}</Text>
//             </View>
//           </View>
          
//           {/* Video Info */}
//           <View style={styles.videoInfo}>
//             <Text style={styles.videoTitle} numberOfLines={2}>
//               {businessData.title} - Video {index + 1}
//             </Text>
//             <Text style={styles.videoUrl} numberOfLines={1}>
//               {videoUrl.length > 30 ? `${videoUrl.substring(0, 30)}...` : videoUrl}
//             </Text>
//             <View style={styles.videoAction}>
//               <Ionicons name="open-outline" size={16} color="#93210A" />
//               <Text style={styles.videoActionText}>Watch</Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   </View>
// )}

//         {/* Contact Info Card
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <Ionicons name="business" size={24} color="#93210A" />
//             <Text style={styles.cardTitle}>Contact Information</Text>
//           </View>
//           <View style={styles.contactInfo}>
//             {businessData.phone && (
//               <View style={styles.contactItem}>
//                 <Ionicons name="call" size={20} color="#93210A" />
//                 <Text style={styles.contactText}>{businessData.phone}</Text>
//               </View>
//             )}
//             {businessData.location && (
//               <View style={styles.contactItem}>
//                 <Ionicons name="location" size={20} color="#93210A" />
//                 <Text style={styles.contactText}>{businessData.location}</Text>
//               </View>
//             )}
//             {businessData.whatsapp && (
//               <View style={styles.contactItem}>
//                 <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
//                 <Text style={styles.contactText}>{businessData.whatsapp}</Text>
//               </View>
//             )}
//           </View>
//         </View> */}
//       </ScrollView>

//       {/* Image Modal */}
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//         statusBarTranslucent
//       >
//         <View style={styles.modalContainer}>
//           <TouchableOpacity 
//             style={styles.modalCloseButton}
//             onPress={() => setModalVisible(false)}
//           >
//             <Ionicons name="close" size={30} color="#fff" />
//           </TouchableOpacity>
//           <Image 
//             source={{ uri: selectedImage }} 
//             style={styles.modalImage}
//             resizeMode="contain"
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   // Header
//   header: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingTop: Platform.OS === 'ios' ? 50 : 40,
//     paddingBottom: 15,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   headerPlaceholder: {
//     width: 40,
//   },
//   // Hero Section
//   heroContainer: {
//     position: 'relative',
//   },
//   mainImage: {
//     width: "100%",
//     height: 300,
//   },
//   imageGradient: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   titleOverlay: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//   },
//   businessTitle: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 8,
//     textShadowColor: 'rgba(0,0,0,0.8)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 6,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     fontSize: 16,
//     color: "#fff",
//     marginLeft: 6,
//     textShadowColor: 'rgba(0,0,0,0.8)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 6,
//   },
//   // Cards
//   card: {
//     backgroundColor: "#fff",
//     margin: 16,
//     padding: 20,
//     borderRadius: 20,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#1a1a1a",
//     marginLeft: 12,
//   },
//   businessDescription: {
//     fontSize: 16,
//     color: "#666",
//     lineHeight: 24,
//   },
//   // Action Grid
//   actionsGrid: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     marginBottom: 8,
//   },
//   actionCard: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 16,
//     marginHorizontal: 4,
//     alignItems: 'center',
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   disabledCard: {
//     opacity: 0.5,
//   },
//   actionIcon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   phoneIcon: {
//     backgroundColor: "#93210A",
//   },
//   whatsappIcon: {
//     backgroundColor: "#25D366",
//   },
//   mapIcon: {
//     backgroundColor: "#FF6B35",
//   },
//   actionCardTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#1a1a1a",
//     marginBottom: 4,
//   },
//   actionCardSubtitle: {
//     fontSize: 12,
//     color: "#666",
//     textAlign: 'center',
//   },
//   // Gallery
//   galleryContainer: {
//     marginTop: 8,
//   },
//   galleryItem: {
//     position: 'relative',
//     marginRight: 12,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   galleryImage: {
//     width: 140,
//     height: 140,
//     borderRadius: 12,
//   },
//   galleryGradient: {
//     ...StyleSheet.absoluteFillObject,
//     borderRadius: 12,
//   },
//   // Videos
//     videosScrollContainer: {
//     marginTop: 8,
//   },
//    videosScrollContent: {
//     paddingRight: 16,
//   },
//   videoCard: {
//     width: 280,
//     marginRight: 16,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//     videoThumbnailGradient: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   videoThumbnail: {
//     width: '100%',
//     height: 160,
//     backgroundColor: '#93210A',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   videoContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//    videoBadgeText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#93210A',
//   },
//   videoInfo: {
//     padding: 16,
//   },
//   videoTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#1a1a1a",
//     marginBottom: 6,
//     lineHeight: 20,
//   },
//     videoUrl: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 12,
//   },
//   videoAction: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     alignSelf: 'flex-start',
//   },
//   videoActionText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: "#93210A",
//     marginLeft: 4,
//   },
//   videoCount: {
//     fontSize: 14,
//     color: "#666",
//     marginLeft: 'auto',
//   },

//   // Modal
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.95)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalCloseButton: {
//     position: "absolute",
//     top: 60,
//     right: 20,
//     zIndex: 1,
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalImage: {
//     width: screenWidth * 0.9,
//     height: screenWidth * 0.9,
//   },
// });




import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

export default function TownBusinessPage4() {
  const route = useRoute();
  const navigation = useNavigation();
  const { businessData } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
   const [expanded, setExpanded] = useState(false);
  const open = (url) => url && Linking.openURL(url);

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setSelectedImage(businessData.image);
            setModalVisible(true);
          }}
        >
          <Image source={{ uri: businessData.image }} style={styles.heroImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)"]}
            style={styles.heroGradient}
          />
          <View style={styles.heroText}>
            <Text style={styles.businessTitle}>{businessData.title}</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>4.8 • Business</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ABOUT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.desc}>
            {businessData.description || "No description available"}
          </Text>
          {businessData.description?.length > 120 && (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <Text style={styles.readMore}>
        {expanded ? "Read Less" : "Read More"}
      </Text>
    </TouchableOpacity>
  )}
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          {businessData.phone && (
            <Action
              icon="call"
              label="Call"
              color="#93210A"
              onPress={() => open(`tel:${businessData.phone}`)}
            />
          )}

          {businessData.whatsapp && (
            <Action
              icon="logo-whatsapp"
              label="WhatsApp"
              color="#25D366"
              onPress={() =>
                open(
                  `https://wa.me/${businessData.whatsapp.replace(/\D/g, "")}`
                )
              }
            />
          )}

          {businessData.location && (
            <Action
              icon="location"
              label="Map"
              color="#FF6B35"
              onPress={() =>
                open(
                  `https://maps.google.com/?q=${encodeURIComponent(
                    businessData.location
                  )}`
                )
              }
            />
          )}
        </View>

        {/* GALLERY */}
        {businessData.gallery?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Photos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {businessData.gallery.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setSelectedImage(img);
                    setModalVisible(true);
                  }}
                >
                  <Image source={{ uri: img }} style={styles.galleryImg} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* VIDEOS */}
        {businessData.videos?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Videos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {businessData.videos.map((v, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.videoCard}
                  onPress={() => open(v)}
                >
                  <Ionicons name="play-circle" size={40} color="#fff" />
                  <Text style={styles.videoText}>Video {i + 1}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* IMAGE MODAL */}
      <Modal visible={modalVisible} transparent>
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.close}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.modalImg}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
}

/* ACTION BUTTON */
const Action = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: color }]}>
      <Ionicons name={icon} size={22} color="#fff" />
    </View>
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Platform.OS === "ios" ? 55 : 45,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 6,
    borderRadius: 20,
  },

  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  heroImage: {
    width: "100%",
    height: isTablet ? 380 : 260,
  },

  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  heroText: {
    position: "absolute",
    bottom: 20,
    left: 16,
  },

  businessTitle: {
    fontSize: isTablet ? 30 : 22,
    fontWeight: "800",
    color: "#fff",
  },

  rating: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingText: { color: "#fff", marginLeft: 6 },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 18,
    elevation: 3,
  },

  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

  desc: { fontSize: 15, color: "#555", lineHeight: 22 },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 8,
  },

  actionBtn: { alignItems: "center" },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  actionText: { fontSize: 12, fontWeight: "600" },
  readMore: {
  color: "#93210A",
  fontWeight: "700",
  marginTop: 6,
  alignSelf: "flex-end",
},

  galleryImg: {
    width: isTablet ? 180 : 140,
    height: isTablet ? 180 : 140,
    borderRadius: 14,
    marginRight: 12,
  },

  videoCard: {
    width: isTablet ? 240 : 180,
    height: isTablet ? 150 : 120,
    backgroundColor: "#93210A",
    borderRadius: 16,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  videoText: { color: "#fff", marginTop: 6, fontWeight: "600" },

  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  close: { position: "absolute", top: 60, right: 20 },
  modalImg: { width: width * 0.9, height: width * 0.9 },
});
