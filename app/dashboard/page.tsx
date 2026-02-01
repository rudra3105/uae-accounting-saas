import { NavBar } from "@/components/navbar";
import { StatsCard } from "@/components/stats-card";
import Link from "next/link";

export const metadata = {
  title: "Dashboard - UAE Accounting SaaS",
  description: "Main dashboard for accounting and POS system",
};

export default function DashboardPage() {
  // Mock data - replace with actual data from API
  const stats = [
    {
      title: "Total Revenue",
      value: "AED 125,000",
      icon: "💰",
      color: "green" as const,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Total Expenses",
      value: "AED 45,000",
      icon: "📉",
      color: "red" as const,
      trend: { value: 5, isPositive: false },
    },
    {
      title: "VAT Payable",
      value: "AED 4,000",
      icon: "📋",
      color: "amber" as const,
    },
    {
      title: "Pending Invoices",
      value: "12",
      icon: "⏳",
      color: "blue" as const,
    },
  ];

  const recentTransactions = [
    { id: "INV-001", type: "Sale", amount: "AED 5,500", date: "2024-01-28", status: "Paid" },
    { id: "PO-001", type: "Purchase", amount: "AED 2,300", date: "2024-01-27", status: "Pending" },
    { id: "INV-002", type: "Sale", amount: "AED 3,200", date: "2024-01-27", status: "Unpaid" },
  ];

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's your business overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <StatsCard key={idx} {...stat} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border p-6 mb-8 shadow">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link
                href="/sales/pos"
                className="p-4 border rounded-lg text-center hover:bg-blue-50 transition"
              >
                <div className="text-3xl mb-2">🛒</div>
                <div className="font-medium text-sm">POS Sale</div>
              </Link>
              <Link
                href="/sales/new"
                className="p-4 border rounded-lg text-center hover:bg-blue-50 transition"
              >
                <div className="text-3xl mb-2">📝</div>
                <div className="font-medium text-sm">New Invoice</div>
              </Link>
              <Link
                href="/purchases/new"
                className="p-4 border rounded-lg text-center hover:bg-blue-50 transition"
              >
                <div className="text-3xl mb-2">📦</div>
                <div className="font-medium text-sm">New Purchase</div>
              </Link>
              <Link
                href="/inventory"
                className="p-4 border rounded-lg text-center hover:bg-blue-50 transition"
              >
                <div className="text-3xl mb-2">📊</div>
                <div className="font-medium text-sm">Inventory</div>
              </Link>
              <Link
                href="/reports"
                className="p-4 border rounded-lg text-center hover:bg-blue-50 transition"
              >
                <div className="text-3xl mb-2">📈</div>
                <div className="font-medium text-sm">Reports</div>
              </Link>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg border p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Reference</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{tx.id}</td>
                    <td className="py-3 px-4">{tx.type}</td>
                    <td className="py-3 px-4">{tx.amount}</td>
                    <td className="py-3 px-4 text-gray-600">{tx.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          tx.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : tx.status === "Pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
