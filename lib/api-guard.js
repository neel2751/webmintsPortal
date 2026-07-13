import { headers } from "next/headers";
import { connect } from "@/db/db";
import WebsiteModel from "@/models/websiteModel";
import { normalizeHost } from "@/lib/website-utils";

// Origins allowed to call the legacy shared-key routes from a browser
// (subscribe, submit-form, job, ai). The blog/categories routes use
// resolveWebsite() below instead — their origins live in the Website
// collection, not here.
const ALLOWED_ORIGINS = [
  process.env.MAIN_SITE_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "https://localhost:3001",
  "https://www.webmints.in",
  "https://webmints.co.uk",
].filter(Boolean);

// Shared guard for the public /api/* routes (called by the main website).
// Returns null when the request is allowed, otherwise a 403 Response
// ready to be returned from the route handler.
//
// - requireKey: caller must send x-api-key matching API_SECRET.
//   Use for server-to-server routes; skip for routes hit directly from
//   the visitor's browser, where a key would be public anyway.
// - requireOrigin: an Origin header must be present AND allowed
//   (browser form posts). When false, the Origin is only checked if
//   the caller sent one (server-to-server requests don't send Origin).
export async function apiGuard({
  requireKey = true,
  requireOrigin = false,
} = {}) {
  const headerList = await headers();
  const origin = headerList.get("origin");

  if (requireOrigin && !origin) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }
  if (requireKey) {
    const apiKey = headerList.get("x-api-key");
    if (!process.env.API_SECRET || apiKey !== process.env.API_SECRET) {
      return Response.json({ error: "Invalid API key" }, { status: 403 });
    }
  }
  return null;
}

function deny(message) {
  return {
    website: null,
    denied: Response.json({ error: message }, { status: 403 }),
  };
}

function matchesWebsite(website, host) {
  return (
    website.domain === host || (website.extraDomains || []).includes(host)
  );
}

async function findWebsiteByHost(host) {
  if (!host) return null;
  return WebsiteModel.findOne({
    isActive: true,
    $or: [{ domain: host }, { extraDomains: host }],
  }).lean();
}

// Multi-tenant guard for the blog/categories routes. Resolves which Website
// the request belongs to and returns { website, denied } — exactly one of
// the two is set. All blog reads must then be scoped to website._id.
//
// - requireKey: true for server-to-server routes — the x-api-key must match
//   a Website's key, and when an Origin header is present its host must
//   match that Website's domain/extraDomains ("both website and API key").
// - requireKey: false for routes hit directly from the visitor's browser —
//   the Website is resolved from Origin/Referer, or the ?site=<domain>
//   query param (pass it as siteParam) when neither header is present.
export async function resolveWebsite({
  requireKey = true,
  siteParam = null,
} = {}) {
  const headerList = await headers();
  const origin = headerList.get("origin");
  const referer = headerList.get("referer");
  const originHost = normalizeHost(origin || referer);

  await connect();

  if (requireKey) {
    const apiKey = headerList.get("x-api-key");
    if (!apiKey) {
      return deny("Invalid API key");
    }

    const website = await WebsiteModel.findOne({
      apiKey,
      isActive: true,
    }).lean();
    if (website) {
      if (originHost && !matchesWebsite(website, originHost)) {
        return deny("Origin does not match API key");
      }
      return { website, denied: null };
    }

    // Transition fallback: the old shared API_SECRET still works but the
    // website must be resolvable from the origin (or ?site=). Remove once
    // every consuming site holds its own key.
    if (process.env.API_SECRET && apiKey === process.env.API_SECRET) {
      console.warn(
        "api-guard: request used the legacy shared API_SECRET — issue this site its own key"
      );
      const legacySite = await findWebsiteByHost(
        originHost || normalizeHost(siteParam)
      );
      if (legacySite) {
        return { website: legacySite, denied: null };
      }
    }
    return deny("Invalid API key");
  }

  const host = originHost || normalizeHost(siteParam);
  if (!host) {
    return deny("Unknown website");
  }
  const website = await findWebsiteByHost(host);
  if (!website) {
    return deny("Unknown website");
  }
  return { website, denied: null };
}

// Per-origin CORS echo for the blog routes. next.config.mjs can only set
// static headers, so Access-Control-Allow-Origin is added here — and only
// for origins that belong to a registered, active Website.
async function corsHeaders() {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (!origin) return {};

  await connect();
  const website = await findWebsiteByHost(normalizeHost(origin));
  if (!website) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

export async function withCors(response) {
  const cors = await corsHeaders();
  for (const [key, value] of Object.entries(cors)) {
    response.headers.set(key, value);
  }
  return response;
}

// Shared preflight handler — re-export as OPTIONS from the blog routes.
// Allow-Methods/Allow-Headers come from next.config.mjs.
export async function handleOptions() {
  const cors = await corsHeaders();
  return new Response(null, { status: 204, headers: cors });
}
