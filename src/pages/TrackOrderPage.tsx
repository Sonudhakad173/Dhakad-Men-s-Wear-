import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { OrderStatus } from "../data/types";
import { formatDateTime } from "../lib/date";
import { formatINR } from "../lib/money";
import { useOrders } from "../store/OrdersStore";

const steps: Array<{ key: OrderStatus; label: string }> = [
  { key: "placed", label: "Order placed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

function stepIndex(status: OrderStatus) {
  return steps.findIndex((s) => s.key === status);
}

export function TrackOrderPage() {
  const { getById } = useOrders();
  const [params] = useSearchParams();
  const preset = params.get("id") ?? "";

  const [id, setId] = useState(preset);
  const [submitted, setSubmitted] = useState(preset);

  const order = useMemo(() => (submitted ? getById(submitted) : undefined), [submitted, getById]);
  const i = order ? stepIndex(order.status) : -1;

  return (
    <div className="container" style={{ padding: "96px 0 90px" }}>
      <div className="pageHead">
        <div>
          <div className="kicker">Track Order</div>
          <h1 className="h1 pageTitle" style={{ margin: "10px 0 0" }}>
            Track your delivery
          </h1>
          <p style={{ color: "var(--muted)", margin: "10px 0 0" }}>
            Enter your order ID to see status updates.
          </p>
        </div>
        <Link className="btn" to="/shop">
          Shop
        </Link>
      </div>

      <div className="track card">
        <form
          className="trackForm"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(id.trim());
          }}
        >
          <label className="field" style={{ flex: 1 }}>
            <span className="fieldLabel">Order ID</span>
            <input value={id} onChange={(e) => setId(e.target.value)} placeholder="DMW-20260312-ABCD" />
          </label>
          <button type="submit" className="btn btnPrimary">
            Track
          </button>
        </form>

        {submitted && !order && (
          <div className="trackEmpty">
            <div className="trackEmptyTitle">No order found</div>
            <div className="trackEmptyText">
              Double-check the order ID or place a demo order from checkout.
            </div>
          </div>
        )}

        {order && (
          <div className="trackBody">
            <div className="trackTop">
              <div>
                <div className="trackId">
                  Order <span className="mono">{order.id}</span>
                </div>
                <div className="trackMeta">
                  {formatDateTime(order.createdAt)} • {formatINR(order.pricing.total)}
                </div>
              </div>
              <div className="trackStatus">{steps[i]?.label ?? ""}</div>
            </div>

            <div className="timeline">
              {steps.map((s, idx) => {
                const done = idx <= i;
                const active = idx === i;
                return (
                  <div key={s.key} className="timeRow">
                    <div className={["timeDot", done && "timeDot--done", active && "timeDot--active"].filter(Boolean).join(" ")}
                      aria-hidden="true"
                    />
                    <div className="timeLabel">{s.label}</div>
                    <div className="timeLine" aria-hidden="true" />
                  </div>
                );
              })}
            </div>

            <div className="trackAddr">
              <div className="trackAddrTitle">Delivery address</div>
              <div className="trackAddrText">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

