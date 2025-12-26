import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function TownPartiesRoles({ route }) {
  const { townId, partyName } = route.params;
  const navigation = useNavigation();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `https://hdrss-backend.onrender.com/api/town-parties/${townId}`
      );

      // 1️⃣ Filter by partyName
      const filtered = res.data.data.filter(
        item => item.parties === partyName
      );

      // 2️⃣ Extract unique roles
      const uniqueRoles = [
        ...new Set(filtered.map(item => item.role).filter(Boolean))
      ].sort(); // Sort alphabetically

      setRoles(uniqueRoles);
    } catch (error) {
      console.log("Error fetching roles:", error);
      setError("Failed to load roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRefresh = () => {
    fetchRoles();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#93210A" barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{partyName}</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#93210A" />
          <Text style={styles.loadingText}>Loading roles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.roleCard,
        index === roles.length - 1 && styles.lastCard,
      ]}
      onPress={() =>
        navigation.navigate("TownPartiesMember", {
          townId,
          partyName,
          role: item,
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardIconContainer}>
        <Ionicons name="people-outline" size={24} color="#93210A" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.roleText} numberOfLines={2}>{item}</Text>
        <View style={styles.memberCountContainer}>
          <Ionicons name="person-outline" size={14} color="#666" />
          <Text style={styles.memberCountText}>
            View Members
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.screenTitle}>Party Roles</Text>
      <Text style={styles.screenSubtitle}>
        Select a role to view members
      </Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{roles.length}</Text>
          <Text style={styles.statLabel}>Roles</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="business-outline" size={20} color="#93210A" />
          <Text style={styles.statLabel}>{partyName}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{partyName}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>Roles</Text>
        </View>
        {/* <TouchableOpacity 
          onPress={handleRefresh}
          style={styles.refreshButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="refresh-outline" size={24} color="#fff" />
        </TouchableOpacity> */}
      </View>

      {/* CONTENT */}
      <View style={styles.container}>
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#93210A" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchRoles}
            >
              <Ionicons name="reload-outline" size={20} color="#fff" />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : roles.length === 0 ? (
          <ScrollView 
            contentContainerStyle={styles.emptyContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.emptyIllustration}>
              <Ionicons name="people-outline" size={80} color="#ddd" />
            </View>
            <Text style={styles.emptyTitle}>No Roles Available</Text>
            <Text style={styles.emptyDescription}>
              There are no roles defined for {partyName} in this town.
            </Text>
            <TouchableOpacity 
              style={styles.goBackButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.goBackText}>Go Back</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <FlatList
            data={roles}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={() => <View style={styles.footer} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width <= 320;

// Responsive scaling
const scaleWidth = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#93210A",
  },
  
  // Header styles
  header: {
    backgroundColor: "#93210A",
    paddingHorizontal: moderateScale(16),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: moderateScale(14),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: moderateScale(60),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
  },
  backButton: {
    padding: moderateScale(4),
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(12),
  },
  headerTitle: {
    fontSize: isTablet ? moderateScale(22) : moderateScale(18),
    fontWeight: "bold",
    color: "#fff",
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: isTablet ? moderateScale(16) : moderateScale(14),
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: 'center',
    marginTop: moderateScale(2),
  },
  refreshButton: {
    padding: moderateScale(4),
    opacity: 0.9,
  },
  placeholder: {
    width: moderateScale(32),
  },

  // Container
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  // List Header
  headerContainer: {
    backgroundColor: "#fff",
    padding: moderateScale(20),
    marginBottom: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  screenTitle: {
    fontSize: isTablet ? moderateScale(24) : moderateScale(20),
    fontWeight: "bold",
    color: "#333",
    marginBottom: moderateScale(4),
  },
  screenSubtitle: {
    fontSize: isTablet ? moderateScale(16) : moderateScale(14),
    color: "#666",
    marginBottom: moderateScale(16),
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: isTablet ? moderateScale(24) : moderateScale(20),
    fontWeight: "bold",
    color: "#93210A",
  },
  statLabel: {
    fontSize: isTablet ? moderateScale(14) : moderateScale(12),
    color: "#666",
    marginTop: moderateScale(4),
  },
  statDivider: {
    width: 1,
    height: moderateScale(30),
    backgroundColor: "#ddd",
    marginHorizontal: moderateScale(20),
  },

  // Role Card
  roleCard: {
    backgroundColor: "#fff",
    marginHorizontal: moderateScale(16),
    marginBottom: moderateScale(8),
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  lastCard: {
    marginBottom: moderateScale(16),
  },
  cardIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: "rgba(147, 33, 10, 0.1)",
    borderRadius: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
  },
  cardContent: {
    flex: 1,
  },
  roleText: {
    fontSize: isTablet ? moderateScale(18) : moderateScale(16),
    fontWeight: "600",
    color: "#333",
    marginBottom: moderateScale(4),
  },
  memberCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberCountText: {
    fontSize: isTablet ? moderateScale(14) : moderateScale(12),
    color: "#666",
    marginLeft: moderateScale(6),
  },

  // List styles
  listContent: {
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(24),
  },
  footer: {
    height: moderateScale(20),
  },

  // Loading state
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: moderateScale(12),
    fontSize: moderateScale(16),
    color: "#666",
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(24),
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    fontSize: moderateScale(16),
    color: "#333",
    textAlign: "center",
    marginTop: moderateScale(16),
    marginBottom: moderateScale(24),
    lineHeight: moderateScale(22),
  },
  retryButton: {
    backgroundColor: "#93210A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
  },
  retryText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
    marginLeft: moderateScale(8),
  },

  // Empty state
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(24),
    backgroundColor: "#f8f9fa",
  },
  emptyIllustration: {
    width: moderateScale(120),
    height: moderateScale(120),
    backgroundColor: "#f0f0f0",
    borderRadius: moderateScale(60),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(24),
  },
  emptyTitle: {
    fontSize: isTablet ? moderateScale(22) : moderateScale(18),
    fontWeight: "bold",
    color: "#333",
    marginBottom: moderateScale(8),
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: isTablet ? moderateScale(16) : moderateScale(14),
    color: "#666",
    textAlign: "center",
    marginBottom: moderateScale(32),
    lineHeight: moderateScale(22),
    paddingHorizontal: moderateScale(20),
  },
  goBackButton: {
    backgroundColor: "#93210A",
    paddingHorizontal: moderateScale(32),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
  },
  goBackText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
});