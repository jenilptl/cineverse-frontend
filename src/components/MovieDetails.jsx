import { useFilmTracker } from "../context/FilmTrackerContext";
import StarRating from "./StarRating";
import { Eye, Plus, Star, Calendar, MessageSquare, Heart, Repeat, Bookmark, Check } from "lucide-react";
import { toast } from "sonner";

function valueOrFallback(value) {
  return value === undefined || value === null || value === "" ? "Not available" : value;
}

function formatMoney(value) {
  if (value === undefined || value === null || value === "") return "Not available";
  return `$${Number(value).toLocaleString()}`;
}

export default function MovieDetails({
  movie,
  onClose,
  onOpenLogModal,
  onOpenAddToList,
}) {
  const { getMovieStatus, logFilm, toggleWatchlist, isInWatchlist } = useFilmTracker();

  if (!movie) return null;

  const status = getMovieStatus(movie.id);
  const inWatchlist = isInWatchlist(movie.id);

  function handleQuickRate(newRating) {
    logFilm({
      movieId: movie.id,
      rating: newRating,
    });
    toast.success(`Rated "${movie.title}" ${newRating} ★!`);
  }

  function handleToggleWatchlist() {
    toggleWatchlist(movie.id);
    if (inWatchlist) {
      toast.info(`Removed from Watchlist`);
    } else {
      toast.success(`Added "${movie.title}" to your Watchlist!`);
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
      >
        <button
          className="close-button"
          type="button"
          onClick={onClose}
          aria-label="Close movie details"
        >
          ×
        </button>

        <div className="details-layout">
          <div className="details-sidebar">
            <div className="details-poster-container">
              <img
                className="details-poster"
                src={movie.poster_path || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80"}
                alt={`${movie.title} poster`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80";
                }}
              />
            </div>

            {/* User Interaction Card */}
            <div className="details-user-box">
              <span className="box-title">Your Film Reel</span>

              <div className="quick-rate-section">
                <span className="rate-label">
                  {status.rating ? `Your Rating: ${status.rating} ★` : "Give a star rating (0.5 – 5.0)"}
                </span>
                <StarRating
                  value={status.rating || 0}
                  onChange={handleQuickRate}
                  size="md"
                  showScore
                />
              </div>

              <div className="details-box-buttons">
                <button
                  type="button"
                  className="btn-log-action"
                  onClick={() => {
                    onClose();
                    if (onOpenLogModal) onOpenLogModal(movie);
                  }}
                >
                  <Eye size={15} /> Log or Write Review
                </button>

                <button
                  type="button"
                  className={`btn-watchlist-action ${inWatchlist ? "saved-active" : ""}`}
                  onClick={handleToggleWatchlist}
                >
                  <Bookmark size={15} fill={inWatchlist ? "currentColor" : "none"} />
                  <span>{inWatchlist ? "In Your Watchlist" : "Add to Watchlist"}</span>
                </button>

                <button
                  type="button"
                  className="btn-list-action"
                  onClick={() => {
                    onClose();
                    if (onOpenAddToList) onOpenAddToList(movie);
                  }}
                >
                  <Plus size={15} /> Add to List
                </button>
              </div>
            </div>
          </div>

          <div className="details-content">
            <p className="eyebrow">Now showing in the data set</p>
            <h2 id="details-title">{valueOrFallback(movie.title)}</h2>
            <p className="original-title">
              Original title: {valueOrFallback(movie.original_title)}
            </p>
            <p className="details-overview">{valueOrFallback(movie.overview)}</p>

            {/* User's existing reviews for this film if logged */}
            {status.entries && status.entries.length > 0 && (
              <div className="user-logged-history">
                <h4><MessageSquare size={15} /> Your Diary Activity ({status.entries.length} log{status.entries.length > 1 ? "s" : ""})</h4>
                <div className="logged-entries-list">
                  {status.entries.map((entry) => (
                    <div key={entry.id} className="user-entry-item">
                      <div className="user-entry-meta">
                        <span className="entry-date"><Calendar size={13} /> {entry.watchDate}</span>
                        {entry.rating && <span className="entry-star">★ {entry.rating}</span>}
                        {entry.isLiked && <span className="entry-liked"><Heart size={13} fill="#ff4b72" color="#ff4b72" /> Liked</span>}
                        {entry.isRewatch && <span className="entry-rewatch"><Repeat size={13} /> Rewatched</span>}
                      </div>
                      {entry.review && <p className="entry-review-text">“{entry.review}”</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="details-grid">
              <DetailItem label="Release date" value={valueOrFallback(movie.release_date)} />
              <DetailItem
                label="Rating"
                value={movie.vote_average ? `★ ${movie.vote_average} / 10` : "Not available"}
              />
              <DetailItem
                label="Vote count"
                value={
                  movie.vote_count
                    ? `${Number(movie.vote_count).toLocaleString()} votes`
                    : "Not available"
                }
              />
              <DetailItem
                label="Runtime"
                value={movie.runtime ? `${movie.runtime} min` : "Not available"}
              />
              <DetailItem label="Genres" value={valueOrFallback(movie.genres)} />
              <DetailItem
                label="Language"
                value={
                  movie.original_language
                    ? movie.original_language.toUpperCase()
                    : "Not available"
                }
              />
              <DetailItem label="Popularity" value={valueOrFallback(movie.popularity)} />
              <DetailItem
                label="Budget / Revenue"
                value={`${formatMoney(movie.budget)} / ${formatMoney(movie.revenue)}`}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
