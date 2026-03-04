import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import Loader from "../../../components/Alert/Loader";

export default function AstrologyPage3({ route }) {
  const navigation = useNavigation();
  const { astrologyItem } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [apiData, setApiData] = useState(null);
  const [monthsData, setMonthsData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedMonthData, setSelectedMonthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);

  const allMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/astrology/${astrologyItem.id}/month`
        );
        const data = await response.json();
        
        setApiData(data);
        const months = data.months || [];
        setMonthsData(months);
        
        const defaultMonthData = months.find(month => 
          month.month?.toLowerCase() === "january"
        ) || months[0];
        
        setSelectedMonthData(defaultMonthData);
        
      } catch (error) {
        console.error("Error fetching months:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMonths();
  }, [astrologyItem.id]);

  const handleMonthSelect = (monthName) => {
    const monthData = monthsData.find(month => 
      month.month?.toLowerCase() === monthName.toLowerCase()
    );
    
    if (monthData) {
      setSelectedMonth(monthName);
      setSelectedMonthData(monthData);
    }
  };

  const monthHasData = (monthName) => {
    return monthsData.some(month => 
      month.month?.toLowerCase() === monthName.toLowerCase()
    );
  };

  const getYouTubeId = (url) =>
    url?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];

  const displayItem = apiData?.astrologyDetail || astrologyItem;

  // Function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const DESCRIPTION_MAX_LENGTH = 200;
  const ABOUT_MAX_LENGTH = 200;

  // Header opacity animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* FLOATING HEADER */}
      <Animated.View 
        style={[
          styles.header, 
          isTablet && styles.headerTablet,
          { backgroundColor: headerOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', '#93210A']
          })}
        ]}
      >
      <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>

        <Animated.Text 
          style={[
            styles.headerTitle, 
            isTablet && styles.headerTitleTablet,
            { opacity: headerOpacity }
          ]}
        >
          {displayItem.name}
        </Animated.Text>
      </Animated.View>

      <Animated.ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* HERO IMAGE WITH GRADIENT OVERLAY */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: displayItem.image }}
            style={[styles.heroImage, isTablet && styles.heroImageTablet]}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroTextContainer}>
            <Text style={[styles.heroTitle, isTablet && styles.heroTitleTablet]}>
              {displayItem.name}
            </Text>
            <Text style={[styles.heroSubtitle, isTablet && styles.heroSubtitleTablet]}>
              {displayItem.title}
            </Text>
          </View>
        </View>

        {/* DESCRIPTION CARD */}
        {displayItem.description && (
          <View style={[styles.card, styles.descriptionCard]}>
            <View style={styles.cardHeader}>
              <Icon name="auto-stories" size={24} color="#93210A" />
              <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]}>
                Overview
              </Text>
            </View>
            <Text style={[styles.description, isTablet && styles.descriptionTablet]}>
              {showFullDescription 
                ? displayItem.description 
                : truncateText(displayItem.description, DESCRIPTION_MAX_LENGTH)
              }
            </Text>
            {displayItem.description.length > DESCRIPTION_MAX_LENGTH && (
              <TouchableOpacity 
                onPress={() => setShowFullDescription(!showFullDescription)}
                style={styles.readMoreButton}
              >
                <Text style={styles.readMoreText}>
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </Text>
                <Icon 
                  name={showFullDescription ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={18} 
                  color="#93210A" 
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* MONTH SELECTOR CARD */}
        <View style={[styles.card, styles.monthSelectorCard]}>
          <View style={styles.cardHeader}>
            <Icon name="calendar-today" size={24} color="#93210A" />
            <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]}>
              Monthly Insights
            </Text>
          </View>
          
          {loading ? (
            <Loader/>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthScrollContainer}
            >
              {allMonths.map((monthName, index) => {
                const hasData = monthHasData(monthName);
                const isSelected = selectedMonth === monthName;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.monthChip,
                      isSelected && styles.monthChipSelected,
                      !hasData && styles.monthChipDisabled
                    ]}
                    onPress={() => hasData && handleMonthSelect(monthName)}
                    disabled={!hasData}
                    activeOpacity={0.7}
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={['#93210A', '#C72E14']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.monthChipGradient}
                      >
                        <Text style={styles.monthChipTextSelected}>
                          {monthName.substring(0, 3)}
                        </Text>
                        {hasData && <Icon name="check-circle" size={14} color="#fff" style={styles.monthChipIcon} />}
                      </LinearGradient>
                    ) : (
                      <>
                        <Text style={[
                          styles.monthChipText,
                          !hasData && styles.monthChipTextDisabled
                        ]}>
                          {monthName.substring(0, 3)}
                        </Text>
                        {hasData && <View style={styles.activeDot} />}
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* SELECTED MONTH CONTENT */}
        {selectedMonthData && (
          <View style={[styles.card, styles.monthContentCard]}>
            <View style={styles.monthHeader}>
              <Text style={[styles.monthTitle, isTablet && styles.monthTitleTablet]}>
                {selectedMonth}
              </Text>
              <View style={styles.monthBadge}>
                <Icon name="stars" size={16} color="#93210A" />
              </View>
            </View>
            
            {/* Month Gallery */}
            {selectedMonthData.gallery?.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthGalleryScroll}
              >
                {selectedMonthData.gallery.map((img, index) => (
                  <View key={index} style={styles.galleryImageContainer}>
                    <Image
                      source={{ uri: img }}
                      style={[styles.monthGalleryImage, isTablet && styles.monthGalleryImageTablet]}
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.3)']}
                      style={styles.galleryImageGradient}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
            
            {/* Month Description */}
            <View>
              <Text style={[styles.monthDescription, isTablet && styles.monthDescriptionTablet]}>
                {showFullDescription 
                  ? (selectedMonthData.description || "No description available for this month.")
                  : truncateText(selectedMonthData.description || "No description available for this month.", DESCRIPTION_MAX_LENGTH)
                }
              </Text>
              {selectedMonthData.description && selectedMonthData.description.length > DESCRIPTION_MAX_LENGTH && (
                <TouchableOpacity 
                  onPress={() => setShowFullDescription(!showFullDescription)}
                  style={styles.readMoreButton}
                >
                  <Text style={styles.readMoreText}>
                    {showFullDescription ? 'Read Less' : 'Read More'}
                  </Text>
                  <Icon 
                    name={showFullDescription ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                    size={18} 
                    color="#93210A" 
                  />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Month Video */}
            {selectedMonthData.video && (
              <View style={styles.videoSection}>
                <View style={styles.videoHeader}>
                  <Icon name="play-circle-outline" size={22} color="#93210A" />
                  <Text style={styles.videoTitle}>Watch Video</Text>
                </View>
                <View style={[styles.videoWrapper, isTablet && styles.videoWrapperTablet]}>
                  <YoutubePlayer
                    height={isTablet ? 350 : 180}
                    videoId={getYouTubeId(selectedMonthData.video)}
                    play={false}
                  />
                </View>
              </View>
            )}
            
            {/* Additional Fields */}
            {Object.keys(selectedMonthData).map((key, index) => {
              const excludedKeys = [
                'id', 'month', 'description', 'video', 'gallery',
                'createdAt', 'updatedAt', '_id', '__v'
              ];
              
              const value = selectedMonthData[key];
              if (
                !excludedKeys.includes(key) && 
                value && 
                typeof value === 'string' && 
                value.trim() !== ''
              ) {
                return (
                  <View key={index} style={styles.infoSection}>
                    <View style={styles.infoHeader}>
                      <View style={styles.infoDot} />
                      <Text style={styles.infoTitle}>
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                    </View>
                    <Text style={styles.infoText}>{value}</Text>
                  </View>
                );
              }
              return null;
            })}
          </View>
        )}

        {/* MAIN VIDEO CARD */}
        {displayItem.video && (
          <View style={[styles.card, styles.mainVideoCard]}>
            <View style={styles.cardHeader}>
              <Icon name="video-library" size={24} color="#93210A" />
              <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]}>
                General Video
              </Text>
            </View>

            <View style={[styles.videoWrapper, isTablet && styles.videoWrapperTablet]}>
              <YoutubePlayer
                height={isTablet ? 340 : 220}
                videoId={getYouTubeId(displayItem.video)}
                play={false}
              />
            </View>
          </View>
        )}

        {/* MAIN GALLERY CARD */}
        {displayItem.gallery?.length > 0 && (
          <View style={[styles.card, styles.galleryCard]}>
            <View style={styles.cardHeader}>
              <Icon name="photo-library" size={24} color="#93210A" />
              <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]}>
                General Gallery
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {displayItem.gallery.map((img, index) => (
                <View key={index} style={styles.galleryImageContainer}>
                  <Image
                    source={{ uri: img }}
                    style={[styles.galleryImage, isTablet && styles.galleryImageTablet]}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.galleryImageGradient}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ABOUT SECTION (AFTER GALLERY) */}
        {displayItem.about && (
          <View style={[styles.card, styles.aboutCard]}>
            <View style={styles.cardHeader}>
              <Icon name="info-outline" size={24} color="#93210A" />
              <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]}>
                About
              </Text>
            </View>
            <Text style={[styles.description, isTablet && styles.descriptionTablet]}>
              {showFullAbout 
                ? displayItem.about 
                : truncateText(displayItem.about, ABOUT_MAX_LENGTH)
              }
            </Text>
            {displayItem.about.length > ABOUT_MAX_LENGTH && (
              <TouchableOpacity 
                onPress={() => setShowFullAbout(!showFullAbout)}
                style={styles.readMoreButton}
              >
                <Text style={styles.readMoreText}>
                  {showFullAbout ? 'Read Less' : 'Read More'}
                </Text>
                <Icon 
                  name={showFullAbout ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={18} 
                  color="#93210A" 
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  /* HEADER */
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    zIndex: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginLeft: 16,
    flex: 1,
  },
  headerTitleTablet: {
    fontSize: 26,
  },

  /* CONTENT */
  content: {
    paddingBottom: 40,
  },

  /* HERO SECTION */
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 400,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageTablet: {
    height: 500,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroTitleTablet: {
    fontSize: 42,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroSubtitleTablet: {
    fontSize: 22,
  },

  /* CARD STYLES */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 10,
  },
  cardTitleTablet: {
    fontSize: 24,
  },

  /* DESCRIPTION */
  descriptionCard: {
    backgroundColor: '#FFF9F5',
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#4A4A4A",
    textAlign: "justify",
  },
  descriptionTablet: {
    fontSize: 18,
    lineHeight: 30,
  },

  /* READ MORE BUTTON */
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  readMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#93210A',
    marginRight: 4,
  },

  /* ABOUT CARD */
  aboutCard: {
    backgroundColor: '#F0F8FF',
  },

  /* MONTH SELECTOR */
  monthSelectorCard: {
    paddingBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  monthScrollContainer: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  monthChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  monthChipSelected: {
    borderColor: 'transparent',
  },
  monthChipDisabled: {
    backgroundColor: "#FAFAFA",
    borderColor: '#F0F0F0',
  },
  monthChipGradient: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4A4A4A",
  },
  monthChipTextSelected: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  monthChipTextDisabled: {
    color: "#BDBDBD",
  },
  monthChipIcon: {
    marginLeft: 6,
  },
  activeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#93210A",
  },

  /* MONTH CONTENT */
  monthContentCard: {
    backgroundColor: '#FFFBF8',
    borderLeftWidth: 4,
    borderLeftColor: '#93210A',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#93210A",
  },
  monthTitleTablet: {
    fontSize: 28,
  },
  monthBadge: {
    backgroundColor: '#FFF0E6',
    padding: 8,
    borderRadius: 12,
  },
  monthDescription: {
    fontSize: 16,
    lineHeight: 26,
    color: "#4A4A4A",
    marginBottom: 16,
  },
  monthDescriptionTablet: {
    fontSize: 18,
    lineHeight: 30,
  },

  /* GALLERY */
  monthGalleryScroll: {
    paddingRight: 10,
    marginBottom: 20,
  },
  galleryImageContainer: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  monthGalleryImage: {
    width: 200,
    height: 150,
    borderRadius: 16,
  },
  monthGalleryImageTablet: {
    width: 240,
    height: 180,
  },
  galleryImage: {
    width: 220,
    height: 165,
    borderRadius: 16,
  },
  galleryImageTablet: {
    width: 280,
    height: 210,
  },
  galleryImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderRadius: 16,
  },

  /* VIDEO */
  videoSection: {
    marginTop: 16,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#93210A",
    marginLeft: 8,
  },
  videoWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  videoWrapperTablet: {
    borderRadius: 24,
  },

  /* INFO SECTION */
  infoSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#93210A',
    marginRight: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#93210A",
  },
  infoText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4A4A4A",
    marginLeft: 16,
  },

  bottomSpacer: {
    height: 20,
  },
});