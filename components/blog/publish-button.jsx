"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Rocket, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setBlogPostStatus } from "@/server/blogServer/blogServer";

// Publish / unpublish a post straight from the blog list card.
export default function PublishButton({ postId, status }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const isPublished = status === "published";

  const handleClick = async () => {
    setIsPending(true);
    const res = await setBlogPostStatus(
      postId,
      isPublished ? "draft" : "published"
    );
    setIsPending(false);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message || "Failed to update status");
    }
  };

  return (
    <Button
      variant={isPublished ? "outline" : "default"}
      size="sm"
      disabled={isPending}
      onClick={handleClick}
      className={
        isPublished
          ? "text-amber-700 hover:text-amber-800"
          : "bg-green-600 hover:bg-green-700 text-white"
      }
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
      ) : isPublished ? (
        <Undo2 className="h-3.5 w-3.5 mr-1" />
      ) : (
        <Rocket className="h-3.5 w-3.5 mr-1" />
      )}
      {isPending
        ? "Saving..."
        : isPublished
        ? "Unpublish"
        : "Publish Now"}
    </Button>
  );
}
