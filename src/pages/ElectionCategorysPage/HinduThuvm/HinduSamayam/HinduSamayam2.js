import React, { useEffect, useMemo, useState } from "react";
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

// ✅ Enhanced responsive sizing utility
const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;
  const isLandscape = width > height;

  // ✅ Improved grid system for tablets
  let numColumns = 1;
  let cardWidth = width - 32; // Default for mobile
  
  if (isTablet) {
    if (isLargeTablet) {
      // Large tablets like iPad Pro
      numColumns = isLandscape ? 2 : 1;
      cardWidth = isLandscape ? (width - 64) / 2 : width - 48;
    } else {
      // Small tablets like iPad Mini
      numColumns = isLandscape ? 2 : 1;
      cardWidth = isLandscape ? (width - 48) / 2 : width - 40;
    }
  }

  const padding = isTablet ? (isLargeTablet ? 24 : 20) : 16;
  const gap = isTablet ? (isLargeTablet ? 24 : 20) : 12;

  // ✅ Tablet-optimized sizes
  const sizes = {
    avatar: isTablet ? (isLargeTablet ? 180 : 160) : 100,
    nameFont: isTablet ? (isLargeTablet ? 36 : 32) : 24,
    titleFont: isTablet ? (isLargeTablet ? 28 : 24) : 18,
    textFont: isTablet ? (isLargeTablet ? 20 : 18) : 14,
    iconSize: isTablet ? (isLargeTablet ? 40 : 36) : 24,
    bannerHeight: isTablet ? (isLargeTablet ? 400 : 350) : 200,
  };

  return {
    width,
    height,
    isTablet,
    isLargeTablet,
    isLandscape,
    numColumns,
    cardWidth,
    spacing: { padding, gap },
    sizes,
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
    <View style={[
      styles.contactRow, 
      responsive.isTablet && styles.contactRowTablet,
      responsive.isLargeTablet && styles.contactRowLargeTablet
    ]}>
      {item?.phoneNumber && (
        <TouchableOpacity style={styles.iconButton} onPress={() => handlePhonePress(item.phoneNumber)}>
          <View style={[
            styles.iconCircle, 
            styles.phoneBg, 
            responsive.isTablet && styles.iconCircleTablet,
            responsive.isLargeTablet && styles.iconCircleLargeTablet
          ]}>
            <Ionicons name="call" size={responsive.sizes.iconSize} color="#fff" />
          </View>
          <Text style={[
            styles.iconLabel, 
            responsive.isTablet && styles.iconLabelTablet,
            responsive.isLargeTablet && styles.iconLabelLargeTablet
          ]}>Call</Text>
        </TouchableOpacity>
      )}

      {item?.whatshapp && (
        <TouchableOpacity style={styles.iconButton} onPress={() => handleWhatsAppPress(item.whatshapp)}>
          <View style={[
            styles.iconCircle, 
            styles.whatsappBg, 
            responsive.isTablet && styles.iconCircleTablet,
            responsive.isLargeTablet && styles.iconCircleLargeTablet
          ]}>
            <Ionicons name="logo-whatsapp" size={responsive.sizes.iconSize} color="#fff" />
          </View>
          <Text style={[
            styles.iconLabel, 
            responsive.isTablet && styles.iconLabelTablet,
            responsive.isLargeTablet && styles.iconLabelLargeTablet
          ]}>WhatsApp</Text>
        </TouchableOpacity>
      )}

      {item?.location && (
        <TouchableOpacity style={styles.iconButton} onPress={() => handleLocationPress(item.location)}>
          <View style={[
            styles.iconCircle, 
            styles.locationBg, 
            responsive.isTablet && styles.iconCircleTablet,
            responsive.isLargeTablet && styles.iconCircleLargeTablet
          ]}>
            <Ionicons name="location" size={responsive.sizes.iconSize} color="#fff" />
          </View>
          <Text style={[
            styles.iconLabel, 
            responsive.isTablet && styles.iconLabelTablet,
            responsive.isLargeTablet && styles.iconLabelLargeTablet
          ]}>Map</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSection = (title, content, iconName, iconType, itemId, sectionKey) => {
    if (!content) return null;

    const isExpanded = expandedItems[`${itemId}_${sectionKey}`];
    const isLong = content.length > (responsive.isTablet ? 300 : 200);
    const IconComponent = iconType === "MaterialIcons" ? MaterialIcons : Ionicons;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <IconComponent name={iconName} size={responsive.isTablet ? 28 : 22} color="#8B0000" />
          <Text style={[styles.sectionTitle, { fontSize: responsive.sizes.titleFont }]}>
            {title}
          </Text>
        </View>

        <Text 
          style={[
            styles.sectionContent, 
            { fontSize: responsive.sizes.textFont },
            responsive.isTablet && styles.sectionContentTablet
          ]} 
          numberOfLines={isExpanded ? undefined : (responsive.isTablet ? 6 : 4)}
        >
          {content}
        </Text>

        {isLong && (
          <TouchableOpacity onPress={() => toggleExpand(itemId, sectionKey)} style={styles.readMoreBtn}>
            <Text style={[styles.readMoreText, responsive.isTablet && styles.readMoreTextTablet]}>
              {isExpanded ? "Show Less" : "Read More"}
            </Text>
            <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={responsive.isTablet ? 20 : 16} color="#8B0000" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    const bannerUri = item?.bannerImage || item?.image;
    const gallery = Array.isArray(item?.gallery) ? item.gallery : [];
    const youtubeId = getYouTubeId(item?.video);
    const isItemReadMore = ReadMore[item.id];

    const overlap = Math.round(responsive.sizes.avatar * 0.45);

    return (
      <View
        style={[
          styles.itemContainer,
          responsive.isTablet && styles.itemContainerTablet,
          responsive.isLargeTablet && styles.itemContainerLargeTablet,
          { width: responsive.cardWidth },
        ]}
      >
        {/* Banner */}
        <View style={[styles.bannerContainer, { height: responsive.sizes.bannerHeight }]}>
          <Image source={{ uri: bannerUri }} style={styles.bannerImage} resizeMode="cover" />
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.bannerGradient} />
        </View>

        {/* Profile */}
        <View
          style={[
            styles.profileSection,
            responsive.isTablet && styles.profileSectionTablet,
            responsive.isLargeTablet && styles.profileSectionLargeTablet,
            { marginTop: -overlap },
          ]}
        >
          <View style={[
            styles.avatarWrapper, 
            responsive.isTablet && styles.avatarWrapperTablet,
            responsive.isLargeTablet && styles.avatarWrapperLargeTablet
          ]}>
            <Image
              source={{ uri: item?.image }}
              style={[
                styles.avatar,
                { width: responsive.sizes.avatar, height: responsive.sizes.avatar },
                responsive.isTablet && styles.avatarTablet,
              ]}
            />
          </View>

          <Text style={[styles.name, { fontSize: responsive.sizes.nameFont }]}>
            {item?.name || "Name"}
          </Text>

          {item?.day && (
            <View style={[
              styles.dayBadge,
              responsive.isTablet && styles.dayBadgeTablet,
              responsive.isLargeTablet && styles.dayBadgeLargeTablet
            ]}>
              <MaterialIcons name="calendar-today" size={responsive.isTablet ? 24 : 16} color="#8B0000" />
              <Text style={[
                styles.dayText, 
                responsive.isTablet && styles.dayTextTablet,
                responsive.isLargeTablet && styles.dayTextLargeTablet
              ]}>
                {item.day}
              </Text>
            </View>
          )}

          {renderContactIcons(item)}
        </View>

        {/* Content */}
        <View style={[
          styles.contentWrapper,
          responsive.isTablet && styles.contentWrapperTablet,
          responsive.isLargeTablet && styles.contentWrapperLargeTablet
        ]}>
          {item?.importantIntention && (
            <View style={styles.featuredSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text-outline" size={responsive.isTablet ? 28 : 22} color="#8B0000" />
                <Text style={[styles.sectionTitle, { fontSize: responsive.sizes.titleFont }]}>
                  Description
                </Text>
              </View>

              <Text
                style={[
                  styles.featuredText, 
                  { fontSize: responsive.sizes.textFont },
                  responsive.isTablet && styles.featuredTextTablet
                ]}
                numberOfLines={isItemReadMore ? undefined : (responsive.isTablet ? 6 : 5)}
              >
                {item.importantIntention}
              </Text>

              {item.importantIntention.length > (responsive.isTablet ? 400 : 300) && (
                <TouchableOpacity onPress={() => toggleReadMore(item.id)} style={styles.readMoreBtn}>
                  <Text style={[styles.readMoreText, responsive.isTablet && styles.readMoreTextTablet]}>
                    {isItemReadMore ? "Show Less" : "Read More"}
                  </Text>
                  <Ionicons name={isItemReadMore ? "chevron-up" : "chevron-down"} size={responsive.isTablet ? 20 : 16} color="#8B0000" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {item?.bio && renderSection("Biography", item.bio, "person-outline", "Ionicons", item.id, "bio")}
          {item?.work && renderSection("Work", item.work, "briefcase-outline", "Ionicons", item.id, "work")}
          {item?.achievement && renderSection("Achievements", item.achievement, "trophy-outline", "Ionicons", item.id, "achievement")}

          {gallery.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="images-outline" size={responsive.isTablet ? 28 : 22} color="#8B0000" />
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
                        responsive.isTablet && styles.galleryImageTablet,
                        responsive.isLargeTablet && styles.galleryImageLargeTablet,
                        idx === gallery.length - 1 && { marginRight: 0 },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {youtubeId && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="logo-youtube" size={responsive.isTablet ? 28 : 22} color="#FF0000" />
                <Text style={[styles.sectionTitle, { fontSize: responsive.sizes.titleFont }]}>
                  Video
                </Text>
              </View>

              <View style={[
                styles.videoContainer,
                responsive.isTablet && styles.videoContainerTablet
              ]}>
                <YoutubePlayer
                  height={responsive.isTablet ? (responsive.isLargeTablet ? 280 : 240) : 200}
                  width={responsive.cardWidth - (responsive.isTablet ? 64 : 32)}
                  play={playingStates[item.id] || false}
                  videoId={youtubeId}
                  onChangeState={onStateChange(item.id)}
                />
              </View>
            </View>
          )}

          <View style={styles.endDivider} />
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <LinearGradient colors={["#8B0000", "#A52A2A"]} style={[
      styles.header, 
      responsive.isTablet && styles.headerTablet,
      responsive.isLargeTablet && styles.headerLargeTablet
    ]}>
      <TouchableOpacity 
        style={[
          styles.backButton, 
          responsive.isTablet && styles.backButtonTablet,
          responsive.isLargeTablet && styles.backButtonLargeTablet
        ]} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={responsive.isTablet ? 32 : 24} color="#fff" />
      </TouchableOpacity>

      <Text style={[
        styles.headerTitle, 
        responsive.isTablet && styles.headerTitleTablet,
        responsive.isLargeTablet && styles.headerTitleLargeTablet
      ]} numberOfLines={1}>
        {categoryName || "விவரங்கள்"}
      </Text>

      <View style={styles.headerRight} />
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#8B0000" barStyle="light-content" />
      {renderHeader()}

      {loading ? (
        <Loader />
      ) : error ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={responsive.isTablet ? 80 : 60} color="#8B0000" />
          <Text style={[styles.errorText, responsive.isTablet && styles.errorTextTablet]}>{error}</Text>
          <TouchableOpacity 
            style={[
              styles.retryButton, 
              responsive.isTablet && styles.retryButtonTablet,
              responsive.isLargeTablet && styles.retryButtonLargeTablet
            ]} 
            onPress={fetchDetails}
          >
            <Text style={[styles.retryText, responsive.isTablet && styles.retryTextTablet]}>
              மீண்டும் முயற்சி
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={details}
          key={`${responsive.numColumns}_${responsive.width}`}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={responsive.numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent, 
            { padding: responsive.spacing.padding }
          ]}
          columnWrapperStyle={
            responsive.numColumns > 1
              ? { 
                  justifyContent: "center", 
                  gap: responsive.spacing.gap,
                  marginBottom: responsive.spacing.gap 
                }
              : null
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={[styles.emptyText, responsive.isTablet && styles.emptyTextTablet]}>
                விவரங்கள் எதுவும் இல்லை
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f9fa" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTablet: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerLargeTablet: {
    paddingTop: Platform.OS === "ios" ? 70 : 60,
    paddingBottom: 32,
    paddingHorizontal: 32,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonTablet: { width: 52, height: 52, borderRadius: 26 },
  backButtonLargeTablet: { width: 60, height: 60, borderRadius: 30 },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  headerTitleTablet: { fontSize: 26, letterSpacing: 0.5 },
  headerTitleLargeTablet: { fontSize: 32, letterSpacing: 0.8 },
  headerRight: { width: 40 },

  listContent: { paddingBottom: 30 },

  // ✅ Enhanced card design for tablets
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  itemContainerTablet: {
    borderRadius: 24,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  itemContainerLargeTablet: {
    borderRadius: 32,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 24,
  },

  bannerContainer: { width: "100%", position: "relative" },
  bannerImage: { width: "100%", height: "100%" },
  bannerGradient: { 
    position: "absolute", 
    left: 0, 
    right: 0, 
    bottom: 0, 
    height: 120,
  },

  profileSection: { 
    alignItems: "center", 
    paddingHorizontal: 16, 
    paddingBottom: 20,
  },
  profileSectionTablet: { 
    paddingHorizontal: 32, 
    paddingBottom: 28,
  },
  profileSectionLargeTablet: { 
    paddingHorizontal: 40, 
    paddingBottom: 32,
  },

  avatarWrapper: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarWrapperTablet: { 
    borderRadius: 28, 
    padding: 6, 
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  avatarWrapperLargeTablet: { 
    borderRadius: 32, 
    padding: 8, 
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  
  avatar: { borderRadius: 16 },
  avatarTablet: { borderRadius: 22 },

  name: { 
    marginTop: 16, 
    fontWeight: "bold", 
    color: "#333", 
    textAlign: "center",
  },

  dayBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(139,0,0,0.1)",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 25,
    marginTop: 10,
  },
  dayBadgeTablet: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 35,
    marginTop: 15,
  },
  dayBadgeLargeTablet: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 40,
    marginTop: 18,
  },
  
  dayText: { fontSize: 14, fontWeight: "600", color: "#8B0000", marginLeft: 6 },
  dayTextTablet: { fontSize: 18, marginLeft: 8 },
  dayTextLargeTablet: { fontSize: 22, marginLeft: 10 },

  contactRow: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 20, 
    gap: 20,
  },
  contactRowTablet: { 
    marginTop: 28, 
    gap: 35,
  },
  contactRowLargeTablet: { 
    marginTop: 32, 
    gap: 45,
  },

  iconButton: { alignItems: "center" },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconCircleTablet: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  iconCircleLargeTablet: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  phoneBg: { backgroundColor: "#8B0000" },
  whatsappBg: { backgroundColor: "#25D366" },
  locationBg: { backgroundColor: "#2196F3" },

  iconLabel: { marginTop: 5, fontSize: 12, color: "#666", fontWeight: "500" },
  iconLabelTablet: { fontSize: 16, marginTop: 10, fontWeight: "600" },
  iconLabelLargeTablet: { fontSize: 20, marginTop: 12, fontWeight: "600" },

  contentWrapper: { padding: 16 },
  contentWrapperTablet: { padding: 28 },
  contentWrapperLargeTablet: { padding: 36 },

  featuredSection: { marginBottom: 30 },
  featuredText: { 
    fontSize: 15, 
    color: "#333", 
    lineHeight: 24, 
    textAlign: "justify", 
    paddingHorizontal: 5,
  },
  featuredTextTablet: { 
    fontSize: 18, 
    lineHeight: 32, 
    paddingHorizontal: 8,
  },

  sectionContainer: { marginBottom: 30 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(139,0,0,0.2)",
    paddingBottom: 10,
  },
  sectionTitle: { 
    marginLeft: 12, 
    fontWeight: "700", 
    color: "#333", 
    flex: 1,
  },
  sectionContent: { 
    color: "#555", 
    lineHeight: 24, 
    textAlign: "justify", 
    paddingHorizontal: 8,
  },
  sectionContentTablet: { 
    lineHeight: 30, 
    paddingHorizontal: 12,
  },

  readMoreBtn: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "flex-end", 
    marginTop: 12, 
    paddingRight: 8,
  },
  readMoreText: { 
    color: "#8B0000", 
    fontSize: 14, 
    fontWeight: "600", 
    marginRight: 4,
  },
  readMoreTextTablet: { 
    fontSize: 18, 
    marginRight: 6,
  },

  galleryScroll: { marginTop: 15 },
  galleryImage: { 
    width: 150, 
    height: 120, 
    borderRadius: 12, 
    marginRight: 12, 
    backgroundColor: "#f0f0f0",
  },
  galleryImageTablet: { 
    width: 240, 
    height: 180, 
    borderRadius: 18, 
    marginRight: 18,
  },
  galleryImageLargeTablet: { 
    width: 300, 
    height: 220, 
    borderRadius: 24, 
    marginRight: 24,
  },

  videoContainer: { 
    marginTop: 15, 
    borderRadius: 15, 
    overflow: "hidden", 
    backgroundColor: "#000",
  },
  videoContainerTablet: { 
    marginTop: 20, 
    borderRadius: 24,
  },

  endDivider: { 
    height: 2, 
    backgroundColor: "rgba(139,0,0,0.2)", 
    marginTop: 20, 
    marginBottom: 10,
  },

  centerContainer: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 24, 
    minHeight: 400,
  },
  
  errorText: { 
    color: "#8B0000", 
    fontSize: 16, 
    fontWeight: "600", 
    textAlign: "center", 
    marginTop: 15, 
    marginBottom: 20,
  },
  errorTextTablet: { 
    fontSize: 22, 
    marginTop: 25, 
    marginBottom: 30,
  },

  retryButton: { 
    backgroundColor: "#8B0000", 
    paddingHorizontal: 30, 
    paddingVertical: 12, 
    borderRadius: 25,
  },
  retryButtonTablet: { 
    paddingHorizontal: 50, 
    paddingVertical: 18, 
    borderRadius: 35,
  },
  retryButtonLargeTablet: { 
    paddingHorizontal: 60, 
    paddingVertical: 22, 
    borderRadius: 40,
  },
  
  retryText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  retryTextTablet: { fontSize: 22 },

  emptyText: { fontSize: 18, color: "#999", fontWeight: "600" },
  emptyTextTablet: { fontSize: 26 },
});