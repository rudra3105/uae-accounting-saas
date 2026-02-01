import { NavBar } from "@/components/navbar";

export const metadata = {
  title: "Purchases - UAE Accounting SaaS",
};

export default function PurchasesPage() {
  const purchases = [
    {
      id: "PO-001",
      vendorName: "Supplier A",
      date: "2024-01-27",
      amount: "AED 2,300",
      status: "Received",
      dueDate: "2024-02-27",
    },
    {
      id: "PO-002",
      vendorName: "Supplier B",
      date: "2024-01-25",
      amount: "AED 5,600",
      status: "Pending",
      dueDate: "2024-02-25",
    },
  ];

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
              <p className="text-gray-600 mt-2">Manage purchase orders and vendor transactions</p>
            </div>
            <a
              href="/purchases/new"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              + New Purchase Order
            </a>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border p-4">
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">AED 15,200</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-gray-600 text-sm">Paid</p>
              <p className="text-2xl font-bold text-green-600">AED 7,900</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <p className="text-gray-600 text-sm">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">AED 7,300</p>
            </div>
          </div>

          {/* Purchases Table */}
          <div className="bg-white rounded-lg border shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold">PO Number</th>
                  <th className="text-left py-4 px-6 font-semibold">Vendor</th>
                  <th className="text-left py-4 px-6 font-semibold">Date</th>
                  <th className="text-center py-4 px-6 font-semibold">Amount</th>
                  <th className="text-center py-4 px-6 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 font-semibold">Due Date</th>
                  <th className="text-center py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((po) => (
                  <tr key={po.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{po.id}</td>
                    <td className="py-4 px-6">{po.vendorName}</td>
                    <td className="py-4 px-6 text-gray-600">{po.date}</td>
                    <td className="py-4 px-6 text-center font-semibold">{po.amount}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        po.status === "Received" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">{po.dueDate}</td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">View</button>
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
