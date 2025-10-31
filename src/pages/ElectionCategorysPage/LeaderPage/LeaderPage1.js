import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");
const imageSize = 90;

const leaders = [
  { name: "Ariyalur", img: require("../../../../assets/District/ariyalur.jpg") },
  { name: "Chengalpattu", img: require("../../../../assets/District/Chengalpattu.jpg") },
  { name: "Chennai", img: require("../../../../assets/District/Chennai.jpg") },
  { name: "Coimbatore", img: require("../../../../assets/District/coimbatore.jpg") },
  { name: "Cuddalore", img: require("../../../../assets/District/cuddalore.jpg") },
  { name: "Dharmapuri", img: require("../../../../assets/District/Dharmapuri.jpg") },
  { name: "Dindigul", img: require("../../../../assets/District/Dindigul.jpg") },
  { name: "Erode", img: require("../../../../assets/District/Erode.jpg") },
  { name: "Kallakurichi", img: require("../../../../assets/District/Kallakurichi.jpg") },
  { name: "Kancheepuram", img: require("../../../../assets/District/kancheepuram.jpg") },
  { name: "Kaniyakumari", img: require("../../../../assets/District/Kaniyakumari.jpg") },
  { name: "Karur", img: require("../../../../assets/District/karur.jpg") },
  { name: "Krishnagiri", img: require("../../../../assets/District/Krishnagiri.jpg") },
  { name: "Madurai", img: require("../../../../assets/District/Madurai.png") },
  { name: "Mayiladuthurai", img: require("../../../../assets/District/Mayiladuthurai.jpg") },
  { name: "Nagapattinam", img: require("../../../../assets/District/Nagapattinam.jpg") },
  { name: "Namakkal", img: require("../../../../assets/District/Namakkal.jpg") },
  { name: "Nilgiris", img: require("../../../../assets/District/Nilgiris.jpg") },
  { name: "Perambalur", img: require("../../../../assets/District/Perambalur.jpg") },
  { name: "Pudukkottai", img: require("../../../../assets/District/Pudukkottai.jpg") },
  { name: "Ramanathapuram", img: require("../../../../assets/District/Ramanathapuram.jpg") },
  { name: "Ranipet", img: require("../../../../assets/District/Ranipet.jpg") },
  { name: "Salem", img: require("../../../../assets/District/Salem.jpg") },
  { name: "Sivaganga", img: require("../../../../assets/District/Sivaganga.jpg") },
  { name: "Tenkasi", img: require("../../../../assets/District/Tenkasi.jpg") },
  { name: "Thanjavur", img: require("../../../../assets/District/Thanjavur.jpg") },
  { name: "Theni", img: require("../../../../assets/District/Theni.jpg") },
  { name: "Thoothukudi", img: require("../../../../assets/District/Thoothukudi.jpg") },
  { name: "Tiruchirappalli", img: require("../../../../assets/District/tiruchirappalli.jpg") },
  { name: "Tirunelveli", img: require("../../../../assets/District/Tirunelveli.jpg") },
  { name: "Tirupathur", img: require("../../../../assets/District/Tirupathur.jpg") },
  { name: "Tiruppur", img: require("../../../../assets/District/Tiruppur.jpg") },
  { name: "Tiruvallur", img: require("../../../../assets/District/Tiruvallur.jpg") },
  { name: "Tiruvannamalai", img: require("../../../../assets/District/Tiruvannamalai.jpg") },
  { name: "Tiruvarur", img: require("../../../../assets/District/Tiruvarur.jpg") },
  { name: "Vellore", img: require("../../../../assets/District/Vellore.jpg") },
  { name: "Villupuram", img: require("../../../../assets/District/Villupuram.jpg") },
  { name: "Virudhunagar", img: require("../../../../assets/District/Virudhunagar.jpg") },
  { name: "" } // 👈 empty placeholder – will be hidden
];

export default function LeaderPage1({ navigation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("Select district");

  const Sdistricts = leaders.map((item) => item.name).filter(Boolean);

  const filteredDistricts = Sdistricts.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (district) => {
    setSelectedDistrict(district);
    setIsOpen(false);
    setSearchText("");
  };

  return (
    <View style={styles.container8}>
      {/* Header */}
      <View style={styles.header8}>
        <TouchableOpacity   onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerText8}>Leaders</Text>

      </View>

      <TouchableOpacity
        style={styles.disbutton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.DisbuttonText}>{selectedDistrict}</Text>
        <Icon name="arrow-drop-down" size={24} color="#A4371B" left={50} />
      </TouchableOpacity>


      {/* Dropdown Content Overlay */}
      {isOpen && (
        <View style={styles.dropdownOverlay}>
          {/* Search Box */}
          <TextInput
            style={styles.searchBar}
            placeholder="Search district..."
            value={searchText}
            onChangeText={setSearchText}
          />

          {/* Scrollable List */}

          <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled={true}>

            {/* Your other content */}

            <FlatList
              data={filteredDistricts}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 150 }}
              nestedScrollEnabled={true}
            />
          </ScrollView>

        </View>
      )}


      {/* District Grid */}
      <View style={styles.imageSection}>
        <FlatList
          data={leaders}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={true}
          renderItem={({ item, index }) => {
            const isLast = index === leaders.length - 1;
            return (
              <TouchableOpacity
                style={[styles.imageItem, isLast && { opacity: 0 }]} // Hide last box if needed
                disabled={isLast} // Disable touch when last item
                activeOpacity={0.7} // Optional: adds a nice press effect
                onPress={() => {
                  if (item.name === "Kaniyakumari") {
                    navigation.navigate("LeaderPage2");
                  }
                }}
              >
                {/* Show image only if available */}
                {item.img && (
                  <Image
                    source={item.img}
                    style={styles.image}
                    resizeMode="cover" // Ensures image scales nicely
                  />
                )}

                {/* Show district name */}
                <Text style={styles.imageText}>{item.name}</Text>
              </TouchableOpacity>

            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container8: { flex: 1, backgroundColor: "#f5f5f5" },

  header8: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  headerText8: {
    color: "white",
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 5,
    marginHorizontal: 15,
  },

  disbutton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 80,
    paddingVertical: 7,
    backgroundColor: "#f9f9f9",
    marginLeft: "auto",
    marginTop: 20, marginHorizontal: 55,

  },
  DisbuttonText: {
    fontSize: 14,
    color: "#333",
    left: -60,

  },

  dropdownOverlay: {
    position: "absolute",
    top: 165,
    left: 15,
    right: 15,
    zIndex: 1000,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 200,
    elevation: 5,
  },
  searchBar: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 8,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  imageSection: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  imageItem: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 7,
    elevation: 2,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 5,
  },
  imageText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
});
