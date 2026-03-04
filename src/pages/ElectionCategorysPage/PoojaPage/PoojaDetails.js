import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import YoutubePlayer from "react-native-youtube-iframe";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 608;

export default function PoojaDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { poojaItem } = route.params;
  const [showItem, setShowitem] = useState(false);

  const handlePhoneCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = (whatsappNumber) => {
    Linking.openURL(`whatsapp://send?phone=${whatsappNumber}`);
  };

  const handleLocation = (location) => {
    const encodedLocation = encodeURIComponent(location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
  };

  // Function to extract YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  // Check if item has videos
  const hasVideos = poojaItem.videos && Array.isArray(poojaItem.videos) && poojaItem.videos.length > 0;
  
  // Get first video that has a YouTube URL
  const getFirstYoutubeVideo = () => {
    if (!hasVideos) return null;
    
    for (const video of poojaItem.videos) {
      const videoId = getYouTubeId(video);
      if (videoId) {
        return {
          url: video,
          id: videoId
        };
      }
    }
    return null;
  };

  const firstYoutubeVideo = getFirstYoutubeVideo();

  // Check which contact options are available
  const hasPhone = poojaItem.Phone && poojaItem.Phone.trim() !== "";
  const hasWhatsApp = poojaItem.whatshapp && poojaItem.whatshapp.trim() !== "";
  const hasLocation = poojaItem.location && poojaItem.location.trim() !== "";

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Pooja Details
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Image */}
        {poojaItem.bannerimg && (
          <View style={styles.bannerContainer}>
            <Image 
              source={{ uri: poojaItem.bannerimg }} 
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay} />
          </View>
        )}

        <View style={[
          styles.contentCard,
          isTablet && styles.contentCardTablet
        ]}>
          {/* Title */}
          <Text style={[styles.title, isTablet && styles.titleTablet]}>{poojaItem.title}</Text>

          {/* Contact Information - Horizontal Icon Row */}
          {(hasPhone || hasWhatsApp || hasLocation) && (
            <View style={styles.contactSection}>
              
              <View style={styles.contactRow}>
                {/* Phone Icon */}
                {hasPhone && (
                  <TouchableOpacity
                    style={styles.contactIconWrapper}
                    onPress={() => handlePhoneCall(poojaItem.Phone)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconCircle, styles.phoneIconBg]}>
                      <Icon name="phone" size={isTablet ? 26 : 22} color="#fff" />
                    </View>
                    <Text style={[styles.iconLabel, isTablet && styles.iconLabelTablet]}>
                      Call
                    </Text>
                  </TouchableOpacity>
                )}

                {/* WhatsApp Icon */}
                {hasWhatsApp && (
                  <TouchableOpacity
                    style={styles.contactIconWrapper}
                    onPress={() => handleWhatsApp(poojaItem.whatshapp)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconCircle, styles.whatsappIconBg]}>
                      <Ionicons name="logo-whatsapp" size={isTablet ? 26 : 22} color="#fff" />
                    </View>
                    <Text style={[styles.iconLabel, isTablet && styles.iconLabelTablet]}>
                      WhatsApp
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Location Icon */}
                {hasLocation && (
                  <TouchableOpacity
                    style={styles.contactIconWrapper}
                    onPress={() => handleLocation(poojaItem.location)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconCircle, styles.locationIconBg]}>
                      <Icon name="location-on" size={isTablet ? 26 : 22} color="#fff" />
                    </View>
                    <Text style={[styles.iconLabel, isTablet && styles.iconLabelTablet]}>
                      Location
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* About Section */}
          {poojaItem.about && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                About
              </Text>
              <View style={styles.aboutCard}>
                <Text 
                  style={[styles.aboutText, isTablet && styles.aboutTextTablet]} 
                  numberOfLines={showItem ? undefined : 5}
                >
                  {poojaItem.about}
                </Text>
                <TouchableOpacity onPress={() => setShowitem(!showItem)}>
                  <Text style={[styles.readMoreText, isTablet && styles.readMoreTextTablet]}>
                    {showItem ? 'Read Less...' : 'Read More...'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Video Section */}
          {firstYoutubeVideo && (
            <View style={styles.videoSection}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                Video
              </Text>
              <View style={[
                styles.videoContainer,
                isTablet && styles.videoContainerTablet
              ]}>
                <YoutubePlayer
                  height={isTablet ? 350 : 220}
                  videoId={firstYoutubeVideo.id}
                  play={false}
                  webViewStyle={styles.youtubePlayer}
                />
                <View style={styles.videoInfo}>
                  <Text style={[styles.videoNote, isTablet && styles.videoNoteTablet]}>
                    Tap to play video
                  </Text>
                  <Icon name="play-circle-outline" size={isTablet ? 20 : 16} color="#666" />
                </View>
              </View>
            </View>
          )}

          {/* Additional Videos */}
          {hasVideos && poojaItem.videos.length > 1 && (
            <View style={styles.multipleVideosSection}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                More Videos
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.videosContainer}
              >
                {poojaItem.videos.slice(1).map((video, index) => {
                  const videoId = getYouTubeId(video);
                  if (!videoId) return null;
                  
                  return (
                    <View 
                      key={index} 
                      style={[
                        styles.videoThumbnailContainer,
                        isTablet && styles.videoThumbnailContainerTablet
                      ]}
                    >
                      <View style={styles.videoThumbnailWrapper}>
                        <YoutubePlayer
                          height={isTablet ? 150 : 120}
                          width={isTablet ? 240 : 180}
                          videoId={videoId}
                          play={false}
                          webViewStyle={styles.videoThumbnail}
                        />
                        <View style={styles.playIconOverlay}>
                          <Icon name="play-circle-filled" size={isTablet ? 40 : 32} color="rgba(255,255,255,0.9)" />
                        </View>
                      </View>
                      <Text style={styles.videoThumbnailText}>Video {index + 2}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Gallery */}
          {poojaItem.gallery && Array.isArray(poojaItem.gallery) && poojaItem.gallery.length > 0 && (
            <View style={styles.gallerySection}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                Gallery
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryContainer}
              >
                {poojaItem.gallery.map((img, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.galleryImageContainer,
                      isTablet && styles.galleryImageContainerTablet
                    ]}
                  >
                    <Image
                      source={{ uri: img }}
                      style={[
                        styles.galleryImage,
                        isTablet && styles.galleryImageTablet
                      ]}
                      resizeMode="cover"
                    />
                    <View style={styles.imageNumberBadge}>
                      <Text style={styles.imageNumberText}>{index + 1}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  // Header Styles
  header: {
    backgroundColor: "#93210A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight + (isTablet ? 15 : 10),
    paddingBottom: isTablet ? 20 : 15,
    paddingHorizontal: isTablet ? 25 : 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 100,
  },
  backButton: {
    padding: isTablet ? 8 : 5,
  },
  headerTitle: {
    color: "white",
    fontSize: isTablet ? 22 : 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
    letterSpacing: 0.5,
  },
  headerRight: {
    width: isTablet ? 40 : 34,
  },
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: isTablet ? 40 : 30,
  },
  // Banner
  bannerContainer: {
    position: 'relative',
  },
  bannerImage: {
    width: "100%",
    height: isTablet ? 300 : 220,
    backgroundColor: "#f0f0f0",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  // Content Card
  contentCard: {
    backgroundColor: "white",
    borderRadius: isTablet ? 20 : 15,
    margin: isTablet ? 20 : 15,
    marginTop: isTablet ? -40 : -30,
    padding: isTablet ? 25 : 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  contentCardTablet: {
    paddingHorizontal: isTablet ? 30 : 20,
  },
  // Title
  title: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: isTablet ? 25 : 20,
    textAlign: "center",
    lineHeight: isTablet ? 36 : 28,
    letterSpacing: 0.3,
  },
  titleTablet: {
    fontSize: 32,
  },
  // Section Title
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: isTablet ? 16 : 12,
    paddingLeft: isTablet ? 12 : 10,
    borderLeftWidth: isTablet ? 5 : 4,
    borderLeftColor: "#93210A",
  },
  sectionTitleTablet: {
    fontSize: 22,
    marginBottom: 20,
  },
  // Contact Section - Horizontal Icons
  contactSection: {
    marginBottom: isTablet ? 30 : 25,
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: isTablet ? 40 : 30,
    marginTop: isTablet ? 10 : 8,
  },
  contactIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 10 : 8,
    paddingHorizontal: isTablet ? 15 : 10,
    borderRadius: isTablet ? 12 : 10,
    backgroundColor: '#f9f9f9',
    minWidth: isTablet ? 100 : 80,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconCircle: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: isTablet ? 30 : 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isTablet ? 10 : 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  phoneIconBg: {
    backgroundColor: "#93210A",
  },
  whatsappIconBg: {
    backgroundColor: "#25D366",
  },
  locationIconBg: {
    backgroundColor: "#93210A",
  },
  iconLabel: {
    fontSize: isTablet ? 14 : 12,
    color: "#333",
    fontWeight: '600',
    textAlign: 'center',
    marginTop: isTablet ? 4 : 2,
  },
  iconLabelTablet: {
    fontSize: 15,
  },
  contactInfoRow: {
    marginTop: isTablet ? 15 : 10,
    alignItems: 'center',
  },
  contactInfoText: {
    fontSize: isTablet ? 15 : 13,
    color: "#666",
    textAlign: 'center',
    marginBottom: isTablet ? 6 : 4,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: isTablet ? 15 : 10,
    paddingVertical: isTablet ? 6 : 4,
    borderRadius: 8,
  },
  contactInfoTextTablet: {
    fontSize: 16,
  },
  // About Section
  section: {
    marginBottom: isTablet ? 30 : 25,
  },
  aboutCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: isTablet ? 12 : 10,
    padding: isTablet ? 20 : 15,
    borderLeftWidth: 3,
    borderLeftColor: "#93210A",
  },
  aboutText: {
    fontSize: isTablet ? 17 : 16,
    lineHeight: isTablet ? 28 : 24,
    color: "#555",
    textAlign: "justify",
    letterSpacing: 0.2,
  },
  aboutTextTablet: {
    fontSize: 18,
    lineHeight: 30,
  },
  readMoreText: {
    color: '#93210A',
    marginTop: isTablet ? 12 : 10,
    fontWeight: 'bold',
    fontSize: isTablet ? 16 : 14,
    alignSelf: 'flex-end',
  },
  readMoreTextTablet: {
    fontSize: 17,
  },
  // Video Section
  videoSection: {
    marginBottom: isTablet ? 30 : 25,
  },
  videoContainer: {
    borderRadius: isTablet ? 12 : 10,
    overflow: "hidden",
    backgroundColor: "#000",
    marginBottom: isTablet ? 15 : 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  videoContainerTablet: {
    borderRadius: 15,
  },
  youtubePlayer: {
    borderRadius: isTablet ? 12 : 10,
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isTablet ? 12 : 8,
    backgroundColor: '#f8f8f8',
  },
  videoNote: {
    fontSize: isTablet ? 14 : 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginRight: 8,
  },
  videoNoteTablet: {
    fontSize: 15,
  },
  // Multiple Videos
  multipleVideosSection: {
    marginBottom: isTablet ? 30 : 25,
  },
  videosContainer: {
    paddingRight: 10,
  },
  videoThumbnailContainer: {
    marginRight: isTablet ? 16 : 12,
  },
  videoThumbnailContainerTablet: {
    marginRight: 20,
  },
  videoThumbnailWrapper: {
    position: 'relative',
    borderRadius: isTablet ? 12 : 10,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  videoThumbnail: {
    borderRadius: isTablet ? 12 : 10,
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoThumbnailText: {
    fontSize: isTablet ? 13 : 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  // Gallery
  gallerySection: {
    marginBottom: isTablet ? 30 : 25,
  },
  galleryContainer: {
    paddingRight: 10,
  },
  galleryImageContainer: {
    position: 'relative',
    marginRight: isTablet ? 16 : 12,
  },
  galleryImageContainerTablet: {
    marginRight: 20,
  },
  galleryImage: {
    width: isTablet ? 220 : 180,
    height: isTablet ? 160 : 140,
    borderRadius: isTablet ? 12 : 10,
    backgroundColor: "#f0f0f0",
  },
  galleryImageTablet: {
    width: 240,
    height: 180,
  },
  imageNumberBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(147, 33, 10, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});