import { getBlogPosts } from "@/server/blogServer/blogServer";
import { getActiveWebsites } from "@/server/websiteServer/websiteServer";
import React from "react";
import WinnerButton from "@/components/blog/winnerButton";
import CopyToWebsiteButton from "@/components/blog/copy-to-website";
import PublishButton from "@/components/blog/publish-button";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  CalendarDays,
  FolderOpen,
  Globe,
  PenSquare,
  Plus,
} from "lucide-react";

// Auth-gated page — must not be statically prerendered at build time.
export const dynamic = "force-dynamic";

const STATUS_BADGE = {
  draft: "bg-amber-100 text-amber-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-200 text-gray-600",
};

function filterUrl({ website, category, status }) {
  const params = new URLSearchParams();
  if (website) params.set("website", website);
  if (category) params.set("category", category);
  if (status) params.set("status", status);
  const qs = params.toString();
  return qs ? `/team/blog?${qs}` : "/team/blog";
}

export default async function page({ searchParams }) {
  const { website, category, status } = await searchParams;

  const websitesRes = await getActiveWebsites();
  const websites = websitesRes.success ? JSON.parse(websitesRes.data) : [];
  const websiteById = Object.fromEntries(
    websites.map((site) => [site._id, site])
  );

  // Fetch all posts in the current website scope, then filter by category
  // and status in memory — the same list gives us the filter counts for free.
  const blogPosts = await getBlogPosts("All", website || null);
  if (!blogPosts.success) {
    return <div className="p-10">Failed to load blog posts.</div>;
  }
  const allPosts = blogPosts.posts;

  const categoryCounts = allPosts.reduce((acc, post) => {
    const name = post.category || "Uncategorised";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const sortedCategories = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const statusCounts = allPosts.reduce((acc, post) => {
    const name = post.status || "draft";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const posts = allPosts.filter((post) => {
    if (category && (post.category || "Uncategorised") !== category)
      return false;
    if (status && (post.status || "draft") !== status) return false;
    return true;
  });

  const pill = (active) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
      active
        ? "bg-indigo-600 text-white"
        : "bg-white border text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-neutral-500 mt-1">
            {allPosts.length} post{allPosts.length === 1 ? "" : "s"}
            {website && websiteById[website]
              ? ` on ${websiteById[website].name}`
              : " across all websites"}{" "}
            · {sortedCategories.length} categor
            {sortedCategories.length === 1 ? "y" : "ies"}
          </p>
        </div>
        <Link
          href="/team/blog/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          <Plus className="h-4 w-4" />
          New Blog Post
        </Link>
      </div>

      {/* Website filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs uppercase tracking-wide text-neutral-400 font-semibold mr-1 flex items-center gap-1">
          <Globe className="h-3.5 w-3.5" />
          Website
        </span>
        <Link href={filterUrl({ category, status })} className={pill(!website)}>
          All Websites
        </Link>
        {websites.map((site) => (
          <Link
            key={site._id}
            href={filterUrl({ website: site._id, category, status })}
            className={pill(website === site._id)}
          >
            {site.name}
          </Link>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs uppercase tracking-wide text-neutral-400 font-semibold mr-1 flex items-center gap-1">
          <BarChart3 className="h-3.5 w-3.5" />
          Status
        </span>
        <Link href={filterUrl({ website, category })} className={pill(!status)}>
          All
          <span className="text-xs opacity-70">({allPosts.length})</span>
        </Link>
        <Link
          href={filterUrl({ website, category, status: "published" })}
          className={pill(status === "published")}
        >
          Published
          <span className="text-xs opacity-70">
            ({statusCounts.published || 0})
          </span>
        </Link>
        <Link
          href={filterUrl({ website, category, status: "draft" })}
          className={pill(status === "draft")}
        >
          Draft
          <span className="text-xs opacity-70">({statusCounts.draft || 0})</span>
        </Link>
        {statusCounts.archived > 0 && (
          <Link
            href={filterUrl({ website, category, status: "archived" })}
            className={pill(status === "archived")}
          >
            Archived
            <span className="text-xs opacity-70">({statusCounts.archived})</span>
          </Link>
        )}
      </div>

      {/* Category overview with post counts */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs uppercase tracking-wide text-neutral-400 font-semibold mr-1 flex items-center gap-1">
          <FolderOpen className="h-3.5 w-3.5" />
          Category
        </span>
        <Link href={filterUrl({ website, status })} className={pill(!category)}>
          All
          <span className="text-xs opacity-70">({allPosts.length})</span>
        </Link>
        {sortedCategories.map(([name, count]) => (
          <Link
            key={name}
            href={filterUrl({ website, category: name, status })}
            className={pill(category === name)}
          >
            {name}
            <span className="text-xs opacity-70">({count})</span>
          </Link>
        ))}
        {sortedCategories.length === 0 && (
          <span className="text-sm text-neutral-400">No categories yet</span>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-5">
        {posts.map((post) => {
          const postSiteIds = (
            post.websiteIds || (post.websiteId ? [post.websiteId] : [])
          ).map(String);
          const postSites = postSiteIds
            .map((id) => websiteById[id])
            .filter(Boolean);
          const totalImpressions = post.headlines.reduce(
            (sum, h) => sum + (h.impressions || 0),
            0
          );
          const totalClicks = post.headlines.reduce(
            (sum, h) => sum + (h.clicks || 0),
            0
          );
          return (
            <div
              key={post._id}
              className="border rounded-xl bg-white shadow-sm overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                {/* Cover thumbnail */}
                {post.coverImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage.url}
                    alt={post.headlines[0]?.text || "Cover image"}
                    className="h-28 w-full sm:w-44 rounded-lg object-cover border shrink-0"
                  />
                ) : (
                  <div className="h-28 w-full sm:w-44 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400 text-xs shrink-0">
                    No cover image
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold leading-snug line-clamp-2">
                      {post.headlines[0]?.text || "Untitled"}
                    </h2>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <PublishButton postId={post._id} status={post.status} />
                      <Link
                        href={`/team/blog/${post._id}`}
                        className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition"
                      >
                        View
                      </Link>
                      <Link
                        href={`/team/blog/edit/${post._id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition"
                      >
                        <PenSquare className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <CopyToWebsiteButton
                        postId={post._id}
                        postTitle={post.headlines[0]?.text}
                        currentWebsiteIds={postSiteIds}
                        websites={websites}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge className={STATUS_BADGE[post.status] || ""}>
                      {post.status || "draft"}
                    </Badge>
                    {postSites.length > 0 ? (
                      postSites.map((site) => (
                        <Badge
                          key={site._id}
                          className="bg-indigo-100 text-indigo-800"
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          {site.name}
                        </Badge>
                      ))
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800">
                        <Globe className="h-3 w-3 mr-1" />
                        No website
                      </Badge>
                    )}
                    <Badge className="bg-blue-50 text-blue-700">
                      <FolderOpen className="h-3 w-3 mr-1" />
                      {post.category || "Uncategorised"}
                    </Badge>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {post.createdAt ? format(post.createdAt, "PPP") : "—"}
                    </span>
                  </div>

                  <p className="text-sm text-neutral-500 mt-2 line-clamp-2">
                    {post.summary || post.description || ""}
                  </p>
                </div>
              </div>

              {/* Headline A/B performance (collapsible) */}
              <details className="border-t bg-gray-50/60 group">
                <summary className="px-5 py-3 text-sm text-neutral-600 cursor-pointer select-none flex items-center gap-2 hover:bg-gray-50">
                  <BarChart3 className="h-4 w-4" />
                  Headline performance — {post.headlines.length} variation
                  {post.headlines.length === 1 ? "" : "s"}, {totalImpressions}{" "}
                  impressions, {totalClicks} clicks
                </summary>
                <div className="px-5 pb-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-gray-500">
                        <th className="py-2">Headline Variation</th>
                        <th className="py-2">Impressions</th>
                        <th className="py-2">Clicks</th>
                        <th className="py-2">CTR (%)</th>
                        <th className="py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {post.headlines.map((h, i) => {
                        const ctr =
                          h.impressions > 0
                            ? ((h.clicks / h.impressions) * 100).toFixed(2)
                            : 0;
                        return (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-3 font-medium">{h.text}</td>
                            <td>{h.impressions}</td>
                            <td>{h.clicks}</td>
                            <td
                              className={`font-bold ${
                                Number(ctr) > 5 ? "text-green-600" : ""
                              }`}
                            >
                              {ctr}%
                            </td>
                            <td>
                              <WinnerButton />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          );
        })}

        {posts.length === 0 && (
          <div className="text-gray-500 border rounded-xl p-12 bg-white text-center">
            <p className="font-medium mb-1">No blog posts found</p>
            <p className="text-sm">
              {category || website
                ? "Try clearing the filters above."
                : "Create your first post to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
