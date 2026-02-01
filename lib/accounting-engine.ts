import prisma from '@/lib/prisma';
import Decimal from 'decimal.js';

/**
 * Create journal entry for a sale with auto-generated entries
 * Debits: Accounts Receivable / Cash
 * Credits: Sales Revenue + VAT Payable
 */
export async function createSaleJournalEntry(
  saleId: string,
  sale: {
    invoiceNumber: string;
    invoiceDate: Date;
    totalAmount: Decimal;
    outputVat: Decimal;
    paidAmount: Decimal;
  },
  companyId: string,
  userId: string
) {
  const subtotal = sale.totalAmount.minus(sale.outputVat);

  // Find or create accounts (these should exist in the chart of accounts)
  const accounts = await prisma.account.findMany({
    where: {
      companyId,
      code: { in: ['1010', '2100', '4100'] } // Cash, VAT Payable, Sales
    }
  });

  const cashAccount = accounts.find(a => a.code === '1010');
  const vatPayableAccount = accounts.find(a => a.code === '2100');
  const salesAccount = accounts.find(a => a.code === '4100');

  if (!cashAccount || !vatPayableAccount || !salesAccount) {
    throw new Error('Required accounts not found in chart of accounts');
  }

  const journalEntry = await prisma.journalEntry.create({
    data: {
      referenceNumber: `JE-SALE-${sale.invoiceNumber}`,
      entryDate: sale.invoiceDate,
      description: `Sale Invoice ${sale.invoiceNumber}`,
      entryType: 'SALE',
      saleId,
      totalDebit: sale.paidAmount.toNumber(),
      totalCredit: sale.paidAmount.toNumber(),
      companyId,
      createdById: userId,
      items: {
        create: [
          {
            debitAccountId: cashAccount.id,
            debitAmount: sale.paidAmount,
            lineNumber: 1,
          },
          {
            creditAccountId: salesAccount.id,
            creditAmount: subtotal,
            lineNumber: 2,
          },
          {
            creditAccountId: vatPayableAccount.id,
            creditAmount: sale.outputVat,
            lineNumber: 3,
          },
        ],
      },
    },
    include: { items: true },
  });

  // Update account balances
  await prisma.account.update({
    where: { id: cashAccount.id },
    data: {
      currentBalance: {
        increment: sale.paidAmount.toNumber(),
      },
    },
  });

  await prisma.account.update({
    where: { id: salesAccount.id },
    data: {
      currentBalance: {
        decrement: subtotal.toNumber(),
      },
    },
  });

  await prisma.account.update({
    where: { id: vatPayableAccount.id },
    data: {
      currentBalance: {
        increment: sale.outputVat.toNumber(),
      },
    },
  });

  return journalEntry;
}

/**
 * Create journal entry for a purchase with auto-generated entries
 * Debits: Inventory / Expenses + VAT Recoverable
 * Credits: Accounts Payable / Cash
 */
export async function createPurchaseJournalEntry(
  purchaseId: string,
  purchase: {
    poNumber: string;
    poDate: Date;
    totalAmount: Decimal;
    inputVat: Decimal;
    paidAmount: Decimal;
  },
  companyId: string,
  userId: string
) {
  const subtotal = purchase.totalAmount.minus(purchase.inputVat);

  const accounts = await prisma.account.findMany({
    where: {
      companyId,
      code: { in: ['1020', '2200', '5100'] } // Inventory, VAT Recoverable, Purchases
    }
  });

  const inventoryAccount = accounts.find(a => a.code === '1020');
  const vatRecoverableAccount = accounts.find(a => a.code === '2200');
  const purchasesAccount = accounts.find(a => a.code === '5100');

  if (!inventoryAccount || !vatRecoverableAccount || !purchasesAccount) {
    throw new Error('Required accounts not found in chart of accounts');
  }

  const journalEntry = await prisma.journalEntry.create({
    data: {
      referenceNumber: `JE-PURCHASE-${purchase.poNumber}`,
      entryDate: purchase.poDate,
      description: `Purchase Order ${purchase.poNumber}`,
      entryType: 'PURCHASE',
      purchaseId,
      totalDebit: purchase.totalAmount.toNumber(),
      totalCredit: purchase.totalAmount.toNumber(),
      companyId,
      createdById: userId,
      items: {
        create: [
          {
            debitAccountId: inventoryAccount.id,
            debitAmount: subtotal,
            lineNumber: 1,
          },
          {
            debitAccountId: vatRecoverableAccount.id,
            debitAmount: purchase.inputVat,
            lineNumber: 2,
          },
          {
            creditAccountId: purchasesAccount.id,
            creditAmount: purchase.totalAmount,
            lineNumber: 3,
          },
        ],
      },
    },
    include: { items: true },
  });

  return journalEntry;
}

/**
 * Calculate VAT Summary (Output VAT - Input VAT = VAT Payable)
 */
export async function calculateVATSummary(
  companyId: string,
  startDate: Date,
  endDate: Date
) {
  const sales = await prisma.sale.aggregate({
    where: {
      companyId,
      invoiceDate: { gte: startDate, lte: endDate },
      status: { not: 'CANCELLED' }
    },
    _sum: { outputVat: true },
  });

  const purchases = await prisma.purchase.aggregate({
    where: {
      companyId,
      poDate: { gte: startDate, lte: endDate },
      status: { not: 'CANCELLED' }
    },
    _sum: { inputVat: true },
  });

  const outputVAT = sales._sum.outputVat || new Decimal(0);
  const inputVAT = purchases._sum.inputVat || new Decimal(0);
  const vatPayable = new Decimal(outputVAT).minus(inputVAT);

  return {
    outputVAT: new Decimal(outputVAT),
    inputVAT: new Decimal(inputVAT),
    vatPayable: vatPayable.isNegative() ? new Decimal(0) : vatPayable,
  };
}

/**
 * Generate Trial Balance Report
 */
export async function generateTrialBalance(
  companyId: string,
  asOfDate: Date
) {
  const accounts = await prisma.account.findMany({
    where: { companyId, isActive: true },
    include: {
      debitItems: {
        where: {
          journalEntry: {
            entryDate: { lte: asOfDate },
          },
        },
        select: { debitAmount: true },
      },
      creditItems: {
        where: {
          journalEntry: {
            entryDate: { lte: asOfDate },
          },
        },
        select: { creditAmount: true },
      },
    },
  });

  return accounts.map(account => {
    const totalDebit = account.debitItems.reduce(
      (sum, item) => sum.plus(item.debitAmount),
      new Decimal(0)
    );
    const totalCredit = account.creditItems.reduce(
      (sum, item) => sum.plus(item.creditAmount),
      new Decimal(0)
    );
    const balance = totalDebit.minus(totalCredit);

    return {
      code: account.code,
      name: account.name,
      type: account.type,
      debit: totalDebit,
      credit: totalCredit,
      balance: balance.isNegative() ? balance.times(-1) : balance,
      balanceSide: balance.isNegative() ? 'CR' : 'DR',
    };
  });
}

/**
 * Generate Profit & Loss Statement
 */
export async function generateIncomeStatement(
  companyId: string,
  startDate: Date,
  endDate: Date
) {
  const entries = await prisma.journalEntry.findMany({
    where: {
      companyId,
      entryDate: { gte: startDate, lte: endDate },
    },
    include: {
      items: {
        include: {
          debitAccount: true,
          creditAccount: true,
        },
      },
    },
  });

  // Group by account type and calculate totals
  const revenueAccounts = new Map<string, Decimal>();
  const expenseAccounts = new Map<string, Decimal>();

  entries.forEach(entry => {
    entry.items.forEach(item => {
      if (item.creditAccount?.type === 'REVENUE') {
        const current = revenueAccounts.get(item.creditAccount.id) || new Decimal(0);
        revenueAccounts.set(item.creditAccount.id, current.plus(item.creditAmount));
      }
      if (item.debitAccount?.type === 'EXPENSE') {
        const current = expenseAccounts.get(item.debitAccount.id) || new Decimal(0);
        expenseAccounts.set(item.debitAccount.id, current.plus(item.debitAmount));
      }
    });
  });

  const totalRevenue = Array.from(revenueAccounts.values()).reduce(
    (sum, val) => sum.plus(val),
    new Decimal(0)
  );
  const totalExpense = Array.from(expenseAccounts.values()).reduce(
    (sum, val) => sum.plus(val),
    new Decimal(0)
  );
  const netProfit = totalRevenue.minus(totalExpense);

  return {
    startDate,
    endDate,
    revenue: {
      accounts: Array.from(revenueAccounts.entries()),
      total: totalRevenue,
    },
    expenses: {
      accounts: Array.from(expenseAccounts.entries()),
      total: totalExpense,
    },
    netProfit,
  };
}
