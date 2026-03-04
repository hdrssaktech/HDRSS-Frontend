import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  TextInput
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Loader from "../../../components/Alert/Loader";

const { width } = Dimensions.get('window');
const isTablet = width >= 600;

export default function PoojaCategory() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);


  useEffect(() => {
    fetchPoojaCategory();
  }, []);

  const fetchPoojaCategory = async () => {
    try {
      const response = await fetch(
        `https://hdrss-backend.onrender.com/api/pooja/poojacategory/${id}`
      );
      const result = await response.json();
      setData(result.data);
      setFilteredData(result.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const navigateToDetails = (item) => {
    navigation.navigate("PoojaDetails", { poojaItem: item });
  };

  if (loading) {
    return <Loader />;
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No Data Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Pooja Services
        </Text>
        
        <View style={[styles.headerRightPlaceholder, isTablet && styles.headerRightPlaceholderTablet]} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isTablet && styles.searchContainerTablet]}>
        <Icon name="search" size={isTablet ? 24 : 20} color="#999" />
        <TextInput
          placeholder="Search pooja by title..."
          value={searchText}
          onChangeText={handleSearch}
          style={[styles.searchInput, isTablet && styles.searchInputTablet]}
          placeholderTextColor="#999"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Icon name="close" size={isTablet ? 24 : 20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredData.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.card,
              isTablet && styles.cardTablet
            ]}
            onPress={() => navigateToDetails(item)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.cardContent,
              isTablet && styles.cardContentTablet
            ]}>
              {/* Image Section */}
              <View style={[
                styles.imageContainer,
                isTablet && styles.imageContainerTablet
              ]}>
                <Image 
                  source={{ uri: item.image || item.bannerimg }} 
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              {/* Details Section */}
              <View style={[
                styles.detailsContainer,
                isTablet && styles.detailsContainerTablet
              ]}>
                <Text style={[
                  styles.title,
                  isTablet && styles.titleTablet
                ]} numberOfLines={2}>
                  {item.title}
                </Text>

                {/* Icons Only - No Text */}
                <View style={styles.iconsContainer}>
                  {/* Phone Icon - Only show if Phone exists */}
                  {item.Phone && (
                    <TouchableOpacity 
                      style={styles.iconButton}
                      activeOpacity={0.7}
                      onPress={() => {
                        // Add phone call functionality here
                        // Linking.openURL(`tel:${item.Phone}`)
                      }}
                    >
                      <View style={[styles.iconCircle, styles.phoneIcon, isTablet && styles.iconCircleTablet]}>
                        <Icon name="phone" size={isTablet ? 22 : 18} color="white" />
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* WhatsApp Icon - Only show if WhatsApp exists */}
                  {item.whatshapp && (
                    <TouchableOpacity 
                      style={styles.iconButton}
                      activeOpacity={0.7}
                      onPress={() => {
                        // Add WhatsApp functionality here
                        // Linking.openURL(`https://wa.me/${item.whatshapp}`)
                      }}
                    >
                      <View style={[styles.iconCircle, styles.whatsappIcon, isTablet && styles.iconCircleTablet]}>
                        <Ionicons name="logo-whatsapp" size={isTablet ? 22 : 18} color="white" />
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Location Icon - Only show if location exists */}
                  {item.location && (
                    <TouchableOpacity 
                      style={styles.iconButton}
                      activeOpacity={0.7}
                      onPress={() => {
                        // Add location/map functionality here
                        // Linking.openURL(`https://maps.google.com/?q=${item.location}`)
                      }}
                    >
                      <View style={[styles.iconCircle, styles.locationIcon, isTablet && styles.iconCircleTablet]}>
                        <Icon name="location-on" size={isTablet ? 22 : 18} color="white" />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Optional: Add More Details indicator */}
                {item.description && (
                  <View style={styles.moreContainer}>
                    <Text style={[styles.moreText, isTablet && styles.moreTextTablet]}>
                      View Details
                    </Text>
                    <Icon name="arrow-forward" size={isTablet ? 20 : 16} color="#93210A" />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
  },

  // Header Styles
  header: {
   flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop:40,
    paddingBottom:30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingTop:45,
    paddingBottom:28,
    paddingHorizontal: 18,
  },
  backButton:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  backButtonTablet:{
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  headerRightPlaceholder: {
    width: 34,
  },
  headerRightPlaceholderTablet: {
    width: 44,
  },

  // Search Bar Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 15,
    marginHorizontal: 15,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  searchContainerTablet: {
    margin: 20,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  searchInput: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    paddingVertical: 0,
  },
  searchInputTablet: {
    height: 55,
    fontSize: 16,
    marginLeft: 12,
  },

  // Scroll Content Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  scrollContentTablet: {
    padding: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Card Styles
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTablet: {
    width: width >= 1024 ? '49%' : '100%',
    marginBottom: 20,
    borderRadius: 20,
  },
  cardContent: {
    flexDirection: "row",
    height: 140,
  },
  cardContentTablet: {
    height: 180,
  },

  // Image Styles
  imageContainer: {
    width: "40%",
    padding: 10,
  },
  imageContainerTablet: {
    width: "35%",
    padding: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },

  // Details Styles
  detailsContainer: {
    width: "60%",
    padding: 12,
    justifyContent: "space-between",
  },
  detailsContainerTablet: {
    width: "65%",
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },
  titleTablet: {
    fontSize: 18,
    marginBottom: 10,
    lineHeight: 24,
  },

  // Icons Styles
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  iconButton: {
    padding: 2,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  iconCircleTablet: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  phoneIcon: {
    backgroundColor: '#93210A',
  },
  whatsappIcon: {
    backgroundColor: '#25D366',
  },
  locationIcon: {
    backgroundColor: '#93210A',
  },

  // More Container Styles
  moreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  moreText: {
    fontSize: 12,
    color: "#93210A",
    fontWeight: '600',
  },
  moreTextTablet: {
    fontSize: 14,
  },
});