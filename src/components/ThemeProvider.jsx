// src/ThemeProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // load from localStorage or default to dark
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    console.log("Setting theme:", theme); // 👈 debug
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
     console.log("html.className is now:", root.className); // 👈 debug
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
