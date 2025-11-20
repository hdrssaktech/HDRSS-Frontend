import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo vector icons

export default function TownBusinessPage4() {
  const route = useRoute();
  const navigation = useNavigation();
  const { businessData } = route.params;
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  console.log("Business Data:", businessData);

  // Function to handle phone call
  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  // Function to handle WhatsApp
  const handleWhatsApp = (whatsappNumber) => {
    if (whatsappNumber) {
      Linking.openURL(`https://wa.me/${whatsappNumber}`);
    }
  };

  // Function to handle location/map
  const handleOpenMap = (address) => {
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
    }
  };

  // Function to open YouTube video
  const handleOpenVideo = (videoUrl) => {
    if (videoUrl) {
      Linking.openURL(videoUrl);
    }
  };

  // Function to open image in modal
  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Main Business Image */}
      <TouchableOpacity onPress={() => openImageModal(businessData.image)}>
        <Image 
          source={{ uri: businessData.image }} 
          style={styles.mainImage}
        />
      </TouchableOpacity>

      {/* Business Header */}
      <View style={styles.header}>
        <Text style={styles.businessTitle}>{businessData.title}</Text>
        <Text style={styles.businessDescription}>
          {businessData.description}
        </Text>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, !businessData.phone && styles.disabledButton]}
          onPress={() => handleCall(businessData.phone)}
          disabled={!businessData.phone}
        >
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.whatsappButton, !businessData.whatsapp && styles.disabledButton]}
          onPress={() => handleWhatsApp(businessData.whatsapp)}
          disabled={!businessData.whatsapp}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.mapButton, !businessData.location && styles.disabledButton]}
          onPress={() => handleOpenMap(businessData.location)}
          disabled={!businessData.location}
        >
          <Ionicons name="location" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Gallery Section */}
      {businessData.gallery && businessData.gallery.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryContainer}>
            {businessData.gallery.map((imageUri, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => openImageModal(imageUri)}
                style={styles.galleryImageContainer}
              >
                <Image source={{ uri: imageUri }} style={styles.galleryImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Videos Section */}
      {businessData.videos && businessData.videos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Videos</Text>
          {businessData.videos.map((videoUrl, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.videoItem}
              onPress={() => handleOpenVideo(videoUrl)}
            >
              <Ionicons name="play-circle" size={24} color="#FF3B30" />
              <View style={styles.videoText}>
                <Text style={styles.videoTitle}>Video {index + 1}</Text>
                <Text style={styles.videoUrl} numberOfLines={1}>
                  {videoUrl}
                </Text>
              </View>
              <Ionicons name="open-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  mainImage: {
    width: "100%",
    height: 250,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  businessTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    justifyContent: "center",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  mapButton: {
    backgroundColor: "#FF3B30",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  contactText: {
    marginLeft: 12,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  galleryContainer: {
    marginTop: 8,
  },
  galleryImageContainer: {
    marginRight: 12,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  videoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 8,
  },
  videoText: {
    flex: 1,
    marginLeft: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  videoUrl: {
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  modalImage: {
    width: "100%",
    height: "80%",
  },
});