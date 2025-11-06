import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { AuthContext } from "../../context/AuthContext";
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfilePage() {
  const { logout, userData } = useContext(AuthContext);
  const navigation = useNavigation();

  const [profileImage, setProfileImage] = useState(userData?.image || null);
  const [name, setName] = useState(userData?.name || "User");
  const [isEditingName, setIsEditingName] = useState(false);

  // ✅ Image picker
  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access photos is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const toggleEditName = () => {
    setIsEditingName(!isEditingName);
  };

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

          <TouchableOpacity onPress={handleImagePick} style={styles.imageWrapper}>
            <Image
              source={{
                uri:
                  profileImage ||
                  userData?.image ||
                  "https://t3.ftcdn.net/jpg/06/99/46/60/360_F_699466075_DaPTBNlNQTOwwjkOiFEoOvzDV0ByXR9E.jpg",
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>

          <View style={styles.nameRow}>
            {isEditingName ? (
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                onBlur={() => setIsEditingName(false)}
                autoFocus
              />
            ) : (
              <Text style={styles.name}>{userData?.name || "No Name"}</Text>
            )}

            <TouchableOpacity onPress={toggleEditName} style={styles.editIcon}>
              <Feather name="edit-2" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Optional: show designation */}
          {userData?.designation && (
            <Text style={styles.membership}>{userData.designation}</Text>
          )}
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="call" size={20} color="#971A01" />
            <Text style={styles.detailText}>
              {userData?.contactDetails || "No contact"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="mail" size={20} color="#971A01" />
            <Text style={styles.detailText}>{userData?.email || "No email"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location" size={20} color="#971A01" />
            <Text style={styles.detailText}>
              {userData?.district || userData?.cityTown || "No address"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => navigation.navigate("RecoveryPage")}
          >
            <Ionicons name="lock-closed" size={20} color="#971A01" />
            <Text style={styles.detailText}>Change Password</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#971A01"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

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
    shadowColor: '#000',
  },
  headerText: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 25 },
  imageWrapper: { position: 'relative' },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  name: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginRight: 10 },
  nameInput: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    minWidth: 150,
    marginRight: 10,
  },
  editIcon: {
    backgroundColor: '#971A01',
    borderRadius: 12,
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff',
    marginHorizontal: -9,
  },
  membership: { fontSize: 14, color: '#fff', marginTop: 6 },
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
