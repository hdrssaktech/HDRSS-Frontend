import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Animated,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

/* COMPONENTS  Home*/
import Advertisement from "../../components/Add/Advertisement";
import InterviewVideos from "../../components/Add/InterviewVideos";
import DistrictList from "../DistrictPage/DistrictPage1";
import EventsPage from "../../components/Events/EventPage1";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
/* DATA */
import { fetchNews } from "../../Controller/NewsController/NewsController";
import Loader from "../../components/Alert/Loader";
import CaucusVideo from "../../components/Add/CaucusVideo";
import ProductScreen1 from "../../pages/ProductItems/ProductScreen1";

/* ================= HELPER FUNCTIONS ================= */
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatDate = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

/* ================= FEATURES ================= */
const FEATURES = [
  { id: 0,label: "பஞ்சாங்கம்", image: require("../../../assets/panchagam/panchagam.jpg") },
  { id: 1, label: "இந்துத்துவா", image: require("../../../assets/hinduthua/hindu.webp") },
  { id: 2, label: "வரலாறு", image: require("../../../assets/Left Swap/history2.png") },
  { id: 3, label: "ஜோதிடம்", image: require("../../../assets/Left Swap/astrology.jpg") },
  { id: 4, label: "கதைகள்", image: require("../../../assets/Left Swap/Story.jpg") },
  { id: 5, label: "பூஜை", image: require("../../../assets/Left Swap/poojai.jpg") },
  { id: 6, label: "யாத்திரை", image: require("../../../assets/Left Swap/tourism1.jpg") },
  { id: 7, label: "வாஸ்து", image: require("../../../assets/Left Swap/vasthu.jpeg") },
  { id: 8, label: "மந்திரம்", image: require("../../../assets/home-bg-img/ohm-img.png") },
  { id: 9, label: "பக்திப் பாடல்கள்", image: require("../../../assets/home-bg-img/ruthurasa-img.png") },
  { id: 10, label: "நூல்கள்", image: require("../../../assets/hinduthua/Noolgal.jpg") },
  { id: 11, label: "மேட்ரிமோனி", image: require("../../../assets/hinduthua/matrimony.png") },
  { id: 12, label: "குருகுலம்", image: require("../../../assets/Left Swap/gurukulam.jpg") }
];

const columns = 25; 
const size = 5;  

const BACKGROUNDS = [
  require("../../../assets/home-bg-img/header-img.png"),
  require("../../../assets/home-bg-img/ohm-img.png"),
  require("../../../assets/home-bg-img/ruthurasa-img.png"),
  require("../../../assets/home-bg-img/header-img.png"),
  require("../../../assets/home-bg-img/ohm-img.png"),
  require("../../../assets/home-bg-img/ruthurasa-img.png"),
];

/* ================= NEWS AUTO-SCROLL SETTINGS ================= */
const NEWS_CAROUSEL_LIMIT = 3;
const AUTO_SCROLL_INTERVAL = 3000; // ms

export default function HomePage() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const styles = getStyles(isTablet, width);

  const [showSidebar, setShowSidebar] = useState(false);
  const [news, setNews] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [interviewData, setInterviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 📰 NEWS CAROUSEL STATE */
  const newsCarouselRef = useRef(null);
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const CARD_WIDTH = width - (isTablet ? 40 : 30);

  /* 🗳 ELECTION BUTTON ANIMATION */
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useFocusEffect(
    React.useCallback(() => {
      slideAnim.setValue(-300);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  /* 📰 FETCH ALL DATA SIMULTANEOUSLY */
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);

        // Mock functions - replace with your actual API calls
        const fetchAds = async () => []; // Your actual fetch function
        const fetchDistricts = async () => []; // Your actual fetch function
        const fetchEvents = async () => []; // Your actual fetch function
        const fetchInterviews = async () => []; // Your actual fetch function

        const [
          newsRes,
          adsRes,
          districtRes,
          eventsRes,
          interviewRes,
        ] = await Promise.all([
          fetchNews(),
          fetchAds(),
          fetchDistricts(),
          fetchEvents(),
          fetchInterviews(),
        ]);

        // Sort news by orderNo
        const orderedNews = newsRes.sort((a, b) =>
          (a.orderNo ?? Infinity) - (b.orderNo ?? Infinity)
        );

        setNews(orderedNews);
        setAdsData(adsRes);
        setDistrictData(districtRes);
        setEventsData(eventsRes);
        setInterviewData(interviewRes);

      } catch (error) {
        console.log("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  /* 📰 AUTO-SCROLL THE NEWS CAROUSEL */
  const carouselNews = news.slice(0, NEWS_CAROUSEL_LIMIT);

  useEffect(() => {
    if (carouselNews.length <= 1) return;

    const interval = setInterval(() => {
      setActiveNewsIndex((prev) => {
        const next = (prev + 1) % carouselNews.length;
        newsCarouselRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });
        return next;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [carouselNews.length]);

  const handleNewsMomentumScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveNewsIndex(index);
  };

  const getNewsItemLayout = (data, index) => ({
    length: CARD_WIDTH,
    offset: CARD_WIDTH * index,
    index,
  });

  // Show loader only during initial data fetch
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🏺 VINTAGE PARCHMENT BASE GRADIENT */}
      <LinearGradient
        colors={["#C9B96A", "#C9B96A", "#C9B96A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* 🔥 Background Collage (sepia-tinted) */}
      <View style={styles.backgroundWrapper}>
        {[...Array(500)].map((_, index) => {
          const img = BACKGROUNDS[index % BACKGROUNDS.length];
          return (
            <Image
              key={index}
              source={img}
              style={[
                styles.backgroundImage,
                {
                  width: `${size}%`,
                  height: `${size}%`,
                  top: `${Math.floor(index / columns) * size}%`,
                  left: `${(index % columns) * size}%`,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.overlay}>
        {/* ✅ HEADER */}
        <Header toggleSidebar={() => setShowSidebar(!showSidebar)} />

        {/* ✅ LEFT SIDEBAR */}
        {showSidebar && (
          <View style={[styles.sidebarOverlay, isTablet && styles.sidebarOverlayTablet]}>
            <Sidebar closeSidebar={() => setShowSidebar(false)} isTablet={isTablet} />
          </View>
        )}

        <FlatList
          data={[]}
          keyExtractor={() => "home"}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* 🗳 Election Button */}
              <Animated.View
                style={[
                  styles.centerButtonContainer,
                  { transform: [{ translateX: slideAnim }] },
                ]}
              >
                <TouchableOpacity
                  // onPress={() => navigation.navigate("Assemblies")}
                >
                  <LinearGradient
                    colors={["#FFD700", "#FF8C00", "#93210A"]}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.gradientButtonText}>
                      வாகை 2026...
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Advertisement Component */}
              <View style={styles.advertisementWrapper}>
                <Advertisement data={adsData} />
              </View>

              <CaucusVideo/>

              {/* District List */}
              <DistrictList data={districtData} />
            </>
          }
          ListFooterComponent={
            <>
              {interviewData.length > 0 && (
                <InterviewVideos data={interviewData} />
              )}

              {/* 📰 NEWS SECTION */}
              <View style={styles.newsHeaderContainer}>
                <View>
                  <Text style={styles.heading}>News</Text>
                </View>
                {news.length > 0 && (
                  <TouchableOpacity
                    style={styles.seeAllBtn}
                    onPress={() => navigation.navigate("NewsPage1")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewAllText}>See All News</Text>
                    <Ionicons name="arrow-forward" size={14} color="#93210A" />
                  </TouchableOpacity>
                )}
              </View>

              {news.length === 0 ? (
                <Text style={styles.noDataText}>No news available</Text>
              ) : (
                <>
                  {/* 🔸 Auto-scrolling News Carousel (max 3 items) */}
                  <FlatList
                    ref={newsCarouselRef}
                    data={carouselNews}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleNewsMomentumScrollEnd}
                    getItemLayout={getNewsItemLayout}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={{ width: CARD_WIDTH }}
                        onPress={() =>
                          navigation.navigate("Newspage2", { news: item })
                        }
                        activeOpacity={0.85}
                      >
                        <View style={styles.newsCard}>
                          <ImageBackground
                            source={{ uri: item.image }}
                            style={styles.newsImageBg}
                            imageStyle={styles.newsImageBgRadius}
                          >
                            <LinearGradient
                              colors={["transparent", "rgba(43,10,5,0.55)", "rgba(30,7,4,0.92)"]}
                              locations={[0, 0.5, 1]}
                              style={styles.newsGradientOverlay}
                            >
                              {index === 0 && (
                                <View style={styles.topBadge}>
                                  <Ionicons name="flame" size={12} color="#3A0D07" />
                                  <Text style={styles.topBadgeText}>TOP</Text>
                                </View>
                              )}
                              <Text style={styles.newsTitle} numberOfLines={3}>
                                {item.title}
                              </Text>
                            </LinearGradient>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    )}
                  />

                  {/* 🔸 Dot Pagination */}
                  <View style={styles.dotsContainer}>
                    {carouselNews.map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          activeNewsIndex === i && styles.dotActive,
                        ]}
                      />
                    ))}
                  </View>
                </>
              )}

              {/* Events Page */}
              <EventsPage data={eventsData} />

              {/* ProductScreen1 */}
              <ProductScreen1 />

              {/* 🔵 EXPLORE MORE - FIXED TO LEFT ALIGN */}
              <View style={styles.circleMenuContainer}>
                <Text style={styles.heading}>Explore More</Text>

                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.scrollViewContent}
                >
                  {FEATURES.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        if (item.label === "வரலாறு") navigation.navigate("HistoryPage1");
                        if (item.label === "ஜோதிடம்") navigation.navigate("AstrologyPage1");
                        if (item.label === "கதைகள்") navigation.navigate("StoryPage1");
                        if (item.label === "பூஜை") navigation.navigate("PoojaPage1");
                        if (item.label === "யாத்திரை") navigation.navigate("TourismPage1");
                        if (item.label === "வாஸ்து") navigation.navigate("VaasthuPage");
                        if (item.label === "இந்துத்துவா") navigation.navigate("HinduThuvm");
                        if (item.label === "பஞ்சாங்கம்") navigation.navigate("Panchangam");
                        if (item.label === "மேட்ரிமோனி") navigation.navigate("matrimonyBtn");
                        if (item.label === "நூல்கள்") navigation.navigate("HinduNoolgal1" ,{ categoryTypes: 'நூல்கள்' });
                        if (item.label === "மந்திரம்") navigation.navigate("SloganPage1",{ name: item.label });
                        if (item.label === "பக்திப் பாடல்கள்") navigation.navigate("DivinePage1",{ name: item.label });
                        if (item.label === "குருகுலம்") navigation.navigate("GurukulamPage1",{name: item.label});
                      }}
                    >
                      <View style={styles.circleCardWrapper}>
                        <LinearGradient
                          colors={["#FFF8E7", "#FFD89B", "#FFB75E"]}
                          style={styles.circleGradient}
                        >
                          <Image source={item.image} style={styles.circleImage} />
                        </LinearGradient>
                        <Text style={styles.label}>{item.label}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </>
          }
        />
      </View>
    </View>
  );
}

/* ================= STYLES ================= */
const getStyles = (isTablet, width) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5E9D3",
    },

    sidebarOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "120%",
      height: "100%",
      zIndex: 999,
    },

    sidebarOverlayTablet: {
      left: -440,
      paddingHorizontal: -50,
    },

    backgroundWrapper: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
    },

    backgroundImage: {
      position: "absolute",
      opacity: 0.10,
      tintColor: "#8B5E34",
    },

    overlay: {
      flex: 1,
      backgroundColor: "rgba(250, 235, 200, 0.55)",
    },

    centerButtonContainer: {
      alignItems: "center",
      marginTop: isTablet ? 25 : 14,
    },

    gradientButton: {
      paddingVertical: isTablet ? 18 : 12,
      paddingHorizontal: isTablet ? 55 : 30,
      borderRadius: 10,
    },

    gradientButtonText: {
      color: "#fff",
      fontSize: isTablet ? 22 : 19,
      fontWeight: "900",
    },

    advertisementWrapper: {
      marginVertical: isTablet ? 25 : 15,
    },

    /* ================= NEWS SECTION STYLES ================= */
    newsHeaderContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginHorizontal: 15,
      marginTop: 10,
    },

    heading: {
      fontSize: isTablet ? 24 : 19,
      fontWeight: "bold",
      color: "#93210A",
      marginLeft: 15, // Added this to align with the scrollview
    },

    headingUnderline: {
      width: 34,
      height: 3,
      backgroundColor: "#93210A",
      borderRadius: 2,
      marginTop: 4,
    },

    seeAllBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },

    viewAllText: {
      fontSize: isTablet ? 15 : 12.5,
      fontWeight: "700",
      color: "#93210A",
    },

    noDataText: {
      textAlign: "center",
      marginVertical: 20,
      fontSize: isTablet ? 18 : 14,
      color: "#666",
    },

    // News Carousel Card - full-image cover style with gradient overlay
    newsCard: {
      marginHorizontal: isTablet ? 20 : 15,
      marginTop: isTablet ? 25 : 18,
      borderRadius: isTablet ? 18 : 16,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: "#D4AF37",
      elevation: isTablet ? 8 : 6,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: isTablet ? 10 : 8,
      shadowOffset: { width: 0, height: isTablet ? 4 : 3 },
      backgroundColor: "#301913",
     
    },

    newsImageBg: {
      width: "100%",
      height: isTablet ? 350 : 200,
      justifyContent: "flex-end",
    },

    newsImageBgRadius: {
      borderRadius: isTablet ? 16 : 14,
    },

    newsGradientOverlay: {
      paddingHorizontal: isTablet ? 18 : 14,
      paddingVertical: isTablet ? 16 : 12,
      justifyContent: "flex-end",
    },

    topBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: "#D4AF37",
      paddingHorizontal: isTablet ? 12 : 9,
      paddingVertical: isTablet ? 5 : 4,
      borderRadius: 20,
      marginBottom: isTablet ? 10 : 8,
      gap: 4,
    },

    topBadgeText: {
      fontSize: isTablet ? 12 : 10,
      color: "#3A0D07",
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },

    newsTitle: {
      fontSize: isTablet ? 20 : 13,
      fontWeight: "bold",
      color: "#fff",
      lineHeight: isTablet ? 27 : 20,
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },

    // Dot pagination
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: isTablet ? 14 : 10,
      marginBottom: isTablet ? 10 : 6,
    },

    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#D9C9A3",
      marginHorizontal: 4,
    },

    dotActive: {
      backgroundColor: "#93210A",
      width: 18,
    },

    /* ================= EXPLORE MORE - FIXED TO LEFT ================= */
    circleMenuContainer: {
      marginVertical: 4,
      width: "100%", // Ensure full width
    },

    scrollViewContent: {
      paddingLeft: 15, // Match the heading margin
      paddingRight: 15,
      paddingVertical: 10,
    },

    circleCardWrapper: {
      alignItems: "center",
      marginHorizontal: isTablet ? 20 : 12,
    },

    circleGradient: {
      width: isTablet ? 230 : 120,
      height: isTablet ? 230 : 120,
      borderRadius: 120,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
    },

    circleImage: {
      width: isTablet ? 180 : 90,
      height: isTablet ? 180 : 90,
      borderRadius: 100,
    },

    label: {
      marginTop: 8,
      fontSize: isTablet ? 16 : 13,
      fontWeight: "600",
    },
  });