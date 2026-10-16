import { formatNumber } from "../utils/format.js";

function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={filled ? "h-4 w-4 text-gold" : "h-4 w-4 text-slate-300"}
      fill="currentColor"
    >
      <path d="M12 17.3 5.82 21l1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.73L18.18 21 12 17.3z" />
    </svg>
  );
}

export default function StarRating({ rating = 0, reviews = 0 }) {
  const ratingValue = Number(rating ?? 0);
  const rounded = Math.round(ratingValue);
  const stars = [1, 2, 3, 4, 5].map((n) => n <= rounded);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {stars.map((filled, idx) => (
          <Star key={idx} filled={filled} />
        ))}
      </div>
      <div className="hidden text-xs font-semibold text-slate-500 sm:block">
        {ratingValue.toFixed(1)} ({formatNumber(reviews)})
      </div>
    </div>
  );
}