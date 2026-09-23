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
// SEARCH & BROWSE FULL CATALOG (69,000+ MOVIES)
// ===============================
export async function searchMovies(
  searchOrOptions = "",
  genre = "All genres",
  limit = 24,
  page = 1
) {
  try {
    let search = "";
    let language = "All languages";
    let minRating = 0;
    let releaseYear = "";
    let sortBy = "id-asc";

    if (typeof searchOrOptions === "object" && searchOrOptions !== null) {
      search = searchOrOptions.search || "";
      genre = searchOrOptions.genre || "All genres";
      language = searchOrOptions.language || "All languages";
      minRating = searchOrOptions.minimumRating || searchOrOptions.min_rating || 0;
      releaseYear = searchOrOptions.releaseYear || searchOrOptions.year || "";
      sortBy = searchOrOptions.sortBy || searchOrOptions.sort_by || "id-asc";
      page = searchOrOptions.page || 1;
      limit = searchOrOptions.limit || 24;
    } else {
      search = searchOrOptions;
    }

    const params = new URLSearchParams();
    if (search && search.trim()) params.append("search", search.trim());
    if (genre && genre !== "All genres") params.append("genre", genre);
    if (language && language !== "All languages") params.append("language", language);

    const parsedRating = minRating === "Any rating" ? 0 : Number(minRating);
    if (parsedRating && parsedRating > 0) params.append("min_rating", String(parsedRating));

    if (releaseYear && String(releaseYear).trim()) params.append("year", String(releaseYear).trim());
    if (sortBy) params.append("sort_by", sortBy);

    params.append("limit", String(limit));
    params.append("page", String(page));

    const response = await fetch(`${API_URL}/movies?${params.toString()}`);
    if (!response.ok) {
      console.warn(`Movies backend returned HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data; // Returns { total, page, limit, total_pages, movies: [...] }
  } catch (error) {
    console.error("Failed to fetch movies from backend:", error);
    return null;
  }
}
