import { useState } from "react";
import { useFilmTracker } from "../context/FilmTrackerContext";
import { X, Plus, Check, ListPlus, Film } from "lucide-react";
import { toast } from "sonner";

export default function AddToListModal({ movie, isOpen, onClose }) {
  const { lists, toggleMovieInList, createList } = useFilmTracker();
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen || !movie) return null;

  function handleCreateList(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createList({
      title: newTitle,
      description: newDescription,
      isOrdered,
      movieIds: [movie.id],
    });

    toast.success(`Created list "${newTitle}" with ${movie.title}!`);
    setNewTitle("");
    setNewDescription("");
    setIsOrdered(false);
    setShowCreateNew(false);
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="add-to-list-modal" role="dialog" aria-modal="true" aria-labelledby="add-list-title">
        <button className="close-button" type="button" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="add-list-header">
          <span className="eyebrow"><ListPlus size={12} /> Lists</span>
          <h2 id="add-list-title">Add "{movie.title}" to a List</h2>
        </div>

        <div className="existing-lists-checklist">
          {lists.map((list) => {
            const inList = list.movieIds.includes(movie.id);
            return (
              <button
                key={list.id}
                type="button"
                className={`list-select-row ${inList ? "in-list" : ""}`}
                onClick={() => {
                  toggleMovieInList(list.id, movie.id);
                  if (inList) {
                    toast.info(`Removed from "${list.title}"`);
                  } else {
                    toast.success(`Added to "${list.title}"`);
                  }
                }}
              >
                <div className="list-select-info">
                  <strong>{list.title}</strong>
                  <small>
                    {list.isOrdered ? "Numbered / Ranked" : "Unordered"} · {list.movieIds.length} films
                  </small>
                </div>
                <div className="checkbox-indicator">
                  {inList && <Check size={14} />}
                </div>
              </button>
            );
          })}
        </div>

        {!showCreateNew ? (
          <button
            type="button"
            className="create-new-list-btn"
            onClick={() => setShowCreateNew(true)}
          >
            <Plus size={16} /> Create a New List
          </button>
        ) : (
          <form onSubmit={handleCreateList} className="new-list-inline-form">
            <h4 className="new-list-title">Create New List</h4>
            <input
              type="text"
              className="styled-input"
              placeholder="List Title (e.g., Best Plot Twists)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              autoFocus
            />
            <textarea
              className="styled-textarea"
              rows={2}
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <label className="order-toggle-label">
              <input
                type="checkbox"
                checked={isOrdered}
                onChange={(e) => setIsOrdered(e.target.checked)}
              />
              <span>Ranked / Ordered list (1, 2, 3...)</span>
            </label>
            <div className="inline-form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowCreateNew(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Create & Add Film
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
