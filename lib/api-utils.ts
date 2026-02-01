import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'default-secret');

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const auth = await verifyAuth(request);
    
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Add auth to request (store in headers for access in handler)
    const requestWithAuth = request.clone();
    return handler(requestWithAuth);
  };
}

export async function validatePermission(
  userId: string,
  module: string,
  action: string
): Promise<boolean> {
  // This will be connected to the database in actual implementation
  // For now, returning true - implement based on your database queries
  return true;
}

export function withPermission(
  module: string,
  action: string,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const auth = await verifyAuth(request);
    
    if (!auth || !auth.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const hasPermission = await validatePermission(
      auth.userId as string,
      module,
      action
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return handler(request);
  };
}

// Response helpers
export const successResponse = <T>(data: T, message?: string, status = 200) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
};

export const errorResponse = (message: string, status = 400, errors?: any) => {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  );
};

// Validation helpers
export const validateRequired = (value: any, fieldName: string): { valid: boolean; error?: string } => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
};

export const validateNumber = (value: any, fieldName: string, min?: number, max?: number): { valid: boolean; error?: string } => {
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }
  if (min !== undefined && num < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` };
  }
  if (max !== undefined && num > max) {
    return { valid: false, error: `${fieldName} must be at most ${max}` };
  }
  return { valid: true };
};
