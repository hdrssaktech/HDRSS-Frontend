import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Linking,
  useWindowDimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const PartiesPage3 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { partyTitle, partyId } = route.params;
  
  const { width, height } = useWindowDimensions();
  
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Tablet check with proper dimensions
  const isTablet = useMemo(() => {
    return width >= 600 || (width > height && width >= 600);
  }, [width, height]);

  // ✅ Responsive square image size
  const imageSize = useMemo(() => {
    return isTablet ? 140 : 100;
  }, [isTablet]);

  // ✅ Responsive padding
  const contentPadding = useMemo(() => {
    return isTablet ? 24 : 16;
  }, [isTablet]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
        <Text 
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]} 
          numberOfLines={1}
        >
          {partyTitle}
        </Text>
      </View>
      
      <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <ActivityIndicator size={isTablet ? "large" : "large"} color="#8B0000" />
          <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
            Loading details...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <Ionicons 
            name="alert-circle-outline" 
            size={isTablet ? 60 : 50} 
            color="#8B0000" 
          />
          <Text style={[styles.errorText, isTablet && styles.errorTextTablet]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, isTablet && styles.retryButtonTablet]}
            onPress={() => setLoading(true)}
          >
            <Text style={[styles.retryButtonText, isTablet && styles.retryButtonTextTablet]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (list.length === 0) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <Ionicons 
            name="people-outline" 
            size={isTablet ? 60 : 50} 
            color="#bbb" 
          />
          <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
            No items found
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollViewContent, isTablet && styles.scrollViewContentTablet]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.listContainer, isTablet && styles.listContainerTablet]}>
          {list.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Partiespage4", { 'item': item })}
              style={[styles.cardWrapper, isTablet && styles.cardWrapperTablet]}
            >
              <View style={[styles.card, isTablet && styles.cardTablet]}>
                {/* Square Image Box */}
                <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
                  <Image
                    source={{
                      uri: item.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
                
                {/* Content Container */}
                <View style={[styles.contentContainer, isTablet && styles.contentContainerTablet]}>
                  {/* Name - with proper text wrapping */}
                  <View style={styles.nameContainer}>
                    <Text 
                      style={[styles.name, isTablet && styles.nameTablet]} 
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.name || item.title || "Unnamed"}
                    </Text>
                  </View>
                  
                  {/* Spacer to push buttons to bottom */}
                  <View style={styles.spacer} />
                  
                  {/* Buttons Row */}
                  <View style={[styles.buttonsRow, isTablet && styles.buttonsRowTablet]}>
                    {item.phoneNumber && (
                      <TouchableOpacity
                        style={[styles.callButton, isTablet && styles.callButtonTablet]}
                        activeOpacity={0.7}
                        onPress={(e) => {
                          e.stopPropagation(); // Prevent navigation when pressing call
                          handleCall(item.phoneNumber);
                        }}
                      >
                        <Ionicons name="call" size={isTablet ? 18 : 16} color="#fff" />
                        <Text style={[styles.callButtonText, isTablet && styles.callButtonTextTablet]}>
                          Call
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    {item.location && (
                      <TouchableOpacity
                        style={[styles.directionsButton, isTablet && styles.directionsButtonTablet]}
                        activeOpacity={0.7}
                        onPress={(e) => {
                          e.stopPropagation(); // Prevent navigation when pressing directions
                          handleLocationPress(item.location);
                        }}
                      >
                        <Ionicons name="navigate" size={isTablet ? 18 : 16} color="#8B0000" />
                        <Text style={[styles.directionsButtonText, isTablet && styles.directionsButtonTextTablet]}>
                          Directions
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      <View style={styles.container}>
        {renderHeader()}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default PartiesPage3;

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
  },
  headerTablet: {
    paddingHorizontal: 32,
    paddingTop: Platform.OS === "ios" ? 15 : 45,
    paddingBottom: 15,
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
    marginRight: 40,
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

  // Center States
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  centerContainerTablet: {
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: "#8B0000",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingTextTablet: {
    fontSize: 18,
    marginTop: 16,
  },
  errorText: {
    marginTop: 14,
    color: "#8B0000",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  errorTextTablet: {
    fontSize: 18,
    lineHeight: 26,
    marginTop: 20,
    maxWidth: 500,
  },
  emptyText: {
    marginTop: 12,
    color: "#777",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyTextTablet: {
    fontSize: 18,
    marginTop: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#8B0000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
  },
  retryButtonTablet: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 24,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  retryButtonTextTablet: {
    fontSize: 17,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  scrollViewContentTablet: {
    paddingBottom: 30,
  },

  // List Container
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  listContainerTablet: {
    paddingHorizontal: 32,
    paddingTop: 30,
  },

  // Card Wrapper
  cardWrapper: {
    marginBottom: 16,
  },
  cardWrapperTablet: {
    marginBottom: 20,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(139, 0, 0, 0.1)",
  },
  cardTablet: {
    borderRadius: 18,
    padding: 16,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  // Square Image Box
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  // Content Container
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  contentContainerTablet: {
    paddingVertical: 4,
  },

  // Name Container
  nameContainer: {
    marginBottom: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
    color: "#8B0000",
    lineHeight: 20,
     marginTop: 8,

  },
  nameTablet: {
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 22,
    marginTop: 12,
  },

  // Spacer
  spacer: {
    flex: 1,
  },

  // Buttons Row
  buttonsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 'auto',
  },
  buttonsRowTablet: {
    gap: 12,
  },

  // Call Button
  callButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#8B0000",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    minHeight: 35,
  },
  callButtonTablet: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 10,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  callButtonTextTablet: {
    fontSize: 16,
  },

  // Directions Button
  directionsButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(139, 0, 0, 0.05)",
    borderWidth: 1,
    borderColor: "#8B0000",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    minHeight: 35,
  },
  directionsButtonTablet: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 10,
  },
  directionsButtonText: {
    color: "#8B0000",
    fontSize: 12,
    fontWeight: "800",
  },
  directionsButtonTextTablet: {
    fontSize: 16,
  },
});