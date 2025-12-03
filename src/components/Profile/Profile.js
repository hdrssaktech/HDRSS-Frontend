import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ProfileImage from '../../../assets/profile-img.jpg';

export default function ProfilePage() {
  const { logout, userData } = useContext(AuthContext);
  const navigation = useNavigation();
  const name = userData?.name || "User";
  const phone = userData?.phoneNumber || "No Phone";
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* 🔙 Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Profile Header Card */}
        <View style={styles.profileCard}>
          <Text style={styles.headerText}>PROFILE</Text>

          {/* Default Profile Image */}
          <Image
            source={{
              uri: userData?.profileImage || Image.resolveAssetSource(ProfileImage).uri,
            }}
            style={styles.profileImage}
          />

          {/* Name */}
          <Text style={styles.name}>{name}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          {/* Phone Number */}
          <View style={styles.detailRow}>
            <Ionicons name="call" size={20} color="#971A01" />
            <Text style={styles.detailText}>{phone}</Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    borderRadius: 30,
    padding: 6,
  },

  profileCard: {
    backgroundColor: '#971A01',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingVertical: 65,
    paddingHorizontal: 29,
    alignItems: 'center',
    elevation: 8,
  },

  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },

  name: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
  },

  detailsContainer: { paddingHorizontal: 29, marginTop: 30 },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 19,
    marginHorizontal: 29,
  },

  detailText: { fontSize: 16, marginLeft: 10, color: '#333' },

  logoutButton: {
    backgroundColor: '#971A01',
    paddingVertical: 12,
    marginTop: 45,
    borderRadius: 8,
    alignItems: 'center',
  },

  logoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
