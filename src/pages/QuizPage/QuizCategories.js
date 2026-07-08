import React, { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { QUIZ_CATEGORIES, COMPLETED_CATEGORIES_KEY, useLanguage } from "./quizData";

const MAROON = "#93210A";
const GOLD = "#D4AF37";
const CREAM = "#FBEEDB";
const CREAM_DARK = "#F1DDB0";
const CREAM_LIGHT = "#FFFDF8";
const MAROON_DARK = "#301913";

const LABELS = {
  ta: { 
    header: "வகையைத் தேர்ந்தெடு", 
    completed: "முடிந்தது", 
    alertTitle: "ஏற்கனவே முடிந்தது", 
    alertMsg: (t) => `"${t}" ஏற்கனவே முடிந்துவிட்டது. இதை மீண்டும் செய்ய முடியாது.` 
  },
  en: { 
    header: "Select Category", 
    completed: "Completed", 
    alertTitle: "Already completed", 
    alertMsg: (t) => `You have already completed "${t}". This category cannot be retaken.` 
  },
};

export default function QuizCategories({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const { language, toggleLanguage } = useLanguage();
  const t = LABELS[language];
  const isTamil = language === "ta";

  // Changed: 3 columns on mobile, 3 columns on tablet (you can adjust as needed)
  const numColumns = 3; // Always 3 columns
  const GRID_GAP = isTablet ? 20 : 12;
  const HORIZONTAL_PADDING = isTablet ? 24 : 16;

  const squareSize =
    (width - HORIZONTAL_PADDING * 2 - GRID_GAP * (numColumns - 1)) / numColumns;

  const [completedIds, setCompletedIds] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        try {
          const stored = await AsyncStorage.getItem(COMPLETED_CATEGORIES_KEY);
          if (isActive) setCompletedIds(stored ? JSON.parse(stored) : []);
        } catch (_error) {
          if (isActive) setCompletedIds([]);
        }
      })();
      return () => { isActive = false; };
    }, [])
  );

  const handlePress = (category, isCompleted) => {
    if (isCompleted) {
      Alert.alert(t.alertTitle, t.alertMsg(category.title[language]));
      return;
    }
    navigation.navigate("QuizQuestions", { categoryId: category.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={MAROON} />

      {/* 🔹 Header - Clean design with proper positioning */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons 
            name="chevron-back" 
            size={isTablet ? 30 : 24} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <Text style={[
          styles.headerTitle,
          isTablet && styles.headerTitleTablet,
          isTamil ? styles.headerTitleTamil : styles.headerTitleEnglish
        ]}>
          {t.header}
        </Text>

        <TouchableOpacity 
          style={[styles.langButton, isTablet && styles.langButtonTablet]} 
          onPress={toggleLanguage}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.langButtonText,
            isTablet && styles.langButtonTextTablet,
            isTamil ? styles.langButtonTextTamil : styles.langButtonTextEnglish
          ]}>
            {language === "ta" ? "EN" : "தமிழ்"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Body */}
      <ScrollView 
        style={styles.body}
        contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.grid, { gap: GRID_GAP }]}>
          {QUIZ_CATEGORIES.map((category) => {
            const isCompleted = completedIds.includes(category.id);
            return (
              <TouchableOpacity
                key={category.id}
                activeOpacity={0.85}
                style={{ width: squareSize, height: squareSize }}
                onPress={() => handlePress(category, isCompleted)}
              >
                <LinearGradient
                  colors={isCompleted ? [CREAM_DARK, CREAM] : [CREAM_LIGHT, CREAM]}
                  style={[
                    styles.square,
                    { width: squareSize, height: squareSize },
                    isCompleted && styles.squareCompleted,
                    isTablet && styles.squareTablet,
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={[
                    styles.iconCircle,
                    { backgroundColor: category.color },
                    isTablet && styles.iconCircleTablet
                  ]}>
                    <MaterialIcons 
                      name={category.icon} 
                      size={isTablet ? 30 : 20} 
                      color="#fff" 
                    />
                  </View>
                  <Text 
                    style={[
                      styles.squareText,
                      isTablet && styles.squareTextTablet,
                      isCompleted && styles.squareTextCompleted,
                      isTamil ? styles.squareTextTamil : styles.squareTextEnglish
                    ]}
                    numberOfLines={isTamil ? 2 : 2}
                  >
                    {category.title[language]}
                  </Text>
                  {isCompleted && (
                    <View style={[
                      styles.completedBadge,
                      isTablet && styles.completedBadgeTablet
                    ]}>
                      <MaterialIcons 
                        name="check-circle" 
                        size={isTablet ? 16 : 10} 
                        color={MAROON} 
                      />
                      <Text style={[
                        styles.completedBadgeText,
                        isTablet && styles.completedBadgeTextTablet,
                        isTamil ? styles.completedBadgeTextTamil : styles.completedBadgeTextEnglish
                      ]}>
                        {t.completed}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CREAM,
  },

  /* 🔹 Header - Clean and positioned at top */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 25,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: MAROON,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  headerTablet: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowRadius: 6,
  },

  backButton: {
    padding: 4,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  headerTitle: {
    flex: 1,
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 8,
    letterSpacing: 0.3,
  },

  headerTitleTablet: {
    fontSize: 24,
    letterSpacing: 0.5,
    fontWeight: "800",
  },

  /* 🔹 Tamil Header Style */
  headerTitleTamil: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.8,
    fontFamily: "Tamil",
  },

  /* 🔹 English Header Style */
  headerTitleEnglish: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: "System",
  },

  /* 🔹 Language Button */
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: GOLD,
    minWidth: 50,
    alignItems: "center",
  },

  langButtonTablet: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
  },

  langButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  langButtonTextTablet: {
    fontSize: 15,
    letterSpacing: 0.8,
  },

  /* 🔹 Tamil Language Button Text */
  langButtonTextTamil: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  /* 🔹 English Language Button Text */
  langButtonTextEnglish: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  /* 🔹 Body */
  body: {
    flex: 1,
    backgroundColor: CREAM,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
    paddingTop: 20,
  },

  contentTablet: {
    padding: 24,
    paddingBottom: 40,
    paddingTop: 30,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },

  /* 🔹 Square Cards */
  square: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: GOLD,
    elevation: 4,
    shadowColor: MAROON_DARK,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: CREAM_LIGHT,
  },

  squareTablet: {
    borderRadius: 22,
    borderWidth: 2,
    paddingHorizontal: 12,
    elevation: 6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },

  squareCompleted: {
    opacity: 0.6,
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  iconCircleTablet: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 12,
    elevation: 5,
    shadowRadius: 5,
  },

  /* 🔹 Square Text - Base */
  squareText: {
    color: MAROON_DARK,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 14,
  },

  squareTextTablet: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
  },

  /* 🔹 Tamil Square Text */
  squareTextTamil: {
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 14,
    letterSpacing: 0.3,
    fontFamily: "Tamil",
  },

  /* 🔹 English Square Text */
  squareTextEnglish: {
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 13,
    letterSpacing: 0.2,
    fontFamily: "System",
  },

  squareTextCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },

  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 4,
    backgroundColor: "rgba(147, 33, 10, 0.08)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },

  completedBadgeTablet: {
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
  },

  completedBadgeText: {
    color: MAROON,
    fontSize: 7,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  completedBadgeTextTablet: {
    fontSize: 12,
    letterSpacing: 0.4,
  },

  /* 🔹 Tamil Completed Badge Text */
  completedBadgeTextTamil: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.3,
    fontFamily: "Tamil",
  },

  /* 🔹 English Completed Badge Text */
  completedBadgeTextEnglish: {
    fontSize: 6,
    fontWeight: "700",
    letterSpacing: 0.2,
    fontFamily: "System",
  },
});