import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import MovieDetails from "../components/MovieDetails";
import LogMovieModal from "../components/LogMovieModal";
import StarRating from "../components/StarRating";
import { useFilmTracker, findMovieById } from "../context/FilmTrackerContext";
import {
  Calendar,
  Heart,
  Repeat,
  Plus,
  Trash2,
  BookOpen,
  Search,
  MessageSquare,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/diary")({
  head: () => ({
    meta: [
      { title: "Film Diary — ReelMind" },
      { name: "description", content: "Your chronological screening diary of every movie watched, rated, and reviewed." },
    ],
  }),
  component: DiaryPage,
});

function formatDateParts(dateStr) {
  if (!dateStr) return { day: "—", month: "—", year: "—", monthYearKey: "Unknown" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: dateStr, month: "", year: "", monthYearKey: "Other" };

  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  const monthFull = d.toLocaleString("en-US", { month: "long" }).toUpperCase();
  const monthYearKey = `${monthFull} ${year}`;

  return { day, month, year, monthYearKey };
}

function DiaryPage() {
  const { diary, deleteDiaryEntry } = useFilmTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [minRatingFilter, setMinRatingFilter] = useState("all");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [activeReviewEntry, setActiveReviewEntry] = useState(null);

  // Filter and sort entries chronologically (newest watchDate first)
  const filteredEntries = useMemo(() => {
    return [...diary]
      .filter((entry) => {
        const matchesQuery =
          !searchQuery.trim() ||
          entry.movieTitle.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          (entry.review && entry.review.toLowerCase().includes(searchQuery.toLowerCase().trim()));

        const matchesRating =
          minRatingFilter === "all" ||
          (entry.rating && entry.rating >= Number(minRatingFilter));

        return matchesQuery && matchesRating;
      })
      .sort((a, b) => (b.watchDate || "").localeCompare(a.watchDate || ""));
  }, [diary, searchQuery, minRatingFilter]);

  // Group entries by Month Year (e.g. "SEPTEMBER 2026")
  const groupedEntries = useMemo(() => {
    const groups = [];
    let currentKey = "";
    let currentGroup = null;

    filteredEntries.forEach((entry) => {
      const { monthYearKey } = formatDateParts(entry.watchDate);
      if (monthYearKey !== currentKey) {
        currentKey = monthYearKey;
        currentGroup = {
          title: currentKey,
          entries: [],
        };
        groups.push(currentGroup);
      }
      currentGroup.entries.push(entry);
    });

    return groups;
  }, [filteredEntries]);

  function handleDelete(entry) {
    if (confirm(`Remove "${entry.movieTitle}" (${entry.watchDate}) from diary?`)) {
      deleteDiaryEntry(entry.id);
      toast.success(`Removed "${entry.movieTitle}" from diary`);
    }
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container diary-container">
        <header className="page-header">
          <div className="page-header-text">
            <span className="eyebrow"><Calendar size={12} /> Film Journal</span>
            <h1>Screening Diary</h1>
            <p>
              A date-by-date record of every film you have experienced, rated, and reviewed.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary log-new-diary-btn"
            onClick={() => setIsLogModalOpen(true)}
          >
            <Plus size={16} /> Log a Film
          </button>
        </header>

        {/* Filter bar */}
        <div className="diary-filter-bar">
          <div className="diary-search-input-wrap">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search diary by title or review note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="diary-search-input"
            />
          </div>

          <div className="diary-filter-options">
            <label>
              <span>Filter Rating:</span>
              <select
                value={minRatingFilter}
                onChange={(e) => setMinRatingFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
                <option value="2.0">2.0+ Stars</option>
              </select>
            </label>

            <span className="diary-count-badge">
              {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </div>

        {/* Chronological Letterboxd-style Diary Table */}
        {groupedEntries.length > 0 ? (
          <div className="diary-timeline">
            {groupedEntries.map((group) => (
              <section key={group.title} className="diary-month-group">
                <div className="month-group-heading">
                  <h3>{group.title}</h3>
                  <span className="month-line" />
                </div>

                <div className="diary-table">
                  <div className="diary-table-header">
                    <span className="col-date">Date</span>
                    <span className="col-film">Film</span>
                    <span className="col-released">Released</span>
                    <span className="col-rating">Rating</span>
                    <span className="col-like">Like</span>
                    <span className="col-rewatch">Rewatch</span>
                    <span className="col-review">Review</span>
                    <span className="col-action"></span>
                  </div>

                  <div className="diary-table-body">
                    {group.entries.map((entry) => {
                      const { day, month } = formatDateParts(entry.watchDate);
                      const movie = findMovieById(entry.movieId);

                      return (
                        <div key={entry.id} className="diary-table-row">
                          <div className="col-date">
                            <span className="date-day">{day}</span>
                            <span className="date-month">{month}</span>
                          </div>

                          <div
                            className="col-film film-clickable"
                            onClick={() => movie && setSelectedMovie(movie)}
                          >
                            <img
                              src={entry.posterPath}
                              alt={entry.movieTitle}
                              className="diary-thumb"
                            />
                            <div className="diary-film-info">
                              <strong>{entry.movieTitle}</strong>
                            </div>
                          </div>

                          <div className="col-released">
                            <span>{entry.releaseDate?.slice(0, 4) || "—"}</span>
                          </div>

                          <div className="col-rating">
                            {entry.rating ? (
                              <StarRating
                                value={entry.rating}
                                readOnly
                                size="sm"
                                showScore
                              />
                            ) : (
                              <span className="unrated-dash">—</span>
                            )}
                          </div>

                          <div className="col-like">
                            {entry.isLiked ? (
                              <Heart size={16} fill="#ff4b72" color="#ff4b72" />
                            ) : (
                              <span className="muted-dash">—</span>
                            )}
                          </div>

                          <div className="col-rewatch">
                            {entry.isRewatch ? (
                              <span className="rewatch-symbol" title="Rewatch">
                                <Repeat size={14} />
                              </span>
                            ) : (
                              <span className="muted-dash">—</span>
                            )}
                          </div>

                          <div className="col-review">
                            {entry.review ? (
                              <button
                                type="button"
                                className="review-snippet-btn"
                                onClick={() => setActiveReviewEntry(entry)}
                                title="Click to read review"
                              >
                                <MessageSquare size={13} />
                                <span>Read</span>
                              </button>
                            ) : (
                              <span className="muted-dash">—</span>
                            )}
                          </div>

                          <div className="col-action">
                            <button
                              type="button"
                              className="delete-entry-btn"
                              onClick={() => handleDelete(entry)}
                              title="Delete entry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="message-state">
            <span className="empty-icon" aria-hidden="true">◌</span>
            <strong>No diary entries found.</strong>
            <p>Start tracking what you watch by clicking "Log a Film".</p>
            <button
              type="button"
              className="btn-primary mt-3"
              onClick={() => setIsLogModalOpen(true)}
            >
              Log Your First Film
            </button>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <span>© 2026 ReelMind</span>
        <span>Diary timestamps stored chronologically.</span>
        <span aria-hidden="true">▰ · ▰ · ▰</span>
      </footer>

      {/* Review Reader Modal */}
      {activeReviewEntry && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => e.target === e.currentTarget && setActiveReviewEntry(null)}
        >
          <div className="review-reader-modal" role="dialog" aria-modal="true">
            <button
              className="close-button"
              type="button"
              onClick={() => setActiveReviewEntry(null)}
            >
              <X size={20} />
            </button>
            <div className="review-reader-header">
              <img
                src={activeReviewEntry.posterPath}
                alt={activeReviewEntry.movieTitle}
                className="review-reader-poster"
              />
              <div>
                <span className="eyebrow">Review</span>
                <h2>{activeReviewEntry.movieTitle}</h2>
                <div className="review-reader-meta">
                  <StarRating
                    value={activeReviewEntry.rating || 0}
                    readOnly
                    size="sm"
                    showScore
                  />
                  <span>Watched on {activeReviewEntry.watchDate}</span>
                  {activeReviewEntry.isLiked && (
                    <span className="liked-text">
                      <Heart size={13} fill="#ff4b72" color="#ff4b72" /> Liked
                    </span>
                  )}
                  {activeReviewEntry.isRewatch && (
                    <span className="rewatch-text">
                      <Repeat size={12} /> Rewatched
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="review-reader-body">
              <p>“{activeReviewEntry.review}”</p>
            </div>
          </div>
        </div>
      )}

      {/* Log Modal */}
      <LogMovieModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />

      {/* Movie Details Modal */}
      <MovieDetails
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}
