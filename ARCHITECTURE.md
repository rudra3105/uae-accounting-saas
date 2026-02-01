# System Architecture

## Overview

UAE Accounting SaaS is a modern, scalable business management system built with Next.js 14 and PostgreSQL. It follows clean architecture principles with clear separation of concerns.

## Architecture Layers

### 1. Presentation Layer
**Location:** `/app` and `/components`

- **Server Components:** Page layouts, data fetching
- **Client Components:** Interactive UI, forms, real-time updates
- **Components:** Reusable UI elements (NavBar, StatsCard, POSBill, etc.)

### 2. Business Logic Layer
**Location:** `/lib`

Contains core business logic:
- `accounting-engine.ts` - Journal entry creation, VAT calculations, financial reporting
- `inventory-engine.ts` - Stock management, movements, low stock alerts
- `accounting.ts` - Utility functions for calculations
- `api-utils.ts` - API middleware, validation, response formatting

### 3. Data Access Layer
**Location:** `/prisma`

- **Schema:** Complete database model definitions
- **Migrations:** Database version control
- **Prisma Client:** Type-safe database access

### 4. API Layer
**Location:** `/app/api`

- RESTful endpoints following Next.js conventions
- Authentication & authorization middleware
- Input validation and error handling
- Response standardization

---

## Data Flow

### Sale Creation Flow
```
POS Screen (UI)
    ↓
POST /api/sales
    ↓
[Validation] → [Authorization Check]
    ↓
Create Sale Record
    ↓
[Reduce Inventory] + [Create Journal Entry] + [Update VAT]
    ↓
Return Success Response
    ↓
Update Dashboard
```

### Accounting Entry Flow
```
Sale/Purchase/Expense Created
    ↓
Trigger Accounting Engine
    ↓
Create Journal Entry (Balanced)
    ↓
[Debit Side]           [Credit Side]
Update Accounts        Update Accounts
    ↓
Update Account Balances
    ↓
Log to Activity Trail
```

---

## Database Design

### Relationship Diagram

```
Company
├── Users → Roles → Permissions
├── Financial Years
├── Accounts → Journal Entries → Journal Items
├── Products → Stock → Stock Movements
├── Categories
├── Warehouses
├── Customers → Sales → Sale Items
├── Vendors → Purchases → Purchase Items
├── Payments
├── Payment Modes
├── Invoice Series
└── Tax Rates
```

### Key Tables

#### Core Tables
| Table | Purpose |
|-------|---------|
| `users` | User authentication & profiles |
| `roles` | Role definitions |
| `permissions` | Fine-grained access control |
| `company_settings` | Multi-tenant configuration |

#### Transaction Tables
| Table | Purpose |
|-------|---------|
| `sales` | Sales invoices |
| `sale_items` | Sale line items |
| `purchases` | Purchase orders |
| `purchase_items` | Purchase line items |
| `payments` | Payment records |

#### Inventory Tables
| Table | Purpose |
|-------|---------|
| `products` | Product catalog |
| `stock` | Current inventory levels |
| `stock_movements` | Audit trail |
| `warehouses` | Location management |

#### Accounting Tables
| Table | Purpose |
|-------|---------|
| `accounts` | Chart of accounts |
| `journal_entries` | Double-entry records |
| `journal_items` | Debit/credit items |

#### Master Data
| Table | Purpose |
|-------|---------|
| `customers` | Customer master |
| `vendors` | Supplier master |
| `categories` | Product categories |
| `tax_rates` | Tax configurations |

---

## Key Algorithms

### 1. VAT Calculation

```typescript
// Tax Exclusive (Default)
Subtotal = Sum of (Quantity × Unit Price)
Tax = Subtotal × VAT Rate (5%)
Total = Subtotal + Tax

// Tax Inclusive
Gross Amount = Input from UI
Tax = Gross / (1 + VAT Rate) × VAT Rate
Subtotal = Gross - Tax
```

### 2. Double-Entry Accounting

```
For Each Transaction:
  Create Journal Entry
  For Each Debit Posting:
    Account.Debit += Amount
    Account.Balance -= Amount
  For Each Credit Posting:
    Account.Credit += Amount
    Account.Balance += Amount
  
  Validation: Sum(Debits) = Sum(Credits)
```

### 3. Stock Management

```
On Sale:
  For Each Product:
    Stock[Product][Warehouse] -= Quantity
    LogMovement(Type: OUT, Reference: SaleId)
    
On Purchase:
  For Each Product:
    Stock[Product][Warehouse] += Quantity
    LogMovement(Type: IN, Reference: PurchaseId)
    
Check Reorder Level:
  If Stock <= Reorder Level: Status = WARNING
  If Stock <= Reorder Level * 0.5: Status = CRITICAL
```

---

## API Architecture

### Request/Response Pattern

```typescript
// Success Response
{
  success: true,
  message: "Operation successful",
  data: { /* payload */ }
}

// Error Response
{
  success: false,
  message: "Error description",
  errors: { /* validation errors */ }
}
```

### Authentication Flow

```
Client Login (email/password)
  ↓
Server Validates Credentials
  ↓
Generate JWT Token (24h expiry)
  ↓
Return Token + User Info
  ↓
Client Stores Token (HTTP-only cookie recommended)
  ↓
Subsequent Requests: Authorization: Bearer <token>
  ↓
Verify Token & Extract User Context
```

### Permission Checking

```
Request with Token
  ↓
Extract User & Role
  ↓
Check Role Permissions
  ↓
Match Required Module + Action
  ↓
Allow/Deny Access
  ↓
Log Activity
```

---

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Session stored in JWT token
- Database connection pooling

### Database Optimization
- Indexed on frequently queried columns
- Proper foreign key relationships
- Materialized views for reports (future)

### Caching Strategy
- API response caching (React Query)
- Static asset caching
- Database query result caching

### Performance
- Decimal.js for precise calculations (no floating point)
- Lazy loading of components
- Server-side pagination
- Database query optimization

---

## Security Architecture

### Authentication
- JWT-based stateless authentication
- Password hashing with bcryptjs
- 24-hour token expiration
- Secure token transmission (HTTP-only cookies)

### Authorization
- Role-based access control (RBAC)
- Module and action-based permissions
- API endpoint protection
- Activity logging for audit

### Data Protection
- SQL Injection prevention (Prisma ORM)
- Input validation with Zod
- CSRF protection (Next.js middleware)
- Environment variable isolation

### Audit Trail
- User activity logging
- Transaction tracking
- Change history
- API request logging

---

## Error Handling Strategy

```
User Input Error
  ↓ [Validation]
  400 Bad Request + Validation Errors

Authentication Error
  ↓ [Token Verification]
  401 Unauthorized

Authorization Error
  ↓ [Permission Check]
  403 Forbidden

Resource Not Found
  ↓ [Database Query]
  404 Not Found

Server Error
  ↓ [Exception]
  500 Internal Server Error + Logging
```

---

## Deployment Architecture

### Development Environment
```
Local Machine
├── Next.js Dev Server (Port 3000)
├── PostgreSQL (Port 5432)
└── Prisma Studio (Port 5555)
```

### Production Environment
```
Vercel (Frontend)
├── Next.js Application
├── API Routes
└── Static Assets

AWS RDS (Database)
└── PostgreSQL Cluster

AWS S3 (Storage)
└── File Uploads
```

### CI/CD Pipeline
```
GitHub Push
  ↓
Run Tests & Linting
  ↓
Build Production Bundle
  ↓
Run Database Migrations
  ↓
Deploy to Vercel
  ↓
Health Check
  ↓
Smoke Tests
```

---

## Monitoring & Logging

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)
- API response times
- Database query performance

### Business Monitoring
- Transaction success rates
- VAT compliance
- Inventory accuracy
- User activity patterns

### Security Monitoring
- Failed login attempts
- Permission denied events
- Data modification audits
- API abuse detection

---

## Future Enhancements

### Phase 2
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Email notifications

### Phase 3
- [ ] Bank API integration
- [ ] Automated reconciliation
- [ ] Multi-location support
- [ ] Subscription management

### Phase 4
- [ ] Machine learning for anomaly detection
- [ ] Blockchain for audit trail
- [ ] AI-powered insights
- [ ] Real-time collaboration

---

## Testing Strategy

### Unit Tests
- Business logic (accounting engine)
- Utility functions
- Validation functions

### Integration Tests
- API endpoints
- Database operations
- End-to-end workflows

### E2E Tests
- User journeys
- Critical business flows
- UI interactions

---

## Documentation

- **README.md** - Project overview and features
- **SETUP.md** - Installation and configuration
- **ARCHITECTURE.md** - This document
- **API.md** - API documentation (to be created)
- **Database.md** - Schema documentation (to be created)

---

**Last Updated:** January 28, 2026
**Version:** 1.0.0
