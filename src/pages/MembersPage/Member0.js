import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Member0() {
  const navigation = useNavigation();
  const route = useRoute();
const { districtId, districtName } = route.params || {};

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        {/* 🔙 Back Arrow */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Leadership Directory</Text>
      </View>
 {/* <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
          District Name: {districtName}
        </Text>
        <Text style={{ fontSize: 14, color: "#666" }}>
          District ID: {districtId}
        </Text>
      </View> */}


      {/* 🔹 Buttons Row (State + District) */}
      <View style={styles.buttonRow}>
        {/* State Level */}
<TouchableOpacity
  style={[styles.mainButton, { backgroundColor: "#93210A" }]}
  onPress={() =>
    navigation.navigate("Member", {
      categoryType: "State",
      districtId,
      districtName,
    })
  }
>
  <Ionicons name="people-circle-outline" size={24} color="#fff" />
  <Text style={styles.mainButtonText}>State Level</Text>
</TouchableOpacity>

{/* District Level */}
<TouchableOpacity
  style={[styles.mainButton, { backgroundColor: "#E0A800" }]}
  onPress={() =>
    navigation.navigate("Member", {
      categoryType: "Districts",
      districtId,
      districtName,
    })
  }
>
  <Ionicons name="location-outline" size={24} color="#fff" />
  <Text style={styles.mainButtonText}>District Level</Text>
</TouchableOpacity>
      </View>

      {/* 🔹 Join Button */}
      <View style={styles.joinContainer}>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => navigation.navigate("Member1",{districtName})}
        >
          <Ionicons name="person-add-outline" size={26} color="#fff" />
          <Text style={styles.joinButtonText}>Join With Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#93210A",
    paddingVertical: 50,
    alignItems: "center",
    // marginTop: 35,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    position: "relative",
  },

  // 🔹 Back Arrow Style
  backButton: {
    position: "absolute",
    left: 15,
    top: 45,
    padding: 6,
  },

  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  mainButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mainButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 6,
  },
  joinContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A8754",
    width: "80%",
    paddingVertical: 16,
    borderRadius: 14,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
});


