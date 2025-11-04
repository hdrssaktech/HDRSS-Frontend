import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import * as Font from "expo-font";

export default function Header({ toggleSidebar }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [fontLoaded, setFontLoaded] = useState(false);

  // ✅ Load the Impact font (lowercase file name)
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        Impact: require("../../../assets/fonts/impact.ttf"),
      });
      setFontLoaded(true);
    })();
  }, []);

  // ✅ Start rotation animation
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

  // ✅ Loading fallback
  if (!fontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#800000" }}>
        <Text style={{ color: "white" }}>Loading Impact font...</Text>
      </View>
    );
  }

  // ✅ Main header UI
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleSidebar}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
  <Text style={[styles.tamilText, { fontFamily: "Impact" }]}>இந்து தர்ம ரக்ஷ சேனா</Text>
  <Text style={[styles.hinduText, { fontFamily: "Impact" }]}>हिन्दू धर्म रक्षा सेना</Text>
  <Text style={[styles.englishText, { fontFamily: "Impact" }]}>HINDU DHARMA RAKSHA SENA</Text>
</View>


      <View style={styles.orangeContainer}>
        <View style={styles.logoBox} />
        <View style={styles.sunWrapper}>
          <Animated.Image
            source={require("../../../assets/Header/sunoutline.png")}
            style={[styles.sunRays, { transform: [{ rotate: spin }] }]}
          />
          <Text style={styles.regNo}>REGD.NO: 152/2021</Text>
          <Image
            source={require("../../../assets/Header/sunlogo.png")}
            style={styles.sunCenter}
          />
          <View style={styles.whiteLine} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#800000",
    paddingVertical: 30,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 45,
  },
  menuIcon: {
    fontSize: 20,
    color: "white",
    left: 9,
    top: -30                                                                                                                                                              ,
  },
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

hinduText: {
  color: "white",
  fontSize: 17,
  fontWeight: "900",
  fontFamily: "Impact",
  letterSpacing: 5,
  textAlign: "center",
  marginTop: 4,
   left:9,
},

englishText: {
  color: "white",
  fontSize: 17,
  fontWeight: "1200",
  fontFamily: "Impact",
  letterSpacing: -0,
  textAlign: "center",
  marginTop: 2,
 
  left:9,
},
  orangeContainer: {
    position: "relative",
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBox: {
    width: 100,
    height: 200,
    backgroundColor: "#E65100",
    right: -15,
    marginRight: 6,
    paddingLeft: 5,
  },
  regNo: {
    position: "absolute",
    top: 10,
    right: 6,
    fontSize: 9,
    fontWeight: "bold",
    color: "#000",
  },
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
  sunCenter: {
    position: "absolute",
    width: 200,
    height: 67,
    resizeMode: "contain",
  },
  whiteLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: -1,
    right: -3,
  },
});