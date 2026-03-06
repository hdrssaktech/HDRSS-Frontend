import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Linking,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;

export default function AboutPage1({ navigation }) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleEmailPress = () => Linking.openURL("mailto:hdrss.in@gmail.com");
  const handlePhonePress = () => Linking.openURL("tel:+919677717474");
  const handleSend = () => {
    console.log("Form Submitted:", { name, phone, email });
    alert("Your request has been sent!");
    setName("");
    setPhone("");
    setEmail("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity 
            style={[styles.backButton, isTablet && styles.backButtonTablet]} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons 
              name="chevron-back" 
              size={isTablet ? 32 : 28} 
              color="#fff" 
            />
          </TouchableOpacity>

          {/* Cover Image */}
          <View style={[styles.coverContainer, isTablet && styles.coverContainerTablet]}>
            <Image
              source={require("../../../assets/About/back1.jpg")}
              style={styles.coverImage}
            />
            <View style={[styles.overlay, isTablet && styles.overlayTablet]} />
          </View>

          {/* Avatar */}
          <View style={[styles.avatarContainer, isTablet && styles.avatarContainerTablet]}>
            <Image
              source={require("../../../assets/About/sun.jpg")}
              style={[styles.avatar, isTablet && styles.avatarTablet]}
            />
          </View>

          {/* Title */}
          <Text style={[styles.tamilText, isTablet && styles.tamilTextTablet]}>
            வீர இந்து தர்ம ரக்ஷ சேனா
          </Text>
          <Text style={[styles.englishText, isTablet && styles.englishTextTablet]}>
            VEERA HINDU DHARMA RAKSHA SENA
          </Text>

          {/* About Section */}
          <View style={[styles.aboutContainer, isTablet && styles.aboutContainerTablet]}>
            <Text style={[styles.aboutTitle, isTablet && styles.aboutTitleTablet]}>
              ABOUT
            </Text>
            <Text style={[styles.aboutText, isTablet && styles.aboutTextTablet]}>
              Hindu Dharma Raksha Sena is a community-driven organization that
              connects people and works towards protecting dharma and supporting
              cultural values.
            </Text>

            {expanded && (
              <Text style={[styles.aboutText, isTablet && styles.aboutTextTablet]}>
                We actively engage in charitable activities, awareness campaigns,
                and cultural events to strengthen unity and values. Our mission is
                to preserve tradition, empower youth, and build a harmonious
                society.
              </Text>
            )}

            <TouchableOpacity
              style={[styles.button, isTablet && styles.buttonTablet]}
              onPress={() => setExpanded(!expanded)}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>
                {expanded ? "Show Less" : "Learn More"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Leader Section - Single Centered Card */}
          <View style={[styles.leaderSection, isTablet && styles.leaderSectionTablet]}>
            <Text style={[styles.leaderTitle, isTablet && styles.leaderTitleTablet]}>
              LEADER
            </Text>
            
            <View style={[styles.leaderCardContainer, isTablet && styles.leaderCardContainerTablet]}>
              <TouchableOpacity
                style={[styles.leaderCard, isTablet && styles.leaderCardTablet]}
                onPress={() =>
                  navigation.navigate("AboutPage2", {
                    name: "Rama Sandilyan",
                    image: require("../../../assets/About/RamaSandilyan.png"),
                    role: "HDRSS Leader",
                  })
                }
                activeOpacity={0.7}
              >
                <Image
                  source={require("../../../assets/About/RamaSandilyan.png")}
                  style={[styles.leaderImage, isTablet && styles.leaderImageTablet]}
                />
                <Text style={[styles.leaderName, isTablet && styles.leaderNameTablet]}>
                  Rama Sandilyan
                </Text>
                <Text style={[styles.leaderRole, isTablet && styles.leaderRoleTablet]}>
                  HDRSS Leader
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CONTACT SECTION */}
          <View style={[styles.contactContainer, isTablet && styles.contactContainerTablet]}>
            <Text style={[styles.contactTitle, isTablet && styles.contactTitleTablet]}>
              CONTACT INFORMATION
            </Text>

            <TouchableOpacity onPress={handlePhonePress} style={[styles.contactRow, isTablet && styles.contactRowTablet]}>
              <Ionicons 
                name="call-outline" 
                size={isTablet ? 20 : 16} 
                color="#93210A" 
              />
              <Text style={[styles.contactInfo, isTablet && styles.contactInfoTablet]}>
                +91 9677717474
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEmailPress} style={[styles.contactRow, isTablet && styles.contactRowTablet]}>
              <Ionicons 
                name="mail-outline" 
                size={isTablet ? 20 : 16} 
                color="#93210A" 
              />
              <Text style={[styles.contactInfo, isTablet && styles.contactInfoTablet]}>
                hdrss.in@gmail.com
              </Text>
            </TouchableOpacity>

            <View style={[styles.contactRow, isTablet && styles.contactRowTablet]}>
              <Ionicons 
                name="location-outline" 
                size={isTablet ? 20 : 16} 
                color="#93210A" 
              />
              <Text style={[styles.contactInfo, isTablet && styles.contactInfoTablet]}>
                No:13, Bhairavai 2nd Street, Edayarpalayam, Coimbatore - 641025
              </Text>
            </View>
          </View>

          {/* Advertisement Form - Commented Out */}
          {/* <View style={[styles.formContainer, isTablet && styles.formContainerTablet]}>
            <Text style={[styles.formTitle, isTablet && styles.formTitleTablet]}>
              For Advertisements and Service Promotion
            </Text>

            <View style={[styles.inputContainer, isTablet && styles.inputContainerTablet]}>
              <Ionicons 
                name="person-outline" 
                size={isTablet ? 24 : 20} 
                color="#666" 
              />
              <TextInput
                placeholder="Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                style={[styles.input, isTablet && styles.inputTablet]}
              />
            </View>

            <View style={[styles.inputContainer, isTablet && styles.inputContainerTablet]}>
              <Ionicons 
                name="call-outline" 
                size={isTablet ? 24 : 20} 
                color="#666" 
              />
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                style={[styles.input, isTablet && styles.inputTablet]}
              />
            </View>

            <View style={[styles.inputContainer, isTablet && styles.inputContainerTablet]}>
              <Ionicons 
                name="mail-outline" 
                size={isTablet ? 24 : 20} 
                color="#666" 
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={[styles.input, isTablet && styles.inputTablet]}
              />
            </View>

            <TouchableOpacity 
              style={[styles.sendButton, isTablet && styles.sendButtonTablet]} 
              onPress={handleSend}
              activeOpacity={0.8}
            >
              <Text style={[styles.sendButtonText, isTablet && styles.sendButtonTextTablet]}>
                Send
              </Text>
            </TouchableOpacity>
          </View> */}

          {/* Join Us */}
          <View style={[styles.joinContainer, isTablet && styles.joinContainerTablet]}>
            <Text style={[styles.joinTitle, isTablet && styles.joinTitleTablet]}>
              JOIN US
            </Text>
            <Text style={[styles.joinText, isTablet && styles.joinTextTablet]}>
              Sign up to become a member and make a positive impact in your
              community and beyond. Let's collaborate to build a stronger Tamil
              Nadu.
            </Text>
            <TouchableOpacity
              style={[styles.joinButton, isTablet && styles.joinButtonTablet]}
              onPress={() => navigation.navigate("Member1")}
              activeOpacity={0.8}
            >
              <Text style={[styles.joinButtonText, isTablet && styles.joinButtonTextTablet]}>
                Become a member
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ============ BASE STYLES ============
  safeArea: {
    flex: 1,
    backgroundColor: "#93210A",
  },
  scrollContainer: { 
    flex: 1, 
    backgroundColor: "#f8f8f8" 
  },
  container: { 
    flex: 1, 
    alignItems: "center", 
    paddingBottom: 30 
  },
  
  // ============ BACK BUTTON ============
  backButton: { 
    position: "absolute", 
    top: Platform.OS === 'ios' ? 40 : 30, 
    left: 20, 
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 6,
  },
  backButtonTablet: {
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 30,
    padding: 8,
  },
  
  // ============ COVER IMAGE ============
  coverContainer: { 
    width: screenWidth, 
    height: 200 
  },
  coverImage: { 
    width: "100%", 
    height: "100%", 
    resizeMode: "cover" 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: "rgba(255,0,0,0.6)" 
  },
  coverContainerTablet: { 
    height: 300 
  },
  overlayTablet: {
    backgroundColor: "rgba(255,0,0,0.5)",
  },
  
  // ============ AVATAR ============
  avatarContainer: {
    marginTop: -70,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  avatar: { 
    width: 140, 
    height: 140, 
    borderRadius: 70 
  },
  avatarContainerTablet: {
    marginTop: -85,
    borderRadius: 120,
    borderWidth: 5,
  },
  avatarTablet: { 
    width: 190, 
    height: 190, 
    borderRadius: 85 
  },
  
  // ============ TITLE TEXTS ============
  tamilText: { 
    marginTop: 10, 
    fontSize: 16, 
    fontWeight: "bold", 
    textAlign: "center",
    color: "#333",
  },
  englishText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333", 
    marginTop: 7, 
    textAlign: "center" 
  },
  tamilTextTablet: { 
    fontSize: 20, 
    marginTop: 15,
  },
  englishTextTablet: { 
    fontSize: 20, 
    marginTop: 10,
  },
  
  // ============ ABOUT SECTION ============
  aboutContainer: { 
    marginTop: 20, 
    paddingHorizontal: 20, 
    width: "100%", 
    alignItems: "center" 
  },
  aboutTitle: { 
    fontSize: 15, 
    fontWeight: "bold", 
    marginBottom: 10,
    color: "#93210A",
  },
  aboutText: { 
    fontSize: 14, 
    color: "#444", 
    textAlign: "justify", 
    lineHeight: 22 
  },
  button: {
    marginTop: 10,
    backgroundColor: "#93210A",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  aboutContainerTablet: {
    marginTop: 30,
    paddingHorizontal: 40,
  },
  aboutTitleTablet: { 
    fontSize: 19,
    marginBottom: 15,
  },
  aboutTextTablet: { 
    fontSize: 17, 
    lineHeight: 27 
  },
  buttonTablet: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 28,
    marginTop: 15,
  },
  buttonTextTablet: { 
    fontSize: 18 
  },
  
  // ============ LEADER SECTION ============
  leaderSection: { 
    marginTop: 30, 
    width: "100%",
    alignItems: "center",
  },
  leaderTitle: { 
    fontSize: 15, 
    fontWeight: "bold", 
    marginBottom: 15,
    color: "#93210A",
    textAlign: "center",
  },
  leaderCardContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leaderCard: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 5,
    alignItems: "center",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  leaderImage: { 
    width: 180, 
    height: 180, 
    resizeMode: "cover",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#93210A",
  },
  leaderName: { 
    marginTop: 12, 
    fontSize: 16, 
    fontWeight: "bold", 
    textAlign: "center",
    color: "#333",
  },
  leaderRole: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  
  // Tablet Leader Styles
  leaderSectionTablet: {
    marginTop: 40,
  },
  leaderTitleTablet: { 
    fontSize: 18,
    marginBottom: 20,
  },
  leaderCardContainerTablet: {
    maxWidth: 400,
  },
  leaderCardTablet: {
    maxWidth: 350,
    borderRadius: 20,
    padding: 20,
  },
  leaderImageTablet: { 
    width: 220, 
    height: 220,
    borderRadius: 15,
    borderWidth: 3,
  },
  leaderNameTablet: { 
    fontSize: 18, 
    marginTop: 15,
  },
  leaderRoleTablet: {
    fontSize: 16,
    marginTop: 5,
  },
  
  // ============ CONTACT SECTION ============
  contactContainer: { 
    marginTop: 30, 
    paddingHorizontal: 20, 
    width: "100%" 
  },
  contactTitle: { 
    fontSize: 15, 
    fontWeight: "bold", 
    marginBottom: 15,
    color: "#93210A",
  },
  contactRow: { 
    flexDirection: "row", 
    alignItems: "flex-start", 
    marginBottom: 10 
  },
  contactInfo: { 
    fontSize: 13, 
    color: "#444", 
    flexShrink: 1, 
    lineHeight: 22,
    marginLeft: 8,
  },
  contactContainerTablet: {
    marginTop: 40,
    paddingHorizontal: 40,
  },
  contactTitleTablet: { 
    fontSize: 16,
    marginBottom: 20,
  },
  contactRowTablet: { 
    marginBottom: 15 
  },
  contactInfoTablet: { 
    fontSize: 15, 
    lineHeight: 24,
    marginLeft: 10,
  },
  
  // ============ FORM SECTION ============
  formContainer: { 
    marginTop: 30, 
    paddingHorizontal: 20, 
    width: "100%" 
  },
  formTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 15, 
    textAlign: "center",
    color: "#93210A",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  input: { 
    flex: 1, 
    paddingVertical: 10, 
    marginLeft: 8, 
    fontSize: 14 
  },
  sendButton: {
    backgroundColor: "#93210A",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    width: 160,
    alignSelf: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sendButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  formContainerTablet: {
    marginTop: 40,
    paddingHorizontal: 40,
  },
  formTitleTablet: { 
    fontSize: 18,
    marginBottom: 20,
  },
  inputContainerTablet: {
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  inputTablet: { 
    paddingVertical: 12, 
    marginLeft: 10, 
    fontSize: 16 
  },
  sendButtonTablet: {
    paddingVertical: 16,
    borderRadius: 28,
    width: 180,
    marginTop: 15,
  },
  sendButtonTextTablet: { 
    fontSize: 18 
  },
  
  // ============ JOIN SECTION ============
  joinContainer: { 
    marginTop: 30, 
    paddingHorizontal: 20, 
    width: "100%" 
  },
  joinTitle: { 
    fontSize: 15, 
    fontWeight: "bold", 
    marginBottom: 15,
    color: "#93210A",
  },
  joinText: { 
    fontSize: 14, 
    color: "#444", 
    lineHeight: 22, 
    marginBottom: 20 
  },
  joinButton: {
    backgroundColor: "#93210A",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  joinButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  joinContainerTablet: {
    marginTop: 40,
    paddingHorizontal: 40,
  },
  joinTitleTablet: { 
    fontSize: 18,
    marginBottom: 20,
  },
  joinTextTablet: { 
    fontSize: 16, 
    lineHeight: 26, 
    marginBottom: 25 
  },
  joinButtonTablet: {
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 28,
  },
  joinButtonTextTablet: { 
    fontSize: 18 
  },
});