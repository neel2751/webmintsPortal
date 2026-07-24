import { getCategories } from "@/server/blogServer/blogServer";
import { resolveWebsite, withCors, handleOptions } from "@/lib/api-guard";

export async function GET() {
  // Only the categories actually used by the resolved website's posts.
  const { website, denied } = await resolveWebsite();
  if (denied) return withCors(denied);

  try {
    // publishedOnly — only categories with live posts on this website.
    const categories = await getCategories(website._id, true);
    return withCors(Response.json({ categories }, { status: 200 }));
  } catch (error) {
    console.error("Error in Categories GET API:", error);
    return withCors(
      Response.json({ error: "Internal server error" }, { status: 500 })
    );
  }
}

export async function OPTIONS() {
  return handleOptions();
}
