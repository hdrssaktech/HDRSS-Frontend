import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

export default function DistrictBusinessPage0() {
  const route = useRoute();
  const navigation = useNavigation();

  const { districtId, districtName } = route.params || {};

  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const url = `https://hdrss-backend.onrender.com/api/business/type/district/${districtId}`;
        console.log("🔍 FETCH =", url);

        const res = await axios.get(url);

        if (res.data?.resultData && Array.isArray(res.data.resultData)) {
          setBusinessList(res.data.resultData);
        } else {
          setBusinessList([]);
        }
      } catch (err) {
        console.log("❌ Error =", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [districtId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E37714" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* 🔥 NEW HEADER (same as DistrictBusinessPage3) */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.appBarTitle}>{districtName} Business</Text>

        <View style={{ width: 30 }} />
      </View>

      {/* BUSINESS LIST */}
      <FlatList
        data={businessList}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("DistrictBusinessPage1", {
                businessId: item.id,
                businessName: item.name,
              })
            }
          >
            <Image
              source={{
                uri:
                  item.imageUrl?.trim() !== ""
                    ? item.imageUrl
                    : "https://via.placeholder.com/200x200?text=No+Image",
              }}
              style={styles.image}
            />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* 🔥 SAME HEADER STYLE AS DistrictBusinessPage3 */
  appBar: {
    height: 90,
    paddingTop: 40,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    justifyContent: "space-between",
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    margin: "1%",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  name: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
    color: "#222",
  },
});
