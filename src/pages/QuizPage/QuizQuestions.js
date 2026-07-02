import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getQuizCategory, COMPLETED_CATEGORIES_KEY } from "./quizData";
// ── Validation helpers ────────────────────────────────────────────
const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidAadhar = (value) =>
  /^\d{12}$/.test(value.replace(/\s/g, ""));

const isValidPan = (value) =>
  /^[A-Za-z]{5}\d{4}[A-Za-z]$/.test(value.trim());

// ── Main Component ────────────────────────────────────────────────
export default function QuizQuestions({ navigation, route }) {
  const category = useMemo(
    () => getQuizCategory(route.params?.categoryId),
    [route.params?.categoryId]
  );

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Personal-details form state
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [detailsEmail, setDetailsEmail] = useState("");
  const [detailsAadhar, setDetailsAadhar] = useState("");
  const [detailsPan, setDetailsPan] = useState("");
  const [detailsAddress, setDetailsAddress] = useState("");

  // ── Guard: category not found ─────────────────────────────────
  if (!category) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <Text style={styles.errorText}>Quiz category not found.</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>Back to categories</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const totalQuestions = category.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  // ── Handlers ─────────────────────────────────────────────────
  const selectAnswer = (questionIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  // Step 1 — check all answered, then open details form
  const handleSubmitQuiz = () => {
    if (answeredCount < totalQuestions) {
      Alert.alert(
        "Incomplete Quiz",
        `You have answered ${answeredCount} of ${totalQuestions} questions. Please answer all questions before submitting.`,
        [{ text: "OK" }]
      );
      return;
    }
    setShowDetailsForm(true);
  };

  // Step 2 — validate details, compute score, finish
  const handleConfirmDetails = () => {
    if (!detailsEmail.trim() || !isValidEmail(detailsEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    if (!isValidAadhar(detailsAadhar)) {
      Alert.alert(
        "Invalid Aadhar number",
        "Aadhar number must be exactly 12 digits."
      );
      return;
    }
    if (!isValidPan(detailsPan)) {
      Alert.alert(
        "Invalid PAN number",
        "PAN must be in the format ABCDE1234F (5 letters, 4 digits, 1 letter)."
      );
      return;
    }
    if (!detailsAddress.trim()) {
      Alert.alert("Address required", "Please enter your address.");
      return;
    }

    const finalScore = category.questions.reduce(
      (total, q, index) =>
        total + (answers[index] === q.answer ? 1 : 0),
      0
    );

    setScore(finalScore);
    setSubmitted(true);
    setShowDetailsForm(false);
    markCategoryCompleted(category.id);
  };

  // Persists category id so QuizCategories can lock it
  const markCategoryCompleted = async (categoryId) => {
    try {
      const stored = await AsyncStorage.getItem(COMPLETED_CATEGORIES_KEY);
      const completed = stored ? JSON.parse(stored) : [];
      if (!completed.includes(categoryId)) {
        completed.push(categoryId);
        await AsyncStorage.setItem(
          COMPLETED_CATEGORIES_KEY,
          JSON.stringify(completed)
        );
      }
    } catch (_error) {
      // Non-fatal
    }
  };

  // ── Details Form Screen ───────────────────────────────────────
  if (showDetailsForm) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: "#800000" }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowDetailsForm(false)}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.resultScroll}
          contentContainerStyle={styles.detailsFormContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.detailsFormIntro}>
            Please enter your details below before your final score is submitted.
          </Text>

          <View style={styles.manualEmailCard}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <TextInput
              style={styles.emailInput}
              placeholder="you@example.com"
              placeholderTextColor="#A89489"
              value={detailsEmail}
              onChangeText={setDetailsEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.fieldLabel}>Aadhar Number</Text>
            <TextInput
              style={styles.emailInput}
              placeholder="12-digit Aadhar number"
              placeholderTextColor="#A89489"
              value={detailsAadhar}
              onChangeText={setDetailsAadhar}
              keyboardType="number-pad"
              maxLength={12}
            />

            <Text style={styles.fieldLabel}>PAN Number</Text>
            <TextInput
              style={styles.emailInput}
              placeholder="ABCDE1234F"
              placeholderTextColor="#A89489"
              value={detailsPan}
              onChangeText={(text) => setDetailsPan(text.toUpperCase())}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={10}
            />

            <Text style={styles.fieldLabel}>Address</Text>
            <TextInput
              style={[styles.emailInput, styles.addressInput]}
              placeholder="House no, street, city, pincode"
              placeholderTextColor="#A89489"
              value={detailsAddress}
              onChangeText={setDetailsAddress}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[
                styles.manualSendButton,
                { backgroundColor: category.color },
              ]}
              onPress={handleConfirmDetails}
            >
              <MaterialIcons name="check-circle" size={18} color="#fff" />
              <Text style={styles.manualSendButtonText}>
                Confirm & Submit Score
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Result Screen ─────────────────────────────────────────────
  if (submitted && score !== null) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const resultMessage =
      percentage >= 80
        ? "Excellent knowledge!"
        : percentage >= 60
        ? "Good work!"
        : "Keep learning and try again.";

    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: "#800000" }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{category.title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.resultScroll}
          contentContainerStyle={styles.resultContainer}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.resultIcon,
              { backgroundColor: `${category.color}18` },
            ]}
          >
            <MaterialIcons
              name={percentage >= 60 ? "emoji-events" : "school"}
              size={70}
              color={category.color}
            />
          </View>

          <Text style={styles.resultLabel}>Quiz Complete</Text>
          <Text style={styles.resultTitle}>{category.title}</Text>
          <Text style={[styles.resultScore, { color: category.color }]}>
            {score} / {totalQuestions}
          </Text>
          <Text style={styles.resultPercent}>{percentage}%</Text>
          <Text style={styles.resultMessage}>{resultMessage}</Text>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: category.color }]}
            onPress={() => navigation.navigate("QuizCategories")}
          >
            <Text style={styles.primaryButtonText}>
              Choose another category
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Main Quiz Screen ──────────────────────────────────────────
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: "#800000" }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Stats Bar */}
      <View style={styles.headerStats}>
        <Text style={styles.headerStatsText}>
          Questions: {totalQuestions} | Answered: {answeredCount}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%`, backgroundColor: "#2196F3" },
          ]}
        />
      </View>

      {/* Scrollable Questions */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, isTablet && styles.contentTablet]}>
          {category.questions.map((q, questionIndex) => {
            const selectedOption = answers[questionIndex];

            return (
              <View key={questionIndex} style={styles.questionCard}>
                <Text style={styles.questionLabel}>
                  Question {questionIndex + 1}
                </Text>
                <Text style={styles.questionText}>{q.question}</Text>

                <View style={styles.options}>
                  {q.options.map((option, optionIndex) => {
                    const isSelected = selectedOption === optionIndex;

                    return (
                      <TouchableOpacity
                        key={optionIndex}
                        activeOpacity={0.8}
                        style={[
                          styles.option,
                          isSelected && styles.optionSelected,
                        ]}
                        onPress={() => selectAnswer(questionIndex, optionIndex)}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            isSelected && styles.radioCircleSelected,
                          ]}
                        >
                          {isSelected && (
                            <Ionicons
                              name="checkmark"
                              size={14}
                              color="#fff"
                            />
                          )}
                        </View>
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitQuiz}
          >
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0f4f8" },
  scrollView: { flex: 1 },

  // Header
  header: {
    backgroundColor: "#800000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 15,
  },

  headerStats: {
    backgroundColor: "#800000",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  headerStatsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  headerSpacer: { width: 40 },

  // Progress
  progressTrack: { height: 6, backgroundColor: "#ddd" },
  progressFill: { height: "100%" },

  // Content
  content: { padding: 14, paddingBottom: 30 },
  contentTablet: { paddingHorizontal: "12%" },

  // Question Card
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  questionLabel: {
    color: "#E89951",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },

  questionText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 16,
  },

  // Options
  options: { gap: 10 },

  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E89951",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 52,
  },

  optionSelected: { backgroundColor: "#43A047" },

  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "transparent",
  },

  radioCircleSelected: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  optionText: { color: "#fff", fontSize: 15, fontWeight: "600", flex: 1 },

  // Submit Button
  submitButton: {
    backgroundColor: "#E89951",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 10,
    elevation: 3,
  },

  submitButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // Details Form
  detailsFormContainer: {
    padding: 20,
    alignItems: "center",
  },

  detailsFormIntro: {
    color: "#5C4A41",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 18,
    maxWidth: 360,
  },

  fieldLabel: {
    width: "100%",
    color: "#35241D",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },

  addressInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  // Result Screen
  resultScroll: { flex: 1 },

  resultContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  resultIcon: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  resultLabel: {
    color: "#8A756A",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  resultTitle: {
    color: "#35241D",
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 6,
  },

  resultScore: { fontSize: 42, fontWeight: "900", marginTop: 18 },
  resultPercent: { color: "#6F5A50", fontSize: 16, fontWeight: "700" },

  resultMessage: {
    color: "#5C4A41",
    fontSize: 17,
    marginTop: 14,
    marginBottom: 8,
  },

  // Personal details card
  manualEmailCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0E3DC",
    padding: 16,
    marginBottom: 18,
    alignItems: "center",
  },

  emailInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2C8BA",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#35241D",
    backgroundColor: "#FFF8F2",
    marginBottom: 14,
  },

  manualSendButton: {
    width: "100%",
    minHeight: 46,
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  manualSendButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },

  primaryButton: {
    minWidth: 220,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#800000",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  errorText: { fontSize: 17, color: "#5C4033", marginBottom: 20 },
});