import React from "react";
import AddPost from "../addPost";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getActiveWebsites } from "@/server/websiteServer/websiteServer";
import { getCategories } from "@/server/blogServer/blogServer";

// Auth-gated page — must not be statically prerendered at build time.
export const dynamic = "force-dynamic";

export default async function AddBlogPage() {
  const [websitesRes, categoriesRes] = await Promise.all([
    getActiveWebsites(),
    getCategories(),
  ]);
  const websites = websitesRes.success ? JSON.parse(websitesRes.data) : [];
  const categories = categoriesRes.success ? categoriesRes.categories : [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <Link
          href="/team/blog"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog Posts
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
        <p className="text-neutral-500 mt-1">
          Pick the website it belongs to, add up to 5 headlines for A/B
          testing, and reuse an existing category where possible.
        </p>
      </div>
      <AddPost websites={websites} categories={categories} />
    </div>
  );
}
