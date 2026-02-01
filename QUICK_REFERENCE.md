# Quick Reference Guide

## 🎯 Essential Commands

```bash
# Development
npm run dev                    # Start dev server (http://localhost:3000)
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Database
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate         # Create & run migrations
npm run prisma:studio          # Open Prisma Studio (http://localhost:5555)
npm run prisma:seed            # Seed initial data

# Full Setup
npm install && npm run prisma:migrate && npm run prisma:seed && npm run dev
```

## 🔐 Default Login

```
Email: admin@albaraka.ae
Password: admin@123
Company ID: (auto-assigned from seed)
```

## 📍 Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/dashboard` | Main dashboard |
| `/sales` | Sales list |
| `/sales/pos` | Point of Sale |
| `/purchases` | Purchase orders |
| `/inventory` | Inventory management |
| `/accounts` | Chart of accounts |
| `/reports` | Reports hub |
| `/settings` | Company settings |

## 🏗️ Project Structure

```
lib/                     # Business logic
├── accounting.ts       # VAT, currency utilities
├── accounting-engine.ts # Double-entry accounting
└── inventory-engine.ts  # Stock management

app/                     # Pages & APIs
├── dashboard/          # Dashboard
├── sales/             # Sales module
├── purchases/         # Purchase module
├── inventory/         # Inventory module
├── accounts/          # Accounting module
├── reports/           # Reports module
├── settings/          # Settings module
└── api/              # API endpoints

components/           # Reusable components
├── navbar.tsx
├── stats-card.tsx
└── pos-bill.tsx

prisma/               # Database
├── schema.prisma     # All 45 tables
└── seed.js          # Sample data
```

## 💾 Database Schema Quick Ref

### Core Tables
- `users` - Employees
- `roles` - Admin, Accountant, Cashier
- `permissions` - Fine-grained access
- `company_settings` - VAT, TRN, currency

### Transaction Tables
- `sales` / `sale_items` - Invoices
- `purchases` / `purchase_items` - POs
- `quotations` - Quotes
- `payments` - Payment records

### Inventory Tables
- `products` - Product catalog
- `stock` - Stock levels
- `stock_movements` - Audit trail
- `warehouses` - Locations

### Accounting Tables
- `accounts` - Chart of accounts
- `journal_entries` - Transactions
- `journal_items` - Debit/credit pairs

### Master Data
- `customers` - Customer info
- `vendors` - Supplier info
- `categories` - Product categories
- `tax_rates` - VAT rates

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/login
Body: { email, password, companyId }
Returns: { token, user, permissions }
```

### Sales
```
GET /api/sales?companyId=X&customerId=Y&status=Z
POST /api/sales
Body: { customerId, items, discountPercent, taxInclusive, companyId, userId }
```

### Inventory
```
GET /api/inventory/stock?companyId=X&warehouseId=Y
```

### Reports
```
GET /api/reports/vat-summary?companyId=X&startDate=Y&endDate=Z
```

## 🧮 Key Calculations

### VAT (5% UAE Standard)
```typescript
// Tax Exclusive
Tax = Subtotal × 5 / 100
Total = Subtotal + Tax

// Tax Inclusive
Tax = Gross / 1.05 × 0.05
Subtotal = Gross - Tax
```

### VAT Summary
```
Output VAT = Sum of all sales VAT
Input VAT = Sum of all purchase VAT
VAT Payable = Output VAT - Input VAT
```

### Stock Management
```
On Sale: Stock -= Quantity
On Purchase: Stock += Quantity
Reorder Alert: If Stock <= Reorder Level
Critical: If Stock <= Reorder Level × 0.5
```

### Double Entry
```
Sales Transaction:
  Debit: Cash/Receivable
  Credit: Sales Revenue
  Credit: VAT Payable
(Always: Total Debit = Total Credit)
```

## 🎨 UI Components

### StatsCard
```typescript
<StatsCard
  title="Total Revenue"
  value="AED 125,000"
  icon="💰"
  color="green"
  trend={{ value: 12, isPositive: true }}
/>
```

### POSBill
```typescript
<POSBill
  items={cartItems}
  onCheckout={handleCheckout}
  discountPercent={5}
  taxInclusive={false}
/>
```

## 🔐 Security Checklist

- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ Password hashing (bcryptjs)
- ✅ API middleware protection
- ✅ Activity logging
- ✅ Environment variables isolated

## ⚡ Performance Tips

1. Use Decimal.js for all money calculations
2. Leverage React Query for data caching
3. Implement pagination for large datasets
4. Use database indexes on frequently queried columns
5. Cache static assets aggressively
6. Lazy load heavy components
7. Optimize images and PDFs

## 🐛 Troubleshooting

### "Cannot find module '@/lib/prisma'"
```
Solution: npx prisma generate
```

### "Database connection refused"
```
Solution: 
1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env.local
3. Ensure database exists
```

### "Port 3000 already in use"
```
Solution: npm run dev -- -p 3001
```

### "Migration conflicts"
```
Solution: npx prisma migrate resolve --rolled-back
```

## 📊 Reporting Engine

### Available Reports
1. **Profit & Loss** - Revenue minus expenses
2. **Balance Sheet** - Assets, liabilities, equity
3. **Trial Balance** - All accounts balanced
4. **VAT Summary** - Output - Input = Payable
5. **Sales Report** - Detailed transactions
6. **Inventory Report** - Stock valuation

### Report Generation
All reports query the database directly for real-time data:
```typescript
// Example: VAT Summary
GET /api/reports/vat-summary?companyId=X&startDate=2024-01-01&endDate=2024-01-31
Returns: { outputVAT, inputVAT, vatPayable }
```

## 🚀 Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Database backed up
- [ ] SSL certificate configured
- [ ] CORS properly set
- [ ] Security headers enabled
- [ ] Logging configured
- [ ] Monitoring setup
- [ ] Backups scheduled

## 📞 Support Info

### Files to Check First
1. `README.md` - Features overview
2. `SETUP.md` - Installation help
3. `ARCHITECTURE.md` - Design details
4. `PROJECT_STRUCTURE.md` - File organization
5. `ENV.md` - Configuration guide

### Common Issues Resolved In
- **Database**: SETUP.md, ENV.md
- **API**: Look at `/app/api/` examples
- **UI**: Check `/components/` and `/app/` pages
- **Logic**: See `/lib/accounting-engine.ts` and `/lib/inventory-engine.ts`

## 💡 Pro Tips

1. **Decimal.js is mandatory** for all currency calculations - floating point arithmetic causes rounding errors
2. **VAT is always 5%** in UAE - change in company settings if needed
3. **Multi-warehouse** - stock is tracked per warehouse, always specify warehouse ID
4. **Double-entry** - always balanced, never skip journal entry creation
5. **TRN is unique** - no two companies can have same Tax Registration Number
6. **Activity logging** - all actions are logged to `activity_logs` table
7. **Permissions** - always check role permissions before allowing actions

## 🎓 Learning Path

1. **Start**: Run the app and explore `/dashboard`
2. **Try POS**: Go to `/sales/pos` and create a test sale
3. **Check Inventory**: Visit `/inventory` to see stock levels
4. **View Accounting**: Go to `/accounts` to see chart of accounts
5. **Generate Reports**: Check `/reports` for financial statements
6. **Customize**: Modify `/app` pages for your needs
7. **Extend**: Add new features in `/lib` and connect via `/api`

## 🔄 Workflow Examples

### Complete POS Sale
1. Customer arrives
2. Go to `/sales/pos`
3. Add products to cart
4. Set discount if applicable
5. Click "Complete Sale"
6. System creates:
   - Sale record
   - Journal entries
   - Updates stock
   - Updates VAT

### Generate VAT Report
1. Go to `/reports`
2. Click "VAT Summary"
3. Select date range
4. System calculates:
   - Output VAT (sales)
   - Input VAT (purchases)
   - VAT Payable
   - Quarterly/monthly summary

---

**Everything you need is here!** 🎉

Start with `npm install` and you're ready to go.
