import { useState } from "react";
import { useFilmTracker } from "../context/FilmTrackerContext";
import { sampleMovies } from "../data/sampleMovies";
import { Search, X, Star } from "lucide-react";
import { toast } from "sonner";

export default function PickFavoriteModal({ slotIndex = 0, isOpen = false, onClose }) {
  const { profile, setFavoriteSlot } = useFilmTracker();
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const currentFavoriteId = profile.favorites ? profile.favorites[slotIndex] : null;

  const filteredMovies = sampleMovies.filter((movie) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      movie.title.toLowerCase().includes(q) ||
      movie.genres.toLowerCase().includes(q) ||
      (movie.release_date && movie.release_date.includes(q))
    );
  });

  function handleSelectMovie(movie) {
    setFavoriteSlot(slotIndex, movie.id);
    toast.success(`Set "${movie.title}" as Favorite #${slotIndex + 1}!`);
    onClose();
  }

  function handleClearSlot() {
    setFavoriteSlot(slotIndex, null);
    toast.info(`Cleared Favorite #${slotIndex + 1}`);
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pick-favorite-modal" role="dialog" aria-modal="true" aria-labelledby="fav-picker-title">
        <button className="close-button" type="button" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="fav-picker-header">
          <span className="eyebrow"><Star size={12} /> Favorite Film Slot #{slotIndex + 1}</span>
          <h2 id="fav-picker-title">Choose Favorite Film</h2>
          <p>Pick one of your all-time favorite four films to showcase on your Letterboxd profile.</p>
        </div>

        <div className="fav-picker-search">
          <Search size={16} className="search-icon-svg" />
          <input
            type="text"
            className="styled-input"
            placeholder="Search movie title or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        {currentFavoriteId && (
          <div className="current-slot-actions">
            <button type="button" className="clear-slot-btn" onClick={handleClearSlot}>
              Remove film from Slot #{slotIndex + 1}
            </button>
          </div>
        )}

        <div className="fav-picker-grid">
          {filteredMovies.slice(0, 16).map((movie) => {
            const isCurrentlySelected = currentFavoriteId === movie.id;
            return (
              <button
                key={movie.id}
                type="button"
                className={`fav-picker-card ${isCurrentlySelected ? "is-selected" : ""}`}
                onClick={() => handleSelectMovie(movie)}
              >
                <img src={movie.poster_path} alt={movie.title} loading="lazy" />
                <div className="fav-picker-card-info">
                  <strong>{movie.title}</strong>
                  <small>{movie.release_date?.slice(0, 4)} · ★ {movie.vote_average}</small>
                </div>
                {isCurrentlySelected && <span className="selected-badge">Current #{slotIndex + 1}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
