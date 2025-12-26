// my code 
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation,useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createMember, uploadImage, sendIdCard } from "../../api/api";
import { generateIdCard } from "../../pages/generateIdCard/generateIdCard";

export default function Membership1() {
  const route = useRoute();
  const navigation = useNavigation();
  const { districtName} = route.params || {};
  // console.log("District Name in Member1:", districtName);

  const [categoryType, setCategoryType] = useState("District");
  const [isChecked, setIsChecked] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");          
  const [city, setCity] = useState("");
  const [taluk, setTaluk] = useState("")
  ;
  const [district, setDistrict] = useState(districtName || "");
  const [pin, setPin] = useState("");
  const [education, setEducation] = useState("");
  const [familyMembers, setFamilyMembers] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [professionalDetails, setProfessionalDetails] = useState("");
  const [designation, setDesignation] = useState("");
  const [experience, setExperience] = useState("");

  // 📸 Pick Image
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // 📅 Date Picker
  const onChangeDate = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
      const year = selected.getFullYear();
      const month = (selected.getMonth() + 1).toString().padStart(2, "0");
      const day = selected.getDate().toString().padStart(2, "0");
      setDob(`${year}-${month}-${day}`);
    }
  };

  // 💸 GPay Payment
  const openGPay = () => {
    const upiId = "9345339088@upi";
    const name = "ManagerName";
    const amount = categoryType === "District" ? "100" : "500";
    const url = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

    Linking.openURL(url).catch(() => {
      alert("Please install a UPI payment app to proceed.");
    });
  };

  const handleAadhaarChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.length > 4 && cleaned.length <= 8) {
      formatted = cleaned.slice(0, 4) + " " + cleaned.slice(4);
    } else if (cleaned.length > 8) {
      formatted =
        cleaned.slice(0, 4) +
        " " +
        cleaned.slice(4, 8) +
        " " +
        cleaned.slice(8, 12);
    }

    setAadhaar(formatted);
  };

  const handleContactChange = (text) => {
  const cleaned = text.replace(/[^0-9]/g, ""); // only digits
  if (cleaned.length <= 10) {
    setContact(cleaned);
  }
};

const handlePinChange = (text) => {
  const cleaned = text.replace(/[^0-9]/g, "");
  if (cleaned.length <= 6) {
    setPin(cleaned);
  }
};

const handleEmailChange = (text) => {
  setEmail(text);
};

const handleAddressChange = (text) => {
  setAddress(text);
};

  // ✅ Handle Submit
const handleSubmit = async () => {
  console.warn("🔥 HANDLE SUBMIT CLICKED");

  if (!photo) {
    Alert.alert("Error", "Please upload a photo.");
    return;
  }

  try {
    console.warn("📤 Uploading image");

    const formData = new FormData();
    formData.append("file", {
      uri: photo,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    const uploadRes = await uploadImage(formData);
    console.warn("✅ Image uploaded");

    const imageUrl = uploadRes.fileUrl;

    const memberData = {
      name: name.trim(),
      image: imageUrl,
      bloodGroup: bloodGroup.trim(),
      fatherOrHusbandName: fatherName.trim(),
      dob: dob ? dob.trim() : null,
      residentialAddress: address.trim(),
      cityTown: city.trim(),
      district: district?.trim(),
      taluk: taluk.trim(),
      education: education.trim(),
      pin: pin ? pin.toString() : null,
      familyMembers: Number(familyMembers),
      age: 23,
      email: email.trim(),
      contactDetails: contact.trim(),
      aadharNo: aadhaar.trim(),
      professionalDetails: professionalDetails.trim(),
      designation: designation.trim(),
      experience: experience.trim(),
    };

    console.warn("📨 Creating member");

    const createRes = await createMember(memberData);
    const memberId = createRes.member?.id || createRes.id;
    const memberuniqueId =
      createRes.member?.uniqueId || createRes.uniqueId;

    console.warn("🆔 Member ID:", memberId);

    const pdfUri = await generateIdCard({
      name,
      fatherOrHusbandName: fatherName,
      designation,
      district,
      id: memberId,
      image: imageUrl,
      dob,
      bloodGroup,
      contactDetails: contact,
      residentialAddress: address,
      uniqueId: memberuniqueId,
    });

    console.warn("📄 PDF Generated:", pdfUri);

    const emailResult = await sendIdCard(pdfUri);
    console.warn("📧 Email result:", emailResult);

    Alert.alert(
      emailResult.success ? "Success" : "Failed",
      emailResult.message
    );
  } catch (err) {
    console.error("❌ HANDLE SUBMIT ERROR:", err);
    Alert.alert("Error", err.message);
  }
};
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Membership</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <TouchableOpacity style={styles.formTitleButton}>
            <Text style={styles.formTitleText}>Membership Form</Text>
          </TouchableOpacity>

          {/* Category */}
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                categoryType === "District" && styles.categorySelected,
              ]}
              onPress={() => setCategoryType("District")}
            >
              <Text
                style={[
                  styles.categoryText,
                  categoryType === "District" && styles.categoryTextSelected,
                ]}
              >
                District
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryButton,
                categoryType === "State" && styles.categorySelected,
              ]}
              onPress={() => setCategoryType("State")}
            >
              <Text
                style={[
                  styles.categoryText,
                  categoryType === "State" && styles.categoryTextSelected,
                ]}
              >
                State
              </Text>
            </TouchableOpacity>
          </View>

          {/* Photo Upload */}
          <View style={styles.datePhotoRow}>
            <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photoImage} />
              ) : (
                <>
                  <Icon name="photo-camera" size={28} color="#93210A" />
                  <Text style={styles.photoText}>Upload</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.input} value={name} autoCapitalize="characters" onChangeText={(text)=>setName(text.toUpperCase())} />

          <Text style={styles.label}>Father / Husband Name:</Text>
          <TextInput
            style={styles.input}
            value={fatherName}
            autoCapitalize="characters"
            onChangeText={(text)=>setFatherName(text.toUpperCase())}
          />

          <Text style={styles.label}>Blood Group:</Text>
          <TextInput
            style={styles.input}
            value={bloodGroup}
            autoCapitalize="characters"
            onChangeText={setBloodGroup}
          />

          <Text style={styles.label}>D O B:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.label}>{dob || "Select Date"}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onChangeDate}
            />
          )}

         <Text style={styles.label}>Residential Address:</Text>
          <TextInput
            style={[styles.input, { height: 70, textAlignVertical: "top" }]}
            multiline
            value={address}
            onChangeText={(text)=>handleAddressChange(text.toUpperCase())}
            placeholder="Door No / Street / Area"
            autoCapitalize="characters"
          />


          <Text style={styles.label}>City/Town:</Text>
          <TextInput style={styles.input} value={city} autoCapitalize="characters" onChangeText={(text)=>setCity(text.toUpperCase())} />

          <Text style={styles.label}>Taluk:</Text>
          <TextInput
            style={styles.input}
            value={taluk}
            onChangeText={(text)=>setTaluk(text.toUpperCase())}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>District:</Text>
          <TextInput
            style={styles.input}
            value={district}
            
            onChangeText={setDistrict}
          />
          <Text style={styles.label}>Pin:</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={handlePinChange}
            keyboardType="numeric"
            maxLength={6}
            placeholder="6-digit PIN code"
          />
          <Text style={styles.label}>Education:</Text>
          <TextInput
            style={styles.input}
            value={education}
            onChangeText={(text)=>setEducation(text.toLocaleUpperCase())}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>How many family members:</Text>
          <TextInput
            style={styles.input}
            value={familyMembers}
            onChangeText={setFamilyMembers}
            keyboardType="numeric"
          />

         

          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleEmailChange}
            
            keyboardType="email-address"
            placeholder="example@gmail.com"
          />

        <Text style={styles.label}>Contact Details:</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={handleContactChange}
          keyboardType="numeric"
          maxLength={10}
          placeholder="Enter 10-digit number"
        />

          <Text style={styles.label}>Aadhaar No:</Text>
          <TextInput
            style={styles.input}
            value={aadhaar}
            onChangeText={handleAadhaarChange}
            keyboardType="numeric"
            maxLength={14}
          />

          <Text style={styles.label}>Professional Details:</Text>
          <TextInput
            style={[styles.input, { height: 70, textAlignVertical: "top" }]}
            multiline
            value={professionalDetails}
            onChangeText={(text)=>setProfessionalDetails(text.toLocaleUpperCase())}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Designation:</Text>
          <TextInput
            style={styles.input}
            value={designation}
            onChangeText={(text) => setDesignation(text.toUpperCase())}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Experience:</Text>
          <TextInput
            style={styles.input}
            value={experience}
            onChangeText={setExperience}
          />

          {/* Terms */}
          <Text style={styles.termsHeader}>Terms & Conditions</Text>
          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[styles.customBox, isChecked && styles.customBoxChecked]}
              onPress={() => setIsChecked(!isChecked)}
            >
              {isChecked && <Text style={styles.tick}>✔</Text>}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              I agree to the terms and conditions of membership.
            </Text>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: "#93210A" }]}
            disabled={!isChecked}
            onPress={handleSubmit}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>

          {/* GPay */}
          <TouchableOpacity style={styles.payButton} onPress={openGPay}>
            <Text style={styles.amountText}>
              💰 GPay Amount: ₹{categoryType === "District" ? "100" : "500"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingTop: 50,
    // marginTop: 32,
    backgroundColor: "#93210A",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 90,
  },
  formContainer: { padding: 15, paddingBottom: 20 },
  formTitleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#93210A",
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  formTitleText: {
    color: "#0a0301ff",
    fontWeight: "600",
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#93210A",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 14,
  },
  datePhotoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  photoBox: {
    width: 100,
    height: 120,
    borderWidth: 1,
    borderColor: "#93210A",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  photoText: { fontSize: 12, color: "#555", marginTop: 5 },
  photoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 4,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 20,
  },
  checkboxText: { flex: 1, fontSize: 13, color: "#333", marginLeft: 8 },
  customBox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#93210A",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  customBoxChecked: { backgroundColor: "#93210A" },
  tick: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  termsHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#070606ff",
    marginTop: 20,
    marginBottom: 10,
  },
  sendButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: 200,
    alignSelf: "center",
  },
  sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  payButton: {
    backgroundColor: "#00BFA5",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  amountText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#93210A",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 25,
  },
  categorySelected: {
    backgroundColor: "#93210A",
  },
  categoryText: {
    color: "#93210A",
    fontWeight: "bold",
  },
  categoryTextSelected: {
    color: "#fff",
  },
});
