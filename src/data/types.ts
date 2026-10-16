export type Category = "Shirts" | "Jeans" | "Trousers" | "Others";

export type Swatch =
  | { type: "solid"; value: string; isLight?: boolean }
  | { type: "gradient"; value: string; isLight?: boolean };

export type ProductVariant = {
  id: string;
  colorName: string;
  swatch: Swatch;
  images: string[];
  sizes: string[];
};

export type Product = {
  id: string;
  title: string;
  category: Category;
  price: number;
  description: string;
  fabric: string;
  fit: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  variants: ProductVariant[];
};

export type CartLine = {
  key: string;
  productId: string;
  variantId: string;
  size: string;
  qty: number;
  addedAt: string;
};

export type UserRole = "user" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type OrderStatus =
  | "placed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export type Order = {
  id: string;
  createdAt: string;
  items: Array<{
    productId: string;
    title: string;
    variantId: string;
    colorName: string;
    size: string;
    qty: number;
    unitPrice: number;
    image: string;
  }>;
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    coupon?: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliverySlot: string;
  paymentMethod: "COD" | "UPI" | "Card";
  status: OrderStatus;
};
