import { NavBar } from "@/components/navbar";

export const metadata = {
  title: "Sales - UAE Accounting SaaS",
};

export default function SalesPage() {
  const sales = [
    {
      id: "INV-001",
      customerName: "Sample Customer",
      date: "2024-01-28",
      amount: "AED 5,500",
      status: "Paid",
      dueDate: "2024-02-28",
    },
    {
      id: "INV-002",
      customerName: "ABC Company",
      date: "2024-01-27",
      amount: "AED 3,200",
      status: "Unpaid",
      dueDate: "2024-02-26",
    },
    {
      id: "INV-003",
      customerName: "XYZ Trading",
      date: "2024-01-26",
      amount: "AED 8,750",
      status: "Partial",
      dueDate: "2024-02-25",
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Unpaid":
        return "bg-red-100 text-red-700";
      case "Partial":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
              <p className="text-gray-600 mt-2">Manage invoices and sales transactions</p>
            </div>
            <div className="flex gap-3">
              <a
                href="/sales/pos"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                🛒 POS Sale
              </a>
              <a
                href="/sales/new"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                + New Invoice
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-gray-600 text-sm">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">AED 25,450</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-gray-600 text-sm">Paid</p>
              <p className="text-2xl font-bold text-green-600">AED 15,200</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-gray-600 text-sm">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">AED 10,250</p>
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-white rounded-lg border shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold">Invoice</th>
                  <th className="text-left py-4 px-6 font-semibold">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold">Date</th>
                  <th className="text-center py-4 px-6 font-semibold">Amount</th>
                  <th className="text-center py-4 px-6 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 font-semibold">Due Date</th>
                  <th className="text-center py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{sale.id}</td>
                    <td className="py-4 px-6">{sale.customerName}</td>
                    <td className="py-4 px-6 text-gray-600">{sale.date}</td>
                    <td className="py-4 px-6 text-center font-semibold">{sale.amount}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(sale.status)}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">{sale.dueDate}</td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">View</button>
                      <button className="text-green-600 hover:text-green-700 text-sm mr-3">Print</button>
                      <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
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
