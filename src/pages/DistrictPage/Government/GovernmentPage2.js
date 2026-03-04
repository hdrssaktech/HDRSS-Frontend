import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator, 
  StyleSheet,
  Image, 
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const GovernmentPage2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { governmentId } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const CARD_WIDTH = isTablet ? width / 2 - 30 : width - 30;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/governments/services/${governmentId}`
        );
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("❌ Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [governmentId]);

  const openMap = (url) => {
    if (url) Linking.openURL(url);
  };

  const callNumber = (number) => {
    if (number) Linking.openURL(`tel:${number}`);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text>Loading services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ================= HEADER ================= */}
      <View style={isTablet ? styles.headerTablet : styles.headerMobile}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={isTablet ? 30 : 24} color="#fff" />
        </TouchableOpacity>
        <Text
          style={isTablet ? styles.headerTextTablet : styles.headerTextMobile}
        >
          Governments Services
        </Text>
      </View>

      {/* ================= LIST ================= */}
      <FlatList
        data={services}
        key={isTablet ? "tablet" : "mobile"}
        numColumns={isTablet ? 2 : 1}
        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }
        columnWrapperStyle={
          isTablet && { justifyContent: "space-between", marginBottom: 15 }
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const placeholderImages = [
            "https://via.placeholder.com/300/93210A/FFFFFF?text=Service",
            "https://via.placeholder.com/300/555/FFFFFF?text=Office",
            "https://via.placeholder.com/300/777/FFFFFF?text=Help",
          ];
          const imageUrl = item.image || placeholderImages[index % 3];

          return (
            <View
              style={[
                styles.card,
                { width: CARD_WIDTH },
                isTablet && styles.cardTablet,
              ]}
            >
              {/* Card Content Row */}
              <View style={styles.cardContentRow}>
                {/* Image on LEFT - Square Shape */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={isTablet ? styles.imageTablet : styles.imageMobile}
                    resizeMode="cover"
                  />
                </View>

                {/* Details on RIGHT */}
                <View style={styles.detailsContainer}>
                  <Text
                    style={
                      isTablet ? styles.titleTablet : styles.titleMobile
                    }
                    numberOfLines={2}
                  >
                    {item?.name || "Unnamed Service"}
                  </Text>

                  <Text style={styles.localArea} numberOfLines={2}>
                    {item?.localArea || "No location info"}
                  </Text>

                  {/* Phone Number - Moved to details section */}
                  <View style={styles.phoneContainer}>
                    <Icon name="call" size={14} color="#93210A" />
                    <Text style={styles.phoneText} numberOfLines={1}>
                      {item?.phoneNumber || "N/A"}
                    </Text>
                  </View>

                  {/* Actions Row */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      onPress={() => callNumber(item.phoneNumber)}
                      style={styles.callButton}
                    >
                      <Icon name="call" size={16} color="#fff" />
                      <Text style={styles.callText}>Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => openMap(item.location)}
                      style={styles.mapButton}
                    >
                      <Icon name="map" size={18} color="#93210A" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default GovernmentPage2;

/* =================================================
   STYLES – MOBILE & TABLET SEPARATED
================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F8",
  },

  /* ================= LOADER ================= */
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ================= HEADER ================= */
  headerMobile: {
    backgroundColor: "#93210A",
    paddingVertical: 35,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  headerTablet: {
    backgroundColor: "#93210A",
    paddingVertical: 45,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    marginRight: 12,
    bottom: -10,
  },

  headerTextMobile: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    bottom: -10,
    left: 50,
  },

  headerTextTablet: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    top: 10,
    left: 150,
  },

  /* ================= CARD ================= */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 14,
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  cardTablet: {
    borderRadius: 18,
    padding: 16,
  },

  /* ================= CARD CONTENT ROW ================= */
  cardContentRow: {
    flexDirection: "row",
    alignItems: "flex-start", // Align items to top
  },

  /* ================= IMAGE CONTAINER ================= */
  imageContainer: {
    marginRight: 12,
  },

  imageMobile: {
    width: 100, // Square shape width
    height: 100, // Square shape height
    borderRadius: 10,
  },

  imageTablet: {
    width: 140, // Larger square for tablet
    height: 140, // Larger square for tablet
    borderRadius: 14,
  },

  /* ================= DETAILS CONTAINER ================= */
  detailsContainer: {
    flex: 1, // Takes remaining space
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 100, // Match image height for mobile
  },

  /* ================= TITLE ================= */
  titleMobile: {
    fontSize: 16,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 6,
    flexWrap: "wrap",
  },

  titleTablet: {
    fontSize: 15,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 8,
    flexWrap: "wrap",
  },

  /* ================= LOCAL AREA ================= */
  localArea: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    flexWrap: "wrap",
  },

  /* ================= PHONE CONTAINER ================= */
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  phoneText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },

  /* ================= ACTIONS ROW ================= */
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
  },

  callText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },

  mapButton: {
    backgroundColor: "#f5e4e1",
    padding: 10,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});