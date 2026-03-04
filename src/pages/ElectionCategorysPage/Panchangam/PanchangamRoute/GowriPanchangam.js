import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function GowriPanchangam({ navigation }) {
  const API_URL =
    "https://hdrss-backend.onrender.com/api/v1/panchangam/gowri-panjagam";

  const TABS = useMemo(
    () => [
      { label: "ஞாயிறு", weekday: 0 },
      { label: "திங்கள்", weekday: 1 },
      { label: "செவ்வாய்", weekday: 2 },
      { label: "புதன்", weekday: 3 },
      { label: "வியாழன்", weekday: 4 },
      { label: "வெள்ளி", weekday: 5 },
      { label: "சனி", weekday: 6 },
    ],
    []
  );

  const [activeWeekday, setActiveWeekday] = useState(new Date().getDay());
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGowri = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(API_URL);
      if (res?.data?.success) {
        setApiData(res.data.data || []);
      } else {
        setError("API success=false வந்துள்ளது");
      }
    } catch (e) {
      setError("API error. Internet/URL check பண்ணுங்க.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGowri();
  }, []);

  const selectedObj = useMemo(() => {
    const list = apiData.filter((x) => x.weekday === activeWeekday);
    if (list.length === 0) return null;

    const y2026 = list.find((x) => Number(x.year) === 2026);
    return y2026 || list[0];
  }, [apiData, activeWeekday]);

  const rows = useMemo(() => {
    const slots = selectedObj?.schedule?.timeSlots || [];
    return slots.map((s) => ({
      time: s.time || "",
      day: { label: s?.day?.type || "பகல்", value: s?.day?.value || "" },
      night: { label: s?.night?.type || "இரவு", value: s?.night?.value || "" },
    }));
  }, [selectedObj]);

  const goodList = useMemo(() => ["லாபம்", "அமிர்", "சுகம்", "தனம்", "உத்தி"], []);
  const badList = useMemo(() => ["விஷம்", "சோரம்", "ரோகம்"], []);

  const colorForValue = (val) => {
    if (goodList.includes(val)) return "#1C9A3E";
    if (badList.includes(val)) return "#D9342B";
    return "#111";
  };

  // Check if current day has data
  const hasData = selectedObj && rows.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => (navigation ? navigation.goBack() : null)}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={Platform.OS === 'web' ? 24 : 22} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.headerTitle}>கௌரி பஞ்சாங்கம்</Text>
        <View style={{ width: Platform.OS === 'web' ? 40 : 34 }} />
      </View>

      {/* Tabs - Horizontal Scroll */}
      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScrollView}
          contentContainerStyle={styles.tabContainer}
        >
          {TABS.map((t) => {
            const active = t.weekday === activeWeekday;
            return (
              <Pressable
                key={t.weekday}
                onPress={() => setActiveWeekday(t.weekday)}
                style={[styles.tabItem, active && styles.tabItemActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            * சூறிய உதயத்தில் இருந்து நேரத்தை கணக்கிட்டு கொள்ளவும்.
          </Text>
        </View>

        {/* Main Card - Always same size */}
        <View style={styles.card}>
          {loading ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator size={Platform.OS === 'web' ? "large" : "small"} color="#8B0000" />
              <Text style={styles.stateText}>Loading...</Text>
            </View>
          ) : error ? (
            <View style={styles.stateContainer}>
              <Text style={styles.errText}>{error}</Text>
              <Pressable onPress={fetchGowri} style={styles.retryBtn}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Good/Bad Section */}
              <View style={styles.goodBadContainer}>
                <Text style={styles.goodBadLine}>
                  <Text style={styles.labelBlack}>சுபம் : </Text>
                  <Text style={styles.goodText}>{goodList.join(", ")}</Text>
                </Text>

                <Text style={[styles.goodBadLine, { marginTop: Platform.OS === 'web' ? 8 : 4 }]}>
                  <Text style={styles.labelBlack}>அசுபம் : </Text>
                  <Text style={styles.badText}>{badList.join(", ")}</Text>
                </Text>
              </View>

              {/* Table */}
              <View style={styles.tableWrap}>
                {/* Table Header */}
                <View style={[styles.tr, styles.trHeader]}>
                  <View style={[styles.tdTime, styles.tdBorder]}>
                    <Text style={styles.thText}>நேரம்</Text>
                  </View>
                  <View style={[styles.tdMid, styles.tdBorder]}>
                    <Text style={styles.thText}>பகல்/இரவு</Text>
                  </View>
                  <View style={styles.tdRight}>
                    <Text style={styles.thText}>கௌரி</Text>
                  </View>
                </View>

                {/* Table Rows - Show either data or placeholders */}
                {hasData ? (
                  // Show actual data
                  rows.map((r, idx) => (
                    <View key={idx} style={styles.blockRow}>
                      <View style={styles.timeCell}>
                        <Text style={styles.timeText}>{r.time}</Text>
                      </View>

                      <View style={styles.twoRows}>
                        <View style={styles.innerRow}>
                          <View style={styles.midCell}>
                            <Text style={styles.midText}>{r.day.label}</Text>
                          </View>
                          <View style={styles.rightCell}>
                            <Text
                              style={[
                                styles.valueText,
                                { color: colorForValue(r.day.value) },
                              ]}
                            >
                              {r.day.value}
                            </Text>
                          </View>
                        </View>

                        <View style={[styles.innerRow, styles.innerRowBottom]}>
                          <View style={styles.midCell}>
                            <Text style={styles.midText}>{r.night.label}</Text>
                          </View>
                          <View style={styles.rightCell}>
                            <Text
                              style={[
                                styles.valueText,
                                { color: colorForValue(r.night.value) },
                              ]}
                            >
                              {r.night.value}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  // Show placeholder rows for days with no data
                  [1, 2, 3, 4, 5].map((item) => (
                    <View key={item} style={styles.blockRow}>
                      <View style={styles.timeCell}>
                        <Text style={styles.placeholderText}>--:--</Text>
                      </View>

                      <View style={styles.twoRows}>
                        <View style={styles.innerRow}>
                          <View style={styles.midCell}>
                            <Text style={styles.placeholderText}>பகல்</Text>
                          </View>
                          <View style={styles.rightCell}>
                            <Text style={styles.placeholderText}>--</Text>
                          </View>
                        </View>

                        <View style={[styles.innerRow, styles.innerRowBottom]}>
                          <View style={styles.midCell}>
                            <Text style={styles.placeholderText}>இரவு</Text>
                          </View>
                          <View style={styles.rightCell}>
                            <Text style={styles.placeholderText}>--</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* No Data Message (if applicable) */}
              {!hasData && !loading && !error && (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>
                    இந்த நாளுக்கு தரவு இல்லை
                  </Text>
                </View>
              )}

              {/* Description (if available) */}
              {hasData && !!selectedObj?.description && (
                <Text style={styles.description}>{selectedObj.description}</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BORDER = "#E0E0E0";
const ANDROID_STATUS_PAD = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
const RED = "#8B0000";

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#FFFFFF",
  },

  // Header styles
  header: {
    paddingTop: Platform.OS === 'android' ? ANDROID_STATUS_PAD : (Platform.OS === 'ios' ? 10 : 0),
    height: Platform.OS === 'web' ? 70 : (52 + (Platform.OS === 'android' ? ANDROID_STATUS_PAD : 0)),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Platform.OS === 'web' ? 20 : 10,
    backgroundColor: RED,
    borderBottomWidth: Platform.OS === 'web' ? 1 : 0,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
  },
  backBtn: {
    width: Platform.OS === 'web' ? 40 : 34,
    height: Platform.OS === 'web' ? 40 : 34,
    borderRadius: Platform.OS === 'web' ? 20 : 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
    ...(Platform.OS === 'web' && {
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: 'rgba(255,255,255,0.25)',
      },
    }),
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: Platform.OS === 'web' ? 22 : 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  // Tab wrapper for web shadow
  tabWrapper: {
    backgroundColor: RED,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
  },
  tabScrollView: { 
    backgroundColor: RED,
  },
  tabContainer: { 
    paddingHorizontal: Platform.OS === 'web' ? 16 : 8, 
    paddingBottom: Platform.OS === 'web' ? 12 : 8, 
    gap: Platform.OS === 'web' ? 8 : 6,
  },
  tabItem: {
    paddingHorizontal: Platform.OS === 'web' ? 22 : 14,
    paddingVertical: Platform.OS === 'web' ? 10 : 7,
    borderRadius: Platform.OS === 'web' ? 25 : 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s',
      ':hover': {
        backgroundColor: 'rgba(255,255,255,0.3)',
      },
    }),
  },
  tabItemActive: { 
    backgroundColor: "#FFFFFF",
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }),
  },
  tabText: { 
    fontSize: Platform.OS === 'web' ? 16 : 14, 
    fontWeight: "700", 
    color: "#FFFFFF",
  },
  tabTextActive: { 
    color: RED,
    fontWeight: "800",
  },

  // Content styles
  content: { 
    padding: Platform.OS === 'web' ? 20 : 12, 
    paddingBottom: Platform.OS === 'web' ? 30 : 18,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      width: '100%',
    }),
  },

  infoBox: {
    backgroundColor: "#3D73F1",
    borderRadius: Platform.OS === 'web' ? 12 : 10,
    paddingVertical: Platform.OS === 'web' ? 14 : 10,
    paddingHorizontal: Platform.OS === 'web' ? 20 : 12,
    marginBottom: Platform.OS === 'web' ? 20 : 10,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
  },
  infoText: { 
    color: "#FFFFFF", 
    fontSize: Platform.OS === 'web' ? 15 : 13.5, 
    fontWeight: "700",
    textAlign: "center",
  },

  // Main card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: Platform.OS === 'web' ? 20 : 14,
    padding: Platform.OS === 'web' ? 20 : 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    minHeight: Platform.OS === 'web' ? 500 : 400,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    } : {
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    }),
  },

  // State containers
  stateContainer: {
    flex: 1,
    minHeight: Platform.OS === 'web' ? 400 : 350,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  stateText: { 
    color: "#666", 
    fontSize: Platform.OS === 'web' ? 16 : 14, 
    fontWeight: "600",
  },
  errText: { 
    color: RED, 
    fontWeight: "800", 
    fontSize: Platform.OS === 'web' ? 16 : 14, 
    textAlign: "center",
    marginBottom: 8,
  },
  retryBtn: {
    backgroundColor: RED,
    paddingHorizontal: Platform.OS === 'web' ? 24 : 12,
    paddingVertical: Platform.OS === 'web' ? 12 : 8,
    borderRadius: Platform.OS === 'web' ? 12 : 10,
    cursor: Platform.OS === 'web' ? 'pointer' : 'auto',
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s',
      ':hover': {
        backgroundColor: '#A00000',
        transform: 'scale(1.05)',
      },
    }),
  },
  retryText: { 
    color: "#FFF", 
    fontWeight: "700",
    fontSize: Platform.OS === 'web' ? 16 : 13,
  },

  // Good/Bad section
  goodBadContainer: {
    backgroundColor: "#FFF0F7",
    borderRadius: Platform.OS === 'web' ? 16 : 12,
    padding: Platform.OS === 'web' ? 20 : 12,
    marginBottom: Platform.OS === 'web' ? 20 : 12,
  },
  goodBadLine: { 
    fontSize: Platform.OS === 'web' ? 17 : 15, 
    lineHeight: Platform.OS === 'web' ? 26 : 21,
  },
  labelBlack: { 
    color: "#333", 
    fontWeight: "700",
    fontSize: Platform.OS === 'web' ? 17 : 15,
  },
  goodText: { 
    color: "#1C9A3E", 
    fontWeight: "800",
    fontSize: Platform.OS === 'web' ? 17 : 15,
  },
  badText: { 
    color: "#D9342B", 
    fontWeight: "800",
    fontSize: Platform.OS === 'web' ? 17 : 15,
  },

  // Table styles
  tableWrap: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: Platform.OS === 'web' ? 12 : 8,
    overflow: "hidden",
    backgroundColor: "#FFF",
    ...(Platform.OS === 'web' && {
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }),
  },
  tr: { 
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
  },
  trHeader: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: "#F5F5F5",
  },

  tdBorder: { 
    borderRightWidth: 1, 
    borderRightColor: BORDER 
  },
  tdTime: { 
    width: Platform.OS === 'web' ? 100 : 88, 
    paddingVertical: Platform.OS === 'web' ? 12 : 8, 
    alignItems: "center",
    justifyContent: "center",
  },
  tdMid: { 
    width: Platform.OS === 'web' ? 90 : 74, 
    paddingVertical: Platform.OS === 'web' ? 12 : 8, 
    alignItems: "center",
    justifyContent: "center",
  },
  tdRight: { 
    flex: 1, 
    paddingVertical: Platform.OS === 'web' ? 12 : 8, 
    alignItems: "center",
    justifyContent: "center",
  },

  thText: { 
    fontSize: Platform.OS === 'web' ? 15 : 14, 
    fontWeight: "800", 
    color: "#333",
  },

  blockRow: { 
    flexDirection: "row", 
    borderBottomWidth: 1, 
    borderBottomColor: BORDER,
    backgroundColor: "#FFF",
  },

  timeCell: {
    width: Platform.OS === 'web' ? 100 : 88,
    borderRightWidth: 1,
    borderRightColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Platform.OS === 'web' ? 14 : 10,
    paddingHorizontal: 6,
    backgroundColor: "#FAFAFA",
  },
  timeText: { 
    fontSize: Platform.OS === 'web' ? 15 : 14, 
    fontWeight: "600", 
    color: "#333",
  },

  twoRows: { 
    flex: 1,
  },

  innerRow: { 
    flexDirection: "row", 
    minHeight: Platform.OS === 'web' ? 48 : 38,
    backgroundColor: "#FFF",
  },
  innerRowBottom: { 
    borderTopWidth: 1, 
    borderTopColor: BORDER,
    backgroundColor: "#F9F9F9",
  },

  midCell: {
    width: Platform.OS === 'web' ? 90 : 74,
    borderRightWidth: 1,
    borderRightColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  midText: { 
    fontSize: Platform.OS === 'web' ? 15 : 14, 
    fontWeight: "700", 
    color: "#333",
  },

  rightCell: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  valueText: { 
    fontSize: Platform.OS === 'web' ? 16 : 15, 
    fontWeight: "900",
  },

  placeholderText: {
    fontSize: Platform.OS === 'web' ? 15 : 14,
    fontWeight: "500",
    color: "#999",
  },

  description: { 
    marginTop: Platform.OS === 'web' ? 16 : 8, 
    color: "#666", 
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontStyle: "italic",
    lineHeight: Platform.OS === 'web' ? 22 : 18,
    paddingHorizontal: 4,
  },

  noDataContainer: {
    marginTop: Platform.OS === 'web' ? 20 : 16,
    paddingVertical: Platform.OS === 'web' ? 16 : 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F0",
    borderRadius: Platform.OS === 'web' ? 12 : 8,
    borderWidth: 1,
    borderColor: "#FFCDD2",
    borderStyle: "dashed",
  },
  noDataText: {
    color: RED,
    fontSize: Platform.OS === 'web' ? 15 : 14,
    fontWeight: "700",
    textAlign: "center",
  },
});