// Header.js
import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";

export default function Header({ toggleSidebar }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <View style={styles.header}>
      {/* Toggle Sidebar */}
      <TouchableOpacity onPress={toggleSidebar}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* rest of your header */}
      <View style={styles.titleContainer}>
        <View style={styles.maroonBox}>
          <Text style={styles.tamilText}> இந்து தர்ம ரக்ஷ சேனா</Text>
          <Text style={styles.hinduText}>हिन्दू  धर्म  रक्षा  सेना</Text>
          <Text style={styles.englishText}>HINDU DHARMA RAKSHA SENA</Text>
        </View>
      </View>

      <View style={styles.orangeContainer}>
        <View style={styles.logoBox} />
        <View style={styles.sunWrapper}>
          <Animated.Image
            source={require("../../../assets/Header/sunoutline.png")}
            style={[styles.sunRays, { transform: [{ rotate: spin }] }]}
          />
          <Text style={styles.regNo}>REGD.NO: 152/2021</Text>
          <Image source={require("../../../assets/Header/sunlogo.png")} style={styles.sunCenter} />
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
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },
  menuIcon: {
    fontSize: 20,
    color: "white",
    left: 9,
    top: -41,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  tamilText: {
    color: "white",
    marginTop: 40,
    fontSize: 15,
    fontWeight: "900",
  },
  hinduText: {
    color: "white",
    marginTop: 15,
    marginLeft: 20,
    fontSize: 17,
    fontWeight: "900",
  },
  englishText: {
    color: "white",
    marginTop: 15,
    marginRight: -20,
    fontSize: 15,
    fontWeight: "900",
    bottom: 2,
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
    height: 220,
    backgroundColor: "#E65100",
    right: -15,
    marginRight: 6,
    paddingLeft: 5,
  },
  regNo: {
    position: "absolute",
    top: 10,
    left: 12,
    fontSize: 9.5,
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
    bottom: -8,
    right: -3,
  },
});
