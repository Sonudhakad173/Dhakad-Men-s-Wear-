# Dhakad Mens Wear (Frontend)

Premium menswear storefront UI with a Zara/H&M-inspired feel, built as **frontend-only** (no backend). It includes routing, product details, cart, wishlist, compare, checkout, order tracking, and an admin panel UI.

## Tech

- React + TypeScript
- Vite
- React Router
- LocalStorage (mock persistence for products, cart, wishlist, orders)

## Pages (Routing)

- `/` Home
- `/shop` Shop with URL-synced filters
- `/product/:productId` Product details + gallery zoom + size guide
- `/cart` Cart + coupon + toasts
- `/wishlist` Wishlist
- `/compare` Compare 2-3 items side-by-side
- `/checkout` Checkout flow UI (Address -> Slot -> Payment -> Review)
- `/checkout/success/:orderId` Order success
- `/track-order` Track order timeline
- `/login` Login UI
- `/signup` Signup UI
- `/admin` Admin dashboard (frontend only)
- `/admin/products` Admin products list
- `/admin/products/:productId` Admin edit product
- `/admin/orders` Admin orders (update statuses)

## Premium UI Behaviors

- Sticky **transparent header over the hero** (home) that turns **solid on scroll**
- Animated product cards (hover lift + image zoom)
- Color variants using **real color dots** (including a multi-color gradient swatch)
- Mobile hamburger menu with **slide drawer**
- New Arrivals / Best Sellers carousel with:
  - arrows + dots
  - swipe support on mobile
  - autoplay with pause-on-hover (silent)
- Toast notifications for:
  - wishlist add/remove
  - cart add/remove
  - cart quantity changes
  - checkout success (cart cleared)

## Product Catalog

Seeded Indian collection with your specified:

- Shirts: Rajasthan Cotton Shirt, Lucknow Linen Shirt, Printed Shirt, Festive Satin Shirt
- Jeans: Cargo Jeans, Baggy Jeans, Straight Fit Jeans, Distressed Jeans
- Trousers: Formal Trousers, Linen Pants, Casual Trousers, Regular Fit Trousers
- Others: T-shirt, Jogger, Plain Shirt, Shorts

All products are defined in:

- `src/data/seedProducts.ts`

## Install & Run

1. Install Node.js (18+ recommended)
2. In the project folder:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Folder Structure

```text
Dhakad-Mens-Wear-
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  .gitignore
  src/
    main.tsx
    vite-env.d.ts
    app/
      App.tsx
      router.tsx
      hooks/
      layouts/
      providers/
    components/
      common/
      shop/
      ui/
    data/
      types.ts
      seedProducts.ts
    lib/
      date.ts
      ids.ts
      money.ts
      storage.ts
    pages/
      admin/
      CartPage.tsx
      CheckoutPage.tsx
      CheckoutSuccessPage.tsx
      ComparePage.tsx
      HomePage.tsx
      LoginPage.tsx
      NotFoundPage.tsx
      ProductPage.tsx
      ShopPage.tsx
      SignupPage.tsx
      TrackOrderPage.tsx
      WishlistPage.tsx
    store/
      AuthStore.tsx
      CartStore.tsx
      CompareStore.tsx
      OrdersStore.tsx
      ProductsStore.tsx
      RecentlyViewedStore.tsx
      ToastStore.tsx
      WishlistStore.tsx
    styles/
      globals.css
      components.css
  public/
```

## Admin Demo

Login with:

- `admin@dhakadmenswear.com`

and any password to see the Admin Panel. (Frontend-only demo)

## GitHub Upload

### Option A: GitHub Desktop (no Git CLI needed)

1. Install GitHub Desktop
2. File -> Add Local Repository -> select this folder
3. Commit
4. Publish Repository

### Option B: Git CLI

If `git` is not installed, install it from Git for Windows.

Then:

```bash
git init
git add .
git commit -m "Initial Dhakad Mens Wear frontend"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

## Notes

- This is a frontend demo. Payments and shipping are UI-only.
- Orders placed in checkout are stored in LocalStorage and visible in `/admin/orders`.
