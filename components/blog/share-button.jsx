"use client";
import { Link2, Linkedin, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: title,
    url: url,
  };

  // Native Share for Mobile (WhatsApp/System Menu)
  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        copyToClipboard();
      }
    } catch (err) {
      console.log("Error sharing", err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 my-10 py-6 border-y border-[var(--editor-border-default)]">
      <span className="text-sm font-semibold uppercase tracking-wider text-[var(--editor-text-gray)]">
        Share this article
      </span>
      <div className="flex items-center gap-3">
        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-[#0077b5] text-white hover:opacity-90 transition-opacity"
          title="Share on LinkedIn"
        >
          <Linkedin size={20} />
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity"
          title="Share on WhatsApp"
        >
          <MessageCircle size={20} />
        </a>

        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 text-[var(--editor-text-default)] hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors relative"
          title="Copy Link"
        >
          {copied ? (
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
              Copied!
            </span>
          ) : null}
          <Link2 size={20} />
        </button>

        {/* Mobile System Share */}
        <button
          onClick={handleNativeShare}
          className="p-3 rounded-full bg-[var(--editor-text-blue)] text-white sm:hidden"
          title="More Share Options"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}
