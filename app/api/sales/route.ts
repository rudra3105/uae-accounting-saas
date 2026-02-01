import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { createSaleJournalEntry } from '@/lib/accounting-engine';
import { reduceStockOnSale } from '@/lib/inventory-engine';
import Decimal from 'decimal.js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      warehouseId,
      items,
      discountPercent = 0,
      taxInclusive = false,
      companyId,
      userId,
      invoiceSeries = 'SI',
    } = body;

    if (!customerId || !items || items.length === 0) {
      return errorResponse('Missing required fields');
    }

    // Get company settings for VAT rate
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return errorResponse('Company not found');
    }

    // Get invoice series
    const series = await prisma.invoiceSeries.findFirst({
      where: { companyId, prefix: invoiceSeries },
    });

    if (!series) {
      return errorResponse('Invoice series not found');
    }

    // Calculate totals
    let subtotal = new Decimal(0);
    const processedItems: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return errorResponse(`Product ${item.productId} not found`);
      }

      const quantity = new Decimal(item.quantity);
      const unitPrice = new Decimal(product.sellingPrice);
      const lineTotal = quantity.times(unitPrice);
      const taxAmount = lineTotal.times(company.vatRate).dividedBy(100);

      subtotal = subtotal.plus(lineTotal);
      processedItems.push({
        productId: item.productId,
        quantity: quantity.toNumber(),
        unitPrice: unitPrice.toNumber(),
        taxRate: company.vatRate,
        taxAmount: taxAmount.toNumber(),
        lineTotal: lineTotal.toNumber(),
      });
    }

    // Apply discount
    const discountAmount = subtotal.times(discountPercent).dividedBy(100);
    const subtotalAfterDiscount = subtotal.minus(discountAmount);

    // Calculate VAT
    const outputVat = subtotalAfterDiscount.times(company.vatRate).dividedBy(100);
    const totalAmount = taxInclusive
      ? subtotalAfterDiscount
      : subtotalAfterDiscount.plus(outputVat);

    // Create sale
    const invoiceNumber = `${series.prefix}-${new Date().getFullYear()}-${String(series.nextNumber).padStart(6, '0')}`;

    const sale = await prisma.sale.create({
      data: {
        invoiceNumber,
        invoiceDate: new Date(),
        customerId,
        subtotal: subtotal.toNumber(),
        discountAmount: discountAmount.toNumber(),
        discountPercent,
        taxInclusive,
        outputVat: outputVat.toNumber(),
        totalAmount: totalAmount.toNumber(),
        status: 'FINALIZED',
        paymentStatus: 'UNPAID',
        companyId,
        createdBy: userId,
        saleItems: {
          create: processedItems,
        },
      },
      include: { saleItems: true },
    });

    // Create journal entry
    if (company.vatEnabled) {
      await createSaleJournalEntry(
        sale.id,
        {
          invoiceNumber: sale.invoiceNumber,
          invoiceDate: sale.invoiceDate,
          totalAmount: new Decimal(sale.totalAmount),
          outputVat: new Decimal(sale.outputVat),
          paidAmount: new Decimal(0),
        },
        companyId,
        userId
      );
    }

    // Reduce stock
    for (const item of processedItems) {
      await reduceStockOnSale(
        sale.id,
        warehouseId,
        item.productId,
        item.quantity
      );
    }

    // Update invoice series
    await prisma.invoiceSeries.update({
      where: { id: series.id },
      data: { nextNumber: { increment: 1 } },
    });

    return successResponse(sale, 'Sale created successfully', 201);
  } catch (error) {
    console.error('Sale creation error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');

    if (!companyId) {
      return errorResponse('companyId is required');
    }

    const sales = await prisma.sale.findMany({
      where: {
        companyId,
        ...(customerId && { customerId }),
        ...(status && { status }),
      },
      include: {
        customer: true,
        saleItems: { include: { product: true } },
      },
      orderBy: { invoiceDate: 'desc' },
    });

    return successResponse(sales);
  } catch (error) {
    console.error('Sale fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}
