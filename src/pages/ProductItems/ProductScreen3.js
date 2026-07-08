import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getProducts } from "../../api/api";
import HeaderCartOrders from "./ProductScreenHeaderCartOrders";

const { width } = Dimensions.get("window");

const isTablet = width > 600;
const isSmallDevice = width < 380;

const responsive = {
  adHeight: isTablet ? 280 : 200,
  cardPadding: isTablet ? 20 : 14,
  imageSize: isTablet ? width * 0.2 : width * 0.25,
  fontSize: {
    title: isTablet ? 32 : 24,
    productName: isTablet ? 18 : (isSmallDevice ? 14 : 16),
    price: isTablet ? 20 : (isSmallDevice ? 15 : 17),
    searchInput: isTablet ? 18 : 15,
  },
  iconSize: {
    back: isTablet ? 30 : 24,
    action: isTablet ? 20 : 16,
    search: isTablet ? 22 : 18,
  },
  buttonSize: isTablet ? 44 : (isSmallDevice ? 34 : 38),
};

const DEFAULT_ADS = [
  "https://m.media-amazon.com/images/G/31/img21/Wireless/katariy/Apple/Aplus_content/13_desk/iPhone_13_Product_Page_Flex_Module_Amazon_Desktop_Avail_1500__en-IN_01._CB640700609_.jpg",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=400&fit=crop",
];

export default function ProductScreen3({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [adImages, setAdImages] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const autoScrollInterval = useRef(null);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
        setFilteredProducts(response.data);

        const allAdImages = [];
        response.data.forEach((product) => {
          if (product.advertisementImages && product.advertisementImages.length > 0) {
            allAdImages.push(...product.advertisementImages);
          }
        });

        if (allAdImages.length > 0) {
          setAdImages(allAdImages);
        } else {
          setAdImages(DEFAULT_ADS);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to fetch products. Please try again.");
      setAdImages(DEFAULT_ADS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (adImages.length > 1) {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);

      autoScrollInterval.current = setInterval(() => {
        setCurrentAdIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % adImages.length;
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
          }
          return nextIndex;
        });
      }, 3000);
    }

    return () => {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    };
  }, [adImages]);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);
    if (index !== currentAdIndex && index < adImages.length) {
      setCurrentAdIndex(index);
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
        if (adImages.length > 1) {
          autoScrollInterval.current = setInterval(() => {
            setCurrentAdIndex((prevIndex) => {
              const nextIndex = (prevIndex + 1) % adImages.length;
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
              }
              return nextIndex;
            });
          }, 3000);
        }
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => navigation.navigate("ProductScreen4", { product: item })}
    >
      <View style={styles.cardImageWrapper}>
        <Image
          source={{ uri: item.image || item.bannerImage || "https://via.placeholder.com/200" }}
          style={[styles.image, { width: responsive.imageSize, height: responsive.imageSize }]}
          resizeMode="cover"
        />
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={[styles.productName, { fontSize: responsive.fontSize.productName }]} numberOfLines={2}>
          {item.productName || "Product Name"}
        </Text>

        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons key={star} name={star <= (item.rating || 4) ? "star" : "star-outline"} size={14} color="#FFB800" />
            ))}
          </View>
          <Text style={styles.ratingText}>({item.reviews || 24})</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, { fontSize: responsive.fontSize.price }]}>₹{item.price || "0.00"}</Text>
          {item.originalPrice && <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>}
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.iconButton, styles.callButton, { width: responsive.buttonSize, height: responsive.buttonSize }]}
            onPress={() => {
              if (item.phoneNumber) Linking.openURL(`tel:${item.phoneNumber.replace(/\s/g, "")}`);
              else Alert.alert("Info", "Phone number not available");
            }}
          >
            <Ionicons name="call" size={responsive.iconSize.action} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.whatsappButton, { width: responsive.buttonSize, height: responsive.buttonSize }]}
            onPress={() => {
              if (item.whatsappNumber) Linking.openURL(`https://wa.me/${item.whatsappNumber.replace(/\s/g, "")}`);
              else Alert.alert("Info", "WhatsApp number not available");
            }}
          >
            <Ionicons name="logo-whatsapp" size={responsive.iconSize.action} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.locationButton, { width: responsive.buttonSize, height: responsive.buttonSize }]}
            onPress={() => {
              if (item.locationLink) Linking.openURL(item.locationLink);
              else Alert.alert("Info", "Location not available");
            }}
          >
            <Ionicons name="location-sharp" size={responsive.iconSize.action} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAdvertisement = () => {
    if (!adImages || adImages.length === 0) return null;

    return (
      <View style={styles.adWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.adScrollView}
        >
          {adImages.map((image, index) => (
            <View key={index} style={styles.adImageWrapper}>
              <Image
                source={{ uri: image }}
                style={[styles.adImage, { width: width, height: responsive.adHeight }]}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={[styles.searchBar, isTablet && styles.searchBarTablet]}>
        <Ionicons name="search" size={responsive.iconSize.search} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { fontSize: responsive.fontSize.searchInput }]}
          placeholder="Search for phones..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={responsive.iconSize.search} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.backButton, isTablet && styles.backButtonTablet]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={responsive.iconSize.back} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Smart Phones</Text>
        </View>

        <View style={styles.headerRight}>
          <HeaderCartOrders navigation={navigation} iconSize={responsive.iconSize.back * 0.7} />
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContainer, isTablet && styles.listContainerTablet]}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <>
            {renderAdvertisement()}
            {renderSearchBar()}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="phone-portrait-outline" size={isTablet ? 80 : 60} color="#CBD5E1" />
            <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
              {searchQuery ? "No phones found" : "No phones available"}
            </Text>
            {searchQuery && (
              <TouchableOpacity style={styles.clearSearchButton} onPress={() => handleSearch("")}>
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F0E8" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F0E8" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#64748B" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
  emptyText: { marginTop: 12, fontSize: 16, color: "#94A3B8", fontWeight: "500" },
  emptyTextTablet: { fontSize: 20 },
  clearSearchButton: { marginTop: 12, paddingVertical: 8, paddingHorizontal: 20, backgroundColor: "#93210A", borderRadius: 20 },
  clearSearchText: { color: "#FFFFFF", fontWeight: "600" },

  headerContainer: {
    backgroundColor: "#93210A",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#93210A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  headerLeft: { width: 40, alignItems: "flex-start", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerRight: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },

  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)", justifyContent: "center", alignItems: "center" },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25 },

  headerTitle: { color: "#FFFFFF", fontWeight: "bold", textAlign: "center", fontSize: 20, letterSpacing: 0.5 },

  adWrapper: { width: width, position: "relative", backgroundColor: "#000" },
  adScrollView: { width: width },
  adImageWrapper: { width: width },
  adImage: { width: width },

  searchContainer: { paddingHorizontal: isTablet ? 24 : 12, paddingVertical: 12, backgroundColor: "#F5F0E8" },

  searchBar: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 16,
    paddingHorizontal: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, borderWidth: 1, borderColor: "#E2E8F0",
  },
  searchBarTablet: { borderRadius: 20, paddingHorizontal: 20, paddingVertical: 4 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 48, color: "#0F172A", paddingVertical: 8 },
  clearButton: { padding: 4 },

  listContainer: { paddingBottom: 20 },
  listContainerTablet: { paddingHorizontal: 24, paddingBottom: 30 },

  card: {
    flexDirection: "row", backgroundColor: "#FFFFFF", borderRadius: 20, marginBottom: 14,
    padding: isTablet ? 20 : 14, elevation: 4, shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6,
    marginHorizontal: isTablet ? 24 : 12, borderWidth: 1, borderColor: "#F1F5F9",
  },

  cardImageWrapper: { position: "relative" },
  image: { borderRadius: 16, backgroundColor: "#F8FAFC" },

  discountBadge: {
    position: "absolute", top: 6, left: 6, backgroundColor: "#93210A",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: "#FFFFFF",
  },
  discountText: { color: "#FFFFFF", fontSize: 10, fontWeight: "bold" },

  detailsContainer: { flex: 1, marginLeft: 14, justifyContent: "space-between" },
  productName: { fontWeight: "700", color: "#0F172A", marginBottom: 4, lineHeight: 22 },

  ratingContainer: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  stars: { flexDirection: "row", marginRight: 4 },
  ratingText: { color: "#64748B", fontSize: 12 },

  priceContainer: { flexDirection: "row", alignItems: "center", marginTop: 2, marginBottom: 6 },
  priceText: { fontWeight: "bold", color: "#93210A", marginRight: 8 },
  originalPrice: { color: "#94A3B8", fontSize: 13, textDecorationLine: "line-through" },

  actionRow: { flexDirection: "row", marginTop: 4, gap: 8 },
  iconButton: {
    borderRadius: 21, justifyContent: "center", alignItems: "center", marginRight: 6,
    elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3,
  },
  callButton: { backgroundColor: "#93210A" },
  whatsappButton: { backgroundColor: "#25D366" },
  locationButton: { backgroundColor: "#EF4444" },
});