import React, { useState } from "react";
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
import ReminderPicker from '../../Controller/EventController/ReminderPicker';

export default function EventPage2() {
  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params || {};

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const styles = getStyles(isTablet);

  const [reminderSet, setReminderSet] = useState(false); // ✅ track reminder state

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  if (!event) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.noDataText}>No event data available</Text>
      </View>
    );
  }

  const highlights = Array.isArray(event.highlights)
    ? event.highlights
    : event.highlights
      ? [String(event.highlights)]
      : [];

  return (
    <View style={styles.container}>
      {/* 🔙 Header - maroon, rounded, matches the rest of the app */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={isTablet ? 26 : 22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Event Details
        </Text>
        <View style={{ width: isTablet ? 40 : 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔔 Reminder - kept at the top, most visible */}
        <ReminderPicker
          event={event}
          reminderSet={reminderSet}
          onReminderSet={() => setReminderSet(true)}
        />

        {/* 🖼 Banner - gold-ringed frame, image stays fully visible */}
        <View style={styles.imageWrapper}>
          <View style={styles.imageFrame}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
          </View>
        </View>

        {/* 📌 Info card */}
        <View style={styles.infoContainer}>
          <Text style={styles.eventTitle}>{event.name ?? ""}</Text>

          <View style={styles.dateChip}>
            <Ionicons name="calendar-outline" size={13} color="#93210A" />
            <Text style={styles.eventDate}>{formatDate(event.date ?? "")}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.eventDescription}>
            {event.description ??
              "More information about this event will be updated soon."}
          </Text>

          {/* ⭐ Highlights */}
          {highlights.length > 0 && (
            <View style={styles.highlightBox}>
              <View style={styles.highlightHeaderRow}>
                <Ionicons name="star" size={isTablet ? 20 : 16} color="#D4AF37" />
                <Text style={styles.highlightTitle}>Highlights</Text>
              </View>
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
      backgroundColor: "#FBEEDB",
    },

    centerContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FBEEDB",
    },

    noDataText: {
      fontSize: 15,
      color: "#8a7a63",
      fontWeight: "600",
    },

    /* 🔹 Header */
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: isTablet ? 23 : 18,
      paddingHorizontal: 16,
      paddingTop: 49,
      backgroundColor: "#93210A",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 4,
    },

    backBtn: {
      width: isTablet ? 40 : 36,
      height: isTablet ? 40 : 36,
      borderRadius: isTablet ? 20 : 18,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },

    headerTitle: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: isTablet ? 24 : 19,
      flex: 1,
      textAlign: "center",
    },

    scrollContent: {
      paddingBottom: 50,
    },

    /* 🔹 Banner */
    imageWrapper: {
      alignItems: "center",
      marginTop: 18,
      paddingHorizontal: isTablet ? 40 : 18,
    },

    imageFrame: {
      width: "100%",
      borderRadius: 18,
      padding: 4,
      borderWidth: 1.5,
      borderColor: "#D4AF37",
      backgroundColor: "#fff",
    },

    eventImage: {
      width: "100%",
      height: isTablet ? 360 : 220,
      borderRadius: 14,
      resizeMode: "cover",
    },

    /* 🔹 Info Card */
    infoContainer: {
      marginTop: 22,
      marginHorizontal: isTablet ? 40 : 18,
      backgroundColor: "#fff",
      borderRadius: 20,
      paddingHorizontal: isTablet ? 35 : 20,
      paddingVertical: isTablet ? 30 : 22,
      elevation: 3,
      shadowColor: "#93210A",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },

    eventTitle: {
      fontSize: isTablet ? 26 : 20,
      fontWeight: "800",
      color: "#301913",
      textAlign: "center",
      marginBottom: 10,
    },

    dateChip: {
      flexDirection: "row",
      alignSelf: "center",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#FBEEDB",
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
    },

    eventDate: {
      fontSize: isTablet ? 15 : 13,
      color: "#93210A",
      fontWeight: "700",
    },

    divider: {
      width: 46,
      height: 3,
      backgroundColor: "#D4AF37",
      borderRadius: 2,
      alignSelf: "center",
      marginVertical: 18,
    },

    eventDescription: {
      fontSize: isTablet ? 18 : 15,
      color: "#4a3d34",
      lineHeight: isTablet ? 28 : 23,
    },

    /* 🔹 Highlights */
    highlightBox: {
      backgroundColor: "#FBEEDB",
      borderRadius: 18,
      padding: isTablet ? 26 : 18,
      marginTop: 24,
      borderWidth: 1,
      borderColor: "#D4AF37",
    },

    highlightHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 14,
    },

    highlightTitle: {
      fontSize: isTablet ? 20 : 16,
      fontWeight: "700",
      color: "#93210A",
    },

    bulletRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 10,
    },

    bulletDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "#93210A",
      marginTop: 8,
      marginRight: 12,
    },

    highlightItem: {
      fontSize: isTablet ? 16 : 14,
      color: "#4a3d34",
      flex: 1,
      lineHeight: isTablet ? 25 : 20,
    },
  });