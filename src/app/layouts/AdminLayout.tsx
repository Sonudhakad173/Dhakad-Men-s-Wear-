import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="adminShell">
      <aside className="adminSide">
        <div className="adminBrand">
          <div className="adminBrandTop">Dhakad Mens Wear</div>
          <div className="adminBrandSub">Admin Studio</div>
        </div>

        <nav className="adminNav" aria-label="Admin">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => cx("adminLink", isActive && "adminLink--active")}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => cx("adminLink", isActive && "adminLink--active")}
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => cx("adminLink", isActive && "adminLink--active")}
          >
            Orders
          </NavLink>
        </nav>

        <div className="adminSideFooter">
          <div className="adminMeta">
            {user ? (
              <>
                <div className="adminMetaLine">Signed in</div>
                <div className="adminMetaStrong">{user.email}</div>
              </>
            ) : (
              <>
                <div className="adminMetaLine">Not signed in</div>
                <Link className="adminMetaStrong" to="/login">
                  Login to save changes
                </Link>
              </>
            )}
          </div>
          <Link to="/" className="adminBack">
            ← Back to site
          </Link>
        </div>
      </aside>

      <div className="adminMain">
        <div className="adminTopBar">
          <div className="adminTopTitle">Dashboard & Management</div>
          <div className="adminTopHint">Frontend-only admin panel (local storage)</div>
        </div>
        <div className="adminContent">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
