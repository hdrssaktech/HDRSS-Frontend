import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getCharities } from "../../Controller/CharityController/CharityController";
import Loader from "../Alert/Loader";

/* ===================== RESPONSIVE HELPER ===================== */
const useResponsive = () => {
  const { width } = useWindowDimensions();
  return {
    isMobile: width < 768,
    isTablet: width >= 600 && width < 1024,
    isLargeTablet: width >= 1024,
  };
};

export default function CharityPage1() {
  const navigation = useNavigation();
  const { isMobile, isTablet, isLargeTablet } = useResponsive();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    const loadCharities = async () => {
      try {
        const result = await getCharities();
        setData(result);
      } catch (err) {
        console.error("❌ Error loading charities:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCharities();
  }, []);

  /* ===================== LOADING ===================== */
  if (loading) {
    return (
     <Loader/>
    );
  }

  return (
    <View style={styles.container}>
      {/* ===================== HEADER ===================== */}
      <View
        style={[
          styles.header,
          isTablet && styles.headerTablet,
          isLargeTablet && styles.headerLargeTablet,
        ]}
      >
        <TouchableOpacity
        style={[styles.backButton, isTablet && styles.backButtonTablet]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
      </TouchableOpacity>

        <Text
          style={[
            styles.headerText,
            isTablet && styles.headerTextTablet,
          ]}
        >
          Charities
        </Text>
      </View>

      {/* ===================== LIST ===================== */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isTablet && styles.scrollContainerTablet,
          isLargeTablet && styles.scrollContainerLargeTablet,
        ]}
      >
        {data.length === 0 ? (
          <Text style={styles.noData}>No charities available.</Text>
        ) : (
          data.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              style={[
                styles.card,
                isTablet && styles.cardTablet,
                isLargeTablet && styles.cardLargeTablet,
              ]}
              onPress={() =>
                navigation.navigate("CharitiesPage2", { charity: item })
              }
            >
              {/* TEXT */}
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.title,
                    isTablet && styles.titleTablet,
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.heading,
                    isTablet && styles.headingTablet,
                  ]}
                  numberOfLines={2}
                >
                  “{item.heading}”
                </Text>

                <View style={styles.button}>
                  <Text style={styles.buttonText}>View More</Text>
                </View>
              </View>

              {/* IMAGE */}
              {item.bannerImage ? (
                <Image
                  source={{ uri: item.bannerImage }}
                  style={[
                    styles.image,
                    isTablet && styles.imageTablet,
                    isLargeTablet && styles.imageLargeTablet,
                  ]}
                />
              ) : null}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBEEDB",
  },

  /* CENTER */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADER */
  header: {
   flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop:40,
    paddingBottom:30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingTop:45,
    paddingBottom:28,
    paddingHorizontal: 18,
  },
  headerLargeTablet: {
    paddingHorizontal: 60,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginRight:55,
  },
  headerTextTablet: {
    fontSize: 26,
  },

  backButton:{
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft:15,
  },
  backButtonTablet:{
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  /* SCROLL */
  scrollContainer: {
    padding: 15,
  },
  scrollContainerTablet: {
    paddingHorizontal: 30,
  },
  scrollContainerLargeTablet: {
    paddingHorizontal: 80,
  },

  /* CARD */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 4,
  },
  cardTablet: {
    padding: 29,
    marginBottom: 20,
  },
  cardLargeTablet: {
    padding: 24,
  },

  /* TEXT */
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  titleTablet: {
    fontSize: 19,
  },
  heading: {
    fontSize: 13,
    color: "#555",
    marginBottom: 12,
  },
  headingTablet: {
    fontSize: 16,
  },

  /* BUTTON */
  button: {
    backgroundColor: "#971A01",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  /* IMAGE */
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  imageTablet: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  imageLargeTablet: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  /* NO DATA */
  noData: {
    textAlign: "center",
    marginTop: 60,
    color: "#777",
    fontSize: 16,
  },
});