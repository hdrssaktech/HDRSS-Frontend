import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av"; // ✅ Import Video player
import { fetchElectionById } from "../../../Controller/ElectionVotePageController/ElectionVotePageController";

export default function ElectionVotePage2({ route, navigation }) {
  const { id } = route.params;
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadElection = async () => {
      try {
        const data = await fetchElectionById(id);
        setElection(data);
      } catch (error) {
        console.error("Error loading election:", error);
      } finally {
        setLoading(false);
      }
    };
    loadElection();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#8B1C0D" />
      </View>
    );
  }

  if (!election) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>No data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{election.name}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Image source={{ uri: election.image }} style={styles.image} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <Text style={styles.sectionText}>{election.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>District</Text>
          <Text style={styles.sectionText}>{election.district}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>{election.about}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {election.gallery &&
              election.gallery
                .filter((g) => g !== null)
                .map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={styles.galleryImage}
                  />
                ))}
          </ScrollView>
        </View>

        {/* ✅ MP4 Video Player */}
        {election.video && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Watch Video</Text>
            <Video
              source={{ uri: election.video }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay={false} // Auto play can be set to true if you want
              useNativeControls
              style={styles.video}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  image: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 15,
  },
  section: { marginHorizontal: 20, marginBottom: 15 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 6,
  },
  sectionText: { fontSize: 14, color: "#333" },
  galleryImage: {
    width: 150,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8B1C0D",
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#000",
  },
});
