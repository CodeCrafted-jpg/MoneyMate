"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { categories } from "@/components/constants/ExpanseCatarogy";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ExpenseForm = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be signed in.");
      return;
    }

    const { data, error } = await supabase.from("expanse").insert([
      {
        user_id: user.id,
        title,
        amount: parseFloat(amount),
        category,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Failed to add expense.");
    } else {
      toast.success("Expense added successfully!",{
        icon:"💸",
        duration:3000
      });
      // Clear form
      setTitle("");
      setAmount("");
      setCategory("");
      router.refresh(); // optional if you want to refresh list
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm dark:bg-gray-800 dark:border-gray-600"
          placeholder="e.g., Grocery shopping"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Amount
        </label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm dark:bg-gray-800 dark:border-gray-600"
          placeholder="e.g., 120.50"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm dark:bg-gray-800 dark:border-gray-600"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-700"
      >
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
