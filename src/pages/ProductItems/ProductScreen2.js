import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getProductTypes } from "../../api/api";

const { width } = Dimensions.get("window");

const isTablet = width >= 600;
const NUM_COLUMNS = isTablet ? 4 : 3;

const horizontalPadding = isTablet ? 30 : 16;
const availableWidth = width - horizontalPadding * 2;
const gap = isTablet ? 20 : 12;

const CARD_WIDTH = (availableWidth - gap * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
const AD_WIDTH = width;

export default function ProductScreen2({ navigation, route }) {
  const category = route?.params?.category || "Products";
  const categoryId = route?.params?.categoryId;

  const [productTypes, setProductTypes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [adImages, setAdImages] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProductTypes();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  useEffect(() => {
    if (adImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % adImages.length;
          scrollViewRef.current?.scrollToOffset({
            offset: nextIndex * AD_WIDTH,
            animated: true,
          });
          return nextIndex;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [adImages]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredProducts(productTypes);
    } else {
      const filtered = productTypes.filter((item) =>
        item.typeName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchText, productTypes]);

  const loadProductTypes = async () => {
    try {
      const data = await getProductTypes();
      const filtered = data.filter(
        (item) => item.productCategoryId === categoryId
      );
      setProductTypes(filtered);
      setFilteredProducts(filtered);

      const allAdImages = [];
      filtered.forEach((item) => {
        if (item.advertisementImages && item.advertisementImages.length > 0) {
          allAdImages.push(...item.advertisementImages);
        }
      });
      if (allAdImages.length === 0) {
        filtered.forEach((item) => {
          if (item.image) allAdImages.push(item.image);
        });
      }
      setAdImages(allAdImages);
    } catch (error) {
      console.log("Product Type Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderAdItem = ({ item }) => (
    <View style={styles.adSlideContainer}>
      <Image source={{ uri: item }} style={styles.adImage} resizeMode="cover" />
      <View style={styles.adOverlay} />
    </View>
  );

  const renderItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.78}
        onPress={() =>
          navigation.navigate("ProductScreen3", {
            productType: item.typeName,
            productTypeId: item.id,
          })
        }
      >
        <View style={styles.circleRing}>
          <View style={styles.circleImageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.namePill}>
          <Text style={styles.name} numberOfLines={2}>
            {item.typeName}
          </Text>
          <View style={styles.nameUnderline} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#9D1B00" barStyle="light-content" />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 34 : 28} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrapper}>
          <Text style={styles.heading} numberOfLines={1}>
            {category}
          </Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      {adImages.length > 0 && (
        <View style={styles.adSection}>
          <FlatList
            ref={scrollViewRef}
            data={adImages}
            renderItem={renderAdItem}
            keyExtractor={(item, index) => `ad-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            snapToInterval={AD_WIDTH}
            decelerationRate="fast"
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / AD_WIDTH
              );
              setCurrentAdIndex(index);
            }}
          />
          {adImages.length > 1 && (
            <View style={styles.adDots}>
              {adImages.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    currentAdIndex === idx && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={isTablet ? 24 : 20} color="#9D1B00" />
        <TextInput
          placeholder="Search items..."
          placeholderTextColor="#94A3B8"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={isTablet ? 20 : 18} color="#94A3B8" />
          </TouchableOpacity>
        )}
        <View style={styles.categoryBadgeContainer}>
          <Ionicons name="layers-outline" size={isTablet ? 14 : 12} color="#9D1B00" />
          <Text style={styles.categoryBadgeText} numberOfLines={1}>
            {category}
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionAccentBar} />
        <Text style={styles.subTitleText}>Categories</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#9D1B00" />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={NUM_COLUMNS}
          key={NUM_COLUMNS}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={isTablet ? 56 : 48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  headerContainer: {
    backgroundColor: "#9D1B00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...(!isTablet && {
      height: 100,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingHorizontal: 20,
      paddingTop: 25,
    }),
    ...(isTablet && {
      height: 130,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
      paddingHorizontal: 40,
      paddingTop: 30,
    }),
    shadowColor: "#9D1B00",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  backButton: {
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    width: isTablet ? 55 : 40,
    height: isTablet ? 55 : 40,
  },

  headerTitleWrapper: {
    flex: 1,
    alignItems: "center",
  },

  heading: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: isTablet ? 30 : 22,
    marginHorizontal: isTablet ? 20 : 10,
    letterSpacing: 0.3,
  },

  headerPlaceholder: {
    width: isTablet ? 75 : 55,
  },

  adSection: {
    position: "relative",
  },

  adSlideContainer: {
    width: AD_WIDTH,
    height: isTablet ? 280 : 160,
    overflow: "hidden",
  },

  adImage: {
    width: "100%",
    height: "100%",
  },

  adOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "transparent",
  },

  adDots: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  activeDot: {
    backgroundColor: '#9D1B00',
    width: 20,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#F1E4E4",
    shadowColor: "#9D1B00",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: isTablet ? 24 : 16,
    marginTop: isTablet ? 20 : 14,
    paddingHorizontal: isTablet ? 16 : 14,
    height: isTablet ? 65 : 52,
    borderRadius: isTablet ? 20 : 16,
  },

  searchInput: {
    flex: 1,
    color: "#0F172A",
    marginLeft: isTablet ? 10 : 8,
    marginRight: 4,
    fontSize: isTablet ? 17 : 14,
    paddingVertical: 0,
  },

  clearButton: {
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  categoryBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDF2F2",
    borderWidth: 1,
    borderColor: "#F8D0D0",
    borderRadius: isTablet ? 12 : 9,
    paddingVertical: isTablet ? 7 : 5,
    paddingHorizontal: isTablet ? 12 : 9,
    marginLeft: 6,
    maxWidth: width * 0.28,
  },

  categoryBadgeText: {
    color: "#9D1B00",
    fontWeight: "700",
    fontSize: isTablet ? 13 : 11,
    marginLeft: 4,
    textTransform: "capitalize",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: isTablet ? 24 : 18,
    marginBottom: isTablet ? 14 : 10,
    marginHorizontal: horizontalPadding,
  },

  sectionAccentBar: {
    width: isTablet ? 5 : 4,
    height: isTablet ? 26 : 20,
    borderRadius: 999,
    backgroundColor: "#9D1B00",
    marginRight: isTablet ? 12 : 10,
  },

  subTitleText: {
    flex: 1,
    color: "#0F172A",
    fontWeight: "800",
    fontSize: isTablet ? 22 : 18,
    letterSpacing: -0.3,
  },

  listContainer: {
    paddingBottom: isTablet ? 50 : 40,
    paddingHorizontal: horizontalPadding,
  },

  row: {
    justifyContent: "flex-start",
    gap: gap,
    marginBottom: isTablet ? 28 : 20,
  },

  cardWrapper: {
    width: CARD_WIDTH,
    alignItems: "center",
  },

  card: {
    width: CARD_WIDTH,
    alignItems: "center",
  },

  circleRing: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: CARD_WIDTH / 2,
    borderWidth: isTablet ? 2.5 : 2,
    borderColor: "#F3C5C5",
    padding: isTablet ? 4 : 3,
    shadowColor: "#9D1B00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: "#FFFFFF",
  },

  circleImageContainer: {
    flex: 1,
    borderRadius: CARD_WIDTH / 2,
    backgroundColor: "#FDF5F5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: isTablet ? 14 : 10,
  },

  image: {
    width: "110%",
    height: "100%",
  },

  namePill: {
    alignItems: "center",
    marginTop: isTablet ? 10 : 7,
    width: "100%",
  },

  name: {
    textAlign: "center",
    fontWeight: "700",
    color: "#1A1A2E",
    fontSize: isTablet ? 15 : 12,
    lineHeight: isTablet ? 20 : 16,
  },

  nameUnderline: {
    width: "40%",
    height: 2,
    backgroundColor: "#9D1B00",
    borderRadius: 1,
    marginTop: isTablet ? 6 : 4,
    opacity: 0.3,
  },

  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loaderText: {
    color: "#9D1B00",
    fontSize: isTablet ? 16 : 14,
    fontWeight: "600",
    opacity: 0.7,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: isTablet ? 80 : 60,
    gap: isTablet ? 14 : 12,
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: isTablet ? 17 : 15,
    fontWeight: "500",
  },
});