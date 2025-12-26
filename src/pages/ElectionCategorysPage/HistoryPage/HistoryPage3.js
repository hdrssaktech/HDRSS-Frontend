// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import YoutubePlayer from "react-native-youtube-iframe";

// const { width } = Dimensions.get("window");

// export default function HistoryPage3() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { data } = route.params;
//   const [playing, setPlaying] = useState(false);

//   // Extract YouTube video ID
//   const getYoutubeId = (url) => {
//     const match = url?.match(
//       /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
//     );
//     return match ? match[1] : null;
//   };

//   const videoId = getYoutubeId(data.video);

//   return (
//     <View style={styles.container}>
//       {/* 🔹 Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={26} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{data.title}</Text>
//       </View>

//       <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
//         {/* 🖼 Banner Image */}
//         <Image
//           source={{ uri: data.bannerImage }}
//           style={styles.banner}
//           resizeMode="cover"
//         />

//         {/* 📝 Title & Description */}
//         <View style={styles.section}>
//           <Text style={styles.title}>{data.title}</Text>
//           <Text style={styles.description}>{data.description}</Text>
//         </View>

//         {/* 🎥 YouTube Video Section */}
//         {videoId ? (
//           <View style={styles.videoSection}>
//             <Text style={styles.videoTitle}>Video</Text> {/* 🔹 Added video title */}
//             <YoutubePlayer
//               height={(width * 9) / 16}
//               width={width}
//               play={playing}
//               videoId={videoId}
//               onChangeState={(state) =>
//                 state === "ended" ? setPlaying(false) : null
//               }
//             />
//           </View>
//         ) : (
//           <Text style={styles.noVideo}>🎥 No video available</Text>
//         )}

//         {/* 🖼 Gallery Section */}
//         {data.gallery && data.gallery.length > 0 && (
//           <View style={styles.gallerySection}>
//             <Text style={styles.label}>Gallery</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {data.gallery.map((img, index) => (
//                 <Image
//                   key={index}
//                   source={{ uri: img }}
//                   style={styles.galleryImage}
//                   resizeMode="cover"
//                 />
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
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginLeft: 10,
//     flexShrink: 1,
//   },

//   banner: {
//     width: width,
//     height: 220,
//     marginBottom: 15,
//   },

//   section: {
//     marginHorizontal: 20,
//     marginTop: 10,
//   },

//   title: {
//     fontSize: 19,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginBottom: 6,
//   },
//   description: {
//     fontSize: 15,
//     color: "#333",
//     textAlign: "justify",
//   },

//   label: {
//     fontSize: 19,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginBottom: 12,
//   },

//   videoSection: {
//     width: width,
//     alignSelf: "center",
//     marginTop: 12,
//     marginBottom: 35,
//     backgroundColor: "#000",
//   },

//  videoTitle: {
//   fontSize: 19,
//   fontWeight: "bold",
//   color: "#93210A",
//   marginBottom: 8,
//   textAlign: "left", // ✅ align text to the left
//   backgroundColor: "#fff",
//   paddingVertical: 15,
//   paddingLeft: 20, // ✅ add left padding for nice spacing
// },

//   gallerySection: {
//     marginHorizontal: 20,
//     marginTop: 8,
//   },

//   galleryImage: {
//     width: width * 0.6,
//     height: 140,
//     borderRadius: 8,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: "#93210A",
//   },

//   noVideo: {
//     textAlign: "center",
//     color: "#999",
//     fontStyle: "italic",
//     marginVertical: 10,
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
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function HistoryPage3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [playing, setPlaying] = useState(false);

  // 🔹 Extract YouTube video ID
  const getYoutubeId = (url) => {
    const match = url?.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = getYoutubeId(data.video);

  return (
    <View style={styles.container}>
      {/* 🔴 HEADER */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={isTablet ? 30 : 26}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
          numberOfLines={1}
        >
          {data.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* 🖼 BANNER */}
        <Image
          source={{ uri: data.bannerImage }}
          style={[
            styles.banner,
            { height: isTablet ? 320 : 220, width },
          ]}
          resizeMode="cover"
        />

        {/* 📝 TITLE & DESCRIPTION */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <Text style={[styles.title, isTablet && styles.titleTablet]}>
            {data.title}
          </Text>

          <Text style={[styles.description, isTablet && styles.descTablet]}>
            {data.description}
          </Text>
        </View>

        {/* 🎥 VIDEO */}
        {videoId ? (
          <View style={styles.videoSection}>
            <Text style={[styles.videoTitle, isTablet && styles.videoTitleTablet]}>
              Video
            </Text>

            <YoutubePlayer
              height={(width * 9) / 16}
              width={width}
              play={playing}
              videoId={videoId}
              onChangeState={(state) =>
                state === "ended" ? setPlaying(false) : null
              }
            />
          </View>
        ) : (
          <Text style={styles.noVideo}>🎥 No video available</Text>
        )}

        {/* 🖼 GALLERY */}
        {data.gallery && data.gallery.length > 0 && (
          <View style={[styles.gallerySection, isTablet && styles.galleryTablet]}>
            <Text style={[styles.label, isTablet && styles.labelTablet]}>
              Gallery
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.gallery.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={[
                    styles.galleryImage,
                    isTablet && styles.galleryImageTablet,
                  ]}
                  resizeMode="cover"
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginTop:-3
  },

   headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 22,  marginLeft: 65,
    padding:8,
   

  },

  headerTitleTablet: {
    fontSize: 28,
    padding:8,
    left:125,
  },

  /* 🖼 BANNER */
  banner: {
    marginBottom: 15,
  },

  /* 📝 CONTENT */
  section: {
    marginHorizontal: 20,
    marginTop: 10,
  },

  sectionTablet: {
    marginHorizontal: 40,
  },

  title: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 6,
  },

  titleTablet: {
    fontSize: 23,
    right:23,
  },

  description: {
    fontSize: 15,
    color: "#333",
    textAlign: "justify",
  },

  descTablet: {
    fontSize: 17,
  },

  /* 🎥 VIDEO */
  videoSection: {
    width: "100%",
    marginTop: 12,
    marginBottom: 35,
    backgroundColor: "#000",
  },

  videoTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 8,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingLeft: 20,
    
  },

  videoTitleTablet: {
    fontSize: 22,
  },

  /* 🖼 GALLERY */
  gallerySection: {
    marginHorizontal: 20,
    marginTop: 8,
  },

  galleryTablet: {
    marginHorizontal: 40,
    right:23,
  },

  label: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 12,
  },

  labelTablet: {
    fontSize: 24,
  },

  galleryImage: {
    width: 220,
    height: 140,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#93210A",
  },

  galleryImageTablet: {
    width: 300,
    height: 180,
  },

  noVideo: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginVertical: 10,
  },
});
