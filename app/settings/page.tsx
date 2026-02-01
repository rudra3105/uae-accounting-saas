import { NavBar } from "@/components/navbar";

export const metadata = {
  title: "Settings - UAE Accounting SaaS",
};

export default function SettingsPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

          {/* Company Settings */}
          <div className="bg-white rounded-lg border shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Al Baraka Trading Company"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Registration Number (TRN)
                  </label>
                  <input
                    type="text"
                    defaultValue="123456789012345"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="info@company.ae"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+971-4-123-4567"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    defaultValue="Dubai, UAE"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </form>
          </div>

          {/* Tax Settings */}
          <div className="bg-white rounded-lg border shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tax Configuration</h2>
            <form className="space-y-4">
              <div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm font-medium">Enable VAT</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default VAT Rate (%)
                </label>
                <input
                  type="number"
                  defaultValue="5"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </form>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg border shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Users & Roles</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Admin User</td>
                  <td className="py-3 px-4">admin@company.ae</td>
                  <td className="py-3 px-4">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      Admin
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Accountant</td>
                  <td className="py-3 px-4">accountant@company.ae</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      Accountant
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              + Add User
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
