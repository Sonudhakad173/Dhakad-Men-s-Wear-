import { Link } from "react-router-dom";
import { formatDateTime } from "../../lib/date";
import { formatINR } from "../../lib/money";
import { useOrders } from "../../store/OrdersStore";
import { useProducts } from "../../store/ProductsStore";

export function AdminDashboardPage() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const revenue = orders.reduce((s, o) => s + o.pricing.total, 0);

  const latest = orders.slice(0, 6);

  return (
    <div className="adminPage">
      <div className="adminHero card">
        <div className="kicker">Admin</div>
        <div className="adminHeroTitle">Dhakad Admin Studio</div>
        <div className="adminHeroSub">
          Quick insights, product control, and order status updates. Frontend-only (local storage).
        </div>
        <div className="adminHeroActions">
          <Link className="btn btnPrimary" to="/admin/products">
            Manage products
          </Link>
          <Link className="btn" to="/admin/orders">
            View orders
          </Link>
        </div>
      </div>

      <div className="adminStats">
        <div className="stat card">
          <div className="statLabel">Products</div>
          <div className="statValue">{products.length}</div>
        </div>
        <div className="stat card">
          <div className="statLabel">Orders</div>
          <div className="statValue">{orders.length}</div>
        </div>
        <div className="stat card">
          <div className="statLabel">Revenue</div>
          <div className="statValue">{formatINR(revenue)}</div>
        </div>
      </div>

      <div className="adminBlock card">
        <div className="adminBlockHead">
          <div>
            <div className="adminBlockTitle">Recent orders</div>
            <div className="adminBlockHint">Update statuses from the Orders tab.</div>
          </div>
          <Link className="btn" to="/admin/orders">
            Open
          </Link>
        </div>

        {latest.length === 0 ? (
          <div style={{ color: "var(--muted)", padding: 14 }}>
            No orders yet. Place a demo order from the checkout flow.
          </div>
        ) : (
          <div className="adminTable">
            <div className="adminRow adminRow--head">
              <div>Order</div>
              <div>Date</div>
              <div>Total</div>
              <div>Status</div>
            </div>
            {latest.map((o) => (
              <div key={o.id} className="adminRow">
                <div className="mono">{o.id}</div>
                <div>{formatDateTime(o.createdAt)}</div>
                <div>{formatINR(o.pricing.total)}</div>
                <div className="pill" style={{ display: "inline-flex", padding: "6px 10px" }}>
                  {o.status.replaceAll("_", " ")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
