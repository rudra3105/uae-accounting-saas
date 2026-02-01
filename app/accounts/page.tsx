import { NavBar } from "@/components/navbar";

export const metadata = {
  title: "Accounting - UAE Accounting SaaS",
};

export default function AccountsPage() {
  const accounts = [
    {
      code: "1010",
      name: "Cash in Hand",
      type: "ASSET",
      debit: "50,000.00",
      credit: "0.00",
      balance: "50,000.00",
    },
    {
      code: "1020",
      name: "Inventory",
      type: "ASSET",
      debit: "100,000.00",
      credit: "0.00",
      balance: "100,000.00",
    },
    {
      code: "2100",
      name: "VAT Payable",
      type: "LIABILITY",
      debit: "0.00",
      credit: "4,500.00",
      balance: "4,500.00",
    },
    {
      code: "4100",
      name: "Sales Revenue",
      type: "REVENUE",
      debit: "0.00",
      credit: "125,000.00",
      balance: "125,000.00",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ASSET":
        return "text-blue-600";
      case "LIABILITY":
        return "text-red-600";
      case "REVENUE":
        return "text-green-600";
      case "EXPENSE":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Accounting</h1>
              <p className="text-gray-600 mt-2">Chart of Accounts and Journal Entries</p>
            </div>
            <a
              href="/accounts/journal-entry"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              + New Journal Entry
            </a>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Chart of Accounts</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Journal Entries</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Vouchers</button>
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-lg border shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold">Code</th>
                  <th className="text-left py-4 px-6 font-semibold">Account Name</th>
                  <th className="text-left py-4 px-6 font-semibold">Type</th>
                  <th className="text-right py-4 px-6 font-semibold">Debit</th>
                  <th className="text-right py-4 px-6 font-semibold">Credit</th>
                  <th className="text-right py-4 px-6 font-semibold">Balance</th>
                  <th className="text-center py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.code} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{account.code}</td>
                    <td className="py-4 px-6">{account.name}</td>
                    <td className={`py-4 px-6 font-semibold ${getTypeColor(account.type)}`}>
                      {account.type}
                    </td>
                    <td className="py-4 px-6 text-right">{account.debit}</td>
                    <td className="py-4 px-6 text-right">{account.credit}</td>
                    <td className="py-4 px-6 text-right font-semibold">{account.balance}</td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">Edit</button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm">Ledger</button>
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
