// controller/charityController.js
import { fetchCharities } from "../../api/api";

export const getCharities = async () => {
  try {
    const data = await fetchCharities();
    return data;
  } catch (error) {
    console.error("Error in charity controller:", error);
    return [];
  }
};