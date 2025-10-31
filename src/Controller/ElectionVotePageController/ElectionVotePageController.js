// src/Controller/ElectionController.js
import { fetchAllElectionsAPI, fetchElectionByIdAPI } from "../../api/api";

export const fetchAllElections = async () => {
  return await fetchAllElectionsAPI();
};

export const fetchElectionById = async (id) => {
  return await fetchElectionByIdAPI(id);
};





import axios from "axios";

const BASE_URL = "https://hdrss-backend.onrender.com/api";

// ✅ Fetch all videos
export const fetchAllVideos = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/videos`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    throw error;
  }
};

// ✅ Fetch reviews for a specific video
export const fetchVideoReviews = async (videoId) => {
  try {
    const response = await axios.get(`${BASE_URL}/videoreviews/${videoId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    throw error;
  }
};

// ✅ Post new review
export const postVideoReview = async (videoId, comment, rating) => {
  try {
    const response = await axios.post(`${BASE_URL}/videoreviews/${videoId}`, {
      comment,
      rating,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error posting review:", error);
    throw error;
  }
};




// ✅ src/Controller/ElectionBannerController.js
import { fetchElectionBannerAPI } from "../../api/api";

// ✅ Controller to fetch only images array from API
export const fetchElectionBannerData = async () => {
  try {
    const data = await fetchElectionBannerAPI();

    if (data && Array.isArray(data.images)) {
      return data.images;
    } else {
      console.warn("⚠️ No images found in API response.");
      return [];
    }
  } catch (error) {
    console.error("❌ Error in ElectionBannerController:", error);
    throw error;
  }
};



// ✅ SidebarController.js
//import axios from "axios";

//const BASE_URL = "https://hdrss-backend.onrender.com/api/add";

// 🔹 Fetch Sidebar Ads
export const fetchSidebarAds = async () => {
  try {
  const response = await axios.get(`${BASE_URL}/add/sidebar`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching sidebar ads:", error);
    throw error;
  }
};
