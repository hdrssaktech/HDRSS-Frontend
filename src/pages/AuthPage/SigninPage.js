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
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { signupApi } from "../../api/api";
import CustomAlert from "../../components/Alert/CustomAlert";

export default function SignupPage({ navigation }) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // Refs for input navigation
  const dobRef = useRef(null);
  const pincodeRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

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

  // ✅ Format DOB as user types (DD/MM/YYYY)
  const formatDOB = (text) => {
    // Remove non-numeric characters
    let cleaned = text.replace(/[^\d]/g, '');
    
    // Format as DD/MM/YYYY
    if (cleaned.length >= 3 && cleaned.length <= 4) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    } else if (cleaned.length >= 5) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
    
    return cleaned;
  };

  const handleDOBChange = (text) => {
    const formatted = formatDOB(text);
    setDob(formatted);
  };

  // ✅ Validate DOB format
  const validateDOB = (dobString) => {
    const pattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!pattern.test(dobString)) {
      return { valid: false, message: "Please enter DOB in DD/MM/YYYY format" };
    }

    const [_, day, month, year] = dobString.match(pattern);
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Basic validation
    if (dayNum < 1 || dayNum > 31) {
      return { valid: false, message: "Day must be between 01-31" };
    }
    if (monthNum < 1 || monthNum > 12) {
      return { valid: false, message: "Month must be between 01-12" };
    }
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
      return { valid: false, message: "Please enter a valid year" };
    }

    // Create date object to validate
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (
      date.getFullYear() !== yearNum ||
      date.getMonth() + 1 !== monthNum ||
      date.getDate() !== dayNum
    ) {
      return { valid: false, message: "Please enter a valid date" };
    }

    return { valid: true, date };
  };

  // ✅ Calculate age from DOB
  const calculateAge = (dobString) => {
    const [day, month, year] = dobString.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // ✅ Convert to API format (YYYY-MM-DD)
  const convertToAPIFormat = (dobString) => {
    const [day, month, year] = dobString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleSignup = async () => {
    // Basic validation
    if (!name || !dob || !pincode || !phoneNumber || !password) {
      setAlertType("warning");
      setAlertTitle("Missing Fields");
      setAlertMessage("Please fill all fields!");
      setAlertVisible(true);
      return;
    }

    // Name validation
    if (name.length < 2) {
      setAlertType("warning");
      setAlertTitle("Invalid Name");
      setAlertMessage("Please enter a valid name (minimum 2 characters)");
      setAlertVisible(true);
      return;
    }

    // DOB validation
    const dobValidation = validateDOB(dob);
    if (!dobValidation.valid) {
      setAlertType("warning");
      setAlertTitle("Invalid Date of Birth");
      setAlertMessage(dobValidation.message);
      setAlertVisible(true);
      return;
    }

    // Age validation (minimum 18 years)
    const age = calculateAge(dob);
    if (age < 18) {
      setAlertType("warning");
      setAlertTitle("Age Restriction");
      setAlertMessage(`You must be at least 18 years old. Current age: ${age} years`);
      setAlertVisible(true);
      return;
    }

    // Phone number validation
    if (phoneNumber.length !== 10) {
      setAlertType("warning");
      setAlertTitle("Invalid Phone Number");
      setAlertMessage("Phone number must be 10 digits");
      setAlertVisible(true);
      return;
    }

    // Pincode validation
    if (pincode.length !== 6) {
      setAlertType("warning");
      setAlertTitle("Invalid Pincode");
      setAlertMessage("Pincode must be 6 digits");
      setAlertVisible(true);
      return;
    }

    // Password validation
    if (password.length < 6) {
      setAlertType("warning");
      setAlertTitle("Weak Password");
      setAlertMessage("Password must be at least 6 characters long");
      setAlertVisible(true);
      return;
    }

    const userData = {
      name,
      phoneNumber,
      password,
      pincode,
      dob: convertToAPIFormat(dob), 
    };

    try {
      setLoading(true);
      const res = await signupApi(userData);

      const loginSuccess = await login(phoneNumber, password);
      
      if (loginSuccess) {
        setAlertType("success");
        setAlertTitle("Welcome to HDRSS! 🎉");
        setAlertMessage(`Account created successfully for ${name}`);
        setAlertVisible(true);
      } else {
        setAlertType("warning");
        setAlertTitle("Partial Success");
        setAlertMessage("Signup successful, but auto-login failed. Please login manually.");
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      setAlertType("error");
      setAlertTitle("Signup Failed");
      setAlertMessage(error.message || "Something went wrong. Please try again.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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

          {/* Title */}
          <Text style={styles.signInTitle}>CREATE ACCOUNT</Text>

          <View style={styles.card}>
            {/* Name */}
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                editable={!loading}
                returnKeyType="next"
                onSubmitEditing={() => dobRef.current.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* DOB Manual Entry - User Friendly */}
            <View style={styles.inputRow}>
              <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                ref={dobRef}
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={dob}
                onChangeText={handleDOBChange}
                keyboardType="numeric"
                maxLength={10}
                editable={!loading}
                returnKeyType="next"
                onSubmitEditing={() => pincodeRef.current.focus()}
                blurOnSubmit={false}
              />
              <Text style={styles.hintText}>DD/MM/YYYY</Text>
            </View>
            {/* Pincode */}
            <View style={styles.inputRow}>
              <Ionicons name="location-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                ref={pincodeRef}
                style={styles.input}
                placeholder="Pincode (6 digits)"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
                editable={!loading}
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputRow}>
              <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
              <TextInput
                ref={phoneRef}
                style={styles.input}
                placeholder="Phone Number (10 digits)"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="numeric"
                maxLength={10}
                editable={!loading}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* Password */}

          <View style={styles.inputRow}>
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color="#888" 
              style={styles.icon} 
            />

            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Enter 6 digit PIN"
              secureTextEntry={!showPassword}
              value={password}
              editable={!loading}
              returnKeyType="done"
              keyboardType="number-pad"
              maxLength={8}
              onChangeText={(text) => {
                const onlyNumbers = text.replace(/[^0-9]/g, "");
                setPassword(onlyNumbers);
              }}
              onSubmitEditing={handleSignup}
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
            <TouchableOpacity 
              style={[styles.arrowButton, loading && styles.disabledButton]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.loadingText}>...</Text>
              ) : (
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Card */}
          <View style={styles.bottomCard}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <TouchableOpacity
              style={styles.LogInButton}
              onPress={() => navigation.navigate("Login")}
              disabled={loading}
            >
              <Text style={styles.LoginText}>SIGN IN</Text>
            </TouchableOpacity>
          </View>

          {/* Custom Alert */}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#a32311",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
  },
  sunWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop:7,
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
    marginBottom: 20,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  icon: { 
    marginRight: 10,
    width: 25,
  },
  input: { 
    flex: 1, 
    height: 45,
    fontSize: 15,
    color: "#333",
  },
  hintText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 5,
  },
  ageHint: {
    fontSize: 12,
    color: "#666",
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 35,
    fontStyle: "italic",
  },
  arrowButton: {
    backgroundColor: "#a32311",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 10,
    shadowColor: "#a32311",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#c07a6f",
    shadowOpacity: 0.1,
  },
  loadingText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  bottomCard: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 15,
    alignItems: "center",
    padding: 20,
    flexDirection: "column",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomText: {
    color: "#333",
    fontSize: 14,
    marginBottom: 15,
  },
  LogInButton: {
    backgroundColor: "#a32311",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: "#a32311",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  LoginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});