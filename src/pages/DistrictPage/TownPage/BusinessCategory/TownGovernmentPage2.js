import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../../../components/Alert/Loader";

const TownGovernmentPage2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { townGovernmentId } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;

  // ✅ Same responsive columns as District GovernmentPage2
  const numColumns = isLargeTablet ? 3 : isTablet ? 2 : 1;

  // ✅ Same card width calc as District GovernmentPage2
  const CARD_WIDTH = () => {
    if (numColumns === 1) return width - 32;
    const padding = isTablet ? 24 : 16;
    const gap = isTablet ? 20 : 16;
    const totalGap = gap * (numColumns - 1);
    const availableWidth = width - padding * 2;
    return (availableWidth - totalGap) / numColumns;
  };

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = axios.create({
    baseURL: "https://hdrss-backend.onrender.com/api",
  });

  const loadServices = async () => {
    try {
      const res = await API.get(`/town-government-services/${townGovernmentId}`);

      const items =
        res.data?.data ||
        res.data?.services ||
        (Array.isArray(res.data) ? res.data : []);

      setServices(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Service API Error:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [townGovernmentId]);

  const openMap = (locationTextOrUrl) => {
    if (!locationTextOrUrl) return;

    // If API provides URL, open directly; else treat as text and search in maps
    const isUrl = /^https?:\/\//i.test(locationTextOrUrl);
    if (isUrl) {
      Linking.openURL(locationTextOrUrl);
    } else {
      const encoded = encodeURIComponent(locationTextOrUrl);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
    }
  };

  const callNumber = (number) => {
    if (!number) return;
    Linking.openURL(`tel:${number}`);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="construct-outline"
        size={isTablet ? 80 : 60}
        color="#93210A"
      />
      <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
        No services available
      </Text>
    </View>
  );

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* ✅ Header = District GovernmentPage2 */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <TouchableOpacity
          style={[styles.backButton, isTablet && styles.backButtonTablet]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={isTablet ? 30 : 26} color="#fff" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
          Government Services
        </Text>

        <View style={[styles.headerSpacer, isTablet && styles.headerSpacerTablet]} />
      </View>

      {/* ✅ List = District GovernmentPage2 */}
      {services.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={services}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          columnWrapperStyle={
            numColumns > 1
              ? {
                  justifyContent: "space-between",
                  paddingHorizontal: isTablet ? 24 : 16,
                  marginBottom: isTablet ? 20 : 16,
                }
              : null
          }
          contentContainerStyle={[
            styles.listContainer,
            {
              paddingHorizontal: numColumns === 1 ? 16 : 0,
              paddingTop: 16,
              paddingBottom: isTablet ? 30 : 20,
            },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isLastInRow = (index + 1) % numColumns === 0;
            const gap = isTablet ? 20 : 16;

          const imageUrl = item?.image || placeholderImages[index % 3];

            // Your town API uses `phonenumber` (not phoneNumber) ✅
            const phone = item?.phonenumber || item?.phoneNumber;

            // location could be text or url ✅
            const location = item?.location || item?.localArea;

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
                <View style={styles.cardContentRow}>
                  {/* Image left */}
                  <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={[styles.image, isTablet && styles.imageTablet]}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Details right */}
                  <View
                    style={[styles.detailsContainer, isTablet && styles.detailsContainerTablet]}
                  >
                    <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={2}>
                      {item?.name || "Unnamed Service"}
                    </Text>

                    {/* Actions row (same as district) */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        onPress={() => callNumber(phone)}
                        style={[styles.callButton, isTablet && styles.callButtonTablet]}
                        activeOpacity={0.85}
                        disabled={!phone}
                      >
                        <Ionicons name="call" size={isTablet ? 18 : 16} color="#fff" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => openMap(location)}
                        style={[styles.mapButton, isTablet && styles.mapButtonTablet]}
                        activeOpacity={0.85}
                        disabled={!location}
                      >
                        <Ionicons name="map" size={isTablet ? 22 : 18} color="#93210A" />
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

export default TownGovernmentPage2;

/* ✅ Styles copied from District GovernmentPage2 design */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F8",
  },

  /* EMPTY */
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

  /* HEADER */
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

  headerSpacer: { width: 40 },
  headerSpacerTablet: { width: 50 },

  /* LIST */
  listContainer: {
    flexGrow: 1,
  },

  /* CARD */
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

  cardContentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  imageContainer: { marginRight: 12 },
  imageContainerTablet: { marginRight: 16 },

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

  detailsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 100,
  },
  detailsContainerTablet: { minHeight: 140 },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#93210A",
    marginTop: 13,
    flexWrap: "wrap",
    lineHeight: 20,
  },
  titleTablet: {
    fontSize: 15,
    marginBottom: 6,
    lineHeight: 22,
  },

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