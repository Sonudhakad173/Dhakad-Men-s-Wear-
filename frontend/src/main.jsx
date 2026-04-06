import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./store/auth.jsx";
import { CartProvider } from "./store/cart.jsx";
import { CatalogProvider } from "./store/catalog.jsx";
import { CompareProvider } from "./store/compare.jsx";
import { OrdersProvider } from "./store/orders.jsx";
import { RecentProvider } from "./store/recent.jsx";
import { ThemeProvider } from "./store/theme.jsx";
import { ToastProvider } from "./store/toast.jsx";
import { WishlistProvider } from "./store/wishlist.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <CatalogProvider>
              <OrdersProvider>
                <RecentProvider>
                  <WishlistProvider>
                    <CompareProvider>
                      <CartProvider>
                        <App />
                      </CartProvider>
                    </CompareProvider>
                  </WishlistProvider>
                </RecentProvider>
              </OrdersProvider>
            </CatalogProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
