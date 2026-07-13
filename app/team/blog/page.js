import { getBlogPosts } from "@/server/blogServer/blogServer";
import { getActiveWebsites } from "@/server/websiteServer/websiteServer";
import React from "react";
import WinnerButton from "@/components/blog/winnerButton";
import CopyToWebsiteButton from "@/components/blog/copy-to-website";
import Link from "next/link";

export default async function page({ searchParams }) {
  const { website } = await searchParams;

  const websitesRes = await getActiveWebsites();
  const websites = websitesRes.success ? JSON.parse(websitesRes.data) : [];
  const websiteById = Object.fromEntries(
    websites.map((site) => [site._id, site])
  );

  const blogPosts = await getBlogPosts("All", website || null);
  if (!blogPosts.success) {
    return <div className="p-10">Failed to load blog posts.</div>;
  }
  const posts = blogPosts.posts;

  const pillClass = (active) =>
    `px-3 py-1.5 rounded-full text-sm transition ${
      active
        ? "bg-indigo-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Blog Post Headlines Performance
      </h1>
      <Link href="/team/blog/add" className="mb-6 inline-block">
        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add New Blog Post
        </span>
      </Link>

      {/* Filter posts by website */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/team/blog" className={pillClass(!website)}>
          All Websites
        </Link>
        {websites.map((site) => (
          <Link
            key={site._id}
            href={`/team/blog?website=${site._id}`}
            className={pillClass(website === site._id)}
          >
            {site.name}
          </Link>
        ))}
      </div>

      <div className="space-y-10">
        {posts.map((post) => {
          const postSite = websiteById[post.websiteId];
          return (
            <div
              key={post._id}
              className="border rounded-xl p-6 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-400">
                    Post: {post.headlines[0]?.text || "Untitled"}
                  </h2>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                      postSite
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {postSite
                      ? `${postSite.name} (${postSite.domain})`
                      : "No website assigned"}
                  </span>
                </div>
                <CopyToWebsiteButton
                  postId={post._id}
                  postTitle={post.headlines[0]?.text}
                  currentWebsiteId={post.websiteId}
                  websites={websites}
                />
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500 text-sm">
                    <th className="pb-2">Headline Variation</th>
                    <th className="pb-2">Impressions</th>
                    <th className="pb-2">Clicks</th>
                    <th className="pb-2">CTR (%)</th>
                    <th className="pb-2">Action</th>
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
                        <td className="py-4 font-medium">{h.text}</td>
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
                        <td>
                          <Link
                            href={`/team/blog/${post._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            View Post
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
        {posts.length === 0 && (
          <div className="text-gray-500 border rounded-xl p-10 bg-white text-center">
            No blog posts {website ? "for this website" : ""} yet.
          </div>
        )}
      </div>
    </div>
  );
}
