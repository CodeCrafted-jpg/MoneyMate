"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    { href: "/dashboard", icon: "📊", label: "Dashboard" },
    { href: "/income", icon: "💰", label: "Income" },
    { href: "/expanse", icon: "💸", label: "Expenses" },
    { href: "/investment", icon: "📈", label: "Investments" },
    { href: "/subscription", icon: "📆", label: "Subscriptions" },
  ];

  return (
    <div className="flex h-screen w-16 flex-col justify-between border-e border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Logo */}
      <div>
        <div className="inline-flex size-16 items-center justify-center">
          <Link href="/dashboard">
            <Image src="/logo.svg" alt="logo" height={40} width={40} />
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="mt-4 space-y-4">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
            />
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleSignOut}
          className="group relative flex w-full justify-center py-4 hover:bg-gray-100 dark:hover:bg-gray-800 text-xl"
          title="Logout"
        >
          🚪
          <span className="sr-only">Logout</span>
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ href, icon, label, active }) => {
  return (
    <Link href={href}>
      <div
        className={`group relative flex justify-center text-xl py-3 px-1 rounded-md cursor-pointer transition-colors
          ${active
            ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-white border-l-4 border-indigo-600"
            : "hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent text-gray-600 dark:text-gray-300"
          }`}
      >
        <span>{icon}</span>
        <span className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
