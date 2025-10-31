import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Recovery({ navigation }) {
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {/* Card */}
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
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.navigate("Login")
          // Add your reset password logic here
    
        }>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        <Text style={styles.bottomText}>Don’t have an Account </Text>
        <TouchableOpacity
          style={styles.LogInButton}
          onPress={() => navigation.navigate('SigninPage')} // Make sure this matches your navigator's screen name
        >
          <Text style={styles.LoginText}>SIGN IN</Text>
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

