import React, { useMemo, useState, useEffect } from "react";
import {
  Alert, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, useWindowDimensions, View, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import { getQuizCategory, COMPLETED_CATEGORIES_KEY, useLanguage } from "./quizData";

const MAROON = "#93210A";
const MAROON_DARK = "#301913";
const GOLD = "#D4AF37";
const CREAM = "#FBEEDB";
const CREAM_DARK = "#F1DDB0";
const CREAM_LIGHT = "#FFFDF8";
const TEXT_MUTED = "#7A6355";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidAadhar = (v) => /^\d{12}$/.test(v.replace(/\s/g, ""));
const isValidPan = (v) => /^[A-Za-z]{5}\d{4}[A-Za-z]$/.test(v.trim());

const LABELS = {
  ta: {
    notFound: "வினாடி வினா வகை கிடைக்கவில்லை.", back: "வகைகளுக்குத் திரும்பு",
    yourDetails: "உங்கள் விவரங்கள்",
    intro: "உங்கள் இறுதி மதிப்பெண் சமர்ப்பிக்கப்படுவதற்கு முன் கீழே உங்கள் விவரங்களை உள்ளிடவும்.",
    email: "மின்னஞ்சல் முகவரி", aadhar: "ஆதார் எண்", pan: "பான் எண்", address: "முகவரி",
    confirmSubmit: "உறுதிசெய்து மதிப்பெண்ணைச் சமர்ப்பி",
    invalidEmail: "தவறான மின்னஞ்சல்", invalidEmailMsg: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
    invalidAadhar: "தவறான ஆதார் எண்", invalidAadharMsg: "ஆதார் எண் சரியாக 12 இலக்கங்களாக இருக்க வேண்டும்.",
    invalidPan: "தவறான பான் எண்", invalidPanMsg: "பான் எண் ABCDE1234F வடிவத்தில் இருக்க வேண்டும்.",
    addressRequired: "முகவரி தேவை", addressRequiredMsg: "உங்கள் முகவரியை உள்ளிடவும்.",
    incomplete: "முடிக்கப்படாத வினாடி வினா",
    incompleteMsg: (a, tq) => `நீங்கள் ${tq} கேள்விகளில் ${a} பதிலளித்துள்ளீர்கள். சமர்ப்பிக்கும் முன் அனைத்து கேள்விகளுக்கும் பதிலளிக்கவும்.`,
    ok: "சரி", quizComplete: "வினாடி வினா முடிந்தது", chooseAnother: "வேறு வகையைத் தேர்வு செய்",
    questions: "கேள்விகள்", answered: "பதிலளிக்கப்பட்டவை", submit: "வினாடி வினாவை சமர்ப்பி",
    question: "கேள்வி",
    excellent: "சிறந்த அறிவு!", good: "நல்ல முயற்சி!", tryAgain: "மேலும் கற்றுக் கொண்டு மீண்டும் முயற்சி செய்யவும்.",
    totalQuestions: "மொத்த கேள்விகள்",
    answeredCount: "பதிலளிக்கப்பட்டவை",
    pending: "மீதமுள்ளவை",
  },
  en: {
    notFound: "Quiz category not found.", back: "Back to categories",
    yourDetails: "Your Details",
    intro: "Please enter your details below before your final score is submitted.",
    email: "Email Address", aadhar: "Aadhar Number", pan: "PAN Number", address: "Address",
    confirmSubmit: "Confirm & Submit Score",
    invalidEmail: "Invalid email", invalidEmailMsg: "Please enter a valid email address.",
    invalidAadhar: "Invalid Aadhar number", invalidAadharMsg: "Aadhar number must be exactly 12 digits.",
    invalidPan: "Invalid PAN number", invalidPanMsg: "PAN must be in the format ABCDE1234F.",
    addressRequired: "Address required", addressRequiredMsg: "Please enter your address.",
    incomplete: "Incomplete Quiz",
    incompleteMsg: (a, tq) => `You have answered ${a} of ${tq} questions. Please answer all questions before submitting.`,
    ok: "OK", quizComplete: "Quiz Complete", chooseAnother: "Choose another category",
    questions: "Questions", answered: "Answered", submit: "Submit Quiz",
    question: "Question",
    excellent: "Excellent knowledge!", good: "Good work!", tryAgain: "Keep learning and try again.",
    totalQuestions: "Total Question",
    answeredCount: "Answered",
    pending: "Pending",
  },
};

export default function QuizQuestions({ navigation, route }) {
  const { language, toggleLanguage } = useLanguage();
  const t = LABELS[language];
  const isTamil = language === "ta";

  const category = useMemo(
    () => getQuizCategory(route.params?.categoryId),
    [route.params?.categoryId]
  );

  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 900;
  
  // Responsive sizing
  const getResponsiveSize = (mobileSize, tabletSize, largeTabletSize) => {
    if (isLargeTablet) return largeTabletSize || tabletSize;
    if (isTablet) return tabletSize;
    return mobileSize;
  };

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [detailsEmail, setDetailsEmail] = useState("");
  const [detailsAadhar, setDetailsAadhar] = useState("");
  const [detailsPan, setDetailsPan] = useState("");
  const [detailsAddress, setDetailsAddress] = useState("");

  if (!category) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <Text style={[styles.errorText, isTamil ? styles.tamilText : styles.englishText]}>{t.notFound}</Text>
        <TouchableOpacity style={styles.primaryButtonWrap} onPress={() => navigation.goBack()}>
          <LinearGradient colors={[MAROON, MAROON_DARK]} style={styles.primaryButton}>
            <Text style={[styles.primaryButtonText, isTamil ? styles.tamilText : styles.englishText]}>{t.back}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const totalQuestions = category.questions.length;
  const answeredCount = Object.keys(answers).length;
  const pendingCount = totalQuestions - answeredCount;
  const progress = (answeredCount / totalQuestions) * 100;

  const selectAnswer = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (answeredCount < totalQuestions) {
      Alert.alert(t.incomplete, t.incompleteMsg(answeredCount, totalQuestions), [{ text: t.ok }]);
      return;
    }
    setShowDetailsForm(true);
  };

  const handleConfirmDetails = () => {
    if (!detailsEmail.trim() || !isValidEmail(detailsEmail)) {
      Alert.alert(t.invalidEmail, t.invalidEmailMsg); return;
    }
    if (!isValidAadhar(detailsAadhar)) {
      Alert.alert(t.invalidAadhar, t.invalidAadharMsg); return;
    }
    if (!isValidPan(detailsPan)) {
      Alert.alert(t.invalidPan, t.invalidPanMsg); return;
    }
    if (!detailsAddress.trim()) {
      Alert.alert(t.addressRequired, t.addressRequiredMsg); return;
    }

    const finalScore = category.questions.reduce(
      (total, q, index) => total + (answers[index] === q.answer ? 1 : 0), 0
    );

    setScore(finalScore);
    setSubmitted(true);
    setShowDetailsForm(false);
    markCategoryCompleted(category.id);
  };

  const markCategoryCompleted = async (categoryId) => {
    try {
      const stored = await AsyncStorage.getItem(COMPLETED_CATEGORIES_KEY);
      const completed = stored ? JSON.parse(stored) : [];
      if (!completed.includes(categoryId)) {
        completed.push(categoryId);
        await AsyncStorage.setItem(COMPLETED_CATEGORIES_KEY, JSON.stringify(completed));
      }
    } catch (_error) {}
  };

  const HeaderBar = ({ title, onBack }) => (
    <View style={[styles.header, isTablet && styles.headerTablet]}>
      <TouchableOpacity style={[styles.backButton, isTablet && styles.backButtonTablet]} onPress={onBack}>
        <Ionicons name="chevron-back" size={getResponsiveSize(28, 32, 36)} color="#fff" />
      </TouchableOpacity>
      <Text style={[
        styles.headerTitle1, 
        isTablet && styles.headerTitleTablet,
        isTamil ? styles.headerTitleTamil : styles.headerTitleEnglish
      ]} numberOfLines={1}>{title}</Text>
      <TouchableOpacity style={[styles.langButton, isTablet && styles.langButtonTablet]} onPress={toggleLanguage}>
        <Text style={[
          styles.langButtonText, 
          isTablet && styles.langButtonTextTablet,
          isTamil ? styles.langButtonTextTamil : styles.langButtonTextEnglish
        ]}>{language === "ta" ? "EN" : "தமிழ்"}</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Stats Card Component ──
  const StatsCard = () => (
    <View style={[styles.statsContainer, isTablet && styles.statsContainerTablet]}>
      <LinearGradient 
        colors={[MAROON, MAROON_DARK]} 
        style={[styles.statsCard, isTablet && styles.statsCardTablet]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(212,175,55,0.2)' }]}>
              <MaterialIcons name="help-outline" size={getResponsiveSize(20, 24, 28)} color={GOLD} />
            </View>
            <View style={styles.statTextContainer}>
              <Text style={[styles.statValue, isTablet && styles.statValueTablet]}>{totalQuestions}</Text>
              <Text style={[
                styles.statLabel, 
                isTablet && styles.statLabelTablet,
                isTamil ? styles.tamilText : styles.englishText
              ]}>{t.totalQuestions}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
              <MaterialIcons name="check-circle" size={getResponsiveSize(20, 24, 28)} color="#4CAF50" />
            </View>
            <View style={styles.statTextContainer}>
              <Text style={[styles.statValue, isTablet && styles.statValueTablet]}>{answeredCount}</Text>
              <Text style={[
                styles.statLabel, 
                isTablet && styles.statLabelTablet,
                isTamil ? styles.tamilText : styles.englishText
              ]}>{t.answeredCount}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 152, 0, 0.2)' }]}>
              <MaterialIcons name="pending" size={getResponsiveSize(20, 24, 28)} color="#FF9800" />
            </View>
            <View style={styles.statTextContainer}>
              <Text style={[styles.statValue, isTablet && styles.statValueTablet]}>{pendingCount}</Text>
              <Text style={[
                styles.statLabel, 
                isTablet && styles.statLabelTablet,
                isTamil ? styles.tamilText : styles.englishText
              ]}>{t.pending}</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar inside stats card */}
        <View style={styles.progressWrapper}>
          <View style={[styles.progressTrack, isTablet && styles.progressTrackTablet]}>
            <LinearGradient 
              colors={[GOLD, "#B8860B"]} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]} 
            />
          </View>
          <Text style={[styles.progressText, isTablet && styles.progressTextTablet]}>
            {Math.round(progress)}%
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  // ── Details Form Screen ───────────────────────────────────────
  if (showDetailsForm) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <HeaderBar title={t.yourDetails} onBack={() => setShowDetailsForm(false)} />

        <LinearGradient colors={[CREAM, CREAM_DARK]} style={styles.body}>
          <ScrollView style={styles.resultScroll} contentContainerStyle={[styles.detailsFormContainer, isTablet && styles.detailsFormContainerTablet]} showsVerticalScrollIndicator={false}>
            <Text style={[
              styles.detailsFormIntro, 
              isTablet && styles.detailsFormIntroTablet,
              isTamil ? styles.tamilText : styles.englishText
            ]}>{t.intro}</Text>

            <LinearGradient colors={[CREAM_LIGHT, CREAM]} style={[styles.manualEmailCard, isTablet && styles.manualEmailCardTablet]}>
              <Text style={[
                styles.fieldLabel, 
                isTablet && styles.fieldLabelTablet,
                isTamil ? styles.tamilText : styles.englishText
              ]}>{t.email}</Text>
              <TextInput style={[styles.emailInput, isTablet && styles.emailInputTablet]} placeholder="you@example.com" placeholderTextColor={TEXT_MUTED}
                value={detailsEmail} onChangeText={setDetailsEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />

              <Text style={[
                styles.fieldLabel, 
                isTablet && styles.fieldLabelTablet,
                isTamil ? styles.tamilText : styles.englishText
              ]}>{t.aadhar}</Text>
              <TextInput style={[styles.emailInput, isTablet && styles.emailInputTablet]} placeholder="12-digit Aadhar number" placeholderTextColor={TEXT_MUTED}
                value={detailsAadhar} onChangeText={setDetailsAadhar} keyboardType="number-pad" maxLength={12} />

              <Text style={[
                styles.fieldLabel, 
                isTablet && styles.fieldLabelTablet,
                isTamil ? styles.tamilText : styles.englishText
              ]}>{t.pan}</Text>
              <TextInput style={[styles.emailInput, isTablet && styles.emailInputTablet]} placeholder="ABCDE1234F" placeholderTextColor={TEXT_MUTED}
                value={detailsPan} onChangeText={(text) => setDetailsPan(text.toUpperCase())} autoCapitalize="characters" autoCorrect={false} maxLength={10} />

              <Text style={[
                styles.fieldLabel, 
                isTablet && styles.fieldLabelTablet,
                isTamil ? styles.tamilText : styles.englishText
              ]}>{t.address}</Text>
              <TextInput style={[styles.emailInput, styles.addressInput, isTablet && styles.emailInputTablet]} placeholder="House no, street, city, pincode" placeholderTextColor={TEXT_MUTED}
                value={detailsAddress} onChangeText={setDetailsAddress} multiline numberOfLines={isTablet ? 4 : 3} />

              <TouchableOpacity style={[styles.manualSendButtonWrap, isTablet && styles.manualSendButtonWrapTablet]} onPress={handleConfirmDetails}>
                <LinearGradient colors={[MAROON, MAROON_DARK]} style={[styles.manualSendButton, isTablet && styles.manualSendButtonTablet]}>
                  <MaterialIcons name="check-circle" size={getResponsiveSize(18, 22, 24)} color="#fff" />
                  <Text style={[
                    styles.manualSendButtonText, 
                    isTablet && styles.manualSendButtonTextTablet,
                    isTamil ? styles.tamilText : styles.englishText
                  ]}>{t.confirmSubmit}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // ── Result Screen ─────────────────────────────────────────────
  if (submitted && score !== null) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const resultMessage = percentage >= 80 ? t.excellent : percentage >= 60 ? t.good : t.tryAgain;

    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <HeaderBar title={category.title[language]} onBack={() => navigation.goBack()} />

        <LinearGradient colors={[CREAM, CREAM_DARK]} style={styles.body}>
          <ScrollView style={styles.resultScroll} contentContainerStyle={[styles.resultContainer, isTablet && styles.resultContainerTablet]} showsVerticalScrollIndicator={false}>
            <View style={[styles.resultIcon, { backgroundColor: `${category.color}18`, borderColor: GOLD }, isTablet && styles.resultIconTablet]}>
              <MaterialIcons name={percentage >= 60 ? "emoji-events" : "school"} size={getResponsiveSize(70, 90, 100)} color={category.color} />
            </View>

            <Text style={[
              styles.resultLabel, 
              isTablet && styles.resultLabelTablet,
              isTamil ? styles.tamilText : styles.englishText
            ]}>{t.quizComplete}</Text>
            <Text style={[
              styles.resultTitle, 
              isTablet && styles.resultTitleTablet,
              isTamil ? styles.tamilText : styles.englishText
            ]}>{category.title[language]}</Text>
            <Text style={[styles.resultScore, isTablet && styles.resultScoreTablet, { color: MAROON }]}>{score} / {totalQuestions}</Text>
            <Text style={[styles.resultPercent, isTablet && styles.resultPercentTablet]}>{percentage}%</Text>
            <Text style={[
              styles.resultMessage, 
              isTablet && styles.resultMessageTablet,
              isTamil ? styles.tamilText : styles.englishText
            ]}>{resultMessage}</Text>

            <TouchableOpacity style={[styles.primaryButtonWrap, isTablet && styles.primaryButtonWrapTablet]} onPress={() => navigation.navigate("QuizCategories")}>
              <LinearGradient colors={[MAROON, MAROON_DARK]} style={[styles.primaryButton, isTablet && styles.primaryButtonTablet]}>
                <Text style={[
                  styles.primaryButtonText, 
                  isTablet && styles.primaryButtonTextTablet,
                  isTamil ? styles.tamilText : styles.englishText
                ]}>{t.chooseAnother}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // ── Main Quiz Screen ──────────────────────────────────────────
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <HeaderBar title={category.title[language]} onBack={() => navigation.goBack()} />

      {/* Stats Card with progress */}
      <StatsCard />

      <LinearGradient colors={[CREAM, CREAM_DARK]} style={styles.body}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={[styles.content, isTablet && styles.contentTablet, isLargeTablet && styles.contentLargeTablet]}>
            {category.questions.map((q, questionIndex) => {
              const selectedOption = answers[questionIndex];
              return (
                <LinearGradient key={questionIndex} colors={[CREAM_LIGHT, CREAM]} style={[styles.questionCard, isTablet && styles.questionCardTablet]}>
                  <Text style={[
                    styles.questionLabel, 
                    isTablet && styles.questionLabelTablet,
                    isTamil ? styles.tamilText : styles.englishText
                  ]}>
                    {t.question} {questionIndex + 1}
                  </Text>
                  <Text style={[
                    styles.questionText, 
                    isTablet && styles.questionTextTablet,
                    isTamil ? styles.tamilText : styles.englishText
                  ]}>
                    {q.question[language]}
                  </Text>

                  <View style={[styles.options, isTablet && styles.optionsTablet]}>
                    {q.options[language].map((option, optionIndex) => {
                      const isSelected = selectedOption === optionIndex;
                      return (
                        <TouchableOpacity
                          key={optionIndex}
                          activeOpacity={0.8}
                          style={[styles.option, isTablet && styles.optionTablet, isSelected && styles.optionSelected]}
                          onPress={() => selectAnswer(questionIndex, optionIndex)}
                        >
                          <View style={[styles.radioCircle, isTablet && styles.radioCircleTablet, isSelected && styles.radioCircleSelected]}>
                            {isSelected && <Ionicons name="checkmark" size={getResponsiveSize(14, 16, 18)} color="#fff" />}
                          </View>
                          <Text style={[
                            styles.optionText, 
                            isTablet && styles.optionTextTablet, 
                            isSelected && styles.optionTextSelected,
                            isTamil ? styles.tamilText : styles.englishText
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </LinearGradient>
              );
            })}

            <TouchableOpacity style={[styles.submitButtonWrap, isTablet && styles.submitButtonWrapTablet]} onPress={handleSubmitQuiz}>
              <LinearGradient colors={[MAROON, MAROON_DARK]} style={[styles.submitButton, isTablet && styles.submitButtonTablet]}>
                <Text style={[
                  styles.submitButtonText, 
                  isTablet && styles.submitButtonTextTablet,
                  isTamil ? styles.tamilText : styles.englishText
                ]}>
                  {t.submit}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREAM },
  body: { flex: 1 },
  scrollView: { flex: 1 },

  // ── Header Styles ──
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
    paddingVertical: 22,
    paddingHorizontal: 24,
    paddingTop: 56,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 8,
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
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  headerTitle1: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 18, 
    flex: 1, 
    textAlign: "center",
    paddingHorizontal: 8,
  },
  headerTitleTablet: {
    fontSize: 24,
    paddingHorizontal: 12,
  },

  // ── Tamil Header Title ──
  headerTitleTamil: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.8,
    fontFamily: Platform.select({
      ios: 'NotoSansTamil-Regular',
      android: 'NotoSansTamil-Regular',
    }),
  },

  // ── English Header Title ──
  headerTitleEnglish: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: "System",
  },

  langButton: {
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)", 
    borderWidth: 1, 
    borderColor: GOLD,
  },
  langButtonTablet: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  langButtonText: { 
    color: "#fff", 
    fontSize: 12, 
    fontWeight: "700",
  },
  langButtonTextTablet: {
    fontSize: 16,
  },

  // ── Tamil Language Button Text ──
  langButtonTextTamil: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    fontFamily: Platform.select({
      ios: 'NotoSansTamil-Regular',
      android: 'NotoSansTamil-Regular',
    }),
  },

  // ── English Language Button Text ──
  langButtonTextEnglish: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: "System",
  },

  // ── Stats Card ──
    // ── Stats Card ──
  statsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 9,
    backgroundColor: CREAM,
  },
  statsContainerTablet: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: MAROON_DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statsCardTablet: {
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  statValueTablet: {
    fontSize: 26,
    lineHeight: 30,
    letterSpacing: 0.8,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 7,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    lineHeight: 10,
  },
  statLabelTablet: {
    fontSize: 13,
    letterSpacing: 0.8,
    lineHeight: 18,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 8,
  },
  progressWrapper: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressTrackTablet: {
    height: 8,
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    color: GOLD,
    fontSize: 13,
    fontWeight: "800",
    minWidth: 40,
    textAlign: "right",
    letterSpacing: 0.5,
  },
  progressTextTablet: {
    fontSize: 16,
    minWidth: 48,
    letterSpacing: 0.8,
  },

  // ── Content ──
  content: { 
    padding: 14, 
    paddingBottom: 30,
  },
  contentTablet: { 
    paddingHorizontal: "10%",
    paddingTop: 20,
    paddingBottom: 40,
  },
  contentLargeTablet: {
    paddingHorizontal: "18%",
    paddingTop: 24,
    paddingBottom: 50,
  },

  // ── Question Card ──
  questionCard: {
    borderRadius: 16, 
    padding: 18, 
    marginBottom: 14,
    borderWidth: 1, 
    borderColor: GOLD,
    elevation: 3, 
    shadowColor: MAROON_DARK, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 5,
  },
  questionCardTablet: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },

  questionLabel: { 
    color: MAROON, 
    fontSize: 13, 
    fontWeight: "800", 
    textTransform: "uppercase", 
    letterSpacing: 0.5, 
    marginBottom: 8,
  },
  questionLabelTablet: {
    fontSize: 16,
    marginBottom: 12,
    letterSpacing: 0.8,
  },

  questionText: { 
    color: MAROON_DARK, 
    fontSize: 15, 
    fontWeight: "700", 
    lineHeight: 24, 
    marginBottom: 16,
  },
  questionTextTablet: {
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 20,
  },

  // ── Options ──
  options: { 
    gap: 10,
  },
  optionsTablet: {
    gap: 14,
  },

  option: {
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: CREAM_LIGHT, 
    borderRadius: 12,
    borderWidth: 1, 
    borderColor: "#E4CFAE",
    paddingVertical: 14, 
    paddingHorizontal: 16, 
    minHeight: 52,
  },
  optionTablet: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    minHeight: 64,
  },

  optionSelected: { 
    backgroundColor: MAROON, 
    borderColor: GOLD,
  },

  radioCircle: {
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: MAROON,
    alignItems: "center", 
    justifyContent: "center", 
    marginRight: 14, 
    backgroundColor: "transparent",
  },
  radioCircleTablet: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 18,
    borderWidth: 2.5,
  },
  radioCircleSelected: { 
    borderColor: GOLD, 
    backgroundColor: "rgba(212,175,55,0.35)",
  },

  optionText: { 
    color: MAROON_DARK, 
    fontSize: 14, 
    fontWeight: "600", 
    flex: 1,
  },
  optionTextTablet: {
    fontSize: 18,
  },
  optionTextSelected: { 
    color: "#fff",
  },

  // ── Submit Button ──
  submitButtonWrap: { 
    marginTop: 6, 
    marginBottom: 10, 
    borderRadius: 14, 
    elevation: 3,
  },
  submitButtonWrapTablet: {
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 18,
    elevation: 5,
  },
  submitButton: {
    borderRadius: 14, 
    paddingVertical: 16, 
    alignItems: "center", 
    justifyContent: "center",
    borderWidth: 1, 
    borderColor: GOLD,
  },
  submitButtonTablet: {
    borderRadius: 18,
    paddingVertical: 20,
    borderWidth: 1.5,
  },
  submitButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "800", 
    letterSpacing: 0.3,
  },
  submitButtonTextTablet: {
    fontSize: 20,
    letterSpacing: 0.5,
  },

  // ── Details Form ──
  detailsFormContainer: { 
    padding: 20, 
    alignItems: "center",
  },
  detailsFormContainerTablet: {
    padding: 40,
  },
  detailsFormIntro: { 
    color: TEXT_MUTED, 
    fontSize: 14, 
    lineHeight: 20, 
    textAlign: "center", 
    marginBottom: 18, 
    maxWidth: 360,
  },
  detailsFormIntroTablet: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 24,
    maxWidth: 500,
  },
  fieldLabel: { 
    width: "100%", 
    color: MAROON_DARK, 
    fontSize: 13, 
    fontWeight: "700", 
    marginBottom: 6,
  },
  fieldLabelTablet: {
    fontSize: 16,
    marginBottom: 8,
  },
  addressInput: { 
    minHeight: 80, 
    textAlignVertical: "top",
  },

  // ── Email Card ──
  manualEmailCard: {
    width: "100%", 
    maxWidth: 360, 
    borderRadius: 16,
    borderWidth: 1, 
    borderColor: GOLD, 
    padding: 16, 
    marginBottom: 18, 
    alignItems: "center",
  },
  manualEmailCardTablet: {
    maxWidth: 500,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },

  emailInput: {
    width: "100%", 
    borderWidth: 1, 
    borderColor: "#E4CFAE", 
    borderRadius: 10,
    paddingHorizontal: 14, 
    paddingVertical: 12, 
    fontSize: 14, 
    color: MAROON_DARK,
    backgroundColor: CREAM_LIGHT, 
    marginBottom: 14,
  },
  emailInputTablet: {
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 17,
    marginBottom: 18,
  },

  manualSendButtonWrap: { 
    width: "100%", 
    borderRadius: 12, 
    marginTop: 4,
  },
  manualSendButtonWrapTablet: {
    borderRadius: 16,
    marginTop: 8,
  },
  manualSendButton: {
    width: "100%", 
    minHeight: 46, 
    borderRadius: 12, 
    flexDirection: "row", 
    gap: 8,
    alignItems: "center", 
    justifyContent: "center", 
    borderWidth: 1, 
    borderColor: GOLD,
  },
  manualSendButtonTablet: {
    minHeight: 58,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1.5,
  },
  manualSendButtonText: { 
    color: "#fff", 
    fontSize: 14, 
    fontWeight: "800",
  },
  manualSendButtonTextTablet: {
    fontSize: 18,
  },

  // ── Results ──
  resultScroll: { 
    flex: 1,
  },
  resultContainer: { 
    alignItems: "center", 
    justifyContent: "center", 
    paddingHorizontal: 24, 
    paddingVertical: 24,
  },
  resultContainerTablet: {
    paddingHorizontal: 40,
    paddingVertical: 40,
  },

  resultIcon: {
    width: 130, 
    height: 130, 
    borderRadius: 65,
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 20, 
    borderWidth: 2,
  },
  resultIconTablet: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 28,
    borderWidth: 3,
  },

  resultLabel: { 
    color: TEXT_MUTED, 
    fontSize: 14, 
    fontWeight: "700", 
    textTransform: "uppercase", 
    letterSpacing: 1,
  },
  resultLabelTablet: {
    fontSize: 18,
    letterSpacing: 1.5,
  },
  resultTitle: { 
    color: MAROON_DARK, 
    fontSize: 23, 
    fontWeight: "800", 
    textAlign: "center", 
    marginTop: 6,
  },
  resultTitleTablet: {
    fontSize: 30,
    marginTop: 8,
  },
  resultScore: { 
    fontSize: 42, 
    fontWeight: "900", 
    marginTop: 18,
  },
  resultScoreTablet: {
    fontSize: 56,
    marginTop: 24,
  },
  resultPercent: { 
    color: TEXT_MUTED, 
    fontSize: 16, 
    fontWeight: "700",
  },
  resultPercentTablet: {
    fontSize: 20,
  },
  resultMessage: { 
    color: TEXT_MUTED, 
    fontSize: 17, 
    marginTop: 14, 
    marginBottom: 8,
    textAlign: "center",
  },
  resultMessageTablet: {
    fontSize: 22,
    marginTop: 18,
    marginBottom: 12,
  },

  // ── Primary Button ──
  primaryButtonWrap: { 
    minWidth: 220, 
    borderRadius: 14,
  },
  primaryButtonWrapTablet: {
    minWidth: 280,
    borderRadius: 18,
  },
  primaryButton: {
    minHeight: 52, 
    borderRadius: 14, 
    flexDirection: "row", 
    gap: 8,
    alignItems: "center", 
    justifyContent: "center", 
    paddingHorizontal: 20,
    borderWidth: 1, 
    borderColor: GOLD,
  },
  primaryButtonTablet: {
    minHeight: 64,
    borderRadius: 18,
    paddingHorizontal: 28,
    borderWidth: 1.5,
  },
  primaryButtonText: { 
    color: "#fff", 
    fontSize: 15, 
    fontWeight: "800",
  },
  primaryButtonTextTablet: {
    fontSize: 19,
  },

  errorText: { 
    fontSize: 17, 
    color: MAROON_DARK, 
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  // ── Tamil Language Specific Styles ──
  tamilText: {
    fontFamily: Platform.select({
      ios: 'NotoSansTamil-Regular',
      android: 'NotoSansTamil-Regular',
    }),
    letterSpacing: 0.5,
    lineHeight: Platform.select({
      ios: 28,
      android: 30,
    }),
  },

  // ── English Language Specific Styles ──
  englishText: {
    fontFamily: "System",
    letterSpacing: 0.2,
    lineHeight: Platform.select({
      ios: 24,
      android: 26,
    }),
  },
});