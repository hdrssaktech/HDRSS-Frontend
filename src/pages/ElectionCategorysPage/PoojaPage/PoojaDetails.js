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
const isLargeTablet = width >= 1024;

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

  // Responsive size helper
  const responsiveSize = (mobile, tablet, largeTablet) => {
    if (isLargeTablet) return largeTablet || tablet;
    return isTablet ? tablet : mobile;
  };

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet, isLargeTablet && styles.headerLargeTablet]}>
        <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>
        
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} numberOfLines={1}>
          Pooja Details
        </Text>
        
        <View style={[styles.headerRight, isTablet && styles.headerRightTablet]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
          isLargeTablet && styles.scrollContentLargeTablet
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Image */}
        {poojaItem.bannerimg && (
          <View style={styles.bannerContainer}>
            <Image 
              source={{ uri: poojaItem.bannerimg }} 
              style={[
                styles.bannerImage,
                isTablet && styles.bannerImageTablet,
                isLargeTablet && styles.bannerImageLargeTablet
              ]}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay} />
          </View>
        )}

        <View style={[
          styles.contentCard,
          isTablet && styles.contentCardTablet,
          isLargeTablet && styles.contentCardLargeTablet
        ]}>
          {/* Title */}
          <Text style={[
            styles.title, 
            isTablet && styles.titleTablet,
            isLargeTablet && styles.titleLargeTablet
          ]}>
            {poojaItem.title}
          </Text>

          {/* Contact Information - Horizontal Icon Row */}
          {(hasPhone || hasWhatsApp || hasLocation) && (
            <View style={[
              styles.contactSection,
              isTablet && styles.contactSectionTablet
            ]}>
              
              <View style={[
                styles.contactRow,
                isTablet && styles.contactRowTablet,
                isLargeTablet && styles.contactRowLargeTablet
              ]}>
                {/* Phone Icon */}
                {hasPhone && (
                  <TouchableOpacity
                    style={[
                      styles.contactIconWrapper,
                      isTablet && styles.contactIconWrapperTablet
                    ]}
                    onPress={() => handlePhoneCall(poojaItem.Phone)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.iconCircle, 
                      styles.phoneIconBg,
                      isTablet && styles.iconCircleTablet
                    ]}>
                      <Icon name="phone" size={responsiveSize(22, 26, 30)} color="#fff" />
                    </View>
                    <Text style={[
                      styles.iconLabel, 
                      isTablet && styles.iconLabelTablet
                    ]}>
                      Call
                    </Text>
                  </TouchableOpacity>
                )}

                {/* WhatsApp Icon */}
                {hasWhatsApp && (
                  <TouchableOpacity
                    style={[
                      styles.contactIconWrapper,
                      isTablet && styles.contactIconWrapperTablet
                    ]}
                    onPress={() => handleWhatsApp(poojaItem.whatshapp)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.iconCircle, 
                      styles.whatsappIconBg,
                      isTablet && styles.iconCircleTablet
                    ]}>
                      <Ionicons name="logo-whatsapp" size={responsiveSize(22, 26, 30)} color="#fff" />
                    </View>
                    <Text style={[
                      styles.iconLabel, 
                      isTablet && styles.iconLabelTablet
                    ]}>
                      WhatsApp
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Location Icon */}
                {hasLocation && (
                  <TouchableOpacity
                    style={[
                      styles.contactIconWrapper,
                      isTablet && styles.contactIconWrapperTablet
                    ]}
                    onPress={() => handleLocation(poojaItem.location)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.iconCircle, 
                      styles.locationIconBg,
                      isTablet && styles.iconCircleTablet
                    ]}>
                      <Icon name="location-on" size={responsiveSize(22, 26, 30)} color="#fff" />
                    </View>
                    <Text style={[
                      styles.iconLabel, 
                      isTablet && styles.iconLabelTablet
                    ]}>
                      Location
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* About Section */}
          {poojaItem.about && (
            <View style={[
              styles.section,
              isTablet && styles.sectionTablet
            ]}>
              <Text style={[
                styles.sectionTitle, 
                isTablet && styles.sectionTitleTablet,
                isLargeTablet && styles.sectionTitleLargeTablet
              ]}>
                About
              </Text>
              <View style={[
                styles.aboutCard,
                isTablet && styles.aboutCardTablet
              ]}>
                <Text 
                  style={[
                    styles.aboutText, 
                    isTablet && styles.aboutTextTablet,
                    isLargeTablet && styles.aboutTextLargeTablet
                  ]} 
                  numberOfLines={showItem ? undefined : 5}
                >
                  {poojaItem.about}
                </Text>
                <TouchableOpacity onPress={() => setShowitem(!showItem)}>
                  <Text style={[
                    styles.readMoreText, 
                    isTablet && styles.readMoreTextTablet
                  ]}>
                    {showItem ? 'Read Less...' : 'Read More...'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Video Section */}
          {firstYoutubeVideo && (
            <View style={[
              styles.videoSection,
              isTablet && styles.videoSectionTablet
            ]}>
              <Text style={[
                styles.sectionTitle, 
                isTablet && styles.sectionTitleTablet,
                isLargeTablet && styles.sectionTitleLargeTablet
              ]}>
                Video
              </Text>
              <View style={[
                styles.videoContainer,
                isTablet && styles.videoContainerTablet,
                isLargeTablet && styles.videoContainerLargeTablet
              ]}>
                <YoutubePlayer
                  height={responsiveSize(220, 280, 350)}
                  videoId={firstYoutubeVideo.id}
                  play={false}
                  webViewStyle={styles.youtubePlayer}
                />
                <View style={[
                  styles.videoInfo,
                  isTablet && styles.videoInfoTablet
                ]}>
                  <Text style={[
                    styles.videoNote, 
                    isTablet && styles.videoNoteTablet
                  ]}>
                    Tap to play video
                  </Text>
                  <Icon name="play-circle-outline" size={responsiveSize(16, 20, 24)} color="#666" />
                </View>
              </View>
            </View>
          )}

          {/* Additional Videos */}
          {hasVideos && poojaItem.videos.length > 1 && (
            <View style={[
              styles.multipleVideosSection,
              isTablet && styles.multipleVideosSectionTablet
            ]}>
              <Text style={[
                styles.sectionTitle, 
                isTablet && styles.sectionTitleTablet,
                isLargeTablet && styles.sectionTitleLargeTablet
              ]}>
                More Videos
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.videosContainer,
                  isTablet && styles.videosContainerTablet
                ]}
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
                      <View style={[
                        styles.videoThumbnailWrapper,
                        isTablet && styles.videoThumbnailWrapperTablet
                      ]}>
                        <YoutubePlayer
                          height={responsiveSize(120, 150, 180)}
                          width={responsiveSize(180, 220, 260)}
                          videoId={videoId}
                          play={false}
                          webViewStyle={styles.videoThumbnail}
                        />
                        <View style={styles.playIconOverlay}>
                          <Icon name="play-circle-filled" size={responsiveSize(32, 40, 48)} color="rgba(255,255,255,0.9)" />
                        </View>
                      </View>
                      <Text style={[
                        styles.videoThumbnailText,
                        isTablet && styles.videoThumbnailTextTablet
                      ]}>
                        Video {index + 2}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Gallery */}
          {poojaItem.gallery && Array.isArray(poojaItem.gallery) && poojaItem.gallery.length > 0 && (
            <View style={[
              styles.gallerySection,
              isTablet && styles.gallerySectionTablet
            ]}>
              <Text style={[
                styles.sectionTitle, 
                isTablet && styles.sectionTitleTablet,
                isLargeTablet && styles.sectionTitleLargeTablet
              ]}>
                Gallery
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.galleryContainer,
                  isTablet && styles.galleryContainerTablet
                ]}
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
                        isTablet && styles.galleryImageTablet,
                        isLargeTablet && styles.galleryImageLargeTablet
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop:40,
    paddingBottom:30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingTop:45,
    paddingBottom:28,
    paddingHorizontal: 18,
  },
  headerLargeTablet: {
    paddingTop: StatusBar.currentHeight + 25,
    paddingBottom: 25,
    paddingHorizontal: 32,
  },
  backButton:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  backButtonTablet:{
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  headerRight: {
    width: 34,
  },
  headerRightTablet: {
    width: 44,
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  scrollContentTablet: {
    paddingBottom: 40,
  },
  scrollContentLargeTablet: {
    paddingBottom: 50,
  },
  
  // Banner
  bannerContainer: {
    position: 'relative',
  },
  bannerImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  bannerImageTablet: {
    height: 280,
  },
  bannerImageLargeTablet: {
    height: 350,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  
  // Content Card
  contentCard: {
    backgroundColor: "white",
    borderRadius: 15,
    margin: 15,
    marginTop: -30,
    padding: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  contentCardTablet: {
    borderRadius: 20,
    margin: 20,
    marginTop: -40,
    padding: 25,
    paddingHorizontal: 30,
  },
  contentCardLargeTablet: {
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Title
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: 0.3,
  },
  titleTablet: {
    fontSize: 28,
    marginBottom: 25,
    lineHeight: 36,
  },
  titleLargeTablet: {
    fontSize: 32,
    marginBottom: 30,
  },
  
  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 12,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#93210A",
  },
  sectionTitleTablet: {
    fontSize: 22,
    marginBottom: 16,
    paddingLeft: 15,
    borderLeftWidth: 5,
  },
  sectionTitleLargeTablet: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTablet: {
    marginBottom: 30,
  },
  
  // Contact Section - Horizontal Icons
  contactSection: {
    marginBottom: 25,
    alignItems: 'center',
  },
  contactSectionTablet: {
    marginBottom: 30,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 20,
    marginTop: 8,
  },
  contactRowTablet: {
    gap: 30,
    marginTop: 10,
  },
  contactRowLargeTablet: {
    gap: 40,
  },
  contactIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    minWidth: 70,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  contactIconWrapperTablet: {
    minWidth: 90,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconCircleTablet: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
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
    fontSize: 12,
    color: "#333",
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLabelTablet: {
    fontSize: 14,
  },
  
  // About Section
  aboutCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#93210A",
  },
  aboutCardTablet: {
    borderRadius: 12,
    padding: 20,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    textAlign: "justify",
    letterSpacing: 0.2,
  },
  aboutTextTablet: {
    fontSize: 17,
    lineHeight: 26,
  },
  aboutTextLargeTablet: {
    fontSize: 18,
    lineHeight: 28,
  },
  readMoreText: {
    color: '#93210A',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'flex-end',
  },
  readMoreTextTablet: {
    fontSize: 16,
    marginTop: 12,
  },
  
  // Video Section
  videoSection: {
    marginBottom: 25,
  },
  videoSectionTablet: {
    marginBottom: 30,
  },
  videoContainer: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  videoContainerTablet: {
    borderRadius: 15,
    marginBottom: 15,
  },
  videoContainerLargeTablet: {
    borderRadius: 18,
  },
  youtubePlayer: {
    borderRadius: 10,
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#f8f8f8',
  },
  videoInfoTablet: {
    padding: 12,
  },
  videoNote: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginRight: 8,
  },
  videoNoteTablet: {
    fontSize: 14,
  },
  
  // Multiple Videos
  multipleVideosSection: {
    marginBottom: 25,
  },
  multipleVideosSectionTablet: {
    marginBottom: 30,
  },
  videosContainer: {
    paddingRight: 10,
  },
  videosContainerTablet: {
    paddingRight: 15,
  },
  videoThumbnailContainer: {
    marginRight: 12,
  },
  videoThumbnailContainerTablet: {
    marginRight: 16,
  },
  videoThumbnailWrapper: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  videoThumbnailWrapperTablet: {
    borderRadius: 12,
  },
  videoThumbnail: {
    borderRadius: 10,
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoThumbnailText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  videoThumbnailTextTablet: {
    fontSize: 13,
    marginTop: 6,
  },
  
  // Gallery
  gallerySection: {
    marginBottom: 25,
  },
  gallerySectionTablet: {
    marginBottom: 30,
  },
  galleryContainer: {
    paddingRight: 10,
  },
  galleryContainerTablet: {
    paddingRight: 15,
  },
  galleryImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  galleryImageContainerTablet: {
    marginRight: 16,
  },
  galleryImage: {
    width: 150,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  galleryImageTablet: {
    width: 200,
    height: 160,
    borderRadius: 12,
  },
  galleryImageLargeTablet: {
    width: 240,
    height: 180,
    borderRadius: 15,
  },
  imageNumberBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(147, 33, 10, 0.9)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageNumberText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});