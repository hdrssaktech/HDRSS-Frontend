// src/Screens/EventPage2.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function EventPage2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params || {};

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const styles = getStyles(isTablet);

  if (!event) {
    return (
      <View style={styles.centerContent}>
        <Text>No event data available</Text>
      </View>
    );
  }

  // Safely handle highlights - ensure it's an array
  const highlights = Array.isArray(event.highlights) 
    ? event.highlights 
    : event.highlights 
      ? [String(event.highlights)] 
      : [];

  return (
    <View style={styles.container}>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      {/* 📜 Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 🖼 Banner */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
        </View>

        {/* 📌 Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.eventTitle}>{event.name ?? ""}</Text>
          <Text style={styles.eventDate}>{event.date ?? ""}</Text>

          <View style={styles.divider} />

          <Text style={styles.eventDescription}>
            {event.description ??
              "More information about this event will be updated soon."}
          </Text>

          {/* ⭐ Highlights */}
          {highlights.length > 0 && (
            <View style={styles.highlightBox}>
              <Text style={styles.highlightTitle}>🌟 Highlights</Text>

              {highlights.map((item, index) => (
                <View key={index} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.highlightItem}>
                    {String(item || "").trim()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ================== STYLES ================== */

const getStyles = (isTablet) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },

    centerContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    /* 🔹 Header */
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: isTablet ? 23 : 18,
      paddingHorizontal: 16,
      paddingTop: 40,
      backgroundColor: "#93210A",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 4,
    },

    headerTitle: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: isTablet ? 24 : 20,
      marginLeft: 12,
      left: isTablet ? 200 : 55,
    },

    scrollContent: {
      paddingBottom: 50,
    },

    /* 🔹 Banner */
    imageWrapper: {
      alignItems: "center",
      marginTop: -2,
    },

    eventImage: {
      width: isTablet ? "90%" : 380,
      height: isTablet ? 380 : 290,
      borderRadius: 14,
    },

    /* 🔹 Info Card */
    infoContainer: {
      marginTop: -60,
      marginHorizontal: isTablet ? 40 : 0,
      backgroundColor: "#fff",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: isTablet ? 35 : 20,
      paddingVertical: isTablet ? 30 : 23,
      elevation: 4,
    },

    eventTitle: {
      fontSize: isTablet ? 28 : 20,
      fontWeight: "bold",
      color: "#222",
      textAlign: "center",
      marginBottom: 6,
    },

    eventDate: {
      fontSize: isTablet ? 18 : 14,
      color: "#93210A",
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 10,
    },

    divider: {
      height: 1,
      backgroundColor: "#eee",
      marginVertical: 15,
    },

    eventDescription: {
      fontSize: isTablet ? 18 : 15,
      color: "#444",
      lineHeight: isTablet ? 28 : 22,
      textAlign: "justify",
    },

    /* 🔹 Highlights */
    highlightBox: {
      backgroundColor: "#fff7f6",
      borderRadius: 20,
      padding: isTablet ? 28 : 20,
      marginTop: 25,
      borderLeftWidth: 5,
      borderLeftColor: "#93210A",
      elevation: 3,
    },

    highlightTitle: {
      fontSize: isTablet ? 22 : 17,
      fontWeight: "700",
      color: "#93210A",
      marginBottom: 16,
      textAlign: "center",
    },

    bulletRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10,
    },

    bulletDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#93210A",
      marginTop: 8,
      marginRight: 12,
    },

    highlightItem: {
      fontSize: isTablet ? 17 : 14,
      color: "#333",
      flex: 1,
      lineHeight: isTablet ? 26 : 20,
    },
  });
