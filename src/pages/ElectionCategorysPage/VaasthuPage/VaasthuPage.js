import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../../components/Alert/Loader";

const VaasthuPage0 = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // Device detection - Simple like PoojaPage1
  const isTablet = width >= 600;
  
  // Always use 2 columns for both mobile and tablet like PoojaPage1
  const numColumns = 2;

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://hdrss-backend.onrender.com/api/vastu/type")
      .then((res) => {
        setTypes(res.data);
        setError(null);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
        isTablet && styles.cardTablet,
        index % 2 === 0 ? styles.leftCard : styles.rightCard,
      ]}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate("VaasthuPage1", {
          typeId: item.id,
          title: item.name,
        })
      }
    >
      <Image 
        source={{ uri: item.image }} 
        style={[styles.image, isTablet && styles.imageTablet]} 
        resizeMode="cover"
      />

      <View style={[styles.cardFooter, isTablet && styles.cardFooterTablet]}>
        <Text style={[styles.cardTitle, isTablet && styles.cardTitleTablet]} numberOfLines={1}>
          {item.name}
        </Text>
        <Ionicons 
          name="arrow-forward" 
          size={isTablet ? 20 : 16} 
          color="#8B1A1A" 
        />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="grid-outline" size={isTablet ? 80 : 60} color="#ccc" />
      <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
        No categories available
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.center}>
      <Ionicons name="alert-circle-outline" size={isTablet ? 70 : 50} color="#8B1A1A" />
      <Text style={[styles.errorText, isTablet && styles.errorTextTablet]}>
        {error}
      </Text>
      <TouchableOpacity 
        style={[styles.retryButton, isTablet && styles.retryButtonTablet]}
        onPress={() => {
          setError(null);
          setLoading(true);
          axios.get("https://hdrss-backend.onrender.com/api/vastu/type")
            .then((res) => setTypes(res.data))
            .catch((err) => setError("Failed to load data. Please try again."))
            .finally(() => setLoading(false));
        }}
      >
        <Text style={[styles.retryButtonText, isTablet && styles.retryButtonTextTablet]}>
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />

      {/* Header - Exactly like PoojaPage1 */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Vaasthu
        </Text>
      </View>

      {/* Content */}
      {error ? (
        renderErrorState()
      ) : types.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={types}
          key={numColumns}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.container, isTablet && styles.containerTablet]}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default VaasthuPage0;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  /* Screen - Exactly like PoojaPage1 */
  screen: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  /* Center - For error states */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  /* Header - Exactly like PoojaPage1 */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B1A1A",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTablet: {
    paddingTop: 45,
    paddingBottom: 28,
    paddingHorizontal: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  backButtonTablet: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginRight: 70,
  },
  headerTitleTablet: {
    fontSize: 24,
   
  },

  /* Grid Container - Exactly like PoojaPage1 */
  container: {
    padding: 10,
    paddingBottom: 30,
  },
  containerTablet: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  /* Card - Exactly like PoojaPage1 */
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 6,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 16,
    margin: 10,
    marginBottom: 20,
  },
  leftCard: {
    marginLeft: 10,
    marginRight: 5,
  },
  rightCard: {
    marginLeft: 5,
    marginRight: 10,
  },

  /* Image - Exactly like PoojaPage1 */
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#f5f5f5",
  },
  imageTablet: {
    height: 160,
  },

  /* Card Footer - Exactly like PoojaPage1 bottomRow */
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  cardFooterTablet: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  /* Card Title - Exactly like PoojaPage1 title */
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
    textAlign: "center",
  },
  cardTitleTablet: {
    fontSize: 18,
  },

  /* Error Text */
  errorText: {
    marginTop: 15,
    color: "#8B1A1A",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
  errorTextTablet: {
    fontSize: 18,
    marginTop: 20,
  },

  /* Retry Button */
  retryButton: {
    marginTop: 20,
    backgroundColor: "#8B1A1A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  retryButtonTablet: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  retryButtonTextTablet: {
    fontSize: 18,
  },

  /* Empty State */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 20,
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  emptyTextTablet: {
    fontSize: 18,
    marginTop: 25,
  },
});