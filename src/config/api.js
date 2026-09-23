// ===============================
// API CONFIGURATION
// Connects to your live FastAPI ML backend on Render
// ===============================
export const API_URL =
  import.meta.env.VITE_API_URL || "https://cineverse-movie-recommender-y7dl.onrender.com";

// ===============================
// LIVE ML RECOMMENDATIONS
// ===============================
export async function getRecommendations(title = "The Dark Knight", n = 10) {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        n: Number(n) || 10,
      }),
    });

    if (!response.ok) {
      console.warn(`Recommender backend returned HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.error("Failed to connect to ML backend:", error);
    return null;
  }
}
