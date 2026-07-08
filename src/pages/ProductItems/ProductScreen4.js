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
import { useCart } from "../../context/CartContext";
import HeaderCartOrders from "./ProductScreenHeaderCartOrders";

const { width, height } = Dimensions.get("window");
const isTablet = width > 600;
const isSmallDevice = width < 380;

const C = {
  primary: "#9D1B00",
  primaryDark: "#9D1B00",
  gold: "#D4AF37",
  bg: "#F7F3F0",
  surface: "#FFFFFF",
  textDark: "#1A0A0A",
  textMid: "#5C3A3A",
  textLight: "#9E7070",
  border: "#EDE0DC",
};

const responsive = {
  imageHeight: isTablet ? height * 0.4 : height * 0.32,
  contentPadding: isTablet ? 30 : 15,
  nameSize: isTablet ? 28 : isSmallDevice ? 20 : 24,
  priceSize: isTablet ? 32 : isSmallDevice ? 24 : 28,
  sectionTitleSize: isTablet ? 20 : 17,
  specificationSize: isTablet ? 16 : 14,
  galleryImageSize: isTablet ? width * 0.26 : width * 0.36,
  iconSize: isTablet ? 24 : 20,
  actionBtnSize: isTablet ? 52 : 46,
  videoHeight: isTablet ? 380 : 210,
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

  const { addToCart } = useCart();

  const [productData, setProductData] = useState(product || {});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [showVideo, setShowVideo] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

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

  const onShare = async () => {
    try {
      await Share.share({ message: `Check out: ${productData.productName}\nPrice: ₹${productData.price}` });
    } catch {
      Alert.alert("Error", "Failed to share");
    }
  };

  const handleCall = () =>
    Linking.openURL(`tel:${productData.phoneNumber?.replace(/\s/g, "") || "+919876543210"}`).catch(() =>
      Alert.alert("Error", "Unable to call")
    );

  const handleWhatsApp = () =>
    Linking.openURL(`https://wa.me/${productData.whatsappNumber?.replace(/\s/g, "") || "+919876543210"}`).catch(() =>
      Alert.alert("Error", "Unable to open WhatsApp")
    );

  const handleLocation = () =>
    Linking.openURL(productData.locationLink || "https://maps.google.com").catch(() =>
      Alert.alert("Error", "Unable to open location")
    );

  const handleAddToCart = () => {
    addToCart(productData, 1);
    setAddedToCart(true);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 30 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    setTimeout(() => setAddedToCart(false), 1600);
  };

  const handleBuyNow = () => {
    if (!productData || !productData.id) {
      Alert.alert("Error", "Product data is not available");
      return;
    }
    navigation.navigate("ProductScreenCheckout", {
      items: [{ ...productData, quantity: 1 }],
      totalAmount: parseFloat(productData.price) || 0,
      fromBuyNow: true,
    });
  };

  const toggleVideo = () => {
    setShowVideo((v) => !v);
    setPlaying((v) => !v);
  };

  const renderGalleryItem = ({ item }) => (
    <Image
      source={{ uri: item }}
      style={[styles.galleryImage, { width: responsive.galleryImageSize, height: responsive.galleryImageSize }]}
      resizeMode="cover"
    />
  );

  const renderContactButtons = () => (
    <View style={styles.actionRow}>
      {[
        { icon: "call", color: C.primary, fn: handleCall, label: "Call" },
        { icon: "logo-whatsapp", color: "#25D366", fn: handleWhatsApp, label: "WhatsApp" },
        { icon: "location", color: "#DC2626", fn: handleLocation, label: "Location" },
      ].map(({ icon, color, fn, label }) => (
        <View key={icon} style={styles.actionItem}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: color, width: responsive.actionBtnSize, height: responsive.actionBtnSize, borderRadius: responsive.actionBtnSize / 2 },
            ]}
            onPress={fn}
            activeOpacity={0.85}
          >
            <Ionicons name={icon} size={isTablet ? 26 : 22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.actionLabel}>{label}</Text>
        </View>
      ))}
    </View>
  );

  const renderVideo = () => {
    if (!videoId) {
      return (
        <View style={styles.videoSection}>
          <View style={styles.noVideoContainer}>
            <Ionicons name="videocam-off" size={isTablet ? 70 : 46} color="#CBD5E1" />
            <Text style={styles.noVideoText}>No video available</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.videoSection}>
        {!showVideo ? (
          <TouchableOpacity onPress={toggleVideo} activeOpacity={0.9} style={styles.videoTouchable}>
            <ImageBackground
              source={{ uri: `https://i.ytimg.com/vi/${videoId}/hq720.jpg` }}
              style={[styles.videoThumbnail, { height: responsive.videoHeight }]}
            >
              <View style={styles.videoOverlay}>
                <View style={styles.playIconContainer}>
                  <Ionicons name="play-circle" size={isTablet ? 76 : 56} color="#FF0000" />
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
              initialPlayerParams={{ controls: true, modestbranding: true, rel: 0, fs: 1 }}
              onChangeState={(s) => {
                if (s === "ended") { setPlaying(false); setShowVideo(false); }
                if (s === "playing") { setIsVideoReady(true); setIsLoading(false); }
                if (s === "loading") setIsLoading(true);
                if (s === "ready") { setIsVideoReady(false); setIsLoading(false); }
              }}
              onReady={() => { setIsLoading(false); setIsVideoReady(true); }}
              onError={() => { Alert.alert("Error", "Failed to load video"); setIsLoading(false); setShowVideo(false); }}
              webViewProps={{ allowsInlineMediaPlayback: true, mediaPlaybackRequiresUserAction: false }}
            />
            <TouchableOpacity style={styles.closeVideoBtn} onPress={() => { setShowVideo(false); setPlaying(false); }}>
              <Ionicons name="close-circle" size={isTablet ? 38 : 30} color="#fff" />
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={C.primaryDark} barStyle="light-content" />
      
      {/* Fixed Header - positioned with proper padding */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.roundBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={responsive.iconSize} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>Product Details</Text>

        <View style={styles.headerRight}>
          <HeaderCartOrders navigation={navigation} iconSize={responsive.iconSize} />
          <TouchableOpacity style={[styles.roundBtn, { marginLeft: 8 }]} onPress={onShare}>
            <Ionicons name="share-social" size={responsive.iconSize} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[C.primary]} tintColor={C.primary} />}
      >
        <Image
          source={{ uri: productData.bannerImage || productData.image || "https://via.placeholder.com/400" }}
          style={[styles.mainImage, { height: responsive.imageHeight }]}
          resizeMode="cover"
        />

        <View style={[styles.content, { paddingHorizontal: responsive.contentPadding }]}>
          <View style={styles.headerSection}>
            <Text style={[styles.productName, { fontSize: responsive.nameSize }]}>
              {productData.productName || "Product"}
            </Text>
            <View style={styles.priceRow}>
              <Text style={[styles.productPrice, { fontSize: responsive.priceSize }]}>
                ₹{productData.price || "0.00"}
              </Text>
              {loading && <ActivityIndicator size="small" color={C.primary} style={{ marginLeft: 10 }} />}
            </View>
          </View>

          {renderContactButtons()}

          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { fontSize: responsive.sectionTitleSize }]}>Specifications</Text>
            <Text style={[styles.specText, { fontSize: responsive.specificationSize }]}>
              {productData.productSpecification || "No specifications available"}
            </Text>
          </View>
        </View>

        {/* Gallery - Full Width without Container */}
        {productData.galleryImages?.length > 0 && (
          <View style={styles.gallerySection}>
            <Text style={[styles.galleryTitle, { fontSize: responsive.sectionTitleSize, paddingHorizontal: responsive.contentPadding }]}>
              Gallery
            </Text>
            <FlatList
              horizontal
              data={productData.galleryImages}
              renderItem={renderGalleryItem}
              keyExtractor={(_, i) => `g-${i}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryList}
            />
          </View>
        )}

        {/* Video - Full Width without Container */}
        <View style={styles.videoSectionWrapper}>
          <Text style={[styles.videoTitle, { fontSize: responsive.sectionTitleSize, paddingHorizontal: responsive.contentPadding }]}>
            Product Video
          </Text>
          {renderVideo()}
        </View>

        {/* Extra bottom padding for scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.cartBtn, addedToCart && styles.cartBtnAdded]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <Ionicons name={addedToCart ? "checkmark-circle" : "cart-outline"} size={isTablet ? 22 : 19} color={addedToCart ? "#fff" : C.primary} />
            <Text style={[styles.cartBtnText, addedToCart && styles.cartBtnTextAdded]}>
              {addedToCart ? "Added!" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow} activeOpacity={0.85}>
          <Ionicons name="flash" size={isTablet ? 22 : 19} color="#fff" />
          <Text style={styles.buyBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },

  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  headerContainer: {
    backgroundColor: C.primary,
       paddingTop: Platform.OS === "ios" ? (isTablet ? 60 : 58) : (isTablet ? 50 : 46),
       paddingBottom: isTablet ? 22 : 21,
       paddingHorizontal: isTablet ? 24 : 20,
       flexDirection: "row",
       alignItems: "center",
       justifyContent: "space-between",
       borderBottomLeftRadius: isTablet ? 30 : 25,
       borderBottomRightRadius: isTablet ? 30 : 25,
       elevation: 4,
       shadowColor: "#9D1B00",
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.2,
       shadowRadius: 4,
   
  },

  roundBtn: {
    width: isTablet ? 46 : 38,
    height: isTablet ? 46 : 38,
    borderRadius: isTablet ? 23 : 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: isTablet ? 22 : 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: isTablet ? 12 : 8,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  mainImage: {
    width: width,
    backgroundColor: "#E2E8F0",
  },

  content: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 10,
  },

  headerSection: {
    marginBottom: 14,
  },

  productName: {
    fontWeight: "bold",
    color: C.textDark,
    marginBottom: 6,
    lineHeight: isTablet ? 36 : 30,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  productPrice: {
    fontWeight: "bold",
    color: C.primary,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingHorizontal: isTablet ? 40 : 12,
  },

  actionItem: {
    alignItems: "center",
    gap: 6,
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

  actionLabel: {
    fontSize: isTablet ? 12 : 11,
    color: C.textMid,
    fontWeight: "600",
  },

  card: {
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: isTablet ? 20 : 16,
    marginHorizontal: responsive.contentPadding,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  sectionTitle: {
    fontWeight: "700",
    color: C.textDark,
    marginBottom: 10,
  },

  specText: {
    lineHeight: 22,
    color: C.textMid,
    textAlign: "justify",
  },

  // Gallery Section - Full Width
  gallerySection: {
    marginTop: 10,
    marginBottom: 14,
  },

  galleryTitle: {
    fontWeight: "700",
    color: C.textDark,
    marginBottom: 12,
  },

  galleryList: {
    paddingHorizontal: responsive.contentPadding,
    paddingVertical: 5,
  },

  galleryImage: {
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: C.border,
  },

  // Video Section - Full Width
  videoSectionWrapper: {
    marginTop: 10,
    marginBottom: 14,
  },

  videoTitle: {
    fontWeight: "700",
    color: C.textDark,
    marginBottom: 12,
  },

  videoSection: {
    width: width,
  },

  videoTouchable: {
    width: width,
    borderRadius: 0,
    overflow: "hidden",
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
    fontSize: isTablet ? 17 : 15,
    fontWeight: "600",
    marginTop: 12,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  videoWrapper: {
    backgroundColor: "#000",
    position: "relative",
    width: width,
    overflow: "hidden",
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
    backgroundColor: "#FAF6F3",
    padding: isTablet ? 50 : 32,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
  },

  noVideoText: {
    color: C.textLight,
    fontSize: isTablet ? 16 : 14,
    textAlign: "center",
    marginTop: 10,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
    paddingBottom: Platform.OS === "ios" ? (isTablet ? 34 : 26) : (isTablet ? 16 : 12),
    borderTopWidth: 1,
    borderTopColor: C.border,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    gap: 12,
    backgroundColor: "#fff",
    zIndex: 10,
  },

  cartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    borderWidth: 2,
    borderColor: C.primary,
    borderRadius: isTablet ? 16 : 14,
    paddingVertical: isTablet ? 15 : 13,
    gap: 8,
  },

  cartBtnAdded: {
    backgroundColor: "#25A244",
    borderColor: "#25A244",
  },

  cartBtnText: {
    color: C.primary,
    fontSize: isTablet ? 16 : 14,
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
    backgroundColor: C.primary,
    borderRadius: isTablet ? 16 : 14,
    paddingVertical: isTablet ? 15 : 13,
    gap: 8,
    elevation: 4,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },

  buyBtnText: {
    color: "#fff",
    fontSize: isTablet ? 16 : 14,
    fontWeight: "700",
  },

  bottomPadding: {
    height: isTablet ? 40 : 30,
  },
});