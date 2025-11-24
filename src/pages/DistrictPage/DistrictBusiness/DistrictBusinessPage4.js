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
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");

export default function DistrictBusinessPage4({ route, navigation }) {
  const item = route.params?.item || {};

  const [isExpanded, setIsExpanded] = useState(false);

  // Safe data
  const imageUrl = item.imageUrl || "";
  const bannerUrl = item.bannerUrl || "";
  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  const phone = item.phoneNo || "";
  const whatsapp = item.whatsappNo || "";
  const mapUrl = item.mapUrl || "";
  const description = item.description || "";
  const price = item.price || "";
  const type = item.type || "";
  const youtubeLink = item.videoUrl || ""; // YouTube URL

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

  return (
    <View style={styles.screen}>
      {/* Top AppBar */}
      <View style={styles.appBarWrapper}>
        <View style={styles.appBarGradient}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.appBarTitle}>Product Details</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          {bannerUrl ? (
            <Image source={{ uri: bannerUrl }} style={styles.bannerImage} />
          ) : (
            <View
              style={[styles.bannerImage, { backgroundColor: "#f1f1f1" }]}
            />
          )}

          {/* Round product image */}
          <View style={styles.circleWrapper}>
            <View style={styles.circleBorder}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.circleImage} />
              ) : (
                <View style={[styles.circleImage, styles.emptyImage]}>
                  <Ionicons name="image" size={48} color="#ccc" />
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={{ height: 70 }} />

        {/* Product Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.productName}>
              {item.name || "Product Name"}
            </Text>

            <Text style={styles.priceText}>₹{price || "0"}</Text>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              {/* Call */}
              <TouchableOpacity
                onPress={() => openDialer(phone)}
                style={styles.actionBtn}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: "#BEE3FF" }]}
                >
                  <FontAwesome name="phone" size={18} color="#0077CC" />
                </View>
                <Text style={styles.actionLabel}>Call</Text>
              </TouchableOpacity>

              {/* WhatsApp */}
              <TouchableOpacity
                onPress={() => openWhatsApp(whatsapp || phone)}
                style={styles.actionBtn}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: "#E6F7EE" }]}
                >
                  <FontAwesome name="whatsapp" size={18} color="#25D366" />
                </View>
                <Text style={styles.actionLabel}>WhatsApp</Text>
              </TouchableOpacity>

              {/* Map */}
              <TouchableOpacity
                onPress={() => openMap(mapUrl)}
                style={styles.actionBtn}
              >
                <View
                  style={[styles.actionIcon, { backgroundColor: "#FFF1E6" }]}
                >
                  <FontAwesome name="map-marker" size={18} color="#FF5722" />
                </View>
                <Text style={styles.actionLabel}>Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <Text
            numberOfLines={isExpanded ? undefined : 3}
            style={styles.sectionText}
          >
            {description || "No description available."}
          </Text>

          {(description || "").length > 120 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={styles.readMoreText}>
                {isExpanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Type & Price */}
        <View style={[styles.section, styles.typeRow]}>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>Type: {type || "-"}</Text>
          </View>

          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>Price: ₹{price || "-"}</Text>
          </View>
        </View>

        {/* Inline YouTube Player */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video</Text>

          {youtubeLink ? (
            <View style={styles.videoWrapper}>
              <WebView
                source={{ uri: getEmbedUrl(youtubeLink) }}
                style={styles.video}
                javaScriptEnabled
                domStorageEnabled
                allowsFullscreenVideo
              />
            </View>
          ) : (
            <Text style={{ color: "#777", marginTop: 10 }}>
              Video is not available.
            </Text>
          )}
        </View>

        {/* Gallery */}
        {gallery.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 12 }}
            >
              {gallery.map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: img }}
                  style={styles.galleryImage}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={{ color: "#666" }}>© Your App Name</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  appBarWrapper: { height: 90 },
  appBarGradient: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#93210A",
  },
  appBarTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  backBtn: {
    width: 40,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  bannerContainer: { height: 200, position: "relative" },
  bannerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  circleWrapper: { position: "absolute", left: width / 2 - 60, bottom: -60 },
  circleBorder: {
    width: 120,
    height: 120,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 6,
  },
  circleImage: { width: "100%", height: "100%" },
  emptyImage: { justifyContent: "center", alignItems: "center" },

  cardContainer: { paddingHorizontal: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    paddingTop: 28,
    elevation: 4,
  },
  productName: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  priceText: {
    color: "green",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 6,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionBtn: { alignItems: "center", flex: 1, marginHorizontal: 6 },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { marginTop: 8, fontSize: 12, fontWeight: "600" },

  section: { paddingHorizontal: 20, marginTop: 18 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  sectionText: { fontSize: 15, lineHeight: 20, color: "#444" },
  readMoreText: { color: "#E53935", marginTop: 8, fontWeight: "700" },

  typeRow: { flexDirection: "row", justifyContent: "space-between" },
  infoPill: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  infoPillText: { fontWeight: "700" },

  videoWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: { width: "100%", height: "100%" },

  galleryImage: {
    width: 140,
    height: 140,
    marginRight: 12,
    borderRadius: 12,
  },

  footer: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
});
