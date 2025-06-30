
"use client";

import { useState, useEffect } from "react";

const options = [
  
  { label: "This Month", value: "thisMonth" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Previous Month", value: "lastMonth" },
];

export default function DateFilter({ onFilterChange }) {
  const [selected, setSelected] = useState("thisMonth");

  useEffect(() => {
    const now = new Date();
    let start, end;

    if (selected === "7days") {
      end = now;
      start = new Date();
      start.setDate(now.getDate() - 7);
    } else if (selected === "thisMonth") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = now;
    } else if (selected === "lastMonth") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    if (onFilterChange) {
      onFilterChange({ startDate: start, endDate: end });
    }
  }, [selected, onFilterChange]);

  return (
    <div className="flex gap-2 mb-4">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setSelected(opt.value)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium border ${
            selected === opt.value
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-transparent text-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
