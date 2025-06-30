"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/sidebar";
import Footer from "@/components/footer";
import ThemeToggle from "@/components/themeToggler";
import SummaryCards from "@/components/SummeryCard";
import Link from "next/link";
import ReportSection from "@/components/data/dataCharts";
import MonthlyComparisonChart from "@/components/data/MonthlyData";


export default function DashboardPage() {
  const router = useRouter();
  const [userChecked, setUserChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [thisMonth, setThisMonth] = useState({ income: [], expenses: [] });
  const [lastMonth, setLastMonth] = useState({ income: [], expenses: [] });
  const [investments, setInvestments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  // 🧠 Helper to get date ranges
  const getDateRange = (monthOffset = 0) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0);
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };

  const fetchDashboardData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { start: thisStart, end: thisEnd } = getDateRange(0);
    const { start: lastStart, end: lastEnd } = getDateRange(-1);

    const [thisInc, thisExp, lastInc, lastExp, invest, subs] = await Promise.all([
      supabase
        .from("income")
        .select("*")
        .eq("user_id", user.id)
        .gte("received_at", thisStart)
        .lte("received_at", thisEnd),

      supabase
        .from("expanse")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", thisStart)
        .lte("created_at", thisEnd),

      supabase
        .from("income")
        .select("*")
        .eq("user_id", user.id)
        .gte("received_at", lastStart)
        .lte("received_at", lastEnd),

      supabase
        .from("expanse")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", lastStart)
        .lte("created_at", lastEnd),

      supabase.from("investment").select("*").eq("user_id", user.id),
      supabase.from("subscription").select("*").eq("user_id", user.id),
    ]);

    setThisMonth({ income: thisInc.data || [], expenses: thisExp.data || [] });
    setLastMonth({ income: lastInc.data || [], expenses: lastExp.data || [] });
    setInvestments(invest.data || []);
    setSubscriptions(subs.data || []);
    setLoading(false);
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/Signin");
      } else {
        setUserChecked(true);
        fetchDashboardData();
      }
    };
    checkSession();
  }, [router]);

  if (!userChecked || loading) {
    return <p className="text-gray-500 p-4"></p>;
  }

  const activeSubscriptions = subscriptions.filter((sub) => sub.status === "active");

  return (
    <div className="relative">
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex-1 p-4 relative bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>

          <h1 className="text-2xl font-bold mb-4 text-orange-500">Overview: 30 Days</h1>

          <SummaryCards
            data={{
              income: thisMonth.income.reduce((acc, curr) => acc + Number(curr.amount), 0),
              expenses: thisMonth.expenses.reduce((acc, curr) => acc + Number(curr.amount), 0),
              investments: investments.reduce((acc, curr) => acc + Number(curr.amount), 0),
              subscriptions: subscriptions.reduce((acc, curr) => acc + Number(curr.amount), 0),
            }}
          />

          {/* ✅ Active Subscriptions */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              <Link href="/subscription"><u>Active Subscriptions</u></Link>
            </h2>
            {activeSubscriptions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No active subscriptions.</p>
            ) : (
              <ul className="space-y-2">
                {activeSubscriptions.map((sub) => (
                  <li key={sub.id} className="p-3 border rounded-md shadow-sm border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-black dark:text-white">{sub.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ₹{sub.amount} — {new Date(sub.created_at).toLocaleDateString()} to{" "}
                          {new Date(sub.end_date).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="text-green-600 text-sm font-medium">Active</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 📊 Report Section */}
          <div className="mt-10">
            <ReportSection expenses={thisMonth.expenses} income={thisMonth.income} />
          </div>

          {/* 📉 Monthly Comparison Chart */}
          <div className="mt-10">
            <MonthlyComparisonChart
              current={{
                income: thisMonth.income.reduce((acc, curr) => acc + Number(curr.amount), 0),
                expenses: thisMonth.expenses.reduce((acc, curr) => acc + Number(curr.amount), 0),
              }}
              previous={{
                income: lastMonth.income.reduce((acc, curr) => acc + Number(curr.amount), 0),
                expenses: lastMonth.expenses.reduce((acc, curr) => acc + Number(curr.amount), 0),
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
