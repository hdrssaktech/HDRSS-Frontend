import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const PartiesPage1 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId, districtName } = route.params || {};
  
  const { width, height } = useWindowDimensions();
  
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Tablet check with proper dimensions
  const isTablet = useMemo(() => {
    return width >= 600 || (width > height && width >= 600);
  }, [width, height]);

  // ✅ Mobile: 2 columns | Tablet: 3 columns
  const numColumns = useMemo(() => (isTablet ? 3 : 2), [isTablet]);

  // ✅ Dynamic card width with better spacing
  const itemWidth = useMemo(() => {
    const horizontalPadding = isTablet ? 32 : 16;
    const spacing = isTablet ? 20 : 12;
    const totalSpacing = (numColumns - 1) * spacing;
    return (width - horizontalPadding * 2 - totalSpacing) / numColumns;
  }, [numColumns, width, isTablet]);

  // ✅ Responsive image height
  const imageHeight = useMemo(() => {
    return isTablet ? 160 : 140;
  }, [isTablet]);

  // ✅ Responsive title font size
  const titleFontSize = useMemo(() => {
    return isTablet ? 15 : 14;
  }, [isTablet]);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/party/categories/district/${districtId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setParties(data);
        } else if (data && typeof data === "object") {
          // Handle single object or object with array property
          if (Array.isArray(data.data)) {
            setParties(data.data);
          } else if (Array.isArray(data.categories)) {
            setParties(data.categories);
          } else if (!data.message) {
            setParties([data]);
          } else {
            setParties([]);
          }
        } else {
          setParties([]);
        }
      } catch (error) {
        console.log("❌ Error fetching parties:", error);
        setError("Failed to load parties. Please try again.");
        setParties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, [districtId]);

  const renderPartyCard = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
        isTablet && styles.cardTablet,
        { 
          width: itemWidth,
          marginBottom: isTablet ? 20 : 15,
          marginRight: (index % numColumns !== numColumns - 1) ? (isTablet ? 20 : 12) : 0
        },
      ]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("Partiespage2", { 
        partyId: item.id,
        partyName: item.name 
      })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              item.image ||
              "https://via.placeholder.com/400x250/f0f0f0/8B0000?text=Party",
          }}
          style={[
            styles.image, 
            { height: imageHeight },
            isTablet && styles.imageTablet
          ]}
          resizeMode="cover"
        />
      </View>

      <View style={[styles.textContainer, isTablet && styles.textContainerTablet]}>
        <Text
          style={[
            styles.title, 
            { fontSize: titleFontSize },
            isTablet && styles.titleTablet
          ]}
          numberOfLines={2}
        >
          {item.name || "Unnamed Party"}
        </Text>
        
        <View style={styles.arrowContainer}>
          <Ionicons 
            name="arrow-forward" 
            size={isTablet ? 18 : 16} 
            color="#8B0000" 
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerTitleWrap}>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Parties
        </Text>
        {districtName && (
          <Text style={[styles.subTitle, isTablet && styles.subTitleTablet]} numberOfLines={1}>
            {districtName}
          </Text>
        )}
      </View>
      
      <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <ActivityIndicator size="large" color="#8B0000" />
          <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
            Loading parties...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <Ionicons name="alert-circle-outline" size={isTablet ? 60 : 50} color="#8B0000" />
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

    if (parties.length === 0) {
      return (
        <View style={[styles.centerContainer, isTablet && styles.centerContainerTablet]}>
          <Ionicons name="people-outline" size={isTablet ? 60 : 50} color="#bbb" />
          <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
            No parties available
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={parties}
        key={`${numColumns}_${width}`}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.id?.toString() || `party-${index}`}
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

export default PartiesPage1;

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
  subTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  subTitleTablet: {
    fontSize: 14,
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
  },
  cardTablet: {
    borderRadius: 18,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  imageContainer: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
  },
  imageTablet: {
    // Additional tablet image styles
  },

  textContainer: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 60,
    backgroundColor: "#FFFFFF",
  },
  textContainerTablet: {
    padding: 14,
    minHeight: 70,
  },
  title: {
    flex: 1,
    fontWeight: "800",
    color: "#8B0000",
    lineHeight: 18,
    paddingRight: 8,
  },
  titleTablet: {
    fontWeight: "900",
    lineHeight: 20,
  },
  arrowContainer: {
    paddingLeft: 4,
  },
});