import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MovieDetails from "../components/MovieDetails";
import LogMovieModal from "../components/LogMovieModal";
import AddToListModal from "../components/AddToListModal";
import { sampleMovies } from "../data/sampleMovies";
import { Search, SlidersHorizontal, Film, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Browse All Films — ReelMind" },
      {
        name: "description",
        content: "Explore, filter, and search the complete ReelMind film database.",
      },
    ],
  }),
  component: MoviesPage,
});

const defaultFilters = {
  search: "",
  genre: "All genres",
  language: "All languages",
  minimumRating: "Any rating",
  releaseYear: "",
  sortBy: "popularity-desc",
};

function MoviesPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [logModalMovie, setLogModalMovie] = useState(null);
  const [addToListMovie, setAddToListMovie] = useState(null);

  const genres = ["All genres", ...new Set(sampleMovies.flatMap((m) => m.genres.split(", ")))].sort();
  const languages = ["All languages", ...new Set(sampleMovies.map((m) => m.original_language))].sort();

  const filteredAndSortedMovies = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const minRating = filters.minimumRating === "Any rating" ? 0 : Number(filters.minimumRating);

    const filtered = sampleMovies.filter((movie) => {
      const matchesText =
        !q ||
        `${movie.title} ${movie.original_title} ${movie.genres}`.toLowerCase().includes(q);
      const matchesGenre = filters.genre === "All genres" || movie.genres.includes(filters.genre);
      const matchesLanguage =
        filters.language === "All languages" || movie.original_language === filters.language;
      const matchesRating = movie.vote_average >= minRating;
      const matchesYear = !filters.releaseYear || movie.release_date.startsWith(filters.releaseYear);
      return matchesText && matchesGenre && matchesLanguage && matchesRating && matchesYear;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === "rating-desc") return b.vote_average - a.vote_average;
      if (filters.sortBy === "rating-asc") return a.vote_average - b.vote_average;
      if (filters.sortBy === "year-desc") return (b.release_date || "").localeCompare(a.release_date || "");
      if (filters.sortBy === "year-asc") return (a.release_date || "").localeCompare(b.release_date || "");
      if (filters.sortBy === "title-asc") return a.title.localeCompare(b.title);
      // default popularity-desc
      return (b.popularity || 0) - (a.popularity || 0);
    });

    return filtered;
  }, [filters]);

  function updateFilter(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <header className="page-header">
          <div className="page-header-text">
            <span className="eyebrow"><Film size={12} /> Film Catalog</span>
            <h1>All Films</h1>
            <p>
              Browse, filter, rate, and log all {sampleMovies.length} cinema titles in the ReelMind database.
            </p>
          </div>
          <div className="header-stat-pill">
            <span>{filteredAndSortedMovies.length}</span> films matching
          </div>
        </header>

        {/* Search and Filters Bar */}
        <div className="catalog-filters-card">
          <div className="catalog-search-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                className="catalog-search-input"
                placeholder="Search by title or genre..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
              />
            </div>

            <div className="sort-wrapper">
              <span className="sort-label">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="filter-select"
              >
                <option value="popularity-desc">Most Popular</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
                <option value="year-desc">Newest First</option>
                <option value="year-asc">Oldest First</option>
                <option value="title-asc">Title (A–Z)</option>
              </select>
            </div>
          </div>

          <div className="catalog-secondary-filters">
            <label>
              <span>Genre</span>
              <select
                value={filters.genre}
                onChange={(e) => updateFilter("genre", e.target.value)}
                className="filter-select"
              >
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Language</span>
              <select
                value={filters.language}
                onChange={(e) => updateFilter("language", e.target.value)}
                className="filter-select"
              >
                {languages.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Rating</span>
              <select
                value={filters.minimumRating}
                onChange={(e) => updateFilter("minimumRating", e.target.value)}
                className="filter-select"
              >
                <option value="Any rating">Any rating</option>
                <option value="8.5">8.5+ Stars</option>
                <option value="8.0">8.0+ Stars</option>
                <option value="7.5">7.5+ Stars</option>
                <option value="7.0">7.0+ Stars</option>
              </select>
            </label>

            <label>
              <span>Year</span>
              <input
                type="text"
                placeholder="e.g. 2014"
                maxLength={4}
                value={filters.releaseYear}
                onChange={(e) => updateFilter("releaseYear", e.target.value)}
                className="filter-input"
              />
            </label>

            <button
              type="button"
              className="reset-filters-btn"
              onClick={resetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>

        {/* Movie Results Grid */}
        {filteredAndSortedMovies.length > 0 ? (
          <div className="movie-grid catalog-grid">
            {filteredAndSortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onViewDetails={setSelectedMovie}
                onLogMovie={setLogModalMovie}
                onAddToList={setAddToListMovie}
              />
            ))}
          </div>
        ) : (
          <div className="message-state">
            <span className="empty-icon" aria-hidden="true">◌</span>
            <strong>No films found matching criteria.</strong>
            <p>Try clearing filters or adjusting your search term.</p>
            <button type="button" className="btn-secondary mt-3" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <span>© 2026 ReelMind</span>
        <span>Catalog & Clustering Engine.</span>
        <span aria-hidden="true">▰ · ▰ · ▰</span>
      </footer>

      {/* Modals */}
      <MovieDetails
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onOpenLogModal={(m) => setLogModalMovie(m)}
        onOpenAddToList={(m) => setAddToListMovie(m)}
      />

      <LogMovieModal
        movie={logModalMovie}
        isOpen={Boolean(logModalMovie)}
        onClose={() => setLogModalMovie(null)}
      />

      <AddToListModal
        movie={addToListMovie}
        isOpen={Boolean(addToListMovie)}
        onClose={() => setAddToListMovie(null)}
      />
    </div>
  );
}
