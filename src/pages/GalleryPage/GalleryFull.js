// src/components/Gallery/GalleryFull.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { fetchGalleryList } from "../../Controller/GalleryController/GalleryController";
import Loader from "../../components/Alert/Loader";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;
const numColumns = isTablet ? 3 : 2;

export default function GalleryFull() {
  const navigation = useNavigation();
  const route = useRoute();
  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { districtId } = route.params || {};

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchGalleryList(districtId);
      setGalleryList(data || []);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <Loader />;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.card, isTablet && styles.cardTablet]}
        activeOpacity={0.9}
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

        <View style={styles.titleBox}>
          <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />

      {/* Header like your screenshot */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Gallery
        </Text>

        <View style={[styles.headerRightSpace, isTablet && styles.headerRightSpaceTablet]} />
      </View>

      {/* Grid list */}
      <FlatList
        data={galleryList || []}
        key={numColumns}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          isTablet && styles.listContainerTablet,
          galleryList?.length === 0 && styles.emptyListContainer,
        ]}
        columnWrapperStyle={numColumns > 1 ? styles.row : null}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No gallery found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F2F2F2" },

  // ✅ Header (same feel as screenshot)
  header: {
    backgroundColor: "#8B0000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 12 : 40,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerTablet: {
    paddingHorizontal: 26,
    paddingTop: Platform.OS === "ios" ? 16 : 48,
    paddingBottom: 22,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonTablet: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerTitleTablet: {
    fontSize: 28,
  },

  headerRightSpace: { width: 42 },
  headerRightSpaceTablet: { width: 52 },

  // ✅ List padding like screenshot
  listContainer: {
    padding: 14,
    paddingBottom: 24,
  },
  listContainerTablet: {
    padding: 22,
    paddingBottom: 30,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  // ✅ Card like screenshot
  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 18,
    padding: 10,
    marginBottom: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  cardTablet: {
    width: "31.5%",
    borderRadius: 20,
    padding: 12,
    marginBottom: 18,
  },

  // ✅ Image rounded inside card
  image: {
    width: "100%",
    height: 150,
    borderRadius: 16,
    backgroundColor: "#EEE",
  },
  imageTablet: {
    height: 190,
    borderRadius: 18,
  },

  // ✅ Title below image (not overlay)
  titleBox: {
    paddingTop: 10,
    paddingHorizontal: 2,
    paddingBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2B2B2B",
  },
  titleTablet: {
    fontSize: 18,
  },

  // Empty
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});