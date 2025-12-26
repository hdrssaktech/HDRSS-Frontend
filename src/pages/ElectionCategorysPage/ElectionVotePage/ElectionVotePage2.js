import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";
import {
  fetchElectionById,
  postVideoReview,
} from "../../../Controller/ElectionVotePageController/ElectionVotePageController";

const { width } = Dimensions.get("window");

export default function ElectionVotePage2({ route, navigation }) {
  const { id } = route.params;
  const [screenWidth, setScreenWidth] = useState(width);
  const isTablet = screenWidth >= 600;
  
  const [election, setElection] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Listen to orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    loadElection();
  }, [id]);

  const loadElection = async () => {
    try {
      setLoading(true);
      const data = await fetchElectionById(id);
      setElection(data);
    } catch (error) {
      console.error("Error loading election:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:.*v=|v\/|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const handleSubmitReview = async () => {
    if (!comment || rating === 0) {
      Alert.alert("Please fill all fields and select a rating");
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        electionId: id.toString(),
        comment,
        rating: rating.toString(),
      };

      await postVideoReview(reviewData);
      Alert.alert("Success", "Review submitted successfully!");
      setShowModal(false);
      setComment("");
      setRating(0);
      loadElection(); // refresh reviews
    } catch (error) {
      Alert.alert("Error", "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#8B1C0D" />
      </View>
    );
  }

  if (!election) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 40 }}>No data found</Text>
      </View>
    );
  }

  const videoId = getYouTubeId(election.video);
  const isYouTube =
    election.video &&
    (election.video.includes("youtube.com") ||
      election.video.includes("youtu.be"));

    // ✅ Prevent crash if election or VideoReviews is null
  if (!election || !Array.isArray(election.VideoReviews)) {
    return (
      <Text style={{ textAlign: "center", color: "#777" }}>
        No reviews yet.
      </Text>
    );
  }

  const reviews = election.VideoReviews;
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={[styles.header, isTablet && styles.tabletHeader]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={isTablet ? 32 : 26} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerText, isTablet && styles.tabletHeaderText]}>
          {election.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={[
        styles.scrollContent,
        isTablet && styles.tabletScrollContent
      ]}>
        {/* 🖼️ Full-width Banner Image */}
        {election.image && (
          <Image 
            source={{ uri: election.image }} 
            style={[styles.fullImage, isTablet && styles.tabletFullImage]} 
          />
        )}

        {/* 🏷️ Title */}
        {election.title && (
          <View style={[styles.section, isTablet && styles.tabletSection]}>
            <Text style={[styles.sectionTitle, isTablet && styles.tabletSectionTitle]}>
              Title
            </Text>
            <Text style={[styles.sectionText, isTablet && styles.tabletSectionText]}>
              {election.title}
            </Text>
          </View>
        )}

        {/* 📍 District */}
        {election.district && (
          <View style={[styles.section, isTablet && styles.tabletSection]}>
            <Text style={[styles.sectionTitle, isTablet && styles.tabletSectionTitle]}>
              District
            </Text>
            <Text style={[styles.sectionText, isTablet && styles.tabletSectionText]}>
              {election.district}
            </Text>
          </View>
        )}

        {/* 📝 About */}
        {election.about && (
          <View style={[styles.section, isTablet && styles.tabletSection]}>
            <Text style={[styles.sectionTitle, isTablet && styles.tabletSectionTitle]}>
              About
            </Text>
            <Text style={[styles.sectionText, isTablet && styles.tabletSectionText]}>
              {election.about}
            </Text>
          </View>
        )}

        {/* 🖼️ Gallery */}
        {election.gallery && election.gallery.length > 0 && (
          <View style={[styles.section, isTablet && styles.tabletSection]}>
            <Text style={[styles.sectionTitle, isTablet && styles.tabletSectionTitle]}>
              Gallery
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={isTablet && styles.tabletGalleryScroll}
            >
              {election.gallery
                .filter((g) => g)
                .map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={[styles.galleryImage, isTablet && styles.tabletGalleryImage]}
                  />
                ))}
            </ScrollView>
          </View>
        )}

        {/* 🎥 Full-width Video Section */}
        {election.video && (
          <View style={[styles.videoSection, isTablet && styles.tabletVideoSection]}>
            <Text style={[styles.sectionTitle, isTablet && styles.tabletSectionTitle]}>
              HDRSS Video
            </Text>
            {isYouTube && videoId ? (
              <YoutubePlayer
                height={isTablet ? 350 : 230}
                width={screenWidth}
                play={false}
                videoId={videoId}
              />
            ) : (
              <Video
                source={{ uri: election.video }}
                style={[styles.fullVideo, isTablet && styles.tabletFullVideo]}
                useNativeControls
                resizeMode="contain"
              />
            )}
          </View>
        )}

        {/* 💬 Reviews */}
        <View style={[styles.section, isTablet && styles.tabletSection]}>
          <Text style={[styles.sectionTitle, isTablet && styles.tabletSectionTitle]}>
            Reviews
          </Text>
          
          {reviews.length > 0 ? (
            <>
              {visibleReviews.map((rev) => (
                <View key={rev.id} style={[styles.reviewCard, isTablet && styles.tabletReviewCard]}>
                  <View style={[styles.starContainer, isTablet && styles.tabletStarContainer]}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= rev.rating ? "star" : "star-outline"}
                        size={isTablet ? 24 : 18}
                        color="#f4c430"
                      />
                    ))}
                  </View>
                  <Text style={[styles.comment, isTablet && styles.tabletComment]}>
                    {rev.comment}
                  </Text>
                </View>
              ))}

              {/* 👇 Show 'See all' / 'See less' button only if more than 3 reviews */}
              {reviews.length > 3 && (
                <TouchableOpacity 
                  onPress={() => setShowAll(!showAll)}
                  style={isTablet && styles.tabletSeeAllButton}
                >
                  <Text style={[
                    styles.seeAllButton,
                    isTablet && styles.tabletSeeAllButtonText
                  ]}>
                    {showAll ? "See less comments" : "See all comments"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={[
              styles.noReviewsText,
              isTablet && styles.tabletNoReviewsText
            ]}>
              No reviews yet.
            </Text>
          )}

          {/* 📝 Add Review Button */}
          <TouchableOpacity
            style={[styles.reviewButton, isTablet && styles.tabletReviewButton]}
            onPress={() => setShowModal(true)}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={isTablet ? 22 : 18}
              color="#fff"
            />
            <Text style={[styles.reviewButtonText, isTablet && styles.tabletReviewButtonText]}>
              Write your Reviews
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🌟 Review Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isTablet && styles.tabletModalContainer]}>
            <Text style={[styles.modalTitle, isTablet && styles.tabletModalTitle]}>
              Write Review
            </Text>

            <TextInput
              style={[
                styles.input, 
                isTablet && styles.tabletInput,
                { height: isTablet ? 100 : 80 }
              ]}
              placeholder="Your Comment"
              value={comment}
              multiline
              onChangeText={setComment}
            />

            {/* ⭐ Star Rating */}
            <View style={[styles.modalStarContainer, isTablet && styles.tabletModalStarContainer]}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={isTablet ? 32 : 26}
                    color="#f4c430"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isTablet && styles.tabletSubmitButton]}
              onPress={handleSubmitReview}
              disabled={submitting}
            >
              <Text style={[styles.submitButtonText, isTablet && styles.tabletSubmitButtonText]}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={[styles.cancelText, isTablet && styles.tabletCancelText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // ========== MOBILE STYLES ==========
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginTop: 32,
    backgroundColor: "#93210A",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 100,
  },
  
  fullImage: {
    width: width,
    height: 230,
    borderRadius: 0,
    alignSelf: "center",
    marginBottom: 15,
  },
  
  section: { 
    marginHorizontal: 20, 
    marginBottom: 15 
  },
  
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "left",
    marginBottom: 6,
  },
  
  sectionText: {
    fontSize: 14,
    color: "#333",
    textAlign: "justify",
    lineHeight: 20,
  },
  
  galleryImage: {
    width: 150,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8B1C0D",
  },
  
  videoSection: {
    width: width,
    backgroundColor: "#000",
    marginBottom: 20,
  },
  
  fullVideo: {
    width: width,
    height: 230,
    backgroundColor: "#000",
    bottom:78,
  },
  
  reviewCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  
  starContainer: { 
    flexDirection: "row", 
    marginVertical: 5 
  },
  
  comment: { 
    color: "#333", 
    marginTop: 5,
    fontSize: 14,
  },
  
  seeAllButton: {
    width: "40%",
    backgroundColor: "#9c99c5",
    padding: 10,
    borderRadius: 10,
    color: "#fff",
    marginTop: 8,
    fontWeight: "500",
    textAlign: 'center',
  },
  
  noReviewsText: { 
    textAlign: "center", 
    color: "#777",
    fontSize: 14,
  },
  
  reviewButton: {
    backgroundColor: "#93210A",
    flexDirection: "column",
    justifyContent: "center",
    width: "50%",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  
  reviewButtonText: { 
    color: "#fff", 
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 14,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  modalContainer: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 15,
    padding: 20,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "center",
    marginBottom: 10,
  },
  
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  
  modalStarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  
  submitButton: {
    backgroundColor: "#93210A",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  
  submitButtonText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
  },
  
  cancelText: {
    color: "#93210A",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
  },

  // ========== TABLET STYLES ==========
  tabletHeader: {
    padding: 50,
    marginTop: -3,
  },
  
  tabletHeaderText: {
    fontSize: 26,
    marginLeft: 15,
    left:60,
  },
  
  tabletScrollContent: {
    paddingBottom: 120,
  },
  
  tabletFullImage: {
    height: 320,
    marginBottom: 25,
  },
  
  tabletSection: {
    marginHorizontal: 40,
    marginBottom: 25,
  },
  
  tabletSectionTitle: {
    fontSize: 22,
    marginBottom: 10,
  },
  
  tabletSectionText: {
    fontSize: 18,
    lineHeight: 28,
  },
  
  tabletGalleryScroll: {
    marginHorizontal: -10,
  },
  
  tabletGalleryImage: {
    width: 200,
    height: 140,
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 2,
  },
  
  tabletVideoSection: {
    marginBottom: 30,
  },
  
  tabletFullVideo: {
    height: 350,
  },
  
  tabletReviewCard: {
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  
  tabletStarContainer: {
    marginVertical: 8,
  },
  
  tabletComment: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
  },
  
  tabletSeeAllButton: {
    alignSelf: 'center',
    marginTop: 15,
  },
  
  tabletSeeAllButtonText: {
    width: "50%",
    padding: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  
  tabletNoReviewsText: {
    fontSize: 16,
    marginVertical: 10,
  },
  
  tabletReviewButton: {
    width: "40%",
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 12,
  },
  
  tabletReviewButtonText: {
    fontSize: 16,
    marginTop: 8,
  },
  
  tabletModalContainer: {
    width: "60%",
    maxWidth: 500,
    padding: 30,
    borderRadius: 20,
  },
  
  tabletModalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  
  tabletInput: {
    padding: 15,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  
  tabletModalStarContainer: {
    marginVertical: 20,
  },
  
  tabletSubmitButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
  },
  
  tabletSubmitButtonText: {
    fontSize: 18,
  },
  
  tabletCancelText: {
    fontSize: 18,
    marginTop: 15,
  },
});