import { getBlogPosts } from "@/server/blogServer/blogServer";
import { resolveWebsite, withCors, handleOptions } from "@/lib/api-guard";

export async function GET(req) {
  // Server-to-server: the x-api-key must belong to a registered website,
  // and only that website's posts are returned.
  const { website, denied } = await resolveWebsite();
  if (denied) return withCors(denied);

  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  try {
    // publishedOnly — drafts and archived posts never leave the CMS.
    const blogs = await getBlogPosts(category, website._id, true);
    if (!blogs.success) {
      return withCors(
        Response.json({ error: "Failed to fetch blog posts" }, { status: 500 })
      );
    }
    return withCors(Response.json({ blogs: blogs.posts }, { status: 200 }));
  } catch (error) {
    console.error("Error in Blog GET API:", error);
    return withCors(
      Response.json({ error: "Internal server error" }, { status: 500 })
    );
  }
}

export async function OPTIONS() {
  return handleOptions();
}
