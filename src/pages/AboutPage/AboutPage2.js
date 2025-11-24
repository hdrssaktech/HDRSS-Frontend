import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function AboutPage2() {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);

  const galleryImages = [
    require("../../../assets/About/back1.jpg"),
    require("../../../assets/About/back1.jpg"),
    require("../../../assets/About/back1.jpg"),
  ];

  // 📞 Call
  const handleCall = () => {
    let phoneNumber = "tel:+919876543210"; // change to your number
    Linking.openURL(phoneNumber).catch(() =>
      Alert.alert("Error", "Unable to make a call")
    );
  };

  // 💬 WhatsApp
  const handleWhatsApp = () => {
    let phoneNumber = "+919876543210"; // include country code
    let message = "Hello, I want to contact you!";
    let url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Make sure WhatsApp is installed")
    );
  };

  // 🗺️ Location
  const handleLocation = () => {
    let url =
      "https://www.google.com/maps/search/?api=1&query=13.0827,80.2707";
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Unable to open Google Maps")
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <ImageBackground
          source={require("../../../assets/About/back1.jpg")}
          style={styles.bgImage}
          resizeMode="cover"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.overlay} />
        </ImageBackground>

        {/* Profile Box */}
        <View style={styles.profileBox}>
          <Image
            source={require("../../../assets/About/RamaSandilyan.png")}
            style={styles.profileImage}
          />
        </View>

        {/* Name & Subtitle */}
        <Text style={styles.name}>Rama Sandilyan</Text>
        <Text style={styles.subtitle}>HDRSS Leader</Text>

        {/* BUTTONS SECTION */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: "#FF0000" }]}
            onPress={handleCall}
          >
            <Text style={styles.buttonLabel}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: "#25D366" }]}
            onPress={handleWhatsApp}
          >
            <Text style={styles.buttonLabel}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: "#007AFF" }]}
            onPress={handleLocation}
          >
            <Text style={styles.buttonLabel}>Location</Text>
          </TouchableOpacity>
        </View>

        {/* ABOUT Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <Text style={styles.aboutText} numberOfLines={expanded ? undefined : 3}>
            உலக நாடுகள் மத்தியில் தனது தொன்மை நகரீகம் வளம் மொழி கலாச்சாரம்
            அறிவியல் அரசியல் வரலாறு இன்று எந்த கோணத்திலும் பார்த்தாலும் HDRSS
            அமைப்பு ஒரு முக்கிய பங்கு வகிக்கிறது. இது ஒரு சமூக முன்னேற்ற அமைப்பு
            மற்றும் அனைத்து தரப்பினருக்கும் கல்வி, கலாச்சாரம் மற்றும் ஆராய்ச்சி
            வாய்ப்புகளை வழங்குகிறது. அமைப்பின் பணிகள் சமூகத்திற்கான பல்வேறு
            திட்டங்கள், வலியுறுத்தல் நடவடிக்கைகள் மற்றும் விழிப்புணர்வு
            செயல்பாடுகள் மூலம் முன்னெடுக்கப்படுகிறது.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={styles.buttonText}>
              {expanded ? "Show Less" : "Learn More"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* GALLERY Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GALLERY</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.galleryScroll}
          >
            {galleryImages.map((img, index) => (
              <Image key={index} source={img} style={styles.galleryImage} />
            ))}
          </ScrollView>
        </View>

        {/* VIDEO Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VIDEO</Text>
          <YoutubePlayer
            height={220}
            width={width - 40}
            videoId="-AvxGZV1zZM"
            play={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  bgImage: {
    width: width,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(220, 0, 0, 0.6)",
  },

  profileBox: {
    alignSelf: "center",
    marginTop: -80,
    backgroundColor: "#FF2B00",
    padding: 8,
    borderRadius: 20,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
    textAlign: "center",
  },

  // BUTTON STYLES
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contactButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  section: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#93210A",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  galleryScroll: {
    marginTop: 10,
  },
  galleryImage: {
    width: width * 0.8,
    height: 180,
    borderRadius: 12,
    marginRight: 15,
  },
});
