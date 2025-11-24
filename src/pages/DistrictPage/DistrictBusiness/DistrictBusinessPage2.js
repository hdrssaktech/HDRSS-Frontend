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
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";

export default function DistrictBusinessPage2({ route, navigation }) {
  const { businessId, businessName } = route.params || {};

  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchCategoryList = async () => {
    try {
      const apiUrl = `https://hdrss-backend.onrender.com/api/business/category/businessId/${businessId}`;
      const res = await axios.get(apiUrl);
      setCategoryList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("❌ ERROR fetching:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E37714" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* SAME HEADER AS PAGE 3 */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.appBarTitle}>{businessName || "Categories"}</Text>

        <View style={{ width: 30 }} />
      </View>

      {/* GRID LIST */}
      <FlatList
        data={categoryList}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("DistrictBusinessPage3", {
                businessDetailsId: item.id,
              })
            }
          >
            <Image
              source={{
                uri:
                  item.imageUrl?.trim() !== ""
                    ? item.imageUrl
                    : "https://via.placeholder.com/150",
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // SAME HEADER STYLE FROM PAGE 3
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
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});
