// src/screens/DistrictCategorysPage0.js

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function DistrictCategorysPage0() {
  const navigation = useNavigation();
  const route = useRoute();
  const { districtId, categoryName } = route.params || {}; // safe access

  const [scaleVeg] = useState(new Animated.Value(1));
  const [scaleNonVeg] = useState(new Animated.Value(1));

  const animate = (anim) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSelect = (type) => {
    navigation.navigate("DistrictCategorysPage1", {
      districtId,
      categoryName,
      foodType: type,
    });
  };

  return (
    <View style={styles.bg}>
      {/* 🔝 Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {categoryName || "Select Category"}
          </Text>
        </View>
      </View>

      {/* 🔹 Content Section */}
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Preference</Text>

        <View style={styles.cardContainer}>
          {/* 🥗 Veg Card */}
          <TouchableWithoutFeedback
            onPress={() => {
              animate(scaleVeg);
              handleSelect("Veg");
            }}
          >
            <Animated.View
              style={[
                styles.card,
                styles.vegCard,
                { transform: [{ scale: scaleVeg }] },
              ]}
            >
              <View style={styles.innerCard}>
                <Text style={styles.emoji}>🥗</Text>
                <Text style={styles.cardTitle}>Veg</Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>

          {/* 🍗 Non-Veg Card */}
          <TouchableWithoutFeedback
            onPress={() => {
              animate(scaleNonVeg);
              handleSelect("Non-Veg");
            }}
          >
            <Animated.View
              style={[
                styles.card,
                styles.nonVegCard,
                { transform: [{ scale: scaleNonVeg }] },
              ]}
            >
              <View style={styles.innerCard}>
                <Text style={styles.emoji}>🍗</Text>
                <Text style={styles.cardTitle}>Non-Veg</Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // 🔹 Header Styles
  headerContainer: {
  backgroundColor: "#93210A",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical:35,
  },
  header: {
   flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  backButton: {
    width: 49,
    height: 40,
    
    
    justifyContent: "center",
    alignItems: "center",
    
  },
  headerTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 55,
  },

  // 🔹 Content Styles
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    bottom:60,
  },

  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  card: {
    width: "45%",
    height: 165,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    justifyContent: "center",
    alignItems: "center",
    
  },

  vegCard: {
    backgroundColor: "#e7f6e7",
    bottom:10,
  },

  nonVegCard: {
    backgroundColor: "#fce9e9",
     bottom:10,
  },

  innerCard: {
    alignItems: "center",
    padding: 17,
  },

  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
});
