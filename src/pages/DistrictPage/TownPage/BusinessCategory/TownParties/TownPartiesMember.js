import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Linking,
  Platform,
  TextInput,
  useWindowDimensions,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../../../components/Alert/Loader";

export default function TownPartiesMember({ route }) {
  const { townId } = route.params;
  const navigation = useNavigation();

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const imageSize = isTablet ? 140 : 100;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `https://hdrss-backend.onrender.com/api/town-parties/${townId}`
      );
      const sorted = res.data.data.sort((a, b) => a.orderNo - b.orderNo);
      setMembers(sorted);
    } catch {
      setError("Failed to load members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    return members.filter((item) =>
      (item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const handleCall = (phoneNumber) => {
    if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleLocationPress = (location) => {
    if (!location) return;
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, isTablet && styles.cardTablet]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("TownPartiesMemberDetails", { member: item })}
    >
      <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
        <Image
          source={{ uri: item.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
          style={{ width: imageSize, height: imageSize }}
          resizeMode="cover"
        />
      </View>

      <View style={[styles.contentContainer, isTablet && styles.contentContainerTablet]}>
        <View style={styles.textSection}>
          <Text style={[styles.name, isTablet && styles.nameTablet]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[styles.parties, isTablet && styles.partiesTablet]} numberOfLines={1}>
            {item.parties}
          </Text>
          <Text style={[styles.role, isTablet && styles.roleTablet]} numberOfLines={1}>
            {item.role}
          </Text>
          <Text style={styles.wardText}>Ward No: {item.orderNo}</Text>
        </View>

        <View style={[styles.buttonsRow, isTablet && styles.buttonsRowTablet]}>
          {item.phoneNumber && (
            <TouchableOpacity
              style={[styles.callButton, isTablet && styles.callButtonTablet]}
              onPress={(e) => { e.stopPropagation(); handleCall(item.phoneNumber); }}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={isTablet ? 18 : 16} color="#fff" />
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>
          )}
          {item.location && (
            <TouchableOpacity
              style={[styles.directionsButton, isTablet && styles.directionsButtonTablet]}
              onPress={(e) => { e.stopPropagation(); handleLocationPress(item.location); }}
              activeOpacity={0.8}
            >
              <Ionicons name="navigate" size={isTablet ? 18 : 16} color="#8B0000" />
              <Text style={styles.directionsButtonText}>Directions</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color="rgba(139,0,0,0.25)" style={styles.chevron} />
    </TouchableOpacity>
  );

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
            Town Councilors
          </Text>
        </View>
        <View style={{ width: isTablet ? 50 : 40 }} />
      </View>

      {/* Search Bar */}
      {!error && (
        <View style={[styles.searchWrapper, isTablet && styles.searchWrapperTablet]}>
          <View style={[styles.searchBar, isTablet && styles.searchBarTablet]}>
            <Ionicons name="search" size={isTablet ? 20 : 18} color="#8B0000" />
            <TextInput
              style={[styles.searchInput, isTablet && styles.searchInputTablet]}
              placeholder="Search by name..."
              placeholderTextColor="#aaa"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={isTablet ? 20 : 18} color="#aaa" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Error State */}
      {error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={50} color="#8B0000" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchMembers}>
            <Ionicons name="refresh" size={15} color="#fff" />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.listContent, isTablet && styles.listContentTablet]}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="people-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchQuery.trim() ? `No results for "${searchQuery}"` : "No members found"}
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 30 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F1EE" },

  /* Header */
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
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTablet: {
    paddingHorizontal: 32,
    paddingTop: Platform.OS === "ios" ? 15 : 45,
    paddingBottom: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25 },
  headerTitleWrap: { flex: 1, alignItems: "center", paddingHorizontal: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  headerTitleTablet: { fontSize: 24 },

  /* Search */
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  searchWrapperTablet: { paddingHorizontal: 32, paddingVertical: 14 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(139,0,0,0.15)",
  },
  searchBarTablet: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  searchInput: { flex: 1, fontSize: 14, color: "#1A1A1A", padding: 0, fontWeight: "500" },
  searchInputTablet: { fontSize: 16 },

  /* List */
  listContent: { padding: 16 },
  listContentTablet: { padding: 32 },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(139,0,0,0.08)",
  },
  cardTablet: {
    borderRadius: 20, padding: 16, marginBottom: 14, elevation: 3,
  },
  imageContainer: { borderRadius: 12, overflow: "hidden", backgroundColor: "#f5f5f5", marginRight: 12 },
  contentContainer: { flex: 1, justifyContent: "space-between" },
  contentContainerTablet: { paddingVertical: 2 },
  textSection: { marginBottom: 8 },
  name: { fontSize: 16, fontWeight: "800", color: "#8B0000", marginBottom: 3, lineHeight: 22 },
  nameTablet: { fontSize: 18, lineHeight: 25 },
  parties: { fontSize: 13, color: "#990f0f", fontWeight: "600", marginBottom: 2 },
  partiesTablet: { fontSize: 15 },
  role: { fontSize: 13, color: "#666", marginBottom: 2 },
  roleTablet: { fontSize: 14 },
  wardText: { fontSize: 12, color: "#888" },
  chevron: { marginLeft: 4 },

  /* Buttons */
  buttonsRow: { flexDirection: "row", gap: 8 },
  buttonsRowTablet: { gap: 12 },
  callButton: {
    flex: 1, flexDirection: "row", backgroundColor: "#8B0000",
    paddingVertical: 8, borderRadius: 8,
    justifyContent: "center", alignItems: "center", gap: 6,
  },
  callButtonTablet: { paddingVertical: 10, borderRadius: 10 },
  directionsButton: {
    flex: 1, flexDirection: "row", borderWidth: 1, borderColor: "#8B0000",
    backgroundColor: "rgba(139,0,0,0.04)",
    paddingVertical: 8, borderRadius: 8,
    justifyContent: "center", alignItems: "center", gap: 6,
  },
  directionsButtonTablet: { paddingVertical: 10, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  directionsButtonText: { color: "#8B0000", fontSize: 13, fontWeight: "700" },

  /* States */
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 80, paddingHorizontal: 32 },
  errorText: { marginTop: 12, color: "#8B0000", fontSize: 15, textAlign: "center", fontWeight: "600" },
  retryBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginTop: 20, backgroundColor: "#8B0000",
    paddingHorizontal: 28, paddingVertical: 12, borderRadius: 25, elevation: 3,
  },
  retryText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  emptyText: { marginTop: 14, fontSize: 15, color: "#aaa", textAlign: "center" },
});