import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Compare from "./pages/Compare.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Account from "./pages/Account.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/track-order" element={<TrackOrder />} />

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/compare" element={<Compare />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />

        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>

        <Route
          path="/shipping"
          element={<Placeholder title="Shipping & Delivery" description="Demo page. Add your shipping policy here." />}
        />
        <Route
          path="/returns"
          element={<Placeholder title="Returns & Exchange" description="Demo page. Add your returns policy here." />}
        />
        <Route
          path="/privacy"
          element={<Placeholder title="Privacy" description="Demo page. Add your privacy policy here." ctaTo="/" ctaLabel="Back home" />}
        />
        <Route
          path="/terms"
          element={<Placeholder title="Terms" description="Demo page. Add your terms & conditions here." ctaTo="/" ctaLabel="Back home" />}
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}