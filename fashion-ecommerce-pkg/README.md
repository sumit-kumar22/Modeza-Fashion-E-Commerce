# Modeza — Fashion E-Commerce Platform

A modern, mobile-first **fashion e-commerce frontend** built with **React 19**, **Vite**, **Tailwind CSS v4** and **React Router**. Fully client-powered with mock data (API-ready), LocalStorage persistence, dark/light mode, and a complete shopping flow.

![Modeza](public/favicon.svg)

## ✨ Features

### Products
- 🔍 Live search with debounce
- Filters: category, brand, price range, size, colour, in-stock
- 7 sort modes (price, rating, popularity, discount, newest…)
- Product details with gallery, colors, sizes & stock
- Size guide modal, rating breakdown, reviews (with write-a-review)

### Shopping
- Add to cart with size/colour/quantity selection
- Update quantity, remove, clear cart
- Wishlist (heart any product)
- Coupons page + apply codes in cart (`WELCOME20`, `STYLE15`, `FLAT50`, `FREESHIP`)
- Order summary with dynamic shipping, coupon discount
- Multi-step checkout (shipping → payment) and order history

### Recommendations
- Trending, New Arrivals, Best Sellers, Similar & Recently Viewed
- Auto-“recommended for you” on every product page

### Experience
- 🌗 Dark / light mode (persisted, respects OS preference)
- 📱 Fully responsive (mobile drawer nav, filter drawer)
- Skeleton loaders, smooth animations, toast notifications
- LocalStorage persistence for cart, wishlist, theme, user & orders

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

### Production build

```bash
npm run build && npm run preview
```

## 📁 Structure

```
fashion-ecommerce/
├── public/                 # Static assets & favicon
└── src/
    ├── api/products.js     # Mock API layer (swap for REST later)
    ├── components/         # Navbar, ProductCard, Carousel, Modals…
    ├── context/            # Global state (cart, wishlist, auth, theme)
    ├── data/               # Mock products, coupons, reviews
    ├── hooks/              # useLocalStorage, useDebounce, useTheme
    ├── layouts/            # RootLayout (Navbar + Footer + Outlet)
    ├── pages/              # Home, Shop, Product, Cart, Checkout…
    └── utils/              # storage & formatting helpers
```

## 🔌 Connecting a REST API

All data access flows through `src/api/products.js`. To connect a backend, replace the mock resolvers with real `fetch()` calls — no component changes required.

## 🪙 Demo Coupons

| Code        | Deal                                            |
|-------------|-------------------------------------------------|
| `WELCOME20` | 20% off first order (max $50)                   |
| `STYLE15`   | 15% off orders over $99 (max $60)               |
| `NEW10`     | 10% off new arrivals (max $40)                  |
| `FLAT50`    | $50 off orders over $500                        |
| `FREESHIP`  | Free standard shipping                          |

> **Note:** This is a frontend-only demo. Checkout is simulated — no real payments are processed.