import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Navbar from "../components/Navbar";
import MovieDetails from "../components/MovieDetails";
import LogMovieModal from "../components/LogMovieModal";
import { useFilmTracker, findMovieById } from "../context/FilmTrackerContext";
import { sampleMovies } from "../data/sampleMovies";
import {
  List,
  Plus,
  Trash2,
  Check,
  Search,
  Sliders,
  Sparkles,
  ArrowLeft,
  X,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/lists")({
  head: () => ({
    meta: [
      { title: "Movie Lists — ReelMind" },
      { name: "description", content: "Create and browse custom ordered and unordered cinema lists." },
    ],
  }),
  component: ListsPage,
});

function ListsPage() {
  const { lists, createList, deleteList, updateList, toggleMovieInList } = useFilmTracker();

  const [activeListId, setActiveListId] = useState(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isAddingMoviesToList, setIsAddingMoviesToList] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [logModalMovie, setLogModalMovie] = useState(null);

  // New list form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isOrdered, setIsOrdered] = useState(false);
  const [selectedMovieIds, setSelectedMovieIds] = useState([]);
  const [movieSearch, setMovieSearch] = useState("");

  const activeList = lists.find((l) => l.id === activeListId);

  const activeListMovies = activeList
    ? activeList.movieIds.map((id) => findMovieById(id)).filter(Boolean)
    : [];

  const searchResultsForNewList = movieSearch.trim()
    ? sampleMovies
        .filter((m) => m.title.toLowerCase().includes(movieSearch.toLowerCase()))
        .slice(0, 8)
    : sampleMovies.slice(0, 8);

  function handleCreateListSubmit(e) {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a list title.");
      return;
    }

    const created = createList({
      title: newTitle,
      description: newDescription,
      isOrdered,
      movieIds: selectedMovieIds,
    });

    toast.success(`Created list "${created.title}"!`);
    setIsCreatingList(false);
    setNewTitle("");
    setNewDescription("");
    setIsOrdered(false);
    setSelectedMovieIds([]);
    setMovieSearch("");
    setActiveListId(created.id);
  }

  function handleDeleteList(list) {
    if (confirm(`Are you sure you want to delete "${list.title}"?`)) {
      deleteList(list.id);
      if (activeListId === list.id) setActiveListId(null);
      toast.success(`Deleted list "${list.title}"`);
    }
  }

  function handleToggleOrder(list) {
    updateList(list.id, { isOrdered: !list.isOrdered });
    toast.info(`Changed list to ${!list.isOrdered ? "Ordered (Ranked)" : "Unordered"}`);
  }

  function handleRemoveMovieFromActiveList(movieId, movieTitle) {
    if (!activeList) return;
    toggleMovieInList(activeList.id, movieId);
    toast.info(`Removed "${movieTitle}" from list`);
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container lists-container">
        {/* If viewing a specific list detail */}
        {activeList ? (
          <div className="active-list-detail-view">
            <button
              type="button"
              className="back-to-lists-btn"
              onClick={() => setActiveListId(null)}
            >
              <ArrowLeft size={16} /> Back to All Lists
            </button>

            <header className="active-list-header">
              <div className="active-list-header-info">
                <div className="list-badges-row">
                  <span className={`order-badge ${activeList.isOrdered ? "is-ordered" : "is-unordered"}`}>
                    {activeList.isOrdered ? "Ordered (1, 2, 3...)" : "Unordered Collection"}
                  </span>
                  <span className="count-badge">{activeListMovies.length} films</span>
                </div>
                <h1>{activeList.title}</h1>
                {activeList.description && <p className="list-desc">{activeList.description}</p>}
              </div>

              <div className="active-list-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleToggleOrder(activeList)}
                >
                  <Sliders size={14} /> Make {activeList.isOrdered ? "Unordered" : "Ordered"}
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsAddingMoviesToList(true)}
                >
                  <Plus size={15} /> Add Films
                </button>

                <button
                  type="button"
                  className="btn-danger-outline"
                  onClick={() => handleDeleteList(activeList)}
                  title="Delete this list"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </header>

            {/* List Films Display: Ordered vs Unordered */}
            {activeListMovies.length > 0 ? (
              <div className={activeList.isOrdered ? "ordered-films-list" : "unordered-films-grid"}>
                {activeListMovies.map((movie, index) => {
                  return (
                    <article
                      key={movie.id}
                      className={`list-film-entry ${activeList.isOrdered ? "ordered-entry" : "unordered-entry"}`}
                    >
                      {activeList.isOrdered && (
                        <div className="rank-position-badge">
                          <span>{index + 1}</span>
                        </div>
                      )}

                      <div
                        className="list-film-poster-wrap"
                        onClick={() => setSelectedMovie(movie)}
                      >
                        <img src={movie.poster_path} alt={movie.title} />
                      </div>

                      <div className="list-film-info">
                        <h3 onClick={() => setSelectedMovie(movie)} className="clickable-title">
                          {movie.title}
                        </h3>
                        <p className="list-film-meta">
                          {movie.release_date?.slice(0, 4)} <span>•</span> {movie.genres?.split(",")[0]} <span>•</span> ★ {movie.vote_average}
                        </p>
                        {activeList.isOrdered && (
                          <p className="film-overview-snippet">{movie.overview}</p>
                        )}
                      </div>

                      <div className="list-film-actions">
                        <button
                          type="button"
                          className="btn-log-inline"
                          onClick={() => setLogModalMovie(movie)}
                        >
                          Log Film
                        </button>
                        <button
                          type="button"
                          className="remove-from-list-btn"
                          onClick={() => handleRemoveMovieFromActiveList(movie.id, movie.title)}
                          title="Remove from list"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="message-state">
                <span className="empty-icon">◌</span>
                <strong>This list has no films yet.</strong>
                <p>Click "Add Films" above to curate your first selection.</p>
                <button
                  type="button"
                  className="btn-primary mt-3"
                  onClick={() => setIsAddingMoviesToList(true)}
                >
                  <Plus size={15} /> Add Films Now
                </button>
              </div>
            )}
          </div>
        ) : (
          /* All Lists Showcase */
          <>
            <header className="page-header">
              <div className="page-header-text">
                <span className="eyebrow"><Layers size={12} /> Curated Cinema</span>
                <h1>Film Lists</h1>
                <p>
                  Build ranked countdowns, personal favorites, or thematic collections according to your taste.
                </p>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setIsCreatingList(true)}
              >
                <Plus size={16} /> Create New List
              </button>
            </header>

            <div className="all-lists-grid">
              {lists.map((list) => {
                const previewMovies = list.movieIds
                  .slice(0, 4)
                  .map((id) => findMovieById(id))
                  .filter(Boolean);

                return (
                  <article
                    key={list.id}
                    className="list-card-showcase"
                    onClick={() => setActiveListId(list.id)}
                  >
                    <div className="list-fan-display">
                      {previewMovies.map((m, idx) => (
                        <img
                          key={m.id}
                          src={m.poster_path}
                          alt={m.title}
                          className={`stacked-fan-poster fan-layer-${idx}`}
                        />
                      ))}
                      {previewMovies.length === 0 && (
                        <div className="empty-fan-placeholder">
                          <span>Empty List</span>
                        </div>
                      )}
                    </div>

                    <div className="list-card-meta">
                      <div className="list-meta-top">
                        <span className={`order-badge-pill ${list.isOrdered ? "ordered" : "unordered"}`}>
                          {list.isOrdered ? "Ranked (1, 2, 3...)" : "Collection"}
                        </span>
                        <span className="list-count-text">{list.movieIds.length} films</span>
                      </div>

                      <h3>{list.title}</h3>
                      <p>{list.description || "No description provided."}</p>

                      <div className="list-card-bottom">
                        <span className="open-list-link">View List →</span>
                        <button
                          type="button"
                          className="delete-list-icon-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteList(list);
                          }}
                          title="Delete list"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>

      <footer className="site-footer">
        <span>© 2026 ReelMind</span>
        <span>Custom ordered and unordered film collections.</span>
        <span aria-hidden="true">▰ · ▰ · ▰</span>
      </footer>

      {/* CREATE NEW LIST MODAL */}
      {isCreatingList && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => e.target === e.currentTarget && setIsCreatingList(false)}
        >
          <div className="create-list-modal" role="dialog" aria-modal="true">
            <button
              className="close-button"
              type="button"
              onClick={() => setIsCreatingList(false)}
            >
              <X size={20} />
            </button>

            <span className="eyebrow"><Sparkles size={12} /> New Collection</span>
            <h2>Create a Movie List</h2>

            <form onSubmit={handleCreateListSubmit} className="create-list-form">
              <div className="form-group">
                <label className="input-label">List Title</label>
                <input
                  type="text"
                  className="styled-input"
                  placeholder="e.g. My Favorite Thrillers, 10 Must-See Nolan Masterpieces"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="input-label">Description (optional)</label>
                <textarea
                  className="styled-textarea"
                  rows={3}
                  placeholder="What is the theme or intention behind this list?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              {/* Ordered vs Unordered toggle */}
              <div className="form-group list-mode-selector">
                <label className="input-label">List Ordering Style</label>
                <div className="mode-options-grid">
                  <label
                    className={`mode-card ${isOrdered ? "selected" : ""}`}
                    onClick={() => setIsOrdered(true)}
                  >
                    <input
                      type="radio"
                      name="ordering"
                      checked={isOrdered}
                      onChange={() => setIsOrdered(true)}
                    />
                    <div>
                      <strong>Ranked / Ordered (1, 2, 3...)</strong>
                      <p>Entries are strictly numbered in order of preference or ranking.</p>
                    </div>
                  </label>

                  <label
                    className={`mode-card ${!isOrdered ? "selected" : ""}`}
                    onClick={() => setIsOrdered(false)}
                  >
                    <input
                      type="radio"
                      name="ordering"
                      checked={!isOrdered}
                      onChange={() => setIsOrdered(false)}
                    />
                    <div>
                      <strong>Unordered Collection</strong>
                      <p>Films are presented as a curated collection with equal weight.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Add starter films to list */}
              <div className="form-group">
                <label className="input-label">Select Films to Include ({selectedMovieIds.length} chosen)</label>
                <div className="search-starter-input-wrap">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search movies to add..."
                    value={movieSearch}
                    onChange={(e) => setMovieSearch(e.target.value)}
                    className="styled-input"
                  />
                </div>

                <div className="starter-films-checklist">
                  {searchResultsForNewList.map((m) => {
                    const isSelected = selectedMovieIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        className={`film-starter-row ${isSelected ? "is-selected" : ""}`}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedMovieIds(selectedMovieIds.filter((id) => id !== m.id));
                          } else {
                            setSelectedMovieIds([...selectedMovieIds, m.id]);
                          }
                        }}
                      >
                        <img src={m.poster_path} alt={m.title} className="starter-thumb" />
                        <div className="starter-film-meta">
                          <strong>{m.title}</strong>
                          <small>{m.release_date?.slice(0, 4)} · ★ {m.vote_average}</small>
                        </div>
                        <div className="starter-check-circle">
                          {isSelected && <Check size={12} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsCreatingList(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FILMS TO EXISTING ACTIVE LIST MODAL */}
      {isAddingMoviesToList && activeList && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => e.target === e.currentTarget && setIsAddingMoviesToList(false)}
        >
          <div className="create-list-modal" role="dialog" aria-modal="true">
            <button
              className="close-button"
              type="button"
              onClick={() => setIsAddingMoviesToList(false)}
            >
              <X size={20} />
            </button>

            <span className="eyebrow"><Plus size={12} /> Add to List</span>
            <h2>Add Films to "{activeList.title}"</h2>

            <div className="search-starter-input-wrap mb-4">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search films by title or genre..."
                value={movieSearch}
                onChange={(e) => setMovieSearch(e.target.value)}
                className="styled-input"
                autoFocus
              />
            </div>

            <div className="starter-films-checklist">
              {sampleMovies
                .filter((m) => {
                  const q = movieSearch.toLowerCase().trim();
                  return !q || m.title.toLowerCase().includes(q) || m.genres.toLowerCase().includes(q);
                })
                .slice(0, 15)
                .map((m) => {
                  const inList = activeList.movieIds.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      className={`film-starter-row ${inList ? "is-selected" : ""}`}
                      onClick={() => {
                        toggleMovieInList(activeList.id, m.id);
                        if (inList) {
                          toast.info(`Removed "${m.title}"`);
                        } else {
                          toast.success(`Added "${m.title}"`);
                        }
                      }}
                    >
                      <img src={m.poster_path} alt={m.title} className="starter-thumb" />
                      <div className="starter-film-meta">
                        <strong>{m.title}</strong>
                        <small>{m.release_date?.slice(0, 4)} · ★ {m.vote_average}</small>
                      </div>
                      <div className="starter-check-circle">
                        {inList && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="modal-actions mt-4">
              <button
                type="button"
                className="btn-save"
                onClick={() => setIsAddingMoviesToList(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Details Modal */}
      <MovieDetails
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onOpenLogModal={(m) => setLogModalMovie(m)}
      />

      {/* Log Modal */}
      <LogMovieModal
        movie={logModalMovie}
        isOpen={Boolean(logModalMovie)}
        onClose={() => setLogModalMovie(null)}
      />
    </div>
  );
}
