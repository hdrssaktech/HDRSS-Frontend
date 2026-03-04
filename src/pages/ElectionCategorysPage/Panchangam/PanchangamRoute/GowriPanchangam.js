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
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Loader from "../../../../components/Alert/Loader";

export default function GowriPanchangam({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLandscape = width > height;

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

      <View style={[styles.header, isTablet && styles.headerTablet]}>
       <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>

        <Text style={[
          styles.headerTitle,
          isTablet && styles.headerTitleTablet
        ]}>
          கௌரி பஞ்சாங்கம்
        </Text>
        <View style={{ 
          width: isTablet ? 60 : (Platform.OS === 'web' ? 40 : 34) 
        }} />
      </View>

      {/* Tabs - Horizontal Scroll */}
      <View style={[
        styles.tabWrapper,
        isTablet && styles.tabWrapperTablet
      ]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScrollView}
          contentContainerStyle={[
            styles.tabContainer,
            isTablet && styles.tabContainerTablet
          ]}
        >
          {TABS.map((t) => {
            const active = t.weekday === activeWeekday;
            return (
              <Pressable
                key={t.weekday}
                onPress={() => setActiveWeekday(t.weekday)}
                style={[
                  styles.tabItem, 
                  active && styles.tabItemActive,
                  isTablet && styles.tabItemTablet,
                  isLandscape && styles.tabItemLandscape
                ]}
              >
                <Text style={[
                  styles.tabText, 
                  active && styles.tabTextActive,
                  isTablet && styles.tabTextTablet
                ]}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isTablet && styles.contentTablet,
          isLandscape && styles.contentLandscape
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Box */}
        <View style={[
          styles.infoBox,
          isTablet && styles.infoBoxTablet
        ]}>
          <Text style={[
            styles.infoText,
            isTablet && styles.infoTextTablet
          ]}>
            * சூறிய உதயத்தில் இருந்து நேரத்தை கணக்கிட்டு கொள்ளவும்.
          </Text>
        </View>

        {/* Main Card - Always same size */}
        <View style={[
          styles.card,
          isTablet && styles.cardTablet,
          isLandscape && styles.cardLandscape
        ]}>
          {loading ? (
            <Loader/>
          ) : error ? (
            <View style={[
              styles.stateContainer,
              isTablet && styles.stateContainerTablet
            ]}>
              <Text style={[
                styles.errText,
                isTablet && styles.errTextTablet
              ]}>
                {error}
              </Text>
              <Pressable 
                onPress={fetchGowri} 
                style={[
                  styles.retryBtn,
                  isTablet && styles.retryBtnTablet
                ]}
              >
                <Text style={[
                  styles.retryText,
                  isTablet && styles.retryTextTablet
                ]}>
                  Retry
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Good/Bad Section */}
              <View style={[
                styles.goodBadContainer,
                isTablet && styles.goodBadContainerTablet
              ]}>
                <Text style={[
                  styles.goodBadLine,
                  isTablet && styles.goodBadLineTablet
                ]}>
                  <Text style={[
                    styles.labelBlack,
                    isTablet && styles.labelBlackTablet
                  ]}>
                    சுபம் : 
                  </Text>
                  <Text style={[
                    styles.goodText,
                    isTablet && styles.goodTextTablet
                  ]}>
                    {" "}{goodList.join(", ")}
                  </Text>
                </Text>

                <Text style={[
                  styles.goodBadLine, 
                  { marginTop: isTablet ? 12 : (Platform.OS === 'web' ? 8 : 4) },
                  isTablet && styles.goodBadLineTablet
                ]}>
                  <Text style={[
                    styles.labelBlack,
                    isTablet && styles.labelBlackTablet
                  ]}>
                    அசுபம் : 
                  </Text>
                  <Text style={[
                    styles.badText,
                    isTablet && styles.badTextTablet
                  ]}>
                    {" "}{badList.join(", ")}
                  </Text>
                </Text>
              </View>

              {/* Table */}
              <View style={[
                styles.tableWrap,
                isTablet && styles.tableWrapTablet
              ]}>
                {/* Table Header */}
                <View style={[styles.tr, styles.trHeader]}>
                  <View style={[
                    styles.tdTime, 
                    styles.tdBorder,
                    isTablet && styles.tdTimeTablet
                  ]}>
                    <Text style={[
                      styles.thText,
                      isTablet && styles.thTextTablet
                    ]}>
                      நேரம்
                    </Text>
                  </View>
                  <View style={[
                    styles.tdMid, 
                    styles.tdBorder,
                    isTablet && styles.tdMidTablet
                  ]}>
                    <Text style={[
                      styles.thText,
                      isTablet && styles.thTextTablet
                    ]}>
                      பகல்/இரவு
                    </Text>
                  </View>
                  <View style={[
                    styles.tdRight,
                    isTablet && styles.tdRightTablet
                  ]}>
                    <Text style={[
                      styles.thText,
                      isTablet && styles.thTextTablet
                    ]}>
                      கௌரி
                    </Text>
                  </View>
                </View>

                {/* Table Rows - Show either data or placeholders */}
                {hasData ? (
                  // Show actual data
                  rows.map((r, idx) => (
                    <View key={idx} style={styles.blockRow}>
                      <View style={[
                        styles.timeCell,
                        isTablet && styles.timeCellTablet
                      ]}>
                        <Text style={[
                          styles.timeText,
                          isTablet && styles.timeTextTablet
                        ]}>
                          {r.time}
                        </Text>
                      </View>

                      <View style={styles.twoRows}>
                        <View style={[
                          styles.innerRow,
                          isTablet && styles.innerRowTablet
                        ]}>
                          <View style={[
                            styles.midCell,
                            isTablet && styles.midCellTablet
                          ]}>
                            <Text style={[
                              styles.midText,
                              isTablet && styles.midTextTablet
                            ]}>
                              {r.day.label}
                            </Text>
                          </View>
                          <View style={[
                            styles.rightCell,
                            isTablet && styles.rightCellTablet
                          ]}>
                            <Text
                              style={[
                                styles.valueText,
                                { color: colorForValue(r.day.value) },
                                isTablet && styles.valueTextTablet
                              ]}
                            >
                              {r.day.value}
                            </Text>
                          </View>
                        </View>

                        <View style={[
                          styles.innerRow, 
                          styles.innerRowBottom,
                          isTablet && styles.innerRowTablet
                        ]}>
                          <View style={[
                            styles.midCell,
                            isTablet && styles.midCellTablet
                          ]}>
                            <Text style={[
                              styles.midText,
                              isTablet && styles.midTextTablet
                            ]}>
                              {r.night.label}
                            </Text>
                          </View>
                          <View style={[
                            styles.rightCell,
                            isTablet && styles.rightCellTablet
                          ]}>
                            <Text
                              style={[
                                styles.valueText,
                                { color: colorForValue(r.night.value) },
                                isTablet && styles.valueTextTablet
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
                      <View style={[
                        styles.timeCell,
                        isTablet && styles.timeCellTablet
                      ]}>
                        <Text style={[
                          styles.placeholderText,
                          isTablet && styles.placeholderTextTablet
                        ]}>
                          --:--
                        </Text>
                      </View>

                      <View style={styles.twoRows}>
                        <View style={[
                          styles.innerRow,
                          isTablet && styles.innerRowTablet
                        ]}>
                          <View style={[
                            styles.midCell,
                            isTablet && styles.midCellTablet
                          ]}>
                            <Text style={[
                              styles.placeholderText,
                              isTablet && styles.placeholderTextTablet
                            ]}>
                              பகல்
                            </Text>
                          </View>
                          <View style={[
                            styles.rightCell,
                            isTablet && styles.rightCellTablet
                          ]}>
                            <Text style={[
                              styles.placeholderText,
                              isTablet && styles.placeholderTextTablet
                            ]}>
                              --
                            </Text>
                          </View>
                        </View>

                        <View style={[
                          styles.innerRow, 
                          styles.innerRowBottom,
                          isTablet && styles.innerRowTablet
                        ]}>
                          <View style={[
                            styles.midCell,
                            isTablet && styles.midCellTablet
                          ]}>
                            <Text style={[
                              styles.placeholderText,
                              isTablet && styles.placeholderTextTablet
                            ]}>
                              இரவு
                            </Text>
                          </View>
                          <View style={[
                            styles.rightCell,
                            isTablet && styles.rightCellTablet
                          ]}>
                            <Text style={[
                              styles.placeholderText,
                              isTablet && styles.placeholderTextTablet
                            ]}>
                              --
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* No Data Message (if applicable) */}
              {!hasData && !loading && !error && (
                <View style={[
                  styles.noDataContainer,
                  isTablet && styles.noDataContainerTablet
                ]}>
                  <Text style={[
                    styles.noDataText,
                    isTablet && styles.noDataTextTablet
                  ]}>
                    இந்த நாளுக்கு தரவு இல்லை
                  </Text>
                </View>
              )}

              {/* Description (if available) */}
              {hasData && !!selectedObj?.description && (
                <Text style={[
                  styles.description,
                  isTablet && styles.descriptionTablet
                ]}>
                  {selectedObj.description}
                </Text>
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
  headerTablet: {
    height: 80,
    paddingHorizontal: 30,
  },
  headerLandscape: {
    height: 70,
  },
  backButton:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  backButtonTablet:{
    width: 50,
    height: 50,
    borderRadius: 25,
  },


  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 22,
  },

  // Tab wrapper for web shadow
  tabWrapper: {
    backgroundColor: RED,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
  },
  tabWrapperTablet: {
    paddingHorizontal: 10,
  },
  tabScrollView: { 
    backgroundColor: RED,
  },
  tabContainer: { 
    paddingHorizontal: Platform.OS === 'web' ? 16 : 8, 
    paddingBottom: Platform.OS === 'web' ? 12 : 8, 
    gap: Platform.OS === 'web' ? 8 : 6,
  },
  tabContainerTablet: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 12,
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
  tabItemTablet: {
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
  },
  tabItemLandscape: {
    paddingHorizontal: 24,
    paddingVertical: 12,
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
  tabTextTablet: {
    fontSize: 20,
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
  contentTablet: {
    padding: 30,
    paddingBottom: 40,
    maxWidth: 1000,
  },
  contentLandscape: {
    paddingHorizontal: 40,
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
  infoBoxTablet: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  infoText: { 
    color: "#FFFFFF", 
    fontSize: Platform.OS === 'web' ? 15 : 13.5, 
    fontWeight: "700",
    textAlign: "center",
  },
  infoTextTablet: {
    fontSize: 18,
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
  cardTablet: {
    borderRadius: 28,
    padding: 28,
    minHeight: 550,
  },
  cardLandscape: {
    minHeight: 500,
  },

  // State containers
  stateContainer: {
    flex: 1,
    minHeight: Platform.OS === 'web' ? 400 : 350,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  stateContainerTablet: {
    minHeight: 450,
    gap: 24,
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
  errTextTablet: {
    fontSize: 20,
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
  retryBtnTablet: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  retryText: { 
    color: "#FFF", 
    fontWeight: "700",
    fontSize: Platform.OS === 'web' ? 16 : 13,
  },
  retryTextTablet: {
    fontSize: 20,
  },

  // Good/Bad section
  goodBadContainer: {
    backgroundColor: "#FFF0F7",
    borderRadius: Platform.OS === 'web' ? 16 : 12,
    padding: Platform.OS === 'web' ? 20 : 12,
    marginBottom: Platform.OS === 'web' ? 20 : 12,
  },
  goodBadContainerTablet: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 28,
  },
  goodBadLine: { 
    fontSize: Platform.OS === 'web' ? 17 : 15, 
    lineHeight: Platform.OS === 'web' ? 26 : 21,
  },
  goodBadLineTablet: {
    fontSize: 20,
    lineHeight: 32,
  },
  labelBlack: { 
    color: "#333", 
    fontWeight: "700",
    fontSize: Platform.OS === 'web' ? 17 : 15,
  },
  labelBlackTablet: {
    fontSize: 20,
  },
  goodText: { 
    color: "#1C9A3E", 
    fontWeight: "800",
    fontSize: Platform.OS === 'web' ? 17 : 15,
  },
  goodTextTablet: {
    fontSize: 20,
  },
  badText: { 
    color: "#D9342B", 
    fontWeight: "800",
    fontSize: Platform.OS === 'web' ? 17 : 15,
  },
  badTextTablet: {
    fontSize: 20,
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
  tableWrapTablet: {
    borderRadius: 16,
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
  tdTimeTablet: {
    width: 140,
    paddingVertical: 16,
  },
  tdMid: { 
    width: Platform.OS === 'web' ? 90 : 74, 
    paddingVertical: Platform.OS === 'web' ? 12 : 8, 
    alignItems: "center",
    justifyContent: "center",
  },
  tdMidTablet: {
    width: 120,
    paddingVertical: 16,
  },
  tdRight: { 
    flex: 1, 
    paddingVertical: Platform.OS === 'web' ? 12 : 8, 
    alignItems: "center",
    justifyContent: "center",
  },
  tdRightTablet: {
    paddingVertical: 16,
  },

  thText: { 
    fontSize: Platform.OS === 'web' ? 15 : 14, 
    fontWeight: "800", 
    color: "#333",
  },
  thTextTablet: {
    fontSize: 20,
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
  timeCellTablet: {
    width: 140,
    paddingVertical: 20,
  },
  timeText: { 
    fontSize: Platform.OS === 'web' ? 15 : 14, 
    fontWeight: "600", 
    color: "#333",
  },
  timeTextTablet: {
    fontSize: 20,
  },

  twoRows: { 
    flex: 1,
  },

  innerRow: { 
    flexDirection: "row", 
    minHeight: Platform.OS === 'web' ? 48 : 38,
    backgroundColor: "#FFF",
  },
  innerRowTablet: {
    minHeight: 60,
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
  midCellTablet: {
    width: 120,
  },
  midText: { 
    fontSize: Platform.OS === 'web' ? 15 : 14, 
    fontWeight: "700", 
    color: "#333",
  },
  midTextTablet: {
    fontSize: 20,
  },

  rightCell: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  rightCellTablet: {
    paddingHorizontal: 16,
  },
  valueText: { 
    fontSize: Platform.OS === 'web' ? 16 : 15, 
    fontWeight: "900",
  },
  valueTextTablet: {
    fontSize: 22,
  },

  placeholderText: {
    fontSize: Platform.OS === 'web' ? 15 : 14,
    fontWeight: "500",
    color: "#999",
  },
  placeholderTextTablet: {
    fontSize: 20,
  },

  description: { 
    marginTop: Platform.OS === 'web' ? 16 : 8, 
    color: "#666", 
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontStyle: "italic",
    lineHeight: Platform.OS === 'web' ? 22 : 18,
    paddingHorizontal: 4,
  },
  descriptionTablet: {
    marginTop: 24,
    fontSize: 18,
    lineHeight: 28,
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
  noDataContainerTablet: {
    marginTop: 28,
    paddingVertical: 24,
    borderRadius: 16,
  },
  noDataText: {
    color: RED,
    fontSize: Platform.OS === 'web' ? 15 : 14,
    fontWeight: "700",
    textAlign: "center",
  },
  noDataTextTablet: {
    fontSize: 20,
  },
});