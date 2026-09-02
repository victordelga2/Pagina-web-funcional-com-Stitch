# VICELE Store — Phase 2 Functional Frontend

This package is the cleaned Phase 2 frontend for VICELE.

## Included
- Real navigation between storefront pages.
- Working quick-add and product add-to-cart.
- Cart quantities, remove, empty cart, totals and local demo checkout.
- Wishlist stored in browser localStorage.
- Search modal.
- Size selection and size guide.
- Functional admin navigation and product editor demo state.
- Sourcing demo actions (query/import/reject).

## Important
This is still a frontend-only phase. Cart, wishlist and demo orders are local to the browser. Real authentication, database persistence, supplier APIs, payments and automation are intentionally not connected yet.

## Netlify
The repository structure assumes the site is inside `vicele-store`. In Netlify use:
- Base directory: `vicele-store`
- Publish directory: `.`
- Build command: blank

## Next phase
Supabase database setup and schema.
