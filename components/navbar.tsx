"use client";

import React from "react";
import Link from "next/link";

export function NavBar() {
  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            📊
          </div>
          UAE Accounting
        </Link>
        
        <ul className="flex gap-8">
          <li><Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link></li>
          <li><Link href="/sales" className="hover:text-blue-400">Sales</Link></li>
          <li><Link href="/purchases" className="hover:text-blue-400">Purchases</Link></li>
          <li><Link href="/inventory" className="hover:text-blue-400">Inventory</Link></li>
          <li><Link href="/accounts" className="hover:text-blue-400">Accounting</Link></li>
          <li><Link href="/reports" className="hover:text-blue-400">Reports</Link></li>
          <li><Link href="/settings" className="hover:text-blue-400">Settings</Link></li>
        </ul>

        <div className="flex items-center gap-4">
          <span>Admin User</span>
          <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Logout</button>
        </div>
      </div>
    </nav>
  );
}
