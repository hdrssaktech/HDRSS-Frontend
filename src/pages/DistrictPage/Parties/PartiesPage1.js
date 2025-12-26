import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// 🔹 Breakpoints
const isTablet = width >= 600;

const PartiesPage1 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtId } = route.params;

  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Mobile: 2 | Tablet: 3
  const numColumns = useMemo(() => (isTablet ? 2 : 2), []);

  // ✅ Dynamic card width
  const itemWidth = useMemo(() => {
    const horizontalPadding = isTablet ? 80 : 30;
    const spacing = isTablet ? 20 : 15;
    const totalSpacing = (numColumns - 1) * spacing;

    return (width - horizontalPadding * 2 - totalSpacing) / numColumns;
  }, [numColumns]);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await fetch(
          `https://hdrss-backend.onrender.com/api/party/categories/district/${districtId}`
        );
        const data = await response.json();
        // console.log("✅ Parties API Response:", data);

        if (Array.isArray(data)) {
          setParties(data);
        } else if (data && typeof data === "object" && !data.message) {
          setParties([data]);
        } else {
          setParties([]);
        }
      } catch (error) {
        console.log("❌ Error fetching parties:", error);
        setParties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, [districtId]);

  const renderPartyCard = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
        isTablet && styles.cardTablet,
        { width: itemWidth },
      ]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("Partiespage2", { partyId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              item.image ||
              "https://via.placeholder.com/400x250/93210A/FFFFFF?text=No+Image",
          }}
          style={[styles.image, isTablet && styles.imageTablet]}
        />
        <View style={styles.overlay} />
        <View style={styles.badge}>
          {/* <Text style={styles.badgeText}>{index + 1}</Text> */}
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text
          style={[styles.title, isTablet && styles.titleTablet]}
          numberOfLines={2}
        >
          {item.name || "Unnamed Party"}
        </Text>

        {/* <View style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color="#93210A"
            style={{ marginTop: 2 }}
          />
        </View> */}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#93210A" />
        <Text style={styles.loadingText}>Loading parties...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isTablet && styles.containerTablet]}>
      {/* 🔹 Header */}
      <View style={[styles.headerBox, isTablet && styles.headerBoxTablet]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={isTablet ? 32 : 26} color="#fff" />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}
        >
          Parties 
        </Text>
      </View>

      {/* 🔹 List */}
      <FlatList
        data={parties}
        key={numColumns} // 🔥 important
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }
        renderItem={renderPartyCard}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
        contentContainerStyle={[
          styles.listContainer,
          isTablet && styles.listContainerTablet,
        ]}
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </View>
  );
};

export default PartiesPage1;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF7F7",
  },
  containerTablet: {
    backgroundColor: "#F8F9FA",
  },

  // 🔹 Header
  headerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
   
  },
  headerBoxTablet: {
    paddingTop: 60,
    paddingBottom: 26,
    paddingHorizontal: 40,
   
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginRight: 30,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerTitleTablet: {
    fontSize: 29,
  },

  // 🔹 Loader
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#93210A",
    fontSize: 16,
    fontWeight: "500",
  },

  // 🔹 Grid
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  listContainerTablet: {
    paddingHorizontal: 40,
    paddingTop: 30,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },

  // 🔹 Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    marginBottom: 15,
  },
  cardTablet: {
    borderRadius: 20,
    elevation: 8,
  },

  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 170,
    resizeMode: "cover",
  },
  imageTablet: {
    height: 270,
  },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(147,33,10,0.1)",
  // },
  // badge: {
  //   position: "absolute",
  //   top: 12,
  //   left: 12,
  //   width: 30,
  //   height: 30,
  //   borderRadius: 15,
  //   backgroundColor: "#93210A",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  // badgeText: {
  //   color: "#fff",
  //   fontWeight: "bold",
  // },

  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c10404ff",
    textAlign: "center",
    marginBottom: 6,
  },
  titleTablet: {
    fontSize: 18,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  descriptionTablet: {
    fontSize: 15,
  },

  viewButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewButtonText: {
    color: "#93210A",
    fontWeight: "600",
    marginRight: 6,
  },
});


