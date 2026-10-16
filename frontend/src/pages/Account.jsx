import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context.js";
import { useToast } from "../store/toast-context.js";

function Field({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-black">
      <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

export default function Account() {
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  if (!auth.isAuthed) {
    return (
      <div className="page-container py-12">
        <div className="mx-auto max-w-xl rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-soft-xl dark:border-slate-800 dark:bg-black">
          <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Account</div>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Sign in to manage your wishlist, cart, and order tracking.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-outline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user = auth.user;

  return (
    <div className="page-container py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">My Account</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Session is stored locally (frontend demo).
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            auth.logout();
            toast.info("Signed out");
            navigate("/", { replace: true });
          }}
          className="btn btn-outline"
        >
          Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Field label="Name" value={user.name} />
        <Field label="Email" value={user.email} />
        <Field label="Role" value={user.role === "admin" ? "Admin" : "Customer"} />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          to="/wishlist"
          className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/30 hover:shadow-soft-xl dark:border-slate-800 dark:bg-black"
        >
          <div className="text-sm font-extrabold text-slate-900 transition group-hover:text-emerald dark:text-white">
            Wishlist
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Saved items across colors.</div>
        </Link>

        <Link
          to="/compare"
          className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/30 hover:shadow-soft-xl dark:border-slate-800 dark:bg-black"
        >
          <div className="text-sm font-extrabold text-slate-900 transition group-hover:text-emerald dark:text-white">
            Compare
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Side-by-side details.</div>
        </Link>

        <Link
          to="/track-order"
          className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/30 hover:shadow-soft-xl dark:border-slate-800 dark:bg-black"
        >
          <div className="text-sm font-extrabold text-slate-900 transition group-hover:text-emerald dark:text-white">
            Track Order
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Live order timeline.</div>
        </Link>
      </div>

      {auth.isAdmin ? (
        <div className="mt-10 rounded-3xl bg-lux-gradient p-6">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">Admin access</div>
          <div className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Manage products and orders from the admin dashboard.
          </div>
          <div className="mt-5">
            <Link to="/admin" className="btn btn-primary">
              Go to Admin Panel
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}