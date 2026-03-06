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
  StatusBar,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../../components/Alert/Loader";

const GovernmentPage2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { governmentId } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;

  // Responsive columns
  const numColumns = isLargeTablet ? 3 : (isTablet ? 2 : 1);

  // Responsive card width calculation
  const CARD_WIDTH = () => {
    if (numColumns === 1) {
      return width - 32; // Full width minus padding for mobile
    } else {
      const padding = isTablet ? 24 : 16;
      const gap = isTablet ? 20 : 16;
      const totalGap = gap * (numColumns - 1);
      const availableWidth = width - (padding * 2);
      return (availableWidth - totalGap) / numColumns;
    }
  };

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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="construct-outline" size={isTablet ? 80 : 60} color="#93210A" />
      <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
        No services available
      </Text>
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* ================= HEADER ================= */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Government Services
        </Text>

        <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
      </View>

      {/* ================= LIST ================= */}
      {services.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={services}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          columnWrapperStyle={numColumns > 1 ? {
            justifyContent: "space-between",
            paddingHorizontal: isTablet ? 24 : 16,
            marginBottom: isTablet ? 20 : 16,
          } : null}
          contentContainerStyle={[
            styles.listContainer,
            {
              paddingHorizontal: numColumns === 1 ? 16 : 0,
              paddingTop: 16,
              paddingBottom: isTablet ? 30 : 20,
            }
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isLastInRow = (index + 1) % numColumns === 0;
            const gap = isTablet ? 20 : 16;
            
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
                  {
                    width: CARD_WIDTH(),
                    marginRight: numColumns > 1 && !isLastInRow ? gap : 0,
                    marginBottom: numColumns === 1 ? 12 : 0,
                  },
                  isTablet && styles.cardTablet,
                ]}
              >
                {/* Card Content Row */}
                <View style={styles.cardContentRow}>
                  {/* Image on LEFT - Square Shape */}
                  <View style={[
                    styles.imageContainer,
                    isTablet && styles.imageContainerTablet
                  ]}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={[
                        styles.image,
                        isTablet && styles.imageTablet,
                      ]}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Details on RIGHT */}
                  <View style={[
                    styles.detailsContainer,
                    isTablet && styles.detailsContainerTablet
                  ]}>
                    <Text
                      style={[
                        styles.title,
                        isTablet && styles.titleTablet,
                      ]}
                      numberOfLines={2}
                    >
                      {item?.name || "Unnamed Service"}
                    </Text>

                    <Text style={[
                      styles.localArea,
                      isTablet && styles.localAreaTablet
                    ]} numberOfLines={2}>
                      {item?.localArea || "No location info"}
                    </Text>

                    {/* Phone Number - Moved to details section
                    <View style={styles.phoneContainer}>
                      <Ionicons name="call" size={isTablet ? 16 : 14} color="#93210A" />
                      <Text style={[
                        styles.phoneText,
                        isTablet && styles.phoneTextTablet
                      ]} numberOfLines={1}>
                        {item?.phoneNumber || "N/A"}
                      </Text>
                    </View> */}

                    {/* Actions Row */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        onPress={() => callNumber(item.phoneNumber)}
                        style={[
                          styles.callButton,
                          isTablet && styles.callButtonTablet
                        ]}
                      >
                        <Ionicons name="call" size={isTablet ? 18 : 16} color="#fff" />
                        {/* <Text style={[
                          styles.callText,
                          isTablet && styles.callTextTablet
                        ]}>Call</Text> */}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => openMap(item.location)}
                        style={[
                          styles.mapButton,
                          isTablet && styles.mapButtonTablet
                        ]}
                      >
                        <Ionicons 
                          name="map" 
                          size={isTablet ? 22 : 18} 
                          color="#93210A" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default GovernmentPage2;

/* =================================================
   STYLES – MOBILE & TABLET RESPONSIVE
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

  /* ================= EMPTY STATE ================= */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    color: "#93210A",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyTextTablet: {
    fontSize: 18,
    marginTop: 20,
  },

  /* ================= HEADER ================= */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTablet: {
    paddingTop: 45,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  
  },
  headerTitleTablet: {
    fontSize: 24,
  },

  headerSpacer: {
    width: 40,
  },
  headerSpacerTablet: {
    width: 50,
  },

  /* ================= LIST CONTAINER ================= */
  listContainer: {
    flexGrow: 1,
  },

  /* ================= CARD ================= */
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 18,
    padding: 16,
    elevation: 5,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  /* ================= CARD CONTENT ROW ================= */
  cardContentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  /* ================= IMAGE CONTAINER ================= */
  imageContainer: {
    marginRight: 12,
  },
  imageContainerTablet: {
    marginRight: 16,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  imageTablet: {
    width: 140,
    height: 140,
    borderRadius: 14,
  },

  /* ================= DETAILS CONTAINER ================= */
  detailsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 100,
  },
  detailsContainerTablet: {
    minHeight: 140,
  },

  /* ================= TITLE ================= */
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#93210A",
    marginBottom: 4,
    flexWrap: "wrap",
    lineHeight: 20,
  },
  titleTablet: {
    fontSize: 15,
    marginBottom: 6,
    lineHeight: 22,
  },

  /* ================= LOCAL AREA ================= */
  localArea: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    flexWrap: "wrap",
    lineHeight: 18,
  },
  localAreaTablet: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },

  /* ================= PHONE CONTAINER ================= */
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  phoneText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  phoneTextTablet: {
    fontSize: 13,
  },

  /* ================= ACTIONS ROW ================= */
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    minWidth: 7,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  callButtonTablet: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 8,
  },

  callText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  callTextTablet: {
    fontSize: 14,
    marginLeft: 6,
  },

  mapButton: {
    backgroundColor: "#f5e4e1",
    padding: 8,
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mapButtonTablet: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
});