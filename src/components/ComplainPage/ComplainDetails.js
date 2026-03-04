import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchReviewsByComplaintId,
  addReview,
} from "../../Controller/ComplaintController/ComplaintController";
import Loader from "../Alert/Loader";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function ComplaintPage2({ route, navigation }) {
  const { complaint } = route.params || {};
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const complaintId = complaint?.id || complaint?._id || complaint?.complaintId;
  const formattedDate = complaint?.date
    ? new Date(complaint.date).toLocaleDateString()
    : "Not available";

  useEffect(() => {
    const loadReviews = async () => {
      try {
        if (!complaintId) return;
        const data = await fetchReviewsByComplaintId(complaintId);
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Failed to load reviews:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [complaintId]);

  const handleRatingPress = (value) => setRating(value);

  const handleSubmitReview = async () => {
    if (!rating) return Alert.alert("Error", "Please select a rating.");
    if (!comment.trim()) return Alert.alert("Error", "Please enter a comment.");

    try {
      setSubmitting(true);
      const newReview = await addReview(complaintId, rating, comment);
      setReviews((prev) => [newReview.review, ...prev]);
      setRating(0);
      setComment("");
      Alert.alert("Success", "Review submitted successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating, interactive = false) => {
    return [1, 2, 3, 4, 5].map((star) => {
      const iconName =
        currentRating >= star
          ? "star"
          : currentRating >= star - 0.5
          ? "star-half"
          : "star-outline";
      return (
        <TouchableOpacity
          key={star}
          disabled={!interactive}
          onPress={() => interactive && handleRatingPress(star)}
          activeOpacity={interactive ? 0.6 : 1}
        >
          <Ionicons 
            name={iconName} 
            size={isTablet ? 30 : 24} 
            color="#FFD700" 
          />
        </TouchableOpacity>
      );
    });
  };

  if (!complaint) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.errorText, isTablet && styles.errorTextTablet]}>
          No complaint selected
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButtonAlt, isTablet && styles.backButtonAltTablet]}
          activeOpacity={0.7}
        >
          <Text style={[styles.backButtonText, isTablet && styles.backButtonTextTablet]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      <View style={styles.container}>
        {/* 🔹 Header */}
        <View style={[styles.header, isTablet && styles.headerTablet]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="chevron-back" 
              size={isTablet ? 30 : 26} 
              color="#fff" 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
            Complaint Details
          </Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={[
            styles.contentContainer, 
            isTablet && styles.contentContainerTablet
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.name, isTablet && styles.nameTablet]}>
            {complaint.title || "Complaint Details"}
          </Text>

          {/* 🔹 Complaint Info */}
          <View style={[styles.section, styles.highlightCard, isTablet && styles.sectionTablet]}>
            <View style={[styles.row, isTablet && styles.rowTablet]}>
              <Ionicons name="person" size={isTablet ? 22 : 18} color="#93210A" />
              <Text style={[styles.subTitle, isTablet && styles.subTitleTablet]}> Name</Text>
            </View>
            <Text style={[styles.text, isTablet && styles.textTablet]}>
              {complaint.name || "N/A"}
            </Text>

            <View style={[styles.row, isTablet && styles.rowTablet]}>
              <Ionicons name="call" size={isTablet ? 22 : 18} color="#93210A" />
              <Text style={[styles.subTitle, isTablet && styles.subTitleTablet]}> Phone</Text>
            </View>
            <Text style={[styles.text, isTablet && styles.textTablet]}>
              {complaint.phoneNumber || "N/A"}
            </Text>

            <View style={[styles.row, isTablet && styles.rowTablet]}>
              <Ionicons name="location" size={isTablet ? 22 : 18} color="#93210A" />
              <Text style={[styles.subTitle, isTablet && styles.subTitleTablet]}> Address</Text>
            </View>
            <Text style={[styles.text, isTablet && styles.textTablet]}>
              {complaint.address || "N/A"}
            </Text>

            <View style={[styles.row, isTablet && styles.rowTablet]}>
              <Ionicons name="calendar" size={isTablet ? 22 : 18} color="#93210A" />
              <Text style={[styles.subTitle, isTablet && styles.subTitleTablet]}> Date</Text>
            </View>
            <Text style={[styles.text, isTablet && styles.textTablet]}>{formattedDate}</Text>

            <View style={[styles.row, isTablet && styles.rowTablet]}>
              <Ionicons name="reader" size={isTablet ? 22 : 18} color="#93210A" />
              <Text style={[styles.subTitle, isTablet && styles.subTitleTablet]}> Description</Text>
            </View>
            <Text style={[styles.text, isTablet && styles.textTablet]}>
              {complaint.description || "N/A"}
            </Text>
          </View>

          {/* 🔹 Images Section */}
          {complaint.images && complaint.images.length > 0 && (
            <View style={[styles.section, styles.highlightCard, isTablet && styles.sectionTablet]}>
              <Text style={[styles.subTitle, isTablet && styles.subTitleTablet]}>Images</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.imagesScroll}
              >
                {complaint.images.map((img, idx) => (
                  <Image 
                    key={idx} 
                    source={{ uri: img }} 
                    style={[styles.image, isTablet && styles.imageTablet]} 
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* 🔹 Add Review Section */}
          <View style={[styles.section, styles.highlightCard, isTablet && styles.sectionTablet]}>
            <Text style={[styles.subTitle, isTablet && styles.subTitleTablet]}>
              Add Your Review
            </Text>
            <View style={[styles.starRow, isTablet && styles.starRowTablet]}>
              {renderStars(rating, true)}
            </View>
            <TextInput
              style={[styles.input, isTablet && styles.inputTablet]}
              placeholder="Write your review..."
              placeholderTextColor="#999"
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <TouchableOpacity
              style={[styles.submitButton, isTablet && styles.submitButtonTablet]}
              onPress={handleSubmitReview}
              disabled={submitting}
              activeOpacity={0.8}
            >
              <Text style={[styles.submitButtonText, isTablet && styles.submitButtonTextTablet]}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 🔹 Reviews List */}
          <View style={[styles.section, styles.highlightCard, isTablet && styles.sectionTablet]}>
            <View style={[styles.row, isTablet && styles.rowTablet]}>
              <Ionicons name="chatbubbles" size={isTablet ? 22 : 18} color="#93210A" />
              <Text style={[styles.subTitle, isTablet && styles.subTitleTablet]}>
                User Reviews ({reviews.length})
              </Text>
            </View>

            {loading ? (
            <Loader/>
            ) : reviews.length === 0 ? (
              <View style={styles.noReviewsContainer}>
                <Ionicons 
                  name="chatbubble-outline" 
                  size={isTablet ? 60 : 50} 
                  color="#CCCCCC" 
                />
                <Text style={[styles.noReviewsText, isTablet && styles.noReviewsTextTablet]}>
                  No reviews available
                </Text>
                <Text style={[styles.noReviewsSubtext, isTablet && styles.noReviewsSubtextTablet]}>
                  Be the first to add a review
                </Text>
              </View>
            ) : (
              <View style={styles.reviewsList}>
                {reviews.map((review) => (
                  <View 
                    key={review.id} 
                    style={[styles.reviewBox, isTablet && styles.reviewBoxTablet]}
                  >
                    <View style={[styles.starRow, isTablet && styles.starRowTablet]}>
                      {renderStars(review.rating, false)}
                    </View>
                    <Text style={[styles.reviewText, isTablet && styles.reviewTextTablet]}>
                      {review.comment}
                    </Text>
                    <View style={styles.reviewMetaBox}>
                      <Text style={[styles.reviewMeta, isTablet && styles.reviewMetaTablet]}>
                        📅{" "}
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ============ BASE STYLES ============
  safeArea: {
    flex: 1,
    backgroundColor: "#93210A",
  },
  container: { 
    flex: 1, 
    backgroundColor: "#f4f4f4" 
  },
  
  // ============ HEADER ============
  // Mobile Header
  header: {
    backgroundColor: "#93210A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 33,
    paddingBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
    flex: 1,
  },
  headerPlaceholder: {
    width: 40,
  },
  
  // Tablet Header
  headerTablet: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 15 : 35,
    paddingBottom: 20,
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  
  // ============ CONTENT ============
  // Mobile Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  
  // Tablet Content
  contentContainerTablet: {
    paddingHorizontal: isLargeTablet ? 60 : 40,
    paddingVertical: 30,
  },
  
  // ============ TITLE ============
  // Mobile Title
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 28,
  },
  
  // Tablet Title
  nameTablet: {
    fontSize: 28,
    marginBottom: 30,
    lineHeight: 34,
  },
  
  // ============ SECTIONS ============
  // Mobile Section
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 18,
  },
  highlightCard: {
    shadowColor: "#93210A",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0e3df",
  },
  
  // Tablet Section
  sectionTablet: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  
  // ============ ROWS ============
  // Mobile Row
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 5 
  },
  
  // Tablet Row
  rowTablet: { 
    marginBottom: 8 
  },
  
  // ============ SUBTITLE ============
  // Mobile Subtitle
  subTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    color: "#93210A",
    marginLeft: 8,
  },
  
  // Tablet Subtitle
  subTitleTablet: { 
    fontSize: 20,
    marginLeft: 10,
  },
  
  // ============ TEXT ============
  // Mobile Text
  text: { 
    fontSize: 14, 
    color: "#333", 
    lineHeight: 22,
    marginBottom: 12,
    paddingLeft: 26,
  },
  
  // Tablet Text
  textTablet: { 
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 16,
    paddingLeft: 32,
  },
  
  // ============ IMAGES ============
  // Mobile Images
  imagesScroll: {
    marginTop: 8,
  },
  image: {
    width: 160,
    height: 110,
    borderRadius: 8,
    marginRight: 10,
    marginTop: 10,
  },
  
  // Tablet Images
  imageTablet: {
    width: 200,
    height: 140,
    borderRadius: 10,
    marginRight: 15,
    marginTop: 12,
  },
  
  // ============ STARS ROW ============
  // Mobile Stars
  starRow: { 
    flexDirection: "row", 
    marginTop: 5, 
    marginBottom: 8,
    justifyContent: 'center',
  },
  
  // Tablet Stars
  starRowTablet: { 
    marginTop: 10, 
    marginBottom: 12 
  },
  
  // ============ INPUT ============
  // Mobile Input
  input: {
    borderWidth: 1.2,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    minHeight: 80,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#333",
  },
  
  // Tablet Input
  inputTablet: {
    fontSize: 16,
    padding: 16,
    minHeight: 100,
    borderRadius: 10,
    marginTop: 12,
  },
  
  // ============ SUBMIT BUTTON ============
  // Mobile Submit Button
  submitButton: {
    backgroundColor: "#93210A",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 15 
  },
  
  // Tablet Submit Button
  submitButtonTablet: {
    paddingVertical: 18,
    borderRadius: 10,
    marginTop: 16,
  },
  submitButtonTextTablet: { 
    fontSize: 18 
  },
  
  // ============ REVIEWS LIST ============
  // Mobile Reviews
  reviewsList: {
    marginTop: 10,
  },
  
  // ============ REVIEW BOX ============
  // Mobile Review Box
  reviewBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1.8,
    borderColor: "#93210A",
  },
  reviewText: { 
    fontSize: 14, 
    color: "#333", 
    marginVertical: 6,
    lineHeight: 20,
  },
  reviewMetaBox: { 
    marginTop: 4 
  },
  reviewMeta: { 
    fontSize: 12, 
    color: "#666", 
    marginBottom: 2 
  },
  
  // Tablet Review Box
  reviewBoxTablet: {
    padding: 20,
    borderRadius: 14,
    marginTop: 16,
    borderWidth: 2,
  },
  reviewTextTablet: { 
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 8,
  },
  reviewMetaTablet: { 
    fontSize: 14 
  },
  
  // ============ LOADING STATES ============
  // Mobile Loading
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: "#93210A",
    marginTop: 10,
    fontSize: 14,
  },
  
  // Tablet Loading
  loadingTextTablet: {
    fontSize: 16,
    marginTop: 12,
  },
  
  // ============ NO REVIEWS STATE ============
  // Mobile No Reviews
  noReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  noReviewsText: {
    color: "#999",
    fontSize: 16,
    marginTop: 15,
    fontWeight: '600',
  },
  noReviewsSubtext: {
    color: "#AAA",
    fontSize: 14,
    marginTop: 5,
  },
  
  // Tablet No Reviews
  noReviewsTextTablet: {
    fontSize: 20,
    marginTop: 20,
  },
  noReviewsSubtextTablet: {
    fontSize: 16,
    marginTop: 8,
  },
  
  // ============ ERROR STATE ============
  // Mobile Error
  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: '#f4f4f4',
  },
  errorText: { 
    color: "#93210A", 
    fontSize: 16,
    marginBottom: 20,
  },
  backButtonAlt: {
    backgroundColor: "#93210A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
  },
  backButtonText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 14,
  },
  
  // Tablet Error
  errorTextTablet: {
    fontSize: 20,
    marginBottom: 25,
  },
  backButtonAltTablet: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  backButtonTextTablet: {
    fontSize: 16,
  },
  
  // ============ BOTTOM SPACING ============
  bottomSpacing: {
    height: 30,
  },
});