"use client";
import React from "react";

export default function CategoryFilter({ options, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onChange("")}
        className={`px-3 py-1.5 rounded-md text-sm border ${
          selected === "" ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
        }`}
      >
        All
      </button>

      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-md text-sm border ${
            selected === opt
              ? "bg-indigo-600 text-white border-indigo-600"
              : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
