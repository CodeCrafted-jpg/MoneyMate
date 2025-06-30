import React from 'react';
import { TypingAnimation } from "@/components/magicui/typing-animation";

const FaQ = () => {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto"> {/* Added section for better structure and centering */}
      <h2 className="text-3xl font-bold text-center text-orange-500 mb-8">
       <TypingAnimation
              as="span"
              duration={70} 
              delay={500} 
              startOnView={true} 
            >Frequently Asked Questions</TypingAnimation> 
      </h2>
      <div className="space-y-4">
        <details
          className="group border-s-4 border-indigo-600 bg-gray-50 p-4 dark:border-indigo-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
          open
        >
          <summary className="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white cursor-pointer">
            <h2 className="text-lg font-medium">What is MoneyMate and how can it help me?</h2>

            <svg
              className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <p className="pt-4 text-gray-700 dark:text-gray-300">
            MoneyMate is your personal finance sidekick designed to help you track your expenses,
            manage your budget, and grow your savings effortlessly. It provides insights into your
            spending habits, helps you set financial goals, and promotes healthy money management.
          </p>
        </details>

        <details
          className="group border-s-4 border-indigo-600 bg-gray-50 p-4 dark:border-indigo-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white cursor-pointer">
            <h2 className="text-lg font-medium">Is MoneyMate free to use?</h2>

            <svg
              className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <p className="pt-4 text-gray-700 dark:text-gray-300">
            Yes, MoneyMate offers a free tier that allows you to get started with expense tracking and basic budgeting.
            We also plan to offer premium features in the future for users who need more advanced financial tools.
          </p>
        </details>

        <details
          className="group border-s-4 border-indigo-600 bg-gray-50 p-4 dark:border-indigo-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white cursor-pointer">
            <h2 className="text-lg font-medium">How secure is my financial data with MoneyMate?</h2>

            <svg
              className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <p className="pt-4 text-gray-700 dark:text-gray-300">
            We prioritize the security of your financial data. MoneyMate uses industry-standard encryption and security
            protocols to protect your information. We do not store sensitive banking credentials directly.
          </p>
        </details>

        <details
          className="group border-s-4 border-indigo-600 bg-gray-50 p-4 dark:border-indigo-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white cursor-pointer">
            <h2 className="text-lg font-medium">Can I categorize my expenses?</h2>

            <svg
              className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <p className="pt-4 text-gray-700 dark:text-gray-300">
            Absolutely! MoneyMate allows you to easily categorize your expenses, helping you understand where your
            money goes. You can also create custom categories to fit your unique spending habits.
          </p>
        </details>

        <details
          className="group border-s-4 border-indigo-600 bg-gray-50 p-4 dark:border-indigo-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white cursor-pointer">
            <h2 className="text-lg font-medium">Does MoneyMate support multiple currencies?</h2>

            <svg
              className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <p className="pt-4 text-gray-700 dark:text-gray-300">
            Currently, MoneyMate primarily supports a single currency based on your region. We are constantly
            working on new features and multi-currency support is on our roadmap for future updates.
          </p>
        </details>
      </div>
    </section>
  );
};

export default FaQ;