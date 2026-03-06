import React, { useState, useEffect } from 'react';
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
  SectionList
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Loader from '../../../components/Alert/Loader';

const DistrictAssemblyPage3 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId, role, districtName } = route.params || {};
  const { width } = useWindowDimensions();
  
  const [leaders, setLeaders] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isTablet = width >= 600;

  useEffect(() => {
    getLeaders();
  }, [districtId]);

  const getLeaders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://hdrss-backend.onrender.com/api/districtAssembly/${districtId}`);
      
      if (response.data.success && Array.isArray(response.data.data)) {
        const leadersData = response.data.data;
        setLeaders(leadersData);
        
        // Group by role
        const grouped = {};
        leadersData.forEach(item => {
          const roleName = item.role || 'Other';
          if (!grouped[roleName]) {
            grouped[roleName] = [];
          }
          grouped[roleName].push(item);
        });
        
        // Convert to sections
        const sectionsData = Object.keys(grouped).map(roleName => ({
          title: roleName,
          data: grouped[roleName]
        }));
        setSections(sectionsData);
      } else {
        setLeaders([]);
        setSections([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load leaders');
    } finally {
      setLoading(false);
    }
  };

  const handlePhonePress = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert('Info', 'Phone number not available');
    }
  };

  const handleLocationPress = (location) => {
    if (location) {
      const encodedLocation = encodeURIComponent(location);
      Linking.openURL(`https://maps.google.com/?q=${encodedLocation}`);
    } else {
      Alert.alert('Info', 'Location not available');
    }
  };

  const handleCardPress = (item) => {
    navigation.navigate('DistrictAssembly4', { leaderData: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, isTablet && styles.cardTablet]}
      activeOpacity={0.7}
      onPress={() => handleCardPress(item)}
    >
      {/* Left Square Image */}
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/300x300/f0f0f0/8B0000?text=Photo' }}
        style={[styles.profileImage, isTablet && styles.profileImageTablet]}
        resizeMode="cover"
      />

      {/* Right Details */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.name, isTablet && styles.nameTablet]} numberOfLines={2}>
          {item.name || 'Name not available'}
        </Text>
        <Text style={[styles.role, isTablet && styles.roleTablet]} numberOfLines={1}>
          {item.role || 'Role not specified'}
        </Text>
        {item.role == "Councilor" && item.Vartu && (
          <Text style={[styles.wardText, isTablet && styles.wardTextTablet]} numberOfLines={1}>
            Ward No: {item.Vartu}
          </Text>
        )}

        {/* Buttons Row */}
        <View style={styles.buttonsRow}>

          {item.phoneNumber && (
            <TouchableOpacity
              style={styles.callButton}
              onPress={(e) => {
                e.stopPropagation();
                handlePhonePress(item.phoneNumber);
              }}
            >
              <Ionicons name="call" size={16} color="#fff" />
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>
          )}

          {item.location && (
            <TouchableOpacity
              style={styles.directionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleLocationPress(item.location);
              }}
            >
              <Ionicons name="navigate" size={16} color="#8B0000" />
              <Text style={styles.directionText}>Directions</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={[styles.sectionHeader, isTablet && styles.sectionHeaderTablet]}>
      <View style={[styles.line, isTablet && styles.lineTablet]} />
      <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
        {title}
      </Text>
      <View style={[styles.line, isTablet && styles.lineTablet]} />
    </View>
  );

  const renderHeader = () => (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerTitleWrap}>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} numberOfLines={1}>
          {role || "Elected Representatives"}
        </Text>
      </View>
      
      <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#8B0000" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={getLeaders}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <View style={styles.container}>
        {renderHeader()}
        
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={[styles.listContainer, isTablet && styles.listContainerTablet]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No leaders found</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: isTablet ? 40 : 30 }} />}
          stickySectionHeadersEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#8B0000",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header
  header: {
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 40,
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTablet: {
    paddingHorizontal: 32,
    paddingTop: Platform.OS === "ios" ? 15 : 45,
    paddingBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  headerSpacer: {
    width: 40,
  },
  headerSpacerTablet: {
    width: 50,
  },

  // Section Header Styles - Role name between two lines
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  sectionHeaderTablet: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 32,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#8B0000',
    opacity: 0.3,
    borderRadius: 1,
  },
  lineTablet: {
    height: 3,
  },
  sectionTitle: {
    color: '#8B0000',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  sectionTitleTablet: {
    fontSize: 22,
    fontWeight: '900',
    paddingHorizontal: 20,
  },

  // List Container
  listContainer: { 
    paddingBottom: 16,
  },
  listContainerTablet: {
    paddingBottom: 32,
  },
  
  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 0, 0, 0.1)',
  },
  cardTablet: {
    marginHorizontal: 32,
    padding: 16,
    marginBottom: 16,
    borderRadius: 18,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  
  profileImageTablet: {
    width: 110,
    height: 110,
    borderRadius: 16,
  },

  detailsContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-around',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8B0000',
    marginBottom: 4,
    lineHeight: 22,
  },
  nameTablet: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 6,
    fontWeight: '900',
  },
  role: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  roleTablet: {
    fontSize: 16,
    marginBottom: 6,
  },
  wardText: {
    fontSize: 13,
    color: '#8B0000',
    fontWeight: '500',
    marginBottom: 8,
  },
  wardTextTablet: {
    fontSize: 15,
    marginBottom: 10,
  },
  buttonsRow:{
  flexDirection:"row",
  gap:8
},
callButton:{
  flex:1,
  flexDirection:"row",
  backgroundColor:"#8B0000",
  padding:10,
  borderRadius:8,
  justifyContent:"center",
  alignItems:"center",
  gap:6
},

buttonText:{
  color:"#fff",
  fontSize:13,
  fontWeight:"700"
},

directionButton:{
  flex:1,
  flexDirection:"row",
  borderWidth:1,
  borderColor:"#8B0000",
  backgroundColor:"rgba(139,0,0,0.05)",
  paddingVertical:8,
  borderRadius:8,
  justifyContent:"center",
  alignItems:"center",
  gap:6
},

directionText:{
  color:"#8B0000",
  fontSize:13,
  fontWeight:"700"
 },

  // Center States
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    padding: 20,
  },

  errorText: { 
    marginTop: 16, 
    color: '#8B0000', 
    fontSize: 16, 
    textAlign: 'center', 
    paddingHorizontal: 40,
    fontWeight: '500',
  },
  retryButton: { 
    marginTop: 24, 
    backgroundColor: '#8B0000', 
    paddingHorizontal: 30, 
    paddingVertical: 12, 
    borderRadius: 25,
    elevation: 3,
  },
  retryButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: 100 
  },
  emptyText: { 
    marginTop: 16, 
    fontSize: 16, 
    color: '#999',
    textAlign: 'center',
  },
});

export default DistrictAssemblyPage3;