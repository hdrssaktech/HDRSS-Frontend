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

const DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
  "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
  "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
  "Ramanathapuram", "Ranipet", "Salem", "Sivagangai", "Tenkasi", "Thanjavur", "Theni",
  "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur",
  "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar",
];

export default function ElectionVotePage1({ navigation }) {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  const isTablet = screenWidth >= 600;

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

  // 🔹 Listen to orientation change (Mobile ↔ Tablet)
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // 🔹 Fetch Elections
  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await fetchAllElections();
        setElections(data);
        setFilteredElections(
          data.filter(
            (item) =>
              item.district?.toLowerCase() === "coimbatore"
          )
        );
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    loadElections();
  }, []);

  // 🔹 Fetch Videos
  useEffect(() => {
    const loadVideos = async () => {
      const data = await fetchAllVideos();
      setVideos(data);
      if (data?.length) setMainVideoUrl(data[0].videoUrl);
    };
    loadVideos();
  }, []);

  // 🔹 Fetch Banners
  useEffect(() => {
    const loadBanners = async () => {
      const imgs = await fetchElectionBannerData();
      setBannerImages(imgs);
    };
    loadBanners();
  }, []);

  // 🔹 Auto banner scroll
  useEffect(() => {
    if (!bannerImages.length) return;
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
  }, [bannerImages]);

  // 🔹 Filter by district
  useEffect(() => {
    setFilteredElections(
      elections.filter((item) =>
        item.district
          ?.toLowerCase()
          .includes(searchDistrict.toLowerCase())
      )
    );
  }, [searchDistrict, elections]);

  const renderBanner = ({ item }) => (
    <Image source={{ uri: item }} style={[
      styles.banner,
      isTablet && styles.tabletBanner
    ]} />
  );

  const getYouTubeEmbedUrl = (url) => {
    if (url.includes("v=")) {
      const id = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const filteredDistricts = DISTRICTS.filter((d) =>
    d.toLowerCase().includes(searchDistrict.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={[styles.header, isTablet && styles.tabletHeader]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={isTablet ? 32 : 24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isTablet && styles.tabletHeaderTitle]}>
          Election 2026
        </Text>
      </View>

      <ScrollView contentContainerStyle={[
        styles.scrollContent,
        isTablet && styles.tabletScrollContent
      ]}>
        {/* 🔹 Banner */}
        {bannerImages.length ? (
          <FlatList
            data={bannerImages}
            renderItem={renderBanner}
            horizontal
            pagingEnabled
            ref={bannerRef}
            keyExtractor={(_, i) => i.toString()}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        )}

        {/* 🔹 District Search */}
        <View style={[styles.searchContainer, isTablet && styles.tabletSearchContainer]}>
          <View style={[styles.searchBoxTouchable, isTablet && styles.tabletSearchBoxTouchable]}>
            <TextInput
              style={[styles.searchBox, isTablet && styles.tabletSearchBox]}
              value={searchDistrict}
              onChangeText={(text) => {
                setSearchDistrict(text);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search District..."
              placeholderTextColor="#666"
            />
            <Ionicons
              name={showDropdown ? "chevron-up" : "chevron-down"}
              size={isTablet ? 28 : 20}
              style={[styles.dropIcon, isTablet && styles.tabletDropIcon]}
            />
          </View>

          {showDropdown && (
            <View style={[styles.dropdownContainer, isTablet && styles.tabletDropdownContainer]}>
              <ScrollView style={isTablet && { maxHeight: 250 }}>
                {filteredDistricts.map((district, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dropdownItem, isTablet && styles.tabletDropdownItem]}
                    onPress={() => {
                      setSearchDistrict(district);
                      setShowDropdown(false);
                    }}
                  >
                    <Text style={isTablet && { fontSize: 18 }}>{district}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* 🔹 Candidates */}
        <View style={[styles.candidatesTitleContainer, isTablet && styles.tabletCandidatesTitleContainer]}>
          <Text style={[styles.candidatesTitle, isTablet && styles.tabletCandidatesTitle]}>
            Candidates
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : (
          <View style={[styles.candidatesCardContainer, isTablet && styles.tabletCandidatesCardContainer]}>
            {filteredElections.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  isTablet && styles.tabletCard,
                  { width: isTablet ? "30%" : "40%" }
                ]}
                onPress={() =>
                  navigation.navigate("ElectionVotePage2", { id: item.id })
                }
              >
                <Image 
                  source={{ uri: item.image }} 
                  style={[styles.candidateImg, isTablet && styles.tabletCandidateImg]} 
                />
                <Text style={[styles.candidateName, isTablet && styles.tabletCandidateName]}>
                  {item.name}
                </Text>
                <Text style={[styles.candidatePlace, isTablet && styles.tabletCandidatePlace]}>
                  ({item.district})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 🔹 Video */}
        <Text style={[styles.videoTitle, isTablet && styles.tabletVideoTitle]}>
          HDRSS Video
        </Text>
        {mainVideoUrl && (
          <View style={[styles.videoPlayerContainer, isTablet && styles.tabletVideoPlayerContainer]}>
            <WebView
              source={{ uri: getYouTubeEmbedUrl(mainVideoUrl) }}
              allowsFullscreenVideo
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES FOR BOTH TABLET & MOBILE ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // ========== MOBILE STYLES ==========
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  headerTitle: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold", 
    marginLeft: 10, 
   left:55,
  },

  // Banner
  banner: { 
    width: Dimensions.get("window").width, 
    height: 170 
  },

  // Search
  searchContainer: { 
    marginVertical: 20, 
    alignItems: "center" 
  },
  searchBoxTouchable: { 
    width: "90%" 
  },
  searchBox: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  dropIcon: { 
    position: "absolute", 
    right: 10, 
    top: 10 
  },
  dropdownContainer: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 200,
  },
  dropdownItem: { 
    padding: 12 
  },

  // Candidates Title
  candidatesTitleContainer: {
    backgroundColor: "#8B1C0D",
    paddingHorizontal: 25,
    paddingVertical: 6,
    marginLeft: 10,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  candidatesTitle: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
  },

  // Candidates Cards
  candidatesCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
    alignItems: "center",
    paddingVertical: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  candidateImg: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#8B1C0D",
    marginBottom: 10,
  },
  candidateName: { 
    fontSize: 12, 
    fontWeight: "bold", 
    textAlign: "center",
    marginHorizontal: 5,
  },
  candidatePlace: { 
    fontSize: 11, 
    color: "#666",
    marginTop: 2,
  },

  // Video
  videoTitle: {
    color: "#8B1C0D",
    fontSize: 19,
    fontWeight: "bold",
    marginVertical: 16,
    marginLeft: 20,
  },
  videoPlayerContainer: { 
    width: "100%", 
    height: 220,
    marginBottom: 20,
  },
  
  scrollContent: {
    paddingBottom: 40,
  },

  // ========== TABLET STYLES ==========
  
  tabletHeader: {
    padding: 20,
    marginTop: -5,
  },
  tabletHeaderTitle: {
    fontSize: 26,
    marginLeft: 15,
    left:170,
    padding:20,
   
  },
  
  tabletBanner: {
    height: 250,
  },
  
  tabletSearchContainer: {
    marginVertical: 30,
  },
  tabletSearchBoxTouchable: {
    width: "70%",
  },
  tabletSearchBox: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 18,
  },
  tabletDropIcon: {
    right: 15,
    top: 15,
  },
  tabletDropdownContainer: {
    width: "70%",
    borderRadius: 15,
  },
  tabletDropdownItem: {
    padding: 15,
  },
  
  tabletCandidatesTitleContainer: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginLeft: 20,
    marginTop: 20,
  },
  tabletCandidatesTitle: {
    fontSize: 22,
  },
  
  tabletCandidatesCardContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  tabletCard: {
    paddingVertical: 15,
    margin: 15,
    borderRadius: 16,
    elevation: 6,
  },
  tabletCandidateImg: {
    width: 160,
    height: 160,
    borderWidth: 3,
    marginBottom: 15,
  },
  tabletCandidateName: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  tabletCandidatePlace: {
    fontSize: 14,
    marginTop: 4,
  },
  
  tabletVideoTitle: {
    fontSize: 24,
    marginVertical: 20,
    marginLeft: 30,
  },
  tabletVideoPlayerContainer: {
    height: 370,
    marginHorizontal: 1,
    marginBottom: 30,
    borderRadius: 10,
    overflow: 'hidden',
  },
  
  tabletScrollContent: {
    paddingBottom: 50,
  },
});