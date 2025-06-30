"use client"
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { categories } from "@/components/constants/IncomeCatagory";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const IncomeForm = ({setShowForm}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [receivedDate, setReceivedDate] = useState(""); 
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

    const { error } = await supabase.from("income").insert([
      {
        user_id: user.id,
        title,
        amount: parseFloat(amount),
        source,
        received_at: receivedDate || new Date().toISOString(), // use selected or fallback
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Failed to add income.");
    } else {
      toast.success("Income added successfully!");
      setShowForm(false)
      setTitle("");
      setAmount("");
      setSource("");
      setReceivedDate("");
      router.refresh();
      
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Salary"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50000"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Source */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
          Source
        </label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="" disabled>Select source</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Received Date */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
          Received Date
        </label>
        <input
          type="date"
          value={receivedDate}
          onChange={(e) => setReceivedDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        onClick={()=>setShowForm(false)}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
      >
        Add Income
      </button>
    </form>
  );
};

export default IncomeForm;
