import prisma from '@/lib/prisma';

/**
 * Reduce stock on sale
 */
export async function reduceStockOnSale(
  saleId: string,
  warehouseId: string,
  productId: string,
  quantity: number
) {
  // Update stock
  const stock = await prisma.stock.update({
    where: {
      productId_warehouseId: {
        productId,
        warehouseId,
      },
    },
    data: {
      quantity: {
        decrement: quantity,
      },
    },
  });

  // Log stock movement
  await prisma.stockMovement.create({
    data: {
      productId,
      warehouseId,
      type: 'OUT',
      quantity: -quantity,
      reference: saleId,
    },
  });

  return stock;
}

/**
 * Increase stock on purchase
 */
export async function increaseStockOnPurchase(
  purchaseId: string,
  warehouseId: string,
  productId: string,
  quantity: number
) {
  const stock = await prisma.stock.upsert({
    where: {
      productId_warehouseId: {
        productId,
        warehouseId,
      },
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      productId,
      warehouseId,
      quantity,
    },
  });

  // Log stock movement
  await prisma.stockMovement.create({
    data: {
      productId,
      warehouseId,
      type: 'IN',
      quantity,
      reference: purchaseId,
    },
  });

  return stock;
}

/**
 * Adjust stock manually
 */
export async function adjustStock(
  warehouseId: string,
  productId: string,
  quantity: number,
  reason: string
) {
  const stock = await prisma.stock.update({
    where: {
      productId_warehouseId: {
        productId,
        warehouseId,
      },
    },
    data: {
      quantity: {
        increment: quantity,
      },
    },
  });

  await prisma.stockMovement.create({
    data: {
      productId,
      warehouseId,
      type: 'ADJUSTMENT',
      quantity,
      notes: reason,
    },
  });

  return stock;
}

/**
 * Get stock levels by warehouse
 */
export async function getStockByProduct(productId: string) {
  const stocks = await prisma.stock.findMany({
    where: { productId },
    include: {
      warehouse: true,
      product: true,
    },
  });

  return stocks;
}

/**
 * Get low stock items
 */
export async function getLowStockItems(companyId: string) {
  const products = await prisma.product.findMany({
    where: { companyId, isActive: true },
    include: {
      stocks: {
        include: { warehouse: true },
      },
    },
  });

  return products
    .map(product => {
      const totalStock = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
      return {
        product,
        totalStock,
        isLow: totalStock <= product.reorderLevel,
        status: totalStock <= product.reorderLevel * 0.5 ? 'CRITICAL' : totalStock <= product.reorderLevel ? 'WARNING' : 'OK',
      };
    })
    .filter(item => item.isLow);
}

/**
 * Get stock movement history
 */
export async function getStockMovementHistory(
  productId: string,
  startDate?: Date,
  endDate?: Date
) {
  const movements = await prisma.stockMovement.findMany({
    where: {
      productId,
      ...(startDate && endDate && {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      }),
    },
    include: {
      warehouse: true,
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return movements;
}

/**
 * Calculate available stock across all warehouses
 */
export async function getAvailableStock(productId: string) {
  const stocks = await prisma.stock.aggregate({
    where: { productId },
    _sum: { quantity: true },
  });

  return stocks._sum.quantity || 0;
}

/**
 * Inventory Report - Stock valuation
 */
export async function getInventoryReport(companyId: string) {
  const products = await prisma.product.findMany({
    where: { companyId, isActive: true },
    include: {
      stocks: true,
      category: true,
    },
  });

  return products.map(product => {
    const totalQuantity = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
    const stockValue = new Decimal(totalQuantity).times(product.costPrice);

    return {
      product,
      totalQuantity,
      stockValue,
      reorderStatus: totalQuantity <= product.reorderLevel ? 'REORDER' : 'OK',
    };
  });
}
