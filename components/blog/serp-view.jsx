import { useFormContext } from "react-hook-form";

function truncate(text, max) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 3) + "..." : text;
}

export function SerpPreview({ baseUrl = "http://localhost:3000/blog" }) {
  const { watch } = useFormContext();

  const headlines = watch("headlines") || [];
  const primaryHeadlineIndex = watch("primaryHeadline") ?? 0;

  const title =
    headlines[primaryHeadlineIndex] || headlines[0] || "Your Blog Title Here";
  const slug = watch("slug") || "your-blog-slug";
  const metaDescription =
    watch("metaDescription") ||
    "Your meta description will appear here in Google search results.";

  const fullUrl = `${baseUrl}/${slug}`;

  const titlePreview = truncate(title, 60);
  const descPreview = truncate(metaDescription, 160);

  return (
    <div className="border rounded-lg p-4 bg-white space-y-2 max-w-xl">
      <p className="text-sm text-gray-500">Google Preview</p>

      {/* Title */}
      <h3 className="text-blue-700 text-lg leading-snug font-medium hover:underline cursor-pointer">
        {titlePreview || "Your Blog Title Here"}
      </h3>

      {/* URL */}
      <p className="text-green-700 text-sm">{fullUrl}</p>

      {/* Description */}
      <p className="text-gray-700 text-sm leading-snug">{descPreview}</p>

      {/* Counters */}
      <div className="flex flex-wrap gap-4 text-xs pt-2">
        <span
          className={
            titlePreview.length > 60 ? "text-red-600" : "text-gray-600"
          }
        >
          Title Length: {titlePreview.length}/60
        </span>
        <span
          className={
            descPreview.length > 160
              ? "text-red-600"
              : descPreview.length < 120
              ? "text-yellow-600"
              : "text-gray-600"
          }
        >
          Description Length: {descPreview.length}/160
        </span>
      </div>
    </div>
  );
}
