import React from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Footer() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // Tablet detection
  const isTablet = width >= 600;

  return (
    <SafeAreaView edges={["bottom"]} style={styles.footerSafe}>
      <View style={[styles.navBar, isTablet && styles.navBarTablet]}>
        <FontAwesome
          name="home"
          size={isTablet ? 38 : 30}
          color="#fff"
          onPress={() => navigation.navigate("HomePage")}
        />

        <MaterialCommunityIcons
          name="cash-register"
          size={isTablet ? 38 : 30}
          color="#fff"
          onPress={() => navigation.navigate("CharitiePage1")}
        />

        <MaterialIcons
          name="chat"
          size={isTablet ? 36 : 28}
          color="#fff"
          onPress={() => navigation.navigate("ComplainPage1")}
        />

        <FontAwesome
          name="user-circle-o"
          size={isTablet ? 36 : 28}
          color="#fff"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerSafe: {
    backgroundColor: "#800000",
  },

  // 📱 Mobile
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
  },

  // 📲 Tablet
  navBarTablet: {
    paddingVertical: 20,
  },
});
