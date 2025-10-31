// components/InterviewVideos.js
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const videos = [
  { id: 1, videoId: "6cT4SV2xhRg", title: "Interview 1" },
  
];

export default function InterviewVideos() {
  return (
    <View style={styles.interviewContainer}>
      <Text style={styles.heading1}> Videos</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {videos.map((video) => (
          <View key={video.id} style={styles.card}>
            <YoutubePlayer
              height={180}
              width={370}
              play={false}
              videoId={video.videoId}
            />
      
          </View>
        ))}
      </ScrollView>
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
    marginBottom: 10,
    marginHorizontal:10,
  },
  card: {
    padding: 10,
    marginLeft:-10,
  },
  title: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
