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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchReviewsByComplaintId,
  addReview,
} from "../../Controller/ComplaintController/ComplaintController";

export default function ComplaintPage2({ route, navigation }) {
  const { complaint } = route.params || {};
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const complaintId = complaint?.id || complaint?._id || complaint?.complaintId;
  const formattedDate = complaint.date
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
        >
          <Ionicons name={iconName} size={24} color="#FFD700" />
        </TouchableOpacity>
      );
    });
  };

  if (!complaint) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No complaint selected</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonAlt}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.name}>{complaint.title || "Complaint Details"}</Text>

        {/* 🔹 Complaint Info */}
        <View style={[styles.section, styles.highlightCard]}>
          <View style={styles.row}>
            <Ionicons name="person" size={18} color="#93210A" />
            <Text style={styles.subTitle}> Name</Text>
          </View>
          <Text style={styles.text}>{complaint.name || "N/A"}</Text>

          <View style={styles.row}>
            <Ionicons name="call" size={18} color="#93210A" />
            <Text style={styles.subTitle}> Phone</Text>
          </View>
          <Text style={styles.text}>{complaint.phoneNumber || "N/A"}</Text>

          <View style={styles.row}>
            <Ionicons name="location" size={18} color="#93210A" />
            <Text style={styles.subTitle}> Address</Text>
          </View>
          <Text style={styles.text}>{complaint.address || "N/A"}</Text>

          <View style={styles.row}>
            <Ionicons name="calendar" size={18} color="#93210A" />
            <Text style={styles.subTitle}> Date</Text>
          </View>
          <Text style={styles.text}>{formattedDate}</Text>

          <View style={styles.row}>
            <Ionicons name="reader" size={18} color="#93210A" />
            <Text style={styles.subTitle}> Description</Text>
          </View>
          <Text style={styles.text}>{complaint.description || "N/A"}</Text>
        </View>

        {/* 🔹 Images Section */}
        {complaint.images && complaint.images.length > 0 && (
          <View style={[styles.section, styles.highlightCard]}>
            <Text style={styles.subTitle}>Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {complaint.images.map((img, idx) => (
                <Image key={idx} source={{ uri: img }} style={styles.image} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* 🔹 Add Review */}
        <View style={[styles.section, styles.highlightCard]}>
          <Text style={styles.subTitle}>Add Your Review</Text>
          <View style={styles.starRow}>{renderStars(rating, true)}</View>
          <TextInput
            style={styles.input}
            placeholder="Write your review..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReview}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 Reviews List */}
        <View style={[styles.section, styles.highlightCard]}>
          <View style={styles.row}>
            <Ionicons name="chatbubbles" size={18} color="#93210A" />
            <Text style={styles.subTitle}> User Reviews</Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#93210A" size="small" />
          ) : reviews.length === 0 ? (
            <Text style={styles.text}>No reviews available.</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewBox}>
                <View style={styles.starRow}>
                  {renderStars(review.rating, false)}
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
                <View style={styles.reviewMetaBox}>
                  <Text style={styles.reviewMeta}>
                    👤 {review.userName || "Anonymous"}
                  </Text>
                  <Text style={styles.reviewMeta}>
                    📍 {review.address || "No address"}
                  </Text>
                  <Text style={styles.reviewMeta}>
                    📅{" "}
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  header: {
    backgroundColor: "#93210A",
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop:30,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  content: { padding: 20 },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 20,
    textAlign: "center",
  },
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
  row: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  subTitle: { fontWeight: "bold", fontSize: 16, color: "#93210A" },
  text: { fontSize: 14, color: "#333", lineHeight: 22 },
  image: {
    width: 160,
    height: 110,
    borderRadius: 8,
    marginRight: 10,
    marginTop: 10,
  },
  starRow: { flexDirection: "row", marginTop: 5, marginBottom: 8 },
  input: {
    borderWidth: 1.2,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#93210A",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    elevation: 3,
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },

  // 🔸 Review Box – now only outlined with brown color
  reviewBox: {
        backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1.8,
    borderColor: "#93210A", // 🟤 brown outline
  },

  reviewText: { fontSize: 14, color: "#333", marginBottom: 6 },
  reviewMetaBox: { marginTop: 4 },
  reviewMeta: { fontSize: 12, color: "#666", marginBottom: 2 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#93210A", fontSize: 16 },
  backButtonAlt: {
    backgroundColor: "#93210A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  backButtonText: { color: "#fff", fontWeight: "bold" },
}); 