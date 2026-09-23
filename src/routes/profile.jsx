import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import Navbar from "../components/Navbar";
import MovieDetails from "../components/MovieDetails";
import LogMovieModal from "../components/LogMovieModal";
import PickFavoriteModal from "../components/PickFavoriteModal";
import RatingHistogram from "../components/RatingHistogram";
import StarRating from "../components/StarRating";
import { useFilmTracker, findMovieById } from "../context/FilmTrackerContext";
import {
  Film,
  Calendar,
  Heart,
  Repeat,
  Plus,
  Edit2,
  List,
  Sparkles,
  Award,
  BookOpen,
  Bookmark,
  MapPin,
  ExternalLink,
  Search,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "JENNIL's Profile — ReelMind" },
      { name: "description", content: "JENNIL (@mr.prince)'s personal cinema profile, favorite films, diary, and ratings histogram." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, diary, lists, watchlist, ratingDistribution, updateProfile } = useFilmTracker();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [logModalMovie, setLogModalMovie] = useState(null);
  const [favSlotPickerIndex, setFavSlotPickerIndex] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.displayName || "JENNIL");
  const [editBio, setEditBio] = useState(profile.bio || "");
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl || "");
  const [activeRatingFilter, setActiveRatingFilter] = useState(null);

  // Stats calculation
  const totalWatched = new Set(diary.map((e) => e.movieId)).size;
  const diaryCount = diary.length;
  const listsCount = lists.length;
  const watchlistCount = watchlist.length;

  const ratingsList = diary.filter((e) => e.rating !== null && e.rating > 0).map((e) => e.rating);
  const avgRating = ratingsList.length
    ? (ratingsList.reduce((acc, r) => acc + r, 0) / ratingsList.length).toFixed(1)
    : "—";

  // 4 Favorites movies
  const favoriteSlots = [0, 1, 2, 3].map((index) => {
    const movieId = profile.favorites ? profile.favorites[index] : null;
    return {
      index,
      movie: movieId ? findMovieById(movieId) : null,
    };
  });

  // Recent 4 films
  const recentFourFilms = diary.slice(0, 4);

  // Filtered diary entries by clicked rating pillar (if any)
  const filteredDiary = activeRatingFilter
    ? diary.filter((e) => e.rating && Number(e.rating).toFixed(1) === activeRatingFilter)
    : diary;

  // Watchlist preview movies (up to 5 for the fan collage)
  const watchlistMovies = (watchlist || [])
    .slice(0, 5)
    .map((id) => findMovieById(id))
    .filter(Boolean);

  function handleSaveProfile(e) {
    e.preventDefault();
    updateProfile({
      displayName: editName,
      bio: editBio,
      avatarUrl: editAvatar,
    });
    setIsEditingProfile(false);
  }

  return (
    <div className="app-shell letterboxd-theme">
      <Navbar />

      <main className="profile-page-main">
        <div className="profile-wrapper">
          {/* PROFILE HEADER (Matching user's Letterboxd screenshot) */}
          <header className="lb-profile-header">
            <div className="lb-header-left">
              <div className="lb-avatar-wrap">
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="lb-avatar-img"
                />
              </div>

              <div className="lb-user-info">
                <div className="lb-name-row">
                  <h1 className="lb-username">{profile.displayName || "JENNIL"}</h1>
                  <button
                    type="button"
                    className="lb-edit-btn"
                    onClick={() => {
                      setEditName(profile.displayName || "JENNIL");
                      setEditBio(profile.bio);
                      setEditAvatar(profile.avatarUrl);
                      setIsEditingProfile(true);
                    }}
                  >
                    EDIT PROFILE
                  </button>
                </div>

                <p className="lb-bio-tagline">
                  I fall in love easily with films, and with endings that ruin me. 🧃 🚶
                </p>

                <div className="lb-handle-row">
                  <span className="lb-handle">— {profile.username || "mr.prince"} 🥛</span>
                </div>

                <div className="lb-meta-links">
                  <span className="lb-meta-item">
                    <MapPin size={12} /> {profile.location || "Rajkot"}
                  </span>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="lb-meta-link"
                  >
                    <ExternalLink size={12} /> {profile.instagram || "instagram.com"}
                  </a>
                </div>
              </div>
            </div>

            {/* SIDE-BY-SIDE STATS BAR (ALL 5 STATS ON ONE ROW) */}
            <div className="lb-header-stats-row">
              <div className="lb-stat-cell">
                <strong className="lb-stat-val">{totalWatched}</strong>
                <span className="lb-stat-lbl">FILMS</span>
              </div>
              <div className="lb-stat-cell">
                <strong className="lb-stat-val">{diaryCount}</strong>
                <span className="lb-stat-lbl">THIS YEAR</span>
              </div>
              <div className="lb-stat-cell">
                <strong className="lb-stat-val">{listsCount}</strong>
                <span className="lb-stat-lbl">LISTS</span>
              </div>
              <div className="lb-stat-cell">
                <strong className="lb-stat-val">{watchlistCount}</strong>
                <span className="lb-stat-lbl">WATCHLIST</span>
              </div>
              <div className="lb-stat-cell lb-stat-avg">
                <strong className="lb-stat-val avg-star-val">★ {avgRating}</strong>
                <span className="lb-stat-lbl">AVG RATING</span>
              </div>
            </div>
          </header>

          {/* SUB-NAVBAR (Matching user's Letterboxd screenshot) */}
          <nav className="lb-subnav" aria-label="Profile navigation">
            <div className="lb-subnav-links">
              <span className="lb-subnav-item active">Profile</span>
              <Link to="/diary" className="lb-subnav-item">Activity</Link>
              <Link to="/movies" className="lb-subnav-item">Films</Link>
              <Link to="/diary" className="lb-subnav-item">Diary</Link>
              <Link to="/watchlist" className="lb-subnav-item">Watchlist</Link>
              <Link to="/lists" className="lb-subnav-item">Lists</Link>
            </div>
          </nav>

          {/* TWO-COLUMN LAYOUT: Left Main (~67%) + Right Sidebar (~33%) */}
          <div className="lb-profile-columns">
            {/* LEFT MAIN COLUMN */}
            <div className="lb-main-column">
              {/* 1. FAVORITE FILMS (Criterion Hall) */}
              <section className="lb-section">
                <div className="lb-section-title-row">
                  <h3 className="lb-section-title">FAVORITE FILMS</h3>
                </div>

                <div className="lb-favorites-row">
                  {favoriteSlots.map(({ index, movie }) => {
                    return (
                      <div key={index} className="lb-fav-col">
                        {movie ? (
                          <div
                            className="lb-fav-poster-card"
                            onClick={() => setFavSlotPickerIndex(index)}
                            role="button"
                            tabIndex={0}
                          >
                            <img src={movie.poster_path} alt={movie.title} />
                            <div className="lb-fav-hover-overlay">
                              <span className="lb-fav-film-title">{movie.title}</span>
                              <span className="lb-fav-film-year">({movie.release_date?.slice(0, 4)})</span>
                              <div className="lb-fav-quick-icons">
                                <Eye size={14} />
                                <Heart size={14} fill="#ff4b72" color="#ff4b72" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="lb-empty-fav-card"
                            onClick={() => setFavSlotPickerIndex(index)}
                          >
                            <Plus size={22} />
                            <span>Add #{index + 1}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 2. RECENT ACTIVITY (4 Poster Cards) */}
              <section className="lb-section">
                <div className="lb-section-title-row">
                  <h3 className="lb-section-title">RECENT ACTIVITY</h3>
                  <Link to="/diary" className="lb-section-link">ALL</Link>
                </div>

                <div className="lb-recent-activity-row">
                  {recentFourFilms.map((entry) => {
                    const movie = findMovieById(entry.movieId);
                    return (
                      <div
                        key={entry.id}
                        className="lb-activity-poster-card"
                        onClick={() => movie && setSelectedMovie(movie)}
                      >
                        <img src={entry.posterPath} alt={entry.movieTitle} />
                        <div className="lb-activity-hover-meta">
                          <span className="lb-hover-title">{entry.movieTitle}</span>
                          <div className="lb-hover-stars">
                            {entry.rating && <span className="lb-star-badge">★ {entry.rating}</span>}
                            {entry.isLiked && <Heart size={12} fill="#ff4b72" color="#ff4b72" />}
                            {entry.isRewatch && <Repeat size={11} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 3. RATINGS HISTOGRAM (Interactive 10 Pillars with Tooltip on Hover) */}
              <section className="lb-section lb-histogram-section">
                <RatingHistogram
                  ratingDistribution={ratingDistribution}
                  totalFilms={diary.length}
                  averageRating={avgRating}
                  selectedRating={activeRatingFilter}
                  onSelectRating={setActiveRatingFilter}
                />
              </section>

              {/* 4. RECENT REVIEWS & NOTES */}
              <section className="lb-section lb-reviews-section">
                <div className="lb-section-title-row">
                  <h3 className="lb-section-title">
                    RECENT REVIEWS
                    {activeRatingFilter && ` (${activeRatingFilter} ★)`}
                  </h3>
                </div>

                <div className="lb-reviews-list">
                  {filteredDiary
                    .filter((e) => e.review && e.review.trim().length > 0)
                    .slice(0, 4)
                    .map((entry) => {
                      const movie = findMovieById(entry.movieId);
                      return (
                        <article key={entry.id} className="lb-review-entry">
                          <div
                            className="lb-review-poster"
                            onClick={() => movie && setSelectedMovie(movie)}
                          >
                            <img src={entry.posterPath} alt={entry.movieTitle} />
                          </div>
                          <div className="lb-review-body">
                            <div className="lb-review-header">
                              <h4
                                onClick={() => movie && setSelectedMovie(movie)}
                                className="clickable-title"
                              >
                                {entry.movieTitle}
                              </h4>
                              <span className="lb-review-year">
                                {entry.releaseDate?.slice(0, 4)}
                              </span>
                              <div className="lb-review-rating-icons">
                                {entry.rating && (
                                  <StarRating
                                    value={entry.rating}
                                    readOnly
                                    size="sm"
                                    showScore
                                  />
                                )}
                                {entry.isLiked && (
                                  <Heart size={13} fill="#ff4b72" color="#ff4b72" />
                                )}
                                {entry.isRewatch && (
                                  <span className="lb-rewatch-tag"><Repeat size={11} /></span>
                                )}
                              </div>
                            </div>
                            <p className="lb-review-text">“{entry.review}”</p>
                            <span className="lb-review-date">Watched on {entry.watchDate}</span>
                          </div>
                        </article>
                      );
                    })}
                </div>
              </section>
            </div>

            {/* RIGHT SIDEBAR (~33% width, matching screenshot) */}
            <aside className="lb-sidebar-column">
              {/* WATCHLIST WITH OVERLAPPING FAN POSTERS */}
              <section className="lb-sidebar-block lb-watchlist-block">
                <div className="lb-sidebar-header">
                  <Link to="/watchlist" className="lb-sidebar-title-link">
                    WATCHLIST
                  </Link>
                  <Link to="/watchlist" className="lb-sidebar-count">
                    {watchlistCount}
                  </Link>
                </div>

                <Link to="/watchlist" className="lb-watchlist-fan-wrapper" title="Open your Watchlist">
                  {watchlistMovies.map((movie, index) => (
                    <div
                      key={movie.id}
                      className={`lb-fan-poster-item fan-idx-${index}`}
                    >
                      <img src={movie.poster_path} alt={movie.title} />
                    </div>
                  ))}
                  {watchlistMovies.length === 0 && (
                    <div className="empty-fan-text">
                      <span>No films in watchlist. Click bookmark to add!</span>
                    </div>
                  )}
                </Link>
              </section>

              {/* DIARY WITH CALENDAR BADGE AND SCREENINGS LIST */}
              <section className="lb-sidebar-block lb-diary-block">
                <div className="lb-sidebar-header">
                  <Link to="/diary" className="lb-sidebar-title-link">
                    DIARY
                  </Link>
                  <Link to="/diary" className="lb-sidebar-count">
                    {diaryCount}
                  </Link>
                </div>

                <div className="lb-diary-sidebar-list">
                  <div className="lb-diary-month-badge">
                    <span className="cal-top">📅</span>
                    <span className="cal-mon">SEP</span>
                  </div>

                  <ul className="lb-diary-entries-ul">
                    {diary.slice(0, 10).map((entry) => {
                      const movie = findMovieById(entry.movieId);
                      const dayNumber = entry.watchDate ? entry.watchDate.slice(8, 10) : "—";

                      return (
                        <li key={entry.id} className="lb-diary-entry-li">
                          <span className="diary-day-num">{dayNumber}</span>
                          <span
                            className="diary-entry-title"
                            onClick={() => movie && setSelectedMovie(movie)}
                            title={entry.movieTitle}
                          >
                            {entry.movieTitle}
                          </span>
                          <div className="diary-entry-meta-right">
                            {entry.rating && (
                              <span className="diary-star-mini">★ {entry.rating}</span>
                            )}
                            {entry.isLiked && (
                              <Heart size={10} fill="#ff4b72" color="#ff4b72" />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>

              {/* USER'S LISTS PREVIEW */}
              <section className="lb-sidebar-block lb-lists-block">
                <div className="lb-sidebar-header">
                  <Link to="/lists" className="lb-sidebar-title-link">
                    LISTS
                  </Link>
                  <Link to="/lists" className="lb-sidebar-count">
                    {listsCount}
                  </Link>
                </div>

                <div className="lb-lists-sidebar-items">
                  {lists.map((list) => (
                    <Link
                      key={list.id}
                      to="/lists"
                      className="lb-sidebar-list-row"
                    >
                      <div>
                        <strong>{list.title}</strong>
                        <small>{list.movieIds.length} films · {list.isOrdered ? "Ranked" : "Collection"}</small>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <span>© 2026 ReelMind</span>
        <span>Cinema profile for {profile.displayName || "JENNIL"}.</span>
        <span aria-hidden="true">▰ · ▰ · ▰</span>
      </footer>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => e.target === e.currentTarget && setIsEditingProfile(false)}
        >
          <div className="edit-profile-modal spacious-modal" role="dialog" aria-modal="true">
            <h3>Edit Your Profile</h3>
            <form onSubmit={handleSaveProfile} className="mt-4">
              <div className="form-group">
                <label className="input-label">Display Name</label>
                <input
                  type="text"
                  className="styled-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label className="input-label">Bio</label>
                <textarea
                  className="styled-textarea"
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <label className="input-label">Avatar Image URL</label>
                <input
                  type="url"
                  className="styled-input"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                />
              </div>

              <div className="modal-actions mt-4">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pick Favorite Modal */}
      <PickFavoriteModal
        slotIndex={favSlotPickerIndex ?? 0}
        isOpen={favSlotPickerIndex !== null}
        onClose={() => setFavSlotPickerIndex(null)}
      />

      {/* Movie Details Modal */}
      <MovieDetails
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onOpenLogModal={(m) => setLogModalMovie(m)}
      />

      {/* Log Movie Modal */}
      <LogMovieModal
        movie={logModalMovie}
        isOpen={Boolean(logModalMovie)}
        onClose={() => setLogModalMovie(null)}
      />
    </div>
  );
}
