import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const RootPage = () => {
  const navigation = useNavigation();
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

  const logoSize = width > 600 ? 220 : 160; // Tablet responsive

  return (
    <LinearGradient
      colors={["#8B0000", "#a32311", "#c0392b"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Logo Section */}
        <View style={styles.sunWrapper}>
          <Animated.Image
            source={require("../../../assets/Header/sunoutline.png")}
            style={[
              {
                width: logoSize,
                height: logoSize,
                transform: [{ rotate: spin }],
              },
            ]}
            resizeMode="contain"
          />
          <Image
            source={require("../../../assets/Header/sunlogo.png")}
            style={{
              position: "absolute",
              width: logoSize - 30,
              height: logoSize - 30,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome to Kaavi</Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RootPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  sunWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },

  title: {
    fontSize: 30,
    fontFamily: "Impact",
    fontWeight: "800",
    marginBottom: 50,
    color: "#fff",
    letterSpacing: 1,
  },
  
  loginButton: {
    width: "100%",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginBottom: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  signupButton: {
    width: "100%",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#ffffff",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
  },
});

