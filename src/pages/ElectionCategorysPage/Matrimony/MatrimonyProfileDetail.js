import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const APP_COLOR = "#93210A";
const UPI_ID = "yourupi@bankname"; // Replace with your actual UPI ID
const PREMIUM_AMOUNT = 99; // Amount to unlock full details

const MatrimonyProfileDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { profileId } = route.params;
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [showFullDetails, setShowFullDetails] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
    fetchProfile();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setIsPremium(user.isPremium || false);
      }
    } catch (error) {
      console.error("Error checking premium status:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      
      const response = await axios.get(
        `http://192.168.1.17:5000/api/matrimony/${profileId}`,
      );
      
      if (response.data.success) {
        setProfile(response.data.data);
        // Check if we have full details or limited
        const hasFullDetails = response.data.data.phone || response.data.data.education;
        setShowFullDetails(hasFullDetails);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile details");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = () => {
    setShowPaymentModal(true);
    setPaymentStatus("pending");
  };

  const openUpiApp = () => {
    const upiUrl = `upi://pay?pa=hdrss.in-1@oksbi&pn=Manager&am=25000&cu=INR`;
    
    Linking.openURL(upiUrl).catch(() => {
      Alert.alert(
        "UPI App Not Found",
        `Please manually transfer ₹${PREMIUM_AMOUNT} to UPI ID: ${UPI_ID}\n\nAfter payment, enter the Transaction ID below.`,
        [{ text: "OK", onPress: () => setPaymentStatus("manual") }]
      );
    });
  };

  const confirmPayment = async () => {
    if (!transactionId.trim()) {
      Alert.alert("Error", "Please enter the Transaction ID");
      return;
    }

    setPaymentStatus("verifying");
    
    try {
      // Call your backend to verify payment and upgrade to premium
      const token = await AsyncStorage.getItem("authToken");
      
      const response = await axios.post(
        "http://192.168.1.17:5000/api/matrimony/",
        {
          transactionId,
          amount: PREMIUM_AMOUNT,
          profileId: profileId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        setPaymentStatus("success");
        setIsPremium(true);
        setShowFullDetails(true);
        
        setTimeout(() => {
          setShowPaymentModal(false);
          Alert.alert("Success", "Premium access granted! You can now view full details.");
          fetchProfile(); // Refresh profile with full details
        }, 1500);
      } else {
        throw new Error(response.data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      Alert.alert("Error", error.message || "Failed to verify payment");
      setPaymentStatus("failed");
    }
  };

  const renderLimitedInfo = () => (
    <View style={styles.premiumOverlay}>
      <View style={styles.lockContainer}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.lockTitle}>Full Details Locked</Text>
        <Text style={styles.lockText}>
          Upgrade to Premium to view complete profile information including contact details, horoscope, family background, and more.
        </Text>
        <TouchableOpacity style={styles.unlockButton} onPress={initiatePayment}>
          <Text style={styles.unlockButtonText}>
            Unlock Full Details - ₹{PREMIUM_AMOUNT}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFullDetails = () => (
    <View style={styles.detailsContainer}>
      {/* Personal Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailValue}>{profile.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Age:</Text>
          <Text style={styles.detailValue}>{profile.age}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gender:</Text>
          <Text style={styles.detailValue}>{profile.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Height:</Text>
          <Text style={styles.detailValue}>{profile.height} cm</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>DOB:</Text>
          <Text style={styles.detailValue}>{profile.dob}</Text>
        </View>
      </View>

      {/* Horoscope Details */}
      {(profile.natchathiram || profile.raasi) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horoscope Details</Text>
          {profile.natchathiram && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Natchathiram:</Text>
              <Text style={styles.detailValue}>{profile.natchathiram}</Text>
            </View>
          )}
          {profile.raasi && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Raasi:</Text>
              <Text style={styles.detailValue}>{profile.raasi}</Text>
            </View>
          )}
          {profile.timeOfBirth && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time of Birth:</Text>
              <Text style={styles.detailValue}>{profile.timeOfBirth}</Text>
            </View>
          )}
          {profile.religion && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Religion:</Text>
              <Text style={styles.detailValue}>{profile.religion}</Text>
            </View>
          )}
          {profile.caste && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Caste:</Text>
              <Text style={styles.detailValue}>{profile.caste}</Text>
            </View>
          )}
        </View>
      )}

      {/* Family Details */}
      {(profile.father || profile.mother) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Details</Text>
          {profile.father && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Father:</Text>
              <Text style={styles.detailValue}>{profile.father}</Text>
            </View>
          )}
          {profile.mother && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mother:</Text>
              <Text style={styles.detailValue}>{profile.mother}</Text>
            </View>
          )}
          {profile.fatherWork && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Father's Work:</Text>
              <Text style={styles.detailValue}>{profile.fatherWork}</Text>
            </View>
          )}
          {profile.motherWork && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mother's Work:</Text>
              <Text style={styles.detailValue}>{profile.motherWork}</Text>
            </View>
          )}
        </View>
      )}

      {/* Professional Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Education:</Text>
          <Text style={styles.detailValue}>{profile.education || "Not specified"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Profession:</Text>
          <Text style={styles.detailValue}>{profile.profession || "Not specified"}</Text>
        </View>
        {profile.salary && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Salary:</Text>
            <Text style={styles.detailValue}>₹{profile.salary} LPA</Text>
          </View>
        )}
        {profile.workLocation && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Work Location:</Text>
            <Text style={styles.detailValue}>{profile.workLocation}</Text>
          </View>
        )}
      </View>

      {/* Contact Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Details</Text>
        {profile.phone && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{profile.phone}</Text>
          </View>
        )}
        {profile.address && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{profile.address}</Text>
          </View>
        )}
        {profile.district && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>District:</Text>
            <Text style={styles.detailValue}>{profile.district}</Text>
          </View>
        )}
        {profile.motherTongue && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mother Tongue:</Text>
            <Text style={styles.detailValue}>{profile.motherTongue}</Text>
          </View>
        )}
      </View>

      {/* Partner Preferences */}
      {(profile.preferredAge || profile.preferredDistrict) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partner Preferences</Text>
          {profile.preferredAge && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Preferred Age:</Text>
              <Text style={styles.detailValue}>{profile.preferredAge}</Text>
            </View>
          )}
          {profile.preferredDistrict && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Preferred District:</Text>
              <Text style={styles.detailValue}>{profile.preferredDistrict}</Text>
            </View>
          )}
          {profile.preferredEducation && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Preferred Education:</Text>
              <Text style={styles.detailValue}>{profile.preferredEducation}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderPaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => paymentStatus !== "verifying" && setShowPaymentModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Unlock Full Profile</Text>
          
          {paymentStatus === "pending" && (
            <>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentAmount}>₹{PREMIUM_AMOUNT}</Text>
                <Text style={styles.paymentUpi}>UPI ID: {UPI_ID}</Text>
                <Text style={styles.paymentInfo}>
                  One-time payment to unlock complete profile details including contact information
                </Text>
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
              <Text style={styles.successSubtext}>Unlocking full profile...</Text>
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={APP_COLOR} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: profile.imageUrl }}
          style={styles.profileImage}
        //   defaultSource={require("../../assets/placeholder.png")}
        />
      </View>

      {/* Basic Info (Always Visible) */}
      <View style={styles.basicInfo}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <View style={styles.basicStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.age}</Text>
            <Text style={styles.statLabel}>Years</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.profession || "N/A"}</Text>
            <Text style={styles.statLabel}>Profession</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.district || "N/A"}</Text>
            <Text style={styles.statLabel}>District</Text>
          </View>
        </View>
      </View>

      {/* Full Details or Locked View */}
      {showFullDetails || isPremium ? renderFullDetails() : renderLimitedInfo()}

      {/* Payment Modal */}
      {renderPaymentModal()}
    </ScrollView>
  );
};

export default MatrimonyProfileDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
  },
  imageContainer: {
    width: "100%",
    height: 350,
    backgroundColor: "#e0e0e0",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  basicInfo: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: -20,
    marginHorizontal: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  basicStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: APP_COLOR,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e0e0e0",
  },
  detailsContainer: {
    padding: 15,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: APP_COLOR,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: APP_COLOR,
    paddingLeft: 10,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  premiumOverlay: {
    margin: 15,
  },
  lockContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: APP_COLOR,
    borderStyle: "dashed",
  },
  lockIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  lockTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: APP_COLOR,
    marginBottom: 10,
  },
  lockText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  unlockButton: {
    backgroundColor: APP_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: "100%",
  },
  unlockButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
    fontSize: 36,
    fontWeight: "bold",
    color: APP_COLOR,
  },
  paymentUpi: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  paymentInfo: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
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