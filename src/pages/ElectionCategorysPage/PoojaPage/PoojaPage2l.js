// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import YoutubePlayer from "react-native-youtube-iframe";
// import { fetchPoojaById } from "../../../Controller/PoojaController/PoojaController";

// export default function PoojaPage2({ route, navigation }) {
//   const { id } = route.params;
//   const [pooja, setPooja] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [playing, setPlaying] = useState(false);

//   const screenWidth = Dimensions.get("window").width;

//   useEffect(() => {
//     const loadPooja = async () => {
//       try {
//         const data = await fetchPoojaById(id);
//         setPooja(data);
//       } catch (error) {
//         console.error("Error loading pooja details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadPooja();
//   }, [id]);

//   const getYouTubeVideoId = (url) => {
//     if (!url) return null;
//     const match = url.match(
//       /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
//     );
//     return match ? match[1] : null;
//   };

//   const onStateChange = useCallback((state) => {
//     if (state === "ended") {
//       setPlaying(false);
//     }
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="maroon" />
//       </View>
//     );
//   }

//   if (!pooja) {
//     return (
//       <View style={styles.loader}>
//         <Text>Unable to load pooja details.</Text>
//       </View>
//     );
//   }

//   const videoUrl =
//     pooja.videos && pooja.videos.length > 0 ? pooja.videos[0] : null;
//   const youtubeVideoId = getYouTubeVideoId(videoUrl);

//   return (
//     <View style={styles.container}>
//       {/* 🔹 Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={30} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{pooja.title}</Text>
//       </View>

//       <ScrollView>
//         <Image source={{ uri: pooja.bannerimg }} style={styles.bannerImage} />

//         {/* 🔹 Card Section */}
//         <View style={styles.card}>
//           <Image source={{ uri: pooja.image }} style={styles.templeImage} />

//           {/* 🔹 Aligned Details Section */}
//           <View style={styles.details}>
//             <View style={styles.detailRow}>
//               <Text style={styles.label}>Pooja Type</Text>
//               <Text style={styles.colon}>:</Text>
//               <Text style={styles.value}>{pooja.poojatype}</Text>
//             </View>

//             <View style={styles.detailRow}>
//               <Text style={styles.label}>Date</Text>
//               <Text style={styles.colon}>:</Text>
//               <Text style={styles.value}>{pooja.datee}</Text>
//             </View>

//             <View style={styles.detailRow}>
//               <Text style={styles.label}>Category</Text>
//               <Text style={styles.colon}>:</Text>
//               <Text style={styles.value}>{pooja.category}</Text>
//             </View>
//           </View>
//         </View>

//         {/* 🔹 About Section */}
//         <Text style={styles.sectionTitle}>About</Text>
//         <Text style={styles.about}>{pooja.about}</Text>

//         {/* 🎥 Video Section */}
//         {youtubeVideoId && (
//           <>
//             <Text style={styles.sectionTitle}>Video</Text>
//             <View style={[styles.videoContainer, { width: screenWidth }]}>
//               <YoutubePlayer
//                 height={230}
//                 width={screenWidth}
//                 play={playing}
//                 videoId={youtubeVideoId}
//                 onChangeState={onStateChange}
//               />
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     marginTop: 31,
//     backgroundColor: "#93210A",
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginLeft: 16,
//   },

//   bannerImage: { width: "100%", height: 230, resizeMode: "cover" },
//   loader: { flex: 1, justifyContent: "center", alignItems: "center" },

//   card: {
//     margin: 15,
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   templeImage: {
//     width: "100%",
//     height: 250,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },

//   // ✅ Perfectly aligned details section
//   details: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   detailRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 5,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#7a1b0c",
//     width: 110, // ensures consistent alignment
//     textAlign: "left",
//   },
//   colon: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#7a1b0c",
//     width: 10,
//     textAlign: "center",
//   },
//   value: {
//     fontSize: 16,
//     color: "#333",
//     flex: 1,
//     textAlign: "left",
//   },

//   sectionTitle: {
//     fontSize: 20,
//     color: "#93210A",
//     fontWeight: "bold",
//     textAlign: "left",
//     marginTop: 20,
//     marginLeft: 16,
//     marginBottom: 8,
//   },

//   about: {
//     paddingHorizontal: 16,
//     textAlign: "justify",
//     lineHeight: 22,
//     color: "#333",
//   },

//   videoContainer: {
//     alignSelf: "center",
//     marginTop: 10,
//     marginBottom: 20,
//     borderRadius: 0,
//     overflow: "hidden",
//   },
// });


import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { fetchPoojaById } from "../../../Controller/PoojaController/PoojaController";

export default function PoojaPage2({ route, navigation }) {
  const { id } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [pooja, setPooja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const loadPooja = async () => {
      try {
        const data = await fetchPoojaById(id);
        setPooja(data);
      } catch (error) {
        console.error("Error loading pooja details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPooja();
  }, [id]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") setPlaying(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  if (!pooja) {
    return (
      <View style={styles.loader}>
        <Text>Unable to load pooja details.</Text>
      </View>
    );
  }

  const videoUrl =
    pooja.videos && pooja.videos.length > 0 ? pooja.videos[0] : null;
  const youtubeVideoId = getYouTubeVideoId(videoUrl);

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={isTablet ? 34 : 30}
            color="#fff"
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
          numberOfLines={1}
        >
          {pooja.title}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Banner */}
        <Image
          source={{ uri: pooja.bannerimg }}
          style={[
            styles.bannerImage,
            isTablet && styles.bannerImageTablet,
          ]}
        />

        {/* 🔹 Card */}
        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Image
            source={{ uri: pooja.image }}
            style={[
              styles.templeImage,
              isTablet && styles.templeImageTablet,
            ]}
          />

          {/* 🔹 Details */}
          <View
            style={[
              styles.details,
              isTablet && styles.detailsTablet,
            ]}
          >
            <View style={styles.detailRow}>
              <Text
                style={[styles.label, isTablet && styles.labelTablet]}
              >
                Pooja Type
              </Text>
              <Text style={styles.colon}>:</Text>
              <Text
                style={[styles.value, isTablet && styles.valueTablet]}
              >
                {pooja.poojatype}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text
                style={[styles.label, isTablet && styles.labelTablet]}
              >
                Date
              </Text>
              <Text style={styles.colon}>:</Text>
              <Text
                style={[styles.value, isTablet && styles.valueTablet]}
              >
                {pooja.datee}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text
                style={[styles.label, isTablet && styles.labelTablet]}
              >
                Category
              </Text>
              <Text style={styles.colon}>:</Text>
              <Text
                style={[styles.value, isTablet && styles.valueTablet]}
              >
                {pooja.category}
              </Text>
            </View>
          </View>
        </View>

        {/* 🔹 About */}
        <Text
          style={[
            styles.sectionTitle,
            isTablet && styles.sectionTitleTablet,
          ]}
        >
          About
        </Text>
        <Text
          style={[
            styles.about,
            isTablet && styles.aboutTablet,
          ]}
        >
          {pooja.about}
        </Text>

        {/* 🎥 Video */}
        {youtubeVideoId && (
          <>
            <Text
              style={[
                styles.sectionTitle,
                isTablet && styles.sectionTitleTablet,
              ]}
            >
              Video
            </Text>
            <View style={styles.videoContainer}>
              <YoutubePlayer
                height={isTablet ? 365 : 230}
                width={width}
                play={playing}
                videoId={youtubeVideoId}
                onChangeState={onStateChange}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* 🔹 Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 31,
    backgroundColor: "#93210A",
  },
  headerTablet: {
    paddingVertical: 35,
    paddingHorizontal: 24,
    marginTop:-3
  },
   headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 22, marginLeft: 65,
    padding:8,
   

  },

  headerTitleTablet: {
    fontSize: 28,
    padding:8,
    left:125,
  },


  /* 🔹 Banner */
  bannerImage: {
    width: "100%",
    height: 230,
    resizeMode: "cover",
  },
  bannerImageTablet: {
    height: 320,
  },

  /* 🔹 Card */
  card: {
    margin: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTablet: {
    marginHorizontal: 32,
    borderRadius: 16,
  },

  templeImage: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  templeImageTablet: {
    height: 320,
  },

  /* 🔹 Details */
  details: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  detailsTablet: {
    paddingHorizontal: 28,
    paddingVertical: 22,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7a1b0c",
    width: 110,
  },
  labelTablet: {
    fontSize: 20,
    width: 150,
  },

  colon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7a1b0c",
    width: 10,
    textAlign: "center",
  },

  value: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  valueTablet: {
    fontSize: 20,
  },

  /* 🔹 Section */
  sectionTitle: {
    fontSize: 20,
    color: "#93210A",
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionTitleTablet: {
    fontSize: 26,
    marginLeft: 15,
  },

  about: {
    paddingHorizontal: 16,
    textAlign: "justify",
    lineHeight: 22,
    color: "#333",
  },
  aboutTablet: {
    paddingHorizontal: 32,
    fontSize: 19,
    lineHeight: 28,
    
  },

  /* 🔹 Video */
  videoContainer: {
    alignSelf: "center",
    marginVertical: 20,
  },
});
















