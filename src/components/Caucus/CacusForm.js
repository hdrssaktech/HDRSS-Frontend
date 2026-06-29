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

// IMPORTANT: Update these URLs based on your setup
const API_BASE_URL = "https://hdrss-backend.onrender.com";
const FORM_SUBMIT_URL = "https://hdrss-backend.onrender.com/api/CaucusForm";

export default function PremiumBusinessForm() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    dob: "",
    age: "",
    gender: "",
    type: "",
    qualification: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
  });

  const [imageUri, setImageUri] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);

  // Options for dropdowns
  const genderOptions = ["Male", "Female", "Other"];
  const typeOptions = ["Individual", "Business", "Organization", "Student", "Professional"];

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
        quality: 0.7, // Reduced quality for better upload
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

  // Upload image to server - FIXED VERSION
  const uploadImage = async (asset) => {
    setIsUploading(true);
    
    try {
      // Create FormData with proper configuration
      const formData = new FormData();
      
      // Get file extension
      const uriParts = asset.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      const file = {
        uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
        type: `image/${fileType}`, // Dynamic type based on file
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
        timeout: 60000, // 60 seconds
        transformRequest: (data, headers) => {
          // Return formData as-is, don't transform
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
      
      setImageUri(null); // Clear the local image on failure
      
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
      { key: 'fatherName', label: 'Father Name' },
      { key: 'dob', label: 'Date of Birth' },
      { key: 'gender', label: 'Gender' },
      { key: 'type', label: 'Type' },
      { key: 'qualification', label: 'Qualification' },
      { key: 'address', label: 'Address' },
      { key: 'district', label: 'District' },
      { key: 'state', label: 'State' },
      { key: 'pincode', label: 'Pincode' },
      { key: 'phone', label: 'Mobile Number' },
      { key: 'email', label: 'Email Address' }
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
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    
    // Validate phone
    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
      return false;
    }
    
    // Validate pincode
    if (formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode)) {
      Alert.alert('Validation Error', 'Please enter a valid 6-digit pincode');
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
      FatherName: formData.fatherName.trim(),
      DateOfBirth: formatDateForAPI(formData.dob),
      Age: parseInt(formData.age),
      Gender: formData.gender,
      Type: formData.type,
      Qualification: formData.qualification.trim(),
      Address: `${formData.address.trim()}, ${formData.district.trim()}, ${formData.state.trim()}`,
      Pincode: formData.pincode,
      MobileNumber: formData.phone,
      EmailAddress: formData.email.trim().toLowerCase(),
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
                  fatherName: "",
                  dob: "",
                  age: "",
                  gender: "",
                  type: "",
                  qualification: "",
                  address: "",
                  district: "",
                  state: "",
                  pincode: "",
                  phone: "",
                  email: "",
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

  // UPI Payment
  const handleUPIPayment = async () => {
    if (!validateForm()) return;

    const upiURL =
      "upi://pay?pa=hdrss.in-1@oksbi&pn=Manager&am=25000&cu=INR";

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

        {/* Father Name */}
        <Text style={styles.label}>Father Name *</Text>
        <TextInput
          placeholder="Enter father's name"
          placeholderTextColor="#999"
          style={styles.input}
          value={formData.fatherName}
          onChangeText={(text) => handleChange("fatherName", text)}
          editable={!isSubmitting}
        />

        {/* DOB & Age Row */}
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
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
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              placeholder="Auto-calculated"
              placeholderTextColor="#999"
              style={[styles.input, styles.disabledInput]}
              value={formData.age}
              editable={false}
            />
          </View>
        </View>

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

        {/* Qualification */}
        <Text style={styles.label}>Qualification *</Text>
        <TextInput
          placeholder="Enter your qualification"
          placeholderTextColor="#999"
          style={styles.input}
          value={formData.qualification}
          onChangeText={(text) => handleChange("qualification", text)}
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

        {/* District & State Row */}
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>District *</Text>
            <TextInput
              placeholder="Enter district"
              placeholderTextColor="#999"
              style={styles.input}
              value={formData.district}
              onChangeText={(text) => handleChange("district", text)}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              placeholder="Enter state"
              placeholderTextColor="#999"
              style={styles.input}
              value={formData.state}
              onChangeText={(text) => handleChange("state", text)}
              editable={!isSubmitting}
            />
          </View>
        </View>

        {/* Pincode */}
        <Text style={styles.label}>Pincode *</Text>
        <TextInput
          placeholder="Enter 6-digit pincode"
          placeholderTextColor="#999"
          style={styles.input}
          value={formData.pincode}
          onChangeText={(text) => handleChange("pincode", text)}
          keyboardType="numeric"
          maxLength={6}
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

        {/* Email */}
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          placeholder="Enter email address"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
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
          {/* <Text style={styles.price}>₹25,000</Text> */}
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

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  handleChange("gender", option);
                  setShowGenderModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
                {formData.gender === option && (
                  <Ionicons name="checkmark" size={24} color="#a72828" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Type Selection Modal */}
      <Modal
        visible={showTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTypeModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Type</Text>
            {typeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  handleChange("type", option);
                  setShowTypeModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{option}</Text>
                {formData.type === option && (
                  <Ionicons name="checkmark" size={24} color="#a72828" />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
  },

  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  headerTitleTablet: {
    fontSize: 36,
  },

  headerSubtitle: {
    color: "#f3d0d0",
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
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

  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },

  /* ROW LAYOUT */
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfWidth: {
    width: "48%",
  },

  /* SELECT INPUT */
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

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 20,
    textAlign: "center",
  },

  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  modalOptionText: {
    fontSize: 17,
    color: "#333",
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

  price: {
    color: "#a72828",
    fontSize: 40,
    fontWeight: "900",
    marginTop: 10,
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