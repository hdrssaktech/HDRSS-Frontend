// PanchangamNaalKaati.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import Loader from "../../../../components/Alert/Loader";

const API_URL =
  "https://hdrss-backend.onrender.com/api/v1/panchangam/naalkaati/range";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isSmallPhone = width < 375;

export default function NaalKaatiPanchangam() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedDate, fromCalendar } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [fallbackMessage, setFallbackMessage] = useState("");

  // Fetch API data
  useEffect(() => {
    let alive = true;

    const fetchDays = async () => {
      try {
        setLoading(true);
        setError("");
        setFallbackMessage("");

        const res = await axios.get(API_URL);
        const list = res?.data?.data || [];

        list.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (!alive) return;

        setDays(list);

        // If coming from calendar with selected date
        if (selectedDate) {
          const dateIndex = list.findIndex((d) => d.date === selectedDate);
          
          if (dateIndex >= 0) {
            // Exact date found
            setIndex(dateIndex);
            setFallbackMessage("");
          } else {
            // Date not found - find nearest available date
            const selectedTimestamp = new Date(selectedDate).getTime();
            
            // Find closest date
            let closestIndex = 0;
            let minDiff = Infinity;
            
            list.forEach((item, idx) => {
              const itemTimestamp = new Date(item.date).getTime();
              const diff = Math.abs(itemTimestamp - selectedTimestamp);
              
              if (diff < minDiff) {
                minDiff = diff;
                closestIndex = idx;
              }
            });
            
            setIndex(closestIndex);
            
            // Set fallback message
            const closestDate = formatDMY(list[closestIndex].date);
            const requestedDate = formatDMY(selectedDate);
            setFallbackMessage(`"${requestedDate}" தேதிக்கு தரவு இல்லை. அருகில் உள்ள "${closestDate}" தேதி காட்டப்படுகிறது.`);
          }
        } else {
          // Default: pick today
          const todayStr = toISODate(new Date());
          const todayIndex = list.findIndex((d) => d.date === todayStr);
          
          if (todayIndex >= 0) {
            setIndex(todayIndex);
            setFallbackMessage("");
          } else {
            // Today not found - show nearest date
            const todayTimestamp = new Date(todayStr).getTime();
            let closestIndex = 0;
            let minDiff = Infinity;
            
            list.forEach((item, idx) => {
              const itemTimestamp = new Date(item.date).getTime();
              const diff = Math.abs(itemTimestamp - todayTimestamp);
              
              if (diff < minDiff) {
                minDiff = diff;
                closestIndex = idx;
              }
            });
            
            setIndex(closestIndex);
            
            const closestDate = formatDMY(list[closestIndex].date);
            setFallbackMessage(`இன்றைய தேதிக்கு தரவு இல்லை. அருகில் உள்ள "${closestDate}" தேதி காட்டப்படுகிறது.`);
          }
        }
      } catch (e) {
        if (!alive) return;
        setError("API error. Please try again.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchDays();
    return () => {
      alive = false;
    };
  }, [selectedDate]);

  const selected = useMemo(() => days[index] || null, [days, index]);

  const dateTitle = selected ? formatDMY(selected.date) : "--";
  const topSub1 = selected?.is_auspicious_day ? "சுப நாள்" : "சாதாரண நாள்";

  const onPrev = () => {
    if (index <= 0) {
      Alert.alert("தகவல்", "முந்தைய தேதி கிடைக்கவில்லை");
      return;
    }
    setIndex((p) => p - 1);
    setFallbackMessage(""); // Clear fallback message when user navigates manually
  };

  const onNext = () => {
    if (index >= days.length - 1) {
      Alert.alert("தகவல்", "அடுத்த தேதி கிடைக்கவில்லை");
      return;
    }
    setIndex((p) => p + 1);
    setFallbackMessage(""); // Clear fallback message when user navigates manually
  };

  const goBack = () => {
    navigation.goBack();
  };

  // Helper function to check if a value has data
  const hasData = (value) => {
    if (!value) return false;
    const str = value.toString().trim();
    return str.length > 0 && str !== "-";
  };

  if (loading) {
    return (
      <Loader visible={true} message="தரவு ஏற்றப்படுகிறது..." />
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryBtnText}>மீண்டும் முயற்சிக்கவும்</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selected) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.noDataText}>தரவு கிடைக்கவில்லை</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryBtnText}>திரும்பிச் செல்லவும்</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow */}
     
        <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>
         <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
            நாள் காட்டி
          </Text>
          <View style={styles.headerRightPlaceholder} />
      
      </View>

      <ScrollView 
        style={styles.screen} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* TOP DATE CARD */}
        <LinearGradient colors={["#ff3b63", "#ff2f55"]} style={styles.topCard}>
          <View style={styles.topRow}>
            <TouchableOpacity
              style={[styles.iconBtn, index <= 0 && styles.disabledBtn]}
              activeOpacity={index <= 0 ? 0.5 : 0.8}
              onPress={onPrev}
              disabled={index <= 0}
            >
              <Ionicons 
                name="chevron-back" 
                size={28} 
                color={index <= 0 ? "rgba(255,255,255,0.4)" : "#fff"} 
              />
            </TouchableOpacity>

            <Text style={styles.topDate}>
              {dateTitle}
            </Text>

            <TouchableOpacity
              style={[styles.iconBtn, index >= days.length - 1 && styles.disabledBtn]}
              activeOpacity={index >= days.length - 1 ? 0.5 : 0.8}
              onPress={onNext}
              disabled={index >= days.length - 1}
            >
              <Ionicons 
                name="chevron-forward" 
                size={28} 
                color={index >= days.length - 1 ? "rgba(255,255,255,0.4)" : "#fff"} 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.topSub}>
            {topSub1}
          </Text>
        </LinearGradient>

        {/* Fallback Message - Show when date not found */}
        {fallbackMessage ? (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>
              {fallbackMessage}
            </Text>
          </View>
        ) : null}

        {/* NALLA NERAM */}
        <CardRedHeader headerText="நல்ல நேரம்">
          <ThreeRowTimeTable value={selected?.nalla_neram} />
        </CardRedHeader>

        {/* GOWRI NERAM */}
        <CardRedHeader headerText="கௌரி நேரம்">
          <ThreeRowTimeTable value={selected?.gowri_neram} />
        </CardRedHeader>

        {/* SUBA MUGURTHAM */}
        <CardRedHeader headerText="சுபமுகூர்த்தம்">
          <ThreeRowTimeTable value={selected?.subamugurtham} />
        </CardRedHeader>

        {/* PONMOZHIGAL */}
        <View style={styles.whiteCard}>
          <View style={styles.redHeader}>
            <Text style={styles.redHeaderText}>
              பொன்மொழி
            </Text>
          </View>

          <View style={styles.quoteCard}>
            {hasData(selected?.ponmoligal?.morning) && (
              <>
                <Text style={styles.quoteText}>
                  {safeText(selected?.ponmoligal?.morning)}
                </Text>
                {(hasData(selected?.ponmoligal?.afternoon) || hasData(selected?.ponmoligal?.evening)) && <DashedDivider />}
              </>
            )}
            
            {hasData(selected?.ponmoligal?.afternoon) && (
              <>
                <Text style={styles.quoteText}>
                  {safeText(selected?.ponmoligal?.afternoon)}
                </Text>
                {hasData(selected?.ponmoligal?.evening) && <DashedDivider />}
              </>
            )}
            
            {hasData(selected?.ponmoligal?.evening) && (
              <Text style={styles.quoteText}>
                {safeText(selected?.ponmoligal?.evening)}
              </Text>
            )}
            
            {!hasData(selected?.ponmoligal?.morning) && 
             !hasData(selected?.ponmoligal?.afternoon) && 
             !hasData(selected?.ponmoligal?.evening) && (
              <Text style={styles.quoteText}>-</Text>
            )}
          </View>
        </View>

        {/* BIRTH */}
        <View style={styles.whiteCard}>
          <View style={styles.redHeader}>
            <Text style={styles.redHeaderText}>
              பிறந்த நாள்
            </Text>
          </View>
          <View style={styles.centeredCardBody}>
            {hasData(selected?.birth?.morning) && (
              <>
                <Text style={styles.centeredBigLine}>
                  {safeText(selected?.birth?.morning)}
                </Text>
                {(hasData(selected?.birth?.afternoon) || hasData(selected?.birth?.evening)) && <DashedDivider />}
              </>
            )}
            
            {hasData(selected?.birth?.afternoon) && (
              <>
                <Text style={styles.centeredBigLine}>
                  {safeText(selected?.birth?.afternoon)}
                </Text>
                {hasData(selected?.birth?.evening) && <DashedDivider />}
              </>
            )}
            
            {hasData(selected?.birth?.evening) && (
              <Text style={styles.centeredBigLine}>
                {safeText(selected?.birth?.evening)}
              </Text>
            )}
            
            {!hasData(selected?.birth?.morning) && 
             !hasData(selected?.birth?.afternoon) && 
             !hasData(selected?.birth?.evening) && (
              <Text style={styles.centeredBigLine}>-</Text>
            )}
          </View>

          {/* DEATH */}
          <View style={styles.redHeader}>
            <Text style={styles.redHeaderText}>
              நினைவு நாள்
            </Text>
          </View>
          <View style={styles.centeredCardBody}>
            {hasData(selected?.death?.morning) && (
              <>
                <Text style={styles.centeredBigLine}>
                  {safeText(selected?.death?.morning)}
                </Text>
                {(hasData(selected?.death?.afternoon) || hasData(selected?.death?.evening)) && <DashedDivider />}
              </>
            )}
            
            {hasData(selected?.death?.afternoon) && (
              <>
                <Text style={styles.centeredBigLine}>
                  {safeText(selected?.death?.afternoon)}
                </Text>
                {hasData(selected?.death?.evening) && <DashedDivider />}
              </>
            )}
            
            {hasData(selected?.death?.evening) && (
              <Text style={styles.centeredBigLine}>
                {safeText(selected?.death?.evening)}
              </Text>
            )}
            
            {!hasData(selected?.death?.morning) && 
             !hasData(selected?.death?.afternoon) && 
             !hasData(selected?.death?.evening) && (
              <Text style={styles.centeredBigLine}>-</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* -------------------- Components -------------------- */

function CardRedHeader({ headerText, children }) {
  return (
    <View style={styles.whiteCard}>
      <View style={styles.redHeader}>
        <Text style={styles.redHeaderText} numberOfLines={2}>
          {headerText}
        </Text>
      </View>
      <View style={styles.cardBody}>
        {children}
      </View>
    </View>
  );
}

function ThreeRowTimeTable({ value }) {
  const rows = [
    { label: "காலை", time: value?.morning || "" },
    { label: "மதியம்", time: value?.afternoon || "" },
    { label: "மாலை", time: value?.evening || "" },
  ];

  // Filter rows that have data
  const rowsWithData = rows.filter(r => r.time && r.time.toString().trim() !== "");

  return (
    <View style={styles.timeTable}>
      {rowsWithData.length > 0 ? (
        rowsWithData.map((r, i) => (
          <View key={i}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLeft}>{r.label}</Text>
              <Text style={styles.timeRight}>
                {r.time}
              </Text>
            </View>
            {i !== rowsWithData.length - 1 && <DashedDivider />}
          </View>
        ))
      ) : (
        <View style={styles.timeRow}>
          <Text style={styles.timeRight}>-</Text>
        </View>
      )}
    </View>
  );
}

function DashedDivider() {
  return <View style={styles.dashedDivider} />;
}

/* -------------------- Helpers -------------------- */

function toISODate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDMY(iso) {
  if (!iso) return "--";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function safeText(v) {
  const s = (v ?? "").toString().trim();
  return s.length ? s : "-";
}

/* -------------------- Mobile Optimized Styles -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  
  content: {
    padding: 12,
    paddingBottom: 30,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
 
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop:40,
    paddingBottom:30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

   headerTablet: {
    paddingTop:50,
    paddingBottom:28,
    paddingHorizontal: 18,
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
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 22,
  },
  
  headerRightPlaceholder: {
    width: 40,
    height: 40,
  },

  // Loading & Error States
  loadingText: {
    marginTop: 12,
    fontWeight: "700",
    fontSize: 15,
    color: "#333",
  },
  
  errorText: {
    color: "#ff3b63",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 12,
  },
  
  noDataText: {
    fontWeight: "700",
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
  },
  
  retryBtn: {
    backgroundColor: "#ff3b63",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
  },
  
  retryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // Top Card
  topCard: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: 12,
  },
  
  topRow: { 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  }, 
  
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",  
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  
  disabledBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  
  topDate: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },
  
  topSub: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
    opacity: 0.95,
  },

  // Fallback Message Styles
  fallbackContainer: {
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ff9800",
    borderStyle: "dashed",
  },
  
  fallbackText: {
    color: "#b26a00",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },

  // Cards
  whiteCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },

  redHeader: {
    backgroundColor: "#ff3b63",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  
  redHeaderText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  
  cardBody: {
    padding: 14,
  },
  
  centeredCardBody: {
    padding: 16,
  },

  dashedDivider: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    borderStyle: "dashed",
    marginVertical: 10,
    width: "100%",
  },

  // Time Table
  timeTable: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  
  timeLeft: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  
  timeRight: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",   
  },
 
  // Quote Card
  quoteCard: {
    backgroundColor: "#fff",
    padding: 16,
  },
  
  quoteText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    lineHeight: 24,
    textAlign: "left",
    paddingVertical: 4,
  },

  // Centered Text
  centeredBigLine: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    lineHeight: 24,
    textAlign: "left",
    paddingVertical: 4,
  },
});