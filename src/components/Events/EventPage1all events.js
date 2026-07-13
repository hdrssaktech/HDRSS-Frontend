import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  SafeAreaView,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { getEvents } from "../../Controller/EventController/EventController";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const parseEventDate = (dateStr) => {
  if (!dateStr) return null;
  const native = new Date(dateStr);
  if (!isNaN(native.getTime())) return native;
  const parts = String(dateStr).trim().split(" ");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTH_NAMES.findIndex(
      (m) => m.toLowerCase() === parts[1].toLowerCase()
    );
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }
  return null;
};

const getEventStatus = (event) => {
  if (event.status) return String(event.status).toLowerCase();
  const eventDate = parseEventDate(event.date);
  if (!eventDate) return "upcoming";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  if (eventDate.getTime() === today.getTime()) return "ongoing";
  return eventDate.getTime() > today.getTime() ? "upcoming" : "past";
};

const groupEventsByMonth = (list, order = "asc") => {
  const map = new Map();
  list.forEach((event) => {
    const d = parseEventDate(event.date);
    const monthKey = d
      ? `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`
      : "unknown";
    const monthLabel = d
      ? `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
      : "Other";
    if (!map.has(monthKey)) {
      map.set(monthKey, {
        key: monthKey,
        label: monthLabel,
        sortValue: d ? d.getTime() : 0,
        items: [],
      });
    }
    map.get(monthKey).items.push(event);
  });
  const groups = Array.from(map.values());
  groups.sort((a, b) =>
    order === "asc" ? a.sortValue - b.sortValue : b.sortValue - a.sortValue
  );
  return groups;
};

const STATUS_META = {
  upcoming: { label: "UPCOMING", bg: "#FDE9B6", color: "#8B4D00" },
  ongoing: { label: "ONGOING", bg: "#D9F2D9", color: "#1F7A1F" },
  past: { label: "PAST", bg: "#E6E6E6", color: "#666666" },
};

// Modern Tabs
const TABS = [
  { key: "all", label: "All", icon: "grid-outline" },
  { key: "upcoming", label: "Upcoming", icon: "calendar-outline" },
  { key: "past", label: "Past", icon: "checkmark-done-outline" },
];

const MonthDivider = ({ label, styles }) => (
  <View style={styles.monthDividerRow}>
    <View style={styles.monthDividerLine} />
    <Text style={styles.monthDividerText}>{label}</Text>
    <View style={styles.monthDividerLine} />
  </View>
);

const EventListCard = ({ event, styles, onPress }) => {
  const status = getEventStatus(event);
  const meta = STATUS_META[status] || STATUS_META.upcoming;

  return (
    <TouchableOpacity
      style={styles.listCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image source={{ uri: event.image }} style={styles.listCardImage} />
      <View style={styles.listCardContent}>
        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
          <Text style={[styles.statusBadgeText, { color: meta.color }]}>
            {meta.label}
          </Text>
        </View>
        <Text style={styles.listCardTitle} numberOfLines={1}>
          {event.name}
        </Text>
        <View style={styles.listCardInfoRow}>
          <Ionicons name="calendar-outline" size={13} color="#8B1E12" />
          <Text style={styles.listCardInfoText}>
            {event.date || "Date TBA"}
          </Text>
        </View>
        {event.location && (
          <View style={styles.listCardInfoRow}>
            <Ionicons name="location-outline" size={13} color="#8B1E12" />
            <Text style={styles.listCardInfoText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#aaa" />
    </TouchableOpacity>
  );
};

export default function AllEventsPage() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const styles = getStyles(isTablet);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getEvents();
      const sortedData = data.sort((a, b) => {
        const orderA = a.orderNo ?? Infinity;
        const orderB = b.orderNo ?? Infinity;
        return orderA - orderB;
      });
      setEvents(sortedData);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeTab === "all") return events;
    return events.filter((event) => getEventStatus(event) === activeTab);
  }, [events, activeTab]);

  const groupedSections = useMemo(() => {
    if (activeTab === "upcoming" || activeTab === "past") {
      return groupEventsByMonth(filteredEvents, activeTab === "upcoming" ? "asc" : "desc");
    }
    return null;
  }, [filteredEvents, activeTab]);

  const goToEvent = (event) => navigation.navigate("EventPage2", { event });

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={isTablet ? 26 : 22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Events</Text>
        <View style={{ width: isTablet ? 40 : 36 }} />
      </View>

      {/* Modern Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabPill, active && styles.tabPillActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={tab.icon}
                  size={isTablet ? 18 : 15}
                  color={active ? "#fff" : "#93210A"}
                />
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab.label}
                </Text>
                {active && (
                  <View style={styles.tabIndicator} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      {loading ? null : (
        <ScrollView
          style={styles.listScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No events in this category</Text>
            </View>
          ) : groupedSections ? (
            groupedSections.map((group) => (
              <View key={group.key}>
                <MonthDivider label={group.label} styles={styles} />
                {group.items.map((event) => (
                  <EventListCard
                    key={event.id}
                    event={event}
                    styles={styles}
                    onPress={() => goToEvent(event)}
                  />
                ))}
              </View>
            ))
          ) : (
            filteredEvents.map((event) => (
              <EventListCard
                key={event.id}
                event={event}
                styles={styles}
                onPress={() => goToEvent(event)}
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const getStyles = (isTablet) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: "#FBEEDB",
    },

    /* Header */
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
      color: "white",
      fontWeight: "bold",
      fontSize: isTablet ? 26 : 20,
    },

    /* Tabs */
    tabsWrapper: {
      backgroundColor: "#FBEEDB",
      paddingVertical: isTablet ? 8 : 5,
      borderBottomWidth: 1,
      borderBottomColor: "#E8DCC8",
    },

    tabsScrollContent: {
      paddingHorizontal: isTablet ? 20 : 12,
      alignItems: "center",
    },

    tabPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: isTablet ? 10 : 8,
      paddingHorizontal: isTablet ? 20 : 14,
      borderRadius: 25,
      backgroundColor: "#fff",
      borderWidth: 1.5,
      borderColor: "#D4AF37",
      marginRight: 10,
      position: "relative",
    },

    tabPillActive: {
      backgroundColor: "#93210A",
      borderColor: "#93210A",
      elevation: 4,
      shadowColor: "#93210A",
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },

    tabText: {
      fontSize: isTablet ? 15 : 13,
      fontWeight: "600",
      color: "#93210A",
    },

    tabTextActive: {
      color: "#fff",
    },

    tabIndicator: {
      position: "absolute",
      bottom: -3,
      left: "30%",
      right: "30%",
      height: 3,
      backgroundColor: "#FFD700",
      borderRadius: 2,
    },

    /* List */
    listScroll: {
      flex: 1,
    },

    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 80,
    },

    emptyText: {
      marginTop: 12,
      color: "#888",
      fontSize: isTablet ? 16 : 14,
      fontWeight: "600",
    },

    /* Month Divider */
    monthDividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: isTablet ? 30 : 16,
      marginTop: isTablet ? 26 : 20,
      marginBottom: isTablet ? 12 : 8,
    },

    monthDividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: "#D4AF37",
    },

    monthDividerText: {
      marginHorizontal: 10,
      fontSize: isTablet ? 15 : 13,
      fontWeight: "700",
      color: "#93210A",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    /* Event List Card */
    listCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 14,
      marginHorizontal: isTablet ? 30 : 16,
      marginTop: isTablet ? 12 : 8,
      padding: isTablet ? 14 : 12,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },

    listCardImage: {
      width: isTablet ? 90 : 75,
      height: isTablet ? 90 : 75,
      borderRadius: 10,
      marginRight: 14,
    },

    listCardContent: {
      flex: 1,
    },

    statusBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      marginBottom: 4,
    },

    statusBadgeText: {
      fontSize: 9,
      fontWeight: "700",
      letterSpacing: 0.3,
    },

    listCardTitle: {
      fontSize: isTablet ? 16 : 14,
      fontWeight: "bold",
      color: "#222",
      marginBottom: 2,
    },

    listCardInfoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 2,
    },

    listCardInfoText: {
      fontSize: isTablet ? 13 : 12,
      color: "#666",
    },
  });