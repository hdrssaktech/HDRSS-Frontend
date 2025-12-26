import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const PartiesPage3 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { partyTitle, partyId } = route.params;

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://hdrss-backend.onrender.com/api/party/category/${partyId}`
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();

        // Filter by title
        const filtered = data.filter(item => item.title === partyTitle).sort((a,b)=>a.orderNo - b.orderNo);
        setList(filtered);
        setError(null);
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partyId, partyTitle]);

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleLocationPress = (location) => {
    if (location) {
      const encodedLocation = encodeURIComponent(location);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size={isTablet ? "large" : "small"} color="#93210A" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#93210A" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {partyTitle}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {list.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={80} color="#CCCCCC" />
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {list.map((item, index) => (
                 <TouchableOpacity
      key={index}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("Partiespage4", { 'item':item })
      }
    >
                <View
                  key={index}
                  style={[
                    styles.card,
                    isTablet && styles.cardTablet,
                    isSmallDevice && styles.cardSmall,
                    index === list.length - 1 && styles.lastCard,
                  ]}
                  
                  onPress={()=>{navigation.navigate('Partiespage4',{'item':item})}}
                >
                  <View style={styles.rectangleLayout}>
                    
                    {/* Left Side: Image (40%) */}
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri: item.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.contentContainer}>
                      
    
                      <View style={styles.nameContainer}>
                        <Text style={styles.name} numberOfLines={2}>
                          {item.name || item.title}
                        </Text>
                      </View>
                      {item.location && (
                        <View style={styles.addressContainer}>
                          <Ionicons 
                            name="location-outline" 
                            size={isTablet ? 18 : 14} 
                            color="#666" 
                            style={styles.addressIcon}
                          />
                          <Text style={styles.addressText} numberOfLines={2}>
                            {item.location}
                          </Text>
                        </View>
                      )}
                    
                      <View style={styles.buttonsRow}>
                        {item.phoneNumber && (
                          <TouchableOpacity
                            style={styles.callButton}
                            activeOpacity={0.7}
                            onPress={() => handleCall(item.phoneNumber)}
                          >
                            <Ionicons name="call" size={isTablet ? 20 : 16} color="#fff" />
                            <Text style={styles.callButtonText}>Call</Text>
                          </TouchableOpacity>
                        )}
                        
                        {item.location && (
                          <TouchableOpacity
                            style={styles.directionsButton}
                            activeOpacity={0.7}
                            onPress={() => handleLocationPress(item.location)}
                          >
                            <Ionicons name="navigate" size={isTablet ? 20 : 16} color="#93210A" />
                            <Text style={styles.directionsButtonText}>Directions</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PartiesPage3;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#93210A",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: "#93210A",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#93210A",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  header: {
    backgroundColor: "#93210A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 35,
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: isTablet ? 26 : 20,
    fontWeight: "800",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: height * 0.6,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    minHeight: 140,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardTablet: {
    borderRadius: 20,
    marginBottom: 20,
    minHeight: 180,
  },
  cardSmall: {
    marginHorizontal: 4,
    minHeight: 120,
  },
  lastCard: {
    marginBottom: 10,
  },
  // Rectangle Layout: 40% image, 60% content
  rectangleLayout: {
    flexDirection: "row",
    height: isTablet ? 180 : 140,
  },
  // Left side: Image (40%)
  imageContainer: {
    width: "40%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  // Right side: Content (60%)
  contentContainer: {
    width: "60%",
    padding: isTablet ? 20 : 16,
    justifyContent: "space-between",
  },
  // Line 1: Name
  nameContainer: {
    marginBottom: 8,
  },
  name: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: "700",
    color: "#1F2937",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    lineHeight: isTablet ? 24 : 20,
  },
  // Line 2: Buttons (Call & Directions)
  buttonsRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#93210A",
    paddingVertical: isTablet ? 10 : 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    minHeight: isTablet ? 40 : 36,
  },
  callButtonText: {
    color: "#fff",
    fontSize: isTablet ? 14 : 12,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  directionsButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFF5F2",
    borderWidth: 1,
    borderColor: "#93210A",
    paddingVertical: isTablet ? 10 : 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    minHeight: isTablet ? 40 : 36,
  },
  directionsButtonText: {
    color: "#93210A",
    fontSize: isTablet ? 14 : 12,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  // Line 3: Address/Location
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  addressIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  addressText: {
    flex: 1,
    fontSize: isTablet ? 14 : 12,
    color: "#4B5563",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    lineHeight: isTablet ? 18 : 16,
  },
  // Phone Number (extra line if needed)
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneIcon: {
    marginRight: 8,
  },
  phoneText: {
    fontSize: isTablet ? 14 : 12,
    color: "#4B5563",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
});