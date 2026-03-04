import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { handleLogin as handleLoginAPI } from "../../Controller/ComplaintController/ComplaintController";
import CustomAlert from "../../components/Alert/CustomAlert"; // Your custom alert

export default function Loginpage() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

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

  const onLoginPress = async () => {
    if (!phoneNumber || !password) {
      setAlertType("warning");
      setAlertTitle("Missing Fields");
      setAlertMessage("Please enter mobile number and password");
      setAlertVisible(true);
      return;
    }

    try {
      const success = await handleLoginAPI(phoneNumber, password);

      if (success) {
        login(phoneNumber, password);

        setAlertType("success");
        setAlertTitle("Login Successful 🎉");
        setAlertMessage("Welcome to HDRSS!");
        setAlertVisible(true);
        // Navigation will happen after alert closes (see onConfirm below)
      } else {
        setAlertType("error");
        setAlertTitle("Login Failed");
        setAlertMessage("Please try again.");
        setAlertVisible(true);
      }
    } catch (err) {
      console.log("Login Error:", err);
      setAlertType("error");
      setAlertTitle("Error");
      setAlertMessage("Login failed, please check your connection");
      setAlertVisible(true);
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
            maxLength={10}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Password Input */}
      <View style={styles.inputRow}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#888"
          style={styles.icon}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter 6 digit PIN"
          secureTextEntry={!showPassword}
          value={password}
          keyboardType="number-pad"
          maxLength={8}
          onChangeText={(text) => {
            const onlyNumbers = text.replace(/[^0-9]/g, "");
            setPassword(onlyNumbers);
          }}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
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
          <Text style={styles.signInText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Custom Alert Component */}
      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        autoClose={alertType === "success"} 
        onConfirm={() => {
          setAlertVisible(false);
          if (alertType === "success") {
            navigation.replace("Home"); 
          }
        }}
      />
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
    paddingTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 30,
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