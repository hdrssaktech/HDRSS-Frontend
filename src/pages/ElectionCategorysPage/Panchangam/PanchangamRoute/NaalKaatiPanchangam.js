// PanchangamNaalKaati.js
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import Loader from "../../../../components/Alert/Loader";

const BASE_URL = "http://192.168.1.6:5000/api/v1/panchangam/naalkaati";
const RANGE_API = `${BASE_URL}/range`;
const DATE_API  = (date) => `${BASE_URL}/date/${date}`;

const { width } = Dimensions.get("window");
const isTablet   = width >= 768;

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
function toISODate(d) {
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDMY(iso) {
  if (!iso) return "--";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function addDays(iso, n) {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

function safeText(v) {
  const s = (v ?? "").toString().trim();
  return s.length ? s : "-";
}

/* ─────────────────────────────────────────────────────────
   Convert 24h time to 12h format
   Handles:  "14:30"         → "2:30 PM"
             "06:00 - 07:30" → "6:00 AM - 7:30 AM"
───────────────────────────────────────────────────────── */
function to12Hour(timeStr) {
  if (!timeStr) return timeStr;
  const str = timeStr.toString().trim();

  const convertSingle = (t) => {
    const match = t.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return t.trim();
    let hours  = parseInt(match[1], 10);
    const mins = match[2];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${mins} ${ampm}`;
  };

  // Range with spaces: "06:00 - 07:30"
  if (str.includes(" - ")) {
    return str.split(" - ").map(convertSingle).join(" - ");
  }
  // Range without spaces: "06:00-07:30"
  const dashIdx = str.indexOf("-");
  if (dashIdx > 0 && str.includes(":")) {
    const left  = str.slice(0, dashIdx);
    const right = str.slice(dashIdx + 1);
    if (left.includes(":") && right.includes(":")) {
      return `${convertSingle(left)} - ${convertSingle(right)}`;
    }
  }

  return convertSingle(str);
}


/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function NaalKaatiPanchangam() {
  const navigation = useNavigation(); 
  const route      = useRoute();
  const { selectedDate, fromCalendar } = route.params || {};

  const [loading,         setLoading]         = useState(true);
  const [days,            setDays]             = useState([]);
  const [index,           setIndex]            = useState(0);
  const [error,           setError]            = useState("");
  const [fallbackMessage, setFallbackMessage]  = useState("");
  const [fetchingDate,    setFetchingDate]      = useState(false); // "prev" | "next" | false

  // Track which dates we already have — avoids duplicate API calls
  const fetchedDates = useRef(new Set());

  /* ───────────────────────────────────────────────────────
     fetchSingleDate
     Calls /naalkaati/date/:date
     Returns the day object or null (skips if already loaded)
  ─────────────────────────────────────────────────────── */
  const fetchSingleDate = async (dateStr) => {
    if (fetchedDates.current.has(dateStr)) {
      // console.log("[fetchSingleDate] Already fetched, skipping:", dateStr);
      return null;
    }
    const url = DATE_API(dateStr);
    // console.log("[fetchSingleDate] Calling API:", url);
    const res  = await axios.get(url);
    // console.log("[fetchSingleDate] Response:", JSON.stringify(res?.data));
    const data = res?.data?.data;
    if (data) {
      fetchedDates.current.add(dateStr);
      return data;
    }
    return null;
  };

  /* ───────────────────────────────────────────────────────
     INITIAL LOAD
     1. Fetch range  →  seed the list
     2. If target date missing  →  fetch it via date API
     3. Land on target (or nearest fallback)
  ─────────────────────────────────────────────────────── */
  useEffect(() => {
    let alive = true;

    const init = async () => {
      try {
        setLoading(true);
        setError("");
        setFallbackMessage("");

        // Step 1 — range
        const res  = await axios.get(RANGE_API);
        const list = (res?.data?.data || []).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        list.forEach((d) => fetchedDates.current.add(d.date));

        if (!alive) return;

        const targetDate = selectedDate || toISODate(new Date());
        let   targetIdx  = list.findIndex((d) => d.date === targetDate);
        let   finalList  = list;

        // Step 2 — target not in range, fetch individually
        if (targetIdx < 0) {
          try {
            const single = await fetchSingleDate(targetDate);
            if (single && alive) {
              finalList  = [...list, single].sort(
                (a, b) => new Date(a.date) - new Date(b.date)
              );
              targetIdx  = finalList.findIndex((d) => d.date === targetDate);
            }
          } catch (_) {
            // fall through to nearest-date fallback
          }
        }

        if (!alive) return;
        setDays(finalList);

        // Step 3 — set index
        if (targetIdx >= 0) {
          setIndex(targetIdx);
          setFallbackMessage("");
        } else {
          // Nearest available date
          const ts = new Date(targetDate).getTime();
          let closestIdx = 0, minDiff = Infinity;
          finalList.forEach((item, idx) => {
            const diff = Math.abs(new Date(item.date).getTime() - ts);
            if (diff < minDiff) { minDiff = diff; closestIdx = idx; }
          });
          setIndex(closestIdx);
          const closestDate   = formatDMY(finalList[closestIdx].date);
          const requestedDate = formatDMY(targetDate);
          setFallbackMessage(
            selectedDate
              ? `"${requestedDate}" தேதிக்கு தரவு இல்லை. அருகில் உள்ள "${closestDate}" தேதி காட்டப்படுகிறது.`
              : `இன்றைய தேதிக்கு தரவு இல்லை. அருகில் உள்ள "${closestDate}" தேதி காட்டப்படுகிறது.`
          );
        }
      } catch (e) {
        if (!alive) return;
        setError("API error. Please try again.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    init();
    return () => { alive = false; };
  }, [selectedDate]);

  /* ───────────────────────────────────────────────────────
     Derived values
  ─────────────────────────────────────────────────────── */
  const selected  = useMemo(() => days[index] || null, [days, index]);
  const dateTitle = selected ? formatDMY(selected.date) : "--";
  const topSub1   = selected?.is_auspicious_day ? "சுப நாள்" : "சாதாரண நாள்";

  /* ───────────────────────────────────────────────────────
     PREV
     Already in list  →  move index
     Not in list      →  fetch day before first loaded date
  ─────────────────────────────────────────────────────── */
  const onPrev = async () => {
    setFallbackMessage("");

    if (index > 0) {
      setIndex((p) => p - 1);
      return;
    }

    const prevDate = addDays(days[0]?.date, -1);
    if (!prevDate) return;

    try {
      setFetchingDate("prev");
      const entry = await fetchSingleDate(prevDate);
      if (entry) {
        setDays((prev) =>
          [entry, ...prev].sort((a, b) => new Date(a.date) - new Date(b.date))
        );
        setIndex(0); // prepended → still index 0
      } else {
        Alert.alert("தகவல்", `"${formatDMY(prevDate)}" தேதிக்கு தரவு இல்லை`);
      }
    } catch {
      Alert.alert("பிழை", "முந்தைய தேதி தரவை பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setFetchingDate(false);
    }
  };

  /* ───────────────────────────────────────────────────────
     NEXT
     Already in list  →  move index
     Not in list      →  fetch next calendar date
                         (backend AI-generates if not in DB)
  ─────────────────────────────────────────────────────── */
  const onNext = async () => {
    setFallbackMessage("");

    if (index < days.length - 1) {
      setIndex((p) => p + 1);
      return;
    }

    const nextDate = addDays(days[days.length - 1]?.date, 1);
    if (!nextDate) return;

    try {
      setFetchingDate("next");
      const entry = await fetchSingleDate(nextDate);
      if (entry) {
        setDays((prev) =>
          [...prev, entry].sort((a, b) => new Date(a.date) - new Date(b.date))
        );
        setIndex((prev) => prev + 1);
      } else {
        Alert.alert("தகவல்", `"${formatDMY(nextDate)}" தேதிக்கு தரவு இல்லை`);
      }
    } catch (err) {
      console.log("[onNext] ERROR:", err?.message);
      console.log("[onNext] ERROR response:", JSON.stringify(err?.response?.data));
      console.log("[onNext] ERROR status:", err?.response?.status);
      Alert.alert("பிழை", `அடுத்த தேதி தரவை பெற முடியவில்லை.\n\nError: ${err?.message}`);
    } finally {
      setFetchingDate(false);
    }
  };

  const hasData = (value) => {
    if (!value) return false;
    const str = value.toString().trim();
    return str.length > 0 && str !== "-";
  };

  /* ═══════════════════════════════════════════════════════
     RENDER STATES
  ═══════════════════════════════════════════════════════ */
  if (loading) {
    return <Loader visible={true} message="தரவு ஏற்றப்படுகிறது..." />;
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.retryBtnText}>மீண்டும் முயற்சிக்கவும்</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selected) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.noDataText}>தரவு கிடைக்கவில்லை</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.retryBtnText}>திரும்பிச் செல்லவும்</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ═══════════════════════════════════════════════════════
     MAIN UI
  ═══════════════════════════════════════════════════════ */
  return (
    <View style={styles.container}>

      {/* Header */}
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
        {/* Date Navigation Card */}
        <LinearGradient colors={["#ff3b63", "#ff2f55"]} style={styles.topCard}>
          <View style={styles.topRow}>

            {/* ← PREV */}
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={fetchingDate === "prev" ? 0.5 : 0.8}
              onPress={onPrev}
              disabled={!!fetchingDate}
            >
              {fetchingDate === "prev" ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="chevron-back" size={28} color="#fff" />
              )}
            </TouchableOpacity>

            <Text style={styles.topDate}>{dateTitle}</Text>

            {/* NEXT → */}
            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={fetchingDate === "next" ? 0.5 : 0.8}
              onPress={onNext}
              disabled={!!fetchingDate}
            >
              {fetchingDate === "next" ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="chevron-forward" size={28} color="#fff" />
              )}
            </TouchableOpacity>

          </View>
          <Text style={styles.topSub}>{topSub1}</Text>
        </LinearGradient>

        {/* Fallback banner */}
        {fallbackMessage ? (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>{fallbackMessage}</Text>
          </View>
        ) : null}

        {/* Time sections */}
        <CardRedHeader headerText="நல்ல நேரம்">
          <ThreeRowTimeTable value={selected?.nalla_neram} />
        </CardRedHeader>

        <CardRedHeader headerText="கௌரி நேரம்">
          <ThreeRowTimeTable value={selected?.gowri_neram} />
        </CardRedHeader>

        <CardRedHeader headerText="சுபமுகூர்த்தம்">
          <ThreeRowTimeTable value={selected?.subamugurtham} />
        </CardRedHeader>

        <CardRedHeader headerText="யமகண்டம்">
          <ThreeRowTimeTable value={selected?.Yamagandam} />
        </CardRedHeader>

        <CardRedHeader headerText="குளிகை">
          <ThreeRowTimeTable value={selected?.Kuligai} />
        </CardRedHeader>

        <CardRedHeader headerText="ராஹு காலம்">
          <ThreeRowTimeTable value={selected?.Raavukandam} />
        </CardRedHeader>

        {/* Ponmozhigal */}
        <View style={styles.whiteCard}>
          <View style={styles.redHeader}>
            <Text style={styles.redHeaderText}>பொன்மொழி</Text>
          </View>
          <View style={styles.quoteCard}>
            {hasData(selected?.ponmoligal?.morning) && (
              <>
                <Text style={styles.quoteText}>{safeText(selected?.ponmoligal?.morning)}</Text>
                {(hasData(selected?.ponmoligal?.afternoon) || hasData(selected?.ponmoligal?.evening)) && <DashedDivider />}
              </>
            )}
            {hasData(selected?.ponmoligal?.afternoon) && (
              <>
                <Text style={styles.quoteText}>{safeText(selected?.ponmoligal?.afternoon)}</Text>
                {hasData(selected?.ponmoligal?.evening) && <DashedDivider />}
              </>
            )}
            {hasData(selected?.ponmoligal?.evening) && (
              <Text style={styles.quoteText}>{safeText(selected?.ponmoligal?.evening)}</Text>
            )}
            {!hasData(selected?.ponmoligal?.morning) &&
             !hasData(selected?.ponmoligal?.afternoon) &&
             !hasData(selected?.ponmoligal?.evening) && (
              <Text style={styles.quoteText}>-</Text>
            )}
          </View>
        </View>

        {/* Birth & Death */}
        <View style={styles.whiteCard}>
          <View style={styles.redHeader}>
            <Text style={styles.redHeaderText}>பிறந்த நாள்</Text>
          </View>
          <View style={styles.centeredCardBody}>
            {hasData(selected?.birth?.morning) && (
              <>
                <Text style={styles.centeredBigLine}>{safeText(selected?.birth?.morning)}</Text>
                {(hasData(selected?.birth?.afternoon) || hasData(selected?.birth?.evening)) && <DashedDivider />}
              </>
            )}
            {hasData(selected?.birth?.afternoon) && (
              <>
                <Text style={styles.centeredBigLine}>{safeText(selected?.birth?.afternoon)}</Text>
                {hasData(selected?.birth?.evening) && <DashedDivider />}
              </>
            )}
            {hasData(selected?.birth?.evening) && (
              <Text style={styles.centeredBigLine}>{safeText(selected?.birth?.evening)}</Text>
            )}
            {!hasData(selected?.birth?.morning) &&
             !hasData(selected?.birth?.afternoon) &&
             !hasData(selected?.birth?.evening) && (
              <Text style={styles.centeredBigLine}>-</Text>
            )}
          </View>

          <View style={styles.redHeader}>
            <Text style={styles.redHeaderText}>நினைவு நாள்</Text>
          </View>
          <View style={styles.centeredCardBody}>
            {hasData(selected?.death?.morning) && (
              <>
                <Text style={styles.centeredBigLine}>{safeText(selected?.death?.morning)}</Text>
                {(hasData(selected?.death?.afternoon) || hasData(selected?.death?.evening)) && <DashedDivider />}
              </>
            )}
            {hasData(selected?.death?.afternoon) && (
              <>
                <Text style={styles.centeredBigLine}>{safeText(selected?.death?.afternoon)}</Text>
                {hasData(selected?.death?.evening) && <DashedDivider />}
              </>
            )}
            {hasData(selected?.death?.evening) && (
              <Text style={styles.centeredBigLine}>{safeText(selected?.death?.evening)}</Text>
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

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════ */
function CardRedHeader({ headerText, children }) {
  return (
    <View style={styles.whiteCard}>
    
      <View style={styles.redHeader}>
        <Text style={styles.redHeaderText} numberOfLines={2}>{headerText}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

function ThreeRowTimeTable({ value }) {
  const rows = [
    { label: "காலை",   time: value?.morning   || "" },
    { label: "மதியம்", time: value?.afternoon || "" },
    { label: "மாலை",   time: value?.evening   || "" },
  ];
  const rowsWithData = rows.filter((r) => r.time && r.time.toString().trim() !== "");

  return (
    <View style={styles.timeTable}>
      {rowsWithData.length > 0 ? (
        rowsWithData.map((r, i) => (
          <View key={i}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLeft}>{r.label}</Text>
              <Text style={styles.timeRight}>{to12Hour(r.time)}</Text>
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

/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  screen:    { flex: 1, backgroundColor: "#f8f9fa" },
  content:   { padding: 12, paddingBottom: 30 },
  center:    { alignItems: "center", justifyContent: "center", flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40, paddingBottom: 30,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  headerTablet:           { paddingTop: 50, paddingBottom: 28, paddingHorizontal: 18 },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center", marginLeft: 15,
  },
  backButtonTablet:       { width: 50, height: 50, borderRadius: 25 },
  headerTitle:            { flex: 1, textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "800", letterSpacing: 0.3 },
  headerTitleTablet:      { fontSize: 22 },
  headerRightPlaceholder: { width: 40, height: 40 },

  loadingText:  { marginTop: 12, fontWeight: "700", fontSize: 15, color: "#333" },
  errorText:    { color: "#ff3b63", fontWeight: "700", fontSize: 15, marginBottom: 12 },
  noDataText:   { fontWeight: "700", fontSize: 15, color: "#333", marginBottom: 12 },
  retryBtn:     { backgroundColor: "#ff3b63", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, elevation: 3 },
  retryBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  topCard: {
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 14,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 6, marginBottom: 12,
  },
  topRow:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)" },
  topDate: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: 1 },
  topSub:  { color: "#fff", textAlign: "center", fontSize: 14, fontWeight: "700", marginTop: 4, opacity: 0.95 },

  fallbackContainer: {
    backgroundColor: "#fff3e0", borderRadius: 12, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: "#ff9800", borderStyle: "dashed",
  },
  fallbackText: { color: "#b26a00", fontSize: 13, fontWeight: "600", textAlign: "center", lineHeight: 20 },

  whiteCard: {
    backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 4,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.5)",
  },
  redHeader:        { backgroundColor: "#ff3b63", paddingVertical: 12, paddingHorizontal: 14 },
  redHeaderText:    { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "900", letterSpacing: 0.3 },
  cardBody:         { padding: 14 },
  centeredCardBody: { padding: 16 },

  dashedDivider: { borderTopWidth: 1, borderTopColor: "#e0e0e0", borderStyle: "dashed", marginVertical: 10, width: "100%" },

  timeTable:       { paddingHorizontal: 6, paddingVertical: 4 },
  timeRow:         { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  timeLeft:        { fontSize: 16, fontWeight: "800", color: "#1a1a1a" },
  timeRight:       { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },

  quoteCard:       { backgroundColor: "#fff", padding: 16 },
  quoteText:       { fontSize: 15, fontWeight: "700", color: "#333", lineHeight: 24, textAlign: "left", paddingVertical: 4 },
  centeredBigLine: { fontSize: 15, fontWeight: "700", color: "#111", lineHeight: 24, textAlign: "left", paddingVertical: 4 },
});