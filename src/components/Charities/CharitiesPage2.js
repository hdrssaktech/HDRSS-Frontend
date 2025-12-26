// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Linking,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { Video } from "expo-av"; // ✅ Correct import for normal videos
// import YoutubePlayer from "react-native-youtube-iframe";

// export default function CharitiesPage2() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { charity } = route.params;

//   // ✅ Fixed GPay URL — you forgot to use backticks
//   const openGPay = () => {
//     const upiId = "9876543210@upi";
//     const name = "ManagerName";
//     const amount = "50";
//     const url = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

//     Linking.openURL(url).catch(() => {
//       alert("Please install a UPI payment app to proceed.");
//     });
//   };

//   // ✅ Extract YouTube ID if applicable
//   const extractYouTubeId = (url) => {
//     if (!url) return null;
//     const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
//     return match ? match[1] : null;
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Ionicons
//           name="chevron-back"
//           size={26}
//           color="#fff"
//           onPress={() => navigation.goBack()}
//         />
//         <Text style={styles.headerText} numberOfLines={1}>
//           {charity?.name || "Charity Details"}
//         </Text>
//       </View>

//       {/* Scrollable Content */}
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Banner */}
//         {charity?.bannerImage && (
//           <Image source={{ uri: charity.bannerImage }} style={styles.banner} />
//         )}

//         {/* Details */}
//         <View style={styles.content}>
//           {charity?.heading && (
//             <Text style={styles.heading}>{charity.heading}</Text>
//           )}
//           {charity?.description && (
//             <Text style={styles.description}>{charity.description}</Text>
//           )}

//           {/* Gallery */}
//           {charity?.galleryImages?.length > 0 && (
//             <>
//               <Text style={styles.subTitle}>Gallery</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {charity.galleryImages.map((img, i) => (
//                   <Image key={i} source={{ uri: img }} style={styles.galleryImg} />
//                 ))}
//               </ScrollView>
//             </>
//           )}

//           {/* ✅ Video Section */}
//           {charity?.videos?.length > 0 && (
//             <View style={{ marginTop: 25, alignItems: "center" }}>
//               <Text style={styles.videoTitle}>Videos</Text>
//               {charity.videos.map((videoUrl, index) => {
//                 const youtubeId = extractYouTubeId(videoUrl);
//                 return (
//                   <View key={index} style={{ marginBottom: 20 }}>
//                     {youtubeId ? (
//                       <YoutubePlayer
//                         height={220}
//                         width={350}
//                         play={false}
//                         videoId={youtubeId}
//                       />
//                     ) : (
//                       <Video
//                         source={{ uri: videoUrl }}
//                         style={styles.video}
//                         useNativeControls
//                         resizeMode="cover"
//                         isLooping
//                       />
//                     )}
//                   </View>
//                 );
//               })}
//             </View>
//           )}

//           {/* Payment Button */}
//           <TouchableOpacity style={styles.payButton} onPress={openGPay}>
//             <Text style={styles.payButtonText}>Pay ₹50 via GPay</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#93210A",
//     paddingHorizontal: 15,
//     paddingVertical: 15,
//     paddingTop: 40,
//     zIndex: 10,
//     elevation: 5,
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//   },
//   headerText: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginLeft: 10,
//     flexShrink: 1,
//   },
//   scrollContent: { paddingTop: 100, paddingBottom: 20 },
//   banner: { width: "100%", height: 200, resizeMode: "cover" },
//   content: { padding: 15 },
//   heading: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 10,
//     color: "#93210A",
//   },
//   description: {
//     fontSize: 14,
//     color: "#444",
//     marginBottom: 17,
//     textAlign: "justify",
//   },
//   subTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 17,
//     color: "#93210A",
//   },
//   galleryImg: {
//     width: 120,
//     height: 120,
//     marginRight: 10,
//     borderRadius: 8,
//     marginVertical: 10,
//   },
//   videoTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginBottom: 15,
//     alignSelf: "flex-start",
//     marginLeft: 15,
//   },
//   video: {
//     width: 350,
//     height: 220,
//     borderRadius: 10,
//     backgroundColor: "#000",
//     marginVertical: 8,
//   },
//   payButton: {
//     backgroundColor: "#00BFA5",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignItems: "center",
//     marginVertical: 20,
//   },
//   payButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });



import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";

export default function CharitiesPage2() {
  const navigation = useNavigation();
  const { charity } = useRoute().params;
  const { width } = useWindowDimensions();

  const isTablet = width >= 600;

  /* ================= PAYMENT ================= */
  const openGPay = () => {
    const url = `upi://pay?pa=9876543210@upi&pn=Manager&am=50&cu=INR`;
    Linking.openURL(url).catch(() =>
      alert("Please install a UPI app")
    );
  };

  /* ================= YOUTUBE ================= */
  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={isTablet ? styles.headerTablet : styles.headerMobile}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={isTablet ? 32 : 28}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={isTablet ? styles.headerTextTablet : styles.headerTextMobile}
          numberOfLines={1}
        >
          {charity?.name}
        </Text>
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image
          source={{ uri: charity?.bannerImage }}
          style={isTablet ? styles.bannerTablet : styles.bannerMobile}
        />

        {/* Wrapper */}
        <View style={isTablet ? styles.wrapperTablet : styles.wrapperMobile}>
          {/* Heading */}
          <Text style={isTablet ? styles.headingTablet : styles.headingMobile}>
            {charity?.heading}
          </Text>

          {/* Description */}
          <Text
            style={
              isTablet
                ? styles.descriptionTablet
                : styles.descriptionMobile
            }
          >
            {charity?.description}
          </Text>

          {/* Gallery */}
          {charity?.galleryImages?.length > 0 && (
            <>
              <Text
                style={
                  isTablet
                    ? styles.sectionTitleTablet
                    : styles.sectionTitleMobile
                }
              >
                Gallery
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {charity.galleryImages.map((img, i) => (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={
                      isTablet
                        ? styles.galleryImageTablet
                        : styles.galleryImageMobile
                    }
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>

        {/* ================= VIDEOS (FULL WIDTH) ================= */}
        {charity?.videos?.length > 0 && (
          <>
            <Text
              style={[
                isTablet
                  ? styles.sectionTitleTablet
                  : styles.sectionTitleMobile,
                { paddingHorizontal: isTablet ? 40 : 15 },
              ]}
            >
              Videos
            </Text>

            <View style={styles.videoFullWrapper}>
              {charity.videos.map((url, index) => {
                const ytId = getYoutubeId(url);
                return ytId ? (
                  <YoutubePlayer
                    key={index}
                    height={isTablet ? 420 : 240}
                    width="100%"
                    videoId={ytId}
                  />
                ) : (
                  <Video
                    key={index}
                    source={{ uri: url }}
                    useNativeControls
                    resizeMode="cover"
                    style={
                      isTablet
                        ? styles.videoTablet
                        : styles.videoMobile
                    }
                  />
                );
              })}
            </View>
          </>
        )}

        {/* ================= DONATE ================= */}
        <View style={isTablet ? styles.wrapperTablet : styles.wrapperMobile}>
          <TouchableOpacity
            style={
              isTablet ? styles.payButtonTablet : styles.payButtonMobile
            }
            onPress={openGPay}
          >
            <Text
              style={
                isTablet
                  ? styles.payButtonTextTablet
                  : styles.payButtonTextMobile
              }
            >
              Donate ₹50 via GPay
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ======================================================
   STYLES
====================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* ================= HEADER ================= */

  headerMobile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },

  headerTablet: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 25,
  },

  headerTextMobile: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    flexShrink: 1,
  },

  headerTextTablet: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 16,
    flexShrink: 1,
  },

  /* ================= BANNER ================= */

  bannerMobile: {
    width: "100%",
    height: 200,
  },

  bannerTablet: {
    width: "100%",
    height: 340,
  },

  /* ================= WRAPPER ================= */

  wrapperMobile: {
    padding: 15,
  },

  wrapperTablet: {
    width: "100%",
    paddingHorizontal: 40,
    paddingVertical: 30,
  },

  /* ================= TEXT ================= */

  headingMobile: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
  },

  headingTablet: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 18,
    right:18,
  },

  descriptionMobile: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
    textAlign: "justify",
  },

  descriptionTablet: {
    fontSize: 19,
    lineHeight: 30,
    color: "#333",
    textAlign: "justify",
  },

  sectionTitleMobile: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 15,
  },

  sectionTitleTablet: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 22,
    right:18,
  },

  /* ================= GALLERY ================= */

  galleryImageMobile: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },

  galleryImageTablet: {
    width: 190,
    height: 190,
    borderRadius: 14,
    marginRight: 16,
  },

  /* ================= VIDEO ================= */

  videoFullWrapper: {
    width: "100%",
  },

  videoMobile: {
    width: "100%",
    height: 240,
    backgroundColor: "#000",
    marginVertical: 12,
  },

  videoTablet: {
    width: "100%",
    height: 420,
    backgroundColor: "#000",
    marginVertical: 20,
  },

  /* ================= PAY BUTTON ================= */

  payButtonMobile: {
    backgroundColor: "#00BFA5",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 25,
    alignItems: "center",
  },

  payButtonTablet: {
    backgroundColor: "#00BFA5",
    paddingVertical: 20,
    borderRadius: 12,
    marginTop: 45,
    alignItems: "center",
    width: 340,
    alignSelf: "center",
  },

  payButtonTextMobile: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  payButtonTextTablet: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
  },
});

