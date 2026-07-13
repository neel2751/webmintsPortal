import { getAllSubscribers } from "@/server/blogServer/subscriberServer";

export default async function SubscriberPage() {
  const subscriber = await getAllSubscribers();
  return (
    <div>
      SubscriberPage
      <pre>{JSON.stringify(subscriber, null, 2)}</pre>
    </div>
  );
}
