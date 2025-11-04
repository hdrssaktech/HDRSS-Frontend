// src/Controller/ComplaintController/ComplaintController.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://hdrss-backend.onrender.com/api";
// const BASE_URL = "http://localhost:5000/api";

// ✅ LOGIN
export const handleLogin = async (phoneNumber, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, password }),
    });

    const res = await response.json();
    if (response.ok && res.token) {
      await AsyncStorage.setItem("authToken", res.token);
      return true;
    } else {
      throw new Error(res.message || "Invalid login");
    }
  } catch (err) {
    console.error("Login Error:", err);
    return false;
  }
};

// ✅ FETCH COMPLAINTS
export const fetchComplaints = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await fetch(`${BASE_URL}/complaints`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch complaints");
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Fetch Complaints Failed:", err);
    throw err;
  }
};

// ✅ CREATE COMPLAINT
export const createComplaint = async (complaintData) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await fetch(`${BASE_URL}/complaints/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(complaintData),
    });

    const res = await response.json();
    if (!response.ok) throw new Error(res.message || "Complaint submission failed");
    return res; // contains message + complaint
  } catch (err) {
    console.error("Create Complaint Error:", err);
    throw err;
  }
};



import axios from "axios";
//import AsyncStorage from "@react-native-async-storage/async-storage";
// ✅ Fetch reviews by complaintId
export const fetchReviewsByComplaintId = async (complaintId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/reviews/${complaintId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Reviews Response:", res.data);
    return res.data; // Expecting array of reviews
  } catch (error) {
    console.error("❌ Error fetching reviews:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Add Review (includes user name, address, and date)
export const addReview = async (complaintId, rating, comment) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const userData = await AsyncStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : {};

    const payload = {
      complaintId,
      rating,
      comment,
      userName: user?.name || "Anonymous",
      address: user?.address || "Not Provided",
      date: new Date().toISOString(),
    };

    const res = await axios.post(`${BASE_URL}/reviews`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Review added:", res.data);
    return res.data; // Expecting { message, review }
  } catch (error) {
    console.error("❌ Error adding review:", error.response?.data || error.message);
    throw error;
  }
};
