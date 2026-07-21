# MiniPOS - Multi-Tenant Point of Sale Backend & Dashboard

MiniPOS is a high-performance, multi-tenant Point of Sale (POS) backend system built with Node.js, Express, PostgreSQL, and a modern JavaScript dashboard frontend. It features strict store-level tenant isolation, atomic inventory control, transactional sales processing, and real-time analytical reporting.

---

## 🚀 System Features

- **Multi-Tenant Architecture**: Complete store-scoped isolation for products, categories, customers, sales, and inventory movements.
- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control (`OWNER`, `CASHIER`, `CUSTOMER`).
- **Product & Category Management**: Dynamic catalog management with SKU tracking and barcode support.
- **Inventory Control**: Real-time stock movement logging (`STOCK_IN`, `STOCK_OUT`) with reorder level warnings.
- **Sales Engine**: Atomic sale creation with row-level product locking (`FOR UPDATE`), automatic tax calculation, and stock updates.
- **Dashboard & Analytics**: Real-time business metrics aggregation endpoint (`GET /api/dashboard`) returning sales revenue, transaction counts, recent orders, and low-stock alerts.
- **API Documentation**: Integrated Swagger UI available at `/api-docs`.

---

## 🏗️ Architecture & Project Structure

The backend follows a clean **Layered Architecture** (Controller - Service - Repository - DTO):

```text
MiniPOS/
├── docs/                      # Architectural docs & reports
├── sql/
│   ├── migrations/            # Versioned SQL migration scripts
│   └── schema.sql             # Base database schema blueprint
├── src/
│   ├── config/                # Environment, DB Pool, and JWT configurations
│   ├── middlewares/           # Auth, Store scoping, Role, and Validation middlewares
│   ├── modules/               # Feature modules (Controller, Service, Repository, DTO, Validation, Routes)
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── customers/
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── products/
│   │   ├── reports/
│   │   ├── sales/
│   │   ├── stores/
│   │   └── users/
│   ├── routes/                # Central application routing configuration
│   ├── scripts/               # Migration runner scripts (`migrate.js`)
│   ├── utils/                 # Service, Repository, and Controller helpers
│   ├── app.js                 # Express application initialization
│   └── server.js              # Application entry point
├── frontend/                  # POS Dashboard Frontend interface
├── .env.example               # Environment variable blueprint
└── package.json               # Dependencies and npm scripts
```

---

## 🛠️ Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: v14.x or higher

---

## ⚙️ Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/AliHussanMalik/MiniPOS.git
   cd MiniPOS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Configure `.env` values:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_NAME=minipos
   JWT_SECRET=your_secure_random_jwt_secret
   JWT_EXPIRES_IN_SECONDS=86400
   ```

---

## 🗄️ Database Setup & Migrations

Ensure your PostgreSQL service is running and the target database (`minipos`) is created.

Run all pending SQL migrations:
```bash
npm run migrate
```

---

## 🏃 Running the Application

### Backend API Server

- **Development Mode** (with automatic restart via nodemon):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

The backend server will run at `http://localhost:3000`.

### Frontend Application

Navigate to the `frontend/` directory and start the dashboard server:
```bash
cd frontend
npm install
npm start
```

The frontend application runs at `http://localhost:5000` (or specified PORT).

---

## 📡 Core API Endpoints

All store-scoped endpoints require `Authorization: Bearer <token>` and `X-Store-Id: <store_id>` headers.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | No |
| `GET` | `/api/dashboard` | Aggregated dashboard stats & alerts | Yes (JWT + Store) |
| `GET` | `/api/products` | List all store products | Yes (JWT + Store) |
| `POST` | `/api/products` | Create a new product | Yes (Staff/Owner) |
| `GET` | `/api/sales` | List completed sales | Yes (JWT + Store) |
| `POST` | `/api/sales` | Create atomic sale & deduct inventory | Yes (Staff/Owner) |
| `GET` | `/api/reports` | Generate store sales & stock reports | Yes (Staff/Owner) |
| `GET` | `/api-docs` | Interactive Swagger API documentation | No |

---

## 📜 License

Distributed under the ISC License.
