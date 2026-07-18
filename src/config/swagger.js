const roleEnum = ["OWNER", "CUSTOMER"];

const successResponse = (description, schemaRef) => ({
  description,
  content: schemaRef
    ? {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string" },
              data: { $ref: schemaRef },
            },
          },
        },
      }
    : undefined,
});

const listResponse = (description, itemRef) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: itemRef },
          },
        },
      },
    },
  },
});

const jsonBody = (schemaRef) => ({
  required: true,
  content: {
    "application/json": {
      schema: { $ref: schemaRef },
    },
  },
});

const idParameter = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "integer", minimum: 1 },
};

const protectedOperation = (operation) => ({
  security: [{ bearerAuth: [] }],
  ...operation,
});

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "MiniPOS API",
    version: "1.0.0",
    description: "API documentation for MiniPOS authentication, products, categories, customers, inventory, sales, reports, and users.",
  },
  servers: [{ url: "/api" }],
  tags: [
    { name: "Auth" },
    { name: "Users" },
    { name: "Stores" },
    { name: "Products" },
    { name: "Categories" },
    // { name: "Customers" },
    { name: "Inventory" },
    { name: "Sales" },
    { name: "Reports" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      AuthResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string" },
        },
      },
      SignupResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token:{type : "String"}
          // verificationSent: { type: "object", properties:{ user:{$ref:#components}} },
        },
      },
      SignupRequest: {
        type: "object",
        required: ["fullName", "email", "password"],
        properties: {
          fullName: { type: "string", example: "CUSTOMER / OWNER" },
          email: { type: "string", format: "email", example: "customer@example.com" },
          password: { type: "string", minLength: 6, example: "password123" },
          role: { type: "string", enum: ["OWNER", "CUSTOMER"], example: "USER" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "owner@example.com" },
          password: { type: "string", minLength: 6, example: "password123" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: roleEnum },
          isActive: { type: "boolean" },
          emailVerified: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UserRequest: {
        type: "object",
        required: ["fullName", "email", "password"],
        properties: {
          fullName: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          role: { type: "string", enum: roleEnum },
          isActive: { type: "boolean" },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CategoryRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Electronics" },
          description: { type: "string", nullable: true },
          isActive: { type: "boolean" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          categoryId: { type: "integer" },
          barcode: { type: "string", nullable: true },
          sku: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          costPrice: { type: "number" },
          sellingPrice: { type: "number" },
          stockQuantity: { type: "integer" },
          minimumStock: { type: "integer" },
          unit: { type: "string" },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductRequest: {
        type: "object",
        required: ["name", "categoryId", "costPrice", "sellingPrice", "unit"],
        properties: {
          name: { type: "string", example: "Wireless Mouse" },
          categoryId: { type: "integer", minimum: 1 },
          barcode: { type: "string", nullable: true },
          sku: { type: "string", nullable: true },
          description: { type: "string", nullable: true },
          costPrice: { type: "number", minimum: 0 },
          sellingPrice: { type: "number", minimum: 0 },
          stockQuantity: { type: "integer", minimum: 0 },
          minimumStock: { type: "integer", minimum: 0 },
          unit: { type: "string", example: "pcs" },
          isActive: { type: "boolean" },
        },
      },
      StoreRequest: {
        type: "object",
        required: ["name", "email", "phone","address"],
        properties:{
          name: {type: "sring", example: "Ali"},
          email: {type: "string", example: "ali@hussan.com"},
          phone: {type: "integer", example: "012345678"},
          address: {type: "string", example: "house 1A"},
        },
      },
      Customer: {
        type: "object",
        properties: {
          id: { type: "integer" },
          fullName: { type: "string" },
          phone: { type: "string", nullable: true },
          email: { type: "string", nullable: true, format: "email" },
          address: { type: "string", nullable: true },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CustomerRequest: {
        type: "object",
        required: ["fullName"],
        properties: {
          fullName: { type: "string" },
          phone: { type: "string", nullable: true },
          email: { type: "string", nullable: true, format: "email" },
          address: { type: "string", nullable: true },
          isActive: { type: "boolean" },
        },
      },
      InventoryMovement: {
        type: "object",
        properties: {
          id: { type: "integer" },
          productId: { type: "integer" },
          quantity: { type: "integer" },
          movementType: { type: "string", enum: ["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"] },
          notes: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      InventoryMovementRequest: {
        type: "object",
        required: ["productId", "quantity", "movementType"],
        properties: {
          productId: { type: "integer", minimum: 1 },
          quantity: { type: "integer", minimum: 0 },
          movementType: { type: "string", enum: ["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"] },
          notes: { type: "string", nullable: true },
        },
      },
      SaleItemRequest: {
        type: "object",
        required: ["productId", "quantity", "unitPrice", "subtotal"],
        properties: {
          productId: { type: "integer", minimum: 1 },
          quantity: { type: "integer", minimum: 1 },
          unitPrice: { type: "number", minimum: 0 },
          subtotal: { type: "number", minimum: 0 },
        },
      },
      Sale: {
        type: "object",
        properties: {
          id: { type: "integer" },
          customerId: { type: "integer", nullable: true },
          userId: { type: "integer" },
          subtotal: { type: "number" },
          discount: { type: "number" },
          tax: { type: "number" },
          totalAmount: { type: "number" },
          paymentMethod: { type: "string", enum: ["CASH", "CARD", "ONLINE"] },
          status: { type: "string", enum: ["COMPLETED", "CANCELLED"] },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/SaleItemRequest" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SaleRequest: {
        type: "object",
        required: ["subtotal", "totalAmount", "paymentMethod", "items"],
        properties: {
          customerId: { type: "integer", nullable: true },
          subtotal: { type: "number", minimum: 0 },
          discount: { type: "number", minimum: 0 },
          tax: { type: "number", minimum: 0 },
          totalAmount: { type: "number", minimum: 0 },
          paymentMethod: { type: "string", enum: ["CASH", "CARD", "ONLINE"] },
          status: { type: "string", enum: ["COMPLETED", "CANCELLED"] },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/SaleItemRequest" },
          },
        },
      },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Sign up customer",
        requestBody: jsonBody("#/components/schemas/SignupRequest"),
        responses: {
          201: successResponse("Signup successful", "#/components/schemas/SignupResponse"),
          400: { description: "Validation failed" },
          409: { description: "Email already exists" },
          502: { description: "Signup created, but verification email could not be sent" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login verified user",
        requestBody: jsonBody("#/components/schemas/LoginRequest"),
        responses: {
          200: successResponse("Login successful", "#/components/schemas/AuthResponse"),
          401: { description: "Invalid email or password" },
          403: { description: "Email not verified or inactive account" },
        },
      },
    },
    "/auth/resend-verification": {
      post: {
        tags: ["Auth"],
        summary: "Resend verification email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  name: {type: "string", format: "name", example: "Name"},
                  email: { type: "string", format: "email", example: "customer@example.com" },
                  phone: {type: "integer", format:"phone", example: "098765432"},
                  address:{address: "string", format: "Address", example: "House 123"} ,
                },
              },
            },
          },
        },
        responses: {
          200: successResponse("Verification email processed", "#/components/schemas/SignupResponse"),
          404: { description: "User not found" },
        },
      },
    },
    "/auth/verify-email": {
      get: {
        tags: ["Auth"],
        summary: "Verify signup email",
        parameters: [{ name: "token", in: "query", required: true, schema: { type: "string" } }],
        responses: {
          200: successResponse("Email verified", "#/components/schemas/AuthResponse"),
          400: { description: "Invalid or expired token" },
        },
      },
    },
    "/users": {
      get: protectedOperation({
        tags: ["Users"],
        summary: "List users (Owner Only)",
        responses: { 200: listResponse("Users", "#/components/schemas/User") },
      }),
      post: protectedOperation({
        tags: ["Users"],
        summary: "Create user",
        requestBody: jsonBody("#/components/schemas/UserRequest"),
        responses: { 201: successResponse("User created", "#/components/schemas/User") },
      }),
    },
    "/users/{id}": {
      get: protectedOperation({
        tags: ["Users"],
        summary: "Get user by id",
        parameters: [idParameter],
        responses: { 200: successResponse("User", "#/components/schemas/User") },
      }),
      put: protectedOperation({
        tags: ["Users"],
        summary: "Update user",
        parameters: [idParameter],
        requestBody: jsonBody("#/components/schemas/UserRequest"),
        responses: { 200: successResponse("User updated", "#/components/schemas/User") },
      }),
      delete: protectedOperation({
        tags: ["Users"],
        summary: "Delete user",
        parameters: [idParameter],
        responses: { 200: { description: "User deleted" } },
      }),
    },
        "/stores": {
      get: protectedOperation({ tags: ["Stores"], summary: "List of Stores", responses: {200: successResponse("Stores","#/components/schemas/stores")}}),
      post: protectedOperation({
        tags: ["Stores"],
        summary: "Create Store",
        requestBody:{required: true,
          content:{
            "applicati/json":{
              schema:{
                type: "object",
                required: ["email"],
                properties:{
                  name: {type: "sring", example: "Ali"},
                  slug: {type: "sring", example: "Ali_Store"},
                  email: {type: "string", example: "ali@hussan.com"},
                  phone: {type: "integer", example: "012345678"},
                  address: {type: "string", example: "house 1A"},

                }
              }
            }
          }
        },
        // jsonBody("#/components/schemas/stores"),
        response: {201:successResponse("Store Created","#/components/schemas/stores")},
      }),
    },
    "store/{id}":{
      get: protectedOperation({tags: ["Inventory"], summary: "Get Store by ID", parameters:[idParameter],responses:{200: successResponse("Inventory movement","#/componens/schemas/stores")}}),
      put: protectedOperation({
        tags: ["Stores"],
        summary: "Update Store",
        parameters: [idParameter],
        requestBody: jsonBody("#/conponens/schemas/stores"),
        responses: {200: successResponse("store update","#/components/schemas/stores")},
      }),
      delete: protectedOperation({tags:["Stores"],summary: "Delete Store", parameters: [idParameter], responses: {200: { description: "store deleted" } } } ),
    },
    "/products": {
      get: protectedOperation({ tags: ["Products"], summary: "List products", responses: { 200: listResponse("Products", "#/components/schemas/Product") } }),
      post: protectedOperation({
        tags: ["Products"],
        summary: "Create product (owner only)",
        requestBody: jsonBody("#/components/schemas/ProductRequest"),
        responses: { 201: successResponse("Product created", "#/components/schemas/Product") },
      }),
    },
    "/products/{id}": {
      get: protectedOperation({ tags: ["Products"], summary: "Get product by id", parameters: [idParameter], responses: { 200: successResponse("Product", "#/components/schemas/Product") } }),
      put: protectedOperation({
        tags: ["Products"],
        summary: "Update product (owner only)",
        parameters: [idParameter],
        requestBody: jsonBody("#/components/schemas/ProductRequest"),
        responses: { 200: successResponse("Product updated", "#/components/schemas/Product") },
      }),
      delete: protectedOperation({ tags: ["Products"], summary: "Delete product (owner only)", parameters: [idParameter], responses: { 200: { description: "Product deleted" } } }),
    },
    "/categories": {
      get: protectedOperation({ tags: ["Categories"], summary: "List categories (owner only)", responses: { 200: listResponse("Categories", "#/components/schemas/Category") } }),
      post: protectedOperation({
        tags: ["Categories"],
        summary: "Create category (owner only)",
        requestBody: jsonBody("#/components/schemas/CategoryRequest"),
        responses: { 201: successResponse("Category created", "#/components/schemas/Category") },
      }),
    },
    "/categories/{id}": {
      get: protectedOperation({ tags: ["Categories"], summary: "Get category by id (owner only)", parameters: [idParameter], responses: { 200: successResponse("Category", "#/components/schemas/Category") } }),
      put: protectedOperation({
        tags: ["Categories"],
        summary: "Update category (owner only)",
        parameters: [idParameter],
        requestBody: jsonBody("#/components/schemas/CategoryRequest"),
        responses: { 200: successResponse("Category updated", "#/components/schemas/Category") },
      }),
      delete: protectedOperation({ tags: ["Categories"], summary: "Delete category (owner only)", parameters: [idParameter], responses: { 200: { description: "Category deleted" } } }),
    },
    //I am commenting out the customers from swagger
    // "/customers": {
    //   get: protectedOperation({ tags: ["Customers"], summary: "List customers", responses: { 200: listResponse("Customers", "#/components/schemas/Customer") } }),
    //   post: protectedOperation({
    //     tags: ["Customers"],
    //     summary: "Create customer",
    //     requestBody: jsonBody("#/components/schemas/CustomerRequest"),
    //     responses: { 201: successResponse("Customer created", "#/components/schemas/Customer") },
    //   }),
    // },
    // "/customers/me": {
    //   get: protectedOperation({
    //     tags: ["Customers"],
    //     summary: "Get own customer profile",
    //     responses: { 200: successResponse("Customer", "#/components/schemas/Customer") },
    //   }),
    //   put: protectedOperation({
    //     tags: ["Customers"],
    //     summary: "Update own customer profile",
    //     requestBody: jsonBody("#/components/schemas/CustomerRequest"),
    //     responses: { 200: successResponse("Customer profile updated", "#/components/schemas/Customer") },
    //   }),
    // },
    // "/customers/{id}": {
    //   get: protectedOperation({ tags: ["Customers"], summary: "Get customer by id", parameters: [idParameter], responses: { 200: successResponse("Customer", "#/components/schemas/Customer") } }),
    //   put: protectedOperation({
    //     tags: ["Customers"],
    //     summary: "Update customer",
    //     parameters: [idParameter],
    //     requestBody: jsonBody("#/components/schemas/CustomerRequest"),
    //     responses: { 200: successResponse("Customer updated", "#/components/schemas/Customer") },
    //   }),
    //   delete: protectedOperation({ tags: ["Customers"], summary: "Delete customer", parameters: [idParameter], responses: { 200: { description: "Customer deleted" } } }),
    // },

    "/inventory": {
      get: protectedOperation({ tags: ["Inventory"], summary: "List inventory movements (owner only)", responses: { 200: listResponse("Inventory movements", "#/components/schemas/InventoryMovement") } }),
      post: protectedOperation({
        tags: ["Inventory"],
        summary: "Create inventory movement (owner only)",
        requestBody: jsonBody("#/components/schemas/InventoryMovementRequest"),
        responses: { 201: successResponse("Inventory movement created", "#/components/schemas/InventoryMovement") },
      }),
    },
    "/inventory/{id}": {
      get: protectedOperation({ tags: ["Inventory"], summary: "Get inventory movement by id", parameters: [idParameter], responses: { 200: successResponse("Inventory movement", "#/components/schemas/InventoryMovement") } }),
      put: protectedOperation({
        tags: ["Inventory"],
        summary: "Update inventory movement",
        parameters: [idParameter],
        requestBody: jsonBody("#/components/schemas/InventoryMovementRequest"),
        responses: { 200: successResponse("Inventory movement updated", "#/components/schemas/InventoryMovement") },
      }),
      delete: protectedOperation({ tags: ["Inventory"], summary: "Delete inventory movement", parameters: [idParameter], responses: { 200: { description: "Inventory movement deleted" } } }),
    },
    "/sales": {
      get: protectedOperation({ tags: ["Sales"], summary: "List all sales (owner only)", responses: { 200: listResponse("Sales", "#/components/schemas/Sale") } }),
      post: protectedOperation({
        tags: ["Sales"],
        summary: "Create sale (owner only)",
        description: "userId is taken from the authenticated owner only token.",
        requestBody: jsonBody("#/components/schemas/SaleRequest"),
        responses: { 201: successResponse("Sale created", "#/components/schemas/Sale") },
      }),
    },
    "/sales/my": {
      get: protectedOperation({
        tags: ["Sales"],
        summary: "List own sales",
        responses: { 200: listResponse("Sales", "#/components/schemas/Sale") },
      }),
    },
    "/sales/{id}": {
      get: protectedOperation({ tags: ["Sales"], summary: "Get sale by id", parameters: [idParameter], responses: { 200: successResponse("Sale", "#/components/schemas/Sale") } }),
      put: protectedOperation({
        tags: ["Sales"],
        summary: "Update sale/payment",
        parameters: [idParameter],
        requestBody: jsonBody("#/components/schemas/SaleRequest"),
        responses: { 200: successResponse("Sale updated", "#/components/schemas/Sale") },
      }),
      delete: protectedOperation({ tags: ["Sales"], summary: "Delete sale", parameters: [idParameter], responses: { 200: { description: "Sale deleted" } } }),
    },
    "/reports": {
      get: protectedOperation({ tags: ["Reports"], summary: "Get combined reports", responses: { 200: { description: "Reports" } } }),
    },
    "/reports/sales": {
      get: protectedOperation({ tags: ["Reports"], summary: "Get sales report", responses: { 200: { description: "Sales report" } } }),
    },
    "/reports/inventory": {
      get: protectedOperation({ tags: ["Reports"], summary: "Get inventory report", responses: { 200: { description: "Inventory report" } } }),
    },
  },
};

module.exports = openApiSpec;