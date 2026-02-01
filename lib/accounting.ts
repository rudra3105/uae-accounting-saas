import Decimal from 'decimal.js';

// VAT Calculation (UAE = 5%)
export const VAT_RATE = 5;

export const calculateVAT = (amount: number | Decimal, rate: number = VAT_RATE): Decimal => {
  const decAmount = new Decimal(amount);
  return decAmount.mul(rate).div(100);
};

export const calculateTotalWithVAT = (subtotal: number | Decimal, rate: number = VAT_RATE): Decimal => {
  const decAmount = new Decimal(subtotal);
  const vat = calculateVAT(decAmount, rate);
  return decAmount.plus(vat);
};

export const calculateTotalWithoutVAT = (total: number | Decimal, rate: number = VAT_RATE): Decimal => {
  const decAmount = new Decimal(total);
  return decAmount.div(new Decimal(1).plus(new Decimal(rate).div(100)));
};

export const formatCurrency = (amount: number | Decimal, currency: string = 'AED'): string => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount.toString());
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatCurrencyNumeric = (amount: number | Decimal): number => {
  return typeof amount === 'number' ? amount : parseFloat(amount.toString());
};

// Double Entry Accounting
export interface JournalEntryData {
  referenceNumber: string;
  entryDate: Date;
  description: string;
  items: {
    debitAccountCode?: string;
    creditAccountCode?: string;
    amount: Decimal;
  }[];
}

export const validateJournalEntry = (entry: JournalEntryData): { valid: boolean; error?: string } => {
  const totalDebit = entry.items.reduce((sum, item) => {
    if (item.debitAccountCode) {
      return sum.plus(item.amount);
    }
    return sum;
  }, new Decimal(0));

  const totalCredit = entry.items.reduce((sum, item) => {
    if (item.creditAccountCode) {
      return sum.plus(item.amount);
    }
    return sum;
  }, new Decimal(0));

  if (!totalDebit.equals(totalCredit)) {
    return { valid: false, error: 'Debit and Credit must balance' };
  }

  return { valid: true };
};

// Invoice Generation
export const generateInvoiceNumber = (prefix: string, nextNumber: number): string => {
  const year = new Date().getFullYear();
  const paddedNumber = String(nextNumber).padStart(6, '0');
  return `${prefix}-${year}-${paddedNumber}`;
};

// Stock Management
export const calculateReorderStatus = (quantity: number, reorderLevel: number): 'OK' | 'WARNING' | 'CRITICAL' => {
  if (quantity <= reorderLevel * 0.5) return 'CRITICAL';
  if (quantity <= reorderLevel) return 'WARNING';
  return 'OK';
};
