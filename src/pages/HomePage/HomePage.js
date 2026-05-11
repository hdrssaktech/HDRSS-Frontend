import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  ScrollView,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

/* COMPONENTS */
import Advertisement from "../../components/Add/Advertisement";
import InterviewVideos from "../../components/Add/InterviewVideos";
import DistrictList from "../DistrictPage/DistrictPage1";
import EventsPage from "../../components/Events/EventPage1";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
/* DATA */
import { fetchNews } from "../../Controller/NewsController/NewsController";
import Loader from "../../components/Alert/Loader";

/* ================= FEATURES ================= */
const FEATURES = [
  { id: 0,label: "பஞ்சாங்கம்", image: require("../../../assets/panchagam/panchagam.jpg") },
  { id: 1, label: "இந்துத்துவா", image: require("../../../assets/hinduthua/hindu.webp") },
  { id: 2, label: "வரலாறு", image: require("../../../assets/Left Swap/History.jpeg") },
  { id: 3, label: "ஜோதிடம்", image: require("../../../assets/Left Swap/Astrology.webp") },
  { id: 4, label: "கதைகள்", image: require("../../../assets/Left Swap/Story.jpg") },
  { id: 5, label: "பூஜை", image: require("../../../assets/Left Swap/poojai.jpg") },
  { id: 6, label: "யாத்திரை", image: require("../../../assets/Left Swap/tourism.jpg") },
  { id: 7, label: "வாஸ்து", image: require("../../../assets/Left Swap/vasthu.jpeg") },
  { id: 8, label: "மந்திரம்", image: require("../../../assets/home-bg-img/ohm-img.png") },
  { id: 9, label: "பக்திப் பாடல்கள்", image: require("../../../assets/home-bg-img/ruthurasa-img.png") },
   { id: 10, label: "நூல்கள்", image: require("../../../assets/hinduthua/Noolgal.jpg") }
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

export default function HomePage() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const styles = getStyles(isTablet);

  const [showSidebar, setShowSidebar] = useState(false);
  const [news, setNews] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [interviewData, setInterviewData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Show loader only during initial data fetch
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loader />
      </View>
    );
  }
   const formatDate = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
 };

  return (
    <View style={styles.container}>
      {/* 🔥 Background Collage */}
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
                      CAUCUS 2026...
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Advertisement Component */}
              <View style={styles.advertisementWrapper}>
                <Advertisement data={adsData} />
              </View>

              {/* District List */}
              <DistrictList data={districtData} />
            </>
          }
          ListFooterComponent={
            <>
              <InterviewVideos/>
              {/* 📰 NEWS SECTION */}
              <Text style={styles.heading}>News</Text>
              {news.length === 0 ? (
                <Text style={styles.noDataText}>No news available</Text>
              ) : (
                <FlatList
                  data={news.slice(0, isTablet ? 3 : 2)}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Newspage2", { news: item })
                      }
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={['#FFF3E0', '#FFE0B2']}
                        style={styles.newsCard}
                      >
                        <Image source={{ uri: item.image }} style={styles.newsImage} />
                        <View style={styles.newsContent}>
                          <Text style={styles.newsCategory}>{item.type}</Text>
                          <Text style={styles.newsDate}>தேதி: {formatDate(item.date)}</Text>
                          <Text style={styles.newsTitle} numberOfLines={2}>
                            {item.title}
                          </Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                />
              )}

              <TouchableOpacity
                onPress={() => navigation.navigate("NewsPage1")}
                style={styles.seeMoreContainer}
              >
                <Text style={styles.more}>See All News →</Text>
              </TouchableOpacity>

              {/* Events Page */}
              <EventsPage data={eventsData} />

              {/* 🔵 EXPLORE MORE */}
              <View style={styles.circleMenuContainer}>
                <Text style={styles.heading}>Explore More</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                        if (item.label === "நூல்கள்") navigation.navigate("HinduNoolgal1" ,{ categoryTypes: 'நூல்கள்' });
                        if (item.label === "மந்திரம்") navigation.navigate("SloganPage1",{ name: item.label });
                        if (item.label === "பக்திப் பாடல்கள்") navigation.navigate("DivinePage1",{ name: item.label });
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
const getStyles = (isTablet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
    },

  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,          // ✅ Always 0 — never offset
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
      opacity: 0.15,
    },

    overlay: {
      flex: 1,
      backgroundColor: "rgba(255, 242, 242, 0.84)",
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
      fontSize: isTablet ? 22 : 18,
      fontWeight:"900",
    },

    advertisementWrapper: {
      marginVertical: isTablet ? 25 : 15,
    },

    heading: {
      fontSize: isTablet ? 26 : 20,
      fontWeight: "bold",
      color: "#93210A",
      marginHorizontal: 15,
      marginVertical: 10,
    },

    seeMoreContainer: {
      alignItems: "flex-end",
      paddingHorizontal: 15,
      marginBottom: 10,
    },

    more: {
      color: "#93210A",
      fontSize: isTablet ? 18 : 14,
      fontWeight: "600",
    },

    newsCard: {
      flexDirection: "row",
      backgroundColor: "#ffffff",
      marginHorizontal: 15,
      marginVertical: 8,
      padding: 10,
      elevation: 4,
      overflow: "hidden",
    },

    newsImage: {
      width: isTablet ? 150 : 120,
      height: isTablet ? 125 : 100,
    },

    newsContent: {
      flex: 1,
      padding: 10,
      justifyContent: "center",
    },

    newsCategory: {
      fontSize: isTablet ? 18 : 13,
      color: "#93210A",
      fontWeight: "bold",
    },
    newsDate:{
    fontSize: isTablet ? 16 : 11,
      color: "#000000",
      fontWeight: "bold",
    },

    newsTitle: {
      fontSize: isTablet ? 18 : 11,
      fontWeight: "bold",
      color: "#000",
      marginTop: 4,
    },

    noDataText: {
      textAlign: "center",
      marginVertical: 20,
      fontSize: isTablet ? 18 : 14,
      color: "#666",
    },

    circleMenuContainer: {
      marginVertical: 20,
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
