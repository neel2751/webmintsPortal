"use server";

import { connect } from "@/db/db";
import BlogPostModel from "@/models/blogModel";
import WebsiteModel from "@/models/websiteModel";
import { revalidatePath } from "next/cache";
import { archiveMedia } from "../mediaServer/mediaServer";
import { createObjectId, isValidObjectId } from "@/helper/mongooseHelper";
import { requireRole } from "@/lib/require-role";
import { TEAM_ROLES } from "@/lib/permissions";

export async function sanitizeInput(input) {
  switch (typeof input) {
    case "string":
      return input
        .replace(/<script.*?>.*?<\/script>/gi, "")
        .replace(/on\w+=".*?"/gi, "")
        .replace(/[^0-9+\-\s()]/g, "")
        .replace(/(https?:\/\/[^\s]+)/g, "")
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "")
        .replace(/<.*?>/g, "");
    case "object":
      if (Array.isArray(input)) {
        return Promise.all(input.map(sanitizeInput));
      } else if (input !== null) {
        const sanitizedObject = {};
        for (const key in input) {
          sanitizedObject[key] = await sanitizeInput(input[key]);
        }
        return sanitizedObject;
      }
      return input;
    default:
      return input;
  }
}

export async function addBlogPost(data) {
  // console.log("Adding blog post with data:", data);
  // return { success: false, error: "Disabled for now" };

  try {
    await requireRole(TEAM_ROLES);
    await connect();

    if (!data.websiteId || !isValidObjectId(data.websiteId)) {
      return { success: false, error: "Please select a website for this post" };
    }
    const websiteExists = await WebsiteModel.exists({ _id: data.websiteId });
    if (!websiteExists) {
      return { success: false, error: "Selected website not found" };
    }

    const slug = data.headlines[0]
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    data.slug = slug;
    data.summary = data.description;
    data.contentJson = data.description; // Store the original content structure for future use (e.g., editing)
    data.contentHtml = data.description; // For now, we can just use the description as the HTML content. In a real app, you'd convert the rich text to HTML.
    // data.contentHtml = data.content.html;
    // data.contentJson = data.content.json;

    const seo = {
      metaTitle: data.metaTitle || data.headlines[0],
      metaDescription: data.metaDescription || data.description,
      keywords: data.metaKeywords || data.tags || [],
      ogImage: data.ogImage,
    };
    data.seo = seo;
    // console.log("Adding blog post with data:", data);
    // return { success: false, error: "Disabled for now" };

    if (data._id) {
      return await updateBlogPost(data._id, data);
    }

    const duplicate = await BlogPostModel.findOne({
      websiteId: data.websiteId,
      slug,
    });
    if (duplicate) {
      return {
        success: false,
        error: "A post with this title already exists on that website",
      };
    }

    data.headlines = data.headlines.map((headline) => {
      return {
        text: headline.trim(),
      };
    });

    const cleanData = JSON.parse(JSON.stringify(data));

    const newPost = new BlogPostModel(cleanData);
    await newPost.save();
    return { success: true, message: "Blog post added successfully" };
  } catch (error) {
    console.error("Error adding blog post:", error);
    return { success: false, error: error.message };
  }
}

export async function updateBlogPost(postId, data) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();

    // fetech old post to compare headlines
    const existingPost = await BlogPostModel.findById(postId);
    if (!existingPost) {
      return { success: false, message: "Blog post not found" };
    }
    if (
      existingPost.headlines.map((h) => h.text).join(",") !==
      data.headlines.join(",")
    ) {
      // if headlines changed, reset impressions and clicks
      data.headlines = data.headlines.map((headline) => {
        return {
          text: headline.trim(),
          impressions: 0,
          clicks: 0,
        };
      });
    } else {
      // if headlines didn't change, keep the old impressions and clicks
      data.headlines = existingPost.headlines.map((h) => {
        return {
          text: h.text,
          impressions: h.impressions,
          clicks: h.clicks,
        };
      });
    }

    if (existingPost.slug !== data.slug) {
      const slug = data.headlines[0]
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      data.slug = slug;
    }

    // Keep the post on its website unless a valid new one was chosen.
    if (data.websiteId && !isValidObjectId(data.websiteId)) {
      return { success: false, message: "Invalid website selected" };
    }
    data.websiteId = data.websiteId || existingPost.websiteId;

    // findByIdAndUpdate skips unique validation, so check the per-site
    // slug collision explicitly.
    const slugClash = await BlogPostModel.findOne({
      websiteId: data.websiteId,
      slug: data.slug,
      _id: { $ne: postId },
    });
    if (slugClash) {
      return {
        success: false,
        message: "A post with this title already exists on that website",
      };
    }

    if (existingPost?.coverImage?.mediaId !== data?.coverImage?.mediaId) {
      // if cover image changed, update it. Otherwise keep the old one to avoid unnecessary updates
      await archiveMedia(existingPost?.coverImage?.mediaId);
      data.coverImage = data.coverImage;
    }
    if (existingPost?.seo?.ogImage?.mediaId !== data?.ogImage?.mediaId) {
      // if og image changed, update it. Otherwise keep the old one to avoid unnecessary updates
      await archiveMedia(existingPost?.seo?.ogImage?.mediaId);
      data.seo = {
        metaTitle: data.metaTitle || data.headlines[0],
        metaDescription: data.metaDescription || data.description,
        keywords: data.metaKeywords || data.tags || [],
        ogImage: data.ogImage,
      };
    } else {
      data.seo = {
        metaTitle: data.metaTitle || data.headlines[0],
        metaDescription: data.metaDescription || data.description,
        keywords: data.metaKeywords || data.tags || [],
        ogImage: existingPost?.seo?.ogImage,
      };
    }

    const contentHtml = data.content.html;
    const contentJson = data.content.json;
    data.contentHtml = contentHtml;
    data.contentJson = contentJson;

    const cleanData = JSON.parse(JSON.stringify(data));

    const updatedPost = await BlogPostModel.findByIdAndUpdate(
      postId,
      cleanData,
      { new: true }
    );

    if (updatedPost) {
      // Clear the cache so the frontend updates immediately
      revalidatePath(`/team/blog/`);
      return { success: true, message: "Blog post updated successfully" };
    } else {
      return { success: false, message: "Blog post not found" };
    }
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { success: false, error: error.message };
  }
}

export async function recordHeadlineClick(postId, headlineId) {
  try {
    await connect();
    await BlogPostModel.updateOne(
      { _id: postId, "headlines._id": headlineId },
      { $inc: { "headlines.$.clicks": 1 } }
    );
    return { success: true };
  } catch (error) {
    console.error("Error recording headline click:", error);
    return { success: false, error: error.message };
  }
}

export async function pickHeadline(headlines) {
  const active = headlines.filter((h) => h.isActive && !h.isDeleted);

  // 1️⃣ Still testing new headlines
  const untested = active.filter((h) => h.impressions === 0);

  if (untested.length > 0) {
    return untested[Math.floor(Math.random() * untested.length)];
  }

  // 2️⃣ All tested → weighted CTR selection
  const weighted = active.map((h) => {
    const ctr = h.clicks / h.impressions;
    return { ...h, weight: ctr };
  });

  const totalWeight = weighted.reduce((sum, h) => sum + h.weight, 0);

  let rand = Math.random() * totalWeight;

  for (const h of weighted) {
    if (rand < h.weight) return h;
    rand -= h.weight;
  }

  return weighted[0]; // fallback
}

export async function getBlogPosts(category = "All", websiteId = null) {
  try {
    await connect();
    let query = {};
    if (category && category !== "All") {
      query.category = category;
    }
    if (websiteId) {
      query.websiteId = websiteId;
    }
    const posts = await BlogPostModel.find(query).sort({ createdAt: -1 });
    // we have to pick one headline to show for each post
    // const postsWithHeadlines = await Promise.all(
    //   posts.map(async (post) => {
    //     const bestHeadline = await pickHeadline(post.headlines);
    //     return {
    //       ...post._doc,
    //       headlines: bestHeadline,
    //     };
    //   })
    // );
    return {
      success: true,
      posts: JSON.parse(JSON.stringify(posts)),
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { success: false, error: error.message };
  }
}

export async function getBlogPostBySlug(slug, websiteId = null) {
  try {
    await connect();
    const query = { slug };
    if (websiteId) {
      query.websiteId = websiteId;
    }
    const data = await BlogPostModel.findOne(query);
    //we have to pick one headline to show
    // const bestHeadline = await pickHeadline(data.headlines);
    // const newData = {
    //   ...data._doc,
    //   headlines: bestHeadline,
    // };
    if (data) {
      return { success: true, post: JSON.parse(JSON.stringify(data)) };
    } else {
      return { success: false, message: "Blog post not found" };
    }
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return { success: false, error: error.message };
  }
}

export async function getBlogPostById(id) {
  try {
    await connect();
    const data = await BlogPostModel.findById(id).lean();
    if (data) {
      return { success: true, post: JSON.parse(JSON.stringify(data)) };
    } else {
      return { success: false, message: "Blog post not found" };
    }
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return { success: false, error: error.message };
  }
}

export async function incrementHeadlineImpression(postId, headlineId) {
  try {
    await connect();
    await BlogPostModel.updateOne(
      { _id: postId, "headlines._id": headlineId },
      { $inc: { "headlines.$.impressions": 1 } }
    );
    return { success: true };
  } catch (error) {
    console.error("Error incrementing headline impression:", error);
    return { success: false, error: error.message };
  }
}

export async function promoteHeadline(postId, winnerIndex) {
  await requireRole(TEAM_ROLES);
  await connect();

  const post = await BlogPostModel.findById(postId);
  if (!post) throw new Error("Post not found");

  const winningHeadline = post.headlines[winnerIndex];

  // Update the post:
  // 1. Set the main title to the winning text
  // 2. Clear the headlines array or mark the winner
  await BlogPostModel.findByIdAndUpdate(postId, {
    $set: {
      title: winningHeadline.text,
      headlines: [
        {
          text: winningHeadline.text,
          impressions: winningHeadline.impressions,
          clicks: winningHeadline.clicks,
          isWinner: true,
        },
      ],
    },
  });

  // Clear the cache so the frontend updates immediately
  revalidatePath(`/team/blog/`);
}

// Categories are a shared taxonomy: call with no argument for the global
// list (authoring suggestions); pass a websiteId to get only the categories
// actually used by that site's posts (public API).
export async function getCategories(websiteId = null) {
  try {
    await connect();
    const categories = await BlogPostModel.distinct(
      "category",
      websiteId ? { websiteId } : {}
    );
    return {
      success: true,
      categories: JSON.parse(JSON.stringify(categories)),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: error.message };
  }
}

export async function getRelatedPosts(category, slug, websiteId = null) {
  await connect();

  const query = {
    category: category,
    slug: { $ne: slug },
    // status: "published",
  };
  if (websiteId) {
    query.websiteId = websiteId;
  }
  return await BlogPostModel.find(query)
    .sort({ createdAt: -1 })
    .limit(3) // Keep it clean—only show the top 3
    .select("headlines slug url mediaId summary createdAt")
    .lean();
}

// Duplicate a post onto another website as a fresh draft. A/B stats, views
// and winner flags are reset — the copy starts its own experiment.
export async function copyBlogToWebsite(postId, targetWebsiteId) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();

    if (!isValidObjectId(postId) || !isValidObjectId(targetWebsiteId)) {
      return { success: false, message: "Invalid post or website id" };
    }

    const source = await BlogPostModel.findById(postId);
    if (!source) {
      return { success: false, message: "Blog post not found" };
    }
    if (String(source.websiteId) === String(targetWebsiteId)) {
      return { success: false, message: "Post already belongs to that website" };
    }

    const target = await WebsiteModel.findOne({
      _id: targetWebsiteId,
      isActive: true,
    });
    if (!target) {
      return { success: false, message: "Target website not found" };
    }

    const clash = await BlogPostModel.findOne({
      websiteId: targetWebsiteId,
      slug: source.slug,
    });
    if (clash) {
      return {
        success: false,
        message: `A post with slug "${source.slug}" already exists on ${target.name}`,
      };
    }

    const doc = source.toObject();
    delete doc._id;
    delete doc.createdAt;
    delete doc.updatedAt;
    delete doc.__v;

    doc.websiteId = targetWebsiteId;
    doc.headlines = source.headlines
      .filter((h) => !h.isDeleted)
      .map((h) => ({ text: h.text }));
    doc.countViews = 0;
    doc.status = "draft";
    // Media stays shared by URL only: without mediaId, editing one copy's
    // image can't archive the file the other copy still uses.
    if (doc.coverImage) delete doc.coverImage.mediaId;
    if (doc.seo?.ogImage) delete doc.seo.ogImage.mediaId;

    await new BlogPostModel(doc).save();
    revalidatePath("/team/blog/");
    return { success: true, message: `Copied to ${target.name} as a draft` };
  } catch (error) {
    console.error("Error copying blog post:", error);
    return { success: false, message: error.message };
  }
}
