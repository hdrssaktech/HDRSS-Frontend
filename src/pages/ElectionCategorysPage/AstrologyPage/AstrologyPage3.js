// import React, { useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { Video } from "expo-av";
// import YoutubePlayer from "react-native-youtube-iframe";
// import { useNavigation } from "@react-navigation/native";

// const { width } = Dimensions.get("window");

// export default function AstrologyPage3({ route }) {
//   const navigation = useNavigation();
//   const { astrologyItem } = route.params;
//   const [playing, setPlaying] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // ✅ Extract YouTube video ID
//   const getYouTubeVideoId = (url) => {
//     if (!url) return null;
//     const match = url.match(
//       /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
//     );
//     return match ? match[1] : null;
//   };

//   const onStateChange = useCallback((state) => {
//     if (state === "ended") setPlaying(false);
//   }, []);

//   // ✅ Default video if API doesn't return one
//   const videoUrl =
//     astrologyItem?.video || "https://www.youtube.com/watch?v=sjQw5YBPj3Y";

//   const youtubeVideoId = getYouTubeVideoId(videoUrl);

//   return (
//     <View style={styles.container}>
//       {/* 🔹 Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>
//           {astrologyItem?.name || "Astrology"}
//         </Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* 🔹 Main Image */}
//         {astrologyItem?.image && (
//           <Image source={{ uri: astrologyItem.image }} style={styles.mainImage} />
//         )}

//         {/* 🔹 Title */}
//         {astrologyItem?.title && (
//           <Text style={styles.title}>{astrologyItem.title}</Text>
//         )}

//         {/* 🔹 Description */}
//         {astrologyItem?.description && (
//           <Text style={styles.description}>{astrologyItem.description}</Text>
//         )}

//         {/* 🎥 Video Section */}
//         <View style={styles.videoWrapper}>
//           {/* 🔹 Video Title */}
//           <Text style={styles.videoTitle}>
//             {astrologyItem?.videoTitle || "Video"}
//           </Text>

//           {youtubeVideoId ? (
//             <YoutubePlayer
//               height={230}
//               width={width} // Full screen width
//               play={playing}
//               videoId={youtubeVideoId}
//               onChangeState={onStateChange}
//               webViewStyle={{ borderRadius: 0 }}
//             />
//           ) : (
//             <View style={styles.videoContainer}>
//               {loading && (
//                 <ActivityIndicator
//                   size="large"
//                   color="#93210A"
//                   style={{ marginBottom: 10 }}
//                 />
//               )}
//               <Video
//                 source={{ uri: videoUrl }}
//                 rate={1.0}
//                 volume={1.0}
//                 resizeMode="cover"
//                 shouldPlay={false}
//                 useNativeControls
//                 onLoadStart={() => setLoading(true)}
//                 onLoad={() => setLoading(false)}
//                 style={styles.fullVideo}
//               />
//             </View>
//           )}
//         </View>

//         {/* 🔹 Gallery Section */}
//         {astrologyItem?.gallery && astrologyItem.gallery.length > 0 && (
//           <View style={styles.galleryContainer}>
//             <Text style={styles.sectionTitle}>Gallery</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {astrologyItem.gallery.map((img, idx) => (
//                 <Image key={idx} source={{ uri: img }} style={styles.galleryImage} />
//               ))}
//             </ScrollView>
//           </View>
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
//     marginTop: 32,
//     backgroundColor: "#93210A",
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//     marginLeft: 12,
//   },
//   scrollContainer: {
//     paddingBottom: 40,
//   },
//   mainImage: {
//     width: width,
//     height: 220,
//     borderRadius: 0, // edge-to-edge
//     marginBottom: 16,
//   },
//   title: {
//   fontSize: 20,
//   fontWeight: "bold",
//   color: "#93210A",
//   textAlign: "left", // changed from "center" to "left"
//   marginBottom: 10,
//   paddingHorizontal: 16,
// },

//   description: {
//     fontSize: 15,
//     color: "#333",
//     lineHeight: 22,
//     textAlign: "justify",
//     paddingHorizontal: 16,
//     marginBottom: 20,
//   },

//   // 🔹 Video Styles
//   videoWrapper: {
//     width: width,
//     alignSelf: "center",
//     backgroundColor: "#fff",
//     marginBottom: 25,
//   },
//   videoTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginBottom: 8,
//     textAlign: "left", // ✅ aligned to the left
//     paddingLeft: 16, // ✅ spacing from screen edge
//   },
//   videoContainer: {
//     backgroundColor: "#000",
//   },
//   fullVideo: {
//     width: width,
//     height: 230,
//   },

//   // 🔹 Gallery Styles
//   galleryContainer: {
//     marginTop: 10,
//     paddingHorizontal: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginBottom: 10,
//   },
//   galleryImage: {
//     width: 200,
//     height: 150,
//     borderRadius: 12,
//     marginRight: 12,
//   },
// });







// src/pages/Astrology/AstrologyPage3.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation } from "@react-navigation/native";

export default function AstrologyPage3({ route }) {
  const navigation = useNavigation();
  const { astrologyItem } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const getYouTubeId = (url) =>
    url?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];

  return (
    <View style={styles.container}>
      {/* 🔴 HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            isTablet && styles.headerTitleTablet,
          ]}
        >
          {astrologyItem.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 🖼️ MAIN IMAGE */}
        <Image
          source={{ uri: astrologyItem.image }}
          style={[
            styles.mainImage,
            isTablet && styles.mainImageTablet,
          ]}
        />

        {/* 🏷️ TITLE */}
        <Text style={[styles.title, isTablet && styles.titleTablet]}>
          {astrologyItem.title}
        </Text>

        {/* 📄 DESCRIPTION */}
        <Text
          style={[
            styles.description,
            isTablet && styles.descriptionTablet,
          ]}
        >
          {astrologyItem.description}
        </Text>

        {/* 🎥 VIDEO */}
        {astrologyItem.video && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                isTablet && styles.sectionTitleTablet,
              ]}
            >
              Video
            </Text>

            <View
              style={[
                styles.videoWrapper,
                isTablet && styles.videoWrapperTablet,
              ]}
            >
              <YoutubePlayer
                height={isTablet ? 340 : 220}
                width={width - 32}
                videoId={getYouTubeId(astrologyItem.video)}
              />
            </View>
          </View>
        )}

        {/* 🖼️ GALLERY */}
        {astrologyItem.gallery?.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                isTablet && styles.sectionTitleTablet,
              ]}
            >
              Gallery
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {astrologyItem.gallery.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={[
                    styles.galleryImg,
                    isTablet && styles.galleryImgTablet,
                  ]}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  /* 🔹 CONTAINER */
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* 🔴 HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },

  headerTablet: {
    paddingVertical: 35,
    paddingHorizontal: 25,
    marginTop: -3,
  },

   headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 22, marginLeft: 70,
    padding:8,
   

  },

  headerTitleTablet: {
    fontSize: 28,
    padding:8,
    left:125,
  },

  /* 📜 CONTENT */
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  /* 🖼️ IMAGE */
  mainImage: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    marginBottom: 20,
  },

  mainImageTablet: {
    height: 340,
  },

  /* 🏷️ TITLE */
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 12,
  },

  titleTablet: {
    fontSize: 24,
  },

  /* 📄 DESCRIPTION */
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "justify",
    marginBottom: 28,
  },

  descriptionTablet: {
    fontSize: 18,
    lineHeight: 30,
  },

  /* 📦 SECTION */
  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 12,
  },

  sectionTitleTablet: {
    fontSize: 26,
  },

  /* 🎥 VIDEO */
  videoWrapper: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  videoWrapperTablet: {
    borderRadius: 22,
  },

  /* 🖼️ GALLERY */
  galleryImg: {
    width: 200,
    height: 150,
    borderRadius: 14,
    marginRight: 12,
  },

  galleryImgTablet: {
    width: 260,
    height: 190,
  },
});
