import {
  getBlogPostBySlug,
  incrementHeadlineImpression,
  pickHeadline,
} from "@/server/blogServer/blogServer";
import { cookies } from "next/headers";
import { resolveWebsite, withCors, handleOptions } from "@/lib/api-guard";

export async function GET(request, { params }) {
  // Read-only blog content hit from the visitor's browser (it sets the
  // headline A/B-test cookie cross-site) — resolve the website from the
  // Origin/Referer (or ?site=<domain>) instead of demanding an API key,
  // and only serve that website's post.
  const url = new URL(request.url);
  const { website, denied } = await resolveWebsite({
    requireKey: false,
    siteParam: url.searchParams.get("site"),
  });
  if (denied) return withCors(denied);

  const { slug } = await params;
  const cookieStore = await cookies();

  try {
    // publishedOnly — a draft's slug must 404 on the public site.
    const blog = await getBlogPostBySlug(slug, website._id, true);
    if (!blog.success) {
      return withCors(
        Response.json({ error: "Blog post not found" }, { status: 404 })
      );
    }

    const cookieKey = `blog_${blog.post._id}_headline`;
    const existingHeadlineId = cookieStore.get(cookieKey)?.value;

    let selectedHeadline;
    if (existingHeadlineId) {
      selectedHeadline = blog.post.headlines.find(
        (h) => h._id.toString() === existingHeadlineId
      );
    }
    if (!selectedHeadline) {
      selectedHeadline = await pickHeadline(blog.post.headlines);
      // Set cookie for future requests. SameSite=None requires Secure or
      // browsers silently drop the cookie (localhost is exempt).
      cookieStore.set(cookieKey, selectedHeadline._id.toString(), {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: `/`,
        maxAge: 60 * 60 * 24, // 1 day
      });

      // count impression ONCE
      await incrementHeadlineImpression(blog.post._id, selectedHeadline._id);
    }

    blog.post.headlines = selectedHeadline;
    return withCors(Response.json({ data: blog.post }, { status: 200 }));
  } catch (error) {
    console.error("Error in Blog Slug GET API:", error);
    return withCors(
      Response.json({ error: "Internal server error" }, { status: 500 })
    );
  }
}

export async function OPTIONS() {
  return handleOptions();
}
