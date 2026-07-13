// Pure helpers shared by the API guard, server actions, and client UI.

// Normalize any origin/URL/domain input down to a bare host:
// "https://www.webmints.in/blog" -> "webmints.in", "localhost:3000" -> "localhost".
export function normalizeHost(input) {
  if (!input) return null;
  try {
    const host = input.includes("://")
      ? new URL(input).hostname
      : input.split("/")[0].split(":")[0];
    return host.trim().toLowerCase().replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}
