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

// ===============================
// SEARCH & BROWSE 27,842 MOVIES
// ===============================
export async function searchMovies(search = "", genre = "All genres", limit = 50, page = 1) {
  try {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append("search", search.trim());
    if (genre && genre !== "All genres") params.append("genre", genre);
    params.append("limit", String(limit));
    params.append("page", String(page));

    const response = await fetch(`${API_URL}/movies?${params.toString()}`);
    if (!response.ok) {
      console.warn(`Movies backend returned HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data; // Returns { total, page, limit, movies: [...] }
  } catch (error) {
    console.error("Failed to fetch movies from backend:", error);
    return null;
  }
}
