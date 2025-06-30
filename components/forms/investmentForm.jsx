"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { investmentCategories } from "../constants/InvestmentCategories";
import toast from "react-hot-toast";

const InvestmentForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return toast.error("You must be logged in");

    const today = new Date();
    const start = new Date(startDate);
    const maturity = maturityDate ? new Date(maturityDate) : null;

    let status = "active";
    if (start > today) {
      status = "not started";
    } else if (maturity && today > maturity) {
      status = "matured";
    }

    const { error } = await supabase.from("investment").insert([
      {
        user_id: user.id,
        title,
        category,
        amount: parseFloat(amount),
        start_date: start.toISOString(),
        maturity_date: maturity ? maturity.toISOString() : null,
        status,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Failed to add investment");
    } else {
      toast.success("Investment added");
      setTitle("");
      setCategory("");
      setAmount("");
      setStartDate("");
      setMaturityDate("");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g Nifty"
          required
          className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white">Amount</label>
        <input
          type="number"
          value={amount}
          placeholder="5000"
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="" disabled>
            Select a category
          </option>
          {investmentCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}

        </select>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-white">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Maturity Date (Optional) */}
      {(category === "Mutual Funds" || category === "Fixed Deposit") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Maturity Date
          </label>
          <input
            type="date"
            value={maturityDate}
            onChange={(e) => setMaturityDate(e.target.value)}
            className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
      >
        Add Investment
      </button>
    </form>
  );
};

export default InvestmentForm;
