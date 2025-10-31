// src/components/Gallery/controller/galleryController.js
import { getGalleryList } from "../../api/api";

export const fetchGalleryList = async () => {
  try {
    const data = await getGalleryList();
    // optional: sort by date or filter duplicates
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error("❌ Controller Error (fetchGalleryList):", err);
    return [];
  }
};