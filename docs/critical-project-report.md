# MiniPOS Critical Project Report

Review date: 2026-07-19

## Scope and Method

Static review of the Express application, PostgreSQL migrations, route authorization,
tenant scoping, and sale/inventory workflows. All JavaScript files pass `node --check`.
There are no test files or test command, and migrations were not run against a database
as part of this review.

## Critical Findings

1. The schema cannot bootstrap. `008_create_stores.sql` has no `status` column, but
   constrains it, and it is missing a comma before `created_at`. Every fresh migration
   fails before store-scoped functionality can exist.
2. Sales do not decrement product stock or create `STOCK_OUT` movements. The stock check
   happens outside the sale transaction, allowing concurrent requests to oversell.
3. A sale update accepts client-controlled totals and sale items because validation allows
   unknown properties. It can replace items and change monetary fields without re-pricing,
   stock verification, or inventory reconciliation.
4. Inventory create, update, and delete are not scoped to `req.storeId`. An authorized
   user in one store can target the numeric inventory/product identifiers of another store.
5. Role handling was inconsistent: the database enum has only `OWNER` and `CUSTOMER`,
   while the repository defaulted a new user to `CASHIER`.
6. Store reads disclose data outside membership checks. Any authenticated user can fetch
   any store by id, including stores they neither own nor belong to.

## High-Priority Findings

1. A sale can reference a customer from a different store; the foreign key checks existence
   but not tenant ownership. Products can similarly be linked to categories from another store.
2. Store creation and product plus initial-inventory creation are multi-step writes without
   one transaction, leaving partial records after a failure.
3. Deleting a store with sales is likely blocked: sales are cascaded from the store, but
   `sale_items.sale_id` has no `ON DELETE CASCADE`.
4. Expected domain errors during sale creation are mapped to 500 responses, turning useful
   stock and not-found feedback into server errors.
5. Reports include cancelled sales and inventory movements do not update the product's
   `stock_quantity`, so sales and inventory views cannot be reconciled.
6. The fallback JWT secret is usable in production if environment configuration is missed.

## Improvement Plan

### 1. Restore the database contract

- Repair migration 008 before it is applied; for environments where it is already recorded,
  add a new corrective migration instead of editing history.
- Make all tenant-owned `store_id` columns `NOT NULL` after backfilling, and add indexes for
  store-scoped lookups and foreign keys.
- Add `ON DELETE CASCADE` to `sale_items.sale_id`, or replace destructive store deletion
  with an explicit archival policy.
- Define one role model in migrations, constants, validation, and authorization. Add a
  `CASHIER` enum value only if it is a real product role.

### 2. Make inventory an append-only ledger

- Implement one transaction for sale creation: lock products with `FOR UPDATE`, aggregate
  duplicate items, validate stock, insert sale/items, decrement stock, and write `STOCK_OUT`
  movements.
- Rework sale cancellation, update, and deletion as explicit business operations that reverse
  or adjust inventory. Avoid mutable sale line items once a sale is completed.
- Scope every inventory write and product/category/customer relation to the active store in SQL.

### 3. Close authorization and validation gaps

- Centralize membership/ownership authorization in store-aware middleware or repository
  predicates; use it for every `/stores/:id` route.
- Reject unknown body fields and validate report query parameters. Compute all financial
  amounts server-side using decimal-safe arithmetic.
- Validate customer and category ownership before inserts/updates.
- Require `JWT_SECRET` in production and add rate limiting, secure headers, request-size
  limits, and structured error handling.

### 4. Establish a delivery baseline

- Add integration tests for migrations, role permissions, cross-store access, sale stock
  concurrency, cancellation, and report totals.
- Add a `test` script and run it in CI, including a fresh-database migration test.
- Document setup, migrations, supported roles, store-selection behavior, and API contracts
  in the currently empty README.
