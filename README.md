# UAE Accounting SaaS

A production-ready Cloud Accounting + POS + Inventory Management System designed specifically for UAE businesses.

## Features

### 🧾 Accounting Engine
- Double-entry accounting system
- Automatic journal entry creation for sales, purchases, and expenses
- Chart of accounts with comprehensive account types
- Trial balance and financial statements
- Complete audit trail with activity logging

### 💰 VAT Management (UAE 5%)
- Output VAT tracking (sales)
- Input VAT tracking (purchases)
- VAT payable calculation
- VAT summary reports
- TRN (Tax Registration Number) support

### 🛒 POS System
- Fast billing interface
- Product search and quick add to cart
- Barcode support
- Multiple payment modes
- Invoice series management
- Receipt generation and printing

### 📦 Inventory Management
- Stock tracking by warehouse
- Real-time stock levels
- Automatic stock reduction on sales
- Stock increase on purchases
- Low stock alerts
- Stock movement history
- Reorder point management

### 💳 Sales Management
- Tax inclusive/exclusive billing
- Multiple invoice series
- Customer credit limits
- Sales returns tracking
- Payment tracking
- Multi-warehouse support

### 📥 Purchase Management
- Vendor management
- Purchase orders
- Purchase returns
- VAT recoverable tracking
- Payment terms

### 👥 User Management
- Role-based access control (RBAC)
- Multiple roles: Admin, Accountant, Cashier, Staff
- Permission-based authorization
- User activity logging
- API token authentication

### 📊 Reports
- Profit & Loss Statement
- Balance Sheet
- Trial Balance
- VAT Summary Report
- Sales Reports
- Inventory Reports
- Day Book

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui Components**
- **TanStack Table** (Data tables)
- **TanStack Query** (State management)
- **React Hook Form** (Forms)
- **Zod** (Validation)

### Backend
- **Next.js API Routes** / Server Actions
- **Prisma ORM** (Database)
- **PostgreSQL** (Database)
- **JWT** (Authentication)

### Tools & Libraries
- **Decimal.js** (Precise monetary calculations)
- **date-fns** (Date handling)
- **Recharts** (Charts & graphs)
- **jsPDF** (PDF generation)
- **html2canvas** (HTML to image)
- **js-barcode** (Barcode generation)

## Database Schema

### Core Tables
- **users** - User accounts with roles
- **roles** - Role definitions
- **permissions** - Fine-grained permissions
- **company_settings** - Company configuration

### Sales & POS
- **sales** - Sales invoices
- **sale_items** - Sale line items
- **sale_returns** - Sales returns
- **quotations** - Quotation management
- **customers** - Customer master data

### Purchases
- **purchases** - Purchase orders
- **purchase_items** - Purchase line items
- **purchase_returns** - Purchase returns
- **vendors** - Vendor master data

### Inventory
- **products** - Product catalog
- **categories** - Product categories
- **warehouses** - Warehouse master
- **stock** - Current stock levels
- **stock_movements** - Stock movement history

### Accounting
- **accounts** - Chart of accounts
- **journal_entries** - Journal entries
- **journal_items** - Double-entry items
- **financial_years** - Fiscal year setup

### Tax & Payments
- **tax_rates** - Tax rate definitions
- **payments** - Payment records
- **payment_modes** - Payment method types
- **expenses** - Expense tracking

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Setup Steps

1. **Clone and install dependencies**
```bash
cd "UAE Accounting SaaS"
npm install
```

2. **Configure environment variables**
```bash
cp .env.local .env.local
# Edit .env.local with your database connection
```

3. **Setup database**
```bash
npx prisma migrate dev
npx prisma db seed
```

4. **Run development server**
```bash
npm run dev
```

5. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── dashboard/           # Main dashboard
├── sales/              # Sales management
│   ├── page.tsx       # Sales list
│   └── pos/           # POS screen
├── purchases/         # Purchase management
├── inventory/         # Inventory management
├── accounts/          # Accounting module
├── reports/           # Reports section
├── settings/          # Company settings
├── api/               # API routes
│   ├── auth/         # Authentication
│   ├── sales/        # Sales endpoints
│   ├── purchases/    # Purchase endpoints
│   ├── inventory/    # Inventory endpoints
│   └── reports/      # Reporting endpoints
└── layout.tsx        # Root layout

components/
├── navbar.tsx         # Navigation bar
├── stats-card.tsx     # Statistics card
└── pos-bill.tsx       # POS bill component

lib/
├── prisma.ts          # Prisma client
├── api-utils.ts       # API utilities
├── accounting.ts      # Accounting utilities
├── accounting-engine.ts  # Core accounting logic
├── inventory-engine.ts   # Inventory logic
└── auth.ts            # Authentication helpers

prisma/
├── schema.prisma      # Database schema
└── seed.js           # Seed data script
```

## Key Features Implementation

### 1. Double-Entry Accounting
The system automatically creates balanced journal entries for all transactions:
- Sales create debit (Cash) and credit (Revenue + VAT Payable)
- Purchases create debit (Inventory + VAT Recoverable) and credit (Payable)
- Expenses create debit (Expense) and credit (Cash)

### 2. VAT Calculation
Precise VAT calculation with support for:
- Tax-inclusive pricing
- Tax-exclusive pricing
- VAT on individual line items
- VAT payable = Output VAT - Input VAT

### 3. Multi-Warehouse Inventory
- Track stock across multiple locations
- Automatic stock reduction on sales
- Automatic stock increase on purchases
- Stock movement audit trail

### 4. Role-Based Access Control
- Admin: Full system access
- Accountant: Accounting and reporting
- Cashier: POS and basic operations
- Staff: Restricted access based on permissions

### 5. Reporting Engine
- Real-time financial statements
- VAT compliance reports
- Inventory valuation
- Sales analytics

## API Endpoints

### Authentication
```
POST /api/auth/login
```

### Sales
```
POST /api/sales              # Create sale
GET  /api/sales             # List sales
GET  /api/sales/[id]        # Get sale details
```

### Inventory
```
GET  /api/inventory/stock   # Get stock levels
GET  /api/inventory/movements  # Stock movements
```

### Reports
```
GET  /api/reports/vat-summary
GET  /api/reports/trial-balance
GET  /api/reports/profit-loss
```

## Default Login

```
Email: admin@albaraka.ae
Password: admin@123
```

## Development Notes

### Code Quality
- Full TypeScript support
- Input validation with Zod
- API error handling
- Type-safe database queries with Prisma

### Security
- JWT-based authentication
- Password hashing with bcryptjs
- SQL injection prevention via Prisma
- CSRF protection
- Rate limiting ready

### Performance
- Server-side rendering with Next.js
- Database query optimization
- Caching strategies
- Decimal.js for accurate calculations

## Deployment

### Environment Setup
1. Configure PostgreSQL database
2. Set environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Build: `npm run build`
5. Start: `npm run start`

### Recommended Hosting
- Vercel (Frontend)
- AWS RDS (PostgreSQL Database)
- AWS S3 (File storage)

## Future Enhancements

- [ ] Email notifications
- [ ] SMS alerts for low stock
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] API integration with banks
- [ ] Automated reconciliation
- [ ] Multi-currency support
- [ ] Subscription management
- [ ] Compliance reports for authorities

## Support & License

This is a complete, production-ready codebase. For modifications and customization, contact the development team.

## Important Notes

- All monetary calculations use Decimal.js for precision
- VAT is set to 5% (UAE standard) - configurable per company
- Currency defaults to AED - configurable per company
- All timestamps are in UTC
- Database backups are essential for production

---

**Built for UAE Businesses** 🇦🇪
