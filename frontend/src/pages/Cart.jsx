import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import QuantityInput from "../components/QuantityInput.jsx";
import { useCart } from "../store/cart-context.js";
import { useToast } from "../store/toast-context.js";
import { formatINR } from "../utils/format.js";

export default function Cart() {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    items,
    subtotal,
    shipping,
    total,
    compareTotal,
    discount,
    coupon,
    couponCode,
    setQuantity,
    removeItem,
    applyCoupon,
    clearCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState(couponCode ?? "");

  const savings = useMemo(() => Math.max(0, compareTotal - subtotal), [compareTotal, subtotal]);

  if (items.length === 0) {
    return (
      <div className="page-container py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-black">
          <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Your cart is empty</div>
          <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Add some essentials to get started.
          </p>
          <Link to="/shop" className="btn btn-primary mt-6">
            Shop products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-10 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Your cart</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Adjust quantities and head to checkout.
          </p>
        </div>
        <Link to="/shop" className="btn btn-outline">
          Continue shopping
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.key}
              className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald/30 hover:shadow-soft-xl dark:border-slate-800 dark:bg-black sm:flex-row"
            >
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-900 dark:bg-slate-950 sm:h-28 sm:w-28">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
                  loading="lazy"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-base font-extrabold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {item.size ? <span>Size: {item.size}</span> : null}
                      {item.size && item.color ? <span className="mx-2 text-slate-300 dark:text-slate-700">•</span> : null}
                      {item.color ? <span>Color: {item.color}</span> : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item.key);
                      toast.info("Removed from cart", { title: item.name });
                    }}
                    className="rounded-xl px-3 py-2 text-sm font-extrabold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <QuantityInput
                    value={item.quantity}
                    onChange={(qty) => {
                      if (qty === item.quantity) return;
                      setQuantity(item.key, qty);
                      toast.info("Quantity updated", { title: item.name });
                    }}
                    min={1}
                    max={99}
                  />
                  <div className="text-right">
                    <div className="text-base font-black text-slate-900 dark:text-white">
                      {formatINR(item.price * item.quantity)}
                    </div>
                    {item.compareAt ? (
                      <div className="text-xs font-extrabold text-slate-400 line-through dark:text-slate-500">
                        {formatINR(item.compareAt * item.quantity)}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black lg:sticky lg:top-24 lg:h-fit">
          <div className="text-lg font-black text-slate-900 dark:text-white">Order summary</div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-black">
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">Coupon</div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const result = applyCoupon(couponInput);
                setCouponInput(result.code);

                if (result.cleared) {
                  toast.info("Coupon cleared");
                  return;
                }

                if (result.valid) toast.success("Coupon applied", { title: result.code });
                else toast.error("Invalid coupon", { title: result.code });
              }}
            >
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="DHAKAD100"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-emerald/40 dark:border-slate-800 dark:bg-black dark:text-slate-100"
              />
              <button type="submit" className="btn btn-outline whitespace-nowrap px-4">
                Apply
              </button>
            </form>

            {coupon ? (
              <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                <div className={coupon.valid ? "font-extrabold text-emerald" : "font-extrabold text-rose-500"}>
                  {coupon.code} • {coupon.label}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearCoupon();
                    setCouponInput("");
                    toast.info("Coupon removed");
                  }}
                  className="font-extrabold text-slate-500 transition hover:text-emerald dark:text-slate-300"
                >
                  Remove
                </button>
              </div>
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
              <span className="font-extrabold text-slate-900 dark:text-white">
                {shipping === 0 ? "Free" : formatINR(shipping)}
              </span>
            </div>

            {savings > 0 ? (
              <div className="flex items-center justify-between font-semibold text-emerald">
                <span>MRP savings</span>
                <span className="font-extrabold">{formatINR(savings)}</span>
              </div>
            ) : null}

            <div className="h-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center justify-between text-base font-black text-slate-900 dark:text-white">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <button type="button" onClick={() => navigate("/checkout")} className="btn btn-primary mt-6 w-full">
            Checkout
          </button>

        </aside>
      </div>
    </div>
  );
}
