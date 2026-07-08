import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, StatusBar, Dimensions, Platform,
  FlatList, Alert, Modal, Animated, ActivityIndicator,
  Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Alert/Loader';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 600;
const isLargeTablet = width >= 1024;

const STORAGE_KEY = 'course_progress';
const ACTIVE_LEVEL_KEY = 'active_level';
const COMPLETED_LEVELS_KEY = 'completed_levels';

const API_URL = 'https://hdrss-backend.onrender.com/api/course-page2/by-course';

export default function GurukulamPage2({ route, navigation }) {
  const { courseId, courseName } = route.params;
  const [levels, setLevels] = useState([]);
  const [activeLevel, setActiveLevel] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const webViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fetch levels from API
  const fetchLevels = async (courseId) => {
    try {
      const response = await fetch(`${API_URL}/${courseId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      let mappedLevels = [];
      if (Array.isArray(data) && data.length > 0) {
        mappedLevels = data.map((item, index) => {
          // Extract gallery URLs from objects
          let galleryArray = [];
          
          if (item.gallery) {
            if (Array.isArray(item.gallery)) {
              // Handle array of objects with 'url' property
              galleryArray = item.gallery
                .filter(img => img && typeof img === 'object' && img.url && typeof img.url === 'string')
                .map(img => img.url);
            } else if (typeof item.gallery === 'string') {
              // Handle single string URL
              galleryArray = [item.gallery];
            } else if (typeof item.gallery === 'object' && item.gallery.url) {
              // Handle single object with 'url' property
              galleryArray = [item.gallery.url];
            }
          }
          
          return {
            _id: String(item.id),
            level: item.level || `Level ${index + 1}`,
            intro: item.intro || 'No description available',
            videolink: item.videolink || '',
            page1refid: String(item.page1refid),
            orderno: item.orderno || index + 1,
            duration: generateDuration(index),
            order: item.orderno || index + 1,
            CoursePage1: item.CoursePage1,
            gallery: galleryArray // Now contains clean URL strings
          };
        });
        
        // Sort by order number
        mappedLevels.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
      
      return mappedLevels;
    } catch (error) {
      console.log('Error fetching levels:', error);
      setError(true);
      return [];
    }
  };

  const generateDuration = (index) => {
    const minutes = (index % 3) + 1;
    const seconds = (index * 7) % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(false);
      
      const fetchedLevels = await fetchLevels(courseId);
      
      if (fetchedLevels.length === 0) {
        setError(true);
        setLevels([]);
        setIsLoading(false);
        return;
      }
      
      setLevels(fetchedLevels);
      await loadSavedData(fetchedLevels);
      setIsLoading(false);
    };
    
    loadData();
  }, [courseId]);

  const loadSavedData = async (sortedLevels) => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const progressData = saved ? JSON.parse(saved) : {};
      
      const savedCompleted = await AsyncStorage.getItem(COMPLETED_LEVELS_KEY);
      const completedData = savedCompleted ? JSON.parse(savedCompleted) : {};
      
      const savedActiveLevel = await AsyncStorage.getItem(ACTIVE_LEVEL_KEY);
      const activeLevelData = savedActiveLevel ? JSON.parse(savedActiveLevel) : {};
      
      const courseProgressData = progressData[courseId] || 0;
      setCourseProgress(courseProgressData);
      
      const completedForCourse = completedData[courseId] || [];
      setCompletedLevels(completedForCourse);
      
      if (completedForCourse.length > 0 && courseProgressData === 0) {
        const newProgress = Math.round((completedForCourse.length / sortedLevels.length) * 100);
        setCourseProgress(newProgress);
        progressData[courseId] = newProgress;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
      }
      
      let active = null;
      const savedActiveForCourse = activeLevelData[courseId];
      
      if (savedActiveForCourse) {
        active = sortedLevels.find(l => l._id === savedActiveForCourse);
      }
      
      if (!active || completedForCourse.includes(active._id)) {
        const firstUncompleted = sortedLevels.find(l => !completedForCourse.includes(l._id));
        active = firstUncompleted || sortedLevels[0];
      }
      
      setActiveLevel(active);
      
    } catch (e) {
      console.log('Error loading data:', e);
      setActiveLevel(sortedLevels[0]);
    }
  };

  const saveCompletedLevels = async (completed) => {
    try {
      const saved = await AsyncStorage.getItem(COMPLETED_LEVELS_KEY);
      const completedData = saved ? JSON.parse(saved) : {};
      completedData[courseId] = completed;
      await AsyncStorage.setItem(COMPLETED_LEVELS_KEY, JSON.stringify(completedData));
    } catch (e) {
      console.log('Error saving completed levels:', e);
    }
  };

  const saveActiveLevel = async (levelId) => {
    try {
      const saved = await AsyncStorage.getItem(ACTIVE_LEVEL_KEY);
      const activeData = saved ? JSON.parse(saved) : {};
      activeData[courseId] = levelId;
      await AsyncStorage.setItem(ACTIVE_LEVEL_KEY, JSON.stringify(activeData));
    } catch (e) {
      console.log('Error saving active level:', e);
    }
  };

  const saveProgress = async (progress, completed) => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const progressData = saved ? JSON.parse(saved) : {};
      progressData[courseId] = progress;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
      
      await saveCompletedLevels(completed);
    } catch (e) {
      console.log('Error saving progress:', e);
    }
  };

  useEffect(() => {
    if (showCompletionModal) {
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [showCompletionModal]);

  const calculateProgress = () => {
    if (levels.length === 0) return 0;
    return Math.round((completedLevels.length / levels.length) * 100);
  };

  const handleVideoComplete = () => {
    if (!activeLevel) return;
    
    if (!completedLevels.includes(activeLevel._id)) {
      const newCompleted = [...completedLevels, activeLevel._id];
      setCompletedLevels(newCompleted);
      
      const newProgress = calculateProgress();
      setCourseProgress(newProgress);
      
      saveProgress(newProgress, newCompleted);
      
      setCompletionMessage(`🎉 Great job! You've completed "${activeLevel.level}"`);
      setShowCompletionModal(true);
      
      setTimeout(() => {
        setShowCompletionModal(false);
        advanceToNextLevel();
      }, 3000);
    }
  };

  const advanceToNextLevel = () => {
    const currentIndex = levels.findIndex(l => l._id === activeLevel?._id);
    const nextLevel = levels[currentIndex + 1];
    
    if (nextLevel) {
      setActiveLevel(nextLevel);
      saveActiveLevel(nextLevel._id);
      setIsVideoEnded(false);
    } else {
      setCompletionMessage('🎊 Congratulations! You\'ve completed all levels!');
      setShowCompletionModal(true);
      setTimeout(() => setShowCompletionModal(false), 4000);
    }
  };

  const navigateToLevel = (level) => {
    if (level._id === activeLevel?._id) {
      setIsVideoEnded(false);
      setActiveLevel({...level});
      saveActiveLevel(level._id);
      return;
    }
    
    const levelIndex = levels.findIndex(l => l._id === level._id);
    const previousLevels = levels.slice(0, levelIndex);
    const allPreviousCompleted = previousLevels.every(l => completedLevels.includes(l._id));
    
    if (allPreviousCompleted || levelIndex === 0) {
      setActiveLevel(level);
      saveActiveLevel(level._id);
      setIsVideoEnded(false);
    } else {
      Alert.alert(
        '🔒 Level Locked',
        'Please complete previous levels first to unlock this content.',
        [{ text: 'OK' }]
      );
    }
  };

  // Render gallery images with error handling
  const renderGallery = (galleryImages) => {
    // Check if gallery exists and has valid images
    if (!galleryImages || !Array.isArray(galleryImages) || galleryImages.length === 0) {
      return null;
    }

    // Filter out invalid images
    const validImages = galleryImages.filter(img => img && typeof img === 'string' && img.trim().length > 0);
    
    if (validImages.length === 0) {
      return null;
    }
    
    const galleryItemSize = isTablet ? (isLargeTablet ? 160 : 130) : 100;
    const galleryImageHeight = isTablet ? (isLargeTablet ? 120 : 100) : 80;
    
    return (
      <View style={isTablet ? tabletStyles.galleryContainer : mobileStyles.galleryContainer}>
        <View style={styles.galleryHeader}>
          <Text style={isTablet ? tabletStyles.galleryTitle : mobileStyles.galleryTitle}> Course Resources</Text>
          
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={isTablet ? tabletStyles.galleryScroll : mobileStyles.galleryScroll}
        >
          {validImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={[
                isTablet ? tabletStyles.galleryItem : mobileStyles.galleryItem,
                { width: galleryItemSize, height: galleryImageHeight }
              ]}
              onPress={() => {
                setSelectedGalleryImage(image);
                setShowGalleryModal(true);
              }}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: image }} 
                style={isTablet ? tabletStyles.galleryImage : mobileStyles.galleryImage}
                resizeMode="cover"
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
              <View style={isTablet ? tabletStyles.galleryOverlay : mobileStyles.galleryOverlay}>
                <Ionicons name="expand-outline" size={isTablet ? 24 : 20} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Gallery Modal
  const renderGalleryModal = () => (
    <Modal
      transparent
      visible={showGalleryModal}
      animationType="fade"
      onRequestClose={() => setShowGalleryModal(false)}
    >
      <View style={isTablet ? tabletStyles.galleryModalOverlay : mobileStyles.galleryModalOverlay}>
        <TouchableOpacity 
          style={isTablet ? tabletStyles.galleryModalClose : mobileStyles.galleryModalClose}
          onPress={() => setShowGalleryModal(false)}
        >
          <Ionicons name="close" size={isTablet ? 36 : 30} color="#fff" />
        </TouchableOpacity>
        {selectedGalleryImage && (
          <Image 
            source={{ uri: selectedGalleryImage }} 
            style={isTablet ? tabletStyles.galleryModalImage : mobileStyles.galleryModalImage}
            resizeMode="contain"
            onError={(e) => console.log('Modal image load error:', e.nativeEvent.error)}
          />
        )}
      </View>
    </Modal>
  );

  const renderLevelItem = ({ item, index }) => {
    const isCompleted = completedLevels.includes(item._id);
    const isActive = activeLevel?._id === item._id;
    const isLocked = !isCompleted && !isActive && index > 0 && 
                     !completedLevels.includes(levels[index - 1]?._id);

    // Check if item has valid gallery images
    const hasGallery = item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0;

    return (
      <TouchableOpacity
        key={item._id}
        activeOpacity={0.75}
        style={[
          isTablet ? tabletStyles.syllabusRow : mobileStyles.syllabusRow,
          isActive && (isTablet ? tabletStyles.syllabusRowActive : mobileStyles.syllabusRowActive),
          isCompleted && (isTablet ? tabletStyles.syllabusRowCompleted : mobileStyles.syllabusRowCompleted),
          isLocked && (isTablet ? tabletStyles.syllabusRowLocked : mobileStyles.syllabusRowLocked),
        ]}
        onPress={() => navigateToLevel(item)}
        disabled={isLocked}
      >
        <View style={[
          isTablet ? tabletStyles.statusCircle : mobileStyles.statusCircle,
          isCompleted && (isTablet ? tabletStyles.statusCircleCompleted : mobileStyles.statusCircleCompleted)
        ]}>
          {isCompleted ? (
            <Ionicons name="checkmark" size={isTablet ? (isLargeTablet ? 18 : 16) : 14} color="#fff" />
          ) : isActive ? (
            <Ionicons name="play" size={isTablet ? (isLargeTablet ? 16 : 14) : 12} color="#fff" />
          ) : isLocked ? (
            <Ionicons name="lock-closed" size={isTablet ? (isLargeTablet ? 16 : 14) : 12} color="#94A3B8" />
          ) : (
            <Text style={isTablet ? tabletStyles.indexTxt : mobileStyles.indexTxt}>{index + 1}</Text>
          )}
        </View>

        <View style={isTablet ? tabletStyles.levelInfo : mobileStyles.levelInfo}>
          <Text
            style={[
              isTablet ? tabletStyles.syllabusName : mobileStyles.syllabusName,
              isActive && (isTablet ? tabletStyles.syllabusNameActive : mobileStyles.syllabusNameActive),
              isCompleted && (isTablet ? tabletStyles.syllabusNameCompleted : mobileStyles.syllabusNameCompleted),
              isLocked && (isTablet ? tabletStyles.syllabusNameLocked : mobileStyles.syllabusNameLocked),
            ]}
            numberOfLines={isTablet ? 2 : 1}
          >
            {item.level}
          </Text>
        </View>

        {isActive && (
          <View style={isTablet ? tabletStyles.watchingBadge : mobileStyles.watchingBadge}>
            <Text style={isTablet ? tabletStyles.watchingTxt : mobileStyles.watchingTxt}>▶ Playing</Text>
          </View>
        )}
        {isCompleted && !isActive && (
          <View style={isTablet ? tabletStyles.completedBadge : mobileStyles.completedBadge}>
            <Text style={isTablet ? tabletStyles.completedTxt : mobileStyles.completedTxt}>✓ Done</Text>
          </View>
        )}
        {isLocked && (
          <Ionicons name="lock-closed" size={isTablet ? (isLargeTablet ? 24 : 20) : 16} color="#CBD5E1" />
        )}
      </TouchableOpacity>
    );
  };

  const renderVideoPlayer = () => {
    if (!activeLevel) {
      return (
        <View style={isTablet ? tabletStyles.playerEmpty : mobileStyles.playerEmpty}>
          <Ionicons name="play-circle-outline" size={isTablet ? (isLargeTablet ? 60 : 50) : 40} color="rgba(255,255,255,0.4)" />
          <Text style={isTablet ? tabletStyles.playerEmptyTxt : mobileStyles.playerEmptyTxt}>Loading lesson…</Text>
        </View>
      );
    }

    const injectedJS = `
      const video = document.querySelector('video');
      if (video) {
        video.addEventListener('ended', () => {
          window.ReactNativeWebView.postMessage('video-ended');
        });
        
        video.addEventListener('timeupdate', () => {
          const progress = (video.currentTime / video.duration) * 100;
          if (progress >= 95) {
            window.ReactNativeWebView.postMessage('video-near-end');
          }
        });
        
        video.play();
      }
      true;
    `;

    return (
      <WebView
        ref={webViewRef}
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        style={isTablet ? tabletStyles.video : mobileStyles.video}
        source={{
          html: `
            <html>
              <body style="margin:0;padding:0;background:#000;">
                <video width="100%" height="100%" controls autoplay
                  style="object-fit:contain;display:block;">
                  <source src="${activeLevel.videolink}" type="video/mp4">
                </video>
              </body>
            </html>
          `,
        }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'video-ended') {
            setIsVideoEnded(true);
            handleVideoComplete();
          }
        }}
        injectedJavaScript={injectedJS}
        javaScriptEnabled={true}
      />
    );
  };

  const renderCompletionModal = () => (
    <Modal
      transparent
      visible={showCompletionModal}
      animationType="fade"
      onRequestClose={() => setShowCompletionModal(false)}
    >
      <View style={isTablet ? tabletStyles.modalOverlay : mobileStyles.modalOverlay}>
        <Animated.View style={[
          isTablet ? tabletStyles.modalContent : mobileStyles.modalContent, 
          { opacity: fadeAnim }
        ]}>
          <View style={isTablet ? tabletStyles.modalIcon : mobileStyles.modalIcon}>
            <Ionicons name="checkmark-circle" size={isTablet ? (isLargeTablet ? 80 : 70) : 60} color="#4CAF50" />
          </View>
          <Text style={isTablet ? tabletStyles.modalTitle : mobileStyles.modalTitle}>Level Complete!</Text>
          <Text style={isTablet ? tabletStyles.modalMessage : mobileStyles.modalMessage}>{completionMessage}</Text>
          <View style={isTablet ? tabletStyles.modalProgress : mobileStyles.modalProgress}>
            <View style={isTablet ? tabletStyles.progressTrack : mobileStyles.progressTrack}>
              <View 
                style={[
                  isTablet ? tabletStyles.progressFill : mobileStyles.progressFill,
                  { width: `${(completedLevels.length / levels.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={isTablet ? tabletStyles.progressText : mobileStyles.progressText}>
              {completedLevels.length} / {levels.length} completed
            </Text>
          </View>
          <TouchableOpacity
            style={isTablet ? tabletStyles.modalButton : mobileStyles.modalButton}
            onPress={() => {
              setShowCompletionModal(false);
              advanceToNextLevel();
            }}
          >
            <Text style={isTablet ? tabletStyles.modalButtonText : mobileStyles.modalButtonText}>Continue →</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const progress = levels.length > 0 ? (completedLevels.length / levels.length) * 100 : 0;

  if (isLoading) {
    <Loader/>
  }

  if (error || levels.length === 0) {
    return (
      <View style={isTablet ? tabletStyles.errorContainer : mobileStyles.errorContainer}>
        <Ionicons name="cloud-offline-outline" size={isTablet ? (isLargeTablet ? 100 : 80) : 60} color="#CBD5E1" />
        <Text style={isTablet ? tabletStyles.errorTitle : mobileStyles.errorTitle}>No Course Available</Text>
        <Text style={isTablet ? tabletStyles.errorSub : mobileStyles.errorSub}>Unable to load course levels. Please try again.</Text>
        <TouchableOpacity 
          style={isTablet ? tabletStyles.retryButton : mobileStyles.retryButton}
          onPress={() => {
            setError(false);
            setIsLoading(true);
            fetchLevels(courseId).then(fetched => {
              if (fetched.length > 0) {
                setLevels(fetched);
                loadSavedData(fetched);
              }
              setIsLoading(false);
            });
          }}
        >
          <Text style={isTablet ? tabletStyles.retryButtonText : mobileStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={isTablet ? tabletStyles.container : mobileStyles.container}>
      <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />

      <View style={isTablet ? tabletStyles.headerContainer : mobileStyles.headerContainer}>
        <TouchableOpacity
          style={isTablet ? tabletStyles.backButton : mobileStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? (isLargeTablet ? 36 : 30) : 24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={isTablet ? tabletStyles.titleContainer : mobileStyles.titleContainer}>
          <Text style={isTablet ? tabletStyles.headerTitle : mobileStyles.headerTitle} numberOfLines={1}>
            {courseName}
          </Text>
        </View>

        <TouchableOpacity style={isTablet ? tabletStyles.progressButton : mobileStyles.progressButton} onPress={() => {
          Alert.alert(
            '📊 Course Progress',
            `Completed: ${completedLevels.length} / ${levels.length} levels\nProgress: ${Math.round(progress)}%`,
            [{ text: 'OK' }]
          );
        }}>
          <Ionicons name="stats-chart" size={isTablet ? (isLargeTablet ? 28 : 24) : 20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={isTablet ? tabletStyles.progressHeader : mobileStyles.progressHeader}>
        <View style={isTablet ? tabletStyles.progressBarTrack : mobileStyles.progressBarTrack}>
          <View style={[
            isTablet ? tabletStyles.progressBarFill : mobileStyles.progressBarFill,
            { width: `${Math.min(progress, 100)}%` }
          ]} />
        </View>
        <Text style={isTablet ? tabletStyles.progressHeaderText : mobileStyles.progressHeaderText}>
          {Math.round(progress)}% Complete
        </Text>
      </View>

      <View style={isTablet ? tabletStyles.playerWrap : mobileStyles.playerWrap}>
        {renderVideoPlayer()}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isTablet ? tabletStyles.scrollContent : mobileStyles.scrollContent}
      >
        {activeLevel && (
          <View style={isTablet ? tabletStyles.infoCard : mobileStyles.infoCard}>
            <View style={isTablet ? tabletStyles.infoBadge : mobileStyles.infoBadge}>
              <Text style={isTablet ? tabletStyles.infoBadgeTxt : mobileStyles.infoBadgeTxt}>Now Playing</Text>
            </View>
            <Text style={isTablet ? tabletStyles.levelTitle : mobileStyles.levelTitle}>{activeLevel.level}</Text>
            <Text style={isTablet ? tabletStyles.levelIntro : mobileStyles.levelIntro}>{activeLevel.intro}</Text>
            <Text style={isTablet ? tabletStyles.durationInfo : mobileStyles.durationInfo}>⏱ Duration: {activeLevel.duration}</Text>
            
            {/* Render gallery if available */}
            {renderGallery(activeLevel.gallery)}
          </View>
        )}

        <View style={isTablet ? tabletStyles.syllabusHeader : mobileStyles.syllabusHeader}>
          <Text style={isTablet ? tabletStyles.sectionLbl : mobileStyles.sectionLbl}>Course Syllabus</Text>
          <Text style={isTablet ? tabletStyles.completedCount : mobileStyles.completedCount}>
            {completedLevels.length}/{levels.length} completed
          </Text>
        </View>

        {levels.length === 0 ? (
          <View style={isTablet ? tabletStyles.emptyBox : mobileStyles.emptyBox}>
            <Ionicons name="document-outline" size={isTablet ? (isLargeTablet ? 44 : 36) : 28} color="#CBD5E1" />
            <Text style={isTablet ? tabletStyles.emptyTxt : mobileStyles.emptyTxt}>No modules found for this track.</Text>
          </View>
        ) : (
          <FlatList
            data={levels}
            renderItem={renderLevelItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
          />
        )}

        {completedLevels.length > 0 && completedLevels.length === levels.length && (
          <View style={isTablet ? tabletStyles.completionCard : mobileStyles.completionCard}>
            <Ionicons name="trophy" size={isTablet ? (isLargeTablet ? 48 : 40) : 32} color="#D4AF37" />
            <Text style={isTablet ? tabletStyles.completionTitle : mobileStyles.completionTitle}>🏆 Course Complete!</Text>
            <Text style={isTablet ? tabletStyles.completionSub : mobileStyles.completionSub}>You've mastered all levels of this course.</Text>
          </View>
        )}

        <View style={{ height: isTablet ? (isLargeTablet ? 80 : 60) : 40 }} />
      </ScrollView>

      {renderCompletionModal()}
      {renderGalleryModal()}
    </View>
  );
}

// Additional styles for gallery header
const styles = StyleSheet.create({
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet ? 12 : 10,
  },
  galleryCount: {
    fontSize: isTablet ? 12 : 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
});

// ============ MOBILE STYLES ============
const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    gap: 12,
  },

  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
    gap: 12,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A0A0A',
  },

  errorSub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 300,
  },

  retryButton: {
    backgroundColor: '#8B1A1A',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 8,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  headerContainer: {
    backgroundColor: "#9D1B00",
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#8B1A1A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  progressButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  progressHeader: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: 6,
    backgroundColor: '#D4AF37',
    borderRadius: 3,
  },

  progressHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B1A1A',
    minWidth: 70,
    textAlign: 'right',
  },

  playerWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#0F172A',
  },

  video: {
    flex: 1,
    backgroundColor: '#000',
  },

  playerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  playerEmptyTxt: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
  },

  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  infoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },

  infoBadgeTxt: {
    fontSize: 10,
    color: '#8B1A1A',
    fontWeight: '700',
  },

  levelTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 22,
  },

  levelIntro: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 6,
  },

  durationInfo: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },

  galleryContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },

  galleryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  galleryScroll: {
    paddingRight: 8,
    paddingTop: 8,
  },

  galleryItem: {
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  galleryImage: {
    width: '100%',
    height: '100%',
  },

  galleryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },

  galleryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },

  galleryBadgeText: {
    fontSize: 10,
    color: '#8B1A1A',
    fontWeight: '600',
  },

  galleryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  galleryModalClose: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },

  galleryModalImage: {
    width: width * 0.9,
    height: height * 0.8,
  },

  syllabusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionLbl: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  completedCount: {
    fontSize: 11,
    color: '#8B1A1A',
    fontWeight: '600',
  },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },

  emptyTxt: {
    color: '#94A3B8',
    fontSize: 13,
    fontStyle: 'italic',
  },

  syllabusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },

  syllabusRowActive: {
    borderColor: '#8B1A1A',
    backgroundColor: '#FFF8F7',
    borderWidth: 2,
  },

  syllabusRowCompleted: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0FFF4',
    borderWidth: 2,
  },

  syllabusRowLocked: {
    opacity: 0.6,
    backgroundColor: '#F8FAFC',
  },

  statusCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  statusCircleCompleted: {
    backgroundColor: '#4CAF50',
  },

  indexTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },

  levelInfo: {
    flex: 1,
  },

  syllabusName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },

  syllabusNameActive: {
    color: '#8B1A1A',
    fontWeight: '700',
  },

  syllabusNameCompleted: {
    color: '#2E7D32',
    fontWeight: '600',
  },

  syllabusNameLocked: {
    color: '#94A3B8',
  },

  durationText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },

  watchingBadge: {
    backgroundColor: '#FEF2F2',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },

  watchingTxt: {
    fontSize: 9,
    color: '#8B1A1A',
    fontWeight: '700',
  },

  completedBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: '#A5D6A7',
  },

  completedTxt: {
    fontSize: 9,
    color: '#2E7D32',
    fontWeight: '700',
  },

  completionCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },

  completionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8B1A1A',
    marginTop: 8,
  },

  completionSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  modalIcon: {
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },

  modalMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },

  modalProgress: {
    width: '100%',
    marginBottom: 16,
  },

  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },

  progressFill: {
    height: 8,
    backgroundColor: '#D4AF37',
    borderRadius: 4,
  },

  progressText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },

  modalButton: {
    backgroundColor: '#8B1A1A',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },

  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

// ============ TABLET STYLES ============
const tabletStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    gap: 16,
  },

  loadingText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '500',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 30,
    gap: 16,
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A0A0A',
  },

  errorSub: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 400,
  },

  retryButton: {
    backgroundColor: '#8B1A1A',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 12,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  headerContainer: {
    backgroundColor: "#9D1B00",
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    shadowColor: '#8B1A1A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },

  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  headerTitle: {
    color: '#fff',
    fontSize: isLargeTablet ? 26 : 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  progressButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  progressHeader: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: 8,
    backgroundColor: '#D4AF37',
    borderRadius: 4,
  },

  progressHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B1A1A',
    minWidth: 80,
    textAlign: 'right',
  },

  playerWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#0F172A',
  },

  video: {
    flex: 1,
    backgroundColor: '#000',
  },

  playerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  playerEmptyTxt: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 15,
  },

  scrollContent: {
    padding: isLargeTablet ? 28 : 20,
    paddingBottom: isLargeTablet ? 80 : 60,
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: isLargeTablet ? 24 : 18,
    marginBottom: 22,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  infoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },

  infoBadgeTxt: {
    fontSize: 12,
    color: '#8B1A1A',
    fontWeight: '700',
  },

  levelTitle: {
    fontSize: isLargeTablet ? 20 : 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    lineHeight: isLargeTablet ? 30 : 26,
  },

  levelIntro: {
    fontSize: isLargeTablet ? 15 : 13,
    color: '#64748B',
    lineHeight: isLargeTablet ? 24 : 20,
    marginBottom: 8,
  },

  durationInfo: {
    fontSize: isLargeTablet ? 14 : 12,
    color: '#94A3B8',
    fontWeight: '500',
  },

  galleryContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },

  galleryTitle: {
    fontSize: isLargeTablet ? 17 : 15,
    fontWeight: '600',
    color: '#374151',
  },

  galleryScroll: {
    paddingRight: 12,
    paddingTop: 10,
  },

  galleryItem: {
    borderRadius: 10,
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  galleryImage: {
    width: '100%',
    height: '100%',
  },

  galleryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },

  galleryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },

  galleryBadgeText: {
    fontSize: 11,
    color: '#8B1A1A',
    fontWeight: '600',
  },

  galleryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  galleryModalClose: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 24,
    zIndex: 1,
    padding: 10,
  },

  galleryModalImage: {
    width: width * 0.85,
    height: height * 0.8,
  },

  syllabusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionLbl: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  completedCount: {
    fontSize: 13,
    color: '#8B1A1A',
    fontWeight: '600',
  },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },

  emptyTxt: {
    color: '#94A3B8',
    fontSize: 15,
    fontStyle: 'italic',
  },

  syllabusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: isLargeTablet ? 18 : 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  syllabusRowActive: {
    borderColor: '#8B1A1A',
    backgroundColor: '#FFF8F7',
    borderWidth: isLargeTablet ? 3 : 2,
  },

  syllabusRowCompleted: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0FFF4',
    borderWidth: isLargeTablet ? 3 : 2,
  },

  syllabusRowLocked: {
    opacity: 0.6,
    backgroundColor: '#F8FAFC',
  },

  statusCircle: {
    width: isLargeTablet ? 44 : 38,
    height: isLargeTablet ? 44 : 38,
    borderRadius: isLargeTablet ? 22 : 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  statusCircleCompleted: {
    backgroundColor: '#4CAF50',
  },

  indexTxt: {
    fontSize: isLargeTablet ? 15 : 13,
    fontWeight: '700',
    color: '#64748B',
  },

  levelInfo: {
    flex: 1,
  },

  syllabusName: {
    fontSize: isLargeTablet ? 16 : 14,
    fontWeight: '500',
    color: '#374151',
  },

  syllabusNameActive: {
    color: '#8B1A1A',
    fontWeight: '700',
  },

  syllabusNameCompleted: {
    color: '#2E7D32',
    fontWeight: '600',
  },

  syllabusNameLocked: {
    color: '#94A3B8',
  },

  durationText: {
    fontSize: isLargeTablet ? 14 : 12,
    color: '#94A3B8',
    marginTop: 3,
  },

  watchingBadge: {
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },

  watchingTxt: {
    fontSize: 10,
    color: '#8B1A1A',
    fontWeight: '700',
  },

  completedBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: '#A5D6A7',
  },

  completedTxt: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '700',
  },

  completionCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: isLargeTablet ? 32 : 24,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: isLargeTablet ? 3 : 2.5,
    borderColor: '#D4AF37',
  },

  completionTitle: {
    fontSize: isLargeTablet ? 24 : 20,
    fontWeight: '800',
    color: '#8B1A1A',
    marginTop: 10,
  },

  completionSub: {
    fontSize: isLargeTablet ? 17 : 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 28,
    width: width * 0.7,
    maxWidth: 450,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

  modalIcon: {
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },

  modalProgress: {
    width: '100%',
    marginBottom: 20,
  },

  progressTrack: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },

  progressFill: {
    height: 10,
    backgroundColor: '#D4AF37',
    borderRadius: 5,
  },

  progressText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },

  modalButton: {
    backgroundColor: '#8B1A1A',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },

  modalButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});