import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  Dimensions,
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

const { width, height } = Dimensions.get('window');
const isTablet = width >= 608;

export default function TourismPlaceDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { place } = route.params;
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [showMore, setShowMore] = useState(false);

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

  // Check available contact options
  const hasPhone = place.phone && place.phone.trim() !== "";
  const hasWhatsApp = place.whatsapp && place.whatsapp.trim() !== "";
  const hasLocation = place.location && place.location.trim() !== "";

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons 
              name="chevron-back" 
              size={isTablet ? 32 : 28} 
              color="#fff" 
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {place.title}
          </Text>

          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* HERO IMAGE */}
        <View style={styles.imageContainer}>
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
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{place.category}</Text>
            </View>
          )}
        </View>

        {/* CONTENT CARD */}
        <View style={[styles.contentCard, isTablet && styles.contentCardTablet]}>
          {/* TITLE */}
          <Text style={[styles.placeTitle, isTablet && styles.placeTitleTablet]}>
            {place.title}
          </Text>

          {/* QUICK CONTACT ICONS */}
          {(hasPhone || hasWhatsApp || hasLocation) && (
            <View style={styles.contactSection}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                Quick Contact
              </Text>
              
              <View style={styles.contactRow}>
                {/* Phone */}
                {hasPhone && (
                  <TouchableOpacity
                    style={[styles.contactIconBox, isTablet && styles.contactIconBoxTablet]}
                    onPress={() => openPhone(place.phone)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconCircle, styles.phoneIconBg]}>
                      <FontAwesome name="phone" size={isTablet ? 24 : 20} color="#fff" />
                    </View>
                    <Text style={[styles.contactLabel, isTablet && styles.contactLabelTablet]}>
                      Call
                    </Text>
                    {place.phone && (
                      <Text style={[styles.contactValue, isTablet && styles.contactValueTablet]}>
                        {place.phone}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                {/* Location */}
                {hasLocation && (
                  <TouchableOpacity
                    style={[styles.contactIconBox, isTablet && styles.contactIconBoxTablet]}
                    onPress={() => openLocation(place.location)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconCircle, styles.locationIconBg]}>
                      <FontAwesome5
                        name="map-marker-alt"
                        size={isTablet ? 24 : 20}
                        color="#fff"
                      />
                    </View>
                    <Text style={[styles.contactLabel, isTablet && styles.contactLabelTablet]}>
                      Map
                    </Text>
                    <Text 
                      style={[styles.contactValue, isTablet && styles.contactValueTablet]}
                      numberOfLines={1}
                    >
                      View Map
                    </Text>
                  </TouchableOpacity>
                )}

                {/* WhatsApp */}
                {hasWhatsApp && (
                  <TouchableOpacity
                    style={[styles.contactIconBox, isTablet && styles.contactIconBoxTablet]}
                    onPress={() => openWhatsApp(place.whatsapp)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconCircle, styles.whatsappIconBg]}>
                      <FontAwesome name="whatsapp" size={isTablet ? 24 : 20} color="#fff" />
                    </View>
                    <Text style={[styles.contactLabel, isTablet && styles.contactLabelTablet]}>
                      WhatsApp
                    </Text>
                    {place.whatsapp && (
                      <Text style={[styles.contactValue, isTablet && styles.contactValueTablet]}>
                        {place.whatsapp}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* DESCRIPTION */}
          {place.about && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                About
              </Text>
              <View style={styles.descriptionCard}>
                <Text
                  style={[styles.description, isTablet && styles.descriptionTablet]}
                  numberOfLines={showMore ? undefined : 6}
                >
                  {place.about}
                </Text>

                <TouchableOpacity
                  style={styles.readMoreBtn}
                  onPress={() => setShowMore(!showMore)}
                >
                  <Text style={[styles.readMoreText, isTablet && styles.readMoreTextTablet]}>
                    {showMore ? "Read Less" : "Read More"}
                  </Text>
                  <Ionicons 
                    name={showMore ? "chevron-up" : "chevron-down"} 
                    size={isTablet ? 18 : 16} 
                    color="#93210A" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* GALLERY */}
          {place.gallery && place.gallery.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                Gallery ({place.gallery.length})
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryContainer}
              >
                {place.gallery.map((img, index) => (
                  <View key={index} style={styles.galleryImageWrapper}>
                    <Image
                      source={{ uri: img }}
                      style={[styles.galleryImage, isTablet && styles.galleryImageTablet]}
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

          {/* VIDEO */}
          {place.video && videoId && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                Video
              </Text>
              <View style={[styles.videoContainer, isTablet && styles.videoContainerTablet]}>
                <YoutubePlayer
                  height={isTablet ? 340 : 220}
                  play={false}
                  videoId={videoId}
                />
                <View style={styles.videoInfo}>
                  <Text style={[styles.videoNote, isTablet && styles.videoNoteTablet]}>
                    Tap to play video
                  </Text>
                  <Ionicons name="play-circle-outline" size={isTablet ? 20 : 16} color="#666" />
                </View>
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
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
  headerRightPlaceholder: {
    width: isTablet ? 40 : 34,
  },
  // Image Container
  imageContainer: {
    position: 'relative',
    height: isTablet ? 350 : 280,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: "rgba(147, 33, 10, 0.9)",
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  categoryText: {
    color: "#fff",
    fontSize: isTablet ? 14 : 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Content Card
  contentCard: {
    backgroundColor: "#fff",
    borderRadius: isTablet ? 25 : 20,
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
  placeTitle: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: isTablet ? 25 : 20,
    textAlign: "center",
    lineHeight: isTablet ? 36 : 28,
    letterSpacing: 0.3,
  },
  placeTitleTablet: {
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
  // Contact Section
  contactSection: {
    marginBottom: isTablet ? 30 : 25,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: isTablet ? 'nowrap' : 'nowrap',
    gap: isTablet ? 20 : 15,
    marginTop: isTablet ? 15 : 10,
  },
  contactIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: isTablet ? 16 : 14,
    padding: isTablet ? 18 :10,
    minWidth: isTablet ? 140 :70,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  contactIconBoxTablet: {
    minWidth: 160,
    padding: 20,
  },
  iconCircle: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: isTablet ? 30 : 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isTablet ? 12 : 10,
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
    backgroundColor: "#2346a5",
  },
  contactLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: isTablet ? 4 : 2,
    textAlign: 'center',
  },
  contactLabelTablet: {
    fontSize: 17,
  },
  contactValue: {
    fontSize: isTablet ? 13 : 12,
    color: "#666",
    textAlign: 'center',
    marginTop: isTablet ? 4 : 2,
    fontStyle: 'italic',
  },
  contactValueTablet: {
    fontSize: 14,
  },
  // Description Section
  section: {
    marginBottom: isTablet ? 30 : 25,
  },
  descriptionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: isTablet ? 12 : 10,
    padding: isTablet ? 20 : 15,
    borderLeftWidth: 3,
    borderLeftColor: "#93210A",
  },
  description: {
    fontSize: isTablet ? 17 : 16,
    lineHeight: isTablet ? 28 : 24,
    color: "#555",
    textAlign: "justify",
    letterSpacing: 0.2,
  },
  descriptionTablet: {
    fontSize: 18,
    lineHeight: 30,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: isTablet ? 12 : 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  readMoreText: {
    color: "#93210A",
    fontWeight: "700",
    fontSize: isTablet ? 16 : 14,
    marginRight: 6,
  },
  readMoreTextTablet: {
    fontSize: 17,
  },
  // Gallery Section
  galleryContainer: {
    paddingRight: 10,
  },
  galleryImageWrapper: {
    position: 'relative',
    marginRight: isTablet ? 16 : 12,
  },
  galleryImage: {
    width: isTablet ? 200 : 160,
    height: isTablet ? 150 : 120,
    borderRadius: isTablet ? 12 : 10,
    backgroundColor: "#eee",
  },
  galleryImageTablet: {
    width: 220,
    height: 170,
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
  // Video Section
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
  // Additional Info Section
  additionalInfoSection: {
    marginTop: isTablet ? 25 : 20,
    paddingTop: isTablet ? 25 : 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  infoGrid: {
    gap: isTablet ? 18 : 15,
  },
  infoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: isTablet ? 12 : 10,
    padding: isTablet ? 18 : 15,
    borderLeftWidth: isTablet ? 4 : 3,
    borderLeftColor: "#93210A",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoCardTablet: {
    padding: 20,
  },
  infoTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "600",
    color: "#93210A",
    marginBottom: isTablet ? 8 : 6,
    letterSpacing: 0.3,
  },
  infoTitleTablet: {
    fontSize: 19,
  },
  infoText: {
    fontSize: isTablet ? 16 : 15,
    lineHeight: isTablet ? 26 : 22,
    color: "#555",
    letterSpacing: 0.2,
  },
  infoTextTablet: {
    fontSize: 17,
    lineHeight: 28,
  },
});