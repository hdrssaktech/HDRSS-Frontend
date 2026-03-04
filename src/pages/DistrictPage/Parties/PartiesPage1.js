import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
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
import Loader from "../../../components/Alert/Loader";

const PartiesPage1 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId, districtName } = route.params || {};
  
  const { width, height } = useWindowDimensions();
  
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tablet check with proper dimensions
  const isTablet = useMemo(() => {
    return width >= 600 || (width > height && width >= 600);
  }, [width, height]);

  // Mobile: 2 columns | Tablet: 3 columns
  const numColumns = useMemo(() => (isTablet ? 3 : 2), [isTablet]);

  // Calculate card width for consistent sizing (like model code)
  const gap = 16;
  const horizontalPadding = 32; // 16 * 2
  const totalGap = (numColumns - 1) * gap;
  const cardWidth = (width - horizontalPadding - totalGap) / numColumns;

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

  // Create a special item for Elected Representatives
  const electedRepsItem = useMemo(() => ({
    id: 'elected-reps-special',
    name: 'Elected Representatives',
    type: 'elected-reps',
    image: require('../../../../assets/Election/governmentlogo.jpeg'),
    districtName: districtName
  }), [districtName]);

  // Combine the special item with parties data
  const allItems = useMemo(() => {
    return [electedRepsItem, ...parties];
  }, [electedRepsItem, parties]);

  const renderCard = ({ item, index }) => {
    // Check if it's the last item in the row
    const isLastInRow = (index + 1) % numColumns === 0;
    
    // If it's the Elected Representatives card
    if (item.type === 'elected-reps') {
      return (
        <TouchableOpacity
          style={[
            styles.card,
            isTablet && styles.cardTablet,
            { 
              width: cardWidth,
              marginRight: !isLastInRow ? gap : 0,
              marginBottom: gap,
            },
          ]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("DistrictAssembly3", { 
            districtId: districtId,
            districtName: districtName
          })}
        >
          <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}>
            <Image
              source={item.image}
              style={[
                styles.cardImage,
                isTablet && styles.cardImageTablet,
              ]}
              resizeMode="cover"
            />
          </View>

          <View style={[styles.textContainer, isTablet && styles.textContainerTablet]}>
            <View style={styles.cardTextWrap}>
              <Text
                style={[
                  styles.title,
                  isTablet && styles.titleTablet,
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              
              {item.districtName && (
                <Text style={[styles.cardSubText, isTablet && styles.cardSubTextTablet]}>
                  {item.districtName}
                </Text>
              )}
            </View>
            
            <View style={styles.arrowCircle}>
              <Ionicons 
                name="arrow-forward" 
                size={isTablet ? 18 : 16} 
                color="#8B0000" 
              />
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    
    // Regular party card
    return (
      <TouchableOpacity
        style={[
          styles.card,
          isTablet && styles.cardTablet,
          { 
            width: cardWidth,
            marginRight: !isLastInRow ? gap : 0,
            marginBottom: gap,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("Partiespage2", { 
          partyId: item.id,
          partyName: item.name 
        })}
      >
        <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}>
          <Image
            source={{
              uri:
                item.image ||
                "https://via.placeholder.com/400x250/f0f0f0/8B0000?text=Party",
            }}
            style={[
              styles.cardImage,
              isTablet && styles.cardImageTablet,
            ]}
            resizeMode="cover"
          />
        </View>

        <View style={[styles.textContainer, isTablet && styles.textContainerTablet]}>
          <Text
            style={[
              styles.title,
              isTablet && styles.titleTablet,
            ]}
            numberOfLines={2}
          >
            {item.name || "Unnamed Party"}
          </Text>
          
          <View style={styles.arrowCircle}>
            <Ionicons 
              name="arrow-forward" 
              size={isTablet ? 18 : 16} 
              color="#8B0000" 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
      return <Loader />;
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

    return (
      <FlatList
        data={allItems}
        key={`${numColumns}_${width}`}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.id?.toString() || `item-${index}`}
        renderItem={renderCard}
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
  subTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  subTitleTablet: {
    fontSize: 14,
    marginTop: 6,
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
    paddingTop: 16,
  },
  listContainerTablet: {
    paddingHorizontal: 32,
    paddingTop: 20,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(139, 0, 0, 0.1)",
  },
  cardTablet: {
    borderRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  imageContainer: {
    width: "100%",
    height: 140,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  imageContainerTablet: {
    height: 160,
  },
  
  cardImage: {
    width: "100%",
    height: "100%",
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
    padding: 16,
    minHeight: 70,
  },
  cardTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    flex: 1,
    fontWeight: "800",
    color: "#8B0000",
    lineHeight: 20,
    fontSize: 14,
  },
  titleTablet: {
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 22,
  },
  cardSubText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
    marginTop: 2,
  },
  cardSubTextTablet: {
    fontSize: 13,
    marginTop: 4,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(139, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});

export default PartiesPage1;