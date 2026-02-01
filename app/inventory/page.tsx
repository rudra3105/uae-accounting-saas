import { NavBar } from "@/components/navbar";

export const metadata = {
  title: "Inventory Management - UAE Accounting SaaS",
};

export default function InventoryPage() {
  const inventoryItems = [
    { id: 1, sku: "SKU-001", name: "Product A", category: "Electronics", quantity: 45, reorderLevel: 20, status: "OK" },
    { id: 2, sku: "SKU-002", name: "Product B", category: "Clothing", quantity: 12, reorderLevel: 20, status: "WARNING" },
    { id: 3, sku: "SKU-003", name: "Product C", category: "Food", quantity: 150, reorderLevel: 50, status: "OK" },
    { id: 4, sku: "SKU-004", name: "Product D", category: "Electronics", quantity: 5, reorderLevel: 20, status: "CRITICAL" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OK":
        return "bg-green-100 text-green-700";
      case "WARNING":
        return "bg-amber-100 text-amber-700";
      case "CRITICAL":
        return "bg-red-100 text-red-700";
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
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-gray-600 mt-2">Manage warehouse stock and inventory levels</p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              + Add Product
            </button>
          </div>

          <div className="bg-white rounded-lg border shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold">SKU</th>
                  <th className="text-left py-4 px-6 font-semibold">Product Name</th>
                  <th className="text-left py-4 px-6 font-semibold">Category</th>
                  <th className="text-center py-4 px-6 font-semibold">Quantity</th>
                  <th className="text-center py-4 px-6 font-semibold">Reorder Level</th>
                  <th className="text-center py-4 px-6 font-semibold">Status</th>
                  <th className="text-center py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{item.sku}</td>
                    <td className="py-4 px-6">{item.name}</td>
                    <td className="py-4 px-6 text-gray-600">{item.category}</td>
                    <td className="py-4 px-6 text-center font-semibold">{item.quantity}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{item.reorderLevel}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">Edit</button>
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
