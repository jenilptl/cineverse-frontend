import { useState, useEffect } from "react";
import { useFilmTracker, findMovieById } from "../context/FilmTrackerContext";
import { sampleMovies } from "../data/sampleMovies";
import StarRating from "./StarRating";
import { toast } from "sonner";
import { Heart, Repeat, Calendar, Film, X, Check, Search } from "lucide-react";

export default function LogMovieModal({
  movie: initialMovie = null,
  isOpen = false,
  onClose,
  initialRating = 0,
}) {
  const { logFilm, lists, toggleMovieInList, getMovieStatus } = useFilmTracker();

  const [selectedMovie, setSelectedMovie] = useState(initialMovie);
  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(initialRating || 0);
  const [review, setReview] = useState("");
  const [watchDate, setWatchDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isLiked, setIsLiked] = useState(false);
  const [isRewatch, setIsRewatch] = useState(false);
  const [selectedListIds, setSelectedListIds] = useState([]);

  // Sync state when initialMovie changes
  useEffect(() => {
    if (initialMovie) {
      setSelectedMovie(initialMovie);
      const status = getMovieStatus(initialMovie.id);
      if (status.rating) setRating(status.rating);
      if (status.entries && status.entries.length > 0) {
        setIsRewatch(true);
      }
    } else {
      setSelectedMovie(null);
      setRating(0);
      setReview("");
      setIsLiked(false);
      setIsRewatch(false);
    }
  }, [initialMovie, isOpen]);

  if (!isOpen) return null;

  const movieSearchResults = searchQuery.trim()
    ? sampleMovies
        .filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 6)
    : [];

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedMovie) {
      toast.error("Please select a film to log.");
      return;
    }

    logFilm({
      movieId: selectedMovie.id,
      rating: rating > 0 ? rating : null,
      review,
      watchDate,
      isRewatch,
      isLiked,
    });

    // Handle lists
    selectedListIds.forEach((listId) => {
      toggleMovieInList(listId, selectedMovie.id);
    });

    toast.success(`Logged "${selectedMovie.title}" to your diary!`, {
      description: rating > 0 ? `Rated ${rating} ★ · ${watchDate}` : `Watched on ${watchDate}`,
    });

    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="log-movie-modal spacious-modal" role="dialog" aria-modal="true" aria-labelledby="log-modal-title">
        <button className="close-button" type="button" onClick={onClose} aria-label="Close modal">
          <X size={22} />
        </button>

        <div className="log-modal-header">
          <span className="eyebrow"><Film size={13} /> Cinema Journal</span>
          <h2 id="log-modal-title">
            {selectedMovie ? `Log "${selectedMovie.title}"` : "Log a Film"}
          </h2>
          <p className="log-modal-subtitle">Record your watch date, star rating, and personal review.</p>
        </div>

        {/* Movie Selector if opened without a pre-selected movie */}
        {!selectedMovie ? (
          <div className="film-search-step">
            <label className="input-label">Find a film to log</label>
            <div className="film-search-input-wrap">
              <Search size={16} className="film-search-icon" />
              <input
                type="text"
                className="styled-input film-search-field"
                placeholder="Type movie title (e.g. Inception, Arrival, Dune)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            {movieSearchResults.length > 0 && (
              <div className="film-search-dropdown">
                {movieSearchResults.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className="film-search-item"
                    onClick={() => {
                      setSelectedMovie(m);
                      setSearchQuery("");
                    }}
                  >
                    <img src={m.poster_path} alt={m.title} className="thumb-mini" />
                    <div>
                      <strong>{m.title}</strong>
                      <small>{m.release_date?.slice(0, 4)} · {m.genres?.split(",")[0]}</small>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="log-form">
            {/* Top Film Card Header */}
            <div className="log-form-top">
              <div className="log-poster-wrap">
                <img
                  src={selectedMovie.poster_path}
                  alt={selectedMovie.title}
                  className="log-poster"
                />
              </div>

              <div className="log-form-info">
                <div className="film-title-row">
                  <h3>{selectedMovie.title}</h3>
                  <span className="release-year">{selectedMovie.release_date?.slice(0, 4)}</span>
                </div>
                <p className="film-quick-genres">{selectedMovie.genres}</p>

                {/* Rating component with half-star support */}
                <div className="form-group rating-group">
                  <label className="input-label">Your Rating (0.5 – 5.0 Stars)</label>
                  <div className="rating-picker-wrap">
                    <StarRating
                      value={rating}
                      onChange={setRating}
                      size="lg"
                      showScore
                    />
                    {rating > 0 && (
                      <button
                        type="button"
                        className="clear-rating-btn"
                        onClick={() => setRating(0)}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="log-divider" />

            {/* Date & Toggles Section */}
            <div className="form-row-compact">
              <div className="form-group date-form-group">
                <label className="input-label"><Calendar size={13} /> Watched Date</label>
                <input
                  type="date"
                  className="styled-input date-input"
                  value={watchDate}
                  onChange={(e) => setWatchDate(e.target.value)}
                  required
                />
              </div>

              <div className="toggle-badges-group">
                <label className="input-label">Options</label>
                <div className="toggle-badges">
                  <button
                    type="button"
                    className={`pill-toggle ${isLiked ? "active-heart" : ""}`}
                    onClick={() => setIsLiked(!isLiked)}
                    title="Like this film"
                  >
                    <Heart size={16} fill={isLiked ? "#ff4b72" : "none"} color={isLiked ? "#ff4b72" : "currentColor"} />
                    <span>{isLiked ? "Liked" : "Like"}</span>
                  </button>

                  <button
                    type="button"
                    className={`pill-toggle ${isRewatch ? "active-rewatch" : ""}`}
                    onClick={() => setIsRewatch(!isRewatch)}
                    title="Rewatch"
                  >
                    <Repeat size={15} />
                    <span>{isRewatch ? "Rewatch" : "Rewatched"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="log-divider" />

            {/* Review text area */}
            <div className="form-group">
              <label className="input-label">Write a Review (optional)</label>
              <textarea
                className="styled-textarea log-review-textarea"
                rows={4}
                placeholder="What did you think of the cinematography, acting, direction, or storytelling?"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>

            {/* Add to list options */}
            {lists.length > 0 && (
              <div className="form-group lists-form-group">
                <label className="input-label">Add to Your Lists</label>
                <div className="list-chips">
                  {lists.map((list) => {
                    const isSelected = selectedListIds.includes(list.id);
                    return (
                      <button
                        key={list.id}
                        type="button"
                        className={`list-chip ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedListIds(selectedListIds.filter((id) => id !== list.id));
                          } else {
                            setSelectedListIds([...selectedListIds, list.id]);
                          }
                        }}
                      >
                        {isSelected && <Check size={13} />}
                        <span>{list.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="modal-actions log-modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save to Diary & Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
