import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const PartiesPage2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { partyId, partyName } = route.params || {};
  
  const { width, height } = useWindowDimensions();
  
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Tablet check with proper dimensions
  const isTablet = useMemo(() => {
    return width >= 600 || (width > height && width >= 600);
  }, [width, height]);

  // ✅ Mobile: 1 column | Tablet: 2 columns
  const numColumns = useMemo(() => (isTablet ? 2 : 1), [isTablet]);

  // ✅ Dynamic card width with better spacing
  const cardWidth = useMemo(() => {
    if (numColumns === 1) return width - 32; // Mobile: full width minus padding
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
          {/* Old Icon Design - Party/People Icon */}
          <View style={[styles.oldIconContainer, isTablet && styles.oldIconContainerTablet]}>
            <Ionicons 
              name="people" 
              size={isTablet ? 36 : 30} 
              color="#8B0000" 
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text 
              style={[styles.title, isTablet && styles.titleTablet]} 
              numberOfLines={2}
            >
              {item.title}
            </Text>
            
            <View style={styles.arrowContainer}>
              <Ionicons 
                name="chevron-forward" 
                size={isTablet ? 20 : 18} 
                color="#8B0000" 
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <ActivityIndicator size={isTablet ? "large" : "large"} color="#8B0000" />
          <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
            Loading categories...
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

    if (titles.length === 0) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <Ionicons 
            name="people-outline" 
            size={isTablet ? 60 : 50} 
            color="#bbb" 
          />
          <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
            No categories found
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

  // List Container
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  listContainerTablet: {
    paddingHorizontal: 32,
    paddingTop: 30,
  },

  // Card
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  // Old Icon Design (Party/People Icon)
  oldIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "rgba(139, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  oldIconContainerTablet: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },

  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#8B0000",
    lineHeight: 20,
    paddingRight: 12,
  },
  titleTablet: {
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22,
  },

  arrowContainer: {
    paddingLeft: 4,
  },
});