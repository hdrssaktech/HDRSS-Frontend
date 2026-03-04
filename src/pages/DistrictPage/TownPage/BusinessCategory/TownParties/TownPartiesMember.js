import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../../../components/Alert/Loader";

export default function TownPartiesMember({ route }) {
  const { townId, partyName, role } = route.params;
  const navigation = useNavigation();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(
        `https://hdrss-backend.onrender.com/api/town-parties/${townId}`
      );
      const filtered = res.data.data.filter(
        item => item.parties === partyName
      );
      const data = res.data.data || [];

      setMembers(filtered);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) {
    return (
      <Loader/>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("TownPartiesMemberDetails", {
          member: item,
        })
      }
      activeOpacity={0.7}
    >
      {/* IMAGE - 40% width */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.image || "https://via.placeholder.com/150",
          }}
          style={styles.avatar}
          resizeMode="cover"
          onError={() => console.log("Image failed to load")}
        />
        <View style={styles.imageOverlay} />
      </View>

      {/* INFO - 60% width */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.party} numberOfLines={1}>
          {item.parties}
        </Text>
        <Text style={styles.role} numberOfLines={2}>
          {item.role}
        </Text>

        {/* Icon Row */}
        <View style={styles.iconRow}>
          {/* Location Icon */}
          {item.location && item.location !== "N/A" && (
            <View style={styles.iconWithText}>
              <Ionicons name="location-outline" size={16} color="#93210A" />
              <Text style={styles.iconText} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}

          {/* Phone Icon */}
          {item.phoneNumber && item.phoneNumber !== "N/A" && (
            <View style={styles.iconWithText}>
              <Ionicons name="call-outline" size={16} color="#93210A" />
              <Text style={styles.iconText} numberOfLines={1}>
                {item.phoneNumber}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            Members
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Members List */}
      {members.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No members found</Text>
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width <= 320;

// Responsive scaling functions
const scaleWidth = (size) => {
  const guidelineBaseWidth = 375;
  return (width / guidelineBaseWidth) * size;
};

const scaleHeight = (size) => {
  const guidelineBaseHeight = 812;
  return (height / guidelineBaseHeight) * size;
};

const moderateScale = (size, factor = 0.5) => {
  return size + (scaleWidth(size) - size) * factor;
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f8f9fa',
  },
  
  // Header styles
  header: {
    backgroundColor: "#93210A",
    paddingHorizontal: moderateScale(16),
    paddingVertical: isTablet ? height * 0.02 : height * 0.015,
    flexDirection: "row",
    alignItems: "center",
    minHeight: isTablet ? height * 0.1 : height * 0.08,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderBottomEndRadius: moderateScale(12),
    borderBottomStartRadius: moderateScale(12),
  },
  backButton: {
    paddingRight: moderateScale(10),
    justifyContent: 'center',
     paddingTop:30
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { 
    color: "#fff", 
    fontSize: isTablet ? moderateScale(22) : moderateScale(18),
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 4,
    paddingTop:30
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: isTablet ? moderateScale(16) : moderateScale(14),
    textAlign: 'center',
  },
  placeholder: { 
    width: moderateScale(40),
  },

  // List styles
  listContent: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    paddingBottom: height * 0.02,
  },

  // Card styles - Responsive
  card: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    flexDirection: "row",
    marginBottom: moderateScale(12),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    minHeight: isTablet ? height * 0.15 : height * 0.12,
    maxHeight: isTablet ? height * 0.2 : height * 0.16,
  },

  // Image container - 40%
  imageContainer: {
    width: '40%',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  // Info container - 60%
  infoContainer: {
    width: '60%',
    padding: moderateScale(12),
    justifyContent: 'space-between',
  },
  name: { 
    fontSize: isTablet ? moderateScale(18) : moderateScale(16),
    fontWeight: "bold", 
    color: "#333",
    marginBottom: moderateScale(4),
    lineHeight: moderateScale(20),
  },
  party: { 
    color: "#93210A", 
    fontSize: isTablet ? moderateScale(16) : moderateScale(14),
    fontWeight: '600',
    marginBottom: moderateScale(2),
  },
  role: {
    color: "#666",
    fontSize: isTablet ? moderateScale(14) : moderateScale(12),
    marginBottom: moderateScale(8),
    fontStyle: 'italic',
    lineHeight: moderateScale(16),
  },

  // Icon row styles
  iconRow: {
    flexDirection: "column",
    gap: moderateScale(6),
  },
  iconWithText: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
  },
  iconText: {
    fontSize: isTablet ? moderateScale(14) : moderateScale(12),
    color: "#555",
    flex: 1,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: height * 0.1,
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: "#999",
    marginTop: moderateScale(16),
    textAlign: 'center',
  },
});




