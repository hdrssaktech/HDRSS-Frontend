import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

const VaasthuPage3 = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;

  const [videoLoading, setVideoLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  // 🔹 About states
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [aboutOverflow, setAboutOverflow] = useState(false);

  // 🔹 Description states (no truncation needed as per your requirement)
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    if (!url) return null;
    const reg =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(reg);
    return match ? match[1] : null;
  };

  const videoId = getYoutubeId(item.video);
  const screenWidth = Dimensions.get("window").width;
  const videoHeight = isTablet
    ? Math.min(screenWidth * 0.56, 400)
    : Math.min(screenWidth * 0.56, 240);

  // Function to check if text has more than 5 lines
  const checkTextOverflow = (text, setOverflowFunction) => {
    if (!text) return;
    
    // Count the number of newlines in the text
    const lineCount = (text.match(/\n/g) || []).length + 1;
    
    // If there are more than 5 lines, set overflow to true
    if (lineCount > 5) {
      setOverflowFunction(true);
    }
  };

  // Call this when component mounts to check About text
  React.useEffect(() => {
    if (item.about) {
      checkTextOverflow(item.about, setAboutOverflow);
    }
  }, [item.about]);

  // Function to truncate text to 5 lines
  const truncateTextToFiveLines = (text) => {
    if (!text) return "";
    
    const lines = text.split('\n');
    
    // If text has 5 or fewer lines, return full text
    if (lines.length <= 5) {
      return text;
    }
    
    // Return first 5 lines
    const firstFiveLines = lines.slice(0, 5).join('\n');
    
    // Add ellipsis if needed
    return firstFiveLines + '...';
  };

  const renderHeader = () => (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={isTablet ? 30 : 24} color="#fff" />
      </TouchableOpacity>

      <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
        {item.title}
      </Text>

      <View style={{ width: 30 }} />
    </View>
  );

  /* ================= ABOUT SECTION (WITH 5-LINE TRUNCATION) ================= */
  const renderAboutSection = () => {
    if (!item.about) return null;

    // Get the text to display
    const displayAbout = showFullAbout 
      ? item.about 
      : truncateTextToFiveLines(item.about);

    return (
      <View style={styles.aboutSection}>
        <Text style={[styles.section, isTablet && styles.sectionTablet]}>
          About
        </Text>
        
        <Text style={[
          styles.aboutText,
          isTablet && styles.aboutTextTablet,
          !showFullAbout && aboutOverflow && styles.truncatedText
        ]}>
          {displayAbout}
        </Text>

        {aboutOverflow && (
          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={() => setShowFullAbout(!showFullAbout)}
          >
            <Text style={styles.readMoreText}>
              {showFullAbout ? "Show Less" : "Read More"}
            </Text>
            <Ionicons
              name={showFullAbout ? "chevron-up" : "chevron-down"}
              size={16}
              color="#8B1A1A"
              style={styles.readMoreIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  /* ================= GALLERY ================= */
  const renderGallery = () => {
    if (!item.gallery || item.gallery.length === 0) return null;

    return (
      <View style={styles.gallerySection}>
        <Text style={[styles.section, isTablet && styles.sectionTablet]}>
          Gallery
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.galleryScroll}
        >
          {item.gallery.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img }}
              style={[
                styles.galleryImage,
                isTablet && styles.tabletGalleryImage,
              ]}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  /* ================= VIDEO ================= */
  const renderVideoSection = () => {
    if (!videoId) return null;

    return (
      <View style={styles.videoSection}>
        <Text style={[styles.section, isTablet && styles.sectionTablet]}>
          Video
        </Text>

        {videoLoading && (
          <View style={[styles.videoLoader, { height: videoHeight }]}>
            <ActivityIndicator size="large" color="#8B1A1A" />
            <Text style={styles.videoLoadingText}>Loading video...</Text>
          </View>
        )}

        <View style={[styles.videoContainer, { height: videoHeight }]}>
          <YoutubePlayer
            height={videoHeight}
            width={screenWidth - 32}
            videoId={videoId}
            play={playing}
            onReady={() => setVideoLoading(false)}
            onChangeState={(state) => {
              if (state === "ended") setPlaying(false);
            }}
            onError={(error) => {
              console.error("YouTube player error:", error);
              setVideoLoading(false);
            }}
          />
        </View>
      </View>
    );
  };

  /* ================= DESCRIPTION (FULL TEXT, NO TRUNCATION) ================= */
  const renderDescriptionSection = () => {
    if (!item.description) return null;

    return (
      <View style={styles.descriptionSection}>
        <Text style={[styles.section, isTablet && styles.sectionTablet]}>
          Description
        </Text>
        
        <Text style={[
          styles.description,
          isTablet && styles.descriptionTablet,
        ]}>
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />
      
      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNER */}
        <Image
          source={{ uri: item.bannerImage }}
          style={[styles.banner, isTablet && styles.bannerTablet]}
        />

        <View style={[styles.content, isTablet && styles.contentTablet]}>
          <Text style={[styles.title, isTablet && styles.titleTablet]}>
            {item.title}
          </Text>

          {/* ABOUT SECTION (with 5-line truncation) */}
          {renderAboutSection()}

          {/* VIDEO SECTION */}
          {item.video && renderVideoSection()}

          {/* GALLERY SECTION */}
          {renderGallery()}

          {/* DESCRIPTION SECTION (full text, no truncation) */}
          {renderDescriptionSection()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VaasthuPage3;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F5" 
  },

  header: {
    backgroundColor: "#8B1A1A",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTablet: { 
    paddingVertical: 46,
    paddingHorizontal: 24,
    marginTop: -27,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 8,
  },
  headerTitleTablet: { fontSize: 24 },

  banner: { 
    width: "100%", 
    height: 220,
    resizeMode: "cover" 
  },
  bannerTablet: { height: 320 },

  content: { padding: 16 },
  contentTablet: {
    maxWidth: 900,
    alignSelf: "center",
    padding: 24,
    width: "100%",
  },

  title: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  titleTablet: { 
    fontSize: 28, 
    marginTop: 20,
    marginBottom: 15,
  },

  section: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8B1A1A",
    marginBottom: 10,
  },
  sectionTablet: { 
    fontSize: 22, 
    marginBottom: 12,
  },

  /* ========== ABOUT SECTION STYLES ========== */
  aboutSection: {
    marginBottom: 20,
  },

  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  aboutTextTablet: {
    fontSize: 17,
    lineHeight: 26,
  },

  truncatedText: {
    // Optional: Add styles for truncated text if needed
    // opacity: 0.9,
  },

  /* ========== READ MORE BUTTON ========== */
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 5,
  },

  readMoreText: {
    color: "#8B1A1A",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },

  readMoreIcon: {
    marginTop: 2,
  },

  /* ========== DESCRIPTION SECTION ========== */
  descriptionSection: {
    marginTop: 25,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  descriptionTablet: {
    fontSize: 17,
    lineHeight: 26,
  },

  /* ========== VIDEO SECTION ========== */
  videoSection: {
    marginTop: 20,
    marginBottom: 20,
  },

  videoContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    marginTop: 10,
  },

  videoLoader: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
  },

  videoLoadingText: {
    marginTop: 10,
    color: "#8B1A1A",
    fontSize: 16,
  },

  /* ========== GALLERY SECTION ========== */
  gallerySection: {
    marginTop: 20,
    marginBottom: 20,
  },

  galleryScroll: {
    marginHorizontal: -5,
  },

  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginHorizontal: 5,
    resizeMode: "cover",
  },

  tabletGalleryImage: {
    width: 280,
    height: 200,
    borderRadius: 12,
  },
});