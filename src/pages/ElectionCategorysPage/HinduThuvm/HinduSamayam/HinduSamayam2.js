import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  ScrollView,
  Linking,
  Alert,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import Loader from "../../../../components/Alert/Loader";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinearGradient } from "expo-linear-gradient";

/* ✅ Extract YouTube ID */
const getYouTubeId = (url) => {
  if (!url || typeof url !== "string") return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
  );
  return match?.[1] || "";
};

/* ✅ Handle phone call */
const handlePhonePress = (phoneNumber) => {
  if (!phoneNumber) return;
  const phoneUrl = `tel:${phoneNumber}`;
  Linking.canOpenURL(phoneUrl)
    .then((supported) => {
      if (supported) Linking.openURL(phoneUrl);
      else Alert.alert("Error", "Phone calls are not supported on this device");
    })
    .catch((err) => console.log("Phone call error:", err));
};

/* ✅ Handle WhatsApp */
const handleWhatsAppPress = (whatsappNumber) => {
  if (!whatsappNumber) return;
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanNumber}`;
  Linking.canOpenURL(whatsappUrl)
    .then((supported) => {
      if (supported) Linking.openURL(whatsappUrl);
      else Alert.alert("Error", "WhatsApp is not installed on this device");
    })
    .catch((err) => console.log("WhatsApp error:", err));
};

/* ✅ Handle location open */
const handleLocationPress = (locationUrl) => {
  if (!locationUrl) return;
  Linking.canOpenURL(locationUrl)
    .then((supported) => {
      if (supported) Linking.openURL(locationUrl);
      else Alert.alert("Error", "Cannot open this location");
    })
    .catch((err) => console.log("Location error:", err));
};

const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;

  return {
    width,
    height,
    isTablet,
    isLargeTablet,
    paddingHorizontal: isTablet ? 24 : 16,
    sizes: {
      avatar: isTablet ? (isLargeTablet ? 140 : 120) : 115,
      nameFont: isTablet ? (isLargeTablet ? 28 : 24) : 20,
      titleFont: isTablet ? (isLargeTablet ? 24 : 20) : 18,
      textFont: isTablet ? (isLargeTablet ? 18 : 16) : 14,
      iconSize: isTablet ? (isLargeTablet ? 36 : 32) : 28,
      bannerHeight: isTablet ? (isLargeTablet ? 350 : 300) : 250,
    },
  };
};

export default function HinduSamayam2({ route, navigation }) {
  const { categoryId, categoryName } = route.params;
  const responsive = useResponsive();

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ReadMore, setReadmore] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [playingStates, setPlayingStates] = useState({});

  useEffect(() => {
    fetchDetails();
  }, [categoryId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const url = `https://hdrss-backend.onrender.com/api/hindu-samayam/category/${categoryId}`;
      const res = await axios.get(url);
      const list = res.data?.HindusamayamDetails ?? [];
      setDetails(list);
    } catch (e) {
      setError("Details load ஆகவில்லை. API / network check பண்ணுங்க.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (itemId, section) => {
    setExpandedItems((prev) => ({
      ...prev,
      [`${itemId}_${section}`]: !prev[`${itemId}_${section}`],
    }));
  };

  const toggleReadMore = (itemId) => {
    setReadmore((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const onStateChange = (itemId) => (state) => {
    if (state === "ended") {
      setPlayingStates((prev) => ({
        ...prev,
        [itemId]: false,
      }));
    }
  };

  const renderContactIcons = (item) => (
    <View style={styles.contactRow}>
      {item?.phoneNumber && (
        <TouchableOpacity style={styles.iconButton} onPress={() => handlePhonePress(item.phoneNumber)}>
          <View style={[styles.iconCircle, styles.phoneBg]}>
            <Ionicons name="call" size={responsive.sizes.iconSize} color="#fff" />
          </View>
        </TouchableOpacity>
      )}

      {item?.whatshapp && (
        <TouchableOpacity style={styles.iconButton} onPress={() => handleWhatsAppPress(item.whatshapp)}>
          <View style={[styles.iconCircle, styles.whatsappBg]}>
            <Ionicons name="logo-whatsapp" size={responsive.sizes.iconSize} color="#fff" />
          </View>
        </TouchableOpacity>
      )}

      {item?.location && (
        <TouchableOpacity style={styles.iconButton} onPress={() => handleLocationPress(item.location)}>
          <View style={[styles.iconCircle, styles.locationBg]}>
            <Ionicons name="location" size={responsive.sizes.iconSize} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSection = (title, content, iconName, iconType, itemId, sectionKey) => {
    if (!content) return null;

    const isExpanded = expandedItems[`${itemId}_${sectionKey}`];
    const isLong = content.length > 200;
    const IconComponent = iconType === "MaterialIcons" ? MaterialIcons : Ionicons;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <IconComponent name={iconName} size={22} color="#93210A" />
          <Text style={[styles.sectionTitle, { fontSize: responsive.sizes.titleFont }]}>
            {title}
          </Text>
        </View>

        <Text 
          style={[styles.sectionContent, { fontSize: responsive.sizes.textFont }]} 
          numberOfLines={isExpanded ? undefined : 4}
        >
          {content}
        </Text>

        {isLong && (
          <TouchableOpacity onPress={() => toggleExpand(itemId, sectionKey)} style={styles.readMoreBtn}>
            <Text style={styles.readMoreText}>
              {isExpanded ? "Show Less" : "Read More"}
            </Text>
            <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color="#93210A" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const bannerUri = item?.bannerImage || item?.image;
    const gallery = Array.isArray(item?.gallery) ? item.gallery : [];
    const youtubeId = getYouTubeId(item?.video);
    const isItemReadMore = ReadMore[item.id];

    return (
      <View style={styles.itemContainer}>
        {/* Full Width Banner */}
        <View style={[styles.bannerContainer, { 
          height: responsive.sizes.bannerHeight,
        }]}>
          <Image 
            source={{ uri: bannerUri }} 
            style={styles.bannerImage} 
            resizeMode="cover"
          />
          <LinearGradient 
            colors={["transparent", "rgba(0,0,0,0.6)"]} 
            style={styles.bannerGradient} 
          />
        </View>

        {/* Profile Section - Centered */}
        <View style={styles.profileSection}>
          {/* Profile Avatar - Centered */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: item?.image }}
              style={[styles.avatar, { width: responsive.sizes.avatar, height: responsive.sizes.avatar }]}
              resizeMode="cover"
            />
          </View>

          {/* Name - Centered */}
          <Text style={[styles.name, { fontSize: responsive.sizes.nameFont }]}>
            {item?.name || "Name"}
          </Text>

          {/* Day Badge - Centered */}
          {item?.day && (
            <View style={styles.dayBadge}>
              <MaterialIcons name="calendar-today" size={16} color="#93210A" />
              <Text style={styles.dayText}>{item.day}</Text>
            </View>
          )}

          {/* Contact Icons - Centered */}
          {renderContactIcons(item)}
        </View>

        {/* Content Section */}
        <View style={[styles.contentWrapper, { paddingHorizontal: responsive.paddingHorizontal }]}>
          {/* Description */}
          {item?.importantIntention && (
            <View style={styles.featuredSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text-outline" size={22} color="#93210A" />
                <Text style={[styles.sectionTitle, { fontSize: responsive.sizes.titleFont }]}>
                  Description
                </Text>
              </View>

              <Text
                style={[styles.featuredText, { fontSize: responsive.sizes.textFont }]}
                numberOfLines={isItemReadMore ? undefined : 5}
              >
                {item.importantIntention}
              </Text>

              {item.importantIntention.length > 300 && (
                <TouchableOpacity onPress={() => toggleReadMore(item.id)} style={styles.readMoreBtn}>
                  <Text style={styles.readMoreText}>
                    {isItemReadMore ? "Show Less" : "Read More"}
                  </Text>
                  <Ionicons name={isItemReadMore ? "chevron-up" : "chevron-down"} size={16} color="#93210A" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {item?.bio && renderSection("Biography", item.bio, "person-outline", "Ionicons", item.id, "bio")}
          {item?.work && renderSection("Work", item.work, "briefcase-outline", "Ionicons", item.id, "work")}
          {item?.achievement && renderSection("Achievements", item.achievement, "trophy-outline", "Ionicons", item.id, "achievement")}

          {/* Gallery */}
          {gallery.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="images-outline" size={22} color="#93210A" />
                <Text style={[styles.sectionTitle, { fontSize: responsive.sizes.titleFont }]}>
                  Gallery ({gallery.length})
                </Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
                {gallery.map((imgUrl, idx) => (
                  <TouchableOpacity key={idx} activeOpacity={0.8}>
                    <Image
                      source={{ uri: imgUrl }}
                      style={[
                        styles.galleryImage,
                        idx === gallery.length - 1 && { marginRight: 0 },
                      ]}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Video */}
          {youtubeId && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="logo-youtube" size={22} color="#FF0000" />
                <Text style={[styles.sectionTitle, { fontSize: responsive.sizes.titleFont }]}>
                  Video
                </Text>
              </View>

              <View style={styles.videoContainer}>
                <YoutubePlayer
                  height={200}
                  width={responsive.width - responsive.paddingHorizontal * 2}
                  play={playingStates[item.id] || false}
                  videoId={youtubeId}
                  onChangeState={onStateChange(item.id)}
                />
              </View>
            </View>
          )}

          <View style={styles.divider} />
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <LinearGradient colors={["#93210A", "#7a1a08"]} style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {categoryName || "விவரங்கள்"}
        </Text>
      </View>

      <View style={styles.headerRight} />
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      {renderHeader()}

      {loading ? (
        <Loader />
      ) : error ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={60} color="#93210A" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDetails}>
            <Text style={styles.retryText}>மீண்டும் முயற்சி</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={details}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>விவரங்கள் எதுவும் இல்லை</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#f5f0eb" 
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 80,
  },
  
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
    textAlign: "center",
    lineHeight: 28,
  },
  
  headerRight: { 
    width: 44,
    flexShrink: 0,
  },

  listContent: { 
    paddingBottom: 30 
  },

  itemContainer: {
    backgroundColor: "#fff",
    marginBottom: 20,
    overflow: "hidden",
  },

  bannerContainer: {
    width: "100%",
    position: "relative",
    backgroundColor: "#e8e0d8",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },

  profileSection: {
    alignItems: "center",
    marginTop: -60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  avatarWrapper: {
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  avatar: {
    borderRadius: 16,
  },

  contentWrapper: {
    paddingBottom: 20,
  },

  name: {
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 6,
  },

  dayBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(147,33,10,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 12,
  },

  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#93210A",
    marginLeft: 6,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 4,
    marginBottom: 8,
  },

  iconButton: { 
    alignItems: "center" 
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  phoneBg: { backgroundColor: "#93210A" },
  whatsappBg: { backgroundColor: "#25D366" },
  locationBg: { backgroundColor: "#2196F3" },

  featuredSection: {
    marginBottom: 24,
  },

  featuredText: {
    color: "#444",
    lineHeight: 24,
    textAlign: "justify",
    paddingHorizontal: 4,
  },

  sectionContainer: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(147,33,10,0.15)",
    paddingBottom: 8,
  },

  sectionTitle: {
    marginLeft: 10,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },

  sectionContent: {
    color: "#555",
    lineHeight: 22,
    textAlign: "justify",
    paddingHorizontal: 4,
  },

  readMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
    paddingRight: 4,
  },

  readMoreText: {
    color: "#93210A",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },

  galleryScroll: {
    marginTop: 10,
  },

  galleryImage: {
    width: 140,
    height: 110,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#f0ece8",
  },

  videoContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(147,33,10,0.1)",
    marginTop: 20,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    minHeight: 400,
  },

  errorText: {
    color: "#93210A",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: "#93210A",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },

  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  emptyText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "600",
  },
});