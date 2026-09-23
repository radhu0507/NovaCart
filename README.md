# NovaCart — Full-Stack E-Commerce Web Application

A complete e-commerce web app. Customers can browse a
product catalog, manage a cart, place orders and track delivery status; admins get a dashboard
to manage products and update order statuses.

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS v4 (client) · Node.js 18+ + Express 5 +
Prisma ORM (server) · PostgreSQL (database) · JWT auth · Axios

---

## Features

### Customer
- Browse products: search, filter by category, sort by price/name
- Product detail pages with stock indicators
- Cart with quantity controls (persisted in `localStorage`)
- Checkout with shipping + simulated payment (no real payment processed)
- Order confirmation page and delivery-status tracker
- "My Orders" history with per-order details
- Register / login / logout with JWT session persistence

### Admin
- Dashboard with store statistics (sales, orders, products, users)
- Full product CRUD (create, edit, delete)
- Order management — update any order's status (PENDING → CONFIRMED → SHIPPED → DELIVERED / CANCELLED)
- Order history lists the customer for each order

### Backend
- REST API returning `{ success, data }` envelopes
- Role-based authorization (`USER` / `ADMIN`) via JWT middleware
- Transactional order creation with atomic stock decrement and insufficient-stock checks
- Centralized error handling (`ApiError` + error middleware), input validation on key fields
- Prisma models: `User`, `Product`, `Order`, `OrderItem`

---

## Folder structure

```
E commerce/
├── client/            # React + Vite + Tailwind front-end
│   └── src/
│       ├── components/  # Shared UI (Navbar, ProductCard, StatusBadge, ...)
│       ├── context/     # Auth, Cart, Toast providers
│       ├── hooks/       # useAuth, useCart, useDebounce, ...
│       ├── layouts/     # MainLayout, AdminLayout
│       ├── pages/       # Storefront pages
│       │   └── admin/   # Dashboard, Products, Product form, Orders
│       ├── services/    # Axios API wrappers
│       ├── utils/       # Formatting helpers
│       └── types/       # Shared TypeScript types
└── server/            # Express + Prisma back-end
    ├── prisma/
    │   ├── migrations/  # SQL migrations
    │   ├── schema.prisma
    │   └── seed.ts      # Seed data (users + products)
    └── src/
        ├── controllers/ # auth, product, order, admin
        ├── middleware/  # auth (JWT), errorHandler
        ├── routes/      # auth, products, orders, admin
        └── utils/       # jwt, ApiError
```

---

## Running it locally

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL running locally (port 5432)

### 1. Database setup

```ps
psql -U postgres -c "CREATE ROLE novacart WITH LOGIN PASSWORD 'your-own-password' CREATEDB;"
psql -U postgres -c "CREATE DATABASE novacart OWNER novacart;"
```

The `CREATEDB` privilege lets Prisma create a shadow database for migrations.

> If you use your own role/database/password, update the connection string in `server/.env`.

### 2. Backend

```ps
cd server
cp .env.example .env        # edit DATABASE_URL, JWT_SECRET if needed
npm install
npm run db:migrate          # prisma migrate dev (generate + apply migrations)
npm run db:seed             # idempotent seed (3 users, 10 products)
npm run dev                 # starts API on http://localhost:5000
```

### 3. Frontend

```ps
cd client
npm install
npm run dev                 # starts Vite on http://localhost:5173
```

Open http://localhost:5173. The client proxies `/api` to the backend on port 5000.

### Production build

```ps
cd client
npm run build               # type-checks then outputs to client/dist
cd ../server
npm run build               # compiles server to server/dist
npm start                   # serves the API (serve client/dist separately)
```

---

## Deployment (production)

This project is deploy-ready with a [Render Blueprint](render.yaml) and works with a free
Neon PostgreSQL database.

### 1. Database on Neon

1. Create a free project at [neon.tech](https://neon.tech) and copy the connection string from
   the dashboard (it looks like `postgresql://user:pass@ep-xxx-pooler.aws.neon.tech/neondb?sslmode=require`).
   A working Prisma URL is the pooler string with any `channel_binding` parameter dropped:
   `postgresql://user:pass@ep-xxx-pooler.aws.neon.tech/neondb?sslmode=require`.
2. This string becomes the server's `DATABASE_URL`. The schema and seed are applied
   automatically by the deploy script (see below), so no manual setup is needed.

### 2. Code on GitHub

Push this repository to GitHub (the repo already contains `render.yaml`).

```ps
git add -A
git commit -m "Add production deployment config"
git push -u origin main
```

Make sure `server/.env` is never committed — it is gitignored.

### 3. Deploy with Render Blueprint

1. Sign up at [render.com](https://render.com) and connect your GitHub account.
2. Click **New +** > **Blueprint** > pick the NovaCart repository.
3. Fill in the prompted environment variables:
   - `DATABASE_URL` — the Neon connection string from step 1
   - `JWT_SECRET` — a long random string (e.g. `openssl rand -hex 32`)
   - `VITE_API_URL` — will be `https://novacart-api.onrender.com` (set after the API deploys)
4. Click **Apply**. Render provisions:
   - `novacart-api` — web service on Node 20: installs, runs `prisma migrate deploy`,
     seeds the database, then starts the API.
   - `novacart-web` — static site hosting the React build.
5. After both deploy, open the **API** service, copy its URL
   (e.g. `https://novacart-api.onrender.com`) and:
   - set the static site env `VITE_API_URL` to that URL and redeploy it;
   - add `,https://<static-site-URL>` to the API's `CLIENT_ORIGIN` env and redeploy the API.

The storefront is then live at `https://<your-static-site>.onrender.com`.

> Free Render web services spin down after ~15 minutes of inactivity; the first request after
> an idle period takes a few seconds to wake up. The Neon database stays always-on.

---

## Demo data (seeded)

The seed script populates the database with 3 users, one of whom has the ADMIN role, and
10 products across Electronics, Clothing, Accessories, Home & Kitchen, and Beauty & Care,
using Unsplash image URLs.

---

## Environment variables

### `server/.env`
| Variable        | Example                                        | Notes                          |
|-----------------|------------------------------------------------|--------------------------------|
| `DATABASE_URL`  | `postgresql://novacart:your-own-password@localhost:5432/novacart` | Postgres connection string (URL-encode special chars in the password) |
| `JWT_SECRET`    | `novacart-super-secret-key-change-me`          | Secret used to sign JWTs        |
| `PORT`          | `5000`                                         | API port                       |
| `CLIENT_ORIGIN` | `http://localhost:5173`                        | CORS origin for the client     |

### `client/.env` (optional)
None required — the Vite dev server proxies `/api` to `http://localhost:5000`
(configured in `client/vite.config.ts`).

---

## API overview

All responses use `{ "success": true, "data": { ... } }`. Errors use
`{ "success": false, "message": "...", "error": { "statusCode" } }`.

### Auth
| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| POST   | `/api/auth/register` | Register (name, email, password) |
| POST   | `/api/auth/login`    | Login, returns JWT + user      |
| GET    | `/api/auth/me`       | Get current user (protected)   |

### Products
| Method | Endpoint            | Description                                   |
|--------|---------------------|-----------------------------------------------|
| GET    | `/api/products`      | List, query params: `search`, `category`, `sort` (`price_asc`, `price_desc`, `name_asc`) |
| GET    | `/api/products/:id`  | Get one product                               |
| POST   | `/api/products`      | Create (admin)                                |
| PUT    | `/api/products/:id`  | Update (admin)                                |
| DELETE | `/api/products/:id`  | Delete (admin)                                |

### Orders
| Method | Endpoint               | Description                                  |
|--------|------------------------|----------------------------------------------|
| POST   | `/api/orders`          | Create order: `{ items:[{productId,quantity}], shippingAddress }` (protected) |
| GET    | `/api/orders`          | My orders (admin sees all)                   |
| GET    | `/api/orders/:id`      | Order detail (owner only; admin all)         |
| PUT    | `/api/orders/:id/status` | Update status (admin): `{ status: "SHIPPED" }` |

Valid order statuses: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

### Admin
| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | `/api/admin/stats`  | Sales, orders, products, user counts |
| GET    | `/api/admin/users`  | All users (passwords never returned) |

### Health
| Method | Endpoint        |
|--------|-----------------|
| GET    | `/api/health`   |

---

## Key implementation notes

- **Atomic orders:** order creation runs in a Prisma transaction; stock is decremented only if
  every item is available, otherwise the whole order is rolled back.
- **Stock safety:** quantities are clamped against available stock on both client and server,
  and the server rejects out-of-stock combinations with a 400.
- **Ownership checks:** a customer can only view their own orders; admin endpoints return all.
- **Tailwind v4:** uses the `@tailwindcss/vite` plugin — no `tailwind.config.js` or PostCSS needed.
- **npm vs code:** order statuses use an enum in Prisma, validated on the server before persist.

---

## Future improvements

- Real payment gateway integration (Stripe)
- Product images with file upload / cloud storage
- Email notifications on order confirmation and status change
- DataTables: search + pagination for products and orders
- Coupons / discounts, product reviews and ratings
- Wishlist, recommended products, and better responsiveness polish

## Limitations

- Payment is simulated — no card data is sent or stored.
- Images rely on remote Unsplash URLs; offline they show a generated placeholder.
- Seed + migration scripts assume a local PostgreSQL instance.
- To reset the database, re-run `npm run db:migrate` after dropping the schema, then `npm run db:seed`.

---

Built with React, Node.js, Express, Prisma, PostgreSQL, Tailwind CSS, and Vite.