# API Body Formats

Use these JSON bodies with `Content-Type: application/json`.

For protected endpoints, send the token returned by login or email verification:

```txt
Authorization: Bearer <token>
```

## Auth

`POST /api/auth/signup`

```json
{
  "fullName": "Walk In Customer",
  "email": "customer@example.com",
  "password": "password123",
  "role": "USER"
}
```

Allowed signup `role` values: `USER`, `WALK_IN_CUSTOMER`.

Signup sends a verification email. Login is blocked until the email is verified. Email verification returns a login token.

When using Mailtrap sandbox, the email is captured in your Mailtrap inbox. It will not arrive in the real Gmail inbox.

`GET /api/auth/verify-email?token=<token-from-email>`

`POST /api/auth/resend-verification`

```json
{
  "email": "customer@example.com"
}
```

`POST /api/auth/login`

```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

## Email Settings

Use these values in `.env` for Mailtrap sandbox email verification:

```txt
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=db469f2a8db119
MAIL_PASSWORD=<full Mailtrap password>
MAIL_FROM=MiniPOS <no-reply@minipos.local>
APP_BASE_URL=http://localhost:3000
```

If signup returns an email error, confirm `.env` contains the full `MAIL_PASSWORD`, not the masked password shown in Mailtrap.

## Users

`POST /api/users`

```json
{
  "fullName": "Ali Hussan",
  "email": "ali@example.com",
  "password": "password123",
  "role": "CASHIER",
  "isActive": true
}
```

`PUT /api/users/:id`

```json
{
  "fullName": "Ali Hussan Updated",
  "email": "ali.updated@example.com",
  "password": "newpassword123",
  "role": "ADMIN",
  "isActive": true
}
```

Allowed `role` values: `ADMIN`, `MANAGER`, `CASHIER`, `USER`, `WALK_IN_CUSTOMER`.

## Products

`POST /api/products`

```json
{
  "name": "Wireless Mouse",
  "categoryId": 1,
  "barcode": "1234567890123",
  "sku": "MOUSE-001",
  "description": "Ergonomic wireless mouse",
  "costPrice": 1200,
  "sellingPrice": 1800,
  "stockQuantity": 50,
  "minimumStock": 5,
  "unit": "pcs",
  "isActive": true
}
```

`PUT /api/products/:id`

```json
{
  "name": "Wireless Mouse Pro",
  "categoryId": 1,
  "barcode": "1234567890123",
  "sku": "MOUSE-001-PRO",
  "description": "Updated product description",
  "costPrice": 1300,
  "sellingPrice": 2000,
  "stockQuantity": 40,
  "minimumStock": 10,
  "unit": "pcs",
  "isActive": true
}
```

## Categories

`POST /api/categories`

```json
{
  "name": "Electronics",
  "description": "Electronic items and accessories",
  "isActive": true
}
```

`PUT /api/categories/:id`

```json
{
  "name": "Computer Accessories",
  "description": "Accessories for laptops and desktops",
  "isActive": true
}
```

## Customers

`GET /api/customers/me`

Returns the logged-in customer's own profile when the customer record uses the same email as the logged-in user.

`PUT /api/customers/me`

```json
{
  "fullName": "Ahmed Khan Updated",
  "phone": "03007654321",
  "email": "ahmed.updated@example.com",
  "address": "Karachi, Pakistan",
  "isActive": true
}
```

`POST /api/customers`

```json
{
  "fullName": "Ahmed Khan",
  "phone": "03001234567",
  "email": "ahmed@example.com",
  "address": "Lahore, Pakistan",
  "isActive": true
}
```

`PUT /api/customers/:id`

```json
{
  "fullName": "Ahmed Khan Updated",
  "phone": "03007654321",
  "email": "ahmed.updated@example.com",
  "address": "Karachi, Pakistan",
  "isActive": true
}
```

## Inventory

`POST /api/inventory`

```json
{
  "productId": 1,
  "quantity": 20,
  "movementType": "STOCK_IN",
  "notes": "Initial stock entry"
}
```

`PUT /api/inventory/:id`

```json
{
  "productId": 1,
  "quantity": 10,
  "movementType": "ADJUSTMENT",
  "notes": "Stock corrected after recount"
}
```

Allowed `movementType` values: `STOCK_IN`, `STOCK_OUT`, `ADJUSTMENT`.

## Sales

`GET /api/sales/my`

Returns sales created by the logged-in user. Admin can use `GET /api/sales` to view all sales.

`POST /api/sales`

```json
{
  "customerId": 1,
  "subtotal": 3600,
  "discount": 100,
  "tax": 0,
  "totalAmount": 3500,
  "paymentMethod": "CASH",
  "status": "COMPLETED",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 1800,
      "subtotal": 3600
    }
  ]
}
```

`userId` is taken from the authenticated user token when creating a sale.

`PUT /api/sales/:id`

```json
{
  "customerId": 1,
  "userId": 1,
  "subtotal": 3600,
  "discount": 0,
  "tax": 0,
  "totalAmount": 3600,
  "paymentMethod": "CARD",
  "status": "COMPLETED",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 1800,
      "subtotal": 3600
    }
  ]
}
```

Allowed `paymentMethod` values: `CASH`, `CARD`, `ONLINE`.

Allowed `status` values: `COMPLETED`, `CANCELLED`.

## Reports

Reports are `GET` endpoints, so they do not use JSON request bodies.

Use query parameters instead:

```txt
GET /api/reports/sales?startDate=2026-07-01&endDate=2026-07-31
GET /api/reports/inventory?productId=1
```
