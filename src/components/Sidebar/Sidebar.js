import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Linking,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@hdrsssandilyan";

export default function Sidebar({ closeSidebar }) {
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= 600;

const sidebarWidth = isTablet
  ? Math.min(320, screenWidth * 0.55)
  : Math.min(300, screenWidth * 0.82);

  const items = [
    { label: "Home",              icon: "home",             screen: "HomePage"    },
    { label: "About",             icon: "info",             screen: "AboutPage1"  },
    { label: "Principles",        icon: "scale",            screen: "Principles"  },
    { label: "Quiz",              icon: "quiz",             screen: "QuizCategories" },
    { label: "Charities",         icon: "volunteer-activism",screen: "CharitiePage1"},
    { label: "HDRSS Leader",      icon: "person",           screen: "Member"      },
    { label: "Membership Form",   icon: "assignment",       screen: "Member1"     },
    { label: "2026 Election Survey", icon: "how-to-vote",   screen: "Assemblies"  },
    { label: "Job Opportunities", icon: "work",             screen: "JobPage1"    },
    { label: "Events History",    icon: "history",          screen: "EventMonth"  },
    { label: "News History",      icon: "newspaper",        screen: "NewsMonth"   },
   
  ];

  const navigation = useNavigation();

  const handlePress = (screen) => {
    navigation.navigate(screen);
    if (closeSidebar) closeSidebar();
  };

  const handleYouTube = () => {
    Linking.openURL(YOUTUBE_CHANNEL_URL);
    if (closeSidebar) closeSidebar();
  };

  return (
    <View style={styles.overlay}>

      {/* SIDEBAR */}
      <View style={[styles.sidebar, { width: sidebarWidth }]}>

        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: isTablet ? 54 : 46 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.logoCircle}>
              <Icon name="groups" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.orgName}>HDRSS</Text>
              <Text style={styles.orgSub}>Rama Sandilyan</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={closeSidebar}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.closeBtn}
          >
            <Icon name="close" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* ── Menu Label ── */}
        {/* <Text style={styles.sectionLabel}>NAVIGATION</Text> */}

        {/* ── Menu Items ── */}
        <View style={{ flex: 1 }}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.6}
              onPress={() => handlePress(item.screen)}
            >
              <View style={styles.iconWrap}>
                <Icon name={item.icon} size={18} color="#E65100" />
              </View>
              <Text style={styles.label}>{item.label}</Text>
              <Icon name="chevron-right" size={16} color="#ddd" style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── YouTube Button ── */}
        <View style={styles.youtubeContainer}>
          <TouchableOpacity
            style={styles.youtubeButton}
            onPress={handleYouTube}
            activeOpacity={0.85}
          >
            <View style={styles.ytIconWrap}>
              <Icon name="play-arrow" size={16} color="#CC0000" />
            </View>
            <Text style={styles.youtubeText}>Watch on YouTube</Text>
            <Icon name="open-in-new" size={14} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>

      </View>

      {/* DIM BACKGROUND */}
      <TouchableWithoutFeedback onPress={closeSidebar}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  background: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  /* Sidebar shell */
  sidebar: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E65100",
    alignItems: "center",
    justifyContent: "center",
  },
  orgName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: 0.5,
  },
  orgSub: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
    marginTop: -1,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Menu item */
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 1,
    marginHorizontal: 8,
    marginVertical: 1,
    borderRadius: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFF3EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: "#2D2D2D",
    fontWeight: "500",
  },

  /* YouTube button */
  youtubeContainer: {
    paddingHorizontal: 14,
    paddingBottom: 28,
    paddingTop: 10,
  },
  youtubeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CC0000",
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    elevation: 4,
    shadowColor: "#CC0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    gap: 10,
  },
  ytIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  youtubeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
});