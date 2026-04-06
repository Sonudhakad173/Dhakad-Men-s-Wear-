export const ORDER_STATUSES = [
  { id: "placed", label: "Placed" },
  { id: "confirmed", label: "Confirmed" },
  { id: "packed", label: "Packed" },
  { id: "shipped", label: "Shipped" },
  { id: "out_for_delivery", label: "Out for delivery" },
  { id: "delivered", label: "Delivered" },
];

export function statusIndex(statusId) {
  return Math.max(
    0,
    ORDER_STATUSES.findIndex((s) => s.id === statusId),
  );
}
