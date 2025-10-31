export async function getTownsByDistrict(districtId) {
  try {
    const response = await fetch(
      `https://hdrss-backend.onrender.com/api/towns/district/${districtId}/town`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch towns");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching towns:", error);
    return [];
  }
}