import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createComplaint } from "../../Controller/ComplaintController/ComplaintController";
import CustomAlert from "../../components/Alert/CustomAlert"; // Import your CustomAlert component
import axios from 'axios';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 600;
const isLargeTablet = screenWidth >= 1024;

export default function ComplaintPage3({ navigation, route }) {
  const { districtName } = route.params || {};
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState(districtName || "");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  // 📅 Handle date change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };


    const pickImages = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    showAlert("error", "Permission Denied", "You need to allow gallery access to upload images");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    showAlert("success", "Uploading", "Uploading images please wait...");

    const uploadedUrls = await Promise.all(
      result.assets.map(async (asset) => {
        const formData = new FormData();
        formData.append("file", {
          uri: asset.uri,       
          type: "image/jpeg",
          name: asset.fileName || "complaint.jpg"
        });

        try { 
          const res = await axios.post("https://hdrss-backend.onrender.com/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return res.data.fileUrl || null;
        } catch (err) {
          console.error("Image upload failed:", err);
          return null;
        }
      })
    );

    // filter out any failed uploads
    const validUrls = uploadedUrls.filter(url => url !== null);
    setImages(validUrls); // now stores http:// URLs not file:// paths

    showAlert("success", "Success", `${validUrls.length} image(s) uploaded successfully`);
  }
};

  // Show custom alert
  const showAlert = (type, title, message) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // 📨 Submit complaint
  const handleSubmit = async () => {
    if (!title || !description || !address) {
      showAlert("error", "Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        address,
        date: date.toISOString(),
        images,
      };

      const res = await createComplaint(payload);
      showAlert("success", "Success", "Complaint submitted successfully");
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      showAlert("error", "Error", "Something went wrong while submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  // Remove single image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    showAlert("success", "Success", "Image removed successfully");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#93210A" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* 🔴 Header */}
          <View style={[styles.header, isTablet && styles.headerTablet]}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="chevron-back" 
                size={isTablet ? 30 : 26} 
                color="#fff" 
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>
              New Complaint
            </Text>
            <View style={styles.rightPlaceholder} />
          </View>

          {/* Scrollable Content */}
          <ScrollView 
            style={styles.scrollArea} 
            contentContainerStyle={[
              styles.scrollContent, 
              isTablet && styles.scrollContentTablet
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.form, isTablet && styles.formTablet]}>
              {/* Date Field */}
              <Text style={[styles.label, isTablet && styles.labelTablet]}>Date</Text>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <View style={[styles.input, styles.dateField, isTablet && styles.dateFieldTablet]}>
                  <Ionicons 
                    name="calendar" 
                    size={isTablet ? 24 : 20} 
                    color="#93210A" 
                  />
                  <Text style={[styles.dateText, isTablet && styles.dateTextTablet]}>
                    {date.toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={isTablet ? "spinner" : "default"}
                  onChange={handleDateChange}
                />
              )}

              {/* Address Field */}
              <Text style={[styles.label, isTablet && styles.labelTablet]}>Address</Text>
              <TextInput
                style={[styles.input, isTablet && styles.inputTablet]}
                placeholder="Enter address"
                placeholderTextColor="#999"
                value={address}
                onChangeText={setAddress}
              />

              {/* District Field (Read-only) */}
              <Text style={[styles.label, isTablet && styles.labelTablet]}>District</Text>
              <TextInput
                style={[styles.input, isTablet && styles.inputTablet]}
                placeholder="Enter complaint District"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                editable={false}
              />

              {/* Description Field */}
              <Text style={[styles.label, isTablet && styles.labelTablet]}>Description</Text>
              <TextInput
                style={[
                  styles.input, 
                  styles.textArea, 
                  isTablet && styles.textAreaTablet
                ]}
                placeholder="Enter detailed description about complain"
                placeholderTextColor="#999"
                multiline
                value={description}
                onChangeText={setDescription}
                numberOfLines={4}
              />

              {/* Upload Images Section */}
              <Text style={[styles.label, isTablet && styles.labelTablet]}>Upload Images</Text>
              <TouchableOpacity 
                style={[styles.uploadButton, isTablet && styles.uploadButtonTablet]} 
                onPress={pickImages}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="image" 
                  size={isTablet ? 24 : 20} 
                  color="#fff" 
                />
                <Text style={[styles.uploadText, isTablet && styles.uploadTextTablet]}>
                  Choose Images
                </Text>
              </TouchableOpacity>

              {/* Preview Images */}
              {images.length > 0 && (
                <View style={styles.previewContainer}>
                  <Text style={[styles.previewTitle, isTablet && styles.previewTitleTablet]}>
                    Selected Images ({images.length})
                  </Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.previewScroll}
                  >
                    {images.map((img, idx) => (
                      <View 
                        key={idx} 
                        style={[
                          styles.imageContainer, 
                          isTablet && styles.imageContainerTablet
                        ]}
                      >
                        <Image 
                          source={{ uri: img }} 
                          style={[
                            styles.previewImage, 
                            isTablet && styles.previewImageTablet
                          ]} 
                        />
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeImage(idx)}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="close-circle" size={isTablet ? 26 : 22} color="#93210A" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.button, isTablet && styles.buttonTablet]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size={isTablet ? "large" : "small"} />
                ) : (
                  <Text style={[styles.buttonText, isTablet && styles.buttonTextTablet]}>
                    Submit Complaint
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Custom Alert Component */}
      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
        autoClose={true}
        duration={2000}
      />
    </SafeAreaView>
  );
}

// ============ STYLES ============
const styles = StyleSheet.create({
  // ============ BASE STYLES ============
  safeArea: {
    flex: 1,
    backgroundColor: "#93210A",
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderBottomLeftRadius:18,
    borderBottomRightRadius:18
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
  rightPlaceholder: {
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
  
  // ============ SCROLL CONTENT ============
  // Mobile Scroll
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Tablet Scroll
  scrollContentTablet: {
    paddingBottom: 60,
  },
  
  // ============ FORM ============
  // Mobile Form
  form: {
    padding: 20,
  },
  
  // Tablet Form
  formTablet: {
    paddingHorizontal: isLargeTablet ? 80 : 40,
    paddingVertical: 30,
  },
  
  // ============ LABELS ============
  // Mobile Label
  label: {
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 8,
    fontSize: 15,
  },
  
  // Tablet Label
  labelTablet: {
    fontSize: 18,
    marginBottom: 10,
  },
  
  // ============ INPUT FIELDS ============
  // Mobile Input
  input: {
    borderWidth: 1,
    borderColor: "#93210A",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fff",
  },
  
  // Tablet Input
  inputTablet: {
    fontSize: 17,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  
  // ============ DATE FIELD ============
  // Mobile Date Field
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateText: {
    color: "#333",
    fontSize: 15,
  },
  
  // Tablet Date Field
  dateFieldTablet: {
    gap: 12,
  },
  dateTextTablet: {
    fontSize: 17,
  },
  
  // ============ TEXT AREA ============
  // Mobile Text Area
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  
  // Tablet Text Area
  textAreaTablet: {
    height: 140,
    fontSize: 17,
    paddingTop: 15,
  },
  
  // ============ UPLOAD BUTTON ============
  // Mobile Upload Button
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#93210A",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 15,
  },
  
  // Tablet Upload Button
  uploadButtonTablet: {
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 25,
  },
  uploadTextTablet: {
    fontSize: 18,
    marginLeft: 10,
  },
  
  // ============ IMAGE PREVIEW ============
  // Mobile Image Preview
  previewContainer: {
    marginBottom: 25,
  },
  previewTitle: {
    color: "#93210A",
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 15,
  },
  previewScroll: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  previewImage: {
    width: 100,
    height: 90,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  
  // Tablet Image Preview
  previewTitleTablet: {
    fontSize: 18,
    marginBottom: 15,
  },
  imageContainerTablet: {
    marginRight: 16,
  },
  previewImageTablet: {
    width: 140,
    height: 120,
    borderRadius: 12,
  },
  
  // ============ SUBMIT BUTTON ============
  // Mobile Submit Button
  button: {
    backgroundColor: "#93210A",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  // Tablet Submit Button
  buttonTablet: {
    borderRadius: 12,
    paddingVertical: 20,
    marginTop: 20,
  },
  buttonTextTablet: {
    fontSize: 20,
  },
});