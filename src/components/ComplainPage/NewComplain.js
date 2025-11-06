
/// src/pages/ComplaintPage3.js
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createComplaint } from "../../Controller/ComplaintController/ComplaintController";

export default function ComplaintPage3({ navigation,route }) {
  const { districtName } = route.params || {};
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState(districtName || "");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 📅 Handle date change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  // 📸 Pick images
  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "You need to allow gallery access to upload images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImages(uris);
    }
  };

  // 📨 Submit complaint
  const handleSubmit = async () => {
    if (!title || !description || !address) {
      Alert.alert("Error", "Please fill all required fields");
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
      Alert.alert("Success", "Complaint submitted successfully", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert("Error", "Something went wrong while submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔴 Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Complaint</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.form}>
          {/* Date */}
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View style={[styles.input, styles.dateField]}>
              <Ionicons name="calendar" size={20} color="#93210A" />
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
          />

          {/* Title */}
          <Text style={styles.label}>District</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter complaint District"
            value={title}
            onChangeText={setTitle}
             editable={false}
          />

          {/* Description */}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Enter detailed description about complain"
            multiline
            value={description}
            onChangeText={setDescription}
          />

              {/* Upload Images */}
          <Text style={styles.label}>Upload Images</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
            <Ionicons name="image" size={20} color="#fff" />
            <Text style={styles.uploadText}>Choose Images</Text>
          </TouchableOpacity>

          {/* Preview Images with Remove Button */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((img, idx) => (
              <View key={idx} style={{ position: "relative", marginRight: 10 }}>
                <Image source={{ uri: img }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setImages(images.filter((_, i) => i !== idx))}
                >
                  <Ionicons name="close-circle" size={22} color="#93210A" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Submit */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

//  Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Fixed Header
  header: {
    backgroundColor: "#93210A",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginVertical:34,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

  scrollArea: {
    flex: 1,
  },

  form: {
    padding: 20,
  },
  label: {
    fontWeight: "bold",
    color: "#93210A",
    marginBottom: 9,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#93210A",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    fontSize: 14,
  },
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateText: {
    color: "#333",
    fontSize: 14,
  },

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#93210A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  previewImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#93210A",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
