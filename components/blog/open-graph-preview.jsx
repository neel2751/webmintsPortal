import { useWatch, useFormContext } from "react-hook-form";

function truncate(text, max) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 3) + "..." : text;
}

export function OpenGraphPreview({
  baseUrl = "http://localhost:3000/blog",
  defaultImage = "/opengraph-image.png",
}) {
  const { control } = useFormContext();

  const headlines = useWatch({ control, name: "headlines" }) || [];
  const primaryHeadlineIndex =
    useWatch({ control, name: "primaryHeadline" }) ?? 0;

  const metaTitle = useWatch({ control, name: "metaTitle" });
  const metaDescription = useWatch({ control, name: "metaDescription" });

  const ogTitleField = useWatch({ control, name: "ogTitle" });
  const ogDescriptionField = useWatch({ control, name: "ogDescription" });
  const ogImageField = useWatch({ control, name: "ogImage" });
  //   const slug = useWatch({ control, name: "slug" }) || "your-blog-slug";

  const ogTitle =
    ogTitleField ||
    metaTitle ||
    headlines[primaryHeadlineIndex] ||
    headlines[0] ||
    "Your Blog Title";

  // slug we have to generate from headline
  const slug =
    ogTitle
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "your-blog-slug";

  const ogDescription =
    ogDescriptionField ||
    metaDescription ||
    "Your description will appear here when shared on social media.";

  const ogImage = ogImageField ? ogImageField?.url : defaultImage;

  const fullUrl = `${baseUrl}/${slug}`;

  return (
    <div className="border rounded-lg overflow-hidden bg-white max-w-xl">
      <p className="text-sm text-gray-500 p-3 border-b">
        Open Graph Preview (Facebook / LinkedIn)
      </p>

      {/* Image */}
      <div className="w-full h-[220px] bg-gray-100 overflow-hidden">
        <img
          src={ogImage}
          alt="Open Graph Preview"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-3 space-y-1">
        <p className="text-xs uppercase text-gray-500">
          {new URL(baseUrl).hostname}
        </p>

        <h3 className="font-semibold text-gray-900 leading-snug">
          {truncate(ogTitle, 95)}
        </h3>

        <p className="text-sm text-gray-600 leading-snug">
          {truncate(ogDescription, 140)}
        </p>

        <p className="text-xs text-gray-500 pt-1">{fullUrl}</p>
      </div>
    </div>
  );
}
