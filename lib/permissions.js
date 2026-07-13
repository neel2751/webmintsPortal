// Single source of truth for roles and access control.
// Used by middleware (route guards), the navbar (menu), and server actions.

export const ROLES = {
  ADMIN: "admin",
  TEAM: "team",
  CLIENT: "client",
};

export const ADMIN_ONLY = [ROLES.ADMIN];
export const TEAM_ROLES = [ROLES.ADMIN, ROLES.TEAM];
export const CLIENT_ROLES = [ROLES.ADMIN, ROLES.CLIENT];

// Old accounts were stored with role "user" — treat them as clients.
export function normalizeRole(role) {
  if (role === "user") return ROLES.CLIENT;
  return role;
}

// Which roles can enter which URL area.
export const ROUTE_ACCESS = [
  { prefix: "/admin", roles: ADMIN_ONLY },
  { prefix: "/team", roles: TEAM_ROLES },
  { prefix: "/portal", roles: CLIENT_ROLES },
];

// Where each role lands after login / when blocked from a page.
export const ROLE_HOME = {
  [ROLES.ADMIN]: "/admin/adminPanel/users",
  [ROLES.TEAM]: "/team/blog",
  [ROLES.CLIENT]: "/portal/dashboard",
};

// Old URLs (pre-restructure) → new locations.
export const LEGACY_REDIRECTS = [
  ["/admin/dashboard", "/portal/dashboard"],
  ["/admin/projects", "/portal/projects"],
  ["/admin/maintenance", "/portal/maintenance"],
  ["/admin/request", "/portal/requests"],
  ["/admin/blog", "/team/blog"],
  ["/admin/subscriber", "/team/subscriber"],
];

export function canAccessPath(role, pathname) {
  const normalized = normalizeRole(role);
  const rule = ROUTE_ACCESS.find(
    (r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/")
  );
  if (!rule) return true; // not a guarded area
  return rule.roles.includes(normalized);
}

export function homeForRole(role) {
  return ROLE_HOME[normalizeRole(role)] || "/auth/login";
}

export const NAV_ITEMS = [
  { title: "Dashboard", href: "/portal/dashboard", roles: CLIENT_ROLES },
  { title: "Projects", href: "/portal/projects", roles: CLIENT_ROLES },
  { title: "Maintenance", href: "/portal/maintenance", roles: CLIENT_ROLES },
  { title: "Requests", href: "/portal/requests", roles: CLIENT_ROLES },
  { title: "Blog", href: "/team/blog", roles: TEAM_ROLES },
  { title: "Subscribers", href: "/team/subscriber", roles: TEAM_ROLES },
  { title: "Admin", href: "/admin/adminPanel/users", roles: ADMIN_ONLY },
  { title: "Settings", href: "/admin/settings", roles: ADMIN_ONLY },
];

export function navItemsForRole(role) {
  const normalized = normalizeRole(role);
  return NAV_ITEMS.filter((item) => item.roles.includes(normalized));
}
