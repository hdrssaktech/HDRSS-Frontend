// screens/NewsPage2.js

import React, { useState } from "react";
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
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

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

  const handleReadFullArticle = () => {
    if (news.link) {
      Linking.openURL(news.link);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={isTablet ? 26 : 22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          News Details
        </Text>
        <View style={{ width: isTablet ? 40 : 36 }} />
      </View>

      {/* 🔹 Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔹 Edge-to-edge visual: video if available, otherwise fallback to image */}
        {videoId ? (
          <View style={styles.mediaWrapper}>
            {playVideo ? (
              <YoutubePlayer
                height={isTablet ? 360 : 220}
                play={true}
                videoId={videoId}
                width={width}
              />
            ) : (
              <TouchableOpacity onPress={() => setPlayVideo(true)} activeOpacity={0.9}>
                <Image source={{ uri: thumbnailUrl }} style={styles.mediaThumb} />
                <View style={styles.playBadge}>
                  <Ionicons name="play" size={isTablet ? 22 : 18} color="#93210A" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        ) : news.image ? (
          <View style={styles.mediaWrapper}>
            <Image source={{ uri: news.image }} style={styles.mediaThumb} />
          </View>
        ) : null}

        {/* 🔹 Text - Full white container */}
        <View style={styles.textContainer}>
          <View style={styles.metaRow}>
            <View style={styles.dateChip}>
              <Ionicons name="calendar-outline" size={12} color="#93210A" />
              <Text style={styles.newdate}>{formatDate(news.date)}</Text>
            </View>
            {news.sourceName ? (
              <View style={styles.sourceChip}>
                <Text style={styles.sourceText}>{news.sourceName}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.newsTitle}>{news.title}</Text>

          <View style={styles.divider} />

          {/* 🔹 FULL description - no truncation */}
          <Text style={styles.newsText}>
            {news.description || "No description available."}
          </Text>

          {/* 🔹 Read Full Article */}
          {news.link ? (
            <TouchableOpacity
              style={styles.readMoreBtn}
              onPress={handleReadFullArticle}
              activeOpacity={0.85}
            >
              <Text style={styles.readMoreText}>Read Full Article</Text>
              <Ionicons name="open-outline" size={isTablet ? 22 : 18} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const getStyles = (isTablet, screenWidth) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FBEEDB",
    },

    noData: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FBEEDB",
    },
    noDataText: {
      fontSize: 16,
      color: "gray",
      marginBottom: 10,
    },
    backBtnText: {
      color: "#93210A",
      fontSize: 15,
      fontWeight: "bold",
    },

    /* 🔹 Header */
    headerBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: isTablet ? 23 : 18,
      paddingHorizontal: 16,
      paddingTop: 49,
      backgroundColor: "#93210A",
      elevation: 4,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },

    backBtn: {
      width: isTablet ? 40 : 36,
      height: isTablet ? 40 : 36,
      borderRadius: isTablet ? 20 : 18,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },

    headerTitle: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: isTablet ? 26 : 20,
      flex: 1,
      textAlign: "center",
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: 30,
    },

    /* 🔹 Edge-to-edge media */
    mediaWrapper: {
      width: screenWidth,
      backgroundColor: "#ede8d5",
    },

    mediaThumb: {
      width: screenWidth,
      height: isTablet ? 320 : 300,
      resizeMode: "cover",
    },

    playBadge: {
      position: "absolute",
      bottom: 14,
      right: 14,
      width: isTablet ? 52 : 44,
      height: isTablet ? 52 : 44,
      borderRadius: isTablet ? 26 : 22,
      backgroundColor: "#D4AF37",
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },

    /* 🔹 Text Container */
    textContainer: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      paddingHorizontal: isTablet ? 30 : 18,
      paddingTop: 24,
      paddingBottom: 30,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      marginTop: -18,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },

    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    dateChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    newdate: {
      fontSize: isTablet ? 14 : 12,
      fontWeight: "600",
      color: "#93210A",
    },

    sourceChip: {
      borderWidth: 1,
      borderColor: "#D4AF37",
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },

    sourceText: {
      fontSize: isTablet ? 13 : 11,
      fontWeight: "700",
      color: "#93210A",
      letterSpacing: 0.3,
    },

    newsTitle: {
      fontSize: isTablet ? 25 : 19,
      fontWeight: "800",
      color: "#301913",
      lineHeight: isTablet ? 33 : 26,
    },

    divider: {
      width: 46,
      height: 3,
      backgroundColor: "#D4AF37",
      borderRadius: 2,
      marginTop: 14,
      marginBottom: 16,
    },

    newsText: {
      fontSize: isTablet ? 17 : 14.5,
      color: "#4a3d34",
      lineHeight: isTablet ? 27 : 22,
      textAlign: "justify",
    },

    readMoreBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#93210A",
      borderRadius: 30,
      paddingVertical: isTablet ? 16 : 14,
      paddingHorizontal: 20,
      marginTop: 20,
      gap: 10,
      elevation: 3,
      shadowColor: "#93210A",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },

    readMoreText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: isTablet ? 17 : 15,
      letterSpacing: 0.5,
    },
  });