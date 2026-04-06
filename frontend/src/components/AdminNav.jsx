import { NavLink } from "react-router-dom";

function Tab({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "rounded-xl px-4 py-2 text-sm font-extrabold transition",
          isActive
            ? "bg-emerald/10 text-emerald"
            : "text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/5",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function AdminNav() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tab to="/admin" end>
        Dashboard
      </Tab>
      <Tab to="/admin/products">Products</Tab>
      <Tab to="/admin/orders">Orders</Tab>
    </div>
  );
}