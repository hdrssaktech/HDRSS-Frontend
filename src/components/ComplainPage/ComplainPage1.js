import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchComplaints } from "../../Controller/ComplaintController/ComplaintController";
import Loader from "../Alert/Loader";
import { useRoute } from "@react-navigation/native";

/* ---------- Device Check ---------- */
const { width } = Dimensions.get("window");
const isTablet = width >= 600; // ✅ Tablet breakpoint

export default function ComplaintPage1({ navigation,route}) {
  const { districtName } = route.params || {};

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  /* ---------- Fetch Complaints ---------- */
  const loadComplaints = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token missing");

      const data = await fetchComplaints(token);

      const filteredData = districtName
        ? data.filter(
            (item) =>
              item.title &&
              item.title.toLowerCase().includes(districtName.toLowerCase())
          )
        : data;
          setComplaints(filteredData || []);
    } catch (error) {
      console.error("Error loading complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  /* ---------- Pull To Refresh ---------- */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadComplaints().then(() => setRefreshing(false));
  }, []);

  /* ---------- Status Color ---------- */
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "open":
      case "send":
        return "#f1a326ff";
      case "completed":
        return "#27ae60";
      case "progress":
        return "#3498db";
      default:
        return "#7f8c8d";
    }
  };

  /* ---------- Counts ---------- */
  const solvedCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "completed"
  ).length;

  const runningCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "progress"
  ).length;

  const totalCount = complaints.filter(
    (c) =>
      c.status?.toLowerCase() !== "completed" &&
      c.status?.toLowerCase() !== "progress"
  ).length;

  /* ---------- Filter ---------- */
  const filteredComplaints = complaints.filter((c) => {
    const s = c.status?.toLowerCase();
    if (filter === "solved") return s === "completed";
    if (filter === "running") return s === "progress";
    if (filter === "all") return s !== "completed" && s !== "progress";
    return true;
  });

  /* ---------- Loader ---------- */
  if (loading) {
    return (
     <Loader/>
    );
  }

  return (
    <View style={styles.container}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
         onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint</Text>
      </View>

      {/* ---------- New Complaint ---------- */}
      
      {districtName ? <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.newComplaintBtn}
          onPress={() =>
            navigation.navigate("NewComplain", { districtName })
          }
        >
          <Ionicons name="add" size={24} color="#93210A" />
          <Text style={styles.newComplaintText}>New Complaint</Text>
        </TouchableOpacity>
      </View> : null}
     

      {/* ---------- Stats ---------- */}
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

      {/* ---------- Complaint List ---------- */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>
          {districtName
            ? `Complaints for ${districtName}`
            : "Recent Complaints"}
        </Text>

        <View style={styles.gridContainer}>
          {filteredComplaints.length === 0 ? (
            <Text style={styles.noDataText}>No complaints found.</Text>
          ) : (
            filteredComplaints.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.complaintCard,
                  isTablet && styles.tabletCard, // ✅ Tablet = 2 columns
                ]}
                onPress={() =>
                  navigation.navigate("ComplainDetails", { complaint: item })
                }
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.titleText}>
                    {item.title || "No Title"}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                <InfoRow icon="person-outline" text={item.name || "N/A"} />
                <InfoRow
                  icon="call-outline"
                  text={item.phoneNumber || "Unknown"}
                />
                <InfoRow
                  icon="calendar-outline"
                  text={new Date(item.date).toLocaleDateString()}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Small Components ---------- */

const InfoRow = ({ icon, text }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={16} color="#93210A" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const StatBox = ({ number, label, active }) => (
  <View style={[styles.statBox, active && { opacity: 1 }]}>
    <View style={[styles.statSquare, active && styles.activeBorder]}>
      <Text style={styles.statNumber}>{number}</Text>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    backgroundColor: "#93210A",
    paddingTop: 50,
    paddingBottom: 15,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 45,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  buttonContainer: {
    backgroundColor: "#93210A",
    alignItems: "center",
    paddingBottom: 15,
  },
  newComplaintBtn: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderWidth: 1,
    borderColor: "#93210A",
    marginTop: 20,
  },
  newComplaintText: {
    color: "#93210A",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
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
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#93210A" },
  statLabel: { fontSize: 14, color: "#fff" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    margin: 15,
    textAlign: "center",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  complaintCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    width: "100%", // 📱 Mobile
    elevation: 3,
  },

  tabletCard: {
    width: "48%", // 📲 Tablet
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  titleText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#93210A",
    flex: 1,
  },

  statusBadge: {
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "bold" },

  infoRow: { flexDirection: "row", alignItems: "center", marginVertical: 3 },
  infoText: { marginLeft: 6, fontSize: 14, color: "#333" },

  noDataText: { textAlign: "center", color: "#999", marginTop: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
