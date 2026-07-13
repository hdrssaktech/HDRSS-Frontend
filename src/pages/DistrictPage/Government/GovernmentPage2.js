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
import { LinearGradient } from "expo-linear-gradient";
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
      <View style={styles.emptyIconWrap}>
        <Ionicons name="construct-outline" size={isTablet ? 60 : 46} color="#93210A" />
      </View>
      <Text style={[styles.emptyText, isTablet && styles.emptyTextTablet]}>
        No services available
      </Text>
    </View>
  );

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />
      <LinearGradient
        colors={["#FBEEDB", "#ede8d5"]}
        style={StyleSheet.absoluteFill}
      />

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
                  {/* Image — fully visible, gold ring frame, no overlay */}
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

                    <View style={styles.localAreaRow}>
                      <Ionicons name="location-sharp" size={isTablet ? 13 : 12} color="#B08900" />
                      <Text style={[styles.localArea, isTablet && styles.localAreaTablet]} numberOfLines={2}>
                        {item?.localArea || "No location info"}
                      </Text>
                    </View>

                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        onPress={() => callNumber(item.phoneNumber)}
                        style={[styles.callButton, isTablet && styles.callButtonTablet]}
                        activeOpacity={0.85}
                      >
                        <Ionicons name="call" size={isTablet ? 18 : 16} color="#fff" />
                        {isTablet && <Text style={styles.callButtonText}>Call</Text>}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => openMap(item.location)}
                        style={[styles.mapButton, isTablet && styles.mapButtonTablet]}
                        activeOpacity={0.85}
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
  container: { flex: 1, backgroundColor: "#d4cea6-" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: Platform.OS === "ios" ? 10 : 40,
    paddingBottom: 30,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
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
    backgroundColor: "rgba(255,255,255,0.18)",
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
    backgroundColor: "#FBEEDB",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,175,55,0.25)",
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFFDF6",
    borderWidth: 1.5,
    borderColor: "rgba(212,175,55,0.5)",
  },
  chipActive: { backgroundColor: "#93210A", borderColor: "#93210A" },
  chipText: { fontSize: 13, fontWeight: "700", color: "#93210A" },
  chipTextActive: { color: "#fff" },

  /* Empty */
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyIconWrap: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: "#FFF0EE",
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  emptyText: { marginTop: 16, color: "#93210A", fontSize: 16, fontWeight: "700", textAlign: "center" },
  emptyTextTablet: { fontSize: 18, marginTop: 20 },

  /* List */
  listContainer: { flexGrow: 1 },

  /* Card */
  card: {
    backgroundColor: "#FFFDF6",
    borderRadius: 14, padding: 12,
    elevation: 4,
    shadowColor: "#000", shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 5,
    borderWidth: 1, borderColor: "rgba(212,175,55,0.35)",
  },
  cardTablet: {
    borderRadius: 18, padding: 16, elevation: 5,
    shadowOpacity: 0.16, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
  },
  cardContentRow: { flexDirection: "row", alignItems: "flex-start" },

  imageContainer: {
    marginRight: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D4AF37",
    overflow: "hidden",
  },
  imageContainerTablet: { marginRight: 16, borderRadius: 14 },
  image: { width: 100, height: 100, backgroundColor: "#f0f0f0" },
  imageTablet: { width: 140, height: 140 },

  detailsContainer: { flex: 1, flexDirection: "column", justifyContent: "space-between", minHeight: 100 },
  detailsContainerTablet: { minHeight: 140 },

  title: { fontSize: 14, fontWeight: "700", color: "#93210A", marginBottom: 4, lineHeight: 20 },
  titleTablet: { fontSize: 15, marginBottom: 6, lineHeight: 22 },

  localAreaRow: { flexDirection: "row", alignItems: "flex-start", gap: 4, marginBottom: 6 },
  localArea: { flex: 1, fontSize: 13, color: "#6b5a4a", lineHeight: 18 },
  localAreaTablet: { fontSize: 14, lineHeight: 20 },

  actionsRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#93210A", paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 8, elevation: 2,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  callButtonTablet: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  callButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  mapButton: {
    backgroundColor: "#FBEEDB",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    padding: 8, borderRadius: 8,
    width: 36, height: 36, alignItems: "center", justifyContent: "center",
    elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 2,
  },
  mapButtonTablet: { width: 44, height: 44, borderRadius: 10 },
});