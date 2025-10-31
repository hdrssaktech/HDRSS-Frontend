// Controller/HomeController/HomeController.js
import { getHomeAdsApi } from "../../api/api";

export const fetchHomeAds = async () => {
  try {
    const data = await getHomeAdsApi();
    if (data && data.images) {
      return data.images; // Return only images array
    } else {
      return [];
    }
  } catch (error) {
    console.error("Controller error (fetchHomeAds):", error);
    return [];
  }
};