export function formatINR(value) {
  const numberValue = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numberValue);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value ?? 0));
}