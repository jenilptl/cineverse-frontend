import { useRef, useState } from "react";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight, LayoutGrid, Rows, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function MovieScroller({
  movies = [],
  onViewDetails,
  onLogMovie,
  onAddToList,
  totalCount = 0,
}) {
  const scrollerRef = useRef(null);
  const [viewMode, setViewMode] = useState("scroller"); // "scroller" or "grid"

  function scroll(direction) {
    if (!scrollerRef.current) return;
    const offset = direction === "left" ? -650 : 650;
    scrollerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  }

  return (
    <div className="scroller-container-wrap">
      <div className="scroller-toolbar">
        <div className="scroller-hint">
          <span className="scroller-pulse-dot" />
          <span>Swipe or click arrows to browse the reel</span>
        </div>

        <div className="scroller-toolbar-actions">
          <div className="view-toggle-pills">
            <button
              type="button"
              className={`view-pill ${viewMode === "scroller" ? "active" : ""}`}
              onClick={() => setViewMode("scroller")}
              title="Compact horizontal scroller"
            >
              <Rows size={14} /> Reel Scroller
            </button>
            <button
              type="button"
              className={`view-pill ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid size={14} /> Grid
            </button>
          </div>

          <Link to="/movies" className="see-all-link">
            <span>Explore All {totalCount} Films</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {viewMode === "scroller" ? (
        <div className="scroller-stage">
          <button
            type="button"
            className="scroll-arrow arrow-left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="horizontal-film-strip" ref={scrollerRef}>
            {movies.map((movie) => (
              <div key={movie.id} className="scroller-film-card">
                <MovieCard
                  movie={movie}
                  onViewDetails={onViewDetails}
                  onLogMovie={onLogMovie}
                  onAddToList={onAddToList}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="scroll-arrow arrow-right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onViewDetails={onViewDetails}
              onLogMovie={onLogMovie}
              onAddToList={onAddToList}
            />
          ))}
        </div>
      )}
    </div>
  );
}
