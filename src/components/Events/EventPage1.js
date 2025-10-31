// src/Screens/EventPage.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getEvents } from "../../Controller/EventController/EventController";

export default function EventPage() {
  const navigation = useNavigation();
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
            <View style={styles.overlay}>
              <Text style={styles.eventTitle}>{event.name ?? ""}</Text>
              <Text style={styles.eventDate}>{event.date ?? ""}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  eventScroll: { marginTop: 10 },
  Eventsheading: {
    fontSize: 20,
    color: "#93210A",
    fontWeight: "bold",
    margin: 15,
  },
  eventCard: {
    width: 300,
    height: 250,
    margin: 20,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    padding: 50,
    alignItems: "center",

  },
  eventImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,

  },
  
  eventTitle: {
   fontSize: 14,
    fontWeight: "bold",
    marginTop: 3,
    textAlign: "center",
    color: "#222",

  },
  eventDate: {
     fontSize: 13,
    color: "#93210A",
    marginTop: 4,
    right:-29

  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
