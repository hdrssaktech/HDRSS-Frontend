import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { VideoView, useVideoPlayer } from "expo-video";

const API_URL = "https://hdrss-backend.onrender.com/api/add/elections";

// Detect Device Type
const getDeviceType = (width) => {
  if (width >= 600) {
    return "tablet";
  }
  return "mobile";
};

// Mute Icon Component
const MuteIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10V14C3 14.5523 3.44772 15 4 15H7L10.293 18.293C10.683 18.683 11.341 18.683 11.731 18.293L12 18.024V5.97605L11.731 5.70705C11.341 5.31705 10.683 5.31705 10.293 5.70705L7 9H4C3.44772 9 3 9.44772 3 10Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 9L21 13"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 9L17 13"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Unmute Icon Component
const UnmuteIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10V14C3 14.5523 3.44772 15 4 15H7L10.293 18.293C10.683 18.683 11.341 18.683 11.731 18.293L12 18.024V5.97605L11.731 5.70705C11.341 5.31705 10.683 5.31705 10.293 5.70705L7 9H4C3.44772 9 3 9.44772 3 10Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 9C16.2 10.2 16.8 11.6 16.8 13C16.8 14.4 16.2 15.8 15 17"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17.5 6.5C19.5 8.5 20.5 10.8 20.5 13C20.5 15.2 19.5 17.5 17.5 19.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Individual Video Component
const VideoItem = ({
  videoUrl,
  itemWidth,
  itemHeight,
  deviceType,
}) => {
  const [isMuted, setIsMuted] = useState(true);

  // Create Video Player
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // Toggle mute/unmute
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    player.muted = newMutedState;
  };

  return (
    <View
      style={[
        styles.videoWrapper,
        {
          width: itemWidth,
          height: itemHeight,
          marginHorizontal: deviceType === "tablet" ? 12 : 8,
        },
      ]}
    >
      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        allowsFullscreen
        allowsPictureInPicture
        contentFit="contain"
      />
      
      {/* Mute/Unmute Button */}
      <TouchableOpacity
        style={styles.muteButton}
        onPress={toggleMute}
        activeOpacity={0.8}
      >
        {isMuted ? <MuteIcon /> : <UnmuteIcon />}
      </TouchableOpacity>
    </View>
  );
};

const CaucusVideo = () => {
  const { width, height } = useWindowDimensions();

  const deviceType = getDeviceType(width);
  const isPortrait = height > width;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Videos
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();

      if (data?.videos && Array.isArray(data.videos)) {
        setVideos(data.videos);
      } else {
        setVideos([]);
      }

    } catch (err) {
      console.log("Video Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Responsive Sizes
  const getVideoDimensions = () => {
    let itemWidth;
    let itemHeight;

    if (deviceType === "tablet") {
      itemWidth = isPortrait ? width * 0.8 : width * 0.6;
      itemHeight = isPortrait ? height * 0.4 : height * 0.7;
    } else {
      itemWidth = width * 0.92;
      itemHeight = isPortrait ? height * 0.32 : height * 0.75;
    }

    return {
      itemWidth,
      itemHeight,
    };
  };

  const { itemWidth, itemHeight } = getVideoDimensions();

  // Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading Videos...</Text>
      </SafeAreaView>
    );
  }

  // Error
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  // Empty
  if (videos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>
          No Videos Available
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={videos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `video-${index}`}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={
          itemWidth + (deviceType === "tablet" ? 24 : 16)
        }
        contentContainerStyle={{
          paddingHorizontal: (width - itemWidth) / 2,
        }}
        renderItem={({ item }) => (
          <VideoItem
            videoUrl={item}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            deviceType={deviceType}
          />
        )}
        removeClippedSubviews={Platform.OS === "android"}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
    </SafeAreaView>
  );
};

export default CaucusVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  videoWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#111",
    position: "relative",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },

      android: {
        elevation: 8,
      },
    }),
  },

  video: {
    width: "100%",
    height: "100%",
  },

  muteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },

  loadingText: {
    color: "#fff",
    marginTop: 15,
    fontSize: 16,
  },

  errorText: {
    color: "#ff4444",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  emptyText: {
    color: "#888",
    fontSize: 16,
  },
});