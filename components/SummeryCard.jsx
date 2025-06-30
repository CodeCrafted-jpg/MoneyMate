import React from "react";
import { FaMoneyBillWave, FaArrowDown, FaPiggyBank, FaCalendarCheck } from "react-icons/fa";

const SummaryCards = ({ data = {} }) => {
  const {
    income = 0,
    expenses = 0,
    investments = 0,
    subscriptions = 0,
  } = data;

  const cards = [
    {
      label: "Income",
      value: income,
      icon: <FaMoneyBillWave className="text-green-500 text-2xl" />,
      bg: "bg-green-50 dark:bg-green-900",
    },
    {
      label: "Expenses",
      value: expenses,
      icon: <FaArrowDown className="text-red-500 text-2xl" />,
      bg: "bg-red-50 dark:bg-red-900",
    },
    {
      label: "Investments",
      value: investments,
      icon: <FaPiggyBank className="text-blue-500 text-2xl" />,
      bg: "bg-blue-50 dark:bg-blue-900",
    },
    {
      label: "Subscriptions",
      value: subscriptions,
      icon: <FaCalendarCheck className="text-yellow-500 text-2xl" />,
      bg: "bg-yellow-50 dark:bg-yellow-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} rounded-xl p-4 shadow flex items-center justify-between dark:text-white`}
        >
          <div>
            <h4 className="text-sm text-gray-600 dark:text-gray-300">{card.label}</h4>
            <p className="text-xl font-bold">₹{card.value}</p>
          </div>
          <div>{card.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
