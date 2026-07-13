// Controller/NewsController/NewsController.js

const API_URL =
  "https://newsdata.io/api/1/latest?apikey=pub_7709c3a1849a4a83af66dc32b61477dc&country=in&language=en&q=Coimbatore";

export const fetchNews = async () => {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    // Check if response is successful and has results
    if (json.status !== "success" || !Array.isArray(json.results)) {
      console.log("API response error or no results");
      return [];
    }

    // 🔹 Drop duplicate articles (articles where duplicate === true)
    const uniqueResults = json.results.filter((item) => {
      return !item.duplicate;
    });

    if (uniqueResults.length === 0) {
      console.log("No unique articles found after duplicate filtering");
      return [];
    }

    // 🔹 Normalize API data into the shape our screens expect
    const normalized = uniqueResults.map((item, index) => {
      // pubDate looks like "2026-07-06 18:13:04" -> take only date part
      const dateOnly = item.pubDate ? item.pubDate.split(" ")[0] : "";

      // category is an array e.g. ["politics", "top"] -> use first as the display type
      const primaryCategory =
        Array.isArray(item.category) && item.category.length > 0
          ? item.category[0]
          : "General";

      return {
        id: item.article_id || String(index),
        title: item.title || "No Title",
        description: item.description || "No description available",
        image: item.image_url || null,
        date: dateOnly,
        type: primaryCategory,
        categories: Array.isArray(item.category) ? item.category : ["general"],
        videoLink: item.video_url || null,
        link: item.link || null,
        sourceName: item.source_name || "Unknown Source",
        orderNo: index,
      };
    });

    return normalized;
  } catch (error) {
    console.log("fetchNews error:", error);
    return [];
  }
};