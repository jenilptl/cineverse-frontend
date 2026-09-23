// ===============================
// API CONFIGURATION
// CHANGE THIS HERE
// Replace this URL with your backend URL when your ML service is ready.
// ===============================
export const API_URL = "https://cineverse-movie-recommender-y7dl.onrender.com/";

// ===============================
// CONNECT YOUR BACKEND HERE
// These small functions show the shape the frontend expects.
// ===============================
export async function searchMovies(searchText, filters) {
  // Example: return fetch(`${API_URL}/movies/search?...`).then((response) => response.json());
  console.log("Connect movie search here", { searchText, filters });
  return [];
}

export async function getRecommendations(movieId) {
  // Example: return fetch(`${API_URL}/recommendations/${movieId}`).then((response) => response.json());
  console.log("Connect recommendations here", movieId);
  return [];
}
