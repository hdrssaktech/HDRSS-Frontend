import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

// ✅ Custom hook for responsive design
const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;
  const isLandscape = width > height;

  // Responsive sizes
  const sizes = {
    // Header
    headerHeight: isTablet ? (isLargeTablet ? 140 : 120) : 100,
    headerTitleSize: isTablet ? (isLargeTablet ? 32 : 28) :18,
    headerIconSize: isTablet ? 32 : 20,
    headerTopPadding: isTablet ? (Platform.OS === 'ios' ? 60 : 50) : (Platform.OS === 'ios' ? 50 : 40),
    
    // Buttons
    buttonPadding: isTablet ? (isLargeTablet ? 28 : 24) : 16,
    buttonFontSize: isTablet ? (isLargeTablet ? 22 : 20) : 16,
    buttonIconSize: isTablet ? 32 : 26,
    buttonRadius: isTablet ? 20 : 14,
    
    // Join button
    joinButtonWidth: isTablet ? (isLargeTablet ? "50%" : "60%") : "85%",
    joinButtonPadding: isTablet ? (isLargeTablet ? 28 : 24) : 18,
    joinButtonFontSize: isTablet ? (isLargeTablet ? 24 : 22) : 18,
    joinButtonIconSize: isTablet ? 36 : 28,
    
    // Spacing
    marginTop: isTablet ? (isLargeTablet ? 80 : 60) : 40,
    buttonMargin: isTablet ? 12 : 8,
    containerPadding: isTablet ? (isLargeTablet ? 24 : 20) : 16,
  };

  return {
    isTablet,
    isLargeTablet,
    isLandscape,
    sizes,
    width,
    height,
  };
};

export default function Member0() {
  const navigation = useNavigation();
  const route = useRoute();
  const responsive = useResponsive();
  // const { districtId, districtName } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      
      {/* 🔹 Header */}
      <View style={[
        styles.header,
        {
          paddingTop: responsive.sizes.headerTopPadding,
          paddingBottom: responsive.isTablet ? 25 : 22,
        }
      ]}>
        {/* 🔙 Back Arrow */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            { top: responsive.isTablet ? 50 : 40 }
          ]}
        >
          <Ionicons 
            name="chevron-back" 
            size={responsive.sizes.headerIconSize} 
            color="#fff" 
          />
        </TouchableOpacity>

        <Text style={[
          styles.headerTitle,
          { fontSize: responsive.sizes.headerTitleSize }
        ]}>
          Leadership Directory
        </Text>
      </View>

      {/* 🔹 Main Content */}
      <View style={[
        styles.content,
        { paddingHorizontal: responsive.sizes.containerPadding }
      ]}>
        {/* 🔹 Buttons Row */}
        <View style={[
          styles.buttonRow,
          { 
            marginTop: responsive.sizes.marginTop,
            gap: responsive.sizes.buttonMargin,
          }
        ]}>
          {/* State Level */}
          <TouchableOpacity
            style={[
              styles.mainButton,
              { 
                backgroundColor: "#93210A",
                paddingVertical: responsive.sizes.buttonPadding,
                borderRadius: responsive.sizes.buttonRadius,
              }
            ]}
            onPress={() =>
              navigation.navigate("Member", {
                categoryType: "State",
              })
            }
          >
            <Ionicons 
              name="people-circle-outline" 
              size={responsive.sizes.buttonIconSize} 
              color="#fff" 
            />
            <Text style={[
              styles.mainButtonText,
              { fontSize: responsive.sizes.buttonFontSize }
            ]}>
              State Level
            </Text>
          </TouchableOpacity>

          {/* District Level */}
          <TouchableOpacity
            style={[
              styles.mainButton,
              { 
                backgroundColor: "#E0A800",
                paddingVertical: responsive.sizes.buttonPadding,
                borderRadius: responsive.sizes.buttonRadius,
              }
            ]}
            onPress={() =>
              navigation.navigate("Member", {
                categoryType: "Districts",
                // districtId,
                // districtName,
              })
            }
          >
            <Ionicons 
              name="location-outline" 
              size={responsive.sizes.buttonIconSize} 
              color="#fff" 
            />
            <Text style={[
              styles.mainButtonText,
              { fontSize: responsive.sizes.buttonFontSize }
            ]}>
              District Level
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 Join Button */}
        <View style={[
          styles.joinContainer,
          { marginTop: responsive.sizes.marginTop }
        ]}>
          <TouchableOpacity
            style={[
              styles.joinButton,
              {
                width: responsive.sizes.joinButtonWidth,
                paddingVertical: responsive.sizes.joinButtonPadding,
                borderRadius: responsive.isTablet ? 24 : 16,
              }
            ]}
            onPress={() => navigation.navigate("Member1")}
          >
            <Ionicons 
              name="person-add-outline" 
              size={responsive.sizes.joinButtonIconSize} 
              color="#fff" 
            />
            <Text style={[
              styles.joinButtonText,
              { fontSize: responsive.sizes.joinButtonFontSize }
            ]}>
              Join With Us
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#93210A",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
    width: "100%",
  },

  backButton: {
    position: "absolute",
    left: 16,
    padding: 8,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 25,
  },

  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "80%",
  },

  content: {
    flex: 1,
    backgroundColor: "#fff",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  mainButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 50, // Ensure minimum touch target
  },

  mainButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    includeFontPadding: false, // Better text alignment
  },

  joinContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A8754",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    minHeight: 56, // Minimum touch target
  },

  joinButtonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 10,
    includeFontPadding: false, // Better text alignment
  },
});

// Optional: You can add this for even more granular control
const additionalStyles = {
  // Add these to your existing styles if needed
  
  // Tablet specific adjustments
  tabletHeader: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  
  // Landscape specific adjustments
  landscapeButtonRow: {
    maxWidth: '80%',
    alignSelf: 'center',
  },
  
  // Hover effects (web only)
  webHover: Platform.select({
    web: {
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      ':hover': {
        transform: 'scale(1.02)',
        opacity: 0.95,
      },
    },
    default: {},
  }),
};