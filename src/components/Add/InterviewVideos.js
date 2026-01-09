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
import YoutubePlayer from "react-native-youtube-iframe";

export default function InterviewVideos() {
  const { width } = useWindowDimensions();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  const isTablet = width >= 600;
  const videoWidth = isTablet ? 700 : 320;
  const videoHeight = isTablet ? 500 : 180;

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    
    console.log("Processing URL:", url);
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\/.*v=)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        console.log("Found video ID:", match[1]);
        return match[1];
      }
    }
    
    console.log("No video ID found");
    return null;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log("Fetching videos from API...");
        const response = await fetch("https://hdrss-backend.onrender.com/api/add/Interviews");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        // Check the structure of the response
        let videoArray = [];
        
        if (Array.isArray(data)) {
          videoArray = data;
        } else if (data && data.videos && Array.isArray(data.videos)) {
          videoArray = data.videos;
        } else if (data && Array.isArray(data.data)) {
          videoArray = data.data;
        } else {
          console.log("Unexpected API response structure:", data);
          videoArray = [];
        }
        
        console.log("Video array:", videoArray);
        
        // Process videos to extract YouTube IDs
        const processedVideos = videoArray
          .map((item, index) => {
            // Handle both string URLs and object with url property
            const url = typeof item === 'string' ? item : item?.url || item?.videoUrl || '';
            const videoId = getYouTubeId(url);
            
            return videoId ? { 
              id: index.toString(), 
              url, 
              videoId 
            } : null;
          })
          .filter(video => video !== null);
        
        console.log("Processed videos:", processedVideos);
        setVideos(processedVideos);
        
      } catch (error) {
        console.error("API Error:", error);
        // For testing - use some sample YouTube videos
        setVideos([
          { id: '1', videoId: 'dQw4w9WgXcQ' }, // Rick Astley - Never Gonna Give You Up
          { id: '2', videoId: '9bZkp7q19f0' }, // PSY - GANGNAM STYLE
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.interviewContainer}>
      <Text style={[styles.heading1, isTablet && styles.headingTablet]}>
        Interview Videos
      </Text>

      {videos.length === 0 ? (
        <View style={styles.noVideosContainer}>
          <Text style={styles.noVideosText}>No interview videos available</Text>
        </View>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {videos.map((video) => (
            <View key={video.id} style={[styles.card, { width: videoWidth }]}>
              <YoutubePlayer
                height={videoHeight}
                width={videoWidth}
                play={playing}
                videoId={video.videoId}
                onChangeState={(state) => {
                  console.log("Video state:", state);
                  setPlaying(state === 'playing');
                }}
                webViewStyle={{ opacity: 0.99 }}
                webViewProps={{
                  androidLayerType: 'hardware',
                }}
              />
              <View style={styles.videoInfo}>
                {/* <Text style={styles.videoTitle} numberOfLines={1}>
                  YouTube Video
                </Text> */}
              </View>
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
    marginBottom:-8 ,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#93210A',
    fontSize: 16,
  },
  heading1: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 20,
    marginLeft: 5,
  },
  headingTablet: {
    fontSize: 28,
    marginLeft: 20,
  },
  // card: {
  //   marginHorizontal: 10,
  //   backgroundColor: "#000",
  //   borderRadius: 12,
  //   overflow: "hidden",
  //   elevation: 5,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 3 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 4,
  // },
  scrollContent: {
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  noVideosContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    backgroundColor: '#f5f5f5',

    marginHorizontal: 10,
  },
  noVideosText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  videoInfo: {
    padding: 10,
    backgroundColor: '#fff',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});