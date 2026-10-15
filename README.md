# 🛒 ShopKart

A full-stack e-commerce web application built from scratch with **React** and **Node.js**. ShopKart lets users browse products, manage wishlists, add items to their cart, place orders with Razorpay payments, and track everything from a clean, modern UI.

I built this project to learn and practice the MERN stack end-to-end — from designing the database models to wiring up the frontend with API calls and handling real payment flows.

---

## ✨ What It Does

- **Browse & Search Products** — Explore a catalog of 12+ products across Electronics, Fashion, Home & Living, and Beauty categories with a live search bar.
- **User Authentication** — Register and log in securely with hashed passwords (bcrypt) and JWT-based sessions stored in cookies.
- **Wishlist** — Save products you like and come back to them later.
- **Shopping Cart** — Add products, adjust quantities, and see your totals update in real time through a sleek slide-out cart drawer.
- **Checkout & Payments** — Enter your shipping address and pay via Razorpay integration (works in test mode out of the box).
- **Order Tracking** — View your order history, check individual order details, and see payment/delivery status.
- **User Profile** — View and manage your account info.
- **Zero-Config Database** — Uses an in-memory MongoDB instance for development, so you don't need to install or configure MongoDB at all. Just run and go.

---

## 🛠️ Tech Stack

| Layer       | Technology                                                        |
| ----------- | ----------------------------------------------------------------- |
| **Frontend** | React 19, React Router v7, Tailwind CSS v4, Vite 8, Axios        |
| **Backend**  | Node.js, Express 5, Mongoose (MongoDB ODM), JWT, bcrypt          |
| **Database** | MongoDB (via `mongodb-memory-server` for local dev — no setup needed) |
| **Payments** | Razorpay (runs in test mode by default)                          |

---

## 📁 Project Structure

```
ShopKart/
├── backend/
│   ├── config/           # Razorpay configuration
│   ├── controllers/      # Business logic (cart, customer, order, product, wishlist)
│   ├── middlewares/       # JWT auth middleware
│   ├── models/            # Mongoose schemas (Customer, Product, Order)
│   ├── routes/            # Express route definitions
│   └── index.js           # Backend entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI (Navbar, ProductCard, CartDrawer, SearchBar, etc.)
│   │   ├── context/       # React Context for global cart state
│   │   ├── pages/         # Route pages (Home, Products, Cart, Checkout, Orders, Profile, etc.)
│   │   ├── services/      # Axios API instance
│   │   ├── App.jsx        # App routes
│   │   └── main.jsx       # React entry point
│   ├── index.html
│   └── vite.config.js     # Vite config with API proxy to backend
│
├── seed-products.mjs      # Script to populate the database with sample products
├── start-dev.mjs          # Starts in-memory MongoDB + backend in one command
└── package.json           # Root dependencies (backend)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node)
- That's it — no MongoDB installation needed!

### 1. Clone the repo

```bash
git clone https://github.com/fenil1527-debug/Shop-Kart.git
cd Shop-Kart
```

### 2. Install dependencies

```bash
# Install backend dependencies (from root)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Start the backend

This spins up an in-memory MongoDB and starts the Express server on port **8000**:

```bash
node start-dev.mjs
```

You should see:
```
⏳  Starting in-memory MongoDB...
✅  In-memory MongoDB ready → mongodb://127.0.0.1:XXXXX/
MongoDB connected successfully
Server running on port 8000
```

### 4. Seed sample products (optional but recommended)

Open a **new terminal** and run:

```bash
node seed-products.mjs
```

This adds 12 products (headphones, sneakers, candles, serums, and more) so you have something to browse right away.

### 5. Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The app will be live at **http://localhost:5173**. The Vite dev server automatically proxies API calls to the backend on port 8000.

---

## 🔌 API Endpoints

### Customers
| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| POST   | `/customers/register`      | Register a new user      |
| POST   | `/customers/login`         | Log in                   |
| GET    | `/customers/profile`       | Get logged-in user info  |

### Products
| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/products`         | List all products       |
| GET    | `/products/:id`     | Get product by ID       |
| POST   | `/products`         | Create a product        |

### Cart
| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| GET    | `/cart`            | Get current user's cart    |
| POST   | `/cart`            | Add item to cart           |
| PUT    | `/cart`            | Update item quantity       |
| DELETE | `/cart`            | Remove item from cart      |

### Wishlist
| Method | Endpoint              | Description                     |
| ------ | --------------------- | ------------------------------- |
| GET    | `/wishlist`           | Get current user's wishlist     |
| POST   | `/wishlist`           | Add product to wishlist         |
| DELETE | `/wishlist`           | Remove product from wishlist    |
| POST   | `/wishlist/move-to-cart` | Move wishlist item to cart   |

### Orders
| Method | Endpoint                       | Description                 |
| ------ | ------------------------------ | --------------------------- |
| POST   | `/orders`                      | Create an order             |
| GET    | `/orders`                      | Get user's order history    |
| GET    | `/orders/:id`                  | Get order details           |
| POST   | `/orders/:id/verify-payment`   | Verify Razorpay payment     |

---

## 💳 Payments (Razorpay)

By default, ShopKart runs in **test mode** — no real Razorpay account needed. Orders will be created with test IDs and payments are auto-verified locally.

To connect a real Razorpay account, create a `.env` file in the `backend/` folder:

```env
RAZORPAY_KEY_ID=rzp_live_your_key_here
RAZORPAY_KEY_SECRET=your_secret_here
```

---

## 🤝 Contributing

This is a personal learning project, but if you find a bug or have an idea, feel free to open an issue or submit a pull request. I'd appreciate any feedback!

---

## 📝 License

ISC

---

Built with ☕ and curiosity by **Fenil**
