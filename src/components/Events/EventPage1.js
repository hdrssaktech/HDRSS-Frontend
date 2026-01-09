import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getEvents } from "../../Controller/EventController/EventController";

export default function EventPage() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const styles = getStyles(isTablet);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.centerContent}>
        <Text>No events available at the moment.</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: 10 }}>
      <Text style={styles.Eventsheading}>Events</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        style={styles.eventScroll}
      >
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => navigation.navigate("EventPage2", { event })}
          >
            <Image source={{ uri: event.image }} style={styles.eventImage} />

            <Text style={styles.eventTitle}>
              {event.name ?? ""}
            </Text>

            <Text style={styles.eventDate}>
              {event.date ?? ""}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const getStyles = (isTablet) =>
  StyleSheet.create({
    eventScroll: {
      marginTop: 10,
    },

    Eventsheading: {
      fontSize: isTablet ? 26 : 20,
      color: "#93210A",
      fontWeight: "bold",
      margin: isTablet ? 20 : 15,
      


    },

    eventCard: {
      width: isTablet ? 360 : 300,
      height: isTablet ? 300 : 250,
      margin: isTablet ? 25 : 20,
      backgroundColor: "#fff",
      elevation: 3,
      shadowColor: "#000",
      padding: isTablet ? 52 : 48,
      alignItems: "center",
    },

    eventImage: {
      width: "120%",
      height: "100%",
      borderRadius: 10,
    },

    eventTitle: {
      fontSize: isTablet ? 18 : 14,
      fontWeight: "bold",
      marginTop: 5,
      textAlign: "center",
      color: "#222",
    },

    eventDate: {
      fontSize: isTablet ? 16 : 13,
      color: "#93210A",
      marginTop: 4,
      right: isTablet ? 5 : 2,
       fontSize: 13,

   
    },

    centerContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

