import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  PanResponder,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import Advertisement from "../../components/Add/Advertisement";
import InterviewVideos from "../../components/Add/InterviewVideos";
import DistrictList from "../DistrictPage/DistrictPage1";
import EventsPage from "../../components/Events/EventPage1";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { INTERVIEW_DATA } from "../InterviewPage/Interviewdata";
import { fetchNews } from "../../Controller/NewsController/NewsController";

const { width } = Dimensions.get("window");

export default function HomePage() {
  const navigation = useNavigation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📰 Fetch news data
  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchNews();
      setNews(data);
      setLoading(false);
    };
    loadNews();
  }, []);

  // 🟢 Animation for Election button
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

  // 👇 Swipe Navigation
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          navigation.navigate("ElectionPage");
        } else if (gestureState.dx < -100) {
          navigation.navigate("HomePage");
        }
      },
    })
  ).current;

  const navigateToElection = () => {
    navigation.navigate("ElectionVotePage1");
  };

  // 🟠 Circle menu items
  const features = [
    { id: 1, label: "History", image: require("../../../assets/Left Swap/History.jpeg") },
    { id: 2, label: "Astrology", image: require("../../../assets/Left Swap/Astrology.webp") },
    { id: 3, label: "Stories", image: require("../../../assets/Left Swap/Story.jpg") },
    { id: 4, label: "Pooja", image: require("../../../assets/Left Swap/poojai.jpg") },
    { id: 5, label: "Tourism", image: require("../../../assets/Left Swap/tourism.jpg") },
    { id: 6, label: "Vasthu", image: require("../../../assets/Left Swap/vasthu.jpeg") },
  ];

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Header toggleSidebar={() => setShowSidebar(!showSidebar)} />

      {showSidebar && (
        <View style={styles.sidebarContainer}>
          <Sidebar closeSidebar={() => setShowSidebar(false)} />
        </View>
      )}

      <FlatList
        ListHeaderComponent={
          <>
            {/* 🗳 Animated Election Button */}
            <Animated.View
              style={[
                styles.centerButtonContainer,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <TouchableOpacity onPress={navigateToElection} activeOpacity={0.8}>
                <LinearGradient
                  colors={["#FFD700", "#FF8C00", "#93210A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.gradientButtonText}>🗳 2026 Election</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Advertisement */}
            <View style={styles.advertisementWrapper}>
              <Advertisement />
            </View>

            <DistrictList />
          </>
        }
        ListFooterComponent={() => (
          <>
            {/* 🎥 Interview Videos */}
            <FlatList
              data={INTERVIEW_DATA.slice(0, 1)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <InterviewVideos video={item} />}
            />

            <TouchableOpacity onPress={() => navigation.navigate("InterviewPage1")}>
              <Text style={styles.more}>See All Videos →</Text>
            </TouchableOpacity>

            {/* 📰 News Section */}
            <Text style={styles.heading}>Latest News</Text>

            <FlatList
              data={news.slice(0, 2)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Newspage2", { news: item })}
                  style={styles.newsCard}
                >
                  <Image source={{ uri: item.image }} style={styles.newsImage} />
                  <View style={styles.newsContent}>
                    <Text style={styles.newsCategory}>{item.type}</Text>
                    <Text style={styles.newsTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity onPress={() => navigation.navigate("NewsPage1")}>
              <Text style={styles.more}>See All News →</Text>
            </TouchableOpacity>

            {/* 🗓 Events */}
            <EventsPage />

            {/* 🔵 Modern Circle Menu Section */}
            <View style={styles.circleMenuContainer}>
              <Text style={styles.heading}>Explore More</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {features.map((item) => {
                  const scaleAnim = useRef(new Animated.Value(1)).current;

                  const onPressIn = () => {
                    Animated.spring(scaleAnim, {
                      toValue: 1.1,
                      useNativeDriver: true,
                    }).start();
                  };

                  const onPressOut = () => {
                    Animated.spring(scaleAnim, {
                      toValue: 1,
                      friction: 3,
                      useNativeDriver: true,
                    }).start();
                  };

                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.9}
                      onPressIn={onPressIn}
                      onPressOut={onPressOut}
                      onPress={() => {
                        if (item.label === "History") navigation.navigate("HistoryPage1");
                        if (item.label === "Astrology") navigation.navigate("AstrologyPage1");
                        if (item.label === "Stories") navigation.navigate("StoryPage1");
                        if (item.label === "Pooja") navigation.navigate("PoojaPage1");
                        if (item.label === "Tourism") navigation.navigate("TourismPage1");
                        if (item.label === "Vasthu") navigation.navigate("VaasthuPage");
                      }}
                    >
                      <Animated.View
                        style={[styles.circleCardWrapper, { transform: [{ scale: scaleAnim }] }]}
                      >
                        <LinearGradient
                          colors={["#FFF8E7", "#FFD89B", "#FFB75E"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.circleGradient}
                        >
                          <Image source={item.image} style={styles.circleImageHorizontal} />
                        </LinearGradient>
                        <Text style={styles.label}>{item.label}</Text>
                      </Animated.View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </>
        )}
        contentContainerStyle={{ paddingBottom: 0 }}
      />
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  sidebarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    elevation: 10,
    zIndex: 100,
  },

  // Election Button
  centerButtonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  gradientButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  advertisementWrapper: {
    marginTop: -15,
    marginBottom: 5,
  },

  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 10,
    marginLeft: 15,
  },
  more: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    color: "#93210A",
    marginRight: 15,
    marginTop: 5,
  },
  newsContent: {
    display: "flex",
    justifyContent: "center",
    width: "50%",
  },
  newsCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 16,
  },
  newsImage: { width: 150, height: 120, borderRadius: 6, marginRight: 10 },
  newsCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: "#93210A",
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
    marginBottom: 26,
  },

  // ✨ Modern Circle Menu Styles
  circleMenuContainer: {
    marginTop: 20,
    marginBottom: 50,
    paddingBottom: 10,
  },
  horizontalScroll: {
    paddingHorizontal: 15,
    alignItems: "center",
  },
  circleCardWrapper: {
    alignItems: "center",
    marginHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 100,
    shadowColor: "#ff8800",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    padding: 5,
  },
  circleGradient: {
    borderRadius: 100,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  circleImageHorizontal: {
    width: width / 3.3,
    height: width / 3.3,
    borderRadius: width / 6.6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
    color: "#a34100",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});