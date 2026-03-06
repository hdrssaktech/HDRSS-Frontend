import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const isTablet = width > 600;

export default function TownPage2() {
  const route = useRoute();
  const navigation = useNavigation();
  const { town, townId, districtName, districtId } = route.params;

  const [showMore, setShowMore] = useState(false);
  const [showAllTemples, setShowAllTemples] = useState(false);
  const [showAllTourism, setShowAllTourism] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    if (town.add?.length > 1) {
      let index = 0;
      const timer = setInterval(() => {
        index = (index + 1) % town.add.length;
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [town.add]);

  const aboutText = showMore
    ? town.about
    : town.about?.slice(0, isTablet ? 300 : 180) + 
      (town.about?.length > (isTablet ? 300 : 180) ? "..." : "");

  const handleCall = (phone) =>
    phone && Linking.openURL(`tel:${phone}`);

  const handleLocation = (place) =>
    place &&
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place
      )}`
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />

      {/* ================= BANNER ================= */}
      <View style={styles.banner}>
        <Image source={{ uri: town.bannerImage }} style={styles.bannerImage} />
        <View style={styles.overlay} />

        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="chevron-back" 
            size={isTablet ? 34 : 28} 
            color="#fff" 
          />
        </TouchableOpacity>

        <Text style={styles.bannerTitle}>{town.townname || town.title}</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ================= ABOUT ================= */}
        {town.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{aboutText}</Text>

            {town.about.length > (isTablet ? 300 : 180) && (
              <TouchableOpacity
                style={styles.readMoreRow}
                onPress={() => setShowMore(!showMore)}
              >
                <Text style={styles.readMoreText}>
                  {showMore ? "Show Less" : "Read More"}
                </Text>
                <Ionicons
                  name={showMore ? "chevron-up" : "chevron-forward"}
                  size={isTablet ? 20 : 16}
                  color="#93210A"
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ================= ADS ================= */}
        {town.add?.length > 0 && (
          <Animated.FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            data={town.add}
            keyExtractor={(_, i) => i.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item.image }} 
                style={styles.fullAdImage} 
              />
            )}
          />
        )}

        {/* ================= BUSINESS ================= */}
        <TouchableOpacity
          style={styles.businessBtn}
          onPress={() => navigation.navigate("TownBusiness1", { town })}
        >
          <Ionicons name="business" size={isTablet ? 28 : 22} color="#fff" />
          <Text style={styles.businessText}>Explore Businesses</Text>
          <Ionicons name="chevron-forward" size={isTablet ? 26 : 20} color="#fff" />
        </TouchableOpacity>

        {/* ================= MENU ================= */}
        <View style={styles.menuRow}>
          <Menu title="Government" onPress={() =>
            navigation.navigate("TownGovernmentPage1", { townId })
          } />

          <Menu title="Parties" onPress={() =>
            navigation.navigate("TownPartiesMember", { townId })
          } />

          <Menu title="Complaint" onPress={() =>
            navigation.navigate("ComplainPage1", { districtId:districtId, districtName:districtName })
          } />

          <Menu title="HDRSS" onPress={() =>
            navigation.navigate("Member0", { districtId, districtName })
          } />
        </View>

        {/* ================= TEMPLES ================= */}
        {town.famousPlaces?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.centerTitle}>Temples</Text>

            {(showAllTemples ? town.famousPlaces : town.famousPlaces.slice(0, 2)).map(
              (item, index) => (
                <PlaceRow
                  key={index}
                  item={item}
                  reverse={index % 2 !== 0}
                  onPress={() =>
                    navigation.navigate("FamousPlace", { place: item })
                  }
                  onCall={handleCall}
                  onLocation={handleLocation}
                />
              )
            )}

            {town.famousPlaces.length > 2 && (
              <SeeMore onPress={() => setShowAllTemples(!showAllTemples)} />
            )}
          </View>
        )}

        {/* ================= TOURISM ================= */}
        {town.tourist?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.centerTitle}>Tourism</Text>

            {(showAllTourism ? town.tourist : town.tourist.slice(0, 2)).map(
              (item, index) => (
                <PlaceRow
                  key={index}
                  item={item}
                  reverse={index % 2 !== 0}
                  onPress={() =>
                    navigation.navigate("TouristPlace", { spot: item })
                  }
                  onCall={handleCall}
                  onLocation={handleLocation}
                />
              )
            )}

            {town.tourist.length > 2 && (
              <SeeMore onPress={() => setShowAllTourism(!showAllTourism)} />
            )}
          </View>
        )}

        {/* ================= VIDEOS ================= */}
        {town.videos?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.centerTitle}>Videos</Text>

            {town.videos.map((v, i) => {
              const id = extractYouTubeId(v.videoUrl);
              return id ? (
                <View key={i} style={styles.videoWrapper}>
                  <YoutubePlayer 
                    height={isTablet ? 350 : 220} 
                    play={false} 
                    videoId={id} 
                  />
                </View>
              ) : null;
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= COMPONENTS ================= */

const Menu = ({ title, onPress }) => (
  <TouchableOpacity style={styles.menuBox} onPress={onPress}>
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

const PlaceRow = ({ item, reverse, onPress, onCall, onLocation }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.card, reverse && styles.reverseRow]}>
      <Image source={{ uri: item.image }} style={styles.avatar} />

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name || item.title}</Text>

        {/* SAME DESCRIPTION FOR TEMPLES & TOURISM */}
        <Text style={styles.cardDesc} numberOfLines={isTablet ? 3 : 2}>
          {item.description || item.about || item.details || item.title}
        </Text>

        <View style={styles.iconRow}>
          {item.phone && (
            <TouchableOpacity onPress={() => onCall(item.phone)}>
              <Ionicons name="call" size={isTablet ? 28 : 22} color="green" />
            </TouchableOpacity>
          )}
          {item.location && (
            <TouchableOpacity onPress={() => onLocation(item.location)}>
              <Ionicons name="location" size={isTablet ? 28 : 22} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const SeeMore = ({ onPress }) => (
  <TouchableOpacity style={styles.seeMoreRow} onPress={onPress}>
    <Text style={styles.seeMoreText}>See More</Text>
    <Ionicons name="chevron-forward" size={isTablet ? 22 : 18} color="#93210A" />
  </TouchableOpacity>
);

const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingBottom: isTablet ? 40 : 20,
  },

  banner: { 
    height: isTablet ? 300 : 230 
  },
  bannerImage: { 
    width: "100%", 
    height: "100%" 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: "rgba(0,0,0,0.4)" 
  },

  backBtn: { 
    position: "absolute", 
    top: Platform.OS === "ios" ? (isTablet ? 60 : 50) : (isTablet ? 50 : 40), 
    left: isTablet ? 30 : 20,
    padding: isTablet ? 10 : 5,
    zIndex: 10,
  },

  bannerTitle: {
    position: "absolute",
    bottom: isTablet ? 40 : 25,
    left: isTablet ? 30 : 20,
    color: "#fff",
    fontSize: isTablet ? 36 : 26,
    fontWeight: "bold",
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  section: { 
    paddingHorizontal: isTablet ? 30 : 16, 
    marginTop: isTablet ? 35 : 28 
  },
  sectionTitle: { 
    fontSize: isTablet ? 26 : 20, 
    fontWeight: "bold", 
    color: "#93210A",
    marginBottom: isTablet ? 10 : 5,
  },
  centerTitle: { 
    fontSize: isTablet ? 28 : 22, 
    fontWeight: "bold", 
    color: "#93210A", 
    textAlign: "center", 
    marginBottom: isTablet ? 24 : 16,
  },

  aboutText: { 
    fontSize: isTablet ? 16 : 13, 
    color: "#555", 
    lineHeight: isTablet ? 28 : 22,
    textAlign: 'justify',
  },

  readMoreRow: { 
    flexDirection: "row", 
    justifyContent: "flex-end", 
    marginTop: isTablet ? 12 : 6,
    alignItems: 'center',
  },
  readMoreText: { 
    color: "#93210A", 
    fontWeight: "600",
    fontSize: isTablet ? 16 : 14,
    marginRight: 5,
  },

  fullAdImage: { 
    width, 
    height: isTablet ? 250 : 180,
    marginTop: isTablet ? 25 : 20,
  },

  businessBtn: {
    backgroundColor: "#93210A",
    margin: isTablet ? 30 : 15,
    padding: isTablet ? 35 : 25,
    borderRadius: isTablet ? 18 : 14,
    flexDirection: "row",
    alignItems: "center",
  },

  businessText: { 
    color: "#fff", 
    fontSize: isTablet ? 20 : 16, 
    fontWeight: "bold", 
    flex: 1, 
    marginHorizontal: isTablet ? 16 : 12,
  },

  menuRow: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between", 
    padding: isTablet ? 20 : 16,
  },
  menuBox: { 
    width: "48%", 
    backgroundColor: "#93210A", 
    padding: isTablet ? 20 : 14, 
    borderRadius: isTablet ? 14 : 10, 
    alignItems: "center", 
    marginBottom: isTablet ? 16 : 12,
    minHeight: isTablet ? 70 : 60,
    justifyContent: 'center',
  },
  menuText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: isTablet ? 18 : 14,
  },

  // Card styles for Temples & Tourism (increased sizes)
  card: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#aaa",
    borderRadius: isTablet ? 24 : 20,
    padding: isTablet ? 18 : 12,
    alignItems: "center",
    marginBottom: isTablet ? 22 : 18,
    minHeight: isTablet ? 160 : 120,
  },
  reverseRow: { 
    flexDirection: "row-reverse" 
  },

  avatar: { 
    width: isTablet ? 120 : 90, 
    height: isTablet ? 120 : 90, 
    borderRadius: isTablet ? 60 : 45,
    minWidth: isTablet ? 120 : 90,
  },

  cardContent: { 
    flex: 1, 
    paddingHorizontal: isTablet ? 18 : 14,
    justifyContent: 'center',
  },
  cardTitle: { 
    fontSize: isTablet ? 20 : 16, 
    fontWeight: "700",
    marginBottom: isTablet ? 6 : 4,
  },
  cardDesc: { 
    fontSize: isTablet ? 16 : 14, 
    color: "#555", 
    marginVertical: isTablet ? 8 : 6,
    lineHeight: isTablet ? 22 : 18,
  },

  iconRow: { 
    flexDirection: "row", 
    gap: isTablet ? 20 : 16,
    marginTop: isTablet ? 8 : 4,
  },

  seeMoreRow: { 
    flexDirection: "row", 
    justifyContent: "flex-end", 
    alignItems: "center",
    marginTop: isTablet ? 10 : 5,
  },
  seeMoreText: { 
    color: "#93210A", 
    fontWeight: "bold",
    fontSize: isTablet ? 18 : 14,
    marginRight: 5,
  },

  // Video wrapper - full width
  videoWrapper: { 
    marginBottom: 16,
    width: '100%',
    borderRadius: isTablet ? 12 : 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
});