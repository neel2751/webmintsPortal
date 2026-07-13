"use client";
import { useState } from "react";
import { format } from "date-fns";
import {
  Code2,
  Copy,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Pencil,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetchQuery } from "@/hooks/useFetch";
import { useSubmitMutation } from "@/hooks/useSubmit";
import {
  createWebsite,
  getAllWebsites,
  migrateLegacyPostsToWebsite,
  regenerateWebsiteApiKey,
  setWebsiteStatus,
  updateWebsite,
} from "@/server/websiteServer/websiteServer";

const EMPTY_FORM = { name: "", domain: "", extraDomains: "" };

function maskKey(key) {
  if (!key) return "—";
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}

// Ready-to-copy integration code for one website, with the portal URL
// filled in. The API key is referenced via an env var on purpose — it
// must never ship to the visitor's browser.
function integrationSnippet(site, portalOrigin) {
  return [
    `// ${site.name} (${site.domain}) — how to fetch blog posts from this portal`,
    `// Put the API key in your website's server env (copy it from the table):`,
    `//   .env  ->  BLOG_API_KEY=<this website's API key>`,
    ``,
    `// 1) All posts — SERVER-SIDE ONLY (the key must stay secret).`,
    `//    e.g. Next.js server component / getServerSideProps / API route:`,
    `const res = await fetch("${portalOrigin}/api/blog", {`,
    `  headers: { "x-api-key": process.env.BLOG_API_KEY },`,
    `  next: { revalidate: 300 }, // optional: cache for 5 minutes`,
    `});`,
    `const { blogs } = await res.json();`,
    ``,
    `// Filter by category: ${portalOrigin}/api/blog?category=Technology`,
    ``,
    `// 2) Categories used by ${site.domain} (server-side, same key):`,
    `const catRes = await fetch("${portalOrigin}/api/categories", {`,
    `  headers: { "x-api-key": process.env.BLOG_API_KEY },`,
    `});`,
    `const { categories } = await catRes.json();`,
    ``,
    `// 3) Single post — from the VISITOR'S BROWSER, no key needed.`,
    `//    Your domain (${site.domain}) identifies the website:`,
    `const postRes = await fetch("${portalOrigin}/api/blog/" + slug, {`,
    `  credentials: "include", // keeps the headline A/B-test cookie`,
    `});`,
    `const { data: post } = await postRes.json();`,
    ``,
    `// 4) Related posts (browser, no key):`,
    `const relRes = await fetch(`,
    `  "${portalOrigin}/api/blog/relatedPosts?slug=" + slug +`,
    `    "&category=" + post.category`,
    `);`,
    `const { posts: related } = await relRes.json();`,
  ].join("\n");
}

export default function WebsiteManagement() {
  const queryKey = ["getAllWebsites"];
  const { data } = useFetchQuery({ queryKey, fetchFn: getAllWebsites });
  const websites = data?.newData || [];

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [visibleKeyId, setVisibleKeyId] = useState(null);
  const [editSite, setEditSite] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [connectSite, setConnectSite] = useState(null);

  const { mutate: handleCreate, isPending: isCreating } = useSubmitMutation({
    mutationFn: async (payload) =>
      await createWebsite({
        ...payload,
        extraDomains: payload.extraDomains
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
      }),
    invalidateKey: queryKey,
    onSuccessMessage: (message) => message || "Website created",
    onClose: () => {
      setOpen(false);
      setForm(EMPTY_FORM);
    },
  });

  const { mutate: handleUpdate, isPending: isUpdating } = useSubmitMutation({
    mutationFn: async (payload) =>
      await updateWebsite({
        ...payload,
        extraDomains: payload.extraDomains
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
      }),
    invalidateKey: queryKey,
    onSuccessMessage: (message) => message || "Website updated",
    onClose: () => {
      setEditSite(null);
      setEditForm(EMPTY_FORM);
    },
  });

  const { mutate: handleRegenerate } = useSubmitMutation({
    mutationFn: async (payload) => await regenerateWebsiteApiKey(payload),
    invalidateKey: queryKey,
    onSuccessMessage: (message) => message || "API key regenerated",
    onClose: () => {},
  });

  const { mutate: handleStatusChange } = useSubmitMutation({
    mutationFn: async (payload) => await setWebsiteStatus(payload),
    invalidateKey: queryKey,
    onSuccessMessage: (message) => message || "Status updated",
    onClose: () => {},
  });

  const { mutate: handleMigrate } = useSubmitMutation({
    mutationFn: async (payload) => await migrateLegacyPostsToWebsite(payload),
    invalidateKey: queryKey,
    onSuccessMessage: (message) => message || "Legacy posts assigned",
    onClose: () => {},
  });

  const copyKey = async (apiKey) => {
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success("API key copied to clipboard");
    } catch {
      toast.error("Could not copy — select the key manually");
    }
  };

  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Website Management</CardTitle>
              <CardDescription>
                Each website gets its own API key. The blog API only returns a
                site&apos;s posts when its key and domain match.
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Globe className="h-4 w-4 mr-2" />
                  Add Website
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle>Add a new website</DialogTitle>
                  <DialogDescription>
                    An API key is generated automatically — copy it from the
                    table and configure it on the website&apos;s server.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-site-name">Name</Label>
                    <Input
                      id="new-site-name"
                      placeholder="Webmints India"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-site-domain">Domain</Label>
                    <Input
                      id="new-site-domain"
                      placeholder="webmints.in"
                      value={form.domain}
                      onChange={(e) =>
                        setForm({ ...form, domain: e.target.value })
                      }
                    />
                    <p className="text-xs text-neutral-500">
                      Just the domain — no https:// or www.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-site-extra">
                      Extra domains (optional)
                    </Label>
                    <Input
                      id="new-site-extra"
                      placeholder="staging.webmints.in, localhost"
                      value={form.extraDomains}
                      onChange={(e) =>
                        setForm({ ...form, extraDomains: e.target.value })
                      }
                    />
                    <p className="text-xs text-neutral-500">
                      Comma-separated. Add localhost here for local testing.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={isCreating}
                    onClick={() => handleCreate(form)}
                  >
                    {isCreating ? "Creating..." : "Create Website"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-neutral-500">Name</TableHead>
                <TableHead className="text-neutral-500">Domain</TableHead>
                <TableHead className="text-neutral-500">API Key</TableHead>
                <TableHead className="text-neutral-500">Status</TableHead>
                <TableHead className="text-neutral-500">Created</TableHead>
                <TableHead className="text-neutral-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {websites.map((site) => {
                const isActive = site.isActive !== false;
                const keyVisible = visibleKeyId === site._id;
                return (
                  <TableRow key={site._id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>
                      {site.domain}
                      {site.extraDomains?.length > 0 && (
                        <span className="block text-xs text-neutral-400">
                          + {site.extraDomains.join(", ")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-mono text-xs">
                        <span>
                          {keyVisible ? site.apiKey : maskKey(site.apiKey)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            setVisibleKeyId(keyVisible ? null : site._id)
                          }
                        >
                          {keyVisible ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyKey(site.apiKey)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {isActive ? "Active" : "Deactivated"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-500">
                      {site.createdAt ? format(site.createdAt, "PPP") : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditForm({
                              name: site.name || "",
                              domain: site.domain || "",
                              extraDomains: (site.extraDomains || []).join(
                                ", "
                              ),
                            });
                            setEditSite(site);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConnectSite(site)}
                        >
                          <Code2 className="h-3.5 w-3.5 mr-1" />
                          How to Connect
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Generate a new API key for ${site.name}?\n\nThe current key stops working immediately — the live website will get 403 errors until it is updated with the new key.`
                              )
                            ) {
                              handleRegenerate({ id: site._id });
                            }
                          }}
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-1" />
                          New Key
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            isActive
                              ? "text-red-600 hover:text-red-700"
                              : "text-green-600 hover:text-green-700"
                          }
                          onClick={() => {
                            if (
                              isActive &&
                              !window.confirm(
                                `Deactivate ${site.name}?\n\nIts API key is rejected until reactivated — the live website loses access to the blog API immediately.`
                              )
                            ) {
                              return;
                            }
                            handleStatusChange({
                              id: site._id,
                              isActive: !isActive,
                            });
                          }}
                        >
                          {isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Assign all legacy blog posts (created before multi-website support) to ${site.name}?\n\nRun this once, on the website the old posts belong to.`
                              )
                            ) {
                              handleMigrate({ websiteId: site._id });
                            }
                          }}
                        >
                          <KeyRound className="h-3.5 w-3.5 mr-1" />
                          Assign Legacy Posts
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {websites.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-neutral-500 py-8"
                  >
                    No websites yet — add your first website to generate its
                    API key.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit website */}
      <Dialog
        open={!!editSite}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditSite(null);
            setEditForm(EMPTY_FORM);
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Edit {editSite?.name}</DialogTitle>
            <DialogDescription>
              Add staging or extra domains here — requests from those hosts
              are treated as this website. The API key is not changed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-site-name">Name</Label>
              <Input
                id="edit-site-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-site-domain">Domain</Label>
              <Input
                id="edit-site-domain"
                value={editForm.domain}
                onChange={(e) =>
                  setEditForm({ ...editForm, domain: e.target.value })
                }
              />
              <p className="text-xs text-neutral-500">
                Just the domain — no https:// or www.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-site-extra">
                Extra domains (staging, localhost)
              </Label>
              <Input
                id="edit-site-extra"
                placeholder="staging.webmints.in, localhost"
                value={editForm.extraDomains}
                onChange={(e) =>
                  setEditForm({ ...editForm, extraDomains: e.target.value })
                }
              />
              <p className="text-xs text-neutral-500">
                Comma-separated. Each host can use the same API key.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSite(null)}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isUpdating}
              onClick={() => handleUpdate({ id: editSite?._id, ...editForm })}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* How to connect / fetch example */}
      <Dialog
        open={!!connectSite}
        onOpenChange={(isOpen) => !isOpen && setConnectSite(null)}
      >
        <DialogContent className="sm:max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Connect {connectSite?.name} to the blog API</DialogTitle>
            <DialogDescription>
              Copy this into the website&apos;s codebase. List/categories calls
              need the API key server-side; single-post and related-post calls
              run in the visitor&apos;s browser without a key.
            </DialogDescription>
          </DialogHeader>
          {connectSite && (
            <>
              <pre className="bg-neutral-950 text-neutral-100 text-xs rounded-lg p-4 overflow-x-auto max-h-96 whitespace-pre">
                {integrationSnippet(
                  connectSite,
                  typeof window !== "undefined"
                    ? window.location.origin
                    : "https://your-portal-domain.com"
                )}
              </pre>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConnectSite(null)}>
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyKey(connectSite.apiKey)}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy API Key
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        integrationSnippet(connectSite, window.location.origin)
                      );
                      toast.success("Example code copied");
                    } catch {
                      toast.error("Could not copy the code");
                    }
                  }}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy Code
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
