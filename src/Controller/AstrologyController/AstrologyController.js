// src/Controller/AstrologyController/AstrologyController.js
import axios from "axios";
import { getAstrologyTypes } from "../../api/api";

// ✅ Base API URL
const BASE_URL = "https://hdrss-backend.onrender.com/api/astrology";

/**
 * 🔹 Fetch all astrology types (e.g., Planetary Predictions, Horoscope, etc.)
 */
export const fetchAstrologyTypes = async () => {
  try {
    // Try using centralized API helper if available
    const data = await getAstrologyTypes();
    return data;
  } catch (error) {
    console.error("Controller Error fetching astrology types:", error);

    // Axios fallback (in case api/api.js isn't working)
    try {
      const response = await axios.get(`${BASE_URL}/type`);
      return response.data;
    } catch (axiosError) {
      console.error(
        "Axios fallback error fetching astrology types:",
        axiosError
      );
      return [];
    }
  }
};

/**
 * 🔹 Fetch astrology data by Type ID
 * Example: /api/astrology/byType/1
 */
export const fetchAstrologyByType = async (typeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/byType/${typeId}`);
    return response.data; // returns an array
  } catch (error) {
    console.error(
      `Error fetching astrology data for typeId ${typeId}:`,
      error
    );
    return [];
  }
};
