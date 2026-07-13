"use client";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react"; // Or any icons you like

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Initialize theme based on system preference or manual toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-muted hover:bg-editor-highlight-gray transition-colors"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600" />
      )}
    </button>
  );
}
