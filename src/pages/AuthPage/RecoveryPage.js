import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {forgotPasswordAPI} from '../../api/api'

export default function Recovery({ navigation }) {
  const [resetCode, setResetCode] = useState(''); // phoneNumber
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


 const handleResetPassword = async () => {
  if (!resetCode || !newPassword || !confirmPassword) {
    Alert.alert("Error", "All fields are required");
    return;
  }

  if (newPassword !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    await forgotPasswordAPI({
      phoneNumber: resetCode,
      password: newPassword,
      confirmPassword,
    });

    Alert.alert("Success", "Password reset successful", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Login"),
      },
    ]);
  } catch (error) {
    Alert.alert("Error", error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <View style={styles.card}>
        <View style={styles.inputRow}>
          <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={resetCode}
            onChangeText={setResetCode}
            keyboardType="numeric"
          />
        </View>

         <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />

          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry={!showPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
      </View>

         <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
      </View>

        <TouchableOpacity
          style={styles.arrowButton}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomCard}>
        <Text style={styles.bottomText}>Don’t have an Account</Text>
        <TouchableOpacity
          style={styles.LogInButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.LoginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a32311',
    alignItems: 'center',
    paddingTop: 150,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  arrowButton: {
    backgroundColor: '#a32311',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  bottomCard: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 15,
    alignItems: 'center',
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  bottomText: {
    color: '#000',
    fontSize: 14,
    marginBottom: 20,
  },
  LogInButton: {
    backgroundColor: '#a32311',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  LoginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

