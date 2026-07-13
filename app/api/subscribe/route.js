import { handleSubscription } from "@/server/blogServer/subscriberServer";
import { apiGuard } from "@/lib/api-guard";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req) {
  // Same protection as /api/submit-form: allowed origin + API key.
  const denied = await apiGuard({ requireOrigin: true });
  if (denied) return denied;

  try {
    const { id, email, source, postTitle } = await req.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return Response.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const subsciption = await handleSubscription({
      id,
      email: email.toLowerCase().trim(),
      source,
      postTitle,
    });
    return Response.json({ subscription: subsciption }, { status: 200 });
  } catch (error) {
    console.error("Error in Subscription POST API:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
