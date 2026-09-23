import { useState } from "react";

/**
 * StarRating component supporting 0.5 to 5.0 stars.
 * @param {number|null} value - Current rating value (e.g. 3.5)
 * @param {function} onChange - Callback when rating changes: (newRating) => void
 * @param {boolean} readOnly - If true, just displays the rating
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} showScore - Whether to render text score next to stars
 */
export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "md",
  showScore = false,
  className = "",
}) {
  const [hoverValue, setHoverValue] = useState(null);

  const activeValue = hoverValue !== null ? hoverValue : (value || 0);

  function handleMouseMove(starIndex, event) {
    if (readOnly || !onChange) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    const computed = starIndex - (isLeftHalf ? 0.5 : 0);
    setHoverValue(computed);
  }

  function handleClick(starIndex, event) {
    if (readOnly || !onChange) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    const computed = starIndex - (isLeftHalf ? 0.5 : 0);

    // If clicking same rating, toggle off (0)
    if (value === computed) {
      onChange(0);
    } else {
      onChange(computed);
    }
  }

  const starSizes = {
    sm: 14,
    md: 20,
    lg: 26,
  };

  const pixelSize = starSizes[size] || 20;

  return (
    <div
      className={`star-rating-container ${size} ${readOnly ? "read-only" : "interactive"} ${className}`}
      onMouseLeave={() => !readOnly && setHoverValue(null)}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`Rating: ${activeValue} out of 5 stars`}
    >
      <div className="stars-row">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const fillPercentage = Math.max(0, Math.min(100, (activeValue - (starIndex - 1)) * 100));

          return (
            <button
              key={starIndex}
              type="button"
              disabled={readOnly}
              className="star-button"
              onMouseMove={(e) => handleMouseMove(starIndex, e)}
              onClick={(e) => handleClick(starIndex, e)}
              aria-label={`${starIndex} stars`}
            >
              <svg
                width={pixelSize}
                height={pixelSize}
                viewBox="0 0 24 24"
                className="star-svg"
              >
                <defs>
                  <linearGradient id={`star-grad-${starIndex}-${fillPercentage}-${size}`}>
                    <stop offset={`${fillPercentage}%`} stopColor="var(--accent, #d7a15b)" />
                    <stop offset={`${fillPercentage}%`} stopColor="rgba(255,255,255,0.15)" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#star-grad-${starIndex}-${fillPercentage}-${size})`}
                  stroke={fillPercentage > 0 ? "var(--accent, #d7a15b)" : "rgba(255,255,255,0.25)"}
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="star-rating-score">
          {activeValue > 0 ? activeValue.toFixed(1) : "—"}
          <small>/5</small>
        </span>
      )}
    </div>
  );
}
