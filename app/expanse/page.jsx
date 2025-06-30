"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ExpenseForm from "@/components/forms/ExpanseForms";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/themeToggler";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { categories } from "@/components/constants/ExpanseCatarogy";
import DateFilter from "@/components/data/dataFilter";
import toast from "react-hot-toast";
import CategoryFilter from "@/components/data/catagoryFilter";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpanse, setEditingExpanse] = useState(null)
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const router = useRouter()

  useEffect(() => {
    const fetchExpenses = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("expanse")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setExpenses(data)
      setFilteredExpenses(data);;
    };

    fetchExpenses();
  }, [showForm]);
  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('expanse')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Delete failed');
      console.error(error);
    } else {
      toast.success('Deleted!', {
        duration: 3000
      });
      setExpenses(expenses.filter((e) => e.id !== id));
    }
  };
  const handleEdit = (expenses) => {
    setEditingExpanse(expenses);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("expanse")
      .update({
        title: editingExpanse.title,
        amount: parseFloat(editingExpanse.amount),
        category: editingExpanse.category,
      })
      .eq("id", editingExpanse.id)
      .eq("user_id", user.id);

    if (!error) {
      toast.success("Expanse updated Successfully")
      setShowForm(false)
      setEditingExpanse(null);
      router.refresh();
      window.location.reload()
    }
  };


  useEffect(() => {
    let filtered = expenses;


    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }


    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter(item => {
        const created = new Date(item.created_at);
        return created >= dateRange.startDate && created <= dateRange.endDate;
      });
    }

    setFilteredExpenses(filtered);
  }, [expenses, selectedCategory, dateRange]);



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

          <h1 className="text-2xl font-bold mb-4 text-orange-500">Your Expenses</h1>

          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Total Entries: {expenses.length}
          </p>



          <DateFilter onFilterChange={setDateRange} />
          <CategoryFilter
            options={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory} />

          {/* Expense list */}
          {filteredExpenses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No expenses found for this range.</p>
          ) : (
            <ul className="space-y-2">
              {filteredExpenses.map((exp) => (
                <li
                  key={exp.id}
                  className="p-3 border rounded-md shadow-sm border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    {/* Left side: income details */}
                    <div>
                      <div className="font-semibold text-black dark:text-white">{exp.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ₹{exp.amount} —{exp.category}--{new Date(exp.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Right side: edit & delete buttons grouped */}
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 text-lg"
                        onClick={() => handleEdit(exp)}
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 text-lg"
                        onClick={() => handleDelete(exp.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              ))}
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
                <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Add Expense</h2>
                <ExpenseForm />
              </div>
            </div>
          )}
          {/* Edit Modal */}
          {editingExpanse && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-sm">
              <div className="p-6 bg-white dark:bg-gray-900 rounded-md shadow-lg w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  onClick={() => setEditingExpanse(null)}
                >
                  ✕
                </button>
                <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
                  Edit Expense
                </h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingExpanse.title}
                      onChange={(e) =>
                        setEditingExpanse({ ...editingExpanse, title: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={editingExpanse.amount}
                      onChange={(e) =>
                        setEditingExpanse({ ...editingExpanse, amount: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                      Category
                    </label>
                    <select
                      required
                      value={editingExpanse.category}
                      onChange={(e) =>
                        setEditingExpanse({ ...editingExpanse, category: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
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
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                  >
                    Update Expense
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
