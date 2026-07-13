import BlogRendered from "@/components/blog/blogRendered";
import { CoverImage } from "@/components/blog/cover-image";
import ScrollProgress from "@/components/blog/scroll-progress";
import ShareButtons from "@/components/blog/share-button";
import ThemeToggle from "@/components/blog/toogle-theme";
import { getBlogStats } from "@/helper/blog-utils";
import { getBlogPostById } from "@/server/blogServer/blogServer";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const data = await getBlogPostById(id);
  if (!data.success) {
    return <div className="p-10">Failed to load blog post.</div>;
  }

  const { wordCount, readingTime } = getBlogStats(data.post?.contentHtml || "");
  const fullUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }/blog/${data.post.slug}`;

  return (
    <div className="relative min-h-screen bg-[var(--editor-bg-default)] text-[var(--editor-text-default)]">
      <ScrollProgress />
      <Link href="/team/blog" className="mb-6 inline-block">
        <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
          &larr; Back to Blog Posts
        </span>
      </Link>
      <Link href={`/team/blog/edit/${id}`} className="mb-6 inline-block ml-4">
        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Edit Blog Post
        </span>
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-[var(--editor-border-default)] pb-6">
        <div className="flex items-center gap-6 text-sm text-[var(--editor-text-gray)]">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{readingTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <span>{wordCount} words</span>
          </div>
        </div>

        <ThemeToggle />
      </div>
      {/* Cover Image Section */}

      <h1 className="text-3xl font-bold mb-4">
        {data.post.headlines[0]?.text || "Untitled"}
      </h1>
      {data.post.coverImage?.url && (
        <div className="mb-8">
          <CoverImage
            url={data.post.coverImage.url}
            alt={data.post.description}
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto p-6">
        <BlogRendered content={data?.post?.contentHtml} />
      </div>

      <ShareButtons title={data?.post.headlines[0]?.text} url={fullUrl} />

      {/* CTA Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl text-center">
        <h3 className="text-2xl font-bold mb-2">Need HMO Management?</h3>
        <p className="mb-4 text-[var(--editor-text-gray)]">
          Let CDC Property Management handle your London portfolio.
        </p>
        <a
          href="/contact-us"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Get a Free Consultation
        </a>
      </div>
      <div className="mt-10 p-4 bg-yellow-100 border-l-4 border-yellow-400">
        <p className="text-yellow-700">
          Note: This page is for previewing the blog post as it would appear on
          the public site. It is not intended for editing content. To make
          changes, please use the edit button above.
        </p>
      </div>
    </div>
  );
}
