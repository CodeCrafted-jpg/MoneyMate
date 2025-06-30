"use client";

import { ThemeContext } from "@/context/themeContext";
import React, { useContext, useEffect, useState } from "react";

const ThemeProvider = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    setMounted(true);
  }, [theme]); // this is okay now because `theme` is always defined

  if (!mounted) return null;

  return <>{children}</>;
};

export default ThemeProvider;
