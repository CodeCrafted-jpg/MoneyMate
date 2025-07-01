"use client";

// Remove useState for selected as it will be controlled by the parent
// import { useState } from "react";

const options = [
  { label: "This Month", value: "thisMonth" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Previous Month", value: "lastMonth" },
];

// Accept 'selected' as a prop
export default function DateFilter({ onFilterChange, selected }) {
  // const [selected, setSelected] = useState("thisMonth"); // Remove this line

  const handleClick = (value) => {
    // The parent component will now handle setting the 'selected' state
    // setSelected(value); // Remove this line

    const now = new Date();
    let start = null;
    let end = new Date();

    switch (value) {
      case "7days":
        start = new Date();
        start.setDate(end.getDate() - 7);
        break;
      case "lastMonth":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "thisMonth":
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = now;
        break;
    }

    // Pass the selected value back to the parent along with dates
    onFilterChange?.({ startDate: start, endDate: end, selected: value });
  };

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleClick(opt.value)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            ${
              selected === opt.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}