import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function VaasthuPage({ navigation }) {
  // Swipe Gesture (for left swipe navigation)
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20; // detect horizontal swipe
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // Swipe Right → Go Back
          navigation.goBack();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vastu</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image */}
        <Image
          source={require("../../../../assets/Vaasthu/vastu.jpg")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Content */}
        <Text style={styles.mainTitle}>Important Vastu Tips for House</Text>

        <Text style={styles.subHeading}>1. Check the Shape of the Property</Text>
        <Text style={styles.paragraph}>
          An important Vastu tip for a new home is to check the shape of the
          room. According to Vastu, the shape of the room should always be
          rectangular or square. These shapes are considered auspicious and
          ensure the smooth flow and balance of energy. If some of the rooms are
          irregular in shape, consider adding plants to correct the energy flow.
        </Text>

        <Text style={styles.subHeading}>
          2. Check the Orientation & Entrance of Property
        </Text>
        <Text style={styles.paragraph}>
          Property orientation is crucial in Vastu Shastra. It dictates the
          directional energies that interact with your home. Ideally, a property
          should have its main entrance facing north, east, or northeast. These
          directions are considered highly auspicious and bring prosperity,
          health, and positivity.
        </Text>

        <Text style={styles.subHeading}>3. Vastu tips for Living Room</Text>
        <Text style={styles.paragraph}>
          The living room should ideally be located in the north, east or
          northeast direction. Keep the living room clutter-free. You can use
          light colour paints like whites, creams and pastels to maintain a
          light and airy feel. The decor and paint must evoke happy emotions.
          Additionally, you can also add green plants to bring in an aura of
          positivity. Keep the furniture in the west or southwest direction. If
          you want to keep the mirror in the living room, place it on the north
          wall.
        </Text>

        <Text style={styles.subHeading}>4. Vastu Tips for Kitchen</Text>
        <Text style={styles.paragraph}>
          Ideally, the kitchen should be placed in the southeast direction of
          the house. Use yellow, orange, or red colors for the walls, as they
          are auspicious and enhance the fire element. There should be optimum
          ventilation in the kitchen to keep it clear and free from negative
          energy. The stove should be placed in the southeast direction. Keep in
          mind that water and fire are two distinct elements. Hence, never keep
          the gas stove and water sink on the same platform.
        </Text>

        <Text style={styles.subHeading}>5. Vastu Tip for Bathroom</Text>
        <Text style={styles.paragraph}>
          According to Vastu, a bathroom in the north or northwest part is the
          most favourable. Avoid having bathrooms directly facing the kitchen or
          the main entrance as it can disrupt the flow of positive energy. The
          toilet should face north-south and should not be located in the
          northeast or southwest corners. Ensure that the bathroom doors are
          always kept closed to prevent negative energies from spreading to
          other areas. Use light and soothing colours like pastels for walls to
          create a calming effect. Keep a check on taps, flush and showers, and
          ensure that they are leak-free. Use a wooden door for your bathroom
          instead of a metallic door.
        </Text>

        {/* Table Section */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, styles.leftCell]}>
              அடி கணக்கு
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.rightCell]}>
              பலன்கள்
            </Text>
          </View>

          {/* Table Rows */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.leftCell]}>6 அடி</Text>
            <Text style={[styles.cell, styles.rightCell]}>நல்லது தரும்.</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.leftCell]}>7 அடி</Text>
            <Text style={[styles.cell, styles.rightCell]}>தனிதிரம் பெறும்.</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.leftCell]}>8 அடி</Text>
            <Text style={[styles.cell, styles.rightCell]}>
              மிகவும் பாக்கியம் உண்டாகும்.
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.leftCell]}>9 அடி</Text>
            <Text style={[styles.cell, styles.rightCell]}>
              ஆயுள் குறையும், சுகவீனம் உண்டாகும்.
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.leftCell]}>10 அடி</Text>
            <Text style={[styles.cell, styles.rightCell]}>
              ஆடுமாடுகள் முதலானவைச் செழிக்கும்.
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.leftCell]}>11 அடி</Text>
            <Text style={[styles.cell, styles.rightCell]}>
              பிள்ளைப்பேறு உண்டாகும்.
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.leftCell]}>12 அடி</Text>
            <Text style={[styles.cell, styles.rightCell]}>தனிதிரம் பெறும்.</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.leftCell]}>13 அடி</Text>
            <Text style={[styles.cell, styles.rightCell]}>நல்லது தரும்.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  scrollContent: {
    padding: 15,
    // ✅ removed bottom padding to avoid extra space
  },
  image: {
    width: "100%",
    height: 180,
    marginBottom: 15,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#A93226",
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
    lineHeight: 20,
  },

  /* Table Styles */
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#A93226",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#A93226",
  },
  headerRow: {
    backgroundColor: "#ffffffff",
  },
  cell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  headerCell: {
    color: "black", // updated to black
    fontWeight: "bold",
  },
  leftCell: {
    borderRightWidth: 1,
    borderRightColor: "#A93226",
  },
  rightCell: {
    flex: 2, // gives more space for long text
  },
});





