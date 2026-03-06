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
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { Video } from "expo-av";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function GalleryInformation() {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, mainImage, description, images = [], videoLink } = route.params || {};
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleNext = () =>
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  const handlePrev = () =>
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const handleModalNext = () => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleModalPrev = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // Extract YouTube ID
  const extractYouTubeId = (url) => {
    const match = url?.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const videoId = extractYouTubeId(videoLink);

  const renderGalleryItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => openLightbox(index)}
      style={styles.galleryItemWrapper}
    >
      <Image source={{ uri: item?.url }} style={styles.galleryThumb} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)']}
        style={styles.galleryOverlay}
      />
      <View style={styles.galleryIcon}>
        <Ionicons name="expand-outline" size={18} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      
      {/* Header - Clean Redesign */}
      <LinearGradient
        colors={['#8B0000', '#A52A2A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, isTablet && styles.headerTablet]}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          activeOpacity={0.7}
        >
         <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} numberOfLines={1}>
          Gallery
        </Text>
        
        <View style={{ width: isTablet ? 50 : 40 }} />
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={mainImage} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroTitleContainer}>
            <Text style={[styles.heroTitle, isTablet && styles.heroTitleTablet]}>
              {title}
            </Text>
            <View style={styles.titleUnderline} />
          </View>
        </View>

        {/* Content Card */}
        <View style={[styles.contentCard, isTablet && styles.contentCardTablet]}>
          
          {/* Description Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={22} color="#8B0000" />
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                About
              </Text>
            </View>
            
            <Text
              style={[styles.description, isTablet && styles.descriptionTablet]}
              numberOfLines={isExpanded ? undefined : 4}
            >
              {description || "No description available"}
            </Text>
            
            {description?.length > 150 && (
              <TouchableOpacity 
                onPress={() => setIsExpanded(!isExpanded)} 
                style={styles.readMoreBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.readMoreText}>
                  {isExpanded ? "Show less" : "Read more"}
                </Text>
                <Ionicons 
                  name={isExpanded ? "chevron-up" : "chevron-down"} 
                  size={14} 
                  color="#8B0000" 
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Gallery Section */}
          {images.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="images" size={22} color="#8B0000" />
                <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                  Gallery ({images.length})
                </Text>
              </View>
              
              {/* Main Gallery Image */}
              <View style={styles.mainGalleryContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => openLightbox(currentIndex)}
                  style={styles.mainImageWrapper}
                >
                  <Image
                    source={{ uri: images[currentIndex]?.url }}
                    style={styles.mainGalleryImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.4)']}
                    style={styles.mainImageGradient}
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <TouchableOpacity 
                        onPress={handlePrev}
                        style={[styles.navArrow, styles.navArrowLeft]}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={handleNext}
                        style={[styles.navArrow, styles.navArrowRight]}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="chevron-forward" size={24} color="#fff" />
                      </TouchableOpacity>
                    </>
                  )}
                  
                  {/*Image Counter*/}
                  <View style={styles.imageCounter}>
                    <Text style={styles.counterText}>
                      {currentIndex + 1} / {images.length}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Video Section */}
          {videoLink && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="videocam" size={22} color="#8B0000" />
                <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                  Video
                </Text>
              </View>
              
              <View style={styles.videoWrapper}>
                {videoId ? (
                  <YoutubePlayer 
                    height={isTablet ? 400 : 180} 
                    width="100%" 
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
                    style={styles.videoPlayer}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Lightbox Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setModalVisible(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedImageIndex}
            onScroll={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setSelectedImageIndex(index);
            }}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={styles.modalImageContainer}>
                <Image
                  source={{ uri: item?.url }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          {images.length > 1 && (
            <>
              <TouchableOpacity 
                style={[styles.modalNavBtn, styles.modalNavLeft]}
                onPress={handleModalPrev}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalNavBtn, styles.modalNavRight]}
                onPress={handleModalNext}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-forward" size={30} color="#fff" />
              </TouchableOpacity>
            </>
          )}

          <View style={styles.modalCounter}>
            <Text style={styles.modalCounterText}>
              {selectedImageIndex + 1} / {images.length}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTablet: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonTablet: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  headerTitleTablet: {
    fontSize: 24,
  },

  // Scroll Content
  scrollContent: {
    paddingBottom: 30,
  },

  // Hero Section
  heroSection: {
    height: screenHeight * 0.35,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  heroTitleContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heroTitleTablet: {
    fontSize: 36,
  },
  titleUnderline: {
    width: 50,
    height: 3,
    backgroundColor: '#fff',
    marginTop: 8,
    borderRadius: 2,
  },

  // Content Card
  contentCard: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 25,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  contentCardTablet: {
    marginHorizontal: 30,
    padding: 25,
    borderRadius: 30,
  },

  // Section
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  sectionTitleTablet: {
    fontSize: 20,
  },

  // Description
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    fontWeight: '400',
  },
  descriptionTablet: {
    fontSize: 16,
    lineHeight: 24,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  readMoreText: {
    color: '#8B0000',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },

  // Gallery
  mainGalleryContainer: {
    marginBottom: 15,
  },
  mainImageWrapper: {
    width: '100%',
    height: screenWidth * 0.5,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  mainGalleryImage: {
    width: '100%',
    height: '100%',
  },
  mainImageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrowLeft: {
    left: 10,
  },
  navArrowRight: {
    right: 10,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  thumbnailList: {
    paddingVertical: 5,
    gap: 10,
  },
  galleryItemWrapper: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  galleryThumb: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  galleryIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Video
  videoWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoPlayer: {
    width: '100%',
    height: 220,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth,
    height: screenHeight * 0.7,
  },
  modalNavBtn: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalNavLeft: {
    left: 20,
  },
  modalNavRight: {
    right: 20,
  },
  modalCounter: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalCounterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});