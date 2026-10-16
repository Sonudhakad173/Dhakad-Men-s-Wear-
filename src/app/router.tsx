import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { RootLayout } from "./layouts/RootLayout";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { CheckoutSuccessPage } from "../pages/CheckoutSuccessPage";
import { ComparePage } from "../pages/ComparePage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProductPage } from "../pages/ProductPage";
import { ShopPage } from "../pages/ShopPage";
import { SignupPage } from "../pages/SignupPage";
import { TrackOrderPage } from "../pages/TrackOrderPage";
import { WishlistPage } from "../pages/WishlistPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
import { AdminProductEditPage } from "../pages/admin/AdminProductEditPage";
import { AdminProductsPage } from "../pages/admin/AdminProductsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "product/:productId", element: <ProductPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      { path: "compare", element: <ComparePage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "checkout/success/:orderId", element: <CheckoutSuccessPage /> },
      { path: "track-order", element: <TrackOrderPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "products", element: <AdminProductsPage /> },
      { path: "products/:productId", element: <AdminProductEditPage /> },
      { path: "orders", element: <AdminOrdersPage /> },
    ],
  },
]);
