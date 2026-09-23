import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import MovieScroller from "./components/MovieScroller";
import LogMovieModal from "./components/LogMovieModal";
import AddToListModal from "./components/AddToListModal";
import Recommendations from "./components/Recommendations";
import { sampleMovies } from "./data/sampleMovies";
import { searchMovies } from "./config/api";
import { useFilmTracker, findMovieById } from "./context/FilmTrackerContext";
import { Film, Calendar, Heart, Repeat, Plus, ArrowRight, Sparkles } from "lucide-react";

const defaultFilters = {
  genre: "All genres",
  language: "All languages",
  minimumRating: "Any rating",
  releaseYear: "",
};

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [logModalMovie, setLogModalMovie] = useState(null);
  const [addToListMovie, setAddToListMovie] = useState(null);
  const [backendMovies, setBackendMovies] = useState(null);
  const [totalCatalogCount, setTotalCatalogCount] = useState(69405);

  const { diary, profile } = useFilmTracker();

  const genres = ["All genres", ...new Set(sampleMovies.flatMap((movie) => movie.genres.split(", ")))].sort();
  const languages = ["All languages", ...new Set(sampleMovies.map((movie) => movie.original_language))].sort();

  const visibleMovies = useMemo(() => {
    const sourceMovies = backendMovies && backendMovies.length > 0 ? backendMovies : sampleMovies;
    const query = activeSearch.trim().toLowerCase();
    const minimumRating = filters.minimumRating === "Any rating" ? 0 : Number(filters.minimumRating);

    return sourceMovies.filter((movie) => {
      const matchesText = !query || `${movie.title} ${movie.original_title || ""} ${movie.genres || ""}`.toLowerCase().includes(query);
      const matchesGenre = filters.genre === "All genres" || (movie.genres && movie.genres.includes(filters.genre));
      const matchesLanguage = filters.language === "All languages" || movie.original_language === filters.language;
      const matchesRating = (movie.vote_average || 0) >= minimumRating;
      const matchesYear = !filters.releaseYear || (movie.release_date && movie.release_date.startsWith(filters.releaseYear));
      return matchesText && matchesGenre && matchesLanguage && matchesRating && matchesYear;
    });
  }, [activeSearch, filters, backendMovies]);

  async function runSearch(queryOverride, genreOverride) {
    const query = queryOverride !== undefined ? queryOverride : searchText;
    const genre = genreOverride !== undefined ? genreOverride : filters.genre;

    setIsLoading(true);
    setActiveSearch(query);

    try {
      const data = await searchMovies(query, genre, 50);
      if (data && Array.isArray(data.movies) && data.movies.length > 0) {
        setBackendMovies(data.movies);
        if (data.total) setTotalCatalogCount(data.total);
      } else {
        setBackendMovies(null);
      }
    } catch (err) {
      console.error("Backend search failed:", err);
      setBackendMovies(null);
    } finally {
      setIsLoading(false);
    }
  }

  function clearFilters() {
    setFilters(defaultFilters);
    setSearchText("");
    setActiveSearch("");
    setBackendMovies(null);
  }

  function updateFilter(name, value) {
    setFilters((currentFilters) => {
      const updated = { ...currentFilters, [name]: value };
      if (name === "genre" && (activeSearch || value !== "All genres")) {
        runSearch(activeSearch, value);
      }
      return updated;
    });
  }

  // User's recent watches for home page shelf
  const recentScreenings = diary.slice(0, 6);

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Hero searchText={searchText} setSearchText={setSearchText} onSearch={runSearch} />

        {/* RECENTLY WATCHED SHELF ON HOME PAGE */}
        <section className="home-recent-shelf" aria-labelledby="recent-shelf-title">
          <div className="shelf-header">
            <div>
              <p className="eyebrow"><Calendar size={12} /> Your Cinema Activity</p>
              <h2 id="recent-shelf-title">Recently Watched</h2>
              <p>Your latest screenings logged to your Letterboxd diary.</p>
            </div>
            <div className="shelf-actions">
              <Link to="/diary" className="shelf-link">
                <span>View Full Diary ({diary.length})</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {recentScreenings.length > 0 ? (
            <div className="recent-shelf-grid">
              {recentScreenings.map((entry) => {
                const movie = findMovieById(entry.movieId);
                return (
                  <article
                    key={entry.id}
                    className="shelf-movie-card"
                    onClick={() => movie && setSelectedMovie(movie)}
                  >
                    <div className="shelf-poster-wrap">
                      <img src={entry.posterPath} alt={entry.movieTitle} loading="lazy" />
                      {entry.isLiked && (
                        <span className="shelf-badge-liked" title="Liked">
                          <Heart size={12} fill="#ff4b72" color="#ff4b72" />
                        </span>
                      )}
                      {entry.isRewatch && (
                        <span className="shelf-badge-rewatch" title="Rewatched">
                          <Repeat size={11} />
                        </span>
                      )}
                    </div>
                    <div className="shelf-movie-info">
                      <h4 title={entry.movieTitle}>{entry.movieTitle}</h4>
                      <div className="shelf-meta-row">
                        <span className="shelf-date">{entry.watchDate}</span>
                        {entry.rating && (
                          <span className="shelf-rating">★ {entry.rating}</span>
                        )}
                      </div>
                      {entry.review && (
                        <p className="shelf-review-snippet">“{entry.review}”</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-shelf-banner">
              <div className="empty-shelf-text">
                <strong>No films logged in your diary yet.</strong>
                <p>Track films you watch, give half-star ratings, and build your profile.</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setLogModalMovie(sampleMovies[0])}
              >
                <Plus size={15} /> Log a Film Now
              </button>
            </div>
          )}
        </section>

        {/* RESULTS SECTION WITH COMPACT HORIZONTAL SCROLLER */}
        <section className="results-section" id="results" aria-labelledby="results-title">
          <div className="section-heading results-heading">
            <div>
              <p className="eyebrow"><span aria-hidden="true">▰</span> Your personal screening room</p>
              <h2 id="results-title">{activeSearch ? `Results for “${activeSearch}”` : "A few films to get started"}</h2>
              <p>
                {visibleMovies.length} films ready in current reel · Scroll sideways or switch to grid view
              </p>
            </div>
            <div className="heading-right-group">
              <span className="ticket-count">{visibleMovies.length} / {backendMovies ? totalCatalogCount.toLocaleString() : sampleMovies.length}</span>
              <Link to="/movies" className="explore-all-button">
                Browse All Films →
              </Link>
            </div>
          </div>

          <div className="filter-bar" aria-label="Movie filters">
            <label>
              Genre
              <select value={filters.genre} onChange={(event) => updateFilter("genre", event.target.value)}>
                {genres.map((genre) => <option key={genre}>{genre}</option>)}
              </select>
            </label>
            <label>
              Language
              <select value={filters.language} onChange={(event) => updateFilter("language", event.target.value)}>
                {languages.map((language) => <option key={language}>{language}</option>)}
              </select>
            </label>
            <label>
              Minimum rating
              <select value={filters.minimumRating} onChange={(event) => updateFilter("minimumRating", event.target.value)}>
                <option>Any rating</option>
                <option value="8">8.0+</option>
                <option value="7">7.0+</option>
                <option value="6">6.0+</option>
              </select>
            </label>
            <label>
              Release year
              <input value={filters.releaseYear} onChange={(event) => updateFilter("releaseYear", event.target.value)} placeholder="e.g. 2019" maxLength="4" inputMode="numeric" />
            </label>
            <button className="clear-button" type="button" onClick={clearFilters}>Clear filters</button>
          </div>

          {isLoading ? (
            <div className="message-state">
              <span className="spinner" aria-hidden="true">✦</span>
              <strong>Rolling the film...</strong>
              <p>Checking the shelves for something good.</p>
            </div>
          ) : visibleMovies.length > 0 ? (
            <MovieScroller
              movies={visibleMovies}
              totalCount={backendMovies ? totalCatalogCount : sampleMovies.length}
              onViewDetails={setSelectedMovie}
              onLogMovie={setLogModalMovie}
              onAddToList={setAddToListMovie}
            />
          ) : (
            <div className="message-state">
              <span className="empty-icon" aria-hidden="true">◌</span>
              <strong>No movies found.</strong>
              <p>Even the algorithm is confused.</p>
            </div>
          )}
        </section>

        <Recommendations
          movieTitle={activeSearch.trim() || (selectedMovie ? selectedMovie.title : "The Dark Knight")}
          onViewDetails={setSelectedMovie}
          onLogMovie={setLogModalMovie}
          onAddToList={setAddToListMovie}
        />

        <section className="about-section" id="about">
          <div className="about-copy">
            <p className="eyebrow">Built for the curious</p>
            <h2>A student project with a very large watchlist.</h2>
            <p>ReelMind is your cinema companion: log your screenings, track favorites, build ranked lists, and let machine learning suggest the next seat to take.</p>
          </div>
          <div className="about-note">
            <span aria-hidden="true">✦</span>
            <strong>Powered by clustering algorithms.</strong>
            <p>Integrated with Letterboxd-style tracking and machine learning recommendations.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>© 2026 ReelMind</span>
        <span>Made for movie people & machine learning people.</span>
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
