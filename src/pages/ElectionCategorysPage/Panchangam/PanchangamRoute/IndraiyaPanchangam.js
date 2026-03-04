// DailyPanchangamScreen.js - CORRECTED Rasi Kattam
// ✅ Perfect box alignment - NO GAPS between boxes
// ✅ Proper border rendering
// ✅ Center box wider (2x)
// ✅ All boxes touch perfectly
// ✅ Removed inner icons from content sections, kept header icons

import React, { useEffect, useMemo, useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const API_URL = "https://hdrss-backend.onrender.com/api/v1/panchangam/indray-panjagam";

const TAMIL_WEEKDAYS = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
const TAMIL_MONTHS = ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", 
                      "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"];

// Helper functions
function pad2(n) { return String(n).padStart(2, "0"); }
function formatDDMMYYYY(d) { return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`; }
function toISODate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function weekdayTamil(d) { return TAMIL_WEEKDAYS[d.getDay()] || ""; }
function monthTamil(d) { return TAMIL_MONTHS[d.getMonth()] || ""; }
function addDays(d, diff) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff); }

// Extract "தை 29" from oorai.details
function extractThaiText(details) {
  const s = String(details || "");
  const m = s.match(/தை\s*([0-9]{1,2})/);
  if (m) return `தை ${m[1]}`;
  return "";
}

// Extract sunrise time from karanam
function extractSunriseTimeFromKaranam(karanam) {
  const s = String(karanam || "");
  const m = s.match(/(\d{1,2}[:.]\d{2}\s*(AM|PM))/i);
  if (m) return m[1].toUpperCase().replace(":", ".");
  const d = s.match(/(\d{1,2}\.\d{2})/);
  if (d) return d[1];
  return "";
}

// Dashed divider component
function DashedDivider() {
  return <View style={styles.dashedDivider} />;
}

// ✅ CORRECTED Rasi Kattam configurations by weekday
const RASI_BY_DAY = {
  4: { // Thursday
    top: ["", "", "", "குரு"],
    midL: "புத\nசுக்\nராகு\nசனி",
    midR: "கேது",
    bot: ["", "சந்", "", ""],
    center: "1-மக-சுக்\n15-(கும்-புத)\n24-(கும்-சுக்)",
  },
  0: { // Sunday
    top: ["", "", "சூரியன்", ""],
    midL: "மக\nசுக்",
    midR: "சனி",
    bot: ["சந்", "", "", "குரு"],
    center: "2-சிம்மம்\n16-தனுசு\n25-மீனம்",
  },
  1: { // Monday
    top: ["சந்", "", "", ""],
    midL: "புத\nசுக்",
    midR: "ராகு",
    bot: ["", "குரு", "", "கேது"],
    center: "3-கடகம்\n17-மகரம்\n26-மேஷம்",
  },
  2: { // Tuesday
    top: ["", "செவ்வாய்", "", ""],
    midL: "சூரியன்\nபுத",
    midR: "சனி",
    bot: ["", "", "குரு", "சுக்"],
    center: "4-சிம்மம்\n18-கும்பம்\n27-ரிஷபம்",
  },
  3: { // Wednesday
    top: ["", "", "புதன்", ""],
    midL: "சந்திரன்\nசுக்",
    midR: "கேது",
    bot: ["ராகு", "", "", "குரு"],
    center: "5-மிதுனம்\n19-மீனம்\n28-கடகம்",
  },
  5: { // Friday
    top: ["", "சுக்கிரன்", "", ""],
    midL: "சனி\nராகு",
    midR: "சூரியன்",
    bot: ["", "குரு", "", "புத"],
    center: "6-விருச்சிகம்\n20-சிம்மம்\n29-துலாம்",
  },
  6: { // Saturday
    top: ["", "", "", "சனி"],
    midL: "குரு\nபுத",
    midR: "சுக்கிரன்",
    bot: ["ராகு", "", "சூரியன்", ""],
    center: "7-மகரம்\n21-கன்னி\n30-மேஷம்",
  },
  default: {
    top: ["", "", "", "குரு"],
    midL: "புத\nசுக்",
    midR: "கேது",
    bot: ["", "சந்", "", ""],
    center: "1-மக-சுக்\n15-(கும்-புத)\n24-(கும்-சுக்)",
  },
};

// ✅ CORRECTED Rasi Box Component - PERFECT ALIGNMENT
function RasiBox({ text, center, isLarge }) {
  return (
    <View style={[
      styles.rasiBox,
      center && styles.rasiCenterBox,
    ]}>
      {!!text && (
        <Text style={[
          styles.rasiText,
          isLarge && styles.rasiLargeText
        ]}>
          {text}
        </Text>
      )}
    </View>
  );
}

// Section Header Component
function SectionHeader({ title, compact = false }) {
  return (
    <View style={[styles.sectionHeader, compact && styles.sectionHeaderCompact]}>
      <Text style={[styles.sectionHeaderText, compact && styles.sectionHeaderTextCompact]}>
        {title}
      </Text>
    </View>
  );
}

export default function DailyPanchangamScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [byDate, setByDate] = useState(new Map());

  // Fetch API data
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        const list = res?.data?.data || [];
        const map = new Map();
        list.forEach((x) => x?.date && map.set(String(x.date), x));
        if (alive) setByDate(map);
      } catch (e) {
        Alert.alert("தகவல்", "சேவையகத்திலிருந்து தரவு பெற முடியவில்லை");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const record = useMemo(() => {
    return byDate.get(toISODate(currentDate)) || null;
  }, [byDate, currentDate]);

  // Header texts
  const headerTopTitle = `${monthTamil(currentDate)} - ${weekdayTamil(currentDate)}`;
  const dateTitle = formatDDMMYYYY(currentDate);
  
  const headerSubTitle = useMemo(() => {
    const det = record?.oorai?.[0]?.details;
    if (det && String(det).trim()) {
      return String(det).replace(/\s+/g, " ").trim();
    }
    return `உத்தராயணம் - விசுவாவசு - தை ${currentDate.getDate()}`;
  }, [record, currentDate]);

  // Tile data
  const thaiText = useMemo(() => {
    const det = record?.oorai?.[0]?.details || "";
    return extractThaiText(det);
  }, [record]);

  const sunriseText = useMemo(() => 
    extractSunriseTimeFromKaranam(record?.karanam), 
  [record]);

  // Main 5 rows
  const rows = useMemo(() => {
    return [
      { id: "tithi", iconBg: "#3fc3a8", icon: "moon-outline", title: "திதி", value: record?.tithi },
      { id: "nat", iconBg: "#f5a623", icon: "star-outline", title: "நட்சத்திரம்", value: record?.natchathiram },
      { id: "yog", iconBg: "#ff4f9a", icon: "flower-outline", title: "யோகம்", value: record?.naamyogam },
      { id: "kar", iconBg: "#7b74ff", icon: "search-outline", title: "கரணம்", value: record?.karanam },
      { id: "cha", iconBg: "#1f7ae0", icon: "sparkles-outline", title: "சந்திராஷ்டமம்", value: record?.santhiraistam },
    ].map((x) => ({ 
      ...x, 
      value: (x.value && String(x.value).trim()) ? String(x.value) : "-" 
    }));
  }, [record]);

  // Nalla Neram - Removed emoji icons
  const nallaNeram = useMemo(() => {
    const morning = record?.nalla_neram?.morning;
    const evening = record?.nalla_neram?.evening;
    const out = [];
    if (morning) out.push(`காலை : ${morning}`);
    if (evening) out.push(`மாலை : ${evening}`);
    return out.length ? out.join("\n") : "நல்ல நேரம் இல்லை";
  }, [record]);

  // Ketta Neram - Removed emoji icons
  const kettaNeram = useMemo(() => {
    const arr = record?.ketta_neram;
    if (!Array.isArray(arr) || arr.length === 0) return "கெட்ட நேரம் இல்லை";
    return arr.join("\n");
  }, [record]);

  // Gowri Nalla Neram - Removed emoji icons
  const gowriNallaNeram = useMemo(() => {
    const morning = Array.isArray(record?.gowri_nalla_neram?.morning) 
      ? record.gowri_nalla_neram.morning 
      : [];
    const evening = Array.isArray(record?.gowri_nalla_neram?.evening) 
      ? record.gowri_nalla_neram.evening 
      : [];
    
    const out = [];
    if (morning.length) {
      out.push(`காலை : ${morning.join(", ")}`);
    }
    if (evening.length) {
      out.push(`மாலை : ${evening.join(", ")}`);
    }
    return out.length ? out.join("\n") : "கௌரி நல்ல நேரம் இல்லை";
  }, [record]);

  // Oorai
  const oorai = useMemo(() => {
    const arr = record?.oorai;
    if (!Array.isArray(arr) || arr.length === 0) return "ஓரை தகவல் இல்லை";
    
    return arr
      .map((x, index) => {
        const name = (x?.name || "").trim();
        const details = (x?.details || "").trim();
        if (name && details) {
          return `${index + 1}. ${name}\n   ${details}`;
        }
        return name || details;
      })
      .filter(Boolean)
      .join("\n\n");
  }, [record]);

  // Rasi kattam by weekday
  const rasi = useMemo(() => {
    const w = currentDate.getDay();
    return RASI_BY_DAY[w] || RASI_BY_DAY.default;
  }, [currentDate]);

  // Date navigation
  const onPrevDay = () => setCurrentDate((d) => addDays(d, -1));
  const onNextDay = () => setCurrentDate((d) => addDays(d, 1));
  const onToday = () => setCurrentDate(new Date());

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#ff4f9a" />
          <Text style={styles.loadingText}>பஞ்சாங்கம் தரவு ஏற்றப்படுகிறது...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.headerIconBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>இன்றைய பஞ்சாங்கம்</Text>
        
        <TouchableOpacity onPress={onToday} style={styles.headerIconBtn}>
          <Ionicons name="today-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* PINK HEADER CARD */}
        <View style={styles.topCard}>
          <Text style={styles.topSmallTitle}>{headerTopTitle}</Text>

          <View style={styles.topRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={onPrevDay}>
              <Ionicons name="chevron-back" size={34} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.topDate}>{dateTitle}</Text>

            <TouchableOpacity style={styles.iconBtn} onPress={onNextDay}>
              <Ionicons name="chevron-forward" size={34} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.topSub}>{headerSubTitle}</Text>
        </View>

        {/* 3 COLOR TILES */}
        <View style={styles.tilesRow}>
          {/* Tile 1: Month & Weekday */}
          <View style={[styles.tile, styles.tileGreen]}>
            <Ionicons name="calendar-outline" size={32} color="#fff" />
            <Text style={styles.tileText}>{monthTamil(currentDate)}</Text>
            <Text style={styles.tileText}>{weekdayTamil(currentDate)}</Text>
          </View>

          {/* Tile 2: Naamyogam & Thai */}
          <View style={[styles.tile, styles.tilePink]}>
            <Ionicons name="leaf-outline" size={32} color="#fff" />
            <Text style={styles.tileText}>
              {(record?.naamyogam && String(record.naamyogam).trim()) ? record.naamyogam : "விசுவாவசு"}
            </Text>
            <Text style={styles.tileText}>{thaiText || `தை ${currentDate.getDate()}`}</Text>
          </View>

          {/* Tile 3: Sunrise */}
          <View style={[styles.tile, styles.tileBlue]}>
            <Ionicons name="sunny-outline" size={32} color="#fff" />
            <Text style={styles.tileText}>சூரிய</Text>
            <Text style={styles.tileText}>உதயம்</Text>
            <Text style={styles.tileText}>{sunriseText || "06:35"}</Text>
          </View>
        </View>

        <DashedDivider />

        {/* 5 MAIN ROWS */}
        <View style={styles.infoCard}>
          {rows.map((r, idx) => (
            <View key={r.id}>
              <View style={styles.infoRow}>
                <View style={[styles.infoIconBox, { backgroundColor: r.iconBg }]}>
                  <Ionicons name={r.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.infoTitle}>{r.title}</Text>
                <Text style={styles.infoColon}>:</Text>
                <Text style={styles.infoValue}>{r.value}</Text>
              </View>
              {idx !== rows.length - 1 && <DashedDivider />}
            </View>
          ))}
        </View>

        {/* ✅ CORRECTED RASI KATTAM - PERFECT BOX ALIGNMENT, ABSOLUTELY NO GAPS */}
        <View style={styles.rasiCard}>
          <SectionHeader title="ராசி கட்டம்" />
          
          <View style={styles.rasiContainer}>
            {/* Top Row - 4 Boxes */}
            <View style={styles.rasiRow}>
              <View style={styles.rasiBoxContainer}>
                <RasiBox text={rasi.top[0]} />
              </View>
              <View style={styles.rasiBoxContainer}>
                <RasiBox text={rasi.top[1]} />
              </View>
              <View style={styles.rasiBoxContainer}>
                <RasiBox text={rasi.top[2]} />
              </View>
              <View style={styles.rasiBoxContainer}>
                <RasiBox text={rasi.top[3]} />
              </View>
            </View>

            {/* Middle Row - 3 Boxes (Left, Center, Right) */}
            <View style={styles.rasiRow}>
              <View style={[styles.rasiBoxContainer, styles.rasiBoxContainerFlex1]}>
                <RasiBox text={rasi.midL} isLarge={true} />
              </View>
              <View style={[styles.rasiBoxContainer, styles.rasiBoxContainerFlex2]}>
                <RasiBox center text={rasi.center} isLarge={true} />
              </View>
              <View style={[styles.rasiBoxContainer, styles.rasiBoxContainerFlex1]}>
                <RasiBox text={rasi.midR} />
              </View>
            </View>

            {/* Bottom Row - 4 Boxes */}
            <View style={styles.rasiRow}>
              <View style={styles.rasiBoxContainer}>
                <RasiBox text={rasi.bot[0]} />
              </View>
              <View style={styles.rasiBoxContainer}>
                <RasiBox text={rasi.bot[1]} />
              </View>
              <View style={styles.rasiBoxContainer}>
                <RasiBox text={rasi.bot[2]} />
              </View>
              <View style={styles.rasiBoxContainer}>
                <RasiBox text={rasi.bot[3]} />
              </View>
            </View>
          </View>
        </View>

        {/* NALLA NERAM - WITHOUT INNER ICON */}
        <View style={styles.contentCard}>
          <SectionHeader title="நல்ல நேரம்" compact={true} />
          <View style={styles.centeredContainer}>
            <Text style={styles.centeredText}>{nallaNeram}</Text>
          </View>
        </View>

        {/* KETTA NERAM - WITHOUT INNER ICON */}
        <View style={styles.contentCard}>
          <SectionHeader title="கெட்ட நேரம்" compact={true} />
          <View style={styles.centeredContainer}>
            <Text style={styles.centeredText}>{kettaNeram}</Text>
          </View>
        </View>

        {/* GOWRI NALLA NERAM - WITHOUT INNER ICON */}
        <View style={styles.contentCard}>
          <SectionHeader title="கௌரி நல்ல நேரம்" compact={true} />
          <View style={styles.centeredContainer}>
            <Text style={styles.centeredText}>{gowriNallaNeram}</Text>
          </View>
        </View>

        {/* OORAI - WITHOUT INNER ICON */}
        <View style={styles.contentCard}>
          <SectionHeader title="ஓரை" compact={true} />
          <View style={styles.centeredContainer}>
            <Text style={styles.centeredText}>{oorai}</Text>
          </View>
        </View>

        {/* Footer Note - Commented out
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            * இன்றைய பஞ்சாங்க விபரங்கள் தமிழ் மரபுப்படி கணக்கிடப்பட்டுள்ளது
          </Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ==================== CORRECTED STYLES ==================== */
const styles = StyleSheet.create({
  // Container Styles
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 14,
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 10 : 40,
    paddingBottom: 16,
    paddingHorizontal: 14,
    backgroundColor: "#8B0000",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "900",
    textAlign: "center",
  },

  // Loading Styles
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
  },

  // Top Pink Card
  topCard: {
    backgroundColor: "#ff4f9a",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  topSmallTitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  topDate: {
    color: "#fff",
    fontSize: 35,
    fontWeight: "900",
    letterSpacing: 1,
  },
  topSub: {
    color: "#ffeaf3",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 10,
  },

  // 3 Tiles
  tilesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tile: {
    width: "31.5%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  tileGreen: {
    backgroundColor: "#2fb86b",
  },
  tilePink: {
    backgroundColor: "#ff3b63",
  },
  tileBlue: {
    backgroundColor: "#1f7ae0",
  },
  tileText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 22,
  },

  // Divider
  dashedDivider: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderStyle: "dashed",
    marginVertical: 10,
  },

  // Info Card - 5 Rows
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoIconBox: {
    width: 27,
    height: 27,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoTitle: {
    width: 110,
    fontSize: 14,
    fontWeight: "900",
    color: "#222",
  },
  infoColon: {
    width: 16,
    fontSize: 18,
    fontWeight: "900",
    color: "#222",
    textAlign: "center",
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    color: "#222",
    lineHeight: 24,
  },

  // ✅ CORRECTED Rasi Kattam Styles - ABSOLUTELY NO GAPS
  rasiCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  rasiContainer: {
    padding: 0,
    backgroundColor: "#fffcf0",
  },
  rasiRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 0,
  },
  rasiBoxContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f3b400",
    marginRight: -1,
    marginBottom: -1,
    backgroundColor: "#fffcf0",
  },
  rasiBoxContainerFlex1: {
    flex: 1,
  },
  rasiBoxContainerFlex2: {
    flex: 2,
  },
  rasiBox: {
    flex: 1,
    height: 85,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    backgroundColor: "#fffcf0",
  },
  rasiCenterBox: {
    // No additional styles needed
  },
  rasiText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#333",
    textAlign: "center",
    lineHeight: 20,
  },
  rasiLargeText: {
    fontSize: 12,
    lineHeight: 22,
  },

  // Section Header
  sectionHeader: {
    backgroundColor: "#19b57f",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeaderCompact: {
    paddingVertical: 10,
  },
  sectionHeaderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  sectionHeaderTextCompact: {
    fontSize: 16,
  },

  // Content Cards
  contentCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  // Centered Content Styles - UPDATED: removed neramBadge styles
  centeredContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  centeredText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#333",
    textAlign: "center",
    lineHeight: 28,
  },

  // Footer (commented out)
  footerNote: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
  },
});