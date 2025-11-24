import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

export default function DistrictBusinessPage3({ route, navigation }) {
  const { businessDetailsId } = route.params;

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const url = `https://hdrss-backend.onrender.com/api/business/details/${businessDetailsId}`;
      const res = await axios.get(url);
      setDetails(res.data.data || []);
    } catch (e) {
      console.log("❌ Error fetching:", e);
    } finally {
      setLoading(false);
    }
  };

  const callNow = (num) => num && Linking.openURL(`tel:${num}`);
  const whatsappNow = (num) => num && Linking.openURL(`https://wa.me/${num}`);
  const openMap = (url) => url && Linking.openURL(url);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E37714" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F7FB" }}>
      {/* HEADER */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Business List</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* BUSINESS LIST */}
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {details.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate("DistrictBusinessPage4", { item })
            }
          >
            <View style={styles.card}>
              {/* IMAGE */}
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

              {/* TEXT + ACTIONS */}
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.category}</Text>

                {/* ⭐ LOCATION TEXT ADDED HERE */}
                {item.location ? (
                  <Text style={styles.locationText}>📍 {item.location}</Text>
                ) : null}

                {/* CONTACT BUTTONS */}
                <View style={{ flexDirection: "row", marginTop: 12 }}>
                  <TouchableOpacity
                    onPress={() => callNow(item.phoneNo)}
                    style={[styles.iconBtn, { backgroundColor: "#8EC9FF" }]}
                  >
                    <Icon name="call" size={18} color="#005BBB" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      whatsappNow(item.whatsappNo || item.phoneNo)
                    }
                    style={[styles.iconBtn, { backgroundColor: "#CFFDE1" }]}
                  >
                    <Icon name="logo-whatsapp" size={18} color="#25D366" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => openMap(item.mapUrl)}
                    style={[styles.iconBtn, { backgroundColor: "#FFD7C2" }]}
                  >
                    <Icon name="map" size={18} color="#FF5722" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  appBar: {
    height: 90,
    paddingTop: 40,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    justifyContent: "space-between",
  },
  appBarTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
  },

  cardImage: {
    width: 110,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#eee",
  },

  cardTitle: { fontSize: 17, fontWeight: "700", color: "#222" },
  cardSubtitle: { marginTop: 4, color: "#666" },

  // ⭐ LOCATION STYLE
  locationText: {
    marginTop: 4,
    color: "#444",
    fontSize: 14,
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
