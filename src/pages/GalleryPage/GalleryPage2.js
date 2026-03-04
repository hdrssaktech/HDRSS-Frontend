import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { Video } from "expo-av";
import { useRoute, useNavigation } from "@react-navigation/native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function GalleryInformation() {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, mainImage, description, images = [], videoLink } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
 const [isExpanded, setIsExpanded] = useState(false);

  const handleNext = () =>
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  const handlePrev = () =>
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));

  // Extract YouTube ID
  const extractYouTubeId = (url) => {
    const match = url?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const videoId = extractYouTubeId(videoLink);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* Header - Separate Mobile and Tablet Styles */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
        >
          <Ionicons 
            name="chevron-back" 
            size={isTablet ? (isLargeTablet ? 36 : 34) : 30} 
            color="white" 
          />
        </TouchableOpacity>
        <Text style={[styles.title, isTablet && styles.titleTablet]}>
          Gallery
        </Text>
        <View style={{ width: isTablet ? 40 : 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Content Section */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <Text style={[styles.mainTitle, isTablet && styles.mainTitleTablet]}>
            {title}
          </Text>
          
          <Image 
            source={mainImage} 
            style={[styles.mainImage, isTablet && styles.mainImageTablet]} 
            resizeMode="cover"
          />
          

         <Text
          style={[styles.info, isTablet && styles.infoTablet]}
          numberOfLines={isExpanded ? undefined : 4}
        >
          {description}
        </Text>
          {/* read more method */}
          {description?.length > 120 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={[styles.readMoreText,isTablet && styles.readMoreTextTablet]}>
                {isExpanded ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          )}


        </View>

        {/* Image Slider */}
        {images.length > 0 && (
          <View style={[styles.imageRow, isTablet && styles.imageRowTablet]}>
            <TouchableOpacity onPress={handlePrev}>
              <Icon 
                name="chevron-left" 
                size={isTablet ? (isLargeTablet ? 50 : 55) : 40} 
                color="#93210A" 
              />
            </TouchableOpacity>
            
            <Image
              source={{ uri: images[currentIndex]?.url }}
              style={[styles.sliderImage, isTablet && styles.sliderImageTablet]}
              resizeMode="cover"
            />
            
            <TouchableOpacity onPress={handleNext}>
              <Icon 
                name="chevron-right" 
                size={isTablet ? (isLargeTablet ? 50 : 45) : 40} 
                color="#93210A" 
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Video Section */}
        {videoLink && (
          <View style={[styles.videoContainer, isTablet && styles.videoContainerTablet]}>
            {videoId ? (
              <YoutubePlayer 
                height={isTablet ? (isLargeTablet ? 370 : 400) : 220} 
                width={isTablet ? (isLargeTablet ? 800 : 700) : 350} 
                play={false} 
                videoId={videoId} 
              />
            ) : (
              <Video
                source={{ uri: videoLink }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={false}
                useNativeControls
                style={[styles.videoPlayer, isTablet && styles.videoPlayerTablet]}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header - Mobile
  header: {
    backgroundColor: "#93210A",
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  // Header - Tablet
  headerTablet: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 25,
    paddingHorizontal: 30,
  },

  // Back Button - Mobile
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  // Back Button - Tablet
  backButtonTablet: {
    padding: 10,
    borderRadius: 25,
  },

  // Title - Mobile
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  // Title - Tablet
  titleTablet: {
    fontSize: isLargeTablet ? 28 : 26,
  },

  // Section - Mobile
  section: {
    padding: 15,
  },
  // Section - Tablet
  sectionTablet: {
    paddingHorizontal: 30,
    paddingVertical: 25,
  },
  readMoreText: {
  marginTop: 10,
  color: "#93210A",
  fontSize: 15,
  fontWeight: "600",
  alignSelf: "flex-end",
},
readMoreTextTablet: {
  fontSize: 17,
},


  // Main Title - Mobile
  mainTitle: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: "600",
    color: "#93210A",
    textAlign: "center",
  },
  // Main Title - Tablet
  mainTitleTablet: {
    fontSize: isLargeTablet ? 30 : 28,
    marginTop: 20,
  },

  // Main Image - Mobile
  mainImage: {
    width: "110%",
    height: 220,
    marginTop: 20,
    alignSelf: "center",
   
  },
  // Main Image - Tablet
  mainImageTablet: {
    width: "95%",
    height: isLargeTablet ? 280 : 260,
    marginTop: 25,
    borderRadius: 16,
  },

  // Info Text - Mobile
  info: {
    marginTop: 35,
    fontSize: 16,
    color: "#333",
    lineHeight: 20,
    textAlign: "justify",
  },
  // Info Text - Tablet
  infoTablet: {
    fontSize: isLargeTablet ? 18 : 20,
    lineHeight: isLargeTablet ? 30 : 28,
    marginTop: 40,
  },

  // Image Row - Mobile
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },
  // Image Row - Tablet
  imageRowTablet: {
    marginTop: 30,
    marginHorizontal: 20,
  },

  // Slider Image - Mobile
  sliderImage: {
    width: 250,
    height: 200,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  // Slider Image - Tablet
  sliderImageTablet: {
    width: isLargeTablet ? 400 : 350,
    height: isLargeTablet ? 300 : 260,
    borderRadius: 16,
  },

  // Video Container - Mobile
  videoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  // Video Container - Tablet
  videoContainerTablet: {
    marginVertical: 30,
  },

  // Video Player - Mobile
  videoPlayer: {
    width: 350,
    height: 220,
    borderRadius: 12,
  },
  // Video Player - Tablet
  videoPlayerTablet: {
    width: isLargeTablet ? 800 : 600,
    height: isLargeTablet ? 370 : 300,
    borderRadius: 16,
  },
});