// src/components/Gallery/GalleryFull.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation,useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchGalleryList } from "../../Controller/GalleryController/GalleryController";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 600;
const numColumns = isTablet ? 3 : 2;


export default function GalleryFull() {
  const navigation = useNavigation();
  const route = useRoute();
  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { districtId} = route.params || {};


  useEffect(() => {
    const loadData = async () => {
      const data = await fetchGalleryList(districtId);
      setGalleryList(data || []);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={[styles.loadingText, isTablet && styles.loadingTextTablet]}>
          Loading Gallery...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      {/* Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, isTablet && styles.backBtnTablet]}
        >
          <Icon 
            name="chevron-back" 
            size={isTablet ? 32 : 28} 
            color="#fff" 
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Gallery
        </Text>
        <View style={{ width: isTablet ? 40 : 28 }} />
      </View>

      {/* Gallery List */}
      <FlatList
        data={galleryList || []}
        key={numColumns}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          isTablet && styles.listContainerTablet,
          galleryList?.length === 0 && styles.emptyListContainer
        ]}
        columnWrapperStyle={{
        justifyContent: "space-between",
        marginBottom: isTablet ? 24 : 20,
      }}

        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                width: `${100 / numColumns - 2}%`,
              },
            ]}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("GalleryPage2", {
                title: item.title,
                mainImage: { uri: item.thumbnail },
                description: item.description,
                images: item.images,
                videoLink: item.videoLink,
              })
            }
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={[styles.image, isTablet && styles.imageTablet]}
              resizeMode="cover"
            />
            <View style={styles.overlay} />
            <View style={[styles.textBox, isTablet && styles.textBoxTablet]}>
              <Text
                style={[styles.title, isTablet && styles.titleTablet]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No gallery found</Text>
          </View>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  
  // Loading
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#93210A",
    fontWeight: "600",
  },
  loadingTextTablet: {
    fontSize: 16,
    marginTop: 15,
  },
    noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },


  // Header - Mobile (1 column)
  header: {
    backgroundColor: "#93210A",
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  // Header - Tablet (2 columns)
  headerTablet: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 25,
    paddingHorizontal: 30,
  },

  // Back Button - Mobile
  backBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  // Back Button - Tablet
  backBtnTablet: {
    padding: 10,
    borderRadius: 25,
  },

  // Header Title - Mobile
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  // Header Title - Tablet
  headerTitleTablet: {
    fontSize: 26,
    letterSpacing: 1.2,
  },

  // List Container - Mobile (1 column)
  listContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  // List Container - Tablet (2 columns)
  listContainerTablet: {
    padding: 24,
    paddingBottom: 40,
  },

  // Column Wrapper - Tablet only (2 columns)
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 24,
  },

  // Card - Mobile (1 column - full width)
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  // Card - Tablet (2 columns - 48% width each)
  cardTablet: {
    marginBottom: 24,
    borderRadius: 20,
  },

  // Image - Mobile (1 column)
  image: {
    width: "100%",
    height: 220,
  },
  // Image - Tablet (2 columns)
  imageTablet: {
    height: 260,
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  // Text Box - Mobile
  textBox: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  // Text Box - Tablet
  textBoxTablet: {
    bottom: 20,
    left: 20,
    right: 20,
  },

  // Title - Mobile
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // Title - Tablet
  titleTablet: {
    fontSize: 20,
    marginBottom: 6,
  },

  // Description - Mobile
  description: {
    fontSize: 14,
    color: "#f0f0f0",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Description - Tablet
  descriptionTablet: {
    fontSize: 15,
  },
});