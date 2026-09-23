import { useState } from "react";
import { Star } from "lucide-react";

/**
 * Letterboxd-style 10-pillar vertical ratings histogram.
 * Pillars represent ratings from 0.5 to 5.0 stars with hover tooltips.
 */
export default function RatingHistogram({
  ratingDistribution = {},
  totalFilms = 0,
  averageRating = "—",
  onSelectRating,
  selectedRating = null,
}) {
  const [hoveredBar, setHoveredBar] = useState(null);

  const starLevels = [
    { key: "0.5", label: "½ ★", num: 0.5 },
    { key: "1.0", label: "★", num: 1.0 },
    { key: "1.5", label: "★½", num: 1.5 },
    { key: "2.0", label: "★★", num: 2.0 },
    { key: "2.5", label: "★★½", num: 2.5 },
    { key: "3.0", label: "★★★", num: 3.0 },
    { key: "3.5", label: "★★★½", num: 3.5 },
    { key: "4.0", label: "★★★★", num: 4.0 },
    { key: "4.5", label: "★★★★½", num: 4.5 },
    { key: "5.0", label: "★★★★★", num: 5.0 },
  ];

  const counts = starLevels.map((lvl) => ratingDistribution[lvl.key] || 0);
  const maxCount = Math.max(1, ...counts);
  const totalRated = counts.reduce((sum, c) => sum + c, 0);

  return (
    <div className="letterboxd-histogram-wrap">
      <div className="histogram-header">
        <div className="histogram-title-wrap">
          <span className="histogram-eyebrow">RATINGS</span>
          <div className="histogram-stats-inline">
            <span className="hist-total-rated">{totalRated} ratings</span>
            <span className="hist-dot">•</span>
            <span className="hist-avg-score">
              <Star size={11} fill="var(--accent)" color="var(--accent)" />
              <strong>{averageRating}</strong> avg
            </span>
          </div>
        </div>

        {selectedRating && onSelectRating && (
          <button
            type="button"
            className="clear-hist-filter-link"
            onClick={() => onSelectRating(null)}
          >
            Show all
          </button>
        )}
      </div>

      <div className="histogram-chart-area">
        <div className="histogram-bars-row">
          {starLevels.map((lvl, index) => {
            const count = ratingDistribution[lvl.key] || 0;
            // Calculate height percentage (minimum 4px so even 0 has a subtle baseline tick)
            const heightPercent = count > 0 ? Math.max(12, Math.round((count / maxCount) * 100)) : 4;
            const isHovered = hoveredBar?.key === lvl.key;
            const isSelected = selectedRating === lvl.key;

            return (
              <div
                key={lvl.key}
                className={`hist-bar-col ${count > 0 ? "has-data" : "empty-bar"} ${isHovered ? "hovered" : ""} ${isSelected ? "selected" : ""}`}
                onMouseEnter={() => setHoveredBar({ ...lvl, count })}
                onMouseLeave={() => setHoveredBar(null)}
                onClick={() => count > 0 && onSelectRating && onSelectRating(isSelected ? null : lvl.key)}
                role="button"
                tabIndex={0}
                aria-label={`${lvl.label}: ${count} films`}
              >
                {/* Floating tooltip on hover (instant pure CSS :hover + aria tooltip) */}
                <div className="hist-pillar-tooltip" role="tooltip">
                  <span className="tooltip-stars">{lvl.label}</span>
                  <strong className="tooltip-count">
                    {count} {count === 1 ? "film" : "films"}
                  </strong>
                  {totalRated > 0 && (
                    <small className="tooltip-percent">
                      ({Math.round((count / totalRated) * 100)}%)
                    </small>
                  )}
                </div>

                <div className="hist-bar-track">
                  <div
                    className="hist-bar-fill"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom star axis */}
        <div className="histogram-axis">
          <span className="axis-label-left">½★</span>
          <span className="axis-midpoint-dots">· · · · · · · ·</span>
          <span className="axis-label-right">★★★★★</span>
        </div>
      </div>
    </div>
  );
}
