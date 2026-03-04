// import React, { useContext } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   StatusBar,
//   SafeAreaView,  
//   Dimensions,
// } from 'react-native';
// import { AuthContext } from "../../context/AuthContext";
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import ProfileImage from '../../../assets/profile-img.jpg';

// const { width: screenWidth } = Dimensions.get('window');
// const isTablet = screenWidth >= 600;

// export default function ProfilePage() {
//   const { logout, userData } = useContext(AuthContext);
//   const navigation = useNavigation();
//   const name = userData?.name || "User";
//   const phone = userData?.phoneNumber || "No Phone";
  
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <ScrollView contentContainerStyle={styles.scrollContent}>
        
//         {/* 🔙 Back Button */}
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Ionicons name="chevron-back" size={isTablet ? 32 : 28} color="#fff" />
//         </TouchableOpacity>

//         {/* Profile Header Card */}
//         <View style={styles.profileCard}>
//           <Text style={styles.headerText}>PROFILE</Text>

//           {/* Default Profile Image */}
//           <Image
//             source={{
//               uri: userData?.profileImage || Image.resolveAssetSource(ProfileImage).uri,
//             }}
//             style={styles.profileImage}
//           />

//           {/* Name */}
//           <Text style={styles.name}>{name}</Text>
//         </View>

//         {/* Details */}
//         <View style={styles.detailsContainer}>
//           {/* Phone Number */}
//           <View style={styles.detailRow}>
//             <Ionicons name="call" size={isTablet ? 24 : 20} color="#971A01" />
//             <Text style={styles.detailText}>{phone}</Text>
//           </View>

//           {/* Logout Button */}
//           <TouchableOpacity style={styles.logoutButton} onPress={logout}>
//             <Text style={styles.logoutText}>Log Out</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#fff' 
//   },
  
//   scrollContent: { 
//     paddingBottom: 40 
//   },
  
//   backButton: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     zIndex: 10,
//     borderRadius: 30,
//     padding: 6,
//   },

//   profileCard: {
//     backgroundColor: '#971A01',
//     borderBottomLeftRadius: 40,
//     borderBottomRightRadius: 40,
//     paddingVertical: 65,
//     paddingHorizontal: 29,
//     alignItems: 'center',
//     elevation: 8,
//     // Tablet adjustments
//     ...(isTablet && {
//       paddingVertical: 85,
//       paddingHorizontal: 40,
//       borderBottomLeftRadius: 50,
//       borderBottomRightRadius: 50,
//     })
//   },

//   headerText: {
//     color: '#fff',
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 25,
//     // Tablet adjustments
//     ...(isTablet && {
//       fontSize: 28,
//       marginBottom: 30,
//     })
//   },

//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: '#fff',
//     // Tablet adjustments
//     ...(isTablet && {
//       width: 150,
//       height: 150,
//       borderRadius: 75,
//       borderWidth: 4,
//     })
//   },

//   name: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: 'bold',
//     marginTop: 20,
//     // Tablet adjustments
//     ...(isTablet && {
//       fontSize: 26,
//       marginTop: 25,
//     })
//   },

//   detailsContainer: { 
//     paddingHorizontal: 29, 
//     marginTop: 30,
//     // Tablet adjustments
//     ...(isTablet && {
//       paddingHorizontal: 40,
//       marginTop: 40,
//     })
//   },

//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 19,
//     marginHorizontal: 29,
//     // Tablet adjustments
//     ...(isTablet && {
//       marginVertical: 22,
//       marginHorizontal: 40,
//     })
//   },

//   detailText: { 
//     fontSize: 16, 
//     marginLeft: 10, 
//     color: '#333',
//     // Tablet adjustments
//     ...(isTablet && {
//       fontSize: 20,
//       marginLeft: 12,
//     })
//   },

//   logoutButton: {
//     backgroundColor: '#971A01',
//     paddingVertical: 12,
//     marginTop: 45,
//     borderRadius: 8,
//     alignItems: 'center',
//     // Tablet adjustments
//     ...(isTablet && {
//       paddingVertical: 16,
//       marginTop: 50,
//       borderRadius: 10,
//     })
//   },

//   logoutText: { 
//     color: 'white', 
//     fontWeight: 'bold', 
//     fontSize: 16,
//     // Tablet adjustments
//     ...(isTablet && {
//       fontSize: 20,
//     })
//   },  
// });     



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
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
  Share,
} from 'react-native';
import { AuthContext } from "../../context/AuthContext";
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import ProfileImage from '../../../assets/profile-img.jpg';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 600;

// Production color palette
const COLORS = {
  primary: '#971A01',
  primaryLight: '#B83B22',
  primaryDark: '#7A1500',
  secondary: '#2D2D2D',
  accent: '#FFD700',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
  },
  border: '#E5E5E5',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
  },
};

export default function ProfilePage() {
  const { logout, userData } = useContext(AuthContext);
  console.log(userData)
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  
  // Animation values
  const scaleValue = useSharedValue(1);
  const rotateValue = useSharedValue(0);
  

  const name = userData?.name || "User Name";
  const phone = userData?.phoneNumber || "+1 (555) 123-4567";
  const dob  = userData?.dob || '01/03/2002';
  const pincode = userData?.pincode || "632451"



  // Animated styles
  const profileImageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scaleValue.value },
        { rotate: `${rotateValue.value}deg` },
      ],
    };
  });

  const handleImagePress = () => {
    scaleValue.value = withSequence(
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
    rotateValue.value = withSequence(
      withTiming(5, { duration: 200 }),
      withTiming(-5, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Needed', 'Please grant camera roll permissions to change your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        // Here you would upload to your backend
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my profile on the app!`,
        title: 'Share Profile',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share profile');
    }
  };

  const MenuItem = ({ icon, label, value, onPress, type = 'Ionicons' }) => {
    const IconComponent = type === 'Ionicons' ? Ionicons : MaterialIcons;
    
    return (
      <Animated.View entering={FadeInDown.duration(500).delay(100)}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.menuIconContainer}>
              <IconComponent name={icon} size={isTablet ? 24 : 20} color={COLORS.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemLabel}>{label}</Text>
              <Text style={styles.menuItemValue}>{value}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Custom Header with Gradient */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={isTablet ? 28 : 24} color={COLORS.text.inverse} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Profile</Text>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            {/* <Feather name="share" size={isTablet ? 24 : 20} color={COLORS.text.inverse} /> */}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify()}
          style={styles.profileCard}
        >
          <View style={styles.profileImageContainer}>
            <Animated.View style={[styles.profileImageWrapper, profileImageAnimatedStyle]}>
              <Image
                source={{ uri: profileImage || Image.resolveAssetSource(ProfileImage).uri }}
                style={styles.profileImage}
              />
            </Animated.View>
            
            <TouchableOpacity 
              style={styles.editImageButton}
              onPress={() => {
                handleImagePress();
                pickImage();
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.editImageGradient}
              >
                <Feather name="camera" size={isTablet ? 20 : 16} color={COLORS.text.inverse} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{name}</Text>

          {/* Stats Row */}
        </Animated.View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account Information</Text>
          
          <MenuItem
            icon="call-outline"
            label="Phone Number"
            value={phone}
            // onPress={() => Alert.alert('Coming Soon', 'Edit phone number feature coming soon!')}
          />
          <MenuItem
            icon="call-outline"
            label="Date of Birth"
            value={dob}
            // onPress={() => Alert.alert('Coming Soon', 'Edit phone number feature coming soon!')}
          />
          <MenuItem
            icon="call-outline"
            label="Pincode"
            value={pincode}
            
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Preferences</Text>
          
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            value="Enabled"
            onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
          />
          
          <MenuItem
            icon="language-outline"
            label="Language"
            value="English (US)"
            onPress={() => Alert.alert('Coming Soon', 'Language settings coming soon!')}
          />
          
          <MenuItem
            icon="color-palette-outline"
            label="Theme"
            value="Light"
            type="Ionicons"
            onPress={() => Alert.alert('Coming Soon', 'Theme settings coming soon!')}
          />
        </View>

        {/* Logout Button */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.error, '#D32F2F']}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.text.inverse} />
              ) : (
                <>
                  <MaterialIcons name="logout" size={isTablet ? 24 : 20} color={COLORS.text.inverse} />
                  <Text style={styles.logoutText}>Log Out</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: isTablet ? 20 : 15,
  },
  
  headerTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '600',
    color: COLORS.text.inverse,
    letterSpacing: 0.5,
  },
  
  scrollContent: {
    paddingBottom: 30,
  },
  
  profileCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    ...(isTablet && {
      marginHorizontal: 40,
      paddingVertical: 40,
    }),
  },
  
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  
  profileImageWrapper: {
    width: isTablet ? 130 : 110,
    height: isTablet ? 130 : 110,
    borderRadius: isTablet ? 65 : 55,
    borderWidth: 3,
    borderColor: COLORS.surface,
    elevation: 4,
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: isTablet ? 65 : 55,
  },
  
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  
  editImageGradient: {
    width: isTablet ? 40 : 36,
    height: isTablet ? 40 : 36,
    borderRadius: isTablet ? 20 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  
  profileName: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 5,
  },
  
  profileRole: {
    fontSize: isTablet ? 16 : 14,
    color: COLORS.text.secondary,
    marginBottom: 20,
  },
  
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  
  statNumber: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 5,
  },
  
  statLabel: {
    fontSize: isTablet ? 14 : 12,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  menuSection: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  
  menuSectionTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  menuIconContainer: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    backgroundColor: 'rgba(151, 26, 1, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  menuItemContent: {
    flex: 1,
  },
  
  menuItemLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  
  menuItemValue: {
    fontSize: isTablet ? 14 : 12,
    color: COLORS.text.tertiary,
  },
  
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 18 : 15,
    gap: 10,
  },
  
  logoutText: {
    color: COLORS.text.inverse,
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  bottomPadding: {
    height: 30,
  },
});