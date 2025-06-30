"use client";

import Image from "next/image";
import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";

const ThemeToggle = () => {
  const { toggle, theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  return (
    <div
      onClick={toggle}
      className={`w-14 h-8 flex items-center justify-between px-1 rounded-full cursor-pointer transition-colors duration-300 ${
        isDark ? "bg-white" : "bg-slate-900"
      }`}
    >
      <Image src="/moon.png" alt="Moon" width={14} height={14} />
      <div
        className={`w-4 h-4 rounded-full absolute transition-all duration-300 ${
          isDark
            ? "translate-x-1 bg-slate-900"
            : "translate-x-9 bg-white"
        }`}
      />
      <Image src="/sun.png" alt="Sun" width={14} height={14} />
    </div>
  );
};

export default ThemeToggle;
