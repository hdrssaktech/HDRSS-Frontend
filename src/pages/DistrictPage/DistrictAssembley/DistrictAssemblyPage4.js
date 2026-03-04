import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList,
  Linking,
  Platform,
  useWindowDimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

const DistrictAssemblyPage4 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { leaderData } = route.params || {};
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const handlePhonePress = (phoneNumber) => {
    if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleLocationPress = (location) => {
    if (location) {
      const encodedLocation = encodeURIComponent(location);
      Linking.openURL(`https://maps.google.com/?q=${encodedLocation}`);
    }
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderGalleryItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.galleryItem, isTablet && styles.galleryItemTablet]}
      onPress={() => Linking.openURL(item)}
    >
      <Image source={{ uri: item }} style={[styles.galleryImage, isTablet && styles.galleryImageTablet]} />
    </TouchableOpacity>
  );

  const videoId = extractVideoId(leaderData?.Video);

  const getRoleIcon = (role) => {
    if (!role) return 'person-outline';
    const roleLower = role.toLowerCase();
    if (roleLower.includes('mp')) return 'globe-outline';
    if (roleLower.includes('mla')) return 'business-outline';
    if (roleLower.includes('minister')) return 'ribbon-outline';
    return 'person-outline';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      
      {/* Header - Fixed to match other pages exactly */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
            Leader Profile
          </Text>
        </View>
        
        <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={[styles.profileSection, isTablet && styles.profileSectionTablet]}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: leaderData?.image || 'https://via.placeholder.com/150' }}
              style={[styles.profileImage, isTablet && styles.profileImageTablet]}
            />
          </View>
          
          <Text style={[styles.name, isTablet && styles.nameTablet]}>{leaderData?.name || 'Name not available'}</Text>
          
          <View style={styles.partyBadge}>
            <Text style={[styles.partyText, isTablet && styles.partyTextTablet]}>
              {leaderData?.title || 'Party'} - {leaderData?.role || 'Unknown'}
            </Text>
          </View>
          
          {/* Action Icons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handlePhonePress(leaderData?.phoneNumber)}
            >
              <View style={[styles.iconCircle, isTablet && styles.iconCircleTablet]}>
                <Ionicons name="call" size={isTablet ? 28 : 24} color="#8B0000" />
              </View>
              <Text style={[styles.actionText, isTablet && styles.actionTextTablet]}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLocationPress(leaderData?.location)}
            >
              <View style={[styles.iconCircle, isTablet && styles.iconCircleTablet]}>
                <Ionicons name="location" size={isTablet ? 28 : 24} color="#8B0000" />
              </View>
              <Text style={[styles.actionText, isTablet && styles.actionTextTablet]}>Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator} />

        {/* About Section */}
        {leaderData?.about && (
          <View style={[styles.aboutSection, isTablet && styles.aboutSectionTablet]}>
            <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>About</Text>
            <Text style={[styles.aboutText, isTablet && styles.aboutTextTablet]} numberOfLines={aboutExpanded ? undefined : 4}>
              {leaderData.about}
            </Text>
            <TouchableOpacity 
              style={styles.readMoreButton}
              onPress={() => setAboutExpanded(!aboutExpanded)}
            >
              <Text style={[styles.readMoreText, isTablet && styles.readMoreTextTablet]}>
                {aboutExpanded ? 'Read Less' : 'Read More'}
              </Text>
              <Ionicons 
                name={aboutExpanded ? 'chevron-up' : 'chevron-down'} 
                size={isTablet ? 20 : 18} 
                color="#8B0000" 
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.separator} />

        {/* Gallery Section */}
        {leaderData?.Gallery && leaderData.Gallery.length > 0 && (
          <View style={[styles.gallerySection, isTablet && styles.gallerySectionTablet]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>Gallery</Text>
              <Text style={[styles.galleryCount, isTablet && styles.galleryCountTablet]}>
                {leaderData.Gallery.length} photos
              </Text>
            </View>
            <FlatList
              data={leaderData.Gallery}
              renderItem={renderGalleryItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContainer}
            />
          </View>
        )}

        <View style={styles.separator} />

        {/* Video Section */}
        {videoId && (
          <View style={styles.videoSection}>
            <View style={[styles.videoHeader, isTablet && styles.videoHeaderTablet]}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>Video</Text>
            </View>
            <View style={styles.videoWrapper}>
              <YoutubePlayer
                height={isTablet ? 400 : 200}
                width={width}
                videoId={videoId}
                play={playing}
                onChangeState={(event) => {
                  if (event === 'playing') setPlaying(true);
                  else if (event === 'paused') setPlaying(false);
                }}
              />
            </View>
          </View>
        )}
        
        <View style={[styles.bottomSpacing, isTablet && styles.bottomSpacingTablet]} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#8B0000' 
  },
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  
  // Header - Exactly matching other pages
  header: {
    backgroundColor: '#8B0000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTablet: {
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  headerTitleTablet: {
    fontSize: 26,
  },
  headerSpacer: {
    width: 40,
  },
  headerSpacerTablet: {
    width: 50,
  },
  
  // Profile Section
  profileSection: { 
    padding: 20, 
    alignItems: 'center', 
    backgroundColor: '#ffffff' 
  },
  profileSectionTablet: { 
    padding: 30 
  },
  profileImageContainer: { 
    marginBottom: 16 
  },
  profileImage: { 
    width: 160, 
    height: 160, 
    borderRadius: 80, 
    borderWidth: 4, 
    borderColor: '#8B0000' 
  },
  profileImageTablet: { 
    width: 200, 
    height: 200, 
    borderRadius: 100,
    borderWidth: 5 
  },
  name: { 
    fontSize: 23, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  nameTablet: { 
    fontSize: 32,
    marginBottom: 12 
  },
  
  partyBadge: {
    backgroundColor: 'rgba(139, 0, 0, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 20,
  },
  partyText: { 
    fontSize: 16, 
    color: '#8B0000', 
    fontWeight: '600' 
  },
  partyTextTablet: { 
    fontSize: 18 
  },
  
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    width: '100%', 
    marginBottom: 0 
  },
  actionButton: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginHorizontal: 25 
  },
  iconCircle: {
    width: 60, 
    height: 60, 
    borderRadius: 30,
    backgroundColor: 'rgba(139, 0, 0, 0.1)',
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 6, 
    borderWidth: 1, 
    borderColor: 'rgba(139, 0, 0, 0.2)',
  },
  iconCircleTablet: { 
    width: 75, 
    height: 75, 
    borderRadius: 37.5 
  },
  actionText: { 
    fontSize: 14, 
    color: '#8B0000', 
    fontWeight: '500' 
  },
  actionTextTablet: { 
    fontSize: 16 
  },
  
  separator: { 
    height: 10, 
    backgroundColor: '#f5f5f5', 
    width: '100%' 
  },
  
  aboutSection: { 
    padding: 20, 
    backgroundColor: '#ffffff' 
  },
  aboutSectionTablet: { 
    padding: 30 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 12 
  },
  sectionTitleTablet: { 
    fontSize: 24, 
    marginBottom: 16 
  },
  aboutText: { 
    fontSize: 16, 
    color: '#666', 
    lineHeight: 24, 
    marginBottom: 12 
  },
  aboutTextTablet: { 
    fontSize: 18, 
    lineHeight: 28 
  },
  readMoreButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start' 
  },
  readMoreText: { 
    fontSize: 16, 
    color: '#8B0000', 
    fontWeight: '600', 
    marginRight: 4 
  },
  readMoreTextTablet: { 
    fontSize: 18 
  },
  
  gallerySection: { 
    padding: 20, 
    backgroundColor: '#ffffff' 
  },
  gallerySectionTablet: { 
    padding: 30 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  galleryCount: { 
    fontSize: 16, 
    color: '#8B0000', 
    fontWeight: '500' 
  },
  galleryCountTablet: { 
    fontSize: 18 
  },
  galleryContainer: { 
    paddingRight: 20 
  },
  galleryItem: { 
    marginRight: 15, 
    borderRadius: 12, 
    overflow: 'hidden' 
  },
  galleryItemTablet: { 
    marginRight: 18 
  },
  galleryImage: { 
    width: 120, 
    height: 120 
  },
  galleryImageTablet: { 
    width: 150, 
    height: 150 
  },
  
  // Video Section
  videoSection: { 
    backgroundColor: '#ffffff' 
  },
  videoHeader: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 15, 
    backgroundColor: '#ffffff' 
  },
  videoHeaderTablet: { 
    paddingHorizontal: 30, 
    paddingTop: 25, 
    paddingBottom: 18 
  },
  videoWrapper: { 
    width: '100%', 
    backgroundColor: '#000', 
    alignItems: 'center' 
  },
  
  bottomSpacing: { 
    height: 25 
  },
  bottomSpacingTablet: { 
    height: 35 
  },
});

export default DistrictAssemblyPage4;