import { Link } from "react-router-dom";

const INDORE_MAP_URL = "https://www.google.com/maps/search/?api=1&query=Indore%2C%20India";

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="relative inline-block text-slate-600 transition hover:text-emerald dark:text-slate-300"
    >
      <span
        className="after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-emerald after:transition-transform after:duration-300 hover:after:scale-x-100"
      >
        {children}
      </span>
    </Link>
  );
}

function FooterAnchor({ href, children }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="relative inline-block text-slate-600 transition hover:text-emerald dark:text-slate-300"
    >
      <span
        className="after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-emerald after:transition-transform after:duration-300 hover:after:scale-x-100"
      >
        {children}
      </span>
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white transition-colors hover:bg-emerald/5 dark:border-slate-800 dark:bg-black dark:hover:bg-emerald/10">
      <div className="page-container py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group">
            <div className="text-base font-extrabold tracking-tight text-slate-900 transition group-hover:text-emerald dark:text-white">
              Dhakad Mens Wear
            </div>
            <p className="mt-2 text-sm font-normal text-slate-600 transition group-hover:text-emerald/80 dark:text-slate-300">
              Sharp essentials, Indian roots, runway restraint.
            </p>
          </div>

          <div className="group text-sm">
            <div className="font-extrabold uppercase tracking-wide text-slate-900 transition group-hover:text-emerald dark:text-white">
              Customer Support
            </div>
            <ul className="mt-3 space-y-2">
              <li>
                <FooterLink to="/shipping">Shipping &amp; Delivery</FooterLink>
              </li>
              <li>
                <FooterLink to="/returns">Returns &amp; Exchange</FooterLink>
              </li>
              <li>
                <FooterLink to="/track-order">Track Your Order</FooterLink>
              </li>
            </ul>
          </div>

          <div className="group text-sm">
            <div className="font-extrabold uppercase tracking-wide text-slate-900 transition group-hover:text-emerald dark:text-white">
              Explore
            </div>
            <ul className="mt-3 space-y-2">
              <li>
                <FooterLink to="/shop">Shop</FooterLink>
              </li>
              <li>
                <FooterLink to="/wishlist">Wishlist</FooterLink>
              </li>
              <li>
                <FooterLink to="/compare">Compare</FooterLink>
              </li>
            </ul>
          </div>

          <div className="group text-sm">
            <div className="font-extrabold uppercase tracking-wide text-slate-900 transition group-hover:text-emerald dark:text-white">
              Contact
            </div>
            <ul className="mt-3 space-y-2">
              <li>
                <FooterAnchor href={INDORE_MAP_URL}>Indore, India</FooterAnchor>
              </li>
              <li>
                <FooterAnchor href="mailto:support@dhakadmenswear.com">support@dhakadmenswear.com</FooterAnchor>
              </li>
              <li>
                <FooterAnchor href="tel:+919876543210">+91 98765 43210</FooterAnchor>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© {year} Dhakad Mens Wear</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a href={INDORE_MAP_URL} target="_blank" rel="noreferrer" className="transition hover:text-emerald">
              Indore, India
            </a>
          </div>
          <div className="flex items-center gap-4">
            <FooterLink to="/privacy">Privacy</FooterLink>
            <FooterLink to="/terms">Terms</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
