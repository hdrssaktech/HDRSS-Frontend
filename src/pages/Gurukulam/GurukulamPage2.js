import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, StatusBar, Dimensions, Platform,
  FlatList, Alert, Modal, Animated, ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const isTablet = width >= 600;

const STORAGE_KEY = 'course_progress';
const ACTIVE_LEVEL_KEY = 'active_level';
const COMPLETED_LEVELS_KEY = 'completed_levels';

// Sample course data with levels
const DEMO_LEVELS = [
  { 
    _id: 'lvl-1', 
    level: 'Level 1: Initialization Core', 
    intro: 'Analyze framework layouts, device environment profiles, and standard repository structures.',
    videolink: 'https://www.w3schools.com/html/mov_bbb.mp4', 
    page1refid: 'c1',
    duration: '12:30',
    order: 1
  },
  { 
    _id: 'lvl-2', 
    level: 'Level 2: Advanced State Engine', 
    intro: 'Break down system behaviors across threads, memory cycles, and remote data binding pipelines.',
    videolink: 'https://www.w3schools.com/html/movie.mp4', 
    page1refid: 'c1',
    duration: '18:45',
    order: 2
  },
  { 
    _id: 'lvl-3', 
    level: 'Level 3: API Integration Mastery', 
    intro: 'Master RESTful API integration, error handling, and data persistence strategies.',
    videolink: 'https://www.w3schools.com/html/mov_bbb.mp4', 
    page1refid: 'c1',
    duration: '22:15',
    order: 3
  },
  { 
    _id: 'lvl-4', 
    level: 'Level 4: Performance Optimization', 
    intro: 'Learn advanced performance tuning, memory management, and optimization techniques.',
    videolink: 'https://www.w3schools.com/html/movie.mp4', 
    page1refid: 'c1',
    duration: '15:20',
    order: 4
  },
  { 
    _id: 'lvl-5', 
    level: 'Level 5: Deployment & DevOps', 
    intro: 'Understand CI/CD pipelines, cloud deployment, and monitoring strategies.',
    videolink: 'https://www.w3schools.com/html/mov_bbb.mp4', 
    page1refid: 'c1',
    duration: '20:00',
    order: 5
  },
  { 
    _id: 'lvl-6', 
    level: 'Level 1: Network Core Architectures', 
    intro: 'A structural dive into router requests, parameter tracking modules, and secure controller queries.',
    videolink: 'https://www.w3schools.com/html/mov_bbb.mp4', 
    page1refid: 'c2',
    duration: '14:30',
    order: 1
  },
];

export default function GurukulamPage2({ route, navigation }) {
  const { courseId, courseName, onProgressUpdate } = route.params;
  const [levels, setLevels] = useState([]);
  const [activeLevel, setActiveLevel] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const matched = DEMO_LEVELS.filter(item => item.page1refid === courseId);
    const sorted = matched.sort((a, b) => (a.order || 0) - (b.order || 0));
    setLevels(sorted);
    
    // Load all saved data
    loadSavedData(sorted);
  }, [courseId]);

  // Load saved progress, completed levels, and active level
  const loadSavedData = async (sortedLevels) => {
    try {
      // Load progress
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const progressData = saved ? JSON.parse(saved) : {};
      
      // Load completed levels
      const savedCompleted = await AsyncStorage.getItem(COMPLETED_LEVELS_KEY);
      const completedData = savedCompleted ? JSON.parse(savedCompleted) : {};
      
      // Load active level
      const savedActiveLevel = await AsyncStorage.getItem(ACTIVE_LEVEL_KEY);
      const activeLevelData = savedActiveLevel ? JSON.parse(savedActiveLevel) : {};
      
      // Get progress for this course
      const courseProgressData = progressData[courseId] || 0;
      setCourseProgress(courseProgressData);
      
      // Get completed levels for this course
      const completedForCourse = completedData[courseId] || [];
      setCompletedLevels(completedForCourse);
      
      // If we have completed levels but progress is 0, update progress
      if (completedForCourse.length > 0 && courseProgressData === 0) {
        const newProgress = Math.round((completedForCourse.length / sortedLevels.length) * 100);
        setCourseProgress(newProgress);
        // Save the updated progress
        progressData[courseId] = newProgress;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
      }
      
      // Determine active level
      let active = null;
      const savedActiveForCourse = activeLevelData[courseId];
      
      if (savedActiveForCourse) {
        // Find the saved active level
        active = sortedLevels.find(l => l._id === savedActiveForCourse);
      }
      
      // If no saved active level or it's completed, find first uncompleted
      if (!active || completedForCourse.includes(active._id)) {
        const firstUncompleted = sortedLevels.find(l => !completedForCourse.includes(l._id));
        active = firstUncompleted || sortedLevels[0];
      }
      
      setActiveLevel(active);
      setIsLoading(false);
      
    } catch (e) {
      console.log('Error loading data:', e);
      // Fallback: set first level as active
      setActiveLevel(sortedLevels[0]);
      setIsLoading(false);
    }
  };

  // Save completed levels
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

  // Save active level
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

  // Save progress to storage
  const saveProgress = async (progress, completed) => {
    try {
      // Save progress
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const progressData = saved ? JSON.parse(saved) : {};
      progressData[courseId] = progress;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
      
      // Save completed levels
      await saveCompletedLevels(completed);
      
      // Update parent component if callback exists
      if (onProgressUpdate) {
        onProgressUpdate(courseId, progress);
      }
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

  // Calculate total progress
  const calculateProgress = () => {
    if (levels.length === 0) return 0;
    return Math.round((completedLevels.length / levels.length) * 100);
  };

  // Handle video completion
  const handleVideoComplete = () => {
    if (!activeLevel) return;
    
    if (!completedLevels.includes(activeLevel._id)) {
      const newCompleted = [...completedLevels, activeLevel._id];
      setCompletedLevels(newCompleted);
      
      const newProgress = calculateProgress();
      setCourseProgress(newProgress);
      
      // Save progress and completed levels
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
      // Save active level
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

  const renderLevelItem = ({ item, index }) => {
    const isCompleted = completedLevels.includes(item._id);
    const isActive = activeLevel?._id === item._id;
    const isLocked = !isCompleted && !isActive && index > 0 && 
                     !completedLevels.includes(levels[index - 1]?._id);

    return (
      <TouchableOpacity
        key={item._id}
        activeOpacity={0.75}
        style={[
          styles.syllabusRow,
          isActive && styles.syllabusRowActive,
          isCompleted && styles.syllabusRowCompleted,
          isLocked && styles.syllabusRowLocked,
        ]}
        onPress={() => navigateToLevel(item)}
        disabled={isLocked}
      >
        <View style={[styles.statusCircle, isCompleted && styles.statusCircleCompleted]}>
          {isCompleted ? (
            <Ionicons name="checkmark" size={14} color="#fff" />
          ) : isActive ? (
            <Ionicons name="play" size={12} color="#fff" />
          ) : isLocked ? (
            <Ionicons name="lock-closed" size={12} color="#94A3B8" />
          ) : (
            <Text style={styles.indexTxt}>{index + 1}</Text>
          )}
        </View>

        <View style={styles.levelInfo}>
          <Text
            style={[
              styles.syllabusName,
              isActive && styles.syllabusNameActive,
              isCompleted && styles.syllabusNameCompleted,
              isLocked && styles.syllabusNameLocked,
            ]}
            numberOfLines={1}
          >
            {item.level}
          </Text>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>

        {isActive && (
          <View style={styles.watchingBadge}>
            <Text style={styles.watchingTxt}>▶ Playing</Text>
          </View>
        )}
        {isCompleted && !isActive && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedTxt}>✓ Done</Text>
          </View>
        )}
        {isLocked && (
          <Ionicons name="lock-closed" size={16} color="#CBD5E1" />
        )}
      </TouchableOpacity>
    );
  };

  const renderVideoPlayer = () => {
    if (!activeLevel) {
      return (
        <View style={styles.playerEmpty}>
          <Ionicons name="play-circle-outline" size={40} color="rgba(255,255,255,0.4)" />
          <Text style={styles.playerEmptyTxt}>Loading lesson…</Text>
        </View>
      );
    }

    const injectedJS = `
      const video = document.querySelector('video');
      if (video) {
        video.addEventListener('ended', () => {
          window.ReactNativeWebView.postMessage('video-ended');
        });
        
        // Track video progress
        video.addEventListener('timeupdate', () => {
          const progress = (video.currentTime / video.duration) * 100;
          if (progress >= 95) {
            window.ReactNativeWebView.postMessage('video-near-end');
          }
        });
        
        // Auto-play
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
        style={styles.video}
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
          if (event.nativeEvent.data === 'video-near-end') {
            // Video is near end
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
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <View style={styles.modalIcon}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
          </View>
          <Text style={styles.modalTitle}>Level Complete!</Text>
          <Text style={styles.modalMessage}>{completionMessage}</Text>
          <View style={styles.modalProgress}>
            <View style={styles.progressTrack}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(completedLevels.length / levels.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completedLevels.length} / {levels.length} completed
            </Text>
          </View>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setShowCompletionModal(false);
              advanceToNextLevel();
            }}
          >
            <Text style={styles.modalButtonText}>Continue →</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const progress = levels.length > 0 ? (completedLevels.length / levels.length) * 100 : 0;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B1A1A" />
        <Text style={styles.loadingText}>Loading course...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {courseName}
          </Text>
        </View>

        <TouchableOpacity style={styles.progressButton} onPress={() => {
          Alert.alert(
            '📊 Course Progress',
            `Completed: ${completedLevels.length} / ${levels.length} levels\nProgress: ${Math.round(progress)}%`,
            [{ text: 'OK' }]
          );
        }}>
          <Ionicons name="stats-chart" size={isTablet ? 24 : 20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressHeader}>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
        </View>
        <Text style={styles.progressHeaderText}>{Math.round(progress)}% Complete</Text>
      </View>

      <View style={styles.playerWrap}>
        {renderVideoPlayer()}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeLevel && (
          <View style={styles.infoCard}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeTxt}>Now Playing</Text>
            </View>
            <Text style={styles.levelTitle}>{activeLevel.level}</Text>
            <Text style={styles.levelIntro}>{activeLevel.intro}</Text>
            <Text style={styles.durationInfo}>⏱ Duration: {activeLevel.duration}</Text>
          </View>
        )}

        <View style={styles.syllabusHeader}>
          <Text style={styles.sectionLbl}>Course Syllabus</Text>
          <Text style={styles.completedCount}>
            {completedLevels.length}/{levels.length} completed
          </Text>
        </View>

        {levels.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="document-outline" size={28} color="#CBD5E1" />
            <Text style={styles.emptyTxt}>No modules found for this track.</Text>
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
          <View style={styles.completionCard}>
            <Ionicons name="trophy" size={32} color="#D4AF37" />
            <Text style={styles.completionTitle}>🏆 Course Complete!</Text>
            <Text style={styles.completionSub}>You've mastered all levels of this course.</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {renderCompletionModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },

  /* HEADER STYLES */
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
    width: isTablet ? 50 : 40,
    height: isTablet ? 50 : 40,
    borderRadius: isTablet ? 25 : 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: isTablet ? 22 : 19,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  progressButton: {
    width: isTablet ? 50 : 40,
    height: isTablet ? 50 : 40,
    borderRadius: isTablet ? 25 : 20,
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
    padding: isTablet ? 20 : 14,
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
    fontSize: isTablet ? 17 : 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 22,
  },

  levelIntro: {
    fontSize: isTablet ? 13 : 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 6,
  },

  durationInfo: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
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
    padding: isTablet ? 14 : 12,
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
    fontSize: isTablet ? 14 : 12,
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