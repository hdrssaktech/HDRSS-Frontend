// src/Controller/DistrictController/controller.js
import { fetchAPI, getPlacesByCategory } from "../../api/api";

/* ---------------------------
   🏙️ District APIs
---------------------------- */

// ✅ Fetch all districts
export const getDistricts = async () => {
  try {
    const data = await fetchAPI("/districts");
    return data;
  } catch (error) {
    console.error("❌ Controller Error (getDistricts):", error);
    throw error;
  }
};

// ✅ Fetch single district by ID
export const getDistrictById = async (id) => {
  try {
    const data = await fetchAPI(`/districts/${id}`);
    return data;
  } catch (error) {
    console.error("❌ Controller Error (getDistrictById):", error);
    throw error;
  }
};

/* ---------------------------
   📍 Places by Category APIs
---------------------------- */

//import { getPlacesByCategory } from "../../api/api";

export const fetchPlacesByCategory = async (districtId, category, foodType) => {
  try {
    const places = await getPlacesByCategory(districtId, category, foodType);
    console.log(`✅ ${places.length} places loaded for ${category} (${foodType})`);
    return places;
  } catch (error) {
    console.error("❌ Controller Error (fetchPlacesByCategory):", error);
    return [];
  }
};

