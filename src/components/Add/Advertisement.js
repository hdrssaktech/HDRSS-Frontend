import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { fetchHomeAds } from "../../Controller/AdvertisementController/AdvertisementController";
import { useNavigation } from "@react-navigation/native";

export default function AutoScrollAds() {
  const scrollRef = useRef(null);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const isTablet = width >= 600; // ✅ tablet detection

  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch ads
  useEffect(() => {
    const getAds = async () => {
      const imageList = await fetchHomeAds();
      setAds(imageList);
      setLoading(false);
    };
    getAds();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % ads.length;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, ads, width]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#93210A" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.adContainer,
        isTablet && styles.adContainerTablet,
      ]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {ads.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={[
              styles.adImage,
              isTablet && styles.adImageTablet,
              { width: width },
            ]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      {/* Button Container with separate mobile/tablet styles */}
      <View style={isTablet ? styles.buttonContainerTablet : styles.buttonContainer}>
        {/* University Details Button */}
        <TouchableOpacity
          style={isTablet ? styles.buttonTablet : styles.button}
          onPress={() => navigation.navigate("PDFViewer")}
          activeOpacity={0.8}
        >
          <Text style={isTablet ? styles.buttonTextTablet : styles.buttonText}>
            University Details
          </Text>
        </TouchableOpacity>
        
        {/* Apply Now Button */}
        <TouchableOpacity
          style={isTablet ? [styles.buttonTablet, styles.secondButtonTablet] : [styles.button, styles.secondButton]}
          onPress={() => navigation.navigate("Caucus")}
          activeOpacity={0.8}
        >
          <Text style={isTablet ? styles.buttonTextTablet : styles.buttonText}>
            Apply Now!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* 📱 MOBILE STYLES */
  adContainer: {
    height: 340,
    marginVertical: 5,
  },
  
  adImage: {
    height: 280,
    width: '100%',
  },
  
  loaderContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Mobile Button Container */
    buttonContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
  paddingHorizontal: 10,
},

button: {
  backgroundColor: "#a72828",
  paddingVertical: 12,
  paddingHorizontal: 25,
  borderRadius: 10,
  // flex: 1,
  marginHorizontal: 5,
  alignItems: "center",
},

  secondButton: {
    backgroundColor: "#a72828",
  },

  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  /* 📲 TABLET STYLES */
  adContainerTablet: {
    height: 580,
    marginVertical: 20,
  },
  
  adImageTablet: {
    height: 480,
    width: '100%',
    borderRadius: 8,
  },

  /* Tablet Button Container */
  buttonContainerTablet: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 30,
    gap: 20,
  },

  /* Tablet Buttons */
  buttonTablet: {
    backgroundColor: "#a72828",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  secondButtonTablet: {
    backgroundColor: "#a72828",
  },

  buttonTextTablet: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});