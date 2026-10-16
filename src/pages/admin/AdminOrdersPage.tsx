import { formatDateTime } from "../../lib/date";
import { formatINR } from "../../lib/money";
import { useOrders } from "../../store/OrdersStore";
import { useToast } from "../../store/ToastStore";

const statuses = [
  "placed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
] as const;

export function AdminOrdersPage() {
  const { orders, setStatus } = useOrders();
  const toast = useToast();

  return (
    <div className="adminPage">
      <div className="adminPageHead">
        <div>
          <div className="kicker">Admin</div>
          <div className="adminPageTitle">Orders</div>
          <div className="adminPageHint">Update order statuses for Track Order timeline.</div>
        </div>
      </div>

      <div className="adminBlock card">
        <div className="adminBlockHead">
          <div className="adminBlockTitle">All orders</div>
          <div className="adminBlockHint">{orders.length} total</div>
        </div>

        {orders.length === 0 ? (
          <div style={{ padding: 14, color: "var(--muted)" }}>No orders yet.</div>
        ) : (
          <div className="adminTable">
            <div className="adminRow adminRow--head" style={{ gridTemplateColumns: "1.1fr 0.9fr 0.7fr 0.9fr 1fr" }}>
              <div>Order</div>
              <div>Date</div>
              <div>Total</div>
              <div>Customer</div>
              <div>Status</div>
            </div>
            {orders.map((o) => (
              <div key={o.id} className="adminRow" style={{ gridTemplateColumns: "1.1fr 0.9fr 0.7fr 0.9fr 1fr" }}>
                <div className="mono">{o.id}</div>
                <div>{formatDateTime(o.createdAt)}</div>
                <div>{formatINR(o.pricing.total)}</div>
                <div>{o.shippingAddress.fullName}</div>
                <div>
                  <select
                    className="adminSelect"
                    value={o.status}
                    onChange={(e) => {
                      setStatus(o.id, e.target.value as any);
                      toast.success("Status updated");
                    }}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
