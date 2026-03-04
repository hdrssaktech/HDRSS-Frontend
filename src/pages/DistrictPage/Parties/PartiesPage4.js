import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 600;
const isSmallDevice = width < 375;

const PartiesPage4 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  useEffect(() => {
    if (item.video) {
      extractVideoId(item.video);
    }
  }, [item.video]);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    setVideoId(match && match[2].length === 11 ? match[2] : "");
  };

  const handleCall = () => {
    if (item.phoneNumber) {
      Linking.openURL(`tel:${item.phoneNumber}`);
    }
  };

  const handleLocationPress = () => {
    if (item.location) {
      const encodedLocation = encodeURIComponent(item.location);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
    }
  };

  const getYouTubeThumbnail = () => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handleImageLoad = () => {
    setIsLoadingImage(false);
  };

  const handleVideoThumbnailLoad = () => {
    setIsLoadingVideo(false);
  };

  const handleImageError = (e) => {
    setIsLoadingImage(false);
  };

  const handleVideoThumbnailError = (e) => {
    setIsLoadingVideo(false);
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#93210A" />
          <Text style={styles.errorText}>No data available</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {item.title} Details
            </Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollViewContent,
            isTablet && styles.scrollViewContentTablet
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Section with Image */}
          <View style={styles.heroSection}>
            <View style={styles.imageWrapper}>
              {isLoadingImage && (
                <View style={styles.imageLoading}>
                  <ActivityIndicator size="large" color="#93210A" />
                </View>
              )}
              <Image
                source={{
                  uri: item.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }}
                style={styles.heroImage}
                resizeMode="cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              <View style={styles.imageOverlay}>
                <View style={styles.titleContainer}>
                  <Text style={styles.nameText} numberOfLines={2}>
                    {item.name || "N/A"}
                  </Text>
                  <Text style={styles.titleText} numberOfLines={1}>
                    {item.title || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions Bar */}
          <View style={[
            styles.actionsBar,
            isTablet && styles.actionsBarTablet
          ]}>
            {item.phoneNumber && (
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={handleCall}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="call" size={isTablet ? 28 : 24} color="#93210A" />
                </View>
                <Text style={styles.actionLabel}>Call</Text>
              </TouchableOpacity>
            )}
            
            {item.location && (
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={handleLocationPress}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="navigate" size={isTablet ? 28 : 24} color="#93210A" />
                </View>
                <Text style={styles.actionLabel}>Directions</Text>
              </TouchableOpacity>
            )}
            
            {item.video && (
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={() => setShowVideoModal(true)}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="videocam" size={isTablet ? 28 : 24} color="#93210A" />
                </View>
                <Text style={styles.actionLabel}>Video</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* About Section */}
          {item.about && (
            <View style={[
              styles.contentCard,
              isTablet && styles.contentCardTablet
            ]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons name="information-circle" size={isTablet ? 30 : 24} color="#93210A" />
                </View>
                <Text style={styles.sectionTitle}>About</Text>
              </View>
              <Text 
                style={[
                  styles.aboutText,
                  isTablet && styles.aboutTextTablet
                ]}
                numberOfLines={showFullAbout ? undefined : 6}
              >
                {item.about || "No information available"}
              </Text>
              {item.about && item.about.length > 150 && (
                <TouchableOpacity
                  onPress={() => setShowFullAbout(!showFullAbout)}
                  style={styles.readMoreButton}
                >
                  <Text style={styles.readMoreText}>
                    {showFullAbout ? 'Show Less' : 'Read More'}
                  </Text>
                  <Feather 
                    name={showFullAbout ? 'chevron-up' : 'chevron-down'} 
                    size={16} 
                    color="#93210A" 
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Video Section */}
          {item.video && (
            <View style={[
              styles.contentCard,
              isTablet && styles.contentCardTablet
            ]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons name="videocam" size={isTablet ? 30 : 24} color="#93210A" />
                </View>
                <Text style={styles.sectionTitle}>Video Content</Text>
              </View>
              
              <TouchableOpacity
                style={styles.videoThumbnailContainer}
                activeOpacity={0.8}
                onPress={() => setShowVideoModal(true)}
              >
                {isLoadingVideo && (
                  <View style={styles.videoLoading}>
                    <ActivityIndicator size="large" color="#93210A" />
                  </View>
                )}
                {getYouTubeThumbnail() ? (
                  <Image
                    source={{ uri: getYouTubeThumbnail() }}
                    style={styles.videoThumbnail}
                    resizeMode="cover"
                    onLoad={handleVideoThumbnailLoad}
                    onError={handleVideoThumbnailError}
                  />
                ) : (
                  <View style={styles.videoPlaceholder}>
                    <Ionicons name="videocam-outline" size={50} color="#93210A" />
                    <Text style={styles.videoPlaceholderText}>Video Preview</Text>
                  </View>
                )}
                
                <View style={styles.playButtonOverlay}>
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={40} color="#fff" />
                  </View>
                </View>
                
                <View style={styles.videoBadge}>
                  <Ionicons name="play-circle" size={14} color="#fff" />
                  <Text style={styles.videoBadgeText}>WATCH NOW</Text>
                </View>
              </TouchableOpacity>
              
              <Text style={styles.videoCaption}>
                Tap to play the video content
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Video Modal */}
      <Modal
        visible={showVideoModal}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent={true}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowVideoModal(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {item.name} - Video
              </Text>
              <View style={{ width: 40 }} />
            </View>
            
            <View style={styles.videoPlayerContainer}>
              {videoId ? (
                <YoutubePlayer
                  height={isTablet ? 450 : 300}
                  width={width}
                  play={true}
                  videoId={videoId}
                  webViewStyle={{
                    backgroundColor: '#000',
                    flex: 1,
                    width: '100%'
                  }}
                  webViewProps={{
                    allowsFullscreenVideo: true,
                    mediaPlaybackRequiresUserAction: false,
                  }}
                />
              ) : (
                <View style={styles.noVideoContainer}>
                  <Ionicons name="videocam-off" size={60} color="#93210A" />
                  <Text style={styles.noVideoText}>Video not available</Text>
                  <Text style={styles.noVideoSubtext}>
                    Unable to load the video content
                  </Text>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default PartiesPage4;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#93210A",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: isTablet ? 22 : 18,
    color: "#93210A",
    textAlign: "center",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#93210A",
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  retryButtonText: {
    color: "#fff",
    fontSize: isTablet ? 18 : 16,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  header: {
    backgroundColor: "#93210A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: isTablet ? 24 : 16,
    paddingTop: Platform.OS === "ios" ? 10 : 35,
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  backButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: isTablet ? 24 : 18,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  scrollViewContentTablet: {
    paddingBottom: 60,
  },

  // Hero Section - Fixed Image Styling
  heroSection: {
    marginBottom: 25,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: isTablet ? height * 0.5 : height * 0.35,
    minHeight: isTablet ? 400 : 250,
    backgroundColor: "#E8E8E8",
  },
  imageLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingTop: 40,
    paddingBottom: isTablet ? 35 : 25,
    paddingHorizontal: isTablet ? 30 : 20,
  },
  titleContainer: {
    maxWidth: isTablet ? "80%" : "100%",
  },
  nameText: {
    fontSize: isTablet ? 36 : 26,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  titleText: {
    fontSize: isTablet ? 22 : 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Quick Actions Bar
  actionsBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  actionsBarTablet: {
    marginHorizontal: 40,
    padding: 25,
    borderRadius: 25,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: isTablet ? 15 : 10,
  },
  actionIconContainer: {
    width: isTablet ? 70 : 56,
    height: isTablet ? 70 : 56,
    borderRadius: isTablet ? 35 : 28,
    backgroundColor: "#FFF5F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#93210A",
    ...Platform.select({
      ios: {
        shadowColor: "#93210A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionLabel: {
    fontSize: isTablet ? 16 : 14,
    color: "#93210A",
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    textAlign: "center",
  },

  // Content Cards
  contentCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  contentCardTablet: {
    marginHorizontal: 40,
    padding: 30,
    borderRadius: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#F0F0F0",
  },
  sectionIconContainer: {
    width: isTablet ? 50 : 40,
    height: isTablet ? 50 : 40,
    borderRadius: isTablet ? 25 : 20,
    backgroundColor: "#FFF5F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#93210A",
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "800",
    color: "#1F2937",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.3,
  },

  // About Section
  aboutText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 26,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    textAlign: "justify",
  },
  aboutTextTablet: {
    fontSize: 18,
    lineHeight: 30,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFF5F2",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#93210A",
  },
  readMoreText: {
    color: "#93210A",
    fontSize: isTablet ? 16 : 14,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },

  // Video Section
  videoThumbnailContainer: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 15,
    backgroundColor: "#000",
    height: isTablet ? 280 : 200,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  videoLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  videoThumbnail: {
    width: "100%",
    height: "100%",
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholderText: {
    color: "#93210A",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  playButtonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: isTablet ? 80 : 60,
    height: isTablet ? 80 : 60,
    borderRadius: isTablet ? 40 : 30,
    backgroundColor: "rgba(147, 33, 10, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
    }),
  },
  videoBadge: {
    position: "absolute",
    bottom: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(147, 33, 10, 0.95)",
    paddingHorizontal: isTablet ? 20 : 15,
    paddingVertical: isTablet ? 10 : 8,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  videoBadgeText: {
    color: "#FFFFFF",
    fontSize: isTablet ? 14 : 12,
    fontWeight: "800",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.5,
  },
  videoCaption: {
    fontSize: isTablet ? 16 : 14,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontStyle: "italic",
    marginTop: 10,
  },

  // Video Modal
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: isTablet ? 24 : 16,
    paddingTop: Platform.OS === "ios" ? 10 : 35,
    paddingBottom: 20,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalCloseButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  modalTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    textAlign: "center",
    flex: 1,
    paddingHorizontal: 10,
  },
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  noVideoText: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginTop: 20,
    marginBottom: 10,
  },
  noVideoSubtext: {
    fontSize: isTablet ? 18 : 14,
    color: "#AAAAAA",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    textAlign: "center",
    maxWidth: 300,
  },
});