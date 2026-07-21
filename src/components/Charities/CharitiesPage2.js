import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";
import { Alert } from "react-native";

export default function CharitiesPage2() {
  const navigation = useNavigation();
  const { charity } = useRoute().params;
  const { width } = useWindowDimensions();
  const [show, Setshow] = useState(false);
  const [amount, setAmount] = useState("");

  const isTablet = width >= 600;

  /* ================= GPAY PAYMENT ================= */
  const GPAY_NUMBER = "9677717474"; // Corrected number

  const openGPay = async () => {
    if (!amount || Number(amount) <= 0) {
      Alert.alert("Enter Amount", "Please enter a valid donation amount");
      return;
    }

    const upiUrl = `upi://pay?pa=${GPAY_NUMBER}@okicici&pn=${encodeURIComponent(
      "HDRSS Charity"
    )}&am=${amount}&cu=INR`;

    try {
      const supported = await Linking.canOpenURL(upiUrl);
      if (supported) {
        await Linking.openURL(upiUrl);
      } else {
        Alert.alert(
          "GPay Not Found",
          "Please make sure Google Pay is installed on your device"
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "GPay Not Found",
        "Please make sure Google Pay is installed on your device"
      );
    }
  };

  /* ================= YOUTUBE ================= */
  const getYoutubeId = (url) => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={isTablet ? styles.backButtonTablet : styles.backButtonMobile}
        >
          <Ionicons
            name="chevron-back"
            size={isTablet ? 26 : 22}
            color="#FBEEDB"
          />
        </TouchableOpacity>

        <Text
          style={isTablet ? styles.headerTextTablet : styles.headerTextMobile}
          numberOfLines={1}
        >
          {charity?.name}
        </Text>

        {/* spacer to keep title visually centered against back icon */}
        <View style={{ width: isTablet ? 44 : 36 }} />
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner - image shown fully, no overlay */}
        <View style={styles.bannerFrame}>
          <Image
            source={{ uri: charity?.bannerImage }}
            style={isTablet ? styles.bannerTablet : styles.bannerMobile}
            resizeMode="cover"
          />
        </View>

        {/* Wrapper */}
        <View style={isTablet ? styles.wrapperTablet : styles.wrapperMobile}>
          {/* Heading */}
          <Text
            style={isTablet ? styles.headingTablet : styles.headingMobile}
          >
            {charity?.heading}
          </Text>

          {/* Description card */}
          <View style={styles.descriptionCard}>
            <Text
              style={
                isTablet ? styles.descriptionTablet : styles.descriptionMobile
              }
              numberOfLines={show ? undefined : 7}
            >
              {charity?.description}
            </Text>

            <TouchableOpacity
              onPress={() => Setshow(!show)}
              style={styles.readMoreButton}
            >
              <Text style={styles.readMoreText}>
                {show ? "Read Less" : "Read More"}
              </Text>
              <Ionicons
                name={show ? "chevron-up" : "chevron-down"}
                size={16}
                color="#93210A"
              />
            </TouchableOpacity>
          </View>

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
                  <View
                    key={i}
                    style={
                      isTablet
                        ? styles.galleryFrameTablet
                        : styles.galleryFrameMobile
                    }
                  >
                    <Image
                      source={{ uri: img }}
                      style={
                        isTablet
                          ? styles.galleryImageTablet
                          : styles.galleryImageMobile
                      }
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>

        {/* ================= VIDEOS ================= */}
        {charity?.videos && charity.videos.length > 0 && (
          <View style={isTablet ? styles.wrapperTablet : styles.wrapperMobile}>
            <Text
              style={
                isTablet ? styles.sectionTitleTablet : styles.sectionTitleMobile
              }
            >
              Videos
            </Text>

            <View style={styles.videoContainer}>
              {charity.videos.map((url, index) => {
                const ytId = getYoutubeId(url);

                if (ytId) {
                  return (
                    <View key={index} style={styles.videoCard}>
                      <YoutubePlayer
                        height={isTablet ? 350 : 210}
                        width={
                          width -
                          (isTablet ? 80 + 40 : 30 + 30)
                        }
                        play={false}
                        videoId={ytId}
                        webViewStyle={{ opacity: 0.99 }}
                      />
                    </View>
                  );
                } else if (url) {
                  // Handle local videos or other video URLs
                  return (
                    <View key={index} style={styles.videoCard}>
                      <Video
                        source={{ uri: url }}
                        useNativeControls
                        resizeMode="contain"
                        style={[
                          isTablet ? styles.videoTablet : styles.videoMobile,
                          {
                            width:
                              width - (isTablet ? 80 + 40 : 30 + 30),
                          },
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
          <Text
            style={
              isTablet ? styles.sectionTitleTablet : styles.sectionTitleMobile
            }
          >
            Donate
          </Text>

          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Enter Amount</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.rupeeSymbol}>₹</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor="#a89a86"
                keyboardType="numeric"
                style={styles.amountInput}
              />
            </View>
          </View>

          <TouchableOpacity
            style={isTablet ? styles.payButtonTablet : styles.payButtonMobile}
            onPress={openGPay}
            activeOpacity={0.85}
          >
            <Ionicons
              name="heart"
              size={isTablet ? 22 : 18}
              color="#FBEEDB"
              style={{ marginRight: 8 }}
            />
            <Text
              style={
                isTablet
                  ? styles.payButtonTextTablet
                  : styles.payButtonTextMobile
              }
            >
              Donate via GPay
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
    backgroundColor: "#FBEEDB",
  },

  scrollContent: {
    paddingBottom: 30,
  },

  /* ================= HEADER ================= */

  headerMobile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#93210A",
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerTablet: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#93210A",
    paddingTop: 55,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  backButtonMobile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(251, 238, 219, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonTablet: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(251, 238, 219, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextMobile: {
    color: "#FBEEDB",
    fontSize: 19,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    flexShrink: 1,
  },

  headerTextTablet: {
    color: "#FBEEDB",
    fontSize: 26,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    flexShrink: 1,
  },

  /* ================= BANNER ================= */

  bannerFrame: {
    backgroundColor: "#FFFDF6",
  },

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

  /* ================= HEADING ================= */

  headingMobile: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#301913",
    marginBottom: 14,
  },

  headingTablet: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#301913",
    marginBottom: 18,
  },

  /* ================= DESCRIPTION CARD ================= */

  descriptionCard: {
    backgroundColor: "#FFFDF6",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ede8d5",
  },

  descriptionMobile: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4a3a34",
    textAlign: "justify",
  },

  descriptionTablet: {
    fontSize: 19,
    lineHeight: 30,
    color: "#4a3a34",
    textAlign: "justify",
  },

  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
  },

  readMoreText: {
    color: "#93210A",
    fontSize: 15,
    fontWeight: "600",
    marginRight: 4,
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
    paddingBottom: 4,
  },

  galleryFrameMobile: {
    width: 128,
    height: 128,
    borderRadius: 12,
    marginRight: 12,
    padding: 3,
    borderWidth: 2,
    borderColor: "#D4AF37",
    backgroundColor: "#FFFDF6",
  },

  galleryFrameTablet: {
    width: 198,
    height: 198,
    borderRadius: 16,
    marginRight: 18,
    padding: 4,
    borderWidth: 3,
    borderColor: "#D4AF37",
    backgroundColor: "#FFFDF6",
  },

  galleryImageMobile: {
    width: "100%",
    height: "100%",
    borderRadius: 9,
  },

  galleryImageTablet: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  /* ================= VIDEO SECTION ================= */

  videoContainer: {
    marginTop: 4,
  },

  videoCard: {
    marginBottom: 18,
    alignSelf: "center",
    backgroundColor: "#000",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#D4AF37",
  },

  videoMobile: {
    height: 210,
    backgroundColor: "#000",
  },

  videoTablet: {
    height: 350,
    backgroundColor: "#000",
  },

  /* ================= AMOUNT INPUT ================= */

  amountCard: {
    backgroundColor: "#FFFDF6",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#ede8d5",
  },

  amountLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#301913",
    marginBottom: 8,
  },

  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FBEEDB",
  },

  rupeeSymbol: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#93210A",
    marginRight: 8,
  },

  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#301913",
    paddingVertical: 12,
  },

  /* ================= PAY BUTTON ================= */

  payButtonMobile: {
    flexDirection: "row",
    backgroundColor: "#93210A",
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#D4AF37",
    elevation: 3,
  },

  payButtonTablet: {
    flexDirection: "row",
    backgroundColor: "#93210A",
    paddingVertical: 20,
    borderRadius: 36,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
    width: 340,
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "#D4AF37",
    elevation: 5,
  },

  payButtonTextMobile: {
    color: "#FBEEDB",
    fontSize: 16,
    fontWeight: "bold",
  },

  payButtonTextTablet: {
    color: "#FBEEDB",
    fontSize: 19,
    fontWeight: "bold",
  },
});