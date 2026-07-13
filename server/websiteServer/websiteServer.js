"use server";

import { connect } from "@/db/db";
import WebsiteModel from "@/models/websiteModel";
import BlogPostModel from "@/models/blogModel";
import { requireRole } from "@/lib/require-role";
import { ADMIN_ONLY, TEAM_ROLES } from "@/lib/permissions";
import { normalizeHost } from "@/lib/website-utils";
import { isValidObjectId } from "@/helper/mongooseHelper";

function normalizeExtraDomains(extraDomains) {
  if (!Array.isArray(extraDomains)) return [];
  return [...new Set(extraDomains.map(normalizeHost).filter(Boolean))];
}

export async function getAllWebsites() {
  try {
    await requireRole(ADMIN_ONLY);
    await connect();
    const websites = await WebsiteModel.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: JSON.stringify(websites) };
  } catch (error) {
    console.error("Error fetching websites:", error);
    return { success: false, message: error.message };
  }
}

// Feeds the authoring UI — never exposes apiKey to team-role users.
export async function getActiveWebsites() {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const websites = await WebsiteModel.find({ isActive: true })
      .select("name domain")
      .sort({ name: 1 })
      .lean();
    return { success: true, data: JSON.stringify(websites) };
  } catch (error) {
    console.error("Error fetching active websites:", error);
    return { success: false, message: error.message };
  }
}

export async function createWebsite(params) {
  try {
    await requireRole(ADMIN_ONLY);

    const name = (params?.name || "").trim();
    const domain = normalizeHost(params?.domain);
    const extraDomains = normalizeExtraDomains(params?.extraDomains);

    if (!name || !domain) {
      return { success: false, message: "Name and domain are required" };
    }

    await connect();
    const existing = await WebsiteModel.findOne({
      $or: [{ domain }, { extraDomains: domain }],
    });
    if (existing) {
      return {
        success: false,
        message: `Domain ${domain} is already used by ${existing.name}`,
      };
    }

    const website = new WebsiteModel({
      name,
      domain,
      extraDomains,
      apiKey: crypto.randomUUID(),
    });
    await website.save();
    return {
      success: true,
      message: `Website ${name} created — copy its API key from the table`,
      data: JSON.stringify(website.toObject()),
    };
  } catch (error) {
    console.error("Error creating website:", error);
    return { success: false, message: error.message };
  }
}

export async function updateWebsite({ id, name, domain, extraDomains }) {
  try {
    await requireRole(ADMIN_ONLY);

    if (!isValidObjectId(id)) {
      return { success: false, message: "Invalid website id" };
    }
    const normalizedDomain = normalizeHost(domain);
    const trimmedName = (name || "").trim();
    if (!trimmedName || !normalizedDomain) {
      return { success: false, message: "Name and domain are required" };
    }

    await connect();
    const clash = await WebsiteModel.findOne({
      _id: { $ne: id },
      $or: [{ domain: normalizedDomain }, { extraDomains: normalizedDomain }],
    });
    if (clash) {
      return {
        success: false,
        message: `Domain ${normalizedDomain} is already used by ${clash.name}`,
      };
    }

    const updated = await WebsiteModel.findByIdAndUpdate(
      id,
      {
        name: trimmedName,
        domain: normalizedDomain,
        extraDomains: normalizeExtraDomains(extraDomains),
      },
      { new: true }
    );
    if (!updated) {
      return { success: false, message: "Website not found" };
    }
    return { success: true, message: `Website ${updated.name} updated` };
  } catch (error) {
    console.error("Error updating website:", error);
    return { success: false, message: error.message };
  }
}

export async function regenerateWebsiteApiKey({ id }) {
  try {
    await requireRole(ADMIN_ONLY);
    await connect();
    const website = await WebsiteModel.findById(id);
    if (!website) {
      return { success: false, message: "Website not found" };
    }
    website.apiKey = crypto.randomUUID();
    await website.save();
    return {
      success: true,
      message: `New API key generated for ${website.name} — the old key stops working immediately`,
    };
  } catch (error) {
    console.error("Error regenerating website API key:", error);
    return { success: false, message: error.message };
  }
}

export async function setWebsiteStatus({ id, isActive }) {
  try {
    await requireRole(ADMIN_ONLY);
    await connect();
    const website = await WebsiteModel.findById(id);
    if (!website) {
      return { success: false, message: "Website not found" };
    }
    website.isActive = Boolean(isActive);
    await website.save();
    return {
      success: true,
      message: isActive
        ? `${website.name} activated`
        : `${website.name} deactivated — its API key is rejected until reactivated`,
    };
  } catch (error) {
    console.error("Error updating website status:", error);
    return { success: false, message: error.message };
  }
}

// One-time backfill: assign every pre-multisite blog post to the given website
// and drop the legacy global slug unique index so per-site slugs can coexist.
export async function migrateLegacyPostsToWebsite({ websiteId }) {
  try {
    await requireRole(ADMIN_ONLY);

    if (!isValidObjectId(websiteId)) {
      return { success: false, message: "Invalid website id" };
    }
    await connect();
    const website = await WebsiteModel.findById(websiteId);
    if (!website) {
      return { success: false, message: "Website not found" };
    }

    const result = await BlogPostModel.updateMany(
      { $or: [{ websiteId: { $exists: false } }, { websiteId: null }] },
      { $set: { websiteId } }
    );

    try {
      await BlogPostModel.collection.dropIndex("slug_1");
    } catch {
      // Index already dropped (or never built) — nothing to do.
    }

    return {
      success: true,
      message: `Assigned ${result.modifiedCount} legacy post(s) to ${website.name}`,
    };
  } catch (error) {
    console.error("Error migrating legacy posts:", error);
    return { success: false, message: error.message };
  }
}
