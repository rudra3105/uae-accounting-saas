"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/accounting";

interface POSItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

interface POSBillProps {
  items: POSItem[];
  onCheckout: (data: any) => void;
  discountPercent?: number;
  taxInclusive?: boolean;
}

export function POSBill({
  items,
  onCheckout,
  discountPercent = 0,
  taxInclusive = false,
}: POSBillProps) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = (subtotalAfterDiscount * 5) / 100; // UAE VAT = 5%
  const total = taxInclusive ? subtotalAfterDiscount : subtotalAfterDiscount + tax;

  return (
    <div className="bg-white border rounded-lg p-6 shadow">
      <h3 className="text-lg font-semibold mb-4">Bill Summary</h3>
      
      <div className="space-y-3 border-b pb-4 mb-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-gray-600">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
            </div>
            <p className="font-medium">{formatCurrency(item.quantity * item.unitPrice)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discountPercent > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Discount ({discountPercent}%):</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>VAT (5%):</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-blue-600">{formatCurrency(total)}</span>
        </div>
      </div>

      <button
        onClick={() =>
          onCheckout({
            items,
            subtotal,
            discountAmount,
            discountPercent,
            tax,
            total,
          })
        }
        className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700"
      >
        Complete Sale
      </button>
    </div>
  );
}
