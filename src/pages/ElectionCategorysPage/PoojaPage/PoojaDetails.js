import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import YoutubePlayer from "react-native-youtube-iframe";

// Brand Colors
const C = {
  primary: "#93210A",
  dark: "#301913",
  gold: "#D4AF37",
  bg: "#d4cea6",
  card: "#ede8d5",
  white: "#FFFFFF",
  text: "#1a0a00",
  textMid: "#5a3a2a",
  border: "rgba(48,25,19,0.25)",
  shadow: "#301913",
};

export default function PoojaDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { poojaItem } = route.params;
  const { width } = useWindowDimensions();
  
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;

  const [showMore, setShowMore] = useState(false);

  // Responsive size helper
  const responsiveSize = (mobile, tablet, largeTablet) => {
    if (isLargeTablet) return largeTablet || tablet;
    if (isTablet) return tablet;
    return mobile;
  };

  const handlePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleWhatsApp = (whatsappNumber) => {
    if (whatsappNumber) {
      Linking.openURL(`whatsapp://send?phone=${whatsappNumber}`);
    }
  };

  const handleLocation = (location) => {
    if (location) {
      const encodedLocation = encodeURIComponent(location);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
    }
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

  // Calculate square image size
  const getSquareSize = () => {
    if (isLargeTablet) return 180;
    if (isTablet) return 150;
    return 120;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={C.primary} barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: responsiveSize(30, 40, 50) }
        ]}
      >
        {/* Header */}
        <View style={[
          styles.header,
          isTablet && styles.headerTablet,
          isLargeTablet && styles.headerLargeTablet
        ]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={[
              styles.backButton,
              isTablet && styles.backButtonTablet
            ]}
          >
            <Ionicons 
              name="chevron-back" 
              size={responsiveSize(24, 28, 32)} 
              color={C.white} 
            />
          </TouchableOpacity>

          <Text style={[
            styles.headerTitle,
            isTablet && styles.headerTitleTablet
          ]} numberOfLines={1}>
           கோவில் விவரங்கள்
          </Text>

          <View style={[
            styles.headerRightPlaceholder,
            isTablet && styles.headerRightPlaceholderTablet
          ]} />
        </View>

        {/* Hero Image */}
        <View style={[
          styles.imageContainer,
          { height: responsiveSize(250, 300, 350) }
        ]}>
          <Image
            source={{
              uri: poojaItem.bannerimg || poojaItem.image || "https://cdn-icons-png.flaticon.com/512/2659/2659360.png",
            }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          <View style={styles.imageOverlay} />

          {poojaItem.title && (
            <View style={[
              styles.categoryBadge,
              { 
                top: responsiveSize(12, 15, 18),
                right: responsiveSize(12, 15, 18),
                paddingHorizontal: responsiveSize(10, 14, 18),
                paddingVertical: responsiveSize(5, 7, 9),
              }
            ]}>
              <Text style={[
                styles.categoryText,
                { fontSize: responsiveSize(11, 13, 15) }
              ]}>
                Pooja
              </Text>
            </View>
          )}
        </View>

        {/* Content Card */}
        <View style={[
          styles.contentCard,
          { 
            margin: responsiveSize(12, 18, 24),
            marginTop: responsiveSize(-25, -35, -45),
            padding: responsiveSize(16, 22, 28),
            borderRadius: responsiveSize(18, 22, 26)
          }
        ]}>
          {/* Title */}
          <Text style={[
            styles.placeTitle,
            { 
              fontSize: responsiveSize(22, 28, 32),
              marginBottom: responsiveSize(18, 24, 30),
              lineHeight: responsiveSize(28, 36, 42)
            }
          ]}>
            {poojaItem.title}
          </Text>

          {/* Quick Contact Icons */}
          {(hasPhone || hasWhatsApp || hasLocation) && (
            <View style={[
              styles.contactSection,
              { marginBottom: responsiveSize(22, 28, 34) }
            ]}>
              
              <View style={[
                styles.contactRow,
                { 
                  gap: responsiveSize(12, 18, 24),
                  marginTop: responsiveSize(8, 12, 16)
                }
              ]}>
                {/* Phone */}
                {hasPhone && (
                  <TouchableOpacity
                    style={[
                      styles.contactIconBox,
                      { 
                        borderRadius: responsiveSize(12, 14, 16),
                        padding: responsiveSize(8, 12, 16),
                        minWidth: responsiveSize(80, 110, 140),
                        backgroundColor: C.card,
                        borderColor: C.border,
                      }
                    ]}
                    onPress={() => handlePhoneCall(poojaItem.Phone)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.iconCircle, 
                      styles.phoneIconBg,
                      { 
                        width: responsiveSize(45, 55, 65),
                        height: responsiveSize(45, 55, 65),
                        borderRadius: responsiveSize(22, 27, 32),
                        marginBottom: responsiveSize(6, 8, 10)
                      }
                    ]}>
                      <Icon 
                        name="phone" 
                        size={responsiveSize(18, 22, 26)} 
                        color={C.white} 
                      />
                    </View>
                    <Text style={[
                      styles.contactLabel,
                      { fontSize: responsiveSize(12, 14, 16), color: C.dark }
                    ]}>
                      Call
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Location */}
                {hasLocation && (
                  <TouchableOpacity
                    style={[
                      styles.contactIconBox,
                      { 
                        borderRadius: responsiveSize(12, 14, 16),
                        padding: responsiveSize(8, 12, 16),
                        minWidth: responsiveSize(80, 110, 140),
                        backgroundColor: C.card,
                        borderColor: C.border,
                      }
                    ]}
                    onPress={() => handleLocation(poojaItem.location)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.iconCircle, 
                      styles.locationIconBg,
                      { 
                        width: responsiveSize(45, 55, 65),
                        height: responsiveSize(45, 55, 65),
                        borderRadius: responsiveSize(22, 27, 32),
                        marginBottom: responsiveSize(6, 8, 10)
                      }
                    ]}>
                      <Icon
                        name="location-on"
                        size={responsiveSize(18, 22, 26)}
                        color={C.white}
                      />
                    </View>
                    <Text style={[
                      styles.contactLabel,
                      { fontSize: responsiveSize(12, 14, 16), color: C.dark }
                    ]}>
                      Map
                    </Text>
                  </TouchableOpacity>
                )}

                {/* WhatsApp */}
                {hasWhatsApp && (
                  <TouchableOpacity
                    style={[
                      styles.contactIconBox,
                      { 
                        borderRadius: responsiveSize(12, 14, 16),
                        padding: responsiveSize(8, 12, 16),
                        minWidth: responsiveSize(80, 110, 140),
                        backgroundColor: C.card,
                        borderColor: C.border,
                      }
                    ]}
                    onPress={() => handleWhatsApp(poojaItem.whatshapp)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.iconCircle, 
                      styles.whatsappIconBg,
                      { 
                        width: responsiveSize(45, 55, 65),
                        height: responsiveSize(45, 55, 65),
                        borderRadius: responsiveSize(22, 27, 32),
                        marginBottom: responsiveSize(6, 8, 10)
                      }
                    ]}>
                      <Ionicons 
                        name="logo-whatsapp" 
                        size={responsiveSize(18, 22, 26)} 
                        color={C.white} 
                      />
                    </View>
                    <Text style={[
                      styles.contactLabel,
                      { fontSize: responsiveSize(12, 14, 16), color: C.dark }
                    ]}>
                      WhatsApp
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Description */}
          {poojaItem.about && (
            <View style={[
              styles.section,
              { marginBottom: responsiveSize(22, 28, 34) }
            ]}>
              <Text style={[
                styles.sectionTitle,
                { 
                  fontSize: responsiveSize(18, 21, 24),
                  marginBottom: responsiveSize(12, 16, 20),
                  color: C.primary,
                }
              ]}>
                About
              </Text>
              <View style={[
                styles.descriptionCard,
                { 
                  borderRadius: responsiveSize(10, 12, 14),
                  padding: responsiveSize(14, 18, 22),
                  backgroundColor: C.card,
                }
              ]}>
                <Text
                  style={[
                    styles.description,
                    { 
                      fontSize: responsiveSize(15, 17, 19),
                      lineHeight: responsiveSize(22, 26, 30),
                      color: C.text,
                    }
                  ]}
                  numberOfLines={showMore ? undefined : 6}
                >
                  {poojaItem.about}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.readMoreBtn,
                    { marginTop: responsiveSize(8, 10, 12) }
                  ]}
                  onPress={() => setShowMore(!showMore)}
                >
                  <Text style={[
                    styles.readMoreText,
                    { 
                      fontSize: responsiveSize(13, 15, 17),
                      marginRight: responsiveSize(4, 6, 8),
                      color: C.primary,
                    }
                  ]}>
                    {showMore ? "Read Less" : "Read More"}
                  </Text>
                  <Ionicons 
                    name={showMore ? "chevron-up" : "chevron-down"} 
                    size={responsiveSize(14, 16, 18)} 
                    color={C.primary} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Gallery - Square images */}
          {poojaItem.gallery && Array.isArray(poojaItem.gallery) && poojaItem.gallery.length > 0 && (
            <View style={[
              styles.section,
              { marginBottom: responsiveSize(22, 28, 34) }
            ]}>
              <Text style={[
                styles.sectionTitle,
                { 
                  fontSize: responsiveSize(18, 21, 24),
                  marginBottom: responsiveSize(12, 16, 20),
                  color: C.primary,
                }
              ]}>
                Gallery
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.galleryContainer,
                  { paddingRight: responsiveSize(8, 12, 16) }
                ]}
              >
                {poojaItem.gallery.map((img, index) => {
                  const squareSize = getSquareSize();
                  return (
                    <View key={index} style={[
                      styles.galleryImageWrapper,
                      { marginRight: responsiveSize(10, 14, 18) }
                    ]}>
                      <Image
                        source={{ uri: img }}
                        style={[
                          styles.galleryImage,
                          { 
                            width: squareSize,
                            height: squareSize,
                            borderRadius: responsiveSize(8, 10, 12)
                          }
                        ]}
                        resizeMode="cover"
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Video Section - No background color */}
          {firstYoutubeVideo && (
            <View style={[
              styles.section,
              { marginBottom: responsiveSize(22, 28, 34) }
            ]}>
              <Text style={[
                styles.sectionTitle,
                { 
                  fontSize: responsiveSize(18, 21, 24),
                  marginBottom: responsiveSize(12, 16, 20),
                  color: C.primary,
                }
              ]}>
                Video
              </Text>
              <View style={[
                styles.videoContainer,
                { 
                  borderRadius: responsiveSize(10, 12, 14),
                  overflow: 'hidden',
                }
              ]}>
                <YoutubePlayer
                  height={responsiveSize(200, 280, 340)}
                  play={false}
                  videoId={firstYoutubeVideo.id}
                />
              </View>
            </View>
          )}

          {/* Additional Videos - No background color */}
          {hasVideos && poojaItem.videos.length > 1 && (
            <View style={[
              styles.section,
              { marginBottom: responsiveSize(22, 28, 34) }
            ]}>
              <Text style={[
                styles.sectionTitle,
                { 
                  fontSize: responsiveSize(18, 21, 24),
                  marginBottom: responsiveSize(12, 16, 20),
                  color: C.primary,
                }
              ]}>
                More Videos
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.videosContainer,
                  { paddingRight: responsiveSize(8, 12, 16) }
                ]}
              >
                {poojaItem.videos.slice(1).map((video, index) => {
                  const videoId = getYouTubeId(video);
                  if (!videoId) return null;
                  
                  const videoSize = getSquareSize();
                  
                  return (
                    <TouchableOpacity
                      key={index} 
                      style={[
                        styles.videoThumbnailContainer,
                        { marginRight: responsiveSize(10, 14, 18) }
                      ]}
                      onPress={() => {
                        Linking.openURL(video);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={[
                        styles.videoThumbnailWrapper,
                        { 
                          borderRadius: responsiveSize(8, 10, 12),
                          width: videoSize,
                          height: videoSize,
                          overflow: 'hidden',
                        }
                      ]}>
                        <YoutubePlayer
                          height={videoSize}
                          width={videoSize}
                          videoId={videoId}
                          play={false}
                        />
                        <View style={styles.playIconOverlay}>
                          <Icon name="play-circle-filled" size={responsiveSize(32, 40, 48)} color="rgba(255,255,255,0.9)" />
                        </View>
                      </View>
                      <Text style={[
                        styles.videoThumbnailText,
                        { 
                          fontSize: responsiveSize(10, 12, 14),
                          marginTop: responsiveSize(4, 6, 8),
                          color: C.textMid
                        }
                      ]}>
                        Video {index + 2}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
    backgroundColor: C.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  
  // Header Styles
  header: {
     flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingTop: StatusBar.currentHeight + 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerLargeTablet: {
    paddingTop: StatusBar.currentHeight + 25,
    paddingBottom: 24,
    paddingHorizontal: 32,
  },
  backButton: {
     width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  backButtonTablet: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerTitle: {
    color: C.white,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
    letterSpacing: 0.5,
    fontSize: 18,
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  headerRightPlaceholder: {
    width: 34,
  },
  headerRightPlaceholderTablet: {
    width: 44,
  },
  
  // Image Container
  imageContainer: {
    position: 'relative',
    width: "100%",
    backgroundColor: C.dark,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  categoryBadge: {
    position: 'absolute',
    backgroundColor: C.primary,
    borderRadius: 20,
    elevation: 3,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  categoryText: {
    color: C.white,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  
  // Content Card
  contentCard: {
    backgroundColor: C.white,
    elevation: 4,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  placeTitle: {
    fontWeight: "bold",
    color: C.dark,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  
  // Section Title
  sectionTitle: {
    fontWeight: "bold",
  },
  
  // Contact Section
  contactSection: {
    width: '100%',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    flexWrap: 'wrap',
  },
  contactIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  phoneIconBg: {
    backgroundColor: C.primary,
  },
  whatsappIconBg: {
    backgroundColor: "#25D366",
  },
  locationIconBg: {
    backgroundColor: "#2346a5",
  },
  contactLabel: {
    fontWeight: "700",
    textAlign: 'center',
  },
  contactValue: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Description Section
  section: {
    width: '100%',
  },
  descriptionCard: {
    backgroundColor: C.card,
  },
  description: {
    textAlign: "justify",
    letterSpacing: 0.2,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  readMoreText: {
    fontWeight: "700",
  },
  
  // Gallery Section - Square images
  galleryContainer: {
    paddingRight: 10,
  },
  galleryImageWrapper: {
    position: 'relative',
  },
  galleryImage: {
    backgroundColor: C.card,
  },
  
  // Video Section - No background color
  videoContainer: {
    overflow: "hidden",
  },
  
  // Multiple Videos - No background color
  videosContainer: {
    paddingRight: 10,
  },
  videoThumbnailContainer: {
    position: 'relative',
  },
  videoThumbnailWrapper: {
    overflow: 'hidden',
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoThumbnailText: {
    textAlign: 'center',
    fontWeight: '500',
  },
});