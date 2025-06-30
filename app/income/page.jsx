"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import IncomeForm from "@/components/forms/IncomeForm";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/themeToggler";
import { useRouter } from "next/navigation";
import { categories } from "@/components/constants/IncomeCatagory";
import DateFilter from "@/components/data/dataFilter";
import toast from "react-hot-toast";
import Footer from "@/components/footer";
import CategoryFilter from "@/components/data/catagoryFilter";

export default function IncomePage() {
    const [incomes, setIncomes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);
    const [filteredIncome, setFilteredIncome] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const router = useRouter();

    useEffect(() => {
        const fetchIncomes = async () => {
            
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user)
                 return;

            const { data, error } = await supabase
                .from("income")
                .select("*")
                .eq("user_id", user.id)
                .order("received_at", { ascending: false });

            if (!error) setIncomes(data);
        };

        fetchIncomes();
    }, [showForm, editingIncome]);

    const handleDelete = async (id) => {
        const { error } = await supabase.from("income").delete().eq("id", id);
        if (!error) {
            setIncomes((prev) => prev.filter((item) => item.id !== id));
            toast.success("Deleted!")

        }
    };

    const handleEdit = (income) => {
        setEditingIncome(income);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("income")
            .update({
                title: editingIncome.title,
                amount: parseFloat(editingIncome.amount),
                source: editingIncome.source,
                received_at: editingIncome.received_at,
            })
            .eq("id", editingIncome.id)
            .eq("user_id", user.id);

        if (!error) {
            toast.success("Income updated Successfully")
            setShowForm(false)
            setEditingIncome(null);
            router.refresh();
        }
    };
   

    useEffect(() => {
        let filtered = incomes;


        if (selectedCategory) {
            filtered = filtered.filter(item => item.source === selectedCategory);
        }


        if (dateRange.startDate && dateRange.endDate) {
            filtered = filtered.filter(item => {
                const created = new Date(item.received_at);
                return created >= dateRange.startDate && created <= dateRange.endDate;
            });
        }

        setFilteredIncome(filtered);
    }, [incomes, selectedCategory, dateRange]);


    return (
        <div>
            <div className="flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-orange-500">Your Income</h1>
                        <ThemeToggle />
                    </div>

                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        Total Entries: {incomes.length}
                    </p>
                    <DateFilter onFilterChange={setDateRange} />
                    <CategoryFilter
                        options={categories}
                        selected={selectedCategory}
                        onChange={setSelectedCategory} />


                    {filteredIncome.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No income found for this range.</p>
                    ) : (
                        <ul className="space-y-2">
                            {filteredIncome.map((inc) => (
                                <li
                                    key={inc.id}
                                    className="p-3 border rounded-md shadow-sm border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-black dark:text-white">
                                                {inc.title}
                                            </div>
                                            <div className="text-sm ">
                                                ₹{inc.amount} — {inc.source}
                                            </div>
                                            <div className="text-xs">
                                                {new Date(inc.received_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 text-lg"
                                                onClick={() => handleEdit(inc)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 text-lg"
                                                onClick={() => handleDelete(inc.id)}
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
                                <IncomeForm setShowForm={setShowForm} />
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {editingIncome && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-sm">
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-md shadow-lg w-full max-w-md relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                    onClick={() => setEditingIncome(null)}
                                >
                                    ✕
                                </button>
                                <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
                                    Edit Income
                                </h2>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={editingIncome.title}
                                            onChange={(e) =>
                                                setEditingIncome({ ...editingIncome, title: e.target.value })
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
                                            value={editingIncome.amount}
                                            onChange={(e) =>
                                                setEditingIncome({ ...editingIncome, amount: e.target.value })
                                            }
                                            className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                                            Source
                                        </label>
                                        <select
                                            type="text"
                                            value={editingIncome.source}
                                            onChange={(e) =>
                                                setEditingIncome({ ...editingIncome, source: e.target.value })
                                            }
                                            className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                                        >
                                            <option value="" disabled>
                                                Select a Source
                                            </option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-white">
                                            Received Date
                                        </label>
                                        <input
                                            type="date"
                                            value={editingIncome.received_at?.split("T")[0]}
                                            onChange={(e) =>
                                                setEditingIncome({
                                                    ...editingIncome,
                                                    received_at: e.target.value,
                                                })
                                            }
                                            className="w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                                    >
                                        Update Income
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
