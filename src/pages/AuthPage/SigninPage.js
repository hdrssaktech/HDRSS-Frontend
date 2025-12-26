import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../../context/AuthContext";
import { signupApi } from "../../api/api";

export default function SignupPage({ navigation }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  // 🌞 Animation setup for rotating sun
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

  // ✅ Format date as yyyy-mm-dd
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSignup = async () => {
    if (!name || !dob || !pincode || !phoneNumber || !password) {
      alert("Please fill all fields!");
      return;
    }

    const userData = {
      name,
      phoneNumber,
      password,
      pincode,
      dob: formatDate(dob),
    };

    console.log("Signup Data:", userData);

    try {
      const res = await signupApi(userData);
      console.log("Signup success:", res);

      const loginSuccess = await login(phoneNumber, password);
      if (loginSuccess) {
        alert("Signup and login successful!");
        navigation.navigate("Home");
      } else {
        alert("Signup successful, but login failed.");
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message || "Something went wrong");
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDob(selectedDate);
  };

  return (
    <View style={styles.container}>
      {/* 🌞 Rotating Sun Logo above SIGN UP */}
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

      {/* Title */}
      <Text style={styles.signInTitle}>SIGN UP</Text>

      <View style={styles.card}>
        {/* Name */}
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* DOB Picker */}
        <TouchableOpacity style={styles.inputRow} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
          <Text style={[styles.input, { color: dob ? "#000" : "#888" }]}>
            {dob ? formatDate(dob) : "Select Date of Birth"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dob || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={onDateChange}
          />
        )}

        {/* Pincode */}
        <View style={styles.inputRow}>
          <Ionicons name="location-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputRow}>
          <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        {/* Password */}
       <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Signup Button */}
        <TouchableOpacity style={styles.arrowButton} onPress={handleSignup}>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        <Text style={styles.bottomText}>Already have an account?</Text>
        <TouchableOpacity
          style={styles.LogInButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.LoginText}>Log In</Text>
          
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
    paddingTop: 100,
  },
  // 🌞 Rotating Sun Logo Styles
  sunWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -70,
  },
  sunRays: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  sunCenter: {
    position: "absolute",
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  signInTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 22,
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 15,
    padding: 20,
    marginBottom: 19,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
    // paddingVertical: 5,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 40 },
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
    flexDirection: "column",
    justifyContent: "center",
  },
  bottomText: {
    color: "#000",
    fontSize: 14,
    marginBottom: 20,
  },
  LogInButton: {
    backgroundColor: "#a32311",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  LoginText: {
    color: "#fff",
    fontWeight: "bold",
  },
});