import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const PartiesPage2 = () => {
  const route = useRoute();
  const { party } = route.params; // ✅ Get data from previous page

  const callNumber = (number) => {
    if (number) Linking.openURL(`tel:${number}`);
  };

  const openMap = (location) => {
    if (location)
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          location
        )}`
      );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <Image
        source={{
          uri:
            party.image ||
            "https://via.placeholder.com/400/93210A/FFFFFF?text=No+Image",
        }}
        style={styles.image}
      />

      {/* Card Section */}
      <View style={styles.card}>
        <Text style={styles.title}>{party.title || "Unnamed Party"}</Text>

        <View style={styles.divider} />

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>👤 Leader:</Text>
          <Text style={styles.infoValue}>{party.name || "No leader info"}</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>🎖️ Role:</Text>
          <Text style={styles.infoValue}>{party.role || "No role info"}</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>📍 Location:</Text>
          <Text style={styles.infoValue}>
            {party.location || "No location info"}
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>📞 Phone:</Text>
          <Text style={styles.infoValue}>
            {party.phoneNumber || "Not available"}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, styles.callButton]}
            onPress={() => callNumber(party.phoneNumber)}
          >
            <Text style={styles.buttonText}>📞 Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.mapButton]}
            onPress={() => openMap(party.location)}
          >
            <Text style={styles.buttonText}>🌐 Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default PartiesPage2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF7F7",
  },
  image: {
    width: "100%",
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#93210A",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0c0b8",
    marginVertical: 10,
  },
  infoBlock: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#93210A",
  },
  infoValue: {
    fontSize: 15,
    color: "#444",
    marginTop: 3,
    marginLeft: 5,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  callButton: {
    backgroundColor: "#93210A",
  },
  mapButton: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
