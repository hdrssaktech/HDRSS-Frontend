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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/governments/services/${governmentId}`
        );
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [governmentId]);

  // Build unique localArea list from data
  const localAreas = ["All", ...new Set(services.map((s) => s.localArea).filter(Boolean))];

  // Filter by selected localArea
  const filteredServices =
    activeArea === "All"
      ? services
      : services.filter((s) => s.localArea === activeArea);

  const openMap = (url) => { if (url) Linking.openURL(url); };
  const callNumber = (number) => { if (number) Linking.openURL(`tel:${number}`); };

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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="construct-outline" size={isTablet ? 80 : 60} color="#93210A" />
      <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
        No services available
      </Text>
    </View>
  );

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* Header */}
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

      {/* Filter chips — only show if more than one localArea exists */}
      {localAreas.length > 1 && renderFilterBar()}

      {/* List */}
      {filteredServices.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredServices}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
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
                    <Text style={[styles.title, isTablet && styles.titleTablet]} numberOfLines={2}>
                      {item?.name || "Unnamed Service"}
                    </Text>

                    <Text style={[styles.localArea, isTablet && styles.localAreaTablet]} numberOfLines={2}>
                      {item?.localArea || "No location info"}
                    </Text>

                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        onPress={() => callNumber(item.phoneNumber)}
                        style={[styles.callButton, isTablet && styles.callButtonTablet]}
                      >
                        <Ionicons name="call" size={isTablet ? 18 : 16} color="#fff" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => openMap(item.location)}
                        style={[styles.mapButton, isTablet && styles.mapButtonTablet]}
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

export default GovernmentPage2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F8" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
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
  chipActive: { backgroundColor: "#93210A", borderColor: "#93210A" },
  chipText: { fontSize: 13, fontWeight: "700", color: "#93210A" },
  chipTextActive: { color: "#fff" },

  /* Empty */
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { marginTop: 16, color: "#93210A", fontSize: 16, fontWeight: "600", textAlign: "center" },
  emptyTextTablet: { fontSize: 18, marginTop: 20 },

  /* List */
  listContainer: { flexGrow: 1 },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 14, padding: 12,
    elevation: 4,
    shadowColor: "#000", shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
    borderWidth: 1, borderColor: "#f0f0f0",
  },
  cardTablet: {
    borderRadius: 18, padding: 16, elevation: 5,
    shadowOpacity: 0.2, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
  },
  cardContentRow: { flexDirection: "row", alignItems: "flex-start" },

  imageContainer: { marginRight: 12 },
  imageContainerTablet: { marginRight: 16 },
  image: { width: 100, height: 100, borderRadius: 10, backgroundColor: "#f0f0f0" },
  imageTablet: { width: 140, height: 140, borderRadius: 14 },

  detailsContainer: { flex: 1, flexDirection: "column", justifyContent: "space-between", minHeight: 100 },
  detailsContainerTablet: { minHeight: 140 },

  title: { fontSize: 15, fontWeight: "700", color: "#93210A", marginBottom: 4, lineHeight: 20 },
  titleTablet: { fontSize: 15, marginBottom: 6, lineHeight: 22 },

  localArea: { fontSize: 13, color: "#555", marginBottom: 6, lineHeight: 18 },
  localAreaTablet: { fontSize: 14, marginBottom: 8, lineHeight: 20 },

  actionsRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  callButton: {
    backgroundColor: "#93210A", paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 8, elevation: 2,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  callButtonTablet: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
  mapButton: {
    backgroundColor: "#f5e4e1", padding: 8, borderRadius: 8,
    width: 36, height: 36, alignItems: "center", justifyContent: "center",
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  mapButtonTablet: { width: 44, height: 44, borderRadius: 10 },
});