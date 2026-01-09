import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";

export default function CharitiesPage2() {
  const navigation = useNavigation();
  const { charity } = useRoute().params;
  const { width } = useWindowDimensions();

  const isTablet = width >= 600;

  /* ================= PAYMENT ================= */
  const openGPay = () => {
    const url = `upi://pay?pa=9876543210@upi&pn=Manager&am=50&cu=INR`;
    Linking.openURL(url).catch(() =>
      alert("Please install a UPI app")
    );
  };

  /* ================= YOUTUBE ================= */
  const getYoutubeId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={isTablet ? styles.headerTablet : styles.headerMobile}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={isTablet ? 32 : 28}
            color="#fff"
          />
        </TouchableOpacity>

        <Text
          style={isTablet ? styles.headerTextTablet : styles.headerTextMobile}
          numberOfLines={1}
        >
          {charity?.name}
        </Text>
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <Image
          source={{ uri: charity?.bannerImage }}
          style={isTablet ? styles.bannerTablet : styles.bannerMobile}
          resizeMode="cover"
        />

        {/* Wrapper */}
        <View style={isTablet ? styles.wrapperTablet : styles.wrapperMobile}>
          {/* Heading */}
          <Text style={isTablet ? styles.headingTablet : styles.headingMobile}>
            {charity?.heading}
          </Text>

          {/* Description */}
          <Text
            style={
              isTablet
                ? styles.descriptionTablet
                : styles.descriptionMobile
            }
          >
            {charity?.description}
          </Text>

          {/* Gallery */}
          {charity?.galleryImages?.length > 0 && (
            <>
              <Text
                style={
                  isTablet
                    ? styles.sectionTitleTablet
                    : styles.sectionTitleMobile
                }
              >
                Gallery
              </Text>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryScroll}
              >
                {charity.galleryImages.map((img, i) => (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={
                      isTablet
                        ? styles.galleryImageTablet
                        : styles.galleryImageMobile
                    }
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>

        {/* ================= VIDEOS ================= */}
        {charity?.videos && charity.videos.length > 0 && (
          <View style={styles.videoSection}>
            <Text
              style={[
                isTablet
                  ? styles.sectionTitleTablet
                  : styles.sectionTitleMobile,
                styles.videoSectionTitle
              ]}
            >
              Videos
            </Text>

            <View style={styles.videoContainer}>
              {charity.videos.map((url, index) => {
                const ytId = getYoutubeId(url);
                console.log("Video URL:", url, "YouTube ID:", ytId);
                
                if (ytId) {
                  return (
                    <View key={index} style={styles.youtubeWrapper}>
                      <YoutubePlayer
                        height={isTablet ? 350 : 220}
                        width={width - (isTablet ? 80 : 30)}
                        play={false}
                        videoId={ytId}
                        webViewStyle={{ opacity: 0.99 }}
                      />
                    </View>
                  );
                } else if (url) {
                  // Handle local videos or other video URLs
                  return (
                    <View key={index} style={styles.videoWrapper}>
                      <Video
                        source={{ uri: url }}
                        useNativeControls
                        resizeMode="contain"
                        style={[
                          isTablet ? styles.videoTablet : styles.videoMobile,
                          { width: width - (isTablet ? 80 : 30) }
                        ]}
                        shouldPlay={false}
                      />
                    </View>
                  );
                }
                return null;
              })}
            </View>
          </View>
        )}

        {/* ================= DONATE ================= */}
        <View style={isTablet ? styles.wrapperTablet : styles.wrapperMobile}>
          <TouchableOpacity
            style={
              isTablet ? styles.payButtonTablet : styles.payButtonMobile
            }
            onPress={openGPay}
            activeOpacity={0.8}
          >
            <Text
              style={
                isTablet
                  ? styles.payButtonTextTablet
                  : styles.payButtonTextMobile
              }
            >
              Donate ₹50 via GPay
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ======================================================
   STYLES
====================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContent: {
    paddingBottom: 30,
  },

  /* ================= HEADER ================= */

  headerMobile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },

  headerTablet: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 25,
  },

  headerTextMobile: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    flexShrink: 1,
  },

  headerTextTablet: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 16,
    flexShrink: 1,
  },

  /* ================= BANNER ================= */

  bannerMobile: {
    width: "100%",
    height: 200,
  },

  bannerTablet: {
    width: "100%",
    height: 340,
  },

  /* ================= WRAPPER ================= */

  wrapperMobile: {
    padding: 15,
  },

  wrapperTablet: {
    width: "100%",
    paddingHorizontal: 40,
    paddingVertical: 30,
  },

  /* ================= TEXT ================= */

  headingMobile: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 10,
  },

  headingTablet: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 18,
  },

  descriptionMobile: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
    textAlign: "justify",
  },

  descriptionTablet: {
    fontSize: 19,
    lineHeight: 30,
    color: "#333",
    textAlign: "justify",
  },

  sectionTitleMobile: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 15,
  },

  sectionTitleTablet: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#93210A",
    marginVertical: 22,
  },

  /* ================= GALLERY ================= */

  galleryScroll: {
    paddingRight: 15,
  },

  galleryImageMobile: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },

  galleryImageTablet: {
    width: 190,
    height: 190,
    borderRadius: 14,
    marginRight: 16,
  },

  /* ================= VIDEO SECTION ================= */

  videoSection: {
    marginTop: 10,
  },

  videoSectionTitle: {
    paddingHorizontal: 15,
  },

  videoContainer: {
    marginTop: 10,
  },

  youtubeWrapper: {
    marginBottom: 20,
    alignSelf: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
  },

  videoWrapper: {
    marginBottom: 20,
    alignSelf: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
  },

  videoMobile: {
    height: 220,
    backgroundColor: "#000",
  },

  videoTablet: {
    height: 350,
    backgroundColor: "#000",
  },

  /* ================= PAY BUTTON ================= */

  payButtonMobile: {
    backgroundColor: "#00BFA5",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 25,
    alignItems: "center",
    elevation: 3,
  },

  payButtonTablet: {
    backgroundColor: "#00BFA5",
    paddingVertical: 20,
    borderRadius: 12,
    marginTop: 45,
    alignItems: "center",
    width: 340,
    alignSelf: "center",
    elevation: 5,
  },

  payButtonTextMobile: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  payButtonTextTablet: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
  },
});