"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GlobalForm } from "../form/global-form";
import { addBlogPost } from "@/server/blogServer/blogServer";
import { generateBlogHeadlines } from "@/server/aiServer/ai-genetor";
import { OpenGraphPreview } from "./open-graph-preview";
import { SerpPreview } from "./serp-view";
import { SeoScorePanel } from "./score-seo";
import { FinalSeoSummary } from "./final-seo-summary";
import { KeywordDensityPanel } from "./keyword-density";
import { CategoryField } from "./category-field";
import { WebsiteField } from "./website-field";

const buildFields = (websites, categories) => [
  {
    title: "Blog Post Details",
    fields: [
      {
        name: "websiteIds",
        type: "custom",
        size: true,
        component: WebsiteField,
        props: { websites },
      },
      {
        name: "headlines",
        labelText: "Title",
        type: "multiple",
        max: 5,
        ai: {
          fn: async () => await generateBlogHeadlines("Test"),
          dependsOn: ["content"], // which fields to send as context
          label: "Generate 5 Headlines",
          limit: 5,
        },
        placeholder: "Enter Title",
        helperText: "Add up to 5 headlines for A/B testing",
        validationOptions: {
          required: "Title is required",
          minLength: {
            value: 3,
            message: "Minimum 3 characters required",
          },
          maxLength: {
            value: 100,
            message: "Maximum 100 characters allowed",
          },
        },
      },
      // add the slug field here but readonly and auto generated from the title
      // {
      //   name: "slug",
      //   labelText: "Slug",
      //   type: "text",
      //   placeholder: "Auto-generated Slug",
      //   readOnly: true,
      //   dependentOn: ["headlines"],
      //   generateValue: (title) =>
      //     title[0]
      //       ?.toLowerCase()
      //       .trim()
      //       .replace(/[^a-z0-9]+/g, "-")
      //       .replace(/^-+|-+$/g, ""),
      //   validationOptions: {
      //     required: "Slug is required",
      //     pattern: {
      //       value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      //       message:
      //         "Slug can only contain lowercase letters, numbers, and hyphens",
      //     },
      //   },
      // },
      {
        name: "description",
        labelText: "Description",
        type: "text",
        placeholder: "Enter Description",
        size: true,
        validationOptions: {
          required: "Description is required",
          minLength: {
            value: 3,
            message: "Minimum 3 characters required",
          },
          maxLength: {
            value: 20,
            message: "Maximum 20 characters allowed",
          },
        },
      },
      // we have to add the image upload field here
      {
        name: "coverImage",
        labelText: "Cover Image",
        type: "image",
        placeholder: "Upload Cover Image",
        acceptedFileTypes: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] }, // we can accept the mp4 also
        maxFileSize: 1024 * 1024 * 1, // 1 MB — same cap as every blog image
        maxFiles: 1,
        access: "public",
        uploadPath: "blog",
        helperText: "Maximum size: 1 MB",
        validationOptions: {
          required: "Cover Image is required",
        },
      },
      // content field as textarea
      {
        name: "content",
        labelText: "Content",
        type: "richtext",
        placeholder: "Enter Content",
        size: true,
        validationOptions: {
          required: "Content is required",
          minLength: {
            value: 10,
            message: "Minimum 10 characters required",
          },
        },
      },
      // category with existing-category suggestions (avoids duplicates)
      {
        name: "category",
        type: "custom",
        size: true,
        component: CategoryField,
        props: { categories },
      },
    ],
  },
  {
    title: "SEO Details",
    fields: [
      {
        name: "metaTitle",
        labelText: "Meta Title",
        type: "text",
        placeholder: "Enter Meta Title",
        validationOptions: {
          required: "Meta Title is required",
          minLength: {
            value: 3,
            message: "Minimum 3 characters required",
          },
          maxLength: {
            value: 60,
            message: "Maximum 60 characters allowed",
          },
        },
      },
      // we have to add the conical the tag here for the SEO
      {
        name: "canonicalUrl",
        labelText: "Canonical URL",
        type: "url",
        placeholder: "Enter Canonical URL",
        validationOptions: {
          pattern: {
            value:
              /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
            message: "Please enter a valid URL",
          },
        },
      },
      {
        name: "ogImage",
        labelText: "Open Graph Image",
        type: "image",
        placeholder: "Upload Open Graph Image",
        acceptedFileTypes: ["image/jpeg", "image/png", "image/webp"], // we can accept the mp4 also
        maxFileSize: 1024 * 1024 * 1, // 1 MB
        maxFiles: 1,
        access: "public",
        uploadPath: "blog/og",
        helperText: "Recommended size: 1200x630 pixels — maximum 1 MB",
        validationOptions: {
          required: "Open Graph is required",
        },
      },

      {
        name: "metaDescription",
        labelText: "Meta Description",
        type: "textarea",
        placeholder: "Enter Meta Description",
        validationOptions: {
          required: "Meta Description is required",
          minLength: {
            value: 10,
            message: "Minimum 10 characters required",
          },
          maxLength: {
            value: 160,
            message: "Maximum 160 characters allowed",
          },
        },
      },
      // keywords field as tag input
      {
        name: "tags",
        labelText: "Keywords",
        type: "tag",
        placeholder: "Enter Keywords",
        validationOptions: {
          required: "At least one keyword is required",
        },
      },

      // toggle for the isPublished
      {
        name: "isPublished",
        labelText: "Publish Now",
        type: "switch",
        defaultValue: false,
      },
    ],
  },
  {
    title: "Previews",
    fields: [
      {
        name: "serpPreview",
        type: "custom",
        component: SerpPreview,
        props: {
          baseUrl: "http://localhost:3000/blog",
        },
      },
      // {
      //   name: "headlineSeoScore",
      //   type: "custom",
      //   component: () => (
      //     <SeoScorePanel
      //       name="headlines"
      //       primaryFieldName="primaryHeadline"
      //       title="Headline Performance"
      //       type="headline"
      //     />
      //   ),
      // },
      // {
      //   name: "metaTitleSeoScore",
      //   type: "custom",
      //   component: () => (
      //     <SeoScorePanel
      //       name="metaTitle"
      //       title="Meta Title Score"
      //       type="headline" // Similar length rules to headlines
      //     />
      //   ),
      // },
      {
        name: "ogPreview",
        type: "custom",
        component: OpenGraphPreview,
        props: {
          baseUrl: "http://localhost:3000/blog",
        },
      },
    ],
  },
  // {
  //   title: "Before Publishing",
  //   fields: [
  //     {
  //       name: "finalSeoSummary",
  //       type: "custom",
  //       component: FinalSeoSummary,
  //     },
  //     {
  //       name: "keywordDensity",
  //       type: "custom",
  //       component: KeywordDensityPanel,
  //     },
  //     {
  //       name: "focusKeyword",
  //       labelText: "Focus Keyword",
  //       type: "text",
  //       placeholder: "e.g. best seo tools",
  //       helperText: "Main keyword you want this post to rank for",
  //     },
  //   ],
  // },
];

export default function BlogForm({
  intitalData = {},
  websites = [],
  categories = [],
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const isEditing = Boolean(intitalData?._id);

  const groupedFields = React.useMemo(
    () => buildFields(websites, categories),
    [websites, categories]
  );

  const createBlogPost = async (data) => {
    setIsSaving(true);
    try {
      const res = await addBlogPost(data);
      if (res?.success) {
        toast.success(
          res.message ||
            (isEditing
              ? "Blog post updated successfully"
              : "Blog post added successfully")
        );
        router.push("/team/blog");
        router.refresh();
      } else {
        toast.error(
          res?.error || res?.message || "Failed to save the blog post"
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to save the blog post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* {JSON.stringify(intitalData, null, 2)} */}
      <GlobalForm
        groupedFields={groupedFields}
        btnName={isEditing ? "Update Blog Post" : "Add Blog Post"}
        onSubmit={createBlogPost}
        initialValues={intitalData}
        isLoading={isSaving}
      />
    </div>
  );
}
