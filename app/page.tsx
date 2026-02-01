export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">📊</div>
        <h1 className="text-5xl font-bold mb-4">UAE Accounting SaaS</h1>
        <p className="text-xl mb-8 text-blue-100">Cloud Accounting + POS + Inventory Management</p>
        <a
          href="/login"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  );
}
