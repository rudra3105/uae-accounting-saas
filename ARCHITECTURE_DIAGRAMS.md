# System Architecture Diagram

## Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│              (Next.js React Components)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  Dashboard   │ │ Sales (POS)  │ │  Purchases   │            │
│  │    Module    │ │   Module     │ │   Module     │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  Inventory   │ │ Accounting   │ │   Reports    │            │
│  │   Module     │ │   Module     │ │   Module     │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐                             │
│  │  Settings    │ │    Auth      │                             │
│  │   Module     │ │   Module     │                             │
│  └──────────────┘ └──────────────┘                             │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP/REST API
                       │ (Next.js API Routes)
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│              API LAYER (Next.js /api)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Auth Routes  │ │ Sales Routes │ │ Purchase     │            │
│  │  /auth/      │ │  /sales/     │ │ Routes       │            │
│  │              │ │              │ │ /purchases/  │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Inventory    │ │ Accounting   │ │   Reports    │            │
│  │ Routes       │ │   Routes     │ │   Routes     │            │
│  │ /inventory/  │ │ /accounts/   │ │  /reports/   │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Middleware Layer                                        │   │
│  │ ├─ Authentication (JWT Verification)                   │   │
│  │ ├─ Authorization (Role/Permission Check)               │   │
│  │ ├─ Input Validation (Zod)                             │   │
│  │ ├─ Error Handling                                      │   │
│  │ └─ Response Formatting                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ SQL Queries (Prisma ORM)
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│           BUSINESS LOGIC LAYER (/lib)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Accounting Engine (accounting-engine.ts)                │  │
│  │                                                          │  │
│  │  Double-Entry Accounting:                              │  │
│  │  ├─ createSaleJournalEntry()                           │  │
│  │  ├─ createPurchaseJournalEntry()                       │  │
│  │  ├─ calculateVATSummary()                              │  │
│  │  ├─ generateTrialBalance()                             │  │
│  │  └─ generateIncomeStatement()                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Inventory Engine (inventory-engine.ts)                  │  │
│  │                                                          │  │
│  │  Stock Management:                                      │  │
│  │  ├─ reduceStockOnSale()                               │  │
│  │  ├─ increaseStockOnPurchase()                         │  │
│  │  ├─ adjustStock()                                      │  │
│  │  ├─ getLowStockItems()                                │  │
│  │  └─ getInventoryReport()                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Accounting Utilities (accounting.ts)                    │  │
│  │                                                          │  │
│  │  Calculations:                                          │  │
│  │  ├─ calculateVAT()                                     │  │
│  │  ├─ calculateTotalWithVAT()                            │  │
│  │  ├─ formatCurrency()                                   │  │
│  │  └─ generateInvoiceNumber()                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ Prisma Client (Type-Safe ORM)
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│              DATA ACCESS LAYER (Prisma)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Prisma ORM                                              │  │
│  │                                                          │  │
│  │  Type-Safe Database Access                              │  │
│  │  ├─ Query Generation                                    │  │
│  │  ├─ Relation Handling                                   │  │
│  │  ├─ Transaction Support                                 │  │
│  │  └─ Migration Management                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ SQL Queries
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│              DATABASE LAYER                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PostgreSQL Database                                      │  │
│  │                                                          │  │
│  │ 45 Tables Across 8 Categories:                          │  │
│  │                                                          │  │
│  │ Authentication:                                          │  │
│  │ ├─ users                                                │  │
│  │ ├─ roles                                                │  │
│  │ └─ permissions                                          │  │
│  │                                                          │  │
│  │ Transactions:                                            │  │
│  │ ├─ sales / sale_items                                   │  │
│  │ ├─ purchases / purchase_items                           │  │
│  │ ├─ quotations                                           │  │
│  │ ├─ payments                                             │  │
│  │ └─ expenses                                             │  │
│  │                                                          │  │
│  │ Inventory:                                               │  │
│  │ ├─ products                                             │  │
│  │ ├─ stock                                                │  │
│  │ ├─ stock_movements                                      │  │
│  │ ├─ categories                                           │  │
│  │ └─ warehouses                                           │  │
│  │                                                          │  │
│  │ Accounting:                                              │  │
│  │ ├─ accounts                                             │  │
│  │ ├─ journal_entries                                      │  │
│  │ ├─ journal_items                                        │  │
│  │ └─ financial_years                                      │  │
│  │                                                          │  │
│  │ Master Data:                                             │  │
│  │ ├─ customers                                            │  │
│  │ ├─ vendors                                              │  │
│  │ ├─ tax_rates                                            │  │
│  │ └─ company_settings                                     │  │
│  │                                                          │  │
│  │ [+ 10 more supporting tables]                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Sales Transaction

```
┌─────────────┐
│  POS Screen │
└──────┬──────┘
       │ (Select products, add to cart)
       ↓
┌─────────────────────────┐
│ POST /api/sales         │
├─────────────────────────┤
│ ├─ Validate input       │
│ ├─ Check authorization  │
│ ├─ Verify products exist│
│ └─ Create sale          │
└────────┬────────────────┘
         │
         ├─────────────────────────────────────────────┐
         │                                             │
         ↓                                             ↓
┌──────────────────────┐                  ┌────────────────────────┐
│ Create Sale Record   │                  │ Accounting Engine      │
├──────────────────────┤                  ├────────────────────────┤
│ ├─ Generate invoice  │                  │ ├─ Create journal      │
│ │   number           │                  │ │   entry              │
│ ├─ Calculate totals  │                  │ ├─ Debit: Cash         │
│ ├─ Calculate VAT     │                  │ ├─ Credit: Revenue     │
│ └─ Store in DB       │                  │ ├─ Credit: VAT Payable │
│                      │                  │ └─ Update balances     │
└──────────┬───────────┘                  └────────────────────────┘
           │                                      ↓
           ├──────────────────────────────────────┘
           │
           ↓
┌──────────────────────┐
│ Inventory Engine     │
├──────────────────────┤
│ ├─ Reduce stock      │
│ ├─ Log movement      │
│ └─ Check reorder     │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ Success Response     │
├──────────────────────┤
│ ├─ Sale ID           │
│ ├─ Invoice Number    │
│ ├─ Total Amount      │
│ └─ VAT Amount        │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ Update Dashboard     │
└──────────────────────┘
```

---

## Authentication & Authorization Flow

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │ (email, password)
       ↓
┌──────────────────────────┐
│ POST /api/auth/login     │
├──────────────────────────┤
│ ├─ Validate email format │
│ ├─ Find user in DB       │
│ ├─ Verify password       │
│ ├─ Check if active       │
│ └─ Generate JWT token    │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ Return JWT Token         │
├──────────────────────────┤
│ ├─ Token (24h expiry)    │
│ ├─ User info             │
│ ├─ Role                  │
│ └─ Permissions           │
└────────┬─────────────────┘
         │
         ↓
┌──────────────────────────┐
│ Store in Client          │
│ (HTTP-only cookie)       │
└────────┬─────────────────┘
         │
         │ (Subsequent requests)
         │
         ↓
┌──────────────────────────────┐
│ API Middleware               │
├──────────────────────────────┤
│ ├─ Extract token from header │
│ ├─ Verify signature          │
│ ├─ Extract user context      │
│ └─ Check permissions         │
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
┌────────┐  ┌──────────┐
│ Allowed│  │ Denied   │
│ (200)  │  │ (401/403)│
└────────┘  └──────────┘
```

---

## Database Relationships

```
┌─────────────┐
│   Company   │
└────┬────────┘
     │
     ├─→ Users
     │     └─→ Roles
     │          └─→ Permissions
     │
     ├─→ Products ─→ Categories
     │     ├─→ Stock ─→ Warehouses
     │     └─→ Stock Movements
     │
     ├─→ Customers ─→ Sales
     │                  ├─→ Sale Items
     │                  ├─→ Sale Returns
     │                  ├─→ Payments
     │                  └─→ Journal Entries
     │
     ├─→ Vendors ─→ Purchases
     │               ├─→ Purchase Items
     │               ├─→ Purchase Returns
     │               ├─→ Payments
     │               └─→ Journal Entries
     │
     ├─→ Quotations
     │
     ├─→ Accounts ─→ Journal Entries
     │                 └─→ Journal Items
     │
     ├─→ Tax Rates
     │
     ├─→ Invoice Series
     │
     └─→ Payment Modes
```

---

## Module Dependencies

```
┌──────────────────────────────────────────────────┐
│            Presentation Layer                    │
│            (React Components)                    │
└──────────────┬───────────────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ↓          ↓          ↓
┌────────┐ ┌──────────┐ ┌──────────┐
│ Pages  │ │Components│ │  Hooks   │
└────┬───┘ └────┬─────┘ └────┬─────┘
     │          │            │
     └──────────┼────────────┘
                │
                ↓
     ┌──────────────────────┐
     │  API Layer           │
     │  /api/**/route.ts    │
     └──────────┬───────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ↓           ↓           ↓
┌─────────┐ ┌──────────┐ ┌──────────┐
│Middleware│ │Validation│ │Response  │
│          │ │          │ │Formatting│
└────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │
     └────────────┼────────────┘
                  │
                  ↓
     ┌──────────────────────┐
     │ Business Logic       │
     │ /lib/*.ts            │
     └──────────┬───────────┘
                │
    ┌───────────┼───────────┬──────────────┐
    │           │           │              │
    ↓           ↓           ↓              ↓
┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Accounting│ │Inventory │ │Validation│ │Utilities │
│Engine    │ │Engine    │ │          │ │          │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │            │
     └────────────┼────────────┼────────────┘
                  │
                  ↓
     ┌──────────────────────┐
     │ Prisma Client        │
     │ (Type-Safe ORM)      │
     └──────────┬───────────┘
                │
                ↓
     ┌──────────────────────┐
     │ PostgreSQL Database  │
     │ (45 Tables)          │
     └──────────────────────┘
```

---

## Request-Response Cycle

```
1. USER REQUEST
   │
   ├─ URL: GET /sales/pos
   ├─ Method: GET
   └─ Headers: Authorization: Bearer <token>
   │
   ↓
2. NEXT.JS ROUTING
   │
   ├─ Match route: /app/sales/pos/page.tsx
   ├─ Load component
   └─ Render page
   │
   ↓
3. USER INTERACTION
   │
   ├─ Click "Complete Sale"
   ├─ FormData: { items[], discount, ...}
   └─ POST /api/sales
   │
   ↓
4. API REQUEST PROCESSING
   │
   ├─ Route: /app/api/sales/route.ts
   ├─ Parse body
   └─ Middleware check (auth)
   │
   ↓
5. VALIDATION LAYER
   │
   ├─ Validate input (Zod)
   ├─ Check authorization
   └─ Verify company exists
   │
   ↓
6. BUSINESS LOGIC
   │
   ├─ Calculate totals
   ├─ Trigger accounting engine
   ├─ Trigger inventory engine
   └─ Update related records
   │
   ↓
7. DATABASE OPERATIONS
   │
   ├─ Create sale record
   ├─ Create journal entries
   ├─ Update stock levels
   └─ Log activity
   │
   ↓
8. RESPONSE GENERATION
   │
   ├─ Format response
   ├─ Add status code
   └─ Return JSON
   │
   ↓
9. CLIENT SIDE
   │
   ├─ Receive response
   ├─ Update state
   ├─ Revalidate data
   └─ Show success message
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Type safety throughout
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Performance
