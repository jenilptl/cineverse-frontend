import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MovieDetails from "../components/MovieDetails";
import LogMovieModal from "../components/LogMovieModal";
import AddToListModal from "../components/AddToListModal";
import { sampleMovies } from "../data/sampleMovies";
import { searchMovies } from "../config/api";
import { Search, Film, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Browse All Films — ReelMind" },
      {
        name: "description",
        content: "Explore, filter, and search the complete 34,791+ ReelMind film database.",
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
  sortBy: "id-asc", // User specified: start from smallest ID to biggest
};

const GENRES = [
  "All genres",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
];

const LANGUAGE_OPTIONS = [
  { value: "All languages", label: "All languages" },
  { value: "hi", label: "Hindi (hi)" },
  { value: "te", label: "Telugu (te)" },
  { value: "ta", label: "Tamil (ta)" },
  { value: "ml", label: "Malayalam (ml)" },
  { value: "kn", label: "Kannada (kn)" },
  { value: "bn", label: "Bengali (bn)" },
  { value: "mr", label: "Marathi (mr)" },
  { value: "pa", label: "Punjabi (pa)" },
  { value: "gu", label: "Gujarati (gu)" },
  { value: "en", label: "English (en)" },
  { value: "es", label: "Spanish (es)" },
  { value: "fr", label: "French (fr)" },
  { value: "ja", label: "Japanese (ja)" },
  { value: "ko", label: "Korean (ko)" },
  { value: "it", label: "Italian (it)" },
  { value: "de", label: "German (de)" },
  { value: "zh", label: "Chinese (zh)" },
  { value: "cn", label: "Cantonese (cn)" },
  { value: "fa", label: "Persian / Iranian (fa)" },
];

function MoviesPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(61341);
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [logModalMovie, setLogModalMovie] = useState(null);
  const [addToListMovie, setAddToListMovie] = useState(null);

  // Fetch dynamic page from backend on mount and whenever filters or page change
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await searchMovies({
          search: filters.search,
          genre: filters.genre,
          language: filters.language,
          minimumRating: filters.minimumRating,
          releaseYear: filters.releaseYear,
          sortBy: filters.sortBy,
          page: page,
          limit: 24,
        });

        if (!isCancelled) {
          if (res && Array.isArray(res.movies)) {
            setMoviesList(res.movies);
            if (res.total !== undefined) setTotalCount(res.total);
            if (res.total_pages !== undefined) setTotalPages(res.total_pages);
          } else {
            // Graceful fallback to local sample movies if backend warming up
            setMoviesList(sampleMovies.slice(0, 24));
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to load catalog movies from backend:", err);
          setMoviesList(sampleMovies.slice(0, 24));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 220);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [filters, page]);

  function updateFilter(name, value) {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to page 1 on filter changes
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setPage(1);
  }

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Calculate window of page numbers to show: e.g. [1, '...', 4, 5, 6, '...', 1450]
  const paginationRange = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 2;
    const range = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (left > 2) {
      range.unshift("...");
    }
    if (right < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    range.push(totalPages);

    return range;
  }, [page, totalPages]);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <header className="page-header">
          <div className="page-header-text">
            <span className="eyebrow"><Film size={12} /> Film Catalog</span>
            <h1>All Films</h1>
            <p>
              Browse, filter, rate, and log cinema titles from the complete ReelMind {totalCount.toLocaleString()} film database.
            </p>
          </div>
          <div className="header-stat-pill">
            <span>{isLoading ? "Loading..." : totalCount.toLocaleString()}</span> films in catalog
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
                placeholder="Search across 61,000+ movies by title or keyword..."
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
                <option value="id-asc">ID (Smallest to Big)</option>
                <option value="id-desc">ID (Biggest to Smallest)</option>
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
                {GENRES.map((g) => (
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
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                <option value="6.0">6.0+ Stars</option>
              </select>
            </label>

            <label>
              <span>Year</span>
              <input
                type="text"
                placeholder="e.g. 2023"
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
        {isLoading ? (
          <div className="message-state">
            <span className="spinner" aria-hidden="true">✦</span>
            <strong>Loading ReelMind Catalog...</strong>
            <p>Fetching cinema titles from the database.</p>
          </div>
        ) : moviesList.length > 0 ? (
          <>
            <div className="movie-grid catalog-grid">
              {moviesList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onViewDetails={setSelectedMovie}
                  onLogMovie={setLogModalMovie}
                  onAddToList={setAddToListMovie}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav className="catalog-pagination" aria-label="Catalog pagination">
                <div className="pagination-controls-row">
                  <button
                    type="button"
                    className="pagination-btn prev-btn"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || isLoading}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  <div className="pagination-numbers">
                    {paginationRange.map((p, idx) =>
                      p === "..." ? (
                        <span key={`dots-${idx}`} className="pagination-ellipsis">
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          className={`pagination-num-btn ${p === page ? "active-page" : ""}`}
                          onClick={() => handlePageChange(p)}
                          disabled={isLoading}
                          aria-current={p === page ? "page" : undefined}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="pagination-btn next-btn"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages || isLoading}
                    aria-label="Next page"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>

                <div className="pagination-info">
                  Page <strong>{page}</strong> of <strong>{totalPages.toLocaleString()}</strong> ({totalCount.toLocaleString()} total films)
                </div>
              </nav>
            )}
          </>
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
        <span>Complete Catalog & Clustering Engine.</span>
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
