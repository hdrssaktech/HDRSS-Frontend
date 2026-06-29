import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BhakthiNoolgal2 = ({ route, navigation }) => {
  const { book } = route.params;
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const detailItems = [
    { icon: 'list-outline', label: 'அதிகாரங்கள்', value: '18' },
    { icon: 'document-text-outline', label: 'பக்கங்கள்', value: '700' },
    { icon: 'language-outline', label: 'மொழி', value: 'தமிழ்' },
    { icon: 'pricetag-outline', label: 'வகை', value: book.category || 'பக்தி நூல்' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />

      {/* ── HEADER ── */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} numberOfLines={1}>
          {book.title}
        </Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO CARD ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroImageWrap}>
            <Image source={{ uri: book.image }} style={styles.heroImage} />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>எழுதியவர்: {book.author}</Text>
          </View>
        </View>

        {/* ── DESCRIPTION ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>நூல் விவரம்</Text>
            <View style={styles.sectionUnderline} />
          </View>
          <Text style={styles.description}>{book.tamilDescription || book.description}</Text>
        </View>

        {/* ── DETAILS GRID ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>நூல் விவரங்கள்</Text>
            <View style={styles.sectionUnderline} />
          </View>
          <View style={[styles.detailsGrid, isTablet && styles.detailsGridTablet]}>
            {detailItems.map((d) => (
              <View
                key={d.label}
                style={[styles.detailItem, isTablet ? styles.detailItemTablet : styles.detailItemMobile]}
              >
                <View style={styles.detailIcon}>
                  <Ionicons name={d.icon} size={18} color="#fff" />
                </View>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── SAMPLE CONTENT ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>மாதிரி உள்ளடக்கம்</Text>
            <View style={styles.sectionUnderline} />
          </View>
          <View style={styles.sampleBox}>
            <Ionicons name="quote" size={18} color="#93210A" style={styles.quoteIcon} />
            <Text style={styles.sampleContent}>
              ஆத்மா பிறப்பதில்லை; இறப்பதுமில்லை. இது பிறந்ததுமில்லை; பிறக்கப்போவதுமில்லை. இது
              பழமையானது; என்றும் இருக்கும்; உடல் கொல்லப்பட்டாலும் கொல்லப்படாது.
            </Text>
            <Text style={styles.sampleSource}>- பகவத் கீதை, அதிகாரம் 2, வரி 20</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.readButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('BhakthiNoolgal3', { book })}
        >
          <Ionicons name="book" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.readButtonText}>நூலை வாசிக்க</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF8DC' },

  /* ── HEADER ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#93210A',
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 18 },
  headerSide: { width: 44, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
    fontFamily: 'TamilFont',
    paddingHorizontal: 4,
  },
  headerTitleTablet: { fontSize: 22 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25 },

  /* ── SCROLL ── */
  scrollContent: { padding: 12, paddingBottom: 24 },
  scrollContentTablet: { paddingHorizontal: 40, maxWidth: 900, alignSelf: 'center', width: '100%' },

  /* ── HERO CARD ── */
  heroCard: {
    backgroundColor: '#FFF0EE',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  heroImageWrap: { width: '100%', aspectRatio: 1.6, backgroundColor: '#FFF8DC' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroInfo: { padding: 18, alignItems: 'center' },
  bookTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#93210A',
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: 'TamilFont',
  },
  bookAuthor: { fontSize: 14, color: '#8a7a78', textAlign: 'center', fontFamily: 'TamilFont' },

  /* ── SECTIONS ── */
  section: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionHeader: { marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#93210A', fontFamily: 'TamilFont' },
  sectionUnderline: { width: 44, height: 3, backgroundColor: '#93210A', marginTop: 6, borderRadius: 2 },
  description: { fontSize: 15, lineHeight: 26, color: '#444', textAlign: 'justify', fontFamily: 'TamilFont' },

  /* ── DETAILS GRID ── */
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  detailsGridTablet: { flexWrap: 'nowrap' },
  detailItem: {
    backgroundColor: '#FFF0EE',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(147,33,10,0.12)',
  },
  detailItemMobile: { width: '47%' },
  detailItemTablet: { flex: 1 },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#93210A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: { fontSize: 12, color: '#8a7a78', marginBottom: 3, fontFamily: 'TamilFont', textAlign: 'center' },
  detailValue: { fontSize: 15, fontWeight: '700', color: '#93210A', fontFamily: 'TamilFont' },

  /* ── SAMPLE CONTENT ── */
  sampleBox: {
    backgroundColor: '#FFF0EE',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#93210A',
  },
  quoteIcon: { marginBottom: 6 },
  sampleContent: { fontSize: 15, lineHeight: 26, color: '#444', fontStyle: 'italic', fontFamily: 'TamilFont', textAlign: 'justify' },
  sampleSource: { fontSize: 12, color: '#8a7a78', marginTop: 10, fontStyle: 'italic', textAlign: 'right', fontFamily: 'TamilFont' },

  /* ── FOOTER ── */
  footer: {
    padding: 16,
    backgroundColor: '#FFF8DC',
    borderTopWidth: 1,
    borderTopColor: 'rgba(147,33,10,0.1)',
  },
  readButton: {
    backgroundColor: '#93210A',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#93210A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  readButtonText: { color: '#fff', fontSize: 17, fontWeight: '800', fontFamily: 'TamilFont' },
});

export default BhakthiNoolgal2;