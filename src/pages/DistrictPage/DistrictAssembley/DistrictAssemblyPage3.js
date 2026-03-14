import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  Platform,
  Linking,
  Alert,
  SafeAreaView,
  SectionList,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Loader from '../../../components/Alert/Loader';

const PRIMARY      = '#8B0000';
const PRIMARY_SOFT = 'rgba(139,0,0,0.08)';
const GOLD         = '#C8922A';
const BG           = '#F4F1EE';

const DistrictAssemblyPage3 = () => {
  const route      = useRoute();
  const navigation = useNavigation();
  const { districtId } = route.params || {};
  const { width }  = useWindowDimensions();
  const isTablet   = width >= 600;

  const [allSections,      setAllSections]      = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [activeFilter,     setActiveFilter]     = useState('All');
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);

  const listRef = useRef(null);

  useEffect(() => { fetchLeaders(); }, [districtId]);

  const fetchLeaders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `https://hdrss-backend.onrender.com/api/districtAssembly/${districtId}`
      );
      if (res.data.success && Array.isArray(res.data.data)) {
        const grouped = {};
        res.data.data.forEach((item) => {
          const role = item.role || 'Other';
          if (!grouped[role]) grouped[role] = [];
          grouped[role].push(item);
        });
        const sections = Object.keys(grouped).map((role) => ({
          title: role,
          data: grouped[role],
        }));
        setAllSections(sections);
        setFilteredSections(sections);
      } else {
        setAllSections([]);
        setFilteredSections([]);
      }
    } catch {
      setError('Failed to load representatives. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (role) => {
    setActiveFilter(role);
    const next = role === 'All' ? allSections : allSections.filter((s) => s.title === role);
    setFilteredSections(next);
    try {
      listRef.current?.scrollToLocation({ sectionIndex: 0, itemIndex: 0, animated: true });
    } catch (_) {}
  };

  const handleCall = (phone) =>
    phone ? Linking.openURL(`tel:${phone}`) : Alert.alert('Info', 'Phone number not available');

  const handleDirections = (loc) =>
    loc
      ? Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(loc)}`)
      : Alert.alert('Info', 'Location not available');

  /* ── Filter Chips ── */
  const renderFilterBar = () => {
    const roles = ['All', ...allSections.map((s) => s.title)];
    return (
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBar}
        >
          {roles.map((role) => {
            const active = activeFilter === role;
            return (
              <TouchableOpacity
                key={role}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => handleFilter(role)}
                activeOpacity={0.75}
              >
                {active && <View style={styles.chipDot} />}
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {role}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  /* ── Card ── */
  const renderItem = ({ item }) => {
    const imgSize = isTablet ? 120 : 95;
    return (
      <TouchableOpacity
        style={[styles.card, isTablet && styles.cardTablet]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('DistrictAssembly4', { leaderData: item })}
      >
        {/* Photo */}
        <View style={[styles.photoWrap, { width: imgSize, height: imgSize, borderRadius: 14 }]}>
          <Image
            source={{
              uri: item.image || 'https://via.placeholder.com/300x300/f0f0f0/8B0000?text=Photo',
            }}
            style={{ width: imgSize, height: imgSize, borderRadius: 14 }}
            resizeMode="cover"
          />
        </View>
        
        {/* Info */}
        <View style={styles.info}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText} numberOfLines={1}>
              {item.role || 'Member'}
            </Text>
          </View>

          <Text style={[styles.name, isTablet && styles.nameTablet]} numberOfLines={2}>
            {item.name || 'Name not available'}
          </Text>

          {item.role === 'Councilor' && item.Vartu ? (
            <View style={styles.wardRow}>
              <Ionicons name="location-outline" size={12} color={GOLD} />
              <Text style={styles.wardText}>Ward No: {item.Vartu}</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            {item.phoneNumber ? (
              <TouchableOpacity
                style={styles.callBtn}
                onPress={(e) => { e.stopPropagation(); handleCall(item.phoneNumber); }}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={12} color="#fff" />
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>
            ) : null}

            {item.location ? (
              <TouchableOpacity
                style={styles.dirBtn}
                onPress={(e) => { e.stopPropagation(); handleDirections(item.location); }}
                activeOpacity={0.8}
              >
                <Ionicons name="navigate-outline" size={12} color={PRIMARY} />
                <Text style={styles.dirBtnText}>Directions</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Chevron */}
        <Ionicons
          name="chevron-forward"
          size={16}
          color="rgba(139,0,0,0.25)"
          style={styles.chevron}
        />
      </TouchableOpacity>
    );
  };

  /* ── Section Header ── */
  const renderSectionHeader = ({ section: { title, data } }) => (
    <View style={[styles.sectionHeader, isTablet && styles.sectionHeaderTablet]}>
      <View style={styles.sectionAccent} />
      <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
        {title}
      </Text>
    </View>
  );

  /* ── Top Header ── */
  const renderHeader = () => {
    // const totalMembers = allSections.reduce((acc, s) => acc + s.data.length, 0);
    return (
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
            Elected Representatives
          </Text>
        </View>

        <View style={{ width: isTablet ? 44 : 40 }} />
      </View>
    );
  };

  /* ── Screens ── */
  if (loading) return <Loader />;

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar backgroundColor={PRIMARY} barStyle="light-content" />
        <View style={styles.center}>
          <View style={styles.errorIconWrap}>
            <Ionicons name="alert-circle-outline" size={38} color={PRIMARY} />
          </View>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMsg}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchLeaders}>
            <Ionicons name="refresh" size={15} color="#fff" />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={PRIMARY} barStyle="light-content" />
      <View style={styles.container}>
        {renderHeader()}
        {renderFilterBar()}

        <SectionList
          ref={listRef}
          sections={filteredSections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          contentContainerStyle={[styles.list, isTablet && styles.listTablet]}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="people-outline" size={56} color="#ccc" />
              <Text style={styles.emptyTitle}>No representatives found</Text>
              <Text style={styles.emptyMsg}>Try selecting a different role</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 40 }} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: PRIMARY },
  container: { flex: 1, backgroundColor: BG },

  /* Header */
  header: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 36,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  headerTablet: {
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'ios' ? 12 : 44,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  headerTitleTablet: { fontSize: 22 },
  headerSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },

  /* Filter */
  filterWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: BG,
    borderWidth: 1.5,
    borderColor: 'rgba(139,0,0,0.2)',
    gap: 6,
  },
  chipActive:     { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipDot:        { width: 6, height: 6, borderRadius: 3, backgroundColor: GOLD },
  chipText:       { fontSize: 13, fontWeight: '700', color: PRIMARY },
  chipTextActive: { color: '#fff' },

  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 16,
    gap: 10,
  },
  sectionHeaderTablet: { marginHorizontal: 32, marginTop: 28, marginBottom: 14 },
  sectionAccent: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: GOLD,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: '#444',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  sectionTitleTablet: { fontSize: 15 },


  /* List */
  list:       { paddingBottom: 16 },
  listTablet: { paddingBottom: 32 },

  /* Card */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 18,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardTablet: {
    marginHorizontal: 32,
    padding: 18,
    marginBottom: 14,
    borderRadius: 22,
    elevation: 3,
  },

  /* Photo */
  photoWrap: { position: 'relative', overflow: 'hidden' },

  /* Info */
  info: { flex: 1, marginLeft: 14, gap: 5 },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: PRIMARY,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 21,
  },
  nameTablet:  { fontSize: 18, lineHeight: 26 },
  wardRow:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  wardText:    { fontSize: 12, color: '#888', fontWeight: '600' },

  /* Buttons */
  actions:     { flexDirection: 'row', gap: 8, marginTop: 4 },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  callBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  dirBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: PRIMARY,
    backgroundColor: PRIMARY_SOFT,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  dirBtnText:  { color: PRIMARY, fontSize: 12, fontWeight: '700' },
  chevron:     { marginLeft: 4 },

  /* States */
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  errorIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: PRIMARY_SOFT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle:  { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  errorMsg:    { fontSize: 14, color: '#777', textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: PRIMARY,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    elevation: 3,
  },
  retryText:   { color: '#fff', fontSize: 14, fontWeight: '700' },
  emptyTitle:  { fontSize: 16, fontWeight: '800', color: '#555', marginTop: 16, marginBottom: 4 },
  emptyMsg:    { fontSize: 13, color: '#aaa', textAlign: 'center' },
});

export default DistrictAssemblyPage3;