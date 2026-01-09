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
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const VaasthuPage0 = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  // Enhanced device detection with aspect ratio consideration
  const isTablet = width >= 600|| (width >= 600 && width / height > 0.7);
  const isLargeTablet = width >= 1024;
  
  // Responsive columns based on device
  const numColumns = isLargeTablet ? 4 : (isTablet ? 3 : 2);
  
  // Responsive spacing
  const cardMargin = isTablet ? 12 : 8;
  const listPadding = isTablet ? 16 : 10;

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://hdrss-backend.onrender.com/api/vastu/type")
      .then((res) => setTypes(res.data))
      .catch((err) => {
        console.log(err);
        setError("Failed to load data. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        isTablet && styles.tabletCard,
        isLargeTablet && styles.largeTabletCard,
        { margin: cardMargin }
      ]}
      onPress={() =>
        navigation.navigate("VaasthuPage1", {
          typeId: item.id,
          title: item.name,
        })
      }
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image }} 
        style={[
          styles.image,
          isTablet && styles.tabletImage,
          isLargeTablet && styles.largeTabletImage
        ]} 
      />
      <View style={[
        styles.cardFooter,
        isTablet && styles.tabletCardFooter
      ]}>
        <Text style={[
          styles.cardTitle,
          isTablet && styles.tabletCardTitle,
          isLargeTablet && styles.largeTabletCardTitle
        ]} numberOfLines={2}>
          {item.name}
        </Text>
        {/* <Ionicons 
          name="arrow-forward" 
          size={isTablet ? 20 : 16} 
          color="#8B1A1A" 
        /> */}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="grid-outline" size={60} color="#ccc" />
      <Text style={[
        styles.emptyText,
        isTablet && styles.tabletEmptyText
      ]}>
        No categories available
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#8B1A1A" />
        <Text style={[
          styles.loadingText,
          isTablet && styles.tabletLoadingText
        ]}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="alert-circle-outline" size={50} color="#8B1A1A" />
        <Text style={[
          styles.errorText,
          isTablet && styles.tabletErrorText
        ]}>{error}</Text>
        <TouchableOpacity 
          style={[
            styles.retryButton,
            isTablet && styles.tabletRetryButton
          ]} 
          onPress={() => {
            setError(null);
            setLoading(true);
            // Re-fetch data
            axios.get("https://hdrss-backend.onrender.com/api/vastu/type")
              .then((res) => setTypes(res.data))
              .catch((err) => setError("Failed to load data. Please try again."))
              .finally(() => setLoading(false));
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />

      {/* HEADER - Responsive */}
      <View style={[
        styles.header,
        isTablet && styles.tabletHeader,
        isLargeTablet && styles.largeTabletHeader
      ]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons 
            name="chevron-back" 
            size={isTablet ? 32 : 26} 
            color="#fff" 
          />
        </TouchableOpacity>
        <Text style={[
          styles.headerTitle,
          isTablet && styles.tabletHeaderTitle,
          isLargeTablet && styles.largeTabletHeaderTitle
        ]}>
          Vaasthu
        </Text>
        <View style={{ width: isTablet ? 32 : 26 }} />
      </View>

      {/* GRID - Responsive */}
      {types.length > 0 ? (
        <FlatList
          data={types}
          key={numColumns} // This ensures FlatList re-renders when numColumns changes
          numColumns={numColumns}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.list,
            { padding: listPadding }
          ]}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};

export default VaasthuPage0;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    color: "#8B1A1A",
    fontWeight: "600",
    fontSize: 16,
  },

  tabletLoadingText: {
    fontSize: 18,
    marginTop: 15,
  },

  errorText: {
    marginTop: 15,
    color: "#8B1A1A",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },

  tabletErrorText: {
    fontSize: 18,
    marginTop: 20,
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#8B1A1A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  tabletRetryButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },

  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  header: {
    backgroundColor: "#8B1A1A",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  tabletHeader: {
paddingVertical: 46,
    paddingHorizontal: 24,
    marginTop: -27,
  },

  largeTabletHeader: {
    padding: 24,
  },

  backButton: {
    padding: 4, // Makes touch area larger
  },

  headerTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "700",
    textAlign: "center",
    right:10,
  },

  tabletHeaderTitle: {
    fontSize: 30,
  },

  largeTabletHeaderTitle: {
    fontSize: 28,
  },

  list: {
    flexGrow: 1,
  },

  columnWrapper: {
    justifyContent: 'space-between',
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  tabletCard: {
    borderRadius: 16,
    elevation: 4,
  },

  largeTabletCard: {
    borderRadius: 20,
    elevation: 6,
  },

  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },

  tabletImage: {
    height: 160,
  },

  largeTabletImage: {
    height: 180,
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    minHeight: 50,
  },

  tabletCardFooter: {
    padding: 12,
    minHeight: 60,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },

  tabletCardTitle: {
    fontSize: 16,
  },

  largeTabletCardTitle: {
    fontSize: 18,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyText: {
    marginTop: 15,
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },

  tabletEmptyText: {
    fontSize: 18,
    marginTop: 20,
  },
});