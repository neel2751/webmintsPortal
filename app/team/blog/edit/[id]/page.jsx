import React from "react";
import BlogForm from "@/components/blog/blog-form";
import { getBlogPostById } from "@/server/blogServer/blogServer";
import { getActiveWebsites } from "@/server/websiteServer/websiteServer";
import Link from "next/link";

export default async function BlogEditPage({ params }) {
  const { id } = await params;
  const data = await getBlogPostById(id);
  if (!data.success) {
    return <div className="p-10">Failed to load blog post.</div>;
  }
  data.post.headlines = data.post.headlines.map((h) => h.text);

  const websitesRes = await getActiveWebsites();
  const websites = websitesRes.success ? JSON.parse(websitesRes.data) : [];

  const post = data.post;

  const transformedData = {
    ...post,
    websiteId: post.websiteId ? String(post.websiteId) : undefined,
    ogImage: post?.seo?.ogImage,
    metaDescription: post?.seo?.metaDescription,
    metaTitle: post?.seo?.metaTitle,
    canonicalUrl: post?.seo?.canonicalUrl,
    content: {
      html: post.contentHtml,
      json: post.contentJson,
    },
  };

  // data.post.preview = data.post.url;

  return (
    <div className="p-10">
      <Link href="/team/blog" className="mb-6 inline-block">
        <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
          &larr; Back to Blog Posts
        </span>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Edit Blog Post</h1>
      <BlogForm intitalData={transformedData} websites={websites} />
    </div>
  );
}
