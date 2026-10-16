import { Link } from "react-router-dom";

export default function Placeholder({ title, description, ctaLabel = "Back to shop", ctaTo = "/shop" }) {
  return (
    <div className="page-container py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="text-2xl font-black tracking-tight text-slate-900">{title}</div>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
        <Link to={ctaTo} className="btn btn-primary mt-6">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}