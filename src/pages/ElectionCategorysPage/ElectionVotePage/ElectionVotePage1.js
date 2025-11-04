import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import {
  fetchAllElections,
  fetchAllVideos,
  fetchElectionBannerData,
} from "../../../Controller/ElectionVotePageController/ElectionVotePageController";

const { width } = Dimensions.get("window");

const DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
  "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
  "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
  "Ramanathapuram", "Ranipet", "Salem", "Sivagangai", "Tenkasi", "Thanjavur", "Theni",
  "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur",
  "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar",
];

export default function ElectionVotePage1({ navigation }) {
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [mainVideoUrl, setMainVideoUrl] = useState(null);
  const [searchDistrict, setSearchDistrict] = useState("Coimbatore");
  const [showDropdown, setShowDropdown] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);

  const bannerRef = useRef(null);
  const bannerIndex = useRef(0);

  // ✅ Fetch Elections
  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await fetchAllElections();
        setElections(data);
        const defaultFiltered = data.filter(
          (item) =>
            item.district &&
            item.district.toLowerCase() === "coimbatore".toLowerCase()
        );
        setFilteredElections(defaultFiltered);
      } catch (error) {
        console.error("Error loading elections:", error);
      } finally {
        setLoading(false);
      }
    };
    loadElections();
  }, []);

  // ✅ Fetch Videos
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await fetchAllVideos();
        setVideos(data);
        if (data.length > 0) setMainVideoUrl(data[0].videoUrl);
      } catch (error) {
        console.error("Error loading videos:", error);
      }
    };
    loadVideos();
  }, []);

  // ✅ Fetch Banner Images
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const imgs = await fetchElectionBannerData();
        setBannerImages(imgs);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };
    loadBanners();
  }, []);

  // ✅ Auto-scroll banners
  useEffect(() => {
    if (bannerImages.length > 0) {
      const interval = setInterval(() => {
        bannerIndex.current =
          bannerIndex.current < bannerImages.length - 1
            ? bannerIndex.current + 1
            : 0;
        bannerRef.current?.scrollToIndex({
          index: bannerIndex.current,
          animated: true,
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [bannerImages]);

  // ✅ Filter elections by district
  useEffect(() => {
    if (searchDistrict.trim() === "") {
      setFilteredElections(elections);
    } else {
      const filtered = elections.filter((item) =>
        item.district?.toLowerCase().includes(searchDistrict.toLowerCase())
      );
      setFilteredElections(filtered);
    }
  }, [searchDistrict, elections]);

  const renderBanner = ({ item }) => (
    <Image source={{ uri: item }} style={styles.banner} resizeMode="cover" />
  );

  const getYouTubeEmbedUrl = (url) => {
    if (url.includes("list=") && url.includes("v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      const listId = url.split("list=")[1]?.split("&")[0];
      return  `https://www.youtube.com/embed/${videoId}?list=${listId}&autoplay=0`;
    } else if (url.includes("v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=0`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=0`;
    }
    return url;
  };

  const filteredDistricts = DISTRICTS.filter((d) =>
    d.toLowerCase().includes(searchDistrict.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Election 2026</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 🔹 Banner */}
        {bannerImages.length > 0 ? (
          <FlatList
            data={bannerImages}
            renderItem={renderBanner}
            horizontal
            pagingEnabled
            ref={bannerRef}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <ActivityIndicator size="large" color="#8B1C0D" style={{ marginVertical: 20 }} />
        )}

        {/* 🔹 District Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBoxTouchable}>
            <TextInput
              style={styles.searchBox}
              placeholder="Search District..."
              value={searchDistrict}
              onFocus={() => setShowDropdown(true)}
              onChangeText={(text) => {
                setSearchDistrict(text);
                setShowDropdown(true);
              }}
            />
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              style={{ position: "absolute", right: 10, top: 8, padding: 5 }}
            >
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          {showDropdown && (
            <View style={styles.dropdownContainer}>
              <ScrollView style={styles.dropdownScroll}>
                {filteredDistricts.length > 0 ? (
                  filteredDistricts.map((district, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSearchDistrict(district);
                        setShowDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{district}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ textAlign: "center", padding: 10, color: "#666" }}>
                    No district found
                  </Text>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* 🔹 Candidates Section */}
        <View style={styles.candidatesTitleContainer}>
          <Text style={styles.candidatesTitle}>Candidates</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#8B1C0D" style={{ marginTop: 40 }} />
        ) : filteredElections.length > 0 ? (
          <View style={styles.candidatesCardContainer}>
            {filteredElections.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => navigation.navigate("ElectionVotePage2", { id: item.id })}
              >
                <Image source={{ uri: item.image }} style={styles.candidateImg} />
                <Text style={styles.candidateName}>{item.name}</Text>
                <Text style={styles.candidatePlace}>({item.district})</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.noData}>No candidates found for this district.</Text>
        )}

        {/* 🔹 HDRSS Video */}
        <Text style={styles.videoTitle}>HDRSS Video</Text>
        {mainVideoUrl ? (
          <View style={styles.videoPlayerContainer}>
            <WebView
              source={{ uri: getYouTubeEmbedUrl(mainVideoUrl) }}
              style={styles.videoPlayer}
              allowsFullscreenVideo
            />
          </View>
        ) : (
          <ActivityIndicator size="small" color="#8B1C0D" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  banner: { width: width, height: 170, borderRadius: 5 },
  searchContainer: { marginVertical: 20, alignItems: "center", width: "100%" },
  searchBoxTouchable: { width: "90%", position: "relative" },
  searchBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 5,
    elevation: 6,
  },
  dropdownScroll: { maxHeight: 250 },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownText: { fontSize: 15, color: "#333" },
  candidatesTitleContainer: {
    marginTop: 10,
    alignSelf: "flex-start",
    marginLeft: 10,
    backgroundColor: "#8B1C0D",
    borderTopRightRadius: 59,
    borderBottomRightRadius: 59,
    paddingHorizontal: 25,
    paddingVertical: 6,
  },
  candidatesTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  candidatesCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 19,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    margin: 10,
    alignItems: "center",
    paddingVertical: 10,
    width: "40%",
  },
  candidateImg: {
    width: 123,
    height: 123,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#8B1C0D",
  },
  candidateName: { fontSize: 12, fontWeight: "bold", textAlign: "center" },
  candidatePlace: { fontSize: 11, color: "#666", textAlign: "center" },
  videoTitle: {
    color: "#8B1C0D",
    fontSize: 19,
    fontWeight: "bold",
    marginVertical: 16,
    marginLeft: 20,
  },
  videoPlayerContainer: { width: "100%", height: 220, marginTop: 10 },
  videoPlayer: { flex: 1 },
  noData: { textAlign: "center", marginVertical: 10, fontSize: 14, color: "#888" },
});