import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 600;

export default function DistrictBusinessPage4({ route, navigation }) {
  const item = route.params?.item || {};

  const [isExpanded, setIsExpanded] = useState(false);

  // Safe data extraction
  const imageUrl = item.imageUrl || "";
  const bannerUrl = item.bannerUrl || "";
  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  const phone = item.phoneNo || "";
  const whatsapp = item.whatsappNo || "";
  const mapUrl = item.mapUrl || "";
  const description = item.description || "";
  const price = item.price || "";
  const type = item.type || "";
  const youtubeLink = item.videoUrl || "";

  // Actions
  const openDialer = (num) => {
    if (!num) return;
    Linking.openURL(`tel:${num}`);
  };

  const openWhatsApp = (num) => {
    if (!num) return;
    Linking.openURL(`https://wa.me/${num}`);
  };

  const openMap = (url) => {
    if (!url) return;
    Linking.openURL(url);
  };

  // YouTube URL to embed URL converter
  const getEmbedUrl = (url) => {
    if (!url) return "";
    
    let videoId = "";
    
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    }
    else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* Top AppBar */}
      <View style={[styles.appBarWrapper, isTablet && styles.appBarWrapperTablet]}>
        <View style={[styles.appBarGradient, isTablet && styles.appBarGradientTablet]}>
          <TouchableOpacity
            style={[styles.backBtn, isTablet && styles.backBtnTablet]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={isTablet ? 26 : 22} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.appBarTitle, isTablet && styles.appBarTitleTablet]}>
            Product Details
          </Text>
          <View style={{ width: isTablet ? 50 : 40 }} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Section */}
        <View style={[styles.bannerContainer, isTablet && styles.bannerContainerTablet]}>
          {bannerUrl ? (
            <Image source={{ uri: bannerUrl }} style={styles.bannerImage} />
          ) : (
            <View style={[styles.bannerImage, styles.emptyBanner]} />
          )}

          {/* Product Image Overlay */}
          <View style={[
            styles.circleWrapper, 
            isTablet && styles.circleWrapperTablet
          ]}>
            <View style={[
              styles.circleBorder, 
              isTablet && styles.circleBorderTablet
            ]}>
              {imageUrl ? (
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.circleImage} 
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.circleImage, styles.emptyImage]}>
                  <Ionicons 
                    name="image" 
                    size={isTablet ? 52 : 44} 
                    color="#ccc" 
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={{ height: isTablet ? 80 : 70 }} />

        {/* Product Card */}
        <View style={[styles.cardContainer, isTablet && styles.cardContainerTablet]}>
          <View style={[styles.card, isTablet && styles.cardTablet]}>
            <Text style={[styles.productName, isTablet && styles.productNameTablet]}>
              {item.name || "Product Name"} 

            </Text>
            <View>
              {/* <Text>{item.isProductItems?.toString()}</Text> */}

              {item.isProductItems === true && (
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => navigation.navigate("DistrictBusinessItems", {
                    businessId: item.id,
                    phoneNumber :phone,
                    location: mapUrl
                  })}
                >
                  <Text style={styles.viewText}>Our Products</Text>
                </TouchableOpacity>
              )}
            </View>


            {/* <Text style={[styles.priceText, isTablet && styles.priceTextTablet]}>
              ₹{price || "0"} 
            </Text> */}

            {/* Action Buttons Row */}
            <View style={[styles.actionRow, isTablet && styles.actionRowTablet]}>
              {/* Call Button */}
              <TouchableOpacity
                onPress={() => openDialer(phone)}
                style={[styles.actionBtn, isTablet && styles.actionBtnTablet]}
              >
                <View
                  style={[
                    styles.actionIcon, 
                    isTablet && styles.actionIconTablet,
                    { backgroundColor: "#BEE3FF" }
                  ]}
                >
                  <FontAwesome 
                    name="phone" 
                    size={isTablet ? 22 : 18} 
                    color="#0077CC" 
                  />
                </View>
                <Text style={[styles.actionLabel, isTablet && styles.actionLabelTablet]}>
                  Call
                </Text>
              </TouchableOpacity>

              {/* WhatsApp Button */}
              <TouchableOpacity
                onPress={() => openWhatsApp(whatsapp || phone)}
                style={[styles.actionBtn, isTablet && styles.actionBtnTablet]}
              >
                <View
                  style={[
                    styles.actionIcon, 
                    isTablet && styles.actionIconTablet,
                    { backgroundColor: "#E6F7EE" }
                  ]}
                >
                  <FontAwesome 
                    name="whatsapp" 
                    size={isTablet ? 22 : 18} 
                    color="#25D366" 
                  />
                </View>
                <Text style={[styles.actionLabel, isTablet && styles.actionLabelTablet]}>
                  WhatsApp
                </Text>
              </TouchableOpacity>

              {/* Map Button */}
              <TouchableOpacity
                onPress={() => openMap(mapUrl)}
                style={[styles.actionBtn, isTablet && styles.actionBtnTablet]}
              >
                <View
                  style={[
                    styles.actionIcon, 
                    isTablet && styles.actionIconTablet,
                    { backgroundColor: "#FFF1E6" }
                  ]}
                >
                  <FontAwesome 
                    name="map-marker" 
                    size={isTablet ? 22 : 18} 
                    color="#FF5722" 
                  />
                </View>
                <Text style={[styles.actionLabel, isTablet && styles.actionLabelTablet]}>
                  Map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            About
          </Text>

          <Text
            numberOfLines={isExpanded ? undefined : 3}
            style={[styles.sectionText, isTablet && styles.sectionTextTablet]}
          >
            {description || "No description available."}
          </Text>

          {(description || "").length > 120 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={[styles.readMoreText, isTablet && styles.readMoreTextTablet]}>
                {isExpanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Type & Price Info Cards */}
        {/* <View style={[styles.section, styles.typeRow, isTablet && styles.typeRowTablet]}>
          <View style={[styles.infoPill, isTablet && styles.infoPillTablet]}>
            <Text style={[styles.infoPillText, isTablet && styles.infoPillTextTablet]}>
              Type: {type || "-"}
            </Text>
          </View>

          <View style={[styles.infoPill, isTablet && styles.infoPillTablet]}>
            <Text style={[styles.infoPillText, isTablet && styles.infoPillTextTablet]}>
              Price: ₹{price || "-"}
            </Text>
          </View>
        </View> */}

        {/* Video Section */}
        <View style={[styles.section, isTablet && styles.sectionTablet]}>
          <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
            Video
          </Text>

          {youtubeLink ? (
            <View style={[styles.videoWrapper, isTablet && styles.videoWrapperTablet]}>
              <WebView
                source={{ uri: getEmbedUrl(youtubeLink) }}
                style={styles.video}
                javaScriptEnabled
                domStorageEnabled
                allowsFullscreenVideo
              />
            </View>
          ) : (
            <Text style={[styles.noVideoText, isTablet && styles.noVideoTextTablet]}>
              Video is not available.
            </Text>
          )}
        </View>

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <View style={[styles.section, isTablet && styles.sectionTablet]}>
            <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
              Gallery
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.galleryScroll, isTablet && styles.galleryScrollTablet]}
            >
              {gallery.map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: img }}
                  style={[styles.galleryImage, isTablet && styles.galleryImageTablet]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ============ MOBILE STYLES ============
  screen: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },

  // AppBar - Mobile
  appBarWrapper: { 
    height: 90 
  },
  appBarGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#93210A",
  },
  appBarTitle: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700" 
  },
  backBtn: {
    width: 40,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

   viewBtn: {
    margin:'auto',
    marginTop:10,
    backgroundColor: "#0d6efd",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    // margin:auto,
  },
  viewText: {
    color: "#fff",
    fontWeight: "600",
    paddingHorizontal: 12, 
    paddingVertical: 4,
  },
  // Banner - Mobile
  bannerContainer: { 
    height: 200,     position: "relative" 
  },
  bannerImage: { 
    width: "100%", 
    height: "100%", 
    resizeMode: "cover" 
  },
  emptyBanner: { 
    backgroundColor: "#f1f1f1" 
  },
  circleWrapper: { 
    position: "absolute", 
    left: screenWidth / 2 - 60, 
    bottom: -60 
  },
  circleBorder: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  circleImage: { 
    width: "100%", 
    height: "100%" 
  },
  emptyImage: { 
    justifyContent: "center", 
    alignItems: "center" 
  },

  // Card - Mobile
  cardContainer: { 
    paddingHorizontal: 20 
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    paddingTop: 28,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productName: { 
    fontSize: 22, 
    fontWeight: "700", 
    textAlign: "center" 
  },
  priceText: {
    color: "green",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 6,
  },

  // Action Buttons - Mobile
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionBtn: { 
    alignItems: "center", 
    flex: 1, 
    marginHorizontal: 6 
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { 
    marginTop: 8, 
    fontSize: 12, 
    fontWeight: "600" 
  },

  // Section - Mobile
  section: { 
    paddingHorizontal: 20, 
    marginTop: 18 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 8 
  },
  sectionText: { 
    fontSize: 15, 
    lineHeight: 20, 
    color: "#444" 
  },
  readMoreText: { 
    color: "#E53935", 
    marginTop: 8, 
    fontWeight: "700" 
  },

  // Type Row - Mobile
  typeRow: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  infoPill: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  infoPillText: { 
    fontWeight: "700" 
  },

  // Video - Mobile
  videoWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
    marginTop: 8,
  },
  video: { 
    width: "100%", 
    height: "100%" 
  },
  noVideoText: {
    color: "#777", 
    marginTop: 10 
  },

  // Gallery - Mobile
  galleryScroll: { 
    marginTop: 12 
  },
  galleryImage: {
    width: 140,
    height: 140,
    marginRight: 12,
    borderRadius: 12,
  },

  // Scroll Content - Mobile
  scrollContent: {
    paddingBottom: 40,
  },

  // ============ TABLET STYLES ============
  
  // AppBar - Tablet
  appBarWrapperTablet: { 
    height: 100 
  },
  appBarGradientTablet: {
    paddingTop: Platform.OS === 'ios' ? 45 : 35,
    paddingHorizontal: 24,
  },
  appBarTitleTablet: { 
    fontSize: 22 
  },
  backBtnTablet: {
    width: 48,
    height: 42,
  },

  // Banner - Tablet
  bannerContainerTablet: { 
    height: 240 
  },
  circleWrapperTablet: { 
    left: screenWidth / 2 - 70, 
    bottom: -70 
  },
  circleBorderTablet: {
    width: 140,
    height: 140,
    borderRadius: 20,
    borderWidth: 5,
    elevation: 8,
  },

  // Card - Tablet
  cardContainerTablet: { 
    paddingHorizontal: 40 
  },
  cardTablet: {
    borderRadius: 20,
    padding: 24,
    paddingTop: 32,
    elevation: 6,
    shadowRadius: 8,
  },
  productNameTablet: { 
    fontSize: 26 
  },
  priceTextTablet: {
    fontSize: 24,
    marginTop: 8,
  },

  // Action Buttons - Tablet
  actionRowTablet: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  actionBtnTablet: {
    marginHorizontal: 8,
  },
  actionIconTablet: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  actionLabelTablet: { 
    marginTop: 10, 
    fontSize: 14 
  },

  // Section - Tablet
  sectionTablet: { 
    paddingHorizontal: 40, 
    marginTop: 24 
  },
  sectionTitleTablet: { 
    fontSize: 22, 
    marginBottom: 12 
  },
  sectionTextTablet: { 
    fontSize: 17, 
    lineHeight: 24 
  },
  readMoreTextTablet: { 
    fontSize: 16, 
    marginTop: 10 
  },

  // Type Row - Tablet
  typeRowTablet: {
    justifyContent: "space-around",
    paddingHorizontal: 60,
  },
  infoPillTablet: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  infoPillTextTablet: { 
    fontSize: 16 
  },

  // Video - Tablet
  videoWrapperTablet: {
    height: 300,
    borderRadius: 16,
   
  },
  noVideoTextTablet: {
    fontSize: 16,
    marginTop: 12,
  },

  // Gallery - Tablet
  galleryScrollTablet: { 
    marginTop: 16 
  },
  galleryImageTablet: {
    width: 180,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
  },

  // Scroll Content - Tablet
  scrollContentTablet: {
    paddingBottom: 50,
  },
});