// src/Screens/EventPage2.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function EventPage2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params || {};

  if (!event) {
    return (
      <View style={styles.centerContent}>
        <Text>No event data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      {/* 📜 Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 🖼️ Banner Image */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
        </View>

        {/* ✨ Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.eventTitle}>{event.name ?? ""}</Text>
          <Text style={styles.eventDate}>{event.date ?? ""}</Text>

          <View style={styles.divider} />

          <Text style={styles.eventDescription}>
            {event.description ??
              "More information about this event will be updated soon."}
          </Text>

          {event.highlights && (
            <View style={styles.highlightBox}>
              <Text style={styles.highlightTitle}>🌟    Highlights</Text>
              {event.highlights.map((item, index) => (
                <View key={index} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.highlightItem}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // 🔹 Main Layout
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // 🔹 Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // 🔹 Banner
  imageWrapper: {
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
   
  },
  eventImage: {
    width: 330,
    height: 290,
    marginVertical:10,
  },

  // 🔹 Info Section
  infoContainer: {
    marginTop: -66,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 23,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  // 🔹 Title + Date
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 14,
    color: "#93210A",
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 4,
  },

  
  // 🔹 Description
  eventDescription: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    textAlign: "justify",
    marginVertical:8,
  },

  // 🔹 Highlights Card
  highlightBox: {
    backgroundColor: "#fff7f6",
    borderRadius: 18,
    padding: 30,
    marginTop: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#93210A",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 12,
    textAlign: "center",
    right:25,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    left:35,
  },
  bulletDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#93210A",
    marginTop: 12,
    marginRight: 10,
  },
  highlightItem: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
    lineHeight: 20,
    marginVertical:6,
  },


});
