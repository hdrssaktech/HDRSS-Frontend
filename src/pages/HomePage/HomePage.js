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
  ActivityIndicator,
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
// import CurrentLocation from "../../components/Location/CurrentLocation";

/* DATA */
import { INTERVIEW_DATA } from "../InterviewPage/Interviewdata";
import { fetchNews } from "../../Controller/NewsController/NewsController";

/* ================= FEATURES ================= */
const FEATURES = [
  { id: 1, label: "History", image: require("../../../assets/Left Swap/History.jpeg") },
  { id: 2, label: "Astrology", image: require("../../../assets/Left Swap/Astrology.webp") },
  { id: 3, label: "Stories", image: require("../../../assets/Left Swap/Story.jpg") },
  { id: 4, label: "Pooja", image: require("../../../assets/Left Swap/poojai.jpg") },
  { id: 5, label: "Tourism", image: require("../../../assets/Left Swap/tourism.jpg") },
  { id: 6, label: "Vasthu", image: require("../../../assets/Left Swap/vasthu.jpeg") },
];

export default function HomePage() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const styles = getStyles(isTablet);

  const [showSidebar, setShowSidebar] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 📰 FETCH NEWS */
  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchNews();
      setNews(data);
      setLoading(false);
    };
    loadNews();
  }, []);

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

  return (
    <View style={styles.container}>

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
                onPress={() => navigation.navigate("ElectionVotePage1")}
              >
                <LinearGradient
                  colors={["#FFD700", "#FF8C00", "#93210A"]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.gradientButtonText}>
                    🗳 2026 Election
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* <CurrentLocation /> */}

            <View style={styles.advertisementWrapper}>
              <Advertisement />
            </View>

            <DistrictList />
          </>
        }
        ListFooterComponent={
          <>
            {/* 🎥 INTERVIEW VIDEOS */}
            <FlatList
              data={INTERVIEW_DATA.slice(0, 1)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <InterviewVideos video={item} />}
              scrollEnabled={false}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("InterviewPage1")}
              style={styles.seeMoreContainer}
            >
              {/* <Text style={styles.more}>See All Videos →</Text> */}
            </TouchableOpacity>

            {/* 📰 NEWS */}
            <Text style={styles.heading}>Latest News</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#93210A" />
            ) : (
              <FlatList
                data={news.slice(0, isTablet ? 4 : 2)}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.newsCard}
                    onPress={() =>
                      navigation.navigate("Newspage2", { news: item })
                    }
                  >
                    <Image source={{ uri: item.image }} style={styles.newsImage} />
                    <View style={styles.newsContent}>
                      <Text style={styles.newsCategory}>{item.type}</Text>
                      <Text style={styles.newsTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                    </View>
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

            <EventsPage />

            {/* 🔵 EXPLORE MORE */}
            <View style={styles.circleMenuContainer}>
              <Text style={styles.heading}>Explore More</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {FEATURES.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      if (item.label === "History") navigation.navigate("HistoryPage1");
                      if (item.label === "Astrology") navigation.navigate("AstrologyPage1");
                      if (item.label === "Stories") navigation.navigate("StoryPage1");
                      if (item.label === "Pooja") navigation.navigate("PoojaPage1");
                      if (item.label === "Tourism") navigation.navigate("TourismPage1");
                      if (item.label === "Vastu") navigation.navigate("VaasthuPage");
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
  );
}

/* ================= STYLES ================= */
const getStyles = (isTablet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },

    /* 🔥 LEFT SIDEBAR FIX */
    sidebarOverlay: {
      position: "absolute",
      top: 0,
      left: -150,
      width: "100%",
      height: "100%",
      zIndex: 999,
    },

    sidebarOverlayTablet: {
    left: -440,  // Increased offset for wider tablet screens
    paddingHorizontal:-50,
  },

    centerButtonContainer: {
      alignItems: "center",
      marginVertical: isTablet ? 25 : 15,
    },

    gradientButton: {
      paddingVertical: isTablet ? 18 : 12,
      paddingHorizontal: isTablet ? 55 : 30,
      borderRadius: 30,
    },

    gradientButtonText: {
      color: "#fff",
      fontSize: isTablet ? 22 : 16,
      fontWeight: "bold",
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
      backgroundColor: "#fff",
      marginHorizontal: 15,
      marginVertical: 8,
      borderRadius: 12,
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
      fontSize: isTablet ? 15 : 11,
      color: "#93210A",
      fontWeight: "bold",
    },

    newsTitle: {
      fontSize: isTablet ? 18 : 11,
      fontWeight: "bold",
      color: "#000",
      marginTop: 4,
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
