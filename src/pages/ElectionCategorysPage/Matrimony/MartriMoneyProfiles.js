import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const APP_COLOR = "#93210A";

const MatrimonyProfiles = () => {
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://192.168.1.17:5000/api/matrimony"); 
      
      if (response.data.success) {
        setProfiles(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      Alert.alert("Error", "Failed to load profiles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfiles();
  };

  const handleProfilePress = (profile) => {
    navigation.navigate("MatrimoneyProfiledetails", { profileId: profile.id });
  };

  const renderProfileCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleProfilePress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.profileImage}
        // defaultSource={require("../../assets/placeholder.png")}
      />
      
      <View style={styles.cardContent}>
        <Text style={styles.profileName}>{item.name}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{item.age} years</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Profession:</Text>
          <Text style={styles.infoValue}>{item.profession || "Not specified"}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>District:</Text>
          <Text style={styles.infoValue}>{item.district || "Not specified"}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleProfilePress(item)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={APP_COLOR} />
        <Text style={styles.loadingText}>Loading profiles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Matrimony Profiles</Text>
        <Text style={styles.subtitle}>
          {profiles.length} Approved Profiles Available
        </Text>
      </View>

      <FlatList
        data={profiles}
        renderItem={renderProfileCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No profiles available</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default MatrimonyProfiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: APP_COLOR,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
    opacity: 0.9,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
  },
  profileImage: {
    width: 120,
    height: 120,
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 13,
    color: "#666",
    width: 70,
  },
  infoValue: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },
  viewButton: {
    backgroundColor: APP_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});