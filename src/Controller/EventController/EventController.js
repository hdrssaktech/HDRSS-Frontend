

import { fetchEvents } from "../../api/api";

export const getEvents = async () => {
  try {
    const data = await fetchEvents();
    return data;
  } catch (error) {
    console.error("Controller Error (getEvents):", error);
    return [];
  }
};
