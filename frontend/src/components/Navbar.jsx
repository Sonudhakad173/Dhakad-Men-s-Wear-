import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../store/cart-context.js";
import { useTheme } from "../store/theme-context.js";
import { useAuth } from "../store/auth-context.js";
import { useWishlist } from "../store/wishlist-context.js";

function Icon({ children, className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      {children}
    </svg>
  );
}

function CartIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M6 7h15l-2 10H8L6 7Z" />
      <path d="M6 7 5 4H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </Icon>
  );
}

function SearchIcon({ className }) {
  return (
    <Icon className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20 17 17" />
    </Icon>
  );
}

function MenuIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Icon>
  );
}

function CloseIcon({ className }) {
  return (
    <Icon className={className}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </Icon>
  );
}

function ThemeIcon({ isDark, className }) {
  return (
    <Icon className={className}>
      {isDark ? (
        <path d="M12 3a7 7 0 1 0 9 9 8 8 0 0 1-9-9Z" />
      ) : (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M4.93 19.07l1.41-1.41" />
          <path d="M17.66 6.34l1.41-1.41" />
        </>
      )}
    </Icon>
  );
}

function HeartIcon({ className, filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icon>
  );
}

function NavItem({ to, label, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "rounded-full px-4 py-2 text-sm font-bold tracking-tight transition",
          isActive
            ? "bg-emerald text-white shadow-sm"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

function ActionButton({ to, label, title, children, badge, className = "" }) {
  return (
    <Link
      to={to}
      aria-label={label}
      title={title ?? label}
      className={[
        "relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/35 hover:bg-emerald/5 hover:text-emerald dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        className,
      ].join(" ")}
    >
      {children}
      {badge > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-emerald px-1 text-[10px] font-black text-white shadow-sm">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

export default function Navbar() {
  const { itemCount } = useCart();
  const wishlist = useWishlist();
  const { isDark, toggle } = useTheme();
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(() => (typeof window === "undefined" ? 0 : window.scrollY));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    if (mobileOpen) {
      body.style.overflow = "hidden";
      documentElement.style.overflow = "hidden";
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [mobileOpen]);

  function submitSearch(event) {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/shop?q=${encodeURIComponent(query)}`);
  }

  const elevated = scrollY > 18 || location.pathname !== "/";
  const shellClassName = elevated
    ? "border-slate-200/90 bg-white/92 shadow-lg shadow-slate-900/6 dark:border-slate-800 dark:bg-black/88"
    : "border-slate-200/70 bg-white/78 shadow-md shadow-slate-900/5 dark:border-slate-800 dark:bg-black/68";

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="page-container pt-3 sm:pt-4">
        <div
          className={[
            "rounded-[1.75rem] border backdrop-blur-xl transition-all duration-300",
            shellClassName,
          ].join(" ")}
        >
          <div className="flex min-h-[76px] items-center gap-3 px-3 sm:px-4 lg:px-5">
            <Link to="/" className="flex shrink-0 items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald text-white shadow-sm">
                <span className="text-base font-black tracking-tight">D</span>
              </div>
              <div className="hidden leading-tight sm:block">
                <div className="text-base font-black tracking-tight text-slate-900 dark:text-white">Dhakad</div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald/90">Mens Wear</div>
              </div>
            </Link>

            <div className="hidden lg:flex lg:rounded-full lg:border lg:border-slate-200 lg:bg-white/75 lg:p-1 lg:dark:border-white/10 lg:dark:bg-white/5">
              <NavItem to="/" label="Home" end />
              <NavItem to="/shop" label="Shop" />
              <NavItem to="/compare" label="Compare" />
              <NavItem to="/track-order" label="Track" />
              {auth.isAdmin ? <NavItem to="/admin" label="Admin" /> : null}
            </div>

            <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 lg:block" role="search">
              <div className="relative mx-auto max-w-xl">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search shirts, jeans, trousers..."
                  className="h-12 w-full rounded-full border border-slate-200 bg-white/85 pl-11 pr-4 text-sm font-semibold text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald/40 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                />
              </div>
            </form>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/35 hover:bg-emerald/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                title={isDark ? "Light theme" : "Dark theme"}
              >
                <ThemeIcon isDark={isDark} className="h-5 w-5" />
              </button>

              <ActionButton to="/wishlist" label="Wishlist" badge={wishlist.count}>
                <HeartIcon filled={wishlist.count > 0} className={wishlist.count > 0 ? "h-5 w-5 text-emerald" : "h-5 w-5"} />
              </ActionButton>

              <ActionButton to={auth.isAuthed ? "/account" : "/login"} label={auth.isAuthed ? "Account" : "Login"}>
                <UserIcon className="h-5 w-5" />
              </ActionButton>

              <Link
                to="/cart"
                className="relative hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/35 hover:bg-emerald/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:inline-flex"
              >
                <CartIcon className="h-5 w-5" />
                <span>Cart</span>
                {itemCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-emerald px-1 text-[10px] font-black text-white shadow-sm">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                ) : null}
              </Link>

              <ActionButton to="/cart" label="Cart" badge={itemCount} className="sm:hidden">
                <CartIcon className="h-5 w-5 sm:hidden" />
              </ActionButton>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald/35 hover:bg-emerald/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 lg:hidden"
                aria-label="Open menu"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={[
          "fixed inset-0 z-[60] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={[
            "absolute inset-0 bg-slate-950/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu overlay"
        />

        <div
          className={[
            "absolute right-0 top-0 h-full w-full max-w-[24rem] border-l border-slate-200 bg-white px-5 pb-6 pt-5 shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-black",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-emerald">Dhakad</div>
              <div className="mt-1 text-lg font-black text-slate-900 dark:text-white">Navigation</div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-black dark:text-slate-200 dark:hover:bg-white/5"
              aria-label="Close menu"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={submitSearch} className="mt-5" role="search">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
              />
            </div>
          </form>

          <div className="mt-6 grid gap-2">
            <NavItem to="/" label="Home" end onClick={() => setMobileOpen(false)} />
            <NavItem to="/shop" label="Shop" onClick={() => setMobileOpen(false)} />
            <NavItem to="/wishlist" label={`Wishlist${wishlist.count ? ` (${wishlist.count})` : ""}`} onClick={() => setMobileOpen(false)} />
            <NavItem to="/compare" label="Compare" onClick={() => setMobileOpen(false)} />
            <NavItem to="/cart" label={`Cart${itemCount ? ` (${itemCount})` : ""}`} onClick={() => setMobileOpen(false)} />
            <NavItem to="/track-order" label="Track Order" onClick={() => setMobileOpen(false)} />
            <NavItem to={auth.isAuthed ? "/account" : "/login"} label={auth.isAuthed ? "Account" : "Login"} onClick={() => setMobileOpen(false)} />
            {auth.isAdmin ? <NavItem to="/admin" label="Admin Panel" onClick={() => setMobileOpen(false)} /> : null}
            {!auth.isAuthed ? <NavItem to="/signup" label="Sign Up" onClick={() => setMobileOpen(false)} /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
