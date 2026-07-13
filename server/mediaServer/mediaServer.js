"use server";

import { connect } from "@/db/db";
import MediaModel from "@/models/mediaModel";
import { requireRole } from "@/lib/require-role";
import { TEAM_ROLES } from "@/lib/permissions";

export async function addMedia(data) {
  try {
    await requireRole(TEAM_ROLES);
    await connect();
    const newMedia = new MediaModel(data);
    await newMedia.save();
    const mediaId = newMedia._id.toString();
    return { success: true, mediaId };
  } catch (error) {
    console.error("Error adding media:", error);
    return { success: false, error: error.message };
  }
}
export async function archiveMedia(mediaId) {
  await requireRole(TEAM_ROLES);
  if (!mediaId) return;

  await MediaModel.findByIdAndUpdate(mediaId, {
    status: "archived",
    archivedAt: new Date(),
  });
}
