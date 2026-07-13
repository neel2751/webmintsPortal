"use server";

import { connect } from "@/db/db";
import ProjectModel from "@/models/projectModel";
import RequestModel from "@/models/requestModel";
import MaintenanceModel from "@/models/maintenanceModel";
import UserModel from "@/models/userModel";
import { requireRole } from "@/lib/require-role";
import { ADMIN_ONLY, CLIENT_ROLES, ROLES } from "@/lib/permissions";
import {
  PROJECT_STATUSES,
  REQUEST_STATUSES,
  REQUEST_PRIORITIES,
  MAINTENANCE_STATUSES,
} from "@/lib/portal-constants";
import { trimWhitespace } from "@/helper/trim";

// Admin sees everything; a client only ever sees their own records.
// The filter comes from the session, never from client-supplied input.
function ownerFilter(session) {
  return session.user.role === ROLES.ADMIN
    ? {}
    : { client: session.user.id };
}

function serialize(docs) {
  return JSON.parse(JSON.stringify(docs));
}

/* ------------------------- reads (admin + client) ------------------------ */

export async function getMyProjects() {
  try {
    const session = await requireRole(CLIENT_ROLES);
    await connect();
    const projects = await ProjectModel.find({
      ...ownerFilter(session),
      isArchived: { $ne: true },
    })
      .populate("client", "name email")
      .sort({ createdAt: -1 })
      .lean();
    return { success: true, data: JSON.stringify(projects) };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, message: error.message };
  }
}

export async function getMyRequests() {
  try {
    const session = await requireRole(CLIENT_ROLES);
    await connect();
    const requests = await RequestModel.find(ownerFilter(session))
      .populate("project", "name")
      .populate("client", "name email")
      .sort({ createdAt: -1 })
      .lean();
    return { success: true, data: JSON.stringify(requests) };
  } catch (error) {
    console.error("Error fetching requests:", error);
    return { success: false, message: error.message };
  }
}

export async function getMyMaintenance() {
  try {
    const session = await requireRole(CLIENT_ROLES);
    await connect();
    const tasks = await MaintenanceModel.find(ownerFilter(session))
      .populate("project", "name")
      .populate("client", "name email")
      .sort({ date: -1 })
      .lean();
    return { success: true, data: JSON.stringify(tasks) };
  } catch (error) {
    console.error("Error fetching maintenance tasks:", error);
    return { success: false, message: error.message };
  }
}

/* --------------------- request creation (admin + client) ----------------- */

export async function createRequest({ projectId, title, priority, description }) {
  try {
    const session = await requireRole(CLIENT_ROLES);

    const cleanTitle = trimWhitespace(title || "");
    if (!cleanTitle) {
      return { success: false, message: "Title is required" };
    }
    if (!REQUEST_PRIORITIES.includes(priority)) {
      return { success: false, message: "Invalid priority" };
    }

    await connect();
    // The project must exist — and belong to the caller unless they're admin.
    const project = await ProjectModel.findOne({
      _id: projectId,
      ...ownerFilter(session),
    });
    if (!project) {
      return { success: false, message: "Project not found" };
    }

    await RequestModel.create({
      title: cleanTitle,
      description: trimWhitespace(description || ""),
      project: project._id,
      client: project.client,
      priority,
    });
    return { success: true, message: "Request submitted" };
  } catch (error) {
    console.error("Error creating request:", error);
    return { success: false, message: error.message };
  }
}

/* ----------------------------- admin only -------------------------------- */

export async function getClientUsers() {
  try {
    await requireRole(ADMIN_ONLY);
    await connect();
    const clients = await UserModel.find({
      role: ROLES.CLIENT,
      isActive: { $ne: false },
    })
      .select("name email")
      .sort({ name: 1 })
      .lean();
    return { success: true, data: JSON.stringify(clients) };
  } catch (error) {
    console.error("Error fetching client users:", error);
    return { success: false, message: error.message };
  }
}

export async function createProject(params) {
  try {
    await requireRole(ADMIN_ONLY);

    const name = trimWhitespace(params?.name || "");
    if (!name) {
      return { success: false, message: "Project name is required" };
    }
    if (!params?.clientId) {
      return { success: false, message: "A client must be selected" };
    }

    await connect();
    const client = await UserModel.findOne({
      _id: params.clientId,
      role: ROLES.CLIENT,
    });
    if (!client) {
      return { success: false, message: "Selected client not found" };
    }

    await ProjectModel.create({
      name,
      description: trimWhitespace(params.description || ""),
      client: client._id,
      status: PROJECT_STATUSES.includes(params.status)
        ? params.status
        : "Planning",
      progress: Math.min(100, Math.max(0, Number(params.progress) || 0)),
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
      maintenanceEndDate: params.maintenanceEndDate || undefined,
    });
    return { success: true, message: `Project "${name}" created` };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, message: error.message };
  }
}

export async function updateProject({ id, ...fields }) {
  try {
    await requireRole(ADMIN_ONLY);
    await connect();

    const update = {};
    if (fields.name !== undefined) {
      const name = trimWhitespace(fields.name);
      if (!name) return { success: false, message: "Name cannot be empty" };
      update.name = name;
    }
    if (fields.status !== undefined) {
      if (!PROJECT_STATUSES.includes(fields.status)) {
        return { success: false, message: "Invalid status" };
      }
      update.status = fields.status;
    }
    if (fields.progress !== undefined) {
      update.progress = Math.min(100, Math.max(0, Number(fields.progress) || 0));
    }
    if (fields.startDate !== undefined) update.startDate = fields.startDate || null;
    if (fields.endDate !== undefined) update.endDate = fields.endDate || null;
    if (fields.maintenanceEndDate !== undefined)
      update.maintenanceEndDate = fields.maintenanceEndDate || null;
    if (fields.isArchived !== undefined)
      update.isArchived = Boolean(fields.isArchived);

    const project = await ProjectModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return { success: false, message: "Project not found" };
    }
    return { success: true, message: "Project updated" };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, message: error.message };
  }
}

export async function updateRequestStatus({ id, status }) {
  try {
    await requireRole(ADMIN_ONLY);
    if (!REQUEST_STATUSES.includes(status)) {
      return { success: false, message: "Invalid status" };
    }
    await connect();
    const request = await RequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!request) {
      return { success: false, message: "Request not found" };
    }
    return { success: true, message: `Request marked ${status}` };
  } catch (error) {
    console.error("Error updating request status:", error);
    return { success: false, message: error.message };
  }
}

export async function createMaintenanceTask({ projectId, title, date, status }) {
  try {
    await requireRole(ADMIN_ONLY);

    const cleanTitle = trimWhitespace(title || "");
    if (!cleanTitle) {
      return { success: false, message: "Title is required" };
    }
    if (!date) {
      return { success: false, message: "Date is required" };
    }

    await connect();
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return { success: false, message: "Project not found" };
    }

    await MaintenanceModel.create({
      title: cleanTitle,
      project: project._id,
      client: project.client,
      date,
      status: MAINTENANCE_STATUSES.includes(status) ? status : "Scheduled",
    });
    return { success: true, message: "Maintenance task created" };
  } catch (error) {
    console.error("Error creating maintenance task:", error);
    return { success: false, message: error.message };
  }
}

export async function updateMaintenanceStatus({ id, status }) {
  try {
    await requireRole(ADMIN_ONLY);
    if (!MAINTENANCE_STATUSES.includes(status)) {
      return { success: false, message: "Invalid status" };
    }
    await connect();
    const task = await MaintenanceModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!task) {
      return { success: false, message: "Task not found" };
    }
    return { success: true, message: `Task marked ${status}` };
  } catch (error) {
    console.error("Error updating maintenance status:", error);
    return { success: false, message: error.message };
  }
}
