// Shared status/priority lists for projects, requests and maintenance.
// Pure constants — safe to import from both models and client components.

export const PROJECT_STATUSES = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
];

export const REQUEST_STATUSES = ["Pending", "In Progress", "Completed"];
export const REQUEST_PRIORITIES = ["Low", "Medium", "High"];

export const MAINTENANCE_STATUSES = ["Scheduled", "In Progress", "Completed"];

export const STATUS_BADGE = {
  Completed: "bg-green-100 text-green-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Planning: "bg-purple-100 text-purple-800",
  "On Hold": "bg-amber-100 text-amber-800",
  Pending: "bg-gray-100 text-gray-800",
  Scheduled: "bg-amber-100 text-amber-800",
};

export const PRIORITY_BADGE = {
  High: "border-red-500 text-red-500",
  Medium: "border-amber-500 text-amber-500",
  Low: "border-green-500 text-green-500",
};
