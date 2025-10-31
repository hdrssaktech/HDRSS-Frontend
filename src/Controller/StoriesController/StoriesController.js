// src/Controller/StoryController/StoryController.js
import { getStories } from "../../api/api";

/**
 * 🔹 Fetch all stories through controller
 */
export const fetchStories = async () => {
  try {
    const data = await getStories();
    return data;
  } catch (error) {
    console.error("Controller Error fetching stories:", error);
    return [];
  }
};

export const fetchStoryById = async (id) => {
  try {
    const data = await getStoryById(id);
    return data;
  } catch (error) {
    console.error("Controller Error fetching story by ID:", error);
    return null;
  }
};