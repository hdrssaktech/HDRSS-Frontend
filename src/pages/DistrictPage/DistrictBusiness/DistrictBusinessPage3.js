import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  FlatList,
  Linking,
  TextInput,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import Loader from "../../../components/Alert/Loader";

const { width: screenWidth } = Dimensions.get("window");

/* ================= DEFAULT ADS ================= */
const DEFAULT_AD_IMAGES = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
];

export default function DistrictBusinessPage3({ route, navigation }) {
  const { businessDetailsId, districtId = 16 } = route.params || {};

  const [details, setDetails] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [ads, setAds] = useState(DEFAULT_AD_IMAGES);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef(null);
  const adIndex = useRef(0);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchDetails();
    fetchAds();
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(
        `https://hdrss-backend.onrender.com/api/business/details/${businessDetailsId}`
      );
      setDetails(res.data.data || []);
      setFilteredData(res.data.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await axios.get(
        `https://hdrss-backend.onrender.com/api/district-business-ads/filter?districtId=${districtId}&pageLevel=4&entityId=${businessDetailsId}`
      );
      if (res.data?.[0]?.adImages?.length) {
        setAds(res.data[0].adImages);
      }
    } catch {}
  };

  /* ================= SEARCH ================= */
  const handleSearch = (text) => {
    setSearch(text);
    if (!text) {
      setFilteredData(details);
    } else {
      const filtered = details.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  /* ================= CONTACT ================= */
  const callNow = (num) => Linking.openURL(`tel:${num}`);
  const whatsappNow = (num) => Linking.openURL(`https://wa.me/${num}`);
  const openMap = (url) => Linking.openURL(url);

  /* ================= ADS AUTO SCROLL ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      adIndex.current =
        adIndex.current === ads.length - 1 ? 0 : adIndex.current + 1;
      flatListRef.current?.scrollToIndex({
        index: adIndex.current,
        animated: true,
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [ads]);

  /* ================= CARD ================= */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DistrictBusinessPage4", { item })
      }
    >
      <Image source={{ uri: item.imageUrl }} style={styles.leftImage} />

      <View style={styles.rightContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.category}</Text>

        {/* {item.location && (
          <Text style={styles.locationText}>📍 {item.location}</Text>
        )} */}

        <View style={styles.iconRow}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: "#E3F2FD" }]}
            onPress={() => callNow(item.phoneNo)}
          >
            <Icon name="call" size={20} color="#005BBB" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: "#E7F9EF" }]}
            onPress={() => whatsappNow(item.whatsappNo || item.phoneNo)}
          >
            <Icon name="logo-whatsapp" size={20} color="#25D366" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: "#FFE6D5" }]}
            onPress={() => openMap(item.mapUrl)}
          >
            <Icon name="location" size={20} color="#FF5722" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#93210A" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Business List</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ADS */}
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={ads}
        keyExtractor={(i, k) => k.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.adImage} />
        )}
      />

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Icon name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search business name..."
          value={search}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.noData}>No business found</Text>
        }
      />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  appBar: {
    height: 90,
    paddingTop: Platform.OS === "ios" ? 40 : 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#93210A",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  appBarTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  adImage: {
    width: screenWidth,
    height: "100%",
    resizeMode: "cover",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 15,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    elevation: 4,
  },
  leftImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  rightContent: {
    flex: 1,
    paddingLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  locationText: {
    fontSize: 13,
    color: "#444",
    marginVertical: 4,
  },

  iconRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  noData: {
    textAlign: "center",
    color: "#888",
    marginTop: 50,
    fontSize: 16,
  },
});

