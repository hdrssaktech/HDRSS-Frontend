import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMembers } from "../../api/api";


const numColumns = 2;

export default function Membership() {
  const navigation = useNavigation();
  const route = useRoute();
  // const route = useRoute();
const { categoryType, districtId, districtName } = route.params || {};
  // const { categoryType } = route.params || {}; 

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchMembers = async () => {
    try {
      const data = await getMembers();

      // ✅ Fix: match 'Districts' or 'State' based on your data
      const filtered = data.filter(
        (m) =>
          m.categoryType.toLowerCase() === categoryType?.toLowerCase() &&
          m.district?.toLowerCase() === districtName?.toLowerCase()
      );

      setMembers(filtered);

      console.log("✅ Filtered Members:", filtered.length);
      console.log("Category:", categoryType);
      console.log("District:", districtName);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchMembers();
}, [categoryType, districtName]);


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.image || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>ID: {item.uniqueId}</Text>
      <Text style={styles.category}>{item.categoryType}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {categoryType === "State" ? "State Leaders" : "District Leaders"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#93210A"
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={members}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={numColumns}
            columnWrapperStyle={{ justifyContent: "space-around" }}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", marginTop: 20, color: "#555" }}
              >
                No members found
              </Text>
            }
          />
        )}

        {/* Join Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => navigation.navigate("Member1")}
          >
            <Text style={styles.joinButtonText}>Join With Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 4,
    padding: 10,
    margin: 10,
    width: "45%",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  detail: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
  },
  category: {
    fontSize: 13,
    color: "#93210A",
    fontWeight: "600",
    marginTop: 4,
  },
  footer: { marginTop: 20, alignItems: "center" },
  joinButton: {
    backgroundColor: "#93210A",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  joinButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});