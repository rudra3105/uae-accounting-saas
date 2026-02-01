import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');
    const warehouseId = searchParams.get('warehouseId');

    if (!companyId) {
      return errorResponse('companyId is required');
    }

    const stocks = await prisma.stock.findMany({
      where: {
        warehouse: { companyId },
        ...(warehouseId && { warehouseId }),
      },
      include: {
        product: { include: { category: true } },
        warehouse: true,
      },
    });

    return successResponse(stocks);
  } catch (error) {
    console.error('Stock fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}
