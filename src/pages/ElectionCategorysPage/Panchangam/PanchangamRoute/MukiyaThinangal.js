import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

const API_URL = "https://hdrss-backend.onrender.com/api/v1/panchangam/mukiyathinam";

// Professional color palette
const COLORS = {
  primary: "#ff3b63",      // Bright pink
  secondary: "#ff2f55",    // Darker pink
  lightPink: "#fff0f0",    // Very light pink
  text: "#212529",         // Dark gray
  textLight: "#6c757d",    // Medium gray
  white: "#ffffff",
  cardBg: "#ffffff",
  lightBg: "#f8f9fa",
  shadow: "#000000", 
  border: "#e9ecef",
  headerBg: "#8B0000",     // Pink header
  monthCardBg: "#ff4f9a",  // Pink for month card
  summaryText: "#ff3b63",  // Pink for summary numbers
  eventTypes: {
    veerath_thinam: "#8B4513",      // Brown
    subamugurtha_thinam: "#FF8C00", // Orange
    hindu_pandigai: "#9C27B0",      // Purple
    government_holiday: "#2E7D32",   // Dark Green
    other: "#666",
  },
};

// Month names in Tamil (index 1 = January)
const TAMIL_MONTHS = [
  "", "ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்",
  "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"
];

// Tamil weekdays
const TAMIL_WEEKDAYS = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];

// Helper to get current year and month
const getCurrentYearMonth = () => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

// Extract day from various formats
const extractDay = (item) => {
  if (item.day) return item.day;
  if (item.date) return item.date;
  if (item.name && typeof item.name === 'object' && item.name.day) {
    return item.name.day;
  }
  if (item.name && typeof item.name === 'string') {
    const match = item.name.match(/\b(\d{1,2})\b/);
    if (match) return match[1];
    const numberMatch = item.name.match(/(\d+)$/);
    if (numberMatch) return numberMatch[1];
  }
  return null;
};

// Extract clean name without day
const extractCleanName = (item) => {
  if (item.name && typeof item.name === 'object' && item.name.name) {
    return item.name.name;
  }
  
  if (item.name && typeof item.name === 'string') {
    let name = item.name;
    name = name.replace(/[:\d-]+/g, "").trim();
    if (!name) {
      name = item.name.replace(/\d+$/g, "").replace(/[:\d-]+/g, "").trim();
    }
    
    if (item.name.includes("republicday")) return "குடியரசு தினம்";
    if (item.name.includes("Diwali")) return "தீபாவளி";
    if (item.name.includes("pongal")) return "பொங்கல்";
    if (item.name.includes("அமாவாசை")) return "அமாவாசை";
    if (item.name.includes("சூரசம்ஹாரம்")) return "சூரசம்ஹாரம்";
    if (item.name.includes("ஏகாதசி")) return "ஏகாதசி";
    
    return name || "விசேஷ தினம்";
  }
  
  switch (item.type) {
    case "veerath_thinam": return "விரத தினம்";
    case "subamugurtha_thinam": return "சுபமுகூர்த்த தினம்";
    case "hindu_pandigai": return "இந்து பண்டிகை";
    case "government_holiday": return "அரசு விடுமுறை";
    default: return "முக்கிய தினம்";
  }
};

// Get color based on event type
const getEventColor = (type) => {
  switch (type) {
    case "veerath_thinam": return COLORS.eventTypes.veerath_thinam;
    case "subamugurtha_thinam": return COLORS.eventTypes.subamugurtha_thinam;
    case "hindu_pandigai": return COLORS.eventTypes.hindu_pandigai;
    case "government_holiday": return COLORS.eventTypes.government_holiday;
    default: return COLORS.eventTypes.other;
  }
};

// Get Tamil type name
const getTamilTypeName = (type) => {
  switch (type) {
    case "veerath_thinam": return "விரத தினம்";
    case "subamugurtha_thinam": return "சுபமுகூர்த்த தினம்";
    case "hindu_pandigai": return "இந்து பண்டிகை";
    case "government_holiday": return "அரசு விடுமுறை";
    default: return type || "பிற";
  }
};

// Format date with weekday
const formatDateWithWeekday = (day, month, year) => {
  if (!day || !month || !year) return null;
  const date = new Date(year, month - 1, parseInt(day));
  const weekday = TAMIL_WEEKDAYS[date.getDay()];
  return `${day} ${weekday}`;
};

export default function MukiyaThinangal({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(getCurrentYearMonth().year);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentYearMonth().month);

  // Determine device type
  const isTablet = width >= 600;
  const isMobile = width < 768;
  const isLandscape = width > height;

  // Responsive values
  const getResponsiveValues = () => {
    if (isTablet) {
      return {
        headerPadding: Platform.OS === 'ios' ? 60 : 50,
        headerTitleSize: 23,
        headerIconSize: 30,
        contentPadding: 24,
        monthCardPadding: 20,
        monthTitleSize: 24,
        iconBtnSize: 45,
        summaryCardPadding: 20,
        summaryCountSize: 36,
        summaryLabelSize: 18,
        eventCardRadius: 22,
        eventHeaderSize: 18,
        eventHeaderPadding: 16,
        eventItemPadding: 16,
        eventNameSize: 18,
        eventDateSize: 15,
        emptyIconSize: 80,
        emptyTextSize: 24,
        emptySubTextSize: 18,
        footerPadding: 20,
        footerTextSize: 15,
        gap: 20,
        borderRadius: 24,
        dateBoxWidth: 120,
      };
    } else {
      return {
        headerPadding: Platform.OS === 'ios' ? 50 : 40,
        headerTitleSize: 18,
        headerIconSize: 20,
        contentPadding: 12,
        monthCardPadding: 14,
        monthTitleSize: 18,
        iconBtnSize: 40,
        summaryCardPadding: 16,
        summaryCountSize: 28,
        summaryLabelSize: 14,
        eventCardRadius: 16,
        eventHeaderSize: 15,
        eventHeaderPadding: 12,
        eventItemPadding: 14,
        eventNameSize: 15,
        eventDateSize: 12,
        emptyIconSize: 60,
        emptyTextSize: 18,
        emptySubTextSize: 14,
        footerPadding: 16,
        footerTextSize: 13,
        gap: 12,
        borderRadius: 16,
        dateBoxWidth: 100,
      };
    }
  };

  const responsive = getResponsiveValues();

  // Fetch API data
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      if (res.data?.success && Array.isArray(res.data.data)) {
        const validEvents = res.data.data.filter(event => 
          event && (event.month || event.year || event.type)
        );
        setEvents(validEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      Alert.alert("தகவல்", "சேவையகத்திலிருந்து தரவு பெற முடியவில்லை");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter events by selected month and year
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventMonth = event.month || new Date().getMonth() + 1;
      const eventYear = event.year || new Date().getFullYear();
      return eventMonth === selectedMonth && eventYear === selectedYear;
    });
  }, [events, selectedMonth, selectedYear]);

  // Group events by type and format with date and weekday
  const groupedEvents = useMemo(() => {
    const groups = {};
    filteredEvents.forEach(event => {
      const type = event.type || "other";
      if (!groups[type]) groups[type] = [];
      
      const day = extractDay(event);
      const cleanName = extractCleanName(event);
      const formattedDate = day ? formatDateWithWeekday(parseInt(day), selectedMonth, selectedYear) : null;
      
      groups[type].push({
        ...event,
        displayName: cleanName,
        displayDate: formattedDate,
      });
    });
    return groups;
  }, [filteredEvents, selectedMonth, selectedYear]);

  // Month navigation
  const goToPrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    const { year, month } = getCurrentYearMonth();
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.headerBg} />
        <View style={[styles.centerContainer, { backgroundColor: COLORS.lightBg }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, { fontSize: 16 }]}>
            முக்கிய தினங்கள் ஏற்றப்படுகிறது...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.headerBg} />
      
      {/* Header with Centered Title */}
      <View style={[
        styles.header,
        {
          paddingTop: responsive.headerPadding,
          paddingHorizontal: responsive.contentPadding,
          backgroundColor: COLORS.headerBg,
        }
      ]}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={[styles.headerIconBtn, { width: responsive.iconBtnSize, height: responsive.iconBtnSize }]}
        >
          <Ionicons 
            name="arrow-back" 
            size={responsive.headerIconSize} 
            color={COLORS.white} 
          />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { fontSize: responsive.headerTitleSize }]}>
          முக்கிய தினங்கள்
        </Text>
        
        <View style={{ width: responsive.iconBtnSize }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { padding: responsive.contentPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Month & Year Selector Card */}
        <LinearGradient
          colors={[COLORS.monthCardBg, COLORS.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.monthCard, { 
            padding: responsive.monthCardPadding,
            borderRadius: responsive.borderRadius,
            marginBottom: responsive.gap,
          }]}
        >
          <View style={styles.monthHeader}>
            <TouchableOpacity 
              style={[styles.monthNavBtn, { width: responsive.iconBtnSize, height: responsive.iconBtnSize }]} 
              onPress={goToPrevMonth}
            >
              <Ionicons 
                name="chevron-back" 
                size={responsive.headerIconSize} 
                color={COLORS.white} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={goToCurrentMonth} 
              style={styles.monthTitleContainer}
            >
              <Text style={[styles.monthTitle, { fontSize: responsive.monthTitleSize }]}>
                {TAMIL_MONTHS[selectedMonth]} {selectedYear}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.monthNavBtn, { width: responsive.iconBtnSize, height: responsive.iconBtnSize }]} 
              onPress={goToNextMonth}
            >
              <Ionicons 
                name="chevron-forward" 
                size={responsive.headerIconSize} 
                color={COLORS.white} 
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Events Summary Card */}
        <View style={[styles.summaryCard, { 
          padding: responsive.summaryCardPadding,
          borderRadius: responsive.borderRadius,
          marginBottom: responsive.gap,
        }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryCount, { fontSize: responsive.summaryCountSize }]}>
                {filteredEvents.length}
              </Text>
              <Text style={[styles.summaryLabel, { fontSize: responsive.summaryLabelSize }]}>
                மொத்த நாட்கள்
              </Text>
            </View>
            <View style={[styles.summaryDivider, { height: isTablet ? 45 : 40 }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryCount, { fontSize: responsive.summaryCountSize }]}>
                {Object.keys(groupedEvents).length}
              </Text>
              <Text style={[styles.summaryLabel, { fontSize: responsive.summaryLabelSize }]}>
                வகைகள்
              </Text>
            </View>
          </View>
        </View>

        {/* Events by Type */}
        {Object.keys(groupedEvents).length > 0 ? (
          Object.entries(groupedEvents).map(([type, typeEvents]) => (
            <View key={type} style={[styles.eventTypeCard, { 
              borderRadius: responsive.eventCardRadius,
              marginBottom: responsive.gap,
            }]}>
              <LinearGradient
                colors={[getEventColor(type), getEventColor(type)]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.eventTypeHeader, { 
                  paddingVertical: responsive.eventHeaderPadding,
                  paddingHorizontal: responsive.eventHeaderPadding,
                }]}
              >
                <Text style={[styles.eventTypeTitle, { fontSize: responsive.eventHeaderSize }]}>
                  {getTamilTypeName(type)}
                </Text>
                <View style={[styles.eventTypeBadge, { 
                  borderRadius: responsive.eventCardRadius / 2,
                  paddingHorizontal: responsive.eventHeaderPadding,
                  paddingVertical: responsive.eventHeaderPadding / 3,
                }]}>
                  <Text style={[styles.eventTypeCount, { fontSize: responsive.eventHeaderSize - 2 }]}>
                    {typeEvents.length}
                  </Text>
                </View>
              </LinearGradient>
              
              {typeEvents.map((event, index) => (
                <View key={index}>
                  <View style={[styles.eventItem, { 
                    paddingVertical: responsive.eventItemPadding,
                    paddingHorizontal: responsive.eventItemPadding,
                  }]}>
                    <View style={styles.eventDetails}>
                      <Text style={[styles.eventName, { fontSize: responsive.eventNameSize }]}>
                        {event.displayName}
                      </Text>
                      {event.displayDate && (
                        <View style={[styles.eventDateContainer, { minWidth: responsive.dateBoxWidth }]}>
                          <Text style={[styles.eventDate, { fontSize: responsive.eventDateSize }]}>
                            {event.displayDate}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  {index !== typeEvents.length - 1 && (
                    <View style={[styles.dashedDivider, { marginVertical: responsive.eventItemPadding / 2 }]} />
                  )}
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={[styles.emptyCard, { 
            padding: responsive.emptyIconSize,
            borderRadius: responsive.borderRadius,
            marginBottom: responsive.gap,
          }]}>
            <Ionicons 
              name="calendar-outline" 
              size={responsive.emptyIconSize} 
              color="#ccc" 
            />
            <Text style={[styles.emptyText, { 
              fontSize: responsive.emptyTextSize,
              marginTop: responsive.gap,
            }]}>
              {TAMIL_MONTHS[selectedMonth]} {selectedYear}
            </Text>
            <Text style={[styles.emptySubText, { 
              fontSize: responsive.emptySubTextSize,
              marginTop: responsive.gap / 2,
            }]}>
              இந்த மாதத்தில் முக்கிய தினங்கள் எதுவும் இல்லை
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={[styles.footer, { 
          padding: responsive.footerPadding,
          borderRadius: responsive.borderRadius,
          marginTop: responsive.gap,
        }]}>
          <Text style={[styles.footerText, { fontSize: responsive.footerTextSize }]}>
            * தமிழ் நாட்காட்டியின் படி முக்கிய தினங்கள்
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightBg,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontWeight: "700",
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerIconBtn: {
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: "900",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  // Month Card
  monthCard: {
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthNavBtn: {
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  monthTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  monthTitle: {
    color: COLORS.white,
    fontWeight: "900",
    textAlign: "center",
  },

  // Summary Card
  summaryCard: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  summaryCount: {
    fontWeight: "900",
    color: COLORS.summaryText,
  },
  summaryLabel: {
    fontWeight: "700",
    color: COLORS.textLight,
    marginTop: 4,
  },

  // Event Type Card
  eventTypeCard: {
    backgroundColor: COLORS.white,
    overflow: "hidden",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  eventTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventTypeTitle: {
    color: COLORS.white,
    fontWeight: "900",
    flex: 1,
    textAlign: 'center',
  },
  eventTypeBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  eventTypeCount: {
    color: COLORS.white,
    fontWeight: "900",
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0,
  },
  eventDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventName: {
    fontWeight: "900",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  eventDateContainer: {
    backgroundColor: COLORS.lightBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  eventDate: {
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
  },
  dashedDivider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderStyle: "dashed",
    width: "100%",
  },

  // Empty State
  emptyCard: {
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  emptyText: {
    fontWeight: "900",
    color: COLORS.text,
  },
  emptySubText: {
    fontWeight: "600",
    color: COLORS.textLight,
    textAlign: "center",
  },

  // Footer
  footer: {
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  footerText: {
    color: COLORS.textLight,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
  },
});