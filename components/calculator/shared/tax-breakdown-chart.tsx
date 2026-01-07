"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/utils/currency";
import type { TaxBreakdownEntry } from "@/types/calculator";

interface TaxBreakdownChartProps {
  breakdown: TaxBreakdownEntry[];
}

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

export function TaxBreakdownChart({ breakdown }: TaxBreakdownChartProps) {
  if (breakdown.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No tax breakdown available
      </div>
    );
  }

  const chartData = breakdown.map((entry) => ({
    name: entry.band,
    tax: entry.taxDue,
    rate: `${(entry.rate * 100).toFixed(0)}%`,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickFormatter={(value) =>
            formatCurrency(value, { showSymbol: false })
          }
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="tax" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
