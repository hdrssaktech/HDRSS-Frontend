// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Dimensions,
//   Modal,
//   TextInput,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { Video } from "expo-av";
// import YoutubePlayer from "react-native-youtube-iframe";
// import {
//   fetchElectionById,
//   postVideoReview,
// } from "../../../Controller/ElectionVotePageController/ElectionVotePageController";

// const { width } = Dimensions.get("window");

// export default function ElectionVotePage2({ route, navigation }) {
//   const { id } = route.params;
//   const [election, setElection] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [comment, setComment] = useState("");
//   const [rating, setRating] = useState(0);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     loadElection();
//   }, [id]);

//   const loadElection = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchElectionById(id);
//       setElection(data);
//     } catch (error) {
//       console.error("Error loading election:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getYouTubeId = (url) => {
//     if (!url) return null;
//     const match = url.match(
//       /(?:youtube\.com\/(?:.*v=|v\/|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
//     );
//     return match ? match[1] : null;
//   };

//   const handleSubmitReview = async () => {
//     if (!comment || rating === 0) {
//       Alert.alert("Please fill all fields and select a rating");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const reviewData = {
//         electionId: id.toString(),
//         comment,
//         rating: rating.toString(),
//       };

//       await postVideoReview(reviewData);
//       Alert.alert("Success", "Review submitted successfully!");
//       setShowModal(false);
//       setComment("");
//       setRating(0);
//       loadElection(); // refresh reviews
//     } catch (error) {
//       Alert.alert("Error", "Failed to post review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={[styles.container, { justifyContent: "center" }]}>
//         <ActivityIndicator size="large" color="#8B1C0D" />
//       </View>
//     );
//   }

//   if (!election) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ textAlign: "center", marginTop: 40 }}>No data found</Text>
//       </View>
//     );
//   }

//   const videoId = getYouTubeId(election.video);
//   const isYouTube =
//     election.video &&
//     (election.video.includes("youtube.com") ||
//       election.video.includes("youtu.be"));

//   return (
//     <View style={styles.container}>
//       {/* 🔹 Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={26} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>{election.name}</Text>
//       </View>

//       <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
//         {/* 🖼️ Full-width Banner Image */}
//         {election.image && (
//           <Image source={{ uri: election.image }} style={styles.fullImage} />
//         )}

//         {/* 🏷️ Title */}
//         {election.title && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Title</Text>
//             <Text style={styles.sectionText}>{election.title}</Text>
//           </View>
//         )}

//         {/* 📍 District */}
//         {election.district && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>District</Text>
//             <Text style={styles.sectionText}>{election.district}</Text>
//           </View>
//         )}

//         {/* 📝 About */}
//         {election.about && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>About</Text>
//             <Text style={styles.sectionText}>{election.about}</Text>
//           </View>
//         )}

//         {/* 🖼️ Gallery */}
//         {election.gallery && election.gallery.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Gallery</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {election.gallery
//                 .filter((g) => g)
//                 .map((url, index) => (
//                   <Image
//                     key={index}
//                     source={{ uri: url }}
//                     style={styles.galleryImage}
//                   />
//                 ))}
//             </ScrollView>
//           </View>
//         )}

//         {/* 🎥 Full-width Video Section */}
//         {election.video && (
//           <View style={styles.videoSection}>
//             <Text style={styles.sectionTitle}>HDRSS Video</Text>
//             {isYouTube && videoId ? (
//               <YoutubePlayer
//                 height={230}
//                 width={width}
//                 play={false}
//                 videoId={videoId}
//               />
//             ) : (
//               <Video
//                 source={{ uri: election.video }}
//                 style={styles.fullVideo}
//                 useNativeControls
//                 resizeMode="contain"
//               />
//             )}
//           </View>
//         )}

//         {/* 💬 Reviews */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Reviews</Text>

//           {election.VideoReviews && election.VideoReviews.length > 0 ? (
//             election.VideoReviews.map((rev) => (
//               <View key={rev.id} style={styles.reviewCard}>
//                 <Text style={styles.reviewerName}>
//                   {rev.reviewerName || "Anonymous"}
//                 </Text>
//                 <View style={styles.starContainer}>
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Ionicons
//                       key={star}
//                       name={star <= rev.rating ? "star" : "star-outline"}
//                       size={18}
//                       color="#f4c430"
//                     />
//                   ))}
//                 </View>
//                 <Text style={styles.comment}>{rev.comment}</Text>
//               </View>
//             ))
//           ) : (
//             <Text style={{ textAlign: "center", color: "#777" }}>
//               No reviews yet.
//             </Text>
//           )}

//           {/* 📝 Add Review Button */}
//           <TouchableOpacity
//             style={styles.reviewButton}
//             onPress={() => setShowModal(true)}
//           >
//             <Ionicons
//               name="chatbubble-ellipses-outline"
//               size={18}
//               color="#fff"
//             />
//             <Text style={styles.reviewButtonText}>Write a Review</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* 🌟 Review Modal */}
//       <Modal visible={showModal} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Write a Review</Text>

//             <TextInput
//               style={[styles.input, { height: 80 }]}
//               placeholder="Your Comment"
//               value={comment}
//               multiline
//               onChangeText={setComment}
//             />

//             {/* ⭐ Star Rating */}
//             <View style={styles.starContainer}>
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <TouchableOpacity key={star} onPress={() => setRating(star)}>
//                   <Ionicons
//                     name={star <= rating ? "star" : "star-outline"}
//                     size={26}
//                     color="#f4c430"
//                   />
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <TouchableOpacity
//               style={styles.submitButton}
//               onPress={handleSubmitReview}
//               disabled={submitting}
//             >
//               <Text style={styles.submitButtonText}>
//                 {submitting ? "Submitting..." : "Submit Review"}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => setShowModal(false)}>
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     marginTop: 32,
//     backgroundColor: "#93210A",
//   },
//   headerText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginLeft: 10,
//   },
//   fullImage: {
//     width: width,
//     height: 230,
//     borderRadius: 0,
//     alignSelf: "center",
//     marginBottom: 15,
//   },
//   section: { marginHorizontal: 20, marginBottom: 15 },
//   sectionTitle: {
//     fontSize: 17,
//     fontWeight: "bold",
//     color: "#93210A",
//     textAlign: "left", // 🔹 changed from center to left
//     marginBottom: 6,
//   },
//   sectionText: {
//     fontSize: 14,
//     color: "#333",
//     textAlign: "justify",
//     lineHeight: 20,
//   },
//   galleryImage: {
//     width: 150,
//     height: 100,
//     marginRight: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#8B1C0D",
//   },
//   videoSection: {
//     width: width,
//     backgroundColor: "#000",
//     marginBottom: 20,
//   },
//   fullVideo: {
//     width: width,
//     height: 230,
//     backgroundColor: "#000",
//   },
//   reviewCard: {
//     backgroundColor: "#f8f8f8",
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 5,
//   },
//   reviewerName: { fontWeight: "bold", fontSize: 15, color: "#93210A" },
//   comment: { color: "#333", marginTop: 5 },
//   starContainer: { flexDirection: "row", marginVertical: 5 },
//   reviewButton: {
//     backgroundColor: "#93210A",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 25,
//     paddingVertical: 10,
//     marginTop: 10,
//   },
//   reviewButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 5 },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     backgroundColor: "#fff",
//     width: "85%",
//     borderRadius: 15,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#93210A",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 10,
//   },
//   submitButton: {
//     backgroundColor: "#93210A",
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   submitButtonText: { color: "#fff", fontWeight: "bold" },
//   cancelText: {
//     color: "#93210A",
//     textAlign: "center",
//     marginTop: 10,
//     fontWeight: "bold",
//   },
// });
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
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <View style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{election.name}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* 🖼️ Full-width Banner Image */}
        {election.image && (
          <Image source={{ uri: election.image }} style={styles.fullImage} />
        )}

        {/* 🏷️ Title */}
        {election.title && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Title</Text>
            <Text style={styles.sectionText}>{election.title}</Text>
          </View>
        )}

        {/* 📍 District */}
        {election.district && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>District</Text>
            <Text style={styles.sectionText}>{election.district}</Text>
          </View>
        )}

        {/* 📝 About */}
        {election.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.sectionText}>{election.about}</Text>
          </View>
        )}

        {/* 🖼️ Gallery */}
        {election.gallery && election.gallery.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {election.gallery
                .filter((g) => g)
                .map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={styles.galleryImage}
                  />
                ))}
            </ScrollView>
          </View>
        )}

        {/* 🎥 Full-width Video Section */}
        {election.video && (
          <View style={styles.videoSection}>
            <Text style={styles.sectionTitle}>HDRSS Video</Text>
            {isYouTube && videoId ? (
              <YoutubePlayer
                height={230}
                width={width}
                play={false}
                videoId={videoId}
              />
            ) : (
              <Video
                source={{ uri: election.video }}
                style={styles.fullVideo}
                useNativeControls
                resizeMode="contain"
              />
            )}
          </View>
        )}

        {/* 💬 Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>

   {election.VideoReviews && election.VideoReviews.length > 0 ? (
  election.VideoReviews.slice(0, 3).map((rev) => (
    <View key={rev.id} style={styles.reviewCard}>
      <Text style={styles.reviewerName}>
        {rev.reviewerName || "Anonymous"}
      </Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rev.rating ? "star" : "star-outline"}
            size={18}
            color="#f4c430"
          />
        ))}
      </View>
      <Text style={styles.comment}>{rev.comment}</Text>
    </View>
  ))
) : (
  <Text style={{ textAlign: "center", color: "#777" }}>
    No reviews yet.
  </Text>
)}


          {/* 📝 Add Review Button */}
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => setShowModal(true)}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color="#fff"
            />
            <Text style={styles.reviewButtonText}>Write a Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🌟 Review Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Write a Review</Text>

            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Your Comment"
              value={comment}
              multiline
              onChangeText={setComment}
            />

            {/* ⭐ Star Rating */}
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={26}
                    color="#f4c430"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReview}
              disabled={submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
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
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  fullImage: {
    width: width,
    height: 230,
    borderRadius: 0,
    alignSelf: "center",
    marginBottom: 15,
  },
  section: { marginHorizontal: 20, marginBottom: 15 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#93210A",
    textAlign: "left", // 🔹 changed from center to left
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
  },
  reviewCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  reviewerName: { fontWeight: "bold", fontSize: 15, color: "#93210A" },
  comment: { color: "#333", marginTop: 5 },
  starContainer: { flexDirection: "row", marginVertical: 5 },
  reviewButton: {
    backgroundColor: "#93210A",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    paddingVertical: 10,
    marginTop: 10,
  },
  reviewButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 5 },
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
  },
  submitButton: {
    backgroundColor: "#93210A",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontWeight: "bold" },
  cancelText: {
    color: "#93210A",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
});