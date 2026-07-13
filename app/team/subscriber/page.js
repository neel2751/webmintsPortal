import { getAllSubscribers } from "@/server/blogServer/subscriberServer";

// Auth-gated page — must not be statically prerendered at build time.
export const dynamic = "force-dynamic";

export default async function SubscriberPage() {
  const subscriber = await getAllSubscribers();
  return (
    <div>
      SubscriberPage
      <pre>{JSON.stringify(subscriber, null, 2)}</pre>
    </div>
  );
}
