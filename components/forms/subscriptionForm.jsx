"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SubscriptionForm() {
  const [title, setTitle] = useState("")
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("You must be logged in");

    const startDate = new Date();
    let endDate = null;

    // Calculate end_date based on plan
    if (plan === "monthly") {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 28);
    } else if (plan === "yearly") {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else if (plan === "half-yearly") {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (plan === "custom" && customEndDate) {
      endDate = new Date(customEndDate);
    }

    const { error } = await supabase.from("subscription").insert([
      {
        user_id: user.id,
        title,
        plan,
        amount: parseFloat(amount),
        start_date: startDate.toISOString(),
        end_date: endDate ? endDate.toISOString() : null,
        status: "active",
         user_email: user.email,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Failed to add subscription");
    } else {
      toast.success("Subscription added");
      setTitle("")
      setPlan("");
      setAmount("");
      setCustomEndDate("");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Plan Select */}
      <div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm dark:bg-gray-800 dark:border-gray-600"
            placeholder="e.g., Gym"
            required
          />
        </div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
          Plan
        </label>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="" disabled>Select a plan</option>
          <option value="monthly">Monthly (28 days)</option>
          <option value="yearly">Yearly</option>
          <option value="half-yearly">Half-Yearly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Custom End Date Field */}
      {plan === "custom" && (
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
            Custom End Date
          </label>
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>
      )}

      {/* Amount Input */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="300"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
      >
        Add Subscription
      </button>
    </form>
  );
}
