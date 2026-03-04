import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { forgotPasswordAPI } from '../../api/api';
import CustomAlert from '../../components/Alert/CustomAlert'; // Import your custom alert

export default function Recovery({ navigation }) {
  const [resetCode, setResetCode] = useState(''); // phoneNumber
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleResetPassword = async () => {
    // Validation
    if (!resetCode || !newPassword || !confirmPassword) {
      setAlertType("warning");
      setAlertTitle("Missing Fields");
      setAlertMessage("All fields are required");
      setAlertVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertType("warning");
      setAlertTitle("Password Mismatch");
      setAlertMessage("New password and confirm password do not match");
      setAlertVisible(true);
      return;
    }

    if (newPassword.length < 6) {
      setAlertType("warning");
      setAlertTitle("Weak Password");
      setAlertMessage("Password must be at least 6 characters long");
      setAlertVisible(true);
      return;
    }

    try {
      setLoading(true);

      await forgotPasswordAPI({
        phoneNumber: resetCode,
        password: newPassword,
        confirmPassword,
      });

      setAlertType("success");
      setAlertTitle("Success! 🎉");
      setAlertMessage("Password reset successful. You can now login with your new password.");
      setAlertVisible(true);
      
    } catch (error) {
      setAlertType("error");
      setAlertTitle("Reset Failed");
      setAlertMessage(error.message || "Something went wrong. Please try again.");
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <View style={styles.card}>
        {/* Mobile Number Input */}
        <View style={styles.inputRow}>
          <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={resetCode}
            onChangeText={setResetCode}
            keyboardType="numeric"
            maxLength={10}
            editable={!loading}
          />
        </View>

        {/* New Password Input */}
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />

          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry={!showPassword}
            value={newPassword}
            editable={!loading}
            keyboardType="number-pad"
            maxLength={8}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setNewPassword(onlyNumbers);
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

        {/* Confirm Password Input */}
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            editable={!loading}
            keyboardType="number-pad"
            maxLength={8}
            onChangeText={(text) => {
              const onlyNumbers = text.replace(/[^0-9]/g, '');
              setConfirmPassword(onlyNumbers);
            }}
          />

          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Submit Button with Loading State */}
        <TouchableOpacity
          style={[styles.arrowButton, loading && styles.disabledButton]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Card */}
      <View style={styles.bottomCard}>
        <Text style={styles.bottomText}>Don't have an Account?</Text>
        <TouchableOpacity
          style={styles.LogInButton}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.LoginText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Alert Component */}
      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        autoClose={alertType === "success"}
        onConfirm={() => {
          setAlertVisible(false);
          if (alertType === "success") {
            navigation.replace("Login");
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a32311', // Your HDRSS red
    alignItems: 'center',
    paddingTop: 150,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  arrowButton: {
    backgroundColor: '#a32311',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
    shadowColor: '#a32311',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#c07a6f',
    shadowOpacity: 0.1,
  },
  bottomCard: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 15,
    alignItems: 'center',
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomText: {
    color: '#333',
    fontSize: 14,
    marginBottom: 15,
  },
  LogInButton: {
    backgroundColor: '#a32311',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#a32311',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  LoginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});