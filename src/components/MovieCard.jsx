import { useFilmTracker } from "../context/FilmTrackerContext";
import { Eye, Plus, Star, Check, Bookmark } from "lucide-react";
import { toast } from "sonner";

function getYear(date) {
  return date ? date.slice(0, 4) : "—";
}

function getFirstGenre(genres) {
  return genres ? genres.split(",")[0] : "—";
}

function showValue(value) {
  return value === undefined || value === null || value === "" ? "—" : value;
}

export default function MovieCard({
  movie,
  onViewDetails,
  onLogMovie,
  onAddToList,
  isRecommendation = false,
}) {
  const { getMovieStatus, toggleWatchlist, isInWatchlist } = useFilmTracker();
  const status = getMovieStatus(movie.id);
  const inWatchlist = isInWatchlist(movie.id);

  function handleToggleWatchlist(e) {
    e.stopPropagation();
    toggleWatchlist(movie.id);
    if (inWatchlist) {
      toast.info(`Removed "${movie.title}" from Watchlist`);
    } else {
      toast.success(`Added "${movie.title}" to Watchlist!`);
    }
  }

  return (
    <article className="movie-card">
      <div className="poster-wrap">
        <img
          src={movie.poster_path || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80"}
          alt={`${movie.title} poster`}
          loading="lazy"
          className="poster-img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80";
          }}
        />
        {isRecommendation && (
          <span className="match-badge">{showValue(movie.similarity)}% match</span>
        )}

        {/* Status badges: Watched, Rated, Watchlist */}
        <div className="card-top-badges">
          {status.isWatched && (
            <span className="card-status-badge watched" title="Watched">
              <Check size={11} strokeWidth={3} />
            </span>
          )}
          {status.rating && (
            <span className="card-status-badge rated" title={`Your rating: ${status.rating}★`}>
              <Star size={10} fill="currentColor" /> {status.rating}
            </span>
          )}
          {inWatchlist && !status.isWatched && (
            <span className="card-status-badge in-watchlist" title="In your Watchlist">
              <Bookmark size={11} fill="currentColor" />
            </span>
          )}
        </div>

        {/* Quick action overlay on poster hover */}
        <div className="poster-action-overlay">
          {onLogMovie && (
            <button
              type="button"
              className="quick-action-btn log-btn"
              onClick={(e) => {
                e.stopPropagation();
                onLogMovie(movie);
              }}
              title="Log, Rate, or Review this film"
            >
              <Eye size={14} /> <span>Log</span>
            </button>
          )}

          <button
            type="button"
            className={`quick-action-btn watchlist-btn ${inWatchlist ? "active-saved" : ""}`}
            onClick={handleToggleWatchlist}
            title={inWatchlist ? "Remove from Watchlist" : "Save to Watchlist"}
          >
            <Bookmark size={14} fill={inWatchlist ? "currentColor" : "none"} />
          </button>

          {onAddToList && (
            <button
              type="button"
              className="quick-action-btn list-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAddToList(movie);
              }}
              title="Add to list"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="movie-card-body">
        <div className="movie-card-heading">
          <h3 title={movie.title}>{showValue(movie.title)}</h3>
          <span className="rating">★ {showValue(movie.vote_average)}</span>
        </div>
        <p className="movie-meta">
          {getYear(movie.release_date)} <span>•</span> {getFirstGenre(movie.genres)}
        </p>

        {isRecommendation ? (
          <p className="similarity">
            Similarity: <strong>{showValue(movie.similarity)}%</strong>
          </p>
        ) : (
          <p className="popularity">
            Popularity: <strong>{showValue(movie.popularity)}</strong>
          </p>
        )}

        <div className="card-bottom-actions">
          <button
            className="text-button"
            type="button"
            onClick={() => onViewDetails(movie)}
          >
            <span>Details</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </article>
  );
}
