import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Linking,
  StatusBar,
  Modal,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// IMPORTANT: Update these URLs based on your setup
const API_BASE_URL = "https://hdrss-backend.onrender.com";
const FORM_SUBMIT_URL = "https://hdrss-backend.onrender.com/api/CaucusForm";

export default function PremiumBusinessForm() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    age: "",
    gender: "",
    type: "",
    address: "",
    phone: "",
  });

  const [imageUri, setImageUri] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);

  // Options for dropdowns
  const genderOptions = [
    { label: "Male", icon: "male" },
    { label: "Female", icon: "female" },
    { label: "Other", icon: "person" },
  ];

  const typeOptions = [
    { label: "Individual", icon: "person-outline" },
    { label: "Business", icon: "briefcase-outline" },
    { label: "Organization", icon: "business-outline" },
    { label: "Student", icon: "school-outline" },
    { label: "Professional", icon: "ribbon-outline" },
  ];

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Auto-calculate age from DOB
    if (field === "dob") {
      calculateAge(value);
    }
  };

  const calculateAge = (dob) => {
    if (dob.length === 10) {
      const [day, month, year] = dob.split("/");
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  };

  const formatDOB = (text) => {
    // Remove non-numeric characters
    let cleaned = text.replace(/[^\d]/g, '');

    // Format as DD/MM/YYYY
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    } else {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
    }
  };

  const handleDOBChange = (text) => {
    const formatted = formatDOB(text);
    handleChange("dob", formatted);
  };

  // Request permission and pick image
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant camera roll permissions to upload images.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setImageUri(selectedImage.uri);

        // Upload image immediately
        await uploadImage(selectedImage);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Upload image to server
  const uploadImage = async (asset) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      const uriParts = asset.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const file = {
        uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
        type: `image/${fileType}`,
        name: `upload_${Date.now()}.${fileType}`,
      };

      formData.append('file', file);

      const response = await axios({
        method: 'POST',
        url: `${API_BASE_URL}/api/upload`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 60000,
        transformRequest: (data, headers) => {
          return data;
        },
      });

      if (response.data && response.data.fileUrl) {
        setUploadedImageUrl(response.data.fileUrl);
        Alert.alert('Success', 'Image uploaded successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Image upload error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      setImageUri(null);

      let errorMessage = 'Failed to upload image. ';

      if (error.code === 'ECONNABORTED') {
        errorMessage += 'Upload timeout. Please check your internet connection.';
      } else if (error.response) {
        errorMessage += error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage += 'No response from server. Please check:\n1. Your internet connection\n2. Server URL is correct\n3. Server is running';
      } else {
        errorMessage += error.message;
      }

      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Remove selected image
  const removeImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setImageUri(null);
            setUploadedImageUrl(null);
          }
        }
      ]
    );
  };

  // Validate form
  const validateForm = () => {
    const requiredFields = [
      { key: 'name', label: 'Full Name' },
      { key: 'phone', label: 'Mobile Number' },
      { key: 'gender', label: 'Gender' },
      { key: 'type', label: 'Type' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'address', label: 'Address' },
    ];

    for (let field of requiredFields) {
      if (!formData[field.key] || formData[field.key].trim() === '') {
        Alert.alert('Validation Error', `Please fill in ${field.label}`);
        return false;
      }
    }

    // Validate image upload
    if (!uploadedImageUrl) {
      Alert.alert('Validation Error', 'Please upload your image');
      return false;
    }

    // Validate phone
    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
      return false;
    }

    // Validate DOB format and age
    if (formData.dob.length !== 10) {
      Alert.alert('Validation Error', 'Please enter date of birth in DD/MM/YYYY format');
      return false;
    }

    if (!formData.age || parseInt(formData.age) < 18) {
      Alert.alert('Validation Error', 'You must be at least 18 years old to register');
      return false;
    }

    return true;
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD for API
  const formatDateForAPI = (dob) => {
    const [day, month, year] = dob.split("/");
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      Name: formData.name.trim(),
      DateOfBirth: formatDateForAPI(formData.dob),
      Age: parseInt(formData.age),
      Gender: formData.gender,
      Type: formData.type,
      Address: formData.address.trim(),
      MobileNumber: formData.phone,
      image: uploadedImageUrl
    };

    try {
      const response = await axios({
        method: 'POST',
        url: FORM_SUBMIT_URL,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Success!',
          'Your registration has been submitted successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form on success
                setFormData({
                  name: "",
                  dob: "",
                  age: "",
                  gender: "",
                  type: "",
                  address: "",
                  phone: "",
                });
                setImageUri(null);
                setUploadedImageUrl(null);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Form submission error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = 'Failed to submit registration. ';

      if (error.response) {
        errorMessage += error.response.data?.message ||
                       error.response.data?.error ||
                       `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage += 'No response from server. Please check your internet connection.';
      } else {
        errorMessage += error.message;
      }

      Alert.alert('Submission Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPI Payment - no fixed amount, user enters it in their UPI app
  const handleUPIPayment = async () => {
    if (!validateForm()) return;

    const upiURL =
      "upi://pay?pa=hdrss.in-1@oksbi&pn=Manager&cu=INR";

    try {
      const supported = await Linking.canOpenURL(upiURL);

      if (supported) {
        await Linking.openURL(upiURL);
      } else {
        Alert.alert('Error', 'No UPI app found on your device');
      }
    } catch (error) {
      console.error('UPI payment error:', error);
      Alert.alert('Error', 'Failed to open UPI payment app');
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#7f1d1d" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View style={styles.backCircle}>
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </View>
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            isTablet && styles.headerTitleTablet,
          ]}
        >
          CAUCUS Registration
        </Text>

        <Text style={styles.headerSubtitle}>
          Complete your registration details
        </Text>
      </View>

      {/* CARD */}
      <View style={[styles.card, isTablet && styles.cardTablet]}>

        {/* Image Upload Section */}
        <Text style={styles.label}>Profile Image *</Text>
        <View style={styles.imageUploadContainer}>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </View>
              )}
              {!isUploading && (
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removeImage}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={32} color="#a72828" />
                </TouchableOpacity>
              )}
              {uploadedImageUrl && !isUploading && (
                <View style={styles.uploadSuccessBadge}>
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                </View>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={pickImage}
              activeOpacity={0.7}
              disabled={isUploading}
            >
              <Ionicons name="camera" size={40} color="#a72828" />
              <Text style={styles.imageUploadText}>Tap to upload image</Text>
              <Text style={styles.imageUploadSubtext}>JPG, PNG (Max 5MB)</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Full Name */}
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          placeholder="Enter your full name"
          placeholderTextColor="#999"
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
          editable={!isSubmitting}
        />

        {/* Mobile Number */}
        <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          placeholder="Enter 10-digit mobile number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
          maxLength={10}
          editable={!isSubmitting}
        />

        {/* Gender */}
        <Text style={styles.label}>Gender *</Text>
        <TouchableOpacity
          style={styles.selectInput}
          onPress={() => !isSubmitting && setShowGenderModal(true)}
          disabled={isSubmitting}
        >
          <Text style={formData.gender ? styles.selectedText : styles.placeholderText}>
            {formData.gender || "Select gender"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Type */}
        <Text style={styles.label}>Type *</Text>
        <TouchableOpacity
          style={styles.selectInput}
          onPress={() => !isSubmitting && setShowTypeModal(true)}
          disabled={isSubmitting}
        >
          <Text style={formData.type ? styles.selectedText : styles.placeholderText}>
            {formData.type || "Select type"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* DOB */}
        <Text style={styles.label}>Date of Birth *</Text>
        <TextInput
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#999"
          style={styles.input}
          value={formData.dob}
          onChangeText={handleDOBChange}
          keyboardType="numeric"
          maxLength={10}
          editable={!isSubmitting}
        />

        {/* Address */}
        <Text style={styles.label}>Address *</Text>
        <TextInput
          placeholder="Enter your complete address"
          placeholderTextColor="#999"
          style={[styles.input, styles.textArea]}
          multiline
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
          editable={!isSubmitting}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (
            <View style={styles.buttonLoading}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={[styles.buttonText, { marginLeft: 10 }]}>Submitting...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Submit Registration</Text>
          )}
        </TouchableOpacity>

        {/* PRICE BOX */}
        <View style={styles.priceBox}>
          <Text style={styles.priceTitle}>Premium Listing Fee</Text>
          <Text style={styles.priceSubText}>
            One-time featured business registration
          </Text>
        </View>

        {/* PAYMENT BUTTON */}
        <TouchableOpacity
          style={[styles.paymentButton, (isSubmitting || isUploading) && styles.disabledButton]}
          activeOpacity={0.85}
          onPress={handleUPIPayment}
          disabled={isSubmitting || isUploading}
        >
          <Text style={styles.buttonText}>Pay on UPI</Text>
        </TouchableOpacity>
      </View>

      {/* Gender Selection Modal - Centered */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowGenderModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {genderOptions.map((option) => {
              const isSelected = formData.gender === option.label;
              return (
                <TouchableOpacity
                  key={option.label}
                  style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                  onPress={() => {
                    handleChange("gender", option.label);
                    setShowGenderModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}
                  >
                    {option.label}
                  </Text>
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioCircleInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Type Selection Modal - Centered */}
      <Modal
        visible={showTypeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTypeModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Type</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowTypeModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {typeOptions.map((option) => {
              const isSelected = formData.type === option.label;
              return (
                <TouchableOpacity
                  key={option.label}
                  style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                  onPress={() => {
                    handleChange("type", option.label);
                    setShowTypeModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}
                  >
                    {option.label}
                  </Text>
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioCircleInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f4f4",
    flexGrow: 1,
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    backgroundColor: "#7f1d1d",
    paddingTop: 60,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: 60,
    left: 16,
    zIndex: 10,
  },

 

  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },

  headerTitleTablet: {
    fontSize: 34,
  },

  headerSubtitle: {
    color: "#f3d0d0",
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    letterSpacing: 0.3,
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: -20,
    borderRadius: 25,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  cardTablet: {
    marginHorizontal: 80,
    padding: 35,
  },

  /* IMAGE UPLOAD */
  imageUploadContainer: {
    marginBottom: 10,
  },

  imageUploadButton: {
    backgroundColor: "#fafafa",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderStyle: "dashed",
    borderRadius: 14,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  imageUploadText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  imageUploadSubtext: {
    marginTop: 6,
    fontSize: 13,
    color: "#999",
  },

  imagePreviewContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  imagePreview: {
    width: "100%",
    height: 250,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
  },

  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  uploadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  uploadSuccessBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 2,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  /* LABEL */
  label: {
    color: "#222",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 18,
  },

  /* INPUT */
  input: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111",
  },

  textArea: {
    height: 110,
    textAlignVertical: "top",
  },

  /* SELECT INPUT (Gender / Type) - Full width like other fields */
  selectInput: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  placeholderText: {
    color: "#999",
    fontSize: 16,
  },

  selectedText: {
    color: "#111",
    fontSize: 16,
  },

  /* MODAL - Centered Dialog */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },

  modalCloseButton: {
    backgroundColor: "#f4f4f4",
    borderRadius: 14,
    padding: 6,
  },

  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
  },

  modalOptionSelected: {
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#f3caca",
  },

  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#d9c2c2",
    alignItems: "center",
    justifyContent: "center",
  },

  radioCircleSelected: {
    borderColor: "#a72828",
  },

  radioCircleInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#a72828",
  },

  modalOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  modalOptionTextSelected: {
    color: "#7f1d1d",
    fontWeight: "700",
  },

  /* PRICE BOX */
  priceBox: {
    backgroundColor: "#fff5f5",
    marginTop: 30,
    paddingVertical: 24,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f3caca",
  },

  priceTitle: {
    color: "#7f1d1d",
    fontSize: 16,
    fontWeight: "700",
  },

  priceSubText: {
    color: "#777",
    marginTop: 8,
    fontSize: 13,
  },

  /* BUTTONS */
  submitButton: {
    backgroundColor: "#1f1f1f",
    paddingVertical: 17,
    marginTop: 30,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  paymentButton: {
    backgroundColor: "#a72828",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  buttonLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
});