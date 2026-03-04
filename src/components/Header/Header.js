import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from "react-native";
import * as Font from "expo-font";

export default function Header({ toggleSidebar }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [fontLoaded, setFontLoaded] = useState(false);
  const { width } = useWindowDimensions();

  const isTablet = width >= 600;

  // Load Impact font
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        Impact: require("../../../assets/fonts/impact.ttf"),
      });
      setFontLoaded(true);
    })();
  }, []);

  // Rotation animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!fontLoaded) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "white" }}>Loading Impact font...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      {/* Menu */}
      <TouchableOpacity onPress={toggleSidebar}>
        <Text style={[styles.menuIcon, isTablet && styles.menuIconTablet]}>
          ☰
        </Text>
      </TouchableOpacity>

      {/* Titles */}
      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.tamilText,
            isTablet && styles.tamilTextTablet,
          ]}
        >
         வீர இந்து தர்ம ரக்ஷ சேனா
        </Text>

        <Text
          style={[
            styles.hinduText,
            isTablet && styles.hinduTextTablet,
          ]}
        >
          वीरा हिन्दू धर्म रक्षा सेना
        </Text>

        <Text
          style={[
            styles.englishText,
            isTablet && styles.englishTextTablet,
          ]}
        >
          VEERA HINDU DHARMA RAKSHA SENA
        </Text>
      </View>

      {/* Logo Section */}
      <View
        style={[
          styles.orangeContainer,
          isTablet && styles.orangeContainerTablet,
        ]}
      >
        <View
          style={[
            styles.logoBox,
            isTablet && styles.logoBoxTablet,
          ]}
        />

        <View style={styles.sunWrapper}>
          <Animated.Image
            source={require("../../../assets/Header/sunoutline.png")}
            style={[
              styles.sunRays,
              isTablet && styles.sunRaysTablet,
              { transform: [{ rotate: spin }] },
            ]}
          />

          <Text
            style={[
              styles.regNo,
              isTablet && styles.regNoTablet,
            ]}
          >
            {/* REGD.NO: 152/2021 */}
            காவி
          </Text>

          <Image
            source={require("../../../assets/Header/sunlogo.png")}
            style={[
              styles.sunCenter,
              isTablet && styles.sunCenterTablet,
            ]}
          />

          <View
            style={[
              styles.whiteLine,
              isTablet && styles.whiteLineTablet,
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#800000",
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#800000",
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 45,
  },

  headerTablet: {
    paddingVertical: 35,
    borderBottomLeftRadius: 75,
   
  },

  /* MENU */
  menuIcon: {
    fontSize: 20,
    color: "white",
    left: 9,
    top: -30,
  },

  menuIconTablet: {
    fontSize: 34,
    top: -55,
  },

  /* TITLES */
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },

  tamilText: {
  color: "white",
  fontSize: 16,
  fontWeight: "800",
  fontFamily: "Impact",
  letterSpacing: -1,
  textAlign: "center",
   marginTop: 40,
   left:9,
  },

  tamilTextTablet: {
    fontSize: 25,
    marginTop: 20,
  },

  hinduText: {
   color: "white",
  fontSize: 16,
  fontWeight: "900",
  fontFamily: "Impact",
  letterSpacing: 5,
  textAlign: "center",
  marginTop: 4,
   left:9,
  },

  hinduTextTablet: {
    fontSize: 25,
    letterSpacing: 6,
  },

  englishText: {
  color: "white",
  fontSize: 16,
  fontWeight: "1200",
  fontFamily: "Impact",
  letterSpacing: -0,
  textAlign: "center",
  marginTop: 2,
  left:9,
  },

  englishTextTablet: {
    fontSize: 27,
  },

  /* ORANGE CONTAINER */
  orangeContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  orangeContainerTablet: {
    width: 170,
    height: 170,
  },

  /* LOGO BOX */
  logoBox: {
    width: 100,
    height: 200,
    backgroundColor: "#E65100",
    right: -15,
    marginRight: 6,
    paddingLeft: 5,
  },

  logoBoxTablet: {
    width: 140,
    height: 260,
    right: -20,
  },

  /* REG NUMBER */
  regNo: {
    position: "absolute",
    top: 10,
    right:28,
    fontSize:10,
    fontWeight: "bold",
    color: "#000",
  },
  regNoTablet: {
    fontSize: 18,
    top: -40,
    right: 40,
  },
  /* SUN */
  sunWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 1,
    bottom: -34,
    height: 159,
  },

  sunRays: {
    width: 100,
    height: 150,
    resizeMode: "contain",
  },

  sunRaysTablet: {
    width: 140,
    height: 200,
    bottom:24,
  },

  sunCenter: {
    position: "absolute",
    width: 200,
    height: 67,
    resizeMode: "contain",
  },

  sunCenterTablet: {
    width: 260,
    height: 98,
    bottom:55,
  },

  /* WHITE LINE */
  whiteLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: -1,
    right: -3,
  },

  whiteLineTablet: {
    height: 3,
    bottom: -2,
  },
});















