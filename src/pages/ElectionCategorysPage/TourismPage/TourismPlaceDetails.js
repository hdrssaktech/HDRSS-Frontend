// TourismPlaceDetails.js - Second Page (Updated)
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

// Brand Colors (matching first page)
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

export default function TourismPlaceDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { place } = route.params;
  const { width, height } = useWindowDimensions();
  
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isLargeTablet = width >= 1024;

  const [showMore, setShowMore] = useState(false);

  const responsiveSize = (mobile, tablet, largeTablet) => {
    if (isLargeTablet) return largeTablet || tablet;
    if (isTablet) return tablet;
    return mobile;
  };

  const openPhone = (phone) => Linking.openURL(`tel:${phone}`);
  const openWhatsApp = (whatsapp) =>
    Linking.openURL(`https://wa.me/${whatsapp.replace(/\D/g, "")}`);
  const openLocation = (location) =>
    Linking.openURL(
      `https://maps.google.com/?q=${encodeURIComponent(location)}`
    );

  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:.*v=|v\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = getYoutubeId(place.video);

  const hasPhone = place.phone && place.phone.trim() !== "";
  const hasWhatsApp = place.whatsapp && place.whatsapp.trim() !== "";
  const hasLocation = place.location && place.location.trim() !== "";

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
            {place.title}
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
              uri: place.image
                ? place.image
                : "https://cdn-icons-png.flaticon.com/512/2659/2659360.png",
            }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          <View style={styles.imageOverlay} />

          {place.category && (
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
                {place.category}
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
            {place.title}
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
                    onPress={() => openPhone(place.phone)}
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
                      <FontAwesome 
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
                    onPress={() => openLocation(place.location)}
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
                      <FontAwesome5
                        name="map-marker-alt"
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
                    onPress={() => openWhatsApp(place.whatsapp)}
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
                      <FontAwesome 
                        name="whatsapp" 
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
          {place.about && (
            <View style={[
              styles.section,
              { marginBottom: responsiveSize(22, 28, 34) }
            ]}>
              <Text style={[
                styles.sectionTitle,
                { 
                  fontSize: responsiveSize(18, 21, 24),
                  marginBottom: responsiveSize(12, 16, 20),
                  paddingLeft: responsiveSize(8, 10, 12),
                  borderLeftWidth: responsiveSize(3, 4, 5),
                  borderLeftColor: C.primary,
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
                  borderLeftWidth: 3,
                  borderLeftColor: C.primary,
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
                  {place.about}
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

          {/* Gallery */}
          {place.gallery && place.gallery.length > 0 && (
            <View style={[
              styles.section,
              { marginBottom: responsiveSize(22, 28, 34) }
            ]}>
              <Text style={[
                styles.sectionTitle,
                { 
                  fontSize: responsiveSize(18, 21, 24),
                  marginBottom: responsiveSize(12, 16, 20),
                  paddingLeft: responsiveSize(8, 10, 12),
                  borderLeftWidth: responsiveSize(3, 4, 5),
                  borderLeftColor: C.primary,
                  color: C.primary,
                }
              ]}>
                Gallery ({place.gallery.length})
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.galleryContainer,
                  { paddingRight: responsiveSize(8, 12, 16) }
                ]}
              >
                {place.gallery.map((img, index) => (
                  <View key={index} style={[
                    styles.galleryImageWrapper,
                    { marginRight: responsiveSize(10, 14, 18) }
                  ]}>
                    <Image
                      source={{ uri: img }}
                      style={[
                        styles.galleryImage,
                        { 
                          width: responsiveSize(140, 180, 220),
                          height: responsiveSize(100, 140, 180),
                          borderRadius: responsiveSize(8, 10, 12)
                        }
                      ]}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Video */}
          {place.video && videoId && (
            <View style={[
              styles.section,
              { marginBottom: responsiveSize(22, 28, 34) }
            ]}>
              <Text style={[
                styles.sectionTitle,
                { 
                  fontSize: responsiveSize(18, 21, 24),
                  marginBottom: responsiveSize(12, 16, 20),
                  paddingLeft: responsiveSize(8, 10, 12),
                  borderLeftWidth: responsiveSize(3, 4, 5),
                  borderLeftColor: C.primary,
                  color: C.primary,
                }
              ]}>
                Video
              </Text>
              <View style={[
                styles.videoContainer,
                { 
                  borderRadius: responsiveSize(10, 12, 14),
                  marginBottom: responsiveSize(8, 12, 16),
                  backgroundColor: C.dark,
                }
              ]}>
                <YoutubePlayer
                  height={responsiveSize(200, 280, 340)}
                  play={false}
                  videoId={videoId}
                />
              </View>
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
    backgroundColor: C.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: 'center',
    justifyContent: 'center',
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
    borderLeftColor: C.primary,
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
    borderLeftWidth: 3,
    borderLeftColor: C.primary,
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
  
  // Gallery Section
  galleryContainer: {
    paddingRight: 10,
  },
  galleryImageWrapper: {
    position: 'relative',
  },
  galleryImage: {
    backgroundColor: C.card,
  },
  imageNumberBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageNumberText: {
    fontWeight: 'bold',
  },
  
  // Video Section
  videoContainer: {
    overflow: "hidden",
    elevation: 3,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoNote: {
    textAlign: "center",
    fontStyle: "italic",
  },
});