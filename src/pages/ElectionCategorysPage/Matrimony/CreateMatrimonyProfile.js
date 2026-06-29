import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Linking,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

const APP_COLOR = "#93210A";
const UPI_ID = "upi://pay?pa=hdrss.in-1@oksbi&pn=Manager&am=101&cu=INR";
const AMOUNT = 101;

const CreateMatrimonyProfile = () => {
  const { userData } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState("");

  const [formData, setFormData] = useState({
    userId: userData?.id || "",
    imageUrl: "",
    jathagamUrl: "",
    name: "",
    gender: "",
    dob: "",
    age: "",
    height: "",
    natchathiram: "",
    raasi: "",
    timeOfBirth: "",
    religion: "",
    caste: "",
    father: "",
    mother: "",
    fatherWork: "",
    motherWork: "",
    address: "",
    district: "",
    motherTongue: "",
    education: "",
    profession: "",
    salary: "",
    workLocation: "",
    preferredAge: "",
    preferredDistrict: "",
    preferredEducation: "",
    phone: "",
    paymentTransactionId: "", // Store transaction ID
    paymentStatus: "pending", // pending, completed
  });

  const [errors, setErrors] = useState({});

  const validateStep = (stepNum) => {
    let newErrors = {};

    switch (stepNum) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        else if (formData.name.length < 2) newErrors.name = "Name must be at least 2 characters";
        
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        if (!formData.age) newErrors.age = "Age is required";
        else if (isNaN(formData.age) || formData.age < 18 || formData.age > 100)
          newErrors.age = "Age must be between 18 and 100";
        
        if (!formData.height) newErrors.height = "Height is required";
        if (!formData.imageUrl) newErrors.imageUrl = "Profile image is required";
        break;

      case 2:
        if (!formData.religion) newErrors.religion = "Religion is required";
        if (!formData.caste) newErrors.caste = "Caste is required";
        break;

      case 3:
        if (!formData.district) newErrors.district = "District is required";
        if (!formData.motherTongue) newErrors.motherTongue = "Mother tongue is required";
        break;

      case 4:
        if (!formData.education) newErrors.education = "Education is required";
        if (!formData.profession) newErrors.profession = "Profession is required";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(formData.phone))
          newErrors.phone = "Enter valid 10-digit phone number";
        break;

      case 5:
        if (!formData.preferredAge) newErrors.preferredAge = "Preferred age range is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key, value) => {
    if (key === "dob") {
      const age = calculateAge(value);
      setFormData({
        ...formData,
        [key]: value,
        age: age.toString(),
      });
    } else {
      setFormData({
        ...formData,
        [key]: value,
      });
    }
    if (errors[key]) {
      setErrors({ ...errors, [key]: null });
    }
  };
  
  const calculateAge = (dobString) => {
    if (!dobString) return "";
    const date = new Date(dobString);
    if (isNaN(date.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age > 0 ? age : "";
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleChange("dob", formattedDate);
    }
  };

  const pickImage = async (imageType) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "You need to allow gallery access to upload images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setUploadingImages(true);
      
      const asset = result.assets[0];
      const uploadFormData = new FormData();
      uploadFormData.append("file", {
        uri: asset.uri,
        type: "image/jpeg",
        name: asset.fileName || `${imageType}_${Date.now()}.jpg`,
      });

      try {
        const res = await axios.post("https://hdrss-backend.onrender.com/api/upload", uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        if (res.data.fileUrl) {
          handleChange(imageType, res.data.fileUrl);
          Alert.alert("Success", `${imageType === "imageUrl" ? "Profile" : "Jathagam"} image uploaded successfully`);
        } else {
          Alert.alert("Error", "Failed to get image URL from server");
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        Alert.alert("Error", "Failed to upload image. Please try again.");
      } finally {
        setUploadingImages(false);
      }
    }
  };

  // Initialize UPI Payment
  const initiatePayment = () => {
    setShowPaymentModal(true);
    setPaymentStatus("pending");
  };

  // Open UPI App
  const openUpiApp = () => {
    const upiUrl = `upi://pay?pa=hdrss.in-1@oksbi&pn=Manager&am=101&cu=INR`;
    
    Linking.openURL(upiUrl).catch(() => {
      // Fallback: Show manual payment instructions
      Alert.alert(
        "UPI App Not Found",
        `Please manually transfer ₹${AMOUNT} to UPI ID: ${UPI_ID}\n\nAfter payment, enter the Transaction ID below.`,
        [{ text: "OK", onPress: () => setPaymentStatus("manual") }]
      );
    });
  };

  // Verify and confirm payment
  const confirmPayment = async () => {
    if (!transactionId.trim()) {
      Alert.alert("Error", "Please enter the Transaction ID");
      return;
    }

    setPaymentStatus("verifying");
    
    // Here you can optionally verify the transaction with your backend
    // For now, we'll accept it and proceed
    
    try {
      // Optional: Verify transaction with backend
      // const verifyRes = await axios.post("https://your-backend.com/api/verify-payment", {
      //   transactionId,
      //   amount: AMOUNT,
      //   upiId: UPI_ID
      // });
      
      // For demo, we'll just accept
      handleChange("paymentTransactionId", transactionId);
      handleChange("paymentStatus", "completed");
      setPaymentStatus("success");
      
      setTimeout(() => {
        setShowPaymentModal(false);
        createProfile();
      }, 1500);
      
    } catch (error) {
      Alert.alert("Verification Failed", "Could not verify payment. Please try again or contact support.");
      setPaymentStatus("failed");
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      Alert.alert("Validation Error", "Please fill all required fields correctly");
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const createProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.17:5000/api/matrimony/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success", 
          "Profile created successfully! Your registration is complete."
        );
        // Reset form
        setFormData({
          userId: userData?.id || "",
          imageUrl: "",
          jathagamUrl: "",
          name: "",
          gender: "",
          dob: "",
          age: "",
          height: "",
          natchathiram: "",
          raasi: "",
          timeOfBirth: "",
          religion: "",
          caste: "",
          father: "",
          mother: "",
          fatherWork: "",
          motherWork: "",
          address: "",
          district: "",
          motherTongue: "",
          education: "",
          profession: "",
          salary: "",
          workLocation: "",
          preferredAge: "",
          preferredDistrict: "",
          preferredEducation: "",
          phone: "",
          paymentTransactionId: "",
          paymentStatus: "pending",
        });
        setStep(1);
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Network Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWithPayment = () => {
    if (validateStep(5)) {
      if (!formData.imageUrl) {
        Alert.alert("Error", "Please upload a profile image");
        return;
      }
      // Show payment modal instead of direct submission
      initiatePayment();
    }
  };

  const renderImageUploadSection = () => (
    <View style={styles.imageUploadContainer}>
      <Text style={styles.sectionSubtitle}>Profile Image *</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickImage("imageUrl")}
        disabled={uploadingImages}
      >
        {uploadingImages ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>
            {formData.imageUrl ? "Change Profile Image" : "Upload Profile Image"}
          </Text>
        )}
      </TouchableOpacity>
      {formData.imageUrl ? (
        <Text style={styles.uploadSuccess}>✓ Image uploaded successfully</Text>
      ) : null}
      {errors.imageUrl && <Text style={styles.errorText}>{errors.imageUrl}</Text>}

      <Text style={[styles.sectionSubtitle, { marginTop: 15 }]}>Jathagam Image (Optional)</Text>
      <TouchableOpacity
        style={[styles.uploadButton, styles.secondaryButton]}
        onPress={() => pickImage("jathagamUrl")}
        disabled={uploadingImages}
      >
        {uploadingImages ? (
          <ActivityIndicator color={APP_COLOR} />
        ) : (
          <Text style={[styles.uploadButtonText, styles.secondaryButtonText]}>
            {formData.jathagamUrl ? "Change Jathagam Image" : "Upload Jathagam Image"}
          </Text>
        )}
      </TouchableOpacity>
      {formData.jathagamUrl ? (
        <Text style={styles.uploadSuccess}>✓ Jathagam uploaded successfully</Text>
      ) : null}
    </View>
  );

  const renderInput = (placeholder, key, options = {}) => (
    <View style={styles.inputWrapper}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={[styles.input, errors[key] && styles.inputError]}
        value={formData[key]}
        onChangeText={(text) => handleChange(key, text)}
        keyboardType={options.keyboardType || "default"}
        secureTextEntry={options.secureTextEntry || false}
        editable={!options.disabled}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.heading}>Basic Details</Text>
      {renderImageUploadSection()}
      {renderInput("Full Name", "name")}
      {renderInput("Gender (Male/Female/Other)", "gender")}
      
      {/* Date of Birth with DatePicker */}
      <View style={styles.inputWrapper}>
        <TouchableOpacity 
          style={[styles.input, styles.dateInput]} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={formData.dob ? styles.dateText : styles.placeholderText}>
            {formData.dob || "Select Date of Birth"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.dob ? new Date(formData.dob) : new Date(2000, 0, 1)}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
        {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
      </View>
      
      {renderInput("Age", "age", { keyboardType: "numeric", disabled: true })}
      {renderInput("Height (cm)", "height", { keyboardType: "numeric" })}
      
      <TouchableOpacity style={styles.button} onPress={nextStep}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.heading}>Horoscope & Religious Details</Text>
      {renderInput("Natchathiram (Birth Star)", "natchathiram")}
      {renderInput("Raasi (Zodiac)", "raasi")}
      {renderInput("Time of Birth (HH:MM)", "timeOfBirth")}
      {renderInput("Religion", "religion")}
      {renderInput("Caste/Community", "caste")}
      <View style={styles.row}>
        <TouchableOpacity style={styles.smallButton} onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.heading}>Family & Location Details</Text>
      {renderInput("Father's Name", "father")}
      {renderInput("Mother's Name", "mother")}
      {renderInput("Father's Occupation", "fatherWork")}
      {renderInput("Mother's Occupation", "motherWork")}
      {renderInput("Full Address", "address")}
      {renderInput("District", "district")}
      {renderInput("Mother Tongue", "motherTongue")}
      <View style={styles.row}>
        <TouchableOpacity style={styles.smallButton} onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.heading}>Professional & Contact Details</Text>
      {renderInput("Highest Education", "education")}
      {renderInput("Profession / Job Title", "profession")}
      {renderInput("Annual Salary (Lakhs)", "salary", { keyboardType: "numeric" })}
      {renderInput("Work Location", "workLocation")}
      {renderInput("Phone Number", "phone", { keyboardType: "phone-pad" })}
      <View style={styles.row}>
        <TouchableOpacity style={styles.smallButton} onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={nextStep}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View>
      <Text style={styles.heading}>Partner Preferences</Text>
      {renderInput("Preferred Age Range (e.g., 25-30)", "preferredAge")}
      {renderInput("Preferred District", "preferredDistrict")}
      {renderInput("Preferred Education Level", "preferredEducation")}
      
      {/* Payment Info */}
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentTitle}>Registration Fee: ₹{AMOUNT}</Text>
        <Text style={styles.paymentSubtitle}>UPI ID: {UPI_ID}</Text>
      </View>
      
      <View style={styles.row}>
        <TouchableOpacity style={styles.smallButton} onPress={prevStep}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.smallButton, loading && styles.disabledButton]}
          onPress={handleSubmitWithPayment}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Processing..." : `Pay ₹${AMOUNT} & Submit`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Payment Modal
  const renderPaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => !paymentStatus === "verifying" && setShowPaymentModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Complete Payment</Text>
          
          {paymentStatus === "pending" && (
            <>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentAmount}>₹{AMOUNT}</Text>
                <Text style={styles.paymentUpi}>UPI ID: {UPI_ID}</Text>
              </View>
              
              <TouchableOpacity style={styles.payButton} onPress={openUpiApp}>
                <Text style={styles.payButtonText}>Pay with UPI App</Text>
              </TouchableOpacity>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <TextInput
                style={styles.transactionInput}
                placeholder="Enter Transaction ID after payment"
                value={transactionId}
                onChangeText={setTransactionId}
              />
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={confirmPayment}
              >
                <Text style={styles.confirmButtonText}>Confirm Payment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          
          {paymentStatus === "verifying" && (
            <View style={styles.verifyingContainer}>
              <ActivityIndicator size="large" color={APP_COLOR} />
              <Text style={styles.verifyingText}>Verifying Payment...</Text>
            </View>
          )}
          
          {paymentStatus === "success" && (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successText}>Payment Successful!</Text>
              <Text style={styles.successSubtext}>Creating your profile...</Text>
            </View>
          )}
          
          {paymentStatus === "failed" && (
            <View style={styles.failedContainer}>
              <Text style={styles.failedIcon}>✗</Text>
              <Text style={styles.failedText}>Payment Verification Failed</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => setPaymentStatus("pending")}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Matrimony Profile</Text>
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                step >= s && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.step}>Step {step} of 5</Text>
      </View>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      
      {renderPaymentModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: APP_COLOR,
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: APP_COLOR,
    width: 20,
  },
  step: {
    fontSize: 14,
    color: "#666",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: APP_COLOR,
    paddingLeft: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 52,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  dateInput: {
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  button: {
    backgroundColor: APP_COLOR,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: APP_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  smallButton: {
    backgroundColor: APP_COLOR,
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 6,
    shadowColor: APP_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 50,
  },
  imageUploadContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  uploadButton: {
    backgroundColor: APP_COLOR,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: APP_COLOR,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryButtonText: {
    color: APP_COLOR,
  },
  uploadSuccess: {
    color: "#28a745",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
  },
  paymentInfo: {
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: APP_COLOR,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: APP_COLOR,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: APP_COLOR,
    marginBottom: 20,
  },
  paymentDetails: {
    alignItems: "center",
    marginBottom: 20,
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: APP_COLOR,
  },
  paymentUpi: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  payButton: {
    backgroundColor: APP_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#999",
  },
  transactionInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 14,
    width: "100%",
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
  },
  verifyingContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  verifyingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  successIcon: {
    fontSize: 60,
    color: "#28a745",
    marginBottom: 15,
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 5,
  },
  successSubtext: {
    fontSize: 14,
    color: "#666",
  },
  failedContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  failedIcon: {
    fontSize: 60,
    color: "#ff4444",
    marginBottom: 15,
  },
  failedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff4444",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: APP_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CreateMatrimonyProfile;