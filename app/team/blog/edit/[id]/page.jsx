import React from "react";
import BlogForm from "@/components/blog/blog-form";
import { getBlogPostById, getCategories } from "@/server/blogServer/blogServer";
import { getActiveWebsites } from "@/server/websiteServer/websiteServer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Auth-gated page — must not be statically prerendered at build time.
export const dynamic = "force-dynamic";

export default async function BlogEditPage({ params }) {
  const { id } = await params;
  const data = await getBlogPostById(id);
  if (!data.success) {
    return <div className="p-10">Failed to load blog post.</div>;
  }
  data.post.headlines = data.post.headlines.map((h) => h.text);

  const [websitesRes, categoriesRes] = await Promise.all([
    getActiveWebsites(),
    getCategories(),
  ]);
  const websites = websitesRes.success ? JSON.parse(websitesRes.data) : [];
  const categories = categoriesRes.success ? categoriesRes.categories : [];

  const post = data.post;

  const transformedData = {
    ...post,
    websiteIds: (post.websiteIds || (post.websiteId ? [post.websiteId] : [])).map(
      String
    ),
    isPublished: post.status === "published",
    ogImage: post?.seo?.ogImage,
    metaDescription: post?.seo?.metaDescription,
    metaTitle: post?.seo?.metaTitle,
    canonicalUrl: post?.seo?.canonicalUrl,
    content: {
      html: post.contentHtml,
      json: post.contentJson,
    },
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-neutral-500 mt-1 line-clamp-1">
          {post.headlines[0] || "Untitled"}
        </p>
      </div>
      <BlogForm
        intitalData={transformedData}
        websites={websites}
        categories={categories}
      />
    </div>
  );
}
