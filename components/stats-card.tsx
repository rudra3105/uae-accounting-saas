"use client";

import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: "blue" | "green" | "red" | "amber";
  trend?: { value: number; isPositive: boolean };
}

export function StatsCard({ title, value, icon, color = "blue", trend }: CardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    amber: "bg-amber-50 border-amber-200",
  };

  const iconColorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`text-3xl p-3 rounded-lg ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
