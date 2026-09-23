import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import MovieDetails from "../components/MovieDetails";
import LogMovieModal from "../components/LogMovieModal";
import AddToListModal from "../components/AddToListModal";
import { useFilmTracker, findMovieById } from "../context/FilmTrackerContext";
import { Bookmark, Eye, Trash2, Plus, Film, Search, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — ReelMind" },
      { name: "description", content: "Your personal cinema watchlist of films queued to experience." },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const { watchlist, toggleWatchlist } = useFilmTracker();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [logModalMovie, setLogModalMovie] = useState(null);
  const [addToListMovie, setAddToListMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const watchlistMovies = useMemo(() => {
    return (watchlist || [])
      .map((id) => findMovieById(id))
      .filter(Boolean)
      .filter((movie) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          movie.title.toLowerCase().includes(q) ||
          movie.genres.toLowerCase().includes(q) ||
          (movie.release_date && movie.release_date.includes(q))
        );
      });
  }, [watchlist, searchQuery]);

  function handleRemoveFromWatchlist(movie, e) {
    e.stopPropagation();
    toggleWatchlist(movie.id);
    toast.info(`Removed "${movie.title}" from your watchlist.`);
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container watchlist-page-main">
        {/* Header */}
        <header className="page-header">
          <div className="page-header-text">
            <span className="eyebrow"><Bookmark size={12} /> Cinema Queue</span>
            <h1>My Watchlist</h1>
            <p>
              Films you want to experience. Log a film when watched to transfer it directly into your screening diary.
            </p>
          </div>

          <div className="header-stat-pill">
            <span>{watchlist.length}</span> films queued
          </div>
        </header>

        {/* Search filter if items exist */}
        {watchlist.length > 0 && (
          <div className="watchlist-search-bar">
            <Search size={16} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Search your watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="watchlist-search-input"
            />
          </div>
        )}

        {/* Watchlist Grid */}
        {watchlistMovies.length > 0 ? (
          <div className="watchlist-grid">
            {watchlistMovies.map((movie) => (
              <article key={movie.id} className="watchlist-card">
                <div
                  className="watchlist-poster-wrap"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <img src={movie.poster_path} alt={movie.title} loading="lazy" />
                  <button
                    type="button"
                    className="remove-watchlist-badge-btn"
                    onClick={(e) => handleRemoveFromWatchlist(movie, e)}
                    title="Remove from watchlist"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="watchlist-card-body">
                  <h3
                    onClick={() => setSelectedMovie(movie)}
                    className="clickable-title"
                    title={movie.title}
                  >
                    {movie.title}
                  </h3>
                  <p className="watchlist-meta">
                    {movie.release_date?.slice(0, 4)} <span>•</span> {movie.genres?.split(",")[0]} <span>•</span> ★ {movie.vote_average}
                  </p>

                  <div className="watchlist-actions">
                    <button
                      type="button"
                      className="btn-log-watchlist"
                      onClick={() => setLogModalMovie(movie)}
                      title="Log and rate this film"
                    >
                      <Eye size={13} /> Log Film
                    </button>
                    <button
                      type="button"
                      className="btn-details-watchlist"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="message-state">
            <span className="empty-icon" aria-hidden="true">◌</span>
            <strong>{searchQuery ? "No matching films found in watchlist." : "Your watchlist is empty."}</strong>
            <p>
              {searchQuery
                ? "Try clearing your search query."
                : "Explore our catalog and click the bookmark ribbon icon on any film to queue it here."}
            </p>
            <Link to="/movies" className="btn-primary mt-3">
              Browse Film Catalog <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <span>© 2026 ReelMind</span>
        <span>Cinema watchlist queue.</span>
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
