// // components/InterviewVideos.js
// import React from "react";
// import { View, Text, ScrollView, StyleSheet } from "react-native";
// import YoutubePlayer from "react-native-youtube-iframe";

// const videos = [
//   { id: 1, videoId: "6cT4SV2xhRg", title: "Interview 1" },
  
// ];

// export default function InterviewVideos() {
//   return (
//     <View style={styles.interviewContainer}>
//       <Text style={styles.heading1}> Videos</Text>

//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         {videos.map((video) => (
//           <View key={video.id} style={styles.card}>
//             <YoutubePlayer
//               height={180}
//               width={370}
//               play={false}
//               videoId={video.videoId}
//             />
      
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   interviewContainer: {
//     marginTop: 20,
    
//   },
//   heading1: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#93210A",
//     marginBottom: 10,
//     marginHorizontal:10,
//   },
//   card: {
//     padding: 10,
//     marginLeft:-10,
//   },
//   title: {
//     marginTop: 5,
//     fontSize: 14,
//     fontWeight: "600",
//     textAlign: "center",
//   },
// });




// components/InterviewVideos.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";

export default function InterviewVideos() {
  const { width } = useWindowDimensions();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const isTablet = width >= 600;
  const videoWidth = isTablet ? 700 : 370;
  const videoHeight = isTablet ? 350 : 180;

  useEffect(() => {
    fetch("https://hdrss-backend.onrender.com/api/add/Interviews")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos); // ✅ IMPORTANT FIX
        setLoading(false);
      })
      .catch((error) => {
        console.log("API Error:", error);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.interviewContainer}>
      <Text style={[styles.heading1, isTablet && styles.headingTablet]}>
        Videos
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#93210A" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {videos.map((url, index) => (
            <View key={index} style={styles.card}>
              <WebView
                source={{ uri: url }}
                style={{ width: videoWidth, height: videoHeight }}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  interviewContainer: {
    marginTop: 20,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 19,
    marginHorizontal: 10,
    
  },
  headingTablet: {
    fontSize: 26,
  },
  card: {
    marginHorizontal: 10,
  },
});