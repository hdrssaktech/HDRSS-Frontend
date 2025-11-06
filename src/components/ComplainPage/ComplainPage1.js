// src/pages/ComplaintPage1.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchComplaints } from "../../Controller/ComplaintController/ComplaintController";

export default function ComplaintPage1({ navigation, route }) {
  const { districtName } = route.params || {};
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  // ✅ Fetch complaints
  const loadComplaints = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const data = await fetchComplaints(token);
      const filteredData = districtName
  ? data.filter(
      (item) =>
        item.title &&
        item.title.toLowerCase().includes(districtName.toLowerCase())
    )
  : data;
      setComplaints(filteredData || []);
    } catch (err) {
      console.error("Error loading complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // ✅ Add new complaint
  useEffect(() => {
    if (route.params?.newComplaint) {
      setComplaints((prev) => [route.params.newComplaint, ...prev]);
    }
  }, [route.params?.newComplaint]);

  // ✅ Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadComplaints().then(() => setRefreshing(false));
  }, []);

  // ✅ Status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "open":
      case "send":
        return "#f1a326ff";
      case "completed":
      case "solved":
        return "#27ae60";
      case "progress":
      case "processing":
        return "#3498db";
      default:
        return "#7f8c8d";
    }
  };

  // ✅ Count logic
  const solvedCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "completed"
  ).length;

  const runningCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "progress"
  ).length;

  // ✅ Only count non-progress & non-completed for Total
  const totalCount = complaints.filter(
    (c) =>
      c.status?.toLowerCase() !== "completed" &&
      c.status?.toLowerCase() !== "progress"
  ).length;

  // ✅ Filter logic (Exclude progress/completed from "all")
  const filteredComplaints = complaints.filter((c) => {
    const s = c.status?.toLowerCase();
    if (filter === "solved") return s === "completed";
    if (filter === "running") return s === "progress";
    if (filter === "all")
      return s !== "completed" && s !== "progress"; // exclude progress & completed
    return true;
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text>Loading complaints...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("HomePage")}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* New Complaint Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.newComplaintBtn}
          onPress={() => navigation.navigate("NewComplain", { districtName })}
        >
          <Ionicons name="add" size={25} color="#93210A" />
          <Text style={styles.newComplaintText}>New Complaint</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={() => setFilter("all")}>
          <StatBox number={totalCount} label="Total" active={filter === "all"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("solved")}>
          <StatBox
            number={solvedCount}
            label="Solved"
            active={filter === "solved"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("running")}>
          <StatBox
            number={runningCount}
            label="Running"
            active={filter === "running"}
          />
        </TouchableOpacity>
      </View>

      {/* Complaint List */}
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
          {districtName ? `Complaints for ${districtName}` : "Recent Complaints"}
        </Text>


        {filteredComplaints.length === 0 ? (
          <Text style={styles.noDataText}>No complaints found.</Text>
        ) : (
          filteredComplaints.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.complaintCard}
              onPress={() =>
                navigation.navigate("ComplainDetails", { complaint: item })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.titleText}>{item.title || "No Title"}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={16} color="#93210A" />
                <Text style={styles.infoText}>{item.name || "N/A"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color="#93210A" />
                <Text style={styles.infoText}>
                  {item.phoneNumber || "Unknown"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#93210A" />
                <Text style={styles.infoText}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const StatBox = ({ number, label, active }) => (
  <View style={[styles.statBox, active && { opacity: 1 }]}>
    <View
      style={[
        styles.statSquare,
        active && { backgroundColor: "#fff" },
        active && styles.activeBorder,
      ]}
    >
      <Text
        style={[
          styles.statNumber,
          active && { color: "#fff", backgroundColor: "#93210A" },
        ]}
      >
        {number}
      </Text>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    padding: 15,
    paddingTop: 50,
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 40,
    zIndex: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 17,
    backgroundColor: "#ccc",
    marginHorizontal: 39,
  },
  name: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  id: { color: "#fff", fontSize: 14 },
  buttonContainer: {
    backgroundColor: "#93210A",
    alignItems: "center",
    paddingBottom: 15,
  },
  newComplaintBtn: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    marginTop:50,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderWidth: 1,
    borderColor: "#93210A",
  },
  newComplaintText: {
    color: "#93210A",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 9,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#93210A",
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  statBox: { alignItems: "center", opacity: 0.9 },
  statSquare: {
    width: 50,
    height: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    marginVertical: 10,
  },
  activeBorder: { borderWidth: 2, borderColor: "#fff" },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  statLabel: { fontSize: 14, color: "#fff" },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginHorizontal: 20,
    marginVertical: 15,
    color: "#93210A",
  },
  complaintCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#93210A",
    flex: 1,
    lineHeight: 25,
  },
  statusBadge: { borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 },
  statusText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", marginVertical: 3 },
  infoText: { fontSize: 14, color: "#333", marginLeft: 6 },
  noDataText: { textAlign: "center", color: "#999", fontSize: 15, marginTop: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
