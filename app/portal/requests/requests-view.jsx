"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchQuery } from "@/hooks/useFetch";
import { useSubmitMutation } from "@/hooks/useSubmit";
import {
  createRequest,
  getMyProjects,
  getMyRequests,
} from "@/server/portalServer/portalServer";
import {
  REQUEST_PRIORITIES,
  STATUS_BADGE,
  PRIORITY_BADGE,
} from "@/lib/portal-constants";

const EMPTY_FORM = { projectId: "", title: "", priority: "Medium", description: "" };

export default function RequestsView() {
  const requestsKey = ["getMyRequests"];
  const { data: requestsData } = useFetchQuery({
    queryKey: requestsKey,
    fetchFn: getMyRequests,
  });
  const { data: projectsData } = useFetchQuery({
    queryKey: ["getMyProjects"],
    fetchFn: getMyProjects,
  });
  const requests = requestsData?.newData || [];
  const projects = projectsData?.newData || [];

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const { mutate: submitRequest, isPending } = useSubmitMutation({
    mutationFn: async (payload) => await createRequest(payload),
    invalidateKey: requestsKey,
    onSuccessMessage: (message) => message || "Request submitted",
    onClose: () => {
      setOpen(false);
      setForm(EMPTY_FORM);
    },
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-grotesk">
            Requests
          </h1>
          <p className="text-gray-500">Submit and track your service requests</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>New service request</DialogTitle>
              <DialogDescription>
                Tell us what you need and we will get back to you.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Project</Label>
                <Select
                  value={form.projectId}
                  onValueChange={(projectId) => setForm({ ...form, projectId })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="request-title">Title</Label>
                <Input
                  id="request-title"
                  placeholder="What do you need?"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(priority) => setForm({ ...form, priority })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUEST_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="request-description">Details (optional)</Label>
                <Textarea
                  id="request-description"
                  placeholder="Any extra details that help us understand the request"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={isPending || !form.projectId || !form.title}
                onClick={() => submitRequest(form)}
              >
                {isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
          <CardDescription>All your requests, newest first</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No requests yet. Use "New Request" to submit one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-neutral-500">Request</TableHead>
                  <TableHead className="text-neutral-500">Project</TableHead>
                  <TableHead className="text-neutral-500">Priority</TableHead>
                  <TableHead className="text-neutral-500">Status</TableHead>
                  <TableHead className="text-neutral-500">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      <p className="font-medium">{request.title}</p>
                      {request.description && (
                        <p className="text-gray-500 text-xs mt-1">
                          {request.description}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {request.project?.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={PRIORITY_BADGE[request.priority] || ""}
                      >
                        {request.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_BADGE[request.status] || ""}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {format(new Date(request.createdAt), "PP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
