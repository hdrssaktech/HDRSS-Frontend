import React from "react";
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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function TownPartiesMemberDetails({ route }) {
  const { member } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* Flexible Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Member Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Profile Image */}
          <Image
            source={{ uri: member.image || "https://via.placeholder.com/150" }}
            style={styles.avatar}
            resizeMode="cover"
          />

          {/* Name and Party */}
          <Text style={styles.name}>{member.name}</Text>
          <View style={styles.partyContainer}>
            <Ionicons name="flag-outline" size={16} color="#93210A" />
            <Text style={styles.party}>{member.parties}</Text>
          </View>

          {/* Role */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="briefcase-outline" size={22} color="#93210A" />
              <Text style={styles.infoText}>{member.role}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={22} color="#93210A" />
              <Text style={styles.infoText}>{member.location}</Text>
            </View>
          </View>

          {/* Contact */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={22} color="#93210A" />
              <Text style={styles.infoText}>{member.phoneNumber}</Text>
            </View>
          </View>

          {/* Title/Position */}
          {member.title && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={22} color="#93210A" />
                <Text style={styles.infoText}>{member.title}</Text>
              </View>
            </View>
          )}

          {/* About Section */}
          {member.about && (
            <View style={styles.aboutContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle-outline" size={22} color="#93210A" />
                <Text style={styles.sectionTitle}>About</Text>
              </View>
              <Text style={styles.aboutText}>{member.about}</Text>
            </View>
          )}

          {/* Video Link */}
          {member.video && (
            <TouchableOpacity style={styles.videoContainer}>
              <View style={styles.videoIconContainer}>
                <Ionicons name="play-circle" size={24} color="#fff" />
              </View>
              <Text style={styles.videoText}>Watch Video</Text>
            </TouchableOpacity>
          )}

          {/* Order Number (if needed) */}
          {/* {member.orderNo && (
            <View style={styles.orderContainer}>
              <Ionicons name="list-outline" size={18} color="#666" />
              <Text style={styles.orderText}>Order: {member.orderNo}</Text>
            </View>
          )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#93210A" 
  },
  
  // Header Styles
  header: {
    backgroundColor: "#93210A",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: height * 0.08,
  },
  backButton: {
    width: width * 0.08,
    alignItems: 'flex-start',
    paddingTop:30,
  },
  headerTitle: { 
    color: "#fff", 
    fontSize: width * 0.05, 
    fontWeight: "bold",
    textAlign: 'center',
    paddingTop:30,
    flex: 1,
  },
  placeholder: { 
    width: width * 0.08 
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.03,
  },
  
  // Container
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  
  // Avatar
  avatar: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    marginBottom: height * 0.02,
    borderWidth: 3,
    borderColor: "#93210A",
  },
  
  // Name
  name: { 
    fontSize: width * 0.06, 
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: height * 0.01,
    color: '#333',
  },
  
  // Party
  partyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
    marginBottom: height * 0.03,
  },
  party: { 
    color: "#93210A", 
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  
  // Info Cards
  infoCard: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    marginBottom: height * 0.015,
    borderLeftWidth: 4,
    borderLeftColor: '#93210A',
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.04,
  },
  infoText: {
    fontSize: width * 0.04,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  
  // About Section
  aboutContainer: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
    marginBottom: height * 0.015,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#93210A',
  },
  aboutText: {
    fontSize: width * 0.038,
    color: '#555',
    lineHeight: height * 0.025,
    textAlign: 'justify',
  },
  
  // Video
  videoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#93210A',
    borderRadius: 25,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    gap: width * 0.03,
    marginTop: height * 0.02,
  },
  videoIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: width * 0.015,
  },
  videoText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  
  // Order Number
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
    marginTop: height * 0.03,
  },
  orderText: {
    color: '#666',
    fontSize: width * 0.035,
  },
});