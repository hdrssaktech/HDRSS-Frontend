import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../../components/Alert/Loader";

// Local Tamil Nadu image
const tamilNaduImage = require("../../../../assets/Election/governmentlogo.jpeg"); // Update this path to your actual Tamil Nadu image

const PartiesPage2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { partyId, partyName,partyImage } = route.params || {}; 
  
  const { width, height } = useWindowDimensions();
  
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tablet check with proper dimensions
  const isTablet = useMemo(() => {
    return width >= 600 || (width > height && width >= 600);
  }, [width, height]);

  // Mobile: 1 column | Tablet: 2 columns
  const numColumns = useMemo(() => (isTablet ? 3 : 2), [isTablet]);

  // Dynamic card width with better spacing
  const cardWidth = useMemo(() => {
    if (numColumns === 1) return width - 32;
    const horizontalPadding = isTablet ? 32 : 16;
    const spacing = isTablet ? 20 : 16;
    const totalSpacing = (numColumns - 1) * spacing;
    return (width - horizontalPadding * 2 - totalSpacing) / numColumns;
  }, [numColumns, width, isTablet]);

  useEffect(() => {
    if (!partyId) return;

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
        
        // Filter unique titles
        const uniqueTitles = [
          ...new Map(data.map(item => [item.title, item])).values()
        ];

        setTitles(uniqueTitles);
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partyId]);

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
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          {partyName || "Parties"}
        </Text>
      </View>
      
      <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
    </View>
  );

  const renderPartyCard = ({ item, index }) => {
    const isLastInRow = (index + 1) % numColumns === 0;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isTablet && styles.cardTablet,
          { 
            width: cardWidth,
            marginRight: numColumns === 1 || isLastInRow ? 0 : (isTablet ? 20 : 16)
          },
        ]}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("Partiespage3", {
            partyTitle: item.title,
            partyId: partyId,
          })
        }
      >
        <View style={styles.cardContent}>
          {/* Tamil Nadu Image at Top - Like your image */}
          <View style={styles.imageSection}>
            <Image
              source={partyImage ? { uri: partyImage } : require('../../../../assets/Election/governmentlogo.jpeg')}
              style={[styles.tnImage, isTablet && styles.tnImageTablet]}
              resizeMode="cover"
            />
          </View>
          
          {/* State President Name */}
          <Text style={[styles.presidentName, isTablet && styles.presidentNameTablet]}>
            {item.title || "State President"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <Loader />;
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
            onPress={() => {
              setError(null);
              setLoading(true);
            }}
          >
            <Text style={[styles.retryButtonText, isTablet && styles.retryButtonTextTablet]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (titles.length === 0) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <Ionicons 
            name="people-outline" 
            size={isTablet ? 60 : 50} 
            color="#bbb" 
          />
          <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
            No data found
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={titles}
        key={`${numColumns}_${width}`}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `title-${index}`}
        renderItem={renderPartyCard}
        contentContainerStyle={[
          styles.listContainer,
          isTablet && styles.listContainerTablet,
        ]}
        ListFooterComponent={<View style={{ height: isTablet ? 40 : 30 }} />}
      />
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

export default PartiesPage2;

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
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 16,
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
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 20,
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
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  headerTitleTablet: {
    fontSize: 26,
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

  // List Container
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  listContainerTablet: {
    paddingHorizontal: 32,
    paddingTop: 30,
  },

  // Card - New design matching your image
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(139, 0, 0, 0.1)",
    marginBottom: 16,
  },
  cardTablet: {
    borderRadius: 18,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 20,
  },

  cardContent: {
    padding: 16,
    alignItems: "center",
    position: 'relative',
  },

  // Image Section - Tamil Nadu image
  imageSection: {
    marginBottom: 12,
  },

  tnImage: {
    width: 100,
    height:100,
  },
  tnImageTablet: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },

  // State President Name
  presidentName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#8B0000",
    marginBottom: 4,
    textAlign: "center",
  },
  presidentNameTablet: {
    fontSize: 16,
    lineHeight:21,
  },

  // Designation
  designation: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  designationTablet: {
    fontSize: 16,
  },

  // Arrow at bottom right
  arrowContainer: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(139, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
});