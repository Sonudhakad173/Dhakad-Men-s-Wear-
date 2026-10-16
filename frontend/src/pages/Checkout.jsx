import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/cart-context.js";
import { useOrders } from "../store/orders-context.js";
import { useToast } from "../store/toast-context.js";
import { formatINR } from "../utils/format.js";

const DELIVERY_SLOTS = [
  { id: "morning", label: "Morning", note: "9:00 AM – 12:00 PM" },
  { id: "afternoon", label: "Afternoon", note: "12:00 PM – 4:00 PM" },
  { id: "evening", label: "Evening", note: "4:00 PM – 8:00 PM" },
];

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", note: "Pay when it arrives" },
  { id: "upi", label: "UPI", note: "PhonePe / GPay / Paytm" },
  { id: "card", label: "Card", note: "Visa / Mastercard" },
];

function Field({ label, children }) {
  return (
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function ChoiceCard({ selected, title, note, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border p-4 text-left transition",
        selected
          ? "border-emerald/35 bg-emerald/10"
          : "border-slate-200 bg-white hover:border-emerald/30 hover:bg-emerald/5 dark:border-slate-800 dark:bg-black dark:hover:bg-emerald/10",
      ].join(" ")}
    >
      <div className="text-sm font-extrabold text-slate-900 dark:text-white">{title}</div>
      <div className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">{note}</div>
    </button>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const toast = useToast();
  const { createOrder } = useOrders();

  const { items, subtotal, shipping, discount, coupon, total, clear } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [deliverySlot, setDeliverySlot] = useState(DELIVERY_SLOTS[0].id);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);

  const disabled = useMemo(() => items.length === 0, [items.length]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (items.length === 0) return;

    const order = createOrder({
      customer: { ...form },
      items: items.map((i) => ({
        key: i.key,
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        compareAt: i.compareAt,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
      })),
      totals: {
        subtotal,
        shipping,
        discount,
        total,
      },
      coupon: coupon ? { ...coupon } : null,
      delivery: DELIVERY_SLOTS.find((s) => s.id === deliverySlot) ?? DELIVERY_SLOTS[0],
      payment: PAYMENT_METHODS.find((p) => p.id === paymentMethod) ?? PAYMENT_METHODS[0],
    });

    clear();
    toast.info("Cart cleared");
    toast.success("Order placed successfully", { title: order.id });

    navigate("/order-success", { state: { orderId: order.id } });
  }

  if (items.length === 0) {
    return (
      <div className="page-container py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-black">
          <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Nothing to checkout</div>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Your cart is empty.</p>
          <Link to="/shop" className="btn btn-primary mt-6">
            Shop products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Checkout</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Enter details, choose delivery and payment, then place a demo order.
          </p>
        </div>
        <Link to="/cart" className="btn btn-outline">
          Back to cart
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black lg:col-span-2">
          <div className="grid gap-8">
            <section>
              <div className="text-lg font-black text-slate-900 dark:text-white">1) Shipping details</div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                    placeholder="Your name"
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                    placeholder="10-digit phone"
                  />
                </Field>
                <Field label="City">
                  <input
                    required
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                    placeholder="Indore"
                  />
                </Field>
                <Field label="Address">
                  <textarea
                    required
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                    placeholder="House no, street, area..."
                  />
                </Field>
                <Field label="Pincode">
                  <input
                    required
                    value={form.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
                    placeholder="e.g. 452001"
                  />
                </Field>
              </div>
            </section>

            <section>
              <div className="text-lg font-black text-slate-900 dark:text-white">2) Delivery slot</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {DELIVERY_SLOTS.map((slot) => (
                  <ChoiceCard
                    key={slot.id}
                    selected={deliverySlot === slot.id}
                    title={slot.label}
                    note={slot.note}
                    onClick={() => setDeliverySlot(slot.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="text-lg font-black text-slate-900 dark:text-white">3) Payment method</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {PAYMENT_METHODS.map((method) => (
                  <ChoiceCard
                    key={method.id}
                    selected={paymentMethod === method.id}
                    title={method.label}
                    note={method.note}
                    onClick={() => setPaymentMethod(method.id)}
                  />
                ))}
              </div>
            </section>

            <button type="submit" disabled={disabled} className="btn btn-primary w-full disabled:opacity-50">
              Place order ({formatINR(total)})
            </button>

          </div>
        </form>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black lg:sticky lg:top-24 lg:h-fit">
          <div className="text-lg font-black text-slate-900 dark:text-white">Summary</div>

          <div className="mt-4 space-y-2 text-sm">
            {items.slice(0, 6).map((i) => (
              <div key={i.key} className="flex items-center justify-between gap-3 text-slate-700 dark:text-slate-200">
                <div className="min-w-0 truncate font-semibold">
                  {i.name} <span className="text-slate-400">× {i.quantity}</span>
                </div>
                <div className="font-extrabold text-slate-900 dark:text-white">{formatINR(i.price * i.quantity)}</div>
              </div>
            ))}
            {items.length > 6 ? (
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">+ {items.length - 6} more items</div>
            ) : null}
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
              <span>Subtotal</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{formatINR(subtotal)}</span>
            </div>
            {discount > 0 ? (
              <div className="flex items-center justify-between font-semibold text-emerald">
                <span>Discount</span>
                <span className="font-extrabold">-{formatINR(discount)}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
              <span>Shipping</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{shipping === 0 ? "Free" : formatINR(shipping)}</span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center justify-between text-base font-black text-slate-900 dark:text-white">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          {coupon ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-black dark:text-slate-200">
              Coupon: <span className={coupon.valid ? "font-extrabold text-emerald" : "font-extrabold text-rose-500"}>{coupon.code}</span>
              <span className="mx-2 text-slate-300 dark:text-slate-700">•</span>
              <span>{coupon.label}</span>
            </div>
          ) : null}

          <Link to="/track-order" className="btn btn-outline mt-6 w-full">
            Track an order
          </Link>
        </aside>
      </div>
    </div>
  );
}

