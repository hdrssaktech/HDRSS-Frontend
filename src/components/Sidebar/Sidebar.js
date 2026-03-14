import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 600;

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@hdrsssandilyan"; 

export default function Sidebar({ closeSidebar }) {
  const items = [
    { label: "Home", icon: "home", screen: "HomePage" },
    { label: "About", icon: "info", screen: "AboutPage1" },
    { label: "Charities", icon: "volunteer-activism", screen: "CharitiePage1" },
    { label: "HDRSS Leader", icon: "person", screen: "Member" },
    { label: "Membership Form", icon: "assignment", screen: "Member1" },
    { label: "2026 Election Survey", icon: "how-to-vote", screen: "Assemblies" },
    { label: "Job Opportunities", icon: "work", screen: "JobPage1" },
    { label: "Events History", icon: "history", screen: "EventMonth" },
    { label: "News History", icon: "newspaper", screen: "NewsMonth" },
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
      <TouchableWithoutFeedback onPress={closeSidebar}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      <View style={styles.sidebar}>
        {/* Menu Items */}
        <View style={styles.menuList}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handlePress(item.screen)}
            >
              <Icon
                name={item.icon}
                size={isTablet ? 28 : 24}
                color="#E65100"
                style={styles.icon}
              />
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* YouTube Button — pinned to bottom */}
        <View style={styles.youtubeContainer}>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.youtubeButton}
            onPress={handleYouTube}
            activeOpacity={0.8}
          >
            {/* YouTube SVG-style icon using Text fallback */}
            <Icon name="smart-display" size={isTablet ? 24 : 22} color="#fff" style={styles.ytIcon} />
            <Text style={styles.youtubeText}>Watch on YouTube</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: "rgba(0,0,0,0.3)",
    ...(isTablet && { backgroundColor: "rgba(0,0,0,0.4)" }),
  },
  sidebar: {
    width: isTablet ? 280 : 250,
    backgroundColor: "#fff",
    paddingTop: isTablet ? 70 : 60,
    elevation: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isTablet ? 18 : 16,
    paddingHorizontal: isTablet ? 22 : 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  icon: {
    marginRight: isTablet ? 22 : 20,
  },
  label: {
    fontSize: isTablet ? 18 : 16,
    color: "#333",
  },

  // YouTube section
  youtubeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginBottom: 14,
  },
  youtubeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#93210A",
    borderRadius: 8,
    paddingVertical: isTablet ? 13 : 12,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: "#93210A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  ytIcon: {
    marginRight: 10,
  },
  youtubeText: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
});