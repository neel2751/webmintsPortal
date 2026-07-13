"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CopyPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { copyBlogToWebsite } from "@/server/blogServer/blogServer";

export default function CopyToWebsiteButton({
  postId,
  postTitle,
  currentWebsiteId,
  websites = [],
}) {
  const [open, setOpen] = useState(false);
  const [targetId, setTargetId] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const router = useRouter();

  const targets = websites.filter(
    (site) => site._id !== String(currentWebsiteId || "")
  );

  const handleCopy = async () => {
    if (!targetId) {
      toast.error("Select a website first");
      return;
    }
    setIsCopying(true);
    const res = await copyBlogToWebsite(postId, targetId);
    setIsCopying(false);
    if (res.success) {
      toast.success(res.message);
      setOpen(false);
      setTargetId("");
      router.refresh();
    } else {
      toast.error(res.message || res.error || "Copy failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CopyPlus className="h-3.5 w-3.5 mr-1" />
          Copy to Website
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Copy blog post to another website</DialogTitle>
          <DialogDescription>
            {postTitle ? `“${postTitle}” ` : "This post "}is duplicated as a
            draft on the selected website with fresh A/B-test stats.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger>
              <SelectValue placeholder="Select target website" />
            </SelectTrigger>
            <SelectContent>
              {targets.map((site) => (
                <SelectItem key={site._id} value={site._id}>
                  {site.name} ({site.domain})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {targets.length === 0 && (
            <p className="text-sm text-neutral-500 mt-2">
              No other website available — add one in the admin panel first.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={isCopying || !targetId}
            onClick={handleCopy}
          >
            {isCopying ? "Copying..." : "Copy Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
