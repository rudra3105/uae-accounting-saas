import { NavBar } from "@/components/navbar";

export const metadata = {
  title: "Reports - UAE Accounting SaaS",
};

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      title: "Profit & Loss Statement",
      description: "Revenue vs Expenses for selected period",
      icon: "📊",
      href: "/reports/profit-loss",
    },
    {
      id: 2,
      title: "Balance Sheet",
      description: "Assets, Liabilities & Equity snapshot",
      icon: "⚖️",
      href: "/reports/balance-sheet",
    },
    {
      id: 3,
      title: "Trial Balance",
      description: "Verify all accounts are balanced",
      icon: "✓",
      href: "/reports/trial-balance",
    },
    {
      id: 4,
      title: "VAT Summary",
      description: "Output VAT, Input VAT & VAT Payable",
      icon: "💰",
      href: "/reports/vat-summary",
    },
    {
      id: 5,
      title: "Sales Report",
      description: "Detailed sales transactions & analysis",
      icon: "🛒",
      href: "/reports/sales",
    },
    {
      id: 6,
      title: "Inventory Report",
      description: "Stock levels and movements",
      icon: "📦",
      href: "/reports/inventory",
    },
  ];

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-2">Generate and view business reports</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <a
                key={report.id}
                href={report.href}
                className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-3">{report.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                <div className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Report →
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
