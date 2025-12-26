import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const PartiesPage2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { partyId } = route.params;

  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!partyId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://hdrss-backend.onrender.com/api/party/category/${partyId}`
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Filter unique titles
        const uniqueTitles = [
          ...new Map(data.map(item => [item.title, item])).values()
        ];

        setTitles(uniqueTitles);
        setError(null);
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partyId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size={isTablet ? "large" : "small"} color="#93210A" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#93210A" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Parties</Text>
            {titles.length > 0 && (
              <Text style={styles.headerSubtitle}>
                {/* {titles.length} categor{titles.length === 1 ? 'y' : 'ies'} */}
              </Text>
            )}
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {titles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={80} color="#CCCCCC" />
              <Text style={styles.emptyText}>No categories found</Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {titles.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.card,
                    isTablet && styles.cardTablet,
                    isSmallDevice && styles.cardSmall
                  ]}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate("Partiespage3", {
                      partyTitle: item.title,
                      partyId: partyId,
                    })
                  }
                >
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <Image
                        source={{
                          uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                        }}
                        style={styles.icon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.title} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.arrowContainer}>
                      <Ionicons name="chevron-forward" size={20} color="#93210A" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PartiesPage2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#93210A",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: "#93210A",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#93210A",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  header: {
    backgroundColor: "#93210A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 35,
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "800",
    color: "#FFFFFF",
    paddingTop:20,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  // headerSubtitle: {
  //   fontSize: isTablet ? 16 : 14,
  //   color: "rgba(255, 255, 255, 0.8)",
  //   marginTop: 4,
  //   fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  // },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: height * 0.6,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  gridContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    overflow: "hidden",
  },
  cardTablet: {
    marginHorizontal: isTablet ? width * 0.1 : 0,
    marginBottom: 20,
  },
  cardSmall: {
    marginHorizontal: 8,
  },
  cardContent: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: isTablet ? 80 : 60,
    height: isTablet ? 80 : 60,
    borderRadius: 15,
    backgroundColor: "#FFF5F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    width: isTablet ? 50 : 40,
    height: isTablet ? 50 : 40,
  },
  title: {
    flex: 1,
    fontSize: isTablet ? 20 : 16,
    fontWeight: "600",
    color: "#2D3748",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    lineHeight: 24,
  },
  arrowContainer: {
    padding: 8,
  },
});