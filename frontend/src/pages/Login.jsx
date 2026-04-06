import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context.js";
import { useToast } from "../store/toast-context.js";

export default function Login() {
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const value = location.state?.from;
    return typeof value === "string" && value.startsWith("/") ? value : "/";
  }, [location.state?.from]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    asAdmin: false,
  });

  function update(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    const email = form.email.trim();
    if (!email) return;

    const user = auth.login({ name: form.name, email, asAdmin: form.asAdmin });
    toast.success("Signed in", { title: user.role === "admin" ? "Admin" : "Customer" });
    navigate(from, { replace: true });
  }

  return (
    <div className="page-container py-12">
      <div className="mx-auto max-w-xl rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-soft-xl dark:border-slate-800 dark:bg-black">
        <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Login</div>
        <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          Frontend-only demo. Use any email to sign in.
        </p>

        <form onSubmit={submit} className="mt-8 grid gap-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Name
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
              placeholder="Your name"
            />
          </label>

          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
              placeholder="you@example.com"
            />
          </label>

          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
              placeholder="(not checked in demo)"
            />
          </label>

          <label className="mt-2 inline-flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={form.asAdmin}
              onChange={(e) => update("asAdmin", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald focus:ring-emerald/25"
            />
            Sign in as Admin (demo)
          </label>

          <button type="submit" className="btn btn-primary mt-2 w-full">
            Sign in
          </button>

          <div className="mt-2 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
            New here?{" "}
            <Link to="/signup" className="font-extrabold text-emerald hover:underline">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
