import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const MatrimonyBtn = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1516589091380-5c6a2e8b5c3a?w=800' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          
          {/* Couple Photo Area - Decorative text instead */}
          <View style={styles.coupleContainer}>
            <Text style={styles.coupleEmoji}>💑</Text>
            <Text style={styles.coupleText}>Find Your Soulmate</Text>
          </View>

          {/* Two Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('CreateProfile')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonIcon}>📝</Text>
              <Text style={styles.buttonText}>Create Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondButton]}
              onPress={() => navigation.navigate('MatrimoneyProfiles')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonIcon}>❤️</Text>
              <Text style={styles.buttonText}>View Profiles</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
};

export default MatrimonyBtn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  coupleContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  coupleEmoji: {
    fontSize: 80,
    marginBottom: 15,
  },
  coupleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#93210A',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  secondButton: {
    backgroundColor: '#D32F2F',
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});