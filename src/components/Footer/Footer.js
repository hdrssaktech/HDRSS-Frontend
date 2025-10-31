import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Footer() {
  const navigation = useNavigation(); // ✅ grab navigation context

  return (
    <SafeAreaView edges={["bottom"]} style={styles.footerSafe}>
      <View style={styles.navBar}>
        <FontAwesome
          name="home"
          size={30}
          color="#fff"
          onPress={() => navigation.navigate("HomePage")}
        />
        <MaterialCommunityIcons
          name="cash-register"
          size={30}
          color="#fff"
          onPress={() => navigation.navigate("CharitiePage1")}
        />
        <MaterialIcons
          name="chat"
          size={28}
          color="#fff"
          onPress={() => navigation.navigate("ComplainPage1")}
        />
        <FontAwesome
          name="user-circle-o"
          size={28}
          color="#fff"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerSafe: {
    backgroundColor: "#93210A",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
  },
});
