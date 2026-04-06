# Full-Stack E-Commerce Application

This workspace now contains a complete e-commerce starter split into:

- `backend/` -> Spring Boot + Spring Security + JWT + MySQL
- `frontend/` -> React + Vite + Material UI + Context API

The older root-level `src/` and `pom.xml` were left untouched so the new app lives cleanly in dedicated folders.

## Folder Structure

```text
New project/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/ecommerce/backend/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── exception/
│       │   ├── repository/
│       │   ├── security/
│       │   ├── service/
│       │   └── specification/
│       ├── main/resources/
│       │   ├── application.properties
│       │   └── data.sql
│       └── test/java/com/ecommerce/backend/service/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
└── README.md
```

## Backend First: Module-by-Module

### 1. Core Domain

The backend is built with a layered architecture:

- `controller` -> receives REST requests
- `service` -> contains business logic
- `repository` -> handles database access through Spring Data JPA
- `entity` -> JPA models and table relationships

Main entities:

- `User` with roles `ADMIN` and `USER`
- `Category`
- `Product`
- `Cart`
- `CartItem`
- `Order`
- `OrderItem`

Relationships used:

- One user has one cart
- One user has many orders
- One category has many products
- One cart has many cart items
- One order has many order items
- One product can appear in many cart items and order items

### 2. DTO and API Layer

DTOs are grouped by feature:

- `dto/auth` for registration and login
- `dto/product` for product CRUD
- `dto/category` for category CRUD
- `dto/cart` for cart operations
- `dto/order` for placing and viewing orders
- `dto/common` for paginated responses and errors

Controllers:

- `AuthController`
- `ProductController`
- `CategoryController`
- `CartController`
- `OrderController`

### 3. Security

Security is implemented with:

- Spring Security
- JWT token generation/validation
- role-based method access

Important classes:

- `security/SecurityConfig`
- `security/JwtService`
- `security/JwtAuthenticationFilter`
- `security/CustomUserDetailsService`

Authorization rules:

- public access: auth APIs, product listing, category listing, Swagger
- authenticated access: cart, checkout, order history
- admin-only access: create/update/delete products and categories

### 4. Product Search, Filtering, Pagination

Product listing supports:

- keyword search
- category filtering
- minimum and maximum price filtering
- sorting
- pagination

This is implemented in:

- `specification/ProductSpecification`
- `service/impl/ProductServiceImpl`

### 5. Validation and Error Handling

The backend includes:

- Jakarta Validation annotations such as `@NotBlank`, `@Size`, `@Min`, `@DecimalMin`
- centralized exception handling with `@ControllerAdvice`

See:

- `exception/GlobalExceptionHandler`

### 6. Swagger and Sample Data

Swagger UI is enabled at:

- `http://localhost:8080/swagger-ui.html`

Sample records are loaded from:

- `backend/src/main/resources/data.sql`

Demo credentials:

- Admin: `admin@shop.com` / `Admin@123`
- User: `user@shop.com` / `User@123`

### 7. Backend Tests

Basic JUnit + Mockito unit tests are included for:

- `ProductServiceImpl`
- `CartServiceImpl`

## Frontend Second: Module-by-Module

### 1. App Structure

The React frontend uses:

- functional components
- hooks
- Axios
- React Router
- Context API
- Material UI

Main folders:

- `src/api` -> Axios client and feature API calls
- `src/context` -> auth and cart state
- `src/components` -> reusable UI and route guards
- `src/pages` -> feature screens

### 2. Pages Included

- `HomePage` -> product listing, search, filter, pagination
- `LoginPage`
- `RegisterPage`
- `ProductDetailsPage`
- `CartPage`
- `CheckoutPage`
- `OrderHistoryPage`
- `AdminDashboardPage`

### 3. State Management

Context providers:

- `AuthContext` -> token, user session, login, register, logout
- `CartContext` -> cart fetch/update/add/remove actions

### 4. Navigation and Guards

Protected navigation is handled by:

- `ProtectedRoute` for signed-in pages
- `AdminRoute` for admin dashboard access

## API Summary

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Categories:

- `GET /api/categories`
- `POST /api/categories` admin
- `PUT /api/categories/{id}` admin
- `DELETE /api/categories/{id}` admin

Products:

- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products` admin
- `PUT /api/products/{id}` admin
- `DELETE /api/products/{id}` admin

Cart:

- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/{id}`
- `DELETE /api/cart/items/{id}`

Orders:

- `POST /api/orders`
- `GET /api/orders/me`

## Setup Instructions

### Backend

1. Create a MySQL database or let Spring create it automatically.
2. Update environment values if needed:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=ecommerce_db
export DB_USERNAME=root
export DB_PASSWORD=root
export JWT_SECRET=VGhpc0lzQVN1cGVyU2VjdXJlSldUU2VjcmV0S2V5Rm9yRWNvbW1lcmNlQXBwbGljYXRpb24xMjM0NTY=
export JWT_EXPIRATION=86400000
```

3. Run the backend:

```bash
cd backend
mvn spring-boot:run
```

### Frontend

1. Copy the environment template if desired:

```bash
cd frontend
cp .env.example .env
```

2. Install packages and run the app:

```bash
npm install
npm run dev
```

Default frontend URL:

- `http://localhost:5173`

## Deployment

This project is now deployment-ready with Docker:

- [docker-compose.yml](/Users/sanjeevkumar/Documents/New%20project/docker-compose.yml)
- [backend/Dockerfile](/Users/sanjeevkumar/Documents/New%20project/backend/Dockerfile)
- [frontend/Dockerfile](/Users/sanjeevkumar/Documents/New%20project/frontend/Dockerfile)
- [frontend/nginx.conf](/Users/sanjeevkumar/Documents/New%20project/frontend/nginx.conf)

### 1. Prepare Environment

Copy the root environment template:

```bash
cd "/Users/sanjeevkumar/Documents/New project"
cp .env.example .env
```

Edit `.env` and set at least:

- `DB_PASSWORD`
- `JWT_SECRET`

### 2. Deploy With Docker Compose

Run:

```bash
cd "/Users/sanjeevkumar/Documents/New project"
docker compose up --build -d
```

This starts:

- MySQL
- Spring Boot backend
- React frontend served by Nginx

### 3. Access the Deployed App

After containers are healthy:

- App: `http://localhost`
- Swagger: `http://localhost/swagger-ui.html`

### 4. Stop the Deployment

```bash
docker compose down
```

To remove the database volume too:

```bash
docker compose down -v
```

### 5. Deploy on a Cloud VM

On a Linux server or VPS:

1. Install Docker and Docker Compose plugin
2. Upload the project
3. Copy `.env.example` to `.env`
4. Set production secrets
5. Run `docker compose up --build -d`
6. Point your domain to the server IP
7. Put Nginx/Traefik or a cloud load balancer with HTTPS in front if needed

## Notes

- The backend is configured for MySQL in normal runtime.
- Pagination responses are returned in a custom `PageResponse<T>` format.
- The frontend expects the backend API base URL at `VITE_API_URL`, defaulting to `/api` for production reverse proxying.
- The generated project is ready for further enhancements like payments, image uploads, wishlists, and integration tests.
