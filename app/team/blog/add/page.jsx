import React from "react";
import AddPost from "../addPost";
import Link from "next/link";
import { getActiveWebsites } from "@/server/websiteServer/websiteServer";

// Auth-gated page — must not be statically prerendered at build time.
export const dynamic = "force-dynamic";

export default async function AddBlogPage() {
  const res = await getActiveWebsites();
  const websites = res.success ? JSON.parse(res.data) : [];

  return (
    <div>
      {/* Back button */}
      <span className="mb-6 inline-block">
        <Link
          href="/team/blog"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          &larr; Back to Blog Posts
        </Link>
      </span>
      <AddPost websites={websites} />
    </div>
  );
}
