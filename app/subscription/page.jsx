"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import SubscriptionForm from "@/components/forms/subscriptionForm";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/themeToggler";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import DateFilter from "@/components/data/dataFilter";
import toast from "react-hot-toast";

export default function SubscriptionPage() {
  const [subs, setSubs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null)
  const [filteredSubscription, setFilteredSubscription] = useState([]);
  
  const router = useRouter()

  useEffect(() => {
    const fetchExpenses = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("subscription")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setSubs(data)
      setFilteredSubscription(data);;
    };

    fetchExpenses();
  }, [showForm]);
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('subscription')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Delete failed');
      console.error(error);
    } else {
      toast.success('Deleted!', {
        duration: 3000
      });
      setSubs(subs.filter((e) => e.id !== id));
    }
  };
  const handleEdit = (sub) => {
    setEditingSubscription(sub);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const {
      title,
      amount,
      plan,
      end_date,
      id,
    } = editingSubscription;

    const now = new Date();
    let computedEndDate = end_date;

    // Auto-calculate if not custom
    if (plan === "monthly") {
      computedEndDate = new Date(now.setDate(now.getDate() + 28)).toISOString();
    } else if (plan === "yearly") {
      computedEndDate = new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
    } else if (plan === "half-yearly") {
      computedEndDate = new Date(now.setMonth(now.getMonth() + 6)).toISOString();
    } else if (plan === "custom" && end_date) {
      computedEndDate = new Date(end_date).toISOString();
    }

    const { error } = await supabase
      .from("subscription")
      .update({
        title,
        amount: parseFloat(amount),
        plan,
        end_date: computedEndDate,
      })
      .eq("id", id); // ID is unique; user_id filter optional if RLS is enforced

    if (error) {
      toast.error("Update failed: " + error.message);
    } else {
      toast.success("Subscription updated successfully");
      setShowForm(false);
      setEditingSubscription(null);
      router.refresh();
      window.location.reload()
    }
  };

  const handleDateChange = useCallback(({ startDate, endDate }) => {
    const filtered = subs.filter((sub) => {
      const date = new Date(sub.created_at);
      return date >= startDate && date <= endDate;
    });

    setFilteredSubscription(filtered);
  }, [subs]);
  return (
    <div>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 p-4 relative bg-white dark:bg-gray-900">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>

          <h1 className="text-2xl font-bold mb-4 text-orange-500">Your Subscriptions</h1>

          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Total Entries: {subs.length}
          </p>

          <DateFilter onFilterChange={handleDateChange} />
          {/* Subscription list */}
          {filteredSubscription.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No subscription found for this range.
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredSubscription.map((sub) => {
                const now = new Date();
                const endDate = new Date(sub.end_date);
                const status = endDate >= now ? "Active" : "Expired";
                const statusColor =
                  status === "Active" ? "text-green-600" : "text-red-500";

                return (
                  <li
                    key={sub.id}
                    className="p-3 border rounded-md shadow-sm border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left side: subscription details */}
                      <div>
                        <div className="font-semibold text-black dark:text-white">
                          {sub.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{sub.amount} — {new Date(sub.created_at).toLocaleDateString()} to{" "}
                          {endDate.toLocaleDateString()}
                        </div>
                        <div className={`text-xs font-semibold mt-1 ${statusColor}`}>
                          {status}
                        </div>
                      </div>

                      {/* Right side: edit & delete buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 text-lg"
                          onClick={() => handleEdit(sub)}
                        >
                          ✏️
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 text-lg"
                          onClick={() => handleDelete(sub.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}


          {/* Floating Add Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="fixed bottom-6 right-6 rounded-full bg-indigo-600 text-white p-4 text-2xl shadow-lg hover:bg-indigo-700"
          >
            +
          </button>

          {/* Form Overlay */}
          {showForm && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-sm">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
                <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Add Subscription</h2>
                <SubscriptionForm />
              </div>
            </div>
          )}
          {/* Edit Modal */}
          {editingSubscription && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-sm">
              <div className="p-6 bg-white dark:bg-gray-900 rounded-md shadow-lg w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  onClick={() => setEditingSubscription(null)}
                >
                  ✕
                </button>
                <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
                  Edit Subscription
                </h2>
                <form onSubmit={handleUpdate} className="space-y-4">

                  {/* Amount */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={editingSubscription.amount}
                      onChange={(e) =>
                        setEditingSubscription({ ...editingSubscription, amount: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                    />
                  </div>


                  {/* Plan Select */}
                  <div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editingSubscription.title}
                        onChange={(e) =>
                          setEditingSubscription({ ...editingSubscription, title: e.target.value })
                        }
                        className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm dark:bg-gray-800 dark:border-gray-600"
                        placeholder="e.g., Grocery shopping"
                        required
                      />
                    </div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                      Plan
                    </label>
                    <select
                      value={editingSubscription.plan}
                      onChange={(e) =>
                        setEditingSubscription({ ...editingSubscription, plan: e.target.value })
                      }
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
                  {editingSubscription.plan === "custom" && (
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                        Custom End Date
                      </label>
                      <input
                        type="date"
                        value={editingSubscription.end_date?.slice(0, 10) || ""}
                        onChange={(e) =>
                          setEditingSubscription({ ...editingSubscription, end_date: e.target.value })
                        }
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                  >
                    Update Subscription
                  </button>
                </form>
              </div>
            </div>
          )}


        </div>
      </div>
      <Footer />
    </div>

  );
}

