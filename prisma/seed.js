const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create company
  const company = await prisma.company.create({
    data: {
      name: 'Al Baraka Trading Company',
      trn: '123456789012345',
      email: 'info@albaraka.ae',
      phone: '+971-4-123-4567',
      address: 'Dubai Marina, Dubai',
      city: 'Dubai',
      emirate: 'Dubai',
      country: 'UAE',
      currency: 'AED',
      vatEnabled: true,
      vatRate: 5.0,
      fiscalYearStart: 1,
    },
  });

  console.log(`✓ Company created: ${company.name}`);

  // Create roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      description: 'Full system access',
      companyId: company.id,
    },
  });

  const accountantRole = await prisma.role.create({
    data: {
      name: 'Accountant',
      description: 'Accounting and reporting access',
      companyId: company.id,
    },
  });

  const cashierRole = await prisma.role.create({
    data: {
      name: 'Cashier',
      description: 'POS and basic operations',
      companyId: company.id,
    },
  });

  console.log('✓ Roles created');

  // Create admin user
  const hashedPassword = await bcryptjs.hash('admin@123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@albaraka.ae',
      name: 'Administrator',
      password: hashedPassword,
      phone: '+971-50-123-4567',
      isActive: true,
      companyId: company.id,
      roleId: adminRole.id,
    },
  });

  console.log(`✓ Admin user created: ${adminUser.email}`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        description: 'Electronic items and gadgets',
        companyId: company.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Clothing',
        description: 'Apparel and fashion items',
        companyId: company.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Food & Beverages',
        description: 'Food and drink products',
        companyId: company.id,
      },
    }),
  ]);

  console.log('✓ Categories created');

  // Create warehouse
  const warehouse = await prisma.warehouse.create({
    data: {
      name: 'Main Warehouse',
      location: 'Dubai',
      manager: 'Mohammed Ahmed',
      phone: '+971-50-999-8888',
      isActive: true,
      companyId: company.id,
    },
  });

  console.log(`✓ Warehouse created: ${warehouse.name}`);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        sku: 'SKU-001',
        name: 'Laptop Pro 15"',
        description: 'High-performance laptop',
        categoryId: categories[0].id,
        unit: 'PCS',
        costPrice: '1500.00',
        sellingPrice: '2000.00',
        reorderLevel: 5,
        barcode: 'BAR-001',
        isActive: true,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SKU-002',
        name: 'T-Shirt',
        description: 'Cotton t-shirt',
        categoryId: categories[1].id,
        unit: 'PCS',
        costPrice: '15.00',
        sellingPrice: '35.00',
        reorderLevel: 50,
        barcode: 'BAR-002',
        isActive: true,
        companyId: company.id,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SKU-003',
        name: 'Coffee Beans 1kg',
        description: 'Premium coffee beans',
        categoryId: categories[2].id,
        unit: 'KG',
        costPrice: '20.00',
        sellingPrice: '45.00',
        reorderLevel: 20,
        barcode: 'BAR-003',
        isActive: true,
        companyId: company.id,
      },
    }),
  ]);

  console.log('✓ Products created');

  // Create stock for each product
  for (const product of products) {
    await prisma.stock.create({
      data: {
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: 100,
      },
    });
  }

  console.log('✓ Stock initialized');

  // Create chart of accounts
  const accounts = await Promise.all([
    // Assets
    prisma.account.create({
      data: {
        code: '1010',
        name: 'Cash in Hand',
        type: 'ASSET',
        subType: 'Bank',
        openingBalance: 50000,
        currentBalance: 50000,
        isActive: true,
        companyId: company.id,
      },
    }),
    prisma.account.create({
      data: {
        code: '1020',
        name: 'Inventory',
        type: 'ASSET',
        subType: 'Inventory',
        openingBalance: 100000,
        currentBalance: 100000,
        isActive: true,
        companyId: company.id,
      },
    }),
    // Liabilities
    prisma.account.create({
      data: {
        code: '2100',
        name: 'VAT Payable',
        type: 'LIABILITY',
        subType: 'Tax',
        openingBalance: 0,
        currentBalance: 0,
        isActive: true,
        companyId: company.id,
      },
    }),
    prisma.account.create({
      data: {
        code: '2200',
        name: 'VAT Recoverable',
        type: 'ASSET',
        subType: 'Tax',
        openingBalance: 0,
        currentBalance: 0,
        isActive: true,
        companyId: company.id,
      },
    }),
    // Revenue
    prisma.account.create({
      data: {
        code: '4100',
        name: 'Sales Revenue',
        type: 'REVENUE',
        subType: 'Sales',
        openingBalance: 0,
        currentBalance: 0,
        isActive: true,
        companyId: company.id,
      },
    }),
    // Expenses
    prisma.account.create({
      data: {
        code: '5100',
        name: 'Cost of Goods Sold',
        type: 'EXPENSE',
        subType: 'COGS',
        openingBalance: 0,
        currentBalance: 0,
        isActive: true,
        companyId: company.id,
      },
    }),
  ]);

  console.log('✓ Chart of accounts created');

  // Create financial year
  const currentYear = new Date().getFullYear();
  await prisma.financialYear.create({
    data: {
      year: currentYear,
      startDate: new Date(`${currentYear}-01-01`),
      endDate: new Date(`${currentYear}-12-31`),
      isClosed: false,
      companyId: company.id,
    },
  });

  console.log('✓ Financial year created');

  // Create invoice series
  await Promise.all([
    prisma.invoiceSeries.create({
      data: {
        name: 'Sales Invoice 2024',
        prefix: 'SI',
        nextNumber: 1,
        companyId: company.id,
      },
    }),
    prisma.invoiceSeries.create({
      data: {
        name: 'Purchase Order 2024',
        prefix: 'PO',
        nextNumber: 1,
        companyId: company.id,
      },
    }),
  ]);

  console.log('✓ Invoice series created');

  // Create tax rates
  await prisma.taxRate.create({
    data: {
      name: 'Standard VAT',
      rate: 5,
      isDefault: true,
      isActive: true,
      companyId: company.id,
    },
  });

  console.log('✓ Tax rates created');

  // Create payment modes
  await Promise.all([
    prisma.paymentMode.create({
      data: {
        name: 'Cash',
        code: 'CASH',
        companyId: company.id,
      },
    }),
    prisma.paymentMode.create({
      data: {
        name: 'Credit Card',
        code: 'CARD',
        companyId: company.id,
      },
    }),
    prisma.paymentMode.create({
      data: {
        name: 'Bank Transfer',
        code: 'BANK',
        companyId: company.id,
      },
    }),
  ]);

  console.log('✓ Payment modes created');

  // Create sample customer
  await prisma.customer.create({
    data: {
      name: 'Sample Customer LLC',
      type: 'CORPORATE',
      email: 'customer@example.com',
      phone: '+971-50-123-4567',
      crNumber: 'CR-123456',
      trn: '987654321098765',
      address: 'Abu Dhabi',
      city: 'Abu Dhabi',
      emirate: 'Abu Dhabi',
      contactPerson: 'Ali Mohammed',
      creditLimit: 50000,
      isActive: true,
      companyId: company.id,
    },
  });

  console.log('✓ Sample customer created');

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
