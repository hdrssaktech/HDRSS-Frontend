// src/Controller/PoojaController/PoojaController.js
import { getAllPoojas, getPoojaById } from "../../api/api";

// ✅ Fetch all poojas
export const fetchAllPoojas = async () => {
  try {
    const data = await getAllPoojas();
    return data;
  } catch (error) {
    console.error("Controller Error fetching all poojas:", error);
    return [];
  }
};

// ✅ Fetch single pooja by ID
export const fetchPoojaById = async (id) => {
  try {
    const data = await getPoojaById(id);
    return data;
  } catch (error) {
    console.error(`Controller Error fetching pooja by id ${id}:`, error);
    return null;
  }
};
