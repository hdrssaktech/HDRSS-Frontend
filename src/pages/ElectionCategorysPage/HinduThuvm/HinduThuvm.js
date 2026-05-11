import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function DetailsScreen({ navigation }) {
  const [active, setActive] = useState(0); // First button active by default
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState("portrait");

  const buttons = [
    { label: "இந்து அமைப்புகள்", route: "HinduSamayam1" },
    { label: "இந்து நூல்கள்", route: "HinduNoolgal1" },
    { label: "இந்து தலைவர்கள்", route: "HinduLeaders1" },
    // { label: "நூல்கள்", route: "HinduNoolgal1" },
  ];

  // Detect screen size and orientation
  useEffect(() => {
    const updateLayout = () => {
      const { width, height } = Dimensions.get("window");
      const isTabletSize = width >= 600;
      setIsTablet(isTabletSize);
      setOrientation(width > height ? "landscape" : "portrait");
    };

    updateLayout();
    const subscription = Dimensions.addEventListener("change", updateLayout);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  const handlePress = (index, route, label) => {
    setActive(index);
    navigation.navigate(route,{categoryType: label});
  };

  return (
    <LinearGradient
      colors={["#FFF6E5", "#FDE2C2"]}
      style={[styles.container, isTablet && styles.containerTablet]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header with Back */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity 
          style={[styles.backBtn, isTablet && styles.backBtnTablet]} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 24} color="#93210A"/>
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content Container */}
        <View style={[
          styles.contentContainer,
          isTablet && styles.contentContainerTablet,
          orientation === "landscape" && styles.contentContainerLandscape
        ]}>
          
          {/* Heading + Description */}
          <View style={[
            styles.topTextWrap,
            isTablet && styles.topTextWrapTablet,
            orientation === "landscape" && styles.topTextWrapLandscape
          ]}>
            <Text style={[
              styles.heading,
              isTablet && styles.headingTablet,
              orientation === "landscape" && styles.headingLandscape
            ]}>
              இந்துத்துவம்
            </Text>
            <Text style={[
              styles.description,
              isTablet && styles.descriptionTablet,
              orientation === "landscape" && styles.descriptionLandscape
            ]}>
              இந்து அமைப்புகள் மற்றும் நூல்களை ஆராயுங்கள்.
            </Text>
          </View>

          {/* Buttons Container */}
          <View style={[
            styles.buttonsContainer,
            isTablet && styles.buttonsContainerTablet,
            orientation === "landscape" && styles.buttonsContainerLandscape
          ]}>
            
            {isTablet ? (
              // Tablet/Desktop View
              <View style={[
                styles.tabletButtonGrid,
                orientation === "landscape" && styles.tabletButtonGridLandscape
              ]}>
                {buttons.map((item, index) => {
                  const isActive = active === index;
                  return (
                    <Pressable
                      key={index}
                      onPress={() => handlePress(index, item.route, item.label)}
                      style={({ pressed }) => [
                        styles.buttonBase,
                        styles.buttonTablet,
                        isActive ? styles.buttonActive : styles.buttonInactive,
                        pressed && styles.buttonPressed,
                        orientation === "landscape" && styles.buttonTabletLandscape
                      ]}
                    >
                      <View style={[
                        styles.buttonContentTablet,
                        isActive && styles.buttonContentTabletActive
                      ]}>
                        <View style={styles.buttonTextContainer}>
                          <Text style={[
                            styles.btnTextTablet,
                            isActive ? styles.btnTextActive : styles.btnTextInactive,
                            orientation === "landscape" && styles.btnTextTabletLandscape
                          ]}>
                            {item.label}
                          </Text>
                        </View>
                        <View style={styles.iconContainer}>
                          <Ionicons
                            name="arrow-forward"
                            size={orientation === "landscape" ? 28 : 24}
                            color={isActive ? "#FFFFFF" : "#93210A"}
                          />
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              // Mobile View
              <View style={styles.stack}>
                {buttons.map((item, index) => {
                  const isActive = active === index;
                  return (
                    <Pressable
                      key={index}
                      onPress={() => handlePress(index, item.route,item.label)}
                      style={({ pressed }) => [
                        styles.buttonBase,
                        styles.buttonMobile,
                        isActive ? styles.buttonActive : styles.buttonInactive,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <Text style={[
                        styles.btnTextMobile,
                        isActive ? styles.btnTextActive : styles.btnTextInactive
                      ]}>
                        {item.label}
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={20}
                        color={isActive ? "#FFFFFF" : "#93210A"}
                      />
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          {/* Tablet Dots Indicator */}
          {isTablet && (
            <View style={[
              styles.tabletInfoContainer,
              orientation === "landscape" && styles.tabletInfoContainerLandscape
            ]}>
              <Text style={styles.tabletInfoText}>
                தேர்ந்தெடுத்து மேலும் அறிந்து கொள்ளுங்கள்
              </Text>
              <View style={styles.tabletDots}>
                {buttons.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.dot,
                      active === index ? styles.dotActive : styles.dotInactive
                    ]} 
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  containerTablet: {
    paddingHorizontal: 20,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  scrollContentTablet: {
    justifyContent: "center",
  },

  contentContainer: {
    flex: 1,
  },
  contentContainerTablet: {
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
    paddingVertical: 20,
  },
  contentContainerLandscape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 0,
  },

  /* Header */
  header: {
    paddingTop: 17,
    paddingHorizontal: 18,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTablet: {
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(230,126,34,0.20)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
    top: 60,
  },
  backBtnTablet: {
    width: 55,
    height: 55,
    top: 30,
    borderRadius: 27.5,
  },

  /* Heading section */
  topTextWrap: {
    paddingHorizontal: 28,
    marginTop: 120,
    marginBottom: 20,
  },
  topTextWrapTablet: {
    marginTop: 100,
    marginBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  topTextWrapLandscape: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
    paddingRight: 40,
    alignItems: "flex-start",
    maxWidth: 400,
  },
  heading: {
    fontSize: 19,
    fontWeight: "900",
    color: "#93210A",
    letterSpacing: 0.4,
    textAlign: "center",
    marginBottom: 15,
  },
  headingTablet: {
    fontSize: 32,
    marginTop: 20,
    letterSpacing: 0.6,
  },
  headingLandscape: {
    fontSize: 36,
    textAlign: "left",
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 23,
    color: "#231c1c",
    fontWeight: "600",
    textAlign: "center",
  },
  descriptionTablet: {
    fontSize: 18,
    lineHeight: 28,
    maxWidth: 600,
  },
  descriptionLandscape: {
    textAlign: "left",
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 500,
  },

  /* Mobile Button stack */
  stack: {
    paddingHorizontal: 28,
    marginTop: 10,
  },
  buttonMobile: {
    height: 64,
    width: "100%",
    marginBottom: 16,
  },

  /* Tablet Buttons */
  buttonsContainer: {
    marginTop: 10,
  },
  buttonsContainerTablet: {
    marginTop: 30,
  },
  buttonsContainerLandscape: {
    flex: 1,
    marginTop: 0,
    paddingLeft: 20,
  },
  tabletButtonGrid: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 30,
  },
  tabletButtonGridLandscape: {
    gap: 25,
    justifyContent: "flex-start",
  },
  
  /* Common Button Styles */
  buttonBase: {
    borderRadius: 40,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  buttonTablet: {
    width: width >= 900 ? 300 : 280,
    height: width >= 900 ? 170 : 160,
    borderRadius: 30,
    padding: 25,
    marginBottom: 0,
  },
  buttonTabletLandscape: {
    width: width >= 900 ? 280 : 260,
    height: width >= 900 ? 160 : 150,
  },
  
  buttonContentTablet: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },
  buttonContentTabletActive: {
    // Additional styles for active tablet button
  },
  
  buttonTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  
  iconContainer: {
    alignSelf: "flex-end",
    marginTop: 10,
  },

  /* Active Button */
  buttonActive: {
    backgroundColor: "#93210A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  /* Inactive Button */
  buttonInactive: {
    backgroundColor: "#FFF1DD",
    borderWidth: 2,
    borderColor: "#F3C9A5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },

  /* Button Text */
  btnTextMobile: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
    flex: 1,
  },
  btnTextTablet: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
    lineHeight: 26,
  },
  btnTextTabletLandscape: {
    fontSize: 17,
    lineHeight: 24,
  },
  btnTextActive: {
    color: "#FFFFFF",
  },
  btnTextInactive: {
    color: "#93210A",
  },

  /* Tablet Additional Info */
  tabletInfoContainer: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  tabletInfoContainerLandscape: {
    marginTop: 30,
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  tabletInfoText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "500",
  },
  tabletDots: {
    flexDirection: "row",
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: "#93210A",
    width: 30,
  },
  dotInactive: {
    backgroundColor: "#F3C9A5",
  },
});