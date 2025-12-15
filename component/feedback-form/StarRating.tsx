import React from "react";

export default function StarRating({
  total,
  value,
  onChange,
  error,
  name,
}: {
  total: number;
  value: number;
  onChange: (v: number) => void;
  error?: boolean;
  name?: string;
}) {
  const handleClick = (i: number) => {
    onChange(value === i + 1 ? i : i + 1);
  };

  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label={name}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i + 1 <= value;
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(i)}
            aria-pressed={filled}
            aria-label={`${i + 1} star`}
            className="w-8 h-8 flex items-center justify-center rounded-md focus:outline-none "
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 transition"
              fill={filled ? (error ? "#ef4444" : "#facc15") : "none"}
              stroke={error ? "#ef4444" : "#facc15"}
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path d="M12 .587l3.668 7.431L23.5 9.748l-5.75 5.603L19.334 23 12 19.771 4.666 23l1.584-7.649L.5 9.748l7.832-1.73L12 .587z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
