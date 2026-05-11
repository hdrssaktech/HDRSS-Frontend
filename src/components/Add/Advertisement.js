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
      <View
    >
       
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
              { width },
            ]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
<View style={styles.buttonContainer}>
<TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate("PDFViewer")}
>
  <Text style={styles.buttonText}>
    United America
  </Text>
</TouchableOpacity>
  <TouchableOpacity
    style={[styles.button, styles.secondButton]}
    onPress={() =>  navigation.navigate("Caucus")}
    activeOpacity={0.7}
  >
    <Text style={styles.buttonText}>Apply Now!</Text>
  </TouchableOpacity>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  /* 📱 MOBILE */
   adContainer: {
    height: 340,
    marginVertical:5,
  },
  adImage: {
    height: 280,
  },
  loaderContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  /* 📲 TABLET */
  adContainerTablet: {
    height: 450,
    marginVertical:20,
  },
  adImageTablet: {
    height: 400,
  },

  loaderContainerTablet: {
    height: 300,
  },

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
  fontSize: 16,
  fontWeight: "600",
},
});
