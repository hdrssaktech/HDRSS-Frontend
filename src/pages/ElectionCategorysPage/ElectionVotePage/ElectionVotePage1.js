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
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { WebView } from "react-native-webview";
import {
  fetchAllElections,
  fetchAllVideos,
  fetchVideoReviews,
  postVideoReview,
} from "../../../Controller/ElectionVotePageController/ElectionVotePageController";
import { fetchElectionBannerData } from "../../../Controller/ElectionVotePageController/ElectionVotePageController";

const { width } = Dimensions.get("window");

export default function ElectionVotePage1({ navigation }) {
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoDbId, setSelectedVideoDbId] = useState(null);
  const [mainVideoId, setMainVideoId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [rating, setRating] = useState(0);
  const [showAllComments, setShowAllComments] = useState(false);
  const [districtModalVisible, setDistrictModalVisible] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [bannerImages, setBannerImages] = useState([]);
  const bannerRef = useRef(null);
  const scrollViewRef = useRef(null);
  const bannerIndex = useRef(0);

  const districts = [
    "None", "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Ranipet", "Salem", "Sivagangai", "Tenkasi", "Thanjavur",
    "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur",
    "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Viluppuram", "Virudhunagar",
  ];

  // ✅ Fetch Elections
  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await fetchAllElections();
        setElections(data);
        setFilteredElections(data);
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
        if (data.length > 0) setMainVideoId(data[0].videoUrl.split("=")[1]);
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

  // ✅ Auto-scroll banners (using FlatList)
  useEffect(() => {
    if (bannerImages.length > 0) {
      const interval = setInterval(() => {
        bannerIndex.current =
          bannerIndex.current < bannerImages.length - 1 ? bannerIndex.current + 1 : 0;
        bannerRef.current?.scrollToIndex({
          index: bannerIndex.current,
          animated: true,
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [bannerImages]);

  // ✅ Auto-scroll more videos
  useEffect(() => {
    if (videos.length > 0 && scrollViewRef.current) {
      let xOffset = 0;
      const scrollInterval = setInterval(() => {
        xOffset += 220;
        scrollViewRef.current.scrollTo({ x: xOffset, animated: true });
        if (xOffset > videos.length * 220) xOffset = 0;
      }, 3000);
      return () => clearInterval(scrollInterval);
    }
  }, [videos]);

  // ✅ Handle video selection
  const handleVideoPress = async (id, url) => {
    setSelectedVideoId(url.split("=")[1]);
    setSelectedVideoDbId(id);
    try {
      const res = await fetchVideoReviews(id);
      setReviews(res);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // ✅ Submit review
  const handleSubmitComment = async () => {
    if (!commentInput.trim() || rating === 0) {
      alert("Please enter both comment and rating");
      return;
    }
    try {
      await postVideoReview(selectedVideoDbId, commentInput, rating);
      alert("Comment added successfully!");
      setCommentInput("");
      setRating(0);
      setReviewModalVisible(false);
      const updated = await fetchVideoReviews(selectedVideoDbId);
      setReviews(updated);
    } catch (err) {
      console.error("Failed posting review:", err);
      alert("Failed to submit review.");
    }
  };

  // ✅ Filter by district
  const handleDistrictSelect = (district) => {
    setDistrictModalVisible(false);
    setSearchDistrict("");
    if (district === "None") {
      setSelectedDistrict("");
      setFilteredElections(elections);
    } else {
      setSelectedDistrict(district);
      const filtered = elections.filter(
        (item) => item.district.toLowerCase() === district.toLowerCase()
      );
      setFilteredElections(filtered);
    }
  };

  const filteredDistricts = districts.filter((d) =>
    d.toLowerCase().includes(searchDistrict.toLowerCase())
  );

  const displayedReviews = showAllComments ? reviews : reviews.slice(0, 3);

  const renderBanner = ({ item }) => (
    <Image source={{ uri: item }} style={styles.banner} resizeMode="cover" />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Election 2026</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ✅ Auto-scroll Banner */}
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

        {/* ... The rest of your code remains exactly the same ... */}


        {/* District Dropdown */}
        <View style={styles.dropdownRow}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDistrictModalVisible(true)}
          >
            <Text style={styles.dropdownText}>
              {selectedDistrict || "Select District"}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Candidates */}
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

        {/* 🎬 Main Video */}
        <Text style={styles.videoTitle}>HDRSS Video</Text>
        {mainVideoId ? (
          <View style={styles.videoPlayerContainer}>
            <WebView
              source={{ uri: `https://www.youtube.com/embed/${mainVideoId}?autoplay=0` }}
              style={styles.videoPlayer}
              allowsFullscreenVideo
            />
          </View>
        ) : (
          <ActivityIndicator size="small" color="#8B1C0D" />
        )}

        {/* 🎞️ More Videos */}
        <Text style={styles.videoTitle}>Public Videos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
        >
          {videos.length > 0 ? (
            videos.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleVideoPress(item.id, item.videoUrl)}
                style={styles.videoCard}
              >
                <Image
                  source={{
                    uri: `https://i.ytimg.com/vi/${item.videoUrl.split("=")[1]}/hq720.jpg`,
                  }}
                  style={styles.smallVideoThumb}
                />
                <Text style={styles.videoText}>{item.title}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <ActivityIndicator size="small" color="#8B1C0D" />
          )}
        </ScrollView>

        {/* Inline Selected Video */}
        {selectedVideoId && (
          <View style={styles.videoPlayerContainer}>
            <WebView
              source={{
                uri: `https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`,
              }}
              style={styles.videoPlayer}
              allowsFullscreenVideo
            />
          </View>
        )}

        {/* Reviews Section */}
        {selectedVideoId && (
          <>
            <TouchableOpacity
              style={styles.addCommentBtn}
              onPress={() => setReviewModalVisible(true)}
            >
              <Text style={styles.addCommentText}>+ Add Comment</Text>
            </TouchableOpacity>

            <Text style={styles.videoTitle}>Comments & Ratings</Text>

            {displayedReviews.length > 0 ? (
              displayedReviews.map((rev) => (
                <View key={rev.id} style={styles.reviewCard}>
                  <Text style={styles.commentText}>{rev.comment}</Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Text
                        key={star}
                        style={{
                          fontSize: 18,
                          color: star <= rev.rating ? "#FFD700" : "#ccc",
                        }}
                      >
                        ★
                      </Text>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noData}>No reviews yet</Text>
            )}

            {reviews.length > 3 && (
              <TouchableOpacity
                onPress={() => setShowAllComments(!showAllComments)}
                style={styles.viewAllBtn}
              >
                <Text style={styles.viewAllText}>
                  {showAllComments ? "Show Less" : "View All Comments"}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      {/* 📝 Add Comment Modal */}
      <Modal visible={reviewModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.commentBox}>
            <Text style={styles.modalTitle}>Add Comment</Text>
            <TextInput
              placeholder="Write your comment..."
              value={commentInput}
              onChangeText={setCommentInput}
              style={styles.inputBox}
              multiline
            />
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text
                    style={{
                      fontSize: 30,
                      color: star <= rating ? "#FFD700" : "#ccc",
                    }}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitComment}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  dropdownRow: { flexDirection: "row", justifyContent: "center", marginVertical: 22 },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 17,
    backgroundColor: "#fff",
    width: "90%",
  },
  dropdownText: { fontSize: 13, color: "#333" },
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
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
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
  videoCard: { alignItems: "center", marginHorizontal: 10 },
  smallVideoThumb: { width: 160, height: 90, borderRadius: 8 },
  videoText: { fontSize: 12, color: "#333", marginTop: 5, textAlign: "center" },
  videoPlayerContainer: { width: "100%", height: 220, marginTop: 10 },
  videoPlayer: { flex: 1 },
  addCommentBtn: {
    backgroundColor: "#8B1C0D",
    alignSelf: "center",
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 20,
  },
  addCommentText: { color: "#fff", fontWeight: "bold" },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  commentText: { fontSize: 14, color: "#333" },
  noData: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "#888",
  },
  viewAllBtn: {
    alignSelf: "center",
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#8B1C0D",
  },
  viewAllText: {
    color: "#8B1C0D",
    fontWeight: "bold",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  commentBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B1C0D",
    marginBottom: 12,
    textAlign: "center",
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    height: 90,
    textAlignVertical: "top",
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  submitBtn: {
    backgroundColor: "#8B1C0D",
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
