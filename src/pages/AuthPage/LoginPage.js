import React, { useState, useContext, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { handleLogin as handleLoginAPI } from "../../Controller/ComplaintController/ComplaintController"; // ✅ rename imported function

export default function Loginpage() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Rotation Animation (same as Header)
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

  // ✅ renamed local function to avoid overriding imported handleLogin
  const onLoginPress = async () => {
    if (!phoneNumber || !password) {
      alert("Please enter mobile number and password");
      return;
    }

    try {
      // Call the imported login API to actually perform login
      const success = await handleLoginAPI(phoneNumber, password);

      if (success) {
        login(phoneNumber, password); // optional if your AuthContext manages token
      } else {
        alert("Invalid credentials or token missing");
      }
    } catch (err) {
      console.log("Login Error:", err);
      alert("Login failed, please check your details");
    }
  };

  return (
    <View style={styles.container}>
      {/* 🌞 Rotating Sun Logo */}
      <View style={styles.sunWrapper}>
        <Animated.Image
          source={require("../../../assets/Header/sunoutline.png")}
          style={[styles.sunRays, { transform: [{ rotate: spin }] }]}
        />
        <Image
          source={require("../../../assets/Header/sunlogo.png")}
          style={styles.sunCenter}
        />
      </View>

      {/* LOGIN Title */}
      <Text style={styles.loginTitle}>LOGIN</Text>

      <View style={styles.card}>
        {/* Mobile Input */}
        <View style={styles.inputRow}>
          <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          style={styles.forgotRow}
          onPress={() => navigation.navigate("Recovery")}
        >
          <Text style={styles.forgot}>Forget Password ?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.arrowButton} onPress={onLoginPress}>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Signup Link */}
      <View style={styles.bottomCard}>
        <Text style={styles.bottomText}>Don’t have an Account </Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signInText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a32311",
    alignItems: "center",
    paddingTop: 120,
  },
  /* 🌞 Rotating Sun Styles */
  sunWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: -25,
  },
  sunRays: {
    width: 150,
    height: 150,
    resizeMode: "contain",
      marginVertical: -20,
  },
  sunCenter: {
    position: "absolute",
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  loginTitle: {
    color: "#fff",
    paddingTop:20,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 30,
    // marginTop:30px
    // Bottom:4,
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 40 },
  forgotRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  forgot: { color: "#555", fontSize: 15 },
  arrowButton: {
    backgroundColor: "#a32311",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  bottomCard: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 15,
    alignItems: "center",
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomText: { color: "#000", fontSize: 14 },
  signInButton: {
    backgroundColor: "#a32311",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginLeft: 10,
  },
  signInText: { color: "#fff", fontWeight: "bold" },
});