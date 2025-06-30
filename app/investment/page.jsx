"use client"
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/themeToggler";
import { useRouter } from "next/navigation";
import DateFilter from "@/components/data/dataFilter";
import toast from "react-hot-toast";
import Footer from "@/components/footer";
import InvestmentForm from "@/components/forms/investmentForm";
import { investmentCategories } from "@/components/constants/InvestmentCategories";
import CategoryFilter from "@/components/data/catagoryFilter";
const investmentPage = () => {
    const [invest, setInvest] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingInvest, setEditingInvest] = useState(null)
    const [filteredInvest, setFilteredInvest] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("");
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const router = useRouter()

    useEffect(() => {
        const fetchIncomes = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("investment")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (!error) setInvest(data);
        };

        fetchIncomes();
    }, [showForm]);
    const handleDelete = async (id) => {
        const { error } = await supabase.from("investment").delete().eq("id", id);
        if (!error) {
            setInvest((prev) => prev.filter((item) => item.id !== id));
            toast.success("Deleted!")

        }
    };
    const handleEdit = (inv) => {
        setEditingInvest(inv);
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("investment")
            .update({
                title: editingInvest.title,
                amount: parseFloat(editingInvest.amount),
                category: editingInvest.category,
                start_date: editingInvest.start_date,
                maturity_date: editingInvest.maturity_date
            })
            .eq("id", editingInvest.id)
            .eq("user_id", user.id);

        if (!error) {
            toast.success("Investment updated Successfully")
            setShowForm(false)
            setEditingInvest(null);
            router.refresh();
        }
    };
    

    useEffect(() => {
        let filtered = invest; 
      
        
        if (selectedCategory) {
          filtered = filtered.filter(item => item.category === selectedCategory);
        }
      
        
        if (dateRange.startDate && dateRange.endDate) {
          filtered = filtered.filter(item => {
            const created = new Date(item.created_at);
            return created >= dateRange.startDate && created <= dateRange.endDate;
          });
        }
      
        setFilteredInvest(filtered);
      }, [invest, selectedCategory, dateRange]);
      

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

                    <h1 className="text-2xl font-bold mb-4 text-orange-500">Your Investments</h1>

                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        Total Entries:{invest.length}
                    </p>
                    <DateFilter onFilterChange={setDateRange} />
                    <CategoryFilter
                     options={investmentCategories}
                     selected={selectedCategory}
                     onChange={setSelectedCategory}
                    />

                    {filteredInvest.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No Investments found for this range.</p>
                    ) : (
                        <ul className="space-y-2">
                            {filteredInvest.map((inv) => (
                                <li
                                    key={inv.id}
                                    className="p-3 border rounded-md shadow-sm border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-black dark:text-white">
                                                {inv.title}
                                            </div>
                                            <div className="text-sm ">
                                                ₹{inv.amount} — {inv.category}
                                            </div>
                                            <div className="text-xs">
                                                {new Date(inv.start_date).toLocaleDateString()}
                                                {inv.maturity_date && (
                                                    <> to {new Date(inv.maturity_date).toLocaleDateString()}</>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 text-lg"
                                                onClick={() => handleEdit(inv)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 text-lg"
                                                onClick={() => handleDelete(inv.id)}
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
                        onClick={() => setShowForm(true)}
                        className="fixed bottom-6 right-6 rounded-full bg-indigo-600 text-white p-4 text-2xl shadow-lg hover:bg-indigo-700"
                    >
                        +
                    </button>

                    {/* Add Modal */}
                    {showForm && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-sm">
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-md shadow-lg w-full max-w-md relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                    onClick={() => setShowForm(false)}
                                >
                                    ✕
                                </button>
                                <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
                                    Add Income
                                </h2>
                                <InvestmentForm setShowForm={setShowForm} />
                            </div>
                        </div>
                    )}
                    {editingInvest && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-sm">
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-md shadow-lg w-full max-w-md relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                    onClick={() => setEditingInvest(null)}
                                >
                                    ✕
                                </button>

                                <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
                                    Edit Investment
                                </h2>

                                <form onSubmit={handleUpdate} className="space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Title</label>
                                        <input
                                            type="text"
                                            value={editingInvest.title}
                                            onChange={(e) =>
                                                setEditingInvest({ ...editingInvest, title: e.target.value })
                                            }
                                            required
                                            className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Amount</label>
                                        <input
                                            type="number"
                                            value={editingInvest.amount}
                                            onChange={(e) =>
                                                setEditingInvest({ ...editingInvest, amount: e.target.value })
                                            }
                                            required
                                            className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Category</label>
                                        <select
                                            value={editingInvest.category}
                                            onChange={(e) =>
                                                setEditingInvest({ ...editingInvest, category: e.target.value })
                                            }
                                            required
                                            className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                                        >
                                            <option value="" disabled>Select a category</option>
                                            {investmentCategories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-white">Start Date</label>
                                        <input
                                            type="date"
                                            value={editingInvest.start_date?.slice(0, 10) || ""}
                                            onChange={(e) =>
                                                setEditingInvest({ ...editingInvest, start_date: e.target.value })
                                            }
                                            required
                                            className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    {/* Maturity Date (Optional) */}
                                    {(editingInvest.category === "Mutual Funds" || editingInvest.category === "Fixed Deposit") && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Maturity Date</label>
                                            <input
                                                type="date"
                                                value={editingInvest.maturity_date?.slice(0, 10) || ""}
                                                onChange={(e) =>
                                                    setEditingInvest({ ...editingInvest, maturity_date: e.target.value })
                                                }
                                                className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                                            />
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                                    >
                                        Update Investment
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}


                </div>
            </div>
            <Footer />
        </div>
    )
}

export default investmentPage
