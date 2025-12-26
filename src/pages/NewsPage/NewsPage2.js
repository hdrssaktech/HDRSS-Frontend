// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   ImageBackground,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import YoutubePlayer from "react-native-youtube-iframe";

// const { width: screenWidth } = Dimensions.get("window");

// export default function NewsPage2({ navigation, route }) {
//   const [playVideo, setPlayVideo] = useState(false);
//   const news = route?.params?.news;

//   if (!news) {
//     return (
//       <View style={styles.noData}>
//         <Text style={styles.noDataText}>No news available</Text>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backBtn}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // ✅ Extract videoId from YouTube link
//   let videoId = null;
//   if (news.videoLink) {
//     const match = news.videoLink.match(
//       /(?:youtube\.com\/(?:.*v=|v\/|embed\/)|youtu\.be\/)([^&?]+)/i
//     );
//     videoId = match ? match[1] : null;
//   }

//   const thumbnailUrl = videoId
//     ? `https://i.ytimg.com/vi/${videoId}/hq720.jpg`
//     : null;

//   return (
//     <View style={styles.container}>
//       {/* 🔹 Header Bar */}
//       <View style={styles.headerBar}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={26} color="#fff" />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle} numberOfLines={1}>
//           {news.type || "News"}
//         </Text>

//         <View style={styles.headerIcons}>
//           <TouchableOpacity style={styles.iconBtn}>
//             <Ionicons name="bookmark-outline" size={22} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconBtn}>
//             <Ionicons name="share-social-outline" size={22} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* 🔹 Scrollable Content */}
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* 🔹 Banner Image (Full Width) */}
//         <ImageBackground
//           source={{ uri: news.image }}
//           style={styles.headerImage}
//         >
//           <View style={styles.overlay} />
//         </ImageBackground>

//         {/* 🔹 Title */}
//         <View style={styles.textContainer}>
//           <Text style={styles.newsTitle}>{news.title}</Text>

//           {/* 🔹 Full Description */}
//           <Text style={styles.newsText}>
//             {news.description || "No detailed content available."}
//           </Text>
//         </View>

//         {/* 🔹 Video Section (Full Width) */}
//         {videoId && (
//           <View style={styles.fullWidthVideoSection}>
//             <Text style={styles.subHeading}>Watch Video</Text>
//             {playVideo ? (
//               <View style={styles.videoWrapper}>
//                 <YoutubePlayer
//                   height={220}
//                   play={true}
//                   videoId={videoId}
//                   width={screenWidth}
//                 />
//               </View>
//             ) : (
//               <TouchableOpacity onPress={() => setPlayVideo(true)}>
//                 <Image
//                   source={{ uri: thumbnailUrl }}
//                   style={styles.videoThumb}
//                 />
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },

//   noData: { flex: 1, justifyContent: "center", alignItems: "center" },
//   noDataText: { fontSize: 16, color: "gray", marginBottom: 10 },
//   backBtn: { color: "#93210A", fontSize: 15, fontWeight: "bold" },

//   headerBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     marginTop: 32,
//     backgroundColor: "#93210A",
//   },
//   headerTitle: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 20,
//     marginLeft: 19,
//   },
//   headerIcons: { flexDirection: "row", alignItems: "center", marginLeft: "auto" },
//   iconBtn: { marginLeft: 12 },

//   scrollContent: {
//     paddingBottom: 20,
//   },

//   headerImage: {
//   width: screenWidth,
//   height: 230,
//   justifyContent: "flex-end",
//   marginTop: 25, // ✅ Adds a small gap above the image
//   borderRadius: 8, // (optional) gives a soft curve look
//   overflow: "hidden", // keeps corners clean if borderRadius used
// },

//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.3)",
//   },

//   textContainer: {
//     paddingHorizontal: 15,
//     paddingTop: 10,
//   },

//   newsTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginVertical: 12,
//   },
//   newsText: {
//     fontSize: 14,
//     color: "#333",
//     lineHeight: 20,
//     textAlign: "justify",
//     marginBottom: 10,
//   },

// subHeading: {
//   fontSize: 19,
//   fontWeight: "bold",
//   marginVertical: 12,
//   color: "#93210A",
//   paddingHorizontal: 15,
//   marginBottom: 20, // ✅ Adds space below "Watch Video" text
// },

// videoWrapper: {
//   width: screenWidth,
//   height: 220,
//   borderRadius: 0,
//   overflow: "hidden",
//   marginBottom: 15, // optional, adds space below video if needed
// },

//   fullWidthVideoSection: {
//     width: screenWidth,
//     alignSelf: "center",
//   },

//  videoWrapper: {
//   width: screenWidth,
//   height: 220,
//   borderRadius: 0,
//   overflow: "hidden",
//   marginBottom: 15, // optional, adds space below video if needed
// },
//   videoThumb: {
//     width: screenWidth,
//     height: 220,
//     backgroundColor: "#ccc",
//   },
// });





import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

export default function NewsPage2({ navigation, route }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const styles = getStyles(isTablet, width);
  const [playVideo, setPlayVideo] = useState(false);

  const news = route?.params?.news;

  if (!news) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataText}>No news available</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* 🔹 Extract YouTube videoId */
  let videoId = null;
  if (news.videoLink) {
    const match = news.videoLink.match(
      /(?:youtube\.com\/(?:.*v=|v\/|embed\/)|youtu\.be\/)([^&?]+)/i
    );
    videoId = match ? match[1] : null;
  }

  const thumbnailUrl = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hq720.jpg`
    : null;

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {news.type || "News"}
        </Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="bookmark-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="share-social-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 🔹 Banner Image */}
        <ImageBackground
          source={{ uri: news.image }}
          style={styles.headerImage}
        >
          <View style={styles.overlay} />
        </ImageBackground>

        {/* 🔹 Text */}
        <View style={styles.textContainer}>
          <Text style={styles.newsTitle}>{news.title}</Text>
          <Text style={styles.newsText}>
            {news.description || "No detailed content available."}
          </Text>
        </View>

        {/* 🔹 Video */}
        {videoId && (
          <View style={styles.fullWidthVideoSection}>
            <Text style={styles.subHeading}>Watch Video</Text>

            {playVideo ? (
              <YoutubePlayer
                height={styles.videoHeight}
                play={true}
                videoId={videoId}
                width={width}
              />
            ) : (
              <TouchableOpacity onPress={() => setPlayVideo(true)}>
                <Image
                  source={{ uri: thumbnailUrl }}
                  style={styles.videoThumb}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const getStyles = (isTablet, screenWidth) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },

    noData: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    noDataText: {
      fontSize: 16,
      color: "gray",
      marginBottom: 10,
    },
    backBtn: {
      color: "#93210A",
      fontSize: 15,
      fontWeight: "bold",
    },

    /* 🔹 Header */
    headerBar: {
       flexDirection: "row",
      alignItems: "center",
      paddingVertical: isTablet ? 23 : 18,
      paddingHorizontal: 16,
      paddingTop: 40,
      backgroundColor: "#93210A",
      elevation: 4,
      
    },

    headerTitle: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: isTablet ? 26 : 20,
      marginLeft: 20,
     left: isTablet ? 200 : 55,
    },

    headerIcons: {
      flexDirection: "row",
      marginLeft: "auto",
    },

    iconBtn: {
      marginLeft: 14,
    },

    scrollContent: {
      paddingBottom: 30,
    },

    /* 🔹 Image */
    headerImage: {
      width: screenWidth,
      height: isTablet ? 350 : 230,
      marginTop: 20,
      overflow: "hidden",
    },

    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.3)",
    },

    /* 🔹 Text */
    textContainer: {
      paddingHorizontal: isTablet ? 30 : 15,
      paddingTop: 12,
    },

    newsTitle: {
      fontSize: isTablet ? 22 : 18,
      fontWeight: "bold",
      color: "#93210A",
      marginVertical: 14,
      right:isTablet ? 25 : 10,
    },

    newsText: {
      fontSize: isTablet ? 18 : 14,
      color: "#333",
      lineHeight: isTablet ? 28 : 20,
      textAlign: "justify",
      marginBottom: 10,
    },

    /* 🔹 Video */
    subHeading: {
      fontSize: isTablet ? 22 : 19,
      fontWeight: "bold",
      color: "#93210A",
      paddingHorizontal: isTablet ? 30 : 15,
      marginVertical: 20,
      right:isTablet ? 25 : 10,
    },

    fullWidthVideoSection: {
      width: screenWidth,
      alignSelf: "center",
    },

    videoThumb: {
      width: screenWidth,
      height: isTablet ? 330 : 220,
      backgroundColor: "#ccc",
    },

    videoHeight: isTablet ? 360 : 220,
  });

