// screens/ProductScreen4.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  StatusBar,
  Platform,
  Share,
  Alert,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
  Animated,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import YoutubePlayer from "react-native-youtube-iframe";
import axios from "axios";

const { width, height } = Dimensions.get("window");
const isTablet = width > 768;
const isSmallDevice = width < 380;

// Responsive sizing
const responsive = {
  imageHeight: isTablet ? height * 0.45 : height * 0.35,
  contentPadding: isTablet ? 30 : 20,
  nameSize: isTablet ? 30 : isSmallDevice ? 22 : 26,
  priceSize: isTablet ? 34 : isSmallDevice ? 26 : 30,
  sectionTitleSize: isTablet ? 22 : 18,
  specificationSize: isTablet ? 17 : 15,
  galleryImageSize: isTablet ? width * 0.28 : width * 0.38,
  iconSize: isTablet ? 26 : 20,
  actionBtnSize: isTablet ? 56 : 48,
  videoHeight: isTablet ? 400 : 220,
  headerPaddingTop: Platform.OS === "ios" ? (isTablet ? 50 : 40) : (isTablet ? 40 : 30),
};

const getYoutubeVideoId = (url) => {
  if (!url) return null;
  if (url.length === 11 && !url.includes("http")) return url;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
    /(?:youtube\.com\/embed\/)([\w-]+)/,
    /(?:youtube\.com\/v\/)([\w-]+)/,
    /(?:youtube\.com\/shorts\/)([\w-]+)/,
  ];
  for (let p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  const idMatch = url.match(/([\w-]{11})/);
  return idMatch ? idMatch[1] : null;
};

export default function ProductScreen4({ route, navigation }) {
  const { product } = route.params || {};
  const playerRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [productData, setProductData] = useState(product || {});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [showVideo, setShowVideo] = useState(false);

  // ── CART STATE ──
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);
  const [addedToCart, setAddedToCart] = useState(false);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // ── FETCH ──
  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://hdrss-backend.onrender.com/api/product-details");
      if (res.data?.success) {
        const fresh = res.data.data.find((p) => p.id === productData.id);
        if (fresh) {
          setProductData(fresh);
          const url = fresh.videoLinks?.[0] || null;
          setVideoId(url ? getYoutubeVideoId(url) : null);
          setRefreshKey(Date.now());
          setIsLoading(true);
          setIsVideoReady(false);
          setPlaying(false);
          setShowVideo(false);
          Alert.alert("Success", "Product data refreshed!");
        }
      }
    } catch {
      Alert.alert("Error", "Failed to refresh product data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [productData.id]);

  useEffect(() => {
    const url = productData.videoLinks?.[0] || null;
    setVideoId(url ? getYoutubeVideoId(url) : null);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProductData();
  }, [fetchProductData]);

  // ── CONTACT FUNCTIONS ──
  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out: ${productData.productName}\nPrice: ₹${productData.price}`,
      });
    } catch {
      Alert.alert("Error", "Failed to share");
    }
  };

  const handleCall = () => {
    Linking.openURL(`tel:${productData.phoneNumber?.replace(/\s/g, "") || "+919876543210"}`)
      .catch(() => Alert.alert("Error", "Unable to call"));
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${productData.whatsappNumber?.replace(/\s/g, "") || "+919876543210"}`)
      .catch(() => Alert.alert("Error", "Unable to open WhatsApp"));
  };

  const handleLocation = () => {
    Linking.openURL(productData.locationLink || "https://maps.google.com")
      .catch(() => Alert.alert("Error", "Unable to open location"));
  };

  // ── ADD TO CART ──
  const handleAddToCart = () => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === productData.id);
      if (exists) {
        return prev.map((i) =>
          i.id === productData.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...productData, quantity: 1 }];
    });
    
    setAddedToCart(true);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 30 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // ── BUY NOW → CheckoutScreen ──
  const handleBuyNow = () => {
    if (!productData || !productData.id) {
      Alert.alert("Error", "Product data is not available");
      return;
    }
    
    // Navigate to CheckoutScreen with the product
    navigation.navigate("CheckoutScreen", {
      items: [{ ...productData, quantity: 1 }],
      totalAmount: parseFloat(productData.price) || 0,
      fromBuyNow: true,
    });
  };

  // ── OPEN CART → CartScreen ──
  const handleOpenCart = () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is Empty", "Please add items to your cart first.");
      return;
    }
    
    navigation.navigate("CartScreen", {
      cartItems: cartItems,
      onUpdateCart: (updatedItems) => {
        setCartItems(updatedItems);
      },
    });
  };

  // ── VIDEO ──
  const toggleVideo = () => {
    setShowVideo((v) => !v);
    setPlaying((v) => !v);
  };

  // ── RENDER GALLERY ──
  const renderGalleryItem = ({ item }) => (
    <Image
      source={{ uri: item }}
      style={[
        styles.galleryImage,
        {
          width: responsive.galleryImageSize,
          height: responsive.galleryImageSize,
        },
      ]}
      resizeMode="cover"
    />
  );

  // ── RENDER CONTACT BUTTONS ──
  const renderContactButtons = () => (
    <View style={styles.actionRow}>
      {[
        { icon: "call", color: "#8B1A1A", fn: handleCall, label: "Call" },
        { icon: "logo-whatsapp", color: "#25D366", fn: handleWhatsApp, label: "WhatsApp" },
        { icon: "location", color: "#DC2626", fn: handleLocation, label: "Location" },
      ].map(({ icon, color, fn, label }) => (
        <TouchableOpacity
          key={icon}
          style={[
            styles.actionBtn,
            {
              backgroundColor: color,
              width: responsive.actionBtnSize,
              height: responsive.actionBtnSize,
              borderRadius: responsive.actionBtnSize / 2,
            },
          ]}
          onPress={fn}
        >
          <Ionicons name={icon} size={isTablet ? 28 : 24} color="#fff" />
        </TouchableOpacity>
      ))}
    </View>
  );

  // ── RENDER VIDEO ──
  const renderVideo = () => {
    if (!videoId) {
      return (
        <View style={styles.videoSection}>
          <Text style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}>
            Video
          </Text>
          <View style={styles.noVideoContainer}>
            <Ionicons name="videocam-off" size={isTablet ? 80 : 50} color="#CBD5E1" />
            <Text style={styles.noVideoText}>No video available</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.videoSection}>
        <Text style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}>
          Product Video
        </Text>
        {!showVideo ? (
          <TouchableOpacity onPress={toggleVideo} activeOpacity={0.9} style={styles.videoTouchable}>
            <ImageBackground
              source={{ uri: `https://i.ytimg.com/vi/${videoId}/hq720.jpg` }}
              style={[styles.videoThumbnail, { height: responsive.videoHeight }]}
              imageStyle={{ borderRadius: 0 }}
            >
              <View style={styles.videoOverlay}>
                <View style={styles.playIconContainer}>
                  <Ionicons name="play-circle" size={isTablet ? 80 : 60} color="#FF0000" />
                </View>
                <Text style={styles.playText}>Tap to Play Video</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <View style={styles.videoWrapper}>
            <YoutubePlayer
              key={refreshKey}
              ref={playerRef}
              height={responsive.videoHeight}
              width={width}
              videoId={videoId}
              play={playing}
              initialPlayerParams={{
                controls: true,
                modestbranding: true,
                rel: 0,
                fs: 1,
              }}
              onChangeState={(s) => {
                if (s === "ended") {
                  setPlaying(false);
                  setShowVideo(false);
                }
                if (s === "playing") {
                  setIsVideoReady(true);
                  setIsLoading(false);
                }
                if (s === "loading") setIsLoading(true);
                if (s === "ready") {
                  setIsVideoReady(true);
                  setIsLoading(false);
                }
              }}
              onReady={() => {
                setIsLoading(false);
                setIsVideoReady(true);
              }}
              onError={() => {
                Alert.alert("Error", "Failed to load video");
                setIsLoading(false);
                setShowVideo(false);
              }}
              webViewProps={{
                allowsInlineMediaPlayback: true,
                mediaPlaybackRequiresUserAction: false,
              }}
            />
            <TouchableOpacity
              style={styles.closeVideoBtn}
              onPress={() => {
                setShowVideo(false);
                setPlaying(false);
              }}
            >
              <Ionicons name="close-circle" size={isTablet ? 40 : 32} color="#fff" />
            </TouchableOpacity>
            {isLoading && !isVideoReady && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FF0000" />
                <Text style={styles.loaderText}>Loading video...</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // ── MAIN RENDER ──
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#8B1A1A"]}
            tintColor="#8B1A1A"
          />
        }
      >
        <StatusBar backgroundColor="#9D1B00" barStyle="light-content" />

        {/* HEADER */}
        <View style={[styles.headerContainer, { paddingTop: responsive.headerPaddingTop }]}>
          <TouchableOpacity style={styles.roundBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={responsive.iconSize} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Product Details
          </Text>

          <View style={styles.headerRight}>
            {/* Cart icon with badge */}
            <TouchableOpacity style={styles.roundBtn} onPress={handleOpenCart}>
              <Ionicons name="cart" size={responsive.iconSize} color="#fff" />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount > 9 ? "9+" : cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roundBtn, { marginLeft: 8 }]} onPress={onShare}>
              <Ionicons name="share-social" size={responsive.iconSize} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* BANNER IMAGE */}
        <Image
          source={{
            uri:
              productData.bannerImage ||
              productData.image ||
              "https://via.placeholder.com/400",
          }}
          style={[styles.mainImage, { height: responsive.imageHeight }]}
          resizeMode="cover"
        />

        {/* BODY CONTENT */}
        <View style={[styles.content, { paddingHorizontal: responsive.contentPadding }]}>
          <View style={styles.headerSection}>
            <Text style={[styles.productName, { fontSize: responsive.nameSize }]}>
              {productData.productName || "Product"}
            </Text>
            <View style={styles.priceRow}>
              <Text style={[styles.productPrice, { fontSize: responsive.priceSize }]}>
                ₹{productData.price || "0.00"}
              </Text>
              {loading && <ActivityIndicator size="small" color="#8B1A1A" style={{ marginLeft: 10 }} />}
            </View>
          </View>

          {renderContactButtons()}
          <View style={styles.divider} />

          {/* SPECIFICATIONS */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}>
              Specifications
            </Text>
            <Text style={[styles.specText, { fontSize: responsive.specificationSize }]}>
              {productData.productSpecification || "No specifications available"}
            </Text>
          </View>
          <View style={styles.divider} />

          {/* GALLERY */}
          {productData.galleryImages?.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}>
                Gallery
              </Text>
              <FlatList
                horizontal
                data={productData.galleryImages}
                renderItem={renderGalleryItem}
                keyExtractor={(_, i) => `g-${i}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 5 }}
              />
            </View>
          )}
          <View style={styles.divider} />

          {/* VIDEO */}
          {renderVideo()}
        </View>
      </ScrollView>

      {/* ── STICKY BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        {/* ADD TO CART */}
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.cartBtn, addedToCart && styles.cartBtnAdded]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Ionicons
              name={addedToCart ? "checkmark-circle" : "cart-outline"}
              size={isTablet ? 24 : 21}
              color={addedToCart ? "#fff" : "#8B1A1A"}
            />
            <Text style={[styles.cartBtnText, addedToCart && styles.cartBtnTextAdded]}>
              {addedToCart ? "Added!" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* BUY NOW */}
        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow} activeOpacity={0.85}>
          <Ionicons name="flash" size={isTablet ? 24 : 21} color="#fff" />
          <Text style={styles.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── STYLES ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#9D1B00",
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: "#8B1A1A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  roundBtn: {
    width: isTablet ? 50 : 40,
    height: isTablet ? 50 : 40,
    borderRadius: isTablet ? 25 : 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  headerTitle: {
    color: "#fff",
    fontSize: isTablet ? 24 : 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#D4AF37",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },

  badgeText: {
    color: "#301913",
    fontSize: 10,
    fontWeight: "bold",
  },

  mainImage: {
    width: width,
    backgroundColor: "#E2E8F0",
  },

  content: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },

  headerSection: {
    marginBottom: 12,
  },

  productName: {
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 6,
    lineHeight: isTablet ? 40 : 32,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  productPrice: {
    fontWeight: "bold",
    color: "#8B1A1A",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    marginBottom: 15,
    paddingHorizontal: isTablet ? 40 : 20,
  },

  actionBtn: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: isTablet ? 24 : 18,
  },

  section: {
    marginBottom: 8,
  },

  sectionTitle: {
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },

  specText: {
    lineHeight: 24,
    color: "#475569",
    textAlign: "justify",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  galleryImage: {
    borderRadius: 15,
    marginRight: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  videoSection: {
    marginVertical: 5,
  },

  videoTouchable: {
    marginHorizontal: -responsive.contentPadding,
  },

  videoThumbnail: {
    width: width,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  videoOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  playIconContainer: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 50,
    padding: isTablet ? 15 : 10,
    elevation: 8,
  },

  playText: {
    color: "#fff",
    fontSize: isTablet ? 18 : 16,
    fontWeight: "600",
    marginTop: 12,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  videoWrapper: {
    backgroundColor: "#000",
    position: "relative",
    marginHorizontal: -responsive.contentPadding,
  },

  closeVideoBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 25,
    padding: 6,
    elevation: 5,
  },

  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  loaderText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },

  noVideoContainer: {
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    padding: isTablet ? 60 : 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },

  noVideoText: {
    color: "#94A3B8",
    fontSize: isTablet ? 18 : 16,
    textAlign: "center",
    marginTop: 10,
  },

  // STICKY BOTTOM BAR
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: isTablet ? 16 : 12,
    paddingBottom: Platform.OS === "ios" ? (isTablet ? 34 : 28) : (isTablet ? 16 : 12),
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    gap: 12,
  },

  cartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    borderWidth: 2,
    borderColor: "#8B1A1A",
    borderRadius: isTablet ? 16 : 14,
    paddingVertical: isTablet ? 16 : 14,
    gap: 8,
  },

  cartBtnAdded: {
    backgroundColor: "#25A244",
    borderColor: "#25A244",
  },

  cartBtnText: {
    color: "#8B1A1A",
    fontSize: isTablet ? 16 : 15,
    fontWeight: "700",
  },

  cartBtnTextAdded: {
    color: "#fff",
  },

  buyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B1A1A",
    borderRadius: isTablet ? 16 : 14,
    paddingVertical: isTablet ? 16 : 14,
    gap: 8,
    elevation: 4,
    shadowColor: "#8B1A1A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },

  buyBtnText: {
    color: "#fff",
    fontSize: isTablet ? 16 : 15,
    fontWeight: "700",
  },
});