import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { calculateVATSummary } from '@/lib/accounting-engine';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!companyId || !startDate || !endDate) {
      return errorResponse('Missing required parameters');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const vatSummary = await calculateVATSummary(companyId, start, end);

    return successResponse(vatSummary);
  } catch (error) {
    console.error('VAT summary error:', error);
    return errorResponse('Internal server error', 500);
  }
}
