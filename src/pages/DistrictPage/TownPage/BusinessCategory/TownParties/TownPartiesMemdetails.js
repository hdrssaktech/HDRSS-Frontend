import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import YoutubePlayer from "react-native-youtube-iframe";

export default function TownPartiesMemberDetails() {
  const route = useRoute();
  const { member } = route.params;
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const isTablet = width >= 600;

  // Extract YouTube ID from URL
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = member.video ? getYoutubeId(member.video) : null;

  // Handle phone call
  const handleCall = () => {
    const phoneNumber = member.phoneNumber;
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not available");
      return;
    }

    let phoneUrl = `tel:${phoneNumber}`;
    
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device");
        }
      })
      .catch((err) => console.log("Error making call:", err));
  };

  // Handle location/directions
  const handleLocation = () => {
    const location = member.location;
    if (!location) {
      Alert.alert("Error", "Location not available");
      return;
    }

    // Try to open in Google Maps or Apple Maps
    const encodedLocation = encodeURIComponent(location);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    const appleMapsUrl = `http://maps.apple.com/?q=${encodedLocation}`;

    const url = Platform.OS === 'ios' ? appleMapsUrl : googleMapsUrl;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to browser
          return Linking.openURL(googleMapsUrl);
        }
      })
      .catch((err) => {
        console.log("Error opening maps:", err);
        Alert.alert("Error", "Could not open maps");
      });
  };

  // Share contact
  const handleShare = () => {
    const message = `Name: ${member.name}\nParty: ${member.parties}\nRole: ${member.role}\nPhone: ${member.phoneNumber}\nLocation: ${member.location}`;
    
    Linking.openURL(`sms:&body=${encodeURIComponent(message)}`)
      .catch(() => {
        Alert.alert("Error", "Could not open messaging app");
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* Header with Gradient */}
      <LinearGradient
        colors={['#93210A', '#93210A', '#93210A']}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Member Profile</Text>
        <TouchableOpacity 
          onPress={handleShare}
          style={styles.shareButton}
        >
          {/* <Ionicons name="share-social" size={22} color="#fff" /> */}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Profile Header Card */}
        <LinearGradient
          colors={['#fff', '#fff5f0']}
          style={styles.profileCard}
        >
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: member.image || "https://via.placeholder.com/150" }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.onlineBadge} />
          </View>

          <Text style={styles.name}>{member.name}</Text>
          
          <View style={styles.partyBadge}>
            <Ionicons name="flag" size={16} color="#FFD700" />
            <Text style={styles.partyText}>{member.parties}</Text>
          </View>

          <View style={styles.roleContainer}>
            <Ionicons name="briefcase" size={16} color="#93210A" />
            <Text style={styles.roleText}>{member.role}</Text>
          </View>
        </LinearGradient>

        {/* Quick Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.callButton]} 
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.actionGradient}
            >
              <Ionicons name="call" size={24} color="#fff" />
              <Text style={styles.actionText}>Call</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.locationButton]} 
            onPress={handleLocation}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.actionGradient}
            >
              <Ionicons name="navigate" size={24} color="#fff" />
              <Text style={styles.actionText}>Directions</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        {member.about && (
          <View style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <Ionicons name="information-circle" size={24} color="#93210A" />
              <Text style={styles.cardTitle}>About</Text>
            </View>
            <Text style={styles.aboutText}>{member.about}</Text>
          </View>
        )}

        {/* YouTube Video Section */}
        {videoId && (
          <View style={styles.videoCard}>
            <View style={styles.videoHeader}>
              <Ionicons name="logo-youtube" size={24} color="#FF0000" />
              <Text style={styles.cardTitle}>Interview Video</Text>
            </View>
            
            <View style={styles.youtubeContainer}>
              <YoutubePlayer
                height={isTablet ? 300 : 200}
                width={isTablet ?450 :320}
                play={false}
                videoId={videoId}
                webViewStyle={styles.youtubePlayer}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.03,
    paddingTop: Platform.OS === 'android' ? height * 0.04 : height * 0.07,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: width * 0.02,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Profile Card
  profileCard: {
    alignItems: 'center',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: height * 0.02,
  },
  avatar: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: (width * 0.1) / 2,  
    borderWidth:2,
    borderColor: '#93210A',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
  },
  partyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 33, 10, 0.1)',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.008,
    borderRadius: 20,
    marginBottom: height * 0.01,
    gap: width * 0.01,
  },
  partyText: {
    color: '#93210A',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  roleText: {
    color: '#666',
    fontSize: width * 0.035,
  },
  
  // Action Buttons
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
    gap: width * 0.03,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.015,
    gap: width * 0.02,
  },
  actionText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  callButton: {
    marginRight: width * 0.01,
  },
  locationButton: {
    marginLeft: width * 0.01,
  },
  
  // Cards
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    borderRadius: 15,
    padding: width * 0.05,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.015,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.012,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIconContainer: {
    width: width * 0.08,
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: width * 0.03,
  },
  infoLabel: {
    fontSize: width * 0.03,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: width * 0.04,
    color: '#333',
    fontWeight: '500',
  },
  
  // About Card
  aboutCard: {
    backgroundColor: '#fff',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    borderRadius: 15,
    padding: width * 0.05,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
    marginBottom: height * 0.015,
  },
  aboutText: {
    fontSize: width * 0.038,
    color: '#555',
    lineHeight: height * 0.025,
    textAlign: 'left',
  },
  
  // Video Card
  videoCard: {
    backgroundColor: '#fff',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    borderRadius: 15,
    padding: width * 0.05,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
    marginBottom: height * 0.015,
  },
  youtubeContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: height * 0.01,
  },
  youtubePlayer: {
    opacity: 0.99,
  },
  videoCaption: {
    fontSize: width * 0.03,
    color: '#666',
    textAlign: 'center',
    marginTop: height * 0.005,
  },
  
  // Footer
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.02,
    marginVertical: height * 0.03,
  },
  footerText: {
    color: '#999',
    fontSize: width * 0.035,
  },
});