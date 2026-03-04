import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Animated,
  Easing,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { LocationContext } from "../../context/LocationContext";

export default function CurrentLocation() {
  const { locationName, setLocationName, setTownName } = useContext(LocationContext);
  const [loading, setLoading] = useState(false);

  // Ripple animation value
  const ripple = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(ripple, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const getCurrentLocation = async () => {
    try {
      if (locationName !== "") {
        setLocationName("");
        setTownName("");
        return;
      }

      setLoading(true);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied!");
        setLoading(false);
        return;
      }

      let current = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = current.coords;

      let address = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (address.length > 0) {
        const item = address[0];
        const city = item.city || "Unknown";
        const town = item.subregion || item.district || "";
        setLocationName(city);
        setTownName(town);
      }
      setLoading(false);
    } catch (error) {
      console.log("ERROR:", error);
      setLoading(false);
    }
  };

  // Ripple circle style
  const rippleStyle = {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ff000020", // Light red ripple
    transform: [
      {
        scale: ripple.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 2],
        }),
      },
    ],
    opacity: ripple.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
  };

  return (
    <View style={{ alignSelf: "center", marginTop: 20 }}>
      {/* Ripple behind button */}
      <Animated.View style={rippleStyle} />

      <TouchableOpacity style={styles.card} onPress={getCurrentLocation}>
        <Ionicons name="location-outline" size={22} color="#b50a04" />

        {loading ? (
          <ActivityIndicator size="small" color="#b50a04" style={{ marginLeft: 10 }} />
        ) : (
          <Text style={styles.text}>{locationName || "All Locations"}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 6,
    alignItems: "center",
  },
  text: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
});
