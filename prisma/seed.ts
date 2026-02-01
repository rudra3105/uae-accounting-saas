import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      description: 'Administrator role',
      permissions: {
        create: [
          { name: 'Create Sales', module: 'sales', action: 'create' },
          { name: 'View Sales', module: 'sales', action: 'read' },
          { name: 'Create Purchases', module: 'purchases', action: 'create' },
          { name: 'View Purchases', module: 'purchases', action: 'read' },
          { name: 'Manage Inventory', module: 'inventory', action: 'create' },
          { name: 'View Accounting', module: 'accounting', action: 'read' },
        ],
      },
    },
  });

  // Create company
  const company = await prisma.company.create({
    data: {
      name: 'Al Baraka Trading Company',
      trn: 'TRN123456789',
      emirate: 'Dubai',
      address: '123 Business Street',
      city: 'Dubai',
      phone: '+971-4-123-4567',
      email: 'info@albaraka.ae',
      currency: 'AED',
      vatRate: 5.0,
      vatEnabled: true,
    },
  });

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@albaraka.ae',
      password: 'admin@123', // Demo password only
      firstName: 'Admin',
      lastName: 'User',
      active: true,
      company: { connect: { id: company.id } },
      role: { connect: { id: adminRole.id } },
    },
  });

  // Create categories
  const cat1 = await prisma.category.create({
    data: { name: 'Electronics' },
  });

  const cat2 = await prisma.category.create({
    data: { name: 'Furniture' },
  });

  // Create products
  const prod1 = await prisma.product.create({
    data: {
      name: 'Laptop',
      description: 'Professional Laptop',
      sku: 'LAP-001',
      barcode: '1234567890',
      category: { connect: { id: cat1.id } },
      price: 3500,
      costPrice: 2500,
      reorderLevel: 5,
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      name: 'Office Desk',
      description: 'Wooden Office Desk',
      sku: 'DESK-001',
      barcode: '1234567891',
      category: { connect: { id: cat2.id } },
      price: 800,
      costPrice: 500,
      reorderLevel: 3,
    },
  });

  // Create warehouse
  const warehouse = await prisma.warehouse.create({
    data: {
      name: 'Main Warehouse',
      location: 'Dubai',
    },
  });

  // Create stock
  await prisma.stock.create({
    data: {
      product: { connect: { id: prod1.id } },
      warehouse: { connect: { id: warehouse.id } },
      quantity: 50,
    },
  });

  await prisma.stock.create({
    data: {
      product: { connect: { id: prod2.id } },
      warehouse: { connect: { id: warehouse.id } },
      quantity: 20,
    },
  });

  // Create chart of accounts
  await prisma.account.create({
    data: {
      code: '1010',
      name: 'Cash',
      type: 'Asset',
      debit: 100000,
      balance: 100000,
    },
  });

  await prisma.account.create({
    data: {
      code: '1020',
      name: 'Inventory',
      type: 'Asset',
      debit: 50000,
      balance: 50000,
    },
  });

  await prisma.account.create({
    data: {
      code: '4100',
      name: 'Sales Revenue',
      type: 'Revenue',
    },
  });

  await prisma.account.create({
    data: {
      code: '2100',
      name: 'VAT Payable',
      type: 'Liability',
    },
  });

  // Create customers
  await prisma.customer.create({
    data: {
      name: 'ABC Corporation',
      email: 'contact@abc.ae',
      phone: '+971-4-111-2222',
      address: '456 Business Avenue',
      city: 'Abu Dhabi',
    },
  });

  await prisma.customer.create({
    data: {
      name: 'XYZ Trading',
      email: 'info@xyz.ae',
      phone: '+971-4-333-4444',
      address: '789 Commercial Street',
      city: 'Dubai',
    },
  });

  // Create vendors
  await prisma.vendor.create({
    data: {
      name: 'Global Supplies',
      email: 'sales@global.ae',
      phone: '+971-4-555-6666',
      address: '111 Industrial Zone',
      city: 'Dubai',
    },
  });

  // Create payment modes
  await prisma.paymentMode.create({
    data: {
      name: 'Cash',
      active: true,
    },
  });

  await prisma.paymentMode.create({
    data: {
      name: 'Credit Card',
      active: true,
    },
  });

  await prisma.paymentMode.create({
    data: {
      name: 'Bank Transfer',
      active: true,
    },
  });

  // Create tax rates
  await prisma.taxRate.create({
    data: {
      name: 'Standard VAT',
      rate: 5.0,
    },
  });

  // Create invoice series
  await prisma.invoiceSeries.create({
    data: {
      prefix: 'SI',
      nextNumber: 1001,
    },
  });

  await prisma.invoiceSeries.create({
    data: {
      prefix: 'PO',
      nextNumber: 1001,
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('Demo credentials:');
  console.log('Email: admin@albaraka.ae');
  console.log('Password: admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
