// src/Controller/HistoryController.js
import axios from "axios";

const BASE_URL = "https://hdrss-backend.onrender.com/api/history";

// ✅ Fetch all tourism types (HistoryPage1)
export const fetchHistoryTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/type`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tourism types:", error);
    return [];
  }
};

// ✅ Fetch items by type ID (HistoryPage2)
export const fetchHistoryByTypeId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/type/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tourism by type ID:", error);
    return [];
  }
};
