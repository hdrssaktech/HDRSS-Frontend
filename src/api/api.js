// src/api/api.js
import axios from "axios";
import * as FileSystem from "expo-file-system";

const BASE_URL = "https://hdrss-backend.onrender.com/api";
// const BASE_URL = "http://192.168.1.3:5000/api"
/* ---------------------------
   🧩 Common Fetch Wrapper
---------------------------- */
export const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

/* ---------------------------
   🧍 Auth APIs
---------------------------- */
export const signupApi = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Signup failed");
    return data;
  } catch (error) {
    console.error("Signup API Error:", error);
    throw error;
  }
};

export const loginApi = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};

export const getProfileApi = async (token) => {
  const res = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};


/* ---------------------------
   🏙️ District Places by Category
---------------------------- */
//import axios from "axios";

//const BASE_URL = "https://hdrss-backend.onrender.com/api";

export const getPlacesByCategory = async (districtId, categoryName, foodType) => {
  try {
    // ✅ Normalize category & foodType
    const formattedCategory = encodeURIComponent(categoryName.toLowerCase().trim());
    const formattedFoodType = foodType ? encodeURIComponent(foodType.toLowerCase().trim()) : "";

    // ✅ Build URL
    let url = `${BASE_URL}/districts/${districtId}/places/category/${formattedCategory}`;
    if (formattedFoodType) url += `/${formattedFoodType}`;

    console.log("🌐 Fetching from:", url);

    // ✅ Try fetching data
    const response = await axios.get(url);

    // ✅ Extract and return array safely
    if (response?.data) {
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data.data)) return response.data.data;
      if (Array.isArray(response.data.places)) return response.data.places;
    }

    console.warn("⚠️ Unexpected response structure:", response.data);
    return [];
  } catch (error) {
    // ✅ Handle 404 gracefully (no crash)
    if (error.response?.status === 404) {
      console.warn(`⚠️ No data found for ${foodType || categoryName}. Returning empty list.`);
      return []; // return empty array so UI shows "No Data" text
    } else {
      console.error("❌ API Error (getPlacesByCategory):", error.message);
      return []; // also safe return for any other error
    }
  }
};



/* ---------------------------
   🏛️ Single Place Details
---------------------------- */
export const getPlaceDetails = async (districtId, categoryName, placeId) => {
  try {
    const url = `${BASE_URL}/districts/${districtId}/places/category/${encodeURIComponent(
      categoryName
    )}/${placeId}`;

    console.log("🌐 Fetching place details from:", url);
    const response = await axios.get(url);

    // ✅ Handle different data shapes
    if (response.data?.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    } else {
      console.warn("⚠️ Empty response for place details");
      return null;
    }
  } catch (error) {
    console.error("❌ API Error (getPlaceDetails):", error);
    throw error;
  }
};

/* ---------------------------
   🖼️ Image Upload
---------------------------- */
export const uploadImage = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/* ---------------------------
   💝 Charities
---------------------------- */
export const fetchCharities = async () => {
  try {
    const response = await fetch(`${BASE_URL}/charity`);
    if (!response.ok) throw new Error("Failed to fetch charity data");
    return await response.json();
  } catch (error) {
    console.error("❌ Error fetching charities:", error);
    throw error;
  }
};

/* ---------------------------
   🖼️ Gallery
---------------------------- */
export const getGalleryList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/gallery`);
    return response.data;
  } catch (error) {
    console.error("❌ API Error (getGalleryList):", error);
    throw error;
  }
};

/* ---------------------------
   🎉 Events
---------------------------- */
export const fetchEvents = async () => {
  try {
    const response = await fetch(`${BASE_URL}/events`);
    if (!response.ok) throw new Error("Failed to fetch events");
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    return [];
  }
};


//Complaints

//import axios from "axios";

//const BASE_URL = "https://hdrss-backend.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Login
export const loginUser = async (phoneNumber, password) => {
  const response = await api.post("/auth/login", { phoneNumber, password });
  return response.data;
};

// ✅ Get Complaints
export const getComplaints = async (token) => {
  const response = await api.get("/complaints", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



// // members
// export const getMembers = async () => {
//   try {
//    const response = await axios.get(`${BASE_URL}/members`);

//     return response.data; // assuming API returns array of members
//   } catch (error) {
//     console.error("Error fetching members:", error);
//     return [];
//   }
// };




//import axios from "axios";

//const BASE_URL = "https://hdrss-backend.onrender.com/api";

// ✅ Get all members
export const getMembers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/members`);
    return response.data;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
};

export const createMember = async (memberData) => {
  try {
    const res = await axios.post(`${BASE_URL}/members`, memberData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export const sendIdCard = async (pdfUri) => {
  try {
    const formData = new FormData();

    formData.append("file", {
      uri: pdfUri,
      name: "idcard.pdf",
      type: "application/pdf",
    });

    formData.append("subject", "New HDRSS Member ID Card");

    const response = await fetch(
      "https://hdrss-backend.onrender.com/api/email/send-pdf",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      }
    );

    const result = await response.json();
    console.log("📧 Email send response:", result);

    if (response.ok) {
      Alert.alert("✅ Email Sent", "The ID card has been emailed!");
    } else {
      Alert.alert("⚠️ Failed", result.message || "Unable to send email.");
    }
  } catch (error) {
    console.error("Error sending email:", error);
    Alert.alert("❌ Error", "Failed to send the PDF email.");
  }
};


// src/API/ElectionAPI.js


export const fetchAllElectionsAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/elections`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching elections:", error);
    throw error;
  }
};

export const fetchElectionByIdAPI = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/elections/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching election by ID:", error);
    throw error;
  }
};


// Astrology


 

export const getAstrologyTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/astrology/type`);
    return response.data;
  } catch (error) {
    console.error("API Error fetching astrology types:", error);
    return [];
  }
};


//Stories


export const getStories = async () => {
  try {
   const response = await axios.get(`${BASE_URL}/story`);

    return response.data;
  } catch (error) {
    console.error("API Error fetching stories:", error);
    return [];
  }
};

//Pooja

// ✅ Fetch all poojas
export const getAllPoojas = async () => {
  const response = await axios.get(`${BASE_URL}/pooja`);
  return response.data;
};

// ✅ Fetch a single pooja by ID
export const getPoojaById = async (id) => {
  const response = await axios.get(`${BASE_URL}/pooja/${id}`);
  return response.data;
};



// ✅ Fetch election banner data
export const fetchElectionBannerAPI = async () => {
  try {
  const response = await axios.get(`${BASE_URL}/add/elections`);
    return response.data; // Return raw data
  } catch (error) {
    console.error("❌ Error fetching election banner API:", error);
    throw error;
  }
};



/* ---------------------------
   🧱 Sidebar Ads
---------------------------- */
export const fetchSidebarAds = async () => {
  try {
    const response = await fetch("https://hdrss-backend.onrender.com/api/add/sidebar");
    if (!response.ok) throw new Error("Failed to fetch sidebar ads");
    const data = await response.json();
    return data; // { id, section, images: [...], videos: [...] }
  } catch (error) {
    console.error("❌ Error fetching sidebar ads:", error);
    return null;
  }
};


// Api/Home banner.js
export const getHomeAdsApi = async () => {
  try {
    const response = await fetch("https://hdrss-backend.onrender.com/api/add/home");
    if (!response.ok) {
      throw new Error("Failed to fetch home ads");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error (Home Ads):", error);
    return null;
  }
};
