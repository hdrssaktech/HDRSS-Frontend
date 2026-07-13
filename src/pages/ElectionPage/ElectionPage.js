import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function HomeFeatureSection() {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  // 🟢 Animate the election button when mounted
  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  const navigateToElection = () => {
    navigation.navigate("ElectionVotePage1");
  };

  // 🔵 Explore More Features
  const features = [
    { id: 1, label: "History", image: require("../../../assets/Left Swap/History.jpeg") },
    { id: 2, label: "Astrology", image: require("../../../assets/Left Swap/astrology.jpg") },
    { id: 3, label: "Stories", image: require("../../../assets/Left Swap/Story.jpg") },
    { id: 4, label: "Pooja", image: require("../../../assets/Left Swap/poojai.jpg") },
    { id: 5, label: "Tourism", image: require("../../../assets/Left Swap/tourism.jpg") },
    { id: 6, label: "Vasthu", image: require("../../../assets/Left Swap/vasthu.jpeg") },
  ];

  return (
    <View style={styles.container}>
      {/* 🗳 Election Button */}
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
                  style={[
                    styles.circleCardWrapper,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <LinearGradient
                    colors={["#FFF8E7", "#FFD89B", "#FFB75E"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.circleGradient}
                  >
                    <Image
                      source={item.image}
                      style={styles.circleImageHorizontal}
                    />
                  </LinearGradient>
                  <Text style={styles.label}>{item.label}</Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 20,
  },

  // 🗳 Election Button
  centerButtonContainer: {
    alignItems: "center",
    marginBottom: 20,
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

  // 🔵 Modern Circle Menu
  circleMenuContainer: {
    marginTop: 20,
    marginBottom: 50,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 10,
    marginLeft: 15,
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

