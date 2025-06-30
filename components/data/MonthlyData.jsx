"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MonthlyComparisonChart = ({ current, previous }) => {
  const data = [
    {
      name: "Income",
      "This Month": current.income,
      "Last Month": previous.income,
    },
    {
      name: "Expenses",
      "This Month": current.expenses,
      "Last Month": previous.expenses,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Monthly Comparison
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="This Month" fill="#34D399" radius={[5, 5, 0, 0]} />
          <Bar dataKey="Last Month" fill="#F87171" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyComparisonChart;
