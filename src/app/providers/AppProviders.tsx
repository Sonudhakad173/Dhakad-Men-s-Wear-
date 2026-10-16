import React from "react";
import { AuthProvider } from "../../store/AuthStore";
import { CartProvider } from "../../store/CartStore";
import { CompareProvider } from "../../store/CompareStore";
import { OrdersProvider } from "../../store/OrdersStore";
import { ProductsProvider } from "../../store/ProductsStore";
import { RecentlyViewedProvider } from "../../store/RecentlyViewedStore";
import { ToastProvider } from "../../store/ToastStore";
import { WishlistProvider } from "../../store/WishlistStore";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductsProvider>
          <OrdersProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  <RecentlyViewedProvider>{children}</RecentlyViewedProvider>
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </OrdersProvider>
        </ProductsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
