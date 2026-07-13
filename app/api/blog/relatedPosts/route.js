import { getRelatedPosts } from "@/server/blogServer/blogServer";
import { resolveWebsite, withCors, handleOptions } from "@/lib/api-guard";

export async function GET(request) {
  // Read-only blog content hit from the visitor's browser — resolve the
  // website from the Origin/Referer (or ?site=<domain>) instead of an API
  // key, and only return related posts from that same website.
  const { searchParams } = new URL(request.url);
  const { website, denied } = await resolveWebsite({
    requireKey: false,
    siteParam: searchParams.get("site"),
  });
  if (denied) return withCors(denied);

  const slug = searchParams.get("slug");
  const category = searchParams.get("category");
  try {
    const posts = await getRelatedPosts(category, slug, website._id);
    return withCors(
      new Response(
        JSON.stringify({
          success: true,
          posts: JSON.parse(JSON.stringify(posts)),
        }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Error fetching related blog posts:", error);
    return withCors(
      new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
      })
    );
  }
}

export async function OPTIONS() {
  return handleOptions();
}
