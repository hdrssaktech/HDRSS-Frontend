import React, { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

// ✅ Named imports — must match exactly what is exported from each file
import { QUIZ_CATEGORIES } from "./quizData";
import { COMPLETED_CATEGORIES_KEY } from "./QuizQuestions";

export default function QuizCategories({ navigation }) {
  const { width } = useWindowDimensions();

  const numColumns = width >= 600 ? 3 : 2;
  const GRID_GAP = 14;
  const HORIZONTAL_PADDING = 16;

  const squareSize =
    (width - HORIZONTAL_PADDING * 2 - GRID_GAP * (numColumns - 1)) /
    numColumns;

  const [completedIds, setCompletedIds] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        try {
          const stored = await AsyncStorage.getItem(COMPLETED_CATEGORIES_KEY);
          if (isActive) {
            setCompletedIds(stored ? JSON.parse(stored) : []);
          }
        } catch (_error) {
          if (isActive) setCompletedIds([]);
        }
      })();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handlePress = (category, isCompleted) => {
    if (isCompleted) {
      Alert.alert(
        "Already completed",
        `You have already completed "${category.title}". This category cannot be retaken.`
      );
      return;
    }

    navigation.navigate("QuizQuestions", {
      categoryId: category.id,
    });
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Select Category</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* ── Category Grid ── */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.grid, { gap: GRID_GAP }]}>
          {QUIZ_CATEGORIES.map((category) => {
            const isCompleted = completedIds.includes(category.id);

            return (
              <TouchableOpacity
                key={category.id}
                activeOpacity={0.85}
                style={[
                  styles.square,
                  {
                    width: squareSize,
                    height: squareSize,
                    backgroundColor: "#E89951",
                  },
                  isCompleted && styles.squareCompleted,
                ]}
                onPress={() => handlePress(category, isCompleted)}
              >
                <Text
                  style={[
                    styles.squareText,
                    isCompleted && styles.squareTextCompleted,
                  ]}
                >
                  {category.title}
                </Text>

                {isCompleted && (
                  <View style={styles.completedBadge}>
                    <MaterialIcons
                      name="check-circle"
                      size={16}
                      color="#fff"
                    />
                    <Text style={styles.completedBadgeText}>Completed</Text>
                  </View>
                )}
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
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#800000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  headerSpacer: {
    width: 40,
  },

  title: {
    flex: 1,
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  square: {
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  squareCompleted: {
    opacity: 0.4,
  },

  squareText: {
    color: "#800000",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  squareTextCompleted: {
    textDecorationLine: "line-through",
  },

  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },

  completedBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});