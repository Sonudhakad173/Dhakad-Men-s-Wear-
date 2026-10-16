import React, { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../../app/hooks/useMediaQuery";
import { useScrollY } from "../../app/hooks/useScrollY";
import { useAuth } from "../../store/AuthStore";
import { useCart } from "../../store/CartStore";
import { useWishlist } from "../../store/WishlistStore";
import {
  IconCart,
  IconClose,
  IconCompare,
  IconHeart,
  IconMenu,
  IconSearch,
  IconUser,
} from "./Icons";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type NavItem = { to: string; label: string; end?: boolean };

export function Header() {
  const y = useScrollY();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width: 900px)");

  const { user, logout } = useAuth();
  const { totalQty } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [q, setQ] = useState("");

  const navLinks = useMemo<NavItem[]>(
    () => [
      { to: "/", label: "Home", end: true },
      { to: "/shop", label: "Shop" },
      { to: "/compare", label: "Compare" },
    ],
    [],
  );

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const next = q.trim();
    navigate(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
    setDrawerOpen(false);
  }

  return (
    <header className={cx("siteHeader", "siteHeader--solid", y > 8 && "siteHeader--scrolled")}>
      <div className="container headerInner">
        <Link to="/" className="brand" aria-label="Dhakad Mens Wear">
          <span className="brandText" aria-hidden="true">
            <span className="brandWord">DHAKAD</span>
            <span className="brandSub">MEN&apos;S WEAR</span>
          </span>
        </Link>

        {!isMobile && (
          <nav className="navLinks" aria-label="Primary">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => cx("navLink", isActive && "navLink--active")}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        {!isMobile && (
          <form className="headerSearch" onSubmit={submitSearch}>
            <IconSearch size={18} aria-hidden="true" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search shirts, jeans, trousers..."
              aria-label="Search"
            />
          </form>
        )}

        <div className="headerActions">
          <Link
            to="/wishlist"
            className={cx("iconBtn", wishlistCount > 0 && "iconBtn--active")}
            aria-label="Wishlist"
          >
            <IconHeart size={20} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>

          <Link
            to="/cart"
            className={cx("iconBtn", totalQty > 0 && "iconBtn--active")}
            aria-label="Cart"
          >
            <IconCart size={24} />
            {totalQty > 0 && <span className="badge">{totalQty}</span>}
          </Link>

          <Link to="/track-order" className="iconBtn" aria-label="Track Order">
            <span className="trackPill">Track</span>
          </Link>

          {!isMobile && (
            <div className="account">
              <Link
                to={user ? "/" : "/login"}
                className="iconBtn"
                aria-label="Account"
              >
                <IconUser size={20} />
              </Link>
              {user ? (
                <div className="accountMenu">
                  <div className="accountName">{user.name}</div>
                  <div className="accountEmail">{user.email}</div>
                  {user.role === "admin" && (
                    <Link to="/admin" className="accountLink">
                      Admin Panel
                    </Link>
                  )}
                  <button type="button" className="accountLink" onClick={logout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {isMobile && (
            <button
              type="button"
              className={cx("iconBtn", "iconBtn--menu")}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu size={22} />
            </button>
          )}
        </div>
      </div>

      <div
        className={cx("drawerOverlay", drawerOpen && "drawerOverlay--open")}
        onClick={() => setDrawerOpen(false)}
      />

      <aside className={cx("drawer", drawerOpen && "drawer--open")} aria-hidden={!drawerOpen}>
        <div className="drawerTop">
          <div className="drawerTitle">Menu</div>
          <button
            type="button"
            className="iconBtn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <IconClose size={20} />
          </button>
        </div>

        <form className="drawerSearch" onSubmit={submitSearch}>
          <IconSearch size={18} aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            aria-label="Search"
          />
        </form>

        <nav className="drawerLinks" aria-label="Mobile">
          <Link to="/" className="drawerLink" onClick={() => setDrawerOpen(false)}>
            Home
          </Link>
          <Link to="/shop" className="drawerLink" onClick={() => setDrawerOpen(false)}>
            Shop
          </Link>
          <Link
            to="/compare"
            className="drawerLink"
            onClick={() => setDrawerOpen(false)}
          >
            <span className="drawerLinkRow">
              <IconCompare size={18} /> Compare
            </span>
          </Link>
          <Link
            to="/wishlist"
            className="drawerLink"
            onClick={() => setDrawerOpen(false)}
          >
            Wishlist
          </Link>
          <Link to="/cart" className="drawerLink" onClick={() => setDrawerOpen(false)}>
            Cart
          </Link>
          <Link
            to="/track-order"
            className="drawerLink"
            onClick={() => setDrawerOpen(false)}
          >
            Track Order
          </Link>
        </nav>

        <div className="drawerDivider" />

        {user ? (
          <div className="drawerAccount">
            <div className="drawerAccountName">Signed in as</div>
            <div className="drawerAccountEmail">{user.email}</div>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="btn btnPrimary"
                onClick={() => setDrawerOpen(false)}
              >
                Open Admin Panel
              </Link>
            )}
            <button
              type="button"
              className="btn"
              onClick={() => {
                logout();
                setDrawerOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="drawerAccount">
            <Link
              to="/login"
              className="btn btnPrimary"
              onClick={() => setDrawerOpen(false)}
            >
              Login
            </Link>
            <Link to="/signup" className="btn" onClick={() => setDrawerOpen(false)}>
              Create account
            </Link>
          </div>
        )}
      </aside>
    </header>
  );
}

