// controllers.js

import { fetchAPI } from "../../api/api";
export const fetchNews = async () => {
  return await fetchAPI("/news"); // 🔹 assuming your API endpoint is /news
};

export const fetchNewsById = async (id) => {
  return await fetchAPI(`/news/${id}`);
};