"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const getMonthRange = (offset = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  return { start, end };
};

export default function useDashboardData() {
  const [data, setData] = useState({
    thisMonth: {
      income: [],
      expenses: [],
    },
    lastMonth: {
      income: [],
      expenses: [],
    },
    investments: [],
    subscriptions: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { start: startThis, end: endThis } = getMonthRange(0);
      const { start: startLast, end: endLast } = getMonthRange(-1);

      const [
        thisIncome,
        thisExpense,
        lastIncome,
        lastExpense,
        investRes,
        subsRes,
      ] = await Promise.all([
        supabase
          .from("income")
          .select("*")
          .eq("user_id", user.id)
          .gte("received_at", startThis.toISOString())
          .lte("received_at", endThis.toISOString()),

        supabase
          .from("expanse")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", startThis.toISOString())
          .lte("created_at", endThis.toISOString()),

        supabase
          .from("income")
          .select("*")
          .eq("user_id", user.id)
          .gte("received_at", startLast.toISOString())
          .lte("received_at", endLast.toISOString()),

        supabase
          .from("expanse")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", startLast.toISOString())
          .lte("created_at", endLast.toISOString()),

        supabase.from("investment").select("*").eq("user_id", user.id),

        supabase.from("subscription").select("*").eq("user_id", user.id),
      ]);

      setData({
        thisMonth: {
          income: thisIncome.data || [],
          expenses: thisExpense.data || [],
        },
        lastMonth: {
          income: lastIncome.data || [],
          expenses: lastExpense.data || [],
        },
        investments: investRes.data || [],
        subscriptions: subsRes.data || [],
        loading: false,
      });
    };

    fetchData();
  }, []);

  return data;
}
