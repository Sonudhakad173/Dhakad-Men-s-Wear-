import { Link, useParams } from "react-router-dom";
import { formatDateTime } from "../lib/date";
import { formatINR } from "../lib/money";
import { useOrders } from "../store/OrdersStore";

export function CheckoutSuccessPage() {
  const { orderId } = useParams();
  const { getById } = useOrders();
  const order = orderId ? getById(orderId) : undefined;

  if (!order) {
    return (
      <div className="container" style={{ padding: "96px 0 90px" }}>
        <div className="kicker">Checkout</div>
        <h1 className="h2" style={{ margin: "10px 0 6px" }}>
          Order not found
        </h1>
        <Link className="btn btnPrimary" to="/shop">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "96px 0 90px" }}>
      <div className="success card">
        <div className="successKicker">Order placed</div>
        <h1 className="h2" style={{ margin: "12px 0 6px" }}>
          Thank you.
        </h1>
        <div className="successMeta">
          Order ID: <span className="mono">{order.id}</span>
          <span className="successDot">•</span>
          {formatDateTime(order.createdAt)}
        </div>

        <div className="successLines">
          <div className="summaryLine">
            <span>Total</span>
            <span>{formatINR(order.pricing.total)}</span>
          </div>
          <div className="summaryLine">
            <span>Payment</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="summaryLine">
            <span>Delivery slot</span>
            <span>{order.deliverySlot}</span>
          </div>
        </div>

        <div className="successActions">
          <Link to={`/track-order?id=${encodeURIComponent(order.id)}`} className="btn btnPrimary">
            Track order
          </Link>
          <Link to="/shop" className="btn">
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
}
