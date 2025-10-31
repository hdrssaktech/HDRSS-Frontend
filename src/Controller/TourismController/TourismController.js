// src/Controller/TourismController/TourismController.js
import axios from "axios";

const BASE_URL = "https://hdrss-backend.onrender.com/api/tourism";

/**
 * Fetch all tourism types (e.g., Temple, Beach, Hill, etc.)
 */
export const fetchTourismTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/type`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tourism types:", error);
    throw error;
  }
};

/**
 * Fetch tourism places by type ID
 * @param {number|string} typeId
 */
export const fetchTourismByType = async (typeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/byType/${typeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tourism by type:", error);
    throw error;
  }
};

/**
 * Fetch tourism details by place ID
 * @param {number|string} id
 */
export const fetchTourismById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tourism by ID:", error);
    throw error;
  }
};
