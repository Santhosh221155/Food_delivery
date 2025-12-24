# FoodDash (Frontend)

A Swiggy-like food delivery frontend built with Vite + React, Tailwind CSS, React Router, and Zustand. Backend is mocked via static JSON and localStorage.

## Features
- Browse restaurants, search, filter, sort
- Restaurant page with menu and add-to-cart
- Cart with summary, coupons (mock `SAVE10`), and delivery fee rules
- Checkout with address form and mock Cash on Delivery
- Auth (mock): email-based sign in persisted in localStorage
- Orders history and real-time-like order tracking simulation
- Responsive UI, dark mode friendly styles

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL. Data is served from `public/mock/restaurants.json`.

## Project Structure
- `src/pages`: route pages (Home, Restaurant, Cart, Checkout, Orders, OrderDetails, Profile, Auth)
- `src/components`: reusable UI components
- `src/store`: Zustand stores for cart, user, and orders
- `src/services`: API client and fetch helpers
- `public/mock`: mock data JSON

## Notes
- This is frontend-only. Replace mocks with real APIs later.
- Coupons: apply `SAVE10` in code via `useCartStore().applyCoupon('SAVE10')` if you add a UI input.
