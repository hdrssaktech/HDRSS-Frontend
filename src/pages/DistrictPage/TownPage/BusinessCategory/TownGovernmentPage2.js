import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  useWindowDimensions,
  StatusBar,
  Platform,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../../../components/Alert/Loader";

const PRIMARY = "#93210A";
const PRIMARY_SOFT = "rgba(147,33,10,0.08)";

const placeholderImages = [
  "https://via.placeholder.com/300/93210A/FFFFFF?text=Service",
  "https://via.placeholder.com/300/555/FFFFFF?text=Office",
  "https://via.placeholder.com/300/777/FFFFFF?text=Help",
];

const TownGovernmentPage2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { townGovernmentId } = route.params;

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const isLargeTablet = width >= 1024;
  const numColumns = isLargeTablet ? 3 : isTablet ? 2 : 1;

  const CARD_WIDTH = () => {
    if (numColumns === 1) return width - 32;
    const padding = isTablet ? 24 : 16;
    const gap = isTablet ? 20 : 16;
    return (width - padding * 2 - gap * (numColumns - 1)) / numColumns;
  };

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArea, setActiveArea] = useState("All");

  const loadServices = async () => {
    try {
      const res = await axios.get(
        `https://hdrss-backend.onrender.com/api/town-government-services/${townGovernmentId}`
      );
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

  // Build unique localarea list
  const localAreas = [
    "All",
    ...new Set(services.map((s) => s.localarea || s.localArea).filter(Boolean)),
  ];

  // Filter services by selected area
  const filteredServices =
    activeArea === "All"
      ? services
      : services.filter(
          (s) => (s.localarea || s.localArea) === activeArea
        );

  const openMap = (locationTextOrUrl) => {
    if (!locationTextOrUrl) return;
    const isUrl = /^https?:\/\//i.test(locationTextOrUrl);
    Linking.openURL(
      isUrl
        ? locationTextOrUrl
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationTextOrUrl)}`
    );
  };

  const callNumber = (number) => {
    if (number) Linking.openURL(`tel:${number}`);
  };

  /* ── Filter Bar ── */
  const renderFilterBar = () => (
    <View style={styles.filterWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {localAreas.map((area) => {
          const active = activeArea === area;
          return (
            <TouchableOpacity
              key={area}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveArea(area)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {area}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  /* ── Empty State ── */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="construct-outline" size={isTablet ? 80 : 60} color={PRIMARY} />
      <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
        No services available
      </Text>
    </View>
  );

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={PRIMARY} barStyle="light-content" />

      {/* Header */}
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

      {/* Filter chips — only show when multiple areas exist */}
      {localAreas.length > 1 && renderFilterBar()}

      {/* List */}
      {filteredServices.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredServices}
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
          contentContainerStyle={{
            paddingHorizontal: numColumns === 1 ? 16 : 0,
            paddingTop: 16,
            paddingBottom: isTablet ? 30 : 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const isLastInRow = (index + 1) % numColumns === 0;
            const gap = isTablet ? 20 : 16;
            const imageUrl = item?.image || placeholderImages[index % 3];
            const phone = item?.phonenumber || item?.phoneNumber;
            const location = item?.location || item?.localArea || item?.localarea;
            const areaLabel = item?.localarea || item?.localArea;

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

                  {/* Image */}
                  <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={[styles.image, isTablet && styles.imageTablet]}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Details */}
                  <View style={[styles.detailsContainer, isTablet && styles.detailsContainerTablet]}>

                    {/* Service Name */}
                    <Text style={[styles.name, isTablet && styles.nameTablet]} numberOfLines={2}>
                      {item?.name || "Unnamed Service"}
                    </Text>

                    {/* Local Area badge */}
                    {areaLabel ? (
                      <View style={styles.areaBadge}>
                        <Ionicons name="location-outline" size={11} color={PRIMARY} />
                        <Text style={styles.areaBadgeText} numberOfLines={1}>
                          {areaLabel}
                        </Text>
                      </View>
                    ) : null}

                    {/* Action Buttons */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        onPress={() => callNumber(phone)}
                        style={[styles.callButton, isTablet && styles.callButtonTablet]}
                        activeOpacity={0.85}
                        disabled={!phone}
                      >
                        <Ionicons name="call" size={isTablet ? 16 : 14} color="#fff" />
                        <Text style={styles.callText}>Call</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => openMap(location)}
                        style={[styles.mapButton, isTablet && styles.mapButtonTablet]}
                        activeOpacity={0.85}
                        disabled={!location}
                      >
                        <Ionicons name="navigate-outline" size={isTablet ? 16 : 14} color={PRIMARY} />
                        <Text style={styles.mapText}>Directions</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F8" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY,
    paddingTop: Platform.OS === "ios" ? 10 : 40,
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
    paddingTop: Platform.OS === "ios" ? 15 : 45,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  backButtonTablet: { width: 50, height: 50, borderRadius: 25 },
  headerTitle: {
    flex: 1, textAlign: "center", color: "#fff",
    fontSize: 20, fontWeight: "800", letterSpacing: 0.3,
  },
  headerTitleTablet: { fontSize: 24 },
  headerSpacer: { width: 40 },
  headerSpacerTablet: { width: 50 },

  /* Filter */
  filterWrapper: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFF0EE",
    borderWidth: 1.5,
    borderColor: "rgba(147,33,10,0.2)",
  },
  chipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { fontSize: 13, fontWeight: "700", color: PRIMARY },
  chipTextActive: { color: "#fff" },

  /* Empty */
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { marginTop: 16, color: PRIMARY, fontSize: 16, fontWeight: "600", textAlign: "center" },
  emptyTextTablet: { fontSize: 18, marginTop: 20 },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 14, padding: 12,
    elevation: 3,
    shadowColor: "#000", shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
    borderWidth: 1, borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 18, padding: 16, elevation: 5,
    shadowOpacity: 0.15, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
  },
  cardContentRow: { flexDirection: "row", alignItems: "flex-start" },

  /* Image */
  imageContainer: { marginRight: 12 },
  imageContainerTablet: { marginRight: 16 },
  image: { width: 95, height: 95, borderRadius: 10, backgroundColor: "#f0f0f0" },
  imageTablet: { width: 130, height: 130, borderRadius: 14 },

  /* Details */
  detailsContainer: {
    flex: 1, flexDirection: "column",
    justifyContent: "space-between", minHeight: 95,
  },
  detailsContainerTablet: { minHeight: 130 },

  name: {
    fontSize: 15, fontWeight: "800",
    color: PRIMARY, lineHeight: 21, marginBottom: 6,
  },
  nameTablet: { fontSize: 17, lineHeight: 24, marginBottom: 8 },

  /* Area badge */
  areaBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 4,
    marginBottom: 8,
  },
  areaBadgeText: {
    fontSize: 11, fontWeight: "700",
    color: PRIMARY, letterSpacing: 0.3,
  },

  /* Buttons */
  actionsRow: { flexDirection: "row", gap: 8 },
  callButton: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: PRIMARY, paddingVertical: 8,
    borderRadius: 8, gap: 5,
    elevation: 2, shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  callButtonTablet: { paddingVertical: 10, borderRadius: 10 },
  callText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  mapButton: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: PRIMARY_SOFT,
    borderWidth: 1.5, borderColor: PRIMARY,
    paddingVertical: 8, borderRadius: 8, gap: 5,
  },
  mapButtonTablet: { paddingVertical: 10, borderRadius: 10 },
  mapText: { color: PRIMARY, fontSize: 12, fontWeight: "700" },
});