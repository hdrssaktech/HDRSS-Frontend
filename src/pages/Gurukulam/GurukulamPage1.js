import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, FlatList,
  TouchableOpacity, ActivityIndicator,
  StatusBar, Dimensions, Platform, Image,
  RefreshControl
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const isTablet = width >= 600;
const NUM_COLS = 3;
const H_PAD = isTablet ? 20 : 14;
const GAP = isTablet ? 10 : 8;
const CARD_W = (width - H_PAD * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

const C = {
  primary:     '#8B1A1A',
  primaryDeep: '#4A0D0D',
  primaryMid:  '#6B1414',
  gold:        '#D4AF37',
  goldLight:   '#F0D060',
  goldPale:    '#FDF6DC',
  bg:          '#F2EBE8',
  surface:     '#FFFFFF',
  textDark:    '#1A0A0A',
  textMid:     '#5C3A3A',
  textLight:   '#9E7070',
  border:      '#EDE0DC',
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

const DEMO_COURSES = [
  { _id: 'c1', coursename: 'React Native', orderno: 1, progress: 0, icon: 'phone-portrait-outline' },
  { _id: 'c2', coursename: 'Node.js', orderno: 2, progress: 0, icon: 'server-outline' },
  { _id: 'c3', coursename: 'Mobile UI/UX', orderno: 3, progress: 0, icon: 'color-palette-outline' },
  { _id: 'c4', coursename: 'MongoDB', orderno: 4, progress: 0, icon: 'server-outline' },
  { _id: 'c5', coursename: 'TypeScript', orderno: 5, progress: 0, icon: 'code-slash-outline' },
  { _id: 'c6', coursename: 'Cloud Deployment', orderno: 6, progress: 0, icon: 'cloud-outline' },
];

const API_URL = 'https://hdrss-backend.onrender.com/api/course-page1';
const STORAGE_KEY = 'course_progress';

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

  // Fetch courses from API
  const fetchCourses = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      let list = Array.isArray(json) ? json : json?.data ?? [];
      
      if (list.length === 0) {
        list = DEMO_COURSES;
      }

      // Load saved progress
      const savedProgress = await loadSavedProgress();
      
      // Merge saved progress with course data
      const updatedList = list.map(course => ({
        ...course,
        progress: savedProgress[course._id] || course.progress || 0
      }));

      setCourses(updatedList);
    } catch (e) {
      console.log('GurukulamPage1 fetch error:', e);
      // Use demo data with saved progress
      const savedProgress = await loadSavedProgress();
      const demoWithProgress = DEMO_COURSES.map(course => ({
        ...course,
        progress: savedProgress[course._id] || 0
      }));
      setCourses(demoWithProgress);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  // Handle progress update from child component
  const handleProgressUpdate = async (courseId, progress) => {
    // Update local state
    const updatedCourses = courses.map(course => {
      if (course._id === courseId) {
        return { ...course, progress: progress };
      }
      return course;
    });
    setCourses(updatedCourses);

    // Save progress to storage
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const progressData = saved ? JSON.parse(saved) : {};
      progressData[courseId] = progress;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    } catch (e) {
      console.log('Error saving progress:', e);
    }
  };

  // Sort courses by order number
  const sorted = [...courses].sort((a, b) => (a.orderno ?? 0) - (b.orderno ?? 0));

  // ── Card ─────────────────────────────────────────────────────────
  const renderCard = ({ item, index }) => {
    const palette = BANNER_PALETTES[index % BANNER_PALETTES.length];
    const progress = item.progress ?? 0;
    const hasImage = !!item.image || !!item.thumbnail || !!item.banner;
    const imageUri = item.image || item.thumbnail || item.banner;
    const label = (item.coursename || item.title || item.name || 'Untitled')
      .split(' ').slice(0, 4).join(' ');

    const isCompleted = progress >= 100;
    const isNew = progress === 0;

    return (
      <TouchableOpacity
        style={[styles.card, { width: CARD_W }]}
        activeOpacity={0.78}
        onPress={() =>
          navigation.navigate('GurukulamPage2', {
            courseId: item._id || item.id,
            courseName: item.coursename || item.title || item.name,
            currentProgress: progress,
          })
        }
      >
        {/* ── Banner ── */}
        <View style={[styles.banner, { backgroundColor: palette.top, width: CARD_W, height: CARD_W * 0.92 }]}>
          {hasImage ? (
            <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
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
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={isTablet ? 24 : 20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Gurukulam</Text>
          </View>
          <View style={{ width: isTablet ? 42 : 36 }} />
        </View>
        <View style={styles.center}>
          <View style={styles.loadingRing}>
            <ActivityIndicator size="large" color={C.gold} />
          </View>
          <Text style={styles.loadingTxt}>Loading tracks…</Text>
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
        data={sorted}
        keyExtractor={(item) => String(item._id || item.id)}
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
            <Text style={styles.sectionTitle}>All Tracks</Text>
            <View style={styles.countPill}>
              <Text style={styles.countTxt}>{sorted.length}</Text>
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
      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="wifi-outline" size={12} color={C.gold} />
          <Text style={styles.errorTxt}>Showing demo data — server unreachable</Text>
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

  center: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: C.bg, 
    gap: 14,
  },
  
  loadingRing: {
    width: 72, 
    height: 72, 
    borderRadius: 36,
    backgroundColor: C.primaryDeep,
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: C.gold,
  },
  
  loadingTxt: { 
    fontSize: 13, 
    color: C.textLight, 
    fontWeight: '600', 
    letterSpacing: 0.5 
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    backgroundColor: "#8B1A1A",
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  backBtn: {
    width: isTablet ? 42 : 36,
    height: isTablet ? 42 : 36,
    borderRadius: isTablet ? 21 : 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  refreshBtn: {
    width: isTablet ? 42 : 36,
    height: isTablet ? 42 : 36,
    borderRadius: isTablet ? 21 : 18,
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
    fontSize: isTablet ? 22 : 19,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // ── Section header ───────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 12,
    gap: 8,
  },
  
  sectionPill: {
    width: 4, 
    height: 18, 
    borderRadius: 3,
    backgroundColor: C.gold,
  },
  
  sectionTitle: {
    fontSize: 15, 
    fontWeight: '800',
    color: C.textDark, 
    letterSpacing: 0.3,
  },
  
  countPill: {
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  
  countTxt: { 
    fontSize: 11, 
    color: '#fff', 
    fontWeight: '700' 
  },

  // ── Grid ─────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: H_PAD,
    paddingTop: 4,
    paddingBottom: 44,
  },
  
  row: { 
    gap: GAP, 
    marginBottom: GAP + 4 
  },

  // ── Card ─────────────────────────────────────────────────
  card: {
    backgroundColor: C.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    elevation: 5,
    shadowColor: C.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
  },

  // Banner
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
    width: isTablet ? 46 : 40,
    height: isTablet ? 46 : 40,
    borderRadius: isTablet ? 23 : 20,
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
    height: 2.5,
    backgroundColor: C.gold,
    opacity: 0.85,
  },

  // Badge (top-left corner)
  badge: {
    position: 'absolute',
    top: 7, 
    left: 7,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  
  badgeTrack: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.15)',
  },
  
  badgeNew: {
    backgroundColor: C.gold,
  },
  
  badgeDone: {
    backgroundColor: '#2d7a45',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.2)',
  },
  
  badgeTxt: { 
    color: '#fff', 
    fontSize: 8, 
    fontWeight: '800', 
    letterSpacing: 0.4 
  },

  // Progress bar
  progRow: {
    position: 'absolute',
    bottom: 0, 
    left: 0, 
    right: 0,
    paddingHorizontal: 0,
  },
  
  progTrack: {
    height: 3.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  
  progBar: {
    height: 3.5,
    backgroundColor: C.gold,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },

  // Card body
  body: {
    paddingHorizontal: isTablet ? 8 : 7,
    paddingTop: 7,
    paddingBottom: 8,
  },
  
  title: {
    fontSize: isTablet ? 10 : 9.5,
    fontWeight: '700',
    color: C.textDark,
    lineHeight: 13,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  pctTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 0.3,
  },
  
  arrowBtn: {
    width: isTablet ? 16 : 15,
    height: isTablet ? 16 : 15,
    borderRadius: 99,
    backgroundColor: C.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  arrowBtnDone: {
    backgroundColor: '#2d7a45',
  },

  // Empty
  emptyWrap: { 
    alignItems: 'center', 
    paddingVertical: 70, 
    gap: 10 
  },
  
  emptyIcon: {
    width: 68, 
    height: 68, 
    borderRadius: 34,
    backgroundColor: C.primaryDeep,
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2, 
    borderColor: C.gold,
  },
  
  emptyTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: C.textDark 
  },
  
  emptySub: { 
    fontSize: 13, 
    color: C.textLight 
  },

  // Error banner
  errorBanner: {
    position: 'absolute',
    bottom: 16, 
    alignSelf: 'center',
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
    backgroundColor: C.primaryDeep,
    paddingHorizontal: 16, 
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1, 
    borderColor: C.gold,
  },
  
  errorTxt: { 
    fontSize: 11, 
    color: '#fff', 
    fontWeight: '500' 
  },
});