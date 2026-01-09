import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  StatusBar,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const VaasthuPage2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, categoryTitle } = route.params || {};

  const { width, height } = useWindowDimensions();
  
  // Device detection
  const isTablet = width >= 600;
  
  // Responsive columns - 2 columns for tablet, 1 for mobile
  // If you want 3 columns for mobile, change to: isTablet ? 2 : 3
  const numColumns = isTablet ? 2 : 2;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) {
      setError("Invalid category ID");
      setLoading(false);
      return;
    }

    axios
      .get(`https://hdrss-backend.onrender.com/api/vastu/details/category/${categoryId}`)
      .then((res) => {
        setItems(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load items. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        isTablet && styles.tabletCard,
      ]}
      onPress={() =>
        navigation.navigate("VaasthuPage3", { item })
      }
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image }} 
        style={[
          styles.image,
          isTablet && styles.tabletImage,
        ]} 
      />
      <View style={styles.textContainer}>
        <Text style={[
          styles.text,
          isTablet && styles.tabletText,
        ]} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={[
      styles.emptyContainer,
      isTablet && styles.tabletEmptyContainer
    ]}>
      <Ionicons name="images-outline" size={isTablet ? 80 : 60} color="#ccc" />
      <Text style={[
        styles.emptyText,
        isTablet && styles.tabletEmptyText
      ]}>
        No items found
      </Text>
      <TouchableOpacity 
        style={[
          styles.retryButton,
          isTablet && styles.tabletRetryButton
        ]}
        onPress={() => {
          setLoading(true);
          axios.get(`https://hdrss-backend.onrender.com/api/vastu/details/category/${categoryId}`)
            .then((res) => setItems(res.data))
            .catch(() => setError("Failed to load items"))
            .finally(() => setLoading(false));
        }}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={[
      styles.header,
      isTablet && styles.tabletHeader,
    ]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
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
      ]} numberOfLines={1}>
        {categoryTitle || "Items"}
      </Text>
      <View style={{ width: isTablet ? 32 : 26 }} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />
        {renderHeader()}
        <View style={[
          styles.center,
          isTablet && styles.tabletCenter
        ]}>
          <ActivityIndicator size="large" color="#8B1A1A" />
          <Text style={[
            styles.loadingText,
            isTablet && styles.tabletLoadingText
          ]}>
            Loading items...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B1A1A" barStyle="light-content" />
      
      {renderHeader()}

      {error ? (
        <View style={[
          styles.center,
          isTablet && styles.tabletCenter
        ]}>
          <Ionicons name="alert-circle-outline" size={isTablet ? 60 : 50} color="#8B1A1A" />
          <Text style={[
            styles.errorText,
            isTablet && styles.tabletErrorText
          ]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[
              styles.retryButton,
              isTablet && styles.tabletRetryButton
            ]}
            onPress={() => {
              setLoading(true);
              setError(null);
              axios.get(`https://hdrss-backend.onrender.com/api/vastu/details/category/${categoryId}`)
                .then((res) => setItems(res.data))
                .catch(() => setError("Failed to load items"))
                .finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={[
            styles.listContainer,
            isTablet && styles.tabletListContainer,
          ]}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default VaasthuPage2;

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
  
  tabletCenter: {
    padding: 40,
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

  backButton: {
    padding: 4,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
    paddingHorizontal: 8,
  },

  tabletHeaderTitle: {
    fontSize: 28,
  },

  listContainer: {
    padding: 12,
    paddingBottom: 20,
  },

  tabletListContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
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
    marginHorizontal: 8,
    marginBottom: 16,
  },

  tabletCard: {
    borderRadius: 16,
    elevation: 4,
    marginHorizontal: 8,
  },

  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },

  tabletImage: {
    height: 180,
  },

  textContainer: {
    padding: 12,
    minHeight: 60,
    justifyContent: "center",
  },

  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  tabletText: {
    fontSize: 16,
  },

  loadingText: {
    marginTop: 12,
    color: "#8B1A1A",
    fontWeight: "600",
    fontSize: 16,
  },

  tabletLoadingText: {
    fontSize: 18,
    marginTop: 16,
  },

  errorText: {
    marginTop: 15,
    color: "#8B1A1A",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },

  tabletErrorText: {
    fontSize: 18,
    marginTop: 20,
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#8B1A1A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  tabletRetryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },

  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  tabletEmptyContainer: {
    padding: 60,
  },

  emptyText: {
    marginTop: 20,
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  tabletEmptyText: {
    fontSize: 18,
    marginTop: 25,
  },
});