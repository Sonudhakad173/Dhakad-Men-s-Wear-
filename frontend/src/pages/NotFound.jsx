import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-container py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="text-2xl font-black tracking-tight text-slate-900">Page not found</div>
        <p className="mt-2 text-sm text-slate-600">That route doesn’t exist.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn btn-primary">
            Go home
          </Link>
          <Link to="/shop" className="btn btn-outline">
            Shop menswear
          </Link>
        </div>
      </div>
    </div>
  );
}