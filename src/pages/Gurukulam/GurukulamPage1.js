import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList,
  TouchableOpacity, ActivityIndicator,
  StatusBar, Dimensions, Platform, Image,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../components/Alert/Loader';

const { width } = Dimensions.get('window');
const isTablet = width >= 600;
const isLargeTablet = width >= 1024;

// Responsive grid configuration
const getNumColumns = () => {
  if (isLargeTablet) return 4;
  if (isTablet) return 4;
  return 3;
};

const NUM_COLS = getNumColumns();
const H_PAD = isTablet ? 24 : 14;
const GAP = isTablet ? 12 : 8;
const CARD_W = (width - H_PAD * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

// Color scheme
const C = {
  primary:     '#8B1A1A',
  primaryDeep: '#4A0D0D',
  primaryMid:  '#6B1414',
  primaryLight: '#A52A2A',
  gold:        '#D4AF37',
  goldLight:   '#F0D060',
  goldPale:    '#FDF6DC',
  bg:          '#F2EBE8',
  surface:     '#FFFFFF',
  textDark:    '#1A0A0A',
  textMid:     '#5C3A3A',
  textLight:   '#9E7070',
  border:      '#EDE0DC',
  shadow:      'rgba(139, 26, 26, 0.15)',
};

// Gradient-like color pairs for each card banner
const BANNER_PALETTES = [
  { top: '#8B1A1A', bottom: '#4A0D0D' },
  { top: '#1a4f3a', bottom: '#0d2e20' },
  { top: '#7c2d12', bottom: '#431607' },
  { top: '#1e3a5f', bottom: '#0f1e33' },
  { top: '#4a1d6b', bottom: '#270d3c' },
  { top: '#5a3200', bottom: '#301a00' },
  { top: '#0f4c75', bottom: '#072640' },
  { top: '#1b4332', bottom: '#0a2318' },
  { top: '#6d2b2b', bottom: '#3b1414' },
];

const API_URL = 'https://hdrss-backend.onrender.com/api/course-page1';
const STORAGE_KEY = 'course_progress';
const COMPLETED_LEVELS_KEY = 'completed_levels';

export default function GurukulamPage1({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  // Load saved progress from storage
  const loadSavedProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return {};
    } catch (e) {
      console.log('Error loading progress:', e);
      return {};
    }
  };

  // Load completed levels to calculate progress
  const loadCompletedLevels = async (courseId) => {
    try {
      const saved = await AsyncStorage.getItem(COMPLETED_LEVELS_KEY);
      if (saved) {
        const completedData = JSON.parse(saved);
        return completedData[courseId] || [];
      }
      return [];
    } catch (e) {
      console.log('Error loading completed levels:', e);
      return [];
    }
  };

  // Fetch total levels for a course from API
  const fetchTotalLevels = async (courseId) => {
    try {
      const response = await fetch(`https://hdrss-backend.onrender.com/api/course-page2/by-course/${courseId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data.length : 0;
    } catch (error) {
      console.log('Error fetching total levels:', error);
      return 0;
    }
  };

  // Calculate progress for a course
  const calculateCourseProgress = async (courseId) => {
    try {
      const completedLevels = await loadCompletedLevels(courseId);
      const totalLevels = await fetchTotalLevels(courseId);
      
      if (totalLevels === 0) return 0;
      
      const progress = Math.round((completedLevels.length / totalLevels) * 100);
      
      // Save progress to storage
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const progressData = saved ? JSON.parse(saved) : {};
      progressData[courseId] = progress;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
      
      return progress;
    } catch (error) {
      console.log('Error calculating progress:', error);
      return 0;
    }
  };

  // Map API response to match component expectations
  const mapApiResponse = (apiData) => {
    if (!Array.isArray(apiData)) return [];
    
    return apiData.map(item => ({
      id: String(item.id || item._id),
      coursename: item.coursename || item.title || item.name || 'Untitled Course',
      imageurl: item.imageurl || item.image || item.thumbnail || item.banner || null,
      orderno: item.orderno || item.order || 0,
      progress: 0,
      icon: item.icon || 'book-outline'
    }));
  };

  // Fetch courses from API
  const fetchCourses = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      
      let rawData = Array.isArray(json) ? json : json?.data ?? [];
      let mappedData = mapApiResponse(rawData);
      
      if (mappedData.length === 0) {
        setError(true);
        setCourses([]);
        setLoading(false);
        return;
      }

      // Calculate progress for each course
      const coursesWithProgress = await Promise.all(
        mappedData.map(async (course) => {
          const progress = await calculateCourseProgress(course.id);
          return {
            ...course,
            progress: progress
          };
        })
      );

      const sortedList = coursesWithProgress.sort((a, b) => (a.orderno ?? 0) - (b.orderno ?? 0));
      
      setCourses(sortedList);
    } catch (e) {
      console.log('GurukulamPage1 fetch error:', e);
      setError(true);
      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch courses when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCourses();
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  // Initial load
  useEffect(() => {
    fetchCourses();
  }, []);

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  // ── Card ─────────────────────────────────────────────────────────
  const renderCard = ({ item, index }) => {
    const palette = BANNER_PALETTES[index % BANNER_PALETTES.length];
    const progress = item.progress ?? 0;
    const hasImage = !!(item.imageurl || item.image || item.thumbnail || item.banner);
    const imageUri = item.imageurl || item.image || item.thumbnail || item.banner;
    const label = (item.coursename || 'Untitled')
      .split(' ').slice(0, 4).join(' ');

    const isCompleted = progress >= 100;
    const isNew = progress === 0;

    return (
      <TouchableOpacity
        style={[styles.card, { width: CARD_W }]}
        activeOpacity={0.78}
        onPress={() =>
          navigation.navigate('GurukulamPage2', {
            courseId: item.id,
            courseName: item.coursename,
            currentProgress: progress,
          })
        }
      >
        {/* ── Banner ── */}
        <View style={[styles.banner, { backgroundColor: palette.top, width: CARD_W, height: CARD_W * 0.92 }]}>
          {hasImage ? (
            <Image 
              source={{ uri: imageUri }} 
              style={StyleSheet.absoluteFill} 
              resizeMode="cover" 
            />
          ) : (
            <>
              <View style={[styles.diagonalStripe, { backgroundColor: palette.bottom }]} />
              <View style={styles.iconCircle}>
                <Ionicons
                  name={item.icon || 'book-outline'}
                  size={isTablet ? 22 : 19}
                  color={C.goldLight}
                />
              </View>
            </>
          )}

          {hasImage && <View style={styles.imgOverlay} />}
          <View style={styles.goldTopLine} />

          {/* Status badge */}
          {isCompleted ? (
            <View style={[styles.badge, styles.badgeDone]}>
              <Ionicons name="checkmark" size={8} color="#fff" />
              <Text style={styles.badgeTxt}>DONE</Text>
            </View>
          ) : isNew ? (
            <View style={[styles.badge, styles.badgeNew]}>
              <Text style={styles.badgeTxt}>NEW</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeTrack]}>
              <Text style={styles.badgeTxt}>{Math.round(progress)}%</Text>
            </View>
          )}

          {/* Progress row */}
          <View style={styles.progRow}>
            <View style={styles.progTrack}>
              <View style={[styles.progBar, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>{label}</Text>
          <View style={styles.footer}>
            <Text style={styles.pctTxt}>{Math.round(progress)}%</Text>
            <View style={[styles.arrowBtn, isCompleted && styles.arrowBtnDone]}>
              <Ionicons
                name={isCompleted ? 'checkmark' : 'arrow-forward'}
                size={isTablet ? 9 : 8}
                color="#fff"
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Loading ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={C.primaryDeep} barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={isTablet ? 24 : 20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Gurukulam</Text>
          </View>
          <View style={{ width: isTablet ? 42 : 36 }} />
        </View>
        <Loader />
      </View>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────
  if (error && courses.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={C.primaryDeep} barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={isTablet ? 24 : 20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Gurukulam</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
            <Ionicons name="refresh-outline" size={isTablet ? 22 : 18} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={isTablet ? 80 : 60} color={C.textLight} />
          <Text style={styles.errorTitle}>Unable to Load Courses</Text>
          <Text style={styles.errorSub}>Please check your internet connection and try again</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={C.primaryDeep} barStyle="light-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={isTablet ? 24 : 20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Gurukulam</Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={isTablet ? 22 : 18} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        key={`cols-${NUM_COLS}`}
        data={courses}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        numColumns={NUM_COLS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[C.gold]}
            tintColor={C.gold}
          />
        }
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <View style={styles.sectionPill} />
            <Text style={styles.sectionTitle}>Available Courses</Text>
            <View style={styles.countPill}>
              <Text style={styles.countTxt}>{courses.length}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="book-outline" size={32} color={C.gold} />
            </View>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptySub}>Check back soon</Text>
          </View>
        }
      />

      {/* Error banner */}
      {error && courses.length > 0 && (
        <View style={styles.errorBanner}>
          <Ionicons name="wifi-outline" size={12} color={C.gold} />
          <Text style={styles.errorTxt}>Some courses may not be up to date</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: C.bg 
  },

  header: {
    backgroundColor: C.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: isTablet ? 24 : 20,
    paddingHorizontal: isTablet ? 24 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: isTablet ? 30 : 25,
    borderBottomRightRadius: isTablet ? 30 : 25,
    elevation: isTablet ? 6 : 4,
    shadowColor: C.primaryDeep,
    shadowOffset: { width: 0, height: isTablet ? 4 : 2 },
    shadowOpacity: isTablet ? 0.3 : 0.2,
    shadowRadius: isTablet ? 8 : 4,
  },

  backBtn: {
    width: isTablet ? 44 : 36,
    height: isTablet ? 44 : 36,
    borderRadius: isTablet ? 22 : 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  refreshBtn: {
    width: isTablet ? 44 : 36,
    height: isTablet ? 44 : 36,
    borderRadius: isTablet ? 22 : 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  headerCenter: { 
    flex: 1, 
    alignItems: 'center' 
  },

  headerTitle: {
    color: '#fff',
    fontSize: isTablet ? 24 : 19,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: isTablet ? 24 : 18,
    paddingBottom: isTablet ? 16 : 12,
    gap: isTablet ? 12 : 8,
  },

  sectionPill: {
    width: isTablet ? 5 : 4,
    height: isTablet ? 24 : 18,
    borderRadius: 3,
    backgroundColor: C.gold,
  },

  sectionTitle: {
    fontSize: isTablet ? 18 : 15,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: 0.3,
  },

  countPill: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingHorizontal: isTablet ? 12 : 8,
    paddingVertical: isTablet ? 4 : 2,
    marginLeft: isTablet ? 8 : 4,
  },

  countTxt: { 
    fontSize: isTablet ? 13 : 11, 
    color: '#fff', 
    fontWeight: '700' 
  },

  listContent: {
    paddingHorizontal: H_PAD,
    paddingTop: 4,
    paddingBottom: 44,
  },

  row: { 
    gap: GAP, 
    marginBottom: GAP + 4 
  },

  card: {
    backgroundColor: C.surface,
    borderRadius: isTablet ? 16 : 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    elevation: isTablet ? 6 : 5,
    shadowColor: C.primaryDeep,
    shadowOffset: { width: 0, height: isTablet ? 6 : 4 },
    shadowOpacity: isTablet ? 0.16 : 0.14,
    shadowRadius: isTablet ? 8 : 6,
  },

  banner: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  diagonalStripe: {
    position: 'absolute',
    bottom: -20, 
    right: -20,
    width: CARD_W * 0.7,
    height: CARD_W * 0.7,
    borderRadius: 10,
    opacity: 0.45,
    transform: [{ rotate: '25deg' }],
  },

  iconCircle: {
    width: isTablet ? 50 : 40,
    height: isTablet ? 50 : 40,
    borderRadius: isTablet ? 25 : 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(212,175,55,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  goldTopLine: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0,
    height: isTablet ? 3 : 2.5,
    backgroundColor: C.gold,
    opacity: 0.85,
  },

  badge: {
    position: 'absolute',
    top: isTablet ? 10 : 7, 
    left: isTablet ? 10 : 7,
    borderRadius: isTablet ? 8 : 6,
    paddingHorizontal: isTablet ? 8 : 5,
    paddingVertical: isTablet ? 4 : 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: isTablet ? 4 : 2,
  },

  badgeTrack: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.15)',
  },

  badgeNew: {
    backgroundColor: C.gold,
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  badgeDone: {
    backgroundColor: '#2d7a45',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#2d7a45',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  badgeTxt: { 
    color: '#fff', 
    fontSize: isTablet ? 9 : 8, 
    fontWeight: '800', 
    letterSpacing: 0.5 
  },

  progRow: {
    position: 'absolute',
    bottom: 0, 
    left: 0, 
    right: 0,
    paddingHorizontal: 0,
  },

  progTrack: {
    height: isTablet ? 4 : 3.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  progBar: {
    height: isTablet ? 4 : 3.5,
    backgroundColor: C.gold,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },

  body: {
    paddingHorizontal: isTablet ? 10 : 7,
    paddingTop: isTablet ? 10 : 7,
    paddingBottom: isTablet ? 10 : 8,
  },

  title: {
    fontSize: isTablet ? 11 : 9.5,
    fontWeight: '700',
    color: C.textDark,
    lineHeight: isTablet ? 15 : 13,
    marginBottom: isTablet ? 8 : 6,
    letterSpacing: 0.1,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pctTxt: {
    fontSize: isTablet ? 10 : 9,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 0.3,
  },

  arrowBtn: {
    width: isTablet ? 18 : 15,
    height: isTablet ? 18 : 15,
    borderRadius: 99,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },

  arrowBtnDone: {
    backgroundColor: '#2d7a45',
    shadowColor: '#2d7a45',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },

  errorTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '700',
    color: C.textDark,
    marginTop: 8,
  },

  errorSub: {
    fontSize: isTablet ? 16 : 14,
    color: C.textLight,
    textAlign: 'center',
    maxWidth: isTablet ? 400 : 300,
  },

  retryBtn: {
    backgroundColor: C.primary,
    paddingVertical: isTablet ? 14 : 10,
    paddingHorizontal: isTablet ? 40 : 30,
    borderRadius: isTablet ? 12 : 10,
    marginTop: 8,
  },

  retryBtnText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '700',
  },

  emptyWrap: { 
    alignItems: 'center', 
    paddingVertical: isTablet ? 100 : 70, 
    gap: isTablet ? 14 : 10 
  },

  emptyIcon: {
    width: isTablet ? 80 : 68, 
    height: isTablet ? 80 : 68, 
    borderRadius: isTablet ? 40 : 34,
    backgroundColor: C.primaryDeep,
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: isTablet ? 8 : 4,
    borderWidth: isTablet ? 3 : 2, 
    borderColor: C.gold,
  },

  emptyTitle: { 
    fontSize: isTablet ? 20 : 16, 
    fontWeight: '700', 
    color: C.textDark 
  },

  emptySub: { 
    fontSize: isTablet ? 16 : 13, 
    color: C.textLight 
  },

  errorBanner: {
    position: 'absolute',
    bottom: isTablet ? 24 : 16, 
    alignSelf: 'center',
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: isTablet ? 10 : 6,
    backgroundColor: C.primaryDeep,
    paddingHorizontal: isTablet ? 20 : 16, 
    paddingVertical: isTablet ? 12 : 8,
    borderRadius: isTablet ? 24 : 20,
    borderWidth: isTablet ? 2 : 1, 
    borderColor: C.gold,
    shadowColor: C.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  errorTxt: { 
    fontSize: isTablet ? 13 : 11, 
    color: '#fff', 
    fontWeight: '500' 
  },
});