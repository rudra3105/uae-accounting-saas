"use client";

import React, { useState } from "react";
import { NavBar } from "@/components/navbar";
import { POSBill } from "@/components/pos-bill";
import { formatCurrency } from "@/lib/accounting";

// Mock products - replace with API call
const MOCK_PRODUCTS = [
  { id: "1", name: "Product A", price: 100, category: "Electronics" },
  { id: "2", name: "Product B", price: 250, category: "Clothing" },
  { id: "3", name: "Product C", price: 50, category: "Food" },
  { id: "4", name: "Product D", price: 150, category: "Electronics" },
  { id: "5", name: "Product E", price: 80, category: "Clothing" },
  { id: "6", name: "Product F", price: 30, category: "Food" },
];

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [taxInclusive, setTaxInclusive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: (typeof MOCK_PRODUCTS)[0]) => {
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          taxRate: 5,
        },
      ]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleCheckout = async (billData: any) => {
    console.log("Checkout data:", {
      customerName,
      ...billData,
    });
    
    // Call API to create sale
    alert("Sale completed successfully!");
    setCart([]);
    setCustomerName("");
    setDiscountPercent(0);
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Point of Sale</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search & Customer */}
              <div className="bg-white rounded-lg border p-6 shadow space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Products
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or category"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-white border rounded-lg p-4 hover:shadow-lg transition text-left"
                  >
                    <div className="text-3xl mb-2">📦</div>
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <p className="text-gray-600 text-xs mb-3">{product.category}</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(product.price)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Cart & Bill Section */}
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="bg-white rounded-lg border p-6 shadow">
                <h3 className="text-lg font-semibold mb-4">Cart Items ({cart.length})</h3>
                
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Cart is empty</p>
                ) : (
                  <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.productId} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">{item.productName}</p>
                            <p className="text-gray-600 text-xs">
                              {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="bg-gray-200 px-2 py-1 rounded text-xs"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.productId, parseInt(e.target.value) || 0)
                            }
                            className="w-12 text-center border rounded px-2 py-1 text-xs"
                          />
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="bg-gray-200 px-2 py-1 rounded text-xs"
                          >
                            +
                          </button>
                          <span className="ml-auto font-semibold text-sm">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={discountPercent}
                        onChange={(e) =>
                          setDiscountPercent(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))
                        }
                        className="w-full px-4 py-2 border rounded-lg text-sm"
                      />
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={taxInclusive}
                        onChange={(e) => setTaxInclusive(e.target.checked)}
                      />
                      <span className="text-sm">Tax Inclusive</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Bill Summary */}
              {cart.length > 0 && (
                <POSBill
                  items={cart}
                  onCheckout={handleCheckout}
                  discountPercent={discountPercent}
                  taxInclusive={taxInclusive}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
