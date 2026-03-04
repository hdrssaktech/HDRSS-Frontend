import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native";

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No Data Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pooja Services</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={isTablet ? 24 : 20} color="#999" />
        <TextInput
          placeholder="Search pooja by title..."
          value={searchText}
          onChangeText={handleSearch}
          style={styles.searchInput}
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
                      <View style={[styles.iconCircle, styles.phoneIcon]}>
                        <Icon name="phone" size={isTablet ? 20 : 18} color="white" />
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
                      <View style={[styles.iconCircle, styles.whatsappIcon]}>
                        <Ionicons name="logo-whatsapp" size={isTablet ? 20 : 18} color="white" />
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
                      <View style={[styles.iconCircle, styles.locationIcon]}>
                        <Icon name="location-on" size={isTablet ? 20 : 18} color="white" />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
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
  header: {
    backgroundColor: "#93210A",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: isTablet ? 24 : 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  headerRightPlaceholder: {
    width: 34,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: isTablet ? 20 : 15,
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 4 : 0,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: isTablet ? 50 : 45,
    marginLeft: 12,
    fontSize: isTablet ? 16 : 14,
    color: "#333",
    paddingVertical: isTablet ? 8 : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  scrollContentTablet: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
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
  },
  cardTablet: {
    width: width >= 1024 ? '48%' : '100%',
    marginBottom: 20,
  },
  cardContent: {
    flexDirection: "row",
    height: isTablet ? 160 : 140,
  },
  cardContentTablet: {
    height: 180,
  },
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
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  detailsContainer: {
    width: "60%",
    padding: 12,
    justifyContent: "space-between",
  },
  detailsContainerTablet: {
    width: "65%",
    padding: 15,
  },
  title: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    lineHeight: isTablet ? 24 : 22,
  },
  titleTablet: {
    fontSize: 20,
    marginBottom: 12,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: isTablet ? 16 : 12,
  },
  iconButton: {
    padding: 4,
  },
  iconCircle: {
    width: isTablet ? 40 : 36,
    height: isTablet ? 40 : 36,
    borderRadius: isTablet ? 20 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
  moreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  moreText: {
    fontSize: isTablet ? 14 : 12,
    color: "#93210A",
    fontWeight: '600',
  },
});