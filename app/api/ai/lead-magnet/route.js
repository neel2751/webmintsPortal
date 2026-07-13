import { generateLeadMagnetTitle } from "@/server/aiServer/ai-genetor";
import { apiGuard } from "@/lib/api-guard";

export async function POST(req) {
  // Every call costs Gemini quota — require the API key.
  const denied = await apiGuard();
  if (denied) return denied;

  try {
    const { category, title } = await req.json();
    const text = await generateLeadMagnetTitle(category, title);
    return Response.json({ offerTitle: text.trim() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json(
      { offerTitle: "Our Exclusive Weekly Guide" },
      { status: 500 }
    );
  }
}
