import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  Linking,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function AboutPage1({ navigation }) {
  const [expanded, setExpanded] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Auto-scrolling leader cards
  useEffect(() => {
    const loopAnimation = () => {
      scrollX.setValue(0);
      Animated.timing(scrollX, {
        toValue: -width, // scroll width
        duration: 20000,
        useNativeDriver: true,
      }).start(() => loopAnimation());
    };
    loopAnimation();
  }, [scrollX]);

  const handleEmailPress = () => Linking.openURL("mailto:hdrss.in@gmail.com");
  const handlePhonePress = () => Linking.openURL("tel:+919677717474");
  const handleJoinPress = () => navigation.navigate("Members2");
  const handleBackPress = () => navigation.navigate("Homepage");

  const handleSend = () => {
    console.log("Form Submitted:", { name, phone, email });
    alert("Your request has been sent!");
    setName("");
    setPhone("");
    setEmail("");
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton}  onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={require("../../../assets/About/back1.jpg")}
            style={styles.coverImage}
          />
          <View style={styles.overlay} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../../assets/About/sun.jpg")}
            style={styles.avatar}
          />
        </View>

        {/* Title */}
        <Text style={styles.tamilText}>இந்த தர்ம ரக்ஷ சேனா</Text>
        <Text style={styles.englishText}>HINDU DHARMA RAKSHA SENA</Text>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>ABOUT</Text>
          <Text style={styles.aboutText}>
            Hindu Dharma Raksha Sena is a community-driven organization that
            connects people and works towards protecting dharma and supporting
            cultural values.
          </Text>

          {expanded && (
            <Text style={styles.aboutText}>
              We actively engage in charitable activities, awareness campaigns,
              and cultural events to strengthen unity and values. Our mission is
              to preserve tradition, empower youth, and build a harmonious
               </Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setExpanded(!expanded)}
          >
            <Text style={styles.buttonText}>
              {expanded ? "Show Less" : "Learn More"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Leader Section */}
        <View style={styles.leaderSection}>
          <Text style={styles.leaderTitle}>LEADER</Text>
          <View style={{ overflow: "hidden", width: "100%" }}>
            <Animated.View
              style={{
                flexDirection: "row",
                transform: [{ translateX: scrollX }],
              }}
            >
              {Array(2)
                .fill(0)
                .map((_, idx) => (
                  <View key={idx} style={{ flexDirection: "row" }}>
                    {["Rama Sandilyan", "Leader 2", "Leader 3", "Leader 4"].map(
                      (leader, i) => (
                        <TouchableOpacity
                          key={i}
                          style={styles.leaderCard}
                          onPress={() =>
                            navigation.navigate("AboutPage2", {
                              name: leader,
                              image: require("../../../assets/About/RamaSandilyan.png"),
                              role: "HDRSS Leader",
                            })
                          }
                        >
                          <Image
                            source={require("../../../assets/About/RamaSandilyan.png")}
                            style={styles.leaderImage}
                          />
                          <Text style={styles.leaderName}>{leader}</Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                ))}
            </Animated.View>
          </View>
        </View>
 {/* CONTACT SECTION INSIDE CONTAINER */}
        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>CONTACT INFORMATION</Text>

          <TouchableOpacity onPress={handlePhonePress} style={styles.contactRow}>
            <Ionicons name="call-outline" size={16} color="#93210A" />
            <Text style={styles.contactInfo}>   +91 9677717474</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleEmailPress} style={styles.contactRow}>
            <Ionicons name="mail-outline" size={16} color="#93210A" />
            <Text style={styles.contactInfo}>    hdrss.in@gmail.com</Text>
          </TouchableOpacity>

          <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={16} color="#93210A" />
            <Text style={styles.contactInfo}>    No:13, Bhairavai 2nd Street,Edayarpalayam, Coimbatore - 641025
            </Text>
          </View>
        </View>

        {/* Advertisement Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            For Advertisements and Service Promotion
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Join Us */}
        <View style={styles.joinContainer}>
          <Text style={styles.joinTitle}>JOIN US</Text>
          <Text style={styles.joinText}>
            Sign up to become a member and make a positive impact in your
            community and beyond. Let's collaborate to build a stronger Tamil
            Nadu.
          </Text>
         <TouchableOpacity
  style={styles.joinButton}
  onPress={() => navigation.navigate("Member1")}
>
  <Text style={styles.joinButtonText}>Become a member</Text>
</TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: "#f8f8f8" },
  container: { flex: 1, alignItems: "center", paddingBottom: 30 },
  backButton: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  coverContainer: { width, height: 200 },
  coverImage: { width: "100%", height: "100%", resizeMode: "cover" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,0,0,0.6)" },
  avatarContainer: {
    marginTop: -70,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
  },
  avatar: { width: 140, height: 140, borderRadius: 70 },
  tamilText: { marginTop: 10, fontSize: 16, fontWeight: "bold", textAlign: "center" },
  englishText: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 7, textAlign: "center" },
  aboutContainer: { marginTop: 20, paddingHorizontal: 20, width: "100%", alignItems: "center" },
  aboutTitle: { fontSize: 15, fontWeight: "bold", marginBottom: 10 ,color:"#93210A",},
  aboutText: { fontSize: 14, color: "#444", textAlign: "justify", lineHeight: 22 },
  button: {
    marginTop: 10,
    backgroundColor: "#93210A",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 25,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  leaderSection: { marginTop: 30, width: "100%" },
  leaderTitle: { fontSize: 15, fontWeight: "bold", marginLeft: 25, marginBottom: 10 ,color:"#93210A",},
  leaderCard: {
    marginRight: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 3,
    alignItems: "center",
    paddingBottom: 10,
  },
  leaderImage: { width: 150, height: 150, resizeMode: "cover" },
  leaderName: { marginTop: 8, fontSize: 14, fontWeight: "600", textAlign: "center" },
  contactContainer: { marginTop: 30, paddingHorizontal: 20, width: "100%" },
  contactTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 15,color:"#93210A", },
  contactRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  contactInfo: { fontSize: 13, color: "#444", flexShrink: 1, lineHeight:22,
  },
  formContainer: { marginTop: 30, paddingHorizontal: 20, width: "100%" },
  formTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15, textAlign: "center",color:"#93210A", },
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
  input: { flex: 1, paddingVertical: 10, marginLeft: 8, fontSize: 14 },
  sendButton: {
    backgroundColor: "#93210A",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    width: 160,
    alignSelf: "center",
  },
  sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  joinContainer: { marginTop: 30, paddingHorizontal: 20, width: "100%" },
  joinTitle: { fontSize: 15, fontWeight: "bold", marginBottom: 15,color:"#93210A", },
  joinText: { fontSize: 14, color: "#444", lineHeight: 22, marginBottom: 20 },
  joinButton: {
    backgroundColor: "#93210A",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: "center",
  },
  joinButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
