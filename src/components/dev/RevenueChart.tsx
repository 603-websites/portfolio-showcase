"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Invoice {
  amount_cents: number;
  invoice_date: string;
}

export default function RevenueChart({ invoices }: { invoices: Invoice[] }) {
  // Group invoices by month
  const monthlyData = invoices.reduce<Record<string, number>>((acc, inv) => {
    const month = inv.invoice_date.slice(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + inv.amount_cents / 100;
    return acc;
  }, {});

  const data = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      revenue,
    }));

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-dim">
        No revenue data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
        <XAxis dataKey="month" stroke="#5a5a6e" fontSize={12} />
        <YAxis
          stroke="#5a5a6e"
          fontSize={12}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#12121a",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
            color: "#f0f0f5",
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#6366f1"
          fill="url(#revenueGrad)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
