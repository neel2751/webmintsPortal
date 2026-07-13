"use client";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (totalHeight) {
        setProgress(Number((currentScroll / totalHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
      <div
        className="h-full bg-[var(--editor-text-blue)] shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
