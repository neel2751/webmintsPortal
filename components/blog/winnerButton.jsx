// components/admin/WinnerButton.tsx
"use client";

import { useTransition } from "react";
import { Trophy } from "lucide-react";
import { promoteHeadline } from "@/server/blogServer/blogServer";

export default function WinnerButton({ postId, index, isWinner }) {
  const [isPending, startTransition] = useTransition();

  if (isWinner) {
    return (
      <span className="flex items-center gap-1 text-green-600 font-bold text-xs uppercase">
        <Trophy className="w-3 h-3" /> Champion
      </span>
    );
  }

  return (
    <button
      onClick={() => {
        if (confirm("Are you sure? This will remove other variations.")) {
          startTransition(async () => await promoteHeadline(postId, index));
        }
      }}
      disabled={isPending}
      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-300"
    >
      {isPending ? "Setting..." : "Set as Winner"}
    </button>
  );
}
